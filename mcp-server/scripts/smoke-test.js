import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(directory, "../index.js");
const client = new Client({ name: "kraviona-admin-smoke", version: "1.0.0" });
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [serverPath],
  stderr: "inherit",
});

const fail = (message) => {
  throw new Error(message);
};

try {
  await client.connect(transport);
  const listed = await client.listTools();
  const names = listed.tools.map((tool) => tool.name);
  for (const required of [
    "get_admin_session",
    "describe_admin_resource",
    "get_admin_dashboard",
    "list_posts",
    "create_post",
    "list_services",
    "list_projects",
    "list_activity_logs",
  ]) {
    if (!names.includes(required)) fail(`Missing MCP tool: ${required}`);
  }

  const session = await client.callTool({
    name: "get_admin_session",
    arguments: {},
  });
  if (session.isError) fail(session.content?.[0]?.text || "Session check failed");
  const sessionData = session.structuredContent;
  if (sessionData?.admin?.role !== "super_admin") {
    fail("Smoke test is not authenticated as super_admin");
  }

  const schema = await client.callTool({
    name: "describe_admin_resource",
    arguments: { resource: "posts" },
  });
  if (schema.isError || schema.structuredContent?.updateSchema?.properties?.slug) {
    fail("Post schema guard failed");
  }

  const posts = await client.callTool({
    name: "list_posts",
    arguments: { limit: 1 },
  });
  if (posts.isError || !Array.isArray(posts.structuredContent?.records)) {
    fail("Post read test failed");
  }

  const blockedDelete = await client.callTool({
    name: "delete_post",
    arguments: {
      id: "000000000000000000000000",
      confirmation: "PERMANENTLY_DELETE",
    },
  });
  if (!blockedDelete.isError) fail("Permanent deletion policy was not enforced");

  process.stdout.write(
    `Smoke test passed: authenticated super admin, ${names.length} tools, live database read, schema and deletion guards verified.\n`,
  );
} finally {
  await client.close();
}
