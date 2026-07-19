"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, Search, SlidersHorizontal } from "lucide-react";
import {
  getId,
  getExcerpt,
  getCategoryId,
} from "@/utils/dataHelpers";
import { API_URL } from "@/utils/api";
import PostCard from "@/components/Card/PostCard";

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

const POSTS_FETCH_LIMIT = 100;

const parsePosts = (json) =>
  Array.isArray(json.posts)
    ? json.posts
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

const AllPostsFeed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = [];
        let pageToFetch = 1;
        let hasNextPage = true;

        while (hasNextPage) {
          const response = await fetch(
            `${API_URL}/public/posts?page=${pageToFetch}&limit=${POSTS_FETCH_LIMIT}`,
            {
              cache: "no-store",
              headers: { Accept: "application/json" },
            },
          );

          const json = response.ok ? await response.json() : {};
          posts.push(...parsePosts(json));

          hasNextPage = Boolean(json?.pagination?.hasNextPage);
          pageToFetch += 1;
        }

        setAllPosts(posts);
        setFilteredPosts(posts);

        // Build category list
        const catMap = new Map();
        posts.forEach((p) => {
          const catId = getCategoryId(p);
          if (catId && p.category?.name) catMap.set(catId, p.category.name);
        });
        setCategories(
          [...catMap.entries()].map(([id, name]) => ({ id, name })),
        );
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[AllPostsFeed] Error:", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const applyFilters = useCallback(() => {
    let result = [...allPosts];
    if (selectedCategory !== "all") {
      result = result.filter((p) => getCategoryId(p) === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          getExcerpt(p).toLowerCase().includes(q),
      );
    }
    setFilteredPosts(result);
  }, [allPosts, selectedCategory, searchQuery]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const visiblePosts = filteredPosts.filter((post) => post?.slug);

  return (
    <section id="all-posts" className="py-24 bg-[#f9fafb] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-[#d96c4e]" />
            <span className="text-[#d96c4e] font-black text-[10px] uppercase tracking-[0.25em]">
              All Articles
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1b3d3e] tracking-tight">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
              Every Post
            </span>
          </h2>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#295c5e]/30 focus:border-[#295c5e] transition-all"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#295c5e]/30 focus:border-[#295c5e] transition-all cursor-pointer min-w-[200px]"
            >
              <option value="all">All Categories</option>
              {categories.map((c, idx) => (
                <option key={`${c.name}-${idx}`} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 size={40} className="animate-spin text-[#295c5e]" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <p className="text-gray-400 text-lg font-medium">
              No articles found.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-6 py-2.5 bg-[#1b3d3e] text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-[#d96c4e] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {visiblePosts.map((post, idx) => {
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

          </>
        )}
      </div>
    </section>
  );
};

export default AllPostsFeed;
