import { authenticateAdminCredentials, issueSessionToken } from "../auth.js";
import { config } from "../config.js";
import { disconnectDB } from "../db.js";
import { promptPassword, promptText } from "./prompt.js";

try {
  const identifier =
    process.argv[2] ||
    process.env.MCP_ADMIN_IDENTIFIER ||
    (await promptText("Admin email, username, or phone: "));
  const password =
    process.argv[3] ||
    process.env.MCP_ADMIN_PASSWORD ||
    (await promptPassword("Password: "));

  const admin = await authenticateAdminCredentials({ identifier, password });
  const session = await issueSessionToken(admin);

  console.log("\n=======================================================");
  console.log(" Kraviona Superadmin MCP Token Generated");
  console.log("=======================================================");
  console.log(`Admin User: ${session.actor.name} (${session.actor.email})`);
  console.log(`Role:       ${session.actor.role}`);
  console.log(`Expires:    ${session.expiresAt.toISOString()}`);
  console.log(`\nToken:`);
  console.log(session.token);
  console.log("\n-------------------------------------------------------");
  console.log("Claude Desktop config (claude_desktop_config.json):");
  console.log(
    JSON.stringify(
      {
        mcpServers: {
          kraviona: {
            command: "npx",
            args: [
              "-y",
              "mcp-remote-client",
              `${config.oauth.publicUrl || "https://mcp.kraviona.com"}/mcp`,
              "--header",
              `Authorization: Bearer ${session.token}`,
            ],
          },
        },
      },
      null,
      2,
    ),
  );
  console.log("\nClaude Code command:");
  console.log(
    `claude mcp add kraviona ${config.oauth.publicUrl || "https://mcp.kraviona.com"}/mcp --header "Authorization: Bearer ${session.token}"`,
  );
  console.log("=======================================================\n");
} catch (error) {
  console.error(`Login failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
