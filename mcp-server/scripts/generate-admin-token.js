import { connectDB, disconnectDB } from "../db.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { issueSessionToken } from "../auth.js";

async function main() {
  await connectDB();
  const admin = await Auth.findOne({ role: "super_admin", email: "kravionatech@gmail.com" });
  if (!admin) {
    console.error("Superadmin not found");
    process.exit(1);
  }
  const session = await issueSessionToken(admin);
  console.log("TOKEN:" + session.token);
  console.log("EXPIRES:" + session.expiresAt.toISOString());
  await disconnectDB();
}

main().catch(console.error);
