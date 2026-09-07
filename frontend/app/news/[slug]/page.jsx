import { notFound, permanentRedirect } from "next/navigation";
import { API_URL } from "@/utils/api";
import { canonicalUrl } from "@/app/seoConfig.js";

export const revalidate = 3600;

async function getPost(slug) {
  try {
    const response = await fetch(`${API_URL}/post/${slug}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (response.status === 404) return null;
    if (!response.ok) return null;

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("[LEGACY_NEWS_SLUG_FETCH_ERROR]", error?.message);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "News Not Found | Kraviona",
      robots: { index: false, follow: false },
    };
  }

  const cat = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
  const targetSlug = post.slug || slug;
  const canonical = canonicalUrl(`/${cat}/${targetSlug}`);

  return {
    title: post.title,
    alternates: {
      canonical,
    },
  };
}

export default async function LegacyNewsSlugPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const cat = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
  const targetSlug = post.slug || slug;

  // HTTP 301 Permanent Redirect to new /{newscategory}/{slug} structure
  permanentRedirect(`/${cat}/${targetSlug}`);
}
