import { API_URL } from "@/utils/api";
import { canonicalUrl } from "./seoConfig.js";
import { SERVICE_LINKS } from "./services/serviceData.js";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const POSTS_FETCH_LIMIT = 100;
const MAX_POST_PAGES = 20;

const frequencyRank = {
  always: 7,
  hourly: 6,
  daily: 5,
  weekly: 4,
  monthly: 3,
  yearly: 2,
  never: 1,
};

const headerServicePaths = new Set([
  "/services/mern-stack-development",
  "/services/full-stack-development",
  "/services/react-development",
  "/services/nodejs-development",
  "/services/backend-development",
  "/services/api-development",
  "/services/database-architecture",
  "/services/saas-development",
  "/services/technical-seo",
  "/services/web-performance-optimization",
  "/services/ai-automation",
  "/services/ai-chatbot-development",
  "/services/digital-marketing",
  "/services/social-media-marketing",
  "/services/email-marketing",
  "/services/brand-identity",
  "/services/ecommerce-development-marketing",
  "/services/account-management",
  "/services/cataloging",
  "/services/accounting",
  "/services/advertising",
  "/services/seller-training",
]);

const featuredServicePriorities = new Map([
  ["/services/technical-seo", 0.92],
  ["/services/mern-stack-development", 0.92],
  ["/services/account-management", 0.9],
  ["/services/ai-automation", 0.9],
]);

const fallbackBlogCategories = [
  "mern-stack",
  "technical-seo",
  "web-performance",
];

const canonicalStaticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/blog", changeFrequency: "daily", priority: 0.93 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.86 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.82 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.78 },
  { path: "/category", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.35 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.35 },
];

const parseCollection = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

const getValidIsoDate = (value) => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const getNewestIsoDate = (...values) => {
  const dates = values
    .map(getValidIsoDate)
    .filter(Boolean)
    .map((value) => new Date(value));

  if (!dates.length) return null;

  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString();
};

const createRoute = ({ path, changeFrequency, priority, lastModified }) => {
  const route = {
    url: canonicalUrl(path),
    changeFrequency,
    priority,
  };

  const validLastModified = getValidIsoDate(lastModified);
  if (validLastModified) {
    route.lastModified = validLastModified;
  }

  return route;
};

const getServicePriority = (path) =>
  featuredServicePriorities.get(path) ||
  (headerServicePaths.has(path) ? 0.86 : 0.76);

const serviceRoutes = SERVICE_LINKS.map((service) =>
  createRoute({
    path: service.href,
    changeFrequency: "monthly",
    priority: getServicePriority(service.href),
  }),
);

const staticRoutes = canonicalStaticRoutes.map(createRoute);

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  return response.ok ? response.json() : {};
}

async function getPublishedPosts() {
  const posts = [];
  let page = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage && page <= MAX_POST_PAGES) {
      const json = await fetchJson(
        `/public/posts?page=${page}&limit=${POSTS_FETCH_LIMIT}`,
      );

      posts.push(...parseCollection(json));

      hasNextPage = Boolean(json?.pagination?.hasNextPage);
      page += 1;
    }
  } catch (error) {
    console.error("[SITEMAP_POSTS_ERROR]", error?.message);
  }

  return posts.filter((post) => post?.slug && !post?.isNoIndex);
}

async function getPublishedCategories() {
  try {
    const json = await fetchJson("/categories");
    return parseCollection(json).filter((category) => category?.slug);
  } catch (error) {
    console.error("[SITEMAP_CATEGORIES_ERROR]", error?.message);
    return [];
  }
}

function buildBlogPostRoutes(posts) {
  return posts.map((post) =>
    createRoute({
      path: `/blog/${post.slug}`,
      changeFrequency: "weekly",
      priority: 0.74,
      lastModified: getNewestIsoDate(
        post.updatedAt,
        post.publishedAt,
        post.createdAt,
      ),
    }),
  );
}

function buildCategoryRoutes(posts, categories) {
  const categoryMap = new Map();

  fallbackBlogCategories.forEach((slug) => {
    categoryMap.set(slug, { slug, priority: 0.72 });
  });

  categories.forEach((category) => {
    const hasPosts = Number(category.postCount || 0) > 0;
    const isFallback = fallbackBlogCategories.includes(category.slug);

    if (hasPosts || isFallback) {
      categoryMap.set(category.slug, {
        slug: category.slug,
        priority: isFallback ? 0.74 : 0.7,
        lastModified: getNewestIsoDate(category.updatedAt, category.createdAt),
      });
    }
  });

  posts.forEach((post) => {
    const slug = post.category?.slug;
    if (!slug) return;

    const existing = categoryMap.get(slug) || { slug, priority: 0.7 };
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

  return Array.from(categoryMap.values()).map((category) =>
    createRoute({
      path: `/category/${category.slug}`,
      changeFrequency: "weekly",
      priority: category.priority,
      lastModified: category.lastModified,
    }),
  );
}

function mergeRoutes(routes) {
  const routeMap = new Map();

  routes.forEach((route) => {
    const existing = routeMap.get(route.url);

    if (!existing) {
      routeMap.set(route.url, route);
      return;
    }

    routeMap.set(route.url, {
      ...existing,
      priority: Math.max(existing.priority || 0, route.priority || 0),
      changeFrequency:
        frequencyRank[route.changeFrequency] >
        frequencyRank[existing.changeFrequency]
          ? route.changeFrequency
          : existing.changeFrequency,
      lastModified: getNewestIsoDate(existing.lastModified, route.lastModified),
    });
  });

  return Array.from(routeMap.values()).sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return a.url.localeCompare(b.url);
  });
}

export default async function sitemap() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getPublishedCategories(),
  ]);

  return mergeRoutes([
    ...staticRoutes,
    ...serviceRoutes,
    ...buildCategoryRoutes(posts, categories),
    ...buildBlogPostRoutes(posts),
  ]);
}
