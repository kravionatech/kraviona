"use client";

import React from "react";
import { motion } from "framer-motion";

const AboutBanner = () => {
  return (
    <section className="relative pt-32 pb-24 bg-[#0f2425] font-sans overflow-hidden mt-[70px] lg:mt-0">
      {/* Background Glows */}
      <div className="absolute -top-20 -right-20 w-[40rem] h-[40rem] bg-[#295c5e] rounded-full opacity-10 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[30rem] h-[30rem] bg-[#d96c4e] rounded-full opacity-[0.03] blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#d96c4e]"></span>
            <span className="text-[#f4be78] font-black tracking-[0.3em] text-[10px] uppercase">
              Who We Are
            </span>
            <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#d96c4e]"></span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8">
            We engineer{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] to-[#f4be78]">
              digital ecosystems
            </span>{" "}
            that scale.
          </h1>

          <p className="text-lg md:text-xl text-[#a4babb] leading-relaxed max-w-2xl mx-auto font-medium">
            Kraviona is a team of passionate developers, designers, and
            strategists. We don&apos;t just build websites; we build the digital
            foundation for your business&apos;s future.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutBanner;
