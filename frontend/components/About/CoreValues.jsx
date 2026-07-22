"use client";

import React from "react";
import { motion } from "framer-motion";

const values = [
  {
    title: "Quality That Holds Up",
    desc: "We care about clean structure, maintainable code, responsive UI, and the small details that make a site easier to run after launch.",
  },
  {
    title: "Clear Communication",
    desc: "You know what we are building, what we need from you, and what is coming next. No fog, no jargon walls, no surprise scope.",
  },
  {
    title: "Modern, Practical Thinking",
    desc: "We keep learning across AI, Next.js, SEO, automation, and cloud tools, then apply what actually helps the project.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CoreValues = () => {
  return (
    <section className="py-24 bg-[#1b3d3e] font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Our Core <span className="text-[#d96c4e]">Values</span>
          </h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[32px] hover:bg-white/10 transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#d96c4e]/20 flex items-center justify-center mb-6">
                <div className="w-4 h-4 rounded-full bg-[#d96c4e]"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">
                {value.title}
              </h3>
              <p className="text-[#a4babb] text-sm leading-relaxed">
                {value.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CoreValues;
