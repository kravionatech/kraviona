"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogCTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#e8f2f4] via-[#f5f7f8] to-[#fff0e9] font-sans relative overflow-hidden border-y border-gray-200/80">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full border border-primary/10 opacity-40"></div>
        <div className="absolute -top-[15%] -right-[5%] w-[400px] h-[400px] rounded-full border border-primary/10 opacity-40"></div>
        <div className="absolute bottom-0 left-[10%] w-96 h-96 bg-[#E8622A] rounded-full opacity-5 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Side: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <span className="w-8 h-[2px] bg-[#E8622A]"></span>
              <span className="text-[#E8622A] font-bold tracking-[0.3em] text-[10px] uppercase">
                Turn Insights Into Action
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-dark tracking-tight mb-6 leading-[1.1]">
              Ready to scale your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8622A] to-[#F28C5E]">
                digital presence?
              </span>
            </h2>

            <p className="text-lg text-brand-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              Our expert team at Kraviona applies these cutting-edge strategies
              every day. Let&apos;s collaborate to build scalable applications
              and high-converting campaigns for your business.
            </p>
          </motion.div>

          {/* Right Side: Action Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto"
          >
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#E8622A] text-white rounded-xl font-bold text-sm hover:bg-[#B84A1A] transition-all shadow-brand-sm flex items-center justify-center gap-2 group"
            >
              Start a Project
              <span className="w-6 h-[2px] bg-white group-hover:w-8 transition-all duration-300"></span>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto px-8 py-4 bg-white border border-primary/25 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-brand-sm flex items-center justify-center"
            >
              View Services
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BlogCTA;
