import {
  exchangeAuthorizationCode,
  refreshAccessToken,
} from "../mcp-server/oauth.js";

const sendError = (response, description) => {
  response.statusCode = 400;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  response.end(
    JSON.stringify({
      error: "invalid_grant",
      error_description: description,
    }),
  );
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.setHeader("Allow", "POST");
    return response.end();
  }

  const body = request.body || {};

  try {
    let tokens;
    if (body.grant_type === "authorization_code") {
      tokens = await exchangeAuthorizationCode({
        code: body.code,
        clientId: body.client_id,
        redirectUri: body.redirect_uri,
        codeVerifier: body.code_verifier,
      });
    } else if (body.grant_type === "refresh_token") {
      tokens = await refreshAccessToken({
        refreshToken: body.refresh_token,
        clientId: body.client_id,
      });
    } else {
      return sendError(response, "Unsupported grant_type");
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.setHeader("Cache-Control", "no-store");
    response.end(JSON.stringify(tokens));
  } catch (error) {
    sendError(response, error.message);
  }
}
