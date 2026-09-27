"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  PhoneCall,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  Compass,
  Code2,
  Search,
  Cpu,
} from "lucide-react";
import { getImageUrl, formatDate } from "@/utils/dataHelpers";

const SERVICES_CATALOG = [
  {
    slug: "mern-stack-development",
    title: "MERN Stack Development",
    category: "Web Development",
    badge: "Core Service",
    icon: Code2,
    description: "Production React & Next.js web applications with scalable Node.js & MongoDB architecture.",
    tags: ["Next.js App Router", "Full-Stack APIs", "Scalable Architecture"],
    matchKeys: ["mern", "react", "node", "javascript", "typescript", "web", "programming"],
  },
  {
    slug: "technical-seo",
    title: "Technical SEO & Speed",
    category: "Search Performance",
    badge: "High Impact",
    icon: Search,
    description: "Core Web Vitals, rich schema markup, crawl budget fixes, and indexation optimization.",
    tags: ["Sub-second LCP", "Schema Markup", "Crawl Optimization"],
    matchKeys: ["seo", "technical-seo", "performance", "crawl", "audit", "google"],
  },
  {
    slug: "ai-automation",
    title: "AI Workflows & Agents",
    category: "Automation",
    badge: "2026 Ready",
    icon: Cpu,
    description: "Custom LLM integrations, autonomous AI agents, and WhatsApp/CRM workflow pipelines.",
    tags: ["Custom AI Agents", "n8n Automation", "LLM Workflows"],
    matchKeys: ["ai", "automation", "chatgpt", "agent", "machine-learning", "claude"],
  },
  {
    slug: "ai-chatbot-development",
    title: "AI Chatbot Development",
    category: "Customer Support",
    badge: "High Conversion",
    icon: MessageSquare,
    description: "Intelligent lead qualification and 24/7 automated support assistants trained on your data.",
    tags: ["Website Chatbots", "WhatsApp Bots", "Knowledge Base Sync"],
    matchKeys: ["chatbot", "chatbots", "whatsapp", "support"],
  },
  {
    slug: "full-stack-development",
    title: "Full-Stack Engineering",
    category: "Enterprise Software",
    badge: "End-to-End",
    icon: Sparkles,
    description: "Turnkey digital products, SaaS dashboards, and cloud-native backend systems.",
    tags: ["SaaS MVPs", "Custom Portals", "Cloud Deployments"],
    matchKeys: ["full-stack", "enterprise", "software", "java"],
  },
];

function selectServicesForPost(post) {
  const text = `${post?.category?.slug || ""} ${post?.category?.name || ""} ${post?.title || ""} ${post?.slug || ""}`.toLowerCase();

  const scored = SERVICES_CATALOG.map((s) => {
    let score = 0;
    s.matchKeys.forEach((key) => {
      if (text.includes(key)) score += 2;
    });
    return { ...s, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top 2 matching services (or fallback to top 2 if no match)
  const selected = scored.slice(0, 2);
  return selected;
}

export default function BlogSidebar({
  post,
  relatedPosts = [],
  dark = false,
}) {
  const services = selectServicesForPost(post);
  const isNews = post?.contentType === "news";

  const cardBg = dark
    ? "bg-[#142024]/90 border-white/10 text-white"
    : "bg-white border-gray-200/90 text-gray-900 shadow-sm";

  const headingText = dark ? "text-white" : "text-[#1A2E33]";
  const subText = dark ? "text-white/60" : "text-gray-600";
  const itemBorder = dark ? "border-white/10" : "border-gray-100";

  return (
    <aside className="w-full space-y-6">
      {/* ── Widget 1: Kraviona Services (Tailored for this article) ────────── */}
      <div className={`rounded-2xl border p-5 md:p-6 backdrop-blur-sm transition-all duration-300 ${cardBg}`}>
        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8622A]/15 text-[#E8622A]">
              <Compass size={15} />
            </span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E8622A]">
                Engineering Solutions
              </p>
              <h3 className={`text-base font-black ${headingText}`}>
                Services for Your Team
              </h3>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Available
          </span>
        </div>

        <p className={`text-xs leading-relaxed mb-4 ${subText}`}>
          Looking to implement the technologies discussed in this article? Kraviona delivers enterprise-grade software and search solutions.
        </p>

        <div className="space-y-3.5">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <Link
                key={srv.slug}
                href={`/services/${srv.slug}`}
                className={`group block p-3.5 rounded-xl border transition-all duration-200 ${
                  dark
                    ? "bg-white/5 border-white/10 hover:border-[#E8622A]/60 hover:bg-white/10"
                    : "bg-[#F7FAFA] border-gray-200/80 hover:border-[#E8622A]/60 hover:bg-[#FFF8F5]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8622A] text-white shadow-sm shadow-[#E8622A]/20 transition-transform group-hover:scale-105">
                    <Icon size={17} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#E8622A]">
                        {srv.category}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        dark ? "bg-white/10 text-white/70" : "bg-gray-200/80 text-gray-700"
                      }`}>
                        {srv.badge}
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold truncate group-hover:text-[#E8622A] transition-colors ${headingText}`}>
                      {srv.title}
                    </h4>
                    <p className={`text-[11px] line-clamp-2 mt-1 leading-snug ${subText}`}>
                      {srv.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {srv.tags.slice(0, 2).map((t, idx) => (
                        <span
                          key={idx}
                          className={`text-[9px] font-medium px-2 py-0.5 rounded-md ${
                            dark ? "bg-white/10 text-white/80" : "bg-white border border-gray-200 text-gray-600"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between text-xs font-bold text-[#E8622A]">
                  <span>Explore service details</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-inherit text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8622A] hover:underline"
          >
            <span>View all 16+ engineering services</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── Widget 2: Free Architecture / Discovery Call Card ──────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-[#2D6E7A]/40 bg-gradient-to-br from-[#1A2E33] via-[#243F45] to-[#0D1F23] p-5 md:p-6 text-white shadow-xl">
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[#E8622A]/20 blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8622A]/20 border border-[#E8622A]/40 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FF8E5C] mb-3">
            <Sparkles size={11} />
            Free Consultation
          </div>

          <h3 className="text-lg font-black tracking-tight leading-snug mb-2 text-white">
            Have a Web or SEO Project in Mind?
          </h3>

          <p className="text-xs text-white/75 leading-relaxed mb-4">
            Skip generic agency pitches. Speak directly with our founder & lead engineer for an actionable 30-minute technical roadmap.
          </p>

          <ul className="space-y-1.5 mb-5 text-[11px] text-white/80">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#E8622A] shrink-0" />
              <span>Full-Stack Architecture & Tech Stack Assessment</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#E8622A] shrink-0" />
              <span>Technical SEO & Core Web Vitals Opportunity Audit</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-[#E8622A] shrink-0" />
              <span>Direct engineer consultation — no sales middlemen</span>
            </li>
          </ul>

          <div className="space-y-2">
            <a
              href="https://wa.me/919608553167?text=Hi%20Kraviona%20team%2C%20I%20am%20interested%20in%20discussing%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-[#25D366]/20 transition-all hover:bg-[#20bd5a] hover:scale-[1.02]"
            >
              <PhoneCall size={14} />
              Quick WhatsApp Chat
            </a>

            <Link
              href="/contact"
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-white/20"
            >
              <Calendar size={13} />
              Schedule Discovery Call
            </Link>
          </div>
        </div>
      </div>

      {/* ── Widget 3: Trending & Related Posts ─────────────────────────────── */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className={`rounded-2xl border p-5 backdrop-blur-sm ${cardBg}`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E8622A]">
                {isNews ? "Related Stories" : "Trending Insights"}
              </p>
              <h3 className={`text-sm font-black ${headingText}`}>
                {isNews ? "Latest Tech News" : "Recommended Reads"}
              </h3>
            </div>
            <Link
              href={isNews ? "/news" : "/blog"}
              className="text-[11px] font-bold text-[#E8622A] hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {relatedPosts.slice(0, 4).map((item) => {
              const imgUrl = getImageUrl(item);
              const itemCat = item.category?.slug || (item.contentType === "news" ? "news" : "blog");
              const href = `/${itemCat}/${item.slug}`;

              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={`group flex items-start gap-3 p-2 rounded-xl transition-all duration-200 ${
                    dark ? "hover:bg-white/5" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gray-200 border border-inherit">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={item.title || "Related post"}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#2A4A52] text-white font-bold text-xs">
                        K
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#E8622A] block mb-0.5">
                      {item.category?.name || (isNews ? "Tech News" : "Guide")}
                    </span>
                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#E8622A] transition-colors ${headingText}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center gap-1 text-[10px] ${subText}`}>
                        <Clock size={10} />
                        {item.readingTimeMinutes ? `${item.readingTimeMinutes}m` : "3m read"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
