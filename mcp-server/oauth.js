import { createHash, randomBytes } from "node:crypto";
import express from "express";
import {
  InvalidClientMetadataError,
  InvalidGrantError,
  InvalidScopeError,
  InvalidTargetError,
  InvalidTokenError,
} from "@modelcontextprotocol/sdk/server/auth/errors.js";
import { LoginHistory } from "../backend/src/models/auth/login-history.model.js";
import {
  authenticateAdminCredentials,
  revalidateActor,
} from "./auth.js";
import { config } from "./config.js";
import { connectDB } from "./db.js";

const SCOPES = Object.freeze(["mcp:tools"]);
const COLLECTIONS = Object.freeze({
  clients: "kraviona_mcp_oauth_clients",
  pending: "kraviona_mcp_oauth_pending_authorizations",
  codes: "kraviona_mcp_oauth_authorization_codes",
  tokens: "kraviona_mcp_oauth_tokens",
});

let indexesReady;

const hashToken = (value) =>
  createHash("sha256").update(String(value || "")).digest("hex");

const randomToken = () => randomBytes(48).toString("base64url");

const getCollections = async () => {
  const connection = await connectDB();
  const collections = Object.fromEntries(
    Object.entries(COLLECTIONS).map(([key, name]) => [
      key,
      connection.db.collection(name),
    ]),
  );

  if (!indexesReady) {
    indexesReady = Promise.all([
      collections.clients.createIndex({ client_id: 1 }, { unique: true }),
      collections.pending.createIndex({ requestHash: 1 }, { unique: true }),
      collections.pending.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      collections.codes.createIndex({ codeHash: 1 }, { unique: true }),
      collections.codes.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      collections.tokens.createIndex({ accessHash: 1 }, { unique: true }),
      collections.tokens.createIndex({ refreshHash: 1 }, { unique: true }),
      collections.tokens.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      collections.tokens.createIndex({ adminId: 1, createdAt: -1 }),
    ]).catch((error) => {
      indexesReady = undefined;
      throw error;
    });
  }
  await indexesReady;
  return collections;
};

const documentFromResult = (result) => result?.value || result || null;

const normalizeUrl = (value) => {
  try {
    return new URL(String(value)).href.replace(/\/$/, "");
  } catch {
    return "";
  }
};

const assertOAuthConfigured = () => {
  if (!config.oauth.enabled || !config.oauth.resourceUrl) {
    throw new Error("MCP_PUBLIC_URL is required for OAuth HTTP transport");
  }
};

const assertResource = (resource) => {
  const expected = normalizeUrl(config.oauth.resourceUrl);
  if (resource && normalizeUrl(resource) !== expected) {
    throw new InvalidTargetError("The requested resource is not this MCP server");
  }
  return expected;
};

const assertScopes = (scopes = []) => {
  const requested = scopes.length ? scopes : [...SCOPES];
  if (requested.some((scope) => !SCOPES.includes(scope))) {
    throw new InvalidScopeError("Unsupported MCP OAuth scope");
  }
  return [...new Set(requested)];
};

const redirectAllowed = (uri) =>
  config.oauth.redirectUris.includes(normalizeUrl(uri));

class MongoOAuthClientsStore {
  async getClient(clientId) {
    if (config.oauth.clientId && clientId === config.oauth.clientId) {
      return {
        client_id: config.oauth.clientId,
        client_secret: config.oauth.clientSecret || undefined,
        client_id_issued_at: 0,
        client_name: "Claude for Kraviona",
        redirect_uris: [...config.oauth.redirectUris],
        grant_types: ["authorization_code", "refresh_token"],
        response_types: ["code"],
        token_endpoint_auth_method: config.oauth.clientSecret
          ? "client_secret_post"
          : "none",
        scope: SCOPES.join(" "),
      };
    }

    const { clients } = await getCollections();
    return clients.findOne({ client_id: String(clientId) });
  }

  async registerClient(metadata) {
    assertOAuthConfigured();
    if (
      !metadata.redirect_uris?.length ||
      metadata.redirect_uris.some((uri) => !redirectAllowed(uri))
    ) {
      throw new InvalidClientMetadataError(
        "Only the configured Claude OAuth callback is allowed",
      );
    }

    const client = {
      ...metadata,
      client_id: `kraviona_${randomBytes(24).toString("base64url")}`,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: String(metadata.client_name || "Claude").slice(0, 100),
      redirect_uris: metadata.redirect_uris.map(normalizeUrl),
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: SCOPES.join(" "),
      createdAt: new Date(),
    };
    delete client.client_secret;
    delete client.client_secret_expires_at;

    const { clients } = await getCollections();
    await clients.insertOne(client);
    return client;
  }
}

const issueTokens = async ({ adminId, clientId, scopes, resource }) => {
  const accessToken = randomToken();
  const refreshToken = randomToken();
  const now = new Date();
  const accessExpiresAt = new Date(
    now.getTime() + config.oauth.accessTokenTtlSeconds * 1000,
  );
  const refreshExpiresAt = new Date(
    now.getTime() + config.oauth.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  );
  const { tokens } = await getCollections();

  await tokens.insertOne({
    accessHash: hashToken(accessToken),
    refreshHash: hashToken(refreshToken),
    adminId,
    clientId,
    scopes,
    resource,
    createdAt: now,
    accessExpiresAt,
    refreshExpiresAt,
    expiresAt: refreshExpiresAt,
  });

  return {
    access_token: accessToken,
    token_type: "bearer",
    expires_in: config.oauth.accessTokenTtlSeconds,
    scope: scopes.join(" "),
    refresh_token: refreshToken,
  };
};

class KravionaOAuthProvider {
  constructor() {
    this.clientsStore = new MongoOAuthClientsStore();
  }

  async authorize(client, params, response) {
    assertOAuthConfigured();
    const scopes = assertScopes(params.scopes);
    const resource = assertResource(params.resource);
    const requestToken = randomToken();
    const now = new Date();
    const { pending } = await getCollections();

    await pending.insertOne({
      requestHash: hashToken(requestToken),
      clientId: client.client_id,
      redirectUri: normalizeUrl(params.redirectUri),
      state: params.state,
      scopes,
      codeChallenge: params.codeChallenge,
      resource,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
    });

    const loginUrl = new URL("/oauth/login", config.oauth.publicUrl);
    loginUrl.searchParams.set("request", requestToken);
    response.redirect(302, loginUrl.href);
  }

  async challengeForAuthorizationCode(client, authorizationCode) {
    const { codes } = await getCollections();
    const code = await codes.findOne({
      codeHash: hashToken(authorizationCode),
      clientId: client.client_id,
      expiresAt: { $gt: new Date() },
    });
    if (!code) throw new InvalidGrantError("Invalid authorization code");
    return code.codeChallenge;
  }

  async exchangeAuthorizationCode(
    client,
    authorizationCode,
    _codeVerifier,
    redirectUri,
    resource,
  ) {
    const { codes } = await getCollections();
    const code = documentFromResult(
      await codes.findOneAndDelete({
        codeHash: hashToken(authorizationCode),
        clientId: client.client_id,
        expiresAt: { $gt: new Date() },
      }),
    );
    if (!code) throw new InvalidGrantError("Invalid authorization code");
    if (redirectUri && normalizeUrl(redirectUri) !== code.redirectUri) {
      throw new InvalidGrantError("redirect_uri does not match authorization");
    }
    if (resource && normalizeUrl(resource) !== code.resource) {
      throw new InvalidTargetError("Token resource does not match authorization");
    }
    return issueTokens({
      adminId: code.adminId,
      clientId: code.clientId,
      scopes: code.scopes,
      resource: code.resource,
    });
  }

  async exchangeRefreshToken(client, refreshToken, scopes, resource) {
    const { tokens } = await getCollections();
    const token = documentFromResult(
      await tokens.findOneAndDelete({
        refreshHash: hashToken(refreshToken),
        clientId: client.client_id,
        refreshExpiresAt: { $gt: new Date() },
      }),
    );
    if (!token) throw new InvalidGrantError("Invalid or expired refresh token");

    const nextScopes = scopes?.length ? assertScopes(scopes) : token.scopes;
    if (nextScopes.some((scope) => !token.scopes.includes(scope))) {
      throw new InvalidScopeError("Refresh token cannot gain additional scopes");
    }
    if (resource && normalizeUrl(resource) !== token.resource) {
      throw new InvalidTargetError("Refresh token resource does not match");
    }
    await revalidateActor({ id: String(token.adminId) });
    return issueTokens({
      adminId: token.adminId,
      clientId: token.clientId,
      scopes: nextScopes,
      resource: token.resource,
    });
  }

  async verifyAccessToken(accessToken) {
    const { tokens } = await getCollections();
    const token = await tokens.findOne({
      accessHash: hashToken(accessToken),
      accessExpiresAt: { $gt: new Date() },
    });
    if (!token) throw new InvalidTokenError("Invalid or expired access token");
    assertResource(token.resource);
    const actor = await revalidateActor({ id: String(token.adminId) });
    return {
      token: accessToken,
      clientId: token.clientId,
      scopes: token.scopes,
      expiresAt: Math.floor(token.accessExpiresAt.getTime() / 1000),
      resource: new URL(token.resource),
      extra: { actor },
    };
  }

  async revokeToken(client, request) {
    const hash = hashToken(request.token);
    const { tokens } = await getCollections();
    await tokens.deleteOne({
      clientId: client.client_id,
      $or: [{ accessHash: hash }, { refreshHash: hash }],
    });
  }
}

export const oauthProvider = new KravionaOAuthProvider();
export const oauthScopes = SCOPES;

const escapeHtml = (value) =>
  String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const renderLogin = (response, requestToken, error = "") => {
  response
    .status(error ? 401 : 200)
    .set({
      "Cache-Control": "no-store, no-transform",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https://claude.ai; base-uri 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    })
    .type("html")
    .send(`<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Authorize Claude | Kraviona</title><style>
body{margin:0;background:#f5f7f9;color:#172027;font:16px system-ui,sans-serif;min-height:100vh;display:grid;place-items:center}.panel{width:min(420px,calc(100% - 32px));background:#fff;border:1px solid #dce2e7;border-radius:8px;padding:28px;box-sizing:border-box}h1{font-size:24px;margin:0 0 8px}p{color:#53616b;line-height:1.5;margin:0 0 22px}label{display:block;font-size:14px;font-weight:600;margin:14px 0 6px}input{width:100%;box-sizing:border-box;border:1px solid #b9c3ca;border-radius:6px;padding:11px 12px;font:inherit}button{width:100%;margin-top:22px;border:0;border-radius:6px;padding:12px;background:#147d64;color:#fff;font:inherit;font-weight:700;cursor:pointer}.error{color:#a82828;background:#fff1f1;border:1px solid #f0caca;border-radius:6px;padding:10px;margin-bottom:14px;font-size:14px}.scope{font-size:13px;color:#53616b;border-top:1px solid #e5e9ec;padding-top:16px;margin-top:20px}
</style></head><body><main class="panel"><h1>Kraviona Admin</h1><p>Sign in to authorize Claude to manage Kraviona using your administrator permissions.</p>
${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
<form method="post" action="/oauth/login?request=${escapeHtml(requestToken)}"><input type="hidden" name="request" value="${escapeHtml(requestToken)}">
<label for="identifier">Email, username, or phone</label><input id="identifier" name="identifier" autocomplete="username" required autofocus>
<label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required>
<button type="submit">Authorize Claude</button></form><div class="scope">Access: complete audited admin tools. Permanent deletion still requires explicit confirmation.</div></main></body></html>`);
};

export const createOAuthLoginRouter = () => {
  const router = express.Router();
  router.use(express.urlencoded({ extended: false, limit: "16kb" }));

  router.get("/oauth/login", async (request, response) => {
    const requestToken = String(request.query.request || "");
    const { pending } = await getCollections();
    const authorization = await pending.findOne({
      requestHash: hashToken(requestToken),
      expiresAt: { $gt: new Date() },
    });
    if (!authorization) {
      return response.status(400).send("Authorization request is invalid or expired");
    }
    return renderLogin(response, requestToken);
  });

  router.post("/oauth/login", async (request, response) => {
    const requestToken = String(request.body.request || request.query.request || "");
    const { pending, codes } = await getCollections();
    const authorization = await pending.findOne({
      requestHash: hashToken(requestToken),
      expiresAt: { $gt: new Date() },
    });
    if (!authorization) {
      return response.status(400).send("Authorization request is invalid or expired");
    }

    let admin;
    try {
      admin = await authenticateAdminCredentials({
        identifier: request.body.identifier,
        password: request.body.password,
      });
    } catch {
      return renderLogin(response, requestToken, "Invalid administrator credentials");
    }

    const consumed = documentFromResult(
      await pending.findOneAndDelete({
        _id: authorization._id,
        expiresAt: { $gt: new Date() },
      }),
    );
    if (!consumed) {
      return response.status(400).send("Authorization request was already used");
    }

    const code = randomToken();
    const now = new Date();
    await codes.insertOne({
      codeHash: hashToken(code),
      clientId: consumed.clientId,
      redirectUri: consumed.redirectUri,
      scopes: consumed.scopes,
      codeChallenge: consumed.codeChallenge,
      resource: consumed.resource,
      adminId: admin._id,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 5 * 60 * 1000),
    });
    await LoginHistory.create({
      user: admin._id,
      ipAddress: request.ip || "",
      userAgent: String(request.headers["user-agent"] || "").slice(0, 1000),
      method: "mcp",
    }).catch(() => null);

    const redirect = new URL(consumed.redirectUri);
    redirect.searchParams.set("code", code);
    if (consumed.state) redirect.searchParams.set("state", consumed.state);
    return response.redirect(302, redirect.href);
  });

  return router;
};
