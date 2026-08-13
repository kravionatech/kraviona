import { revokeAdminSession } from "../auth.js";
import { disconnectDB } from "../db.js";

try {
  await revokeAdminSession();
  process.stdout.write("Admin MCP session revoked.\n");
} catch (error) {
  console.error(`Admin MCP logout failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}

