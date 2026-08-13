import bcrypt from "bcryptjs";
import { Auth } from "../backend/src/models/auth/auth.models.js";
import { LoginHistory } from "../backend/src/models/auth/login-history.model.js";
import { ActivityLog } from "../backend/src/models/analytics/activity-log.model.js";
import { CategoryModel } from "../backend/src/models/blog/category.model.js";
import { CommentModel } from "../backend/src/models/blog/comment.js";
import { PostModel } from "../backend/src/models/blog/post.model.js";
import { PostReactionModel } from "../backend/src/models/blog/reaction.model.js";
import Lead from "../backend/src/models/leads/lead.model.js";
import { mediaModel } from "../backend/src/models/media/media.model.js";
import { MessageModel } from "../backend/src/models/messages/message.model.js";
import { newsLatterModel } from "../backend/src/models/newslatter/newslatter.model.js";
import { Project } from "../backend/src/models/portfolio/project.model.js";
import { Service } from "../backend/src/models/services/service.model.js";
import { TeamMemberModel } from "../backend/src/models/team/team.model.js";

const CRUD = ["list", "get", "create", "update", "delete"];
const READ_ONLY = ["list", "get"];
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const actorProfile = (actor) => ({
  name: actor.name,
  email: actor.email,
  username: actor.username,
});

const withActor = (payload, actor, { userID, createdBy, authorDetails } = {}) => {
  const result = { ...payload };
  if (userID && !result[userID]) result[userID] = actor.id;
  if (createdBy && !result[createdBy]) result[createdBy] = actor.id;
  if (authorDetails && !result[authorDetails]) {
    result[authorDetails] = actorProfile(actor);
  }
  return result;
};

const prepareUserCreate = async (payload) => {
  if (!passwordPattern.test(String(payload.password || ""))) {
    throw new Error(
      "Password must contain at least 8 characters, uppercase, lowercase, number, and special character",
    );
  }
  return { ...payload, password: await bcrypt.hash(payload.password, 12) };
};

const prepareUserUpdate = async (payload) => {
  if (payload.password === undefined) return payload;
  if (!passwordPattern.test(String(payload.password || ""))) {
    throw new Error(
      "Password must contain at least 8 characters, uppercase, lowercase, number, and special character",
    );
  }
  return { ...payload, password: await bcrypt.hash(payload.password, 12) };
};

const definitions = [
  {
    name: "users",
    singular: "user",
    model: Auth,
    capabilities: CRUD,
    searchFields: ["name", "email", "username", "phone", "profile.jobTitle"],
    filterFields: ["role", "isActive", "isVerified"],
    projection:
      "name email username phone avatar role isActive isVerified lastLoginAt profile preferences createdAt updatedAt",
    redactedPaths: [
      "password",
      "passwordResetToken",
      "passwordResetExpires",
      "verification",
      "loginAttempts",
      "lockUntil",
    ],
    serverManagedPaths: [
      "lastLoginAt",
      "loginAttempts",
      "lockUntil",
      "passwordResetToken",
      "passwordResetExpires",
      "verification",
      "authProviders",
    ],
    requiredCreatePaths: ["password"],
    prepareCreate: prepareUserCreate,
    prepareUpdate: prepareUserUpdate,
  },
  {
    name: "categories",
    singular: "category",
    model: CategoryModel,
    capabilities: CRUD,
    autoSlug: true,
    searchFields: ["name", "description", "metaTitle", "metaDescription"],
    filterFields: ["status", "userID"],
    projection:
      "name slug description image status postCount metaTitle metaDescription userID authorDetails createdAt updatedAt",
    serverManagedPaths: ["userID", "authorDetails", "postCount"],
    prepareCreate: (payload, actor) =>
      withActor(payload, actor, {
        userID: "userID",
        authorDetails: "authorDetails",
      }),
  },
  {
    name: "posts",
    singular: "post",
    model: PostModel,
    capabilities: CRUD,
    autoSlug: true,
    searchFields: [
      "title",
      "excerpt",
      "content",
      "tags",
      "keywords",
      "focusKeywords",
    ],
    filterFields: [
      "status",
      "categoryID",
      "language",
      "contentSourceType",
      "isNoIndex",
    ],
    projection:
      "title slug excerpt quickAnswer tags wordCount readingTimeMinutes author category categoryID featuredImage status publishedAt scheduledAt metaTitle metaDescription schemaType isNoIndex language contentSourceType userID createdAt updatedAt",
    serverManagedPaths: ["userID", "wordCount", "readingTimeMinutes", "previousSlugs"],
    immutablePaths: ["slug", "createdAt", "publishedAt"],
    prepareCreate: (payload, actor) => ({
      ...withActor(payload, actor, { userID: "userID" }),
      author: payload.author || {
        ...actorProfile(actor),
        jobTitle: "Kraviona Administrator",
      },
    }),
    syncCategoryCount: true,
  },
  {
    name: "comments",
    singular: "comment",
    model: CommentModel,
    capabilities: ["list", "get", "update", "delete"],
    searchFields: ["postSlug", "authorName", "comment"],
    filterFields: ["status", "postSlug", "postID"],
    projection:
      "postID postSlug authorName website comment status likes createdAt updatedAt",
    redactedPaths: ["email", "ipHash", "userAgent"],
    serverManagedPaths: ["email", "ipHash", "userAgent"],
  },
  {
    name: "post_reactions",
    singular: "post_reaction",
    model: PostReactionModel,
    capabilities: ["list", "get", "delete"],
    searchFields: ["postSlug", "visitorId", "shareChannel"],
    filterFields: ["type", "postSlug", "postID"],
    projection:
      "postID postSlug visitorId type shareChannel createdAt updatedAt",
    redactedPaths: ["ipHash", "userAgent"],
    serverManagedPaths: ["ipHash", "userAgent"],
  },
  {
    name: "leads",
    singular: "lead",
    model: Lead,
    capabilities: CRUD,
    searchFields: [
      "name",
      "email",
      "phone",
      "company",
      "subject",
      "service",
      "tags",
    ],
    filterFields: ["status", "source", "isArchived", "assignedTo"],
    projection:
      "name email phone company designation subject leadType service budget status source score dealValue currency expectedCloseDate assignedTo tags isArchived convertedAt createdAt updatedAt",
    serverManagedPaths: ["activities", "convertedAt"],
  },
  {
    name: "messages",
    singular: "message",
    model: MessageModel,
    capabilities: CRUD,
    searchFields: ["firstName", "lastName", "email", "phone", "subject", "message"],
    filterFields: ["status"],
    projection:
      "firstName lastName email phone subject status createdAt updatedAt",
  },
  {
    name: "newsletter_subscriptions",
    singular: "newsletter_subscription",
    model: newsLatterModel,
    capabilities: CRUD,
    searchFields: ["email"],
    filterFields: ["status"],
    projection: "email status createdAt updatedAt",
  },
  {
    name: "media",
    singular: "media_item",
    model: mediaModel,
    capabilities: ["list", "get", "create", "update"],
    searchFields: ["fileName", "originalName", "altText", "fileUrl"],
    filterFields: ["mediaType", "isDeleted", "userID"],
    serverManagedPaths: ["userID", "authorDetails"],
    prepareCreate: (payload, actor) =>
      withActor(payload, actor, {
        userID: "userID",
        authorDetails: "authorDetails",
      }),
  },
  {
    name: "team_members",
    singular: "team_member",
    model: TeamMemberModel,
    capabilities: CRUD,
    autoSlug: true,
    searchFields: ["name", "email", "designation", "department", "bio", "skills"],
    filterFields: ["status", "department", "isFeatured", "userID"],
    projection:
      "name slug email phone designation department avatar skills socialLinks order isFeatured status userID createdAt updatedAt",
    serverManagedPaths: ["userID"],
    prepareCreate: (payload, actor) =>
      withActor(payload, actor, { userID: "userID" }),
  },
  {
    name: "services",
    singular: "service",
    model: Service,
    capabilities: CRUD,
    autoSlug: true,
    searchFields: ["title", "category", "description", "features", "seo.keywords"],
    filterFields: ["category", "isFeatured", "isActive", "createdBy"],
    projection:
      "title slug category description features seo isFeatured isActive order createdBy createdAt updatedAt",
    serverManagedPaths: ["createdBy"],
    prepareCreate: (payload, actor) =>
      withActor(payload, actor, { createdBy: "createdBy" }),
  },
  {
    name: "projects",
    singular: "project",
    model: Project,
    capabilities: CRUD,
    autoSlug: true,
    searchFields: ["title", "category", "description", "overview", "techStack"],
    filterFields: ["category", "isFeatured", "isActive", "createdBy"],
    projection:
      "title slug category image imageAlt description results techStack projectUrl isActive isFeatured order createdBy createdAt updatedAt",
    serverManagedPaths: ["createdBy"],
    prepareCreate: (payload, actor) =>
      withActor(payload, actor, { createdBy: "createdBy" }),
  },
  {
    name: "login_history",
    singular: "login_event",
    model: LoginHistory,
    capabilities: READ_ONLY,
    searchFields: ["ipAddress", "userAgent", "method"],
    filterFields: ["user", "method"],
    projection: "user ipAddress userAgent method createdAt updatedAt",
  },
  {
    name: "activity_logs",
    singular: "activity_log",
    model: ActivityLog,
    capabilities: READ_ONLY,
    searchFields: ["module", "action", "resourceId", "resourceName"],
    filterFields: ["userID", "module", "action"],
    projection:
      "userID module action resourceId resourceName ipAddress userAgent before after createdAt updatedAt",
  },
];

export const resources = Object.freeze(
  Object.fromEntries(definitions.map((definition) => [definition.name, definition])),
);

export const resourceNames = Object.freeze(Object.keys(resources));

export const getResource = (name) => {
  const resource = resources[name];
  if (!resource) {
    throw new Error(
      `Unknown admin resource: ${name}. Available: ${resourceNames.join(", ")}`,
    );
  }
  return resource;
};

