"use client";

import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUS_OPTIONS = ["all", "approved", "pending", "spam", "trash"];

const STATUS_STYLES = {
  approved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  spam: "border-rose-200 bg-rose-50 text-rose-700",
  trash: "border-slate-200 bg-slate-100 text-slate-600",
};

function StatusBadge({ status }) {
  const value = status || "pending";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_STYLES[value] || STATUS_STYLES.pending
      }`}
    >
      {value}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, tone = "text-slate-700" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Icon className={tone} size={18} />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [counts, setCounts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const countMap = useMemo(
    () =>
      counts.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {}),
    [counts],
  );

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({ limit: "50" });
      if (status !== "all") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());

      const response = await apiRequest(`/comments?${params.toString()}`);

      setComments(Array.isArray(response.data) ? response.data : []);
      setCounts(Array.isArray(response.counts) ? response.counts : []);
      setPagination(response.pagination || { total: 0 });
    } catch (err) {
      setError(err.message || "Unable to load comments");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timeout = setTimeout(fetchComments, 250);
    return () => clearTimeout(timeout);
  }, [fetchComments]);

  const updateStatus = async (commentId, nextStatus) => {
    try {
      setBusyId(commentId);
      const response = await apiRequest(`/comments/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });

      setComments((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? response.data || comment : comment,
        ),
      );
      fetchComments();
    } catch (err) {
      setError(err.message || "Unable to update comment");
    } finally {
      setBusyId("");
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment permanently?")) return;

    try {
      setBusyId(commentId);
      await apiRequest(`/comments/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((comment) => comment._id !== commentId));
      fetchComments();
    } catch (err) {
      setError(err.message || "Unable to delete comment");
    } finally {
      setBusyId("");
    }
  };

  return (
    <Frame>
      <div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#d26c51]">
              Blog Engine
            </p>
            <h1 className="text-2xl font-bold text-slate-950">
              Comment Moderation
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review reader comments, change status, and remove spam.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComments}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            label="Total"
            value={pagination.total || 0}
            icon={MessageSquare}
          />
          <StatCard
            label="Approved"
            value={countMap.approved || 0}
            icon={CheckCircle2}
            tone="text-emerald-600"
          />
          <StatCard
            label="Pending"
            value={countMap.pending || 0}
            icon={AlertCircle}
            tone="text-amber-600"
          />
          <StatCard
            label="Spam"
            value={countMap.spam || 0}
            icon={ShieldAlert}
            tone="text-rose-600"
          />
        </div>

        <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setStatus(option)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
                    status === option
                      ? "border-[#d26c51] bg-[#d26c51] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search author, email, slug..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#d26c51] focus:bg-white"
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center gap-3 text-sm font-semibold text-slate-500">
              <Loader2 className="animate-spin" size={18} />
              Loading comments...
            </div>
          ) : comments.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Comment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Post
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comments.map((comment) => (
                    <tr key={comment._id} className="align-top">
                      <td className="max-w-xl px-4 py-4">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-slate-900">
                            {comment.authorName}
                          </p>
                          <span className="text-xs text-slate-400">
                            {comment.email}
                          </span>
                        </div>
                        <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                          {comment.comment}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                          {comment.postID?.title || comment.postSlug}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          /{comment.postID?.slug || comment.postSlug}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <StatusBadge status={comment.status} />
                          <select
                            value={comment.status}
                            disabled={busyId === comment._id}
                            onChange={(event) =>
                              updateStatus(comment._id, event.target.value)
                            }
                            className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm outline-none focus:border-[#d26c51]"
                          >
                            {STATUS_OPTIONS.filter((item) => item !== "all").map(
                              (option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(comment.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          disabled={busyId === comment._id}
                          onClick={() => deleteComment(comment._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:opacity-50"
                          aria-label="Delete comment"
                        >
                          {busyId === comment._id ? (
                            <Loader2 className="animate-spin" size={15} />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-slate-500">
              No comments found.
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
