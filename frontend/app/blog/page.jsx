import EwayBlogLayout from "@/components/Blog/EwayBlogLayout";
import { canonicalUrl, defaultRobots, SITE_NAME } from "@/app/seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { API_URL } from "@/utils/api";

const blogPageSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://kraviona.com/blog#blog",
  url: "https://kraviona.com/blog",
  name: "Kraviona Blog – Web Development & Digital Insights",
  description:
    "Read our latest insights, trends, and expert advice on web development, UI/UX design, AI solutions, and digital marketing to stay ahead in the tech world.",
  publisher: {
    "@type": "Organization",
    name: "Kraviona Tech Solutions",
    logo: { "@type": "ImageObject", url: "https://kraviona.com/logo.png" },
  },
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
        name: "Blog",
        item: "https://kraviona.com/blog",
      },
    ],
  },
};

const parsePosts = (json) =>
  Array.isArray(json.posts)
    ? json.posts
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

async function getInitialPosts() {
  try {
    const response = await fetch(`${API_URL}/public/posts?page=1&limit=100`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = await response.json();
    return parsePosts(json).filter((post) => post?.slug);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[Blog] initial posts fetch error:", error);
    }
    return [];
  }
}

export const metadata = {
  title: "Tech Blog | MERN Stack, SEO & Web Development",
  description:
    "Explore Kraviona\'s blog for expert insights on MERN Stack development, Technical SEO, Core Web Vitals, Node.js, React.js, and modern web performance. Written by our engineers.",
  keywords: [
    "Kraviona Blog",
    "MERN Stack Blog",
    "Web Development Insights",
    "Technical SEO Blog",
    "UI UX Design Trends",
    "Node.js Tutorials",
    "React.js Articles",
    "Next.js Development",
    "Core Web Vitals Guide",
    "Digital Marketing Tips",
    "Tech Industry News",
  ],
  authors: [{ name: "Kraviona Team", url: "https://kraviona.com" }],
  creator: SITE_NAME,
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    title: "Tech Blog | MERN Stack, SEO & Web Development Insights | Kraviona",
    description:
      "Expert insights on MERN stack development, Technical SEO, React.js, Node.js, and modern web performance strategies from Kraviona\'s engineering team.",
    url: canonicalUrl("/blog"),
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Tech Blog – Web Dev & SEO Insights",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Tech Blog | MERN Stack, SEO & Web Development Insights | Kraviona",
    description:
      "Expert insights on MERN stack, Technical SEO, React.js, and modern web performance.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const Blog = async () => {
  const initialPosts = await getInitialPosts();

  return (
    <div>
      <JsonLd
        data={[
          blogPageSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Blog", url: "https://kraviona.com/blog" },
          ]),
        ]}
      />
      <EwayBlogLayout initialPosts={initialPosts} />
    </div>
  );
};

export default Blog;
