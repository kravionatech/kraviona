"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { Mail, PhoneCall } from "lucide-react"; // Make sure lucide-react is installed

const ContactBanner = () => {
  return (
    // Height matched with Services Banner (40vh-50vh) for consistency across inner pages
    <section className="relative w-full h-[40vh] md:h-[60vh] flex flex-col justify-center bg-[#081314] overflow-hidden font-sans">
      {/* --- Background Image & Deep Brand Dark Overlay --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          // Using a communication/business meeting related image for Contact Page
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?fm=jpg&q=60&w=3000&auto=format&fit=crop"
          alt="Contact Kraviona Tech Solutions"
          fill
          className="object-cover opacity-40 mix-blend-overlay grayscale"
          priority
          fetchPriority="high"
        />
        {/* Kraviona Dark Teal Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2425] via-[#0f2425]/90 to-[#0f2425]/60"></div>
      </div>

      {/* --- Abstract Curved Lines (Right Side Decorative) --- */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full border-[1px] border-white/5"></div>
        <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full border-[1px] border-white/10"></div>
        <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full border-[1px] border-white/5"></div>
      </div>

      {/* --- Banner Content (Left Aligned for Inner Pages) --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 mt-10 md:mt-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Start a Project
          </h1>

          {/* Breadcrumbs (Home » Contact Us) */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-300 mb-8">
            <Link
              href="/"
              className="hover:text-[#f4be78] transition-colors duration-300"
            >
              Home
            </Link>

            {/* Kraviona Terracotta Divider */}
            <span className="text-[#d96c4e] font-bold mx-1">»</span>

            <span className="text-[#f4be78]">Start a Project</span>
          </div>

          {/* --- Direct Contact Info Pills --- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Email Pill */}
            <a
              href="mailto:kravionatech@gmail.com"
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#f4be78]/50 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <div className="bg-[#f4be78]/10 p-1.5 rounded-full group-hover:bg-[#f4be78]/20 transition-colors">
                <Mail className="w-4 h-4 text-[#f4be78]" />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white tracking-wide">
                kravionatech@gmail.com
              </span>
            </a>

            {/* Phone Pill */}
            <a
              href="tel:+919608553167"
              className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#d96c4e]/50 rounded-full transition-all duration-300 backdrop-blur-sm"
            >
              <div className="bg-[#d96c4e]/10 p-1.5 rounded-full group-hover:bg-[#d96c4e]/20 transition-colors">
                <PhoneCall className="w-4 h-4 text-[#d96c4e]" />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white tracking-wide">
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
