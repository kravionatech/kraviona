import CategoryDiscovery from "@/components/Blog/CategoryDiscovery";
import { defaultRobots } from "@/app/seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";

const canonical = "https://kraviona.com/category";
const title = "Blog Categories and Topic Hubs | Kraviona Insights";
const description =
  "Browse Kraviona blog categories for practical guides on MERN stack development, technical SEO, AI automation, UI/UX, cloud, and digital growth.";

export const metadata = {
  title,
  description,
  keywords: [
    "Blog Categories",
    "Web Development Articles",
    "Digital Marketing Category",
    "UI UX Design Blogs",
    "AI Technology Articles",
    "Cloud Computing Guides",
    "Kraviona Blog Topics",
  ],
  authors: [{ name: "Kraviona Team", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical },
  openGraph: {
    title: "Blog Categories | Kraviona",
    description:
      "Explore all blog categories on Kraviona — web development, UI/UX, digital marketing, AI, and more.",
    url: canonical,
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Blog Categories",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Blog Categories | Kraviona",
    description:
      "Explore all blog categories on Kraviona — web development, UI/UX, digital marketing, AI, and more.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const Category = () => {
  return (
    <div className="mt-16">
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
            { name: "Categories", url: canonical },
          ]),
        ]}
      />
      <CategoryDiscovery />
    </div>
  );
};

export default Category;
