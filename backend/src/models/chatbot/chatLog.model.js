import mongoose, { Schema, model } from "mongoose";

const sourceItemSchema = new Schema(
  {
    title: { type: String, trim: true },
    url: { type: String, trim: true },
    category: { type: String, trim: true },
    type: { type: String, trim: true },
  },
  { _id: false }
);

const chatLogSchema = new Schema(
  {
    ip: {
      type: String,
      trim: true,
      index: true,
      default: "unknown",
    },
    query: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      index: true,
    },
    reply: {
      type: String,
      required: true,
      trim: true,
    },
    responseType: {
      type: String,
      enum: ["local-rag", "local-slm", "greeting", "restricted", "unmatched"],
      default: "local-rag",
      index: true,
    },
    sources: [sourceItemSchema],
    userAgent: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

chatLogSchema.index({ createdAt: -1 });
chatLogSchema.index({ ip: 1, createdAt: -1 });

export const ChatLog = mongoose.models.ChatLog || model("ChatLog", chatLogSchema);
