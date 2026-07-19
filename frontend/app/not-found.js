"use client";

import Image from "next/image";
import Link from "next/link";
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
} from "lucide-react";

const primaryLinks = [
  {
    name: "Home",
    href: "/",
    text: "Return to the main Kraviona page.",
    icon: Home,
  },
  {
    name: "Services",
    href: "/services",
    text: "Explore development, SEO, AI, and marketing services.",
    icon: Wrench,
  },
  {
    name: "Case Studies",
    href: "/case-studies",
    text: "See project examples and business outcomes.",
    icon: BriefcaseBusiness,
  },
  {
    name: "Blog",
    href: "/blog",
    text: "Read practical web, SEO, and growth insights.",
    icon: BookOpen,
  },
];

const serviceLinks = [
  { name: "MERN Stack Development", href: "/services/mern-stack-development" },
  { name: "Technical SEO", href: "/services/technical-seo" },
  { name: "AI Automation", href: "/services/ai-automation" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "Account Management", href: "/services/account-management" },
  { name: "Seller Training", href: "/services/seller-training" },
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
    value: "Message the team",
    href: "https://wa.me/919608553167",
    icon: MessageCircle,
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#FAFCFC] text-[#111A1F]">
      <section className="relative overflow-hidden bg-[#081314] pt-28 pb-16">
        <div
          className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#f4be78_1px,transparent_1px)] [background-size:28px_28px]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-center"
          >
            <div>
              <Link
                href="/"
                aria-label="Kraviona home"
                className="mb-8 inline-flex items-center gap-3"
              >
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="Kraviona logo"
                    width={48}
                    height={44}
                    priority
                    className="h-auto w-11 object-contain"
                  />
                </span>
                <span>
                  <span className="block text-xl font-black leading-none text-white">
                    Kraviona
                  </span>
                  <span className="mt-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-[#f4be78]">
                    Tech Solutions
                  </span>
                </span>
              </Link>

              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d96c4e]/25 bg-[#d96c4e]/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f4be78]">
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                404 page not found
              </span>

              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                This page moved, but your project can still move forward.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#b6c8c9] md:text-lg">
                The URL may be old, mistyped, or removed during a site update.
                Use the links below to jump back into the main Kraviona pages,
                services, insights, or contact options.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d96c4e] px-6 py-3.5 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#c25e41]"
                >
                  Go to Homepage
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-black text-white transition-colors hover:bg-white/[0.08]"
                >
                  Browse Services
                  <Wrench className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.16)]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4be78]">
                Need help now?
              </p>
              <h2 className="mt-3 text-2xl font-black text-white">
                Talk to Kraviona directly.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#b6c8c9]">
                If you followed a broken service or blog link, send it to us and
                we will point you to the right page.
              </p>
              <div className="mt-5 space-y-3">
                {contactLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-left transition-colors hover:border-[#d96c4e]/50 hover:bg-white/[0.08]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d96c4e]/10 text-[#f4be78]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#789798]">
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

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d96c4e]">
                    Popular paths
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#111A1F]">
                    Continue from the main header links
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {primaryLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#d96c4e]/40 hover:shadow-md"
                    >
                      <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#d96c4e]/10 text-[#d96c4e]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="block text-lg font-black text-[#111A1F] group-hover:text-[#d96c4e]">
                        {link.name}
                      </span>
                      <span className="mt-2 block text-sm leading-relaxed text-gray-600">
                        {link.text}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d96c4e]">
                Featured services
              </p>
              <div className="mt-5 space-y-2">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#FAFCFC] px-4 py-3 text-sm font-bold text-[#1b3d3e] transition-colors hover:border-[#d96c4e]/30 hover:bg-white hover:text-[#d96c4e]"
                  >
                    {link.name}
                    <ArrowRight className="h-4 w-4 flex-shrink-0" />
                  </Link>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-[#295c5e]/15 bg-[#295c5e]/5 p-4">
                <p className="flex items-center gap-2 text-sm font-black text-[#111A1F]">
                  <MapPinned className="h-4 w-4 text-[#d96c4e]" />
                  East Delhi, India
                </p>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Founder-led support for web development, SEO, marketing,
                  automation, and marketplace seller operations.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
