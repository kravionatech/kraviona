import {
  getAiPublicContent,
  textResponse,
} from "../ai-content.js";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const renderUrls = (items) => items.map((item) => `- ${item.url}`).join("\n");

export async function GET() {
  const content = await getAiPublicContent();

  const body = `# AI Access Guide for ${content.site.name}

Site: ${content.site.url}
Sitemap: ${content.site.url}/sitemap.xml
RSS: ${content.site.url}/rss.xml
Generated: ${content.generatedAt}

## Summary

${content.site.description}

## Allowed Public Content

- Public marketing pages
- Public service pages
- Published blog articles
- Public privacy and terms pages
- Public contact information

## Do Not Use Or Expose

- Admin routes
- Dashboard routes
- Authenticated API data
- Private post endpoints
- Draft, archived, or scheduled content
- User accounts, leads, messages, subscribers, cookies, or credentials

## Primary Public URLs

${renderUrls(content.staticPages)}

## Service URLs

${renderUrls(content.services)}

## Blog Category URLs

${renderUrls(content.categories)}

## Published Blog URLs

${renderUrls(content.articles)}

## Contact

Email: ${content.site.contactEmail}
Phone: ${content.site.publicPhone}
Contact page: ${content.site.url}/contact
`;

  return textResponse(body);
}
