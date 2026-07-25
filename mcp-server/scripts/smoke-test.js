import path from "path";
import { fileURLToPath } from "url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const directory = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(directory, "../index.js");
const client = new Client({
  name: "kraviona-mcp-smoke-test",
  version: "1.0.0",
});
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
  if (names.length < 60) fail(`Expected at least 60 tools, received ${names.length}`);
  for (const required of [
    "get_server_status",
    "get_business_overview",
    "get_pending_work",
    "search_business_data",
    "get_posts",
    "update_lead_status",
  ]) {
    if (!names.includes(required)) fail(`Missing required tool: ${required}`);
  }

  const createUser = listed.tools.find((tool) => tool.name === "create_user");
  const createUserFields = createUser?.inputSchema?.properties || {};
  if (!createUserFields.password) fail("create_user must accept a password");
  for (const forbidden of [
    "passwordResetToken",
    "loginAttempts",
    "lockUntil",
    "verification",
  ]) {
    if (createUserFields[forbidden]) {
      fail(`create_user exposes internal security field: ${forbidden}`);
    }
  }

  const deleteUser = listed.tools.find((tool) => tool.name === "delete_user");
  if (deleteUser?.inputSchema?.properties?.confirm?.const !== true) {
    fail("delete_user does not require confirm=true");
  }

  const status = await client.callTool({
    name: "get_server_status",
    arguments: {},
  });
  const statusPayload = JSON.parse(status.content[0].text);
  if (!statusPayload.success || !statusPayload.database?.connected) {
    fail(`Database health check failed: ${status.content[0].text}`);
  }

  const overview = await client.callTool({
    name: "get_business_overview",
    arguments: {},
  });
  const overviewPayload = JSON.parse(overview.content[0].text);
  if (!overviewPayload.success || !overviewPayload.overview?.totals) {
    fail(`Business overview failed: ${overview.content[0].text}`);
  }

  for (const name of [
    "get_users",
    "get_categories",
    "get_comments",
    "get_posts",
    "get_post_reactions",
    "get_leads",
    "get_media",
    "get_messages",
    "get_newsletter_subscriptions",
    "get_team_members",
  ]) {
    const result = await client.callTool({
      name,
      arguments: { limit: 1 },
    });
    if (result.isError) fail(`${name} failed: ${result.content[0].text}`);
    const text = result.content[0].text;
    const payload = JSON.parse(text);
    const resultCollection = Object.values(payload).find(Array.isArray);
    const first = resultCollection?.[0];
    if (first?._id !== undefined && typeof first._id !== "string") {
      fail(`${name} returned a non-string MongoDB ObjectId`);
    }
    if (
      first?.createdAt !== undefined &&
      (typeof first.createdAt !== "string" ||
        Number.isNaN(Date.parse(first.createdAt)))
    ) {
      fail(`${name} returned an invalid createdAt timestamp`);
    }
    for (const secret of [
      '"password"',
      "passwordResetToken",
      "emailOtp",
      "phoneOtp",
      "ipHash",
      "userAgent",
    ]) {
      if (text.includes(secret)) {
        fail(`${name} exposed forbidden field: ${secret}`);
      }
    }
  }

  const pendingWork = await client.callTool({
    name: "get_pending_work",
    arguments: { limit: 1 },
  });
  if (pendingWork.isError) {
    fail(`Pending-work query failed: ${pendingWork.content[0].text}`);
  }

  const search = await client.callTool({
    name: "search_business_data",
    arguments: { query: "__mcp_smoke_test_unlikely__", limit: 1 },
  });
  if (search.isError) fail(`Cross-resource search failed: ${search.content[0].text}`);

  const invalidRead = await client.callTool({
    name: "get_user",
    arguments: { id: "not-an-object-id" },
  });
  if (!invalidRead.isError) fail("Invalid ObjectId did not return an MCP error");

  const blockedDelete = await client.callTool({
    name: "delete_user",
    arguments: {
      id: "000000000000000000000000",
      confirm: true,
    },
  });
  if (!blockedDelete.isError) {
    fail("Deletion was not blocked while MCP_ALLOW_DELETES is disabled");
  }

  process.stdout.write(
    `Smoke test passed: ${names.length} tools, 10 resources readable, shared database connected, secrets redacted, safety guards active\n`,
  );
} finally {
  await client.close();
}
