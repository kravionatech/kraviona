import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// ============================================================
// SUB-SCHEMAS
// ============================================================

const featuredImageSchema = new Schema(
  {
    url:         { type: String, required: true, trim: true },
    altText:     { type: String, trim: true },
    width:       { type: Number },
    height:      { type: Number },
    sizeInBytes: { type: Number },
    caption:     { type: String, trim: true },
  },
  { _id: false }
);

const galleryItemSchema = new Schema(
  {
    url:     { type: String, trim: true },
    altText: { type: String, trim: true },
    caption: { type: String, trim: true },
  },
  { _id: false }
);

const videoEmbeddedSchema = new Schema(
  {
    hasVideo:     { type: Boolean, default: false },
    videoUrl:     { type: String, trim: true },
    thumbnailUrl: { type: String, trim: true },
    name:         { type: String, trim: true },
    duration: {
      type:  String,
      trim:  true,
      match: [/^PT(\d+H)?(\d+M)?(\d+S)?$/, "Use ISO 8601 duration e.g. PT5M30S"],
    },
  },
  { _id: false }
);

const authorSchema = new Schema(
  {
    name:        { type: String, required: true, trim: true },
    email:       { type: String, required: true, trim: true, lowercase: true },
    username:    { type: String, required: true, trim: true },
    jobTitle:    { type: String, trim: true },
    bio:         { type: String, trim: true, maxlength: 500 },
    linkedInUrl: { type: String, trim: true },
    sameAs:      [{ type: String, trim: true }],
    avatar:      { type: String, trim: true },
  },
  { _id: false }
);

const reviewedBySchema = new Schema(
  {
    name:          { type: String, trim: true },
    jobTitle:      { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
  },
  { _id: false }
);

const categorySnapshotSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
  },
  { _id: false }
);

const tocItemSchema = new Schema(
  {
    heading: { type: String, trim: true },
    anchor:  { type: String, trim: true },
    level:   { type: Number, min: 2, max: 4, default: 2 },
  },
  { _id: false }
);

const faqItemSchema = new Schema(
  {
    question: { type: String, trim: true },
    answer:   { type: String, trim: true },
  },
  { _id: false }
);

const sourceSchema = new Schema(
  {
    title:     { type: String, trim: true },
    url:       { type: String, trim: true },
    publisher: { type: String, trim: true },
  },
  { _id: false }
);

const statisticSchema = new Schema(
  {
    claim:     { type: String, trim: true },
    sourceUrl: { type: String, trim: true },
    year:      { type: Number },
  },
  { _id: false }
);

const alternateLangSchema = new Schema(
  {
    language: { type: String, trim: true },
    url:      { type: String, trim: true },
  },
  { _id: false }
);

const previousSlugSchema = new Schema(
  {
    slug:    { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// ============================================================
// MAIN SCHEMA
// ============================================================

const postSchema = new Schema(
  {
    // ----------------------------------------------------------
    // 1. CORE CONTENT
    // ----------------------------------------------------------
    title: {
      type:      String,
      required:  [true, "Title is required"],
      trim:      true,
      minlength: [10, "Min 10 characters"],
      maxlength: [200, "Max 200 characters"],
      index:     true,
    },

    slug: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only"],
      index:     true,
    },

    previousSlugs: [previousSlugSchema],

    content: {
      type:      String,
      required:  [true, "Content is required"],
      trim:      true,
      minlength: [10, "Min 10 characters"],
    },

    excerpt: {
      type:      String,
      required:  [true, "Excerpt is required"],
      trim:      true,
      minlength: [10, "Min 10 characters"],
      maxlength: [500, "Max 500 characters"],
      index:     true,
    },

    // AEO — direct answer for featured snippets / voice / PAA boxes
    quickAnswer: {
      type:      String,
      trim:      true,
      maxlength: [600, "Keep quick answer under 600 chars"],
      default:   "",
    },

    // GEO — bullet-style citable facts AI crawlers lift verbatim
    keyTakeaways: [{ type: String, trim: true, maxlength: 240 }],

    // AEO — powers jump-links + gives crawlers a clean outline
    tableOfContents: [tocItemSchema],

    // Topical authority / pillar mapping
    primaryTopicCluster:     { type: String, trim: true, index: true, default: "" },
    supportingTopicClusters: [{ type: String, trim: true }],

    // Folksonomy tags (distinct from SEO keywords)
    tags: [{ type: String, trim: true, lowercase: true }],

    // Auto-computed in pre('save') hook
    wordCount:          { type: Number, default: 0 },
    readingTimeMinutes: { type: Number, default: 1 },

    // ----------------------------------------------------------
    // 2. AUTHOR & CATEGORY (E-E-A-T)
    // ----------------------------------------------------------
    userID: {
      type:     Schema.Types.ObjectId,
      ref:      "User",
      required: true,
    },

    author:   { type: authorSchema, required: true },

    // Who fact-checked / reviewed the post
    reviewedBy:       { type: reviewedBySchema },
    lastReviewedAt:   { type: Date },
    nextReviewDueAt:  { type: Date },

    categoryID: {
      type:     Schema.Types.ObjectId,
      ref:      "Category",
      required: true,
    },

    category: { type: categorySnapshotSchema, required: true },

    // ----------------------------------------------------------
    // 3. ENGAGEMENT METRICS
    // ----------------------------------------------------------
    reactions: {
      like:    { type: Number, default: 0 },
      dislike: { type: Number, default: 0 },
      share:   { type: Number, default: 0 },
    },
    views:        { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },

    // ----------------------------------------------------------
    // 4. MEDIA
    // ----------------------------------------------------------
    featuredImage: { type: featuredImageSchema, required: true },
    gallery:       { type: [galleryItemSchema], default: [] },
    videoEmbedded: { type: videoEmbeddedSchema, default: () => ({}) },

    // ----------------------------------------------------------
    // 5. TECHNICAL SEO
    // ----------------------------------------------------------
    metaTitle: {
      type:      String,
      trim:      true,
      maxlength: [200, "Max 200 characters"],
      default:   function () { return this.title ? this.title.slice(0, 120) : ""; },
    },

    metaDescription: {
      type:      String,
      trim:      true,
      maxlength: [300, "Max 300 characters"],
      default:   function () { return this.excerpt ? this.excerpt.slice(0, 300) : ""; },
    },

    keywords:         [{ type: String, trim: true }],
    focusKeywords:    [{ type: String, trim: true }],
    semanticKeywords: [{ type: String, trim: true }],

    canonicalUrl: { type: String, trim: true },
    isNoIndex:    { type: Boolean, default: false },
    isNoFollow:   { type: Boolean, default: false },

    schemaType: {
      type:    String,
      enum:    ["BlogPosting", "Article", "NewsArticle", "HowTo", "Review", "FAQPage"],
      default: "BlogPosting",
    },

    // Escape hatch: hand-author JSON-LD per post without schema migration
    structuredDataOverride: { type: Schema.Types.Mixed, default: null },

    // i18n / hreflang
    language:                { type: String, trim: true, default: "en" },
    alternateLanguageVersions: { type: [alternateLangSchema], default: [] },

    // ----------------------------------------------------------
    // 6. SOCIAL CARDS
    // ----------------------------------------------------------
    ogTitle:           { type: String, trim: true, default: "" },
    ogDescription:     { type: String, trim: true, default: "" },
    ogImage:           { type: String, trim: true, default: "" },
    twitterTitle:      { type: String, trim: true, default: "" },
    twitterDescription:{ type: String, trim: true, default: "" },
    twitterCard: {
      type:    String,
      enum:    ["summary", "summary_large_image"],
      default: "summary_large_image",
    },

    // ----------------------------------------------------------
    // 7. RICH SNIPPETS — AEO
    // ----------------------------------------------------------
    faqSchema: { type: [faqItemSchema], default: [] },

    // ----------------------------------------------------------
    // 8. GEO — GENERATIVE ENGINE OPTIMIZATION
    // ----------------------------------------------------------
    sources:    { type: [sourceSchema],    default: [] },
    statistics: { type: [statisticSchema], default: [] },

    // ----------------------------------------------------------
    // 9. INTERNAL LINKING
    // ----------------------------------------------------------
    relatedPosts: [{ type: Schema.Types.ObjectId, ref: "post" }],

    // ----------------------------------------------------------
    // 10. STATUS & PROVENANCE
    // ----------------------------------------------------------
    status: {
      type:    String,
      enum:    ["published", "draft", "archived", "scheduled"],
      default: "draft",
      index:   true,
    },

    publishedAt: { type: Date },
    scheduledAt: { type: Date },

    // Google 2026 content provenance signal
    contentSourceType: {
      type:    String,
      enum:    ["Human", "AI-Assisted", "AI-Generated"],
      default: "Human",
    },

    isAccessibleForFree: { type: Boolean, default: true },

    // ----------------------------------------------------------
    // 11. COMMENTS & MODERATION
    // ----------------------------------------------------------
    isCommentEnabled: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    // Lean queries return plain objects; virtuals won't appear unless
    // explicitly requested — consistent behavior across the codebase.
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================
// INDEXES
// ============================================================
postSchema.index({ status: 1, publishedAt: -1 });                        // listing feeds
postSchema.index({ status: 1, scheduledAt: 1 });                         // scheduled publish
postSchema.index({ categoryID: 1, status: 1, publishedAt: -1 });         // category pages
postSchema.index({ primaryTopicCluster: 1, status: 1 });                 // topical cluster pages
postSchema.index({ tags: 1 });
postSchema.index({ "author.username": 1 });
postSchema.index(
  {
    title:    "text",
    excerpt:  "text",
    content:  "text",
    keywords: "text",
    tags:     "text",
  },
  {
    weights: { title: 5, excerpt: 3, keywords: 3, tags: 2, content: 1 },
    name:    "PostSearchIndex",
  }
);

// ============================================================
// HOOKS
// ============================================================

// Capture slug on load so pre('save') can detect changes
postSchema.post("init", function () {
  this._originalSlug = this.slug;
});

// Run after all fields are assigned — safe to read cross-field values
postSchema.pre("validate", function (next) {
  // Auto-fill featuredImage altText from first focusKeyword
  if (this.featuredImage && !this.featuredImage.altText && this.focusKeywords?.length) {
    this.featuredImage.altText = this.focusKeywords[0];
  }

  // Auto-fill OG/Twitter fields with fallbacks
  if (!this.ogTitle)            this.ogTitle            = this.metaTitle || this.title || "";
  if (!this.ogDescription)      this.ogDescription      = this.metaDescription || this.excerpt || "";
  if (!this.ogImage)            this.ogImage            = this.featuredImage?.url || "";
  if (!this.twitterTitle)       this.twitterTitle       = this.ogTitle || "";
  if (!this.twitterDescription) this.twitterDescription = this.ogDescription || "";

  next();
});

postSchema.pre("save", function (next) {
  // Track slug history for 301 redirects
  if (
    !this.isNew &&
    this.isModified("slug") &&
    this._originalSlug &&
    this._originalSlug !== this.slug
  ) {
    this.previousSlugs.push({ slug: this._originalSlug });
  }

  // Stamp publishedAt on first publish
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Clear scheduledAt when post leaves scheduled state
  if (this.isModified("status") && this.status !== "scheduled") {
    this.scheduledAt = undefined;
  }

  // Keep wordCount + readingTime in sync with content
  if (this.isModified("content")) {
    const words = this.content.trim().split(/\s+/).filter(Boolean).length;
    this.wordCount          = words;
    this.readingTimeMinutes = Math.max(1, Math.round(words / 200));
  }

  next();
});

// ============================================================
// VIRTUALS
// ============================================================

// Convenience: full public URL
postSchema.virtual("url").get(function () {
  return `/blog/${this.slug}`;
});

// ============================================================
// EXPORT
// ============================================================
export const PostModel = models.post || model("post", postSchema);