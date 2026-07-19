/**
 * Kraviona Posts — Schema Migration Script
 * 
 * Kya karta hai:
 *   1. Old fields remove karta hai: page, governance, seoTesting, lastReviewedAt, knowledgeGraph
 *   2. New fields add karta hai (agar missing hain) with safe default values
 *   3. Mixed post (#3) ko bhi normalize karta hai
 * 
 * Run: mongosh <connection-string> --file migrate_posts.js
 *      Ya: mongosh mongodb://localhost:27017/kraviona --file migrate_posts.js
 */

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const DB_NAME   = "kraviona";       // apna DB name yahan likho
const COLL_NAME = "posts";          // collection name
// ─────────────────────────────────────────────────────────────────────────────

const db   = db.getSiblingDB(DB_NAME);
const coll = db.getCollection(COLL_NAME);

print("=".repeat(60));
print("Kraviona Posts Migration — Start");
print("=".repeat(60));

// ── STEP 1: Total posts check ─────────────────────────────────────────────
const total = coll.countDocuments({});
print(`\nTotal posts in DB: ${total}`);

// ── STEP 2: Old fields remove karo ───────────────────────────────────────
const OLD_FIELDS = ["page", "governance", "seoTesting", "lastReviewedAt", "knowledgeGraph"];

const unsetPayload = {};
OLD_FIELDS.forEach(f => { unsetPayload[f] = ""; });

const removeResult = coll.updateMany(
  { $or: OLD_FIELDS.map(f => ({ [f]: { $exists: true } })) },
  { $unset: unsetPayload }
);

print(`\n[1] Old fields removed:`);
print(`    Matched : ${removeResult.matchedCount}`);
print(`    Modified: ${removeResult.modifiedCount}`);
print(`    Fields  : ${OLD_FIELDS.join(", ")}`);

// ── STEP 3: New fields add karo (only if missing) ────────────────────────
// $setOnInsert ki jagah $set with condition use karo — 
// har field sirf tab set hoga jab wo exist nahi karta
const NEW_FIELD_DEFAULTS = {
  language                : "en",
  twitterCard             : "summary_large_image",
  primaryTopicCluster     : "",
  supportingTopicClusters : [],
  tableOfContents         : [],
  keyTakeaways            : [],
  quickAnswer             : "",
  ogImage                 : "",
  gallery                 : [],
  sources                 : [],
  statistics              : [],
  alternateLanguageVersions: [],
  structuredDataOverride  : null,
};

let addedCount = 0;

for (const [field, defaultVal] of Object.entries(NEW_FIELD_DEFAULTS)) {
  const res = coll.updateMany(
    { [field]: { $exists: false } },          // sirf wahi posts jahan field nahi hai
    { $set: { [field]: defaultVal } }
  );
  if (res.modifiedCount > 0) {
    print(`    + ${field.padEnd(28)} → default set on ${res.modifiedCount} posts`);
    addedCount += res.modifiedCount;
  }
}

print(`\n[2] New fields added (missing fields filled with defaults)`);

// ── STEP 4: Verify — koi bhi post abhi bhi old format mein toh nahi? ─────
print("\n[3] Verification:");

const stillOld = coll.countDocuments({
  $or: OLD_FIELDS.map(f => ({ [f]: { $exists: true } }))
});
print(`    Posts with old fields remaining : ${stillOld} ${stillOld === 0 ? "✓" : "✗ (check karo!)"}`);

const missingNew = coll.countDocuments({
  $or: Object.keys(NEW_FIELD_DEFAULTS).map(f => ({ [f]: { $exists: false } }))
});
print(`    Posts with missing new fields   : ${missingNew} ${missingNew === 0 ? "✓" : "✗ (check karo!)"}`);

// ── STEP 5: Summary ───────────────────────────────────────────────────────
print("\n" + "=".repeat(60));
if (stillOld === 0 && missingNew === 0) {
  print("Migration SUCCESSFUL — Sab posts ab same (new) format mein hain.");
} else {
  print("Migration INCOMPLETE — Upar warnings dekho.");
}
print("=".repeat(60) + "\n");
