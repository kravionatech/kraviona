import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/mern-stack-development");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "MERN Stack Development",
  description:
    "End-to-end MERN Stack web application development using MongoDB, Express.js, React.js, and Node.js — architected for performance, scalability, and long-term business growth.",
  provider: { "@id": "https://kraviona.com/#organization" },
  areaServed: [
    { "@type": "Country", name: "India" },
    { "@type": "City", name: "Delhi" },
  ],
  url: PAGE_URL,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "MERN Stack Development Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "MongoDB Database Design" },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Express.js REST API Development",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "React.js Frontend Development",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Node.js Backend Engineering",
        },
      },
    ],
  },
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
    {
      "@type": "ListItem",
      position: 3,
      name: "MERN Stack Development",
      item: PAGE_URL,
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does a MERN Stack project take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A typical MERN Stack project takes 4–10 weeks depending on scope. Simple MVPs can launch in 3–4 weeks. Enterprise-grade platforms with admin panels and third-party integrations take 8–12 weeks. We deliver in Agile sprints with weekly updates.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide ongoing support after MERN Stack development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All Kraviona projects include a 30-day bug-fix warranty post-launch. We also offer monthly retainers for feature development, performance monitoring, security patches, and technical support.",
      },
    },
    {
      "@type": "Question",
      name: "Can you migrate our existing app to MERN Stack?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We handle full-stack migrations — from PHP/WordPress, legacy Java backends, or monolithic architectures to modular MERN Stack systems. We plan migrations to ensure zero downtime and data integrity.",
      },
    },
  ],
};

export const metadata = {
  title: "MERN Stack Development Company for Apps | Kraviona",
  description:
    "Kraviona is a trusted MERN Stack development company in India. We build scalable MongoDB, Express.js, React.js & Node.js web applications with SEO-first architecture. Get a free consultation.",
  keywords: [
    "MERN Stack Development Company India",
    "MERN Stack Developer India",
    "Full Stack MERN Development",
    "React Node.js Developer India",
    "MongoDB Express React Node",
    "MERN Stack Agency Delhi",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "MERN Stack Development Company India | Kraviona",
    description:
      "End-to-end MERN Stack development. Build fast, scalable web applications with expert MongoDB, Express, React & Node.js engineers at Kraviona.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "MERN Stack Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "MERN Stack Development Company India | Kraviona",
    description:
      "Build scalable MERN apps with Kraviona — MongoDB, Express.js, React.js & Node.js experts.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

const features = [
  {
    title: "MongoDB Database Design",
    desc: "Flexible NoSQL schema architecture optimised for read/write performance, with indexing strategies that scale to millions of records.",
  },
  {
    title: "Express.js REST API",
    desc: "Secure, versioned RESTful APIs with JWT authentication, rate limiting, input validation, and comprehensive error handling middleware.",
  },
  {
    title: "React.js Frontend",
    desc: "Dynamic React.js UIs with SSR and SSG via Next.js for superior SEO performance, fast initial loads, and excellent Core Web Vitals scores.",
  },
  {
    title: "Node.js Backend",
    desc: "Event-driven, non-blocking Node.js servers capable of handling thousands of concurrent connections without performance degradation.",
  },
  {
    title: "JWT Authentication",
    desc: "Secure, stateless authentication with JSON Web Tokens, refresh token rotation, and fine-grained role-based access control (RBAC).",
  },
  {
    title: "Cloud Deployment",
    desc: "Production-ready deployment on AWS, Vercel, or DigitalOcean with CI/CD pipelines, automated testing, and zero-downtime releases.",
  },
];

const relatedServices = [
  { name: "React.js Development", href: "/services/react-development" },
  { name: "Node.js Development", href: "/services/nodejs-development" },
  { name: "Technical SEO", href: "/services/technical-seo" },
  { name: "Web App Development", href: "/services/web-app-development" },
  { name: "All Services", href: "/services" },
];

export default function MERNStackPage() {
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

      {/* Hero */}
      <section
        className="relative py-28 bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] overflow-hidden"
        aria-labelledby="mern-h1"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav
            className="flex items-center gap-2 text-sm text-gray-400 mb-10"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/services"
              className="hover:text-white transition-colors"
            >
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#f4be78]" aria-current="page">
              MERN Stack Development
            </span>
          </nav>
          <h1
            id="mern-h1"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            MERN Stack{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Development
            </span>{" "}
            Company India
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            We engineer high-performance, scalable web applications using
            MongoDB, Express.js, React.js, and Node.js. From early-stage MVPs to
            enterprise SaaS platforms — Kraviona delivers full-stack solutions
            that drive measurable business outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all shadow-[0_4px_20px_rgba(217,108,78,0.3)]"
              aria-label="Get a free MERN Stack consultation"
            >
              Get Free Consultation
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

      {/* Why MERN */}
      <section className="py-20 bg-white" aria-labelledby="why-mern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                id="why-mern"
                className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-6"
              >
                Why Choose MERN Stack for Your Web Application?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                The <strong>MERN Stack</strong> is a full-JavaScript technology
                suite that unifies your development team under a single language
                — reducing friction, accelerating delivery, and lowering
                long-term maintenance costs. It&apos;s battle-tested at scale by
                companies like LinkedIn, Netflix, and Uber.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                At Kraviona, our MERN developers have shipped 150+ production
                applications — from multi-tenant SaaS platforms and real-time
                collaboration tools to headless e-commerce solutions and complex
                admin dashboards. We follow Agile methodologies with bi-weekly
                sprint reviews so you always know exactly where your project
                stands.
              </p>
              <ul className="space-y-3" aria-label="MERN Stack benefits">
                {[
                  "Single JavaScript language across the entire stack",
                  "Faster time-to-market with Agile sprint delivery",
                  "Horizontally scalable MongoDB architecture",
                  "Rich open-source ecosystem and community support",
                  "Cost-effective for startups, mid-market, and enterprises",
                ].map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-3 text-gray-700 text-sm font-medium"
                  >
                    <span
                      className="w-5 h-5 rounded-full bg-[#d96c4e]/10 flex-shrink-0 flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3 h-3 text-[#d96c4e]"
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
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="grid grid-cols-2 gap-4"
              aria-label="MERN Stack technologies"
            >
              {[
                { label: "MongoDB", color: "#47A248", desc: "NoSQL Database" },
                {
                  label: "Express.js",
                  color: "#333",
                  desc: "Backend Framework",
                },
                {
                  label: "React.js",
                  color: "#61DAFB",
                  desc: "Frontend Library",
                },
                {
                  label: "Node.js",
                  color: "#339933",
                  desc: "Runtime Environment",
                },
              ].map((t) => (
                <div
                  key={t.label}
                  className="p-6 border border-gray-200 rounded-2xl text-center hover:shadow-md transition-shadow"
                >
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-3"
                    style={{ backgroundColor: t.color }}
                    aria-hidden="true"
                  />
                  <p className="font-extrabold text-lg text-[#111A1F]">
                    {t.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-[#FAFCFC]" aria-labelledby="mern-features">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="mern-features"
            className="text-3xl font-extrabold text-[#111A1F] mb-4 text-center"
          >
            What&apos;s Included in Our MERN Stack Service
          </h2>
          <p className="text-gray-500 text-center max-w-xl mx-auto mb-12">
            Comprehensive full-stack development from database architecture
            design to cloud deployment and post-launch support.
          </p>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            role="list"
          >
            {features.map((f, i) => (
              <div
                key={i}
                className="p-7 bg-white border border-gray-200 rounded-2xl hover:border-[#d96c4e]/30 hover:shadow-md transition-all"
                role="listitem"
              >
                <div
                  className="w-10 h-10 rounded-xl bg-[#d96c4e]/10 flex items-center justify-center mb-4"
                  aria-hidden="true"
                >
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

      {/* FAQ Section */}
      <section className="py-16 bg-white" aria-labelledby="mern-faq">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="mern-faq"
            className="text-2xl font-extrabold text-[#111A1F] mb-8 text-center"
          >
            MERN Stack Development — Common Questions
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <details
                key={i}
                className="border border-gray-200 rounded-2xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-semibold text-[#111A1F] hover:bg-gray-50 transition-colors text-sm md:text-base">
                  {faq.name}
                  <span
                    className="text-[#d96c4e] font-bold text-xl group-open:rotate-45 transition-transform duration-200 flex-shrink-0"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-2 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section
        className="py-12 bg-[#FAFCFC] border-t border-gray-100"
        aria-label="Related services"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-lg font-bold text-[#111A1F] mb-5">
            Related Services
          </h2>
          <nav
            className="flex flex-wrap gap-3"
            aria-label="Related service links"
          >
            {relatedServices.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-5 py-2.5 border border-[#295c5e]/30 text-[#295c5e] rounded-full font-semibold text-sm hover:bg-[#295c5e] hover:text-white transition-all"
              >
                {s.name}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <ContactFormDetails />
    </>
  );
}
