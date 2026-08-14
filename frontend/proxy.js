import { NextResponse } from "next/server";
import {
  classifyPublicRequest,
  isInfrastructurePath,
} from "@/lib/requestProtection";

// User-Agent checks are a fast first layer. Search engines and link-preview
// services stay available; known scrapers, scanners, and generic automation do
// not. Vercel Firewall rate limits remain the correct outer layer for IP-based
// abuse because serverless instances do not share reliable in-memory counters.
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

const protectedResponse = (message, status) =>
  new NextResponse(message, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });

const isSessionQueryParameter = (key) => {
  const normalizedKey = key.toLowerCase();
  return (
    SESSION_QUERY_PARAMETERS.has(normalizedKey) ||
    /^aspsessionid[a-z0-9]*$/.test(normalizedKey)
  );
};

export function proxy(request) {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Do not interfere with Next.js assets or Vercel Analytics/Speed Insights.
  if (isInfrastructurePath(pathname)) return NextResponse.next();

  const blocked = classifyPublicRequest({
    pathname,
    search: url.search,
    method: request.method,
    userAgent: request.headers.get("user-agent") || "",
  });
  if (blocked) return protectedResponse(blocked.message, blocked.status);

  const host = (
    request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  )
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  const sessionQueryKeys = Array.from(url.searchParams.keys()).filter(
    isSessionQueryParameter,
  );
  const cleanedPathname = pathname.replace(SESSION_PATH_PARAMETER, "");
  const hasPathSessionId = cleanedPathname !== pathname;
  const hasSessionId = sessionQueryKeys.length > 0 || hasPathSessionId;

  if (hasSessionId) {
    for (const key of sessionQueryKeys) url.searchParams.delete(key);
    if (hasPathSessionId) url.pathname = cleanedPathname || "/";
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
  matcher: ["/((?!_next/static|_next/image|_vercel|favicon.ico).*)"],
};
