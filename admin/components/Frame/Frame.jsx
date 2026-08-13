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
  { href: "/leads", label: "Leads", hint: "Manage sales opportunities", superAdminOnly: true },
  { href: "/messages", label: "Messages", hint: "Customer inbox", superAdminOnly: true },
  { href: "/newsletters", label: "Newsletter audience", hint: "Subscribers", superAdminOnly: true },
  { href: "/blog", label: "Posts", hint: "Manage blog content" },
  { href: "/blog/new", label: "Create post", hint: "Write a new article" },
  { href: "/category", label: "Categories", hint: "Organize content", superAdminOnly: true },
  { href: "/comments", label: "Comment moderation", hint: "Review discussion", superAdminOnly: true },
  { href: "/media", label: "Media library", hint: "Files and uploads" },
  { href: "/team", label: "Team", hint: "Team members", superAdminOnly: true },
  { href: "/services", label: "Services", hint: "Manage frontend services" },
  { href: "/portfolio", label: "Portfolio", hint: "Manage case studies" },
  { href: "/users", label: "Users & admins", hint: "Account access", superAdminOnly: true },
  { href: "/login-history", label: "Login history", hint: "Review account sign-ins" },
  { href: "/account", label: "My account", hint: "Your profile details" },
  { href: "/settings", label: "Settings", hint: "Admin configuration", superAdminOnly: true },
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
  const [currentUser, setCurrentUser] = useState(null);

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
    apiRequest("/me")
      .then((response) => setCurrentUser(response.data || null))
      .catch(() => {
        document.cookie = "adminSession=; path=/; SameSite=Lax; Max-Age=0";
        document.cookie = "accessToken=; path=/; SameSite=Lax; Max-Age=0";
        document.cookie = "refreshToken=; path=/; SameSite=Lax; Max-Age=0";
        router.replace("/auth");
      });
  }, [router]);

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
    const visibleCommands = COMMANDS.filter((item) => !item.superAdminOnly || currentUser?.role === "super_admin");
    if (!query) return visibleCommands.slice(0, 6);
    return visibleCommands.filter((item) => `${item.label} ${item.hint}`.toLowerCase().includes(query));
  }, [search, currentUser?.role]);

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
    <div className="admin-shell flex min-h-dvh bg-slate-50 font-sans text-slate-900">
      <Sidebar onLogout={handleLogout} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} currentUser={currentUser} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 h-16 shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
                aria-label="Open navigation"
              >
                <Menu size={19} />
              </button>
              <div className="hidden min-w-0 sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-blue-600">Kraviona admin</p>
                <h1 className="truncate text-sm font-semibold text-gray-900">{pageName(pathname)}</h1>
              </div>
            </div>

            <div className="relative hidden max-w-lg flex-1 md:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
              <input
                ref={searchRef}
                value={search}
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => { setSearch(event.target.value); setSearchOpen(true); }}
                placeholder="Search pages, content, actions..."
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-16 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
                ⌘ K
              </span>
              {searchOpen && <CommandMenu results={results} onClose={() => setSearchOpen(false)} />}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/blog/new" className="hidden items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:flex">
                <FilePlus2 size={16} />
                New post
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((open) => !open)}
                  className="relative rounded-lg p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                  aria-label="Open notifications"
                  aria-expanded={notificationsOpen}
                >
                  <Bell size={18} />
                  {alertCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{alertCount > 9 ? "9+" : alertCount}</span>}
                </button>
                {notificationsOpen && currentUser?.role === "super_admin" && <NotificationMenu unreadMessages={unreadMessages} newLeads={newLeads} onClose={() => setNotificationsOpen(false)} />}
              </div>
              <div className="hidden items-center gap-2 border-l border-gray-200 pl-3 sm:flex">
                {currentUser?.avatar ? <img src={currentUser.avatar} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{(currentUser?.name || "Admin").slice(0, 2).toUpperCase()}</span>}
                <span className="hidden text-sm font-medium text-gray-700 xl:block">{currentUser?.name || "No data found."}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100dvh-4rem)] min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

function CommandMenu({ results, onClose }) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15">
      <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Quick navigation</p>
      {results.length ? results.map((item) => (
        <Link key={item.href} href={item.href} onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition hover:bg-slate-50">
          <span><span className="block text-sm font-semibold text-slate-800">{item.label}</span><span className="block text-xs text-slate-500">{item.hint}</span></span>
          <Command size={15} className="text-slate-600" />
        </Link>
      )) : <p className="px-3 py-5 text-center text-sm text-slate-500">No matching pages found.</p>}
    </div>
  );
}

function NotificationMenu({ unreadMessages, newLeads, onClose }) {
  const items = [
    { href: "/messages", icon: MessageSquare, label: unreadMessages ? `${unreadMessages} unread message${unreadMessages === 1 ? "" : "s"}` : "No unread messages", tone: "text-[#f28c5e] bg-[#2a4a52]/30" },
    { href: "/leads", icon: Inbox, label: newLeads ? `${newLeads} new lead${newLeads === 1 ? "" : "s"}` : "No new leads", tone: "text-[#ffd8c8] bg-[#b84a1a]/20" },
  ];
  return (
    <div className="absolute right-0 top-[calc(100%+8px)] w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
      <div className="border-b border-slate-200 px-4 py-3"><p className="text-sm font-bold text-slate-900">Priority activity</p><p className="text-xs text-slate-500">Live from your admin API</p></div>
      <div className="p-2">
        {items.map(({ href, icon: Icon, label, tone }) => <Link key={href} href={href} onClick={onClose} className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-50"><span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}><Icon size={16} /></span><span className="text-sm font-semibold text-slate-700">{label}</span></Link>)}
      </div>
    </div>
  );
}
