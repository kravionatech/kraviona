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

        <article className="min-h-screen bg-[#0a0f12] text-white">
          {/* Top Editorial Nav Bar */}
          <div className="border-b border-white/10 bg-[#060a0c]/85 backdrop-blur-md sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Link
                  href="/news"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>All Tech News</span>
                </Link>
                <span className="text-white/20">|</span>
                <span className="inline-flex items-center gap-1.5 bg-[#e84a2f]/20 text-[#e84a2f] border border-[#e84a2f]/40 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e84a2f] animate-pulse" />
                  Live Dispatch
                </span>
              </div>

              <SocialShareButtons url={postCanonical} title={post.title} dark={true} />
            </div>
          </div>

          {/* News Hero Header */}
          <header className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-8">
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <Link
                href={`/news?category=${canonicalCategory}`}
                className="inline-flex items-center gap-1.5 bg-[#e84a2f] text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md shadow-[#e84a2f]/20 hover:bg-[#d43d23] transition-colors"
              >
                <Tag size={11} />
                {post.category?.name || "Tech News"}
              </Link>
              <span className="text-white/30 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <CalendarDays size={13} className="text-[#e84a2f]" />
                {publishedDate}
              </span>
              <span className="text-white/30 text-xs">•</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-white/70 font-medium">
                <Clock size={13} className="text-[#e84a2f]" />
                {readingTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-white mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed font-normal mb-8 border-l-3 border-[#e84a2f] pl-5 bg-white/3 py-2 rounded-r-xl">
                {plainText(post.excerpt)}
              </p>
            )}

            {/* Author Byline */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-white/10 py-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-white/10 flex-shrink-0 relative border border-[#e84a2f]/40">
                  {authorProfile.avatar ? (
                    <Image
                      src={authorProfile.avatar}
                      alt={authorProfile.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60 text-sm font-bold">
                      {authorProfile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{authorProfile.name}</p>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                      Staff Report
                    </span>
                  </div>
                  <p className="text-xs text-white/60">{authorProfile.role}</p>
                </div>
              </div>

              {authorProfile.linkedin && (
                <a
                  href={authorProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Linkedin size={13} className="text-[#0077b5]" />
                  <span>Connect with Author</span>
                </a>
              )}
            </div>

            {/* Featured Image */}
            {featuredImageUrl && (
              <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden mb-8 shadow-2xl border border-white/10">
                <Image
                  src={featuredImageUrl}
                  alt={featuredImageAlt || post.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover"
                />
              </div>
            )}
          </header>

          {/* 2-Column Grid: Main Content + Sticky Sidebar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left: Article Body */}
              <main className="lg:col-span-8">
                {/* Key Takeaways */}
                {Array.isArray(post.keyTakeaways) && post.keyTakeaways.length > 0 && (
                  <div className="bg-[#142024] rounded-2xl border border-[#2a4a52] p-6 mb-10 shadow-lg">
                    <p className="text-xs font-black uppercase tracking-widest text-[#e84a2f] mb-3">
                      Executive Summary & Key Takeaways
                    </p>
                    <ul className="space-y-3">
                      {post.keyTakeaways.map((point, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-white/85">
                          <CheckCircle2 size={16} className="text-[#e84a2f] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Rich HTML Content */}
                <div
                  className="
                    news-content prose prose-invert prose-lg max-w-none text-white/90 text-base sm:text-lg leading-relaxed space-y-6
                    prose-headings:font-black prose-headings:text-white prose-headings:tracking-tight
                    prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-3 prose-h2:text-2xl md:prose-h2:text-3xl
                    prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:text-[#e84a2f]
                    prose-a:text-[#e84a2f] prose-a:font-semibold hover:prose-a:underline
                    prose-strong:text-white prose-strong:font-black
                    prose-code:text-[#e84a2f] prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                    prose-pre:overflow-x-auto prose-pre:rounded-2xl prose-pre:bg-[#142024] prose-pre:p-6 prose-pre:text-gray-100 prose-pre:border prose-pre:border-white/10
                    prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#e84a2f] prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:text-white/80
                    prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-xl
                  "
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Tags */}
                {articleTags.length > 0 && (
                  <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-white/50 font-black uppercase tracking-wider mr-2">
                      Tagged:
                    </span>
                    {articleTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-semibold bg-white/5 border border-white/10 text-white/80 px-3 py-1 rounded-full hover:border-[#e84a2f]/50 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* In-article Service Callout */}
                <div className="my-12 rounded-2xl border border-[#e84a2f]/30 bg-gradient-to-r from-[#17252a] via-[#1f353d] to-[#122026] p-6 sm:p-8 text-white shadow-xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#e84a2f] bg-[#e84a2f]/20 border border-[#e84a2f]/40 px-2 py-0.5 rounded-full">
                        Enterprise Engineering
                      </span>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        Implementing AI or Web Technologies at Scale?
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 max-w-lg">
                        Kraviona builds custom full-stack web applications, technical SEO engines, and automated AI agents.
                      </p>
                    </div>
                    <Link
                      href="/services"
                      className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#e84a2f] px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-lg hover:bg-[#d43d23] transition-all"
                    >
                      <span>Explore Services</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* Live Engagement Section */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <BlogEngagement blog={post} />
                </div>
              </main>

              {/* Right: Sticky Sidebar with Services & Leads */}
              <aside className="lg:col-span-4 lg:sticky lg:top-20">
                <BlogSidebar post={post} relatedPosts={relatedPosts} dark={true} />
              </aside>
            </div>
          </div>

          {/* Full-Width Services Showcase Section */}
          <ServicesShowcaseSection dark={true} />

          {/* Related News Section */}
          {relatedPosts.length > 0 && (
            <section className="border-t border-white/10 bg-[#060a0c] py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#e84a2f]">
                      Keep Reading
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                      Related Tech Dispatches
                    </h2>
                  </div>
                  <Link
                    href="/news"
                    className="text-xs font-bold text-white/70 hover:text-white transition-colors"
                  >
                    View all news →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.slice(0, 3).map((item) => (
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
