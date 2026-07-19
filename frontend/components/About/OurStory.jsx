"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "50+", label: "Projects Delivered" },
  { value: "99%", label: "Client Retention" },
  { value: "05+", label: "Years of Experience" },
  { value: "24/7", label: "Dedicated Support" },
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
              The story behind <br />
              <span className="text-[#d96c4e] italic font-serif font-medium">
                the code.
              </span>
            </h2>

            <div className="space-y-6 text-gray-500 leading-relaxed text-lg">
              <p>
                What started as a small group of tech enthusiasts has now
                evolved into Kraviona—a full-service digital agency. We noticed
                a massive gap in the industry: agencies either built beautiful
                things that didn&apos;t work, or highly functional systems that
                looked terrible.
              </p>
              <p>
                Our mission is to bridge that gap. By combining high-end UI/UX
                design with robust MERN stack architecture and AI integrations,
                we deliver products that are both visually stunning and
                technically superior.
              </p>
              <div className="border-l-4 border-[#d96c4e] pl-6 py-2 mt-8">
                <p className="text-[#1b3d3e] font-bold text-xl">
                  &ldquo;We don&apos;t just write code; we solve complex
                  business problems.&rdquo;
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
