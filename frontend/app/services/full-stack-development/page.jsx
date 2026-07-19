import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is full-stack development?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full-stack development refers to building both frontend (user interface) and backend (server, database, APIs) of web applications. At Kraviona, we specialize in MERN stack and modern JavaScript full-stack solutions.",
      },
    },
    {
      "@type": "Question",
      name: "Why choose full-stack development over separate teams?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Full-stack development ensures better integration, faster development cycles, and more cost-effective solutions. A unified team maintains consistency across all layers of your application.",
      },
    },
  ],
};

export const metadata = {
  title: "Full-Stack Development Services India | MERN Stack Agency | Kraviona",
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
};

export default function FullStackDevPage() {
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
            <span className="text-[#f4be78]">Full-Stack Development</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Full-Stack{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
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
              className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
            >
              Start Your Project
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
                name: "Node.js Development",
                href: "/services/nodejs-development",
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
