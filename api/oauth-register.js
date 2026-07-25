import { registerOAuthClient } from "../mcp-server/oauth.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("Allow", "POST");
    return response.end();
  }

  try {
    const client = await registerOAuthClient(request.body);
    response.statusCode = 201;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify(client));
  } catch (error) {
    response.statusCode = 400;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        error: "invalid_client_metadata",
        error_description: error.message,
      }),
    );
  }
}
