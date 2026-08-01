import { SITE_URL } from "./seoConfig.js";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api/",
          "/_next",
          "/studio",
          "/dashboard",
          "/login",
          "/register",
          "/auth",
          "/private",
          "/server",
          "/tmp",
          "/cache",
          "/test",
          "/preview",
          "/draft",
          "/*.json$",
          "/*?*",
        ],
      },
      // Make public, canonical marketing content discoverable to AI search
      // products while keeping known bulk-training crawlers out.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "PetalBot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/images/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
