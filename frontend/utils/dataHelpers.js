/**
 * Utility helpers to normalize MongoDB data format.
 * Handles both:
 *   - Live API format: { _id: "string", createdAt: "ISO string" }
 *   - Exported JSON format: { _id: { "$oid": "..." }, createdAt: { "$date": "..." } }
 */

/**
 * Returns the string ID from a MongoDB _id field (handles both formats).
 * @param {string|object} id
 * @returns {string}
 */
export const getId = (id) => {
  if (!id) return "";
  if (typeof id === "string") return id;
  if (id.$oid) return id.$oid;
  return String(id);
};

/**
 * Returns a valid Date string from a MongoDB date field.
 * @param {string|object} date
 * @returns {string}
 */
export const getDate = (date) => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date.$date) return date.$date;
  if (date.$oid && /^[a-f\d]{24}$/i.test(date.$oid)) {
    return new Date(parseInt(date.$oid.slice(0, 8), 16) * 1000).toISOString();
  }
  return String(date);
};

/**
 * Returns the first usable non-empty string.
 * @param  {...any} values
 * @returns {string|null}
 */
const getFirstString = (...values) => {
  const value = values.find(
    (item) =>
      typeof item === "string" &&
      item.trim() &&
      item.trim() !== "undefined" &&
      item.trim() !== "null",
  );

  return value ? value.trim() : null;
};

/**
 * Returns an image URL from either the old nested media shape or the new direct
 * media shape.
 * @param {string|object} image
 * @returns {string|null}
 */
const getMediaUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return getFirstString(image);

  return getFirstString(
    image.url,
    image.secure_url,
    image.large?.url,
    image.medium?.url,
    image.small?.url,
    image.thumbnail?.url,
    image.thumbnailUrl,
  );
};

/**
 * Returns the image URL from a post's available media fields.
 * Supports both old nested featuredImage sizes and the new direct featuredImage.
 * @param {object} post
 * @returns {string|null}
 */
export const getImageUrl = (post) =>
  getFirstString(
    getMediaUrl(post?.featuredImage),
    getMediaUrl(post?.image),
    getMediaUrl(post?.thumbnail),
    getMediaUrl(post?.ogImage),
    getMediaUrl(post?.twitterImage),
    getMediaUrl(post?.gallery?.[0]),
    getMediaUrl(post?.videoEmbedded?.thumbnailUrl),
  );

/**
 * Returns the alt text for a post image.
 * @param {object} post
 * @returns {string}
 */
export const getImageAlt = (post) =>
  post?.featuredImage?.altText ||
  post?.featuredImage?.large?.altText ||
  post?.featuredImage?.medium?.altText ||
  post?.featuredImage?.small?.altText ||
  post?.image?.altText ||
  post?.thumbnail?.altText ||
  post?.gallery?.[0]?.altText ||
  post?.ogTitle ||
  post?.twitterTitle ||
  post?.title ||
  "Blog image";

/**
 * Returns a clean excerpt (strips HTML tags).
 * @param {object} post
 * @returns {string}
 */
export const getExcerpt = (post) =>
  (post?.excerpt || post?.description || "").replace(/<[^>]*>?/gm, "");

/**
 * Formats a date for display.
 * @param {string|object} d
 * @param {"short"|"long"|"numeric"} style
 * @returns {string}
 */
export const formatDate = (d, style = "long") => {
  const dateStr = getDate(d);
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    if (typeof dateStr === "string" && /^[a-f\d]{24}$/i.test(dateStr)) {
      const objectIdDate = new Date(parseInt(dateStr.slice(0, 8), 16) * 1000);

      if (!Number.isNaN(objectIdDate.getTime())) {
        const day = String(objectIdDate.getDate()).padStart(2, "0");
        const month = String(objectIdDate.getMonth() + 1).padStart(2, "0");
        const year = objectIdDate.getFullYear();

        return `${day}-${month}-${year}`;
      }
    }

    return "";
  }

  if (style === "numeric") {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return date.toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Returns the category ID as a plain string.
 * @param {object} post
 * @returns {string}
 */
export const getCategoryId = (post) => {
  const catId =
    post?.category?._id ||
    post?.category?.slug ||
    post?.categoryID ||
    post?.category?.name;
  return getId(catId);
};
