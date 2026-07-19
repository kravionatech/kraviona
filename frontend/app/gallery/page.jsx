import GalleryPage from "@/components/Gallery/GalleryPage";
import { defaultRobots } from "@/app/seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";

const canonical = "https://kraviona.com/gallery";
const title = "Portfolio & Project Gallery | Kraviona Tech Solutions";
const description =
  "Explore Kraviona projects, portfolio samples, and digital product work covering MERN stack development, performance, UX, security, and scalable web apps.";

export const metadata = {
  title,
  description,
  keywords: [
    "Kraviona Portfolio",
    "Web Development Portfolio India",
    "Web Design Gallery",
    "Project Showcase",
    "MERN Stack Portfolio",
    "Custom Software Projects",
    "Kraviona Work Samples",
    "Digital Product Design Examples",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical },
  openGraph: {
    title: "Gallery & Portfolio | Kraviona",
    description:
      "Browse our portfolio of successful web development and IT projects — built for scale, performance, and real-world results.",
    url: canonical,
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Tech Solutions Portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Gallery & Portfolio | Kraviona",
    description:
      "Browse our portfolio of successful web development and IT projects.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const Gallery = () => {
  return (
    <div>
      <JsonLd
        data={[
          webPageSchema({
            type: "CollectionPage",
            url: canonical,
            name: title,
            description,
          }),
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Gallery", url: canonical },
          ]),
        ]}
      />
      <GalleryPage />
    </div>
  );
};

export default Gallery;
