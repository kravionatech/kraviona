/**
 * Repairs the URLs reported as 404s by the crawl report.
 *
 * - Replaces the retired Unsplash image with a local, versioned site image.
 * - Removes the dead NASSCOM link while retaining its visible anchor text.
 *
 * Usage: node fix-crawl-404s.js --save
 * The script runs in preview mode unless --save is supplied.
 */
import "dotenv/config";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL;
const SAVE = process.argv.includes("--save");
const RETIRED_IMAGE = "photo-1677756119517-756a188d2d94";
const FALLBACK_IMAGE = "https://kraviona.com/images/blog-default.jpg";
const DEAD_NASSCOM_URL = "https://nasscom.in/knowledge-center/publications/it-bpm-sector-india-strategic-review-2024";

if (!MONGO_URI) throw new Error("Set MONGO_URI or DATABASE_URL before running this script.");

function directMongoUri(uri) {
  if (!uri.startsWith("mongodb+srv://")) return uri;
  const hosts = [
    "ac-i9uvc7d-shard-00-00.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-01.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-02.c9i8wkl.mongodb.net:27017",
  ].join(",");
  return uri.replace("mongodb+srv://", "mongodb://")
    .replace(/\/\/([^@]+@)[^/]+\//, `//$1${hosts}/`)
    .replace(/\?.*$/, "?ssl=true&authSource=admin&replicaSet=atlas-yphon3-shard-0&retryWrites=true&w=majority");
}

async function connectMongo() {
  try { await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 8000 }); }
  catch (error) {
    if (error?.code !== "ECONNREFUSED") throw error;
    await mongoose.connect(directMongoUri(MONGO_URI), { serverSelectionTimeoutMS: 20000 });
  }
}

const Post = mongoose.model("post", new mongoose.Schema({}, { strict: false, collection: "posts" }));
const unwrapLink = (html) => String(html || "").replace(
  new RegExp(`<a([^>]*?)href=["']${DEAD_NASSCOM_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']([^>]*)>([\\s\\S]*?)<\\/a>`, "gi"),
  "$3",
);
const replaceImage = (value) => typeof value === "string"
  ? value.replace(new RegExp(`https://images\\.unsplash\\.com/${RETIRED_IMAGE}[^\\s"'<]*`, "gi"), FALLBACK_IMAGE)
  : value;

try {
  await connectMongo();
  const posts = await Post.find({
    $or: [
      { "featuredImage.url": { $regex: RETIRED_IMAGE, $options: "i" } },
      { ogImage: { $regex: RETIRED_IMAGE, $options: "i" } },
      { twitterImage: { $regex: RETIRED_IMAGE, $options: "i" } },
      { content: { $regex: `${RETIRED_IMAGE}|${DEAD_NASSCOM_URL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, $options: "i" } },
    ],
  }).lean();
  console.log(`${SAVE ? "Saving" : "Previewing"} ${posts.length} affected post(s).`);

  let changed = 0;
  for (const post of posts) {
    const updates = {};
    const featuredUrl = post.featuredImage?.url;
    if (featuredUrl?.includes(RETIRED_IMAGE)) updates["featuredImage.url"] = FALLBACK_IMAGE;
    if (post.ogImage?.includes(RETIRED_IMAGE)) updates.ogImage = FALLBACK_IMAGE;
    if (post.twitterImage?.includes(RETIRED_IMAGE)) updates.twitterImage = FALLBACK_IMAGE;
    const content = unwrapLink(replaceImage(post.content));
    if (content !== post.content) updates.content = content;
    if (!Object.keys(updates).length) continue;
    changed += 1;
    console.log(`${post.slug}: ${Object.keys(updates).join(", ")}`);
    if (SAVE) await Post.updateOne({ _id: post._id }, { $set: updates });
  }
  console.log(`${SAVE ? "Updated" : "Would update"} ${changed} post(s).`);
} finally {
  await mongoose.disconnect();
}
