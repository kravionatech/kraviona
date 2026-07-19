"use client";

import ErrorBox from "@/components/Error/ErrorBox";
import { PageLoader } from "@/components/Loadingspinner";
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
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";

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
  const [search, setSearch] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/private/posts`,
        {
          method: "GET",
          headers: { "content-type": "application/json" },
          credentials: "include",
        },
      );
      const data = await res.json();
      if (data.success) {
        setPosts(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.error || data.message || "Something went wrong");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeletePost = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this post?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#EF4444",
    });
    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        Swal.fire({ title: "Deleted", text: data.message, icon: "success" });
      } else {
        Swal.fire({
          title: "Failed",
          text: data.message || "Something went wrong",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({ title: "Error", text: error.message, icon: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchPosts, 0);
    return () => clearTimeout(timeout);
  }, [fetchPosts]);

  const filtered = posts.filter(
    (p) =>
      (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.author?.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const publishedCount = posts.filter(
    (p) => (p.status || "").toLowerCase() === "published",
  ).length;
  const draftCount = posts.filter(
    (p) => (p.status || "draft").toLowerCase() === "draft",
  ).length;
  const scheduledCount = posts.filter(
    (p) => (p.status || "").toLowerCase() === "scheduled",
  ).length;

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <PageLoader
          section="Blog Engine"
          title="Blog Posts"
          message="Loading posts..."
        />
        <p className="mt-3 text-sm text-gray-400 animate-pulse">
          Scanning posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorBox error={error} />
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
              {posts.length}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>
          {search && (
            <span className="text-xs text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#1A2B3C] text-white text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4 w-16 text-center">#</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((post, index) => (
                  <tr
                    key={post._id}
                    className="group hover:bg-orange-50/40 transition-colors duration-150 relative"
                  >
                    {/* Accent stripe on hover */}
                    <td className="px-6 py-4 text-center text-gray-400 text-sm">
                      <span className="font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
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
                          href={`/blog/view/${post.slug}`}
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing {filtered.length} of {posts.length} post
              {posts.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
