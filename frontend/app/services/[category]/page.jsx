import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Facebook,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Twitter,
  Users,
} from "lucide-react";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { JsonLd } from "@/components/JsonLd";
import { canonicalUrl, defaultRobots, SITE_URL } from "@/app/seoConfig.js";
import {
  breadcrumbSchema as buildBreadcrumbSchema,
  faqSchema as buildFaqSchema,
  serviceSchema as buildServiceSchema,
} from "@/lib/schema";
import {
  CATEGORY_DETAILS,
  getServiceFaqs,
  SERVICE_EXPERT,
  SERVICE_LINKS,
  SERVICE_PAGES,
} from "../serviceData.js";
import { API_URL } from "@/utils/api";

export const revalidate = 3600;

const DEFAULT_TRUST_POINTS = [
  {
    title: "Clear ownership",
    description:
      "You know what Kraviona is handling, what is needed from your side, and what gets delivered at each step.",
  },
  {
    title: "No vague handover",
    description:
      "The work is explained in plain language with setup notes, next actions, and practical guidance after launch.",
  },
  {
    title: "Built for progress",
    description:
      "Every task connects back to a real business goal such as leads, speed, ranking, sales, automation, or cleaner operations.",
  },
];
const DEFAULT_SUCCESS_METRICS = [
  "Clear scope and accountable milestones",
  "Visible before-and-after improvements",
  "Lead, sales, ranking, speed, or workflow metrics",
  "Actionable reporting after implementation",
];
const DEFAULT_PROCESS_DESCRIPTIONS = [
  "We identify the highest-impact gaps before making implementation decisions.",
  "You get a practical scope with priorities, timeline, and next actions.",
  "Kraviona implements the work, reviews the result, and improves the next cycle.",
  "The process continues with measurement, reporting, and refinement.",
];

const mergeExpert = (overrides = {}) => {
  const expert = { ...SERVICE_EXPERT };
  Object.entries(overrides || {}).forEach(([key, value]) => {
    if (Array.isArray(value) ? value.length : String(value || "").trim())
      expert[key] = value;
  });
  expert.knowsAbout = expert.expertise?.length
    ? expert.expertise
    : expert.knowsAbout;
  expert.phoneHref =
    expert.phoneHref || `tel:${String(expert.phone || "").replace(/\s+/g, "")}`;
  return expert;
};

const normalizeService = (record, slug) => {
  if (!record) return null;
  const category = record.category || "General";
  const defaults = CATEGORY_DETAILS[category] || {};
  const name = record.title || record.name;
  const outcomes = (
    record.outcomes?.length ? record.outcomes : record.features || []
  ).map((item, index) =>
    typeof item === "string"
      ? {
          title: item,
          description: getOutcomeNote(item, { name, category }, index),
        }
      : {
          title: item.title,
          description:
            item.description ||
            getOutcomeNote(item.title, { name, category }, index),
        },
  );
  const process = (
    record.process?.length ? record.process : defaults.process || []
  ).map((item, index) =>
    typeof item === "string"
      ? {
          title: item,
          description:
            DEFAULT_PROCESS_DESCRIPTIONS[index] ||
            DEFAULT_PROCESS_DESCRIPTIONS[3],
        }
      : {
          title: item.title,
          description:
            item.description ||
            DEFAULT_PROCESS_DESCRIPTIONS[index] ||
            DEFAULT_PROCESS_DESCRIPTIONS[3],
        },
  );

  return {
    ...record,
    slug: record.slug || slug,
    name,
    category,
    hero: {
      eyebrow: record.hero?.eyebrow || category,
      title: record.hero?.title || name,
      highlight: record.hero?.highlight || "Services",
      description: record.hero?.description || record.description,
    },
    intro: record.intro || defaults.intro || record.description,
    outcomes,
    trustPoints: record.trustPoints?.length
      ? record.trustPoints
      : DEFAULT_TRUST_POINTS,
    deliverables: record.deliverables?.length
      ? record.deliverables
      : defaults.deliverables || [],
    idealFor: record.idealFor?.length
      ? record.idealFor
      : defaults.idealFor || [],
    successMetrics: record.successMetrics?.length
      ? record.successMetrics
      : DEFAULT_SUCCESS_METRICS,
    process,
    techStack: record.techStack || [],
    faqs: record.faqs || [],
    cta: {
      title: record.cta?.title || `Ready to start your ${name} project?`,
      description:
        record.cta?.description ||
        "Talk with Kraviona about your goals, current setup, and the most practical next step.",
      label: record.cta?.label || "Discuss Your Project",
      href: record.cta?.href || "/contact",
    },
    seo: record.seo || {},
    expert: mergeExpert(record.expert),
  };
};

const getService = async (slug) => {
  const cleanSlug = slug?.toLowerCase()?.trim();
  try {
    const response = await fetch(
      `${API_URL}/services/${encodeURIComponent(cleanSlug)}`,
      { next: { revalidate: 3600 }, headers: { Accept: "application/json" } },
    );
    if (response.ok) {
      const json = await response.json();
      if (json?.data) {
        const legacy = SERVICE_PAGES[cleanSlug] || {};
        return normalizeService(
          {
            ...legacy,
            ...json.data,
            outcomes: json.data.outcomes?.length
              ? json.data.outcomes
              : legacy.outcomes,
          },
          cleanSlug,
        );
      }
    }
  } catch {}
  return normalizeService(SERVICE_PAGES[cleanSlug], cleanSlug);
};

const getServiceLinks = async () => {
  try {
    const response = await fetch(`${API_URL}/services`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const json = await response.json();
      if (json?.data?.length) {
        const links = new Map(SERVICE_LINKS.map((item) => [item.href, item]));
        json.data.forEach((item) =>
          links.set(`/services/${item.slug}`, {
            name: item.title || item.name,
            href: `/services/${item.slug}`,
            category: item.category,
          }),
        );
        return Array.from(links.values());
      }
    }
  } catch {}
  return SERVICE_LINKS;
};
const STATIC_SERVICE_SLUGS = new Set([
  "ai-automation",
  "api-development",
  "backend-development",
  "database-architecture",
  "full-stack-development",
  "mern-stack-development",
  "nodejs-development",
  "react-development",
  "saas-development",
  "technical-seo",
  "ui-ux-design",
  "web-app-development",
  "web-performance-optimization",
]);

export function generateStaticParams() {
  return Object.keys(SERVICE_PAGES)
    .filter((category) => !STATIC_SERVICE_SLUGS.has(category))
    .map((category) => ({ category }));
}

// Every service slug comes from the local service catalogue. Treat any other
// path as a genuine 404 instead of redirecting it to the service index.
export const dynamicParams = true;

export async function generateMetadata({ params }) {
  const { category } = await params;
  const slug = category?.toLowerCase()?.trim();
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const pageUrl = canonicalUrl(`/services/${slug}`);
  const metaDescription = (
    service.seo?.metaDescription ||
    `Expert ${service.name} services in Delhi NCR from Kraviona. ${service.description}`
  )
    .replace(/\s+/g, " ")
    .slice(0, 160);

  return {
    title: service.seo?.metaTitle || `${service.name} Services in Delhi NCR`,
    description: metaDescription,
    keywords: service.seo?.keywords?.length
      ? service.seo.keywords
      : [
          service.name,
          `${service.name} India`,
          `${service.name} Services`,
          service.category,
          "Kraviona Tech Solutions",
        ],
    authors: [{ name: service.expert.name, url: SITE_URL }],
    creator: service.expert.name,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${service.name} Services | Kraviona`,
      description: service.description,
      url: pageUrl,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: service.seo?.ogImage || "/og-web-development.jpg",
          width: 1200,
          height: 630,
          alt: `${service.name} by Kraviona`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@KravionaTech",
      creator: "@KravionaTech",
      title: `${service.name} Services | Kraviona`,
      description: service.description,
      images: [service.seo?.ogImage || "/og-web-development.jpg"],
    },
    robots: service.seo?.noIndex
      ? { index: false, follow: false }
      : defaultRobots,
  };
}

export default async function ServicesDetails({ params }) {
  const { category } = await params;
  const slug = category?.toLowerCase()?.trim();
  const [service, serviceLinks] = await Promise.all([
    getService(slug),
    getServiceLinks(),
  ]);

  if (!service) {
    notFound();
  }

  const pageUrl = canonicalUrl(`/services/${slug}`);
  const serviceFaqs = service.faqs.length
    ? service.faqs
    : getServiceFaqs({
        ...service,
        outcomes: service.outcomes.map((item) => item.title),
      });
  const expert = service.expert;
  const relatedServices = serviceLinks
    .filter(
      (item) =>
        item.href !== `/services/${slug}` && item.category === service.category,
    )
    .slice(0, 4);

  const serviceJsonLd = buildServiceSchema({
    name: service.name,
    description: service.description,
    url: pageUrl,
  });

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/about#amar-kumar`,
    name: expert.name,
    jobTitle: expert.jobTitle,
    image: expert.image,
    email: expert.email,
    telephone: expert.phone,
    url: `${SITE_URL}/about`,
    sameAs: [
      expert.linkedin,
      expert.companyLinkedin,
      expert.twitter,
      expert.facebook,
      expert.website,
    ].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: expert.address,
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      postalCode: "110092",
      addressCountry: "IN",
    },
    worksFor: { "@id": "https://kraviona.com/#organization" },
    knowsAbout: expert.knowsAbout,
  };

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: canonicalUrl("/services") },
    { name: service.name, url: pageUrl },
  ]);
  const faqJsonLd = buildFaqSchema(serviceFaqs);

  return (
    <>
      <JsonLd
        data={[serviceJsonLd, personSchema, breadcrumbJsonLd, faqJsonLd].filter(
          Boolean,
        )}
      />

      <section className="relative overflow-hidden bg-[#1A2E33] pt-32 pb-24">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#F28C5E_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#F28C5E]">
              {service.hero.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {service.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C5E] to-[#E8622A]">
                {service.hero.highlight}
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
              {service.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={service.cta.href}
                className="inline-flex items-center justify-center px-7 py-4 bg-[#E8622A] text-white font-bold rounded-xl hover:bg-[#B84A1A] transition-colors"
              >
                {service.cta.label}
              </Link>
              <a
                href={expert.phoneHref}
                className="inline-flex items-center justify-center px-7 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call {expert.phone}
              </a>
              <a
                href={expert.whatsapp}
                className="inline-flex items-center justify-center px-7 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-14 items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E8622A] mb-3">
                What You Get
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A2E33] mb-4">
                Practical delivery focused on outcomes
              </h2>
              <p className="mb-8 max-w-3xl text-gray-600 leading-relaxed">
                {service.intro}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {service.outcomes.map((outcome, index) => (
                  <div
                    key={`${outcome.title}-${index}`}
                    className="p-6 rounded-xl border border-gray-200 bg-[#F5F7F8] transition-all duration-200 hover:border-[#E8622A]/40 hover:bg-white hover:shadow-sm"
                  >
                    <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#E8622A]/10 text-[#E8622A]">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <h3 className="font-bold text-[#1A2E33] leading-snug">
                      {outcome.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {outcome.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.trustPoints.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[#2A4A52]/15 bg-white p-5"
                  >
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#2A4A52]/10 text-[#2A4A52]">
                      {
                        [
                          <ShieldCheck key="shield" className="h-5 w-5" />,
                          <ClipboardCheck key="check" className="h-5 w-5" />,
                          <Rocket key="rocket" className="h-5 w-5" />,
                        ][index % 3]
                      }
                    </span>
                    <h3 className="font-extrabold text-[#1A2E33]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E8622A] mb-4">
                EEAT Expert Contact
              </p>
              <div className="flex items-center gap-4 mb-5">
                <Image
                  src={expert.image}
                  alt={`${expert.name}, ${expert.jobTitle}`}
                  width={64}
                  height={64}
                  sizes="64px"
                  unoptimized={expert.image?.startsWith("http")}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div>
                  <h2 className="font-extrabold text-[#1A2E33]">
                    {expert.name}
                  </h2>
                  <p className="text-sm font-semibold text-[#E8622A]">
                    {expert.jobTitle}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-5">
                {expert.bio}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <a
                  href={`mailto:${expert.email}`}
                  className="flex items-center gap-2 rounded-xl bg-[#F5F7F8] px-3 py-3 text-xs font-bold text-[#1A2E33] hover:text-[#E8622A]"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
                <a
                  href={expert.phoneHref}
                  className="flex items-center gap-2 rounded-xl bg-[#F5F7F8] px-3 py-3 text-xs font-bold text-[#1A2E33] hover:text-[#E8622A]"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={expert.whatsapp}
                  className="flex items-center gap-2 rounded-xl bg-[#F5F7F8] px-3 py-3 text-xs font-bold text-[#1A2E33] hover:text-[#E8622A]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={expert.website}
                  className="flex items-center gap-2 rounded-xl bg-[#F5F7F8] px-3 py-3 text-xs font-bold text-[#1A2E33] hover:text-[#E8622A]"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              </div>
              <div className="space-y-3 rounded-xl bg-[#F5F7F8] p-4 text-sm text-gray-600">
                <ContactLine
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={expert.email}
                />
                <ContactLine
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={expert.phone}
                />
                <ContactLine
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={expert.address}
                />
                <ContactLine
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Availability"
                  value={expert.availability}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Social Links
                </p>
                <div className="flex flex-wrap gap-2">
                  <SocialLink
                    href={expert.linkedin}
                    label="Amar LinkedIn"
                    icon={<Linkedin className="h-4 w-4" />}
                  />
                  <SocialLink
                    href={expert.companyLinkedin}
                    label="Kraviona LinkedIn"
                    icon={<Linkedin className="h-4 w-4" />}
                  />
                  <SocialLink
                    href={expert.twitter}
                    label="Twitter"
                    icon={<Twitter className="h-4 w-4" />}
                  />
                  <SocialLink
                    href={expert.facebook}
                    label="Facebook"
                    icon={<Facebook className="h-4 w-4" />}
                  />
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-[#E8622A]/20 bg-[#E8622A]/5 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-[#1A2E33]">
                  <BadgeCheck className="h-4 w-4 text-[#E8622A]" />
                  {expert.consultation}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {expert.responseTime}
                </p>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {expert.knowsAbout.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#2A4A52]/20 px-3 py-1 text-xs font-semibold text-[#2A4A52]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Trust Signals
                </p>
                <ul className="space-y-2">
                  {expert.credentials.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-gray-600"
                    >
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#E8622A]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5F7F8] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DetailPanel
              icon={<ClipboardCheck className="h-5 w-5" />}
              title="Detailed Deliverables"
              items={service.deliverables}
            />
            <DetailPanel
              icon={<Users className="h-5 w-5" />}
              title="Best Fit For"
              items={service.idealFor}
            />
            <DetailPanel
              icon={<BarChart3 className="h-5 w-5" />}
              title="How Success Is Measured"
              items={service.successMetrics}
            />
          </div>
        </div>
      </section>

      {service.techStack.length > 0 && (
        <section className="border-b border-gray-100 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="mb-5 text-center text-xs font-black uppercase tracking-[0.2em] text-[#E8622A]">
              Technology & Tools
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {service.techStack.map((technology) => (
                <span
                  key={technology}
                  className="rounded-xl border border-[#2A4A52]/15 bg-[#F5F7F8] px-5 py-3 text-sm font-bold text-[#1A2E33]"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E8622A] mb-3">
              Work Process
            </p>
            <h2 className="text-3xl font-extrabold text-[#1A2E33]">
              A clear path from first discussion to measurable improvement
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {service.process.map((step, index) => (
              <div
                key={`${step.title}-${index}`}
                className="rounded-xl bg-white p-6 border border-gray-200"
              >
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1A2E33] text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-extrabold text-[#1A2E33] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1A2E33] to-[#2A4A52] px-6 py-14 text-center text-white shadow-xl sm:px-10">
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#F28C5E_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              {service.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-200">
              {service.cta.description}
            </p>
            <Link
              href={service.cta.href}
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#E8622A] px-7 py-4 font-bold text-white transition-colors hover:bg-white hover:text-[#1A2E33]"
            >
              {service.cta.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F5F7F8]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#E8622A] mb-3">
              Questions
            </p>
            <h2 className="text-3xl font-extrabold text-[#1A2E33]">
              Common questions about {service.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {serviceFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="mb-3 flex items-start gap-2 text-base font-extrabold text-[#1A2E33]">
                  <Rocket className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#E8622A]" />
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-bold text-[#1A2E33] mb-5">
              Related Services
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-5 py-2.5 border border-[#2A4A52]/30 text-[#2A4A52] rounded-full font-semibold text-sm hover:bg-[#2A4A52] hover:text-white transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ContactFormDetails />
    </>
  );
}

const ContactLine = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 text-[#E8622A]">{icon}</span>
    <div>
      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="font-semibold text-[#1A2E33]">{value}</p>
    </div>
  </div>
);

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noreferrer"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1A2E33] transition-colors hover:border-[#E8622A] hover:bg-[#E8622A] hover:text-white"
  >
    {icon}
  </a>
);

const DetailPanel = ({ icon, title, items }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8622A]/10 text-[#E8622A]">
        {icon}
      </span>
      <h2 className="text-lg font-extrabold text-[#1A2E33]">{title}</h2>
    </div>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
          <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#2A4A52]" />
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

function getOutcomeNote(outcome, service, index) {
  const categoryNotes = {
    "Web Development": [
      `We turn this into a working ${service.name.toLowerCase()} setup that is easy to use, responsive, and ready for real users.`,
      "Your pages, flows, and components are planned so future edits do not become messy or expensive.",
      "Performance, mobile experience, and SEO basics are considered while the feature is being built.",
      "You get launch support and clear guidance, so the project does not end with confusing handover files.",
    ],
    "Backend & Architecture": [
      "The backend is planned around stable data flow, clear access rules, and predictable behavior under real usage.",
      "APIs, databases, and integrations are shaped so your team can extend them without fighting the system later.",
      "Security, validation, and error handling are included in the thinking from the beginning.",
      "You get practical documentation and release support so other tools or teams can connect smoothly.",
    ],
    "Performance & AI": [
      "We focus on changes that save time, improve speed, or make your website easier for users and search engines to understand.",
      "Automation is mapped around your current workflow first, so the tool solves a real daily problem.",
      "Implementation is measured with visible checkpoints instead of vague promises.",
      "You get recommendations that are practical for your team, budget, and current technical setup.",
    ],
    "Branding & Marketing": [
      "The work is tied to your audience, offer, and channel, so the campaign feels intentional instead of random.",
      "Messaging, creative direction, and tracking are planned together for clearer decision-making.",
      "We keep the focus on qualified attention, not vanity activity that does not move the business.",
      "You get reporting that explains what happened, what improved, and what should be tested next.",
    ],
    "Marketplace & Seller": [
      "We clean up the operational details that usually slow sellers down, from catalog structure to account hygiene.",
      "Listings, ads, reports, or training are handled with marketplace rules and buyer behavior in mind.",
      "The goal is to make daily selling easier while improving visibility, account clarity, and profit awareness.",
      "You get repeatable steps your team can follow after the initial work is complete.",
    ],
  };

  return (
    categoryNotes[service.category]?.[index] ||
    `This part of ${service.name.toLowerCase()} is handled with clear planning, practical execution, and simple communication.`
  );
}
