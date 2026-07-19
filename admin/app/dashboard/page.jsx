"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  Database,
  Eye,
  FileText,
  Image as ImageIcon,
  Inbox,
  Mail,
  MessageSquare,
  Newspaper,
  RefreshCw,
  Tag,
  Share2,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Frame from "@/components/Frame/Frame";
import { apiRequest, formatCurrency, formatDate } from "@/components/api";

const COLORS = {
  ink: "#111827",
  soft: "#64748b",
  faint: "#94a3b8",
  border: "#e5e7eb",
  surface: "#ffffff",
  bg: "#f4f6f8",
  primary: "#235056",
  accent: "#d26c51",
  amber: "#f59e0b",
  blue: "#2563eb",
  green: "#16a34a",
  violet: "#7c3aed",
  rose: "#e11d48",
  cyan: "#0891b2",
};

const CHART_COLORS = [
  COLORS.primary,
  COLORS.accent,
  COLORS.blue,
  COLORS.green,
  COLORS.violet,
  COLORS.amber,
  COLORS.rose,
  COLORS.cyan,
];

const MODEL_META = {
  users: { icon: Users, color: COLORS.blue },
  team: { icon: Users, color: COLORS.green },
  posts: { icon: Newspaper, color: COLORS.primary },
  categories: { icon: Tag, color: COLORS.violet },
  comments: { icon: MessageSquare, color: COLORS.amber },
  media: { icon: ImageIcon, color: COLORS.cyan },
  leads: { icon: Inbox, color: COLORS.accent },
  messages: { icon: Mail, color: COLORS.rose },
  newsletters: { icon: FileText, color: COLORS.green },
};

const STATUS_STYLES = {
  New: "bg-blue-50 text-blue-700 border-blue-100",
  Contacted: "bg-violet-50 text-violet-700 border-violet-100",
  Qualified: "bg-cyan-50 text-cyan-700 border-cyan-100",
  Proposal: "bg-amber-50 text-amber-700 border-amber-100",
  Won: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Lost: "bg-rose-50 text-rose-700 border-rose-100",
  unread: "bg-rose-50 text-rose-700 border-rose-100",
  read: "bg-blue-50 text-blue-700 border-blue-100",
  replied: "bg-emerald-50 text-emerald-700 border-emerald-100",
  archived: "bg-slate-50 text-slate-600 border-slate-100",
  published: "bg-emerald-50 text-emerald-700 border-emerald-100",
  draft: "bg-amber-50 text-amber-700 border-amber-100",
  scheduled: "bg-blue-50 text-blue-700 border-blue-100",
};

const numberFormatter = new Intl.NumberFormat("en-IN");
const compactFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const formatNumber = (value) => numberFormatter.format(Number(value || 0));
const formatCompact = (value) => compactFormatter.format(Number(value || 0));

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
        STATUS_STYLES[status] || "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      {status || "Unknown"}
    </span>
  );
}

function EmptyState({ label = "No data yet" }) {
  return (
    <div className="flex min-h-[140px] items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
      {label}
    </div>
  );
}

function LoadingDashboard() {
  return (
    <Frame>
      <div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8">
        <div className="mb-6 h-24 animate-pulse rounded-lg bg-white" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-lg bg-white"
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <p className="mb-1 font-semibold text-slate-900">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="text-slate-600">
          <span style={{ color: item.color }}>●</span>{" "}
          {item.name || item.dataKey}: {formatNumber(item.value)}
        </p>
      ))}
    </div>
  );
}

function KpiCard({ title, value, caption, icon: Icon, color = COLORS.primary }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${color}14`, color }}
        >
          <Icon size={18} />
        </span>
        <TrendingUp size={16} className="text-slate-300" />
      </div>
      <p className="text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

function ModelCard({ item }) {
  const meta = MODEL_META[item.key] || { icon: Database, color: COLORS.soft };
  const Icon = meta.icon;
  const trendPositive = Number(item.trendPercent || 0) >= 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {item.label}
            </p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              {item.description}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            trendPositive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {trendPositive ? "+" : ""}
          {item.trendPercent || 0}%
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-slate-950">
            {formatNumber(item.total)}
          </p>
          <p className="text-xs text-slate-500">total records</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800">
            {formatNumber(item.currentMonth)}
          </p>
          <p className="text-xs text-slate-500">this month</p>
        </div>
      </div>
    </div>
  );
}

function BreakdownList({ title, data }) {
  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-slate-900">{title}</h2>
      {!data.length ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = total
              ? Math.round((Number(item.value || 0) / total) * 100)
              : 0;

            return (
              <div key={item.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">{item.name}</span>
                  <span className="font-bold text-slate-900">
                    {formatNumber(item.value)} ({percentage}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);
      const result = await apiRequest("/analytics/dashboard");
      setAnalytics(result.data);
    } catch (err) {
      setError(err.message || "Unable to load analytics dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialAnalytics() {
      try {
        const result = await apiRequest("/analytics/dashboard");
        if (!isActive) return;

        setAnalytics(result.data);
        setError("");
      } catch (err) {
        if (!isActive) return;
        setError(err.message || "Unable to load analytics dashboard");
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadInitialAnalytics();

    return () => {
      isActive = false;
    };
  }, []);

  const summary = analytics?.summary || {};
  const timeline = analytics?.timeline || [];
  const modelCards = analytics?.modelCards || [];
  const breakdowns = analytics?.breakdowns || {};
  const recent = analytics?.recent || {};

  const leadSourceChart = useMemo(
    () =>
      (breakdowns.leadSources || []).map((item, index) => ({
        ...item,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      })),
    [breakdowns.leadSources],
  );

  const postStatusChart = useMemo(
    () =>
      (breakdowns.postStatuses || []).map((item, index) => ({
        ...item,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      })),
    [breakdowns.postStatuses],
  );

  if (isLoading && !analytics) return <LoadingDashboard />;

  return (
    <Frame>
      <div className="min-h-full bg-[#f4f6f8] text-slate-950">
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d26c51]">
                  Admin analytics
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Kraviona Business Dashboard
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                  Real-time view of users, content, leads, messages, media,
                  newsletters, and sales pipeline from the backend database.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  Updated: {formatDate(analytics?.generatedAt)}
                </div>
                <button
                  type="button"
                  onClick={loadAnalytics}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1b4247] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Pipeline Value"
              value={formatCurrency(summary.pipelineValue)}
              caption={`${formatCurrency(summary.wonValue)} won value`}
              icon={BarChart3}
              color={COLORS.primary}
            />
            <KpiCard
              title="Active Leads"
              value={formatNumber(summary.leadsTotal)}
              caption={`${summary.conversionRate || 0}% conversion rate`}
              icon={Inbox}
              color={COLORS.accent}
            />
            <KpiCard
              title="Published Posts"
              value={formatNumber(summary.publishedPosts)}
              caption={`${formatCompact(summary.totalPostViews)} total views`}
              icon={Newspaper}
              color={COLORS.green}
            />
            <KpiCard
              title="Open Messages"
              value={formatNumber(summary.unreadMessages)}
              caption={`${formatNumber(summary.messagesTotal)} total messages`}
              icon={Mail}
              color={COLORS.rose}
            />
          </section>

          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                Post performance
              </h2>
              <span className="text-xs text-slate-400">
                Views, reactions, comments, and engagement
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
              <KpiCard
                title="Total Views"
                value={formatNumber(summary.totalPostViews)}
                caption={`${formatNumber(summary.averageViewsPerPublishedPost)} avg / published`}
                icon={Eye}
                color={COLORS.blue}
              />
              <KpiCard
                title="Total Likes"
                value={formatNumber(summary.totalPostLikes)}
                caption="Positive reactions"
                icon={ThumbsUp}
                color={COLORS.green}
              />
              <KpiCard
                title="Dislikes"
                value={formatNumber(summary.totalPostDislikes)}
                caption="Negative reactions"
                icon={ThumbsDown}
                color={COLORS.rose}
              />
              <KpiCard
                title="Shares"
                value={formatNumber(summary.totalPostShares)}
                caption="Post share clicks"
                icon={Share2}
                color={COLORS.violet}
              />
              <KpiCard
                title="Comments"
                value={formatNumber(summary.totalPostComments)}
                caption="Post comment count"
                icon={MessageSquare}
                color={COLORS.amber}
              />
              <KpiCard
                title="Engagement"
                value={`${summary.postEngagementRate || 0}%`}
                caption={`${formatNumber(summary.totalPostEngagements)} actions`}
                icon={Activity}
                color={COLORS.primary}
              />
            </div>
          </section>

          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-slate-500">
                All model analytics
              </h2>
              <span className="text-xs text-slate-400">
                Connected to backend models
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {modelCards.map((item) => (
                <ModelCard key={item.key} item={item} />
              ))}
            </div>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    14-day activity trend
                  </h2>
                  <p className="text-xs text-slate-500">
                    Leads, messages, posts, comments, and subscribers created.
                  </p>
                </div>
                <Activity className="text-slate-300" size={18} />
              </div>
              {timeline.length ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={timeline}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="messagesFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.rose} stopOpacity={0.2} />
                          <stop offset="100%" stopColor={COLORS.rose} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={COLORS.border} vertical={false} />
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: COLORS.faint }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: COLORS.faint }}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="leads"
                        name="Leads"
                        stroke={COLORS.accent}
                        strokeWidth={2}
                        fill="url(#leadsFill)"
                      />
                      <Area
                        type="monotone"
                        dataKey="messages"
                        name="Messages"
                        stroke={COLORS.rose}
                        strokeWidth={2}
                        fill="url(#messagesFill)"
                      />
                      <Area
                        type="monotone"
                        dataKey="posts"
                        name="Posts"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        fill="transparent"
                      />
                      <Area
                        type="monotone"
                        dataKey="comments"
                        name="Comments"
                        stroke={COLORS.amber}
                        strokeWidth={2}
                        fill="transparent"
                      />
                      <Area
                        type="monotone"
                        dataKey="subscribers"
                        name="Subscribers"
                        stroke={COLORS.green}
                        strokeWidth={2}
                        fill="transparent"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-900">
                Lead sources
              </h2>
              {leadSourceChart.length ? (
                <>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={leadSourceChart}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={54}
                          outerRadius={82}
                          paddingAngle={2}
                          strokeWidth={0}
                        >
                          {leadSourceChart.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <BreakdownList title="Source split" data={leadSourceChart} />
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <BreakdownList
              title="Lead pipeline"
              data={breakdowns.leadStatuses || []}
            />
            <BreakdownList
              title="Message statuses"
              data={breakdowns.messageStatuses || []}
            />
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-900">
                Post status mix
              </h2>
              {postStatusChart.length ? (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={postStatusChart}>
                      <CartesianGrid vertical={false} stroke={COLORS.border} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: COLORS.faint }}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: COLORS.faint }}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {postStatusChart.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <BreakdownList
              title="Comment statuses"
              data={breakdowns.commentStatuses || []}
            />
            <BreakdownList
              title="Reaction types"
              data={breakdowns.reactionTypes || []}
            />
            <BreakdownList
              title="Media types"
              data={breakdowns.mediaTypes || []}
            />
          </section>

          <section className="mb-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Recent leads
                  </h2>
                  <p className="text-xs text-slate-500">
                    Latest contact and service inquiries.
                  </p>
                </div>
                <Link
                  href="/leads"
                  className="text-xs font-bold text-[#d26c51] hover:text-[#235056]"
                >
                  View all
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Lead</th>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Value</th>
                      <th className="px-5 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(recent.leads || []).map((lead) => (
                      <tr key={lead._id} className="hover:bg-slate-50">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-slate-900">
                            {lead.name}
                          </p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {lead.service || lead.source || "-"}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-800">
                          {formatCurrency(lead.dealValue, lead.currency || "INR")}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                    {!recent.leads?.length && (
                      <tr>
                        <td colSpan={5} className="px-5 py-10">
                          <EmptyState label="No leads found" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">Top posts</h2>
                <p className="text-xs text-slate-500">Ranked by total views.</p>
              </div>
              <div className="divide-y divide-slate-100">
                {(analytics?.topPosts || []).map((post) => (
                  <Link
                    key={post._id}
                    href={`/blog/view/${post.slug}`}
                    className="block px-5 py-3 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {post.category?.name || post.category?.slug || "Uncategorized"}
                        </p>
                      </div>
                      <StatusBadge status={post.status} />
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Eye size={12} />
                        {formatNumber(post.views)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp size={12} />
                        {formatNumber(post.reactions?.like)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Share2 size={12} />
                        {formatNumber(post.reactions?.share)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare size={12} />
                        {formatNumber(post.commentCount)}
                      </span>
                    </div>
                  </Link>
                ))}
                {!analytics?.topPosts?.length && (
                  <div className="p-5">
                    <EmptyState label="No posts found" />
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Recent messages
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {(recent.messages || []).map((message) => (
                  <div key={message._id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {message.firstName} {message.lastName}
                      </p>
                      <StatusBadge status={message.status} />
                    </div>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {message.subject}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                ))}
                {!recent.messages?.length && (
                  <div className="p-5">
                    <EmptyState label="No messages found" />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Recent media
                </h2>
                <p className="text-xs text-slate-500">
                  Storage: {summary.mediaStorageLabel || "0 B"}
                </p>
              </div>
              <div className="divide-y divide-slate-100">
                {(recent.media || []).map((media) => (
                  <div key={media._id} className="flex items-center gap-3 px-5 py-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <ImageIcon size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {media.originalName || media.fileName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {media.mediaType} · {formatDate(media.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                {!recent.media?.length && (
                  <div className="p-5">
                    <EmptyState label="No media found" />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <h2 className="text-sm font-bold text-slate-900">
                  Newsletter subscribers
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {(recent.subscribers || []).map((subscriber) => (
                  <div key={subscriber._id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {subscriber.email}
                      </p>
                      <StatusBadge status={subscriber.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {formatDate(subscriber.createdAt)}
                    </p>
                  </div>
                ))}
                {!recent.subscribers?.length && (
                  <div className="p-5">
                    <EmptyState label="No subscribers found" />
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </Frame>
  );
}
