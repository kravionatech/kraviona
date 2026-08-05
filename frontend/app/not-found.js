import { canonicalUrl } from "./seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import NotFoundClient from "@/components/NotFound/NotFoundClient";
import { breadcrumbSchema as buildBreadcrumbSchema } from "@/lib/schema";

export const metadata = {
  title: "404 - Page Not Found | Kraviona Tech Solutions",
  description:
    "The page you are looking for does not exist or has been moved. Explore Kraviona's web development, technical SEO, MERN stack, AI automation, and digital marketing services.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: canonicalUrl("/404"),
  },
};

export default function NotFound() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "404 Not Found", url: "/404" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <NotFoundClient />
    </>
  );
}
