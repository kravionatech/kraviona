import { NextResponse } from "next/server";

const CANONICAL_HOST = "kraviona.com";
const WWW_HOST = "www.kraviona.com";

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
  if (host === WWW_HOST) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";

    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Canonicalization must also cover metadata files and static assets. Otherwise
  // crawlers can still fetch www versions of sitemap.xml, robots.txt, or images.
  matcher: "/:path*",
};
