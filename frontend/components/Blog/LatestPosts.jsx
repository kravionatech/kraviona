"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight } from "lucide-react";
import { getId } from "@/utils/dataHelpers";
import { API_URL } from "@/utils/api";
import PostCard from "@/components/Card/PostCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const LatestPosts = () => {
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

        // FIX: Ensure correct parsing regardless of array location (json.posts vs json.data vs json)
        const allPosts = Array.isArray(json.posts)
          ? json.posts
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json)
              ? json
              : [];

        setPosts(allPosts.slice(0, 6));
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[LatestPosts]", err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-20 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-0.5 bg-[#d96c4e]" />
              <span className="text-[#d96c4e] font-black text-[10px] uppercase tracking-[0.25em]">
                Latest Posts
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1b3d3e] tracking-tight">
              Fresh{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#295c5e] to-[#d96c4e]">
                Insights
              </span>
            </h2>
          </div>
          <Link
            href="#all-posts"
            className="hidden md:flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#d96c4e] transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={40} className="animate-spin text-[#295c5e]" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-400 py-16">
            No posts available. Check back soon!
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post) => {
              const postId = getId(post._id);
              return (
                <motion.div
                  key={postId || post.slug}
                  variants={cardVariants}
                >
                  <PostCard post={post} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestPosts;
