import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  authenticateAdminSession,
  createAdminSession,
} from "./auth.js";
import { config } from "./config.js";
import { disconnectDB } from "./db.js";
import { startHttpServer } from "./http.js";
import { ALL_TOOLS, createMcpServer } from "./server.js";

export { ALL_TOOLS } from "./server.js";

let httpServer;

const authenticateServiceAdmin = async () => {
  try {
    return await authenticateAdminSession();
  } catch (error) {
    const identifier = (process.env.MCP_ADMIN_IDENTIFIER || "").trim();
    const password = process.env.MCP_ADMIN_PASSWORD || "";
    if (!identifier || !password) throw error;

    await createAdminSession({ identifier, password });
    return authenticateAdminSession();
  }
};

const shutdown = async () => {
  try {
    if (httpServer) {
      await new Promise((resolve) => httpServer.close(resolve));
    }
    await disconnectDB();
  } finally {
    process.exit(0);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

try {
  if (config.transport === "streamable-http" || config.transport === "http") {
    let session = null;
    if (config.apiKey) {
      try {
        session = await authenticateServiceAdmin();
      } catch (error) {
        if (!config.oauth.enabled) throw error;
        console.error(`[MCP] Static API key disabled: ${error.message}`);
      }
    }
    httpServer = await startHttpServer(session);
  } else if (config.transport === "stdio") {
    const session = await authenticateServiceAdmin();
    const server = createMcpServer(session);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(
      `[MCP] ${config.name} ${config.version} running on stdio as ${session.actor.role} (${ALL_TOOLS.length} tools)`,
    );
  } else {
    throw new Error(
      `Unsupported MCP_TRANSPORT: ${config.transport}. Use stdio or streamable-http.`,
    );
  }
} catch (error) {
  console.error(`[MCP] Fatal startup error: ${error.message}`);
  process.exit(1);
}
