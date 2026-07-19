import Link from "next/link";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

const PAGE_URL = canonicalUrl("/services/saas-development");

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}#service`,
  name: "SaaS Development",
  description:
    "End-to-end SaaS product development from concept to launch. Build scalable, multi-tenant cloud applications with subscription billing and modern architecture.",
  provider: { "@id": "https://kraviona.com/#organization" },
  url: PAGE_URL,
  areaServed: [{ "@type": "Country", name: "India" }],
};

export const metadata = {
  title: "SaaS Development Services | Build Cloud Applications | Kraviona",
  description:
    "Kraviona builds scalable SaaS applications from scratch. Multi-tenant architecture, subscription billing, cloud deployment, and modern tech stack for your B2B product.",
  keywords: [
    "SaaS Development",
    "SaaS Application Development",
    "Cloud Application Development",
    "Subscription Software",
    "Multi-tenant Applications",
    "Web App Development",
    "SaaS Platform Development",
    "B2B Software Development",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "SaaS Development Services | Kraviona",
    description:
      "Build scalable, cloud-based SaaS products. Multi-tenant, subscription-ready, enterprise-grade applications.",
    url: PAGE_URL,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-web-development.jpg",
        width: 1200,
        height: 630,
        alt: "SaaS Development by Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    title: "SaaS Development Services | Kraviona",
    description:
      "Scalable SaaS products with multi-tenant architecture, billing, and cloud deployment.",
    images: ["/og-web-development.jpg"],
  },
  robots: defaultRobots,
};

export default function SaaSDevelopmentPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <section className="relative py-28 bg-gradient-to-br from-[#081314] via-[#0f2425] to-[#1b3d3e] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            SaaS{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Development
            </span>{" "}
            Services
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed">
            Build your SaaS dream. From MVP to enterprise platform, we develop
            scalable, multi-tenant applications ready to dominate your market.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-all"
          >
            Build Your SaaS
          </Link>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-12">
            SaaS Development Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Multi-Tenant Architecture",
                desc: "Scalable, isolated tenant environments within a single application instance.",
              },
              {
                title: "Subscription Billing",
                desc: "Integrated payment processing with Stripe, PayPal, and recurring billing.",
              },
              {
                title: "User Management",
                desc: "Secure authentication, role-based access, team management, and SSO integration.",
              },
              {
                title: "Analytics Dashboard",
                desc: "Real-time analytics, usage tracking, and business intelligence for your SaaS.",
              },
              {
                title: "API & Integrations",
                desc: "RESTful APIs and webhooks for third-party integrations and automation.",
              },
              {
                title: "Cloud Deployment",
                desc: "Scalable cloud infrastructure on AWS, Azure, or Google Cloud.",
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
                name: "Full-Stack Development",
                href: "/services/full-stack-development",
              },
              {
                name: "Backend Development",
                href: "/services/backend-development",
              },
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
