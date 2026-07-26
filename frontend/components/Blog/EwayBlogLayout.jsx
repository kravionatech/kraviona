"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  Clock,
  Loader2,
  Mail,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Swal from "sweetalert2";
import {
  formatDate,
  getCategoryId,
  getExcerpt,
  getId,
  getImageAlt,
  getImageUrl,
} from "@/utils/dataHelpers";
import { API_URL } from "@/utils/api";

const POSTS_FETCH_LIMIT = 100;
const DEFAULT_CATEGORIES = [
  "Web Development",
  "UI/UX Design",
  "Technical SEO",
  "AI Automation",
  "React",
  "Node.js",
];

const parsePosts = (json) =>
  Array.isArray(json.posts)
    ? json.posts
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, "").trim();

const getPostDate = (post, style = "long") =>
  formatDate(
    post?.publishedAt ||
      post?.createdAt ||
      post?.updatedAt ||
      post?.date ||
      post?.created_at ||
      post?._id,
    style,
  );

const getReadingTime = (post) => {
  if (post?.readingTimeMinutes) return `${post.readingTimeMinutes} min read`;

  const text = stripHtml(`${post?.content || ""} ${post?.excerpt || ""}`);
  const words = text.split(/\s+/).filter(Boolean).length;

  return `${Math.max(2, Math.ceil(words / 210) || 4)} min read`;
};

const getCategoryName = (post) => post?.category?.name || "Kraviona Insights";

function buildCategories(posts) {
  const map = new Map();

  posts.forEach((post) => {
    const name = getCategoryName(post);
    const id = getCategoryId(post) || name;
    if (!name) return;

    const existing = map.get(id) || {
      id,
      name,
      slug: post?.category?.slug,
      count: 0,
    };
    existing.count += 1;
    map.set(id, existing);
  });

  return [...map.values()].sort((a, b) => b.count - a.count);
}

function PostImage({ post, className = "", sizes, priority = false }) {
  const imageUrl = getImageUrl(post);

  return (
    <div className={`relative overflow-hidden bg-[#eef4f3] ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={getImageAlt(post)}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#edf6f5,#f8eadf)]">
          <span className="text-5xl font-black text-[#295c5e]/15">K</span>
        </div>
      )}
    </div>
  );
}

function MetaLine({ post, light = false }) {
  const textClass = light ? "text-white/80" : "text-[#687478]";
  const iconClass = light ? "text-[#f4be78]" : "text-[#d96c4e]";
  const date = getPostDate(post, "long");

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold ${textClass}`}>
      {date && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className={`h-3.5 w-3.5 ${iconClass}`} />
          {date}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <Clock className={`h-3.5 w-3.5 ${iconClass}`} />
        {getReadingTime(post)}
      </span>
    </div>
  );
}

function CategoryBadge({ children, light = false }) {
  return (
    <span
      className={`inline-flex w-fit rounded-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest ${
        light
          ? "bg-white/12 text-[#f4be78]"
          : "bg-[#d96c4e]/10 text-[#a9472f]"
      }`}
    >
      {children}
    </span>
  );
}

function BlogHero({ latestPost, categories, articleCount }) {
  const topicLinks =
    categories.length > 0
      ? categories.slice(0, 7)
      : DEFAULT_CATEGORIES.map((name) => ({ name }));

  return (
    <section
      className="relative overflow-hidden bg-[#0b2021] pt-[66px] text-white lg:pt-[78px]"
      aria-labelledby="blog-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
      <div
        className="pointer-events-none absolute -right-40 -top-48 h-[540px] w-[540px] rounded-full bg-[#295c5e]/45 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-52 left-[28%] h-[420px] w-[420px] rounded-full bg-[#d96c4e]/15 blur-[110px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-12 pt-12 sm:px-6 sm:pb-14 sm:pt-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.78fr)] lg:items-center lg:gap-16 lg:px-8 lg:pb-16 lg:pt-20">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-9 bg-[#d96c4e]" aria-hidden="true" />
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#f4be78]">
              The Kraviona Journal
            </p>
          </div>

          <h1
            id="blog-hero-heading"
            className="max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-[4rem]"
          >
            Ideas for building
            <span className="block text-[#f4be78]">better digital products.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-white/68 sm:text-lg sm:leading-8">
            Practical thinking on engineering, design, SEO, and AI—written by
            the people doing the work.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#all-posts"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#d96c4e] px-6 text-sm font-black text-white shadow-[0_12px_28px_rgba(217,108,78,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#c45f43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4be78] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b2021]"
            >
              Explore all articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#blog-topics"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/16 bg-white/[0.055] px-6 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Browse by topic
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 border-t border-white/12 pt-6">
            <div>
              <p className="text-2xl font-black text-white">{articleCount}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                Published articles
              </p>
            </div>
            <span className="hidden h-9 w-px bg-white/12 sm:block" aria-hidden="true" />
            <div>
              <p className="text-2xl font-black text-white">
                {categories.length || DEFAULT_CATEGORIES.length}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/45">
                Expert topics
              </p>
            </div>
            <span className="hidden h-9 w-px bg-white/12 sm:block" aria-hidden="true" />
            <div className="flex items-center gap-2 text-xs font-bold text-white/62">
              <BookOpenText className="h-4 w-4 text-[#f4be78]" />
              Practical, no-fluff insights
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:mx-0">
          <div
            className="absolute -inset-4 translate-x-3 translate-y-3 rounded-xl border border-white/8 bg-white/[0.025]"
            aria-hidden="true"
          />
          {latestPost?.slug ? (
            <Link
              href={`/blog/${latestPost.slug}`}
              className="group relative block overflow-hidden rounded-xl border border-white/14 bg-[#102c2d] shadow-[0_28px_70px_rgba(0,0,0,0.28)]"
            >
              <PostImage
                post={latestPost}
                className="aspect-[16/10] w-full"
                sizes="(max-width: 1024px) 92vw, 42vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08191a] via-[#08191a]/28 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/15 bg-[#0b2021]/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#f4be78] backdrop-blur-md">
                    Latest · {getCategoryName(latestPost)}
                  </span>
                  <span className="rounded-full bg-white/12 p-2.5 text-white backdrop-blur-md transition-colors group-hover:bg-[#d96c4e]">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
                <h2 className="max-w-lg text-xl font-black leading-tight text-white sm:text-2xl">
                  {latestPost.title || "Read our latest article"}
                </h2>
                <div className="mt-3">
                  <MetaLine post={latestPost} light />
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-white/14 bg-[linear-gradient(135deg,#173b3c,#0c2526)] p-8 shadow-[0_28px_70px_rgba(0,0,0,0.28)]">
              <div className="absolute left-8 top-8 h-16 w-16 rounded-full bg-[#d96c4e]/20 blur-xl" />
              <div className="relative text-center">
                <BookOpenText className="mx-auto h-10 w-10 text-[#f4be78]" />
                <p className="mt-4 text-xl font-black">Fresh thinking is on the way.</p>
                <p className="mt-2 text-sm text-white/55">
                  Explore practical notes from the Kraviona team.
                </p>
              </div>
            </div>
          )}
          <span
            className="absolute -right-2 -top-2 h-10 w-10 border-r-2 border-t-2 border-[#d96c4e] sm:-right-3 sm:-top-3"
            aria-hidden="true"
          />
        </div>
      </div>

      <div id="blog-topics" className="relative border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <span className="hidden shrink-0 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 sm:block">
            Explore topics
          </span>
          <span className="hidden h-5 w-px shrink-0 bg-white/12 sm:block" aria-hidden="true" />
          <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {topicLinks.map((category) => (
              <Link
                key={category.name}
                href={
                  category.slug
                    ? `/category/${category.slug}`
                    : `/category/${encodeURIComponent(category.name.toLowerCase())}`
                }
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-[11px] font-bold text-white/72 transition-all hover:border-[#f4be78]/50 hover:bg-[#f4be78]/10 hover:text-[#f4be78]"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function LeadStory({ post }) {
  if (!post?.slug) return null;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-md border border-[#e4e4e4] bg-white md:grid-cols-[52%_1fr]"
    >
      <PostImage
        post={post}
        className="min-h-[240px] md:min-h-[390px]"
        sizes="(max-width: 768px) 100vw, 52vw"
        priority
      />
      <div className="flex flex-col p-6 sm:p-8">
        <CategoryBadge>{getCategoryName(post)}</CategoryBadge>
        <h2 className="mt-5 text-2xl font-black leading-tight text-[#10282a] sm:text-3xl lg:text-4xl">
          {post.title || "Untitled Article"}
        </h2>
        {getExcerpt(post) && (
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[#5d6b70]">
            {getExcerpt(post)}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-5 border-t border-[#ececec] pt-5">
          <MetaLine post={post} />
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#295c5e] transition-colors group-hover:text-[#d96c4e]">
            Read article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function PopularList({ posts }) {
  return (
    <aside className="border border-[#e4e4e4] bg-white p-5 lg:p-6">
      <div className="mb-5 border-b border-[#ececec] pb-4">
        <h2 className="text-xl font-black text-[#10282a]">
          Most Popular Posts
        </h2>
      </div>
      <div className="divide-y divide-[#ececec]">
        {posts.map((post, index) => (
          <Link
            key={`${post.slug}-${index}`}
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-[34px_minmax(0,1fr)] gap-4 py-4 first:pt-0 last:pb-0"
          >
            <span className="pt-0.5 text-lg font-black text-[#d96c4e]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="mb-1 block truncate text-[10px] font-black uppercase tracking-widest text-[#7d8a8e]">
                {getCategoryName(post)}
              </span>
              <span className="line-clamp-2 text-sm font-black leading-snug text-[#10282a] transition-colors group-hover:text-[#d96c4e]">
                {post.title || "Untitled Article"}
              </span>
              <span className="mt-2 block text-xs font-semibold text-[#879195]">
                {getPostDate(post, "long")}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </aside>
  );
}

function ArticleCard({ post, compact = false }) {
  if (!post?.slug) return null;

  if (compact) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group grid grid-cols-[92px_minmax(0,1fr)] gap-4 border-b border-[#ececec] bg-white py-4 transition-colors hover:border-[#d96c4e]/50"
      >
        <PostImage post={post} className="h-20 rounded-sm" sizes="92px" />
        <div className="min-w-0">
          <p className="mb-2 truncate text-[10px] font-black uppercase tracking-widest text-[#d96c4e]">
            {getCategoryName(post)}
          </p>
          <h3 className="line-clamp-2 text-sm font-black leading-snug text-[#10282a] transition-colors group-hover:text-[#d96c4e]">
            {post.title || "Untitled Article"}
          </h3>
          <p className="mt-2 text-xs font-semibold text-[#879195]">
            {getPostDate(post, "numeric")}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#e4e4e4] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#d96c4e]/45 hover:shadow-[0_18px_34px_rgba(16,40,42,0.08)]">
      <Link href={`/blog/${post.slug}`} className="block">
        <PostImage
          post={post}
          className="aspect-[16/10] w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <CategoryBadge>{getCategoryName(post)}</CategoryBadge>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="mt-4 line-clamp-2 text-lg font-black leading-snug text-[#10282a] transition-colors group-hover:text-[#d96c4e]">
            {post.title || "Untitled Article"}
          </h3>
        </Link>
        {getExcerpt(post) && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-[#5d6b70]">
            {getExcerpt(post)}
          </p>
        )}
        <div className="mt-5 border-t border-[#ececec] pt-4">
          <MetaLine post={post} />
        </div>
      </div>
    </article>
  );
}

function SectionHeading({ label, title, href, centered = false }) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 border-b border-[#ececec] pb-4 sm:flex-row sm:items-end sm:justify-between ${
        centered ? "text-center sm:text-left" : ""
      }`}
    >
      <div>
        <div className={`mb-3 flex items-center gap-3 ${centered ? "justify-center sm:justify-start" : ""}`}>
          <span className="h-px w-8 bg-[#d96c4e]" />
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d96c4e]">
            {label}
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#10282a] sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#295c5e] transition-colors hover:text-[#d96c4e]"
        >
          See more
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function CategorySection({ category, posts }) {
  const categoryHref = category.slug
    ? `/category/${category.slug}`
    : `/category/${encodeURIComponent(category.name.toLowerCase())}`;
  const visiblePosts = posts.slice(0, 4);

  if (visiblePosts.length < 2) return null;

  return (
    <section className="py-10">
      <SectionHeading
        label="Category"
        title={category.name}
        href={categoryHref}
      />
      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <ArticleCard post={visiblePosts[0]} />
        <div className="bg-white">
          {visiblePosts.slice(1).map((post) => (
            <ArticleCard key={post.slug} post={post} compact />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoPanel() {
  return (
    <div className="bg-[#10282a] p-6 text-white">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4be78]">
        Kraviona Guide
      </p>
      <h2 className="mt-4 text-2xl font-black leading-tight">
        Turn technical ideas into a cleaner product roadmap.
      </h2>
      <p className="mt-4 text-sm leading-6 text-white/72">
        Read practical notes from our team on product engineering, SEO,
        interfaces, and AI workflow design.
      </p>
      <Link
        href="/contact"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#d96c4e] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#c45f43]"
      >
        Talk to us
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function NewsletterPanel() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Email required",
        text: "Please enter your email address.",
        confirmButtonColor: "#d96c4e",
      });
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data?.success !== false && !data?.error) {
        setEmail("");
        Swal.fire({
          icon: "success",
          title: "Subscribed",
          text: data?.message || "Successfully subscribed!",
          confirmButtonColor: "#d96c4e",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Subscription failed",
          text: data?.message || "Subscription failed.",
          confirmButtonColor: "#d96c4e",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Connection issue",
        text:
          error.message ||
          "Something went wrong. Please check your connection.",
        confirmButtonColor: "#d96c4e",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#eef4f3] py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#d96c4e]">
            Subscribe for success
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#10282a]">
            Get sharper product and web growth notes.
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row lg:self-end">
          <label className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8a8e]" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="hello@example.com"
              required
              disabled={isSubmitting}
              className="h-12 w-full rounded-md border border-[#cfdcda] bg-white pl-11 pr-4 text-sm text-[#10282a] outline-none transition-all placeholder:text-[#9aa6a9] focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/20 disabled:opacity-60"
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 rounded-md bg-[#d96c4e] px-7 text-sm font-bold text-white transition-colors hover:bg-[#c45f43] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function EwayBlogLayout({ initialPosts = [] }) {
  const [allPosts, setAllPosts] = useState(initialPosts);
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  console.warn("[EwayBlogLayout] initialPosts.length:", initialPosts.length);

  useEffect(() => {
    if (initialPosts.length > 0) {
      console.warn("[EwayBlogLayout] Using server-provided initialPosts, skipping client fetch");
      return;
    }

    const fetchPosts = async () => {
      try {
        const posts = [];
        let pageToFetch = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const url = `${API_URL}/public/posts?page=${pageToFetch}&limit=${POSTS_FETCH_LIMIT}`;
          console.warn("[EwayBlogLayout] Fetching page:", pageToFetch, url);
          const response = await fetch(url, {
            cache: "no-store",
            headers: { Accept: "application/json" },
          });
          console.warn("[EwayBlogLayout] Response status:", response.status, response.ok);

          if (!response.ok) {
            console.warn("[EwayBlogLayout] Response NOT OK, breaking");
            break;
          }

          const json = await response.json();
          console.warn("[EwayBlogLayout] Response keys:", Object.keys(json));
          const pagePosts = parsePosts(json);
          console.warn("[EwayBlogLayout] Page", pageToFetch, "posts:", pagePosts.length);
          posts.push(...pagePosts);

          hasNextPage = Boolean(json?.pagination?.hasNextPage);
          pageToFetch += 1;
        }

        const finalPosts = posts.filter((post) => post?.slug);
        console.warn("[EwayBlogLayout] Total posts after filter:", finalPosts.length);
        setAllPosts(finalPosts);
      } catch (error) {
        console.warn("[EwayBlogLayout] Fetch error:", error?.message || error);
        setAllPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [initialPosts.length]);

  const categories = useMemo(() => buildCategories(allPosts), [allPosts]);
  const navCategories =
    categories.length > 0
      ? categories.slice(0, 8)
      : DEFAULT_CATEGORIES.map((name) => ({ name }));

  const leadPost = allPosts[0];
  const secondaryPost = allPosts[1] || leadPost;
  const popularPosts = allPosts.slice(2, 7);
  const categorySections = categories
    .slice(0, 4)
    .map((category) => ({
      category,
      posts: allPosts.filter((post) => getCategoryId(post) === category.id),
    }))
    .filter((section) => section.posts.length >= 2);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return allPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || getCategoryId(post) === selectedCategory;
      const matchesSearch =
        !query ||
        post.title?.toLowerCase().includes(query) ||
        getExcerpt(post).toLowerCase().includes(query) ||
        getCategoryName(post).toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [allPosts, searchQuery, selectedCategory]);

  return (
    <main className="bg-[#fbfcfc] font-sans">
      <BlogHero
        latestPost={leadPost}
        categories={navCategories}
        articleCount={allPosts.length}
      />

      {isLoading ? (
        <section className="flex min-h-[520px] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#295c5e]" />
        </section>
      ) : allPosts.length === 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-[#10282a]">
            No articles available yet.
          </h2>
          <p className="mt-3 text-[#5d6b70]">Check back soon for new posts.</p>
        </section>
      ) : (
        <>
          <section className="mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
            <div>
              <SectionHeading
                label="Keep reading"
                title="More insights to explore"
                centered
              />
              <LeadStory post={secondaryPost} />
            </div>
            <div className="grid content-start gap-6 pt-0 lg:pt-[76px]">
              <PopularList posts={popularPosts} />
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {categorySections.map(({ category, posts }) => (
              <CategorySection
                key={category.id}
                category={category}
                posts={posts}
              />
            ))}
          </section>

          <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
            <PromoPanel />
          </section>

          <NewsletterPanel />

          <section id="all-posts" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <SectionHeading label="Archive" title="All Articles" />
            <div className="mb-9 flex flex-col gap-3 md:flex-row">
              <label className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8a8e]" />
                <input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-12 w-full rounded-md border border-[#dfe8e7] bg-white pl-11 pr-4 text-sm text-[#10282a] outline-none transition-all placeholder:text-[#9aa6a9] focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/20"
                />
              </label>
              <label className="relative md:w-72">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7d8a8e]" />
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-12 w-full appearance-none rounded-md border border-[#dfe8e7] bg-white pl-11 pr-10 text-sm font-semibold text-[#10282a] outline-none transition-all focus:border-[#295c5e] focus:ring-2 focus:ring-[#295c5e]/20"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="rounded-lg border border-[#dfe8e7] bg-white px-5 py-14 text-center">
                <p className="text-lg font-bold text-[#10282a]">
                  No articles found.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 rounded-md bg-[#10282a] px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#d96c4e]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <ArticleCard key={getId(post._id) || post.slug} post={post} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </main>
  );
}
