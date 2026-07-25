import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { disconnectDB } from "./db.js";
import { ALL_TOOLS, createMcpServer } from "./server.js";

export { ALL_TOOLS } from "./server.js";

const server = createMcpServer();

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
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[MCP] Kraviona Business MCP running on stdio (${ALL_TOOLS.length} tools)`,
  );
} catch (error) {
  console.error(`[MCP] Fatal startup error: ${error.message}`);
  process.exit(1);
}
