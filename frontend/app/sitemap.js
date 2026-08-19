import { API_URL } from "@/utils/api";
import { canonicalUrl } from "./seoConfig.js";
import { SERVICE_LINKS } from "./services/serviceData.js";

export const revalidate = 3600;

const POSTS_FETCH_LIMIT = 100;
const MAX_POST_PAGES = 20;
const RECENT_POST_UPDATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const frequencyRank = {
  always: 7,
  hourly: 6,
  daily: 5,
  weekly: 4,
  monthly: 3,
  yearly: 2,
  never: 1,
};

const canonicalStaticRoutes = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.85 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.86 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.86 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.75 },
  { path: "/team", changeFrequency: "monthly", priority: 0.75 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/category", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.7 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.7 },
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

const getBlogChangeFrequency = (lastModified) => {
  const validLastModified = getValidIsoDate(lastModified);
  if (!validLastModified) return "monthly";

  const age = Date.now() - new Date(validLastModified).getTime();
  return age >= 0 && age <= RECENT_POST_UPDATE_WINDOW_MS
    ? "weekly"
    : "monthly";
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

const buildServiceRoutes = (services) => services.map((service) =>
  createRoute({
    path: service.href || `/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: 0.92,
    lastModified: service.updatedAt,
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

async function getPublishedServices() {
  try {
    const json = await fetchJson("/services");
    const services = parseCollection(json).filter((service) => service?.slug);
    if (!services.length) return SERVICE_LINKS;
    const merged = new Map(SERVICE_LINKS.map((service) => [service.href, service]));
    services.forEach((service) => merged.set(`/services/${service.slug}`, service));
    return Array.from(merged.values());
  } catch (error) {
    console.error("[SITEMAP_SERVICES_ERROR]", error?.message);
    return SERVICE_LINKS;
  }
}

async function getPublishedCareers() {
  try {
    const json = await fetchJson("/careers?limit=50");
    return parseCollection(json).filter(
      (career) => career?.slug && !career?.seo?.noIndex,
    );
  } catch (error) {
    console.error("[SITEMAP_CAREERS_ERROR]", error?.message);
    return [];
  }
}

function buildCareerRoutes(careers) {
  return careers.map((career) =>
    createRoute({
      path: `/careers/${career.slug}`,
      changeFrequency: "weekly",
      priority: 0.82,
      lastModified: getNewestIsoDate(
        career.updatedAt,
        career.publishedAt,
        career.createdAt,
      ),
    }),
  );
}

function buildBlogPostRoutes(posts) {
  return posts.map((post) => {
    const lastModified = getNewestIsoDate(
      post.updatedAt,
      post.publishedAt,
      post.createdAt,
    );

    return createRoute({
      path: `/blog/${post.slug}`,
      changeFrequency: getBlogChangeFrequency(lastModified),
      priority: 0.85,
      lastModified,
    });
  });
}

function buildCategoryRoutes(posts, categories) {
  const categoryMap = new Map();

  categories.forEach((category) => {
    const hasPosts = Number(category.postCount || 0) > 0;

    if (hasPosts) {
      categoryMap.set(category.slug, {
        slug: category.slug,
        priority: 0.7,
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
  const [posts, categories, services, careers] = await Promise.all([
    getPublishedPosts(),
    getPublishedCategories(),
    getPublishedServices(),
    getPublishedCareers(),
  ]);

  return mergeRoutes([
    ...staticRoutes,
    ...buildServiceRoutes(services),
    ...buildCareerRoutes(careers),
    ...buildCategoryRoutes(posts, categories),
    ...buildBlogPostRoutes(posts),
  ]);
}
