"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-32 lg:pt-48 lg:pb-40 bg-[#1b3d3e] overflow-hidden">
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.svg')]"></div>

      {/* Animated Glowing Orbs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#295c5e] rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: 2,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d96c4e] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-4xl text-center mx-auto"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2.5 mb-8 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4be78] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#f4be78]"></span>
            </span>
            <span className="text-[#f4be78] font-bold tracking-[0.15em] text-xs uppercase">
              Premium Web Engineering
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight"
          >
            We Don&apos;t Just Build Websites.{" "}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] via-[#f4be78] to-[#d96c4e] bg-[length:200%_auto] animate-gradient-x">
              We Build Digital Businesses.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto font-light"
          >
            Using the powerful MERN stack, we create custom, high-speed web
            experiences that captivate your audience and turn clicks into loyal
            customers.
          </motion.p>

          <motion.div variants={fadeUp} className="flex justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#d96c4e] hover:bg-white text-white hover:text-[#1b3d3e] rounded-full font-bold transition-all duration-300 shadow-[0_8px_30px_rgb(217,108,78,0.3)] hover:shadow-[0_8px_30px_rgb(255,255,255,0.3)] flex items-center gap-3 group hover:-translate-y-1"
            >
              Let&apos;s Discuss Your Idea
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
