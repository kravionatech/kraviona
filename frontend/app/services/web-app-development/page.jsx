import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/web-app-development");

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
      name: "Web App Development",
      item: PAGE_URL,
    },
  ],
};

export const metadata = {
  title: "Web App Development Company for Startups | Kraviona",
  description:
    "Kraviona builds custom web applications for startups and enterprises. Full-stack web app development with React, Node.js, and cloud deployment. Get a free quote.",
  keywords: [
    "Web App Development Company India",
    "Custom Web Application Development",
    "Full Stack Web Development India",
    "SaaS Development Company",
    "Enterprise Web App India",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Web App Development Company India | Kraviona",
    description:
      "Custom full-stack web applications for startups and enterprises. Built with React, Node.js, and cloud-first architecture.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "Web App Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Web App Development Company India | Kraviona",
    description:
      "Full-stack web app development with React, Node.js and cloud-native architecture.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function WebAppPage() {
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
            <span className="text-[#f4be78]">Web App Development</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Web App{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Development
            </span>{" "}
            Company India
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            From MVPs to fully-scaled SaaS platforms, Kraviona builds custom web
            applications that solve real business problems. Performance-first,
            security-hardened, and built to grow with you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
            >
              Build Your Web App
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
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-8">
            Custom Web Application Development
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                n: "SaaS Platform Development",
                d: "End-to-end SaaS applications with subscription billing, multi-tenancy, and role-based access.",
              },
              {
                n: "CRM & ERP Systems",
                d: "Custom business management tools replacing costly off-the-shelf software with tailored solutions.",
              },
              {
                n: "E-Commerce Web Apps",
                d: "High-converting online stores with custom product management, payments, and order tracking.",
              },
              {
                n: "Internal Tools & Dashboards",
                d: "Admin panels, data dashboards, and workflow automation tools for internal teams.",
              },
              {
                n: "API & Integration Development",
                d: "Third-party API integrations, payment gateways, CRMs, ERPs, and custom webhook systems.",
              },
              {
                n: "Progressive Web Apps (PWA)",
                d: "Mobile-first web apps with offline capability, push notifications, and native app-like experience.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-7 bg-[#FAFCFC] border border-gray-200 rounded-2xl hover:border-[#d96c4e]/30 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d96c4e]/10 flex items-center justify-center mb-4">
                  <span className="text-[#d96c4e] font-black text-sm">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-[#111A1F] mb-2">{s.n}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.d}</p>
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
              { name: "Technical SEO", href: "/services/technical-seo" },
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
