import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const directory = path.dirname(fileURLToPath(import.meta.url));
const hostProvidedPort = process.env.PORT;

// The MCP must use the same database as the backend. Values explicitly
// supplied by the host win, then backend/.env, then optional MCP-only values.
dotenv.config({ path: path.join(directory, "../backend/.env"), quiet: true });
dotenv.config({ path: path.join(directory, ".env"), quiet: true });

const booleanFromEnv = (name, fallback) => {
  const value = process.env[name];
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const integerFromEnv = (name, fallback, minimum, maximum) => {
  const parsed = Number.parseInt(process.env[name] || "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(maximum, Math.max(minimum, parsed));
};

export const config = Object.freeze({
  name: "kraviona-admin-mcp",
  version: "3.0.0",
  mongoUri:
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI,
  directMongoUri: process.env.MONGO_DIRECT_URI,
  databaseName: process.env.DB_NAME,
  transport: (
    process.env.MCP_TRANSPORT ||
    (hostProvidedPort ? "streamable-http" : "stdio")
  ).toLowerCase(),
  port: integerFromEnv("PORT", 3000, 1, 65_535),
  apiKey: (process.env.MCP_API_KEY || "").trim(),
  readOnly: booleanFromEnv("MCP_READ_ONLY", false),
  allowDeletes: booleanFromEnv("MCP_ALLOW_DELETES", false),
  sessionFile:
    process.env.MCP_ADMIN_SESSION_FILE ||
    path.join(directory, ".admin-session"),
  sessionToken: process.env.MCP_ADMIN_SESSION_TOKEN || "",
  allowedRoles: new Set(
    (process.env.MCP_ADMIN_ROLES || "super_admin")
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean),
  ),
  sessionTtlDays: integerFromEnv("MCP_ADMIN_SESSION_DAYS", 30, 1, 90),
  serverSelectionTimeoutMs: integerFromEnv(
    "MCP_DB_TIMEOUT_MS",
    10_000,
    1_000,
    60_000,
  ),
});

export const assertWriteAllowed = (operation = "change data") => {
  if (config.readOnly) {
    throw new Error(
      `Cannot ${operation}: this MCP server is running in read-only mode`,
    );
  }
};

export const assertDeleteAllowed = () => {
  assertWriteAllowed("delete data");
  if (!config.allowDeletes) {
    throw new Error(
      "Deletion is disabled. Set MCP_ALLOW_DELETES=true in the MCP environment to enable confirmed deletes",
    );
  }
};
