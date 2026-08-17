process.env.MCP_PUBLIC_URL = "http://127.0.0.1:3333";
process.env.MCP_TRANSPORT = "streamable-http";

const { createHttpApp } = await import("../http.js");

const fail = (message) => {
  throw new Error(message);
};

const app = createHttpApp();
const server = await new Promise((resolve, reject) => {
  const listener = app.listen(0, "127.0.0.1", () => resolve(listener));
  listener.once("error", reject);
});

try {
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;
  const [healthResponse, resourceResponse, metadataResponse, unauthorized] =
    await Promise.all([
      fetch(`${origin}/`),
      fetch(`${origin}/.well-known/oauth-protected-resource/mcp`),
      fetch(`${origin}/.well-known/oauth-authorization-server`),
      fetch(`${origin}/mcp`),
    ]);

  const health = await healthResponse.json();
  const resource = await resourceResponse.json();
  const metadata = await metadataResponse.json();

  if (health.authentication !== "oauth-2.1") fail("OAuth health mode missing");
  if (resource.resource !== "http://127.0.0.1:3333/mcp") {
    fail("Protected resource metadata has the wrong MCP audience");
  }
  if (!resource.authorization_servers?.includes("http://127.0.0.1:3333/")) {
    fail("Protected resource metadata has no authorization server");
  }
  if (!metadata.registration_endpoint || !metadata.revocation_endpoint) {
    fail("OAuth discovery must expose registration and revocation endpoints");
  }
  if (!metadata.code_challenge_methods_supported?.includes("S256")) {
    fail("OAuth discovery must require PKCE S256");
  }
  if (unauthorized.status !== 401) fail("Unauthenticated MCP request was not blocked");
  if (!unauthorized.headers.get("www-authenticate")?.includes("resource_metadata=")) {
    fail("MCP 401 challenge does not advertise protected resource metadata");
  }

  process.stdout.write(
    "Validated Vercel HTTP health, OAuth discovery, PKCE metadata, and MCP bearer challenge.\n",
  );
} finally {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}
