import Image from "next/image";
import Link from "next/link";

const trustBadges = [
  { icon: "⚡", label: "SEO Optimized" },
  { icon: "🚀", label: "MERN Stack Experts" },
  { icon: "✅", label: "Fast Delivery" },
];

const HeroSection = () => {
  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col bg-[#071314]"
      aria-labelledby="home-hero-heading"
    >
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <Image
          src="/og-web-development.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071314]/98 via-[#0f2425]/90 to-[#0f2425]/55" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#071314] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 pb-16 pt-32 md:px-12 lg:pb-24 lg:pt-28">
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3 md:mb-7 md:gap-4">
            <div className="h-[2px] w-8 bg-[#d96c4e] shadow-[0_0_10px_rgba(217,108,78,0.7)] md:w-12" />
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#d96c4e] md:text-sm">
              Kraviona Tech Solutions
            </span>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2 md:mb-8 md:gap-3">
            {trustBadges.map((badge) => (
              <span
                key={badge.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-white/80 backdrop-blur-sm"
              >
                <span aria-hidden="true">{badge.icon}</span>
                {badge.label}
              </span>
            ))}
          </div>

          <h1
            id="home-hero-heading"
            className="mb-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:mb-7 md:text-6xl lg:text-[4.5rem]"
          >
            MERN Stack Development
            <br />
            <span className="bg-gradient-to-r from-[#f4be78] via-[#e88c5a] to-[#d96c4e] bg-clip-text text-transparent">
              &amp; Technical SEO
            </span>
            <br />
            <span className="text-white/90">Solutions</span>
          </h1>

          <p className="mb-9 max-w-2xl border-l-2 border-[#d96c4e]/60 pl-4 text-base leading-relaxed text-gray-300 md:mb-11 md:text-lg lg:text-xl">
            Scalable web applications, SEO-first architecture, and
            high-performance digital experiences built for modern businesses.
          </p>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="https://calendly.com/kravionatech"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#a9472f] px-7 py-4 text-sm font-bold text-white shadow-[0_6px_28px_rgba(169,71,47,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#953924] hover:shadow-[0_8px_32px_rgba(169,71,47,0.46)] sm:w-auto md:px-9 md:py-4.5 md:text-base"
            >
              Book Free Consultation
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
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#f4be78]/60 hover:bg-white/10 sm:w-auto md:px-9 md:py-4.5 md:text-base"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-20 mt-auto flex w-full flex-col items-stretch justify-between lg:flex-row lg:items-end">
        <div className="hidden w-full items-center gap-5 border-t-2 border-[#295c5e] bg-[#071314]/90 px-7 py-5 text-white shadow-2xl backdrop-blur-md sm:flex lg:w-auto lg:rounded-tr-2xl lg:border-r-2 md:px-9">
          <div
            className="rounded-full bg-[#f4be78]/10 p-3 text-[#f4be78]"
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
            <p className="mb-0.5 text-[10px] uppercase tracking-widest text-gray-400 md:text-xs">
              Direct Consultation
            </p>
            <a
              href="tel:+919608553167"
              className="text-base font-bold text-white transition-colors hover:text-[#f4be78] md:text-lg"
            >
              +91 96085 53167
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col items-stretch sm:flex-row lg:w-auto">
          <div className="flex flex-1 cursor-default flex-col justify-center bg-[#a9472f] p-6 text-white md:p-8 lg:w-[260px]">
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-white md:text-xs">
              Development
            </p>
          </div>

          <div className="flex flex-1 cursor-default flex-col justify-center border-t border-gray-800 bg-[#071314]/95 p-6 text-white backdrop-blur-md sm:border-l sm:border-t-0 md:p-8 lg:w-[260px] lg:border-l-0 lg:border-t">
            <svg
              className="mb-3 h-7 w-7 text-[#d96c4e]"
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
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 md:text-xs">
              Optimization
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
