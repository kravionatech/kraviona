import mongoose, { Schema, model } from "mongoose";

const loginHistorySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ipAddress: { type: String, trim: true, default: "" },
    userAgent: { type: String, trim: true, default: "" },
    method: { type: String, enum: ["password", "mcp"], default: "password" },
  },
  { timestamps: true },
);

loginHistorySchema.index({ user: 1, createdAt: -1 });

export const LoginHistory = mongoose.models.LoginHistory || model("LoginHistory", loginHistorySchema);
