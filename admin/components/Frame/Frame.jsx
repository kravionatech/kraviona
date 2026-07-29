"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Command,
  FilePlus2,
  Inbox,
  Menu,
  MessageSquare,
  Search,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { apiRequest } from "@/components/api";

const COMMANDS = [
  { href: "/dashboard", label: "Dashboard", hint: "Performance overview" },
  { href: "/leads", label: "Leads", hint: "Manage sales opportunities" },
  { href: "/messages", label: "Messages", hint: "Customer inbox" },
  { href: "/newsletters", label: "Newsletter audience", hint: "Subscribers" },
  { href: "/blog", label: "Posts", hint: "Manage blog content" },
  { href: "/blog/new", label: "Create post", hint: "Write a new article" },
  { href: "/category", label: "Categories", hint: "Organize content" },
  { href: "/comments", label: "Comment moderation", hint: "Review discussion" },
  { href: "/media", label: "Media library", hint: "Files and uploads" },
  { href: "/team", label: "Team", hint: "Team members" },
  { href: "/users", label: "Users & admins", hint: "Account access" },
  { href: "/settings", label: "Settings", hint: "Admin configuration" },
];

function pageName(pathname) {
  return COMMANDS.find((item) => item.href === pathname)?.label || "Admin workspace";
}

export default function Frame({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const baseurl = process.env.NEXT_PUBLIC_API_URL;
  const searchRef = useRef(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const loadAlerts = useCallback(async () => {
    try {
      const response = await apiRequest("/analytics/dashboard");
      setAnalytics(response.data);
    } catch {
      // Alerts are an enhancement; every page stays usable if analytics is unavailable.
    }
  }, []);

  useEffect(() => {
    const initialLoad = window.setTimeout(loadAlerts, 0);
    const interval = window.setInterval(loadAlerts, 60000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [loadAlerts]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setMobileNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COMMANDS.slice(0, 6);
    return COMMANDS.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query));
  }, [search]);

  const unreadMessages = Number(analytics?.summary?.unreadMessages || 0);
  const newLeads = Number(analytics?.summary?.newLeads || 0);
  const alertCount = unreadMessages + newLeads;

  const handleLogout = async () => {
    try {
      await fetch(`${baseurl}/auth/logout`, { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Logout request failed, redirecting anyway:", error);
    } finally {
      document.cookie = "adminSession=; path=/; SameSite=Lax; Max-Age=0";
      document.cookie = "accessToken=; path=/; SameSite=Lax; Max-Age=0";
      document.cookie = "refreshToken=; path=/; SameSite=Lax; Max-Age=0";
      router.replace("/auth");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7f8] font-sans text-slate-950">
      <Sidebar onLogout={handleLogout} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={19} />
              </button>
              <div className="hidden min-w-0 sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#d26c51]">Kraviona admin</p>
                <h1 className="truncate text-sm font-bold text-slate-900">{pageName(pathname)}</h1>
              </div>
            </div>

            <div className="relative hidden max-w-lg flex-1 md:block">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                ref={searchRef}
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }}
                placeholder="Search pages, content, actions..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm outline-none transition focus:border-[#235056] focus:bg-white focus:ring-4 focus:ring-[#235056]/8"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘ K
              </span>
              {searchOpen && <CommandMenu results={results} onClose={() => setSearchOpen(false)} />}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/blog/new" className="hidden items-center gap-2 rounded-xl bg-[#235056] px-3.5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#235056]/15 transition hover:bg-[#173f45] sm:flex">
                <FilePlus2 size={16} />
                New post
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-[#235056]/25 hover:text-[#235056]"
                  aria-label="Open notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell size={18} />
                  {alertCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d26c51] px-1 text-[10px] font-bold text-white">{alertCount > 9 ? "9+" : alertCount}</span>}
                </button>
                {notificationsOpen && <NotificationMenu unreadMessages={unreadMessages} newLeads={newLeads} onClose={() => setNotificationsOpen(false)} />}
              </div>
              <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3c78e] text-xs font-black text-[#153f45]">AA</span>
                <span className="hidden text-sm font-bold text-slate-700 xl:block">Amar Admin</span>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-73px)]">{children}</main>
      </div>
    </div>
  );
}

function CommandMenu({ results, onClose }) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/12">
      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Quick navigation</p>
      {results.length ? results.map((item) => (
        <Link key={item.href} href={item.href} onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-slate-50">
          <span><span className="block text-sm font-semibold text-slate-800">{item.label}</span><span className="block text-xs text-slate-400">{item.hint}</span></span>
          <Command size={15} className="text-slate-300" />
        </Link>
      )) : <p className="px-3 py-5 text-center text-sm text-slate-400">No matching pages found.</p>}
    </div>
  );
}

function NotificationMenu({ unreadMessages, newLeads, onClose }) {
  const items = [
    { href: "/messages", icon: MessageSquare, label: unreadMessages ? `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}` : "No unread messages", tone: "text-violet-600 bg-violet-50" },
    { href: "/leads", icon: Inbox, label: newLeads ? `${newLeads} new lead${newLeads === 1 ? "" : "s"}` : "No new leads", tone: "text-[#d26c51] bg-orange-50" },
  ];
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/12">
      <div className="border-b border-slate-100 px-4 py-3"><p className="text-sm font-bold text-slate-900">Priority activity</p><p className="text-xs text-slate-400">Live from your admin API</p></div>
      <div className="p-2">
        {items.map(({ href, icon: Icon, label, tone }) => <Link key={href} href={href} onClick={onClose} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon size={16} /></span><span className="text-sm font-semibold text-slate-700">{label}</span></Link>)}
      </div>
    </div>
  );
}
