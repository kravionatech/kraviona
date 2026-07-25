import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { CategoryModel } from "../../backend/src/models/blog/category.model.js";
import { CommentModel } from "../../backend/src/models/blog/comment.js";
import { PostModel } from "../../backend/src/models/blog/post.model.js";
import Lead from "../../backend/src/models/leads/lead.model.js";
import { mediaModel } from "../../backend/src/models/media/media.model.js";
import { MessageModel } from "../../backend/src/models/messages/message.model.js";
import { newsLatterModel } from "../../backend/src/models/newslatter/newslatter.model.js";
import { TeamMemberModel } from "../../backend/src/models/team/team.model.js";
import { config, assertWriteAllowed } from "../config.js";
import { connectDB, getDBStatus, pingDB } from "../db.js";
import {
  errorResult,
  errorResultFrom,
  successResult,
} from "../lib/results.js";

const readAnnotations = (title) => ({
  title,
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
});

const writeAnnotations = (title) => ({
  title,
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: false,
});

export const tools = [
  {
    name: "get_server_status",
    description:
      "Check whether the Kraviona MCP server and its shared backend database connection are healthy",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: readAnnotations("Kraviona MCP status"),
  },
  {
    name: "get_business_overview",
    description:
      "Get a compact management dashboard with content, CRM, inbox, audience, media, user, and team totals",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
    annotations: readAnnotations("Kraviona business overview"),
  },
  {
    name: "get_pending_work",
    description:
      "Show work needing attention: new leads, unread messages, pending comments, drafts, and scheduled posts",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 25,
          description: "Recent items per section (default 5)",
        },
      },
      additionalProperties: false,
    },
    annotations: readAnnotations("Kraviona pending work"),
  },
  {
    name: "search_business_data",
    description:
      "Search across Kraviona posts, categories, leads, messages, team members, and users in one request",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          minLength: 2,
          maxLength: 200,
          description: "Text to find (literal, case-insensitive)",
        },
        resources: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "posts",
              "categories",
              "leads",
              "messages",
              "team_members",
              "users",
            ],
          },
          uniqueItems: true,
          description: "Optional resource subset; defaults to all",
        },
        limit: {
          type: "integer",
          minimum: 1,
          maximum: 20,
          description: "Maximum results per resource (default 5)",
        },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: readAnnotations("Search Kraviona business data"),
  },
  {
    name: "add_lead_activity",
    description:
      "Append a note, call, email, meeting, status-change, or other activity to a lead without replacing its existing timeline",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          minLength: 1,
          description: "Lead MongoDB ObjectId",
        },
        type: {
          type: "string",
          enum: ["note", "call", "email", "meeting", "status_change", "other"],
        },
        description: {
          type: "string",
          minLength: 1,
          maxLength: 2000,
        },
        performedBy: {
          type: "string",
          description: "Optional user MongoDB ObjectId",
        },
      },
      required: ["id", "type", "description"],
      additionalProperties: false,
    },
    annotations: writeAnnotations("Add lead activity"),
  },
];

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const groupedCounts = async (model, field = "status", match = {}) => {
  const rows = await model.aggregate([
    { $match: match },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  return Object.fromEntries(
    rows.map((row) => [row._id ?? "unknown", row.count]),
  );
};

const searchTasks = (regex, limit) => ({
  posts: () =>
    PostModel.find({
      $or: [
        { title: regex },
        { excerpt: regex },
        { tags: regex },
        { keywords: regex },
      ],
    })
      .select(
        "title slug excerpt status category.name author.name publishedAt updatedAt",
      )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean(),
  categories: () =>
    CategoryModel.find({
      $or: [{ name: regex }, { description: regex }],
    })
      .select("name slug description status postCount updatedAt")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean(),
  leads: () =>
    Lead.find({
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
        { company: regex },
        { subject: regex },
        { service: regex },
        { tags: regex },
      ],
    })
      .select(
        "name email phone company subject service status source score dealValue currency isArchived updatedAt",
      )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean(),
  messages: () =>
    MessageModel.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
      ],
    })
      .select("firstName lastName email phone subject status createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
  team_members: () =>
    TeamMemberModel.find({
      $or: [
        { name: regex },
        { designation: regex },
        { department: regex },
        { bio: regex },
        { skills: regex },
      ],
    })
      .select(
        "name slug email designation department skills status isFeatured updatedAt",
      )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean(),
  users: () =>
    Auth.find({
      $or: [
        { name: regex },
        { email: regex },
        { username: regex },
        { phone: regex },
        { "profile.jobTitle": regex },
      ],
    })
      .select(
        "name email username phone role isActive isVerified profile.jobTitle updatedAt",
      )
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean(),
});

const getBusinessOverview = async () => {
  const [
    users,
    posts,
    categories,
    comments,
    leads,
    media,
    messages,
    subscribers,
    teamMembers,
    postStatuses,
    leadStatuses,
    messageStatuses,
    commentStatuses,
    activePipeline,
  ] = await Promise.all([
    Auth.countDocuments(),
    PostModel.countDocuments(),
    CategoryModel.countDocuments(),
    CommentModel.countDocuments(),
    Lead.countDocuments({ isArchived: { $ne: true } }),
    mediaModel.countDocuments({ isDeleted: { $ne: true } }),
    MessageModel.countDocuments(),
    newsLatterModel.countDocuments({ status: "subscriber" }),
    TeamMemberModel.countDocuments({ status: "active" }),
    groupedCounts(PostModel),
    groupedCounts(Lead, "status", { isArchived: { $ne: true } }),
    groupedCounts(MessageModel),
    groupedCounts(CommentModel),
    Lead.aggregate([
      {
        $match: {
          isArchived: { $ne: true },
          status: { $in: ["Qualified", "Proposal"] },
        },
      },
      {
        $group: {
          _id: "$currency",
          total: { $sum: "$dealValue" },
          deals: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users,
      posts,
      categories,
      comments,
      activeLeads: leads,
      activeMedia: media,
      messages,
      activeSubscribers: subscribers,
      activeTeamMembers: teamMembers,
    },
    workflows: {
      posts: postStatuses,
      leads: leadStatuses,
      messages: messageStatuses,
      comments: commentStatuses,
    },
    activePipeline: activePipeline.map((row) => ({
      currency: row._id || "INR",
      value: row.total,
      deals: row.deals,
    })),
  };
};

const getPendingWork = async (requestedLimit) => {
  const limit = Math.min(25, Math.max(1, Number(requestedLimit) || 5));
  const [
    newLeadCount,
    unreadMessageCount,
    pendingCommentCount,
    draftPostCount,
    scheduledPostCount,
    newLeads,
    unreadMessages,
    pendingComments,
    draftPosts,
    scheduledPosts,
  ] = await Promise.all([
    Lead.countDocuments({ status: "New", isArchived: { $ne: true } }),
    MessageModel.countDocuments({ status: "unread" }),
    CommentModel.countDocuments({ status: "pending" }),
    PostModel.countDocuments({ status: "draft" }),
    PostModel.countDocuments({ status: "scheduled" }),
    Lead.find({ status: "New", isArchived: { $ne: true } })
      .select("name email phone company subject service score createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    MessageModel.find({ status: "unread" })
      .select("firstName lastName email phone subject createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    CommentModel.find({ status: "pending" })
      .select("postSlug authorName comment createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
    PostModel.find({ status: "draft" })
      .select("title slug author.name updatedAt")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean(),
    PostModel.find({ status: "scheduled" })
      .select("title slug scheduledAt author.name updatedAt")
      .sort({ scheduledAt: 1 })
      .limit(limit)
      .lean(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    counts: {
      newLeads: newLeadCount,
      unreadMessages: unreadMessageCount,
      pendingComments: pendingCommentCount,
      draftPosts: draftPostCount,
      scheduledPosts: scheduledPostCount,
      total:
        newLeadCount +
        unreadMessageCount +
        pendingCommentCount +
        draftPostCount +
        scheduledPostCount,
    },
    recent: {
      newLeads,
      unreadMessages,
      pendingComments,
      draftPosts,
      scheduledPosts,
    },
  };
};

export const handle = async (toolName, args = {}) => {
  try {
    if (toolName === "get_server_status") {
      try {
        const database = await pingDB();
        return successResult({
          success: true,
          server: {
            name: "kraviona-business-mcp",
            version: "2.0.0",
            transport: "stdio",
            readOnly: config.readOnly,
            deletesEnabled: config.allowDeletes && !config.readOnly,
          },
          database,
        });
      } catch (error) {
        return successResult({
          success: false,
          server: {
            name: "kraviona-business-mcp",
            version: "2.0.0",
            transport: "stdio",
            readOnly: config.readOnly,
            deletesEnabled: config.allowDeletes && !config.readOnly,
          },
          database: getDBStatus(),
          error: error.message,
        });
      }
    }

    await connectDB();

    if (toolName === "get_business_overview") {
      return successResult({
        success: true,
        overview: await getBusinessOverview(),
      });
    }

    if (toolName === "get_pending_work") {
      return successResult({
        success: true,
        pendingWork: await getPendingWork(args.limit),
      });
    }

    if (toolName === "search_business_data") {
      const query = args.query?.trim();
      if (!query || query.length < 2) {
        return errorResult("Search query must contain at least 2 characters");
      }

      const limit = Math.min(20, Math.max(1, Number(args.limit) || 5));
      const regex = new RegExp(escapeRegex(query), "i");
      const tasks = searchTasks(regex, limit);
      const resources = args.resources?.length
        ? args.resources
        : Object.keys(tasks);
      const entries = await Promise.all(
        resources.map(async (resource) => [resource, await tasks[resource]()]),
      );
      const results = Object.fromEntries(entries);

      return successResult({
        success: true,
        query,
        resultCount: Object.values(results).reduce(
          (total, values) => total + values.length,
          0,
        ),
        results,
      });
    }

    if (toolName === "add_lead_activity") {
      assertWriteAllowed("add lead activity");
      if (!Lead.db.base.isValidObjectId(args.id)) {
        return errorResult(`Invalid lead id: ${args.id}`);
      }
      if (
        args.performedBy &&
        !Lead.db.base.isValidObjectId(args.performedBy)
      ) {
        return errorResult(`Invalid performedBy user id: ${args.performedBy}`);
      }

      const lead = await Lead.findById(args.id);
      if (!lead) return errorResult("lead not found");
      lead.activities.push({
        type: args.type,
        description: args.description.trim(),
        performedBy: args.performedBy,
      });
      await lead.save();
      const activity = lead.activities.at(-1);

      return successResult({
        success: true,
        message: "Lead activity added",
        lead: {
          id: lead._id.toString(),
          name: lead.name,
          status: lead.status,
        },
        activity,
      });
    }

    return errorResult(`Unknown tool: ${toolName}`);
  } catch (error) {
    return errorResultFrom(error);
  }
};
