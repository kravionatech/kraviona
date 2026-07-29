"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Settings,
  Tag,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Inbox },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/newsletters", label: "Audience", icon: Mail },
  { href: "/blog", label: "Content", icon: BookOpen },
  { href: "/category", label: "Categories", icon: Tag },
  { href: "/comments", label: "Moderation", icon: MessageSquare },
  { href: "/media", label: "Media library", icon: ImageIcon },
  { href: "/team", label: "Team", icon: Users },
  { href: "/users", label: "Users", icon: Users },
];

function isCurrent(pathname, href) {
  if (!pathname) return false;
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ onLogout, isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/45 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col overflow-hidden border-r border-white/10 bg-[#153f45] text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3c78e] text-lg font-black text-[#153f45] shadow-lg shadow-black/15">
              K
            </span>
            <span>
              <span className="block text-sm font-black tracking-[0.16em]">KRAVIONA</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Command center
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f3c78e]/70">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Admin navigation">
            {navigation.slice(0, 4).map((item) => (
              <NavItem key={item.href} item={item} active={isCurrent(pathname, item.href)} onClick={onClose} />
            ))}
          </nav>

          <div className="my-5 border-t border-white/10" />
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f3c78e]/70">
            Publish
          </p>
          <nav className="space-y-1" aria-label="Content navigation">
            {navigation.slice(4, 8).map((item) => (
              <NavItem key={item.href} item={item} active={isCurrent(pathname, item.href)} onClick={onClose} />
            ))}
          </nav>

          <div className="my-5 border-t border-white/10" />
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f3c78e]/70">
            Workspace
          </p>
          <nav className="space-y-1" aria-label="Workspace navigation">
            {navigation.slice(8).map((item) => (
              <NavItem key={item.href} item={item} active={isCurrent(pathname, item.href)} onClick={onClose} />
            ))}
            <NavItem
              item={{ href: "/settings", label: "Settings", icon: Settings }}
              active={isCurrent(pathname, "/settings")}
              onClick={onClose}
            />
          </nav>
        </div>

        <div className="p-3">
          <Link
            href="/blog/new"
            onClick={onClose}
            className="mb-3 flex items-center justify-between rounded-xl bg-[#d26c51] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:bg-[#e1795d]"
          >
            Create new post <ChevronRight size={16} />
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ item, active, onClick }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-white text-[#153f45] shadow-sm"
          : "text-white/65 hover:bg-white/8 hover:text-white"
      }`}
    >
      <Icon size={17} strokeWidth={active ? 2.5 : 2} />
      <span className="flex-1">{item.label}</span>
      {active && <BarChart3 size={14} className="text-[#d26c51]" />}
    </Link>
  );
}
