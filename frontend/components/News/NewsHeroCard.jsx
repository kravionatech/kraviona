"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Tag } from "lucide-react";
import { getImageUrl, getPostDate, getReadingTime } from "./NewsCard";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, "").trim();

export default function NewsHeroCard({ post }) {
  if (!post) return null;

  const imageUrl = getImageUrl(post);
  const category = post?.category?.name || "News";
  const date = getPostDate(post);
  const readingTime = getReadingTime(post);
  const excerpt = stripHtml(post?.excerpt || "").substring(0, 200);

  const postHref = `/${post?.category?.slug || "news"}/${post.slug}`;

  return (
    <Link
      href={postHref}
      className="group relative flex flex-col md:flex-row overflow-hidden rounded-3xl bg-[#0f1a1e] min-h-[400px] md:min-h-[360px] shadow-2xl border border-white/5 hover:shadow-[#2a4a52]/30 hover:border-[#2a4a52]/40 transition-all duration-500"
    >
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={post?.featuredImage?.altText || post?.title || ""}
            fill
            sizes="(max-width: 768px) 100vw, 70vw"
            className="object-cover opacity-25 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a1e] via-[#0f1a1e]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a1e]/90 via-transparent to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-end p-7 md:p-10 flex-1 max-w-2xl">
        {/* Breaking badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-[#e84a2f] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 bg-white rounded-full" />
            Breaking
          </span>
          <span className="inline-flex items-center gap-1 bg-white/10 text-white/70 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm">
            <Tag size={9} />
            {category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight mb-3 group-hover:text-[#a8d5df] transition-colors duration-300">
          {post.title}
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-white/60 text-sm leading-relaxed mb-5 line-clamp-2">
            {excerpt}
          </p>
        )}

        {/* Meta + CTA */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-white/40 text-[11px]">
            {date && (
              <span className="flex items-center gap-1.5">
                <CalendarDays size={12} />
                {date}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {readingTime}
            </span>
          </div>
          <span className="inline-flex items-center gap-2 text-[#a8d5df] text-sm font-semibold group-hover:gap-3 transition-all">
            Read story
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Right image panel (desktop) */}
      {imageUrl && (
        <div className="hidden md:block relative w-[360px] flex-shrink-0 overflow-hidden">
          <Image
            src={imageUrl}
            alt={post?.featuredImage?.altText || post?.title || ""}
            fill
            sizes="360px"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0f1a1e]/60" />
        </div>
      )}
    </Link>
  );
}
