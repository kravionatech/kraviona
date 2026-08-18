import { Auth } from "../../models/auth/auth.models.js";
import { CategoryModel } from "../../models/blog/category.model.js";
import { PostModel } from "../../models/blog/post.model.js";
import slugify from "slugify";
import { recordActivity } from "../../utils/activityLogger.js";
import { notifyBlogSubscribers } from "../../services/blog-push.service.js";
import { parseBoolean } from "../../utils/requestValues.js";

// ==========================================
// CONSTANTS
// ==========================================
const ROLES = {
  USER: "user",
  SUPPORT: "support",
  EDITOR: "editor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
};

// Whitelist (not blacklist) of roles allowed to manage posts at all.
// FIX: the original used a blacklist (`role === "user" || role === "support"`),
// which silently lets ANY future role (e.g. "moderator") create posts since
// it was never added to the block-list. A whitelist fails closed instead.
const CONTENT_MANAGER_ROLES = [ROLES.EDITOR, ROLES.ADMIN, ROLES.SUPER_ADMIN];

// Only the super admin may read or manage content belonging to another user.
// Every other role, including admin, is restricted to records it created.
const FULL_ACCESS_ROLES = [ROLES.SUPER_ADMIN];

// ==========================================
// HELPERS
// ==========================================

const normalizeSlug = (value) =>
  slugify(String(value).toLowerCase().trim(), { lower: true, strict: true });

// FIX: the original called `.map()` directly on keywords/focusKeywords/
// semanticKeywords without checking they were arrays first — a request
// that omitted one of those fields crashed with an uncaught TypeError
// before any validation message could be returned.
const normalizeStringArray = (arr) =>
  Array.isArray(arr)
    ? arr.map((item) => String(item).toLowerCase().trim()).filter(Boolean)
    : [];

// Multipart requests deliver nested values as strings. Normalize only the
// featured image payload here, then let the existing controller validation
// and document mapping keep handling the same `featuredImage.url` field.
const applyUploadedFeaturedImage = (req) => {
  let featuredImage = req.body?.featuredImage;

  if (typeof featuredImage === "string") {
    try {
      featuredImage = JSON.parse(featuredImage);
    } catch {
      // Preserve the existing validation response for malformed JSON payloads.
      return;
    }
  }

  if (!req.file?.path && !featuredImage) return;

  req.body.featuredImage = {
    ...(featuredImage && typeof featuredImage === "object" ? featuredImage : {}),
    ...(req.file?.path ? { url: req.file.path } : {}),
  };
};

// Centralized error handling so Mongoose validation errors and duplicate-key
// errors come back as proper 400/409s instead of being flattened into a
// generic 500 — the original returned 500 for every single failure mode,
// including plain old "this field is required" validation errors.
const handleControllerError = (error, res) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(", ") });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  return res.status(500).json({ success: false, message: error.message });
};

const validateCategory = async (categoryInput) => {
  return CategoryModel.findOne({
    $and: [
      {
        $or: [{ name: categoryInput }, { slug: normalizeSlug(categoryInput) }],
      },
      { status: "published" },
    ],
  });
};

const parseDateInput = (value) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizePublishingFields = ({ status, scheduledAt, currentPost }) => {
  const nextStatus = status || currentPost?.status || "draft";
  const scheduleDate = parseDateInput(scheduledAt ?? currentPost?.scheduledAt);

  if (nextStatus === "scheduled") {
    if (!scheduleDate) {
      return {
        error: {
          status: 400,
          message: "scheduledAt is required when scheduling a post",
        },
      };
    }

    if (scheduleDate <= new Date()) {
      return {
        error: {
          status: 400,
          message: "Scheduled date must be in the future",
        },
      };
    }
  }

  return {
    status: nextStatus,
    scheduledAt: nextStatus === "scheduled" ? scheduleDate : undefined,
  };
};

const publishDueScheduledPosts = async () => {
  const now = new Date();
  // Atomically claim one scheduled post at a time so parallel public requests
  // cannot publish (and notify for) the same article twice.
  for (let processed = 0; processed < 100; processed += 1) {
    const post = await PostModel.findOneAndUpdate(
      { status: "scheduled", scheduledAt: { $lte: now } },
      {
        $set: { status: "published", publishedAt: now },
        $unset: { scheduledAt: "" },
      },
      { new: true },
    );

    if (!post) break;
    await notifyBlogSubscribers(post).catch(() => null);
  }
};

// Public reads must never wait for scheduled publishing or Web Push delivery.
// Keep one background run in flight and throttle the inexpensive due-post check
// so a burst of page requests does not create a burst of MongoDB writes.
const SCHEDULED_PUBLISH_CHECK_INTERVAL_MS = 30_000;
let scheduledPublishPromise = null;
let lastScheduledPublishCheckAt = 0;

const queueDueScheduledPosts = () => {
  const now = Date.now();
  if (scheduledPublishPromise) return scheduledPublishPromise;
  if (now - lastScheduledPublishCheckAt < SCHEDULED_PUBLISH_CHECK_INTERVAL_MS) {
    return null;
  }

  lastScheduledPublishCheckAt = now;
  scheduledPublishPromise = publishDueScheduledPosts()
    .catch((error) => {
      console.error("[scheduled-posts] Background publish failed:", error.message);
    })
    .finally(() => {
      scheduledPublishPromise = null;
    });

  return scheduledPublishPromise;
};

const queueBlogNotification = (post) => {
  void notifyBlogSubscribers(post).catch((error) => {
    console.error("[blog-push] Background delivery failed:", error.message);
  });
};

const publicPostFilter = () => ({
  status: "published",
  $or: [{ publishedAt: { $exists: false } }, { publishedAt: null }, { publishedAt: { $lte: new Date() } }],
});

// ==========================================
// 1. Create Post
// ==========================================
export const createPost = async (req, res) => {
  try {
    applyUploadedFeaturedImage(req);
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }

    // FIX: blacklist -> whitelist (see CONTENT_MANAGER_ROLES above).
    if (!CONTENT_MANAGER_ROLES.includes(user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to create a post",
        success: false,
      });
    }

    const existingUser = await Auth.findById(user.id);
    // FIX: removed leftover `console.log(existingUser)` — it was dumping a
    // full user record (including email) into the server logs on every request.

    if (!existingUser) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!existingUser.isActive) {
      return res.status(403).json({
        message: "Forbidden: Your account is inactive",
        success: false,
      });
    }

    const {
      title,
      slug,
      content,
      excerpt,
      quickAnswer,
      keyTakeaways,
      tableOfContents,
      primaryTopicCluster,
      supportingTopicClusters,
      tags,
      featuredImage,
      bannerImage,
      gallery,
      videoEmbedded,
      metaTitle,
      metaDescription,
      keywords,
      focusKeywords,
      semanticKeywords,
      canonicalUrl,
      isNoIndex,
      isNoFollow,
      schemaType,
      structuredDataOverride,
      language,
      alternateLanguageVersions,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterCard,
      faqSchema,
      sources,
      statistics,
      relatedPosts,
      isAccessibleForFree,
      status,
      scheduledAt,
      contentSourceType,
      isCommentEnabled,
      category,
    } = req.body;

    // FIX: trimmed the required-fields list down to what's actually
    // mandatory. The original forced clients to send booleans that already
    // have schema defaults (isNoIndex, isCommentEnabled...), a
    // `knowledgeGraph` field that doesn't exist on the schema at all, and
    // `readingTimeMinutes`, which the model now computes itself from
    // `content` in a pre-save hook.
    const requiredFields = { title, content, excerpt, primaryTopicCluster, category, featuredImage };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (value === undefined || value === null || value === "") {
        return res.status(400).json({ message: `${field} is required`, success: false });
      }
    }

    if (!featuredImage?.url) {
      return res.status(400).json({ message: "featuredImage.url is required", success: false });
    }

    const publishing = normalizePublishingFields({ status, scheduledAt });

    if (publishing.error) {
      return res.status(publishing.error.status).json({
        success: false,
        message: publishing.error.message,
      });
    }

    // FIX: slug is now optional — derived from the title via slugify if the
    // client doesn't supply one, the way most blog CMSes behave.
    const finalSlug = normalizeSlug(slug && slug.trim() ? slug : title);

    const normalizedKeywords = normalizeStringArray(keywords);
    const normalizedFocusKeywords = normalizeStringArray(focusKeywords);
    const normalizedSemanticKeywords = normalizeStringArray(semanticKeywords);
    const normalizedTags = normalizeStringArray(tags);

    // FIX: the original duplicate-check also matched on overlapping
    // `keywords` ($in), so ANY second post sharing even one keyword (e.g.
    // "seo") with an existing post was rejected as a duplicate. Duplicate
    // detection now only checks the slug — the one field the schema
    // actually enforces uniqueness on.
    const existingPost = await PostModel.findOne({ slug: finalSlug });

    if (existingPost) {
      return res.status(409).json({ message: "A post with this slug already exists", success: false });
    }

    const matchedCategory = await validateCategory(category);

    if (!matchedCategory) {
      return res.status(404).json({ message: "Category not found", success: false });
    }

    // FIX: title is no longer lower-cased — display titles should keep the
    // casing the author typed ("Best Laptops 2026", not "best laptops 2026").
    // Only the slug gets normalized to lowercase.
    const post = new PostModel({
      title: title.trim(),
      slug: finalSlug,
      content: content.trim(),
      excerpt: excerpt.trim(),
      quickAnswer: quickAnswer?.trim(),
      keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [],
      tableOfContents: Array.isArray(tableOfContents) ? tableOfContents : [],
      primaryTopicCluster: primaryTopicCluster.trim(),
      supportingTopicClusters: Array.isArray(supportingTopicClusters) ? supportingTopicClusters : [],
      tags: normalizedTags,
      featuredImage,
      ...(bannerImage?.url && { bannerImage }),
      gallery: Array.isArray(gallery) ? gallery : [],
      videoEmbedded,
      metaTitle: metaTitle?.trim(), // falls back to the schema default (title) if omitted
      metaDescription: metaDescription?.trim(), // falls back to the schema default (excerpt) if omitted
      keywords: normalizedKeywords,
      focusKeywords: normalizedFocusKeywords,
      semanticKeywords: normalizedSemanticKeywords,
      canonicalUrl: canonicalUrl?.trim(),
      isNoIndex: parseBoolean(isNoIndex, false),
      isNoFollow: parseBoolean(isNoFollow, false),
      schemaType,
      structuredDataOverride,
      language,
      alternateLanguageVersions: Array.isArray(alternateLanguageVersions) ? alternateLanguageVersions : [],
      // FIX: og/twitter fields now fall back to metaTitle/metaDescription/
      // title/excerpt instead of being forced as five separate required
      // inputs the client had to fill in by hand for every single post.
      ogTitle: (ogTitle || metaTitle || title).trim(),
      ogDescription: (ogDescription || metaDescription || excerpt).trim(),
      ogImage: ogImage?.trim() || featuredImage?.url,
      twitterTitle: (twitterTitle || metaTitle || title).trim(),
      twitterDescription: (twitterDescription || metaDescription || excerpt).trim(),
      twitterCard,
      faqSchema: Array.isArray(faqSchema) ? faqSchema : [],
      sources: Array.isArray(sources) ? sources : [],
      statistics: Array.isArray(statistics) ? statistics : [],
      relatedPosts: Array.isArray(relatedPosts) ? relatedPosts : [],
      isAccessibleForFree: parseBoolean(isAccessibleForFree, true),
      status: publishing.status,
      scheduledAt: publishing.scheduledAt,
      contentSourceType,
      isCommentEnabled: parseBoolean(isCommentEnabled, true),
      userID: existingUser._id,
      author: {
        name: existingUser.name,
        email: existingUser.email,
        avatar: existingUser.avatar,
        username: existingUser.username,
        jobTitle: existingUser.jobTitle,
        linkedInUrl: existingUser.linkedInUrl,
      },
      categoryID: matchedCategory._id,
      // FIX: removed `status` from the embedded category snapshot — the
      // Post schema's `category` sub-object only defines `name` and `slug`,
      // so this was a dead write Mongoose was silently dropping.
      category: {
        name: matchedCategory.name,
        slug: matchedCategory.slug,
      },
    });

    await post.save();

    await recordActivity(req, {
      userID: user.id,
      module: "blog",
      action: "created",
      resourceId: post._id,
      resourceName: post.title,
      after: { title: post.title, slug: post.slug, status: post.status },
    });
    await CategoryModel.findByIdAndUpdate(post.categoryID, {
      $inc: { postCount: 1 },
    });

    if (post.status === "published") {
      queueBlogNotification(post);
    }

    return res.status(201).json({
      message: "Post created successfully",
      success: true,
      data: post,
    });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

// ==========================================
// 2. Public Post List
// ==========================================
export const publicPosts = async (req, res) => {
  try {
    queueDueScheduledPosts();
    // Publishing is managed from a separate admin deployment. Public feeds
    // must re-check MongoDB so a newly published post is visible immediately.
    res.set("Cache-Control", "no-store, max-age=0, must-revalidate");

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(24, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const skip = (page - 1) * limit;
    const filter = publicPostFilter();
    const category = req.query.category
      ? normalizeSlug(req.query.category)
      : null;
    const search = String(req.query.search || "").trim();

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex },
        { primaryTopicCluster: searchRegex },
        { "category.name": searchRegex },
      ];
    }

    // Category feeds must be filtered by MongoDB before pagination. Filtering
    // a generic page of posts in the browser drops valid results as soon as a
    // category has no post in that page. Support both the current embedded
    // snapshot and categoryID so older records remain discoverable.
    if (category) {
      const matchedCategory = await CategoryModel.findOne({
        slug: category,
        status: "published",
      }).select("_id");

      if (!matchedCategory) {
        return res.status(200).json({
          success: true,
          message: "No posts found",
          data: [],
          pagination: {
            totalPosts: 0,
            currentPage: page,
            totalPages: 0,
            limit,
            hasNextPage: false,
            hasPreviousPage: page > 1,
          },
        });
      }

      filter.$and = [
        {
          $or: [
            { categoryID: matchedCategory._id },
            { "category.slug": category },
          ],
        },
      ];
    }

    const [posts, totalPosts] = await Promise.all([
      PostModel.find(filter)
        // Keep public cards focused on visible site fields.
        .select(
          "title slug excerpt author category categoryID views featuredImage contentSourceType commentCount tags primaryTopicCluster readingTimeMinutes publishedAt createdAt updatedAt"
        )
        // FIX: there was no sort at all before — results came back in
        // whatever order Mongo happened to store them in.
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      PostModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      message: posts.length ? "Posts found" : "No posts found",
      data: posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        limit,
        hasNextPage: page < Math.ceil(totalPosts / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

// ==========================================
// 3. Private Post List (own / managed posts)
// ==========================================
export const privatePosts = async (req, res) => {
  try {
    queueDueScheduledPosts();

    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!CONTENT_MANAGER_ROLES.includes(user.role)) {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    // FIX: added pagination — the original fetched every post the user had
    // ever written in a single query with no limit at all.
    const requestedPage = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

    // Super admin manages everyone's posts; every other role sees only its own.
    const baseFilter = FULL_ACCESS_ROLES.includes(user.role)
      ? {}
      : { userID: user.id };
    const status = String(req.query.status || "").trim().toLowerCase();
    const indexability = String(req.query.indexability || "").trim().toLowerCase();
    const search = String(req.query.search || "").trim();

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      baseFilter.$or = [
        { title: searchRegex },
        { slug: searchRegex },
        { "author.name": searchRegex },
      ];
    }

    const filter = { ...baseFilter };
    if (status && ["draft", "published", "scheduled", "archived"].includes(status)) {
      filter.status = status;
    }
    if (indexability === "noindex") filter.isNoIndex = true;
    if (indexability === "indexed") filter.isNoIndex = { $ne: true };

    const [totalPosts, published, draft, scheduled, archived, noIndex, indexed] =
      await Promise.all([
        PostModel.countDocuments(filter),
        PostModel.countDocuments({ ...baseFilter, status: "published" }),
        PostModel.countDocuments({ ...baseFilter, status: "draft" }),
        PostModel.countDocuments({ ...baseFilter, status: "scheduled" }),
        PostModel.countDocuments({ ...baseFilter, status: "archived" }),
        PostModel.countDocuments({ ...baseFilter, isNoIndex: true }),
        PostModel.countDocuments({ ...baseFilter, isNoIndex: { $ne: true } }),
      ]);
    const totalPages = Math.ceil(totalPosts / limit);
    const page = totalPages ? Math.min(requestedPage, totalPages) : 1;
    const skip = (page - 1) * limit;

    const posts = await PostModel.find(filter)
        // FIX: same `reaction` -> `reactions` typo as publicPosts.
        .select(
          "title slug excerpt author category reactions views featuredImage contentSourceType commentCount createdAt updatedAt publishedAt scheduledAt status isNoIndex"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
      pagination: {
        totalPosts,
        currentPage: page,
        totalPages,
        limit,
        statusCounts: { published, draft, scheduled, archived },
        indexabilityCounts: { noIndex, indexed },
      },
    });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

// ==========================================
// 4. Delete Post
// ==========================================
export const deletePost = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // FIX/NOTE: extended from "only super_admin" to FULL_ACCESS_ROLES
    // (admin + super_admin) to match the access pattern used elsewhere in
    // this file. If admins were deliberately restricted to NOT delete other
    // people's posts, revert this line to `user.role === ROLES.SUPER_ADMIN`.
    const post = FULL_ACCESS_ROLES.includes(user.role)
      ? await PostModel.findById(req.params.id)
      : await PostModel.findOne({ _id: req.params.id, userID: user.id });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you don't have permission.",
      });
    }

    await post.deleteOne();
    await recordActivity(req, {
      userID: user.id,
      module: "blog",
      action: "deleted",
      resourceId: post._id,
      resourceName: post.title,
      before: { title: post.title, slug: post.slug, status: post.status },
    });
    await CategoryModel.findOneAndUpdate(
      { _id: post.categoryID, postCount: { $gt: 0 } },
      { $inc: { postCount: -1 } },
    );

    return res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

// ==========================================
// 5. Update Post
// ==========================================
// NOTE: this was an empty stub in the original file — implemented from
// scratch below. Uses `findById` + field assignment + `.save()` on purpose
// (NOT `findByIdAndUpdate`), because `findByIdAndUpdate` skips document
// middleware — which would silently disable the wordCount/readingTime
// recalculation and slug-history tracking defined on the model's
// pre('save') hook.
export const updatePost = async (req, res) => {
  try {
    applyUploadedFeaturedImage(req);
    queueDueScheduledPosts();

    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const canManageAnyPost = FULL_ACCESS_ROLES.includes(user.role);

    const post = canManageAnyPost
      ? await PostModel.findById(req.params.id)
      : await PostModel.findOne({ _id: req.params.id, userID: user.id });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you don't have permission.",
      });
    }

    const {
      title,
      slug,
      content,
      excerpt,
      quickAnswer,
      keyTakeaways,
      tableOfContents,
      primaryTopicCluster,
      supportingTopicClusters,
      tags,
      featuredImage,
      bannerImage,
      gallery,
      videoEmbedded,
      metaTitle,
      metaDescription,
      keywords,
      focusKeywords,
      semanticKeywords,
      canonicalUrl,
      isNoIndex,
      isNoFollow,
      schemaType,
      structuredDataOverride,
      language,
      alternateLanguageVersions,
      ogTitle,
      ogDescription,
      ogImage,
      twitterTitle,
      twitterDescription,
      twitterCard,
      faqSchema,
      sources,
      statistics,
      relatedPosts,
      isAccessibleForFree,
      status,
      scheduledAt,
      contentSourceType,
      isCommentEnabled,
      category,
      reviewedBy,
      lastReviewedAt,
      nextReviewDueAt,
    } = req.body;

    // Only re-slugify / re-check uniqueness if slug or title actually changed.
    if (slug || title) {
      const newSlug = normalizeSlug(slug && slug.trim() ? slug : title || post.title);

      if (newSlug !== post.slug) {
        const slugTaken = await PostModel.findOne({ slug: newSlug, _id: { $ne: post._id } });

        if (slugTaken) {
          return res.status(409).json({ success: false, message: "A post with this slug already exists" });
        }

        post.slug = newSlug; // pre('save') hook records the old slug into previousSlugs
      }
    }

    // Only re-validate the category if the client actually sent one.
    const previousCategoryId = post.categoryID;
    const wasPublished = post.status === "published";
    const before = { title: post.title, slug: post.slug, status: post.status };

    if (category !== undefined) {
      const matchedCategory = await validateCategory(category);

      if (!matchedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }

      if (String(matchedCategory._id) !== String(post.categoryID)) {
        post.categoryID = matchedCategory._id;
        post.category = { name: matchedCategory.name, slug: matchedCategory.slug };
      }
    }

    if (title !== undefined) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();
    if (excerpt !== undefined) post.excerpt = excerpt.trim();
    if (quickAnswer !== undefined) post.quickAnswer = quickAnswer.trim();
    if (keyTakeaways !== undefined) post.keyTakeaways = keyTakeaways;
    if (tableOfContents !== undefined) post.tableOfContents = tableOfContents;
    if (primaryTopicCluster !== undefined) post.primaryTopicCluster = primaryTopicCluster.trim();
    if (supportingTopicClusters !== undefined) post.supportingTopicClusters = supportingTopicClusters;
    if (tags !== undefined) post.tags = normalizeStringArray(tags);

    // Merge (not replace) nested objects so a partial update like
    // { featuredImage: { altText: "new" } } doesn't wipe out url/width/height.
    if (featuredImage !== undefined) {
      post.featuredImage = { ...post.featuredImage?.toObject?.(), ...featuredImage };
    }
    if (bannerImage !== undefined) {
      post.bannerImage = bannerImage?.url ? bannerImage : undefined;
    }
    if (gallery !== undefined) post.gallery = gallery;
    if (videoEmbedded !== undefined) {
      post.videoEmbedded = { ...post.videoEmbedded?.toObject?.(), ...videoEmbedded };
    }

    if (metaTitle !== undefined) post.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined) post.metaDescription = metaDescription.trim();
    if (keywords !== undefined) post.keywords = normalizeStringArray(keywords);
    if (focusKeywords !== undefined) post.focusKeywords = normalizeStringArray(focusKeywords);
    if (semanticKeywords !== undefined) post.semanticKeywords = normalizeStringArray(semanticKeywords);
    if (canonicalUrl !== undefined) post.canonicalUrl = canonicalUrl.trim();
    if (isNoIndex !== undefined) post.isNoIndex = parseBoolean(isNoIndex, post.isNoIndex);
    if (isNoFollow !== undefined) post.isNoFollow = parseBoolean(isNoFollow, post.isNoFollow);
    if (schemaType !== undefined) post.schemaType = schemaType;
    if (structuredDataOverride !== undefined) post.structuredDataOverride = structuredDataOverride;
    if (language !== undefined) post.language = language;
    if (alternateLanguageVersions !== undefined) post.alternateLanguageVersions = alternateLanguageVersions;
    if (ogTitle !== undefined) post.ogTitle = ogTitle.trim();
    if (ogDescription !== undefined) post.ogDescription = ogDescription.trim();
    if (ogImage !== undefined) post.ogImage = ogImage.trim();
    if (twitterTitle !== undefined) post.twitterTitle = twitterTitle.trim();
    if (twitterDescription !== undefined) post.twitterDescription = twitterDescription.trim();
    if (twitterCard !== undefined) post.twitterCard = twitterCard;
    if (faqSchema !== undefined) post.faqSchema = faqSchema;
    if (sources !== undefined) post.sources = sources;
    if (statistics !== undefined) post.statistics = statistics;
    if (relatedPosts !== undefined) post.relatedPosts = relatedPosts;
    if (isAccessibleForFree !== undefined) {
      post.isAccessibleForFree = parseBoolean(isAccessibleForFree, post.isAccessibleForFree);
    }
    if (status !== undefined || scheduledAt !== undefined) {
      const publishing = normalizePublishingFields({
        status,
        scheduledAt,
        currentPost: post,
      });

      if (publishing.error) {
        return res.status(publishing.error.status).json({
          success: false,
          message: publishing.error.message,
        });
      }

      post.status = publishing.status;
      post.scheduledAt = publishing.scheduledAt;
    }
    if (contentSourceType !== undefined) post.contentSourceType = contentSourceType;
    if (isCommentEnabled !== undefined) {
      post.isCommentEnabled = parseBoolean(isCommentEnabled, post.isCommentEnabled);
    }

    // E-E-A-T fields — usually set by a reviewer rather than the original
    // author. Left open here; gate this behind a stricter role check in
    // your route middleware if only editors/admins should set these.
    if (reviewedBy !== undefined) {
      post.reviewedBy = { ...post.reviewedBy?.toObject?.(), ...reviewedBy };
    }
    if (lastReviewedAt !== undefined) post.lastReviewedAt = lastReviewedAt;
    if (nextReviewDueAt !== undefined) post.nextReviewDueAt = nextReviewDueAt;

    await post.save();
    await recordActivity(req, {
      userID: user.id,
      module: "blog",
      action: "updated",
      resourceId: post._id,
      resourceName: post.title,
      before,
      after: { title: post.title, slug: post.slug, status: post.status },
    });

    if (String(previousCategoryId) !== String(post.categoryID)) {
      await Promise.all([
        CategoryModel.findOneAndUpdate(
          { _id: previousCategoryId, postCount: { $gt: 0 } },
          { $inc: { postCount: -1 } },
        ),
        CategoryModel.findByIdAndUpdate(post.categoryID, {
          $inc: { postCount: 1 },
        }),
      ]);
    }

    if (!wasPublished && post.status === "published") {
      queueBlogNotification(post);
    }

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

// ==========================================
// 6. Public View Post
// ==========================================
export const singleViewPost = async (req, res) => {
  try {
    queueDueScheduledPosts();
    res.set("Cache-Control", "no-store, max-age=0, must-revalidate");

    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ success: false, message: "Slug is required" });
    }

    // Public detail fetch must be read-only. Views are recorded through the
    // engagement endpoint only after a real browser reader opens the article.
    let blog = await PostModel.findOne({ slug, ...publicPostFilter() })
      .select("-reactions")
      .populate("relatedPosts", "title slug excerpt featuredImage");

    if (!blog) {
      blog = await PostModel.findOne({
        "previousSlugs.slug": slug,
        ...publicPostFilter(),
      })
        .select("-reactions")
        .populate("relatedPosts", "title slug excerpt featuredImage");
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    return res.status(200).json({ success: true, data: blog });
  } catch (error) {
    return handleControllerError(error, res);
  }
};

// ==========================================
// 7. Private View Post (full detail, for the editor UI)
// ==========================================
// NOTE: this was also just a comment header in the original file, with no
// implementation. Returns the full document (including draft content)
// instead of the trimmed `.select()` used on the public endpoint, since
// this powers an edit screen, not a public card.
export const privateViewPost = async (req, res) => {
  try {
    queueDueScheduledPosts();

    const user = req.user;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Post id is required" });
    }

    const canViewAnyPost = FULL_ACCESS_ROLES.includes(user.role);

    const post = canViewAnyPost
      ? await PostModel.findById(id)
      : await PostModel.findOne({ _id: id, userID: user.id });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you don't have permission.",
      });
    }

    return res.status(200).json({ success: true, data: post });
  } catch (error) {
    return handleControllerError(error, res);
  }
};
