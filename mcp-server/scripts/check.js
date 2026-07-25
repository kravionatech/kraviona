import * as users from "../tools/users.js";
import * as categories from "../tools/categories.js";
import * as comments from "../tools/comments.js";
import * as posts from "../tools/posts.js";
import * as postReactions from "../tools/post-reactions.js";
import * as leads from "../tools/leads.js";
import * as media from "../tools/media.js";
import * as messages from "../tools/messages.js";
import * as newsletterSubscriptions from "../tools/newsletter-subscriptions.js";
import * as teamMembers from "../tools/team-members.js";
import * as operations from "../tools/operations.js";

const ALL_TOOLS = [
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
].flatMap((group) => group.tools);

const names = ALL_TOOLS.map((tool) => tool.name);
const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

if (duplicates.length) {
  throw new Error(`Duplicate tool names: ${[...new Set(duplicates)].join(", ")}`);
}

for (const tool of ALL_TOOLS) {
  if (!tool.inputSchema || tool.inputSchema.type !== "object") {
    throw new Error(`${tool.name} does not have an object input schema`);
  }
  if (!tool.annotations) {
    throw new Error(`${tool.name} does not declare MCP safety annotations`);
  }
  for (const required of tool.inputSchema.required || []) {
    if (!tool.inputSchema.properties?.[required]) {
      throw new Error(
        `${tool.name} requires ${required}, but it is absent from properties`,
      );
    }
  }
  if (
    tool.annotations.destructiveHint &&
    tool.inputSchema.properties?.confirm?.const !== true
  ) {
    throw new Error(`${tool.name} is destructive but lacks confirm=true`);
  }
}

console.error(
  `[MCP] Validated ${ALL_TOOLS.length} unique, annotated tool schemas`,
);
process.exit(0);
