"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Mail, PhoneCall, ChevronRight } from "lucide-react";

const ContactBanner = () => {
  return (
    <section className="relative w-full min-h-[36vh] md:min-h-[48vh] flex flex-col justify-center bg-hero-gradient overflow-hidden font-sans py-16 md:py-0 border-b border-gray-200/80">
      {/* --- Background Image & Light Brand Overlay --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/office/contact-consultation.webp"
          alt="Kraviona consultant speaking with clients in a professional office"
          fill
          className="object-cover opacity-10"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-primary-tint/60"></div>
      </div>

      {/* --- Abstract Curved Lines (Right Side Decorative) --- */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full border-[1px] border-primary/5"></div>
        <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full border-[1px] border-primary/10"></div>
        <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full border-[1px] border-primary/5"></div>
      </div>

      {/* --- Banner Content --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-dark mb-4 tracking-tight">
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8622A] to-[#F28C5E]">Project</span>
          </h1>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm md:text-base font-medium text-brand-muted mb-8">
            <Link
              href="/"
              className="hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors duration-300"
            >
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-[#E8622A]" aria-hidden="true" />
            <span className="text-dark font-semibold" aria-current="page">Start a Project</span>
          </nav>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="mailto:kravionatech@gmail.com"
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/90 hover:bg-white border border-gray-200 hover:border-primary/40 rounded-full transition-all duration-300 shadow-brand-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="bg-[#F28C5E]/15 p-1.5 rounded-full group-hover:bg-[#F28C5E]/25 transition-colors">
                <Mail className="w-4 h-4 text-[#E8622A]" />
              </div>
              <span className="text-sm font-semibold text-dark tracking-wide">
                kravionatech@gmail.com
              </span>
            </a>

            <a
              href="tel:+919608553167"
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/90 hover:bg-white border border-gray-200 hover:border-[#E8622A]/40 rounded-full transition-all duration-300 shadow-brand-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8622A]"
            >
              <div className="bg-[#E8622A]/15 p-1.5 rounded-full group-hover:bg-[#E8622A]/25 transition-colors">
                <PhoneCall className="w-4 h-4 text-[#E8622A]" />
              </div>
              <span className="text-sm font-semibold text-dark tracking-wide">
                +91 96085 53167
              </span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactBanner;