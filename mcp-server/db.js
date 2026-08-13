import { Auth } from "../backend/src/models/auth/auth.models.js";
import { config } from "./config.js";

// Every backend model resolves Mongoose from backend/node_modules. Connecting a
// second Mongoose copy from mcp-server/node_modules leaves those models
// disconnected, even though the second copy reports a successful connection.
// Auth.db is the shared default connection used by all imported backend models.
const connection = Auth.db;
let pendingConnection;

const directAtlasUri = (uri) => {
  if (config.directMongoUri) return config.directMongoUri;
  if (!uri?.startsWith("mongodb+srv://kraviona.c9i8wkl.mongodb.net") &&
      !uri?.includes("@kraviona.c9i8wkl.mongodb.net")) {
    return null;
  }

  const hosts = [
    "ac-i9uvc7d-shard-00-00.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-01.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-02.c9i8wkl.mongodb.net:27017",
  ].join(",");

  return uri
    .replace("mongodb+srv://", "mongodb://")
    .replace(/\/\/([^@]+@)[^/]+\//, `//$1${hosts}/`)
    .replace(
      /\?.*$/,
      "?ssl=true&authSource=admin&replicaSet=atlas-yphon3-shard-0&retryWrites=true&w=majority",
    );
};

export const connectDB = async () => {
  if (connection.readyState === 1) return connection;
  if (pendingConnection) return pendingConnection;

  if (!config.mongoUri) {
    throw new Error(
      "MongoDB URI is missing. Set MONGO_URI, DATABASE_URL, or MONGODB_URI in mcp-server/.env, backend/.env, or the MCP host environment",
    );
  }

  const options = {
    serverSelectionTimeoutMS: config.serverSelectionTimeoutMs,
  };
  if (config.databaseName) options.dbName = config.databaseName;

  pendingConnection = connection
    .openUri(config.mongoUri, options)
    .catch(async (error) => {
      const directUri = directAtlasUri(config.mongoUri);
      if (!directUri || error?.code !== "ECONNREFUSED") throw error;
      return connection.openUri(directUri, {
        ...options,
        serverSelectionTimeoutMS: Math.max(
          config.serverSelectionTimeoutMs,
          20_000,
        ),
      });
    })
    .then(() => {
      console.error(`[MCP] MongoDB connected (${connection.name})`);
      return connection;
    })
    .finally(() => {
      pendingConnection = undefined;
    });

  return pendingConnection;
};

export const getDBStatus = () => ({
  connected: connection.readyState === 1,
  readyState: connection.readyState,
  database: connection.name || config.databaseName || null,
  host: connection.host || null,
});

export const pingDB = async () => {
  await connectDB();
  await connection.db.admin().ping();
  return getDBStatus();
};

export const disconnectDB = async () => {
  if (connection.readyState !== 0) await connection.close();
};
