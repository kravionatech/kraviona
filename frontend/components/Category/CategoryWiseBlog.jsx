"use client";

import React, { useState, useEffect, useRef } from "react";
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

const CategoryWiseBlog = ({
  category,
  initialPosts = [],
  initialPagination = null,
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0);
  const skipInitialRequest = useRef(initialPosts.length > 0);

  // 1. Fetch Posts based on the category slug
  useEffect(() => {
    if (skipInitialRequest.current && page === 1) {
      skipInitialRequest.current = false;
      return undefined;
    }

    skipInitialRequest.current = false;
    const controller = new AbortController();

    const fetchCategoryPosts = async () => {
      setIsLoading(true);
      try {
        const url = `${API_URL}/public/posts?category=${encodeURIComponent(category)}&page=${page}&limit=12`;
        const response = await fetch(url, {
          cache: "force-cache",
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          setPosts([]);
          return;
        }

        const result = await response.json();
        const allPosts = Array.isArray(result.posts)
          ? result.posts
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result)
              ? result
              : [];
        setPosts(
          allPosts.filter((post) => {
            const slug = post?.category?.slug;
            const nameSlug = post?.category?.name
              ?.toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "");
            return post?.slug && (slug === category || nameSlug === category);
          }),
        );
        setPagination(result.pagination || null);
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.warn("[CategoryWiseBlog] Fetch error:", error?.message || error);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (category) {
      fetchCategoryPosts();
    }

    return () => controller.abort();
  }, [category, page]);

  // 2. Format the Category Name for the Header
  const formattedCategoryName =
    posts.length > 0 && posts[0].category?.name
      ? posts[0].category.name
      : category.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <section className="py-24 md:py-32 bg-[#F5F7F8] font-sans min-h-screen">
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
              <span className="text-[#E8622A] text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-[#E8622A]/10 rounded-md capitalize">
                {formattedCategoryName}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1A2E33] tracking-tight leading-[1.1] capitalize">
              {formattedCategoryName}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A4A52] to-[#E8622A]">
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
          <div className="flex flex-col items-center justify-center py-20 text-[#2A4A52]">
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
            <h3 className="text-2xl font-bold text-[#1A2E33] mb-3">
              No articles found
            </h3>
            <p className="text-gray-500 mb-8">
              We are currently working on fresh content for the{" "}
              <span className="font-bold text-[#E8622A] capitalize">
                {formattedCategoryName}
              </span>{" "}
              category. Check back soon!
            </p>
            <Link
              href="#blogs"
              className="inline-block px-8 py-4 bg-[#1A2E33] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-[#E8622A] transition-colors duration-300"
            >
              Back to All Articles
            </Link>
          </motion.div>
        )}
        {(pagination?.totalPages || 0) > 1 && (
          <nav
            className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6"
            aria-label={`${formattedCategoryName} article pagination`}
          >
            <p className="text-sm font-semibold text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage || isLoading}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-[#2A4A52] transition hover:border-[#2A4A52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!pagination.hasNextPage || isLoading}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-lg bg-[#2A4A52] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2A4A52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
};

export default CategoryWiseBlog;
