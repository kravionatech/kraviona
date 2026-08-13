const SYSTEM_PATHS = new Set(["_id", "__v", "createdAt", "updatedAt"]);

const numericOption = (value) =>
  Array.isArray(value) ? value[0] : typeof value === "number" ? value : undefined;

const jsonSafeDefault = (value) => {
  if (
    value === undefined ||
    typeof value === "function" ||
    typeof value === "bigint"
  ) {
    return undefined;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return undefined;
  }
};

const primitiveSchema = (schemaType = {}) => {
  const result = {};
  const options = schemaType.options || {};

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
      result.pattern = "^[a-fA-F0-9]{24}$";
      result.description = "MongoDB ObjectId";
      break;
    case "Array":
      result.type = "array";
      result.items = schemaType.schema
        ? mongooseSchemaToJsonSchema(schemaType.schema, { required: false })
        : primitiveSchema(
            schemaType.caster || schemaType.$embeddedSchemaType || {},
          );
      break;
    case "Embedded":
    case "Subdocument":
      return mongooseSchemaToJsonSchema(schemaType.schema, { required: false });
    case "Mixed":
      result.type = "object";
      result.additionalProperties = true;
      break;
    default:
      result.type = "string";
  }

  if (schemaType.enumValues?.length) result.enum = [...schemaType.enumValues];

  const minLength = numericOption(options.minlength);
  const maxLength = numericOption(options.maxlength);
  const minimum = numericOption(options.min);
  const maximum = numericOption(options.max);
  if (minLength !== undefined) result.minLength = minLength;
  if (maxLength !== undefined) result.maxLength = maxLength;
  if (minimum !== undefined) result.minimum = minimum;
  if (maximum !== undefined) result.maximum = maximum;
  if (options.match?.[0] instanceof RegExp) {
    result.pattern = options.match[0].source;
  }

  const defaultValue = jsonSafeDefault(options.default);
  if (defaultValue !== undefined) result.default = defaultValue;
  if (options.description) result.description = options.description;

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
  insertPath(root.properties[part], rest, value, isRequired);
};

export const mongooseSchemaToJsonSchema = (
  schema,
  { required = true } = {},
) => {
  const result = {
    type: "object",
    properties: {},
    additionalProperties: false,
  };

  schema.eachPath((path, schemaType) => {
    if (SYSTEM_PATHS.has(path) || path.endsWith("._id")) return;
    insertPath(
      result,
      path.split("."),
      primitiveSchema(schemaType),
      required && Boolean(schemaType.isRequired),
    );
  });

  return result;
};

export const optionalSchema = (schema) => {
  const clone = structuredClone(schema);
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    delete node.required;
    Object.values(node.properties || {}).forEach(walk);
    walk(node.items);
  };
  walk(clone);
  return clone;
};

export const removeSchemaPath = (schema, path) => {
  const parts = path.split(".");
  let node = schema;
  for (const part of parts.slice(0, -1)) {
    node = node?.properties?.[part];
    if (!node) return;
  }
  const field = parts.at(-1);
  delete node?.properties?.[field];
  if (node?.required) {
    node.required = node.required.filter((value) => value !== field);
    if (!node.required.length) delete node.required;
  }
};

export const schemaForResource = (resource) => {
  const create = mongooseSchemaToJsonSchema(resource.model.schema);
  const update = optionalSchema(create);
  const excluded = new Set([
    ...(resource.serverManagedPaths || []),
    ...Object.entries(resource.model.schema.paths)
      .filter(([, schemaType]) => schemaType.options?.select === false)
      .map(([path]) => path),
  ]);

  for (const path of excluded) {
    removeSchemaPath(create, path);
    removeSchemaPath(update, path);
  }
  for (const path of resource.immutablePaths || []) {
    removeSchemaPath(update, path);
  }

  if (resource.autoSlug && create.properties.slug) {
    create.required = (create.required || []).filter((key) => key !== "slug");
  }

  return { create, update };
};

export const topLevelFields = (schema) =>
  new Set(Object.keys(schema?.properties || {}));
