// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import StatusBadge, { PriorityBadge, TypeBadge } from "./StatusBadge";
import { apiRequest } from "@/components/api";

const STATUS_LIST = [
  "Planned",
  "In Progress",
  "Done",
  "Published",
  "Indexed",
  "Needs Update",
];

export default function DayDetailPanel({
  isOpen,
  onClose,
  selectedDate,
  dayData,
  onItemUpdated,
  onAddNewClick,
  onEditClick,
  onDeleteClick,
  currentUserRole,
}) {
  const [updatingId, setUpdatingId] = useState(null);

  if (!isOpen || !selectedDate) return null;

  const tasks = dayData?.tasks || [];
  const totalTasks = dayData?.totalTasks || tasks.length;
  const completedTasks = dayData?.completedTasks || tasks.filter((t) =>
    ["Done", "Published", "Indexed"].includes(t.status)
  ).length;
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setUpdatingId(taskId);
      const res = await apiRequest(`/planner/items/${taskId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (onItemUpdated) {
        onItemUpdated(res.item || res);
      }
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const isSuperAdmin = currentUserRole === "super_admin";

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-[#123f46] p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-white/10 p-2 text-[#f7c56d]">
              <Calendar size={18} />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-[#dcebea]/80 font-semibold">
                Daily Schedule
              </span>
              <h3 className="text-base font-bold text-white">
                {formattedDate}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#dcebea]/70 hover:bg-white/10 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Completion Bar */}
        <div className="mt-5 rounded-xl bg-slate-900/30 p-3.5 ring-1 ring-white/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#dcebea] font-medium">Daily Completion</span>
            <span className="font-bold text-[#f7c56d]">
              {completedTasks}/{totalTasks} tasks done ({percentage}%)
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-900/60">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f7c56d] to-emerald-400 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-3 bg-slate-50 dark:bg-slate-900/50">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Planned Items ({tasks.length})
        </span>
        <button
          type="button"
          onClick={() => onAddNewClick(selectedDate)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#123f46] hover:bg-[#155761] px-3 py-1.5 text-xs font-medium text-white shadow-xs transition"
        >
          <Plus size={14} /> Add Content
        </button>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 mb-3">
              <Calendar size={28} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              No content planned for this date
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Click &quot;Add Content&quot; above to schedule blog posts, SEO fixes, or keyword tasks.
            </p>
          </div>
        ) : (
          tasks.map((item) => (
            <div
              key={item._id}
              className="group relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 p-4 shadow-sm hover:border-[#2d6b73]/40 transition space-y-3"
            >
              {/* Type, Priority & Actions */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <TypeBadge type={item.type} />
                  <PriorityBadge priority={item.priority} />
                  {item.isOutdated && (
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-bold">
                      Needs Update
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditClick(item)}
                    className="rounded p-1 text-slate-400 hover:text-[#123f46] dark:hover:text-[#f7c56d] transition"
                    title="Edit task"
                  >
                    <Edit2 size={14} />
                  </button>
                  {isSuperAdmin && (
                    <button
                      type="button"
                      onClick={() => onDeleteClick(item._id)}
                      className="rounded p-1 text-slate-400 hover:text-rose-600 transition"
                      title="Delete task (Super Admin)"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Keyword */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h4>
                {item.keyword && (
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                    <span className="text-slate-400">kw:</span> {item.keyword}
                  </p>
                )}
              </div>

              {/* Assignee & Inline Status Dropdown */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#155761] text-[#f7c56d] text-[10px] font-bold flex items-center justify-center ring-1 ring-white/10">
                    {item.assignedTo?.name
                      ? item.assignedTo.name[0].toUpperCase()
                      : "U"}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-300 truncate max-w-[110px]">
                    {item.assignedTo?.name || "Unassigned"}
                  </span>
                </div>

                {/* Inline Status Dropdown */}
                <div className="relative inline-block">
                  <select
                    disabled={updatingId === item._id}
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 pr-6 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#2d6b73] cursor-pointer"
                  >
                    {STATUS_LIST.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2 top-2 text-slate-400"
                  />
                </div>
              </div>

              {/* Notes / Links preview if present */}
              {item.targetUrl && (
                <div className="pt-1">
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#155761] dark:text-[#f7c56d] hover:underline"
                  >
                    <ExternalLink size={11} /> Target URL
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
