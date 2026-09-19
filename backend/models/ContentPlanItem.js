// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const contentPlanItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    keyword: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: {
        values: [
          "Blog",
          "News",
          "SEO Fix",
          "Keyword Research",
          "Social",
          "Other",
        ],
        message: "{VALUE} is not a valid content type",
      },
      default: "Blog",
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: [
          "Planned",
          "In Progress",
          "Done",
          "Published",
          "Indexed",
          "Needs Update",
        ],
        message: "{VALUE} is not a valid status",
      },
      default: "Planned",
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ["High", "Medium", "Low"],
        message: "{VALUE} is not a valid priority",
      },
      default: "Medium",
    },
    plannedDate: {
      type: Date,
      required: [true, "Planned date is required"],
      index: true,
    },
    publishedDate: {
      type: Date,
      default: null,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    targetUrl: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    linkedPostSlug: {
      type: String,
      trim: true,
      default: "",
    },
    isOutdated: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

contentPlanItemSchema.pre("save", function (next) {
  this.lastUpdated = new Date();

  if (this.status === "Needs Update") {
    this.isOutdated = true;
  }

  if (this.status === "Published" || this.status === "Indexed" || this.status === "Done") {
    const referenceDate = this.publishedDate || this.plannedDate;
    if (referenceDate) {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      if (new Date(referenceDate) < ninetyDaysAgo) {
        this.isOutdated = true;
      }
    }
  }

  next();
});

export const ContentPlanItem =
  models.ContentPlanItem || model("ContentPlanItem", contentPlanItemSchema);

export default ContentPlanItem;
