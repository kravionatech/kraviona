"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  Layout,
  Menu,
  MessageSquare,
  PackageCheck,
  Palette,
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
    color: "text-primary",
    hubHref: "/services/web-development",
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
      {
        name: "Web App Development",
        path: "/services/web-app-development",
        desc: "Custom web applications & portals",
        Icon: Layout,
      },
      {
        name: "UI/UX Design",
        path: "/services/ui-ux-design",
        desc: "Wireframes, UI systems & UX design",
        Icon: Palette,
      },
    ],
  },
  {
    label: "Backend & Architecture",
    color: "text-primary-hover",
    hubHref: "/services/backend-architecture",
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
    color: "text-primary-light",
    hubHref: "/services/performance-ai",
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
    color: "text-accent-dark",
    hubHref: "/services/branding-marketing",
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
    color: "text-accent-dark",
    hubHref: "/services/marketplace-seller",
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
    desc: "Core Web Vitals & indexing",
    badge: "Popular",
    badgeColor: "bg-[#C85A3C]/10 text-[#C85A3C] border border-[#C85A3C]/20",
    Icon: SearchCheck,
  },
  {
    name: "MERN Stack Dev",
    path: "/services/mern-stack-development",
    desc: "High-performance web apps",
    badge: "Top Rated",
    badgeColor: "bg-[#D4A550]/15 text-[#9E7320] border border-[#D4A550]/30",
    Icon: Layers3,
  },
  {
    name: "Account Management",
    path: "/services/account-management",
    desc: "Marketplace growth & care",
    badge: "New",
    badgeColor: "bg-[#2D6E7A]/10 text-[#2D6E7A] border border-[#2D6E7A]/20",
    Icon: BriefcaseBusiness,
  },
  {
    name: "AI Automation",
    path: "/services/ai-automation",
    desc: "Custom LLMs & workflows",
    badge: "Trending",
    badgeColor: "bg-[#2D6E7A]/10 text-[#2D6E7A] border border-[#2D6E7A]/20",
    Icon: Bot,
  },
];

const SIMPLE_MENUS = {
  Blog: [
    { name: "All Articles", path: "/blog" },
    { name: "MERN Stack", path: "/category/mern-stack" },
    { name: "Technical SEO", path: "/category/technical-seo" },
    { name: "Web Performance", path: "/category/web-performance" },
    { name: "AI & Automation", path: "/category/ai-and-automation" },
  ],
  Company: [
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Solutions", path: "/solutions" },
    { name: "Portfolio", path: "/gallery" },
    { name: "Pricing", path: "/pricing" },
  ],
};

const NAV_ITEMS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services", mega: true },
  { name: "Case Studies", path: "/case-studies" },
  { name: "Blog", dropdown: SIMPLE_MENUS.Blog, path: "/blog" },
  { name: "News", path: "/news" },
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
  const router = useRouter();
  const megaTimer = useRef(null);
  const dropTimer = useRef(null);
  const mobileDialogRef = useRef(null);
  const desktopTriggerRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Services and Blog sit behind menu buttons, so Next.js cannot always
    // viewport-prefetch them like a visible Link. Warm their RSC payloads once
    // the browser is idle to make the two heaviest navigations immediate.
    const prefetchPrimaryRoutes = () => {
      router.prefetch("/services");
      router.prefetch("/blog");
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(prefetchPrimaryRoutes, {
        timeout: 2500,
      });
      return () => window.cancelIdleCallback(idleId);
    }

    const timer = window.setTimeout(prefetchPrimaryRoutes, 1200);
    return () => window.clearTimeout(timer);
  }, [router]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previouslyFocused = document.activeElement;
    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(", ");

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
        setMobileAcc(null);
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        mobileDialogRef.current?.querySelectorAll(focusableSelector) || [],
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const focusFrame = window.requestAnimationFrame(() => {
      mobileDialogRef.current?.querySelector(focusableSelector)?.focus();
    });

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);

      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus();
      }
    };
  }, [mobileOpen]);

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
    clearTimeout(megaTimer.current);
    clearTimeout(dropTimer.current);
    setMegaOpen(false);
    setOpenDropdown(null);
  };

  const onMegaEnter = () => {
    router.prefetch("/services");
    clearTimeout(megaTimer.current);
    setOpenDropdown(null);
    setMegaOpen(true);
  };
  const onMegaLeave = () => {
    megaTimer.current = setTimeout(() => setMegaOpen(false), 160);
  };
  const onDropEnter = (idx) => {
    router.prefetch(NAV_ITEMS[idx]?.path || "/blog");
    clearTimeout(dropTimer.current);
    setMegaOpen(false);
    setOpenDropdown(idx);
  };
  const onDropLeave = () => {
    dropTimer.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const toggleMega = () => {
    router.prefetch("/services");
    clearTimeout(megaTimer.current);
    clearTimeout(dropTimer.current);
    setOpenDropdown(null);
    setMegaOpen((current) => !current);
  };

  const toggleDropdown = (idx) => {
    router.prefetch(NAV_ITEMS[idx]?.path || "/blog");
    clearTimeout(megaTimer.current);
    clearTimeout(dropTimer.current);
    setMegaOpen(false);
    setOpenDropdown((current) => (current === idx ? null : idx));
  };

  const closeMenuAfterBlur = (event, menu) => {
    const menuItem = event.currentTarget;

    window.setTimeout(() => {
      if (menuItem.contains(document.activeElement)) return;

      if (menu === "mega") {
        setMegaOpen(false);
        return;
      }

      setOpenDropdown((current) => (current === menu ? null : current));
    }, 0);
  };

  const handleDesktopMenuKeyDown = (event) => {
    if (event.key !== "Escape" || (!megaOpen && openDropdown === null)) {
      return;
    }

    event.preventDefault();
    const triggerKey = megaOpen ? "services" : `dropdown-${openDropdown}`;
    const trigger = desktopTriggerRefs.current[triggerKey];

    closeMenus();
    window.requestAnimationFrame(() => trigger?.focus());
  };

  const setDesktopTriggerRef = (key) => (node) => {
    if (node) {
      desktopTriggerRefs.current[key] = node;
      return;
    }

    delete desktopTriggerRefs.current[key];
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
              ? "h-[68px] border-[#E8E4DE] bg-[#FEFCF9]/98 backdrop-blur-xl shadow-[0_4px_20px_rgba(26,56,64,0.06)]"
              : "h-[80px] border-[#E8E4DE]/80 bg-[#FEFCF9]/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
          }`}
        role="banner"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Kraviona – Homepage"
          className="flex flex-shrink-0 items-center group py-1"
        >
          <Image
            src="/full-logo.webp"
            alt="Kraviona – vision innovative development"
            width={160}
            height={52}
            priority
            sizes="160px"
            className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </Link>

        {/* Nav */}
        <nav
          aria-label="Main navigation"
          className="mx-6 flex min-w-0 flex-1 justify-center"
          onKeyDown={handleDesktopMenuKeyDown}
        >
          <ul className="flex items-center gap-1.5">
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
                    onBlur={(event) => closeMenuAfterBlur(event, "mega")}
                  >
                    <button
                      id="desktop-services-trigger"
                      ref={setDesktopTriggerRef("services")}
                      type="button"
                      onClick={toggleMega}
                      aria-haspopup="true"
                      aria-expanded={megaOpen}
                      aria-controls="desktop-services-panel"
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-1.5 rounded-[6px] border-b-2 px-3.5 py-2 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40
                      ${
                        active || megaOpen
                          ? "border-[#2D6E7A] text-[#2D6E7A] bg-[#EAF3F5]/70"
                          : "border-transparent text-[#1A3840] hover:text-[#2D6E7A] hover:bg-[#EAF3F5]/50"
                      }`}
                    >
                      Services
                      <ChevronDown
                        size={15}
                        strokeWidth={2.2}
                        className={`transition-transform duration-300 ${megaOpen ? "rotate-180 text-[#2D6E7A]" : "text-[#5A7A82] group-hover:text-[#2D6E7A]"}`}
                      />
                    </button>

                    {/* ── Mega panel ── */}
                    <div
                      id="desktop-services-panel"
                      className={`absolute top-[calc(100%+14px)] left-1/2 z-50 w-[min(1240px,calc(100vw-32px))] -translate-x-1/2
                      transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${megaOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
                      aria-hidden={!megaOpen}
                      aria-labelledby="desktop-services-trigger"
                      inert={!megaOpen}
                    >
                      <div className="max-h-[calc(100vh-100px)] overflow-y-auto rounded-[14px] border border-[#E8E4DE] bg-[#FEFCF9] shadow-[0_24px_70px_rgba(26,56,64,0.12)]">
                        {/* ── Top bar ── */}
                        <div className="flex items-center justify-between border-b border-[#E8E4DE] bg-[#F7F5F1] px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white text-[#2D6E7A] shadow-xs border border-[#E8E4DE]">
                              <Grid3X3 size={16} strokeWidth={2.2} />
                            </span>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[13.5px] font-bold text-[#1A3840]">
                                Services &amp; Capabilities
                              </span>
                              <span className="rounded-full bg-[#EAF3F5] border border-[#2D6E7A]/20 px-2 py-0.5 text-[10px] font-bold text-[#2D6E7A]">
                                {TOTAL_SERVICES} services
                              </span>
                            </div>
                          </div>
                          <Link
                            href="/services"
                            onClick={closeMenus}
                            className="group/all flex items-center gap-1.5 text-[12.5px] font-bold text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                          >
                            Explore all services <ArrowRight size={13} strokeWidth={2.2} className="transition-transform group-hover/all:translate-x-1" />
                          </Link>
                        </div>

                        <div className="grid grid-cols-[1fr_280px]">
                          {/* ── Spacious 3-column service grid (No text truncation) ── */}
                          <div className="grid grid-cols-3 gap-6 p-6">
                            {/* Column 1: Web Development (6 services) */}
                            <div className="space-y-1">
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E4DE]">
                                <Link
                                  href={SERVICE_CATEGORIES[0].hubHref || "/services"}
                                  onClick={closeMenus}
                                  className="group/cat flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                                >
                                  <span>{SERVICE_CATEGORIES[0].label}</span>
                                  <ArrowRight size={11} className="transition-transform group-hover/cat:translate-x-0.5" />
                                </Link>
                                <span className="text-[10px] font-bold text-[#5A7A82] bg-[#EAF3F5] px-1.5 py-0.5 rounded">
                                  {SERVICE_CATEGORIES[0].services.length}
                                </span>
                              </div>
                              {SERVICE_CATEGORIES[0].services.map((svc) => {
                                const ServiceIcon = svc.Icon;
                                return (
                                  <Link
                                    key={svc.name}
                                    href={svc.path}
                                    onClick={closeMenus}
                                    className="group/item flex items-start gap-2.5 rounded-[8px] p-2 transition-all duration-150 hover:bg-[#EAF3F5]"
                                  >
                                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#E8E4DE] bg-white text-[#2D6E7A] transition-colors group-hover/item:border-[#2D6E7A]/40 group-hover/item:bg-[#2D6E7A] group-hover/item:text-white mt-0.5">
                                      <ServiceIcon size={14} strokeWidth={2.1} />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <span className="block text-[12.5px] font-bold leading-snug text-[#1A3840] transition-colors group-hover/item:text-[#2D6E7A]">
                                        {svc.name}
                                      </span>
                                      <span className="block text-[11px] leading-tight text-[#5A7A82]">
                                        {svc.desc}
                                      </span>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>

                            {/* Column 2: Backend (4) & Performance & AI (4) */}
                            <div className="space-y-5">
                              <div>
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E4DE]">
                                  <Link
                                    href={SERVICE_CATEGORIES[1].hubHref || "/services"}
                                    onClick={closeMenus}
                                    className="group/cat flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                                  >
                                    <span>{SERVICE_CATEGORIES[1].label}</span>
                                    <ArrowRight size={11} className="transition-transform group-hover/cat:translate-x-0.5" />
                                  </Link>
                                  <span className="text-[10px] font-bold text-[#5A7A82] bg-[#EAF3F5] px-1.5 py-0.5 rounded">
                                    {SERVICE_CATEGORIES[1].services.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {SERVICE_CATEGORIES[1].services.map((svc) => {
                                    const ServiceIcon = svc.Icon;
                                    return (
                                      <Link
                                        key={svc.name}
                                        href={svc.path}
                                        onClick={closeMenus}
                                        className="group/item flex items-start gap-2.5 rounded-[8px] p-2 transition-all duration-150 hover:bg-[#EAF3F5]"
                                      >
                                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#E8E4DE] bg-white text-[#2D6E7A] transition-colors group-hover/item:border-[#2D6E7A]/40 group-hover/item:bg-[#2D6E7A] group-hover/item:text-white mt-0.5">
                                          <ServiceIcon size={14} strokeWidth={2.1} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <span className="block text-[12.5px] font-bold leading-snug text-[#1A3840] transition-colors group-hover/item:text-[#2D6E7A]">
                                            {svc.name}
                                          </span>
                                          <span className="block text-[11px] leading-tight text-[#5A7A82]">
                                            {svc.desc}
                                          </span>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E4DE]">
                                  <Link
                                    href={SERVICE_CATEGORIES[2].hubHref || "/services"}
                                    onClick={closeMenus}
                                    className="group/cat flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                                  >
                                    <span>{SERVICE_CATEGORIES[2].label}</span>
                                    <ArrowRight size={11} className="transition-transform group-hover/cat:translate-x-0.5" />
                                  </Link>
                                  <span className="text-[10px] font-bold text-[#5A7A82] bg-[#EAF3F5] px-1.5 py-0.5 rounded">
                                    {SERVICE_CATEGORIES[2].services.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {SERVICE_CATEGORIES[2].services.map((svc) => {
                                    const ServiceIcon = svc.Icon;
                                    return (
                                      <Link
                                        key={svc.name}
                                        href={svc.path}
                                        onClick={closeMenus}
                                        className="group/item flex items-start gap-2.5 rounded-[8px] p-2 transition-all duration-150 hover:bg-[#EAF3F5]"
                                      >
                                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#E8E4DE] bg-white text-[#2D6E7A] transition-colors group-hover/item:border-[#2D6E7A]/40 group-hover/item:bg-[#2D6E7A] group-hover/item:text-white mt-0.5">
                                          <ServiceIcon size={14} strokeWidth={2.1} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <span className="block text-[12.5px] font-bold leading-snug text-[#1A3840] transition-colors group-hover/item:text-[#2D6E7A]">
                                            {svc.name}
                                          </span>
                                          <span className="block text-[11px] leading-tight text-[#5A7A82]">
                                            {svc.desc}
                                          </span>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            {/* Column 3: Branding (4) & Marketplace (6) */}
                            <div className="space-y-5">
                              <div>
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E4DE]">
                                  <Link
                                    href={SERVICE_CATEGORIES[3].hubHref || "/services"}
                                    onClick={closeMenus}
                                    className="group/cat flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                                  >
                                    <span>{SERVICE_CATEGORIES[3].label}</span>
                                    <ArrowRight size={11} className="transition-transform group-hover/cat:translate-x-0.5" />
                                  </Link>
                                  <span className="text-[10px] font-bold text-[#5A7A82] bg-[#EAF3F5] px-1.5 py-0.5 rounded">
                                    {SERVICE_CATEGORIES[3].services.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {SERVICE_CATEGORIES[3].services.map((svc) => {
                                    const ServiceIcon = svc.Icon;
                                    return (
                                      <Link
                                        key={svc.name}
                                        href={svc.path}
                                        onClick={closeMenus}
                                        className="group/item flex items-start gap-2.5 rounded-[8px] p-2 transition-all duration-150 hover:bg-[#EAF3F5]"
                                      >
                                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#E8E4DE] bg-white text-[#2D6E7A] transition-colors group-hover/item:border-[#2D6E7A]/40 group-hover/item:bg-[#2D6E7A] group-hover/item:text-white mt-0.5">
                                          <ServiceIcon size={14} strokeWidth={2.1} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <span className="block text-[12.5px] font-bold leading-snug text-[#1A3840] transition-colors group-hover/item:text-[#2D6E7A]">
                                            {svc.name}
                                          </span>
                                          <span className="block text-[11px] leading-tight text-[#5A7A82]">
                                            {svc.desc}
                                          </span>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E8E4DE]">
                                  <Link
                                    href={SERVICE_CATEGORIES[4].hubHref || "/services"}
                                    onClick={closeMenus}
                                    className="group/cat flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
                                  >
                                    <span>{SERVICE_CATEGORIES[4].label}</span>
                                    <ArrowRight size={11} className="transition-transform group-hover/cat:translate-x-0.5" />
                                  </Link>
                                  <span className="text-[10px] font-bold text-[#5A7A82] bg-[#EAF3F5] px-1.5 py-0.5 rounded">
                                    {SERVICE_CATEGORIES[4].services.length}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {SERVICE_CATEGORIES[4].services.map((svc) => {
                                    const ServiceIcon = svc.Icon;
                                    return (
                                      <Link
                                        key={svc.name}
                                        href={svc.path}
                                        onClick={closeMenus}
                                        className="group/item flex items-start gap-2.5 rounded-[8px] p-2 transition-all duration-150 hover:bg-[#EAF3F5]"
                                      >
                                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] border border-[#E8E4DE] bg-white text-[#2D6E7A] transition-colors group-hover/item:border-[#2D6E7A]/40 group-hover/item:bg-[#2D6E7A] group-hover/item:text-white mt-0.5">
                                          <ServiceIcon size={14} strokeWidth={2.1} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <span className="block text-[12.5px] font-bold leading-snug text-[#1A3840] transition-colors group-hover/item:text-[#2D6E7A]">
                                            {svc.name}
                                          </span>
                                          <span className="block text-[11px] leading-tight text-[#5A7A82]">
                                            {svc.desc}
                                          </span>
                                        </div>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ── Right sidebar: Featured Solutions + CTAs ── */}
                          <div className="flex flex-col border-l border-[#E8E4DE] bg-[#F7F5F1] p-5 justify-between">
                            <div>
                              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8E4DE]">
                                <span className="text-[10.5px] font-black uppercase tracking-[0.14em] text-[#C85A3C]">
                                  Featured Solutions
                                </span>
                                <span className="text-[10px] font-bold text-[#5A7A82]">
                                  Recommended
                                </span>
                              </div>

                              <ul className="space-y-2">
                                {FEATURED.map((f) => {
                                  const FeaturedIcon = f.Icon;
                                  return (
                                    <li key={f.name}>
                                      <Link
                                        href={f.path}
                                        onClick={closeMenus}
                                        className="group/feat flex items-start gap-2.5 rounded-[8px] border border-[#E8E4DE] bg-[#FEFCF9] p-2.5 transition-all duration-200 hover:border-[#2D6E7A]/40 hover:shadow-xs"
                                      >
                                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[6px] bg-[#EAF3F5] text-[#2D6E7A] group-hover/feat:bg-[#2D6E7A] group-hover/feat:text-white transition-colors mt-0.5">
                                          <FeaturedIcon size={14} strokeWidth={2.1} />
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <span className="block text-[12px] font-bold text-[#1A3840] group-hover/feat:text-[#2D6E7A] transition-colors">
                                              {f.name}
                                            </span>
                                            <span className={`flex-shrink-0 rounded-[4px] px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider ${f.badgeColor}`}>
                                              {f.badge}
                                            </span>
                                          </div>
                                          <p className="text-[10.5px] text-[#5A7A82] leading-tight">
                                            {f.desc}
                                          </p>
                                        </div>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>

                            {/* Divider & CTAs */}
                            <div className="border-t border-[#E8E4DE] pt-4 mt-5 space-y-2">
                              <Link
                                href="/contact"
                                onClick={closeMenus}
                                className="flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#C85A3C] hover:bg-[#B04D31] py-2.5 text-[12.5px] font-bold text-white shadow-sm transition-all duration-200"
                              >
                                Start a Project
                                <ArrowRight size={13} strokeWidth={2.2} />
                              </Link>
                              <Link
                                href="/pricing"
                                onClick={closeMenus}
                                className="flex w-full items-center justify-center gap-1.5 rounded-[6px] border border-[#2D6E7A] py-2 text-[12px] font-semibold text-[#2D6E7A] hover:bg-[#EAF3F5] transition-colors duration-200"
                              >
                                View Transparent Pricing
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
                    onBlur={(event) => closeMenuAfterBlur(event, idx)}
                  >
                    <button
                      id={`desktop-${item.name.toLowerCase()}-trigger`}
                      ref={setDesktopTriggerRef(`dropdown-${idx}`)}
                      type="button"
                      onClick={() => toggleDropdown(idx)}
                      aria-haspopup="true"
                      aria-expanded={openDropdown === idx}
                      aria-controls={`desktop-${item.name.toLowerCase()}-panel`}
                      aria-current={active ? "page" : undefined}
                      className={`group flex items-center gap-1.5 rounded-[6px] border-b-2 px-3.5 py-2 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40
                      ${
                        active || openDropdown === idx
                          ? "border-[#2D6E7A] text-[#2D6E7A] bg-[#EAF3F5]/70"
                          : "border-transparent text-[#1A3840] hover:text-[#2D6E7A] hover:bg-[#EAF3F5]/50"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        size={15}
                        strokeWidth={2.2}
                        className={`transition-transform duration-300 ${openDropdown === idx ? "rotate-180 text-[#2D6E7A]" : "text-[#5A7A82] group-hover:text-[#2D6E7A]"}`}
                      />
                    </button>

                    <div
                      id={`desktop-${item.name.toLowerCase()}-panel`}
                      className={`absolute top-[calc(100%+14px)] left-0 min-w-[220px]
                      transition-all duration-250 ease-[cubic-bezier(0.4,0,0.2,1)]
                      ${openDropdown === idx ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-3 pointer-events-none"}`}
                      aria-hidden={openDropdown !== idx}
                      aria-labelledby={`desktop-${item.name.toLowerCase()}-trigger`}
                      inert={openDropdown !== idx}
                    >
                      <div className="rounded-[12px] border border-[#E8E4DE] bg-[#FEFCF9] p-2 shadow-[0_16px_46px_rgba(26,56,64,0.12)]">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.path}
                            onClick={closeMenus}
                            className="block rounded-[6px] px-3.5 py-2.5 text-[13px] font-medium text-[#1A3840] transition-colors duration-150 hover:bg-[#EAF3F5] hover:text-[#2D6E7A]"
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
                    className={`flex items-center rounded-[6px] border-b-2 px-3.5 py-2 text-[14px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40
                      ${
                        active
                          ? "border-[#2D6E7A] text-[#2D6E7A] bg-[#EAF3F5]/70"
                          : "border-transparent text-[#1A3840] hover:text-[#2D6E7A] hover:bg-[#EAF3F5]/50"
                      }`}
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
          className="flex items-center gap-2 rounded-[6px] bg-[#C85A3C] hover:bg-[#B04D31] px-5 py-2.5 text-[13.5px] font-bold text-white shadow-sm transition-all duration-200 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40"
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
              ? "h-[62px] border-b border-[#E8E4DE] bg-[#FEFCF9]/98 backdrop-blur-xl shadow-xs"
              : "h-[68px] border-b border-[#E8E4DE]/80 bg-[#FEFCF9]/95 backdrop-blur-md"
          }`}
        role="banner"
      >
        <Link
          href="/"
          onClick={closeMobile}
          aria-label="Kraviona – Homepage"
          className="flex items-center"
        >
          <Image
            src="/full-logo.webp"
            alt="Kraviona – vision innovative development"
            width={135}
            height={44}
            priority
            sizes="135px"
            className="h-8 w-auto object-contain"
          />
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#EAF3F5] text-[#1A3840] border border-[#E8E4DE] transition-colors hover:bg-[#2D6E7A] hover:text-white focus-visible:outline-none"
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>
      </header>

      {/* ─────────────── MOBILE OVERLAY ──────────────────────────────── */}
      <div
        onClick={closeMobile}
        aria-hidden="true"
        className={`fixed inset-0 bg-[#1A3840]/40 backdrop-blur-[2px] z-[60] lg:hidden transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* ─────────────── MOBILE DRAWER ───────────────────────────────── */}
      <div
        id="mobile-nav"
        ref={mobileDialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className={`fixed top-0 right-0 h-full w-[88%] max-w-[370px] bg-[#FEFCF9] text-[#1A3840] z-[70] lg:hidden flex flex-col
          shadow-[-16px_0_48px_rgba(26,56,64,0.18)] border-l border-[#E8E4DE]
          transition-transform duration-350 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer header */}
        <div className="flex h-[70px] items-center justify-between border-b border-[#E8E4DE] bg-[#F7F5F1] px-5">
          <Link
            href="/"
            onClick={closeMobile}
            className="flex items-center"
          >
            <Image
              src="/full-logo.webp"
              alt="Kraviona – vision innovative development"
              width={130}
              height={42}
              sizes="130px"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            className="flex h-10 w-10 items-center justify-center rounded-[6px] text-[#1A3840] bg-white border border-[#E8E4DE] transition-colors hover:bg-[#EAF3F5]"
            aria-label="Close navigation"
          >
            <X size={19} strokeWidth={2.2} />
          </button>
        </div>

        {/* Drawer nav */}
        <nav
          className="flex-1 overflow-y-auto py-3 px-3"
          aria-label="Mobile navigation"
        >
          <ul className="space-y-1">
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
              onToggle={() => {
                router.prefetch("/services");
                setMobileAcc(mobileAcc === "services" ? null : "services");
              }}
            >
              <Link
                href="/services"
                onClick={closeMobile}
                className="flex items-center justify-between border-b border-[#E8E4DE] px-4 py-3 text-[13px] font-bold text-[#2D6E7A] bg-[#EAF3F5]/50 transition-colors hover:bg-[#EAF3F5]"
              >
                View All Services <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
              {SERVICE_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="border-b border-[#E8E4DE] last:border-0"
                >
                  <p
                    className="px-4 pt-3.5 pb-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#5A7A82]"
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
                        className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#1A3840] transition-colors hover:bg-[#EAF3F5] hover:text-[#2D6E7A]"
                      >
                        <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[#E8E4DE] bg-white text-[#2D6E7A]">
                          <ServiceIcon size={14} strokeWidth={2.1} />
                        </span>
                        <span className="min-w-0">{svc.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </MobileAccordion>

            <MobileLink
              href="/case-studies"
              active={pathname.startsWith("/case-studies")}
              onClick={closeMobile}
            >
              Case Studies
            </MobileLink>

            {/* Blog accordion */}
            <MobileAccordion
              label="Blog"
              open={mobileAcc === "blog"}
              onToggle={() => {
                router.prefetch("/blog");
                setMobileAcc(mobileAcc === "blog" ? null : "blog");
              }}
            >
              {SIMPLE_MENUS.Blog.map((s) => (
                <Link
                  key={s.name}
                  href={s.path}
                  onClick={closeMobile}
                  className="block border-b border-[#E8E4DE] px-4 py-3 text-[13px] font-medium text-[#1A3840] transition-colors hover:bg-[#EAF3F5] hover:text-[#2D6E7A] last:border-0"
                >
                  {s.name}
                </Link>
              ))}
            </MobileAccordion>

            <MobileLink
              href="/news"
              active={pathname.startsWith("/news")}
              onClick={closeMobile}
            >
              News
            </MobileLink>

            {/* Company accordion */}
            <MobileAccordion
              label="Company"
              open={mobileAcc === "company"}
              onToggle={() => {
                router.prefetch("/about");
                setMobileAcc(mobileAcc === "company" ? null : "company");
              }}
            >
              {SIMPLE_MENUS.Company.map((s) => (
                <Link
                  key={s.name}
                  href={s.path}
                  onClick={closeMobile}
                  className="block border-b border-[#E8E4DE] px-4 py-3 text-[13px] font-medium text-[#1A3840] transition-colors hover:bg-[#EAF3F5] hover:text-[#2D6E7A] last:border-0"
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
        <div className="flex-shrink-0 space-y-2.5 border-t border-[#E8E4DE] bg-[#F7F5F1] p-4">
          <Link
            href="/contact"
            onClick={closeMobile}
            className="flex w-full items-center justify-center gap-2 rounded-[6px] bg-[#C85A3C] hover:bg-[#B04D31] py-3.5 text-[13.5px] font-bold text-white shadow-sm transition-all"
          >
            Start Project <ArrowRight size={15} strokeWidth={2.2} />
          </Link>
          <a
            href="tel:+919608553167"
            onClick={closeMobile}
            className="flex w-full items-center justify-center gap-2 rounded-[6px] border border-[#2D6E7A] bg-white py-3 text-[13.5px] font-semibold text-[#2D6E7A] transition-colors hover:bg-[#EAF3F5]"
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
        className={`block rounded-[6px] px-4 py-3 text-[14px] font-semibold transition-colors
          ${active ? "bg-[#EAF3F5] text-[#2D6E7A]" : "text-[#1A3840] hover:bg-[#EAF3F5] hover:text-[#2D6E7A]"}`}
      >
        {children}
      </Link>
    </li>
  );
}

function MobileAccordion({ label, open, onToggle, children }) {
  const panelId = `mobile-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-panel`;

  return (
    <li className="overflow-hidden rounded-[6px]">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-[14px] font-semibold text-[#1A3840] transition-colors hover:bg-[#EAF3F5] hover:text-[#2D6E7A]"
        aria-expanded={open}
        aria-controls={panelId}
      >
        {label}
        <ChevronDown
          size={16}
          strokeWidth={2.2}
          className={`transition-transform duration-200 text-[#5A7A82] ${open ? "rotate-180 text-[#2D6E7A]" : ""}`}
        />
      </button>

      <div
        id={panelId}
        aria-hidden={!open}
        inert={!open}
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="mx-1 mb-2 overflow-hidden rounded-[8px] border border-[#E8E4DE] bg-[#F7F5F1]">
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}
