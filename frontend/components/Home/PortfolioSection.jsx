"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "CodesMentors",
    category: "EdTech Platform",
    image:
      "https://images.pexels.com/photos/414628/pexels-photo-414628.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "A comprehensive MERN stack e-learning platform featuring interactive video courses, student dashboards, and real-time progress tracking.",
    techStack: ["React", "Node.js", "MongoDB"],
    link: "/portfolio/codesmentors",
  },
  {
    id: 2,
    title: "The Chai Biscuit",
    category: "Hospitality & Retail",
    image:
      "https://images.pexels.com/photos/1015568/pexels-photo-1015568.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "A visually stunning website and ordering system for a modern cafe, integrating seamless UI with a robust inventory backend.",
    techStack: ["Next.js", "Tailwind CSS", "Express"],
    link: "/portfolio/the-chai-biscuit",
  },
  {
    id: 3,
    title: "Polytechub",
    category: "Digital Portfolio Hub",
    image:
      "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "A centralized digital hub designed for seamless navigation, dynamic content rendering, and high-performance SEO.",
    techStack: ["React", "Framer Motion", "API"],
    link: "/portfolio/polytechub",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const PortfolioSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-[#0f2425] to-[#1b3d3e] font-sans relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -right-[10%] w-[500px] h-[500px] bg-[#295c5e]/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 -left-[10%] w-[400px] h-[400px] bg-[#d96c4e]/10 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#f4be78]"></span>
              <span className="text-[#f4be78] font-bold tracking-[0.2em] text-xs uppercase">
                Our Portfolio
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Featured{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f4be78] to-[#d96c4e]">
                Case Studies
              </span>
            </h2>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-[#d96c4e] hover:border-[#d96c4e] hover:shadow-[0_4px_20px_rgb(217,108,78,0.3)] transition-all duration-300"
            >
              View All Projects
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-[#0f2425] border border-white/10 cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgb(41,92,94,0.3)] transition-all duration-500"
            >
              {/* Project Image with Deep Zoom Effect */}
              <div className="absolute inset-0 w-full h-full bg-gray-900">
                <Image
                  src={project.image}
                  alt={project.title}
                  className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110 opacity-60 group-hover:opacity-100"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Multi-layered Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425] via-[#0f2425]/60 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-[#295c5e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              {/* Category Glass Badge (Top Right) */}
              <div className="absolute top-6 right-6 z-20 translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
                <span className="px-4 py-2 bg-[#0f2425]/60 backdrop-blur-md border border-white/10 text-[#f4be78] text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                  {project.category}
                </span>
              </div>

              {/* Interactive Content Box (Bottom) */}
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex flex-col justify-end transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                {/* Tech Stack Pills (Slide up and fade in on hover) */}
                <div className="flex flex-wrap gap-2 mb-5 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/5 text-white text-[11px] font-bold tracking-wide rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl font-extrabold text-white mb-2 leading-tight drop-shadow-md group-hover:text-[#f4be78] transition-colors duration-300">
                  {project.title}
                </h3>

                {/* Description Reveal */}
                <div className="overflow-hidden h-0 group-hover:h-[88px] transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                  <p className="text-gray-300 text-sm font-light leading-relaxed mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Animated Arrow CTA */}
                <div className="mt-6 flex items-center font-bold text-[#d96c4e] group-hover:text-white transition-colors duration-300">
                  <span className="text-sm uppercase tracking-wider">
                    Explore Case Study
                  </span>
                  <div className="ml-3 w-8 h-8 rounded-full border border-[#d96c4e] flex items-center justify-center group-hover:bg-[#d96c4e] group-hover:border-transparent transition-all duration-300">
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
