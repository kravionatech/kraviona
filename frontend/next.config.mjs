import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(process.env.NODE_ENV !== "production" ? ["'unsafe-eval'"] : []),
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://www.chatbase.co",
  "https://news.google.com",
  "https:",
].join(" ");

const connectSources = [
  "'self'",
  "https:",
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:3000"]
    : []),
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://calendly.com https://wa.me",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://news.google.com",
  `script-src ${scriptSources}`,
  `connect-src ${connectSources}`,
  "frame-src 'self' https:",
].join("; ");

const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL("./", import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
    unoptimized: true,
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "api.kraviona.com", pathname: "/**" },
      { protocol: "https", hostname: "kraviona.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico|blog/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=1800, stale-while-revalidate=3600",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/blog/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/category/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), interest-cohort=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/_next/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/:path(robots.txt|sitemap.xml|rss.xml|llms.txt|ai.txt)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, follow, noarchive" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/blog/bGF0ZXN0LW",
        destination: "/blog/latest-ai-news-august-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-news-august-2026",
        destination: "/blog/latest-ai-news-august-2026",
        permanent: true,
      },
      // Duplicate near-identical slug pair under /next-gen-web-development/
      // The "guide-for-developer" (singular) is the weaker URL; consolidate into "guide-for-developers"
      {
        source: "/next-gen-web-development/complete-guide-for-developer",
        destination: "/next-gen-web-development/complete-guide-for-developers",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/a-complete-guide-for-developer",
        destination: "/next-gen-web-development/a-complete-guide-for-developers",
        permanent: true,
      },
      {
        source: "/services/react-js-development",
        destination: "/services/react-development",
        permanent: true,
      },
      {
        source: "/services/node-js-development",
        destination: "/services/nodejs-development",
        permanent: true,
      },
      {
        source: "/case-studies",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/service/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
      // NOTE: /services/web-development is now a real category hub page.
      // The old redirect to /services/web-app-development has been removed.
      // If you need to add it back, remove the hub page first.
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;