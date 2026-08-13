import { ActivityLog } from "../../backend/src/models/analytics/activity-log.model.js";
import { CategoryModel } from "../../backend/src/models/blog/category.model.js";
import { CommentModel } from "../../backend/src/models/blog/comment.js";
import { PostModel } from "../../backend/src/models/blog/post.model.js";
import Lead from "../../backend/src/models/leads/lead.model.js";
import { mediaModel } from "../../backend/src/models/media/media.model.js";
import { MessageModel } from "../../backend/src/models/messages/message.model.js";
import { newsLatterModel } from "../../backend/src/models/newslatter/newslatter.model.js";
import { Project } from "../../backend/src/models/portfolio/project.model.js";
import { Service } from "../../backend/src/models/services/service.model.js";
import { TeamMemberModel } from "../../backend/src/models/team/team.model.js";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
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

const identifierSchema = (resource) => {
  const properties = {
    id: {
      type: "string",
      pattern: "^[a-fA-F0-9]{24}$",
      description: `${resource.singular} MongoDB ObjectId`,
    },
  };
  if (resource.model.schema.path("slug")) {
    properties.slug = {
      type: "string",
      minLength: 1,
      description: `${resource.singular} slug`,
    };
  }
  return {
    properties,
    anyOf: Object.keys(properties).map((key) => ({ required: [key] })),
  };
};

const primitiveFilterSchema = (schemaType = {}) => {
  if (schemaType.enumValues?.length) {
    return { type: "string", enum: [...schemaType.enumValues] };
  }
  switch (schemaType.instance) {
    case "Boolean":
      return { type: "boolean" };
    case "Number":
      return { type: "number" };
    case "ObjectId":
      return { type: "string", pattern: "^[a-fA-F0-9]{24}$" };
    default:
      return { type: "string" };
  }
};

const listInputSchema = (resource) => ({
  type: "object",
  properties: {
    page: { type: "integer", minimum: 1, default: 1 },
    limit: { type: "integer", minimum: 1, maximum: 100, default: 20 },
    search: {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description: `Literal case-insensitive search across ${(resource.searchFields || []).join(", ")}`,
    },
    filters: {
      type: "object",
      properties: Object.fromEntries(
        (resource.filterFields || []).map((field) => [
          field,
          primitiveFilterSchema(resource.model.schema.path(field)),
        ]),
      ),
      additionalProperties: false,
    },
    sortBy: {
      type: "string",
      enum: [
        "createdAt",
        "updatedAt",
        "publishedAt",
        "scheduledAt",
        "title",
        "name",
        "status",
        "order",
        "score",
      ],
      default: "createdAt",
    },
    sortOrder: { type: "string", enum: ["asc", "desc"], default: "desc" },
  },
  additionalProperties: false,
});

const baseTools = [
  {
    name: "get_admin_session",
    description:
      "Show the verified Kraviona admin identity attached to this MCP process and the active safety policy",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Admin MCP session", readOnly: true }),
  },
  {
    name: "describe_admin_resources",
    description:
      "List every Kraviona admin data resource, supported operation, identifier, filter, and immutable field",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Describe admin resources", readOnly: true }),
  },
  {
    name: "describe_admin_resource",
    description:
      "Return exact create and update JSON Schemas generated from the live backend Mongoose model. Call this before a create or complex update",
    inputSchema: {
      type: "object",
      properties: {
        resource: { type: "string", enum: resourceNames },
      },
      required: ["resource"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Describe one admin resource", readOnly: true }),
  },
  {
    name: "get_admin_dashboard",
    description:
      "Get an admin overview covering content, CRM, inbox, audience, media, catalog, team, and recent audited MCP activity",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: annotations({ title: "Kraviona admin dashboard", readOnly: true }),
  },
  {
    name: "search_admin_data",
    description:
      "Search several Kraviona admin resources in one request using literal case-insensitive text matching",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", minLength: 2, maxLength: 200 },
        resources: {
          type: "array",
          items: { type: "string", enum: resourceNames },
          uniqueItems: true,
        },
        limit: { type: "integer", minimum: 1, maximum: 20, default: 5 },
      },
      required: ["query"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Search admin data", readOnly: true }),
  },
  {
    name: "add_lead_activity",
    description:
      "Append an audited note, call, email, meeting, status change, or other activity to a lead timeline as the authenticated admin",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", pattern: "^[a-fA-F0-9]{24}$" },
        type: {
          type: "string",
          enum: ["note", "call", "email", "meeting", "status_change", "other"],
        },
        description: { type: "string", minLength: 1, maxLength: 2000 },
      },
      required: ["id", "type", "description"],
      additionalProperties: false,
    },
    annotations: annotations({ title: "Add lead activity" }),
  },
];

const resourceTools = Object.values(resources).flatMap((resource) => {
  const tools = [];
  const identifier = identifierSchema(resource);
  const description = describeResource(resource.name);

  if (resource.capabilities.includes("list")) {
    tools.push({
      name: `list_${resource.name}`,
      description: `List ${resource.name} from the Kraviona admin database with safe pagination, filters, search, and normalized formatting`,
      inputSchema: listInputSchema(resource),
      annotations: annotations({ title: `List ${resource.name}`, readOnly: true }),
    });
  }
  if (resource.capabilities.includes("get")) {
    tools.push({
      name: `get_${resource.singular}`,
      description: `Get one complete ${resource.singular} using its backend identifier; sensitive fields are always redacted`,
      inputSchema: {
        type: "object",
        properties: identifier.properties,
        anyOf: identifier.anyOf,
        additionalProperties: false,
      },
      annotations: annotations({ title: `Get ${resource.singular}`, readOnly: true }),
    });
  }
  if (resource.capabilities.includes("create")) {
    tools.push({
      name: `create_${resource.singular}`,
      description: `Create a ${resource.singular} using the same validated Mongoose schema as the backend. Server-managed admin identity fields are filled automatically`,
      inputSchema: description.createSchema,
      annotations: annotations({ title: `Create ${resource.singular}` }),
    });
  }
  if (resource.capabilities.includes("update")) {
    tools.push({
      name: `update_${resource.singular}`,
      description: `Update only supplied ${resource.singular} fields using the backend schema; immutable and server-managed fields are blocked`,
      inputSchema: {
        type: "object",
        properties: {
          ...identifier.properties,
          changes: description.updateSchema,
        },
        anyOf: identifier.anyOf,
        required: ["changes"],
        additionalProperties: false,
      },
      annotations: annotations({ title: `Update ${resource.singular}` }),
    });
  }
  if (resource.capabilities.includes("delete")) {
    tools.push({
      name: `delete_${resource.singular}`,
      description: `Permanently delete a ${resource.singular}. Requires MCP_ALLOW_DELETES=true plus the exact confirmation phrase`,
      inputSchema: {
        type: "object",
        properties: {
          ...identifier.properties,
          confirmation: {
            type: "string",
            const: "PERMANENTLY_DELETE",
          },
        },
        anyOf: identifier.anyOf,
        required: ["confirmation"],
        additionalProperties: false,
      },
      annotations: annotations({
        title: `Delete ${resource.singular}`,
        destructive: true,
      }),
    });
  }

  return tools;
});

export const tools = [...baseTools, ...resourceTools];

const dashboard = async () => {
  const [
    users,
    posts,
    categories,
    comments,
    leads,
    messages,
    subscribers,
    media,
    team,
    services,
    projects,
    recentMcpActivity,
  ] = await Promise.all([
    Auth.countDocuments(),
    PostModel.countDocuments(),
    CategoryModel.countDocuments(),
    CommentModel.countDocuments(),
    Lead.countDocuments({ isArchived: { $ne: true } }),
    MessageModel.countDocuments(),
    newsLatterModel.countDocuments({ status: "subscriber" }),
    mediaModel.countDocuments({ isDeleted: { $ne: true } }),
    TeamMemberModel.countDocuments({ status: "active" }),
    Service.countDocuments({ isActive: true }),
    Project.countDocuments({ isActive: true }),
    ActivityLog.find({ module: /^mcp:/ })
      .select("userID module action resourceId resourceName createdAt")
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      users,
      posts,
      categories,
      comments,
      activeLeads: leads,
      messages,
      activeSubscribers: subscribers,
      activeMedia: media,
      activeTeamMembers: team,
      activeServices: services,
      activeProjects: projects,
    },
    recentMcpActivity,
  };
};

export const handle = async (toolName, args, context) => {
  try {
    await connectDB();
    const actor = context.actor;

    if (toolName === "get_admin_session") {
      const database = await pingDB();
      return successResult(
        {
          success: true,
          admin: actor,
          sessionExpiresAt: context.expiresAt,
          policy: {
            readOnly: config.readOnly,
            permanentDeletesEnabled: config.allowDeletes && !config.readOnly,
            allowedRoles: [...config.allowedRoles],
          },
          database,
        },
        "Verified Kraviona admin session",
      );
    }
    if (toolName === "describe_admin_resources") {
      return successResult(
        { success: true, resources: describeResources() },
        "Kraviona admin resource catalog",
      );
    }
    if (toolName === "describe_admin_resource") {
      return successResult(
        { success: true, ...describeResource(args.resource) },
        `${args.resource} backend schema`,
      );
    }
    if (toolName === "get_admin_dashboard") {
      return successResult(
        { success: true, dashboard: await dashboard() },
        "Kraviona admin dashboard",
      );
    }
    if (toolName === "search_admin_data") {
      const names = (args.resources?.length ? args.resources : resourceNames).filter(
        (name) => getResource(name).searchFields?.length,
      );
      const entries = await Promise.all(
        names.map(async (name) => {
          const result = await listRecords(name, {
            search: args.query,
            limit: args.limit || 5,
          });
          return [name, result.records];
        }),
      );
      const results = Object.fromEntries(entries);
      return successResult(
        {
          success: true,
          query: args.query,
          resultCount: Object.values(results).reduce(
            (total, records) => total + records.length,
            0,
          ),
          results,
        },
        `Admin search: ${args.query}`,
      );
    }
    if (toolName === "add_lead_activity") {
      return successResult(
        { success: true, ...(await addLeadActivity(args, actor)) },
        "Lead activity added",
      );
    }

    for (const resource of Object.values(resources)) {
      if (toolName === `list_${resource.name}`) {
        return successResult(
          { success: true, ...(await listRecords(resource.name, args)) },
          `${resource.name} list`,
        );
      }
      if (toolName === `get_${resource.singular}`) {
        return successResult(
          { success: true, ...(await getRecord(resource.name, args)) },
          `${resource.singular} details`,
        );
      }
      if (toolName === `create_${resource.singular}`) {
        return successResult(
          {
            success: true,
            ...(await createRecord(resource.name, args, actor)),
          },
          `${resource.singular} created`,
        );
      }
      if (toolName === `update_${resource.singular}`) {
        const { id, slug, changes } = args;
        return successResult(
          {
            success: true,
            ...(await updateRecord(
              resource.name,
              { id, slug },
              changes,
              actor,
            )),
          },
          `${resource.singular} updated`,
        );
      }
      if (toolName === `delete_${resource.singular}`) {
        const { id, slug, confirmation } = args;
        return successResult(
          {
            success: true,
            ...(await deleteRecord(
              resource.name,
              { id, slug },
              confirmation,
              actor,
            )),
          },
          `${resource.singular} deleted`,
        );
      }
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

