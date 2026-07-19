"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome, FiLayers, FiGrid, FiBriefcase, FiDollarSign,
  FiUsers, FiMessageSquare, FiLogOut, FiMail, FiInbox,
  FiEdit3, FiLayout, FiCpu, FiHelpCircle, FiLink, FiSearch,
  FiInfo, FiStar, FiImage, FiBell, FiTag, FiSettings,
  FiClipboard, FiRadio, FiUserCheck, FiPhone, FiMap,
  FiGlobe, FiFileText, FiShield, FiToggleLeft, FiChevronDown, FiChevronRight,
  FiZap, FiTrendingUp, FiBook, FiAward, FiBarChart2,
  FiPackage, FiDatabase, FiCloud, FiCode, FiMonitor,
  FiRepeat, FiAlertCircle, FiCheckSquare, FiSliders
} from "react-icons/fi";

const SB = {
  root: {
    width: 256, minWidth: 256, maxWidth: 256,
    height: "100vh", backgroundColor: "#235056",
    display: "flex", flexDirection: "column",
    flexShrink: 0, overflow: "hidden",
    fontFamily: "inherit",
  },
  logo: {
    padding: "14px 16px", display: "flex", alignItems: "center",
    gap: 10, borderBottom: "1px solid rgba(255,255,255,0.1)",
    flexShrink: 0,
  },
  logoImg: {
    width: 32, height: 32, objectFit: "contain",
    backgroundColor: "white", borderRadius: 6, padding: 4, flexShrink: 0,
  },
  logoText: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.18em",
    textTransform: "uppercase", color: "#f2c695",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  scroll: {
    flex: 1, overflowY: "auto", overflowX: "hidden",
    padding: "10px 10px 80px", minHeight: 0,
    scrollbarWidth: "none", msOverflowStyle: "none",
  },
  groupWrap: { marginBottom: 6 },
  divider: { borderTop: "1px solid rgba(255,255,255,0.08)", margin: "6px 0 8px" },
  groupHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 8px", marginBottom: 4, cursor: "default",
  },
  groupHeaderClickable: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 8px", marginBottom: 4, cursor: "pointer", userSelect: "none",
  },
  groupTitle: {
    fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
    textTransform: "uppercase", color: "#f2c695", opacity: 0.65, margin: 0,
  },
  chevron: { color: "#f2c695", opacity: 0.5, display: "flex" },
  itemsWrap: { display: "flex", flexDirection: "column", gap: 1 },
  item: (active) => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "5px 10px", borderRadius: 7,
    backgroundColor: active ? "#d26c51" : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.72)",
    textDecoration: "none", transition: "background 0.12s, color 0.12s",
    cursor: "pointer",
  }),
  itemIcon: { fontSize: 13, flexShrink: 0, display: "flex", lineHeight: 1 },
  itemLabel: {
    fontSize: 12, letterSpacing: "0.01em", flex: 1,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    lineHeight: 1.4,
  },
  badge: {
    fontSize: 8, padding: "1px 5px", borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)",
    flexShrink: 0,
  },
  footer: {
    padding: 10, borderTop: "1px solid rgba(255,255,255,0.1)",
    flexShrink: 0, backgroundColor: "#1a3d42",
  },
  logoutBtn: {
    width: "100%", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 6, padding: "7px 16px",
    borderRadius: 7, border: "none", cursor: "pointer",
    backgroundColor: "rgba(239,68,68,0.75)", color: "white",
    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", transition: "background 0.15s",
  },
};

export default function Sidebar({ onLogout }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState({});
  const [hoveredPath, setHoveredPath] = useState(null);

  const isActive = useCallback((path) => {
    if (!pathname) return false;
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname === path || pathname.startsWith(path + "/");
  }, [pathname]);

  const menuGroups = useMemo(() => [
    { title: 'Main', items: [
      { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> }
    ]},
    { title: 'Blog Engine', items: [
      { name: 'Manage Posts',  path: '/blog',          icon: <FiEdit3 />,         badge: 'existing' },
      { name: 'Categories',    path: '/category',    icon: <FiTag />,           badge: 'existing' },
      { name: 'Comments',      path: '/comments',      icon: <FiMessageSquare />, badge: 'existing' },
      { name: 'Content Decay', path: '/content-decay', icon: <FiAlertCircle />,   badge: 'existing' },
    ]},
    { title: 'Core Business', items: [
      { name: 'Services',      path: '/services',   icon: <FiLayers /> },
      { name: 'Pricing Plans', path: '/pricing',    icon: <FiDollarSign /> },
      { name: 'Tech Stack',    path: '/tech-stack', icon: <FiCpu /> },
    ]},
    { title: 'Our Work', items: [
      { name: 'Portfolio / Gallery', path: '/portfolio',    icon: <FiGrid /> },
      { name: 'Case Studies',        path: '/case-studies', icon: <FiBriefcase /> },
      { name: 'Testimonials',        path: '/testimonials', icon: <FiStar />, badge: 'existing' },
    ]},
    { title: 'Company & Team', items: [
      { name: 'Team Members',   path: '/team',  icon: <FiUsers />,     badge: 'existing' },
      { name: 'Users & Admins', path: '/users', icon: <FiUserCheck />, badge: 'existing' },
    ]},
    { title: 'Sales & Audience', items: [
      { name: 'Contact Leads',   path: '/leads',         icon: <FiInbox />,         badge: 'existing' },
      { name: 'Messages',        path: '/messages',      icon: <FiMessageSquare />, badge: 'existing' },
      { name: 'Newsletter Subs', path: '/newsletters',   icon: <FiMail />,          badge: 'existing' },
      { name: 'Campaigns',       path: '/campaigns',     icon: <FiRadio />,         badge: 'existing' },
    ]},
    { title: 'Media & Notifications', items: [
      { name: 'Media Library', path: '/media',         icon: <FiImage />, badge: 'existing' },
      { name: 'Notifications', path: '/notifications', icon: <FiBell />,  badge: 'existing' },
    ]},
    { title: 'Home Page Settings', collapsible: true, items: [
      { name: 'Hero Section',         path: '/home/hero',         icon: <FiMonitor /> },
      { name: 'Stats Bar',            path: '/home/stats',        icon: <FiBarChart2 /> },
      { name: 'Services Showcase',    path: '/home/services',     icon: <FiLayers /> },
      { name: 'Why Kraviona Section', path: '/home/why-us',       icon: <FiCheckSquare /> },
      { name: 'Who We Are Section',   path: '/home/who-we-are',   icon: <FiInfo /> },
      { name: 'Tech Stack Section',   path: '/home/tech-stack',   icon: <FiCpu /> },
      { name: 'Home FAQs',            path: '/home/faqs',         icon: <FiHelpCircle /> },
      { name: 'Latest Posts Section', path: '/home/blog-section', icon: <FiEdit3 /> },
      { name: 'CTA / Consultation',   path: '/home/cta',          icon: <FiZap /> },
      { name: 'Testimonials Section', path: '/home/testimonials', icon: <FiStar /> },
      { name: 'Newsletter Section',   path: '/home/newsletter',   icon: <FiMail /> },
    ]},
    { title: 'Services Page Settings', collapsible: true, items: [
      { name: 'Page Hero',               path: '/services-page/hero',         icon: <FiMonitor /> },
      { name: 'Kraviona Edge Cards',     path: '/services-page/edge-cards',   icon: <FiZap /> },
      { name: 'All 11 Services CRUD',    path: '/services-page/crud',         icon: <FiLayers /> },
      { name: 'Services Nav Dropdown',   path: '/services-page/nav-config',   icon: <FiSliders /> },
      { name: 'Service Page FAQs',       path: '/services-page/faqs',         icon: <FiHelpCircle /> },
      { name: 'Contact Form (Services)', path: '/services-page/contact-form', icon: <FiPhone /> },
    ]},
    { title: 'About Page Settings', collapsible: true, items: [
      { name: 'Hero & Tagline',    path: '/about/hero',   icon: <FiMonitor /> },
      { name: 'Company Story',     path: '/about/story',  icon: <FiBook /> },
      { name: 'Story Quote',       path: '/about/quote',  icon: <FiFileText /> },
      { name: 'About Stats',       path: '/about/stats',  icon: <FiBarChart2 /> },
      { name: 'Core Values',       path: '/about/values', icon: <FiAward /> },
      { name: 'Team Section',      path: '/about/team',   icon: <FiUsers />, badge: 'existing' },
      { name: 'About CTA Section', path: '/about/cta',    icon: <FiZap /> },
    ]},
    { title: 'Gallery Page Settings', collapsible: true, items: [
      { name: 'Page Hero',            path: '/gallery/hero',         icon: <FiMonitor /> },
      { name: 'Projects CRUD',        path: '/gallery/projects',     icon: <FiGrid /> },
      { name: 'Filter Categories',    path: '/gallery/filters',      icon: <FiSliders /> },
      { name: 'Featured Projects',    path: '/gallery/featured',     icon: <FiStar /> },
      { name: 'Gallery Testimonials', path: '/gallery/testimonials', icon: <FiMessageSquare /> },
    ]},
    { title: 'Case Studies Settings', collapsible: true, items: [
      { name: 'Page Hero',          path: '/case-studies/hero',       icon: <FiMonitor /> },
      { name: 'Case Studies CRUD',  path: '/case-studies/crud',       icon: <FiBriefcase /> },
      { name: 'Coming Soon Toggle', path: '/case-studies/visibility', icon: <FiToggleLeft /> },
      { name: 'Notify Me Form',     path: '/case-studies/notify',     icon: <FiBell /> },
    ]},
    { title: 'Pricing Page Settings', collapsible: true, items: [
      { name: 'Page Hero',            path: '/pricing-page/hero',       icon: <FiMonitor /> },
      { name: 'Pricing Plans CRUD',   path: '/pricing-page/plans',      icon: <FiDollarSign /> },
      { name: 'Coming Soon Toggle',   path: '/pricing-page/visibility', icon: <FiToggleLeft /> },
      { name: 'Billing Toggle Config',path: '/pricing-page/billing',    icon: <FiRepeat /> },
      { name: 'Pricing Disclaimer',   path: '/pricing-page/disclaimer', icon: <FiFileText /> },
      { name: 'Pricing FAQs',         path: '/pricing-page/faqs',       icon: <FiHelpCircle /> },
    ]},
    { title: 'Contact Page Settings', collapsible: true, items: [
      { name: 'Page Hero',          path: '/contact/hero',         icon: <FiMonitor /> },
      { name: 'Contact Info',       path: '/contact/info',         icon: <FiPhone /> },
      { name: 'Office Address',     path: '/contact/address',      icon: <FiMap /> },
      { name: 'Contact Form Config',path: '/contact/form-config',  icon: <FiFileText /> },
      { name: 'All Submissions',    path: '/contact/submissions',  icon: <FiInbox />, badge: 'existing' },
      { name: 'Auto-Reply Email',   path: '/contact/auto-reply',   icon: <FiMail /> },
    ]},
    { title: 'Blog Listing Page', collapsible: true, items: [
      { name: 'Page Hero',              path: '/blog-page/hero',       icon: <FiMonitor /> },
      { name: 'Blog Categories Config', path: '/blog-page/categories', icon: <FiTag />, badge: 'existing' },
      { name: 'Featured Post Picker',   path: '/blog-page/featured',   icon: <FiStar /> },
      { name: 'Posts Per Page',         path: '/blog-page/pagination', icon: <FiSliders /> },
    ]},
    { title: 'Individual Service Pages', collapsible: true, items: [
      { name: 'MERN Stack Page',    path: '/service-pages/mern-stack-development',       icon: <FiCode /> },
      { name: 'Full-Stack Page',    path: '/service-pages/full-stack-development',       icon: <FiCode /> },
      { name: 'React.js Page',      path: '/service-pages/react-development',            icon: <FiCode /> },
      { name: 'Node.js Page',       path: '/service-pages/nodejs-development',           icon: <FiCode /> },
      { name: 'Backend Dev Page',   path: '/service-pages/backend-development',          icon: <FiCloud /> },
      { name: 'API Dev Page',       path: '/service-pages/api-development',              icon: <FiCloud /> },
      { name: 'Database Arch Page', path: '/service-pages/database-architecture',        icon: <FiDatabase /> },
      { name: 'SaaS Dev Page',      path: '/service-pages/saas-development',             icon: <FiPackage /> },
      { name: 'Technical SEO Page', path: '/service-pages/technical-seo',                icon: <FiTrendingUp /> },
      { name: 'Web Performance Page',path: '/service-pages/web-performance-optimization',icon: <FiZap /> },
      { name: 'AI Automation Page', path: '/service-pages/ai-automation',                icon: <FiCpu /> },
    ]},
    { title: 'Global Site Settings', collapsible: true, items: [
      { name: 'Site Name & Tagline',    path: '/global/brand',        icon: <FiGlobe /> },
      { name: 'Phone & Email',          path: '/global/contact-info', icon: <FiPhone /> },
      { name: 'Office Address',         path: '/global/address',      icon: <FiMap /> },
      { name: 'Social Links',           path: '/global/socials',      icon: <FiLink /> },
      { name: 'Footer Config',          path: '/global/footer',       icon: <FiLayout /> },
      { name: 'Navigation Config',      path: '/global/nav',          icon: <FiSliders /> },
      { name: 'Newsletter Section',     path: '/global/newsletter',   icon: <FiMail /> },
      { name: 'Google Analytics / GTM', path: '/global/analytics',    icon: <FiBarChart2 /> },
      { name: 'Maintenance Mode',       path: '/global/maintenance',  icon: <FiToggleLeft /> },
    ]},
    { title: 'SEO & Meta', collapsible: true, items: [
      { name: 'Default Meta Tags',  path: '/seo/defaults',     icon: <FiSearch /> },
      { name: 'OG Image Default',   path: '/seo/og-image',     icon: <FiImage /> },
      { name: 'Robots.txt Editor',  path: '/seo/robots',       icon: <FiFileText /> },
      { name: 'Schema / JSON-LD',   path: '/seo/schema',       icon: <FiCode /> },
      { name: 'Sitemap Settings',   path: '/seo/sitemap',      icon: <FiGlobe /> },
      { name: 'Google Verification',path: '/seo/verification', icon: <FiCheckSquare /> },
      { name: 'Canonical Rules',    path: '/seo/canonicals',   icon: <FiLink /> },
      { name: 'No-Index Pages',     path: '/seo/noindex',      icon: <FiShield /> },
    ]},
    { title: 'Logs & Security', items: [
      { name: 'Audit Logs', path: '/audit-logs', icon: <FiClipboard />, badge: 'existing' },
      { name: 'Settings',   path: '/settings',   icon: <FiSettings />,  badge: 'existing' },
    ]},
  ], []);

  useEffect(() => {
    if (!pathname) return;
    const timeout = setTimeout(() => {
      setCollapsed((prev) => {
        const next = { ...prev };
        for (const g of menuGroups) {
          if (!g.collapsible) continue;
          const containsActive = g.items.some((i) => isActive(i.path));
          if (containsActive) next[g.title] = false;
        }
        return next;
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [pathname, menuGroups, isActive]);

  const toggle = (title) =>
    setCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));

  return (
    <div style={SB.root}>
      {/* webkit scrollbar hide */}
      <style>{`.__sb_scroll::-webkit-scrollbar{display:none} .__sb_item:hover{background:rgba(255,255,255,0.07)!important;color:white!important}`}</style>

      {/* Logo */}
      <div style={SB.logo}>
        <img
          src="https://kraviona.com/_next/image?url=%2Flogo.png&w=48&q=75"
          alt="Kraviona Logo"
          style={SB.logoImg}
        />
        <span style={SB.logoText}>Kraviona Admin</span>
      </div>

      {/* Scroll area */}
      <div className="__sb_scroll" style={SB.scroll}>
        {menuGroups.map((group) => {
          const isCollapsible = group.collapsible;
          const isOpen = !isCollapsible || !collapsed[group.title];

          return (
            <div key={group.title} style={SB.groupWrap}>
              <div style={SB.divider} />

              <div
                style={isCollapsible ? SB.groupHeaderClickable : SB.groupHeader}
                onClick={() => isCollapsible && toggle(group.title)}
              >
                <p style={SB.groupTitle}>{group.title}</p>
                {isCollapsible && (
                  <span style={SB.chevron}>
                    {isOpen ? <FiChevronDown size={10} /> : <FiChevronRight size={10} />}
                  </span>
                )}
              </div>

              {isOpen && (
                <div style={SB.itemsWrap}>
                  {group.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className="__sb_item"
                        style={SB.item(active)}
                      >
                        <span style={SB.itemIcon}>{item.icon}</span>
                        <span style={SB.itemLabel}>{item.name}</span>
                        {item.badge === 'existing' && (
                          <span style={SB.badge}>✓</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={SB.footer}>
        <button
          onClick={onLogout}
          style={SB.logoutBtn}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgb(239,68,68)"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.75)"}
        >
          <FiLogOut size={13} />
          Logout
        </button>
      </div>
    </div>
  );
}
