import { NextResponse } from "next/server";

const AUTH_ROUTE = "/auth";
const DASHBOARD_ROUTE = "/dashboard";
const AUTH_MARKER_COOKIE = "adminSession";

function hasAuthCookie(request) {
  return (
    request.cookies.has(AUTH_MARKER_COOKIE) ||
    request.cookies.has("accessToken") ||
    request.cookies.has("refreshToken")
  );
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasAuthCookie(request);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(isAuthenticated ? DASHBOARD_ROUTE : AUTH_ROUTE, request.url)
    );
  }

  if (pathname.startsWith(AUTH_ROUTE)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(DASHBOARD_ROUTE, request.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(AUTH_ROUTE, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
