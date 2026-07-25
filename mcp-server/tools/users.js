import bcrypt from "bcryptjs";
import { Auth } from "../../backend/src/models/auth/auth.models.js";
import { createResourceTools } from "./resource.js";

const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const hashPassword = async (password) => {
  if (!passwordPattern.test(password || "")) {
    throw new Error(
      "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character",
    );
  }
  return bcrypt.hash(password, 12);
};

const secureCreate = async (payload) => ({
  ...payload,
  password: await hashPassword(payload.password),
});

const secureUpdate = async (updates) => {
  if (updates.password !== undefined) {
    updates.password = await hashPassword(updates.password);
  }
  return updates;
};

export const { tools, handle } = createResourceTools({
  model: Auth,
  resource: "users",
  searchFields: ["name", "email", "username", "phone", "profile.jobTitle"],
  filterFields: ["role", "isActive", "isVerified"],
  listProjection:
    "name email username phone avatar role isActive isVerified lastLoginAt profile preferences createdAt updatedAt",
  redactedPaths: ["password"],
  writeExcludedPaths: [
    "loginAttempts",
    "lockUntil",
    "passwordResetToken",
    "passwordResetExpires",
    "verification",
    "authProviders",
    "lastLoginAt",
  ],
  createRequired: ["password"],
  prepareCreate: secureCreate,
  prepareUpdate: secureUpdate,
});
