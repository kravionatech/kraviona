"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const BlogCTA = () => {
  return (
    <section className="py-24 bg-[#1b3d3e] font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Abstract Circle 1 */}
        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full border border-[#295c5e] opacity-20"></div>
        <div className="absolute -top-[15%] -right-[5%] w-[400px] h-[400px] rounded-full border border-[#295c5e] opacity-20"></div>

        {/* Abstract Glow */}
        <div className="absolute bottom-0 left-[10%] w-96 h-96 bg-[#d96c4e] rounded-full opacity-10 blur-[100px]"></div>
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
              <span className="w-8 h-[2px] bg-[#f4be78]"></span>
              <span className="text-[#f4be78] font-bold tracking-[0.3em] text-[10px] uppercase">
                Turn Insights Into Action
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
              Ready to scale your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d96c4e] to-[#f4be78]">
                digital presence?
              </span>
            </h2>

            <p className="text-lg text-[#a4babb] leading-relaxed max-w-xl mx-auto lg:mx-0">
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
            className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto"
          >
            <Link
              href="/contact"
              className="w-full sm:w-auto px-10 py-5 bg-[#d96c4e] text-white rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-[#1b3d3e] transition-colors duration-300 shadow-[0_10px_30px_rgba(217,108,78,0.3)] flex items-center justify-center gap-3 group"
            >
              Start a Project
              <span className="w-8 h-[2px] bg-white group-hover:bg-[#1b3d3e] transition-colors duration-300"></span>
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto px-10 py-5 bg-transparent border border-[#295c5e] text-white rounded-none font-black text-xs uppercase tracking-[0.2em] hover:bg-[#295c5e] transition-colors duration-300 flex items-center justify-center"
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
