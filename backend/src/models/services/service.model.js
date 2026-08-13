import mongoose, { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, trim: true, default: "General" },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    features: [{ type: String, trim: true, maxlength: 120 }],
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

serviceSchema.index({ isActive: 1, order: 1 });

export const Service = mongoose.models.Service || model("Service", serviceSchema);
