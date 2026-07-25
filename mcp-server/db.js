import { Auth } from "../backend/src/models/auth/auth.models.js";
import { config } from "./config.js";

// Every backend model resolves Mongoose from backend/node_modules. Connecting a
// second Mongoose copy from mcp-server/node_modules leaves those models
// disconnected, even though the second copy reports a successful connection.
// Auth.db is the shared default connection used by all imported backend models.
const connection = Auth.db;
let pendingConnection;

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
