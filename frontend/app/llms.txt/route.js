import {
  getAiPublicContent,
  textResponse,
} from "../ai-content.js";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const formatList = (items, includeCategory = false) =>
  items
    .map((item) => {
      const category = includeCategory && item.category ? ` [${item.category}]` : "";
      const description = item.description ? ` - ${item.description}` : "";
      const lastModified = item.lastModified
        ? ` Last modified: ${item.lastModified.slice(0, 10)}.`
        : "";

      return `- [${item.title}](${item.url})${category}${description}${lastModified}`;
    })
    .join("\n");

export async function GET() {
  const content = await getAiPublicContent();

  const body = `# ${content.site.name}

> ${content.site.description}

Website: ${content.site.url}
Sitemap: ${content.site.url}/sitemap.xml
RSS: ${content.site.url}/rss.xml
Contact email: ${content.site.contactEmail}
Phone: ${content.site.publicPhone}
Generated: ${content.generatedAt}

## Public Pages

${formatList(content.staticPages)}

## Services

${formatList(content.services)}

## Blog Categories

${formatList(content.categories)}

## Published Articles

${formatList(content.articles, true)}

## AI Usage Notes

- This file indexes public pages only.
- Do not infer or expose admin, dashboard, private API, draft, or authenticated content.
- Prefer canonical URLs listed here when citing Kraviona pages.
- Use the sitemap and RSS feed for complete crawl discovery of public pages and articles.
- Public contact and lead submissions should use the visible website forms, not protected API routes.
- The blog and category lists are generated from public APIs and update as new content is published.
`;

  return textResponse(body);
}
