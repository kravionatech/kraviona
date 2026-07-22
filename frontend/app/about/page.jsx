import AboutBanner from "@/components/About/AboutBanner";
import OurStory from "@/components/About/OurStory";
import CoreValues from "@/components/About/CoreValues";
import TeamSection from "@/components/About/TeamSection";
import BlogCTA from "@/components/Blog/BlogCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { defaultRobots } from "@/app/seoConfig.js";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://kraviona.com/about#webpage",
  url: "https://kraviona.com/about",
  name: "About Kraviona – Engineering Digital Ecosystems",
  description:
    "Learn about Kraviona, the founder-led team building MERN stack products, Next.js websites, backend systems, and technical SEO foundations.",
  isPartOf: { "@id": "https://kraviona.com/#website" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kraviona.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About Us",
        item: "https://kraviona.com/about",
      },
    ],
  },
};

export const metadata = {
  title: "About Kraviona | Founder-Led Web Development Team",
  description:
    "Meet Kraviona Tech Solutions, a Delhi-based team building fast websites, scalable apps, backend APIs, and technical SEO systems for growing businesses.",
  keywords: [
    "About Kraviona",
    "Kraviona Team",
    "IT Company India",
    "Web Development Agency About",
    "MERN Stack Agency India",
    "Kraviona Mission & Vision",
    "Tech Company Delhi",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://kraviona.com/about" },
  openGraph: {
    title: "About Kraviona | Founder-Led Web Development Team",
    description:
      "Meet the team behind Kraviona's MERN stack development, Next.js websites, backend systems, and technical SEO work.",
    url: "https://kraviona.com/about",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Kraviona Tech Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "About Kraviona | Founder-Led Web Development Team",
    description:
      "Meet the team behind Kraviona's development and technical SEO work.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <JsonLd
        data={[
          aboutPageSchema,
          personSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "About Us", url: "https://kraviona.com/about" },
          ]),
        ]}
      />
      <AboutBanner />
      <OurStory />
      <CoreValues />
      <TeamSection />
      <BlogCTA />
    </main>
  );
};

export default AboutPage;
