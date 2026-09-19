// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const keywordItemSchema = new Schema(
  {
    keyword: {
      type: String,
      required: [true, "Keyword is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    intent: {
      type: String,
      enum: {
        values: [
          "Informational",
          "Commercial",
          "Transactional",
          "Navigational",
        ],
        message: "{VALUE} is not a valid search intent",
      },
      default: "Informational",
      index: true,
    },
    monthlyVolume: {
      type: Number,
      default: 0,
      min: [0, "Monthly volume cannot be negative"],
    },
    difficulty: {
      type: Number,
      min: [0, "Difficulty cannot be less than 0"],
      max: [100, "Difficulty cannot exceed 100"],
      default: 0,
    },
    cluster: {
      type: String,
      trim: true,
      default: "General",
      index: true,
    },
    targetUrl: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: [
          "Researched",
          "Assigned",
          "In Content Plan",
          "Published",
          "Ranking",
        ],
        message: "{VALUE} is not a valid keyword status",
      },
      default: "Researched",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    assignedContentPlan: {
      type: Schema.Types.ObjectId,
      ref: "ContentPlanItem",
      default: null,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const KeywordItem =
  models.KeywordItem || model("KeywordItem", keywordItemSchema);

export default KeywordItem;
