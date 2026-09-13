"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const GalleryPage = ({ initialProjects = [] }) => {
  const projects = Array.isArray(initialProjects) ? initialProjects : [];

  return (
    <div className="min-h-screen bg-[#F5F7F8] pb-24">
      {/* Banner Section */}
      <div className="bg-hero-gradient text-dark py-20 px-4 text-center relative overflow-hidden border-b border-gray-200/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#E8622A] font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">
            Our Work
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-dark">
            Portfolio &amp; <span className="text-[#E8622A]">Projects</span>
          </h1>
          <p className="text-brand-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Explore our curated collection of high-performance web applications,
            custom software, and innovative digital products.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {projects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-black text-primary opacity-30">
                K
              </span>
            </div>
            <h3 className="text-2xl font-bold text-dark mb-3">
              Portfolio Coming Soon
            </h3>
            <p className="text-brand-muted mb-8 max-w-sm mx-auto text-sm">
              We&apos;re curating our best projects to showcase here. In the
              meantime, get in touch to discuss your project.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-[#E8622A] text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#B84A1A] transition-all shadow-brand-sm"
            >
              Start a Project
            </Link>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((project) => {
              const imageUrl =
                project.image ||
                project.thumbnail ||
                project.coverImage ||
                null;
              const projectTitle = project.title || project.name || "Kraviona project";
              const projectCategory = project.category || project.type || "digital product";
              const projectAlt =
                project.imageAlt ||
                project.alt ||
                `${projectTitle} — ${projectCategory} project by Kraviona Tech Solutions`;

              return (
                <motion.div
                  key={project._id}
                  variants={cardVariants}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-xl"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={projectAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2A4A52] to-[#2A4A52] flex items-center justify-center">
                      <span className="text-white/20 font-black text-3xl uppercase">
                        K
                      </span>
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A4A52]/90 via-[#2A4A52]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-[#E8622A] text-[9px] font-black uppercase tracking-widest mb-1">
                      {project.category || project.type || "Project"}
                    </p>
                    <h3 className="text-white font-bold text-sm drop-shadow-md mb-3">
                      {projectTitle}
                    </h3>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-[#F28C5E] transition-colors"
                      >
                        View Live <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
