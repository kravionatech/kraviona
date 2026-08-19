import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";

export const CAREER_STATUS = Object.freeze([
  "draft",
  "published",
  "paused",
  "closed",
  "archived",
]);

export const EMPLOYMENT_TYPES = Object.freeze([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "temporary",
  "freelance",
]);

export const WORKPLACE_TYPES = Object.freeze([
  "on-site",
  "hybrid",
  "remote",
]);

const isHttpUrl = (value) => {
  if (!value) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

const normalizeStringList = (values) =>
  [...new Set((values || []).map((value) => String(value).trim()).filter(Boolean))];

const stringList = ({ itemMaxlength, maxItems }) => ({
  type: [
    {
      type: String,
      trim: true,
      maxlength: itemMaxlength,
    },
  ],
  default: [],
  set: normalizeStringList,
  validate: {
    validator: (values) => values.length <= maxItems,
    message: `A maximum of ${maxItems} entries is allowed`,
  },
});

const locationSchema = new Schema(
  {
    country: {
      type: String,
      trim: true,
      maxlength: [80, "Country cannot exceed 80 characters"],
      default: "India",
    },
    state: {
      type: String,
      trim: true,
      maxlength: [100, "State cannot exceed 100 characters"],
      default: "",
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, "City cannot exceed 100 characters"],
      default: "",
    },
    address: {
      type: String,
      trim: true,
      maxlength: [300, "Address cannot exceed 300 characters"],
      default: "",
    },
    postalCode: {
      type: String,
      trim: true,
      maxlength: [20, "Postal code cannot exceed 20 characters"],
      default: "",
    },
  },
  { _id: false },
);

const experienceSchema = new Schema(
  {
    minimumYears: {
      type: Number,
      min: [0, "Minimum experience cannot be negative"],
      max: [50, "Minimum experience cannot exceed 50 years"],
      default: 0,
    },
    maximumYears: {
      type: Number,
      min: [0, "Maximum experience cannot be negative"],
      max: [50, "Maximum experience cannot exceed 50 years"],
      default: null,
    },
    level: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead", "executive"],
      default: "mid",
    },
  },
  { _id: false },
);

const compensationSchema = new Schema(
  {
    minimum: {
      type: Number,
      min: [0, "Minimum compensation cannot be negative"],
      default: null,
    },
    maximum: {
      type: Number,
      min: [0, "Maximum compensation cannot be negative"],
      default: null,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{3}$/, "Currency must be a three-letter ISO code"],
      default: "INR",
    },
    period: {
      type: String,
      enum: ["hour", "day", "month", "year", "project"],
      default: "year",
    },
    isDisclosed: { type: Boolean, default: false },
    notes: {
      type: String,
      trim: true,
      maxlength: [300, "Compensation notes cannot exceed 300 characters"],
      default: "",
    },
  },
  { _id: false },
);

const applicationSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [254, "Application email cannot exceed 254 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Enter a valid application email address",
      ],
      default: "",
    },
    url: {
      type: String,
      trim: true,
      maxlength: [1000, "Application URL cannot exceed 1000 characters"],
      validate: { validator: isHttpUrl, message: "Enter a valid HTTP(S) URL" },
      default: "",
    },
    deadline: { type: Date, default: null },
    instructions: {
      type: String,
      trim: true,
      maxlength: [2000, "Application instructions cannot exceed 2000 characters"],
      default: "",
    },
  },
  { _id: false },
);

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [70, "SEO title cannot exceed 70 characters"],
      default: "",
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [170, "SEO description cannot exceed 170 characters"],
      default: "",
    },
    keywords: stringList({ itemMaxlength: 60, maxItems: 20 }),
    canonicalUrl: {
      type: String,
      trim: true,
      maxlength: [1000, "Canonical URL cannot exceed 1000 characters"],
      validate: { validator: isHttpUrl, message: "Enter a valid HTTP(S) URL" },
      default: "",
    },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);

const careerSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [3, "Job title must contain at least 3 characters"],
      maxlength: [120, "Job title cannot exceed 120 characters"],
      validate: {
        validator: (value) => !/[<>]/.test(value),
        message: "Job title cannot contain HTML characters",
      },
    },
    slug: {
      type: String,
      required: [true, "Career slug is required"],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Slug must contain at least 3 characters"],
      maxlength: [160, "Slug cannot exceed 160 characters"],
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Enter a valid URL-safe slug"],
    },
    summary: {
      type: String,
      required: [true, "Job summary is required"],
      trim: true,
      minlength: [20, "Job summary must contain at least 20 characters"],
      maxlength: [500, "Job summary cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [100, "Job description must contain at least 100 characters"],
      maxlength: [50_000, "Job description cannot exceed 50,000 characters"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: [100, "Department cannot exceed 100 characters"],
      default: "General",
    },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: "full-time",
      index: true,
    },
    workplaceType: {
      type: String,
      enum: WORKPLACE_TYPES,
      default: "on-site",
      index: true,
    },
    location: { type: locationSchema, default: () => ({}) },
    experience: { type: experienceSchema, default: () => ({}) },
    compensation: { type: compensationSchema, default: () => ({}) },
    responsibilities: stringList({ itemMaxlength: 500, maxItems: 40 }),
    requirements: stringList({ itemMaxlength: 500, maxItems: 40 }),
    preferredQualifications: stringList({
      itemMaxlength: 500,
      maxItems: 30,
    }),
    skills: stringList({ itemMaxlength: 80, maxItems: 50 }),
    benefits: stringList({ itemMaxlength: 300, maxItems: 30 }),
    openings: {
      type: Number,
      min: [1, "At least one opening is required"],
      max: [10_000, "Openings cannot exceed 10,000"],
      default: 1,
    },
    application: { type: applicationSchema, default: () => ({}) },
    status: {
      type: String,
      enum: CAREER_STATUS,
      default: "draft",
      index: true,
    },
    isFeatured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, min: 0 },
    seo: { type: seoSchema, default: () => ({}) },
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    publishedAt: { type: Date, default: null },
    closedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null, select: false },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

careerSchema.pre("validate", function setCareerLifecycle() {
  if (!this.slug && this.jobTitle) {
    this.slug = slugify(this.jobTitle, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  if (
    this.experience?.maximumYears !== null &&
    this.experience?.maximumYears !== undefined &&
    this.experience.maximumYears < this.experience.minimumYears
  ) {
    this.invalidate(
      "experience.maximumYears",
      "Maximum experience must be greater than or equal to minimum experience",
    );
  }

  if (
    this.compensation?.maximum !== null &&
    this.compensation?.maximum !== undefined &&
    this.compensation?.minimum !== null &&
    this.compensation?.minimum !== undefined &&
    this.compensation.maximum < this.compensation.minimum
  ) {
    this.invalidate(
      "compensation.maximum",
      "Maximum compensation must be greater than or equal to minimum compensation",
    );
  }

  if (
    this.status === "published" &&
    !this.application?.email &&
    !this.application?.url
  ) {
    this.invalidate(
      "application",
      "Published careers require an application email or URL",
    );
  }

  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (this.status === "closed" && !this.closedAt) {
    this.closedAt = new Date();
  }
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = new Date();
  }
});

careerSchema.virtual("isOpen").get(function isOpen() {
  const deadline = this.application?.deadline;
  return (
    this.status === "published" &&
    !this.isDeleted &&
    (!deadline || deadline.getTime() >= Date.now())
  );
});

careerSchema.index({ status: 1, isDeleted: 1, isFeatured: -1, publishedAt: -1 });
careerSchema.index({ department: 1, employmentType: 1, workplaceType: 1 });
careerSchema.index({ "location.country": 1, "location.state": 1, "location.city": 1 });
careerSchema.index({ "application.deadline": 1, status: 1 });
careerSchema.index({ userID: 1, createdAt: -1 });
careerSchema.index(
  {
    jobTitle: "text",
    summary: "text",
    content: "text",
    department: "text",
    skills: "text",
  },
  {
    name: "career_search_index",
    weights: { jobTitle: 10, skills: 7, department: 5, summary: 3, content: 1 },
  },
);

export const CareerModel =
  mongoose.models.Career || model("Career", careerSchema);
