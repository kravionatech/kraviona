import { authenticateAdminSession } from "../auth.js";
import { disconnectDB } from "../db.js";

try {
  const session = await authenticateAdminSession();
  process.stdout.write(
    `${session.actor.name} (${session.actor.role})\n` +
      `Session expires: ${new Date(session.expiresAt).toISOString()}\n`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}

