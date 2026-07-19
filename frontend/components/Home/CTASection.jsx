"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, CheckCircle, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section
      className="relative py-24 lg:py-32 bg-gradient-to-b from-[#0f2425] to-[#1b3d3e] overflow-hidden border-t border-white/5"
      aria-labelledby="cta-heading"
    >
      {/* Animated Background Rings */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[55%] -right-[18%] w-[1100px] h-[1100px] rounded-full border border-white/[0.04]"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[45%] -left-[8%] w-[750px] h-[750px] rounded-full border border-[#f4be78]/8"
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] h-[65%] bg-[#295c5e] blur-[140px] opacity-25 rounded-full" />
        <div className="absolute top-[18%] right-[8%] w-[38%] h-[38%] bg-[#d96c4e] blur-[110px] opacity-8 rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Live availability badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md mb-8 shadow-sm">
            <span className="flex h-2.5 w-2.5 relative" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f4be78] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f4be78]" />
            </span>
            <span className="text-white/90 text-xs font-bold tracking-[0.15em] uppercase">
              Available for New Projects
            </span>
          </div>

          {/* Heading */}
          <h2
            id="cta-heading"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.12]"
          >
            Ready to Transform Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
              Digital Presence?
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-base md:text-xl text-gray-300 mb-5 max-w-2xl mx-auto leading-relaxed">
            Let&apos;s build scalable MERN applications, SEO-optimised
            architectures, and high-converting digital experiences that
            accelerate your business growth.
          </p>

          {/* Calendly placeholder */}
          <p className="text-[#f4be78]/70 text-sm mb-10 font-medium">
            📅 Book directly in our calendar — no phone tag, no delays.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              id="cta-primary-btn"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-[#d96c4e] text-white rounded-xl font-bold text-base hover:bg-[#c25e41] transition-all duration-300 shadow-[0_4px_24px_rgba(217,108,78,0.35)] hover:shadow-[0_8px_32px_rgba(217,108,78,0.52)] group hover:-translate-y-0.5"
              aria-label="Book a free SEO audit and consultation"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              Book Free Consultation
              <ArrowRight
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 bg-transparent text-white border-2 border-white/18 rounded-xl font-bold text-base hover:border-[#f4be78]/60 hover:bg-white/5 transition-all duration-300"
              aria-label="Get a free SEO audit for your website"
            >
              Get Free SEO Audit
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/8 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-gray-400 text-sm font-medium">
            {[
              "Free 30-Min Consultation",
              "Customised IT Solutions",
              "Dedicated Post-Launch Support",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle
                  className="w-4 h-4 text-[#f4be78]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* WhatsApp floating button removed from homepage per request */}
    </section>
  );
};

export default CTASection;
