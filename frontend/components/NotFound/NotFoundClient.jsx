"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Home,
  Mail,
  MapPinned,
  MessageCircle,
  Phone,
  Search,
  Wrench,
  Tag,
  Sparkles,
} from "lucide-react";

const primaryLinks = [
  {
    name: "Home",
    href: "/",
    text: "Return to the main Kraviona homepage.",
    icon: Home,
  },
  {
    name: "Services",
    href: "/services",
    text: "Explore web development, SEO, AI, and growth services.",
    icon: Wrench,
  },
  {
    name: "Case Studies",
    href: "/case-studies",
    text: "See verified project examples and client results.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Blog",
    href: "/blog",
    text: "Read technical guides on MERN, SEO, AI & Web Dev.",
    icon: BookOpen,
  },
];

const serviceLinks = [
  { name: "MERN Stack Development", href: "/services/mern-stack-development" },
  { name: "Technical SEO", href: "/services/technical-seo" },
  { name: "AI Automation", href: "/services/ai-automation" },
  { name: "Full-Stack Development", href: "/services/full-stack-development" },
  { name: "Node.js Development", href: "/services/nodejs-development" },
  { name: "React.js Development", href: "/services/react-development" },
];

const contactLinks = [
  {
    name: "Call",
    value: "+91 96085 53167",
    href: "tel:+919608553167",
    icon: Phone,
  },
  {
    name: "Email",
    value: "kravionatech@gmail.com",
    href: "mailto:kravionatech@gmail.com",
    icon: Mail,
  },
  {
    name: "WhatsApp",
    value: "Message Kraviona team",
    href: "https://wa.me/919608553167?text=Hi%20Kraviona%2C%20I%20landed%20on%20a%20404%20page%20and%20need%20assistance.",
    icon: MessageCircle,
  },
];

export default function NotFoundClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase().trim();
    if (query.includes("blog") || query.includes("article") || query.includes("guide")) {
      router.push(`/blog?q=${encodeURIComponent(query)}`);
    } else if (query.includes("contact") || query.includes("call") || query.includes("reach")) {
      router.push("/contact");
    } else if (query.includes("pricing") || query.includes("cost") || query.includes("quote")) {
      router.push("/pricing");
    } else {
      router.push(`/services?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7F8] text-[#1A2E33]">
      {/* Hero 404 Header */}
      <section className="relative overflow-hidden bg-[#1A2E33] pt-28 pb-20">
        <div
          className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#F28C5E_1px,transparent_1px)] [background-size:28px_28px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] lg:items-center"
          >
            <div>
              <Link
                href="/"
                aria-label="Kraviona home"
                className="mb-8 inline-flex items-center gap-3 group"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-sm transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="Kraviona Tech Solutions logo"
                    width={48}
                    height={44}
                    priority
                    sizes="48px"
                    className="h-auto w-10 object-contain"
                  />
                </span>
                <span>
                  <span className="block text-xl font-black leading-none text-white">
                    Kraviona
                  </span>
                  <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-[#F28C5E]">
                    Tech Solutions
                  </span>
                </span>
              </Link>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8622A]/30 bg-[#E8622A]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#F28C5E]">
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                404 • Page Not Found
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                This page moved, but your project doesn’t have to stop.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#8FA8B0] md:text-lg">
                The link you followed may be outdated, mistyped, or updated during a site optimization.
                Use the search box or popular links below to jump straight to what you were looking for.
              </p>

              {/* Interactive Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-8 flex max-w-xl items-center rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md transition-focus focus-within:border-[#F28C5E]"
              >
                <Search className="ml-3 h-5 w-5 text-[#8FA8B0] flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, blog posts, or topics..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-[#8FA8B0] outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 rounded-xl bg-[#E8622A] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[#B84A1A]"
                >
                  Search
                </button>
              </form>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E8622A] px-6 py-3.5 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#B84A1A]"
                >
                  Go to Homepage
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-white/[0.08]"
                >
                  Browse All Services
                  <Wrench className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Direct Founder Assistance Box */}
            <aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(42,74,82,0.16)]">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-[#F28C5E]">
                <Sparkles className="h-3.5 w-3.5" />
                Need direct help?
              </span>
              <h2 className="mt-3 text-2xl font-black text-white">
                Talk to the Kraviona Team
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#8FA8B0]">
                If you followed a broken link from an article or external directory, let us know and we’ll send you the exact resource.
              </p>
              <div className="mt-6 space-y-3">
                {contactLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-colors hover:border-[#E8622A]/50 hover:bg-white/[0.08]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8622A]/10 text-[#F28C5E]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#8FA8B0]">
                          {item.name}
                        </span>
                        <span className="block text-sm font-bold text-white">
                          {item.value}
                        </span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </aside>
          </motion.div>
        </div>
      </section>

      {/* Main Links & Featured Services */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-6">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E8622A]">
                  Popular Destinations
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1A2E33]">
                  Explore Kraviona Core Hubs
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {primaryLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#E8622A]/40 hover:shadow-md"
                    >
                      <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8622A]/10 text-[#E8622A] group-hover:bg-[#E8622A] group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="block text-lg font-black text-[#1A2E33] group-hover:text-[#E8622A]">
                        {link.name}
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-gray-600">
                        {link.text}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E8622A]">
                Top Services
              </p>
              <h3 className="mt-1 text-lg font-black text-[#1A2E33]">
                Looking for technical solutions?
              </h3>
              <div className="mt-5 space-y-2">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#F5F7F8] px-4 py-3 text-sm font-bold text-[#1A2E33] transition-colors hover:border-[#E8622A]/30 hover:bg-white hover:text-[#E8622A]"
                  >
                    {link.name}
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[#2A4A52]/15 bg-[#2A4A52]/5 p-4">
                <p className="flex items-center gap-2 text-sm font-black text-[#1A2E33]">
                  <MapPinned className="h-4 w-4 text-[#E8622A]" />
                  East Delhi, India
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
                  Founder-led engineering team specialized in MERN stack, Next.js, Technical SEO, and AI automation.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
