import { getPublishedPosts } from "@/app/ai-content.js";
import { absoluteImageUrl, canonicalUrl, SITE_NAME, SITE_URL } from "@/app/seoConfig.js";
import { getDate, getExcerpt, getImageUrl } from "@/utils/dataHelpers.js";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const validPubDate = (value) => {
  const date = new Date(getDate(value));
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
};

export async function GET() {
  const posts = await getPublishedPosts();

  const items = posts
    .map((post) => {
      const url = canonicalUrl(`/blog/${post.slug}`);
      const title = escapeXml(post.title || "Kraviona Blog Article");
      const description = escapeXml(
        getExcerpt(post) ||
          post.excerpt ||
          post.description ||
          "Read the latest Kraviona article on web development, SEO, AI automation, and performance.",
      );
      const category = post.category?.name || post.category?.slug || "Technology";
      const imageUrl = getImageUrl(post);
      const enclosure = imageUrl
        ? `<enclosure url="${escapeXml(absoluteImageUrl(imageUrl))}" type="image/jpeg" />`
        : "";

      return `
    <item>
      <title>${title}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${description}</description>
      <author>kravionatech@gmail.com (${escapeXml(post.author?.name || "Kraviona Team")})</author>
      <category>${escapeXml(category)}</category>
      <pubDate>${validPubDate(post.publishedAt || post.createdAt)}</pubDate>
      ${enclosure}
    </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)} Blog</title>
    <link>${escapeXml(canonicalUrl("/blog"))}</link>
    <atom:link href="${escapeXml(`${SITE_URL}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>Fresh Kraviona articles on MERN stack development, Next.js, technical SEO, AI automation, and web performance.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
