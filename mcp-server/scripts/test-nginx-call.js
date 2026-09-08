import { connectDB } from "../db.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { issueSessionToken } from "../auth.js";

async function main() {
  await connectDB();
  const admin = await Auth.findOne({ role: "super_admin", email: "kravionatech@gmail.com" });
  if (!admin) throw new Error("Admin not found");

  const { token } = await issueSessionToken(admin);

  // Test call to local nginx proxying to MCP
  const res = await fetch("http://127.0.0.1/mcp", {
    method: "POST",
    headers: {
      Host: "api.kraviona.com",
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "kraviona_health_check",
        arguments: {},
      },
    }),
  });

  console.log("Status code:", res.status);
  const text = await res.text();
  console.log("Response body:", text);
}

main().catch(console.error);
