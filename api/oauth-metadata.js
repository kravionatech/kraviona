import { oauthMetadata } from "../mcp-server/oauth.js";

export default function handler(request, response) {
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "public, max-age=300");
  response.end(JSON.stringify(oauthMetadata(request)));
}
