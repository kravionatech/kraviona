import CategoryWiseBlog from "@/components/Category/CategoryWiseBlog";
import { JsonLd } from "@/components/JsonLd";
import { defaultRobots } from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";

async function getCategoryData(slug) {
  try {
    const [categoryResponse, postsResponse] = await Promise.all([
      fetch(`${API_URL}/category/${encodeURIComponent(slug)}`, {
        next: { revalidate: 300 },
        headers: { Accept: "application/json" },
      }),
      fetch(
        `${API_URL}/public/posts?category=${encodeURIComponent(slug)}&page=1&limit=100`,
        {
          next: { revalidate: 300 },
          headers: { Accept: "application/json" },
        },
      ),
    ]);
    const categoryJson = categoryResponse.ok ? await categoryResponse.json() : {};
    const postsJson = postsResponse.ok ? await postsResponse.json() : {};
    const returnedPosts = Array.isArray(postsJson?.data) ? postsJson.data : [];
    const categoryPosts = returnedPosts.filter((post) => {
      const categorySlug = post?.category?.slug;
      const categoryNameSlug = post?.category?.name
        ?.toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return post?.slug && (categorySlug === slug || categoryNameSlug === slug);
    });

    return {
      category: categoryJson?.data || null,
      posts: categoryPosts,
    };
  } catch {
    return { category: null, posts: [] };
  }
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const { category: categoryData } = await getCategoryData(category);

  const formattedTitle = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const title = categoryData?.metaTitle || `${formattedTitle} Articles and Guides`;
  const description =
    categoryData?.metaDescription ||
    categoryData?.description ||
    `Read the latest insights, tutorials, and expert case studies about ${formattedTitle} from the engineering team at Kraviona Tech Solutions.`;

  return {
    title: `${title} | Kraviona Blog`,
    description,
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
  const { category: categoryData, posts } = await getCategoryData(category);

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

  const pageUrl = `https://kraviona.com/category/${category}`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: categoryData?.metaTitle || `${formattedTitle} Articles and Guides`,
    description:
      categoryData?.metaDescription ||
      categoryData?.description ||
      `Latest articles about ${formattedTitle} from Kraviona.`,
    isPartOf: { "@id": "https://kraviona.com/#website" },
    breadcrumb: breadcrumbSchema,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://kraviona.com/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#f9fafb]">
      <JsonLd data={[breadcrumbSchema, collectionSchema]} />
      <CategoryWiseBlog category={category} initialPosts={posts} />
    </main>
  );
};

export default CategoryPage;
