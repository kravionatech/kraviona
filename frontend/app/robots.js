import { SITE_URL } from "./seoConfig.js";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
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
          "/404",
          "/500",
          "api.kraviona.com"
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
