import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/app/seoConfig.js";
import {
  formatCareerLocation,
  formatDeadline,
  getCareers,
} from "./careerData.js";

export const metadata = buildMetadata({
  title: "Careers at Kraviona | Build Technology That Creates Impact",
  description:
    "Explore open roles at Kraviona Tech Solutions across engineering, design, SEO, marketing, and operations. Join a practical, ambitious technology team.",
  path: "/careers",
  keywords: [
    "Kraviona careers",
    "technology jobs India",
    "MERN stack developer jobs",
    "Next.js jobs",
    "SEO careers India",
  ],
});

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://kraviona.com/careers#webpage",
  url: "https://kraviona.com/careers",
  name: "Careers at Kraviona Tech Solutions",
  description:
    "Current career opportunities at Kraviona Tech Solutions.",
  isPartOf: { "@id": "https://kraviona.com/#website" },
};

export default async function CareersPage({ searchParams }) {
  const query = await searchParams;
  const filters = {
    search: typeof query?.search === "string" ? query.search : "",
    workplaceType:
      typeof query?.workplaceType === "string" ? query.workplaceType : "",
    employmentType:
      typeof query?.employmentType === "string" ? query.employmentType : "",
    limit: 50,
  };
  const { data: careers } = await getCareers(filters);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: careers.map((career, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://kraviona.com/careers/${career.slug}`,
      name: career.jobTitle,
    })),
  };

  return (
    <main className="bg-surface text-dark">
      <JsonLd
        data={[
          collectionSchema,
          itemListSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Careers", url: "https://kraviona.com/careers" },
          ]),
        ]}
      />

      <section className="relative overflow-hidden bg-dark px-5 py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(216,94,61,0.25),transparent_35rem)]" />
        <div className="relative mx-auto max-w-7xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-accent-hover">
            <Sparkles className="h-4 w-4" /> Build your next chapter
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Do meaningful work with a team that values ownership.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-primary-light sm:text-lg">
            Join Kraviona to build fast products, solve practical business
            problems, and grow through direct responsibility—not layers of
            process.
          </p>
          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              [Users, "Small, focused teams"],
              [BriefcaseBusiness, "High-ownership roles"],
              [Sparkles, "Continuous learning"],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] p-4 text-sm font-bold">
                <Icon className="h-5 w-5 text-accent-hover" /> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-primary/10 bg-white px-5 py-7">
        <form className="mx-auto grid max-w-7xl gap-3 md:grid-cols-[1fr_220px_220px_auto]" action="/careers">
          <label className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input name="search" defaultValue={filters.search} placeholder="Search roles or skills" className="min-h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
          <select name="workplaceType" defaultValue={filters.workplaceType} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-primary">
            <option value="">All work setups</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="on-site">On-site</option>
          </select>
          <select name="employmentType" defaultValue={filters.employmentType} className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-primary">
            <option value="">All employment types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
          </select>
          <button className="min-h-12 rounded-xl bg-primary px-6 text-sm font-black text-white transition hover:bg-primary-hover">Find roles</button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-accent-dark">Open opportunities</p><h2 className="mt-2 text-3xl font-black text-dark">Find your place at Kraviona</h2></div>
          <p className="text-sm font-semibold text-slate-500">{careers.length} active opening{careers.length === 1 ? "" : "s"}</p>
        </div>

        {careers.length ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {careers.map((career) => (
              <article key={career._id} className="group flex flex-col rounded-3xl border border-primary/15 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl sm:p-7">
                <div className="flex items-start justify-between gap-4"><span className="rounded-2xl bg-primary-tint p-3 text-primary"><BriefcaseBusiness className="h-6 w-6" /></span>{career.isFeatured ? <span className="rounded-full bg-accent-tint px-3 py-1 text-[10px] font-black uppercase tracking-wider text-accent-dark">Featured</span> : null}</div>
                <p className="mt-6 text-xs font-black uppercase tracking-[0.16em] text-accent-dark">{career.department}</p>
                <h3 className="mt-2 text-2xl font-black text-dark">{career.jobTitle}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">{career.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-slate-600"><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5"><MapPin className="h-3.5 w-3.5" /> {formatCareerLocation(career)}</span><span className="rounded-full bg-slate-100 px-3 py-1.5">{career.employmentType}</span><span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5"><Clock3 className="h-3.5 w-3.5" /> {formatDeadline(career.application?.deadline)}</span></div>
                <div className="mt-5 flex flex-wrap gap-2">{(career.skills || []).slice(0, 5).map((skill) => <span key={skill} className="rounded-lg border border-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{skill}</span>)}</div>
                <Link href={`/careers/${career.slug}`} className="mt-7 inline-flex min-h-11 items-center gap-2 self-start rounded-xl bg-dark px-5 py-3 text-sm font-black text-white transition group-hover:bg-primary">View opportunity <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-primary/25 bg-white px-6 py-16 text-center"><BriefcaseBusiness className="mx-auto h-10 w-10 text-primary" /><h2 className="mt-4 text-xl font-black text-dark">No matching roles right now</h2><p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-600">Try changing the filters or check back soon. You can also introduce yourself through our contact page.</p><Link href="/contact" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-black text-white">Contact our team</Link></div>
        )}
      </section>
    </main>
  );
}
