"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { API_URL } from "@/utils/api";

// 1. Updated Category Interface

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const CategoryDiscovery = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const data = response.ok ? await response.json() : null;

        if (data?.success) {
          const publicCategories = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data.categories)
              ? data.categories
              : [];
          // Map the new data structure
          const formattedCategories = publicCategories.map((cat) => ({
            _id: cat._id,
            name: cat.name,
            count: cat.postCount || 0,
            link: `/category/${cat.slug}`,
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Failed to fetch categories:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-24 bg-[#fdfdfd] font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#d96c4e]"></span>
              <span className="text-[#d96c4e] font-bold tracking-[0.2em] text-[10px] uppercase">
                Explore Topics
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#1b3d3e] tracking-tight">
              Browse by{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
                Category
              </span>
            </h2>
          </div>

          <div className="hidden md:block flex-grow border-b border-dashed border-gray-200 ml-8 mb-4"></div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-[#295c5e]/20 border-t-[#295c5e] rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Category Cards */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {categories.map((category, idx) => (
              <motion.div
                key={`${category.name}-${idx}`}
                variants={cardVariants}
              >
                <Link
                  href={category.link}
                  className="group block min-h-32 rounded-xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#d96c4e]/40 hover:shadow-[0_18px_35px_rgba(15,36,37,0.08)]"
                >
                  <h3 className="truncate text-2xl font-black capitalize tracking-tight text-[#1b3d3e] transition-colors group-hover:text-[#d96c4e]">
                    {category.name}
                  </h3>

                  <span className="mt-5 inline-flex rounded-md bg-[#d96c4e]/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-[#a9472f]">
                    {category.count} {category.count === 1 ? "Article" : "Articles"}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] group hover:text-[#1b3d3e] transition-colors"
          >
            Looking for something specific?
            <span className="text-[#d96c4e] border-b border-[#d96c4e] pb-0.5 group-hover:border-[#1b3d3e] group-hover:text-[#1b3d3e] transition-colors">
              Contact Us
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryDiscovery;
