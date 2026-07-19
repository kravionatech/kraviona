import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/web-performance-optimization");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Web Performance Optimization",
  description:
    "Comprehensive web performance optimization achieving Lighthouse 90+ scores. Core Web Vitals, page speed, and user experience optimization.",
  provider: { "@id": "https://kraviona.com/#organization" },
  url: PAGE_URL,
  areaServed: [{ "@type": "Country", name: "India" }],
};

export const metadata = {
  title: "Web Performance Optimization Services | Lighthouse 90+ | Kraviona",
  description:
    "Optimize your website for maximum performance. Kraviona delivers Core Web Vitals improvements, page speed optimization, and Lighthouse 90+ scores for better rankings and user experience.",
  keywords: [
    "Web Performance Optimization",
    "Page Speed Optimization",
    "Core Web Vitals",
    "Lighthouse Optimization",
    "Site Speed Improvement",
    "Performance Tuning",
    "Front-End Performance",
    "Website Optimization",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Web Performance Optimization | Lighthouse 90+ | Kraviona",
    description:
      "Achieve Lighthouse 90+ and master Core Web Vitals. Fast, optimized websites that rank higher and convert better.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "Web Performance Optimization by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    title: "Web Performance Optimization | Kraviona",
    description:
      "Core Web Vitals, page speed, Lighthouse 90+ optimization for better rankings and UX.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function WebPerformanceOptPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="relative py-28 bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Web Performance{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Optimization
            </span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Lightning-fast websites that rank higher, convert better, and
            provide exceptional user experience. Achieve Lighthouse 90+ and
            master Core Web Vitals.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
          >
            Speed Audit & Plan
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-12">
            Performance Optimization Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Core Web Vitals",
                desc: "LCP, FID/INP, and CLS optimization for Google's key performance metrics.",
              },
              {
                title: "Image Optimization",
                desc: "WebP conversion, responsive images, lazy loading, and CDN delivery.",
              },
              {
                title: "Code Splitting",
                desc: "JavaScript and CSS optimization, async/defer attributes, and bundle reduction.",
              },
              {
                title: "Caching Strategy",
                desc: "Browser caching, server-side caching, and CDN configuration.",
              },
              {
                title: "Font Optimization",
                desc: "Font loading strategy, subsetting, and fallback fonts.",
              },
              {
                title: "Render Performance",
                desc: "Reduce layout shifts, optimize animations, and improve FCP/LCP.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 bg-[#FAFCFC] border border-gray-200 rounded-xl"
              >
                <h3 className="font-bold text-[#111A1F] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#FAFCFC] border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#111A1F] mb-5">
            Related Services
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Technical SEO", href: "/services/technical-seo" },
              {
                name: "React.js Development",
                href: "/services/react-development",
              },
              {
                name: "Full-Stack Development",
                href: "/services/full-stack-development",
              },
            ].map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-5 py-2.5 border border-[#295c5e]/30 text-[#295c5e] rounded-full font-semibold text-sm hover:bg-[#295c5e] hover:text-white transition-all"
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
