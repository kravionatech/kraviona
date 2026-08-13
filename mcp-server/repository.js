import slugify from "slugify";
import { ActivityLog } from "../backend/src/models/analytics/activity-log.model.js";
import { CategoryModel } from "../backend/src/models/blog/category.model.js";
import { PostModel } from "../backend/src/models/blog/post.model.js";
import { assertDeleteAllowed, assertWriteAllowed } from "./config.js";
import { connectDB } from "./db.js";
import { getResource, resources } from "./catalog.js";
import { schemaForResource, topLevelFields } from "./lib/schema.js";

const DEFAULT_REDACTED = [
  "password",
  "passwordResetToken",
  "passwordResetExpires",
  "verification",
  "loginAttempts",
  "lockUntil",
  "ipHash",
];

const SORT_FIELDS = new Set([
  "createdAt",
  "updatedAt",
  "publishedAt",
  "scheduledAt",
  "title",
  "name",
  "status",
  "order",
  "score",
]);

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toPlain = (value) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(toPlain);
  const document =
    typeof value.toObject === "function"
      ? value.toObject({ virtuals: true, flattenObjectIds: true })
      : value;
  return JSON.parse(JSON.stringify(document));
};

const deletePath = (value, path) => {
  const parts = path.split(".");
  const parent = parts
    .slice(0, -1)
    .reduce((current, part) => current?.[part], value);
  if (parent && typeof parent === "object") delete parent[parts.at(-1)];
};

const clean = (resource, value) => {
  const plain = toPlain(value);
  const redacted = new Set([
    ...DEFAULT_REDACTED,
    ...(resource.redactedPaths || []),
    ...Object.entries(resource.model.schema.paths)
      .filter(([, schemaType]) => schemaType.options?.select === false)
      .map(([path]) => path),
  ]);
  const redact = (entry) => {
    if (!entry || typeof entry !== "object") return entry;
    for (const path of redacted) deletePath(entry, path);
    return entry;
  };
  return Array.isArray(plain) ? plain.map(redact) : redact(plain);
};

const compactAuditValue = (value, depth = 0) => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    return value.length > 1000 ? `${value.slice(0, 1000)}…` : value;
  }
  if (typeof value !== "object") return value;
  if (depth >= 4) return "[nested value omitted]";
  if (Array.isArray(value)) {
    return value.slice(0, 20).map((entry) => compactAuditValue(entry, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value)
      .slice(0, 50)
      .map(([key, entry]) => [key, compactAuditValue(entry, depth + 1)]),
  );
};

const auditIdentity = (record) =>
  compactAuditValue(
    Object.fromEntries(
      ["_id", "title", "name", "email", "slug", "status", "isActive"]
        .filter((field) => record?.[field] !== undefined)
        .map((field) => [field, record[field]]),
    ),
  );

const auditChangedFields = (record, fields) =>
  compactAuditValue(
    Object.fromEntries(
      fields
        .filter((field) => record?.[field] !== undefined)
        .map((field) => [field, record[field]]),
    ),
  );

const queryForIdentifier = (resource, args) => {
  if (args.id) {
    if (!resource.model.db.base.isValidObjectId(args.id)) {
      throw new Error(`Invalid ${resource.singular} id: ${args.id}`);
    }
    return { _id: args.id };
  }
  if (args.slug && resource.model.schema.path("slug")) {
    return { slug: String(args.slug).trim().toLowerCase() };
  }
  throw new Error(`Provide an id${resource.model.schema.path("slug") ? " or slug" : ""}`);
};

const findDocument = async (resource, args) => {
  const query = resource.model.findOne(queryForIdentifier(resource, args));
  const excluded = new Set([
    ...DEFAULT_REDACTED,
    ...(resource.redactedPaths || []),
  ]);
  if (excluded.size) {
    query.select([...excluded].map((path) => `-${path}`).join(" "));
  }
  return query;
};

const assertPayloadFields = (resource, operation, payload) => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`${operation} payload must be an object`);
  }
  const schema = schemaForResource(resource)[operation];
  const allowed = topLevelFields(schema);
  const unknown = Object.keys(payload).filter((key) => !allowed.has(key));
  if (unknown.length) {
    throw new Error(
      `Unsupported ${resource.singular} field(s): ${unknown.join(", ")}. Call describe_admin_resource first.`,
    );
  }
};

const audit = async ({ actor, resource, action, document, before, after }) => {
  if (resource.name === "activity_logs") return;
  await ActivityLog.create({
    userID: actor.id,
    module: `mcp:${resource.name}`,
    action,
    resourceId: document?._id?.toString?.() || "",
    resourceName:
      document?.title ||
      document?.name ||
      document?.slug ||
      document?.email ||
      resource.singular,
    before: before || null,
    after: after || null,
  });
};

const syncCategoryCount = async (...categoryIds) => {
  const ids = [...new Set(categoryIds.filter(Boolean).map(String))];
  for (const id of ids) {
    if (!CategoryModel.db.base.isValidObjectId(id)) continue;
    const postCount = await PostModel.countDocuments({ categoryID: id });
    await CategoryModel.updateOne({ _id: id }, { $set: { postCount } });
  }
};

export const describeResources = () =>
  Object.values(resources).map((resource) => ({
    resource: resource.name,
    singular: resource.singular,
    capabilities: resource.capabilities,
    identifier: resource.model.schema.path("slug")
      ? "MongoDB ObjectId or slug"
      : "MongoDB ObjectId",
    filters: resource.filterFields || [],
    searchableFields: resource.searchFields || [],
    immutableFields: resource.immutablePaths || [],
    serverManagedFields: resource.serverManagedPaths || [],
  }));

export const describeResource = (name) => {
  const resource = getResource(name);
  const schemas = schemaForResource(resource);
  for (const field of resource.requiredCreatePaths || []) {
    if (schemas.create.properties[field]) {
      schemas.create.required ||= [];
      if (!schemas.create.required.includes(field)) {
        schemas.create.required.push(field);
      }
    }
  }
  return {
    resource: resource.name,
    singular: resource.singular,
    capabilities: resource.capabilities,
    createSchema: resource.capabilities.includes("create")
      ? schemas.create
      : null,
    updateSchema: resource.capabilities.includes("update")
      ? schemas.update
      : null,
    filters: resource.filterFields || [],
    searchableFields: resource.searchFields || [],
    immutableFields: resource.immutablePaths || [],
    serverManagedFields: resource.serverManagedPaths || [],
    notes: [
      ...(resource.name === "posts"
        ? ["Published post slugs are immutable and cannot be changed through MCP."]
        : []),
      ...(resource.name === "media"
        ? ["MCP manages media metadata; binary upload remains handled by the admin media uploader."]
        : []),
    ],
  };
};

export const listRecords = async (name, args = {}) => {
  await connectDB();
  const resource = getResource(name);
  const page = Math.max(1, Number(args.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(args.limit) || 20));
  const query = {};

  for (const [field, value] of Object.entries(args.filters || {})) {
    if (!(resource.filterFields || []).includes(field)) {
      throw new Error(`Unsupported ${name} filter: ${field}`);
    }
    query[field] = value;
  }
  if (args.search) {
    if (!(resource.searchFields || []).length) {
      throw new Error(`${name} does not support text search`);
    }
    const regex = new RegExp(escapeRegex(String(args.search).trim()), "i");
    query.$or = resource.searchFields.map((field) => ({ [field]: regex }));
  }

  const sortBy = SORT_FIELDS.has(args.sortBy) ? args.sortBy : "createdAt";
  const sort = { [sortBy]: args.sortOrder === "asc" ? 1 : -1 };
  let findQuery = resource.model
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);
  if (resource.projection) findQuery = findQuery.select(resource.projection);

  const [records, total] = await Promise.all([
    findQuery.lean({ virtuals: true }),
    resource.model.countDocuments(query),
  ]);
  return {
    resource: name,
    records: clean(resource, records),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
    },
  };
};

export const getRecord = async (name, args) => {
  await connectDB();
  const resource = getResource(name);
  const document = await findDocument(resource, args);
  if (!document) throw new Error(`${resource.singular} not found`);
  return { resource: name, record: clean(resource, document) };
};

export const createRecord = async (name, payload, actor) => {
  assertWriteAllowed(`create ${name}`);
  await connectDB();
  const resource = getResource(name);
  if (!resource.capabilities.includes("create")) {
    throw new Error(`${name} is read-only and cannot be created through MCP`);
  }
  assertPayloadFields(resource, "create", payload);

  let data = { ...payload };
  if (resource.autoSlug && !data.slug) {
    const source = data.title || data.name;
    if (source) data.slug = slugify(source, { lower: true, strict: true });
  }
  if (resource.prepareCreate) data = await resource.prepareCreate(data, actor);

  const document = new resource.model(data);
  await document.save();
  if (resource.syncCategoryCount) await syncCategoryCount(document.categoryID);
  const after = clean(resource, document);
  await audit({
    actor,
    resource,
    action: "created",
    document,
    after: auditIdentity(after),
  });
  return { resource: name, record: after };
};

export const updateRecord = async (name, args, changes, actor) => {
  assertWriteAllowed(`update ${name}`);
  await connectDB();
  const resource = getResource(name);
  if (!resource.capabilities.includes("update")) {
    throw new Error(`${name} is read-only and cannot be updated through MCP`);
  }
  assertPayloadFields(resource, "update", changes);
  const document = await findDocument(resource, args);
  if (!document) throw new Error(`${resource.singular} not found`);

  if (
    name === "users" &&
    String(document._id) === actor.id &&
    ((changes.role && changes.role !== actor.role) || changes.isActive === false)
  ) {
    throw new Error("The active MCP admin cannot demote or deactivate itself");
  }

  const beforeCategory = document.categoryID?.toString?.();
  const before = clean(resource, document);
  let updates = { ...changes };
  if (resource.prepareUpdate) {
    updates = await resource.prepareUpdate(updates, actor, document);
  }
  document.set(updates);
  await document.save();
  if (resource.syncCategoryCount) {
    await syncCategoryCount(beforeCategory, document.categoryID);
  }
  const after = clean(resource, document);
  const changedFields = Object.keys(updates);
  await audit({
    actor,
    resource,
    action: "updated",
    document,
    before: auditChangedFields(before, changedFields),
    after: auditChangedFields(after, changedFields),
  });
  return { resource: name, record: after };
};

export const deleteRecord = async (name, args, confirmation, actor) => {
  assertDeleteAllowed();
  await connectDB();
  const resource = getResource(name);
  if (!resource.capabilities.includes("delete")) {
    throw new Error(`${name} cannot be permanently deleted through MCP`);
  }
  if (confirmation !== "PERMANENTLY_DELETE") {
    throw new Error('Permanent deletion requires confirmation="PERMANENTLY_DELETE"');
  }
  const document = await findDocument(resource, args);
  if (!document) throw new Error(`${resource.singular} not found`);
  if (name === "users" && String(document._id) === actor.id) {
    throw new Error("The active MCP admin cannot delete itself");
  }
  if (name === "categories") {
    const posts = await PostModel.countDocuments({ categoryID: document._id });
    if (posts > 0) {
      throw new Error(`Cannot delete category while ${posts} post(s) reference it`);
    }
  }

  const categoryId = document.categoryID?.toString?.();
  const before = clean(resource, document);
  await document.deleteOne();
  if (resource.syncCategoryCount) await syncCategoryCount(categoryId);
  await audit({
    actor,
    resource,
    action: "deleted",
    document,
    before: auditIdentity(before),
  });
  return {
    resource: name,
    deleted: true,
    identifier: document._id.toString(),
  };
};

export const addLeadActivity = async (args, actor) => {
  assertWriteAllowed("add lead activity");
  const resource = getResource("leads");
  const document = await findDocument(resource, { id: args.id });
  if (!document) throw new Error("lead not found");
  const before = {
    status: document.status,
    activityCount: document.activities.length,
  };
  document.activities.push({
    type: args.type,
    description: String(args.description || "").trim(),
    performedBy: actor.id,
  });
  await document.save();
  const after = clean(resource, document);
  const activity = toPlain(document.activities.at(-1));
  await audit({
    actor,
    resource,
    action: "activity_added",
    document,
    before,
    after: { status: document.status, activity },
  });
  return {
    resource: "leads",
    lead: after,
    activity,
  };
};
