import mongoose, { Schema, model } from "mongoose";

const activityLogSchema = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    module: { type: String, required: true, trim: true, index: true },
    action: { type: String, required: true, trim: true },
    resourceId: { type: String, trim: true, default: "" },
    resourceName: { type: String, trim: true, default: "" },
    ipAddress: { type: String, trim: true, default: "" },
    userAgent: { type: String, trim: true, default: "" },
    before: { type: Schema.Types.Mixed, default: null },
    after: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ userID: 1, createdAt: -1 });

export const ActivityLog = mongoose.models.ActivityLog || model("ActivityLog", activityLogSchema);
