"use client";

import React from "react";
import Link from "next/link";
import {
  Code2,
  Search,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
} from "lucide-react";

const FEATURED_SERVICES = [
  {
    slug: "mern-stack-development",
    title: "MERN Stack Development",
    tagline: "High-Velocity React & Next.js Apps",
    badge: "Core Engineering",
    icon: Code2,
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    borderHover: "hover:border-cyan-500/50",
    description: "Production web applications built with Next.js App Router, MongoDB, clean microservices, and reusable component libraries.",
    deliverables: [
      "Next.js Turbopack & SSR architecture",
      "Secure REST & GraphQL APIs",
      "Sub-second client rendering",
      "Production deployment & CI/CD",
    ],
  },
  {
    slug: "technical-seo",
    title: "Technical SEO & Speed",
    tagline: "Organic Search Supremacy",
    badge: "Revenue Growth",
    icon: Search,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderHover: "hover:border-amber-500/50",
    description: "Crawl budget waste elimination, rich Schema markup, Core Web Vitals optimization, and architecture audits that make Google rank your pages.",
    deliverables: [
      "Core Web Vitals (LCP, INP, CLS) optimization",
      "JSON-LD Schema & Rich Snippets",
      "Canonical & 301 redirect fixes",
      "Crawl budget & indexing architecture",
    ],
  },
  {
    slug: "ai-automation",
    title: "AI Workflows & Automation",
    tagline: "Autonomous Business Pipelines",
    badge: "Next-Gen AI",
    icon: Cpu,
    gradient: "from-purple-500/20 via-pink-500/10 to-transparent",
    borderHover: "hover:border-purple-500/50",
    description: "Custom LLM integrations, autonomous AI agents, document processing pipelines, and 24/7 intelligent customer engagement chatbots.",
    deliverables: [
      "Custom GPT & Claude Agent workflows",
      "n8n, Python & Webhook pipelines",
      "WhatsApp & CRM automated sync",
      "AI Knowledge base & FAQ search",
    ],
  },
  {
    slug: "backend-development",
    title: "Cloud Backend & APIs",
    tagline: "Resilient Server Infrastructure",
    badge: "Scalable Logic",
    icon: Layers,
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    borderHover: "hover:border-emerald-500/50",
    description: "Battle-tested Node.js, Express, and microservices backends engineered for low-latency queries, role security, and high concurrent load.",
    deliverables: [
      "MongoDB & SQL optimized schema",
      "JWT & OAuth2 session management",
      "Caching with Redis & CDN edge rules",
      "AWS EC2, Docker & Nginx hosting",
    ],
  },
];

export default function ServicesShowcaseSection({ dark = false }) {
  const bgClass = dark
    ? "bg-[#0b1216] border-white/10 text-white"
    : "bg-gradient-to-b from-[#F7FAFA] to-[#EDF2F4] border-gray-200/80 text-gray-900";

  const cardBg = dark
    ? "bg-[#142024]/80 border-white/10 text-white"
    : "bg-white border-gray-200 text-gray-900 shadow-sm";

  const titleText = dark ? "text-white" : "text-[#1A2E33]";
  const subText = dark ? "text-white/70" : "text-gray-600";

  return (
    <section className={`py-16 border-t ${bgClass}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8622A]/15 border border-[#E8622A]/30 px-3 py-1 text-xs font-black uppercase tracking-widest text-[#E8622A] mb-3">
              <Sparkles size={12} />
              Kraviona Technical Services
            </div>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight ${titleText}`}>
              Transform Your Product with Our Engineering Team
            </h2>
            <p className={`mt-2.5 text-sm sm:text-base max-w-2xl ${subText}`}>
              We don&apos;t just write articles—we engineer and optimize production web systems, AI workflows, and technical search engines for ambitious founders.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E8622A] px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#E8622A]/25 hover:bg-[#d43d23] hover:shadow-xl transition-all"
            >
              <span>Explore All 16+ Services</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.slug}
                className={`group relative rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${cardBg} ${srv.borderHover}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8622A] text-white shadow-md shadow-[#E8622A]/20 transition-transform group-hover:scale-110">
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      dark ? "bg-white/10 text-white/80" : "bg-gray-100 text-gray-700"
                    }`}>
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className={`text-lg font-black tracking-tight leading-snug group-hover:text-[#E8622A] transition-colors ${titleText}`}>
                    {srv.title}
                  </h3>
                  <p className="text-xs font-bold text-[#E8622A] mt-0.5 mb-2.5">
                    {srv.tagline}
                  </p>

                  <p className={`text-xs leading-relaxed mb-5 ${subText}`}>
                    {srv.description}
                  </p>

                  <div className="space-y-2 mb-6 border-t border-inherit pt-4">
                    {srv.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 size={13} className="text-[#E8622A] shrink-0 mt-0.5" />
                        <span className={dark ? "text-white/85" : "text-gray-700"}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-inherit">
                  <Link
                    href={`/services/${srv.slug}`}
                    className="inline-flex items-center justify-between w-full text-xs font-bold text-[#E8622A] group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Service Roadmap</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Free Consultation Bottom Strip */}
        <div className="mt-12 rounded-2xl border border-[#2D6E7A]/40 bg-gradient-to-r from-[#1A2E33] via-[#243F45] to-[#142024] p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#E8622A]/20 border border-[#E8622A]/40 flex items-center justify-center text-[#E8622A] shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="text-lg font-black tracking-tight text-white">
                Need a Custom Quote or Architecture Assessment?
              </h4>
              <p className="text-xs sm:text-sm text-white/75 mt-0.5">
                We review your codebase, current SEO bottlenecks, or automation scope and provide an actionable proposal in 24 hours.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="https://wa.me/919608553167?text=Hi%20Kraviona%20team%2C%20I%20am%20interested%20in%20a%20technical%20service%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-xs font-bold text-black shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] transition-all"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#1A2E33] shadow-lg hover:bg-gray-100 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
