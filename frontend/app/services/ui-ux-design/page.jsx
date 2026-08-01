import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { JsonLd } from "@/components/JsonLd";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";
import { staticServiceMetadata, staticServiceSchemas } from "../serviceSeo.js";

const PAGE_URL = canonicalUrl("/services/ui-ux-design");

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://kraviona.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services",
      item: "https://kraviona.com/services",
    },
    { "@type": "ListItem", position: 3, name: "UI/UX Design", item: PAGE_URL },
  ],
};

const pageSchemas = staticServiceSchemas(
  "ui-ux-design",
  null,
  breadcrumbSchema,
);

export const metadata = {
  title: "UI/UX Design Services India | Kraviona",
  description:
    "Kraviona offers professional UI/UX design services — conversion-optimised, mobile-first web designs that deliver exceptional user experience. Get a free quote.",
  keywords: [
    "UI UX Design Services India",
    "Web Design Company India",
    "UX Design Company India",
    "Mobile UI Design",
    "Conversion Optimised Design",
    "Web Design Delhi",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "UI/UX Design Services India | Kraviona",
    description:
      "Conversion-optimised, mobile-first UI/UX design that elevates your brand and delights users.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UI/UX Design Services by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "UI/UX Design Services India | Kraviona",
    description:
      "Conversion-optimised, mobile-first UI/UX design that elevates your brand and delights users.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
  ...staticServiceMetadata("ui-ux-design"),
};

export default function UIUXDesignPage() {
  return (
    <>
      <JsonLd data={pageSchemas} />
      <section className="relative py-28 bg-gradient-to-br from-[#1A2E33] via-[#2A4A52] to-[#1A2E33] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav
            className="flex items-center gap-2 text-sm text-gray-400 mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="hover:text-white">
              Services
            </Link>
            <span>/</span>
            <span className="text-[#F28C5E]">UI/UX Design</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            UI/UX{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C5E] to-[#E8622A]">
              Design Services
            </span>{" "}
            India
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            We design stunning, conversion-optimised digital interfaces that
            combine aesthetics with intuitive user experience. Every design
            decision is rooted in user psychology and data — not guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E8622A] text-white font-bold rounded-xl hover:bg-[#B84A1A] transition-all"
            >
              Start Design Project
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/20 font-bold rounded-xl hover:border-[#F28C5E] transition-all"
            >
              All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E33] mb-8">
            Our UI/UX Design Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                n: "User Research & Personas",
                d: "Understanding your target audience, pain points, and goals through research and user interviews.",
              },
              {
                n: "Wireframing & Prototyping",
                d: "Low and high-fidelity wireframes in Figma with interactive prototypes for stakeholder review.",
              },
              {
                n: "Visual Design (UI)",
                d: "Pixel-perfect UI design with consistent design systems, typography, and colour palettes.",
              },
              {
                n: "Mobile-First & Responsive",
                d: "Designs optimised for all devices — mobile, tablet, and desktop — from the ground up.",
              },
              {
                n: "Conversion Rate Optimisation",
                d: "Strategic CTA placement, A/B testing, and UX improvements to maximise conversions.",
              },
              {
                n: "Handoff & Developer Support",
                d: "Detailed design specs, asset exports, and developer collaboration during implementation.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-7 bg-[#F5F7F8] border border-gray-200 rounded-2xl hover:border-[#E8622A]/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#E8622A]/10 flex items-center justify-center mb-4">
                  <span className="text-[#E8622A] font-black text-sm">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#1A2E33] mb-2">{s.n}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#F5F7F8] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#1A2E33] mb-5">
            Related Services
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              {
                name: "MERN Stack Development",
                href: "/services/mern-stack-development",
              },
              {
                name: "Web App Development",
                href: "/services/web-app-development",
              },
              { name: "Technical SEO", href: "/services/technical-seo" },
              { name: "All Services", href: "/services" },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-5 py-2.5 border border-[#2A4A52]/30 text-[#2A4A52] rounded-full font-semibold text-sm hover:bg-[#2A4A52] hover:text-white transition-all"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ContactFormDetails />
    </>
  );
}
