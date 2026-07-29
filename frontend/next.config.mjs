/** @type {import('next').NextConfig} */

const rawDeploymentId =
  process.env.VERCEL_URL || process.env.VERCEL_GIT_COMMIT_SHA || "";
const deploymentId = rawDeploymentId
  .replace(/[^a-zA-Z0-9_-]/g, "-")
  .slice(0, 32);

const nextConfig = {
  ...(deploymentId ? { deploymentId } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  skipTrailingSlashRedirect: false,

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,

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
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
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
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self' https://calendly.com https://wa.me; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.chatbase.co https://news.google.com; connect-src 'self' https://api.kraviona.com https://www.google-analytics.com https://www.googletagmanager.com https://www.chatbase.co; frame-src 'self' https://www.googletagmanager.com https://calendly.com https://www.chatbase.co https://news.google.com;",
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
        source: "/blogs/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/service/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
      
    ];
  },
};

export default nextConfig;
