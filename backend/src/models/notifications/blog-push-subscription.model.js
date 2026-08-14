import crypto from "node:crypto";
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

export const hashPushEndpoint = (endpoint) =>
  crypto.createHash("sha256").update(String(endpoint)).digest("hex");

const blogPushSubscriptionSchema = new Schema(
  {
    endpoint: {
      type: String,
      required: true,
      select: false,
      maxlength: 2048,
    },
    endpointHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      immutable: true,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
        select: false,
        maxlength: 512,
      },
      auth: {
        type: String,
        required: true,
        select: false,
        maxlength: 256,
      },
    },
    topic: {
      type: String,
      enum: ["blog"],
      default: "blog",
      immutable: true,
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    expirationTime: { type: Date, default: null },
    userAgent: { type: String, maxlength: 500, default: "" },
    language: { type: String, maxlength: 20, default: "en-IN" },
    failureCount: { type: Number, min: 0, default: 0 },
    lastNotifiedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

blogPushSubscriptionSchema.index({ topic: 1, isActive: 1, createdAt: -1 });
blogPushSubscriptionSchema.index(
  { expirationTime: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { expirationTime: { $type: "date" } },
  },
);

export const BlogPushSubscription =
  models.BlogPushSubscription ||
  model("BlogPushSubscription", blogPushSubscriptionSchema);
