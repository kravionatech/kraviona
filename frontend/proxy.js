import { NextResponse } from "next/server";

const CANONICAL_HOST = "kraviona.com";
const WWW_HOST = "www.kraviona.com";
const SESSION_QUERY_PARAMETERS = new Set([
  "sid",
  "session",
  "sessionid",
  "session_id",
  "session-id",
  "jsessionid",
  "phpsessid",
  "php_session_id",
  "asp.net_sessionid",
  "asp.net_session_id",
  "asp_sessionid",
]);
const SESSION_PATH_PARAMETER =
  /;(?:sid|session(?:[_-]?id)?|jsessionid|phpsessid|php_session_id|asp(?:\.net)?[_-]?session[_-]?id|aspsessionid[a-z0-9]*)=[^/;?]*/gi;

const isSessionQueryParameter = (key) => {
  const normalizedKey = key.toLowerCase();
  return (
    SESSION_QUERY_PARAMETERS.has(normalizedKey) ||
    /^aspsessionid[a-z0-9]*$/.test(normalizedKey)
  );
};

export function proxy(request) {
  const url = request.nextUrl;
  const host = (
    request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  )
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  // Vercel/Cloudflare performs the HTTP-to-HTTPS upgrade before this proxy.
  // Restrict hostname canonicalization to the production www hostname so local
  // development and Vercel preview deployments remain usable and are not sent
  // to production.
  const sessionQueryKeys = Array.from(url.searchParams.keys()).filter(
    isSessionQueryParameter,
  );
  const cleanedPathname = url.pathname.replace(SESSION_PATH_PARAMETER, "");
  const hasPathSessionId = cleanedPathname !== url.pathname;
  const hasSessionId = sessionQueryKeys.length > 0 || hasPathSessionId;

  if (hasSessionId) {
    for (const key of sessionQueryKeys) {
      url.searchParams.delete(key);
    }

    if (hasPathSessionId) {
      url.pathname = cleanedPathname || "/";
    }
  }

  if (host === WWW_HOST || hasSessionId) {
    if (host === WWW_HOST) {
      url.hostname = CANONICAL_HOST;
      url.protocol = "https:";
      url.port = "";
    }

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Canonicalization must also cover metadata files and static assets. Otherwise
  // crawlers can still fetch www versions of sitemap.xml, robots.txt, or images.
  matcher: "/:path*",
};
