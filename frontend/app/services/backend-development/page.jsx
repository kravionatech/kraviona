import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/backend-development");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Backend Development",
  description:
    "Robust, scalable backend systems using Node.js, Express.js, and MongoDB. Building APIs, microservices, and enterprise-grade server solutions.",
  provider: { "@id": "https://kraviona.com/#organization" },
  url: PAGE_URL,
  areaServed: [{ "@type": "Country", name: "India" }],
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
      name: "Backend Development",
      item: PAGE_URL,
    },
  ],
};

export const metadata = {
  title: "Backend Development Services India | Node.js APIs | Kraviona",
  description:
    "Expert backend development using Node.js and Express.js. Build scalable APIs, microservices, and enterprise server solutions with Kraviona's experienced backend engineers.",
  keywords: [
    "Backend Development",
    "Node.js Development",
    "RESTful API Development",
    "Server-side Development",
    "Microservices Architecture",
    "Backend Engineer India",
    "Express.js Development",
    "API Integration Services",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Backend Development Services India | Kraviona",
    description:
      "Scalable backend systems and APIs using Node.js, Express.js, and modern architecture patterns.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "Backend Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    title: "Backend Development Services India | Kraviona",
    description:
      "Scalable Node.js backends, RESTful APIs, and microservices. Enterprise-grade server solutions.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function BackendDevPage() {
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

      <section className="relative py-28 bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Backend{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Development
            </span>{" "}
            Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Powerful, scalable backend infrastructure using Node.js and
            Express.js. We build APIs, microservices, and enterprise-grade
            server systems that power modern applications.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-12">
            Backend Development Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Node.js APIs",
                desc: "High-performance RESTful and GraphQL APIs built with Node.js and Express.js.",
              },
              {
                title: "Database Design",
                desc: "Optimized MongoDB schemas and database architecture for scalability.",
              },
              {
                title: "Authentication",
                desc: "Secure JWT-based authentication, OAuth integration, and access control.",
              },
              {
                title: "Microservices",
                desc: "Decoupled microservices architecture for scalability and maintainability.",
              },
              {
                title: "Real-time Systems",
                desc: "WebSocket integration for real-time messaging and live updates.",
              },
              {
                title: "Cloud Deployment",
                desc: "AWS, Heroku, and DigitalOcean deployment with CI/CD pipelines.",
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
              {
                name: "Node.js Development",
                href: "/services/nodejs-development",
              },
              { name: "API Development", href: "/services/api-development" },
              { name: "MERN Stack", href: "/services/mern-stack-development" },
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
