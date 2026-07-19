import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
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
import {
  canonicalUrl,
  defaultRobots,
  SITE_NAME,
  SITE_URL,
} from "@/app/seoConfig.js";
import {
  breadcrumbSchema as buildBreadcrumbSchema,
  faqSchema as buildFaqSchema,
  serviceSchema as buildServiceSchema,
} from "@/lib/schema";
import {
  CATEGORY_DETAILS,
  SERVICE_EXPERT,
  SERVICE_LINKS,
  SERVICE_PAGES,
} from "../serviceData.js";

const getService = (slug) => SERVICE_PAGES[slug?.toLowerCase()?.trim()];
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

export async function generateMetadata({ params }) {
  const { category } = await params;
  const slug = category?.toLowerCase()?.trim();
  const service = getService(slug);

  if (!service) {
    return {
      title: "Services",
      alternates: { canonical: canonicalUrl("/services") },
    };
  }

  const pageUrl = canonicalUrl(`/services/${slug}`);

  return {
    title: `${service.name} Services India | ${SITE_NAME}`,
    description: `${service.description} Talk to ${SERVICE_EXPERT.name}, ${SERVICE_EXPERT.jobTitle} at Kraviona, for a practical service plan.`,
    keywords: [
      service.name,
      `${service.name} India`,
      `${service.name} Services`,
      service.category,
      "Kraviona Tech Solutions",
    ],
    authors: [{ name: SERVICE_EXPERT.name, url: SITE_URL }],
    creator: SERVICE_EXPERT.name,
    alternates: { canonical: pageUrl },
    openGraph: {
      title: `${service.name} Services | Kraviona`,
      description: service.description,
      url: pageUrl,
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: "/og-web-development.jpg",
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
      images: ["/og-web-development.jpg"],
    },
    robots: defaultRobots,
  };
}

export default async function ServicesDetails({ params }) {
  const { category } = await params;
  const slug = category?.toLowerCase()?.trim();
  const service = getService(slug);

  if (!service) {
    redirect("/services");
  }

  const pageUrl = canonicalUrl(`/services/${slug}`);
  const details = CATEGORY_DETAILS[service.category];
  const relatedServices = SERVICE_LINKS.filter(
    (item) => item.href !== `/services/${slug}` && item.category === service.category,
  ).slice(0, 4);

  const serviceJsonLd = buildServiceSchema({
    name: service.name,
    description: service.description,
    url: pageUrl,
  });

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/about#amar-kumar`,
    name: SERVICE_EXPERT.name,
    jobTitle: SERVICE_EXPERT.jobTitle,
    image: SERVICE_EXPERT.image,
    email: SERVICE_EXPERT.email,
    telephone: SERVICE_EXPERT.phone,
    url: `${SITE_URL}/about`,
    sameAs: [
      SERVICE_EXPERT.linkedin,
      SERVICE_EXPERT.companyLinkedin,
      SERVICE_EXPERT.twitter,
      SERVICE_EXPERT.facebook,
      SERVICE_EXPERT.website,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "East Delhi",
      addressLocality: "Delhi",
      addressRegion: "Delhi",
      postalCode: "110092",
      addressCountry: "IN",
    },
    worksFor: { "@id": "https://kraviona.com/#organization" },
    knowsAbout: SERVICE_EXPERT.knowsAbout,
  };

  const breadcrumbJsonLd = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Services", url: canonicalUrl("/services") },
    { name: service.name, url: pageUrl },
  ]);
  const faqJsonLd = buildFaqSchema(details?.faqs || []);

  return (
    <>
      <JsonLd
        data={[serviceJsonLd, personSchema, breadcrumbJsonLd, faqJsonLd].filter(
          Boolean,
        )}
      />

      <section className="relative overflow-hidden bg-[#081314] pt-32 pb-24">
        <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#f4be78_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[#f4be78]">
              {service.category}
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {service.name}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
                Services
              </span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl leading-relaxed mb-10">
              {service.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-4 bg-[#d96c4e] text-white font-bold rounded-xl hover:bg-[#c25e41] transition-colors"
              >
                Discuss This Service
              </Link>
              <a
                href={SERVICE_EXPERT.phoneHref}
                className="inline-flex items-center justify-center px-7 py-4 border border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call {SERVICE_EXPERT.phone}
              </a>
              <a
                href={SERVICE_EXPERT.whatsapp}
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
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d96c4e] mb-3">
                What You Get
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#111A1F] mb-4">
                Practical delivery focused on outcomes
              </h2>
              <p className="mb-8 max-w-3xl text-gray-600 leading-relaxed">
                {details?.intro}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {service.outcomes.map((outcome, index) => (
                  <div
                    key={outcome}
                    className="p-6 rounded-xl border border-gray-200 bg-[#FAFCFC] transition-all duration-200 hover:border-[#d96c4e]/40 hover:bg-white hover:shadow-sm"
                  >
                    <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#d96c4e]/10 text-[#d96c4e]">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <h3 className="font-bold text-[#111A1F] leading-snug">
                      {outcome}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {getOutcomeNote(outcome, service, index)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: <ShieldCheck className="h-5 w-5" />,
                    title: "Clear ownership",
                    text: "You know what Kraviona is handling, what is needed from your side, and what gets delivered at each step.",
                  },
                  {
                    icon: <ClipboardCheck className="h-5 w-5" />,
                    title: "No vague handover",
                    text: "The work is explained in plain language with setup notes, next actions, and practical guidance after launch.",
                  },
                  {
                    icon: <Rocket className="h-5 w-5" />,
                    title: "Built for progress",
                    text: "Every task connects back to a real business goal, such as leads, speed, ranking, sales, automation, or cleaner operations.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-[#295c5e]/15 bg-white p-5"
                  >
                    <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#295c5e]/10 text-[#295c5e]">
                      {item.icon}
                    </span>
                    <h3 className="font-extrabold text-[#111A1F]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d96c4e] mb-4">
                EEAT Expert Contact
              </p>
              <div className="flex items-center gap-4 mb-5">
                <Image
                  src={SERVICE_EXPERT.image}
                  alt={SERVICE_EXPERT.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div>
                  <h2 className="font-extrabold text-[#111A1F]">
                    {SERVICE_EXPERT.name}
                  </h2>
                  <p className="text-sm font-semibold text-[#d96c4e]">
                    {SERVICE_EXPERT.jobTitle}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-gray-600 mb-5">
                {SERVICE_EXPERT.bio}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                <a
                  href={`mailto:${SERVICE_EXPERT.email}`}
                  className="flex items-center gap-2 rounded-xl bg-[#FAFCFC] px-3 py-3 text-xs font-bold text-[#1b3d3e] hover:text-[#d96c4e]"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
                <a
                  href={SERVICE_EXPERT.phoneHref}
                  className="flex items-center gap-2 rounded-xl bg-[#FAFCFC] px-3 py-3 text-xs font-bold text-[#1b3d3e] hover:text-[#d96c4e]"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={SERVICE_EXPERT.whatsapp}
                  className="flex items-center gap-2 rounded-xl bg-[#FAFCFC] px-3 py-3 text-xs font-bold text-[#1b3d3e] hover:text-[#d96c4e]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
                <a
                  href={SERVICE_EXPERT.website}
                  className="flex items-center gap-2 rounded-xl bg-[#FAFCFC] px-3 py-3 text-xs font-bold text-[#1b3d3e] hover:text-[#d96c4e]"
                >
                  <Globe className="h-4 w-4" />
                  Website
                </a>
              </div>
              <div className="space-y-3 rounded-xl bg-[#FAFCFC] p-4 text-sm text-gray-600">
                <ContactLine
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={SERVICE_EXPERT.email}
                />
                <ContactLine
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={SERVICE_EXPERT.phone}
                />
                <ContactLine
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={SERVICE_EXPERT.address}
                />
                <ContactLine
                  icon={<CalendarDays className="h-4 w-4" />}
                  label="Availability"
                  value={SERVICE_EXPERT.availability}
                />
              </div>
              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Social Links
                </p>
                <div className="flex flex-wrap gap-2">
                  <SocialLink
                    href={SERVICE_EXPERT.linkedin}
                    label="Amar LinkedIn"
                    icon={<Linkedin className="h-4 w-4" />}
                  />
                  <SocialLink
                    href={SERVICE_EXPERT.companyLinkedin}
                    label="Kraviona LinkedIn"
                    icon={<Linkedin className="h-4 w-4" />}
                  />
                  <SocialLink
                    href={SERVICE_EXPERT.twitter}
                    label="Twitter"
                    icon={<Twitter className="h-4 w-4" />}
                  />
                  <SocialLink
                    href={SERVICE_EXPERT.facebook}
                    label="Facebook"
                    icon={<Facebook className="h-4 w-4" />}
                  />
                </div>
              </div>
              <div className="mt-5 rounded-xl border border-[#d96c4e]/20 bg-[#d96c4e]/5 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-[#111A1F]">
                  <BadgeCheck className="h-4 w-4 text-[#d96c4e]" />
                  {SERVICE_EXPERT.consultation}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {SERVICE_EXPERT.responseTime}
                </p>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                  Expertise
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_EXPERT.knowsAbout.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#295c5e]/20 px-3 py-1 text-xs font-semibold text-[#295c5e]"
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
                  {SERVICE_EXPERT.credentials.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs font-semibold leading-relaxed text-gray-600"
                    >
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#d96c4e]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FAFCFC] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DetailPanel
              icon={<ClipboardCheck className="h-5 w-5" />}
              title="Detailed Deliverables"
              items={details?.deliverables || []}
            />
            <DetailPanel
              icon={<Users className="h-5 w-5" />}
              title="Best Fit For"
              items={details?.idealFor || []}
            />
            <DetailPanel
              icon={<BarChart3 className="h-5 w-5" />}
              title="How Success Is Measured"
              items={[
                "Clear scope and accountable milestones",
                "Visible before-and-after improvements",
                "Lead, sales, ranking, speed, or workflow metrics",
                "Actionable reporting after implementation",
              ]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d96c4e] mb-3">
              Work Process
            </p>
            <h2 className="text-3xl font-extrabold text-[#111A1F]">
              A clear path from first discussion to measurable improvement
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(details?.process || [
              "Audit the current state",
              "Plan clear priorities",
              "Build and improve",
            ]).map((step, index) => (
              <div key={step} className="rounded-xl bg-white p-6 border border-gray-200">
                <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1b3d3e] text-sm font-black text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-extrabold text-[#111A1F] mb-3">
                  {step}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">
                  {index === 0 &&
                    "We identify the highest-impact gaps before making implementation decisions."}
                  {index === 1 &&
                    "You get a practical scope with priorities, timeline, and next actions."}
                  {index === 2 &&
                    "Kraviona implements the work, reviews the result, and improves the next cycle."}
                  {index > 2 &&
                    "The process continues with measurement, reporting, and refinement."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FAFCFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#d96c4e] mb-3">
              Questions
            </p>
            <h2 className="text-3xl font-extrabold text-[#111A1F]">
              Common questions about {service.name}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(details?.faqs || []).map((faq) => (
              <div key={faq.question} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="mb-3 flex items-start gap-2 text-base font-extrabold text-[#111A1F]">
                  <Rocket className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#d96c4e]" />
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
            <h2 className="text-lg font-bold text-[#111A1F] mb-5">
              Related Services
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedServices.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-5 py-2.5 border border-[#295c5e]/30 text-[#295c5e] rounded-full font-semibold text-sm hover:bg-[#295c5e] hover:text-white transition-all"
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
    <span className="mt-0.5 text-[#d96c4e]">{icon}</span>
    <div>
      <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="font-semibold text-[#1b3d3e]">{value}</p>
    </div>
  </div>
);

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noreferrer"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-[#1b3d3e] transition-colors hover:border-[#d96c4e] hover:bg-[#d96c4e] hover:text-white"
  >
    {icon}
  </a>
);

const DetailPanel = ({ icon, title, items }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#d96c4e]/10 text-[#d96c4e]">
        {icon}
      </span>
      <h2 className="text-lg font-extrabold text-[#111A1F]">{title}</h2>
    </div>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
          <ArrowUpRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#295c5e]" />
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
