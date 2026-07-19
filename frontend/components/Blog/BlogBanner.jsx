"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const stats = [
  { value: "150+", label: "Articles" },
  { value: "50K+", label: "Monthly readers" },
  { value: "12", label: "Min. avg. read" },
];

const featured = {
  category: "Engineering",
  title: "Scaling a MERN stack past the first 100K users",
  readTime: "9 min read",
};

// ---------------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const BlogBanner = () => {
  return (
    <section className="relative w-full bg-[#0f2425] font-sans overflow-hidden pt-[110px] pb-24 lg:pt-28 lg:pb-32">
      {/* Faint code-grid texture — ties the visual language to a dev blog without shouting it */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#a4babb 1px, transparent 1px), linear-gradient(90deg, #a4babb 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Ambient glow */}
      <div className="absolute -top-24 right-[-10rem] w-[34rem] h-[34rem] bg-[#295c5e] rounded-full opacity-[0.18] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-16 lg:gap-12 items-center">
          {/* ----------------------------------------------------------- */}
          {/* Left: editorial masthead                                    */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Eyebrow with terminal-style blinking cursor */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-3 mb-7"
            >
              <span className="font-mono text-[#d96c4e] text-[13px] tracking-[0.25em] uppercase">
                The Kraviona Journal
              </span>
              <span
                aria-hidden="true"
                className="w-[2px] h-[14px] bg-[#d96c4e] motion-safe:animate-[blink_1.1s_steps(1)_infinite]"
              />
            </motion.div>

            {/* Headline — serif for editorial weight, distinct from the sans body copy */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-[2.75rem] sm:text-6xl lg:text-[4.25rem] text-white leading-[1.05] tracking-tight mb-7"
            >
              Notes from
              <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] to-[#f4be78]">
                the build
              </span>{" "}
              process.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-[#a4babb] text-lg leading-relaxed max-w-md mb-10"
            >
              Field notes on scalable MERN applications, interface design, and
              what actually moved the needle for the products we shipped this
              quarter.
            </motion.p>

            {/* CTA row */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-8 mb-12"
            >
              <button
                type="button"
                aria-label="Start reading blog posts"
                onClick={() =>
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                className="px-7 py-3.5 bg-[#d96c4e] text-white text-sm font-bold tracking-wide rounded-sm hover:bg-[#f4be78] transition-colors duration-300 flex items-center gap-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4be78]"
              >
                Start reading
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <a
                href="#topics"
                className="text-sm font-semibold text-[#f4be78] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4be78]"
              >
                Browse topics
              </a>
            </motion.div>

            {/* Stat strip — inline, mono numerals; replaces the floating bubble pattern */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-6 sm:gap-8 border-t border-[#295c5e]/60 pt-6"
            >
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-6 sm:gap-8">
                  <div>
                    <p className="font-mono text-2xl font-semibold text-white">
                      {s.value}
                    </p>
                    <p className="text-xs text-[#a4babb] uppercase tracking-wider mt-1">
                      {s.label}
                    </p>
                  </div>
                  {i < stats.length - 1 && (
                    <span
                      className="w-px h-9 bg-[#295c5e]/60"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ----------------------------------------------------------- */}
          {/* Right: framed visual + featured-post card                   */}
          {/* ----------------------------------------------------------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative aspect-[4/5] w-full max-w-md mx-auto lg:max-w-none"
          >
            <div className="absolute inset-0 rounded-sm overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=720"
                alt="Kraviona team at work"
                fill
                sizes="(max-width: 1024px) 80vw, 38vw"
                className="object-cover"
                style={{ filter: "grayscale(0.3) sepia(0.15)" }}
                priority
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425] via-[#0f2425]/10 to-[#d96c4e]/10 mix-blend-multiply" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425] via-transparent to-transparent" />
            </div>

            {/* Viewfinder corner marks */}
            <span
              className="absolute -top-3 -left-3 w-9 h-9 border-t-2 border-l-2 border-[#d96c4e]"
              aria-hidden="true"
            />
            <span
              className="absolute -bottom-3 -right-3 w-9 h-9 border-b-2 border-r-2 border-[#d96c4e]"
              aria-hidden="true"
            />

            {/* Featured-post card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute left-4 right-4 -bottom-8 sm:left-6 sm:right-auto sm:w-[85%] bg-[#13302f]/95 backdrop-blur-sm border border-[#295c5e] rounded-sm p-5"
            >
              <p className="font-mono text-[11px] text-[#f4be78] uppercase tracking-[0.18em] mb-2">
                Featured · {featured.category}
              </p>
              <h3 className="text-white font-semibold leading-snug mb-2">
                {featured.title}
              </h3>
              <p className="text-xs text-[#a4babb]">{featured.readTime}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default BlogBanner;
