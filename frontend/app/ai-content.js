import { API_URL } from "@/utils/api";
import { SITE_NAME, SITE_URL, canonicalUrl } from "./seoConfig.js";
import { SERVICE_LINKS } from "./services/serviceData.js";

export const AI_CONTENT_REVALIDATE = 3600;

const POSTS_FETCH_LIMIT = 100;
const MAX_POST_PAGES = 20;

const fallbackBlogCategories = [
  "mern-stack",
  "technical-seo",
  "web-performance",
];

const staticPages = [
  {
    title: "Home",
    url: canonicalUrl("/"),
    description:
      "Overview of Kraviona Tech Solutions, web development, technical SEO, and digital engineering services.",
  },
  {
    title: "Services",
    url: canonicalUrl("/services"),
    description:
      "Public service index for development, SEO, AI automation, design, and digital marketing offerings.",
  },
  {
    title: "Blog",
    url: canonicalUrl("/blog"),
    description:
      "Published public articles about MERN stack development, AI automation, SEO, and performance.",
  },
  {
    title: "Case Studies",
    url: canonicalUrl("/case-studies"),
    description:
      "Public project and implementation examples from Kraviona.",
  },
  {
    title: "About",
    url: canonicalUrl("/about"),
    description: "Public company and expertise information.",
  },
  {
    title: "Contact",
    url: canonicalUrl("/contact"),
    description: "Public contact page for project and service inquiries.",
  },
  {
    title: "Pricing",
    url: canonicalUrl("/pricing"),
    description: "Public pricing and service package information.",
  },
  {
    title: "Portfolio",
    url: canonicalUrl("/gallery"),
    description: "Public portfolio and gallery page.",
  },
  {
    title: "Blog Categories",
    url: canonicalUrl("/category"),
    description: "Public blog category index.",
  },
  {
    title: "Privacy Policy",
    url: canonicalUrl("/privacy-policy"),
    description: "Public privacy policy.",
  },
  {
    title: "Terms",
    url: canonicalUrl("/terms"),
    description: "Public terms and conditions.",
  },
];

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

const cleanText = (value = "") =>
  String(value).replace(/\s+/g, " ").trim();

const acronymWords = new Set(["ai", "api", "mern", "seo", "ui", "ux"]);
const lowercaseTitleWords = new Set(["and", "for", "in", "of", "the"]);

const titleFromSlug = (slug = "") => {
  const words = cleanText(slug).replace(/-/g, " ").split(" ").filter(Boolean);

  return words
    .map((word, index) => {
      const lowerWord = word.toLowerCase();

      if (acronymWords.has(lowerWord)) return lowerWord.toUpperCase();
      if (index > 0 && lowercaseTitleWords.has(lowerWord)) return lowerWord;

      return `${lowerWord.charAt(0).toUpperCase()}${lowerWord.slice(1)}`;
    })
    .join(" ");
};

const uniqueByUrl = (items) =>
  Array.from(new Map(items.map((item) => [item.url, item])).values());

const getValidIsoDate = (value) => {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

const getNewestIsoDate = (...values) => {
  const dates = values
    .map(getValidIsoDate)
    .filter(Boolean)
    .map((value) => new Date(value));

  if (!dates.length) return "";

  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString();
};

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: AI_CONTENT_REVALIDATE },
  });

  return response.ok ? response.json() : {};
}

export async function getPublishedPosts() {
  const posts = [];
  let page = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage && page <= MAX_POST_PAGES) {
      const json = await fetchJson(
        `/public/posts?page=${page}&limit=${POSTS_FETCH_LIMIT}`,
      );

      posts.push(...parsePosts(json));

      hasNextPage = Boolean(json?.pagination?.hasNextPage);
      page += 1;
    }
  } catch (error) {
    console.error("[AI_CONTENT_POSTS_ERROR]", error?.message);
  }

  return posts.filter((post) => post?.slug && !post?.isNoIndex);
}

export async function getPublishedCategories() {
  try {
    const json = await fetchJson("/categories");
    return parsePosts(json).filter((category) => category?.slug);
  } catch (error) {
    console.error("[AI_CONTENT_CATEGORIES_ERROR]", error?.message);
    return [];
  }
}

function buildCategories(posts, categories) {
  const categoryMap = new Map();

  fallbackBlogCategories.forEach((slug) => {
    categoryMap.set(slug, {
      title: titleFromSlug(slug),
      url: canonicalUrl(`/category/${slug}`),
      description: `Public articles in the ${titleFromSlug(slug)} category.`,
      slug,
      lastModified: "",
    });
  });

  categories.forEach((category) => {
    const hasPosts = Number(category.postCount || 0) > 0;
    const isFallback = fallbackBlogCategories.includes(category.slug);

    if (!hasPosts && !isFallback) return;

    categoryMap.set(category.slug, {
      title: titleFromSlug(category.name || category.slug),
      url: canonicalUrl(`/category/${category.slug}`),
      description:
        cleanText(category.description) ||
        `Public articles in the ${titleFromSlug(category.slug)} category.`,
      slug: category.slug,
      lastModified: getNewestIsoDate(category.updatedAt, category.createdAt),
    });
  });

  posts.forEach((post) => {
    const slug = post.category?.slug;
    if (!slug) return;

    const existing = categoryMap.get(slug) || {
      title: titleFromSlug(post.category?.name || slug),
      url: canonicalUrl(`/category/${slug}`),
      description: `Public articles in the ${titleFromSlug(slug)} category.`,
      slug,
      lastModified: "",
    };

    categoryMap.set(slug, {
      ...existing,
      lastModified: getNewestIsoDate(
        existing.lastModified,
        post.updatedAt,
        post.publishedAt,
        post.createdAt,
      ),
    });
  });

  return uniqueByUrl(Array.from(categoryMap.values())).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
}

export async function getAiPublicContent() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getPublishedCategories(),
  ]);

  const services = SERVICE_LINKS.map((service) => ({
    title: service.name,
    url: canonicalUrl(service.href),
    description: service.category
      ? `${service.category} service page.`
      : "Kraviona service page.",
  }));

  const articles = posts.map((post) => ({
    title: cleanText(post.title),
    url: canonicalUrl(`/blog/${post.slug}`),
    description: cleanText(post.excerpt),
    category: cleanText(post.category?.name || post.category?.slug || ""),
    lastModified: getNewestIsoDate(
      post.updatedAt,
      post.publishedAt,
      post.createdAt,
    ),
  }));

  return {
    site: {
      name: SITE_NAME,
      url: SITE_URL,
      description:
        "Kraviona Tech Solutions builds MERN stack applications, Next.js websites, technical SEO systems, AI automation workflows, and performance-focused digital products.",
      contactEmail: "kravionatech@gmail.com",
      publicPhone: "+91 96085 53167",
    },
    staticPages,
    services: uniqueByUrl(services),
    categories: buildCategories(posts, categories),
    articles: uniqueByUrl(articles),
    generatedAt: new Date().toISOString(),
  };
}

export function textResponse(body) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${AI_CONTENT_REVALIDATE}, stale-while-revalidate=86400`,
    },
  });
}
