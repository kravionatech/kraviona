// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React from "react";

const STATUS_CONFIGS = {
  // Content Plan Statuses
  Planned: {
    label: "Planned",
    icon: "📋",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
    dot: "bg-slate-400",
  },
  "In Progress": {
    label: "In Progress",
    icon: "🕐",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  Done: {
    label: "Done",
    icon: "✔️",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
    dot: "bg-blue-500",
  },
  Published: {
    label: "Published",
    icon: "✍️",
    bg: "bg-teal-50 dark:bg-teal-950/40",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-300 dark:border-teal-800",
    dot: "bg-teal-500",
  },
  Indexed: {
    label: "Indexed",
    icon: "✅",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  "Needs Update": {
    label: "Needs Update",
    icon: "❌",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },

  // Keyword Statuses
  Researched: {
    label: "Researched",
    icon: "🔍",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-300 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  Assigned: {
    label: "Assigned",
    icon: "👤",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  "In Content Plan": {
    label: "In Plan",
    icon: "📅",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-300",
    border: "border-sky-300 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  Ranking: {
    label: "Ranking",
    icon: "📈",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
};

const PRIORITY_CONFIGS = {
  High: {
    bg: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900",
    dot: "bg-red-500",
  },
  Medium: {
    bg: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900",
    dot: "bg-amber-500",
  },
  Low: {
    bg: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
    dot: "bg-slate-400",
  },
};

const TYPE_CONFIGS = {
  Blog: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/30 dark:text-teal-400",
  News: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400",
  "SEO Fix": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400",
  "Keyword Research": "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400",
  Social: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400",
  Other: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400",
};

export default function StatusBadge({ status, showIcon = true, size = "md" }) {
  const config = STATUS_CONFIGS[status] || {
    label: status || "Unknown",
    icon: "•",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    dot: "bg-slate-400",
  };

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : "text-xs px-2.5 py-1 font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-sm whitespace-nowrap`}
    >
      {showIcon ? (
        <span className="text-xs leading-none">{config.icon}</span>
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIGS[priority] || PRIORITY_CONFIGS.Medium;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${config.bg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {priority || "Medium"}
    </span>
  );
}

export function TypeBadge({ type }) {
  const badgeClass = TYPE_CONFIGS[type] || TYPE_CONFIGS.Other;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeClass}`}
    >
      {type || "Blog"}
    </span>
  );
}
