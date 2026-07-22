import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Github,
  Globe,
  Linkedin,
  Mail,
  Search,
  ShieldCheck,
  Twitter,
  Users,
} from "lucide-react";

import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";

const fallbackMembers = [
  {
    name: "Amar Kumar",
    slug: "amar-kumar",
    designation: "Founder & Lead Engineer",
    department: "Engineering",
    bio: "Amar leads Kraviona's technical direction across MERN stack builds, Next.js websites, backend systems, and technical SEO foundations.",
    avatar: "/amar.jpeg",
    skills: ["MERN Stack", "Next.js", "Node.js", "Technical SEO"],
    socialLinks: [
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/amarkumar96085/",
      },
      { name: "Twitter", url: "https://twitter.com/KravionaTech" },
    ],
    isFeatured: true,
  },
];

const pillars = [
  {
    title: "Product Engineering",
    description:
      "We plan, design, and ship web products with clean architecture and maintainable code.",
    icon: Code2,
  },
  {
    title: "Technical SEO",
    description:
      "Every build is shaped for crawlability, performance, structured data, and long-term search growth.",
    icon: Search,
  },
  {
    title: "Reliable Delivery",
    description:
      "Clients get direct communication, practical timelines, and careful release support after launch.",
    icon: ShieldCheck,
  },
];

const allowedImageHosts = [
  "res.cloudinary.com",
  "images.pexels.com",
  "img.freepik.com",
  "images.unsplash.com",
  "api.kraviona.com",
  "kraviona.com",
  "cdn.jsdelivr.net",
];

export const metadata = buildMetadata({
  title: "Kraviona Team | MERN Stack, Next.js & Technical SEO Experts",
  description:
    "Meet the Kraviona team building fast MERN stack applications, Next.js websites, backend APIs, and technical SEO systems for growing businesses.",
  path: "/team",
  image: "/og-image.jpg",
  imageAlt: "Kraviona team and founder",
  keywords: [
    "Kraviona team",
    "Kraviona Tech Solutions team",
    "MERN stack developers India",
    "Next.js development team",
    "technical SEO experts India",
  ],
});

async function getTeamMembers() {
  try {
    const response = await fetch(`${API_URL}/public/team`, {
      next: { revalidate: 300 },
    });

    if (!response.ok) return fallbackMembers;

    const data = await response.json();
    const members = Array.isArray(data?.data) ? data.data : [];

    return members.length ? members : fallbackMembers;
  } catch {
    return fallbackMembers;
  }
}

function getImageSrc(member) {
  const avatar = member.avatar || "";

  if (!avatar) return "/amar.jpeg";
  if (avatar.startsWith("/")) return avatar;

  try {
    const url = new URL(avatar);
    return allowedImageHosts.includes(url.hostname) ? avatar : "/amar.jpeg";
  } catch {
    return "/amar.jpeg";
  }
}

function getSocialIcon(name = "") {
  const key = name.toLowerCase();
  if (key.includes("linkedin")) return Linkedin;
  if (key.includes("twitter") || key.includes("x")) return Twitter;
  if (key.includes("github")) return Github;
  if (key.includes("mail") || key.includes("email")) return Mail;
  return Globe;
}

function teamSchema(members) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://kraviona.com/team#team",
    name: "Kraviona Team",
    itemListElement: members.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.designation,
        image: member.avatar || "https://kraviona.com/amar.jpeg",
        worksFor: {
          "@type": "Organization",
          name: "Kraviona Tech Solutions",
          url: "https://kraviona.com",
        },
        sameAs: (member.socialLinks || [])
          .map((link) => link.url)
          .filter(Boolean),
      },
    })),
  };
}

const TeamPage = async () => {
  const members = await getTeamMembers();
  const featured = members.find((member) => member.isFeatured) || members[0];
  const departments = [...new Set(members.map((m) => m.department).filter(Boolean))];

  return (
    <main className="min-h-screen bg-white text-[#1b3d3e]">
      <JsonLd
        data={[
          teamSchema(members),
          breadcrumbSchema([
            { name: "Home", url: "https://kraviona.com" },
            { name: "Team", url: "https://kraviona.com/team" },
          ]),
        ]}
      />

      <section className="border-b border-[#1b3d3e]/10 bg-[#f7faf9]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1fr_420px] md:items-center lg:px-8 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96c4e]">
              Kraviona Team
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight text-[#1b3d3e] sm:text-5xl lg:text-6xl">
              The people building fast, search-ready digital systems.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Kraviona is a founder-led technology team focused on MERN stack
              development, Next.js websites, backend APIs, automation, and
              technical SEO for businesses that need dependable execution.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#1b3d3e] px-5 text-sm font-bold text-white transition-colors hover:bg-[#254f51]"
              >
                Work with the team
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#1b3d3e]/15 bg-white px-5 text-sm font-bold text-[#1b3d3e] transition-colors hover:border-[#d96c4e] hover:text-[#d96c4e]"
              >
                Explore services
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div>
                <dt className="text-3xl font-black text-[#d96c4e]">
                  {members.length}+
                </dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Team members
                </dd>
              </div>
              <div>
                <dt className="text-3xl font-black text-[#d96c4e]">
                  {departments.length || 1}
                </dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Disciplines
                </dd>
              </div>
              <div>
                <dt className="text-3xl font-black text-[#d96c4e]">MERN</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Core stack
                </dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 hidden h-40 w-2 bg-[#d96c4e] md:block" />
            <div className="overflow-hidden rounded-lg border border-[#1b3d3e]/10 bg-white shadow-xl shadow-[#1b3d3e]/10">
              <div className="relative aspect-[4/5]">
                <Image
                  src={getImageSrc(featured)}
                  alt={featured.name}
                  fill
                  sizes="(min-width: 768px) 420px, 100vw"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d96c4e]">
                  Featured
                </p>
                <h2 className="mt-2 text-2xl font-black text-[#1b3d3e]">
                  {featured.name}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {featured.designation}
                </p>
                {featured.bio && (
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {featured.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-12 md:grid-cols-3 lg:px-8">
          {pillars.map(({ title, description, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-slate-200 p-6">
              <Icon className="h-6 w-6 text-[#d96c4e]" />
              <h2 className="mt-5 text-lg font-black text-[#1b3d3e]">
                {title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fbfcfc]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96c4e]">
                Meet The Team
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1b3d3e] sm:text-4xl">
                Builders, strategists, and technical problem solvers.
              </h2>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#1b3d3e]/10 bg-white px-4 py-2 text-sm font-semibold text-slate-600">
              <Users className="h-4 w-4 text-[#d96c4e]" />
              {departments.join(" / ") || "Engineering"}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <article
                key={member._id || member.slug || member.name}
                className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={getImageSrc(member)}
                      alt={member.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-black text-[#1b3d3e]">
                      {member.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#d96c4e]">
                      {member.designation}
                    </p>
                    {member.department && (
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {member.department}
                      </p>
                    )}
                  </div>
                </div>

                {member.bio && (
                  <p className="mt-5 line-clamp-4 text-sm leading-7 text-slate-600">
                    {member.bio}
                  </p>
                )}

                {Array.isArray(member.skills) && member.skills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {member.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-[#f7faf9] px-2.5 py-1 text-xs font-bold text-[#1b3d3e]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {Array.isArray(member.socialLinks) &&
                  member.socialLinks.length > 0 && (
                    <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4">
                      {member.socialLinks
                        .filter((link) => link.url)
                        .slice(0, 4)
                        .map((link) => {
                          const Icon = getSocialIcon(link.name);
                          return (
                            <a
                              key={`${member.name}-${link.url}`}
                              href={link.url}
                              aria-label={`${member.name} on ${link.name || "social"}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-[#d96c4e] hover:text-[#d96c4e]"
                            >
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                    </div>
                  )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1b3d3e]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-14 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f4a384]">
              Start A Project
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white">
              Bring Kraviona into your next website, app, or SEO rebuild.
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 w-fit items-center gap-2 rounded-lg bg-white px-6 text-sm font-black text-[#1b3d3e] transition-colors hover:bg-[#f4a384] hover:text-white"
          >
            Contact Kraviona
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default TeamPage;
