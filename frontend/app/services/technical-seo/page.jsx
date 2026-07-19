import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/technical-seo");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Technical SEO Services",
  description:
    "Comprehensive technical SEO audits, Core Web Vitals optimisation, structured data implementation, and GEO optimisation for AI search engines — removing every barrier between your content and page-one rankings.",
  provider: { "@id": "https://kraviona.com/#organization" },
  url: PAGE_URL,
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "City", name: "Delhi" },
  ],
};

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
    { "@type": "ListItem", position: 3, name: "Technical SEO", item: PAGE_URL },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does a technical SEO audit take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A comprehensive technical SEO audit from Kraviona takes 3–5 business days. You receive a prioritised report covering crawl errors, indexation issues, Core Web Vitals, duplicate content, canonical problems, schema markup gaps, and site speed bottlenecks.",
      },
    },
    {
      "@type": "Question",
      name: "How soon will I see improvements after technical SEO fixes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most clients see measurable improvements in crawl coverage and Core Web Vitals within 2–4 weeks of implementation. Ranking improvements typically follow within 4–12 weeks, depending on site authority and competition.",
      },
    },
    {
      "@type": "Question",
      name: "Do you optimise for AI search engines like ChatGPT and Perplexity?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our GEO (Generative Engine Optimisation) service ensures your content is structured for AI citation — using clear headings, entity markup, FAQ schema, concise answers, and llms.txt configuration to maximise your visibility in AI-powered search results.",
      },
    },
  ],
};

export const metadata = {
  title: "Technical SEO Services and Core Web Vitals | Kraviona",
  description:
    "Kraviona provides expert Technical SEO services in India — Core Web Vitals fixes, structured data implementation, schema markup, crawlability improvements, and GEO optimisation for AI search. Measurable results, not just audits.",
  keywords: [
    "Technical SEO Services India",
    "Technical SEO Agency India",
    "Core Web Vitals Optimisation",
    "Schema Markup SEO",
    "Site Speed Optimisation",
    "SEO Audit India",
    "GEO Optimisation AI Search",
    "Structured Data SEO",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Technical SEO Services India | Kraviona",
    description:
      "Expert Technical SEO — Core Web Vitals, structured data, schema markup & GEO optimisation. Rank higher and get cited by AI search engines with Kraviona.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Technical SEO Services by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Technical SEO Services India | Kraviona",
    description:
      "Core Web Vitals, structured data & GEO optimisation for AI search. Rank higher with Kraviona.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const features = [
  {
    title: "Technical SEO Audit",
    desc: "Comprehensive crawl analysis covering broken links, duplicate content, canonical issues, redirect chains, and indexability.",
  },
  {
    title: "Core Web Vitals Optimisation",
    desc: "LCP, FID/INP, and CLS improvements through image optimisation, code splitting, and render-blocking resource elimination.",
  },
  {
    title: "Structured Data & Schema",
    desc: "Implementation of FAQ, Service, Organization, BreadcrumbList, Review, and Article schemas for rich search results.",
  },
  {
    title: "Robots.txt & Sitemap",
    desc: "Proper crawl budget management, XML sitemap optimisation, and robots.txt configuration for maximum indexation.",
  },
  {
    title: "GEO (AI Search) Optimisation",
    desc: "Optimising for Generative Engine Optimisation — making your content citeable by ChatGPT, Perplexity, and Google AI Overviews.",
  },
  {
    title: "Page Speed & Performance",
    desc: "JavaScript and CSS optimisation, lazy loading, WebP image conversion, CDN setup, and server response time improvement.",
  },
];

export default function TechnicalSEOPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="relative py-28 bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] overflow-hidden">
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
            <span className="text-[#f4be78]">Technical SEO</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Technical SEO{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Services
            </span>{" "}
            India
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            We eliminate every technical barrier holding your website back from
            ranking. From Core Web Vitals and structured data to GEO
            optimisation for AI search engines — Kraviona delivers technical SEO
            that moves the needle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
            >
              Get SEO Audit
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/20 font-bold rounded-xl hover:border-[#f4be78] transition-all"
            >
              All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-6">
            What is Technical SEO and Why Does It Matter?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-gray-600 leading-relaxed mb-5">
                <strong>Technical SEO</strong> refers to all behind-the-scenes
                optimisations that make your website easier for search engine
                crawlers to find, understand, and index. Without a technically
                sound foundation, even the best content will struggle to rank.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Kraviona&apos;s Technical SEO service covers everything from{" "}
                <strong>Core Web Vitals</strong> (page speed, interactivity,
                visual stability) to <strong>structured data markup</strong>{" "}
                (Schema.org), <strong>XML sitemaps</strong>,{" "}
                <strong>robots.txt</strong>, <strong>canonical tags</strong>,
                and <strong>GEO optimisation</strong> for AI-powered search.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We start with a comprehensive{" "}
                <strong>technical SEO audit</strong> that identifies all crawl
                errors, indexability issues, duplicate content, and performance
                bottlenecks — then implement fixes in a prioritised action plan.
              </p>
            </div>
            <div className="space-y-4">
              {[
                "Improve Google Search Rankings",
                "Fix Crawl Errors & Indexation Issues",
                "Boost Core Web Vitals Scores",
                "Appear in AI Search (ChatGPT, Perplexity)",
                "Rich Snippets via Schema Markup",
                "Faster Site Speed & Better UX",
              ].map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-3 p-4 bg-[#FAFCFC] border border-gray-200 rounded-xl"
                >
                  <span className="w-6 h-6 rounded-full bg-[#d96c4e] flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="text-gray-700 font-medium text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#FAFCFC]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-[#111A1F] mb-4 text-center">
            Our Technical SEO Services
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            Complete technical optimisation covering every ranking factor that
            matters.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-7 bg-white border border-gray-200 rounded-2xl hover:border-[#d96c4e]/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d96c4e]/10 flex items-center justify-center mb-4">
                  <span className="text-[#d96c4e] font-black text-sm">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#111A1F] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#111A1F] mb-5">
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
              { name: "UI/UX Design", href: "/services/ui-ux-design" },
              { name: "All Services", href: "/services" },
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
