import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/database-architecture");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Database Architecture",
  description:
    "Expert database design, optimization, and implementation. MongoDB, SQL databases, and scalable data architecture for high-performance applications.",
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
      name: "Database Architecture",
      item: PAGE_URL,
    },
  ],
};

export const metadata = {
  title: "Database Architecture & Design Services | Kraviona",
  description:
    "Expert database architecture using MongoDB, PostgreSQL, and other technologies. We design scalable, optimized databases that power high-performance applications.",
  keywords: [
    "Database Architecture",
    "Database Design",
    "MongoDB Database",
    "Database Optimization",
    "Schema Design",
    "Data Architecture",
    "Database Performance",
    "SQL Database Design",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Database Architecture Services | Kraviona",
    description:
      "Scalable database design for high-performance applications. MongoDB, PostgreSQL, and cloud database solutions.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "Database Architecture by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    title: "Database Architecture Services | Kraviona",
    description:
      "Expert database design, optimization, and implementation for scalable applications.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function DatabaseArchitecturePage() {
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
            Database{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Architecture
            </span>{" "}
            Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Robust, scalable database architecture designed for performance and
            growth. We optimize data storage, indexing, and retrieval for
            applications handling millions of records.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
          >
            Discuss Your Database
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-12">
            Database Architecture Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Schema Design",
                desc: "Optimized MongoDB schemas and relational database structures for your specific use case.",
              },
              {
                title: "Indexing Strategy",
                desc: "Performance-critical index design for fast queries and efficient data retrieval.",
              },
              {
                title: "Scaling Solutions",
                desc: "Horizontal and vertical scaling strategies for growing datasets.",
              },
              {
                title: "Data Modeling",
                desc: "Expert data modeling for consistency, relationships, and query optimization.",
              },
              {
                title: "Performance Tuning",
                desc: "Query optimization, slow query analysis, and performance monitoring.",
              },
              {
                title: "Migration Services",
                desc: "Safe migration from legacy systems to modern databases.",
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
                name: "Backend Development",
                href: "/services/backend-development",
              },
              { name: "MERN Stack", href: "/services/mern-stack-development" },
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
