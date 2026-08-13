/**
 * Improves the SERP and social-card copy for the August 2026 AI news post.
 *
 * Usage:
 *   node scripts/migrations/2026-08-13-ai-news-ctr-fix.js --dry-run
 *   node scripts/migrations/2026-08-13-ai-news-ctr-fix.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { PostModel } from "../../src/models/blog/post.model.js";

const DRY_RUN = process.argv.includes("--dry-run");
const TARGET_SLUG = "latest-ai-news-august-2026";
const updates = {
  title:
    "AI News August 2026: OpenAI 1B Users, Astra Launch & Major Price Cuts [Updated]",
  metaTitle:
    "AI News August 2026: OpenAI 1B Users, Astra Launch & Major Price Cuts [Updated]",
  metaDescription:
    "Top AI news this week — OpenAI crosses 1 billion users, Project Astra launches, GPT-4 price cuts confirmed. Latest updates from Google, Anthropic & more.",
  ogTitle: "AI News August 2026: OpenAI 1B Users, Astra & Price Cuts",
  ogDescription:
    "OpenAI hits 1 billion users, Astra goes live, price cuts across the board. Your weekly AI briefing updated daily.",
};

function directMongoUri(uri) {
  if (!uri.startsWith("mongodb+srv://")) return uri;

  const hosts = [
    "ac-i9uvc7d-shard-00-00.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-01.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-02.c9i8wkl.mongodb.net:27017",
  ].join(",");

  return uri
    .replace("mongodb+srv://", "mongodb://")
    .replace(/\/\/([^@]+@)[^/]+\//, `//$1${hosts}/`)
    .replace(
      /\?.*$/,
      "?ssl=true&authSource=admin&replicaSet=atlas-yphon3-shard-0&retryWrites=true&w=majority",
    );
}

async function connectMongo() {
  const options = {
    dbName: process.env.DB_NAME || undefined,
    serverSelectionTimeoutMS: 8000,
  };

  try {
    await mongoose.connect(process.env.MONGO_URI, options);
  } catch (error) {
    if (error?.code !== "ECONNREFUSED") throw error;
    await mongoose.connect(directMongoUri(process.env.MONGO_URI), {
      ...options,
      serverSelectionTimeoutMS: 20000,
    });
  }
}

async function run() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required.");
  }

  await connectMongo();
  console.log(DRY_RUN ? "DRY RUN" : "LIVE");

  const post = await PostModel.findOne({ slug: TARGET_SLUG }).lean();
  if (!post) {
    throw new Error(`Post not found: ${TARGET_SLUG}`);
  }

  console.log(`Found: \"${post.title}\" -> ${post.slug}`);
  console.log("Changes:", updates);

  if (DRY_RUN) {
    console.log("No database changes were written.");
    return;
  }

  const result = await PostModel.findOneAndUpdate(
    { _id: post._id, slug: TARGET_SLUG },
    { $set: updates },
    { new: true, runValidators: true },
  ).lean();

  if (!result) {
    throw new Error(`Update failed: ${TARGET_SLUG}`);
  }

  console.log(`Updated: ${result.slug}`);
  console.log(`New title: ${result.title}`);
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
