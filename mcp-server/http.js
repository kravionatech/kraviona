import express from "express";
import { timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthRouter,
} from "@modelcontextprotocol/sdk/server/auth/router.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { LoginHistory } from "../backend/src/models/auth/login-history.model.js";
import {
  authenticateAdminCredentials,
  authenticateSessionToken,
  issueSessionToken,
} from "./auth.js";
import { config } from "./config.js";
import { pingDB } from "./db.js";
import {
  createOAuthLoginRouter,
  oauthProvider,
  oauthScopes,
} from "./oauth.js";
import { createMcpServer } from "./server.js";

const jsonRpcError = (response, status, message) => {
  response.status(status).json({
    jsonrpc: "2.0",
    error: {
      code: status === 401 ? -32001 : -32603,
      message,
    },
    id: null,
  });
};

const readBearerToken = (request) => {
  const authorization = request.headers.authorization || "";
  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
};

const validApiKey = (supplied) => {
  if (!config.apiKey || !supplied) return false;
  const expectedBuffer = Buffer.from(config.apiKey);
  const suppliedBuffer = Buffer.from(supplied);
  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
};

const oauthBearerMiddleware = () =>
  requireBearerAuth({
    verifier: oauthProvider,
    requiredScopes: [...oauthScopes],
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(
      new URL(config.oauth.resourceUrl),
    ),
  });

const requireMcpAuthorization = (serviceSession) => {
  const verifyOAuth = config.oauth.enabled ? oauthBearerMiddleware() : null;

  return async (request, response, next) => {
    const token = readBearerToken(request);

    if (token) {
      // 1. Direct Superadmin Session Token (from /api/mcp/login or npm run login)
      try {
        const session = await authenticateSessionToken(token);
        if (session?.actor) {
          request.auth = {
            token,
            clientId: "superadmin-session",
            scopes: ["mcp:tools"],
          };
          request.mcpSession = {
            actor: { ...session.actor },
            sessionId: session.sessionId,
            expiresAt: session.expiresAt,
          };
          return next();
        }
      } catch {
        // Fall through to other auth methods
      }

      // 2. Static API Key with serviceSession
      if (serviceSession?.actor && validApiKey(token)) {
        request.auth = {
          token,
          clientId: "static-api-key",
          scopes: ["mcp:tools"],
        };
        request.mcpSession = {
          ...serviceSession,
          actor: { ...serviceSession.actor },
        };
        return next();
      }
    }

    // 3. OAuth 2.1 Token
    if (verifyOAuth && token) {
      return verifyOAuth(request, response, () => {
        const actor = request.auth?.extra?.actor;
        if (!actor) return jsonRpcError(response, 401, "Unauthorized");
        request.mcpSession = {
          actor: { ...actor },
          expiresAt: request.auth.expiresAt
            ? new Date(request.auth.expiresAt * 1000)
            : undefined,
        };
        next();
      });
    }

    response.setHeader("WWW-Authenticate", 'Bearer realm="Kraviona MCP"');
    return jsonRpcError(response, 401, "Unauthorized: Valid Superadmin MCP Token or OAuth Bearer required");
  };
};

export const createHttpApp = (serviceSession = null) => {
  if (!config.oauth.enabled && !(config.apiKey && serviceSession?.actor)) {
    // Also allowed if running in multi-client session token mode
  }

  const allowedHosts = [
    ...new Set(
      [
        config.oauth.enabled ? new URL(config.oauth.publicUrl).hostname : null,
        "mcp.kraviona.com",
        "api.kraviona.com",
        "admin.kraviona.com",
        "kraviona.com",
        "www.kraviona.com",
        process.env.VERCEL_URL,
        process.env.VERCEL_BRANCH_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL,
        "127.0.0.1",
        "localhost",
        "[::1]",
      ].filter(Boolean),
    ),
  ];
  const app = createMcpExpressApp({ host: "0.0.0.0", allowedHosts });

  if (config.oauth.enabled) {
    app.set("trust proxy", true);
    const publicUrl = new URL(config.oauth.publicUrl);
    const proxyAwareRateLimit = { validate: false };
    app.use(createOAuthLoginRouter());
    app.use(
      mcpAuthRouter({
        provider: oauthProvider,
        issuerUrl: publicUrl,
        baseUrl: publicUrl,
        resourceServerUrl: new URL(config.oauth.resourceUrl),
        scopesSupported: [...oauthScopes],
        resourceName: "Kraviona Admin MCP",
        authorizationOptions: { rateLimit: proxyAwareRateLimit },
        tokenOptions: { rateLimit: proxyAwareRateLimit },
        clientRegistrationOptions: { rateLimit: proxyAwareRateLimit },
        revocationOptions: { rateLimit: proxyAwareRateLimit },
      }),
    );
    app.get("/.well-known/oauth-protected-resource", (_request, response) => {
      response.json({
        resource: config.oauth.resourceUrl,
        authorization_servers: [new URL(config.oauth.publicUrl).href],
        scopes_supported: [...oauthScopes],
        resource_name: "Kraviona Admin MCP",
      });
    });
  }

  app.get("/health", async (_request, response) => {
    try {
      const db = await pingDB();
      response.json({
        status: "ok",
        service: config.name,
        version: config.version,
        uptime: process.uptime(),
        database: db,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      response.status(503).json({
        status: "degraded",
        service: config.name,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  app.post("/api/mcp/login", express.json(), async (request, response) => {
    try {
      const { identifier, password } = request.body || {};
      if (!identifier || !password) {
        return response.status(400).json({
          success: false,
          message: "Identifier (email/username) and password are required",
        });
      }
      const admin = await authenticateAdminCredentials({ identifier, password });
      const { token, actor, expiresAt } = await issueSessionToken(admin);

      await LoginHistory.create({
        user: admin._id,
        ipAddress: request.ip || "",
        userAgent: String(request.headers["user-agent"] || "").slice(0, 1000),
        method: "mcp-api-login",
      }).catch(() => null);

      return response.json({
        success: true,
        message: "Superadmin MCP authentication successful",
        token,
        actor,
        expiresAt,
        mcpUrl: `${config.oauth.publicUrl || "https://mcp.kraviona.com"}/mcp`,
      });
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: error.message || "Invalid administrator credentials",
      });
    }
  });

  app.get("/", (_request, response) => {
    response.json({
      status: "ok",
      service: config.name,
      version: config.version,
      transport: "streamable-http",
      endpoint: "/mcp",
      authentication: config.oauth.enabled ? "oauth-2.1" : "bearer-token",
    });
  });

  app.use("/mcp", requireMcpAuthorization(serviceSession));

  app.post("/mcp", async (request, response) => {
    const session = request.mcpSession;
    const server = createMcpServer(session);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    let cleanedUp = false;
    const cleanup = async () => {
      if (cleanedUp) return;
      cleanedUp = true;
      await transport.close();
      await server.close();
    };

    response.once("close", () => {
      void cleanup();
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(request, response, request.body);
    } catch (error) {
      console.error(`[MCP] HTTP request failed: ${error.message}`);
      if (!response.headersSent) {
        jsonRpcError(response, 500, "Internal server error");
      }
    } finally {
      if (response.writableEnded) await cleanup();
    }
  });

  app.all("/mcp", (_request, response) => {
    response.setHeader("Allow", "POST");
    jsonRpcError(response, 405, "Method not allowed");
  });

  return app;
};

export const startHttpServer = async (session) => {
  const app = createHttpApp(session);
  return new Promise((resolve, reject) => {
    const server = app.listen(config.port, "0.0.0.0", () => {
      console.error(
        `[MCP] ${config.name} ${config.version} listening on port ${config.port} with ${config.oauth.enabled ? "OAuth 2.1" : session.actor.role}`,
      );
      resolve(server);
    });
    server.once("error", reject);
  });
};
