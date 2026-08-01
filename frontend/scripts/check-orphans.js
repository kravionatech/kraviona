#!/usr/bin/env node

/**
 * Crawl the canonical sitemap and report indexable URLs with fewer than two
 * inbound internal links. This is intentionally dependency-free so it can run
 * in CI or from a developer machine with Node 18+.
 *
 * Usage: npm run seo:check-orphans
 * Optional: SITE_URL=https://staging.example.com npm run seo:check-orphans
 */

const siteUrl = (process.env.SITE_URL || "https://kraviona.com").replace(/\/$/, "");
const sitemapUrl = `${siteUrl}/sitemap.xml`;
const concurrency = 6;

const canonicalize = (href, base = siteUrl) => {
  try {
    const url = new URL(href, base);
    if (url.origin !== new URL(siteUrl).origin) return null;
    if (!/^https?:$/.test(url.protocol)) return null;

    url.hash = "";
    url.search = "";
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return null;
  }
};

const decodeXml = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const sitemapUrls = (xml) =>
  [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)]
    .map((match) => canonicalize(decodeXml(match[1].trim())))
    .filter(Boolean);

const linksFromHtml = (html, baseUrl) =>
  [...html.matchAll(/<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1/gi)]
    .map((match) => canonicalize(decodeXml(match[2]), baseUrl))
    .filter(Boolean);

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "User-Agent": "KravionaSEOAudit/1.0 (+https://kraviona.com)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function mapWithConcurrency(items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function runWorker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, runWorker),
  );
  return results;
}

async function main() {
  console.log(`Reading sitemap: ${sitemapUrl}`);
  const sitemap = await fetchText(sitemapUrl);
  const urls = [...new Set(sitemapUrls(sitemap))];

  if (!urls.length) {
    throw new Error("No <loc> URLs were found in the sitemap.");
  }

  const sitemapSet = new Set(urls);
  const inboundCounts = new Map(urls.map((url) => [url, 0]));
  const crawlErrors = [];

  await mapWithConcurrency(urls, async (sourceUrl) => {
    try {
      const html = await fetchText(sourceUrl);
      const destinations = new Set(linksFromHtml(html, sourceUrl));

      for (const destination of destinations) {
        if (destination !== sourceUrl && sitemapSet.has(destination)) {
          inboundCounts.set(destination, (inboundCounts.get(destination) || 0) + 1);
        }
      }
    } catch (error) {
      crawlErrors.push({ sourceUrl, message: error.message });
    }
  });

  const canonicalHome = canonicalize(siteUrl);
  const orphans = urls
    .filter((url) => url !== canonicalHome && (inboundCounts.get(url) || 0) < 2)
    .sort();

  console.log(`Crawled ${urls.length} sitemap URLs.`);

  if (crawlErrors.length) {
    console.warn(`Could not crawl ${crawlErrors.length} URL(s):`);
    crawlErrors.forEach(({ sourceUrl, message }) =>
      console.warn(`- ${sourceUrl}: ${message}`),
    );
  }

  if (!orphans.length) {
    console.log("No sitemap URLs have fewer than two inbound internal links.");
    return;
  }

  console.error(`Found ${orphans.length} URL(s) with fewer than two inbound internal links:`);
  orphans.forEach((url) =>
    console.error(`- ${url} (${inboundCounts.get(url) || 0} inbound links)`),
  );
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Orphan check failed: ${error.message}`);
  process.exitCode = 1;
});
