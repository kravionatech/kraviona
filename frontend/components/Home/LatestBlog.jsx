"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, PenTool } from "lucide-react";
import { API_URL } from "@/utils/api";
import PostCard from "@/components/Card/PostCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 },
  },
};

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

const LatestBlog = ({ initialPosts = [] }) => {
  const validInitialPosts = initialPosts.filter((post) => post?.slug).slice(0, 3);
  const [posts, setPosts] = useState(validInitialPosts);
  const [isLoading, setIsLoading] = useState(validInitialPosts.length === 0);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const url = `${API_URL}/public/posts?page=1&limit=3`;
        const response = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          setPosts([]);
          return;
        }

        const result = await response.json();
        const allPosts = parsePosts(result);
        const finalPosts = allPosts.filter((p) => p?.slug).slice(0, 3);
        setPosts(finalPosts);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[LatestBlog] Fetch error:", err?.message || err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestPosts();
  }, []);

  return (
    <section
      className="py-20 md:py-28 bg-[#FEFCF9] relative overflow-hidden"
      aria-labelledby="blog-heading"
    >
      {/* Background subtle decorative blobs */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute top-[-8%] right-[-4%] w-[36rem] h-[36rem] bg-[#EAF3F5] rounded-full blur-[110px]" />
        <div className="absolute bottom-[-8%] left-[-4%] w-[30rem] h-[30rem] bg-[#C85A3C]/5 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-[20px] bg-[#EAF3F5] border border-[#2D6E7A]/20 mb-5">
              <PenTool
                className="w-3.5 h-3.5 text-[#2D6E7A]"
                aria-hidden="true"
              />
              <span className="text-[#2D6E7A] font-bold tracking-widest text-[11px] uppercase">
                Our Insights
              </span>
            </div>

            <h2
              id="blog-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1A3840] tracking-tight mb-4 leading-[1.1]"
            >
              Tech &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6E7A] to-[#C85A3C]">
                Resources
              </span>
            </h2>
            <p className="text-[#5A7A82] text-base md:text-lg leading-relaxed">
              Stay ahead with our latest insights on MERN Stack, Technical SEO,
              and modern web performance.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              href="/blog"
              className="group flex items-center justify-center gap-2.5 px-6 py-3 bg-[#C85A3C] hover:bg-[#B04D31] text-white rounded-[6px] font-semibold shadow-sm hover:shadow-[0_4px_16px_rgba(200,90,60,0.3)] transition-all duration-300 text-sm"
              aria-label="View all blog posts"
            >
              View All Posts
              <ArrowRight
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              />
            </Link>
          </div>
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div
            className="flex flex-col items-center justify-center py-28 text-center"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="relative mb-5">
              <div className="absolute inset-0 bg-[#2A4A52] blur-xl opacity-15 rounded-full animate-pulse" />
              <Loader2
                size={44}
                className="animate-spin text-[#2A4A52] relative z-10"
              />
            </div>
            <p className="font-medium text-gray-400 tracking-wide text-sm animate-pulse">
              Loading latest insights…
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-gray-200 shadow-sm">
            No posts available at the moment. Check back soon!
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7"
            role="list"
            aria-label="Latest blog posts"
          >
            {posts
              .filter((post) => post?.slug)
              .map((post, idx) => (
                <motion.div
                  key={`${post.title || post.slug}-${idx}`}
                  variants={cardVariants}
                  role="listitem"
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default LatestBlog;
