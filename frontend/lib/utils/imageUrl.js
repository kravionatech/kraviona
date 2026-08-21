const DEFAULT_IMAGE = "/images/blog-default.jpg";
const DEFAULT_AUTHOR_AVATAR = "";
const RETIRED_UNSPLASH_IMAGE_IDS = ["photo-1677756119517-756a188d2d94"];

export function cleanImageUrl(url) {
  if (!url || typeof url !== "string") return DEFAULT_IMAGE;
  if (url.includes("source.unsplash.com")) return DEFAULT_IMAGE;
  if (RETIRED_UNSPLASH_IMAGE_IDS.some((imageId) => url.includes(imageId))) {
    return DEFAULT_IMAGE;
  }
  if (url.includes("images.unsplash.com")) return url.split("?")[0];
  if (url.includes("api.kraviona.com/avatar")) return DEFAULT_AUTHOR_AVATAR;
  return url;
}

export function getAuthorAvatar(url) {
  if (!url || typeof url !== "string" || url.includes("api.kraviona.com/avatar")) {
    return DEFAULT_AUTHOR_AVATAR;
  }
  return cleanImageUrl(url);
}
