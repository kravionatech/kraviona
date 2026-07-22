"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";

const NAV = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Portfolio", path: "/gallery" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ],
  capabilities: [
    { name: "MERN Stack Dev", path: "/services/mern-stack-development" },
    { name: "Technical SEO", path: "/services/technical-seo" },
    { name: "AI Automation", path: "/services/ai-automation" },
    { name: "Digital Marketing", path: "/services/digital-marketing" },
    { name: "Account Management", path: "/services/account-management" },
    { name: "Seller Training", path: "/services/seller-training" },
  ],
  development: [
    { name: "React.js Dev", path: "/services/react-development" },
    { name: "Node.js Backend", path: "/services/nodejs-development" },
    { name: "Web App Dev", path: "/services/web-app-development" },
    { name: "UI/UX Design", path: "/services/ui-ux-design" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Sitemap", path: "/sitemap.xml" },
    { name: "AI Index", path: "/llms.txt" },
    { name: "Robots.txt", path: "/robots.txt" },
  ],
};

const CONTACT = [
  {
    label: "Email",
    value: "kravionatech@gmail.com",
    href: "mailto:kravionatech@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 96085 53167",
    href: "tel:+919608553167",
    icon: Phone,
  },
  {
    label: "Location",
    value: "East Delhi, India 110092",
    href: null,
    icon: MapPin,
  },
  {
    label: "WhatsApp",
    value: "Message us",
    href: "https://wa.me/919608553167",
    icon: MessageCircle,
  },
];

const BOTTOM_LEGAL = [
  { name: "Terms of Service", path: "/terms" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Sitemap", path: "/sitemap.xml" },
];

const SOCIALS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/kravionai",
    icon: Linkedin,
  },
  { name: "Twitter", href: "https://twitter.com/KravionaTech", icon: Twitter },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61570716181916",
    icon: Facebook,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#071213] border-t border-white/[0.08] font-sans">
      <div
        className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#f4be78_1px,transparent_1px)] [background-size:26px_26px]"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-14">
        {/* Top CTA */}
        <div className="mb-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#f4be78]">
                Build with Kraviona
              </p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Need a faster website, stronger SEO, or cleaner backend?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9fb6b7]">
                Talk directly with a founder-led team for MERN stack products,
                Next.js websites, Node.js APIs, technical SEO, AI automation,
                and practical launch support.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d96c4e] px-6 py-3.5 text-sm font-black text-white shadow-sm transition-colors hover:bg-[#c25e41]"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1fr_1.25fr] gap-10 pb-10 border-b border-white/[0.08]">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Kraviona homepage"
              className="mb-5 inline-flex items-center gap-3"
            >
              <span className="flex h-13 w-13 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-sm">
                <Image
                  src="/logo.png"
                  alt="Kraviona logo"
                  width={48}
                  height={44}
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
            <p className="max-w-sm text-sm leading-relaxed text-[#9fb6b7]">
              Founder-led web development, backend engineering, technical SEO,
              AI automation, and digital growth support for businesses that need
              practical execution.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["MERN", "Next.js", "SEO", "AI"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold text-[#c4d4d5]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#c4d4d5] transition-colors hover:border-[#d96c4e]/60 hover:bg-[#d96c4e] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterLinks title="Company" links={NAV.company} />
          <FooterLinks title="Capabilities" links={NAV.capabilities} />
          <FooterLinks title="Development" links={NAV.development} />

          <div>
            <p className="text-white text-sm font-black mb-4">
              Contact Details
            </p>
            <div className="space-y-3.5">
              {CONTACT.map(({ label, value, href, icon }) => {
                const Icon = icon;
                return (
                  <div key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[#f4be78]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#6f8f90]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noreferrer" : undefined}
                          className="text-sm font-semibold text-[#c4d4d5] transition-colors hover:text-[#f4be78]"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-[#c4d4d5]">
                          {value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f4be78]">
                Availability
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#9fb6b7]">
                Monday to Saturday, 9:00 AM - 7:00 PM IST. Usually replies
                within 1 business day.
              </p>
            </div>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-white/[0.08] py-5">
          {NAV.legal.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              className="text-[12px] font-semibold text-[#8ba5a6] transition-colors hover:text-[#f4be78]"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <p className="text-center text-[#8ba5a6] text-[12px]">
            © {new Date().getFullYear()} Kraviona Tech Solutions. All Rights
            Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {BOTTOM_LEGAL.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className="text-[#8ba5a6] hover:text-[#e8f2f2] text-[12px] transition-colors duration-150"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <p className="text-white text-sm font-black mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.path}>
            <Link
              href={l.path}
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#8ba5a6] transition-colors duration-150 hover:text-[#f4be78]"
            >
              <span>{l.name}</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
