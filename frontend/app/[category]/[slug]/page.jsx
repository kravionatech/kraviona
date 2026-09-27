import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Eye,
  Linkedin,
  Mail,
  ArrowLeft,
  Newspaper,
  Tag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  PhoneCall,
} from "lucide-react";
import BlogEngagement from "@/components/Blog/BlogEngagement";
import BlogDetailPage from "@/components/Blog/BlogDetails/BlogDetailPage";
import BlogSidebar from "@/components/Blog/BlogSidebar";
import ServicesShowcaseSection from "@/components/Blog/ServicesShowcaseSection";
import SocialShareButtons from "@/components/Blog/SocialShareButtons";
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
    searchable.includes("tutorial") ||
    searchable.includes("benchmark")
  ) {
    return "TechArticle";
  }

  return "Article";
}

function getAuthorProfile(blog) {
  const author = blog?.author || {};
  const account = blog?.userID && typeof blog.userID === "object" ? blog.userID : {};
  const profile = account.profile || {};
  const sameAsList = Array.isArray(author.sameAs) ? author.sameAs : [];
  const socialUrl = (platform) =>
    sameAsList.find((link) =>
      String(link?.url || link || "")
        .toLowerCase()
        .includes(platform),
    ) ||
    (Array.isArray(profile.socialLinks) ? profile.socialLinks : []).find((link) =>
      String(link?.name || "")
        .toLowerCase()
        .includes(platform),
    )?.url || "";

  return {
    name: account.name || author.name || "Amar Kumar",
    username: account.username || author.username || "",
    role:
      profile.jobTitle ||
      author.jobTitle ||
      author.role ||
      author.title ||
      "Founder & Lead Technical Architect",
    bio:
      profile.bio ||
      author.bio ||
      author.description ||
      "Full-stack MERN & Next.js engineer, Technical SEO specialist, and founder of Kraviona Tech Solutions.",
    avatar: getAuthorAvatar(
      account.avatar ||
        profile.avatar ||
        author.avatar ||
        author.image ||
        author.profileImage ||
        "/amar.jpeg",
    ),
    linkedin:
      author.linkedin ||
      author.linkedIn ||
      author.socialLinks?.linkedin ||
      profile.linkedin ||
      socialUrl("linkedin") ||
      "https://www.linkedin.com/in/amarkumar96085/",
    email: account.email || author.email || "kravionatech@gmail.com",
  };
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
      ? `${post.title} | Kraviona Tech News`
      : `${post.title} | Kraviona Insights`);

  const description =
    post.metaDescription ||
    post.excerpt ||
    post.content?.replace(/<[^>]*>?/gm, "").substring(0, 160) ||
    "Insights and engineering solutions from Kraviona Tech Solutions.";

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

  // Canonical Category & Slug Guard (301 Permanent Redirect)
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
    .slice(0, 4);

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

  // ── NEWS VIEW ───────────────────────────────────────────────────────────────
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
          url: "https://kraviona.com/full-logo.webp",
          width: 659,
          height: 226,
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

        <article className="min-h-screen bg-[#FEFCF9] text-[#1A3840] selection:bg-[#2D6E7A] selection:text-white">
          {/* Top Editorial Nav Bar */}
          <div className="border-b border-[#E8E4DE] bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A7A82] hover:text-[#2D6E7A] transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Tech Newsroom</span>
                </Link>
                <span className="text-[#E8E4DE]">|</span>
                <span className="inline-flex items-center gap-1.5 bg-[#FFF2ED] text-[#C85A3C] border border-[#C85A3C]/25 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C85A3C] animate-pulse" />
                  Live Dispatch
                </span>
                <span className="hidden sm:inline text-[#E8E4DE]">•</span>
                <span className="hidden sm:inline text-xs font-semibold text-[#5A7A82]">
                  {post.category?.name || "Technology"}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <SocialShareButtons url={postCanonical} title={post.title} dark={false} />
              </div>
            </div>
          </div>

          {/* Unified Container for Entire News Experience */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* 12-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* ── Left Column: 8 Columns (Article Header + Hero Media + Body + Bio) ── */}
              <main className="lg:col-span-8 min-w-0">
                {/* Category & Timestamps */}
                <div className="flex flex-wrap items-center gap-2.5 mb-4">
                  <Link
                    href={`/news?category=${canonicalCategory}`}
                    className="inline-flex items-center gap-1.5 bg-[#2D6E7A] text-white text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-2xs hover:bg-[#245862] transition-colors"
                  >
                    <Tag size={11} />
                    {post.category?.name || "Tech News"}
                  </Link>
                  <span className="text-[#E8E4DE] text-xs">•</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#5A7A82] font-medium">
                    <CalendarDays size={13} className="text-[#2D6E7A]" />
                    {publishedDate}
                  </span>
                  <span className="text-[#E8E4DE] text-xs">•</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#5A7A82] font-medium">
                    <Clock size={13} className="text-[#2D6E7A]" />
                    {readingTime}
                  </span>
                  {updatedDate && (
                    <>
                      <span className="text-[#E8E4DE] text-xs">•</span>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-[#EAF3F5] text-[#2D6E7A] px-2 py-0.5 rounded font-medium">
                        Updated: {updatedDate}
                      </span>
                    </>
                  )}
                </div>

                {/* Main News Headline (H1) */}
                <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.18] text-[#1A3840] mb-5">
                  {post.title}
                </h1>

                {/* Standfirst / Excerpt */}
                {post.excerpt && (
                  <p className="text-lg sm:text-xl text-[#4A646A] leading-relaxed font-normal mb-7 border-l-3 border-[#2D6E7A] pl-4 py-1 bg-[#EAF3F5]/40 rounded-r-lg">
                    {plainText(post.excerpt)}
                  </p>
                )}

                {/* Author Byline Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[#E8E4DE] py-3.5 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative border-2 border-[#2D6E7A]/30">
                      {authorProfile.avatar ? (
                        <Image
                          src={authorProfile.avatar}
                          alt={authorProfile.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#5A7A82] text-sm font-bold">
                          {authorProfile.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1A3840]">{authorProfile.name}</span>
                        <span className="text-[10px] bg-[#2D6E7A]/10 text-[#2D6E7A] px-2 py-0.2 rounded-full font-bold">
                          Senior Tech Desk
                        </span>
                      </div>
                      <p className="text-xs text-[#5A7A82]">{authorProfile.role}</p>
                    </div>
                  </div>

                  {authorProfile.linkedin && (
                    <a
                      href={authorProfile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E8E4DE] px-3.5 py-1 text-xs text-[#1A3840] font-semibold hover:border-[#2D6E7A] hover:bg-[#EAF3F5] transition-colors"
                    >
                      <Linkedin size={13} className="text-[#0077b5]" />
                      <span>Author Profile</span>
                    </a>
                  )}
                </div>

                {/* Featured Hero Media */}
                {featuredImageUrl && (
                  <div className="mb-8">
                    <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-xs border border-[#E8E4DE] bg-gray-100">
                      <Image
                        src={featuredImageUrl}
                        alt={featuredImageAlt || post.title}
                        fill
                        priority
                        sizes="(max-width: 1024px) 100vw, 850px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#5A7A82] italic mt-2 px-1">
                      <span>{featuredImageAlt || post.title}</span>
                      <span className="text-[11px] text-gray-400 not-italic">Photo: Kraviona Tech Wire</span>
                    </div>
                  </div>
                )}

                {/* Key Takeaways Box */}
                {Array.isArray(post.keyTakeaways) && post.keyTakeaways.length > 0 && (
                  <div className="rounded-2xl border border-[#2D6E7A]/20 bg-[#EAF3F5]/40 p-6 sm:p-7 mb-10 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3.5">
                      <Zap size={16} className="text-[#C85A3C] fill-[#C85A3C]" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#1A3840]">
                        The Big Picture • Key Facts
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {post.keyTakeaways.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-[#1A3840] font-medium leading-relaxed">
                          <CheckCircle2 size={17} className="text-[#2D6E7A] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prose Content */}
                <div
                  className="
                    news-content prose prose-slate prose-lg max-w-none text-[#2C3E50] text-[17px] sm:text-[18px] leading-[1.8] space-y-6
                    prose-headings:font-[family-name:var(--font-heading)] prose-headings:font-extrabold prose-headings:text-[#1A3840] prose-headings:tracking-tight
                    prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-[#E8E4DE] prose-h2:pb-3 prose-h2:text-2xl sm:prose-h2:text-3xl
                    prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:text-[#1A3840]
                    prose-p:text-[#2C3E50] prose-p:leading-[1.8]
                    prose-a:text-[#2D6E7A] prose-a:font-semibold hover:prose-a:text-[#C85A3C] prose-a:underline decoration-[#2D6E7A]/40 hover:decoration-[#C85A3C]
                    prose-strong:text-[#1A3840] prose-strong:font-bold
                    prose-code:text-[#C85A3C] prose-code:bg-[#FFF2ED] prose-code:border prose-code:border-[#C85A3C]/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                    prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:bg-[#1A3840] prose-pre:p-6 prose-pre:text-slate-100 prose-pre:border prose-pre:border-[#2D6E7A]/30
                    prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#2D6E7A] prose-blockquote:bg-[#EAF3F5]/40 prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:text-[#1A3840] prose-blockquote:italic
                    prose-img:rounded-2xl prose-img:border prose-img:border-[#E8E4DE] prose-img:shadow-sm
                  "
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Article Tags */}
                {articleTags.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-[#E8E4DE] flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-[#5A7A82] font-bold uppercase tracking-wider mr-2">
                      Topic Tags:
                    </span>
                    {articleTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold bg-white border border-[#E8E4DE] text-[#2C3E50] px-3.5 py-1 rounded-full hover:border-[#2D6E7A] hover:text-[#2D6E7A] transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* In-Article Editorial Services Banner */}
                <div className="my-12 rounded-2xl border border-[#2D6E7A]/20 bg-gradient-to-r from-[#EAF3F5] via-[#FEFCF9] to-[#F7F5F1] p-6 sm:p-7 shadow-2xs">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#C85A3C] bg-[#C85A3C]/10 border border-[#C85A3C]/20 px-2.5 py-0.5 rounded-full">
                        <Sparkles size={11} />
                        Kraviona Engineering & Advisory
                      </span>
                      <h3 className="text-lg font-extrabold text-[#1A3840]">
                        Implementing Next-Gen Web Architecture or Custom AI?
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5A7A82] max-w-lg leading-relaxed">
                        Kraviona engineers high-performance Next.js systems, fixes crawl budget & technical SEO at scale, and automates workflows with custom AI agents.
                      </p>
                    </div>
                    <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                      <Link
                        href="/services"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2D6E7A] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#245862] transition-colors"
                      >
                        <span>Explore Services</span>
                        <ArrowRight size={13} />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-[#E8E4DE] px-4 py-2 text-xs font-bold text-[#1A3840] hover:bg-[#F7F5F1] transition-colors"
                      >
                        <span>Book Tech Roadmap</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Verified Standards Card */}
                <div className="rounded-2xl border border-[#E8E4DE] bg-[#F7F5F1] p-5 my-8 flex items-start gap-3.5 text-xs text-[#5A7A82]">
                  <ShieldCheck size={20} className="text-[#2D6E7A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-[#1A3840] uppercase tracking-wider text-[11px] mb-0.5">
                      Editorial Integrity & Verification Standards
                    </p>
                    <p className="leading-relaxed text-[#5A7A82]">
                      Dispatches on Kraviona Tech News undergo multi-tier editorial and engineering review to ensure factual correctness, technical accuracy, and source integrity.
                    </p>
                  </div>
                </div>

                {/* Author Bio Box */}
                <div className="rounded-2xl border border-[#E8E4DE] bg-[#FEFCF9] p-6 sm:p-7 my-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-2xs">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0 border-2 border-[#2D6E7A]/30">
                    {authorProfile.avatar ? (
                      <Image src={authorProfile.avatar} alt={authorProfile.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2D6E7A] text-white font-bold text-lg">
                        {authorProfile.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-bold text-[#1A3840]">{authorProfile.name}</h4>
                      <span className="text-[10px] font-bold bg-[#2D6E7A]/10 text-[#2D6E7A] px-2 py-0.5 rounded-full">
                        Author & Technical Architect
                      </span>
                    </div>
                    <p className="text-xs text-[#5A7A82] leading-relaxed mb-3">{authorProfile.bio}</p>
                    {authorProfile.linkedin && (
                      <a
                        href={authorProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D6E7A] hover:underline"
                      >
                        <Linkedin size={13} />
                        <span>Connect with {authorProfile.name} on LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Social Share Bar */}
                <div className="p-4 rounded-xl bg-white border border-[#E8E4DE] flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs font-bold text-[#1A3840]">
                    Share this tech dispatch with your network:
                  </span>
                  <SocialShareButtons url={postCanonical} title={post.title} dark={false} />
                </div>

                {/* Reader Response / Engagement */}
                <div className="mt-10 pt-8 border-t border-[#E8E4DE]">
                  <BlogEngagement blog={post} />
                </div>
              </main>

              {/* ── Right Column: 4 Columns Sticky Sidebar (self-start ensures it stays sticky!) ── */}
              <aside className="lg:col-span-4 sticky top-24 space-y-6 self-start">
                <BlogSidebar post={post} relatedPosts={relatedPosts} dark={false} />
              </aside>

            </div>

            {/* ── Below Article: Related Tech Dispatches ── */}
            {relatedPosts.length > 0 && (
              <section className="mt-16 pt-12 border-t border-[#E8E4DE]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#C85A3C]">
                      Keep Reading • Kraviona Tech Wire
                    </p>
                    <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-extrabold text-[#1A3840] mt-1">
                      Related Tech Dispatches
                    </h2>
                  </div>
                  <Link
                    href="/news"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                  >
                    <span>View all news</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.slice(0, 3).map((item) => (
                    <NewsCard key={item.slug} post={item} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Kraviona Engineering Solutions Spotlight (Tasteful 3-card grid) ── */}
            <section className="mt-16 rounded-3xl border border-[#E8E4DE] bg-gradient-to-b from-[#F7F5F1] to-[#FEFCF9] p-8 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#C85A3C] bg-[#C85A3C]/10 border border-[#C85A3C]/20 px-2.5 py-0.5 rounded-full">
                    Kraviona Tech Solutions
                  </span>
                  <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-extrabold text-[#1A3840] mt-2">
                    Enterprise Engineering & Growth Services
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5A7A82] mt-1 max-w-xl">
                    We design, build, and optimize high-velocity software, search platforms, and autonomous AI agents.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                >
                  <span>Explore all services</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Link
                  href="/services/mern-stack-development"
                  className="group rounded-2xl bg-white border border-[#E8E4DE] p-5 shadow-2xs hover:border-[#2D6E7A]/60 hover:shadow-xs transition-all"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D6E7A]/10 text-[#2D6E7A] mb-4 group-hover:bg-[#2D6E7A] group-hover:text-white transition-colors">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-bold text-base text-[#1A3840] group-hover:text-[#2D6E7A] transition-colors">
                    MERN & Next.js Systems
                  </h3>
                  <p className="text-xs text-[#5A7A82] mt-1.5 leading-relaxed">
                    Scalable full-stack web applications with Next.js App Router, Node.js APIs, and high-concurrency databases.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2D6E7A] mt-4">
                    Learn more →
                  </span>
                </Link>

                <Link
                  href="/services/technical-seo"
                  className="group rounded-2xl bg-white border border-[#E8E4DE] p-5 shadow-2xs hover:border-[#2D6E7A]/60 hover:shadow-xs transition-all"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C85A3C]/10 text-[#C85A3C] mb-4 group-hover:bg-[#C85A3C] group-hover:text-white transition-colors">
                    <Tag size={18} />
                  </div>
                  <h3 className="font-bold text-base text-[#1A3840] group-hover:text-[#C85A3C] transition-colors">
                    Technical SEO & Speed
                  </h3>
                  <p className="text-xs text-[#5A7A82] mt-1.5 leading-relaxed">
                    Core Web Vitals optimization, crawl budget audits, rich schema markup, and guaranteed indexation fixes.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C85A3C] mt-4">
                    Learn more →
                  </span>
                </Link>

                <Link
                  href="/services/ai-automation"
                  className="group rounded-2xl bg-white border border-[#E8E4DE] p-5 shadow-2xs hover:border-[#2D6E7A]/60 hover:shadow-xs transition-all"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2D6E7A]/10 text-[#2D6E7A] mb-4 group-hover:bg-[#2D6E7A] group-hover:text-white transition-colors">
                    <Zap size={18} />
                  </div>
                  <h3 className="font-bold text-base text-[#1A3840] group-hover:text-[#2D6E7A] transition-colors">
                    AI Agents & Automation
                  </h3>
                  <p className="text-xs text-[#5A7A82] mt-1.5 leading-relaxed">
                    Custom LLM integrations, document intelligence, automated CRM pipelines, and intelligent chatbots.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2D6E7A] mt-4">
                    Learn more →
                  </span>
                </Link>
              </div>

              {/* Consultation Strip */}
              <div className="mt-8 pt-6 border-t border-[#E8E4DE] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-[#5A7A82]">
                  Need a custom technical roadmap? Speak directly with our lead architects.
                </p>
                <a
                  href="https://wa.me/919608553167?text=Hi%20Kraviona%20team%2C%20I%20am%20interested%20in%20discussing%20a%20project."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-slate-900 shadow-2xs hover:bg-[#20bd5a] transition-all"
                >
                  <PhoneCall size={13} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </section>

          </div>
        </article>
      </>
    );
  }

  // ── BLOG / IN-DEPTH ARTICLE VIEW ──────────────────────────────────────────
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

  const bannerExcerpt =
    cleanExcerpt(post.excerpt || post.content || "", 240) ||
    "In-depth technical guides, architectural blueprints, and search performance strategies from Kraviona.";

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
        url: "https://kraviona.com/full-logo.webp",
        width: 659,
        height: 226,
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
      {
        "@type": "ListItem",
        position: 2,
        name: post.category?.name || "Category",
        item: `https://kraviona.com/category/${canonicalCategory}`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: postCanonical },
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

      <main className="min-h-screen bg-[#F7FAFA]">
        {/* Blog Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A2E33] via-[#243F45] to-[#0A2024] px-4 pb-16 pt-12 text-white sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 shadow-md">
          {heroImageUrl && (
            <div className="absolute inset-0 -z-0">
              <Image
                src={heroImageUrl}
                alt={heroImageAlt || post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-20 blur-[1px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A2024] via-[#1A2E33]/85 to-[#1A2E33]/90" />
            </div>
          )}

          <div className="relative z-10 mx-auto max-w-7xl">
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70"
            >
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-white/40">/</span>
              <Link
                href={`/category/${canonicalCategory}`}
                className="hover:text-white capitalize transition-colors"
              >
                {post.category?.name || "Category"}
              </Link>
              <span className="text-white/40">/</span>
              <span className="truncate text-white/50 max-w-[280px]">
                {post.title}
              </span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div className="inline-flex flex-wrap items-center gap-2.5">
                <Link
                  href={`/category/${canonicalCategory}`}
                  className="rounded-full bg-[#E8622A] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white hover:bg-[#d43d23] shadow-md shadow-[#E8622A]/20 transition-colors"
                >
                  {post.category?.name || "Technical Guide"}
                </Link>
                <span className="text-white/40 text-xs">•</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/80">
                  <CalendarDays size={13} className="text-[#FF8E5C]" />
                  {publishedDate}
                </span>
                <span className="text-white/40 text-xs">•</span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/80">
                  <Clock size={13} className="text-[#FF8E5C]" />
                  {readingTime}
                </span>
              </div>

              <SocialShareButtons url={postCanonical} title={post.title} dark={true} />
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-white leading-[1.14] mb-6 max-w-5xl">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-white/85 leading-relaxed max-w-3xl mb-8">
              {bannerExcerpt}
            </p>

            {/* Author info bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 max-w-5xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex-shrink-0 relative border-2 border-[#E8622A]/60">
                  {authorProfile.avatar ? (
                    <Image
                      src={authorProfile.avatar}
                      alt={authorProfile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-black text-base">
                      {authorProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm sm:text-base font-bold text-white">{authorProfile.name}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                      <ShieldCheck size={11} />
                      Lead Engineer
                    </span>
                  </div>
                  <p className="text-xs text-white/70">{authorProfile.role}</p>
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
                        className="rounded-full bg-white/10 p-2.5 text-white/80 hover:bg-white/25 hover:text-white transition-colors"
                        aria-label={social.name}
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2-Column Grid: Main Content + Sticky Sidebar */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Article Body */}
            <div className="lg:col-span-8">
              {featuredImageUrl && (
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 shadow-lg border border-gray-200">
                  <Image
                    src={featuredImageUrl}
                    alt={featuredImageAlt || post.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 850px"
                    className="object-cover"
                  />
                </div>
              )}

              <BlogDetailPage blog={post} />

              <div className="mt-12 pt-8 border-t border-gray-200">
                <BlogEngagement blog={post} />
              </div>
            </div>

            {/* Right: Sticky Sidebar with Services & Discovery Leads */}
            <aside className="lg:col-span-4 lg:sticky lg:top-20">
              <BlogSidebar post={post} relatedPosts={relatedPosts} dark={false} />
            </aside>
          </div>
        </div>

        {/* Full-Width Services Showcase Section */}
        <ServicesShowcaseSection dark={false} />

        {/* Related Insights Grid */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-[#E8622A]">
                    Related Insights
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#1A2E33] mt-1">
                    Continue Reading
                  </h2>
                </div>
                <Link
                  href="/blog"
                  className="text-xs font-bold text-[#E8622A] hover:underline"
                >
                  View all articles & guides →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.slice(0, 3).map((item) => (
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
