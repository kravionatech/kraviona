import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    // Unique key for lookup, e.g. "headerCode", "bodyCode", "footerCode",
    // "robotsOverride", "llmsOverride"
    key: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      lowercase: true,
    },
    // Flexible value — can be a string (code snippet), object, boolean, etc.
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
    },
  },
  { timestamps: true }
);

export const SiteSettingModel = mongoose.model("SiteSetting", siteSettingSchema);
