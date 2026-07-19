// ─── Global SEO configuration ────────────────────────────────────────────────
export const SITE_URL = "https://kraviona.com";
export const SITE_NAME = "Kraviona Tech Solutions";
export const SITE_TWITTER = "@KravionaTech";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";
export const DEFAULT_OG_IMAGE_ALT =
  "Kraviona Tech Solutions web development and technical SEO team";

export const defaultRobots = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

// Canonical URL helper — always returns trailing-slash-free absolute URL
export function canonicalUrl(path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const clean = cleanPath.replace(/\/+$/, "");
  return clean ? `${SITE_URL}${clean}` : SITE_URL;
}

// Clean excerpt helper — strips HTML and trims to maxLen chars
export function cleanExcerpt(raw = "", maxLen = 160) {
  return (raw || "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, maxLen);
}

export function absoluteImageUrl(image = DEFAULT_OG_IMAGE) {
  if (!image) return canonicalUrl(DEFAULT_OG_IMAGE);
  if (/^https?:\/\//i.test(image)) return image;
  return canonicalUrl(image.startsWith("/") ? image : `/${image}`);
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  imageAlt = DEFAULT_OG_IMAGE_ALT,
  type = "website",
  keywords = [],
  authors = [{ name: SITE_NAME, url: SITE_URL }],
  creator = SITE_NAME,
  publisher = SITE_NAME,
  openGraph = {},
  twitter = {},
  robots = defaultRobots,
} = {}) {
  const url = canonicalUrl(path);
  const imageUrl = absoluteImageUrl(image);

  return {
    title,
    description,
    keywords,
    authors,
    creator,
    publisher,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_IN",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...openGraph,
    },
    twitter: {
      card: "summary_large_image",
      site: SITE_TWITTER,
      creator: SITE_TWITTER,
      title,
      description,
      images: [imageUrl],
      ...twitter,
    },
    robots,
  };
}
