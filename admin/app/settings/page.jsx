"use client";

import Frame from "@/components/Frame/Frame";
import { API_BASE_URL, apiRequest, formatDate } from "@/components/api";
import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  Clock,
  Database,
  ExternalLink,
  Loader2,
  MonitorCog,
  RefreshCw,
  Settings,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_PREFS = {
  compactTables: false,
  emailAlerts: true,
  securityAlerts: true,
  dashboardAutoRefresh: true,
};

const QUICK_LINKS = [
  { label: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { label: "Comments", href: "/comments", icon: Bell },
  { label: "Content Decay", href: "/content-decay", icon: Activity },
  { label: "Media Library", href: "/media", icon: Database },
];

function StatusPill({ status }) {
  const isOnline = status === "online";
  const isChecking = status === "checking";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
        isChecking
          ? "border-blue-100 bg-blue-50 text-blue-700"
          : isOnline
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : "border-rose-100 bg-rose-50 text-rose-700"
      }`}
    >
      {isChecking ? (
        <Loader2 className="animate-spin" size={12} />
      ) : (
        <span
          className={`h-2 w-2 rounded-full ${
            isOnline ? "bg-emerald-500" : "bg-rose-500"
          }`}
        />
      )}
      {status}
    </span>
  );
}

function InfoCard({ label, value, caption, icon: Icon, tone = "text-[#235056]" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50">
          <Icon className={tone} size={18} />
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className="truncate text-xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-[#d26c51]" : "bg-slate-300"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [prefs, setPrefs] = useState(DEFAULT_PREFS);
  const [apiStatus, setApiStatus] = useState("checking");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setApiStatus("checking");

      const savedPrefs = window.localStorage.getItem("kraviona_admin_settings");
      if (savedPrefs) {
        setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(savedPrefs) });
      }

      const [meResponse, analyticsResponse] = await Promise.all([
        apiRequest("/me"),
        apiRequest("/analytics/dashboard"),
      ]);

      setProfile(meResponse.data || null);
      setAnalytics(analyticsResponse.data || null);
      setApiStatus("online");
    } catch (err) {
      setApiStatus("offline");
      setError(err.message || "Unable to load admin settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(loadSettings, 0);
    return () => clearTimeout(timeout);
  }, [loadSettings]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.localStorage.setItem(
        "kraviona_admin_settings",
        JSON.stringify(prefs),
      );
    }, 0);

    return () => clearTimeout(timeout);
  }, [prefs]);

  const profileName = useMemo(() => {
    if (!profile) return "Admin";
    return profile.name || profile.username || profile.email || "Admin";
  }, [profile]);

  const updatePref = (key, value) => {
    setPrefs((current) => ({ ...current, [key]: value }));
  };

  return (
    <Frame>
      <div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#d26c51]">
              Admin Panel
            </p>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-950">
              <Settings size={23} />
              Settings
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              System status, admin session, and panel preferences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatusPill status={apiStatus} />
            <button
              type="button"
              onClick={loadSettings}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            label="API Base"
            value={API_BASE_URL.replace(/^https?:\/\//, "")}
            caption="Connected backend endpoint"
            icon={Database}
          />
          <InfoCard
            label="Admin"
            value={profileName}
            caption={profile?.role ? `Role: ${profile.role}` : "Current session"}
            icon={UserCog}
            tone="text-blue-600"
          />
          <InfoCard
            label="Content"
            value={analytics?.summary?.postsTotal ?? "-"}
            caption="Total posts tracked"
            icon={BarChart3}
            tone="text-emerald-600"
          />
          <InfoCard
            label="Updated"
            value={
              analytics?.generatedAt
                ? new Date(analytics.generatedAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : loading
                  ? "Checking..."
                  : "-"
            }
            caption={
              analytics?.generatedAt
                ? formatDate(analytics.generatedAt)
                : "Latest analytics sync"
            }
            icon={Clock}
            tone="text-[#d26c51]"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Panel Preferences
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Saved locally for this browser.
                </p>
              </div>
              <MonitorCog className="text-slate-300" size={22} />
            </div>

            <div className="space-y-3">
              <ToggleRow
                label="Compact tables"
                description="Use denser table spacing in admin lists."
                checked={prefs.compactTables}
                onChange={(value) => updatePref("compactTables", value)}
              />
              <ToggleRow
                label="Email alerts"
                description="Keep newsletter, lead, and message alerts enabled."
                checked={prefs.emailAlerts}
                onChange={(value) => updatePref("emailAlerts", value)}
              />
              <ToggleRow
                label="Security alerts"
                description="Highlight login, role, and moderation warnings."
                checked={prefs.securityAlerts}
                onChange={(value) => updatePref("securityAlerts", value)}
              />
              <ToggleRow
                label="Dashboard auto refresh"
                description="Allow dashboard widgets to refresh while panel is open."
                checked={prefs.dashboardAutoRefresh}
                onChange={(value) => updatePref("dashboardAutoRefresh", value)}
              />
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-950">
                  Security & Health
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Current API and admin access checks.
                </p>
              </div>
              <ShieldCheck className="text-emerald-500" size={22} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    API connection
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Backend accepts authenticated admin requests.
                  </p>
                </div>
                <StatusPill status={apiStatus} />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Session access
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Protected by admin middleware and httpOnly backend cookies.
                  </p>
                </div>
                <CheckCircle2 className="text-emerald-500" size={18} />
              </div>

              <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">
                  Quick links
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {QUICK_LINKS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="inline-flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#d26c51]/40 hover:text-[#d26c51]"
                      >
                        <span className="inline-flex items-center gap-2">
                          <Icon size={15} />
                          {item.label}
                        </span>
                        <ExternalLink size={13} />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Frame>
  );
}
