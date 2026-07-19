"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CheckCircle2, HelpCircle, Lightbulb } from "lucide-react";
import { API_URL } from "@/utils/api";
import { formatDate } from "@/utils/dataHelpers";

const BlogContactForm = dynamic(
  () => import("@/components/Contact/BlogContactForm"),
  { ssr: false },
);

const apiAssetOrigin = API_URL.replace(/\/api\/v1$/, "").replace(/\/+$/, "");

const normalizeContentImages = (html = "") =>
  html
    .replace(/src=(["'])\/api\/v1\/(uploads|images|media|storage)\//gi, `src=$1${apiAssetOrigin}/$2/`)
    .replace(/src=(["'])\/(uploads|images|media|storage)\//gi, `src=$1${apiAssetOrigin}/$2/`)
    .replace(/src=(["'])(?!https?:|data:|blob:|\/)([^"']+)/gi, `src=$1${apiAssetOrigin}/$2`)
    .replace(/<img(?![^>]*\bloading=)/gi, "<img loading=\"lazy\"")
    .replace(/<img(?![^>]*\bdecoding=)/gi, "<img decoding=\"async\"");

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const toStringArray = (value) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim())
    : [];

const BlogDetailPage = ({ blog }) => {
  if (!blog) return null;

  const authorName = blog.author?.name || "Amar Kumar";
  const contentHtml = normalizeContentImages(blog.content || "");
  const publishedDate = formatDate(blog.publishedAt || blog.createdAt);
  const quickAnswer = stripHtml(blog.quickAnswer || "");
  const keyTakeaways = toStringArray(blog.keyTakeaways);
  const faqs = Array.isArray(blog.faqSchema)
    ? blog.faqSchema.filter((faq) => faq?.question && faq?.answer)
    : [];

  const plainText = stripHtml(blog.excerpt || blog.content || "");

  const excerpt = plainText.substring(0, 200);

  return (
    <article className="font-sans">
      {/* Excerpt / Lead paragraph */}
      {excerpt && (
        <p className="mb-10 border-l-4 border-[#d96c4e] bg-[#fbfdfc] px-5 py-4 text-lg font-medium leading-8 text-[#1b3d3e] md:text-xl md:leading-9">
          {excerpt}
          {plainText.length > 200 ? "…" : ""}
        </p>
      )}

      {quickAnswer && (
        <section className="mb-10 rounded-lg border border-[#d96c4e]/20 bg-[#fff8f5] p-5 md:p-6">
          <div className="mb-3 flex items-center gap-2 text-[#d96c4e]">
            <Lightbulb className="h-5 w-5" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">
              Quick Answer
            </h2>
          </div>
          <p className="text-base font-semibold leading-8 text-[#1b3d3e] md:text-lg">
            {quickAnswer}
          </p>
        </section>
      )}

      {keyTakeaways.length > 0 && (
        <section className="mb-10 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-2 text-[#1b3d3e]">
            <CheckCircle2 className="h-5 w-5 text-[#d96c4e]" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">
              Key Takeaways
            </h2>
          </div>
          <ul className="space-y-3">
            {keyTakeaways.map((takeaway, index) => (
              <li
                key={`${takeaway}-${index}`}
                className="flex gap-3 text-sm leading-7 text-gray-700 md:text-base"
              >
                <CheckCircle2 className="mt-1 h-4 w-4 flex-shrink-0 text-[#d96c4e]" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tags */}
      {blog.tags?.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-md border border-[#1b3d3e]/15 bg-[#1b3d3e]/8 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1b3d3e]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Main Article Body */}
      <div
        className="
          blog-rich-content
          prose prose-lg max-w-none
          prose-headings:font-black prose-headings:text-[#0f2425] prose-headings:tracking-tight
          prose-h2:mt-14 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-100 prose-h2:pb-3 prose-h2:text-2xl md:prose-h2:text-[28px]
          prose-h3:mt-9 prose-h3:mb-4 prose-h3:text-xl prose-h3:text-[#1b3d3e] md:prose-h3:text-2xl
          prose-p:mb-6 prose-p:text-[17px] prose-p:leading-8 prose-p:text-gray-700
          prose-a:text-[#d96c4e] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#0f2425] prose-strong:font-bold
          prose-code:text-[#d96c4e] prose-code:bg-[#d96c4e]/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:overflow-x-auto prose-pre:rounded-lg prose-pre:bg-[#0f2425] prose-pre:p-6 prose-pre:text-gray-100 prose-pre:shadow-xl
          prose-blockquote:rounded-r-lg prose-blockquote:border-l-4 prose-blockquote:border-[#d96c4e] prose-blockquote:bg-[#fbfdfc] prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:text-gray-600 prose-blockquote:not-italic
          prose-ul:my-6 prose-ul:pl-6 prose-li:mb-2 prose-li:text-gray-700
          prose-ol:my-6 prose-ol:pl-6
          prose-img:my-10 prose-img:block prose-img:h-auto prose-img:w-full prose-img:max-w-full prose-img:rounded-lg prose-img:border prose-img:border-gray-100 prose-img:object-contain
          prose-hr:border-gray-200 prose-hr:my-10
          prose-table:overflow-hidden prose-table:rounded-xl prose-th:bg-[#1b3d3e] prose-th:text-white prose-th:font-bold prose-td:border prose-td:border-gray-200
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      {faqs.length > 0 && (
        <section className="mt-14 border-t border-gray-100 pt-10">
          <div className="mb-6 flex items-center gap-2 text-[#1b3d3e]">
            <HelpCircle className="h-5 w-5 text-[#d96c4e]" />
            <h2 className="text-xl font-black tracking-tight md:text-2xl">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={`${faq.question}-${index}`}
                className="group rounded-lg border border-gray-100 bg-[#fbfdfc] p-5"
              >
                <summary className="cursor-pointer list-none text-base font-bold leading-7 text-[#0f2425] marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-[#d96c4e] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-7 text-gray-600 md:text-base">
                  {stripHtml(faq.answer)}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Footer Meta */}
      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d96c4e] text-lg font-black text-white">
            {authorName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-[#0f2425]">
              {authorName}
            </p>
            <p className="text-xs text-gray-400">
              {publishedDate}
            </p>
          </div>
        </div>

        <Link
          href="/blog"
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400 transition-colors hover:text-[#d96c4e]"
        >
          ← Back to Blog
        </Link>
      </div>

      {/* Inline contact form for this blog */}
      <div className="mx-auto max-w-2xl">
        <BlogContactForm
          initialSubject={`Service Inquiry from Blog: ${blog.title}`}
        />
      </div>
    </article>
  );
};

export default BlogDetailPage;
