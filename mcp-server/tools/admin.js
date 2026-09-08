import { ActivityLog } from "../../backend/src/models/analytics/activity-log.model.js";
import { CategoryModel } from "../../backend/src/models/blog/category.model.js";
import { CommentModel } from "../../backend/src/models/blog/comment.js";
import { PostModel } from "../../backend/src/models/blog/post.model.js";
import Lead from "../../backend/src/models/leads/lead.model.js";
import { mediaModel } from "../../backend/src/models/media/media.model.js";
import { MessageModel } from "../../backend/src/models/messages/message.model.js";
import { newsLatterModel } from "../../backend/src/models/newslatter/newslatter.model.js";
import { BlogPushSubscription } from "../../backend/src/models/notifications/blog-push-subscription.model.js";
import { Project } from "../../backend/src/models/portfolio/project.model.js";
import { Service } from "../../backend/src/models/services/service.model.js";
import { TeamMemberModel } from "../../backend/src/models/team/team.model.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { RedirectModel } from "../../backend/src/models/settings/redirect.model.js";
import { SiteSettingModel } from "../../backend/src/models/settings/siteSettings.model.js";
import { config } from "../config.js";
import { connectDB, getDBStatus, pingDB } from "../db.js";
import { getResource, resourceNames, resources } from "../catalog.js";
import { errorResultFrom, successResult } from "../lib/results.js";
import {
  addLeadActivity,
  createRecord,
  deleteRecord,
  describeResource,
  describeResources,
  getRecord,
  listRecords,
  updateRecord,
} from "../repository.js";

const annotations = ({ title, readOnly = false, destructive = false }) => ({
  title,
  readOnlyHint: readOnly,
  destructiveHint: destructive,
  idempotentHint: readOnly || destructive,
  openWorldHint: false,
});

// ── Explicit Kraviona Tools ──────────────────────────────────────────────────
const kravionaTools = [
  // ── 1. Operations & Health ────────────────────────────────────────────────
  {
    name: "kraviona_health_check",
    description:
      "Check Kraviona remote MCP server health, MongoDB Atlas latency, memory usage, uptime, and active configuration",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Kraviona Health Check", readOnly: true }),
  },
  {
    name: "kraviona_get_dashboard",
    description:
      "Get complete Kraviona website overview covering blog posts, news articles, categories, redirects, CRM leads, subscribers, and audited MCP activity",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Kraviona Dashboard", readOnly: true }),
  },

  // ── 2. Content Management (Blog & News) ──────────────────────────────────
  {
    name: "kraviona_list_posts",
    description:
      "List posts from Kraviona with filtering by contentType ('blog' | 'news' | 'all'), category, status, search, and pagination",
    inputSchema: {
      type: "object",
      properties: {
        contentType: {
          type: "string",
          enum: ["all", "blog", "news"],
          default: "all",
          description: "Filter by contentType ('blog', 'news', or 'all')",
        },
        categoryID: {
          type: "string",
          pattern: "^[a-fA-F0-9]{24}$",
          description: "Filter by Category MongoDB ObjectId",
        },
        status: {
          type: "string",
          enum: ["published", "draft", "archived"],
          description: "Filter by publication status",
        },
        search: {
          type: "string",
          description: "Search keyword matching title, excerpt, keywords, tags",
        },
        page: { type: "integer", minimum: 1, default: 1 },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
        sortBy: {
          type: "string",
          enum: ["createdAt", "updatedAt", "publishedAt", "title", "status"],
          default: "createdAt",
        },
        sortOrder: { type: "string", enum: ["desc", "asc"], default: "desc" },
      },
      additionalProperties: false,
    },
    annotations: annotations({ title: "List Posts", readOnly: true }),
  },
  {
    name: "kraviona_get_post",
    description:
      "Get a single Kraviona post by its MongoDB ObjectId or unique slug; includes author details and SEO metadata",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$", description: "Post ObjectId" },
        slug: { type: "string", minLength: 1, description: "Post slug" },
      },
      anyOf: [{ required: ["id"] }, { required: ["slug"] }],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Get Post", readOnly: true }),
  },
  {
    name: "kraviona_create_post",
    description:
      "Create a new Blog post or Tech/Industry News post with automatic slug generation, category validation, and SEO tags",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", minLength: 3, maxLength: 300, description: "Post title" },
        content: { type: "string", minLength: 10, description: "Full HTML or markdown article body" },
        contentType: {
          type: "string",
          enum: ["blog", "news"],
          default: "blog",
          description: "Specify whether this is a Blog post or a News post",
        },
        categoryID: {
          type: "string",
          pattern: "^[a-fA-F0-9]{24}$",
          description: "Valid Category ObjectId",
        },
        excerpt: { type: "string", maxLength: 600, description: "Short summary/excerpt" },
        slug: { type: "string", description: "Custom URL slug (optional, auto-generated if omitted)" },
        status: {
          type: "string",
          enum: ["draft", "published", "archived"],
          default: "draft",
          description: "Publication status",
        },
        tags: { type: "array", items: { type: "string" }, description: "Tags list" },
        keywords: { type: "array", items: { type: "string" }, description: "SEO keywords list" },
        metaTitle: { type: "string", maxLength: 100, description: "Custom SEO meta title" },
        metaDescription: { type: "string", maxLength: 250, description: "Custom SEO meta description" },
        isNoIndex: { type: "boolean", default: false, description: "Exclude from search engines" },
        featuredImage: {
          type: "object",
          properties: {
            url: { type: "string", description: "Image URL" },
            alt: { type: "string", description: "Image Alt Text" },
          },
        },
        quickAnswer: { type: "string", description: "Quick summary/answer for AI search engines" },
      },
      required: ["title", "content", "categoryID"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Create Post" }),
  },
  {
    name: "kraviona_update_post",
    description:
      "Update fields on an existing Kraviona post (title, content, category, status, SEO metadata, tags, etc.)",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        slug: { type: "string" },
        changes: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            excerpt: { type: "string" },
            contentType: { type: "string", enum: ["blog", "news"] },
            categoryID: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
            status: { type: "string", enum: ["draft", "published", "archived"] },
            tags: { type: "array", items: { type: "string" } },
            keywords: { type: "array", items: { type: "string" } },
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
            isNoIndex: { type: "boolean" },
            featuredImage: {
              type: "object",
              properties: {
                url: { type: "string" },
                alt: { type: "string" },
              },
            },
            quickAnswer: { type: "string" },
          },
          additionalProperties: false,
        },
      },
      anyOf: [{ required: ["id"] }, { required: ["slug"] }],
      required: ["changes"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update Post" }),
  },
  {
    name: "kraviona_delete_post",
    description:
      "Permanently delete a Kraviona post. Requires confirmation: 'PERMANENTLY_DELETE'",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        slug: { type: "string" },
        confirmation: { type: "string", const: "PERMANENTLY_DELETE" },
      },
      anyOf: [{ required: ["id"] }, { required: ["slug"] }],
      required: ["confirmation"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Delete Post", destructive: true }),
  },

  // ── 3. Categories Management ─────────────────────────────────────────────
  {
    name: "kraviona_list_categories",
    description:
      "List Kraviona categories with contentType filter ('all' | 'blog' | 'news'), status, and live article counts",
    inputSchema: {
      type: "object",
      properties: {
        contentType: {
          type: "string",
          enum: ["all", "blog", "news"],
          default: "all",
          description: "Filter categories by content type",
        },
        status: { type: "string", enum: ["active", "inactive"] },
        search: { type: "string", description: "Search by category name or description" },
        page: { type: "integer", default: 1 },
        limit: { type: "integer", default: 50 },
      },
      additionalProperties: false,
    },
    annotations: annotations({ title: "List Categories", readOnly: true }),
  },
  {
    name: "kraviona_get_category",
    description:
      "Get a single category by its MongoDB ObjectId or unique slug",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        slug: { type: "string" },
      },
      anyOf: [{ required: ["id"] }, { required: ["slug"] }],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Get Category", readOnly: true }),
  },
  {
    name: "kraviona_create_category",
    description:
      "Create a new Kraviona category for Blog, News, or All content",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", minLength: 2, maxLength: 100, description: "Category name" },
        contentType: {
          type: "string",
          enum: ["all", "blog", "news"],
          default: "blog",
          description: "Content scope for this category",
        },
        description: { type: "string", maxLength: 500, description: "Category description" },
        slug: { type: "string", description: "URL slug (auto-generated if omitted)" },
        metaTitle: { type: "string", maxLength: 100 },
        metaDescription: { type: "string", maxLength: 250 },
        image: { type: "string", description: "Category banner/icon URL" },
      },
      required: ["name"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Create Category" }),
  },
  {
    name: "kraviona_update_category",
    description:
      "Update category name, description, contentType, or status",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        slug: { type: "string" },
        changes: {
          type: "object",
          properties: {
            name: { type: "string" },
            contentType: { type: "string", enum: ["all", "blog", "news"] },
            description: { type: "string" },
            metaTitle: { type: "string" },
            metaDescription: { type: "string" },
            image: { type: "string" },
            status: { type: "string", enum: ["active", "inactive"] },
          },
          additionalProperties: false,
        },
      },
      anyOf: [{ required: ["id"] }, { required: ["slug"] }],
      required: ["changes"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update Category" }),
  },
  {
    name: "kraviona_delete_category",
    description:
      "Permanently delete a category. Requires confirmation: 'PERMANENTLY_DELETE'",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        slug: { type: "string" },
        confirmation: { type: "string", const: "PERMANENTLY_DELETE" },
      },
      anyOf: [{ required: ["id"] }, { required: ["slug"] }],
      required: ["confirmation"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Delete Category", destructive: true }),
  },

  // ── 4. SEO & Robots & LLMs ───────────────────────────────────────────────
  {
    name: "kraviona_get_seo_settings",
    description:
      "Retrieve global website SEO settings, OpenGraph defaults, metadata, and canonical configurations",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Get SEO Settings", readOnly: true }),
  },
  {
    name: "kraviona_update_seo_settings",
    description:
      "Update global website SEO settings (meta title, description, keywords, OpenGraph image, twitter handle, canonical base URL)",
    inputSchema: {
      type: "object",
      properties: {
        metaTitle: { type: "string" },
        metaDescription: { type: "string" },
        keywords: { type: "array", items: { type: "string" } },
        ogImage: { type: "string" },
        canonicalBaseUrl: { type: "string" },
        siteName: { type: "string" },
        twitterHandle: { type: "string" },
      },
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update SEO Settings" }),
  },
  {
    name: "kraviona_get_robots",
    description:
      "Read the active robots.txt directives (custom database override or static server fallback)",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Get Robots.txt", readOnly: true }),
  },
  {
    name: "kraviona_update_robots",
    description:
      "Update or override website robots.txt directives in the production database",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", minLength: 5, description: "Full robots.txt directives text" },
      },
      required: ["content"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update Robots.txt" }),
  },
  {
    name: "kraviona_get_llms",
    description:
      "Read the active llms.txt directives (custom database override or dynamic AI content default)",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Get LLMs.txt", readOnly: true }),
  },
  {
    name: "kraviona_update_llms",
    description:
      "Update or override website llms.txt content in the production database",
    inputSchema: {
      type: "object",
      properties: {
        content: { type: "string", minLength: 5, description: "Full llms.txt markdown content" },
      },
      required: ["content"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update LLMs.txt" }),
  },

  // ── 5. Code Injection (Header, Body, Footer) ─────────────────────────────
  {
    name: "kraviona_get_code_injection",
    description:
      "Read custom HTML/script code injected into Kraviona.com header (<head>), body (<after <body>>), and footer (<before </body>>)",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Get Code Injection", readOnly: true }),
  },
  {
    name: "kraviona_update_code_injection",
    description:
      "Update custom HTML, Google Tag Manager, analytics, or script snippets injected into header, body, or footer",
    inputSchema: {
      type: "object",
      properties: {
        headerCode: { type: "string", description: "HTML/scripts for <head>" },
        bodyCode: { type: "string", description: "HTML/scripts immediately after <body>" },
        footerCode: { type: "string", description: "HTML/scripts right before </body>" },
      },
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update Code Injection" }),
  },

  // ── 6. Redirect Management ───────────────────────────────────────────────
  {
    name: "kraviona_list_redirects",
    description:
      "List all active 301 and 302 permanent redirects with pagination, search, and type filtering",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search by source or destination path" },
        type: { type: "string", enum: ["301", "302"] },
        active: { type: "boolean" },
        page: { type: "integer", default: 1 },
        limit: { type: "integer", default: 50 },
      },
      additionalProperties: false,
    },
    annotations: annotations({ title: "List Redirects", readOnly: true }),
  },
  {
    name: "kraviona_get_redirect",
    description:
      "Get a single redirect rule by its MongoDB ObjectId or source path",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        source: { type: "string" },
      },
      anyOf: [{ required: ["id"] }, { required: ["source"] }],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Get Redirect", readOnly: true }),
  },
  {
    name: "kraviona_create_redirect",
    description:
      "Create a new 301 or 302 permanent redirect rule with loop, chain, and duplicate validation",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          minLength: 1,
          description: "Incoming source path (e.g. /blog/old-slug)",
        },
        destination: {
          type: "string",
          minLength: 1,
          description: "Target destination path or absolute URL (e.g. /seo/old-slug)",
        },
        type: { type: "string", enum: ["301", "302"], default: "301" },
        active: { type: "boolean", default: true },
      },
      required: ["source", "destination"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Create Redirect" }),
  },
  {
    name: "kraviona_update_redirect",
    description:
      "Update an existing redirect rule's destination, type, or active state",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$", required: true },
        changes: {
          type: "object",
          properties: {
            source: { type: "string" },
            destination: { type: "string" },
            type: { type: "string", enum: ["301", "302"] },
            active: { type: "boolean" },
          },
          additionalProperties: false,
        },
      },
      required: ["id", "changes"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Update Redirect" }),
  },
  {
    name: "kraviona_delete_redirect",
    description:
      "Permanently delete a redirect rule. Requires confirmation: 'PERMANENTLY_DELETE'",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$", required: true },
        confirmation: { type: "string", const: "PERMANENTLY_DELETE" },
      },
      required: ["id", "confirmation"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Delete Redirect", destructive: true }),
  },
  {
    name: "kraviona_validate_redirect",
    description:
      "Validate a proposed 301/302 redirect rule against redirect loops, chains, duplicates, and URL syntax before applying it",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          minLength: 1,
          description: "Source URL path (e.g. /blog/old-slug)",
        },
        destination: {
          type: "string",
          minLength: 1,
          description: "Destination URL path or absolute URL (e.g. /seo/old-slug)",
        },
      },
      required: ["source", "destination"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Validate Redirect", readOnly: true }),
  },

  // ── 7. Safe CRM & Operations ─────────────────────────────────────────────
  {
    name: "kraviona_list_leads",
    description:
      "List customer inquiries and CRM leads with status filtering and pagination",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string" },
        search: { type: "string" },
        page: { type: "integer", default: 1 },
        limit: { type: "integer", default: 20 },
      },
      additionalProperties: false,
    },
    annotations: annotations({ title: "List Leads", readOnly: true }),
  },
  {
    name: "kraviona_get_lead",
    description: "Get detailed CRM lead profile and activity history by MongoDB ObjectId",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$", required: true },
      },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Get Lead", readOnly: true }),
  },
  {
    name: "kraviona_add_lead_activity",
    description:
      "Append an audited note, call, email, or meeting note to a lead timeline as the authenticated Superadmin",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$", required: true },
        type: {
          type: "string",
          enum: ["note", "call", "email", "meeting", "status_change", "other"],
          required: true,
        },
        description: { type: "string", minLength: 1, maxLength: 2000, required: true },
      },
      required: ["id", "type", "description"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Add Lead Activity" }),
  },
  {
    name: "kraviona_search_data",
    description:
      "Multi-resource search across posts, categories, leads, redirects, services, and team members",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 2, maxLength: 200 },
        limit: { type: "integer", default: 5 },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Search Data", readOnly: true }),
  },
];

export const tools = kravionaTools;

// ── Dashboard Helper ────────────────────────────────────────────────────────
const getDashboardData = async () => {
  const [
    users,
    totalPosts,
    blogPosts,
    newsPosts,
    categories,
    redirects,
    leads,
    messages,
    subscribers,
    recentMcpActivity,
  ] = await Promise.all([
    Auth.countDocuments(),
    PostModel.countDocuments(),
    PostModel.countDocuments({ contentType: "blog" }),
    PostModel.countDocuments({ contentType: "news" }),
    CategoryModel.countDocuments(),
    RedirectModel.countDocuments({ active: true }),
    Lead.countDocuments({ isArchived: { $ne: true } }),
    MessageModel.countDocuments(),
    newsLatterModel.countDocuments({ status: "subscriber" }),
    ActivityLog.find({ module: /^mcp:/ })
      .select("userID module action resourceId resourceName createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    content: {
      totalPosts,
      blogPosts,
      newsPosts,
      categories,
    },
    website: {
      activeRedirects: redirects,
      users,
      activeLeads: leads,
      inboxMessages: messages,
      newsletterSubscribers: subscribers,
    },
    recentMcpActivity,
  };
};

// ── Tool Execution Handler ──────────────────────────────────────────────────
export const handle = async (toolName, args, context) => {
  try {
    await connectDB();
    const actor = context.actor;

    // ── 1. Health & Dashboard ───────────────────────────────────────────────
    if (toolName === "kraviona_health_check") {
      const db = await pingDB();
      const mem = process.memoryUsage();
      return successResult(
        {
          success: true,
          status: "healthy",
          server: {
            name: config.name,
            version: config.version,
            uptimeSeconds: Math.floor(process.uptime()),
            nodeVersion: process.version,
            memoryMb: {
              rss: Math.round(mem.rss / 1024 / 1024),
              heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
              heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
            },
          },
          database: db,
          authenticatedAdmin: {
            id: actor.id,
            email: actor.email,
            role: actor.role,
          },
        },
        "Kraviona Remote MCP Health Status",
      );
    }

    if (toolName === "kraviona_get_dashboard") {
      const data = await getDashboardData();
      return successResult(
        { success: true, dashboard: data },
        "Kraviona Admin Dashboard",
      );
    }

    // ── 2. Posts (Blog & News) ──────────────────────────────────────────────
    if (toolName === "kraviona_list_posts") {
      const filters = {};
      if (args.contentType && args.contentType !== "all") {
        filters.contentType = args.contentType;
      }
      if (args.categoryID) {
        filters.categoryID = args.categoryID;
      }
      if (args.status) {
        filters.status = args.status;
      }

      const result = await listRecords("posts", {
        page: args.page || 1,
        limit: args.limit || 20,
        search: args.search,
        filters,
        sortBy: args.sortBy || "createdAt",
        sortOrder: args.sortOrder || "desc",
      });
      return successResult(
        { success: true, ...result },
        `Found ${result.pagination.total} posts`,
      );
    }

    if (toolName === "kraviona_get_post") {
      const post = await getRecord("posts", args);
      return successResult(
        { success: true, post },
        `Post: ${post.title}`,
      );
    }

    if (toolName === "kraviona_create_post") {
      const post = await createRecord("posts", args, actor);
      return successResult(
        { success: true, post },
        `Post '${post.title}' successfully created as ${post.contentType || "blog"}`,
      );
    }

    if (toolName === "kraviona_update_post") {
      const { id, slug, changes } = args;
      const post = await updateRecord("posts", { id, slug }, changes, actor);
      return successResult(
        { success: true, post },
        `Post '${post.title}' successfully updated`,
      );
    }

    if (toolName === "kraviona_delete_post") {
      const { id, slug, confirmation } = args;
      const result = await deleteRecord("posts", { id, slug }, confirmation, actor);
      return successResult(
        { success: true, ...result },
        "Post permanently deleted",
      );
    }

    // ── 3. Categories ───────────────────────────────────────────────────────
    if (toolName === "kraviona_list_categories") {
      const filters = {};
      if (args.contentType && args.contentType !== "all") {
        filters.contentType = args.contentType;
      }
      if (args.status) {
        filters.status = args.status;
      }

      const result = await listRecords("categories", {
        page: args.page || 1,
        limit: args.limit || 50,
        search: args.search,
        filters,
      });
      return successResult(
        { success: true, ...result },
        `Found ${result.pagination.total} categories`,
      );
    }

    if (toolName === "kraviona_get_category") {
      const category = await getRecord("categories", args);
      return successResult({ success: true, category }, `Category: ${category.name}`);
    }

    if (toolName === "kraviona_create_category") {
      const category = await createRecord("categories", args, actor);
      return successResult({ success: true, category }, `Category '${category.name}' created`);
    }

    if (toolName === "kraviona_update_category") {
      const { id, slug, changes } = args;
      const category = await updateRecord("categories", { id, slug }, changes, actor);
      return successResult({ success: true, category }, `Category '${category.name}' updated`);
    }

    if (toolName === "kraviona_delete_category") {
      const { id, slug, confirmation } = args;
      const result = await deleteRecord("categories", { id, slug }, confirmation, actor);
      return successResult({ success: true, ...result }, "Category permanently deleted");
    }

    // ── 4. SEO & Robots & LLMs ───────────────────────────────────────────────
    if (toolName === "kraviona_get_seo_settings") {
      const setting = await SiteSettingModel.findOne({ key: "seoSettings" }).lean();
      const defaultSeo = {
        metaTitle: "Web Development & Technical SEO Agency Delhi NCR | Kraviona",
        metaDescription: "Next.js and MERN web development plus technical SEO services for ambitious businesses. Build faster, rank better, and convert more visitors.",
        keywords: ["Kraviona", "MERN Stack Development", "Technical SEO", "Next.js", "AI Automation"],
        canonicalBaseUrl: "https://kraviona.com",
        siteName: "Kraviona Tech Solutions",
        twitterHandle: "@KravionaTech",
      };
      return successResult(
        {
          success: true,
          seoSettings: setting?.value || defaultSeo,
          isCustomOverride: Boolean(setting?.value),
          updatedAt: setting?.updatedAt || null,
        },
        "Global SEO Settings",
      );
    }

    if (toolName === "kraviona_update_seo_settings") {
      const updated = await SiteSettingModel.findOneAndUpdate(
        { key: "seoSettings" },
        { $set: { value: args, updatedBy: actor.id } },
        { upsert: true, new: true, runValidators: true }
      ).lean();

      await ActivityLog.create({
        userID: actor.id,
        module: "mcp:seoSettings",
        action: "update",
        after: args,
      }).catch(() => null);

      return successResult(
        { success: true, seoSettings: updated.value, updatedAt: updated.updatedAt },
        "Global SEO Settings updated successfully",
      );
    }

    if (toolName === "kraviona_get_robots") {
      const setting = await SiteSettingModel.findOne({ key: "robotsOverride" }).lean();
      const staticDefault = "User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nSitemap: https://kraviona.com/sitemap.xml";
      return successResult(
        {
          success: true,
          content: setting?.value || staticDefault,
          isCustomOverride: Boolean(setting?.value),
          updatedAt: setting?.updatedAt || null,
        },
        "Robots.txt Directives",
      );
    }

    if (toolName === "kraviona_update_robots") {
      const updated = await SiteSettingModel.findOneAndUpdate(
        { key: "robotsOverride" },
        { $set: { value: args.content, updatedBy: actor.id } },
        { upsert: true, new: true, runValidators: true }
      ).lean();

      await ActivityLog.create({
        userID: actor.id,
        module: "mcp:robots",
        action: "update",
        after: { content: args.content },
      }).catch(() => null);

      return successResult(
        { success: true, content: updated.value, updatedAt: updated.updatedAt },
        "Robots.txt updated in database",
      );
    }

    if (toolName === "kraviona_get_llms") {
      const setting = await SiteSettingModel.findOne({ key: "llmsOverride" }).lean();
      return successResult(
        {
          success: true,
          content: setting?.value || null,
          isCustomOverride: Boolean(setting?.value),
          defaultBehavior: "Dynamically generated by Next.js at /llms.txt indexing published articles and services",
          sampleUrl: "https://kraviona.com/llms.txt",
          updatedAt: setting?.updatedAt || null,
        },
        "LLMs.txt Directives",
      );
    }

    if (toolName === "kraviona_update_llms") {
      const updated = await SiteSettingModel.findOneAndUpdate(
        { key: "llmsOverride" },
        { $set: { value: args.content, updatedBy: actor.id } },
        { upsert: true, new: true, runValidators: true }
      ).lean();

      await ActivityLog.create({
        userID: actor.id,
        module: "mcp:llms",
        action: "update",
        after: { content: args.content },
      }).catch(() => null);

      return successResult(
        { success: true, content: updated.value, updatedAt: updated.updatedAt },
        "LLMs.txt updated in database",
      );
    }

    // ── 5. Code Injection ───────────────────────────────────────────────────
    if (toolName === "kraviona_get_code_injection") {
      const keys = ["headerCode", "bodyCode", "footerCode"];
      const settings = await SiteSettingModel.find({ key: { $in: keys } }).lean();
      const result = { headerCode: "", bodyCode: "", footerCode: "" };
      settings.forEach((s) => { result[s.key] = s.value || ""; });

      return successResult(
        { success: true, codeInjection: result },
        "Website Code Injection Snippets",
      );
    }

    if (toolName === "kraviona_update_code_injection") {
      const updates = {};
      for (const field of ["headerCode", "bodyCode", "footerCode"]) {
        if (args[field] !== undefined) {
          await SiteSettingModel.findOneAndUpdate(
            { key: field },
            { $set: { value: args[field], updatedBy: actor.id } },
            { upsert: true, new: true }
          );
          updates[field] = args[field];
        }
      }

      await ActivityLog.create({
        userID: actor.id,
        module: "mcp:codeInjection",
        action: "update",
        after: updates,
      }).catch(() => null);

      return successResult(
        { success: true, updatedFields: Object.keys(updates) },
        "Code injection updated successfully",
      );
    }

    // ── 6. Redirects ────────────────────────────────────────────────────────
    if (toolName === "kraviona_list_redirects") {
      const filter = {};
      if (args.type) filter.type = args.type;
      if (args.active !== undefined) filter.active = args.active;
      if (args.search) {
        filter.$or = [
          { source: { $regex: args.search, $options: "i" } },
          { destination: { $regex: args.search, $options: "i" } },
        ];
      }

      const page = Math.max(1, args.page || 1);
      const limit = Math.min(100, Math.max(1, args.limit || 50));
      const skip = (page - 1) * limit;

      const [redirects, total] = await Promise.all([
        RedirectModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        RedirectModel.countDocuments(filter),
      ]);

      return successResult(
        {
          success: true,
          redirects,
          pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        },
        `Found ${total} redirects`,
      );
    }

    if (toolName === "kraviona_get_redirect") {
      const query = args.id ? { _id: args.id } : { source: args.source };
      const redirect = await RedirectModel.findOne(query).lean();
      if (!redirect) throw new Error("Redirect rule not found");
      return successResult({ success: true, redirect }, `Redirect: ${redirect.source}`);
    }

    if (toolName === "kraviona_create_redirect") {
      const redirect = await createRecord("redirects", args, actor);
      return successResult(
        { success: true, redirect },
        `Redirect created: ${redirect.source} -> ${redirect.destination}`,
      );
    }

    if (toolName === "kraviona_update_redirect") {
      const { id, changes } = args;
      const redirect = await updateRecord("redirects", { id }, changes, actor);
      return successResult(
        { success: true, redirect },
        `Redirect updated: ${redirect.source} -> ${redirect.destination}`,
      );
    }

    if (toolName === "kraviona_delete_redirect") {
      const { id, confirmation } = args;
      const result = await deleteRecord("redirects", { id }, confirmation, actor);
      return successResult({ success: true, ...result }, "Redirect deleted");
    }

    if (toolName === "kraviona_validate_redirect") {
      const source = String(args.source || "").trim();
      const destination = String(args.destination || "").trim();
      const issues = [];

      if (!source.startsWith("/")) issues.push("Source path must start with '/'");
      if (source === destination) issues.push("Direct redirect loop: Source and destination are identical");

      const existingSource = await RedirectModel.findOne({ source }).lean();
      if (existingSource) {
        issues.push(`Duplicate: An active redirect already exists for source '${source}' -> '${existingSource.destination}'`);
      }

      const chained = await RedirectModel.findOne({ source: destination }).lean();
      if (chained) {
        issues.push(`Redirect chain detected: Destination '${destination}' is already redirected to '${chained.destination}'`);
      }

      const reverse = await RedirectModel.findOne({ source: destination, destination: source }).lean();
      if (reverse) {
        issues.push(`Circular loop: '${destination}' currently redirects back to '${source}'`);
      }

      const isValid = issues.length === 0;
      return successResult(
        {
          success: true,
          isValid,
          source,
          destination,
          issues,
          recommendation: isValid
            ? "Redirect rule is safe to create."
            : `Resolve issues before creating: ${issues.join("; ")}`,
        },
        `Redirect validation: ${isValid ? "PASS" : "FAIL"}`,
      );
    }

    // ── 7. CRM & Search ─────────────────────────────────────────────────────
    if (toolName === "kraviona_list_leads") {
      const result = await listRecords("leads", args);
      return successResult({ success: true, ...result }, "Leads list");
    }

    if (toolName === "kraviona_get_lead") {
      const lead = await getRecord("leads", args);
      return successResult({ success: true, lead }, "Lead details");
    }

    if (toolName === "kraviona_add_lead_activity") {
      const result = await addLeadActivity(args, actor);
      return successResult({ success: true, ...result }, "Lead activity added");
    }

    if (toolName === "kraviona_search_data") {
      const names = ["posts", "categories", "redirects", "leads", "services", "team_members"];
      const entries = await Promise.all(
        names.map(async (name) => {
          const result = await listRecords(name, { search: args.query, limit: args.limit || 5 });
          return [name, result.records];
        })
      );
      const results = Object.fromEntries(entries);
      return successResult(
        {
          success: true,
          query: args.query,
          results,
        },
        `Search completed for: ${args.query}`,
      );
    }

    throw new Error(`Unknown admin MCP tool: ${toolName}`);
  } catch (error) {
    return errorResultFrom(error);
  }
};

export const statusWithoutDatabase = () => ({
  server: { name: config.name, version: config.version },
  database: getDBStatus(),
});
