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

for (const tool of groups.flatMap((group) => group.tools)) {
  const required = new Set(tool.inputSchema.required || []);
  const fields = Object.keys(tool.inputSchema.properties || {}).map(
    (field) => `${field}${required.has(field) ? "*" : ""}`,
  );
  const mode = tool.annotations?.readOnlyHint
    ? "read"
    : tool.annotations?.destructiveHint
      ? "delete"
      : "write";
  process.stdout.write(
    `[${mode}] ${tool.name}: ${fields.join(", ") || "(none)"}\n`,
  );
}
