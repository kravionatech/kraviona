"use client";

import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import {
  AlertTriangle,
  BarChart3,
  Edit3,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const DAY = 24 * 60 * 60 * 1000;

function getReactions(post) {
  const reactions = post.reactions || {};
  return (
    Number(reactions.like || 0) +
    Number(reactions.dislike || 0) +
    Number(reactions.share || 0)
  );
}

function daysSince(value) {
  if (!value) return 0;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / DAY));
}

function getCategoryLabel(category) {
  if (!category) return "Uncategorized";
  if (typeof category === "string") return category;
  return category.name || category.slug || "Uncategorized";
}

function analyzePost(post) {
  const ageDays = daysSince(post.publishedAt || post.createdAt);
  const updatedDays = daysSince(post.updatedAt || post.createdAt);
  const views = Number(post.views || 0);
  const comments = Number(post.commentCount || 0);
  const reactions = getReactions(post);
  const engagement = comments + reactions;
  let score = 0;
  const reasons = [];

  if ((post.status || "").toLowerCase() !== "published") {
    score += 8;
    reasons.push("Not published");
  }

  if (ageDays >= 240) {
    score += 32;
    reasons.push("Old content");
  } else if (ageDays >= 120) {
    score += 22;
    reasons.push("Aging content");
  } else if (ageDays >= 60) {
    score += 12;
    reasons.push("Needs freshness check");
  }

  if (updatedDays >= 180) {
    score += 18;
    reasons.push("Not updated recently");
  } else if (updatedDays >= 90) {
    score += 10;
    reasons.push("Update recommended");
  }

  if (views < 25) {
    score += 22;
    reasons.push("Very low views");
  } else if (views < 100) {
    score += 12;
    reasons.push("Low views");
  }

  if (engagement === 0) {
    score += 18;
    reasons.push("No engagement");
  } else if (engagement < 3) {
    score += 8;
    reasons.push("Low engagement");
  }

  const level =
    score >= 70 ? "critical" : score >= 45 ? "warning" : score >= 25 ? "watch" : "healthy";

  return {
    ...post,
    ageDays,
    updatedDays,
    views,
    comments,
    reactions,
    engagement,
    decayScore: Math.min(score, 100),
    decayLevel: level,
    decayReasons: reasons.length ? reasons : ["Healthy"],
  };
}

const LEVEL_STYLES = {
  critical: "border-rose-200 bg-rose-50 text-rose-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  watch: "border-blue-200 bg-blue-50 text-blue-700",
  healthy: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function StatCard({ label, value, caption, icon: Icon, tone = "text-slate-700" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <Icon className={tone} size={19} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

export default function ContentDecayPage() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/private/posts?limit=100");
      const rawPosts = Array.isArray(response.data) ? response.data : [];

      setPosts(rawPosts.map(analyzePost).sort((a, b) => b.decayScore - a.decayScore));
    } catch (err) {
      setError(err.message || "Unable to load content decay data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchPosts, 0);
    return () => clearTimeout(timeout);
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesFilter = filter === "all" || post.decayLevel === filter;
      const needle = search.toLowerCase();
      const matchesSearch =
        !needle ||
        (post.title || "").toLowerCase().includes(needle) ||
        (post.slug || "").toLowerCase().includes(needle) ||
        getCategoryLabel(post.category).toLowerCase().includes(needle);

      return matchesFilter && matchesSearch;
    });
  }, [filter, posts, search]);

  const stats = useMemo(() => {
    const critical = posts.filter((post) => post.decayLevel === "critical").length;
    const warning = posts.filter((post) => post.decayLevel === "warning").length;
    const watch = posts.filter((post) => post.decayLevel === "watch").length;
    const avgScore = posts.length
      ? Math.round(posts.reduce((sum, post) => sum + post.decayScore, 0) / posts.length)
      : 0;

    return { critical, warning, watch, avgScore };
  }, [posts]);

  return (
    <Frame>
      <div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#d26c51]">
              SEO Operations
            </p>
            <h1 className="text-2xl font-bold text-slate-950">
              Content Decay
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Find stale posts that need refresh, internal links, or promotion.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchPosts}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Recalculate
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            label="Critical"
            value={stats.critical}
            caption="Highest refresh priority"
            icon={AlertTriangle}
            tone="text-rose-600"
          />
          <StatCard
            label="Warning"
            value={stats.warning}
            caption="Should be reviewed soon"
            icon={TrendingDown}
            tone="text-amber-600"
          />
          <StatCard
            label="Watch"
            value={stats.watch}
            caption="Monitor performance"
            icon={Eye}
            tone="text-blue-600"
          />
          <StatCard
            label="Avg Score"
            value={stats.avgScore}
            caption="Decay risk across posts"
            icon={BarChart3}
            tone="text-[#235056]"
          />
        </div>

        <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", "critical", "warning", "watch", "healthy"].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFilter(level)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
                    filter === level
                      ? "border-[#d26c51] bg-[#d26c51] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {level}
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
                placeholder="Search title, slug, category..."
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
              Calculating decay scores...
            </div>
          ) : filteredPosts.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Post
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Risk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Signals
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Last Update
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => (
                    <tr key={post._id} className="align-top">
                      <td className="max-w-md px-4 py-4">
                        <p className="font-semibold text-slate-950">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          /{post.slug}
                        </p>
                        <p className="mt-2 text-xs font-medium capitalize text-slate-500">
                          {post.status || "draft"} | {getCategoryLabel(post.category)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <span
                            className={`inline-flex w-fit rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                              LEVEL_STYLES[post.decayLevel]
                            }`}
                          >
                            {post.decayLevel}
                          </span>
                          <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-100">
                            <span
                              className="block h-full rounded-full bg-[#d26c51]"
                              style={{ width: `${post.decayScore}%` }}
                            />
                          </div>
                          <p className="text-xs font-semibold text-slate-500">
                            Score {post.decayScore}/100
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="grid gap-1 text-sm text-slate-600">
                          <span>{post.views} views</span>
                          <span>{post.engagement} engagements</span>
                          <span>{post.ageDays} days old</span>
                        </div>
                        <div className="mt-2 flex max-w-xs flex-wrap gap-1.5">
                          {post.decayReasons.map((reason) => (
                            <span
                              key={reason}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {reason}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(post.updatedAt || post.createdAt)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/blog/view/${post.slug}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                            aria-label="View post"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={`/blog/edit/${post._id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d26c51]/20 bg-[#d26c51]/10 text-[#d26c51] transition hover:bg-[#d26c51]/15"
                            aria-label="Edit post"
                          >
                            <Edit3 size={15} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-slate-500">
              No posts matched this content decay filter.
            </div>
          )}
        </div>
      </div>
    </Frame>
  );
}
