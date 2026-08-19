import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeIndianRupee,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata, canonicalUrl, cleanExcerpt } from "@/app/seoConfig.js";
import {
  formatCareerLocation,
  formatCompensation,
  formatDeadline,
  getCareer,
} from "../careerData.js";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) return buildMetadata({ title: "Career Not Found | Kraviona", description: "This career opening is no longer available.", path: `/careers/${slug}`, robots: { index: false, follow: true } });
  return buildMetadata({
    title: career.seo?.metaTitle || `${career.jobTitle} Career | Kraviona`,
    description: career.seo?.metaDescription || cleanExcerpt(career.summary, 160),
    path: `/careers/${career.slug}`,
    keywords: career.seo?.keywords || career.skills || [],
    robots: career.seo?.noIndex ? { index: false, follow: true } : undefined,
  });
}

const employmentTypeMap = {
  "full-time": "FULL_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  temporary: "TEMPORARY",
  freelance: "CONTRACTOR",
};

function buildJobSchema(career) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: career.jobTitle,
    description: career.content,
    identifier: { "@type": "PropertyValue", name: "Kraviona Tech Solutions", value: career._id },
    datePosted: career.publishedAt || career.createdAt,
    employmentType: employmentTypeMap[career.employmentType] || "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Kraviona Tech Solutions",
      sameAs: "https://kraviona.com",
      logo: "https://kraviona.com/logo.png",
    },
    url: canonicalUrl(`/careers/${career.slug}`),
  };
  if (career.application?.deadline) schema.validThrough = career.application.deadline;
  if (career.workplaceType === "remote") {
    schema.jobLocationType = "TELECOMMUTE";
    schema.applicantLocationRequirements = { "@type": "Country", name: career.location?.country || "India" };
  } else {
    schema.jobLocation = {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        streetAddress: career.location?.address || undefined,
        addressLocality: career.location?.city || undefined,
        addressRegion: career.location?.state || undefined,
        postalCode: career.location?.postalCode || undefined,
        addressCountry: career.location?.country || "IN",
      },
    };
  }
  if (career.compensation?.isDisclosed && (career.compensation.minimum != null || career.compensation.maximum != null)) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: career.compensation.currency || "INR",
      value: {
        "@type": "QuantitativeValue",
        minValue: career.compensation.minimum ?? undefined,
        maxValue: career.compensation.maximum ?? undefined,
        unitText: String(career.compensation.period || "YEAR").toUpperCase(),
      },
    };
  }
  return schema;
}

function ListSection({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="border-t border-slate-200 pt-8">
      <h2 className="text-2xl font-black text-dark">{title}</h2>
      <ul className="mt-5 space-y-3">{items.map((item) => <li key={item} className="flex items-start gap-3 text-sm leading-7 text-slate-600"><CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" /> <span>{item}</span></li>)}</ul>
    </section>
  );
}

export default async function CareerDetailsPage({ params }) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();

  const applyHref = career.application?.url || `mailto:${career.application?.email}?subject=${encodeURIComponent(`Application for ${career.jobTitle}`)}`;
  const location = formatCareerLocation(career);

  return (
    <main className="bg-surface pb-20 text-dark">
      <JsonLd data={[
        buildJobSchema(career),
        breadcrumbSchema([
          { name: "Home", url: "https://kraviona.com" },
          { name: "Careers", url: "https://kraviona.com/careers" },
          { name: career.jobTitle, url: canonicalUrl(`/careers/${career.slug}`) },
        ]),
      ]} />

      <section className="bg-dark px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Link href="/careers" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent-hover"><ArrowLeft className="h-4 w-4" /> All careers</Link>
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-accent-hover">{career.department}</p><h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{career.jobTitle}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-primary-light">{career.summary}</p></div>
            <a href={applyHref} target={career.application?.url ? "_blank" : undefined} rel={career.application?.url ? "noreferrer" : undefined} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-accent-dark px-6 py-3.5 text-sm font-black text-white transition hover:brightness-90">Apply now <ArrowUpRight className="h-4 w-4" /></a>
          </div>
          <div className="mt-9 flex flex-wrap gap-3 text-sm font-bold text-white/85">{[
            [MapPin, location], [BriefcaseBusiness, career.employmentType], [Clock3, career.workplaceType], [Users, `${career.openings} opening${career.openings === 1 ? "" : "s"}`], [CalendarDays, formatDeadline(career.application?.deadline)],
          ].map(([Icon, label]) => <span key={label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2"><Icon className="h-4 w-4 text-accent-hover" /> {label}</span>)}</div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="space-y-8 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-9">
          <section><h2 className="text-2xl font-black text-dark">About the role</h2><p className="mt-5 whitespace-pre-line text-sm leading-8 text-slate-600">{career.content}</p></section>
          <ListSection title="What you will do" items={career.responsibilities} />
          <ListSection title="What we are looking for" items={career.requirements} />
          <ListSection title="Preferred qualifications" items={career.preferredQualifications} />
          <ListSection title="Benefits" items={career.benefits} />
        </article>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <section className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm"><h2 className="font-black text-dark">Role overview</h2><div className="mt-5 space-y-4 text-sm">{[
            [BriefcaseBusiness, "Experience", `${career.experience?.minimumYears || 0}${career.experience?.maximumYears != null ? `–${career.experience.maximumYears}` : "+"} years · ${career.experience?.level || "mid"}`],
            [BadgeIndianRupee, "Compensation", formatCompensation(career.compensation)],
            [MapPin, "Location", location],
          ].map(([Icon, label, value]) => <div key={label} className="flex gap-3"><span className="rounded-xl bg-primary-tint p-2 text-primary"><Icon className="h-4 w-4" /></span><div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-700">{value}</p></div></div>)}</div></section>
          {career.skills?.length ? <section className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm"><h2 className="font-black text-dark">Skills</h2><div className="mt-4 flex flex-wrap gap-2">{career.skills.map((skill) => <span key={skill} className="rounded-lg bg-primary-tint px-3 py-1.5 text-xs font-bold text-primary">{skill}</span>)}</div></section> : null}
          <section className="rounded-3xl bg-primary p-6 text-white"><h2 className="text-xl font-black">Ready to apply?</h2><p className="mt-2 text-sm leading-7 text-primary-light">{career.application?.instructions || "Share your profile and tell us why this role is a strong fit for you."}</p><a href={applyHref} target={career.application?.url ? "_blank" : undefined} rel={career.application?.url ? "noreferrer" : undefined} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-primary">Apply for this role <ArrowUpRight className="h-4 w-4" /></a></section>
        </aside>
      </div>
    </main>
  );
}
