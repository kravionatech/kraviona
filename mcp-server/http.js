import { timingSafeEqual } from "node:crypto";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { config } from "./config.js";
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

const requireApiKey = (request, response, next) => {
  const token = readBearerToken(request);
  if (!validApiKey(token)) {
    response.setHeader("WWW-Authenticate", 'Bearer realm="Kraviona MCP"');
    return jsonRpcError(response, 401, "Unauthorized");
  }

  request.auth = {
    token,
    clientId: "static-api-key",
    scopes: ["mcp:tools"],
  };
  next();
};

export const createHttpApp = (serviceSession) => {
  if (!config.apiKey) {
    throw new Error(
      "MCP_API_KEY is required when MCP_TRANSPORT is streamable-http",
    );
  }

  const app = createMcpExpressApp({ host: "0.0.0.0" });

  app.get("/", (_request, response) => {
    response.json({
      status: "ok",
      service: config.name,
      version: config.version,
      transport: "streamable-http",
      endpoint: "/mcp",
    });
  });

  app.use("/mcp", requireApiKey);

  app.post("/mcp", async (request, response) => {
    const session = {
      ...serviceSession,
      actor: { ...serviceSession.actor },
    };
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
        `[MCP] ${config.name} ${config.version} listening on port ${config.port} as ${session.actor.role}`,
      );
      resolve(server);
    });
    server.once("error", reject);
  });
};
