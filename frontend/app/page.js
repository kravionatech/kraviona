import DeferredHomeSections from "@/components/Home/DeferredHomeSections";
import LatestBlog from "@/components/Home/LatestBlog";
import { API_URL } from "@/utils/api";
import HeroSection from "@/components/Home/HeroSection";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TWITTER,
  DEFAULT_OG_IMAGE,
  defaultRobots,
} from "./seoConfig.js";

// JSON-LD: FAQ Schema (GEO Optimisation)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is MERN Stack development and why should I choose it?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MERN Stack development uses MongoDB, Express.js, React.js, and Node.js — a full JavaScript ecosystem for building fast, scalable web applications. It enables rapid development, cost-efficiency, and is ideal for startups to enterprise businesses. At Kraviona, we specialise in delivering production-grade MERN applications with performance-first architecture.",
      },
    },
    {
      "@type": "Question",
      name: "How does Kraviona approach Technical SEO for websites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our Technical SEO process covers Core Web Vitals optimisation, structured data (Schema.org markup), XML sitemaps, robots.txt configuration, canonical tags, Open Graph & Twitter Card meta, site speed improvements, mobile responsiveness, and crawlability audits.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a custom web application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A typical custom web application takes 4–12 weeks depending on complexity. Simple landing pages are delivered in 1–2 weeks. Full-stack MERN applications with custom admin panels and APIs typically take 6–10 weeks. We follow Agile sprints so you see working deliverables every week.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide SEO services along with web development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Kraviona is both a web development agency and a Technical SEO agency. Every website we build is SEO-optimised from day one — including semantic HTML structure, proper heading hierarchy, performance optimisation, structured data markup, and keyword-targeted meta content.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Kraviona different from other web development agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike generic agencies, Kraviona focuses exclusively on performance-first, SEO-ready web solutions. We combine MERN Stack engineering excellence with data-driven marketing strategy, transparent communication, Agile delivery, post-launch support, and measurable ROI-focused outcomes.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help improve my existing website's performance and SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Our comprehensive website audit covers page speed (Core Web Vitals), SEO health (on-page, technical, and off-page), UX/mobile usability, conversion rate optimisation, and security. We provide a prioritised action plan and implement fixes.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer React.js and Node.js development services separately?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We offer dedicated React.js frontend development and standalone Node.js/Express.js backend development including RESTful APIs, microservices, and real-time applications with WebSockets.",
      },
    },
    {
      "@type": "Question",
      name: "What is your pricing model for web development projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer flexible pricing models: fixed-price for well-defined projects, time and material for evolving requirements, and monthly retainers for ongoing development and SEO support. Every project starts with a free 30-minute consultation.",
      },
    },
  ],
};

// JSON-LD: WebPage Schema
const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://kraviona.com/#webpage",
  url: "https://kraviona.com",
  name: "MERN Stack Development & Technical SEO Agency | Kraviona",
  isPartOf: { "@id": "https://kraviona.com/#website" },
  about: { "@id": "https://kraviona.com/#organization" },
  description:
    "Kraviona offers high-performance MERN Stack development, technical SEO, web design, and scalable digital solutions for modern businesses.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kraviona.com",
      },
    ],
  },
};

// JSON-LD: Service schema for homepage
const serviceListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kraviona IT & Web Development Services",
  description:
    "Comprehensive web development, technical SEO, and digital solutions by Kraviona Tech Solutions.",
  url: "https://kraviona.com/services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "MERN Stack Development",
        description:
          "Full-stack web applications built with MongoDB, Express.js, React.js, and Node.js.",
        provider: { "@id": "https://kraviona.com/#organization" },
        url: "https://kraviona.com/services/mern-stack-development",
        areaServed: "IN",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Technical SEO Services",
        description:
          "Comprehensive technical SEO audits, Core Web Vitals optimisation, and structured data implementation.",
        provider: { "@id": "https://kraviona.com/#organization" },
        url: "https://kraviona.com/services/technical-seo",
        areaServed: "IN",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "React.js Development",
        description:
          "High-performance React.js SPAs, dashboards, and component libraries.",
        provider: { "@id": "https://kraviona.com/#organization" },
        url: "https://kraviona.com/services/react-development",
        areaServed: "IN",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Node.js Backend Development",
        description:
          "Scalable RESTful APIs, microservices architecture, and real-time backend systems.",
        provider: { "@id": "https://kraviona.com/#organization" },
        url: "https://kraviona.com/services/nodejs-development",
        areaServed: "IN",
      },
    },
  ],
};

const testimonials = [
  {
    name: "Rahul Sharma",
    company: "E-Commerce Startup, Noida",
    role: "Founder",
    text: "Kraviona built our full marketplace platform in just 6 weeks. The MERN stack implementation was clean, scalable, and the team was always available on WhatsApp. Highly recommended for any startup.",
    rating: 5,
    initials: "RS",
  },
  {
    name: "Priya Mehta",
    company: "D2C Brand, Delhi",
    role: "Marketing Head",
    text: "Our organic traffic increased by 3x in 4 months after Kraviona's Technical SEO audit. They identified Core Web Vitals issues we didn't even know existed and fixed everything within 2 weeks.",
    rating: 5,
    initials: "PM",
  },
  {
    name: "Vikash Gupta",
    company: "SaaS Company, Gurugram",
    role: "CTO",
    text: "The Node.js API they built handles 10,000+ daily requests without any issues. Code quality is excellent - properly documented, tested, and handed over with a detailed technical guide.",
    rating: 5,
    initials: "VG",
  },
];

// ─── Homepage Metadata ────────────────────────────────────────────────────────
export const metadata = {
  // title.default inherited from layout; override only the page-specific title
  title: "MERN Stack Development & Technical SEO Solutions | Kraviona",
  description:
    "Kraviona Tech Solutions specialises in MERN Stack web development and Technical SEO for businesses across India. We build fast, scalable applications and improve search rankings — backed by 150+ delivered projects and a 99% retention rate.",
  keywords: [
    "Kraviona",
    "Kraviona Tech Solutions",
    "MERN Stack Development Company",
    "MERN Stack Development India",
    "Technical SEO Agency India",
    "Web Development Agency Delhi",
    "React.js Development Company",
    "Node.js Development Services",
    "Next.js Development Agency",
    "Full Stack Web Development",
    "Custom Web Application Development",
    "SEO Agency India",
    "IT Solutions Delhi India",
    "Web App Development Company",
    "UI UX Design Services",
  ],
  authors: [{ name: "Kraviona Tech", url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: "MERN Stack Development & Technical SEO Solutions | Kraviona",
    description:
      "High-performance MERN Stack development, technical SEO, and scalable digital solutions. Partner with Kraviona to grow your digital presence sustainably.",
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} – MERN Stack & SEO Agency`,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: "MERN Stack Development & Technical SEO Solutions | Kraviona",
    description:
      "High-performance MERN stack development & technical SEO. Free 30-min consultation available.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: defaultRobots,
};

async function getLatestPosts() {
  try {
    const response = await fetch(`${API_URL}/public/posts?page=1&limit=3`, {
      next: { revalidate: 300 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = await response.json();
    const posts = Array.isArray(json?.data) ? json.data : [];
    return posts.filter((post) => post?.slug).slice(0, 3);
  } catch {
    return [];
  }
}

const Home = async () => {
  const latestPosts = await getLatestPosts();
  const latestPostsSchema = latestPosts.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Latest Kraviona articles",
        itemListElement: latestPosts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `https://kraviona.com/blog/${post.slug}`,
          name: post.title,
        })),
      }
    : null;

  return (
    <>
      {/* Structured Data */}
      <JsonLd
        data={[homePageSchema, serviceListSchema, faqSchema, latestPostsSchema].filter(Boolean)}
      />

      {/* Page Sections */}
      <HeroSection />

      {/* ── SEO Content Block ── */}
      <section className="py-20 bg-[#FAFCFC]" aria-label="About our services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[2px] bg-[#a9472f]" />
                <span className="text-[#a9472f] font-bold uppercase tracking-[0.18em] text-xs">
                  Who We Are
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] leading-tight mb-5">
                Your End-to-End{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9472f] to-[#953924]">
                  Web Development & SEO Partner
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-base md:text-lg">
                Kraviona Tech Solutions is a Delhi-based{" "}
                <strong>MERN Stack development agency</strong> and{" "}
                <strong>Technical SEO company</strong> serving businesses across
                India and globally. We specialise in building scalable,
                high-performance web applications and implementing data-driven
                SEO strategies that deliver measurable growth.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg">
                From <strong>React.js frontends</strong> and{" "}
                <strong>Node.js APIs</strong> to comprehensive{" "}
                <strong>Core Web Vitals optimisation</strong> and structured
                data implementation — we handle every layer of your digital
                presence. Our Agile development process ensures transparent
                communication, on-time delivery, and solutions that scale with
                your business.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: "150+", label: "Projects Delivered" },
                  { value: "99%", label: "Client Retention Rate" },
                  { value: "5+", label: "Years of Experience" },
                  { value: "24/7", label: "Post-Launch Support" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center"
                  >
                    <p className="text-2xl font-black text-[#a9472f]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <section className="mb-8" aria-label="Client testimonials">
                <div className="mb-5">
                  <span className="text-[#a9472f] font-bold uppercase tracking-[0.18em] text-xs">
                    Client Results
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold text-[#111A1F]">
                    Trusted by founders and growth teams
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {testimonials.map((testimonial) => (
                    <article
                      key={testimonial.name}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <div className="mb-3 text-sm tracking-[0.15em] text-[#f4be78]">
                        {"★".repeat(testimonial.rating)}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600">
                        “{testimonial.text}”
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7e6e0] text-sm font-black text-[#953924]">
                          {testimonial.initials}
                        </span>
                        <div>
                          <p className="font-bold text-[#111A1F]">
                            {testimonial.name}
                          </p>
                          <p className="text-xs font-semibold text-gray-500">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#111A1F] text-white font-bold rounded-xl hover:bg-[#a9472f] transition-all duration-300 text-sm"
              >
                Learn About Kraviona
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[2px] bg-[#a9472f]" />
                <span className="text-[#a9472f] font-bold uppercase tracking-[0.18em] text-xs">
                  Core Services
                </span>
              </div>
              {[
                {
                  title: "MERN Stack Development",
                  desc: "We architect full-stack applications using MongoDB, Express.js, React.js, and Node.js. From MVP to enterprise-grade platforms, we build for performance, scalability, and maintainability.",
                  href: "/services/mern-stack-development",
                },
                {
                  title: "Technical SEO Services",
                  desc: "Complete technical SEO audits covering Core Web Vitals, structured data, crawlability, site speed, canonical tags, schema markup, and GEO (Generative Engine Optimisation) for AI search.",
                  href: "/services/technical-seo",
                },
                {
                  title: "React.js & Next.js Development",
                  desc: "High-performance React.js SPAs, Server-Side Rendered (SSR) Next.js applications, and interactive dashboards built for speed, SEO, and exceptional user experience.",
                  href: "/services/react-development",
                },
                {
                  title: "Node.js Backend Development",
                  desc: "Scalable RESTful APIs, microservices architecture, real-time WebSocket systems, authentication, and cloud deployment on AWS, Vercel, or your preferred infrastructure.",
                  href: "/services/nodejs-development",
                },
                {
                  title: "UI/UX Design & Web Design",
                  desc: "Conversion-optimised, mobile-first web designs that combine stunning aesthetics with intuitive user experience — designed to convert visitors into customers.",
                  href: "/services",
                },
              ].map((service, i) => (
                <Link
                  key={i}
                  href={service.href}
                  className="group flex gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-[#a9472f]/40 hover:shadow-[0_4px_20px_rgba(169,71,47,0.08)] transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#f7e6e0] flex items-center justify-center mt-0.5">
                    <span className="text-[#953924] font-black text-sm">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#111A1F] mb-1 group-hover:text-[#a9472f] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[#295c5e] font-bold hover:text-[#a9472f] transition-colors text-sm"
              >
                View All Services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <LatestBlog initialPosts={latestPosts} />
      <DeferredHomeSections />
    </>
  );
};

export default Home;
