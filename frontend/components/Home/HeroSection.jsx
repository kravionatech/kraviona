import Image from "next/image";
import Link from "next/link";

const trustBadges = [
  { icon: "01", label: "SEO-Ready Builds" },
  { icon: "02", label: "MERN & Next.js" },
  { icon: "03", label: "Founder-Led Delivery" },
];

const HeroSection = () => {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col bg-[#F7F5F1]"
      aria-labelledby="home-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <Image
          src="/images/office/home-hero.webp"
          alt="Next.js web development team at Kraviona Tech Solutions Delhi NCR"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover opacity-10"
        />
        {/* Light overlay: subtle teal wash at left, fades to transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EAF3F5]/80 via-[#F7F5F1]/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#F7F5F1] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 pb-16 pt-32 md:px-12 lg:pb-24 lg:pt-28">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3 md:mb-7 md:gap-4">
            <div className="h-[2px] w-8 bg-[#2D6E7A] md:w-12" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2D6E7A] md:text-sm">
              Kraviona Tech Solutions
            </span>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 md:mb-8 md:gap-3">
            {trustBadges.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-[20px] border border-[#E8E4DE] bg-[#EAF3F5] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-[#2D6E7A] shadow-sm"
              >
                <span aria-hidden="true" className="font-bold">{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>

          <h1
            id="home-hero-heading"
            className="mb-5 text-4xl font-bold leading-[1.08] tracking-tight text-[#1A3840] sm:text-5xl md:mb-7 md:text-6xl lg:text-[4.5rem]"
          >
            Fast Websites &amp; Web Apps
            <br />
            <span className="text-[#2D6E7A]">
              Built to Rank
            </span>
            <br />
            <span className="text-[#1A3840]/90">and Convert</span>
          </h1>

          <p className="mb-9 max-w-2xl border-l-2 border-[#2D6E7A]/40 pl-4 text-base leading-relaxed text-[#5A7A82] md:mb-11 md:text-lg lg:text-xl">
            Kraviona builds MERN stack products, Next.js websites, backend
            systems, and technical SEO foundations for brands that need speed,
            search visibility, and clean execution.
          </p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="https://calendly.com/kravionatech"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-[6px] bg-[#C85A3C] hover:bg-[#B04D31] px-7 py-4 text-sm font-semibold text-white shadow-brand-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40 sm:w-auto md:px-9 md:py-4.5 md:text-base"
            >
              Book a Free Strategy Call
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            <Link
              href="/services"
              className="inline-flex w-full items-center justify-center rounded-[6px] border-[1.5px] border-[#2D6E7A] bg-transparent hover:bg-[#EAF3F5] px-7 py-4 text-sm font-semibold text-[#2D6E7A] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D6E7A]/40 sm:w-auto md:px-9 md:py-4.5 md:text-base"
            >
              See What We Build
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-auto flex w-full flex-col items-stretch justify-between lg:flex-row lg:items-end">
        <div className="hidden w-full items-center gap-5 border-t border-r border-[#E8E4DE] bg-[#FEFCF9] px-7 py-5 shadow-sm sm:flex lg:w-auto lg:rounded-tr-[12px] md:px-9">
          <div
            className="rounded-[6px] bg-[#EAF3F5] p-3 text-[#2D6E7A]"
            aria-hidden="true"
          >
            <svg
              className="h-5 w-5 md:h-6 md:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div>
            <p className="mb-0.5 text-[10px] uppercase tracking-widest text-[#5A7A82] md:text-xs">
              Direct Consultation
            </p>
            <a
              href="tel:+919608553167"
              className="text-base font-bold text-[#1A3840] transition-colors hover:text-[#2D6E7A] md:text-lg"
            >
              +91 96085 53167
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch sm:flex-row lg:w-auto">
          <div className="flex flex-1 cursor-default flex-col justify-center bg-[#2D6E7A] p-6 text-white md:p-8 lg:w-[260px]">
            <svg
              className="mb-3 h-7 w-7 text-white/80"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
            <p className="mb-1 text-3xl font-black md:text-4xl">Full-Stack</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white/80 md:text-xs">
              Product Builds
            </p>
          </div>

          <div className="flex flex-1 cursor-default flex-col justify-center border-t border-[#E8E4DE] bg-[#FEFCF9] p-6 text-[#1A3840] sm:border-l sm:border-t-0 md:p-8 lg:w-[260px] lg:border-l-0 lg:border-t">
            <svg
              className="mb-3 h-7 w-7 text-[#C85A3C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="mb-1 text-3xl font-black md:text-4xl">SEO</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#5A7A82] md:text-xs">
              Technical Growth
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
