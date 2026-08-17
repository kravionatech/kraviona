import { createHash, randomBytes } from "node:crypto";
import { chmod, readFile, unlink, writeFile } from "node:fs/promises";
import bcrypt from "bcryptjs";
import { Auth } from "../backend/src/models/auth/auth.models.js";
import { config } from "./config.js";
import { connectDB } from "./db.js";

const COLLECTION = "mcp_admin_sessions";
let indexesReady;

const hashToken = (token) =>
  createHash("sha256").update(String(token || "")).digest("hex");

const sessionCollection = async () => {
  const connection = await connectDB();
  const collection = connection.db.collection(COLLECTION);
  if (!indexesReady) {
    indexesReady = Promise.all([
      collection.createIndex({ tokenHash: 1 }, { unique: true }),
      collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      collection.createIndex({ adminId: 1, createdAt: -1 }),
    ]).catch((error) => {
      indexesReady = undefined;
      throw error;
    });
  }
  await indexesReady;
  return collection;
};

const findAdmin = async (identifier) => {
  const clean = String(identifier || "").trim();
  return Auth.findOne({
    $or: [
      { email: clean.toLowerCase() },
      { username: clean },
      { phone: clean },
    ],
  }).select("+password name email username role isActive isVerified");
};

const assertEligibleAdmin = (admin) => {
  if (!admin) throw new Error("Admin account not found");
  if (!admin.isActive) throw new Error("Admin account is inactive");
  if (!admin.isVerified) throw new Error("Admin account is not verified");
  if (!config.allowedRoles.has(admin.role)) {
    throw new Error(
      `MCP access requires one of these roles: ${[...config.allowedRoles].join(", ")}`,
    );
  }
};

export const safeActor = (admin) => ({
  id: admin._id.toString(),
  name: admin.name,
  email: admin.email,
  username: admin.username,
  role: admin.role,
});

export const createAdminSession = async ({ identifier, password }) => {
  const admin = await authenticateAdminCredentials({ identifier, password });

  const token = randomBytes(48).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + config.sessionTtlDays * 24 * 60 * 60 * 1000,
  );
  const collection = await sessionCollection();

  await collection.insertOne({
    tokenHash: hashToken(token),
    adminId: admin._id,
    roleAtIssue: admin.role,
    createdAt: now,
    expiresAt,
  });

  await writeFile(config.sessionFile, `${token}\n`, {
    encoding: "utf8",
    mode: 0o600,
  });
  await chmod(config.sessionFile, 0o600).catch(() => {});

  return { actor: safeActor(admin), expiresAt };
};

export const authenticateAdminCredentials = async ({
  identifier,
  password,
}) => {
  await connectDB();
  const admin = await findAdmin(identifier);
  assertEligibleAdmin(admin);

  const passwordMatches = await bcrypt.compare(
    String(password || ""),
    String(admin.password || ""),
  );
  if (!passwordMatches) throw new Error("Invalid admin credentials");
  return admin;
};

const readSessionToken = async () => {
  if (config.sessionToken) return config.sessionToken.trim();
  try {
    return (await readFile(config.sessionFile, "utf8")).trim();
  } catch (error) {
    if (error?.code === "ENOENT") return "";
    throw error;
  }
};

export const authenticateAdminSession = async () => {
  const token = await readSessionToken();
  if (!token) {
    throw new Error(
      "No admin MCP session. Run `npm run login` inside mcp-server, then reconnect the MCP server.",
    );
  }

  const collection = await sessionCollection();
  const session = await collection.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
    revokedAt: { $exists: false },
  });
  if (!session) {
    throw new Error(
      "Admin MCP session is invalid, expired, or revoked. Run `npm run login` again.",
    );
  }

  const admin = await Auth.findById(session.adminId).select(
    "name email username role isActive isVerified",
  );
  assertEligibleAdmin(admin);

  await collection.updateOne(
    { _id: session._id },
    { $set: { lastUsedAt: new Date() } },
  );

  return {
    actor: safeActor(admin),
    sessionId: session._id.toString(),
    expiresAt: session.expiresAt,
  };
};

export const revalidateActor = async (actor) => {
  const admin = await Auth.findById(actor?.id).select(
    "name email username role isActive isVerified",
  );
  assertEligibleAdmin(admin);
  return safeActor(admin);
};

export const revokeAdminSession = async () => {
  const token = await readSessionToken();
  if (token) {
    const collection = await sessionCollection();
    await collection.updateOne(
      { tokenHash: hashToken(token) },
      { $set: { revokedAt: new Date() } },
    );
  }
  await unlink(config.sessionFile).catch((error) => {
    if (error?.code !== "ENOENT") throw error;
  });
};
