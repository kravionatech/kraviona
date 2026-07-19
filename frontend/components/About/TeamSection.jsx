import React from "react";
import Image from "next/image";
import { Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const TeamSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#f9fafb] py-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-[#295c5e]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#d96c4e]/10 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <span className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#d96c4e]">
          <span className="h-px w-5 bg-[#d96c4e]" />
          Founder Spotlight
          <span className="h-px w-5 bg-[#d96c4e]" />
        </span>

        <h2 className="text-4xl font-black tracking-tight text-[#1b3d3e] sm:text-5xl">
          The brain behind{" "}
          <span className="font-serif italic font-medium text-[#d96c4e]">
            Kraviona.
          </span>
        </h2>

        {/* Portrait */}
        <div className="group relative mt-12 w-90">
          {/* Corner brackets — signature detail */}
          <span className="absolute -top-3 -left-3 h-8 w-8 rounded-tl-2xl border-t-2 border-l-2 border-[#d96c4e]" />
          <span className="absolute -bottom-3 -right-3 h-8 w-8 rounded-br-2xl border-b-2 border-r-2 border-[#d96c4e]" />

          <div className="relative aspect-square overflow-hidden rounded-[28px] shadow-xl ring-1 ring-black/5">
            <Image
              src="https://res.cloudinary.com/dybydsegx/image/upload/v1782123780/kravionatech/images/klttfdsvzm6ou8tvrkq2.png"
              alt="Amar Kumar"
              fill
              sizes="360px"
              className="h-full w-full object-cover saturate-150 brightness-95 transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        <h3 className="mt-7 text-2xl font-bold text-[#1b3d3e]">Amar Kumar</h3>
        <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#d96c4e]">
          Founder &amp; Lead Engineer
        </p>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
          Building scalable digital products and leading the technical vision at
          Kraviona, one MERN stack at a time.
        </p>

        {/* Socials + CTA */}
        <div className="mt-7 flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/amarkumar96085/"
            aria-label="Amar Kumar on LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3d3e]/5 text-[#1b3d3e] transition-colors hover:bg-[#1b3d3e] hover:text-white"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="https://twitter.com/kraviona"
            aria-label="Kraviona on Twitter"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1b3d3e]/5 text-[#1b3d3e] transition-colors hover:bg-[#1b3d3e] hover:text-white"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href="/contact"
            className="ml-2 flex items-center gap-1.5 rounded-full bg-[#1b3d3e] px-5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            Work with him
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
