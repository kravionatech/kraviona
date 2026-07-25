import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { errorResult, errorResultFrom } from "./lib/results.js";
import * as users from "./tools/users.js";
import * as categories from "./tools/categories.js";
import * as comments from "./tools/comments.js";
import * as posts from "./tools/posts.js";
import * as postReactions from "./tools/post-reactions.js";
import * as leads from "./tools/leads.js";
import * as media from "./tools/media.js";
import * as messages from "./tools/messages.js";
import * as newsletterSubscriptions from "./tools/newsletter-subscriptions.js";
import * as teamMembers from "./tools/team-members.js";
import * as operations from "./tools/operations.js";

const groups = [
  users,
  categories,
  comments,
  posts,
  postReactions,
  leads,
  media,
  messages,
  newsletterSubscriptions,
  teamMembers,
  operations,
];

export const ALL_TOOLS = groups.flatMap((group) => group.tools);

const handlers = new Map(
  groups.flatMap((group) => group.tools.map((tool) => [tool.name, group.handle])),
);

export const createMcpServer = () => {
  const server = new Server(
    { name: "kraviona-business-mcp", version: "2.0.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: ALL_TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const { name, arguments: args } = request.params;
      const handler = handlers.get(name);

      if (!handler) return errorResult(`Unknown tool: ${name}`);

      return await handler(name, args);
    } catch (error) {
      return errorResultFrom(error);
    }
  });

  return server;
};
