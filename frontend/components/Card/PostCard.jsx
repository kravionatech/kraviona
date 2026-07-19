"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import {
  formatDate,
  getExcerpt,
  getImageAlt,
  getImageUrl,
} from "@/utils/dataHelpers";

const getPostMeta = (post) => {
  const categoryName = post?.category?.name || "Kraviona Insights";
  const publishedDate = formatDate(
    post?.publishedAt ||
      post?.createdAt ||
      post?.updatedAt ||
      post?.date ||
      post?.created_at ||
      post?._id,
    "numeric",
  );
  const words = post?.content
    ? post.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean)
        .length
    : 0;
  const readingTime = post?.readingTimeMinutes
    ? `${post.readingTimeMinutes} min read`
    : `${Math.max(1, Math.ceil(words / 200) || 3)} min read`;

  return { categoryName, publishedDate, readingTime };
};

function PostImage({ post, className = "", sizes }) {
  const imageUrl = getImageUrl(post);

  return (
    <div className={`relative overflow-hidden bg-[#0f2425] ${className}`}>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={getImageAlt(post)}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0f2425] to-[#295c5e]">
          <span className="text-3xl font-black text-white/20">K</span>
        </div>
      )}
    </div>
  );
}

function MetaRow({ publishedDate, readingTime, light = false }) {
  const textClass = light ? "text-white/80" : "text-gray-500";
  const iconClass = light ? "text-[#f4be78]" : "text-[#d96c4e]";

  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold ${textClass}`}>
      {publishedDate && (
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className={`h-3.5 w-3.5 ${iconClass}`} />
          {publishedDate}
        </span>
      )}
      <span className="inline-flex items-center gap-1.5">
        <Clock className={`h-3.5 w-3.5 ${iconClass}`} />
        {readingTime}
      </span>
    </div>
  );
}

const PostCard = ({ post, variant = "default", className = "" }) => {
  if (!post?.slug) return null;

  const href = `/blog/${post.slug}`;
  const title = post.title || "Untitled Article";
  const excerpt = getExcerpt(post);
  const { categoryName, publishedDate, readingTime } = getPostMeta(post);

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className={`group grid grid-cols-[88px_minmax(0,1fr)] gap-4 rounded-lg border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-[#d96c4e]/40 hover:shadow-sm ${className}`}
      >
        <PostImage
          post={post}
          className="h-24 rounded-md"
          sizes="88px"
        />
        <div className="min-w-0 py-1">
          <p className="mb-2 truncate text-[10px] font-black uppercase tracking-widest text-[#d96c4e]">
            {categoryName}
          </p>
          <h3 className="line-clamp-2 text-sm font-black leading-snug text-[#111A1F] transition-colors group-hover:text-[#d96c4e]">
            {title}
          </h3>
          <div className="mt-2">
            <MetaRow publishedDate={publishedDate} readingTime={readingTime} />
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className={`group grid overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d96c4e]/35 hover:shadow-[0_18px_40px_rgba(15,36,37,0.10)] md:grid-cols-[44%_1fr] ${className}`}
      >
        <PostImage
          post={post}
          className="h-64 md:h-full"
          sizes="(max-width: 768px) 100vw, 44vw"
        />
        <div className="flex flex-col p-7">
          <p className="mb-4 w-fit rounded-md bg-[#d96c4e]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#a9472f]">
            {categoryName}
          </p>
          <h3 className="mb-4 text-2xl font-black leading-tight text-[#111A1F] transition-colors group-hover:text-[#d96c4e]">
            {title}
          </h3>
          {excerpt && (
            <p className="mb-6 line-clamp-3 text-sm leading-6 text-gray-600">
              {excerpt}
            </p>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-5">
            <MetaRow publishedDate={publishedDate} readingTime={readingTime} />
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1b3d3e] transition-colors group-hover:text-[#d96c4e]">
              Read
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d96c4e]/35 hover:shadow-[0_18px_40px_rgba(15,36,37,0.10)] ${className}`}
    >
      <Link href={href} className="block">
        <PostImage
          post={post}
          className="aspect-[16/10] w-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="min-w-0 truncate text-[10px] font-black uppercase tracking-widest text-[#d96c4e]">
            {categoryName}
          </p>
          <span className="flex-shrink-0 text-xs font-bold text-gray-400">
            {readingTime}
          </span>
        </div>

        <Link href={href}>
          <h3 className="line-clamp-2 text-xl font-black leading-snug text-[#111A1F] transition-colors group-hover:text-[#d96c4e]">
            {title}
          </h3>
        </Link>

        {excerpt && (
          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-gray-600">
            {excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-4">
          {publishedDate ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <CalendarDays className="h-3.5 w-3.5 text-[#d96c4e]" />
              {publishedDate}
            </span>
          ) : (
            <span />
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1b3d3e] transition-colors group-hover:text-[#d96c4e]"
          >
            Read
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
