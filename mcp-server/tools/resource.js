import slugify from "slugify";
import { connectDB } from "../db.js";
import {
  assertDeleteAllowed,
  assertWriteAllowed,
} from "../config.js";
import {
  errorResult,
  errorResultFrom,
  successResult,
} from "../lib/results.js";

const ignoredSchemaPaths = new Set(["_id", "__v", "createdAt", "updatedAt"]);
const defaultRedactedPaths = [
  "password",
  "passwordResetToken",
  "passwordResetExpires",
  "verification.emailOtp",
  "verification.emailOtpExpires",
  "verification.phoneOtp",
  "verification.phoneOtpExpires",
];

const primitiveSchema = (schemaType = {}) => {
  const result = {};

  switch (schemaType.instance) {
    case "Number":
    case "Decimal128":
      result.type = "number";
      break;
    case "Boolean":
      result.type = "boolean";
      break;
    case "Date":
      result.type = "string";
      result.format = "date-time";
      break;
    case "ObjectId":
      result.type = "string";
      result.description = "MongoDB ObjectId";
      break;
    case "Array":
      result.type = "array";
      result.items = schemaType.schema
        ? schemaToJsonSchema(schemaType.schema, false)
        : primitiveSchema(
            schemaType.caster || schemaType.$embeddedSchemaType || {},
          );
      break;
    case "Embedded":
    case "Subdocument":
      return schemaToJsonSchema(schemaType.schema, false);
    case "Mixed":
      return {};
    default:
      result.type = "string";
  }

  if (schemaType.enumValues?.length) result.enum = [...schemaType.enumValues];
  return result;
};

const insertPath = (root, parts, value, isRequired) => {
  const [part, ...rest] = parts;
  root.properties ||= {};

  if (!rest.length) {
    root.properties[part] = value;
    if (isRequired) {
      root.required ||= [];
      if (!root.required.includes(part)) root.required.push(part);
    }
    return;
  }

  root.properties[part] ||= {
    type: "object",
    properties: {},
    additionalProperties: false,
  };
  if (isRequired) {
    root.required ||= [];
    if (!root.required.includes(part)) root.required.push(part);
  }
  insertPath(root.properties[part], rest, value, isRequired);
};

export const schemaToJsonSchema = (schema, includeRequired = true) => {
  const result = {
    type: "object",
    properties: {},
    additionalProperties: false,
  };

  schema.eachPath((path, schemaType) => {
    if (ignoredSchemaPaths.has(path) || path.endsWith("._id")) return;
    insertPath(
      result,
      path.split("."),
      primitiveSchema(schemaType),
      includeRequired && schemaType.isRequired,
    );
  });

  return result;
};

const optionalize = (jsonSchema) => {
  const clone = structuredClone(jsonSchema);
  const removeRequired = (node) => {
    if (!node || typeof node !== "object") return;
    delete node.required;
    Object.values(node.properties || {}).forEach(removeRequired);
    removeRequired(node.items);
  };
  removeRequired(clone);
  return clone;
};

const removeSchemaPath = (jsonSchema, path) => {
  const parts = path.split(".");
  let node = jsonSchema;

  for (const part of parts.slice(0, -1)) {
    node = node?.properties?.[part];
    if (!node) return;
  }

  const field = parts.at(-1);
  if (node?.properties) delete node.properties[field];
  if (node?.required) {
    node.required = node.required.filter((required) => required !== field);
    if (!node.required.length) delete node.required;
  }
};

const singularize = (resource) =>
  resource.endsWith("ies")
    ? `${resource.slice(0, -3)}y`
    : resource.endsWith("s")
      ? resource.slice(0, -1)
      : resource;

const deletePath = (value, path) => {
  const parts = path.split(".");
  const parent = parts
    .slice(0, -1)
    .reduce((current, part) => current?.[part], value);
  if (parent && typeof parent === "object") delete parent[parts.at(-1)];
};

const toPlainObject = (value) => {
  if (value === null || value === undefined) return value;
  const serializable =
    typeof value.toObject === "function"
      ? value.toObject({ virtuals: true, flattenObjectIds: true })
      : value;
  return JSON.parse(JSON.stringify(serializable));
};

const redactValue = (value, redactedPaths) => {
  const plain = toPlainObject(value);
  if (Array.isArray(plain)) {
    return plain.map((entry) => {
      for (const path of redactedPaths) deletePath(entry, path);
      return entry;
    });
  }
  if (!plain || typeof plain !== "object") return plain;

  for (const path of redactedPaths) deletePath(plain, path);
  return plain;
};

const identifierFor = (lookup, singular) =>
  lookup === "slug"
    ? { slug: { type: "string", minLength: 1, description: `${singular} slug` } }
    : {
        id: {
          type: "string",
          minLength: 1,
          description: `${singular} MongoDB ObjectId`,
        },
      };

const toolAnnotations = ({
  title,
  readOnly = false,
  destructive = false,
  idempotent = false,
}) => ({
  title,
  readOnlyHint: readOnly,
  destructiveHint: destructive,
  idempotentHint: idempotent,
  openWorldHint: false,
});

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const schemaForFilter = (model, path) => {
  const result = primitiveSchema(model.schema.path(path) || {});
  delete result.description;
  return Object.keys(result).length ? result : { type: "string" };
};

const validateIdentifier = (model, lookup, args) => {
  if (lookup !== "id") return null;
  if (!model.db.base.isValidObjectId(args.id)) {
    return errorResult(`Invalid ${model.modelName} id: ${args.id}`);
  }
  return null;
};

export const createResourceTools = ({
  model,
  resource,
  singular: configuredSingular,
  lookup = "id",
  statusTool = false,
  searchFields = [],
  filterFields = [],
  listProjection,
  redactedPaths = [],
  writeExcludedPaths = [],
  createRequired = [],
  prepareCreate,
  prepareUpdate,
}) => {
  const singular = configuredSingular || singularize(resource);
  const documentSchema = schemaToJsonSchema(model.schema);
  const createSchema = structuredClone(documentSchema);
  const updateSchema = optionalize(documentSchema);
  const hasSlug = Boolean(model.schema.path("slug"));
  const statusPath = model.schema.path("status");
  const statusEnum = statusPath?.enumValues || [];
  const identifier = identifierFor(lookup, singular);
  const identifierRequired = lookup === "slug" ? "slug" : "id";
  const hiddenPaths = Object.entries(model.schema.paths)
    .filter(([, schemaType]) => schemaType.options?.select === false)
    .map(([path]) => path);
  const allRedactedPaths = [
    ...new Set([
      ...defaultRedactedPaths,
      ...hiddenPaths,
      ...redactedPaths,
    ]),
  ];

  for (const path of writeExcludedPaths) {
    removeSchemaPath(createSchema, path);
    removeSchemaPath(updateSchema, path);
  }

  if (hasSlug && (createSchema.properties.title || createSchema.properties.name)) {
    createSchema.required = (createSchema.required || []).filter(
      (field) => field !== "slug",
    );
  }

  for (const field of createRequired) {
    if (createSchema.properties[field]) {
      createSchema.required ||= [];
      if (!createSchema.required.includes(field)) {
        createSchema.required.push(field);
      }
    }
  }

  const updateProperties = updateSchema.properties;
  if (lookup === "slug") {
    delete updateProperties.slug;
    updateProperties.newSlug = {
      type: "string",
      minLength: 1,
      description: "Optional replacement slug",
    };
  }

  const listProperties = {
    page: { type: "integer", minimum: 1, description: "Page number (default 1)" },
    limit: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      description: "Results per page (default 20, maximum 100)",
    },
    sortOrder: {
      type: "string",
      enum: ["newest", "oldest"],
      description: "Sort by creation date (default newest)",
    },
  };

  if (searchFields.length) {
    listProperties.search = {
      type: "string",
      minLength: 1,
      maxLength: 200,
      description: `Case-insensitive search across ${searchFields.join(", ")}`,
    };
  }
  if (statusPath) {
    listProperties.status = { type: "string", enum: statusEnum };
  }
  for (const field of filterFields) {
    if (field !== "status") {
      listProperties[field] = schemaForFilter(model, field);
    }
  }

  const tools = [
    {
      name: `get_${resource}`,
      description: `List ${resource} with pagination, filtering, and concise results`,
      inputSchema: {
        type: "object",
        properties: listProperties,
        additionalProperties: false,
      },
      annotations: toolAnnotations({
        title: `List ${resource}`,
        readOnly: true,
        idempotent: true,
      }),
    },
    {
      name: `get_${singular}`,
      description: `Get one ${singular} by ${identifierRequired}`,
      inputSchema: {
        type: "object",
        properties: identifier,
        required: [identifierRequired],
        additionalProperties: false,
      },
      annotations: toolAnnotations({
        title: `Get ${singular}`,
        readOnly: true,
        idempotent: true,
      }),
    },
    {
      name: `create_${singular}`,
      description: `Create a ${singular}. This changes the Kraviona database`,
      inputSchema: createSchema,
      annotations: toolAnnotations({ title: `Create ${singular}` }),
    },
    {
      name: `update_${singular}`,
      description: `Update only supplied fields on a ${singular}. This changes the Kraviona database`,
      inputSchema: {
        type: "object",
        properties: { ...identifier, ...updateProperties },
        required: [identifierRequired],
        additionalProperties: false,
      },
      annotations: toolAnnotations({
        title: `Update ${singular}`,
        idempotent: true,
      }),
    },
    {
      name: `delete_${singular}`,
      description: `Permanently delete a ${singular}. Requires confirm=true and MCP_ALLOW_DELETES=true`,
      inputSchema: {
        type: "object",
        properties: {
          ...identifier,
          confirm: {
            type: "boolean",
            const: true,
            description: "Must be true to confirm permanent deletion",
          },
        },
        required: [identifierRequired, "confirm"],
        additionalProperties: false,
      },
      annotations: toolAnnotations({
        title: `Delete ${singular}`,
        destructive: true,
        idempotent: true,
      }),
    },
  ];

  if (statusEnum.includes("published")) {
    for (const action of ["publish", "unpublish"]) {
      tools.push({
        name: `${action}_${singular}`,
        description: `${action === "publish" ? "Publish" : "Move to draft"} a ${singular}`,
        inputSchema: {
          type: "object",
          properties: identifier,
          required: [identifierRequired],
          additionalProperties: false,
        },
        annotations: toolAnnotations({
          title: `${action === "publish" ? "Publish" : "Unpublish"} ${singular}`,
          idempotent: true,
        }),
      });
    }
  }

  if (statusTool && statusEnum.length) {
    tools.push({
      name: `update_${singular}_status`,
      description: `Update the workflow status of a ${singular}`,
      inputSchema: {
        type: "object",
        properties: {
          ...identifier,
          status: { type: "string", enum: statusEnum },
        },
        required: [identifierRequired, "status"],
        additionalProperties: false,
      },
      annotations: toolAnnotations({
        title: `Update ${singular} status`,
        idempotent: true,
      }),
    });
  }

  const queryFrom = (args) =>
    lookup === "slug" ? { slug: args.slug } : { _id: args.id };

  const findDocument = async (args) => {
    const query = model.findOne(queryFrom(args));
    if (allRedactedPaths.length) {
      query.select(allRedactedPaths.map((path) => `-${path}`).join(" "));
    }
    return query;
  };

  const clean = (value) => redactValue(value, allRedactedPaths);

  const handle = async (toolName, args = {}) => {
    try {
      await connectDB();

      if (toolName === `get_${resource}`) {
        const page = Math.max(1, Number(args.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(args.limit) || 20));
        const query = {};

        if (args.status !== undefined) query.status = args.status;
        for (const field of filterFields) {
          if (args[field] !== undefined) query[field] = args[field];
        }
        if (args.search && searchFields.length) {
          const regex = new RegExp(escapeRegex(args.search.trim()), "i");
          query.$or = searchFields.map((field) => ({ [field]: regex }));
        }

        let findQuery = model
          .find(query)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ createdAt: args.sortOrder === "oldest" ? 1 : -1 });
        if (listProjection) {
          findQuery = findQuery.select(listProjection);
        } else if (allRedactedPaths.length) {
          findQuery = findQuery.select(
            allRedactedPaths.map((path) => `-${path}`).join(" "),
          );
        }

        const [documents, total] = await Promise.all([
          findQuery.lean({ virtuals: true }),
          model.countDocuments(query),
        ]);

        return successResult({
          success: true,
          [resource]: clean(documents),
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        });
      }

      if (toolName === `get_${singular}`) {
        const invalid = validateIdentifier(model, lookup, args);
        if (invalid) return invalid;
        const document = await findDocument(args);
        if (!document) return errorResult(`${singular} not found`);
        return successResult({
          success: true,
          [singular]: clean(document),
        });
      }

      if (toolName === `create_${singular}`) {
        assertWriteAllowed(`create ${singular}`);
        let payload = { ...args };
        if (prepareCreate) payload = await prepareCreate(payload);
        if (hasSlug && !payload.slug) {
          const source = payload.title || payload.name;
          if (source) payload.slug = slugify(source, { lower: true, strict: true });
        }

        const document = new model(payload);
        await document.save();
        return successResult({
          success: true,
          message: `${singular} created`,
          [singular]: clean(document),
        });
      }

      if (toolName === `update_${singular}`) {
        assertWriteAllowed(`update ${singular}`);
        const invalid = validateIdentifier(model, lookup, args);
        if (invalid) return invalid;

        const { id, slug, newSlug, ...rawUpdates } = args;
        let updates = rawUpdates;
        if (newSlug !== undefined) {
          updates.slug = slugify(newSlug, { lower: true, strict: true });
        }
        if (prepareUpdate) updates = await prepareUpdate(updates);

        const document = await findDocument({ id, slug });
        if (!document) return errorResult(`${singular} not found`);
        document.set(updates);
        await document.save();
        return successResult({
          success: true,
          message: `${singular} updated`,
          [singular]: clean(document),
        });
      }

      if (toolName === `delete_${singular}`) {
        assertDeleteAllowed();
        if (args.confirm !== true) {
          return errorResult("Permanent deletion requires confirm=true");
        }
        const invalid = validateIdentifier(model, lookup, args);
        if (invalid) return invalid;

        const document = await model.findOne(queryFrom(args));
        if (!document) return errorResult(`${singular} not found`);
        const deletedIdentifier =
          lookup === "slug" ? document.slug : document._id.toString();
        await document.deleteOne();
        return successResult({
          success: true,
          message: `${singular} permanently deleted`,
          deletedIdentifier,
        });
      }

      if (
        toolName === `publish_${singular}` ||
        toolName === `unpublish_${singular}`
      ) {
        assertWriteAllowed(`change ${singular} publication status`);
        const invalid = validateIdentifier(model, lookup, args);
        if (invalid) return invalid;
        const document = await findDocument(args);
        if (!document) return errorResult(`${singular} not found`);
        document.status = toolName.startsWith("publish_")
          ? "published"
          : "draft";
        await document.save();
        return successResult({
          success: true,
          message: `${singular} ${document.status}`,
          [singular]: clean(document),
        });
      }

      if (toolName === `update_${singular}_status`) {
        assertWriteAllowed(`update ${singular} status`);
        const invalid = validateIdentifier(model, lookup, args);
        if (invalid) return invalid;
        const document = await findDocument(args);
        if (!document) return errorResult(`${singular} not found`);
        document.status = args.status;
        await document.save();
        return successResult({
          success: true,
          message: `${singular} status updated to ${args.status}`,
          [singular]: clean(document),
        });
      }

      return errorResult(`Unknown tool: ${toolName}`);
    } catch (error) {
      return errorResultFrom(error);
    }
  };

  return { tools, handle };
};
