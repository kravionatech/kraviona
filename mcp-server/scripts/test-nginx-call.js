import { connectDB } from "../db.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { issueSessionToken } from "../auth.js";

async function main() {
  await connectDB();
  const admin = await Auth.findOne({ role: "super_admin", email: "kravionatech@gmail.com" });
  if (!admin) throw new Error("Admin not found");

  const { token } = await issueSessionToken(admin);

  // Test call to local nginx proxying to MCP using node:http to preserve Host header
  import("node:http").then(({ request }) => {
    const postData = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "kraviona_health_check",
        arguments: {},
      },
    });

    const req = request(
      {
        hostname: "127.0.0.1",
        port: 80,
        path: "/mcp",
        method: "POST",
        headers: {
          Host: "mcp.kraviona.com",
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
          Authorization: "Bearer " + token,
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        console.log("Status code:", res.statusCode);
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          console.log("Response body:", data);
          process.exit(0);
        });
      },
    );

    req.on("error", (e) => {
      console.error("Request error:", e);
      process.exit(1);
    });

    req.write(postData);
    req.end();
  });
}

main().catch(console.error);
