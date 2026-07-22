"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "30d", label: "Launch Support" },
  { value: "05+", label: "Years of Experience" },
  { value: "SEO", label: "Built Into Delivery" },
];

const OurStory = () => {
  return (
    <section className="py-24 bg-white font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: The Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-[#1b3d3e] tracking-tight mb-8">
              The thinking behind <br />
              <span className="text-[#d96c4e] italic font-serif font-medium">
                the build.
              </span>
            </h2>

            <div className="space-y-6 text-gray-500 leading-relaxed text-lg">
              <p>
                Kraviona was built around a simple problem we kept seeing:
                businesses were paying for websites that looked fine on launch
                day but were hard to maintain, slow to rank, and disconnected
                from how the business actually worked.
              </p>
              <p>
                Our work closes that gap. We combine clear UI, MERN stack and
                Next.js development, practical backend architecture, AI-aware
                workflows, and technical SEO so every build has a stronger
                foundation after it goes live.
              </p>
              <div className="border-l-4 border-[#d96c4e] pl-6 py-2 mt-8">
                <p className="text-[#1b3d3e] font-bold text-xl">
                  &ldquo;Good development should make the business easier to
                  run, easier to find, and easier to grow.&rdquo;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: The Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-6"
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#f9fafb] p-8 rounded-3xl border border-gray-100 flex flex-col items-center justify-center text-center hover:border-[#d96c4e]/30 hover:shadow-lg transition-all duration-300 group"
              >
                <span className="text-4xl md:text-5xl font-black text-[#1b3d3e] group-hover:text-[#d96c4e] transition-colors duration-300 mb-2">
                  {stat.value}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
