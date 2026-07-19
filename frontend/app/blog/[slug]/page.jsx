import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Eye,
  Linkedin,
  Mail,
  Twitter,
  UserRound,
} from "lucide-react";
import BlogEngagement from "@/components/Blog/BlogEngagement";
import BlogDetailPage from "@/components/Blog/BlogDetails/BlogDetailPage";
import PostCard from "@/components/Card/PostCard";
import {
  canonicalUrl,
  cleanExcerpt,
  absoluteImageUrl,
  defaultRobots,
  SITE_NAME,
  SITE_TWITTER,
} from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";
import { formatDate, getDate, getImageAlt, getImageUrl } from "@/utils/dataHelpers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_AUTHOR = {
  name: "Amar Kumar",
  username: "amarkumar96085",
  role: "Founder & Lead Engineer",
  bio: "Full-stack developer and founder of Kraviona Tech Solutions. Amar writes about MERN stack development, technical SEO, web performance, AI automation, and practical growth systems for modern businesses.",
  avatar: "/amar.jpeg",
  email: "kravionatech@gmail.com",
  linkedin: "https://www.linkedin.com/in/amarkumar96085/",
  twitter: "https://twitter.com/KravionaTech",
};

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

const plainText = (value = "") =>
  String(value)
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

function getAuthorProfile(blog) {
  const author = blog?.author || {};

  return {
    name: author.name || DEFAULT_AUTHOR.name,
    username: author.username || DEFAULT_AUTHOR.username,
    role: author.role || author.title || DEFAULT_AUTHOR.role,
    bio: author.bio || author.description || DEFAULT_AUTHOR.bio,
    avatar:
      author.avatar?.url ||
      author.avatar ||
      author.image?.url ||
      author.image ||
      DEFAULT_AUTHOR.avatar,
    email: author.email || DEFAULT_AUTHOR.email,
    linkedin: author.linkedin || author.linkedinUrl || DEFAULT_AUTHOR.linkedin,
    twitter: author.twitter || author.twitterUrl || DEFAULT_AUTHOR.twitter,
  };
}

async function getBlog(slug) {
  try {
    const res = await fetch(`${API_URL}/post/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();

    const blog = json.data ?? json.post ?? json.blog;
    if (blog && !Array.isArray(blog)) return blog;
    if (json?.slug || json?.title) return json;

    return null;
  } catch {
    return null;
  }
}

async function getRecommendedPosts() {
  try {
    const res = await fetch(`${API_URL}/public/posts?limit=100`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!res.ok) return [];

    const json = await res.json();
    return parsePosts(json);
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

  const description =
    cleanExcerpt(blog.excerpt || blog.content || blog.title, 158) || blog.title;

  const blogCanonical = canonicalUrl(`/blog/${slug}`);
  const authorProfile = getAuthorProfile(blog);
  const featuredImageUrl = getImageUrl(blog);
  const publishedTime = getDate(blog.publishedAt || blog.createdAt);
  const modifiedTime = getDate(blog.updatedAt || blog.publishedAt || blog.createdAt);

  return {
    title: `${blog.title} | Kraviona Blog`,

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
      title: `${blog.title} | Kraviona Blog`,

      description,

      url: blogCanonical,

      siteName: SITE_NAME,

      type: "article",

      locale: "en_IN",

      publishedTime,

      modifiedTime,

      authors: [authorProfile.name],

      section: blog.category?.name || "Technology",

      tags: blog.tags || [],

      images: [
        {
          url: featuredImageUrl || "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${blog.title} – Kraviona Blog`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: `${blog.title} | Kraviona Blog`,

      description,

      images: [featuredImageUrl || "/og-image.jpg"],

      creator: SITE_TWITTER,
      site: SITE_TWITTER,
    },

    robots: defaultRobots,
  };
}

const BlogDetail = async ({ params }) => {
  const { slug } = await params;

  const [blog, allPosts] = await Promise.all([
    getBlog(slug),
    getRecommendedPosts(),
  ]);

  if (!blog) notFound();

  const featuredImageUrl = getImageUrl(blog);
  const featuredImageAlt = getImageAlt(blog);
  const recommendedPosts = allPosts
    .filter((p) => p?.slug && p.slug !== slug)
    .slice(0, 6);
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
      name: "Twitter",
      href: authorProfile.twitter,
      icon: Twitter,
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
  const articleDescription = (blog.excerpt || blog.content || "")
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  const articleSchema = {
    "@context": "https://schema.org",

    "@type": ["BlogPosting", "Article"],

    headline: blog.title,

    description: articleDescription,

    image: [
      {
        "@type": "ImageObject",
        url: articleImage,
        width: 1200,
        height: 630,
      },
    ],

    url: canonicalUrl(`/blog/${slug}`),

    datePublished: getDate(publishedSource),

    dateModified: getDate(updatedSource || publishedSource),

    articleSection: blog.category?.name || "Technology",

    keywords: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.category?.name,

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

      name: SITE_NAME,

      logo: {
        "@type": "ImageObject",
        url: "https://kraviona.com/logo.png",
        width: 200,
        height: 60,
      },
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl(`/blog/${slug}`),
    },
  };

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
    <main className="min-h-screen bg-white">
      {/* ─── Article Schema ───────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* ─── Breadcrumb Schema ────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* ─── Article Header ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] px-4 pb-24 pt-40 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03]" />
        <div className="relative z-10 mx-auto max-w-6xl">
          <nav
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-gray-400"
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
                <span className="text-[#f4be78]">{blog.category.name}</span>
              </>
            )}
          </nav>

          <div className="max-w-4xl">
            {blog.category?.name && (
              <p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[#f4be78]">
                {blog.category.name}
              </p>
            )}

            <h1 className="mb-6 text-4xl font-extrabold capitalize leading-tight text-white sm:text-5xl md:text-6xl">
              {blog.title}
            </h1>

            <p className="mb-9 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
              {bannerExcerpt}
            </p>

            <div className="mb-9 flex flex-wrap gap-3 text-xs text-gray-300">
              <MetaPill icon={<CalendarDays className="h-3.5 w-3.5" />} value={publishedDate} dark />
              <MetaPill icon={<Clock className="h-3.5 w-3.5" />} value={readingTime} dark />
              <MetaPill icon={<UserRound className="h-3.5 w-3.5" />} value={authorProfile.name} dark />
              <MetaPill
                icon={<Eye className="h-3.5 w-3.5" />}
                value={updatedDate || viewCount || blog.category?.name || "Kraviona Insights"}
                dark
              />
            </div>

          </div>
        </div>
      </section>

      {/* ─── Main Content ─────────────────────────────────────────────── */}
      <div id="article-content" className="mx-auto max-w-6xl px-4 py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,740px)_300px] lg:items-start lg:gap-14">
          {/* LEFT CONTENT */}
          <div className="min-w-0">
            {featuredImageUrl && (
              <figure className="mb-10 overflow-hidden rounded-lg border border-gray-200 bg-[#fbfdfc]">
                <div className="relative aspect-[16/9] w-full">
                  <Image
                    src={featuredImageUrl}
                    alt={featuredImageAlt}
                    fill
                    priority
                    fetchPriority="high"
                    quality={90}
                    sizes="(min-width: 1024px) 740px, calc(100vw - 32px)"
                    className="object-contain"
                  />
                </div>
              </figure>
            )}
            <BlogDetailPage blog={blog} />
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
          <aside className="w-full lg:sticky lg:top-28 lg:h-fit">
            <div className="space-y-6">
              {/* Up Next Section */}
              {recommendedPosts.length > 0 && (
                <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-0.5 bg-[#d96c4e]"></span>
                    <h2 className="text-xs font-black text-[#1b3d3e] uppercase tracking-[0.2em]">
                      Up Next
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {recommendedPosts.map((post, idx) => (
                      <PostCard
                        key={`${post.title || post.slug}-${idx}`}
                        post={post}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Author Card */}
              <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
                <p className="mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">
                  Author
                </p>

                <div className="flex items-start gap-4">
                  <AuthorAvatar
                    src={authorProfile.avatar}
                    name={authorProfile.name}
                    className="h-16 w-16 ring-4 ring-[#d96c4e]/10"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-black leading-none text-[#0f2425]">
                      {authorProfile.name}
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#d96c4e]">
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
                  <div className="rounded-lg bg-[#FAFCFC] p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Published
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#1b3d3e]">
                      {publishedDate}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[#FAFCFC] p-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                      Read Time
                    </p>
                    <p className="mt-1 text-xs font-bold text-[#1b3d3e]">
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
                        rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                        aria-label={`${authorProfile.name} on ${social.name}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-[#FAFCFC] text-[#1b3d3e] transition-colors hover:border-[#d96c4e] hover:bg-[#d96c4e] hover:text-white"
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
    </main>
  );
};

function MetaPill({ icon, value, dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md px-3 py-2 font-bold ${
        dark
          ? "border border-white/10 bg-white/5 text-gray-200"
          : "border border-gray-200 bg-white text-[#1b3d3e]"
      }`}
    >
      <span className={dark ? "text-[#f4be78]" : "text-[#d96c4e]"}>
        {icon}
      </span>
      {value}
    </span>
  );
}

function AuthorAvatar({ src, name, className = "" }) {
  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d96c4e] text-white ${className}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
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
