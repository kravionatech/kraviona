"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { getId } from "@/utils/dataHelpers";
import { API_URL } from "@/utils/api";
import PostCard from "@/components/Card/PostCard";

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 20 },
  },
};

const CategoryWiseBlog = ({ category }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Posts based on the category slug
  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      try {
        const url = `${API_URL}/public/posts?limit=100`;
        console.warn("[CategoryWiseBlog] Fetching:", url, "| category:", category);
        const response = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        console.warn("[CategoryWiseBlog] Response status:", response.status, response.ok);
        if (!response.ok) {
          console.warn("[CategoryWiseBlog] Response NOT OK");
          setPosts([]);
          return;
        }

        const result = await response.json();
        console.warn("[CategoryWiseBlog] Response keys:", Object.keys(result));
        const allPosts = Array.isArray(result.posts)
          ? result.posts
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];
        console.warn("[CategoryWiseBlog] All posts count:", allPosts.length);

        const categoryPosts = allPosts.filter((post) => {
          const categorySlug = post.category?.slug || "";
          const categoryName = post.category?.name || "";

          return (
            categorySlug === category ||
            categoryName.toLowerCase().replace(/\s+/g, "-") === category
          );
        });

        console.warn("[CategoryWiseBlog] Category posts count:", categoryPosts.length);
        if (allPosts.length > 0 && categoryPosts.length === 0) {
          console.warn("[CategoryWiseBlog] Category filter emptied all posts!");
          console.warn("[CategoryWiseBlog] Looking for category:", category);
          console.warn("[CategoryWiseBlog] Available slugs:", [...new Set(allPosts.map(p => p.category?.slug))]);
          console.warn("[CategoryWiseBlog] Available names:", [...new Set(allPosts.map(p => p.category?.name))]);
        }
        setPosts(categoryPosts);
      } catch (error) {
        console.warn("[CategoryWiseBlog] Fetch error:", error?.message || error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (category) {
      fetchCategoryPosts();
    }
  }, [category]);

  // 2. Format the Category Name for the Header
  const formattedCategoryName =
    posts.length > 0 && posts[0].category?.name
      ? posts[0].category.name
      : category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <section className="py-24 md:py-32 bg-[#f9fafb] font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-gray-300">/</span>
              <span className="text-[#d96c4e] text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#d96c4e]/10 rounded-md capitalize">
                {formattedCategoryName}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1b3d3e] tracking-tight leading-[1.1] capitalize">
              {formattedCategoryName}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
                Articles
              </span>
            </h1>

            <p className="mt-6 text-gray-500 text-lg">
              Explore our latest insights, case studies, and expert guides
              specifically focused on {formattedCategoryName}.
            </p>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#295c5e]">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="font-medium animate-pulse tracking-widest uppercase text-xs">
              Loading Articles...
            </p>
          </div>
        ) : posts.length > 0 ? (
          /* Blog Grid */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-12"
          >
            {posts
              .filter((post) => post?.slug)
              .map((post, idx) => {
                const postId = getId(post._id);
                return (
                  <motion.div
                    key={`${post.title || postId || post.slug}-${idx}`}
                    variants={cardVariants}
                  >
                    <PostCard post={post} />
                  </motion.div>
                );
              })}
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 max-w-xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-12"
          >
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 text-gray-300">
              <svg
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-[#1b3d3e] mb-3">
              No articles found
            </h3>
            <p className="text-gray-500 mb-8">
              We are currently working on fresh content for the{" "}
              <span className="font-bold text-[#d96c4e] capitalize">
                {formattedCategoryName}
              </span>{" "}
              category. Check back soon!
            </p>
            <Link
              href="#blogs"
              className="inline-block px-8 py-4 bg-[#1b3d3e] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#d96c4e] transition-colors duration-300"
            >
              Back to All Articles
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CategoryWiseBlog;
