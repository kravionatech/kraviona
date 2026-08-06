/**
 * Kraviona Blog — Fix Broken Internal Links in Post Content
 * ==========================================================
 * Finds every post whose `content` (or meta fields) contains an <a href>
 * pointing to one of the known-broken blog slugs, unwraps the anchor tag
 * (keeps inner text), and saves the cleaned content back to MongoDB.
 *
 * Usage:
 *   node fix-broken-links.js          # dry-run (no DB writes)
 *   node fix-broken-links.js --save   # actually save changes
 *
 * Reads MONGO_URI from .env automatically.
 */

import "dotenv/config";
import mongoose from "mongoose";
import readline from "readline";

// ─── Config ───────────────────────────────────────────────────────────────────

const MONGO_URI_SRV = process.env.MONGO_URI || process.env.DATABASE_URL;
if (!MONGO_URI_SRV) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

/**
 * Build a direct-host connection string from an SRV URI so the script
 * works even when the local system DNS cannot resolve _mongodb._tcp SRV records.
 * Known Atlas shard hosts are derived from the SRV lookup we ran manually.
 */
function buildDirectUri(srvUri) {
  if (!srvUri.startsWith("mongodb+srv://")) return srvUri;
  // Atlas shard hosts resolved from: nslookup -type=SRV _mongodb._tcp.kraviona.c9i8wkl.mongodb.net 8.8.8.8
  const shards = [
    "ac-i9uvc7d-shard-00-00.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-01.c9i8wkl.mongodb.net:27017",
    "ac-i9uvc7d-shard-00-02.c9i8wkl.mongodb.net:27017",
  ].join(",");
  return srvUri
    .replace("mongodb+srv://", "mongodb://")
    .replace(/\/\/([^@]+@)[^/]+\//, `//$1${shards}/`)
    .replace(/\?.*$/, "?ssl=true&authSource=admin&replicaSet=atlas-yphon3-shard-0&retryWrites=true&w=majority");
}

// Try SRV first; fall back to direct hosts if SRV DNS fails
async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI_SRV, { serverSelectionTimeoutMS: 8000 });
  } catch (srvErr) {
    if (srvErr.message && srvErr.message.includes("ECONNREFUSED")) {
      console.log("SRV DNS lookup failed — retrying with direct host connection...");
      const directUri = buildDirectUri(MONGO_URI_SRV);
      await mongoose.connect(directUri, { serverSelectionTimeoutMS: 20000 });
    } else {
      throw srvErr;
    }
  }
}

/** Path-only slugs that do NOT exist in the DB */
const BROKEN_SLUG_PATHS = [
  "/blog/what-is-blockchain-technology-2026",
  "/blog/what-is-a-smart-contract",
  "/blog/how-ai-is-transforming-web-development-in-2026",
  "/blog/what-is-nextjs-and-why-use-it",
  "/blog/technical-seo-audit-services-india",
  "/blog/what-is-blockchain-technology-complete-guide-2026",
  "/blog/web3-for-businesses-practical-guide-2026",
  "/blog/ai-workflow-automation-businesses-complete-guide-2026",
  "/blog/mern-stack-vs-mean-stack-2026",
  "/blog/nodejs-development-company-india",
  "/blog/mern-stack-development-company-india",
  "/blog/ai-automation-company-delhi",
  "/blog/what-is-ai-automation-in-business",
  "/blog/10-game-changing-benefits-of-web-3.0-the-future-of-ownership",
  "/blog/blockchain-developer-complete-career-guide-for-2026",
  "/blog/what-is-on-page-seo",
];

// Include both relative (/blog/...) and absolute (https://kraviona.com/blog/...)
// DB content uses full absolute URLs in <a href>, so we need both forms.
const SITE_ORIGIN = "https://kraviona.com";
const BROKEN_SLUGS = [
  ...BROKEN_SLUG_PATHS,
  ...BROKEN_SLUG_PATHS.map((p) => `${SITE_ORIGIN}${p}`),
];

/** Text fields (besides content) to scan for any broken slug URL. */
const META_FIELDS = ["twitterTitle", "twitterDescription", "ogTitle", "ogDescription"];

// Whether to actually write to DB (pass --save flag to enable)
const DRY_RUN = !process.argv.includes("--save");

// ─── Minimal Mongoose Schema ───────────────────────────────────────────────────

const postSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    content: String,
    twitterTitle: String,
    twitterDescription: String,
    ogTitle: String,
    ogDescription: String,
  },
  { strict: false, timestamps: true }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Given an HTML string, unwrap every <a href="BROKEN_SLUG"...>text</a>
 * -> "text" for each broken slug.
 * Returns { cleaned: string, fixedSlugs: string[] }
 */
function unwrapBrokenLinks(html) {
  if (!html || typeof html !== "string") return { cleaned: html, fixedSlugs: [] };

  let cleaned = html;
  const fixedSlugs = [];

  for (const slug of BROKEN_SLUGS) {
    // Escape special regex chars in the slug (dots, hyphens, etc.)
    const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Match <a href="SLUG" ...any attrs...>any inner content (non-greedy)</a>
    // Handles both straight quotes. The [\s\S]*? allows multiline inner content.
    const pattern = new RegExp(
      `<a[^>]*href=["']${escapedSlug}["'][^>]*>([\\s\\S]*?)<\\/a>`,
      "gi"
    );

    const before = cleaned;
    cleaned = cleaned.replace(pattern, (_, innerText) => innerText);

    if (cleaned !== before) {
      fixedSlugs.push(slug);
    }
  }

  return { cleaned, fixedSlugs };
}

/** Simple side-by-side diff: show first 120 chars before/after for logging */
function shortDiff(before, after, label) {
  if (before === after) return null;
  const trim = (s) =>
    s
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 120);
  return `  [${label}]\n    BEFORE: ${trim(before)}\n    AFTER:  ${trim(after)}`;
}

/** Ask user y/n in terminal */
function askConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === "y");
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  console.log("=".repeat(64));
  console.log(" Kraviona - Fix Broken Internal Blog Links");
  console.log(`  Mode: ${DRY_RUN ? "DRY RUN (no DB writes)" : "LIVE -- will save to DB"}`);
  console.log("=".repeat(64));
  console.log();

  await connectMongo();
  console.log("Connected to MongoDB\n");

  const Post = mongoose.models.post || mongoose.model("post", postSchema);

  // Build a query that finds posts containing ANY broken slug in their content
  const orConditions = BROKEN_SLUGS.flatMap((slug) => [
    { content: { $regex: slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
    ...META_FIELDS.map((f) => ({
      [f]: { $regex: slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" },
    })),
  ]);

  const candidates = await Post.find({ $or: orConditions })
    .select(["slug", "title", "content", ...META_FIELDS])
    .lean();

  console.log(`Found ${candidates.length} candidate post(s) (containing at least one broken slug)\n`);

  if (candidates.length === 0) {
    console.log("Nothing to fix. All internal links look clean.");
    await mongoose.disconnect();
    return;
  }

  // ── Process each candidate ────────────────────────────────────────────────
  const changedPosts = [];

  for (const post of candidates) {
    const updates = {};
    const allFixedSlugs = [];
    const diffs = [];

    // 1. Fix content field
    const { cleaned: newContent, fixedSlugs: contentSlugs } = unwrapBrokenLinks(post.content);
    if (newContent !== post.content) {
      updates.content = newContent;
      allFixedSlugs.push(...contentSlugs);
      const d = shortDiff(post.content, newContent, "content");
      if (d) diffs.push(d);
    }

    // 2. Fix meta text fields
    for (const field of META_FIELDS) {
      const val = post[field];
      if (!val) continue;
      const { cleaned, fixedSlugs } = unwrapBrokenLinks(val);
      if (cleaned !== val) {
        updates[field] = cleaned;
        allFixedSlugs.push(...fixedSlugs);
        const d = shortDiff(val, cleaned, field);
        if (d) diffs.push(d);
      }
    }

    if (Object.keys(updates).length === 0) continue; // no actual changes after precise check

    changedPosts.push({
      _id: post._id,
      slug: post.slug,
      title: post.title,
      fixedSlugs: [...new Set(allFixedSlugs)],
      updates,
      diffs,
    });
  }

  // ── Print report ─────────────────────────────────────────────────────────
  console.log(`Posts requiring changes: ${changedPosts.length}\n`);
  console.log("-".repeat(64));

  for (const p of changedPosts) {
    console.log(`\n  Post: ${p.slug}`);
    console.log(`  Title: ${p.title || "(no title)"}`);
    console.log(`  Broken slugs unwrapped:`);
    for (const slug of p.fixedSlugs) {
      console.log(`    - ${slug}`);
    }
    if (p.diffs.length > 0) {
      console.log(`  Content diff (first 120 chars):`);
      p.diffs.forEach((d) => console.log(d));
    }
  }

  console.log("\n" + "-".repeat(64));
  console.log(`\nSummary: ${changedPosts.length} post(s) need link fixes.\n`);

  if (changedPosts.length === 0) {
    console.log("Nothing to save.");
    await mongoose.disconnect();
    return;
  }

  // ── Dry-run guard ────────────────────────────────────────────────────────
  if (DRY_RUN) {
    console.log("DRY RUN -- no changes saved to MongoDB.");
    console.log("Re-run with:  node fix-broken-links.js --save\n");
    await mongoose.disconnect();
    return;
  }

  // ── Confirm before writing ────────────────────────────────────────────────
  const confirmed = await askConfirmation(
    `Save changes to ${changedPosts.length} post(s) in MongoDB? (y/N): `
  );

  if (!confirmed) {
    console.log("\nAborted. No changes were saved.");
    await mongoose.disconnect();
    return;
  }

  // ── Apply updates ─────────────────────────────────────────────────────────
  let savedCount = 0;
  console.log();

  for (const p of changedPosts) {
    try {
      await Post.updateOne({ _id: p._id }, { $set: p.updates });
      savedCount++;
      console.log(`Saved: ${p.slug}`);
    } catch (err) {
      console.error(`Failed to save ${p.slug}:`, err.message);
    }
  }

  console.log("\n" + "=".repeat(64));
  console.log(`Done. ${savedCount}/${changedPosts.length} posts updated successfully.`);
  console.log("=".repeat(64));

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("\nScript failed:", err);
  mongoose.disconnect().finally(() => process.exit(1));
});
