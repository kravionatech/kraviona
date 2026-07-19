import CategoryWiseBlog from "@/components/Category/CategoryWiseBlog";
import { defaultRobots } from "@/app/seoConfig.js";

export async function generateMetadata({ params }) {
  const { category } = await params;

  const formattedTitle = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${formattedTitle} Articles and Guides | Kraviona Blog`,
    description: `Read the latest insights, tutorials, and expert case studies about ${formattedTitle} from the engineering team at Kraviona Tech Solutions.`,
    keywords: [
      `${formattedTitle} articles`,
      `${formattedTitle} tutorials`,
      `${formattedTitle} insights`,
      "Kraviona Blog",
      "Tech Articles India",
    ],
    authors: [{ name: "Kraviona Team", url: "https://kraviona.com" }],
    alternates: { canonical: `https://kraviona.com/category/${category}` },
    openGraph: {
      title: `${formattedTitle} | Kraviona Insights`,
      description: `Explore our expert articles on ${formattedTitle}. In-depth tutorials and insights from the Kraviona team.`,
      url: `https://kraviona.com/category/${category}`,
      siteName: "Kraviona Tech Solutions",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${formattedTitle} – Kraviona Blog`,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@KravionaTech",
      creator: "@KravionaTech",
      title: `${formattedTitle} | Kraviona Insights`,
      description: `Explore expert articles on ${formattedTitle} from Kraviona.`,
      images: ["/og-image.jpg"],
    },
    robots: defaultRobots,
  };
}

const CategoryPage = async ({ params }) => {
  const { category } = await params;

  const formattedTitle = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: "Categories",
        item: "https://kraviona.com/category",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: formattedTitle,
        item: `https://kraviona.com/category/${category}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CategoryWiseBlog category={category} />
    </main>
  );
};

export default CategoryPage;
