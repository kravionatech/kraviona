"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutBanner = () => {
  return (
    <section className="relative pt-32 pb-24 bg-hero-gradient font-sans overflow-hidden mt-[70px] lg:mt-0 border-b border-gray-200/80">
      {/* Subtle Ambient Accents */}
      <div className="absolute -top-20 -right-20 w-[36rem] h-[36rem] bg-primary/8 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[30rem] h-[30rem] bg-accent/8 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-12 h-[2px] bg-[#E8622A]"></span>
            <span className="text-[#E8622A] font-black tracking-[0.3em] text-[10px] uppercase">
              Who We Are
            </span>
            <span className="w-12 h-[2px] bg-[#E8622A]"></span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tighter leading-[1.1] mb-8">
            We build{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8622A] to-[#F28C5E]">
              digital systems
            </span>{" "}
            that stay useful.
          </h1>

          <p className="text-lg md:text-xl text-brand-muted leading-relaxed max-w-2xl mx-auto font-medium">
            Kraviona is a founder-led technology team for businesses that need
            fast websites, reliable web apps, clean backend systems, and
            technical SEO that is planned from the first sprint.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutBanner;
