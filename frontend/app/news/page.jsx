import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { defaultRobots, canonicalUrl } from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";
import NewsListingLayout from "@/components/News/NewsListingLayout";

export const revalidate = 3600;

const canonical = canonicalUrl("/news");
const title = "Tech News & Industry Updates | Kraviona";
const description =
  "Latest breaking tech news, AI updates, web development stories, and digital industry insights from Kraviona — your source for what matters in tech.";

export const metadata = {
  title,
  description,
  keywords: [
    "Tech News",
    "AI News",
    "Web Development News",
    "Digital Marketing News",
    "Kraviona Tech News",
    "Breaking Tech Stories",
    "Technology Updates 2026",
  ],
  authors: [{ name: "Kraviona Tech Solutions", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical },
  openGraph: {
    title: "Tech News & Industry Updates | Kraviona",
    description,
    url: canonical,
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Tech News",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Tech News & Industry Updates | Kraviona",
    description,
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

async function getInitialNewsPosts() {
  try {
    const res = await fetch(
      `${API_URL}/public/posts?contentType=news&page=1&limit=13`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return { posts: [], pagination: {} };
    const json = await res.json();
    return { posts: parsePosts(json), pagination: json?.pagination || {} };
  } catch {
    return { posts: [], pagination: {} };
  }
}

export default async function NewsPage() {
  const { posts, pagination } = await getInitialNewsPosts();

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
            { name: "News", url: canonical },
          ]),
        ]}
      />
      <NewsListingLayout
        initialPosts={posts}
        initialPagination={pagination}
      />
    </div>
  );
}
