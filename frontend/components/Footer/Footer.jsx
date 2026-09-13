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
} from "lucide-react";
import { SERVICE_LINKS } from "@/app/services/serviceData";
import { SOCIAL_LINKS } from "@/lib/social";

const NAV = {
  company: [
    { name: "About Us", path: "/about" },
    { name: "Careers", path: "/careers" },
    { name: "Case Studies", path: "/case-studies" },
    { name: "Blog", path: "/blog" },
    { name: "News", path: "/news" },
    { name: "Portfolio", path: "/gallery" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Sitemap", path: "/sitemap.xml" },
    { name: "AI Index", path: "/llms.txt" },
    { name: "Robots.txt", path: "/robots.txt" },
  ],
};

// Keep every service one click away from the footer. This is intentionally
// derived from the canonical service catalogue so new entries cannot become
// orphaned when the navigation changes.
const serviceColumns = [
  SERVICE_LINKS.slice(0, Math.ceil(SERVICE_LINKS.length / 2)),
  SERVICE_LINKS.slice(Math.ceil(SERVICE_LINKS.length / 2)),
];

const CONTACT = [
  {
    label: "Email",
    value: SOCIAL_LINKS.email,
    href: `mailto:${SOCIAL_LINKS.email}`,
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 96085 53167",
    href: `tel:${SOCIAL_LINKS.phone}`,
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
    href: SOCIAL_LINKS.whatsapp,
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
    href: SOCIAL_LINKS.linkedin,
    icon: Linkedin,
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    icon: Facebook,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#1A3840] font-sans">
      <div
        className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] opacity-[0.035] [background-size:26px_26px]"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-14">
        {/* Top CTA */}
        <div className="mb-12 rounded-[12px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D4A550]">
                Build with Kraviona
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Need a faster website, stronger SEO, or cleaner backend?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
                Talk directly with a founder-led team for MERN stack products,
                Next.js websites, Node.js APIs, technical SEO, AI automation,
                and practical launch support.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-[#C85A3C] hover:bg-[#B04D31] px-6 py-3.5 text-sm font-semibold text-white shadow-brand-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1fr_1.25fr] gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="Kraviona homepage"
              className="mb-6 inline-flex items-center"
            >
              <Image
                src="/full-logo-light.webp"
                alt="Kraviona – vision innovative development"
                width={190}
                height={65}
                sizes="190px"
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/75">
              Founder-led web development, backend engineering, technical SEO,
              AI automation, and digital growth support for businesses that need
              practical execution.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["MERN", "Next.js", "SEO", "AI"].map((item) => (
                <span
                  key={item}
                  className="rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-white/75"
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
                    className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-white/75 transition-colors hover:border-[#2D6E7A] hover:bg-[#2D6E7A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <FooterLinks title="Company" links={NAV.company} />
          <FooterLinks title="Services" links={serviceColumns[0]} />
          <FooterLinks title="More Services" links={serviceColumns[1]} />

          <div>
            <p className="text-white text-sm font-semibold mb-4">
              Contact Details
            </p>
            <div className="space-y-3.5">
              {CONTACT.map(({ label, value, href, icon }) => {
                const Icon = icon;
                return (
                  <div key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-[#D4A550]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4A550]">
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noreferrer" : undefined}
                          className="inline-flex min-h-11 items-center text-sm font-medium text-white/80 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="inline-flex min-h-11 items-center text-sm font-medium text-white/80">
                          {value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-[12px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4A550]">
                Availability
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Monday to Saturday, 9:00 AM - 7:00 PM IST. Usually replies
                within 1 business day.
              </p>
            </div>
          </div>
        </div>

        {/* Legal links */}
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-b border-white/10 py-5">
          {NAV.legal.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              className="inline-flex min-h-11 items-center text-[12px] font-medium text-white/70 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5">
          <p className="text-center text-white/50 text-[12px]">
            © {new Date().getFullYear()} Kraviona Tech Solutions. All Rights
            Reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {BOTTOM_LEGAL.map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className="inline-flex min-h-11 items-center text-white/50 hover:text-[#D4A550] text-[12px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
      <p className="text-white text-sm font-semibold mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => {
          const path = l.path || l.href;

          return (
          <li key={path}>
            <Link
              href={path}
              className="group inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-white/75 transition-colors duration-150 hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span>{l.name}</span>
              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#D4A550]" />
            </Link>
          </li>
          );
        })}
      </ul>
    </div>
  );
}
