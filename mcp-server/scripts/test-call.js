import { connectDB } from "../db.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { issueSessionToken } from "../auth.js";

async function main() {
  await connectDB();
  const admin = await Auth.findOne({ role: "super_admin", email: "kravionatech@gmail.com" });
  if (!admin) throw new Error("Admin not found");

  const { token, actor } = await issueSessionToken(admin);
  console.log("Token issued for:", actor.name, actor.email);

  // 1. Health check call
  const healthRes = await fetch("http://127.0.0.1:5001/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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

  const healthJson = await healthRes.json();
  console.log("Health Check Tool Result:", JSON.stringify(healthJson, null, 2));

  // 2. List posts call (filter by blog)
  const postsRes = await fetch("http://127.0.0.1:5001/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/call",
      params: {
        name: "kraviona_list_posts",
        arguments: { contentType: "blog", limit: 3 },
      },
    }),
  });

  const postsJson = await postsRes.json();
  console.log("List Posts Tool Result:", JSON.stringify(postsJson, null, 2));

  // 3. SEO Settings call
  const seoRes = await fetch("http://127.0.0.1:5001/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "kraviona_get_seo_settings",
        arguments: {},
      },
    }),
  });

  const seoJson = await seoRes.json();
  console.log("Get SEO Settings Tool Result:", JSON.stringify(seoJson, null, 2));

  // 4. Validate redirect tool call
  const redirectRes = await fetch("http://127.0.0.1:5001/mcp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "kraviona_validate_redirect",
        arguments: { source: "/blog/test-old", destination: "/seo/test-new" },
      },
    }),
  });

  const redirectJson = await redirectRes.json();
  console.log("Validate Redirect Tool Result:", JSON.stringify(redirectJson, null, 2));

  process.exit(0);
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
