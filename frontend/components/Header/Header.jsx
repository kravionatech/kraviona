"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BriefcaseBusiness,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  Grid3X3,
  Layers3,
  Menu,
  MessageSquare,
  PackageCheck,
  Phone,
  SearchCheck,
  ServerCog,
  ShoppingCart,
  Target,
  UsersRound,
  X,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  {
    label: "Web Development",
    color: "text-blue-500",
    services: [
      {
        name: "MERN Stack Development",
        path: "/services/mern-stack-development",
        desc: "MongoDB, Express, React & Node.js",
        Icon: Layers3,
      },
      {
        name: "Full-Stack Development",
        path: "/services/full-stack-development",
        desc: "End-to-end full-stack solutions",
        Icon: Code2,
      },
      {
        name: "React.js Development",
        path: "/services/react-development",
        desc: "High-performance SPAs & Next.js apps",
        Icon: Code2,
      },
      {
        name: "Node.js Development",
        path: "/services/nodejs-development",
        desc: "Scalable APIs & backend systems",
        Icon: ServerCog,
      },
    ],
  },
  {
    label: "Backend & Architecture",
    color: "text-violet-500",
    services: [
      {
        name: "Backend Development",
        path: "/services/backend-development",
        desc: "Robust & secure server-side logic",
        Icon: ServerCog,
      },
      {
        name: "API Development",
        path: "/services/api-development",
        desc: "Custom RESTful & GraphQL APIs",
        Icon: Cloud,
      },
      {
        name: "Database Architecture",
        path: "/services/database-architecture",
        desc: "Optimised database structures",
        Icon: Database,
      },
      {
        name: "SaaS Development",
        path: "/services/saas-development",
        desc: "Scalable cloud-based SaaS products",
        Icon: Cloud,
      },
    ],
  },
  {
    label: "Performance & AI",
    color: "text-emerald-500",
    services: [
      {
        name: "Technical SEO",
        path: "/services/technical-seo",
        desc: "Core Web Vitals & crawlability",
        Icon: SearchCheck,
      },
      {
        name: "Web Performance Opt.",
        path: "/services/web-performance-optimization",
        desc: "Lighthouse 90+ & speed optimisation",
        Icon: BarChart3,
      },
      {
        name: "AI Automation",
        path: "/services/ai-automation",
        desc: "LLM integration & workflows",
        Icon: Bot,
      },
      {
        name: "AI Chatbot Development",
        path: "/services/ai-chatbot-development",
        desc: "Custom AI assistants & agents",
        Icon: MessageSquare,
      },
    ],
  },
  {
    label: "Branding & Marketing",
    color: "text-orange-500",
    services: [
      {
        name: "Digital Marketing",
        path: "/services/digital-marketing",
        desc: "SEO, PPC & performance campaigns",
        Icon: Target,
      },
      {
        name: "Social Media Marketing",
        path: "/services/social-media-marketing",
        desc: "Content strategy & paid social",
        Icon: UsersRound,
      },
      {
        name: "Email Marketing",
        path: "/services/email-marketing",
        desc: "Lifecycle campaigns & automation",
        Icon: MessageSquare,
      },
      {
        name: "Brand Identity & Design",
        path: "/services/brand-identity",
        desc: "Logos, design systems & brand kits",
        Icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Marketplace & Seller",
    color: "text-rose-500",
    services: [
      {
        name: "E-Commerce Dev & Marketing",
        path: "/services/ecommerce-development-marketing",
        desc: "Storefronts built to sell",
        Icon: ShoppingCart,
      },
      {
        name: "Account Management",
        path: "/services/account-management",
        desc: "End-to-end marketplace account care",
        Icon: BriefcaseBusiness,
      },
      {
        name: "Cataloging",
        path: "/services/cataloging",
        desc: "Listings, variations & optimisation",
        Icon: PackageCheck,
      },
      {
        name: "Accounting",
        path: "/services/accounting",
        desc: "Bookkeeping & profitability tracking",
        Icon: BarChart3,
      },
      {
        name: "Advertising",
        path: "/services/advertising",
        desc: "PPC campaigns that drive sales",
        Icon: Target,
      },
      {
        name: "Seller Training",
        path: "/services/seller-training",
        desc: "Hands-on marketplace onboarding",
        Icon: UsersRound,
      },
    ],
  },
];

const TOTAL_SERVICES = SERVICE_CATEGORIES.reduce(
  (sum, cat) => sum + cat.services.length,
  0,
);

const FEATURED = [
  {
    name: "Technical SEO",
    path: "/services/technical-seo",
    badge: "Popular",
    badgeColor: "bg-orange-50 text-orange-600",
    Icon: SearchCheck,
  },
  {
    name: "MERN Stack Development",
    path: "/services/mern-stack-development",
    badge: "Top Rated",
    badgeColor: "bg-amber-50 text-amber-700",
    Icon: Layers3,
  },
  {
    name: "Account Management",
    path: "/services/account-management",
    badge: "New",
    badgeColor: "bg-rose-50 text-rose-600",
    Icon: BriefcaseBusiness,
  },
  {
    name: "AI Automation",
    path: "/services/ai-automation",
    badge: "Trending",
    badgeColor: "bg-teal-50 text-teal-700",
    Icon: Bot,
  },
];

const SIMPLE_MENUS = {
  Insights: [
    { name: "All Articles", path: "/blog" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "MERN Stack", path: "/category/mern-stack" },
    { name: "Technical SEO", path: "/category/technical-seo" },
    { name: "Web Performance", path: "/category/web-performance" },
  ],
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Portfolio", path: "/gallery" },
    { name: "Pricing", path: "/pricing" },
  ],
};

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services", mega: true },
  { name: "Insights", dropdown: SIMPLE_MENUS.Insights, path: "/blog" },
  { name: "Case Studies", path: "/case-studies" },
  { name: "Company", dropdown: SIMPLE_MENUS.Company, path: "/about" },
  { name: "Contact", path: "/contact" },
];

// ── Component ─────────────────────────────────────────────────────────────
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAcc, setMobileAcc] = useState(null);
  const [megaOpen, setMegaOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const megaTimer = useRef(null);
  const dropTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAcc(null);
  };
  const closeMenus = () => {
    setMegaOpen(false);
    setOpenDropdown(null);
  };

  const onMegaEnter = () => {
    clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const onMegaLeave = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };
  const onDropEnter = (idx) => {
    clearTimeout(dropTimer.current);
    setOpenDropdown(idx);
  };
  const onDropLeave = () => {
    dropTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const isActive = (path) =>
    path && (path === "/" ? pathname === "/" : pathname.startsWith(path));

  return (
    <>
      {/* ─────────────── DESKTOP ─────────────────────────────────────── */}
      <header
        className={`hidden lg:flex fixed top-0 left-0 z-50 isolate w-full items-center justify-between border-b
          px-8 xl:px-12 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${
            scrolled
              ? "h-[66px] border-gray-200/90 bg-white/96 backdrop-blur-xl shadow-[0_10px_30px_rgba(15,36,37,0.08)]"
              : "h-[78px] border-white/70 bg-white/90 backdrop-blur-xl shadow-[0_1px_0_rgba(15,36,37,0.05)]"
          }`}
        role="banner"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Kraviona – Homepage"
          className="flex flex-shrink-0 items-center gap-3 group"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
            <Image
              src="/logo.png"
              alt="Kraviona"
              width={44}
              height={40}
              priority
              className="h-auto w-8 object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-extrabold leading-none text-[#111A1F]">
              Kraviona
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#295c5e]">
              Tech Solutions
            </span>
          </span>
        </Link>

        {/* Nav */}
        <nav
          aria-label="Main navigation"
          className="mx-6 flex min-w-0 flex-1 justify-center"
        >
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item, idx) => {
              const active = isActive(item.path);

              /* ── Mega menu */
              if (item.mega)
                return (
                  <li
                    key={item.name}
                    className="relative"
                    onMouseEnter={onMegaEnter}
                    onMouseLeave={onMegaLeave}
                  >
                    <Link
                      href={item.path}
                      onClick={closeMenus}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      className={`group flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[13.5px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d96c4e]/30
                      ${active ? "bg-[#f6faf9] text-[#295c5e]" : "text-gray-600 hover:bg-gray-50 hover:text-[#111A1F]"}`}
                    >
                      Services
                      <ChevronDown
                        size={15}
                        strokeWidth={2.2}
                        className={`transition-transform duration-300 ${megaOpen ? "rotate-180 text-[#d96c4e]" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                    </Link>

                    {/* ── Mega panel ── */}
                    <div
                      className={`absolute top-[calc(100%+18px)] left-1/2 z-50 w-[min(1120px,calc(100vw-48px))] -translate-x-1/2
                      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
                      aria-label="Services menu"
                    >
                      <div className="max-h-[calc(100vh-112px)] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-[0_24px_70px_rgba(15,36,37,0.14)]">
                        {/* ── Top bar ── */}
                        <div className="flex items-center justify-between border-b border-gray-200 bg-[#FAFCFC] px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#295c5e] ring-1 ring-gray-200">
                              <Grid3X3 size={17} strokeWidth={2.1} />
                            </span>
                            <span>
                              <span className="block text-[13px] font-bold text-[#111A1F]">
                                Services
                              </span>
                              <span className="block text-[11px] font-medium text-gray-500">
                                Development, marketing, AI, and seller support
                              </span>
                            </span>
                            <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#295c5e] ring-1 ring-gray-200">
                              {TOTAL_SERVICES} services
                            </span>
                          </div>
                          <Link
                            href="/services"
                            onClick={closeMenus}
                            className="flex items-center gap-1.5 text-[12px] font-semibold text-[#295c5e] transition-colors hover:text-[#d96c4e]"
                          >
                            View all services <ArrowRight size={14} strokeWidth={2.2} />
                          </Link>
                        </div>

                        <div className="grid grid-cols-[1fr_220px]">
                          {/* ── 5-column service grid ── */}
                          <div className="grid grid-cols-5 divide-x divide-gray-100/80">
                            {SERVICE_CATEGORIES.map((cat) => (
                              <div key={cat.label} className="p-4">
                                {/* Category label */}
                                <div className="flex items-center gap-1.5 mb-2.5">
                                  <span className={`text-[9px] font-extrabold uppercase tracking-[0.15em] ${cat.color}`}>
                                    {cat.label}
                                  </span>
                                </div>
                                <ul className="space-y-1">
                                  {cat.services.map((svc) => {
                                    const ServiceIcon = svc.Icon;

                                    return (
                                      <li key={svc.name}>
                                        <Link
                                          href={svc.path}
                                          onClick={closeMenus}
                                          className="group/item flex items-start gap-2.5 rounded-md px-2 py-2 transition-colors duration-150 hover:bg-[#FAFCFC]"
                                        >
                                          <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-[#295c5e] transition-colors group-hover/item:border-[#d96c4e]/35 group-hover/item:text-[#d96c4e]">
                                            <ServiceIcon size={14} strokeWidth={2.1} />
                                          </span>
                                          <span className="min-w-0">
                                            <span className="block text-[11.5px] font-semibold leading-snug text-gray-800 transition-colors group-hover/item:text-[#d96c4e]">
                                              {svc.name}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[10px] leading-tight text-gray-500">
                                              {svc.desc}
                                            </span>
                                          </span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* ── Right sidebar: Featured + CTA ── */}
                          <div className="flex flex-col gap-3 border-l border-gray-100 bg-[#FAFCFC] p-4">
                            <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-gray-500">
                              Featured
                            </p>
                            <ul className="space-y-1.5">
                              {FEATURED.map((f) => {
                                const FeaturedIcon = f.Icon;

                                return (
                                  <li key={f.name}>
                                    <Link
                                      href={f.path}
                                      onClick={closeMenus}
                                      className="group/feat flex items-center gap-2 rounded-md border border-gray-200 bg-white px-2.5 py-2 transition-colors duration-200 hover:border-[#d96c4e]/35"
                                    >
                                      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-[#f6faf9] text-[#295c5e]">
                                        <FeaturedIcon size={14} strokeWidth={2.1} />
                                      </span>
                                      <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[11px] font-semibold text-gray-700 transition-colors group-hover/feat:text-[#d96c4e]">
                                          {f.name}
                                        </span>
                                      </span>
                                      <span
                                        className={`flex-shrink-0 whitespace-nowrap rounded-full px-1.5 py-0.5 text-[8.5px] font-bold ${f.badgeColor}`}
                                      >
                                        {f.badge}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>

                            {/* Divider */}
                            <div className="border-t border-gray-200/70 pt-3 mt-auto space-y-2">
                              <Link
                                href="/contact"
                                onClick={closeMenus}
                                className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#111A1F] py-2.5 text-[12px] font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#d96c4e]"
                              >
                                Start a Project
                                <ArrowRight size={13} strokeWidth={2.2} />
                              </Link>
                              <Link
                                href="/pricing"
                                onClick={closeMenus}
                                className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 py-2 text-[11.5px] font-semibold text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900"
                              >
                                View Pricing
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );

              /* ── Simple dropdown */
              if (item.dropdown)
                return (
                  <li
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => onDropEnter(idx)}
                    onMouseLeave={onDropLeave}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={openDropdown === idx}
                      className={`group flex items-center gap-1.5 rounded-md px-3.5 py-2 text-[13.5px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d96c4e]/30
                      ${isActive(item.path) ? "bg-[#f6faf9] text-[#295c5e]" : "text-gray-600 hover:bg-gray-50 hover:text-[#111A1F]"}`}
                    >
                      {item.name}
                      <ChevronDown
                        size={15}
                        strokeWidth={2.2}
                        className={`transition-transform duration-300 ${openDropdown === idx ? "rotate-180 text-[#d96c4e]" : "text-gray-400 group-hover:text-gray-600"}`}
                      />
                    </button>

                    <div
                      className={`absolute top-[calc(100%+14px)] left-0 min-w-[210px]
                      transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${openDropdown === idx ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
                      aria-label={`${item.name} links`}
                    >
                      <div className="rounded-lg border border-gray-200 bg-white p-1.5 shadow-[0_16px_46px_rgba(15,36,37,0.12)]">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            onClick={closeMenus}
                            className="block rounded-md px-3.5 py-2.5 text-[13px] font-medium text-gray-600 transition-colors duration-150 hover:bg-gray-50 hover:text-gray-900"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </li>
                );

              /* ── Plain link */
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={closeMenus}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center rounded-md px-3.5 py-2 text-[13.5px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d96c4e]/30
                      ${active ? "bg-[#f6faf9] text-[#295c5e]" : "text-gray-600 hover:bg-gray-50 hover:text-[#111A1F]"}`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop CTA */}
        <Link
          href="/contact"
          className="flex items-center gap-2 rounded-md bg-[#111A1F] px-5 py-2.5 text-[13px] font-bold text-white shadow-[0_10px_22px_rgba(17,26,31,0.14)] transition-colors duration-200 hover:bg-[#d96c4e] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d96c4e]/35"
          aria-label="Start a project"
        >
          Start Project
          <ArrowRight size={15} strokeWidth={2.2} />
        </Link>
      </header>

      {/* ─────────────── MOBILE BAR ──────────────────────────────────── */}
      <header
        className={`lg:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 transition-all duration-300
          ${
            scrolled
              ? "h-[60px] border-b border-gray-200 bg-white/96 backdrop-blur-xl shadow-[0_8px_24px_rgba(15,36,37,0.08)]"
              : "h-[66px] border-b border-gray-100 bg-white/94 backdrop-blur-lg"
          }`}
        role="banner"
      >
        <Link
          href="/"
          onClick={closeMobile}
          aria-label="Kraviona – Homepage"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
            <Image
              src="/logo.png"
              alt="Kraviona"
              width={36}
              height={33}
              priority
              className="h-auto w-8 object-contain"
            />
          </span>
          <span>
            <span className="block text-sm font-extrabold leading-none text-[#111A1F]">
              Kraviona
            </span>
            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#295c5e]">
              Tech Solutions
            </span>
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-[#111A1F] text-white shadow-[0_10px_22px_rgba(17,26,31,0.16)] transition-colors hover:bg-[#d96c4e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d96c4e]/35"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Menu size={21} strokeWidth={2.1} />
        </button>
      </header>

      {/* ─────────────── MOBILE OVERLAY ──────────────────────────────── */}
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[60] lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* ─────────────── MOBILE DRAWER ───────────────────────────────── */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed top-0 right-0 h-full w-[88%] max-w-[370px] bg-white z-[70] lg:hidden flex flex-col
          shadow-[-16px_0_48px_rgba(15,36,37,0.14)]
          transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex h-[70px] items-center justify-between border-b border-gray-200 bg-[#FAFCFC] px-5">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
              <Image
                src="/logo.png"
                alt="Kraviona"
                width={36}
                height={33}
                className="h-auto w-8 object-contain"
              />
            </span>
            <span>
              <span className="block text-sm font-extrabold leading-none text-[#111A1F]">
                Kraviona
              </span>
              <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#295c5e]">
                Menu
              </span>
            </span>
          </div>
          <button
            onClick={closeMobile}
            className="flex h-9 w-9 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-white hover:text-gray-800"
            aria-label="Close navigation"
          >
            <X size={20} strokeWidth={2.1} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-3"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-0.5">
            <MobileLink
              href="/"
              active={pathname === "/"}
              onClick={closeMobile}
            >
              Home
            </MobileLink>

            {/* Services accordion */}
            <MobileAccordion
              label="Services"
              open={mobileAcc === "services"}
              onToggle={() =>
                setMobileAcc(mobileAcc === "services" ? null : "services")
              }
            >
              <Link
                href="/services"
                onClick={closeMobile}
                className="flex items-center justify-between border-b border-gray-100 px-4 py-3 text-[13px] font-bold text-[#295c5e] transition-colors hover:bg-[#f6faf9]"
              >
                View All Services <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              {SERVICE_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="border-b border-gray-100/70 last:border-0"
                >
                  <p
                    className={`px-4 pt-3.5 pb-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${cat.color}`}
                  >
                    {cat.label}
                  </p>
                  {cat.services.map((svc) => {
                    const ServiceIcon = svc.Icon;

                    return (
                      <Link
                        key={svc.name}
                        href={svc.path}
                        onClick={closeMobile}
                        className="flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-medium text-gray-700 transition-colors hover:bg-[#f6faf9] hover:text-[#d96c4e]"
                      >
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-[#295c5e]">
                          <ServiceIcon size={14} strokeWidth={2.1} />
                        </span>
                        <span className="min-w-0">{svc.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </MobileAccordion>

            {/* Insights accordion */}
            <MobileAccordion
              label="Insights"
              open={mobileAcc === "insights"}
              onToggle={() =>
                setMobileAcc(mobileAcc === "insights" ? null : "insights")
              }
            >
              {SIMPLE_MENUS.Insights.map((s) => (
                <Link
                  key={s.name}
                  href={s.path}
                  onClick={closeMobile}
                  className="block px-4 py-3 text-[13.5px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100/70 last:border-0 transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </MobileAccordion>

            <MobileLink
              href="/case-studies"
              active={pathname.startsWith("/case-studies")}
              onClick={closeMobile}
            >
              Case Studies
            </MobileLink>

            {/* Company accordion */}
            <MobileAccordion
              label="Company"
              open={mobileAcc === "company"}
              onToggle={() =>
                setMobileAcc(mobileAcc === "company" ? null : "company")
              }
            >
              {SIMPLE_MENUS.Company.map((s) => (
                <Link
                  key={s.name}
                  href={s.path}
                  onClick={closeMobile}
                  className="block px-4 py-3 text-[13.5px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100/70 last:border-0 transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </MobileAccordion>

            <MobileLink
              href="/contact"
              active={pathname === "/contact"}
              onClick={closeMobile}
            >
              Contact
            </MobileLink>
          </ul>
        </nav>

        {/* Drawer footer */}
        <div className="p-4 border-t border-gray-100 space-y-2.5 flex-shrink-0">
          <Link
            href="/contact"
            onClick={closeMobile}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#111A1F] py-3.5 text-[13.5px] font-bold text-white shadow-sm transition-colors hover:bg-[#d96c4e]"
          >
            Start Project <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
          <a
            href="tel:+919608553167"
            onClick={closeMobile}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-200 py-3 text-[13.5px] font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <Phone size={16} strokeWidth={2.1} />
            +91 96085 53167
          </a>
        </div>
      </div>
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────
function MobileLink({ href, active, onClick, children }) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={`block rounded-md px-4 py-3 text-[14.5px] font-semibold transition-colors
          ${active ? "bg-[#f6faf9] text-[#295c5e]" : "text-gray-800 hover:bg-gray-50"}`}
      >
        {children}
      </Link>
    </li>
  );
}

function MobileAccordion({ label, open, onToggle, children }) {
  return (
    <li>
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-md px-4 py-3 text-[14.5px] font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={16}
          strokeWidth={2.2}
          className={`transition-transform duration-300 ${open ? "rotate-180 text-[#d96c4e]" : "text-gray-400"}`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mx-2 mb-2 overflow-hidden rounded-md border border-gray-100 bg-white shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}
