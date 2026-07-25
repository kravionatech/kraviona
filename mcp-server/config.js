import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const directory = path.dirname(fileURLToPath(import.meta.url));

// Local MCP settings win over the shared backend settings. Neither file is
// required when the values are supplied by the MCP host.
dotenv.config({ path: path.join(directory, ".env"), quiet: true });
dotenv.config({ path: path.join(directory, "../backend/.env"), quiet: true });

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
  mongoUri:
    process.env.MONGO_URI ||
    process.env.DATABASE_URL ||
    process.env.MONGODB_URI,
  databaseName: process.env.DB_NAME,
  readOnly: booleanFromEnv("MCP_READ_ONLY", false),
  allowDeletes: booleanFromEnv("MCP_ALLOW_DELETES", false),
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
