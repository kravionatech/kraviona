import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { defaultRobots } from "@/app/seoConfig.js";

export const metadata = {
  title: "Pricing for Web Development & SEO Plans | Kraviona",
  description:
    "Compare transparent Kraviona pricing for MERN stack development, technical SEO, AI automation, and digital growth packages from starter to enterprise.",
  keywords: [
    "Kraviona Pricing",
    "Web Development Cost India",
    "MERN Stack Development Price",
    "IT Solutions Packages",
    "Affordable Web Development",
    "Custom Software Pricing",
    "Next.js Development Cost",
    "Website Development Packages India",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://kraviona.com/pricing" },
  openGraph: {
    title: "Pricing | Transparent Plans & Packages | Kraviona",
    description:
      "Transparent pricing for MERN Stack development, Technical SEO, and digital marketing services.",
    url: "https://kraviona.com/pricing",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Pricing | Transparent Plans & Packages | Kraviona",
    description:
      "Transparent pricing for MERN Stack development, Technical SEO, and digital marketing services.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const pricingTiers = [
  {
    name: "Starter",
    tagline: "For small businesses & MVPs",
    priceFrom: "₹25,000",
    priceSuffix: "onwards",
    timeline: "2-3 weeks",
    features: [
      "Up to 5-page website or simple web app",
      "React.js / Next.js frontend",
      "Basic Node.js backend / API",
      "MongoDB setup",
      "Mobile responsive design",
      "Basic on-page SEO setup",
      "1 round of revisions",
      "14 days post-launch support",
    ],
    cta: "Get a Quote",
    ctaLink: "/contact",
    highlight: false,
  },
  {
    name: "Growth",
    tagline: "For scaling businesses",
    priceFrom: "₹75,000",
    priceSuffix: "onwards",
    timeline: "4-8 weeks",
    features: [
      "Full MERN Stack application",
      "Custom admin dashboard",
      "REST API + authentication",
      "Cloudinary image management",
      "Redis caching",
      "Technical SEO audit + fixes",
      "Core Web Vitals optimisation",
      "GTM + Analytics setup",
      "3 rounds of revisions",
      "30 days post-launch support",
    ],
    cta: "Start a Project",
    ctaLink: "/contact",
    highlight: true,
  },
  {
    name: "Enterprise",
    tagline: "For large-scale platforms",
    priceFrom: "Custom",
    priceSuffix: "pricing",
    timeline: "8-16 weeks",
    features: [
      "Complex platform / SaaS development",
      "Microservices architecture",
      "Multi-vendor marketplace support",
      "AI/LLM integration",
      "Performance & security audit",
      "Full Technical SEO strategy",
      "Dedicated project manager",
      "Weekly demo & reporting",
      "Unlimited revisions during dev",
      "60 days post-launch support",
      "SLA-backed delivery",
    ],
    cta: "Talk to Founder",
    ctaLink: "/contact",
    highlight: false,
  },
];

const seoPricing = [
  { service: "Technical SEO Audit", price: "₹8,000 - ₹15,000", delivery: "5-7 days" },
  { service: "Monthly SEO Retainer", price: "₹12,000 - ₹25,000 / month", delivery: "Ongoing" },
  { service: "Core Web Vitals Fix", price: "₹10,000 - ₹20,000", delivery: "1-2 weeks" },
  { service: "Schema Markup Implementation", price: "₹5,000 - ₹8,000", delivery: "2-3 days" },
  { service: "GEO / AI SEO Setup", price: "₹6,000 - ₹12,000", delivery: "3-5 days" },
];

const Pricing = () => {
  return (
    <main className="min-h-screen bg-[#f9fafb] px-4 py-28 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://kraviona.com" },
          { name: "Pricing", url: "https://kraviona.com/pricing" },
        ])}
      />

      <section className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-[#d96c4e] font-bold tracking-[0.3em] text-[10px] uppercase">
            Transparent Pricing
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold text-[#1b3d3e] tracking-tight leading-tight">
            Plans for serious web growth
          </h1>
          <p className="mt-5 text-gray-500 text-lg leading-relaxed">
            Choose a starting package for MERN Stack development, Technical SEO,
            and growth work. Final scope is confirmed after discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <article
              key={tier.name}
              className={`relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                tier.highlight
                  ? "border-[#d96c4e] ring-2 ring-[#d96c4e]/15"
                  : "border-gray-200"
              }`}
            >
              {tier.highlight && (
                <span className="absolute right-5 top-5 rounded-full bg-[#d96c4e]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#d96c4e]">
                  Popular
                </span>
              )}
              <div>
                <h2 className="text-2xl font-black text-[#1b3d3e]">
                  {tier.name}
                </h2>
                <p className="mt-2 text-sm font-semibold text-gray-500">
                  {tier.tagline}
                </p>
                <div className="mt-6">
                  <span className="text-4xl font-black text-[#111A1F]">
                    {tier.priceFrom}
                  </span>
                  <span className="ml-2 text-sm font-bold text-gray-500">
                    {tier.priceSuffix}
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-[#d96c4e]">
                  Timeline: {tier.timeline}
                </p>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex gap-3 text-sm leading-relaxed text-gray-600"
                  >
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#295c5e]/10 text-xs font-black text-[#295c5e]">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaLink}
                className={`mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-black transition-colors ${
                  tier.highlight
                    ? "bg-[#d96c4e] text-white hover:bg-[#c25e41]"
                    : "bg-[#1b3d3e] text-white hover:bg-[#d96c4e]"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-[#d96c4e] font-bold tracking-[0.24em] text-[10px] uppercase">
                SEO Add-ons
              </span>
              <h2 className="mt-2 text-2xl font-black text-[#1b3d3e]">
                Focused optimisation packages
              </h2>
            </div>
            <Link
              href="/contact"
              className="text-sm font-black text-[#295c5e] hover:text-[#d96c4e]"
            >
              Request custom quote →
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="grid grid-cols-3 bg-[#f4f7f7] px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-[#1b3d3e]">
              <span>Service</span>
              <span>Price</span>
              <span>Delivery</span>
            </div>
            {seoPricing.map((item) => (
              <div
                key={item.service}
                className="grid grid-cols-1 gap-1 border-t border-gray-200 px-4 py-4 text-sm md:grid-cols-3 md:gap-0"
              >
                <span className="font-bold text-[#1b3d3e]">{item.service}</span>
                <span className="text-gray-600">{item.price}</span>
                <span className="text-gray-600">{item.delivery}</span>
              </div>
            ))}
          </div>
        </section>

        <p className="mx-auto mt-8 max-w-4xl text-center text-sm leading-relaxed text-gray-500">
          All prices are exclusive of GST. Final pricing depends on exact
          requirements discussed in discovery call. Book a free 30-min
          consultation to get an accurate quote.
        </p>
      </section>
    </main>
  );
};

export default Pricing;
