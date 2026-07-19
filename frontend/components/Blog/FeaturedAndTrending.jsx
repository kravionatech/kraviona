"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Star } from "lucide-react";
import { getId } from "@/utils/dataHelpers";
import { API_URL } from "@/utils/api";
import PostCard from "@/components/Card/PostCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

// ─── Main Component ────────────────────────────────────────────────────────────
const FeaturedAndTrending = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_URL}/public/posts?limit=100`, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const json = response.ok ? await response.json() : {};

        // FIX: Extract posts correctly based on different possible JSON wrappers
        const allPosts = Array.isArray(json.posts)
          ? json.posts
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];

        setPosts(allPosts.slice(0, 7));
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[FeaturedAndTrending] fetch error:", err);
        }
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center h-60">
          <Loader2 size={40} className="animate-spin text-[#295c5e]" />
        </div>
      </section>
    );
  }

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-[#d96c4e]" />
              <span className="text-[#d96c4e] font-black text-[10px] uppercase tracking-[0.25em]">
                Editors&apos; Picks
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1b3d3e] tracking-tight">
              Featured &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
                Trending
              </span>
            </h2>
          </div>
          <Link
            href="#all-posts"
            className="hidden md:flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#d96c4e] transition-colors"
          >
            All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts
            .filter((post) => post?.slug)
            .slice(0, 6)
            .map((post) => (
              <motion.div
                key={getId(post._id) || post.slug}
                variants={itemVariants}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedAndTrending;
