import Image from "next/image";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { API_URL } from "@/utils/api";

const findSocialUrl = (links, platform) =>
  Array.isArray(links)
    ? links.find((link) =>
        String(link?.name || "").toLowerCase().includes(platform),
      )?.url || ""
    : "";

async function getFounder() {
  try {
    const response = await fetch(`${API_URL}/public/team?featured=true`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;

    const data = await response.json();
    return Array.isArray(data?.data) ? data.data[0] || null : null;
  } catch {
    return null;
  }
}

export default async function TeamSection() {
  const founder = await getFounder();

  // The founder spotlight is driven by the featured Team record. Without one,
  // do not display a stale hard-coded profile.
  if (!founder) return null;

  const linkedin = findSocialUrl(founder.socialLinks, "linkedin");
  const initial = founder.name?.trim()?.charAt(0)?.toUpperCase() || "K";

  return (
    <section className="relative overflow-hidden bg-[#F5F7F8] py-24">
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#2A4A52]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#E8622A]/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <span className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#E8622A]">
          <span className="h-px w-5 bg-[#E8622A]" />
          Founder Spotlight
          <span className="h-px w-5 bg-[#E8622A]" />
        </span>

        <h2 className="text-4xl font-black tracking-tight text-[#1A2E33] sm:text-5xl">
          The people behind{" "}
          <span className="font-serif italic font-medium text-[#E8622A]">
            Kraviona.
          </span>
        </h2>

        <div className="group relative mt-12 w-90">
          <span className="absolute -top-3 -left-3 h-8 w-8 rounded-tl-2xl border-t-2 border-l-2 border-[#E8622A]" />
          <span className="absolute -bottom-3 -right-3 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-[#E8622A]" />

          <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#2A4A52] shadow-xl ring-1 ring-black/5">
            {founder.avatar ? (
              <Image
                src={founder.avatar}
                alt={`${founder.name} — ${founder.designation || "Founder"} at Kraviona Tech Solutions`}
                fill
                sizes="360px"
                className="h-full w-full object-cover saturate-150 brightness-95 transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-8xl font-black text-white/70">
                {initial}
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-7 text-2xl font-bold text-[#1A2E33]">{founder.name}</h3>
        {founder.designation && (
          <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#E8622A]">
            {founder.designation}
          </p>
        )}
        {founder.bio && (
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
            {founder.bio}
          </p>
        )}

        <div className="mt-7 flex items-center gap-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${founder.name} on LinkedIn`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A2E33]/5 text-[#1A2E33] transition-colors hover:bg-[#1A2E33] hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}

          <a
            href="/contact"
            className="ml-2 flex items-center gap-1.5 rounded-full bg-[#1A2E33] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            Work with the team
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
