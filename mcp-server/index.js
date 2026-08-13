import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { authenticateAdminSession } from "./auth.js";
import { config } from "./config.js";
import { disconnectDB } from "./db.js";
import { ALL_TOOLS, createMcpServer } from "./server.js";

export { ALL_TOOLS } from "./server.js";

const shutdown = async () => {
  try {
    await disconnectDB();
  } finally {
    process.exit(0);
  }
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

try {
  const session = await authenticateAdminSession();
  const server = createMcpServer(session);
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[MCP] ${config.name} ${config.version} running as ${session.actor.role} (${ALL_TOOLS.length} tools)`,
  );
} catch (error) {
  console.error(`[MCP] Fatal startup error: ${error.message}`);
  process.exit(1);
}
