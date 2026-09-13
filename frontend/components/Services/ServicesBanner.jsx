"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const ServicesBanner = () => {
  return (
    // Height is set to 40vh-50vh for inner pages, not full screen
    <section className="relative w-full h-[36vh] md:h-[48vh] flex flex-col justify-center bg-hero-gradient overflow-hidden border-b border-gray-200/80">
      {/* --- Background Image & Light Overlay --- */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/office/services-strategy.webp"
          alt="Kraviona consultants planning a digital transformation project"
          fill
          className="object-cover opacity-10"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        {/* Light Kraviona Teal Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/90 to-primary-tint/60"></div>
      </div>

      {/* --- Abstract Curved Lines --- */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -right-[20%] top-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full border-[1px] border-primary/5"></div>
        <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 w-[50vh] h-[50vh] rounded-full border-[1px] border-primary/10"></div>
        <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full border-[1px] border-primary/5"></div>
      </div>

      {/* --- Banner Content (Left Aligned) --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main Page Title */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-dark mb-4 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8622A] to-[#F28C5E]">Services</span>
          </h1>

          {/* Breadcrumbs (Home » Services) */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-brand-muted">
            <Link
              href="/"
              className="hover:text-primary transition-colors duration-300"
            >
              Home
            </Link>

            {/* Divider using Kraviona Terracotta color */}
            <span className="text-[#E8622A] font-bold mx-1">»</span>

            <span className="text-dark font-semibold">Services</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesBanner;
