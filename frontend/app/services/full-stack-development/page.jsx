import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { JsonLd } from "@/components/JsonLd";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";
import { staticServiceMetadata, staticServiceSchemas } from "../serviceSeo.js";

const PAGE_URL = canonicalUrl("/services/full-stack-development");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "Full-Stack Development",
  description:
    "End-to-end full-stack web application development combining frontend and backend expertise to deliver complete, scalable solutions.",
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
    {
      "@type": "ListItem",
      position: 3,
      name: "Full-Stack Development",
      item: PAGE_URL,
    },
  ],
};

// This page has no visible FAQ section, so it deliberately does not emit
// FAQPage markup. FAQ schema must match content users can read on the page.
const pageSchemas = staticServiceSchemas(
  "full-stack-development",
  serviceSchema,
  breadcrumbSchema,
);

export const metadata = {
  title: "Full-Stack Development Services India | MERN Stack Company | Kraviona",
  description:
    "Kraviona delivers complete full-stack web development services in India. From MongoDB databases to React frontends and Node.js backends — we build integrated, scalable applications that grow with your business.",
  keywords: [
    "Full Stack Development",
    "Full Stack Developer India",
    "End-to-End Web Development",
    "MERN Stack Development",
    "Frontend Backend Development",
    "Web Application Development",
    "Custom Web Development India",
    "Full Stack Web Solutions",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Full-Stack Development Services India | Kraviona",
    description:
      "Complete end-to-end full-stack development combining frontend expertise, backend engineering, and database design. Build scalable applications with Kraviona.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "Full-Stack Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Full-Stack Development Services India | Kraviona",
    description:
      "Complete full-stack development from frontend to backend. Build scalable applications with MERN expertise.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
  ...staticServiceMetadata("full-stack-development"),
};

export default function FullStackDevPage() {
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
            <span className="text-[#F28C5E]">Full-Stack Development</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Full-Stack{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C5E] to-[#E8622A]">
              Development
            </span>{" "}
            Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Build complete, scalable web applications with integrated frontend
            and backend architecture. From concept to deployment, Kraviona
            delivers end-to-end full-stack solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E8622A] text-white font-bold rounded-xl hover:bg-[#B84A1A] transition-all"
            >
              Start Your Project
            </Link>
            <Link
              href="/services/mern-stack-development"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/5 text-white border border-white/20 font-bold rounded-xl hover:border-[#F28C5E] transition-all"
            >
              MERN Stack Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E33] mb-6">
            What is Full-Stack Development?
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-gray-600 leading-relaxed mb-5">
                Full-stack development encompasses designing and building
                complete web applications across all layers — from the user
                interface (frontend) to server logic (backend) to databases. It
                requires expertise in multiple technologies working seamlessly
                together.
              </p>
              <p className="text-gray-600 leading-relaxed mb-5">
                At Kraviona, our full-stack developers leverage the MERN Stack
                (MongoDB, Express.js, React.js, Node.js) to create applications
                that are fast, scalable, maintainable, and SEO-optimized from
                day one.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Frontend (React.js)",
                  desc: "Interactive, responsive user interfaces built with React, optimized for performance and SEO.",
                },
                {
                  title: "Backend (Node.js)",
                  desc: "Scalable server-side logic with Express.js, handling business logic and data processing.",
                },
                {
                  title: "Database (MongoDB)",
                  desc: "Flexible NoSQL databases designed for modern applications with optimal performance.",
                },
                {
                  title: "APIs",
                  desc: "Secure, well-documented RESTful APIs connecting frontend and backend seamlessly.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="p-5 bg-[#F5F7F8] border border-gray-200 rounded-xl"
                >
                  <h3 className="font-bold text-[#1A2E33] mb-1 text-sm">
                    {s.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
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
                name: "React.js Development",
                href: "/services/react-development",
              },
              {
                name: "Node.js Development",
                href: "/services/nodejs-development",
              },
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
