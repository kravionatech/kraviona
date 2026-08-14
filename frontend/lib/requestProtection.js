const TRUSTED_CRAWLERS = [
  "googlebot",
  "google-inspectiontool",
  "googleother",
  "adsbot-google",
  "bingbot",
  "bingpreview",
];

const TRUSTED_LINK_PREVIEWS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "whatsapp",
  "telegrambot",
];

const BLOCKED_AUTOMATION = [
  "ahrefsbot",
  "amazonbot",
  "anthropic-ai",
  "applebot-extended",
  "archive.org_bot",
  "bytespider",
  "ccbot",
  "claudebot",
  "cohere-ai",
  "dataforseobot",
  "diffbot",
  "dotbot",
  "gptbot",
  "imagesiftbot",
  "magpie-crawler",
  "mj12bot",
  "omgilibot",
  "petalbot",
  "semrushbot",
  "serpstatbot",
  "yandexbot",
  "youbot",
  "aiohttp",
  "axios/",
  "curl/",
  "got/",
  "go-http-client",
  "httpclient",
  "java/",
  "libwww-perl",
  "node-fetch",
  "okhttp",
  "python-requests",
  "python-urllib",
  "scrapy",
  "wget/",
  "headlesschrome",
  "phantomjs",
  "playwright",
  "puppeteer",
  "selenium",
  "sqlmap",
  "nikto",
  "nuclei",
  "masscan",
  "zgrab",
  "gobuster",
  "dirbuster",
  "feroxbuster",
];

const GENERIC_BOT_SIGNATURE = /(?:bot|crawler|spider|scraper|slurp)/i;
const ALLOWED_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const PUBLIC_INFRASTRUCTURE_PATHS = [
  "/_next/",
  "/_vercel/",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];
const SENSITIVE_PATH_PATTERN =
  /(?:^|\/)(?:\.env|\.git|\.svn|\.hg|wp-admin|wp-login\.php|xmlrpc\.php|phpmyadmin|adminer(?:\.php)?|server-status|actuator|vendor\/phpunit|cgi-bin|config(?:\.json|\.ya?ml|\.php)?|backup(?:\.zip|\.sql)?|database(?:\.sql|\.sqlite)?)(?:\/|$)/i;
const ATTACK_PAYLOAD_PATTERN =
  /(?:\.\.\/|\.\.\\|%2e%2e(?:%2f|%5c)|<script\b|%3cscript\b|\bunion(?:\s|%20)+select\b|\bsleep\s*\(|\bbenchmark\s*\(|\/etc\/passwd|%2fetc%2fpasswd|\$\{jndi:|php:\/\/|file:\/\/)/i;

const containsAny = (value, signatures) =>
  signatures.some((signature) => value.includes(signature));

export const isInfrastructurePath = (pathname) =>
  PUBLIC_INFRASTRUCTURE_PATHS.some((path) => pathname.startsWith(path));

export function classifyPublicRequest({
  pathname,
  search = "",
  method = "GET",
  userAgent = "",
}) {
  if (isInfrastructurePath(pathname)) return null;

  if (!ALLOWED_METHODS.has(method.toUpperCase())) {
    return { status: 405, message: "Method Not Allowed", reason: "method" };
  }

  const requestTarget = `${pathname}${search}`;
  if (
    SENSITIVE_PATH_PATTERN.test(pathname) ||
    ATTACK_PAYLOAD_PATTERN.test(requestTarget)
  ) {
    return { status: 404, message: "Not Found", reason: "attack-pattern" };
  }

  const normalizedAgent = userAgent.trim().toLowerCase();
  const isTrustedCrawler = containsAny(normalizedAgent, TRUSTED_CRAWLERS);
  const isTrustedPreview = containsAny(normalizedAgent, TRUSTED_LINK_PREVIEWS);
  const isBlockedAutomation =
    !normalizedAgent ||
    containsAny(normalizedAgent, BLOCKED_AUTOMATION) ||
    (!isTrustedCrawler &&
      !isTrustedPreview &&
      GENERIC_BOT_SIGNATURE.test(normalizedAgent));

  return isBlockedAutomation
    ? { status: 403, message: "Forbidden", reason: "automation" }
    : null;
}
