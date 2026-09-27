"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import parse from "html-react-parser";
import {
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  User,
  ShieldCheck,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import { formatDate } from "@/utils/dataHelpers";

const BlogContactForm = dynamic(
  () => import("@/components/Contact/BlogContactForm"),
  { ssr: false },
);

const apiAssetOrigin = API_URL.replace(/\/api\/v1$/, "").replace(/\/+$/, "");

const normalizeContentImages = (html = "") =>
  String(html)
    .replace(/https?:\/\/www\.kraviona\.com/gi, "https://kraviona.com")
    .replace(/src=(["'])\/api\/v1\/(uploads|images|media|storage)\//gi, `src=$1${apiAssetOrigin}/$2/`)
    .replace(/src=(["'])\/(uploads|images|media|storage)\//gi, `src=$1${apiAssetOrigin}/$2/`)
    .replace(/src=(["'])(?!https?:|data:|blob:|\/)([^"']+)/gi, `src=$1${apiAssetOrigin}/$2`)
    .replace(/<img(?![^>]*\bloading=)/gi, '<img loading="lazy"')
    .replace(/<img(?![^>]*\bdecoding=)/gi, '<img decoding="async"')
    .replace(/<a\b([^>]*)>/gi, (tag, attributes) => {
      const href = attributes.match(/\bhref\s*=\s*(["'])(.*?)\1/i)?.[2];
      if (!href || !/^https?:\/\//i.test(href)) return tag;

      try {
        if (new URL(href).hostname === "kraviona.com") return tag;
      } catch {
        return tag;
      }

      const withTarget = /\btarget\s*=/i.test(attributes)
        ? attributes.replace(/\btarget\s*=\s*(["']).*?\1/i, 'target="_blank"')
        : `${attributes} target="_blank"`;
      const withRel = /\brel\s*=/i.test(withTarget)
        ? withTarget.replace(/\brel\s*=\s*(["']).*?\1/i, 'rel="noopener noreferrer"')
        : `${withTarget} rel="noopener noreferrer"`;

      return `<a${withRel}>`;
    });

const stripHtml = (value = "") =>
  String(value)
    .replace(/<[^>]*>?/gm, "")
    .replace(/\s+/g, " ")
    .trim();

const toStringArray = (value) =>
  Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim())
    : [];

const renderArticleContent = (html = "") =>
  parse(html, {
    replace(node) {
      if (node.type !== "tag" || node.name !== "img" || !node.attribs?.src) {
        return undefined;
      }

      return (
        <Image
          src={node.attribs.src}
          alt={node.attribs.alt || ""}
          width={Number(node.attribs.width) || 800}
          height={Number(node.attribs.height) || 450}
          sizes="(max-width: 768px) 100vw, 800px"
          loading="lazy"
          className={node.attribs.class || "rounded-xl border border-gray-100 my-8 shadow-sm"}
        />
      );
    },
  });

const BlogDetailPage = ({ blog }) => {
  if (!blog) return null;

  const authorName = blog.userID?.name || blog.author?.name || "Amar Kumar";
  const authorRole = blog.author?.jobTitle || blog.author?.role || "Founder & Lead Engineer";
  const contentHtml = normalizeContentImages(blog.content || "");
  const publishedDate = formatDate(blog.publishedAt || blog.createdAt);
  const quickAnswer = stripHtml(blog.quickAnswer || "");
  const keyTakeaways = toStringArray(blog.keyTakeaways);
  const faqs = Array.isArray(blog.faqSchema)
    ? blog.faqSchema.filter((faq) => faq?.question && faq?.answer)
    : [];

  const plainText = stripHtml(blog.excerpt || blog.content || "");
  const excerpt = plainText.substring(0, 240);

  return (
    <article className="font-sans">
      {/* ── Executive Summary / In This Guide ─────────────────────────────────── */}
      {excerpt && (
        <div className="mb-10 rounded-2xl border border-[#DCE5E6] bg-gradient-to-br from-[#F5F8F8] via-white to-[#F0F5F6] p-6 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E8622A]/15 text-[#E8622A]">
              <BookOpen size={13} />
            </span>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#E8622A]">
              Executive Summary
            </p>
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed text-[#1A2E33]">
            {excerpt}
            {plainText.length > 240 ? "…" : ""}
          </p>
        </div>
      )}

      {/* ── Quick Answer Card ───────────────────────────────────────────────── */}
      {quickAnswer && (
        <section className="mb-10 rounded-2xl border border-[#E8622A]/30 bg-gradient-to-br from-[#FFF8F5] via-[#FEF2EC] to-white p-6 sm:p-7 shadow-sm">
          <div className="mb-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#E8622A]">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8622A] text-white shadow-sm shadow-[#E8622A]/30">
                <Lightbulb size={16} />
              </span>
              <h2 className="text-xs font-black uppercase tracking-[0.2em]">
                Direct Answer
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8622A]/10 text-[#E8622A]">
              Quick Summary
            </span>
          </div>
          <p className="text-base sm:text-lg font-semibold leading-relaxed text-[#1A2E33]">
            {quickAnswer}
          </p>
        </section>
      )}

      {/* ── Key Takeaways ───────────────────────────────────────────────────── */}
      {keyTakeaways.length > 0 && (
        <section className="mb-10 rounded-2xl border border-[#DCE5E6] bg-[#F7FAFA] p-6 sm:p-7 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[#1A2E33]">
            <CheckCircle2 className="h-5 w-5 text-[#E8622A]" />
            <h2 className="text-xs font-black uppercase tracking-[0.2em]">
              Key Strategic Takeaways
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-3">
            {keyTakeaways.map((takeaway, index) => (
              <li
                key={`${takeaway}-${index}`}
                className="flex items-start gap-3 rounded-xl bg-white border border-gray-200/70 p-3.5 text-sm leading-relaxed text-gray-800 shadow-2xs"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E8622A]" />
                <span className="font-medium">{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Tags List ───────────────────────────────────────────────────────── */}
      {blog.tags?.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 mr-1">
            Topics:
          </span>
          {blog.tags.map((tag, i) => (
            <span
              key={i}
              className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#E8622A]/40 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ── Main Article Body ───────────────────────────────────────────────── */}
      <div
        className="
          blog-rich-content
          prose prose-lg max-w-none
          prose-headings:font-black prose-headings:text-[#1A2E33] prose-headings:tracking-tight
          prose-h2:mt-14 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3 prose-h2:text-2xl md:prose-h2:text-3xl
          prose-h3:mt-9 prose-h3:mb-4 prose-h3:text-xl prose-h3:text-[#2A4A52] md:prose-h3:text-2xl
          prose-p:mb-6 prose-p:text-[17px] prose-p:leading-[1.9] prose-p:text-[#374151]
          prose-a:text-[#E8622A] prose-a:font-semibold prose-a:underline hover:prose-a:text-[#d43d23]
          prose-strong:text-[#1A2E33] prose-strong:font-black
          prose-code:text-[#E8622A] prose-code:bg-[#E8622A]/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-pre:overflow-x-auto prose-pre:rounded-xl prose-pre:bg-[#1A2E33] prose-pre:p-6 prose-pre:text-gray-100 prose-pre:shadow-xl prose-pre:border prose-pre:border-gray-700
          prose-blockquote:rounded-r-2xl prose-blockquote:border-l-4 prose-blockquote:border-[#E8622A] prose-blockquote:bg-gradient-to-r prose-blockquote:from-[#F5F8F8] prose-blockquote:to-white prose-blockquote:py-4 prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:text-gray-700 prose-blockquote:not-italic prose-blockquote:font-medium
          prose-ul:my-6 prose-ul:pl-6 prose-li:mb-2 prose-li:text-gray-700
          prose-ol:my-6 prose-ol:pl-6
          prose-img:my-10 prose-img:block prose-img:h-auto prose-img:w-full prose-img:max-w-full prose-img:rounded-2xl prose-img:border prose-img:border-gray-200 prose-img:shadow-md
          prose-hr:border-gray-200 prose-hr:my-12
          prose-table:overflow-hidden prose-table:rounded-xl prose-th:bg-[#1A2E33] prose-th:text-white prose-th:font-bold prose-td:border prose-td:border-gray-200
        "
      >
        {renderArticleContent(contentHtml)}
      </div>

      {/* ── Mid-Article / Post-Content Service Callout ────────────────────────── */}
      <div className="my-14 rounded-2xl border border-[#2D6E7A]/30 bg-gradient-to-r from-[#1A2E33] via-[#254249] to-[#142024] p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#FF8E5C] bg-[#E8622A]/20 border border-[#E8622A]/40 px-2.5 py-0.5 rounded-full">
              <Sparkles size={11} />
              Professional Implementation
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Need Help Implementing This in Production?
            </h3>
            <p className="text-xs sm:text-sm text-white/75 max-w-xl">
              From full-stack Next.js and MERN architecture to technical SEO audits and AI workflow automations, our dedicated engineers deliver results.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8622A] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#E8622A]/25 hover:bg-[#d43d23] transition-all"
            >
              <span>Explore Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Frequently Asked Questions ────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="mt-14 border-t border-gray-200 pt-10">
          <div className="mb-6 flex items-center gap-2 text-[#1A2E33]">
            <HelpCircle className="h-6 w-6 text-[#E8622A]" />
            <h2 className="text-xl font-black tracking-tight md:text-2xl text-[#1A2E33]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3.5">
            {faqs.map((faq, index) => (
              <details
                key={`${faq.question}-${index}`}
                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-xs transition-all hover:border-[#E8622A]/40"
              >
                <summary className="cursor-pointer list-none text-base font-bold leading-7 text-[#1A2E33] marker:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{faq.question}</span>
                    <span className="text-[#E8622A] text-lg font-bold transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-gray-600 border-t border-gray-100 pt-3">
                  {stripHtml(faq.answer)}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ── Author Bio Box ──────────────────────────────────────────────────── */}
      <div className="mt-14 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-2xl overflow-hidden bg-[#2A4A52] text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-[#E8622A]/40">
            {blog.author?.avatar ? (
              <Image
                src={blog.author.avatar}
                alt={authorName}
                fill
                className="object-cover"
              />
            ) : (
              <span>{authorName.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-lg font-black text-[#1A2E33]">
                {authorName}
              </h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold">
                <ShieldCheck size={11} />
                Verified Author
              </span>
            </div>
            <p className="text-xs font-semibold text-[#E8622A] mb-2">
              {authorRole} at Kraviona Tech Solutions
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {blog.author?.bio ||
                "Specializing in MERN stack web applications, Next.js architecture, technical SEO, and AI automation. Building fast, scalable, and revenue-generating digital products."}
            </p>
          </div>
        </div>
      </div>

      {/* ── Inline Contact Form ─────────────────────────────────────────────── */}
      <div className="mt-14 mx-auto max-w-2xl">
        <BlogContactForm
          initialSubject={`Service Inquiry from Article: ${blog.title}`}
        />
      </div>
    </article>
  );
};

export default BlogDetailPage;
