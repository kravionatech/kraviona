"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Newspaper, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { API_URL } from "@/utils/api";
import NewsCard from "./NewsCard";
import NewsHeroCard from "./NewsHeroCard";

const POSTS_FETCH_LIMIT = 12;

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

async function fetchNewsPosts({ page = 1, limit = POSTS_FETCH_LIMIT, category = "", search = "" } = {}) {
  const params = new URLSearchParams({
    contentType: "news",
    page: String(page),
    limit: String(limit),
  });
  if (category) params.set("category", category);
  if (search) params.set("search", search);

  const res = await fetch(`${API_URL}/public/posts?${params.toString()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return res.ok ? res.json() : {};
}

async function fetchNewsCategories() {
  const res = await fetch(
    `${API_URL}/categories?contentType=news`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );
  return res.ok ? res.json() : {};
}

// ─── Category Filter Bar ──────────────────────────────────────────────────────
function CategoryBar({ categories, selected, onSelect }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect("")}
        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
          !selected
            ? "bg-[#1a2e35] text-white shadow"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id || cat.slug}
          onClick={() => onSelect(cat.slug)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all capitalize ${
            selected === cat.slug
              ? "bg-[#1a2e35] text-white shadow"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function NewsListingLayout({ initialPosts = [], initialPagination = {} }) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch categories
  useEffect(() => {
    fetchNewsCategories()
      .then((json) => {
        const cats = Array.isArray(json?.data) ? json.data : [];
        setCategories(cats);
      })
      .catch(() => {});
  }, []);

  // Fetch posts on filter/search/page change
  const loadPosts = useCallback(
    async (opts = {}) => {
      const isLoadMore = opts.loadMore === true;
      const currentPage = isLoadMore ? page + 1 : 1;

      isLoadMore ? setLoadingMore(true) : setLoading(true);
      setError(null);

      try {
        const json = await fetchNewsPosts({
          page: currentPage,
          limit: POSTS_FETCH_LIMIT,
          category: selectedCategory,
          search: debouncedSearch,
        });
        const newPosts = parsePosts(json);

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...newPosts]);
          setPage(currentPage);
        } else {
          setPosts(newPosts);
          setPage(1);
        }
        setPagination(json?.pagination || {});
      } catch {
        setError("Failed to load news. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, debouncedSearch, page]
  );

  // Trigger load on filter/search change (not on initial mount — SSR handles that)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) { setMounted(true); return; }
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch]);

  const hasMore = pagination?.hasNextPage || (pagination?.page < pagination?.totalPages);
  const featuredPost = posts[0] || null;
  const gridPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <div className="bg-[#0f1a1e] pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 bg-[#e84a2f] rounded-xl">
              <Newspaper size={18} className="text-white" />
            </div>
            <span className="text-[#e84a2f] text-xs font-extrabold uppercase tracking-[0.2em]">
              Kraviona News
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 leading-tight">
            Latest Tech News
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Breaking stories, industry insights, and everything happening in AI,
            Web Development, and the Digital World.
          </p>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-[64px] z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search news…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2a4a52] focus:ring-2 focus:ring-[#2a4a52]/10 bg-gray-50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Toggle filters on mobile */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 text-sm text-gray-600 font-semibold px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 md:hidden"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Category bar — always visible on desktop */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <CategoryBar
              categories={categories}
              selected={selectedCategory}
              onSelect={(slug) => { setSelectedCategory(slug); }}
            />
          </div>
        </div>

        {/* Mobile filter panel */}
        {showFilters && (
          <div className="md:hidden px-4 pb-3 border-t border-gray-100">
            <CategoryBar
              categories={categories}
              selected={selectedCategory}
              onSelect={(slug) => { setSelectedCategory(slug); setShowFilters(false); }}
            />
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-[#2a4a52]" />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => loadPosts()}
              className="inline-flex items-center gap-2 bg-[#E8622A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#B84A1A] transition-all shadow-brand-sm"
            >
              <RefreshCw size={14} />
              Try again
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <Newspaper size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-400">No news found</p>
            <p className="text-gray-400 mt-1 text-sm">
              {search || selectedCategory
                ? "Try adjusting your filters"
                : "Check back soon for the latest stories"}
            </p>
          </div>
        ) : (
          <>
            {/* Featured hero card */}
            {featuredPost && !debouncedSearch && !selectedCategory && (
              <div className="mb-10">
                <NewsHeroCard post={featuredPost} />
              </div>
            )}

            {/* Section label */}
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                {debouncedSearch || selectedCategory ? "Results" : "Latest Stories"}
              </h2>
              <div className="flex-1 h-px bg-gray-200" />
              {pagination?.total > 0 && (
                <span className="text-xs text-gray-400 font-medium">
                  {pagination.total} articles
                </span>
              )}
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(debouncedSearch || selectedCategory ? posts : gridPosts).map((post) => (
                <NewsCard key={post._id || post.slug} post={post} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => loadPosts({ loadMore: true })}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 bg-[#E8622A] text-white px-7 py-3 rounded-xl text-sm font-bold hover:bg-[#B84A1A] disabled:opacity-60 transition-all shadow-brand-sm hover:shadow-brand-md hover:-translate-y-0.5"
                >
                  {loadingMore ? (
                    <><Loader2 size={15} className="animate-spin" /> Loading…</>
                  ) : (
                    "Load more stories"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
