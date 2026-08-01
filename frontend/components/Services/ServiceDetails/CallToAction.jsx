"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#1A2E33] to-[#2A4A52] mt-20 mx-4 sm:mx-6 lg:mx-8 rounded-[3rem] mb-8">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E8622A] rounded-full blur-[150px] pointer-events-none"
      />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Ready To Upgrade Your Digital Presence?
        </h2>
        <p className="text-xl text-gray-200 mb-10 font-light max-w-2xl mx-auto">
          Stop losing customers to outdated websites. Let&apos;s build something
          you&apos;re incredibly proud to show off.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-[#1A2E33] rounded-full font-bold text-lg hover:bg-[#F28C5E] transition-all duration-300 shadow-[0_10px_40px_rgba(42,74,82,0.2)] hover:-translate-y-1 group"
        >
          Talk to an Expert
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}
