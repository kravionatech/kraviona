import mongoose, { Schema, model } from "mongoose";

const contentItemSchema = new Schema(
  {
    title: { type: String, trim: true, maxlength: 180 },
    description: { type: String, trim: true, maxlength: 1200 },
  },
  { _id: false },
);

const faqSchema = new Schema(
  {
    question: { type: String, trim: true, maxlength: 220 },
    answer: { type: String, trim: true, maxlength: 2000 },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, trim: true, default: "General" },
    description: { type: String, required: true, trim: true, maxlength: 1200 },
    features: [{ type: String, trim: true, maxlength: 120 }],
    hero: {
      eyebrow: { type: String, trim: true, maxlength: 100 },
      title: { type: String, trim: true, maxlength: 180 },
      highlight: { type: String, trim: true, maxlength: 120 },
      description: { type: String, trim: true, maxlength: 1200 },
    },
    intro: { type: String, trim: true, maxlength: 2000 },
    outcomes: [contentItemSchema],
    trustPoints: [contentItemSchema],
    deliverables: [{ type: String, trim: true, maxlength: 220 }],
    idealFor: [{ type: String, trim: true, maxlength: 220 }],
    successMetrics: [{ type: String, trim: true, maxlength: 220 }],
    process: [contentItemSchema],
    techStack: [{ type: String, trim: true, maxlength: 80 }],
    faqs: [faqSchema],
    cta: {
      title: { type: String, trim: true, maxlength: 180 },
      description: { type: String, trim: true, maxlength: 1000 },
      label: { type: String, trim: true, maxlength: 80 },
      href: { type: String, trim: true, maxlength: 300 },
    },
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 180 },
      metaDescription: { type: String, trim: true, maxlength: 320 },
      keywords: [{ type: String, trim: true, maxlength: 80 }],
      ogImage: { type: String, trim: true, maxlength: 500 },
      noIndex: { type: Boolean, default: false },
    },
    expert: {
      name: { type: String, trim: true, maxlength: 100 },
      jobTitle: { type: String, trim: true, maxlength: 120 },
      bio: { type: String, trim: true, maxlength: 1200 },
      image: { type: String, trim: true, maxlength: 500 },
      email: { type: String, trim: true, lowercase: true, maxlength: 180 },
      phone: { type: String, trim: true, maxlength: 40 },
      whatsapp: { type: String, trim: true, maxlength: 500 },
      linkedin: { type: String, trim: true, maxlength: 500 },
      companyLinkedin: { type: String, trim: true, maxlength: 500 },
      twitter: { type: String, trim: true, maxlength: 500 },
      facebook: { type: String, trim: true, maxlength: 500 },
      website: { type: String, trim: true, maxlength: 500 },
      address: { type: String, trim: true, maxlength: 240 },
      availability: { type: String, trim: true, maxlength: 180 },
      consultation: { type: String, trim: true, maxlength: 180 },
      responseTime: { type: String, trim: true, maxlength: 180 },
      expertise: [{ type: String, trim: true, maxlength: 100 }],
      credentials: [{ type: String, trim: true, maxlength: 180 }],
    },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
  },
  { timestamps: true },
);

serviceSchema.index({ isActive: 1, order: 1 });
serviceSchema.index({ createdBy: 1, createdAt: -1 });

export const Service = mongoose.models.Service || model("Service", serviceSchema);
