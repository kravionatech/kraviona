"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Terminal, Rocket } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="relative w-full py-24 bg-[#081314] flex justify-center items-center overflow-hidden font-sans border-t border-white/5">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="absolute w-[50rem] h-[50rem] bg-gradient-to-tr from-[#d96c4e]/20 to-[#295c5e]/20 rounded-full blur-[150px] mix-blend-screen"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
        {/* The Massive Glassmorphism CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full rounded-[2.5rem] md:rounded-[3rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl p-8 md:p-16 lg:p-20 overflow-hidden text-center flex flex-col items-center"
        >
          {/* Internal Animated Glow effect inside the box */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0, 0.1, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-[#f4be78] rounded-full blur-[120px] pointer-events-none"
          ></motion.div>

          {/* Overline Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#d96c4e]/10 border border-[#d96c4e]/30 mb-8 relative z-10">
            <Rocket className="w-4 h-4 text-[#d96c4e] animate-bounce" />
            <span className="text-[#f4be78] font-bold tracking-[0.2em] text-[10px] sm:text-xs uppercase">
              Ready To Scale?
            </span>
          </div>

          {/* The Confident Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] mb-6 relative z-10">
            Let&apos;s Build Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] via-[#f4be78] to-[#295c5e]">
              Unfair Advantage.
            </span>
          </h2>

          {/* The No-Nonsense Subtext */}
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-12 relative z-10">
            Enough reading. Stop wasting time with bloated templates and amateur
            agencies. Partner with Kraviona and let&apos;s engineer a digital
            product that actually dominates your market.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto relative z-10">
            <Link
              href="/contact"
              className="group relative flex items-center justify-center gap-3 px-10 py-5 bg-[#d96c4e] text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_0_30px_rgba(217,108,78,0.25)] hover:shadow-[0_0_50px_rgba(217,108,78,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
              <Terminal className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Hire Real Engineers</span>
            </Link>

            <Link
              href="mailto:kravionatech@gmail.com"
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-white/10 hover:border-[#f4be78] hover:bg-[#f4be78]/5 text-gray-300 hover:text-[#f4be78] rounded-xl font-bold uppercase tracking-widest text-sm transition-all duration-300"
            >
              Email Us Directly
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {/* Bottom Trust/Info Text */}
          <p className="mt-8 text-gray-600 text-xs font-mono uppercase tracking-widest relative z-10">
            Based in Delhi, India &bull; Serving Clients Globally
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
