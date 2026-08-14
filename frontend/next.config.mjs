import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */

const rawDeploymentId =
  process.env.VERCEL_URL || process.env.VERCEL_GIT_COMMIT_SHA || "";
const deploymentId = rawDeploymentId
  .replace(/[^a-zA-Z0-9_-]/g, "-")
  .slice(0, 32);
const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  // Next's development tooling uses eval. Do not ship that permission in the
  // production CSP.
  ...(process.env.NODE_ENV !== "production" ? ["'unsafe-eval'"] : []),
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://www.chatbase.co",
  "https://news.google.com",
].join(" ");
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://calendly.com https://wa.me",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src ${scriptSources}`,
  "connect-src 'self' https://api.kraviona.com https://www.google-analytics.com https://www.googletagmanager.com https://www.chatbase.co",
  "frame-src 'self' https://www.google.com https://maps.google.com https://www.googletagmanager.com https://calendly.com https://www.chatbase.co https://news.google.com",
].join("; ");

const nextConfig = {
  // This app is deployed independently from the repository root, which has
  // its own lockfile. Keep production file tracing scoped to the frontend.
  outputFileTracingRoot: fileURLToPath(new URL("../", import.meta.url)),
  ...(deploymentId ? { deploymentId } : {}),
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
    // Keep the optimizer cache useful without making unversioned remote
    // images difficult to refresh after an update.
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,

    remotePatterns: [
      // NOTE: Do NOT add source.unsplash.com here — it is the deprecated
      // Unsplash Source API that returns 400 errors. Use images.unsplash.com
      // (the direct CDN) instead, or better yet, serve images locally.
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
        source: "/blog/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
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
      // API and framework responses are not landing pages. Keep crawl-control
      // headers off public HTML pages, where App Router metadata emits the
      // page-specific robots directive and canonical URL.
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
      {
        source: "/services/web-development",
        destination: "/services/web-app-development",
        permanent: true,
      },
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
