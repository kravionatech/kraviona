/**
 * fix-bare-slug-links.js
 *
 * Scans every blog post's `content` field for internal links that use
 * the pre-migration bare-slug URL pattern:
 *   href="kraviona.com/some-slug" or href="/some-slug"
 *
 * Rewrites them to the canonical category-prefixed URL:
 *   href="/category-slug/some-slug"
 *
 * Usage:
 *   node fix-bare-slug-links.js          -- applies fixes in DB
 *   node fix-bare-slug-links.js --dry-run -- prints changes only, no writes
 *
 * Run from the /backend directory with the same .env your server uses.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const DRY_RUN = process.argv.includes("--dry-run");

// ── Minimal inline schemas (avoids importing the full app) ──────────────────

const postSchema = new mongoose.Schema(
  {
    slug: String,
    content: String,
    category: { slug: String, name: String },
    contentType: String,
  },
  { strict: false },
);
const PostModel =
  mongoose.models.Post || mongoose.model("Post", postSchema, "posts");

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a slug → category-slug lookup from all published posts.
 */
async function buildSlugIndex() {
  const posts = await PostModel.find(
    { slug: { $exists: true, $ne: "" } },
    { slug: 1, "category.slug": 1, contentType: 1 },
  ).lean();

  const index = new Map();
  for (const post of posts) {
    const cat = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
    index.set(post.slug, cat);
  }
  return index;
}

/**
 * Given HTML content and a slug→category index, rewrite every bare-slug
 * internal link to its canonical form.  Returns { newContent, replacements }.
 */
function rewriteLinks(content, slugIndex) {
  if (!content || typeof content !== "string") {
    return { newContent: content, replacements: [] };
  }

  const replacements = [];

  // Match href attributes pointing to:
  //   "https://kraviona.com/slug"
  //   "http://kraviona.com/slug"
  //   "kraviona.com/slug"   (no protocol)
  //   "/slug"               (root-relative, ONE segment)
  // But NOT:
  //   "/services/...", "/category/...", "/blog/...", "/news/...", "/about/..." etc.
  // A "bare slug" is a root-relative path with exactly one path segment.
  const hrefRegex =
    /href=["']((?:https?:\/\/kraviona\.com)?\/)([\w-]+)(["'])/g;

  const RESERVED_PREFIXES = new Set([
    "services",
    "category",
    "blog",
    "news",
    "about",
    "contact",
    "careers",
    "pricing",
    "gallery",
    "team",
    "solutions",
    "privacy-policy",
    "terms",
    "case-studies",
    "sitemap.xml",
    "robots.txt",
    "rss.xml",
    "ai.txt",
    "llms.txt",
  ]);

  let newContent = content.replace(
    hrefRegex,
    (match, prefix, slug, quote) => {
      // Skip if it's a known top-level route (not a blog slug)
      if (RESERVED_PREFIXES.has(slug)) return match;

      // Check if we know this slug
      const categorySlug = slugIndex.get(slug);
      if (!categorySlug) return match; // unknown slug — leave unchanged

      // Already in the correct format if prefix already has category
      const canonical = `/${categorySlug}/${slug}`;
      const newHref = `href=${quote}${canonical}${quote}`;

      if (newHref !== match) {
        replacements.push({ original: match, replacement: newHref });
      }
      return newHref;
    },
  );

  return { newContent, replacements };
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌  No MONGODB_URI in environment. Check your .env file.");
    process.exit(1);
  }

  console.log(`\n🔍  Connecting to MongoDB…${DRY_RUN ? " (DRY RUN)" : ""}`);
  await mongoose.connect(mongoUri);
  console.log("✅  Connected.\n");

  const slugIndex = await buildSlugIndex();
  console.log(`📖  Slug index built: ${slugIndex.size} known slugs.\n`);

  const posts = await PostModel.find(
    { content: { $exists: true, $ne: "" } },
    { slug: 1, content: 1 },
  ).lean();

  console.log(`📝  Scanning ${posts.length} posts for bare-slug links…\n`);

  let patchedCount = 0;
  let totalReplacements = 0;

  for (const post of posts) {
    const { newContent, replacements } = rewriteLinks(post.content, slugIndex);

    if (replacements.length === 0) continue;

    console.log(`  📄  ${post.slug} — ${replacements.length} link(s) to fix:`);
    for (const r of replacements) {
      console.log(`       OLD: ${r.original}`);
      console.log(`       NEW: ${r.replacement}`);
    }

    if (!DRY_RUN) {
      await PostModel.updateOne(
        { _id: post._id },
        { $set: { content: newContent } },
      );
    }

    patchedCount++;
    totalReplacements += replacements.length;
  }

  console.log("\n──────────────────────────────────────────────");
  if (DRY_RUN) {
    console.log(
      `🔎  DRY RUN complete. Would patch ${patchedCount} post(s) with ${totalReplacements} link replacement(s).`,
    );
    console.log("    Run without --dry-run to apply.");
  } else {
    console.log(
      `✅  Done. Patched ${patchedCount} post(s) with ${totalReplacements} link replacement(s).`,
    );
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
