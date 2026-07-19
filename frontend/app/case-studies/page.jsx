import React from "react";
import ComingSoon from "@/components/ComingSoon/ComingSoon";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { defaultRobots } from "@/app/seoConfig.js";

export const metadata = {
  title: "Case Studies – Real-World Results | Kraviona Tech Solutions",
  description:
    "Explore Kraviona case studies showing how MERN stack development, technical SEO, performance, and automation improve websites, rankings, and leads.",
  keywords: [
    "Case Studies",
    "Web Development Case Studies",
    "MERN Stack Success Stories",
    "SEO Results",
    "Web Development Projects",
    "Enterprise Solutions",
    "Digital Transformation Cases",
    "Client Success Stories",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://kraviona.com/case-studies" },
  openGraph: {
    title: "Case Studies – Real-World Results | Kraviona",
    description:
      "Discover how Kraviona delivered measurable business results. Read case studies on MERN Stack development, Technical SEO, and digital transformation.",
    url: "https://kraviona.com/case-studies",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Case Studies",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Case Studies – Real-World Results | Kraviona",
    description:
      "Real case studies showcasing measurable results from Kraviona projects.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

export default function CaseStudiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://kraviona.com" },
          { name: "Case Studies", url: "https://kraviona.com/case-studies" },
        ])}
      />
      <ComingSoon />
    </>
  );
}
