"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ExternalLink } from "lucide-react";
import { API_URL } from "@/utils/api";

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

const GalleryPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const json = response.ok ? await response.json() : [];

        const data = Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
            ? json
            : [];

        setProjects(data);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[GalleryPage] fetch error:", err);
        }
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#fdfdfd] pb-24">
      {/* Banner Section */}
      <div className="bg-[#1b3d3e] text-white py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#295c5e] rounded-full blur-[120px] opacity-40 pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-[#d96c4e] font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block">
            Our Work
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
            Portfolio &amp; <span className="text-[#d96c4e]">Projects</span>
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Explore our curated collection of high-performance web applications,
            custom software, and innovative digital products.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={40} className="animate-spin text-[#295c5e]" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#f9fafb] flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl font-black text-[#295c5e] opacity-30">
                K
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#1b3d3e] mb-3">
              Portfolio Coming Soon
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              We&apos;re curating our best projects to showcase here. In the
              meantime, get in touch to discuss your project.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-[#1b3d3e] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#d96c4e] transition-colors duration-300"
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

              return (
                <motion.div
                  key={project._id}
                  variants={cardVariants}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 shadow-sm transition-all duration-500 hover:shadow-xl"
                >
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={project.title || project.name || "Project"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0f2425] to-[#295c5e] flex items-center justify-center">
                      <span className="text-white/20 font-black text-3xl uppercase">
                        K
                      </span>
                    </div>
                  )}

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2425]/90 via-[#0f2425]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <p className="text-[#d96c4e] text-[9px] font-black uppercase tracking-widest mb-1">
                      {project.category || project.type || "Project"}
                    </p>
                    <h3 className="text-white font-bold text-sm drop-shadow-md mb-3">
                      {project.title || project.name}
                    </h3>
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest hover:text-[#f4be78] transition-colors"
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
