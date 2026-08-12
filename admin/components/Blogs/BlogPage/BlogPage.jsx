"use client";

import Pagination from "@/components/Pagination";
import { apiRequest } from "@/components/api";
import {
  Edit,
  Eye,
  Plus,
  Trash,
  Loader2,
  Search,
  FileText,
  TrendingUp,
  CalendarClock,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    published: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    draft: "bg-amber-50 text-amber-700 border border-amber-200",
    scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
    archived: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  const key = (status || "draft").toLowerCase();
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${styles[key] || styles.draft}`}
    >
      {status || "Draft"}
    </span>
  );
};

const formatPostDate = (post) => {
  const value =
    (post.status || "").toLowerCase() === "scheduled"
      ? post.scheduledAt
      : post.publishedAt || post.createdAt;

  if (!value) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPosts: 0,
    currentPage: 1,
    totalPages: 0,
    limit: 20,
    statusCounts: {
      published: 0,
      draft: 0,
      scheduled: 0,
      archived: 0,
    },
  });

  const fetchPosts = useCallback(async (signal) => {
    const timeoutController = new AbortController();
    const timeout = setTimeout(() => timeoutController.abort(), 12000);
    const requestSignal =
      signal && typeof AbortSignal.any === "function"
        ? AbortSignal.any([signal, timeoutController.signal])
        : timeoutController.signal;

    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);

      const data = await apiRequest(
        `/private/posts?${params.toString()}`,
        { signal: requestSignal },
      );
      const nextPagination = data.pagination || {
        totalPosts: 0,
        currentPage: page,
        totalPages: 0,
        limit: 20,
        statusCounts: {},
      };

      if (nextPagination.totalPages > 0 && page > nextPagination.totalPages) {
        setPage(nextPagination.totalPages);
        return;
      }

      setPosts(Array.isArray(data.data) ? data.data : []);
      setPagination(nextPagination);
    } catch (error) {
      if (error.name === "AbortError" && signal?.aborted) return;
      setError(
        timeoutController.signal.aborted
          ? "Posts request timed out. Check the API connection and retry."
          : error.message,
      );
    } finally {
      clearTimeout(timeout);
      if (!signal?.aborted) setLoading(false);
    }
  }, [page, search, status]);

  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) return;

    try {
      setDeletingId(id);
      const data = await apiRequest(`/post/${id}`, {
        method: "DELETE",
      });

      if (posts.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchPosts();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => fetchPosts(controller.signal), 0);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [fetchPosts]);

  const filtered = posts;

  const publishedCount = pagination.statusCounts?.published || 0;
  const draftCount = pagination.statusCounts?.draft || 0;
  const scheduledCount = pagination.statusCounts?.scheduled || 0;

  if (loading) {
    return (
      <div className="min-h-full w-full bg-[#F8F9FB] p-8" aria-live="polite">
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-3 w-32 animate-pulse rounded bg-orange-100" />
            <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="h-11 w-32 animate-pulse rounded-lg bg-orange-100" />
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="h-10 max-w-sm animate-pulse rounded-lg bg-slate-100" />
          </div>
          <div className="space-y-px bg-slate-100">
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-[50px_2fr_1fr_100px_120px] gap-5 bg-white px-6 py-5"
              >
                {[0, 1, 2, 3, 4].map((cell) => (
                  <div
                    key={cell}
                    className="h-4 animate-pulse rounded bg-slate-100"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full w-full items-center justify-center bg-[#F8F9FB] p-8">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <AlertCircle size={24} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load blog posts
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => fetchPosts()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#235056] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-[#F8F9FB] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-1">
              Content Management
            </p>
            <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          </div>
          <Link
            href="/blog/new"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors text-white px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm shadow-orange-200"
          >
            <Plus size={16} strokeWidth={2.5} />
            New Post
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-5 flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
            <FileText size={15} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">
              {pagination.totalPosts || 0}
            </span>
            <span className="text-xs text-gray-400">total</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-lg px-4 py-2.5 shadow-sm">
            <TrendingUp size={15} className="text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">
              {publishedCount}
            </span>
            <span className="text-xs text-gray-400">published</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-amber-200 rounded-lg px-4 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span className="text-sm font-semibold text-amber-700">
              {draftCount}
            </span>
            <span className="text-xs text-gray-400">drafts</span>
          </div>
          <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-4 py-2.5 shadow-sm">
            <CalendarClock size={15} className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-700">
              {scheduledCount}
            </span>
            <span className="text-xs text-gray-400">scheduled</span>
          </div>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
            {["all", "published", "draft"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => { setPage(1); setStatus(item); }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition ${
                  status === item ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {search && (
            <span className="text-xs text-gray-400">
              {pagination.totalPosts} result
              {pagination.totalPosts !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#1A2B3C] text-white text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Thumbnail</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((post) => (
                  <tr
                    key={post._id}
                    className="group hover:bg-orange-50/40 transition-colors duration-150 relative"
                  >
                    <td className="px-6 py-4">
                      {post.featuredImage?.url ? (
                        <img src={post.featuredImage.url} alt="" className="h-10 w-[60px] rounded object-cover" />
                      ) : (
                        <span className="flex h-10 w-[60px] items-center justify-center rounded bg-gray-100 text-xs text-gray-400">No image</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900 text-sm truncate block max-w-xs">
                        {post.title || "Untitled"}
                      </span>
                      {post.slug && (
                        <span className="text-xs text-gray-400 font-mono">
                          /{post.slug}
                        </span>
                      )}
                      {post.excerpt && (
                        <span className="mt-1 block max-w-xs truncate text-xs text-gray-500">{post.excerpt}</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(post.author?.name || "?")[0].toUpperCase()}
                        </div>
                        <span className="text-sm text-gray-700">
                          {post.author?.name || "Unknown"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={post.status} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatPostDate(post)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-1">
                        {/* View */}
                        <Link
                          href={`/blog/view/${post._id}`}
                          title="View post"
                          className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150"
                        >
                          <Eye size={16} />
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/blog/edit/${post._id}`}
                          title="Edit post"
                          className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-150"
                        >
                          <Edit size={16} />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post._id)}
                          disabled={deletingId === post._id}
                          title="Delete post"
                          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {deletingId === post._id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <FileText size={22} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">
                        {search
                          ? `No posts matching "${search}"`
                          : "No posts yet"}
                      </p>
                      {!search && (
                        <Link
                          href="/blog/new"
                          className="text-orange-500 hover:text-orange-600 text-sm font-semibold underline underline-offset-2"
                        >
                          Create your first post →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.currentPage || page}
          totalPages={pagination.totalPages || 0}
          total={pagination.totalPosts || 0}
          limit={pagination.limit || 20}
          itemLabel="posts"
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default BlogPage;
