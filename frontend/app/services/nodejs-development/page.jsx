import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/nodejs-development");

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
      name: "Node.js Development",
      item: PAGE_URL,
    },
  ],
};

export const metadata = {
  title: "Node.js Backend Development Services India | Kraviona",
  description:
    "Kraviona builds scalable Node.js and Express.js backends, RESTful APIs, real-time WebSocket systems, and microservices architectures for businesses across India. Performance-first. Production-ready.",
  keywords: [
    "Node.js Development Company India",
    "Node.js Backend Developer",
    "Express.js API Development",
    "Node.js REST API",
    "Microservices Node.js India",
    "Node.js Express Agency Delhi",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Node.js Backend Development Company India | Kraviona",
    description:
      "Scalable Node.js & Express.js backends, REST APIs, microservices, and real-time systems. Built for performance, reliability, and enterprise scale.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Node.js Backend Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Node.js Backend Development Company India | Kraviona",
    description:
      "Scalable Node.js APIs, microservices & real-time systems. Expert Node.js developers in India.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

export default function NodeJsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
            <span className="text-[#f4be78]">Node.js Development</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Node.js{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Backend Development
            </span>{" "}
            India
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            We architect scalable Node.js and Express.js backend systems —
            RESTful APIs, microservices, real-time WebSocket applications, and
            cloud-deployed infrastructure that handles millions of requests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
            >
              Discuss Your Backend
            </Link>
            <Link
              href="/services/mern-stack-development"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/20 font-bold rounded-xl hover:border-[#f4be78] transition-all"
            >
              MERN Stack Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-6">
            Node.js Development Services
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 leading-relaxed mb-5">
                <strong>Node.js</strong> is the preferred runtime for building
                fast, scalable backend systems. Its event-driven, non-blocking
                architecture makes it ideal for real-time applications,
                microservices, and high-concurrency APIs. Companies like
                Netflix, LinkedIn, and Uber rely on Node.js at scale.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                Kraviona&apos;s Node.js developers build production-grade
                backends with <strong>Express.js</strong>, secure JWT
                authentication, MongoDB/PostgreSQL integration, Redis caching,
                and WebSocket support. We follow industry best practices for
                security, error handling, and performance.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "RESTful API Development",
                  desc: "Clean, documented REST APIs with proper HTTP methods, status codes, and error handling.",
                },
                {
                  title: "Microservices Architecture",
                  desc: "Decoupled, independently deployable services communicating via REST or message queues.",
                },
                {
                  title: "Real-Time Applications",
                  desc: "WebSocket-based chat apps, live dashboards, and collaborative tools using Socket.io.",
                },
                {
                  title: "Database Integration",
                  desc: "MongoDB, PostgreSQL, MySQL, and Redis integration with optimised query performance.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#FAFCFC] border border-gray-200 rounded-xl"
                >
                  <h3 className="font-bold text-[#111A1F] mb-1 text-sm">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
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
              {
                name: "MERN Stack Development",
                href: "/services/mern-stack-development",
              },
              {
                name: "React.js Development",
                href: "/services/react-development",
              },
              {
                name: "Web App Development",
                href: "/services/web-app-development",
              },
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
