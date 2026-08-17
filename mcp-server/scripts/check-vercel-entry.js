import assert from "node:assert/strict";
import http from "node:http";

delete process.env.MCP_PUBLIC_URL;
delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
delete process.env.VERCEL_URL;
process.env.MCP_TRANSPORT = "streamable-http";

const { default: handler } = await import("../api/index.js");
const server = http.createServer(handler);

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

try {
  const response = await fetch(`http://127.0.0.1:${port}/`, {
    headers: {
      host: "kraviona-mcp.vercel.app",
      "x-forwarded-host": "kraviona-mcp.vercel.app",
      "x-forwarded-proto": "https",
    },
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, "ok");
  assert.equal(body.authentication, "oauth-2.1");
  assert.equal(
    process.env.MCP_PUBLIC_URL,
    "https://kraviona-mcp.vercel.app",
  );
  console.log("Validated Vercel startup without exposed system environment variables.");
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
