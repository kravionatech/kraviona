"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const ServicesBanner = () => {
  return (
    // Height is set to 40vh-50vh for inner pages, not full screen
    <section className="relative w-full h-[40vh] md:h-[60vh] flex flex-col justify-center bg-[#081314] overflow-hidden">
      {/* --- Background Image & Dark Overlay --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="https://images.unsplash.com/photo-1690378820474-b468b8ee64d3?fm=jpg&q=60&w=3000&auto=format&fit=crop"
          alt="Kraviona IT Team Working"
          fill
          className="object-cover opacity-40 mix-blend-overlay grayscale" // Grayscale makes the brand colors pop
          priority
          fetchPriority="high"
        />
        {/* Deep Kraviona Teal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f2425] via-[#0f2425]/90 to-[#0f2425]/60"></div>
      </div>

      {/* --- Abstract Curved Lines (Like your reference image) --- */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full border-[1px] border-white/5"></div>
        <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full border-[1px] border-white/10"></div>
        <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full border-[1px] border-white/5"></div>
      </div>

      {/* --- Banner Content (Left Aligned) --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main Page Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            Services
          </h1>

          {/* Breadcrumbs (Home » Services) */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-gray-300">
            <Link
              href="/"
              className="hover:text-[#f4be78] transition-colors duration-300"
            >
              Home
            </Link>

            {/* Divider using Kraviona Terracotta color */}
            <span className="text-[#d96c4e] font-bold mx-1">»</span>

            <span className="text-[#f4be78]">Services</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesBanner;
