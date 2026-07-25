import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { connectDB } from "./db.js";

const OAUTH_SCOPE = "mcp:tools";
const ACCESS_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 90;
const AUTHORIZATION_CODE_TTL_SECONDS = 5 * 60;
const CLAUDE_REDIRECT_URI = "https://claude.ai/api/mcp/auth_callback";

let indexesReady;

const collections = async () => {
  const connection = await connectDB();
  const database = connection.db;

  if (!indexesReady) {
    indexesReady = Promise.all([
      database
        .collection("mcp_oauth_codes")
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      database
        .collection("mcp_oauth_tokens")
        .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      database
        .collection("mcp_oauth_tokens")
        .createIndex({ tokenHash: 1 }, { unique: true }),
      database
        .collection("mcp_oauth_clients")
        .createIndex({ clientId: 1 }, { unique: true }),
    ]).catch((error) => {
      indexesReady = undefined;
      throw error;
    });
  }

  await indexesReady;

  return {
    clients: database.collection("mcp_oauth_clients"),
    codes: database.collection("mcp_oauth_codes"),
    tokens: database.collection("mcp_oauth_tokens"),
  };
};

const randomToken = (bytes = 32) => randomBytes(bytes).toString("base64url");
const tokenHash = (token) =>
  createHash("sha256").update(token).digest("hex");

export const publicBaseUrl = (request) => {
  if (process.env.MCP_PUBLIC_URL) {
    return process.env.MCP_PUBLIC_URL.replace(/\/+$/, "");
  }

  const forwardedHost = request.headers["x-forwarded-host"];
  const host = forwardedHost || request.headers.host;
  const protocol =
    request.headers["x-forwarded-proto"] || (host?.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
};

export const oauthMetadata = (request) => {
  const baseUrl = publicBaseUrl(request);
  return {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    registration_endpoint: `${baseUrl}/oauth/register`,
    scopes_supported: [OAUTH_SCOPE],
    response_types_supported: ["code"],
    grant_types_supported: ["authorization_code", "refresh_token"],
    token_endpoint_auth_methods_supported: ["none"],
    code_challenge_methods_supported: ["S256"],
  };
};

export const protectedResourceMetadata = (request) => {
  const baseUrl = publicBaseUrl(request);
  return {
    resource: `${baseUrl}/mcp`,
    authorization_servers: [baseUrl],
    scopes_supported: [OAUTH_SCOPE],
    bearer_methods_supported: ["header"],
  };
};

export const registerOAuthClient = async (metadata) => {
  const redirectUris = Array.isArray(metadata?.redirect_uris)
    ? metadata.redirect_uris
    : [];

  if (
    redirectUris.length !== 1 ||
    redirectUris[0] !== CLAUDE_REDIRECT_URI
  ) {
    throw new Error(`redirect_uris must contain only ${CLAUDE_REDIRECT_URI}`);
  }

  const client = {
    clientId: process.env.MCP_OAUTH_CLIENT_ID || "claude-web",
    clientName: String(metadata.client_name || "Claude").slice(0, 100),
    redirectUris,
    tokenEndpointAuthMethod: "none",
    createdAt: new Date(),
  };

  const { clients } = await collections();
  await clients.updateOne(
    { clientId: client.clientId },
    {
      $set: {
        clientName: client.clientName,
        redirectUris: client.redirectUris,
        tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
      },
      $setOnInsert: { createdAt: client.createdAt },
    },
    { upsert: true },
  );

  return {
    client_id: client.clientId,
    client_id_issued_at: Math.floor(client.createdAt.getTime() / 1000),
    client_name: client.clientName,
    redirect_uris: client.redirectUris,
    grant_types: ["authorization_code", "refresh_token"],
    response_types: ["code"],
    token_endpoint_auth_method: "none",
  };
};

export const getOAuthClient = async (clientId) => {
  if (!clientId) return null;
  const { clients } = await collections();
  return clients.findOne({ clientId });
};

export const verifyOAuthPassword = (password) => {
  const expected = process.env.MCP_OAUTH_PASSWORD || "";
  const supplied = String(password || "");
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);

  return (
    expectedBuffer.length > 0 &&
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
};

export const createAuthorizationCode = async ({
  clientId,
  redirectUri,
  codeChallenge,
  resource,
}) => {
  const code = randomToken();
  const now = Date.now();
  const { codes } = await collections();

  await codes.insertOne({
    codeHash: tokenHash(code),
    clientId,
    redirectUri,
    codeChallenge,
    scope: OAUTH_SCOPE,
    resource,
    createdAt: new Date(now),
    expiresAt: new Date(now + AUTHORIZATION_CODE_TTL_SECONDS * 1000),
  });

  return code;
};

const issueTokenPair = async ({ clientId, resource, scope }) => {
  const accessToken = randomToken();
  const refreshToken = randomToken();
  const now = Date.now();
  const { tokens } = await collections();

  await tokens.insertMany([
    {
      tokenHash: tokenHash(accessToken),
      type: "access",
      clientId,
      resource,
      scope,
      createdAt: new Date(now),
      expiresAt: new Date(now + ACCESS_TOKEN_TTL_SECONDS * 1000),
    },
    {
      tokenHash: tokenHash(refreshToken),
      type: "refresh",
      clientId,
      resource,
      scope,
      createdAt: new Date(now),
      expiresAt: new Date(now + REFRESH_TOKEN_TTL_SECONDS * 1000),
    },
  ]);

  return {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    refresh_token: refreshToken,
    scope,
  };
};

export const exchangeAuthorizationCode = async ({
  code,
  clientId,
  redirectUri,
  codeVerifier,
}) => {
  const { codes } = await collections();
  const result = await codes.findOneAndDelete({
    codeHash: tokenHash(String(code || "")),
    clientId,
    redirectUri,
    expiresAt: { $gt: new Date() },
  });
  const record = result?.value || result;

  if (!record) throw new Error("Invalid or expired authorization code");

  const verifierChallenge = createHash("sha256")
    .update(String(codeVerifier || ""))
    .digest("base64url");

  if (verifierChallenge !== record.codeChallenge) {
    throw new Error("PKCE verification failed");
  }

  return issueTokenPair(record);
};

export const refreshAccessToken = async ({ refreshToken, clientId }) => {
  const { tokens } = await collections();
  const result = await tokens.findOneAndDelete({
    tokenHash: tokenHash(String(refreshToken || "")),
    type: "refresh",
    clientId,
    expiresAt: { $gt: new Date() },
  });
  const record = result?.value || result;

  if (!record) throw new Error("Invalid or expired refresh token");

  return issueTokenPair(record);
};

export const validateOAuthAccessToken = async (token, expectedResource) => {
  if (!token) return null;
  const { tokens } = await collections();
  return tokens.findOne({
    tokenHash: tokenHash(token),
    type: "access",
    resource: expectedResource,
    expiresAt: { $gt: new Date() },
  });
};
