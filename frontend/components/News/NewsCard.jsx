"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Tag } from "lucide-react";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, "").trim();

export function getReadingTime(post) {
  if (post?.readingTimeMinutes) return `${post.readingTimeMinutes} min read`;
  const text = stripHtml(`${post?.content || ""} ${post?.excerpt || ""}`);
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 210) || 3)} min read`;
}

export function getPostDate(post) {
  const raw = post?.publishedAt || post?.createdAt || post?.updatedAt;
  if (!raw) return "";
  return new Date(raw).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getImageUrl(post) {
  return post?.featuredImage?.url || post?.featuredImage || null;
}

export default function NewsCard({ post }) {
  const imageUrl = getImageUrl(post);
  const category = post?.category?.name || "News";
  const date = getPostDate(post);
  const readingTime = getReadingTime(post);
  const excerpt = stripHtml(post?.excerpt || "").substring(0, 130);

  const postHref = `/${post?.category?.slug || "news"}/${post.slug}`;

  return (
    <Link
      href={postHref}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post?.featuredImage?.altText || post?.title || ""}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2e35] to-[#2a4a52] flex items-center justify-center">
            <span className="text-white/20 text-5xl font-black">N</span>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-[#e84a2f] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
            <Tag size={9} />
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2a4a52] transition-colors mb-2">
          {post.title}
        </h3>

        {excerpt && (
          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-auto pt-3 border-t border-gray-100">
          {date && (
            <span className="flex items-center gap-1">
              <CalendarDays size={11} />
              {date}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {readingTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
