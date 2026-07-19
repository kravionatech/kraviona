import { SITE_URL } from "./seoConfig.js";

export default function robots() {
  const publicPages = [
    "/",
    "/blog",
    "/services",
    "/about",
    "/contact",
    "/pricing",
    "/gallery",
    "/case-studies",
  ];

  const privatePaths = [
    "/admin/",
    "/dashboard/",
    "/api/",
    "/login/",
    "/register/",
    "/auth/",
    "/private/",
    "/server/",
    "/tmp/",
    "/cache/",
    "/test/",
    "/preview/",
    "/draft/",
  ];

  return {
    rules: [
      /**
       * =====================================================
       * DEFAULT SEARCH ENGINE RULES
       * =====================================================
       */
      {
        userAgent: "*",

        allow: [
          // Public Pages
          ...publicPages,

          // Next.js Static Assets
          "/_next/static",
          "/_next/image",

          // Public Assets
          "/images",
          "/assets",
          "/uploads",
          "/fonts",

          // File Types
          "/*.css$",
          "/*.js$",
          "/*.jpg$",
          "/*.jpeg$",
          "/*.png$",
          "/*.svg$",
          "/*.webp$",
          "/*.woff$",
          "/*.woff2$",
        ],

        disallow: [
          // Private Routes
          ...privatePaths,
          // API Security
          "/api/private/",
          "/api/admin/",

          // Duplicate URL Parameters
          "/*?replytocom=",
          "/*?filter=",
          "/*?sort=",
          "/*?sessionid=",
          "/*utm_",

          // Error Pages
          "/404",
          "/500",
        ],
      },

      /**
       * =====================================================
       * GOOGLEBOT
       * =====================================================
       */
      {
        userAgent: "Googlebot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * GOOGLE AI SEARCH
       * =====================================================
       */
      {
        userAgent: "Google-Extended",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * CHATGPT AI SEARCH
       * =====================================================
       */
      {
        userAgent: "GPTBot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * CLAUDE AI
       * =====================================================
       */
      {
        userAgent: "ClaudeBot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * PERPLEXITY AI
       * =====================================================
       */
      {
        userAgent: "PerplexityBot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * APPLEBOT
       * =====================================================
       */
      {
        userAgent: "Applebot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * AMAZON BOT
       * =====================================================
       */
      {
        userAgent: "Amazonbot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },

      /**
       * =====================================================
       * BING BOT
       * =====================================================
       */
      {
        userAgent: "Bingbot",

        allow: [
          ...publicPages,
          "/_next/static",
          "/_next/image",
          "/favicon.ico",
          "/logo.png",
          "/og-image.jpg",
          "/og-web-development.jpg",
        ],

        disallow: privatePaths,
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
