import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/api-development");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "API Development",
  description:
    "Custom RESTful and GraphQL API development for seamless integration, third-party connections, and mobile applications.",
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
      name: "API Development",
      item: PAGE_URL,
    },
  ],
};

export const metadata = {
  title: "RESTful & GraphQL API Development Services | Kraviona",
  description:
    "Build secure, scalable REST and GraphQL APIs with Kraviona. We develop custom APIs for mobile apps, third-party integrations, and internal systems with comprehensive documentation.",
  keywords: [
    "API Development",
    "RESTful API",
    "GraphQL API",
    "API Integration",
    "Web API Development",
    "Custom API Services",
    "API Documentation",
    "Microservices API",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "RESTful & GraphQL API Development | Kraviona",
    description:
      "Custom APIs built with Node.js, Express.js, and GraphQL. Secure, documented, and production-ready.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "API Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    title: "API Development Services | Kraviona",
    description:
      "Secure, scalable REST and GraphQL APIs. Custom development for mobile and web applications.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function APIDevelopmentPage() {
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
            API{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Development
            </span>{" "}
            Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Build secure, well-documented RESTful and GraphQL APIs that power
            your applications. From mobile backends to third-party integrations,
            we deliver production-grade APIs.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
          >
            Start Your API Project
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-6">
            API Development Services
          </h2>
          <div className="space-y-8">
            {[
              {
                title: "RESTful APIs",
                desc: "Stateless, HTTP-based APIs following REST principles. Perfect for scalable web and mobile applications.",
              },
              {
                title: "GraphQL APIs",
                desc: "Flexible query language for APIs. Fetch exactly the data you need, nothing more, nothing less.",
              },
              {
                title: "Third-Party Integrations",
                desc: "Seamless integration with payment gateways, email services, and external platforms.",
              },
              {
                title: "API Documentation",
                desc: "Complete OpenAPI/Swagger documentation for easy developer onboarding.",
              },
              {
                title: "Rate Limiting & Security",
                desc: "Built-in authentication, authorization, and rate limiting for API protection.",
              },
              {
                title: "Monitoring & Analytics",
                desc: "API usage tracking, error monitoring, and performance analytics.",
              },
            ].map((item, i) => (
              <div key={i} className="border-l-4 border-[#d96c4e] pl-6">
                <h3 className="text-xl font-bold text-[#111A1F] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
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
              {
                name: "Node.js Development",
                href: "/services/nodejs-development",
              },
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
