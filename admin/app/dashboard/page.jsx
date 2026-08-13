"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Database,
  FileText,
  FolderKanban,
  Layers3,
  MousePointerClick,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
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
import { apiRequest } from "@/components/api";
import { ContentLoader, EmptyState } from "@/components/AsyncState";

const periods = [
  ["today", "Today"], ["yesterday", "Yesterday"], ["7d", "Last 7 days"],
  ["30d", "Last 30 days"], ["90d", "Last 90 days"], ["this-month", "This month"], ["last-month", "Last month"],
];

const chartColors = ["#0f5960", "#e35d3d", "#f7c56d", "#5c9baa"];
const number = (value) => new Intl.NumberFormat("en-IN").format(Number(value || 0));
const relativeTime = (value) => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

function Card({ icon: Icon, label, value, previous, detail, tone = "teal" }) {
  const tones = {
    teal: "bg-[#0f5960]/10 text-[#0f5960]", orange: "bg-[#e35d3d]/10 text-[#e35d3d]",
    gold: "bg-[#f7c56d]/25 text-[#8a5b09]", blue: "bg-[#5c9baa]/15 text-[#276370]",
  };
  const hasComparison = typeof previous === "number";
  const change = hasComparison ? (previous === 0 ? (Number(value) ? 100 : 0) : Math.round(((Number(value) - previous) / previous) * 100)) : null;
  const display = typeof value === "string" ? value : number(value);
  return <article className="group relative overflow-hidden rounded-2xl border border-[#0f5960]/12 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0f5960]/25 hover:shadow-lg hover:shadow-[#0f5960]/10">
    <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-[#0f5960]/[0.035] transition group-hover:bg-[#f7c56d]/15" />
    <div className="relative flex items-start justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5d7679]">{label}</p><p className="mt-2 text-3xl font-black tracking-tight text-[#123f46]">{display}</p></div><span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}><Icon size={20} /></span></div>
    <div className="relative mt-4 flex items-center justify-between gap-2"><p className="text-xs text-slate-500">{detail}</p>{hasComparison && <span className={`inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-black ${change >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}><TrendingUp size={11} className={change < 0 ? "rotate-90" : ""}/>{change >= 0 ? "+" : ""}{change}%</span>}</div>
    <div className="relative mt-3 flex gap-1">{[35, 58, 44, 72, 62, 86, 76].map((height, index) => <i key={index} className="h-1 flex-1 rounded-full bg-[#0f5960]/10" style={{ opacity: 0.35 + index / 15, transform: `scaleY(${height / 100})` }} />)}</div>
  </article>;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-xl"><p className="mb-1 font-bold text-slate-800">{label}</p>{payload.map((entry) => <p key={entry.dataKey} style={{ color: entry.color }} className="capitalize">{entry.name}: {number(entry.value)}</p>)}</div>;
}

function SectionTitle({ icon: Icon, title, description, action }) {
  return <div className="mb-5 flex items-start justify-between gap-4"><div className="flex gap-3"><span className="mt-0.5 rounded-xl bg-[#0f5960]/10 p-2 text-[#0f5960]"><Icon size={18} /></span><div><h2 className="font-bold text-slate-900">{title}</h2><p className="mt-0.5 text-xs text-slate-500">{description}</p></div></div>{action}</div>;
}

function ModuleBadge({ module }) {
  const palette = {
    security: "border-[#f3bd67]/50 bg-[#fff3d7] text-[#76500b]",
    blog: "border-[#d85e3d]/20 bg-[#fff1ec] text-[#b94b31]",
    service: "border-[#0f5960]/20 bg-[#e7f1f0] text-[#0a454b]",
    portfolio: "border-[#5c9baa]/25 bg-[#edf7f8] text-[#276370]",
    media: "border-violet-200 bg-violet-50 text-violet-700",
    profile: "border-slate-200 bg-slate-50 text-slate-600",
  };
  return <span className={`inline-flex h-7 shrink-0 items-center rounded-lg border px-2 text-[10px] font-black uppercase tracking-[0.08em] ${palette[module] || palette.profile}`}>{module}</span>;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState("30d");
  const [customStart, setCustomStart] = useState(() => new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10));
  const [customEnd, setCustomEnd] = useState(() => new Date().toISOString().slice(0, 10));
  const [analytics, setAnalytics] = useState(null);
  const [timelineMode, setTimelineMode] = useState("content");
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const query = period === "custom" ? `range=custom&start=${customStart}&end=${customEnd}` : `range=${period}`;
      const response = await apiRequest(`/analytics/insights?${query}`);
      setAnalytics(response.data);
    }
    catch (requestError) { setError(requestError.message || "Unable to load analytics."); }
    finally { setLoading(false); }
  }, [period, customStart, customEnd]);

  useEffect(() => { loadAnalytics(); }, [loadAnalytics]);

  const seoData = useMemo(() => {
    const seo = analytics?.seo;
    if (!seo?.total) return [];
    return [{ name: "Indexed", value: seo.indexed }, { name: "No index", value: seo.noIndex }, { name: "Needs SEO", value: Math.max(0, seo.total - seo.indexed - seo.noIndex) }];
  }, [analytics]);

  const kpis = analytics?.kpis || {};
  const comparison = analytics?.comparison || {};
  const scopeLabel = analytics?.scope === "workspace" ? "Workspace analytics" : "My analytics";
  const periodLabel = [...periods, ["custom", "Custom range"]].find(([value]) => value === period)?.[1] || "Last 30 days";

  return <Frame>
    <main className="min-h-full bg-[#f4f8f7] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
      <div className="mx-auto max-w-[1600px]">
        <section className="relative mb-6 overflow-hidden rounded-[28px] border border-[#0f5960]/20 bg-gradient-to-br from-[#0b363d] via-[#0f5960] to-[#1a6870] p-5 text-white shadow-2xl shadow-[#0f5960]/20 sm:p-6">
          <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-[#f7c56d]/15 blur-3xl"/>
          <div className="relative flex flex-col justify-between gap-5 xl:flex-row xl:items-center"><div><div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#f7d994]"><Sparkles size={13} /> {analytics?.scope === "workspace" ? "Executive command center" : "Personal content command center"}</div><h1 className="text-3xl font-black tracking-tight">{scopeLabel}</h1><p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#dcebea]">Secure, date-wise content growth, SEO quality and operational activity—always scoped to your access.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#e5f2f1]">Role-safe reporting</span><span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#e5f2f1]">Live audit stream</span>{analytics?.system && <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">System {analytics.system.database}</span>}</div></div>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/15 bg-slate-950/10 p-2.5 backdrop-blur-sm"><div className="relative"><button type="button" onClick={() => setPeriodMenuOpen((open) => !open)} className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/15 bg-[#123f46] px-3 text-sm font-bold text-white shadow-inner shadow-black/10"><CalendarDays className="text-[#f7d994]" size={16}/><span>{periodLabel}</span><ChevronDown className={`text-[#f7d994] transition ${periodMenuOpen ? "rotate-180" : ""}`} size={15}/></button>{periodMenuOpen && <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-52 overflow-hidden rounded-xl border border-[#0f5960]/20 bg-white p-1.5 text-slate-800 shadow-2xl">{[...periods, ["custom", "Custom range"]].map(([value, label]) => <button key={value} type="button" onClick={() => { setPeriod(value); setPeriodMenuOpen(false); }} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${period === value ? "bg-[#e7f1f0] text-[#0f5960]" : "hover:bg-slate-50"}`}>{label}{period === value && <CheckCircle2 size={14}/>}</button>)}</div>}</div>{period === "custom" && <><input aria-label="Custom range start date" type="date" value={customStart} max={customEnd} onChange={(event) => setCustomStart(event.target.value)} className="h-11 rounded-xl border border-white/15 bg-[#123f46] px-3 text-sm text-white outline-none [color-scheme:dark]"/><input aria-label="Custom range end date" type="date" value={customEnd} min={customStart} max={new Date().toISOString().slice(0, 10)} onChange={(event) => setCustomEnd(event.target.value)} className="h-11 rounded-xl border border-white/15 bg-[#123f46] px-3 text-sm text-white outline-none [color-scheme:dark]"/></>}<button type="button" onClick={loadAnalytics} disabled={loading} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#f7c56d] px-4 text-sm font-bold text-[#123f46] shadow-lg shadow-[#f7c56d]/15 transition hover:bg-[#ffe09c] disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button></div>
          </div>
        </section>

        {loading ? <div className="rounded-2xl border border-slate-200 bg-white"><ContentLoader label="Loading analytics dashboard…" /></div> : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50"><EmptyState title="Analytics could not be loaded." message={error} /></div> : <>
          <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {analytics?.scope === "workspace" && <Card icon={Users} label="New users" value={kpis.users} previous={comparison.users} detail="Accounts created in selected period" tone="blue" />}
            <Card icon={Layers3} label={analytics?.scope === "workspace" ? "Services" : "My services"} value={kpis.services} previous={comparison.services} detail={`${number(kpis.activeServices)} active in your accessible catalog`} />
            <Card icon={FileText} label={analytics?.scope === "workspace" ? "Blog posts" : "My blog posts"} value={kpis.posts} detail={`${number(kpis.published)} published · ${number(kpis.draft)} drafts`} tone="orange" />
            <Card icon={FolderKanban} label={analytics?.scope === "workspace" ? "Projects" : "My projects"} value={kpis.projects} previous={comparison.projects} detail={`${number(kpis.activeProjects)} active portfolio entries`} tone="gold" />
            {analytics?.scope === "workspace" && <Card icon={MousePointerClick} label="Leads received" value={kpis.leads} previous={comparison.leads} detail="Website inquiries in selected period" tone="blue" />}
            <Card icon={SearchCheck} label="SEO coverage" value={`${kpis.seoScore || 0}%`} detail="Meta title, description and OG image coverage" tone="gold" />
          </section>

          <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <article className="rounded-2xl border border-[#0f5960]/12 bg-white p-5 shadow-sm xl:col-span-2"><SectionTitle icon={BarChart3} title="Performance timeline" description="Switch between content growth and operational activity." action={<div className="flex rounded-xl bg-[#e7f1f0] p-1 text-xs font-bold"><button onClick={() => setTimelineMode("content")} className={`rounded-lg px-3 py-1.5 ${timelineMode === "content" ? "bg-white text-[#0f5960] shadow-sm" : "text-[#5d7679]"}`}>Content</button><button onClick={() => setTimelineMode("activity")} className={`rounded-lg px-3 py-1.5 ${timelineMode === "activity" ? "bg-white text-[#0f5960] shadow-sm" : "text-[#5d7679]"}`}>Activity</button></div>} />
              {analytics?.timeline?.some((row) => row.posts || row.services || row.projects || row.media || row.activity || row.leads) ? <div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={analytics.timeline} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}><defs><linearGradient id="kravionaPosts" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0f5960" stopOpacity={0.3}/><stop offset="100%" stopColor="#0f5960" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e2e8f0"/><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{fontSize: 11, fill:"#64748b"}} minTickGap={22}/><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{fontSize: 11, fill:"#64748b"}}/><Tooltip content={<ChartTooltip/>}/>{timelineMode === "content" ? <><Area type="monotone" dataKey="posts" name="Posts" stroke="#0f5960" strokeWidth={2.5} fill="url(#kravionaPosts)"/><Area type="monotone" dataKey="services" name="Services" stroke="#e35d3d" strokeWidth={2} fill="transparent"/><Area type="monotone" dataKey="projects" name="Projects" stroke="#f7a723" strokeWidth={2} fill="transparent"/></> : <><Area type="monotone" dataKey="activity" name="Activity" stroke="#0f5960" strokeWidth={2.5} fill="url(#kravionaPosts)"/><Area type="monotone" dataKey="media" name="Uploads" stroke="#e35d3d" strokeWidth={2} fill="transparent"/>{analytics?.scope === "workspace" && <Area type="monotone" dataKey="leads" name="Leads" stroke="#f7a723" strokeWidth={2} fill="transparent"/>}</>}</AreaChart></ResponsiveContainer></div> : <EmptyState title="No analytics data found for the selected period." message="Create or update content to begin tracking its performance." />}
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={SearchCheck} title="SEO intelligence" description="Metadata coverage across accessible blog content." />
              {seoData.length ? <><div className="h-48"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={seoData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3}>{seoData.map((item, index) => <Cell key={item.name} fill={chartColors[index]} />)}</Pie><Tooltip content={<ChartTooltip/>}/></PieChart></ResponsiveContainer></div><div className="space-y-2">{seoData.map((item, index) => <div key={item.name} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-slate-600"><i className="h-2.5 w-2.5 rounded-full" style={{background:chartColors[index]}} />{item.name}</span><b>{number(item.value)}</b></div>)}</div><div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{analytics.seo.metaDescription < analytics.seo.total ? `${analytics.seo.total - analytics.seo.metaDescription} item(s) need a meta description.` : "All accessible posts have meta descriptions."}</div></> : <EmptyState title="No SEO data found." message="Add a blog post to see SEO coverage and recommendations." />}
            </article>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={Layers3} title="Service performance" description={analytics?.scope === "workspace" ? "Inquiry counts for services in the selected period." : "Your service inventory. Lead totals are visible to super admins."} />
              {analytics?.servicePerformance?.length ? <div className="h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.servicePerformance} layout="vertical" margin={{left:10,right:20}}><CartesianGrid horizontal={false} stroke="#e2e8f0"/><XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false}/><YAxis type="category" dataKey="name" width={115} tickLine={false} axisLine={false} tick={{fontSize:11,fill:"#475569"}}/><Tooltip content={<ChartTooltip/>}/><Bar dataKey="inquiries" name="Inquiries" fill="#0f5960" radius={[0,7,7,0]}/></BarChart></ResponsiveContainer></div> : <EmptyState title="No services found." message="Your services will appear here when you create them." />}
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={FileText} title="Top content" description="Ranked by tracked lifetime post views." />
              <div className="divide-y divide-slate-100">{analytics?.topPosts?.length ? analytics.topPosts.map((post, index) => <div key={post.slug} className="flex items-center gap-3 py-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0f5960]/10 text-xs font-black text-[#0f5960]">{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{post.title}</p><p className="mt-0.5 text-xs text-slate-500">{post.status} · {post.readTime} min read</p></div><b className="text-sm text-slate-700">{number(post.views)}</b></div>) : <EmptyState title="No blog posts found." message="No data found for the selected period." />}</div>
            </article>
          </section>

          <section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={Activity} title="Activity heatmap" description="Login and CMS actions by day." />
              <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">{analytics?.heatmap?.map((day) => <span key={day.date} title={`${day.date}: ${day.value} events`} className="aspect-square rounded-[4px]" style={{background:day.value >= 5 ? "#0f5960" : day.value >= 3 ? "#3c8086" : day.value >= 1 ? "#a8d3d2" : "#e8eeee"}} />)}</div><p className="mt-4 text-xs text-slate-500">Darker tiles indicate more recorded activity.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2"><SectionTitle icon={Activity} title="Live activity & audit trail" description="Only events you are permitted to view are shown here." />
              <div className="max-h-80 divide-y divide-slate-100 overflow-auto">{analytics?.activity?.length ? analytics.activity.map((item) => <div key={item.id} className="flex gap-3 py-3"><div>{item.avatar ? <img src={item.avatar} alt="" className="h-9 w-9 rounded-full object-cover"/> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7c56d] text-xs font-bold text-[#123f46]">{item.user.slice(0,2).toUpperCase()}</span>}</div><div className="min-w-0 flex-1"><p className="text-sm text-slate-700"><b>{item.user}</b> <span className="capitalize">{item.action}</span> <span className="font-medium">{item.resourceName || item.module}</span></p><p className="mt-0.5 text-xs text-slate-500">{item.module} · {relativeTime(item.createdAt)} {item.ipAddress ? `· ${item.ipAddress}` : ""}</p></div><ModuleBadge module={item.module}/></div>) : <EmptyState title="No activity found." message="Activity will be recorded after logins and content changes." />}</div>
            </article>
          </section>

          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={MousePointerClick} title="Visitor tracking" description="Website visitors, page views and conversion events." /><div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"><p className="font-semibold text-slate-800">Tracking not connected</p><p className="mt-1 text-sm text-slate-500">{analytics?.tracking?.message}</p></div></article>{analytics?.system && <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><SectionTitle icon={ShieldCheck} title="System & audit health" description="Visible to super admins only." /><div className="grid grid-cols-2 gap-3"><div className="rounded-xl bg-emerald-50 p-4"><Database className="mb-2 text-emerald-600" size={18}/><p className="text-xs text-emerald-800">Database</p><p className="font-bold capitalize text-emerald-900">{analytics.system.database}</p></div><div className="rounded-xl bg-[#0f5960]/8 p-4"><Activity className="mb-2 text-[#0f5960]" size={18}/><p className="text-xs text-slate-600">Recent audit events</p><p className="font-bold text-slate-900">{number(analytics.system.auditEvents)}</p></div></div></article>}</section>
        </>}
      </div>
    </main>
  </Frame>;
}
