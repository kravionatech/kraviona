// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, TableProperties, KeyRound, Wrench } from "lucide-react";

const PLANNER_NAV = [
  { href: "/planner", label: "Editorial Calendar", icon: Calendar },
  { href: "/planner/tracker", label: "Content Tracker", icon: TableProperties },
  { href: "/planner/keywords", label: "Keywords & Clusters", icon: KeyRound },
  { href: "/planner/seo-queue", label: "SEO Fix Queue", icon: Wrench },
];

export default function PlannerNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
      {PLANNER_NAV.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/planner" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition ${
              isActive
                ? "bg-[#123f46] text-[#f7c56d] shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Icon size={15} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
