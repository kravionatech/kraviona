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

const PRICING_URL = "https://kraviona.com/pricing";

const getDisplayedStartingPrice = (priceFrom) => {
  const numericPrice = String(priceFrom).replace(/[^\d]/g, "");
  return numericPrice || null;
};

const pricedTierOffers = pricingTiers.flatMap((tier) => {
  const price = getDisplayedStartingPrice(tier.priceFrom);

  if (!price) return [];

  return [
    {
      "@type": "Offer",
      name: `${tier.name} Plan`,
      url: PRICING_URL,
      price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      description: `Starting at ${tier.priceFrom} ${tier.priceSuffix}.`,
      itemOffered: {
        "@type": "Service",
        name: `${tier.name} Plan`,
        description: `${tier.tagline}. Delivery timeline: ${tier.timeline}.`,
      },
    },
  ];
});

const pricingItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${PRICING_URL}#pricing-plans`,
  name: "Kraviona web development pricing plans",
  itemListElement: pricingTiers.map((tier, index) => {
    const price = getDisplayedStartingPrice(tier.priceFrom);

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: `${tier.name} Plan`,
        description: `${tier.tagline}. Delivery timeline: ${tier.timeline}. ${tier.priceFrom} ${tier.priceSuffix}.`,
        url: PRICING_URL,
        ...(price && {
          offers: {
            "@type": "Offer",
            price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
          },
        }),
      },
    };
  }),
};

const pricingOfferSchema = {
  "@context": "https://schema.org",
  "@type": "AggregateOffer",
  name: "Kraviona starting-price web development plans",
  url: PRICING_URL,
  priceCurrency: "INR",
  lowPrice: String(Math.min(...pricedTierOffers.map((offer) => Number(offer.price)))),
  highPrice: String(Math.max(...pricedTierOffers.map((offer) => Number(offer.price)))),
  offerCount: pricedTierOffers.length,
  availability: "https://schema.org/InStock",
  description:
    "Published starting prices for Starter and Growth plans. Enterprise pricing is custom.",
  seller: { "@id": "https://kraviona.com/#organization" },
  offers: pricedTierOffers,
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-surface px-4 py-28 sm:px-6 lg:px-8">
      <JsonLd
        data={[
          pricingOfferSchema,
          pricingItemListSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Pricing", url: "https://kraviona.com/pricing" },
          ]),
        ]}
      />

      <section className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="text-accent-dark font-bold tracking-[0.3em] text-[10px] uppercase">
            Transparent Pricing
          </span>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold text-primary tracking-tight leading-tight">
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
              className={`relative flex h-full flex-col rounded-2xl border p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-brand-md ${
                tier.highlight
                  ? "border-primary bg-primary text-white ring-2 ring-accent/20"
                  : "border-primary/15 bg-white"
              }`}
            >
              {tier.highlight && (
                <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Popular
                </span>
              )}
              <div>
                <h2 className={`text-2xl font-black ${tier.highlight ? "text-white" : "text-primary"}`}>
                  {tier.name}
                </h2>
                <p className={`mt-2 text-sm font-semibold ${tier.highlight ? "text-white/75" : "text-brand-muted"}`}>
                  {tier.tagline}
                </p>
                <div className="mt-6">
                  <span className={`text-4xl font-black ${tier.highlight ? "text-white" : "text-accent-dark"}`}>
                    {tier.priceFrom}
                  </span>
                  <span className={`ml-2 text-sm font-bold ${tier.highlight ? "text-white/75" : "text-brand-muted"}`}>
                    {tier.priceSuffix}
                  </span>
                </div>
                <p className={`mt-3 text-sm font-bold ${tier.highlight ? "text-accent-hover" : "text-accent-dark"}`}>
                  Timeline: {tier.timeline}
                </p>
              </div>

              <ul className="mt-7 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className={`flex gap-3 text-sm leading-relaxed ${tier.highlight ? "text-white/85" : "text-brand-muted"}`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-xs font-black ${tier.highlight ? "bg-white/15 text-accent-hover" : "bg-primary-tint text-primary"}`}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.ctaLink}
                className={`mt-8 inline-flex min-h-11 items-center justify-center rounded-xl px-6 py-3.5 text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-hover ${
                  tier.highlight
                    ? "bg-accent-dark text-white hover:brightness-90"
                    : "border-2 border-accent-dark text-accent-dark hover:bg-primary hover:text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-primary/15 bg-white p-6 shadow-card md:p-8">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-accent-dark font-bold tracking-[0.24em] text-[10px] uppercase">
                SEO Add-ons
              </span>
              <h2 className="mt-2 text-2xl font-black text-primary">
                Focused optimisation packages
              </h2>
            </div>
            <Link
              href="/contact"
              className="text-sm font-black text-primary hover:text-accent-dark"
            >
              Request custom quote →
            </Link>
          </div>

          <div className="overflow-hidden rounded-xl border border-primary/15">
            <div className="grid grid-cols-3 bg-primary-tint px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-primary">
              <span>Service</span>
              <span>Price</span>
              <span>Delivery</span>
            </div>
            {seoPricing.map((item) => (
              <div
                key={item.service}
                className="grid grid-cols-1 gap-1 border-t border-primary/15 px-4 py-4 text-sm md:grid-cols-3 md:gap-0"
              >
                <span className="font-bold text-primary">{item.service}</span>
                <span className="text-brand-muted">{item.price}</span>
                <span className="text-brand-muted">{item.delivery}</span>
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
    </div>
  );
};

export default Pricing;
