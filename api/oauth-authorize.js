import {
  createAuthorizationCode,
  getOAuthClient,
  publicBaseUrl,
  verifyOAuthPassword,
} from "../mcp-server/oauth.js";

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const page = ({ params, clientName, error }) => {
  const hiddenFields = [
    "response_type",
    "client_id",
    "redirect_uri",
    "state",
    "code_challenge",
    "code_challenge_method",
    "resource",
    "scope",
  ]
    .map(
      (name) =>
        `<input type="hidden" name="${name}" value="${escapeHtml(params[name])}">`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Authorize Kraviona</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f4f7f6; color: #17211d; font-family: Inter, ui-sans-serif, system-ui, sans-serif; }
    main { width: min(100%, 420px); background: #fff; border: 1px solid #d8e0dc; border-radius: 8px; padding: 28px; box-shadow: 0 12px 34px rgba(18, 42, 31, 0.09); }
    .brand { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .mark { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 6px; background: #176b4d; color: #fff; font-weight: 750; }
    h1 { margin: 0; font-size: 21px; letter-spacing: 0; }
    p { margin: 8px 0 20px; color: #53625b; line-height: 1.5; font-size: 14px; }
    label { display: block; margin-bottom: 7px; font-size: 13px; font-weight: 650; }
    input[type=password] { width: 100%; height: 44px; border: 1px solid #afbbb5; border-radius: 6px; padding: 0 12px; font: inherit; }
    input[type=password]:focus { outline: 2px solid #4f9f7f; outline-offset: 1px; border-color: #176b4d; }
    button { width: 100%; height: 44px; margin-top: 16px; border: 0; border-radius: 6px; background: #176b4d; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
    button:hover { background: #105a40; }
    .error { margin: 0 0 14px; padding: 10px 12px; border-left: 3px solid #b42318; background: #fff2f0; color: #8f1d14; font-size: 13px; }
    .scope { margin-top: 18px; padding-top: 16px; border-top: 1px solid #e4e9e6; font-size: 12px; color: #69766f; }
  </style>
</head>
<body>
  <main>
    <div class="brand"><div class="mark">K</div><div><h1>Authorize Kraviona</h1></div></div>
    <p><strong>${escapeHtml(clientName)}</strong> is requesting access to Kraviona business tools.</p>
    ${error ? `<div class="error">${escapeHtml(error)}</div>` : ""}
    <form method="post" action="/oauth/authorize">
      ${hiddenFields}
      <label for="password">Kraviona connector password</label>
      <input id="password" name="password" type="password" required autofocus autocomplete="current-password">
      <button type="submit">Authorize Claude</button>
    </form>
    <div class="scope">Access includes content, CRM, messages, subscribers, media, users, and team workflows.</div>
  </main>
</body>
</html>`;
};

const validateRequest = async (params, request) => {
  const client = await getOAuthClient(params.client_id);
  if (!client) throw new Error("Unknown OAuth client");
  if (params.response_type !== "code") throw new Error("Unsupported response type");
  if (params.code_challenge_method !== "S256" || !params.code_challenge) {
    throw new Error("PKCE with S256 is required");
  }
  if (!client.redirectUris.includes(params.redirect_uri)) {
    throw new Error("Invalid redirect URI");
  }

  const expectedResource = `${publicBaseUrl(request)}/mcp`;
  if (params.resource && params.resource !== expectedResource) {
    throw new Error("Invalid resource");
  }

  return { client, resource: expectedResource };
};

const sendPage = (response, options, status = 200) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  );
  response.end(page(options));
};

export default async function handler(request, response) {
  const params = request.method === "POST" ? request.body || {} : request.query;

  try {
    const { client, resource } = await validateRequest(params, request);

    if (request.method === "GET") {
      return sendPage(response, {
        params,
        clientName: client.clientName,
      });
    }

    if (request.method !== "POST") {
      response.statusCode = 405;
      response.setHeader("Allow", "GET, POST");
      return response.end();
    }

    if (!verifyOAuthPassword(params.password)) {
      return sendPage(
        response,
        {
          params,
          clientName: client.clientName,
          error: "Incorrect connector password.",
        },
        401,
      );
    }

    const code = await createAuthorizationCode({
      clientId: params.client_id,
      redirectUri: params.redirect_uri,
      codeChallenge: params.code_challenge,
      resource,
    });
    const redirect = new URL(params.redirect_uri);
    redirect.searchParams.set("code", code);
    if (params.state) redirect.searchParams.set("state", params.state);
    redirect.searchParams.set("iss", publicBaseUrl(request));

    response.statusCode = 302;
    response.setHeader("Location", redirect.toString());
    response.setHeader("Cache-Control", "no-store");
    response.end();
  } catch (error) {
    response.statusCode = 400;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.setHeader("Cache-Control", "no-store");
    response.end(`OAuth request rejected: ${error.message}`);
  }
}
