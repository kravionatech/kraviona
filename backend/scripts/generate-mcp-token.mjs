// Script to issue a superadmin MCP session token
import dns from "node:dns";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { issueSessionToken } = await import("../../mcp-server/auth.js");
const { Auth } = await import("../src/models/auth/auth.models.js");
const { connectDB, disconnectDB } = await import("../../mcp-server/db.js");

try {
  await connectDB();
  const admin = await Auth.findOne({ role: "super_admin" }).select(
    "password name email username role isActive isVerified"
  );
  if (!admin) {
    throw new Error("No super_admin account found in database");
  }

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
              "https://api.kraviona.com/mcp",
              "--header",
              `Authorization: Bearer ${session.token}`,
            ],
          },
        },
      },
      null,
      2
    )
  );
  console.log("\nClaude Code command:");
  console.log(
    `claude mcp add kraviona https://api.kraviona.com/mcp --header "Authorization: Bearer ${session.token}"`
  );
  console.log("=======================================================\n");
  process.exit(0);
} catch (error) {
  console.error("Token generation failed:", error);
  process.exit(1);
} finally {
  await disconnectDB();
}
