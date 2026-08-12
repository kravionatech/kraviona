"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileText,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  PlusCircle,
  Settings,
  Tag,
  Users,
  X,
} from "lucide-react";

const primaryNavigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/blog", label: "All Posts", icon: FileText },
  { href: "/blog/new", label: "Create Post", icon: PlusCircle },
  { href: "/media", label: "Media Library", icon: ImageIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

const workspaceNavigation = [
  { href: "/leads", label: "Leads", icon: Inbox },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/newsletters", label: "Audience", icon: Mail },
  { href: "/category", label: "Categories", icon: Tag },
  { href: "/comments", label: "Moderation", icon: BookOpen },
  { href: "/team", label: "Team", icon: Users },
  { href: "/users", label: "Users", icon: Users },
];

function isCurrent(pathname, href) {
  return pathname === href || pathname?.startsWith(`${href}/`);
}

function NavLink({ item, pathname, onClick }) {
  const Icon = item.icon;
  const active = isCurrent(pathname, item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`mx-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors ${
        active
          ? "rounded-l-none border-l-2 border-blue-500 bg-slate-800 font-medium text-white"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={17} />
      {item.label}
    </Link>
  );
}

export default function Sidebar({ onLogout, isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/60 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col overflow-y-auto bg-slate-900 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link href="/dashboard" onClick={onClose}>
            <span className="block text-lg font-bold text-white">Kraviona</span>
            <span className="text-sm text-slate-400">Admin Panel</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1 py-2" aria-label="Primary navigation">
          {primaryNavigation.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </nav>

        <div className="mx-4 my-5 border-t border-slate-800" />
        <p className="px-6 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</p>
        <nav className="space-y-1 pb-6" aria-label="Workspace navigation">
          {workspaceNavigation.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
          ))}
        </nav>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">AA</span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">Amar Admin</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
