export default function handler(_request, response) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.end(
    JSON.stringify({
      name: "kraviona-business-mcp",
      status: "ok",
      endpoint: "/mcp",
      authentication: "OAuth 2.1 or bearer API key required",
    }),
  );
}
