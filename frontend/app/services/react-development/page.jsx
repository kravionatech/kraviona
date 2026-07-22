import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/react-development");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "React.js Development",
  description:
    "High-performance React.js SPAs, Next.js SSR/SSG applications, and interactive dashboards built for speed, SEO, and exceptional user experience.",
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
      name: "React.js Development",
      item: PAGE_URL,
    },
  ],
};

export const metadata = {
  title: "React.js Development Company India | Kraviona",
  description:
    "Kraviona is a top React.js development company in India. We build high-performance SPAs, Next.js SSR applications, admin dashboards, and component libraries. Fast, SEO-friendly, and built to scale.",
  keywords: [
    "React.js Development Company India",
    "React Developer India",
    "Next.js Development Agency",
    "React SPA Development",
    "React.js Web Application",
    "Next.js SSR Agency",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "React.js Development Company India | Kraviona",
    description:
      "High-performance React.js SPAs, Next.js SSR/SSG apps, and dashboards. Built for speed, SEO performance, and enterprise scale.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "React.js Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "React.js Development Company India | Kraviona",
    description:
      "High-performance React.js and Next.js development. SPAs, dashboards, and SSR apps that rank.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function ReactDevPage() {
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
            <span className="text-[#f4be78]">React.js Development</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            React.js{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Development
            </span>{" "}
            Company India
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Build fast, SEO-friendly React.js and Next.js applications with
            Kraviona. We specialise in dynamic SPAs, admin dashboards, headless
            CMS frontends, and maintainable React architectures.
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
            React.js & Next.js Development Services
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 leading-relaxed mb-5">
                React.js is the world&apos;s most popular frontend library,
                powering applications for Facebook, Airbnb, Netflix, and
                thousands of startups. At Kraviona, we build React applications
                that are fast, accessible, and SEO-optimised using{" "}
                <strong>Next.js</strong> for Server-Side Rendering and Static
                Site Generation.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you need a customer-facing SPA, an internal admin
                dashboard, a headless CMS frontend, or a real-time collaborative
                tool — our React.js developers architect solutions that scale
                with your business.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Single Page Applications (SPA)",
                  desc: "Dynamic, client-side rendered apps with smooth navigation and minimal load times.",
                },
                {
                  title: "Next.js SSR / SSG",
                  desc: "Server-Side Rendered and Static Generated pages for maximum SEO performance.",
                },
                {
                  title: "React Dashboards & Admin Panels",
                  desc: "Feature-rich dashboards with data visualisation, real-time updates, and role-based access.",
                },
                {
                  title: "Component Library Development",
                  desc: "Reusable, documented component systems with Storybook integration.",
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
                name: "Node.js Development",
                href: "/services/nodejs-development",
              },
              { name: "Technical SEO", href: "/services/technical-seo" },
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
