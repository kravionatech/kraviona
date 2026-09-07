import { NextResponse } from "next/server";

// In-memory cache for dynamic redirects with TTL
let cachedRedirects = null;
let lastFetchedAt = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

async function getActiveRedirects() {
  const now = Date.now();
  if (cachedRedirects && now - lastFetchedAt < CACHE_TTL_MS) {
    return cachedRedirects;
  }

  try {
    const res = await fetch(`${API_BASE}/public/redirects`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.data)) {
        // Build a lookup map by lowercased source path
        const map = new Map();
        for (const item of data.data) {
          if (item?.source && item?.destination && item.source !== item.destination) {
            const cleanSource = item.source.trim().toLowerCase();
            map.set(cleanSource, {
              destination: item.destination.trim(),
              type: item.type === "302" ? 302 : 301,
            });
          }
        }
        cachedRedirects = map;
        lastFetchedAt = now;
        return cachedRedirects;
      }
    }
  } catch (error) {
    // If backend is unreachable or warming up, proceed without breaking requests
    console.error("[MIDDLEWARE_REDIRECT_FETCH_ERROR]", error?.message);
  }

  return cachedRedirects || new Map();
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore root or empty
  if (!pathname || pathname === "/") {
    return NextResponse.next();
  }

  const cleanPath = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const redirectsMap = await getActiveRedirects();

  if (redirectsMap.has(cleanPath)) {
    const rule = redirectsMap.get(cleanPath);

    // Prevent redirecting to the exact same path (infinite loop safety)
    if (rule.destination.toLowerCase() === cleanPath) {
      return NextResponse.next();
    }

    // Determine target URL (can be absolute or relative)
    const targetUrl = rule.destination.startsWith("http://") || rule.destination.startsWith("https://")
      ? rule.destination
      : new URL(rule.destination, request.url).toString();

    return NextResponse.redirect(targetUrl, rule.type);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, etc.
     * - public files with extensions (e.g. .svg, .png, .jpg, .webp, .ico, .txt, .json)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|json)$).*)",
  ],
};
