import { timingSafeEqual } from "node:crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  protectedResourceMetadata,
  publicBaseUrl,
  validateOAuthAccessToken,
} from "../mcp-server/oauth.js";
import { createMcpServer } from "../mcp-server/server.js";

const jsonRpcError = (response, status, message) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: status === 401 ? -32001 : -32603,
        message,
      },
      id: null,
    }),
  );
};

const readBearerToken = (request) => {
  const authorization = request.headers.authorization || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
};

const hasValidApiKey = (token) => {
  const expected = process.env.MCP_API_KEY;
  if (!expected) return false;

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(token);

  return (
    expectedBuffer.length === suppliedBuffer.length &&
    timingSafeEqual(expectedBuffer, suppliedBuffer)
  );
};

const authorizeRequest = async (request) => {
  const token = readBearerToken(request);
  if (hasValidApiKey(token)) {
    return {
      token,
      clientId: "static-api-key",
      scopes: ["mcp:tools"],
    };
  }

  const resource = `${publicBaseUrl(request)}/mcp`;
  const oauthToken = await validateOAuthAccessToken(token, resource);
  if (!oauthToken) return null;

  return {
    token,
    clientId: oauthToken.clientId,
    scopes: String(oauthToken.scope || "").split(" ").filter(Boolean),
    expiresAt: Math.floor(oauthToken.expiresAt.getTime() / 1000),
  };
};

export default async function handler(request, response) {
  if (!process.env.MCP_API_KEY && !process.env.MCP_OAUTH_PASSWORD) {
    return jsonRpcError(
      response,
      500,
      "MCP authentication is not configured on this deployment",
    );
  }

  const auth = await authorizeRequest(request);
  if (!auth) {
    const metadataUrl = `${publicBaseUrl(request)}/.well-known/oauth-protected-resource`;
    response.setHeader(
      "WWW-Authenticate",
      `Bearer resource_metadata="${metadataUrl}", scope="mcp:tools"`,
    );
    return jsonRpcError(response, 401, "Unauthorized");
  }

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return jsonRpcError(response, 405, "Method not allowed");
  }

  request.auth = auth;
  const server = createMcpServer();
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
    console.error("[MCP] HTTP request failed:", error);
    if (!response.headersSent) {
      jsonRpcError(response, 500, "Internal server error");
    }
  } finally {
    if (response.writableEnded) await cleanup();
  }
}
