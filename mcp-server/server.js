import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { config } from "./config.js";
import { revalidateActor } from "./auth.js";
import { errorResult, errorResultFrom } from "./lib/results.js";
import { handle, tools } from "./tools/admin.js";

export const ALL_TOOLS = tools;

const SERVER_INSTRUCTIONS =
  "This is the private Kraviona super-admin server. Every call is bound to a verified active admin and every mutation is audited. Call describe_admin_resource before creating or making a complex update. Never change a published post slug. Prefer status/archive updates over deletion. Permanent deletion requires both MCP_ALLOW_DELETES=true and confirmation=PERMANENTLY_DELETE. Server-managed identity, timestamps, secrets, and security fields are never client-writable or returned.";

export const createMcpServer = (session) => {
  const server = new Server(
    { name: config.name, version: config.version },
    {
      capabilities: { tools: {} },
      instructions: SERVER_INSTRUCTIONS,
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: ALL_TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args } = request.params;
      if (!ALL_TOOLS.some((tool) => tool.name === name)) {
        return errorResult(`Unknown admin MCP tool: ${name}`);
      }
      session.actor = await revalidateActor(session.actor);
      return await handle(name, args || {}, session);
    } catch (error) {
      return errorResultFrom(error);
    }
  });

  return server;
};
