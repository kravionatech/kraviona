import { resourceNames } from "../catalog.js";
import { describeResource } from "../repository.js";
import { ALL_TOOLS } from "../server.js";

const fail = (message) => {
  throw new Error(message);
};

const names = ALL_TOOLS.map((tool) => tool.name);
const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
if (duplicates.length) {
  fail(`Duplicate tool names: ${[...new Set(duplicates)].join(", ")}`);
}

for (const tool of ALL_TOOLS) {
  if (tool.inputSchema?.type !== "object") {
    fail(`${tool.name} must declare an object input schema`);
  }
  if (!tool.annotations) fail(`${tool.name} is missing safety annotations`);
  for (const required of tool.inputSchema.required || []) {
    if (!tool.inputSchema.properties?.[required]) {
      fail(`${tool.name} requires missing property: ${required}`);
    }
  }
  if (
    tool.annotations.destructiveHint &&
    tool.inputSchema.properties?.confirmation?.const !== "PERMANENTLY_DELETE"
  ) {
    fail(`${tool.name} lacks the permanent-deletion confirmation phrase`);
  }
}

for (const expected of [
  "users",
  "posts",
  "categories",
  "comments",
  "post_reactions",
  "leads",
  "messages",
  "newsletter_subscriptions",
  "blog_push_subscriptions",
  "media",
  "team_members",
  "services",
  "projects",
  "login_history",
  "activity_logs",
]) {
  if (!resourceNames.includes(expected)) fail(`Missing admin resource: ${expected}`);
}

const userSchema = describeResource("users");
if (!userSchema.createSchema.properties.password) {
  fail("User creation schema must accept password");
}
if (!userSchema.createSchema.required?.includes("password")) {
  fail("User creation schema must require password");
}
for (const secret of ["verification", "passwordResetToken", "loginAttempts"] ) {
  if (userSchema.createSchema.properties[secret]) {
    fail(`User creation schema exposes server security field: ${secret}`);
  }
}

const postSchema = describeResource("posts");
if (postSchema.updateSchema.properties.slug) {
  fail("Post update schema must keep slug immutable");
}
if (postSchema.createSchema.properties.userID) {
  fail("Post schema exposes server-managed userID");
}

process.stdout.write(
  `Validated ${ALL_TOOLS.length} admin-only tools across ${resourceNames.length} backend resources.\n`,
);
