"use client";

import React from "react";
import { motion } from "framer-motion";

const techCategories = [
  {
    title: "Frontend & UI",
    techs: [
      "React.js",
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Redux",
    ],
  },
  {
    title: "Backend & APIs",
    techs: [
      "Node.js",
      "Express.js",
      "GraphQL",
      "REST APIs",
      "Python",
      "NestJS",
    ],
  },
  {
    title: "Database & Cloud",
    techs: ["MongoDB", "PostgreSQL", "Redis", "AWS", "Google Cloud", "Vercel"],
  },
  {
    title: "Design & Marketing",
    techs: [
      "Figma",
      "Adobe XD",
      "Google Analytics",
      "SEMrush",
      "Ahrefs",
      "HubSpot",
    ],
  },
];

const TechStack = () => {
  return (
    <section className="py-24 bg-white font-sans border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-[#d96c4e] font-bold tracking-[0.3em] text-[10px] uppercase">
              Technologies We Master
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#1b3d3e] tracking-tight mt-3">
              Tools we use to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
                innovate.
              </span>
            </h2>
          </div>
          <p className="text-gray-500 text-sm max-w-sm leading-relaxed border-l-2 border-[#d96c4e] pl-4">
            From robust backend architectures to dynamic frontend experiences,
            we use the latest tech stack to build scalable, high-performance
            solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#fdfdfd] rounded-[32px] p-8 border border-gray-100 hover:border-[#d96c4e]/30 hover:shadow-[0_20px_40px_rgba(27,61,62,0.06)] transition-all duration-300 group"
            >
              <h3 className="text-lg font-black text-[#1b3d3e] mb-6 group-hover:text-[#d96c4e] transition-colors">
                {category.title}
              </h3>

              <div className="flex flex-wrap gap-2">
                {category.techs.map((tech, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-white border border-gray-100 text-gray-500 text-[11px] font-bold rounded-full hover:bg-[#1b3d3e] hover:text-white hover:border-[#1b3d3e] shadow-sm transition-colors duration-300 cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
