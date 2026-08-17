import { timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import {
  getOAuthProtectedResourceMetadataUrl,
  mcpAuthRouter,
} from "@modelcontextprotocol/sdk/server/auth/router.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "./config.js";
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

  return (request, response, next) => {
    const token = readBearerToken(request);
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

    if (verifyOAuth) {
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
    return jsonRpcError(response, 401, "Unauthorized");
  };
};

export const createHttpApp = (serviceSession = null) => {
  if (!config.oauth.enabled && !(config.apiKey && serviceSession?.actor)) {
    throw new Error(
      "HTTP MCP requires MCP_PUBLIC_URL for OAuth or MCP_API_KEY with an admin service session",
    );
  }

  const allowedHosts = config.oauth.enabled
    ? [
        ...new Set(
          [
            new URL(config.oauth.publicUrl).hostname,
            process.env.VERCEL_URL,
            process.env.VERCEL_BRANCH_URL,
            process.env.VERCEL_PROJECT_PRODUCTION_URL,
            "127.0.0.1",
            "localhost",
            "[::1]",
          ].filter(Boolean),
        ),
      ]
    : undefined;
  const app = createMcpExpressApp({ host: "0.0.0.0", allowedHosts });

  if (config.oauth.enabled) {
    const publicUrl = new URL(config.oauth.publicUrl);
    app.use(createOAuthLoginRouter());
    app.use(
      mcpAuthRouter({
        provider: oauthProvider,
        issuerUrl: publicUrl,
        baseUrl: publicUrl,
        resourceServerUrl: new URL(config.oauth.resourceUrl),
        scopesSupported: [...oauthScopes],
        resourceName: "Kraviona Admin MCP",
      }),
    );
  }

  app.get("/", (_request, response) => {
    response.json({
      status: "ok",
      service: config.name,
      version: config.version,
      transport: "streamable-http",
      endpoint: "/mcp",
      authentication: config.oauth.enabled ? "oauth-2.1" : "bearer-api-key",
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
