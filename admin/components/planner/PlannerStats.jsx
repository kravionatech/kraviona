// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function PlannerStats({ stats, monthName, year }) {
  const percentage = stats?.monthlyCompletionPercentage ?? 0;
  const totalMonthTasks = stats?.totalMonthTasks ?? 0;
  const completedMonthTasks = stats?.completedMonthTasks ?? 0;
  const needsUpdate = stats?.needsUpdateCount ?? 0;
  const publishedNotIndexed = stats?.publishedNotIndexedCount ?? 0;
  const inProgress = stats?.statusCounts?.["In Progress"] ?? 0;
  const planned = stats?.statusCounts?.["Planned"] ?? 0;

  return (
    <div className="space-y-4">
      {/* Monthly Progress Bar Card */}
      <div className="rounded-2xl border border-[#2d6b73]/30 bg-gradient-to-r from-[#123f46] via-[#155761] to-[#123f46] p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f7c56d]/20 px-2.5 py-0.5 text-xs font-semibold text-[#f7c56d] border border-[#f7c56d]/30">
                <Sparkles size={12} /> Editorial Target
              </span>
              <span className="text-xs text-[#dcebea]/70">
                {monthName} {year}
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              {percentage}% of this month&apos;s plan completed
            </h2>
            <p className="text-sm text-[#dcebea]/80">
              {completedMonthTasks} of {totalMonthTasks} tasks finished, published, or indexed.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-extrabold text-[#f7c56d]">
                {percentage}%
              </div>
              <div className="text-xs text-[#dcebea]/70">Completion rate</div>
            </div>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="mt-5">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-900/40 p-0.5 ring-1 ring-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f7c56d] to-emerald-400 transition-all duration-700 ease-out shadow-lg"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Planned */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Planned
            </span>
            <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-300">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            {planned}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Not yet started</p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
              In Progress
            </span>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/50 p-1.5 text-amber-600 dark:text-amber-400">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inProgress}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Active content</p>
        </div>

        {/* Completed */}
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Completed
            </span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedMonthTasks}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Done / Indexed</p>
        </div>

        {/* Needs GSC Check */}
        <div className="rounded-xl border border-teal-200 dark:border-teal-900/40 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-teal-700 dark:text-teal-400">
              Not Indexed
            </span>
            <div className="rounded-lg bg-teal-50 dark:bg-teal-950/50 p-1.5 text-teal-600 dark:text-teal-400">
              <Search size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-teal-600 dark:text-teal-400">
            {publishedNotIndexed}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Needs GSC check</p>
        </div>

        {/* Needs Update / 90d Decay */}
        <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-white dark:bg-slate-900 p-4 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
              Needs Update
            </span>
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/50 p-1.5 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-600 dark:text-rose-400">
            {needsUpdate}
          </div>
          <p className="text-[11px] text-rose-500 mt-0.5">&gt;90d decay / flagged</p>
        </div>
      </div>
    </div>
  );
}
