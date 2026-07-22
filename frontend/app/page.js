import DeferredHomeSections from "@/components/Home/DeferredHomeSections";
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
        text: "MERN Stack development uses MongoDB, Express.js, React.js, and Node.js to build modern web applications with one JavaScript-based stack. Kraviona uses MERN when clients need fast delivery, clean APIs, scalable databases, and maintainable product foundations.",
      },
    },
    {
      "@type": "Question",
      name: "How does Kraviona approach Technical SEO for websites?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kraviona's Technical SEO process covers Core Web Vitals, structured data, XML sitemaps, robots.txt, canonical tags, Open Graph metadata, mobile performance, crawlability, indexation, and page-speed improvements.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to build a custom web application?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most custom web applications take 4 to 12 weeks depending on scope. Landing pages can move faster, while MERN products with admin panels, APIs, authentication, and integrations need more planning. Kraviona works in practical milestones so clients see progress early.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide SEO services along with web development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Kraviona combines web development with Technical SEO. Websites are planned with semantic structure, clean heading hierarchy, performance optimisation, structured data, metadata, and crawl-friendly architecture from the start.",
      },
    },
    {
      "@type": "Question",
      name: "What makes Kraviona different from other web development agencies?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kraviona is founder-led and focused on practical execution: clean MERN and Next.js development, technical SEO, transparent communication, realistic timelines, and post-launch support that helps the product keep improving.",
      },
    },
    {
      "@type": "Question",
      name: "Can you help improve my existing website's performance and SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Kraviona audits page speed, Core Web Vitals, crawlability, technical SEO, mobile UX, conversion blockers, and basic security issues, then turns the findings into a prioritised implementation plan.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer React.js and Node.js development services separately?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Kraviona handles React.js frontend work, Next.js websites, and standalone Node.js or Express.js backend development, including REST APIs, authentication, dashboards, integrations, and real-time features.",
      },
    },
    {
      "@type": "Question",
      name: "What is your pricing model for web development projects?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pricing depends on scope, complexity, timeline, integrations, and support needs. Kraviona can work with fixed project pricing for clear scopes or retainers for ongoing development, SEO, and maintenance.",
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
    "Kraviona builds MERN stack products, Next.js websites, backend APIs, and technical SEO foundations for businesses that need faster, cleaner digital growth.",
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
    "Web development, backend engineering, technical SEO, and digital growth services by Kraviona Tech Solutions.",
  url: "https://kraviona.com/services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "MERN Stack Development",
        description:
          "Full-stack web applications built with MongoDB, Express.js, React.js, and Node.js for practical business use cases.",
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
          "Technical SEO audits, Core Web Vitals improvements, structured data, and crawlability fixes.",
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
          "React.js and Next.js interfaces for websites, dashboards, and product experiences.",
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
          "REST APIs, authentication, integrations, and reliable backend systems built with Node.js.",
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
  title: "MERN Stack, Next.js & Technical SEO Agency | Kraviona",
  description:
    "Kraviona Tech Solutions builds fast MERN stack products, Next.js websites, backend APIs, and technical SEO systems for businesses across India and beyond.",
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
    title: "MERN Stack, Next.js & Technical SEO Agency | Kraviona",
    description:
      "Fast MERN stack products, Next.js websites, backend APIs, and technical SEO foundations for businesses that want cleaner digital growth.",
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
    title: "MERN Stack, Next.js & Technical SEO Agency | Kraviona",
    description:
      "MERN stack, Next.js, backend APIs, and technical SEO from a founder-led technology team.",
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
                A Practical{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a9472f] to-[#953924]">
                  Build and Growth Partner
                </span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-base md:text-lg">
                Kraviona Tech Solutions is a Delhi-based{" "}
                <strong>MERN Stack development agency</strong> and{" "}
                <strong>Technical SEO company</strong> serving businesses across
                India and beyond. We build fast websites, reliable web
                applications, clean backend systems, and SEO-ready foundations
                that help your business earn attention and convert it.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6 text-base md:text-lg">
                From <strong>React.js frontends</strong> and{" "}
                <strong>Node.js APIs</strong> to{" "}
                <strong>Core Web Vitals optimisation</strong>, structured data,
                admin panels, and search-friendly architecture, we handle the
                technical layers that make a digital product useful after
                launch.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: "50+", label: "Projects Delivered" },
                  { value: "5+", label: "Years of Experience" },
                  { value: "30d", label: "Launch Support Window" },
                  { value: "SEO", label: "Built Into Delivery" },
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
                    Built for founders and growth teams
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
                  desc: "Full-stack products built with MongoDB, Express.js, React.js, and Node.js, planned for speed, maintainability, and real business workflows.",
                  href: "/services/mern-stack-development",
                },
                {
                  title: "Technical SEO Services",
                  desc: "Technical audits and implementation for Core Web Vitals, structured data, crawlability, indexing, schema markup, and AI-search readiness.",
                  href: "/services/technical-seo",
                },
                {
                  title: "React.js & Next.js Development",
                  desc: "Fast React.js and Next.js interfaces for marketing sites, dashboards, portals, and SEO-sensitive web experiences.",
                  href: "/services/react-development",
                },
                {
                  title: "Node.js Backend Development",
                  desc: "REST APIs, authentication, integrations, admin workflows, database design, and deployment support for reliable backend systems.",
                  href: "/services/nodejs-development",
                },
                {
                  title: "UI/UX Design & Web Design",
                  desc: "Mobile-first interfaces with clear content, strong navigation, and conversion-focused pages that make the next step obvious.",
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

      <DeferredHomeSections initialPosts={latestPosts} />
    </>
  );
};

export default Home;
