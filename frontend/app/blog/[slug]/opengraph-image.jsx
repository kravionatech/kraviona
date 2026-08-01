import { ImageResponse } from "next/og";
import { API_URL } from "@/utils/api";

const FALLBACK_TITLE = "Kraviona Insights";
const FALLBACK_CATEGORY = "Web Development & Technical SEO";
const MAX_TITLE_LENGTH = 110;
const MAX_CATEGORY_LENGTH = 48;

export const alt =
  "Kraviona Insights article on web development and technical SEO";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function cardText(value, fallback, maxLength) {
  if (typeof value !== "string" && typeof value !== "number") {
    return fallback;
  }

  const text = String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return fallback;
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

function getPostDetails(payload) {
  const post = payload?.data || payload?.post || payload?.blog || payload;
  const category =
    post?.category?.name ||
    post?.category?.title ||
    post?.category?.slug ||
    post?.categoryName ||
    post?.category;

  return {
    title: cardText(post?.title, FALLBACK_TITLE, MAX_TITLE_LENGTH),
    category: cardText(category, FALLBACK_CATEGORY, MAX_CATEGORY_LENGTH),
  };
}

async function getPostDetailsForOg(slug) {
  try {
    const response = await fetch(`${API_URL}/post/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return { title: FALLBACK_TITLE, category: FALLBACK_CATEGORY };
    }

    const payload = await response.json();
    return getPostDetails(payload);
  } catch {
    return { title: FALLBACK_TITLE, category: FALLBACK_CATEGORY };
  }
}

export default async function BlogOpenGraphImage({ params }) {
  const { slug } = await params;
  const { title, category } = await getPostDetailsForOg(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#2A4A52",
          color: "white",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              alignItems: "center",
              background: "#E8622A",
              borderRadius: 6,
              color: "#FFFFFF",
              display: "flex",
              height: 36,
              justifyContent: "center",
              marginRight: 14,
              width: 36,
            }}
          >
            K
          </span>
          KRAVIONA INSIGHTS
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              color: "#F28C5E",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 1,
              marginBottom: 18,
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
          <div style={{ fontSize: 52, lineHeight: 1.1, fontWeight: 800 }}>
            {title}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 25,
          }}
        >
          <span style={{ color: "#F28C5E" }}>kraviona.com/blog</span>
          <span>Web development &amp; SEO</span>
        </div>
      </div>
    ),
    size,
  );
}
