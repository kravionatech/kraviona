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
    : "bg-[#FEFCF9] border-[#E8E4DE] text-[#1A3840] shadow-xs";

  const headingText = dark ? "text-white" : "text-[#1A3840]";
  const subText = dark ? "text-white/60" : "text-[#5A7A82]";
  const itemBorder = dark ? "border-white/10" : "border-[#E8E4DE]";

  // Trending & Related Stories Widget
  const trendingWidget = relatedPosts && relatedPosts.length > 0 && (
    <div className={`rounded-2xl border p-5 transition-all duration-300 ${cardBg}`}>
      <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#C85A3C]">
            {isNews ? "Top Tech Stories" : "Trending Insights"}
          </p>
          <h3 className={`text-sm font-black ${headingText}`}>
            {isNews ? "Latest Dispatches" : "Recommended Reads"}
          </h3>
        </div>
        <Link
          href={isNews ? "/news" : "/blog"}
          className="text-[11px] font-bold text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="space-y-3">
        {relatedPosts.slice(0, 4).map((item, idx) => {
          const imgUrl = getImageUrl(item);
          const itemCat = item.category?.slug || (item.contentType === "news" ? "news" : "blog");
          const href = `/${itemCat}/${item.slug}`;

          return (
            <Link
              key={item.slug}
              href={href}
              className={`group flex items-start gap-3 p-2 rounded-xl transition-all duration-200 ${
                dark ? "hover:bg-white/5" : "hover:bg-[#F7F5F1]"
              }`}
            >
              <div className="relative h-14 w-14 shrink-0 rounded-lg overflow-hidden bg-gray-200 border border-inherit">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={item.title || "Related post"}
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2D6E7A] text-white font-bold text-xs">
                    0{idx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#C85A3C] block mb-0.5">
                  {item.category?.name || (isNews ? "Tech News" : "Guide")}
                </span>
                <h4 className={`text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#2D6E7A] transition-colors ${headingText}`}>
                  {item.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center gap-1 text-[10px] ${subText}`}>
                    <Clock size={10} />
                    {item.readingTimeMinutes ? `${item.readingTimeMinutes}m read` : "3m read"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );

  // Kraviona Services Widget
  const servicesWidget = (
    <div className={`rounded-2xl border p-5 md:p-6 transition-all duration-300 ${cardBg}`}>
      <div className="flex items-center justify-between pb-4 border-b border-inherit mb-4">
        <div className="flex items-center gap-2">
          <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            dark ? "bg-[#C85A3C]/20 text-[#FF8E5C]" : "bg-[#2D6E7A]/10 text-[#2D6E7A]"
          }`}>
            <Compass size={15} />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#C85A3C]">
              Engineering Solutions
            </p>
            <h3 className={`text-base font-black ${headingText}`}>
              Services by Kraviona
            </h3>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          Available
        </span>
      </div>

      <p className={`text-xs leading-relaxed mb-4 ${subText}`}>
        Looking to implement scalable web architecture, AI agents, or SEO systems? Kraviona delivers end-to-end engineering.
      </p>

      <div className="space-y-3">
        {services.map((srv) => {
          const Icon = srv.icon;
          return (
            <Link
              key={srv.slug}
              href={`/services/${srv.slug}`}
              className={`group block p-3.5 rounded-xl border transition-all duration-200 ${
                dark
                  ? "bg-white/5 border-white/10 hover:border-[#C85A3C]/60 hover:bg-white/10"
                  : "bg-[#F7F5F1] border-[#E8E4DE] hover:border-[#2D6E7A]/50 hover:bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-xs transition-transform group-hover:scale-105 ${
                  dark ? "bg-[#C85A3C]" : "bg-[#2D6E7A]"
                }`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A3C]">
                      {srv.category}
                    </span>
                    <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                      dark ? "bg-white/10 text-white/70" : "bg-white border border-[#E8E4DE] text-gray-700"
                    }`}>
                      {srv.badge}
                    </span>
                  </div>
                  <h4 className={`text-xs font-bold truncate group-hover:text-[#2D6E7A] transition-colors ${headingText}`}>
                    {srv.title}
                  </h4>
                  <p className={`text-[11px] line-clamp-1 mt-0.5 leading-snug ${subText}`}>
                    {srv.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-inherit text-center">
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
        >
          <span>View all 16+ engineering services</span>
          <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );

  // Free Architecture / Discovery Call Card
  const consultationWidget = (
    <div className={`relative overflow-hidden rounded-2xl border p-5 md:p-6 transition-all duration-300 ${
      dark
        ? "border-[#2D6E7A]/40 bg-gradient-to-br from-[#1A2E33] via-[#243F45] to-[#0D1F23] text-white shadow-xl"
        : "border-[#2D6E7A]/25 bg-gradient-to-br from-[#F7F5F1] via-[#FEFCF9] to-[#EAF3F5] text-[#1A3840] shadow-xs"
    }`}>
      <div className="relative z-10">
        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-3 ${
          dark
            ? "bg-[#C85A3C]/20 border border-[#C85A3C]/40 text-[#FF8E5C]"
            : "bg-[#2D6E7A]/10 border border-[#2D6E7A]/25 text-[#2D6E7A]"
        }`}>
          <Sparkles size={11} />
          Direct Engineer Access
        </div>

        <h3 className={`text-base font-black tracking-tight leading-snug mb-2 ${dark ? "text-white" : "text-[#1A3840]"}`}>
          Have an Engineering or SEO Project?
        </h3>

        <p className={`text-xs leading-relaxed mb-4 ${dark ? "text-white/75" : "text-[#5A7A82]"}`}>
          Speak directly with Kraviona lead engineers for an actionable technical architecture review.
        </p>

        <ul className={`space-y-1.5 mb-5 text-[11px] ${dark ? "text-white/80" : "text-[#2C3E50]"}`}>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#2D6E7A] shrink-0" />
            <span>Full-Stack Architecture & Tech Stack Assessment</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#2D6E7A] shrink-0" />
            <span>Technical SEO & Core Web Vitals Audit</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 size={13} className="text-[#2D6E7A] shrink-0" />
            <span>No sales pitches — direct engineer discussion</span>
          </li>
        </ul>

        <div className="space-y-2">
          <a
            href="https://wa.me/919608553167?text=Hi%20Kraviona%20team%2C%20I%20am%20interested%20in%20discussing%20a%20project."
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-slate-900 shadow-xs transition-all hover:bg-[#20bd5a] hover:scale-[1.01]"
          >
            <PhoneCall size={14} />
            Quick WhatsApp Chat
          </a>

          <Link
            href="/contact"
            className={`flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all ${
              dark
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : "border-[#2D6E7A]/30 bg-white text-[#2D6E7A] hover:bg-[#EAF3F5]"
            }`}
          >
            <Calendar size={13} />
            Schedule Discovery Call
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <aside className="w-full space-y-5">
      {isNews ? (
        <>
          {trendingWidget}
          {servicesWidget}
          {consultationWidget}
        </>
      ) : (
        <>
          {servicesWidget}
          {consultationWidget}
          {trendingWidget}
        </>
      )}
    </aside>
  );
}
