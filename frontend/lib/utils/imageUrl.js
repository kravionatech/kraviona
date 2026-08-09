const DEFAULT_IMAGE = "/images/blog-default.jpg";
const DEFAULT_AUTHOR_AVATAR = "/amar.jpeg";

export function cleanImageUrl(url) {
  if (!url || typeof url !== "string") return DEFAULT_IMAGE;
  if (url.includes("source.unsplash.com")) {
    return "https://images.unsplash.com/photo-1677756119517-756a188d2d94";
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
