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
} from "lucide-react";
import BlogEngagement from "@/components/Blog/BlogEngagement";
import BlogDetailPage from "@/components/Blog/BlogDetails/BlogDetailPage";
import PostCard from "@/components/Card/PostCard";
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
import { formatDate, getDate, getImageAlt, getImageUrl } from "@/utils/dataHelpers";
import { getAuthorAvatar } from "@/lib/utils/imageUrl";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const DEFAULT_AUTHOR = {
  name: "Amar Kumar",
  username: "amarkumar96085",
  role: "Founder & Lead Engineer",
  bio: "Full-stack developer and founder of Kraviona Tech Solutions. Amar writes about MERN stack development, technical SEO, web performance, AI automation, and practical growth systems for modern businesses.",
  avatar: "/amar.jpeg",
  email: "kravionatech@gmail.com",
  linkedin: "https://www.linkedin.com/in/amarkumar96085/",
};

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
      label: "AI automation services",
    },
    {
      href: "/services/saas-development",
      label: "SaaS development services",
    },
  ],
  backend: [
    {
      href: "/services/nodejs-development",
      label: "Node.js development services",
    },
    {
      href: "/services/api-development",
      label: "API development services",
    },
  ],
};

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

export const dynamicParams = true;

const plainText = (value = "") =>
  String(value)
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

function getArticleSchemaType(blog) {
  if (["BlogPosting", "Article", "NewsArticle"].includes(blog?.schemaType)) {
    return blog.schemaType;
  }

  const categorySlug = blog?.category?.slug;
  return ["ai-and-automation", "tech-news"].includes(categorySlug)
    ? "NewsArticle"
    : "BlogPosting";
}

function getAuthorProfile(blog) {
  const author = blog?.author || {};

  return {
    name: author.name || DEFAULT_AUTHOR.name,
    username: author.username || DEFAULT_AUTHOR.username,
    role: author.role || author.title || DEFAULT_AUTHOR.role,
    bio: author.bio || author.description || DEFAULT_AUTHOR.bio,
    avatar: getAuthorAvatar(
      author.avatar?.url || author.avatar || author.image?.url || author.image,
    ),
    email: author.email || DEFAULT_AUTHOR.email,
    linkedin: author.linkedin || author.linkedinUrl || DEFAULT_AUTHOR.linkedin,
    twitter: author.twitter || author.twitterUrl || DEFAULT_AUTHOR.twitter,
  };
}

function getRelevantServices(blog) {
  const topics = [
    blog?.title,
    blog?.excerpt,
    blog?.category?.name,
    ...(Array.isArray(blog?.tags) ? blog.tags : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/seo|search|core web vital|ranking|crawl|schema/.test(topics)) {
    return SERVICE_LINKS.seo;
  }
  if (/ai|automation|llm|chatbot|machine learning/.test(topics)) {
    return SERVICE_LINKS.ai;
  }
  if (/node|api|backend|database|server/.test(topics)) {
    return SERVICE_LINKS.backend;
  }

  return SERVICE_LINKS.default;
}

async function getBlog(slug) {
  try {
    const res = await fetch(`${API_URL}/post/${slug}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return null;

    const json = await res.json();

    const blog = json.data ?? json.post ?? json.blog;
    if (blog && !Array.isArray(blog)) return normalizeStructuredData(blog);
    if (json?.slug || json?.title) return normalizeStructuredData(json);

    return null;
  } catch {
    return null;
  }
}

async function getRecommendedPosts() {
  try {
    const res = await fetch(`${API_URL}/public/posts?limit=24`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return normalizeStructuredData(parsePosts(json));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const seoTitle = blog.metaTitle || blog.title;
  const description =
    cleanExcerpt(
      blog.metaDescription || blog.excerpt || blog.content || blog.title,
      158,
    ) || blog.title;
  const openGraphTitle = blog.ogTitle || seoTitle;
  const openGraphDescription = blog.ogDescription || description;
  const twitterTitle = blog.twitterTitle || openGraphTitle;
  const twitterDescription =
    blog.twitterDescription || openGraphDescription;

  const blogCanonical = canonicalUrl(`/blog/${slug}`);
  const authorProfile = getAuthorProfile(blog);
  const featuredImageUrl = getImageUrl(blog);
  const publishedTime = getDate(blog.publishedAt || blog.createdAt);
  const modifiedTime = getDate(blog.updatedAt || blog.publishedAt || blog.createdAt);

  return {
    title: seoTitle,

    description,

    metadataBase: new URL("https://kraviona.com"),

    keywords:
      blog.tags?.length > 0
        ? blog.tags
        : [
            blog.category?.name,
            "Kraviona Blog",
            "MERN Stack Development",
            "Technical SEO",
          ].filter(Boolean),

    authors: [
      {
        name: authorProfile.name,
        url: "https://kraviona.com",
      },
    ],

    creator: SITE_NAME,
    publisher: SITE_NAME,

    alternates: {
      canonical: blogCanonical,
    },

    openGraph: {
      title: openGraphTitle,

      description: openGraphDescription,

      url: blogCanonical,

      siteName: SITE_NAME,

      type: "article",

      locale: "en_IN",

      publishedTime,

      modifiedTime,

      authors: ["https://kraviona.com/about"],

      section: blog.category?.name || "Technology",

      tags: blog.tags || [],

      images: [
        {
          url: featuredImageUrl || `${blogCanonical}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${blog.title} – Kraviona Blog`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: twitterTitle,

      description: twitterDescription,

      images: [featuredImageUrl || `${blogCanonical}/opengraph-image`],

      creator: SITE_TWITTER,
      site: SITE_TWITTER,
    },

    robots:
      blog.isNoIndex || blog.isNoFollow
        ? { index: !blog.isNoIndex, follow: !blog.isNoFollow }
        : defaultRobots,
  };
}

const BlogDetail = async ({ params }) => {
  const { slug } = await params;

  const [blog, allPosts] = await Promise.all([
    getBlog(slug),
    getRecommendedPosts(),
  ]);

  if (!blog) notFound();

  // The API also resolves recorded previousSlugs. Redirect the public page to
  // the current canonical slug instead of rendering duplicate content.
  if (blog.slug && blog.slug !== slug) {
    permanentRedirect(`/blog/${blog.slug}`);
  }

  const featuredImageUrl = getImageUrl(blog);
  const featuredImageAlt = getImageAlt(blog);
  const uploadedBannerImageUrl =
    typeof blog.bannerImage === "string"
      ? blog.bannerImage
      : blog.bannerImage?.url || "";
  const uploadedBannerImageAlt =
    typeof blog.bannerImage === "object" ? blog.bannerImage?.altText || "" : "";
  // A dedicated banner wins, otherwise make the existing featured image the
  // hero background so every blog detail page has a visual header.
  const heroImageUrl = uploadedBannerImageUrl || featuredImageUrl;
  const heroImageAlt = uploadedBannerImageUrl
    ? uploadedBannerImageAlt
    : featuredImageAlt;
  const relatedPosts = allPosts
    .filter(
      (post) =>
        post?.slug &&
        post.slug !== slug &&
        (post.category?.slug === blog.category?.slug ||
          post.category?.name === blog.category?.name),
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt || b.createdAt || 0) -
        new Date(a.publishedAt || a.createdAt || 0),
    )
    .slice(0, 3);
  const relevantServices = getRelevantServices(blog);
  const authorProfile = getAuthorProfile(blog);
  const publishedSource = blog.publishedAt || blog.createdAt;
  const updatedSource = blog.updatedAt;
  const publishedDate = formatDate(publishedSource) || "Recently published";
  const updatedDate =
    getDate(updatedSource) && getDate(updatedSource) !== getDate(publishedSource)
      ? formatDate(updatedSource)
      : null;
  const readingTime = blog.readingTimeMinutes
    ? `${blog.readingTimeMinutes} min read`
    : "Quick read";
  const viewCount =
    typeof blog.views === "number" ? blog.views.toLocaleString() : null;
  const bannerExcerpt =
    cleanExcerpt(blog.excerpt || blog.content || "", 220) ||
    "Fresh insights from Kraviona on modern web development, performance, SEO, and digital growth.";
  const authorSocials = [
    {
      name: "LinkedIn",
      href: authorProfile.linkedin,
      icon: Linkedin,
    },
    {
      name: "Email",
      href: `mailto:${authorProfile.email}`,
      icon: Mail,
    },
  ].filter((item) => item.href);
  const faqItems = Array.isArray(blog.faqSchema)
    ? blog.faqSchema
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

  const articleImage = absoluteImageUrl(featuredImageUrl || "/og-image.jpg");
  const articleDescription = (
    blog.metaDescription ||
    blog.excerpt ||
    blog.content ||
    ""
  )
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);
  const articleText = plainText(blog.content || blog.excerpt || "");
  const articleWords = articleText ? articleText.split(/\s+/).filter(Boolean) : [];
  const calculatedReadingMinutes = Math.max(1, Math.ceil(articleWords.length / 200));
  const supportingTopics = Array.isArray(blog.supportingTopicClusters)
    ? blog.supportingTopicClusters
    : blog.supportingTopicClusters
      ? [blog.supportingTopicClusters]
      : [];
  const articleTags = Array.isArray(blog.tags) ? blog.tags : [];

  const supportedArticleType = getArticleSchemaType(blog);
  const generatedArticleSchema = {
    "@context": "https://schema.org",

    "@type": supportedArticleType,

    "@id": `${canonicalUrl(`/blog/${slug}`)}#article`,

    headline: blog.title,

    description: articleDescription,

    image: {
      "@type": "ImageObject",
      url: articleImage,
      width: 1200,
      height: 630,
    },

    url: canonicalUrl(`/blog/${slug}`),

    datePublished: getDate(publishedSource),

    dateModified: getDate(updatedSource || publishedSource),

    articleSection: blog.category?.name || "Technology",

    keywords: articleTags.join(", ") || blog.category?.name,

    wordCount: blog.wordCount || articleWords.length || undefined,

    timeRequired: `PT${blog.readingTimeMinutes || calculatedReadingMinutes}M`,

    articleBody: articleWords.slice(0, 200).join(" ") || undefined,

    isAccessibleForFree: blog.isAccessibleForFree ?? true,

    inLanguage: blog.language === "en" ? "en-IN" : blog.language || "en-IN",

    isPartOf: { "@id": "https://kraviona.com/#website" },

    about: [blog.primaryTopicCluster, ...supportingTopics]
      .filter(Boolean)
      .map((name) => ({ "@type": "Thing", name })),

    mentions: [
      ...articleTags,
      ...supportingTopics,
    ]
      .filter(Boolean)
      .slice(0, 8)
      .map((name) => ({ "@type": "Thing", name })),

    citation: Array.isArray(blog.sources)
      ? blog.sources.filter((source) => source?.url).map((source) => source.url)
      : undefined,

    author: {
      "@type": "Person",
      name: authorProfile.name,
      jobTitle: authorProfile.role,
      image: authorProfile.avatar,
      email: authorProfile.email,
      sameAs: [authorProfile.linkedin, authorProfile.twitter].filter(Boolean),
    },

    publisher: {
      "@type": "Organization",

      name: "Kraviona Tech Solutions",

      logo: {
        "@type": "ImageObject",
        url: "https://kraviona.com/logo.png",
        width: 384,
        height: 144,
      },
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl(`/blog/${slug}`),
    },
  };

  // Editors can enrich the generated schema, but cannot replace the core
  // article identity, dates, publisher, or page relationship.
  const structuredDataOverride =
    blog.structuredDataOverride &&
    typeof blog.structuredDataOverride === "object" &&
    !Array.isArray(blog.structuredDataOverride)
      ? blog.structuredDataOverride
      : {};
  const articleSchema =
    Object.keys(structuredDataOverride).length > 0
      ? normalizeStructuredData({
          ...generatedArticleSchema,
          ...structuredDataOverride,
          "@context": "https://schema.org",
          "@type": supportedArticleType,
          "@id": `${canonicalUrl(`/blog/${slug}`)}#article`,
          headline: generatedArticleSchema.headline,
          description: generatedArticleSchema.description,
          image: generatedArticleSchema.image,
          url: generatedArticleSchema.url,
          datePublished: generatedArticleSchema.datePublished,
          dateModified: generatedArticleSchema.dateModified,
          author: generatedArticleSchema.author,
          publisher: generatedArticleSchema.publisher,
          mainEntityOfPage: generatedArticleSchema.mainEntityOfPage,
        })
      : generatedArticleSchema;

  const videoSchema = blog.videoEmbedded?.hasVideo && blog.videoEmbedded?.videoUrl
    ? {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: blog.videoEmbedded.name || blog.title,
        description: articleDescription,
        thumbnailUrl: blog.videoEmbedded.thumbnailUrl
          ? [absoluteImageUrl(blog.videoEmbedded.thumbnailUrl)]
          : [articleImage],
        uploadDate: getDate(publishedSource),
        contentUrl: blog.videoEmbedded.videoUrl,
        ...(blog.videoEmbedded.duration && {
          duration: blog.videoEmbedded.duration,
        }),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",

    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kraviona.com",
      },

      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://kraviona.com/blog",
      },

      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `https://kraviona.com/blog/${slug}`,
      },
    ],
  };

  const faqSchema =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems,
        }
      : null;

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <Script
        id="blog-posting-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, "\\u003c"),
        }}
      />
      <JsonLd
        data={[breadcrumbSchema, faqSchema, videoSchema].filter(
          Boolean,
        )}
      />

      {/* ─── Article Header ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#102f33] px-4 pb-28 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pb-32">
        {heroImageUrl && (
          <>
            <Image
              src={heroImageUrl}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
              quality={85}
              className="scale-105 object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#102f33] via-[#102f33]/92 to-[#102f33]/65" />
          </>
        )}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <nav
            className="mb-9 flex flex-wrap items-center gap-2 text-xs font-bold text-white/55"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">
              Blog
            </Link>
            {blog.category?.name && (
              <>
                <span>/</span>
                <span className="text-[#F28C5E]">{blog.category.name}</span>
              </>
            )}
          </nav>

          <div className="max-w-5xl">
            {blog.category?.name && (
              <p className="mb-6 inline-flex items-center rounded-full border border-[#F6A27D]/25 bg-[#E8622A]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#F6A27D]">
                {blog.category.name}
              </p>
            )}

            <h1 className="mb-6 max-w-5xl text-4xl font-black leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-[4rem]">
              {blog.title}
            </h1>

            <p className="mb-9 max-w-3xl text-base leading-8 text-white/70 sm:text-lg md:text-xl">
              {bannerExcerpt}
            </p>

            <div className="mb-9 flex flex-wrap gap-3 text-xs text-gray-300">
              <MetaPill icon={<CalendarDays className="h-3.5 w-3.5" />} value={publishedDate} dark />
              <MetaPill icon={<Clock className="h-3.5 w-3.5" />} value={readingTime} dark />
              <MetaPill icon={<UserRound className="h-3.5 w-3.5" />} value={authorProfile.name} dark />
              {updatedDate ? (
                <MetaPill
                  icon={<CalendarDays className="h-3.5 w-3.5" />}
                  value={`Updated ${updatedDate}`}
                  dark
                />
              ) : viewCount ? (
                <MetaPill
                  icon={<Eye className="h-3.5 w-3.5" />}
                  value={`${viewCount} views`}
                  dark
                />
              ) : (
                <MetaPill
                  icon={<Eye className="h-3.5 w-3.5" />}
                  value={blog.category?.name || "Kraviona Insights"}
                  dark
                />
              )}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <div id="article-content" className="bg-[#F3F6F6] px-4 pb-20 pt-6 sm:px-6 lg:px-8 lg:pt-0">
        <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:-mt-14 lg:grid-cols-[minmax(0,790px)_320px] lg:items-start lg:justify-center lg:gap-10">
          {/* LEFT CONTENT */}
          <div className="min-w-0 rounded-[1.75rem] border border-[#DCE5E6] bg-white p-5 shadow-[0_24px_70px_rgba(26,46,51,0.09)] sm:p-8 lg:p-10">
            {featuredImageUrl && (
              <figure className="mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-[#F5F7F8] shadow-sm">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={featuredImageUrl}
                    alt={featuredImageAlt}
                    fill
                    quality={90}
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                  />
                </div>
              </figure>
            )}
            <BlogDetailPage blog={blog} />
            {relatedPosts.length > 0 && (
              <section className="mt-14 border-t border-gray-100 pt-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-0.5 w-8 bg-[#E8622A]" />
                  <h2 className="text-xl font-black tracking-tight text-[#1A2E33] md:text-2xl">
                    Related Posts
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}
            <BlogEngagement
              slug={blog.slug}
              title={blog.title}
              initialSummary={{
                views: blog.views || 0,
                commentCount: blog.commentCount || 0,
              }}
            />
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="w-full pb-4 pt-2 lg:sticky lg:top-24 lg:h-fit">
            <div className="space-y-6">
              {/* Up Next Section */}
              {relatedPosts.length > 0 && (
                <div className="rounded-2xl border border-[#DCE5E6] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-0.5 bg-[#E8622A]"></span>
                    <h2 className="text-xs font-black text-[#1A2E33] uppercase tracking-[0.2em]">
                      Up Next
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {relatedPosts.map((post, idx) => (
                      <PostCard
                        key={`${post.title || post.slug}-${idx}`}
                        post={post}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              )}

              <section className="rounded-2xl border border-[#DCE5E6] bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E8622A]">
                  Build on this insight
                </p>
                <h2 className="mt-2 text-lg font-black text-[#1A2E33]">
                  Talk to our delivery team
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Get practical help applying these ideas to your website or product.
                </p>
                <div className="mt-4 space-y-2">
                  {relevantServices.map((service) => (
                    <Link
                      key={service.href}
                      href={service.href}
                      className="block rounded-lg border border-[#2A4A52]/15 bg-white px-3 py-2.5 text-sm font-bold text-[#2A4A52] transition-colors hover:border-[#E8622A] hover:text-[#E8622A]"
                    >
                      {service.label}
                    </Link>
                  ))}
                </div>
              </section>

              {/* Author Card */}
              <div className="rounded-2xl border border-[#DCE5E6] bg-white p-6 shadow-sm">
                <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Author
                </p>

                <div className="flex items-start gap-4">
                  <AuthorAvatar
                    src={authorProfile.avatar}
                    name={authorProfile.name}
                    role={authorProfile.role}
                    className="h-16 w-16 ring-4 ring-[#E8622A]/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-black leading-none text-[#2A4A52]">
                      {authorProfile.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#E8622A]">
                      {authorProfile.role}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      @{authorProfile.username}
                    </p>
                  </div>
                </div>

                <p className="mt-5 border-t border-gray-100 pt-5 text-sm leading-relaxed text-gray-600">
                  {authorProfile.bio}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-[#F5F7F8] p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Published
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#1A2E33]">
                      {publishedDate}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#F5F7F8] p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Read Time
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#1A2E33]">
                      {readingTime}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {authorSocials.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target={social.href.startsWith("http") ? "_blank" : undefined}
                        rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        aria-label={`${authorProfile.name} on ${social.name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-[#F5F7F8] text-[#1A2E33] transition-colors hover:border-[#E8622A] hover:bg-[#E8622A] hover:text-white"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

function MetaPill({ icon, value, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 font-bold ${
        dark
          ? "border border-white/10 bg-white/5 text-gray-200"
          : "border border-gray-200 bg-white text-[#1A2E33]"
      }`}
    >
      <span className={dark ? "text-[#F28C5E]" : "text-[#E8622A]"}>
        {icon}
      </span>
      {value}
    </span>
  );
}

function AuthorAvatar({ src, name, role, className = "" }) {
  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8622A] text-white ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name} — ${role || "author"} at Kraviona Tech Solutions`}
          fill
          sizes="56px"
          className="object-cover"
        />
      ) : (
        <UserRound className="h-5 w-5" />
      )}
    </div>
  );
}

export default BlogDetail;
