import mongoose from "mongoose";

// Allowed redirect HTTP status codes
const ALLOWED_TYPES = ["301", "302"];

const redirectSchema = new mongoose.Schema(
  {
    // Source path (must start with /) e.g. "/old-page" or "/blog/old-slug"
    source: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
    },
    // Destination path or full URL e.g. "/new-page" or "https://example.com/new"
    destination: {
      type:     String,
      required: true,
      trim:     true,
    },
    // HTTP redirect type — 301 (permanent) or 302 (temporary)
    type: {
      type:    String,
      enum:    ALLOWED_TYPES,
      default: "301",
    },
    // Soft toggle — disabled redirects are stored but not applied
    active: {
      type:    Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

redirectSchema.index({ active: 1, source: 1 });

export const RedirectModel = mongoose.model("Redirect", redirectSchema);
