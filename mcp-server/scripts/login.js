import { createAdminSession } from "../auth.js";
import { disconnectDB } from "../db.js";
import { promptPassword, promptText } from "./prompt.js";

try {
  const identifier =
    process.env.MCP_ADMIN_IDENTIFIER ||
    (await promptText("Admin email, username, or phone: "));
  const password =
    process.env.MCP_ADMIN_PASSWORD || (await promptPassword("Password: "));
  const session = await createAdminSession({ identifier, password });
  process.stdout.write(
    `Admin MCP session created for ${session.actor.name} (${session.actor.role}).\n` +
      `Expires: ${session.expiresAt.toISOString()}\n`,
  );
} catch (error) {
  console.error(`Admin MCP login failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}

