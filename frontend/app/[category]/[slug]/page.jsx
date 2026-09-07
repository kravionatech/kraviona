import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  CalendarDays,
  Clock,
  Eye,
  Linkedin,
  Mail,
  UserRound,
  ArrowLeft,
  Newspaper,
  Tag,
  Share2,
} from "lucide-react";
import BlogEngagement from "@/components/Blog/BlogEngagement";
import BlogDetailPage from "@/components/Blog/BlogDetails/BlogDetailPage";
import PostCard from "@/components/Card/PostCard";
import NewsCard from "@/components/News/NewsCard";
import ReadingProgress from "@/components/Blog/ReadingProgress";
import { JsonLd } from "@/components/JsonLd";
import {
  canonicalUrl,
  cleanExcerpt,
  absoluteImageUrl,
  defaultRobots,
  SITE_NAME,
  SITE_TWITTER,
  normalizeStructuredData,
} from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";
import {
  formatDate,
  getDate,
  getImageAlt,
  getImageUrl,
} from "@/utils/dataHelpers";
import { getAuthorAvatar } from "@/lib/utils/imageUrl";

export const revalidate = 3600;
export const dynamicParams = true;

const SERVICE_LINKS = {
  default: [
    {
      href: "/services/full-stack-development",
      label: "Full-stack web development services",
    },
    {
      href: "/services/react-development",
      label: "React and Next.js development services",
    },
  ],
  seo: [
    {
      href: "/services/technical-seo",
      label: "Technical SEO services",
    },
    {
      href: "/services/web-performance-optimization",
      label: "Web performance optimization services",
    },
  ],
  ai: [
    {
      href: "/services/ai-automation",
      label: "AI workflow automation services",
    },
    {
      href: "/services/ai-chatbot-development",
      label: "AI chatbot development services",
    },
  ],
};

const plainText = (value = "") =>
  String(value)
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

function getArticleSchemaType(blog) {
  const explicitType = String(blog?.schemaType || "").trim();
  const allowedTypes = new Set([
    "Article",
    "BlogPosting",
    "TechArticle",
    "NewsArticle",
  ]);

  if (allowedTypes.has(explicitType)) return explicitType;
  if (blog?.contentType === "news") return "NewsArticle";

  const searchable = `${blog?.title || ""} ${blog?.category?.name || ""} ${blog?.category?.slug || ""}`.toLowerCase();
  if (
    searchable.includes("how to") ||
    searchable.includes("guide") ||
    searchable.includes("setup") ||
    searchable.includes("architecture") ||
    searchable.includes("code")
  ) {
    return "TechArticle";
  }

  return "BlogPosting";
}

function getAuthorProfile(blog) {
  const author = blog?.author || {};
  const account =
    blog?.userID && typeof blog.userID === "object" ? blog.userID : {};
  const profile = account.profile || {};
  const socialLinks = Array.isArray(profile.socialLinks)
    ? profile.socialLinks
    : [];

  const socialUrl = (platform) =>
    socialLinks.find((link) =>
      String(link?.name || "")
        .toLowerCase()
        .includes(platform),
    )?.url || "";

  return {
    name: account.name || author.name || "Kraviona Team",
    username: account.username || author.username || "",
    role:
      profile.jobTitle ||
      author.jobTitle ||
      author.role ||
      author.title ||
      "Senior Technical Strategist",
    bio:
      profile.bio ||
      author.bio ||
      author.description ||
      "Technical insights and architectural guides from Kraviona Tech Solutions.",
    avatar: getAuthorAvatar(
      account.avatar ||
        profile.avatar ||
        author.avatar ||
        author.image ||
        author.profileImage,
    ),
    linkedin:
      author.linkedin ||
      author.linkedIn ||
      author.socialLinks?.linkedin ||
      profile.linkedin ||
      socialUrl("linkedin") ||
      "https://www.linkedin.com/company/kraviona",
    email: account.email || author.email || "kravionatech@gmail.com",
  };
}

function getRelevantServices(blog) {
  const category = String(
    blog?.category?.slug || blog?.category?.name || "",
  ).toLowerCase();

  if (category.includes("seo") || category.includes("performance")) {
    return SERVICE_LINKS.seo;
  }
  if (category.includes("ai") || category.includes("machine-learning")) {
    return SERVICE_LINKS.ai;
  }
  return SERVICE_LINKS.default;
}

// ─── Data Fetchers ────────────────────────────────────────────────────────────

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
    console.error("[POST_FETCH_ERROR]", error?.message);
    return null;
  }
}

async function getRecommendedPosts(contentType = "blog") {
  try {
    const url = `${API_URL}/public/posts?contentType=${contentType}&page=1&limit=8`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data.posts)
      ? data.posts
      : Array.isArray(data.data)
        ? data.data
        : [];
  } catch {
    return [];
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found | Kraviona",
      description: "The requested article could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalCategory =
    post.category?.slug || (post.contentType === "news" ? "news" : "blog");
  const postCanonical = canonicalUrl(`/${canonicalCategory}/${post.slug || slug}`);

  const seoTitle =
    post.metaTitle ||
    (post.contentType === "news"
      ? `${post.title} | Kraviona News`
      : `${post.title} | Kraviona Insights`);

  const description =
    post.metaDescription ||
    post.excerpt ||
    post.content?.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
    "Insights from Kraviona Tech Solutions.";

  const featuredImageUrl = getImageUrl(post);

  return {
    title: seoTitle,
    description,
    alternates: {
      canonical: postCanonical,
    },
    openGraph: {
      title: post.ogTitle || seoTitle,
      description: post.ogDescription || description,
      url: postCanonical,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt || post.publishedAt || post.createdAt,
      authors: ["https://kraviona.com/about"],
      section: post.category?.name || (post.contentType === "news" ? "News" : "Tech"),
      tags: post.tags || [],
      images: [
        {
          url: featuredImageUrl || `${postCanonical}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.twitterTitle || post.ogTitle || seoTitle,
      description: post.twitterDescription || post.ogDescription || description,
      images: [featuredImageUrl || `${postCanonical}/opengraph-image`],
      creator: SITE_TWITTER,
      site: SITE_TWITTER,
    },
    robots:
      post.isNoIndex || post.isNoFollow
        ? { index: !post.isNoIndex, follow: !post.isNoFollow }
        : defaultRobots,
  };
}

// ─── Main Page Component ──────────────────────────────────────────────────────

export default async function PostDetailPage({ params }) {
  const { category, slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  // 1. Canonical Category & Slug Guard:
  // If the URL category does not match the post's actual category slug,
  // or if the URL slug was a legacy slug resolved via previousSlugs,
  // issue a 301 permanent redirect to the canonical path /{canonicalCategory}/{canonicalSlug}.
  const canonicalCategory =
    post.category?.slug || (post.contentType === "news" ? "news" : "blog");
  const canonicalSlug = post.slug || slug;

  if (category !== canonicalCategory || slug !== canonicalSlug) {
    permanentRedirect(`/${canonicalCategory}/${canonicalSlug}`);
  }

  const isNews = post.contentType === "news";
  const allRecommended = await getRecommendedPosts(isNews ? "news" : "blog");

  // Filter related posts (exclude current, prefer same category)
  const relatedPosts = allRecommended
    .filter((item) => item?.slug && item.slug !== canonicalSlug)
    .sort((a, b) => {
      const aSameCat = a.category?.slug === canonicalCategory ? 1 : 0;
      const bSameCat = b.category?.slug === canonicalCategory ? 1 : 0;
      return bSameCat - aSameCat;
    })
    .slice(0, 3);

  const featuredImageUrl = getImageUrl(post);
  const featuredImageAlt = getImageAlt(post);
  const authorProfile = getAuthorProfile(post);
  const publishedSource = post.publishedAt || post.createdAt;
  const updatedSource = post.updatedAt;
  const publishedDate = formatDate(publishedSource) || "Recently published";
  const updatedDate =
    getDate(updatedSource) && getDate(updatedSource) !== getDate(publishedSource)
      ? formatDate(updatedSource)
      : null;
  const readingTime = post.readingTimeMinutes
    ? `${post.readingTimeMinutes} min read`
    : "Quick read";

  const articleImage = absoluteImageUrl(featuredImageUrl || "/og-image.jpg");
  const articleDescription = plainText(
    post.metaDescription || post.excerpt || post.content || "",
  ).substring(0, 160);
  const articleText = plainText(post.content || post.excerpt || "");
  const articleWords = articleText ? articleText.split(/\s+/).filter(Boolean) : [];
  const calculatedReadingMinutes = Math.max(1, Math.ceil(articleWords.length / 200));
  const articleTags = Array.isArray(post.tags) ? post.tags : [];
  const postCanonical = canonicalUrl(`/${canonicalCategory}/${canonicalSlug}`);

  // ── News View ──────────────────────────────────────────────────────────────
  if (isNews) {
    const newsArticleSchema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "@id": `${postCanonical}#article`,
      headline: post.title,
      description: articleDescription,
      image: {
        "@type": "ImageObject",
        url: articleImage,
        width: 1200,
        height: 630,
      },
      url: postCanonical,
      datePublished: getDate(publishedSource),
      dateModified: getDate(updatedSource || publishedSource),
      articleSection: post.category?.name || "Tech News",
      keywords: articleTags.join(", ") || post.category?.name,
      wordCount: post.wordCount || articleWords.length || undefined,
      timeRequired: `PT${post.readingTimeMinutes || calculatedReadingMinutes}M`,
      isAccessibleForFree: post.isAccessibleForFree ?? true,
      inLanguage: "en-IN",
      isPartOf: { "@id": "https://kraviona.com/#website" },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: "https://kraviona.com",
        logo: {
          "@type": "ImageObject",
          url: "https://kraviona.com/logo.png",
          width: 200,
          height: 60,
        },
      },
      author: {
        "@type": "Person",
        name: authorProfile.name,
        url: authorProfile.linkedin || "https://kraviona.com/about",
        jobTitle: authorProfile.role,
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": postCanonical,
      },
    };

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://kraviona.com" },
        { "@type": "ListItem", position: 2, name: "News", item: "https://kraviona.com/news" },
        {
          "@type": "ListItem",
          position: 3,
          name: post.category?.name || "Category",
          item: `https://kraviona.com/news?category=${canonicalCategory}`,
        },
        { "@type": "ListItem", position: 4, name: post.title, item: postCanonical },
      ],
    };

    return (
      <>
        <JsonLd data={newsArticleSchema} />
        <JsonLd data={breadcrumbSchema} />
        <ReadingProgress />

        <article className="min-h-screen bg-[#0d1518] text-white">
          {/* Top Editorial Bar */}
          <div className="border-b border-white/10 bg-[#080d10]/80 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                Back to News
              </Link>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-[#e84a2f]/20 text-[#e84a2f] border border-[#e84a2f]/30 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  <Newspaper size={10} />
                  News Report
                </span>
              </div>
            </div>
          </div>

          {/* Article Header */}
          <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Link
                href={`/news?category=${canonicalCategory}`}
                className="inline-flex items-center gap-1 bg-[#e84a2f] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full hover:bg-[#d43d23] transition-colors"
              >
                <Tag size={10} />
                {post.category?.name || "News"}
              </Link>
              <span className="text-white/40 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/60 font-medium">
                <CalendarDays size={12} className="text-[#e84a2f]" />
                {publishedDate}
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/60 font-medium">
                <Clock size={12} className="text-[#e84a2f]" />
                {readingTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed font-normal mb-8 border-l-2 border-[#e84a2f] pl-4">
                {plainText(post.excerpt)}
              </p>
            )}

            {/* Author Byline */}
            <div className="flex items-center justify-between border-t border-b border-white/10 py-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0 relative">
                  {authorProfile.avatar ? (
                    <Image
                      src={authorProfile.avatar}
                      alt={authorProfile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm font-bold">
                      {authorProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{authorProfile.name}</p>
                  <p className="text-xs text-white/50">{authorProfile.role}</p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {featuredImageUrl && (
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 shadow-2xl border border-white/10">
                <Image
                  src={featuredImageUrl}
                  alt={featuredImageAlt || post.title}
                  fill
                  priority
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* Article Body */}
          <main className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
            {/* Key Takeaways */}
            {Array.isArray(post.keyTakeaways) && post.keyTakeaways.length > 0 && (
              <div className="bg-[#142024] rounded-2xl border border-[#2a4a52] p-6 mb-10">
                <p className="text-xs font-black uppercase tracking-widest text-[#e84a2f] mb-3">
                  Key Takeaways
                </p>
                <ul className="space-y-2">
                  {post.keyTakeaways.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e84a2f] mt-2 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Rich HTML Content */}
            <div
              className="news-content prose prose-invert max-w-none text-white/85 text-base sm:text-lg leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {articleTags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-2 items-center">
                <span className="text-xs text-white/40 font-bold uppercase tracking-wider mr-2">
                  Tags:
                </span>
                {articleTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold bg-white/5 border border-white/10 text-white/70 px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Live Engagement Section */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <BlogEngagement blog={post} />
            </div>
          </main>

          {/* Related News */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-white/10 bg-[#080d10] py-16">
              <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#e84a2f]">
                      Keep Reading
                    </p>
                    <h2 className="text-2xl font-black text-white mt-1">
                      Related Tech News
                    </h2>
                  </div>
                  <Link
                    href="/news"
                    className="text-xs font-bold text-white/60 hover:text-white transition-colors"
                  >
                    View all news →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((item) => (
                    <NewsCard key={item.slug} post={item} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </article>
      </>
    );
  }

  // ── Blog View ──────────────────────────────────────────────────────────────
  const uploadedBannerImageUrl =
    typeof post.bannerImage === "string"
      ? post.bannerImage
      : post.bannerImage?.url || "";
  const uploadedBannerImageAlt =
    typeof post.bannerImage === "object" ? post.bannerImage?.altText || "" : "";
  const heroImageUrl = uploadedBannerImageUrl || featuredImageUrl;
  const heroImageAlt = uploadedBannerImageUrl
    ? uploadedBannerImageAlt
    : featuredImageAlt;

  const relevantServices = getRelevantServices(post);
  const bannerExcerpt =
    cleanExcerpt(post.excerpt || post.content || "", 220) ||
    "Fresh insights from Kraviona on modern web development, performance, SEO, and digital growth.";

  const authorSocials = [
    {
      name: "LinkedIn",
      href: authorProfile.linkedin,
      icon: Linkedin,
    },
    {
      name: "Email",
      href: authorProfile.email ? `mailto:${authorProfile.email}` : "",
      icon: Mail,
    },
  ].filter((item) => item.href);

  const faqItems = Array.isArray(post.faqSchema)
    ? post.faqSchema
        .filter((faq) => faq?.question && faq?.answer)
        .map((faq) => ({
          "@type": "Question",
          name: plainText(faq.question),
          acceptedAnswer: {
            "@type": "Answer",
            text: plainText(faq.answer),
          },
        }))
    : [];

  const supportedArticleType = getArticleSchemaType(post);
  const generatedArticleSchema = {
    "@context": "https://schema.org",
    "@type": supportedArticleType,
    "@id": `${postCanonical}#article`,
    headline: post.title,
    name: post.title,
    description: articleDescription,
    image: {
      "@type": "ImageObject",
      url: articleImage,
      width: 1200,
      height: 630,
    },
    url: postCanonical,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postCanonical,
    },
    datePublished: getDate(publishedSource),
    dateModified: getDate(updatedSource || publishedSource),
    articleSection: post.category?.name || "Web Development",
    keywords: articleTags.join(", ") || post.category?.name,
    wordCount: post.wordCount || articleWords.length || undefined,
    timeRequired: `PT${post.readingTimeMinutes || calculatedReadingMinutes}M`,
    isAccessibleForFree: post.isAccessibleForFree ?? true,
    inLanguage: "en-IN",
    isPartOf: { "@id": "https://kraviona.com/#website" },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: "https://kraviona.com",
      logo: {
        "@type": "ImageObject",
        url: "https://kraviona.com/logo.png",
        width: 200,
        height: 60,
      },
    },
    author: {
      "@type": "Person",
      name: authorProfile.name,
      url: authorProfile.linkedin || "https://kraviona.com/about",
      jobTitle: authorProfile.role,
    },
  };

  const blogBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://kraviona.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://kraviona.com/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: post.category?.name || "Category",
        item: `https://kraviona.com/category/${canonicalCategory}`,
      },
      { "@type": "ListItem", position: 4, name: post.title, item: postCanonical },
    ],
  };

  const faqPageSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${postCanonical}#faq`,
          mainEntity: faqItems,
        }
      : null;

  return (
    <>
      <JsonLd data={normalizeStructuredData(generatedArticleSchema)} />
      <JsonLd data={normalizeStructuredData(blogBreadcrumbs)} />
      {faqPageSchema && <JsonLd data={normalizeStructuredData(faqPageSchema)} />}
      <ReadingProgress />

      <main className="min-h-screen bg-surface">
        {/* Blog Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-[#09353a] px-4 pb-14 pt-12 text-white sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
          {heroImageUrl && (
            <div className="absolute inset-0 -z-0">
              <Image
                src={heroImageUrl}
                alt={heroImageAlt || post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09353a] via-primary-dark/80 to-transparent" />
            </div>
          )}

          <div className="relative z-10 mx-auto max-w-5xl">
            {/* Breadcrumb row */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70"
            >
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
              <span>/</span>
              <Link
                href={`/category/${canonicalCategory}`}
                className="hover:text-white"
              >
                {post.category?.name || "Category"}
              </Link>
              <span>/</span>
              <span className="truncate text-white/50 max-w-[200px]">
                {post.title}
              </span>
            </nav>

            <div className="mb-4 inline-flex items-center gap-2">
              <Link
                href={`/category/${canonicalCategory}`}
                className="rounded-full bg-accent/20 border border-accent/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-light hover:bg-accent/30 transition-colors"
              >
                {post.category?.name || "Article"}
              </Link>
              <span className="text-white/40 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                <CalendarDays size={12} className="text-accent" />
                {publishedDate}
              </span>
              <span className="text-white/40 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                <Clock size={12} className="text-accent" />
                {readingTime}
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl text-white leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl mb-8">
              {bannerExcerpt}
            </p>

            {/* Author info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-white/10 flex-shrink-0 relative">
                  {authorProfile.avatar ? (
                    <Image
                      src={authorProfile.avatar}
                      alt={authorProfile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 font-bold">
                      {authorProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{authorProfile.name}</p>
                  <p className="text-xs text-white/60">{authorProfile.role}</p>
                </div>
              </div>

              {authorSocials.length > 0 && (
                <div className="flex items-center gap-2">
                  {authorSocials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
                        aria-label={social.name}
                      >
                        <Icon size={15} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Blog Article Body with Sidebar & Components */}
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <BlogDetailPage blog={post} />
        </div>

        {/* Live Engagement Section */}
        <div className="mx-auto max-w-4xl px-4 pb-12 sm:px-6">
          <BlogEngagement blog={post} />
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200/80 bg-gray-50/50 py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-accent">
                    Related Insights
                  </p>
                  <h2 className="text-2xl font-black text-gray-900 mt-1">
                    Continue Reading
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View all articles →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((item) => (
                  <PostCard key={item.slug} post={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
