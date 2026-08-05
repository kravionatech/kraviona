"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  MessageSquare,
  Send,
} from "lucide-react";
import { formatDate } from "@/utils/dataHelpers";
import { API_URL } from "@/utils/api";

const VISITOR_KEY = "kraviona_blog_visitor_id";

const defaultSummary = {
  views: 0,
  commentCount: 0,
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const getVisitorId = () => {
  if (typeof window === "undefined") return "";

  const existing = window.localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const generated =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(VISITOR_KEY, generated);
  return generated;
};

const getViewEventId = (visitorId) => {
  const uniquePart =
    typeof window.crypto?.randomUUID === "function"
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${visitorId}:${uniquePart}`;
};

export default function BlogEngagement({
  slug,
  title,
  initialSummary,
}) {
  const [visitorId, setVisitorId] = useState("");
  const [summary, setSummary] = useState({
    ...defaultSummary,
    ...(initialSummary || {}),
  });
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedView = useRef(false);
  const [form, setForm] = useState({
    authorName: "",
    email: "",
    comment: "",
  });

  const engagementEndpoint = useMemo(
    () => `${API_URL}/post/${encodeURIComponent(slug)}/engagement`,
    [slug],
  );

  const viewsEndpoint = useMemo(
    () => `${API_URL}/post/${encodeURIComponent(slug)}/views`,
    [slug],
  );

  const commentsEndpoint = useMemo(
    () => `${API_URL}/post/${encodeURIComponent(slug)}/comments`,
    [slug],
  );

  const loadEngagement = useCallback(
    async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const response = await fetch(engagementEndpoint, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });
        const result = await response.json();

        if (!response.ok || result?.success === false) {
          throw new Error(result?.error || "Unable to load engagement.");
        }

        setSummary({ ...defaultSummary, ...(result.data?.summary || {}) });
        setComments(result.data?.comments || []);
      } catch (error) {
        setStatus(error.message);
      } finally {
        setIsLoading(false);
      }
    },
    [engagementEndpoint, slug],
  );

  useEffect(() => {
    const id = getVisitorId();
    setVisitorId(id);
    loadEngagement();
  }, [loadEngagement]);

  useEffect(() => {
    if (!visitorId || hasTrackedView.current) return;

    const timer = window.setTimeout(async () => {
      if (document.visibilityState !== "visible" || hasTrackedView.current) return;

      hasTrackedView.current = true;

      try {
        const viewEventId = getViewEventId(visitorId);
        const response = await fetch(viewsEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-visitor-id": viewEventId,
          },
          body: JSON.stringify({
            visitorId: viewEventId,
          }),
        });
        const result = await response.json();

        if (response.ok && result?.success !== false) {
          setSummary({ ...defaultSummary, ...(result.data?.summary || {}) });
        }
      } catch {
        hasTrackedView.current = false;
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [viewsEndpoint, visitorId]);

  const submitComment = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setStatus("");
      const response = await fetch(commentsEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok || result?.success === false) {
        throw new Error(result?.error || "Unable to add comment.");
      }

      setSummary({ ...defaultSummary, ...(result.data?.summary || {}) });
      setComments((current) => [result.data.comment, ...current]);
      setForm((current) => ({ ...current, comment: "" }));
      setStatus("Comment added successfully.");
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#E8622A]">
            Reader Response
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-[#2A4A52]">
            What did you think?
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Comments help us improve future articles.
          </p>
        </div>
        {isLoading && (
          <span className="rounded-full bg-[#F5F7F8] px-3 py-1 text-xs font-bold text-gray-400">
            Syncing
          </span>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Metric icon={Eye} label="Views" value={summary.views} />
        <Metric icon={MessageSquare} label="Comments" value={summary.commentCount} />
      </div>

      {status && (
        <p
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-gray-100 bg-[#F5F7F8] px-4 py-3 text-sm font-medium text-[#1A2E33]"
        >
          {status}
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_0.9fr]">
        <form onSubmit={submitComment} className="rounded-lg bg-[#F5F7F8] p-4">
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#1A2E33]">
            Add a comment
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="sr-only" htmlFor="blog-comment-name">
              Your name
            </label>
            <input
              id="blog-comment-name"
              name="authorName"
              autoComplete="name"
              value={form.authorName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  authorName: event.target.value,
                }))
              }
              required
              placeholder="Your name"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#E8622A]"
            />
            <label className="sr-only" htmlFor="blog-comment-email">
              Email address
            </label>
            <input
              id="blog-comment-email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({ ...current, email: event.target.value }))
              }
              required
              type="email"
              placeholder="Email"
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#E8622A]"
            />
          </div>
          <label className="sr-only" htmlFor="blog-comment-message">
            Your comment
          </label>
          <textarea
            id="blog-comment-message"
            name="comment"
            value={form.comment}
            onChange={(event) =>
              setForm((current) => ({ ...current, comment: event.target.value }))
            }
            required
            rows={5}
            placeholder={`Share your thoughts on "${title}"`}
            className="mt-3 w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#E8622A]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#E8622A] px-5 py-3 text-sm font-black text-white transition-colors hover:bg-[#B84A1A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        <div>
          <h3 className="mb-4 text-sm font-black uppercase tracking-[0.16em] text-[#1A2E33]">
            Recent comments
          </h3>
          <div className="max-h-[430px] space-y-3 overflow-y-auto pr-1">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <article
                  key={comment._id}
                  className="rounded-lg border border-gray-100 bg-white p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-[#2A4A52]">
                        {comment.authorName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                    <MessageSquare className="h-4 w-4 text-[#E8622A]" />
                  </div>
                  <p className="text-sm leading-7 text-gray-600">
                    {comment.comment}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-[#F5F7F8] p-6 text-center text-sm text-gray-500">
                No comments yet. Be the first to respond.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-[#F5F7F8] p-3">
      <div className="mb-2 flex items-center gap-2 text-[#E8622A]">
        <Icon className="h-4 w-4" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p className="text-xl font-black text-[#2A4A52]">
        {formatNumber(value)}
      </p>
    </div>
  );
}
