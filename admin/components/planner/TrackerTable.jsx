// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState } from "react";
import {
  Download,
  Filter,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Sparkles,
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

export default function TrackerTable({
  items = [],
  loading = false,
  teamUsers = [],
  filters = {},
  onFilterChange,
  onEditClick,
  onDeleteClick,
  onItemUpdated,
  currentUserRole,
}) {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      const res = await apiRequest(`/planner/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      if (onItemUpdated) onItemUpdated(res.item || res);
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleNeedsUpdate = async (item) => {
    try {
      setUpdatingId(item._id);
      const nextStatus = item.status === "Needs Update" ? "Planned" : "Needs Update";
      const nextOutdated = !item.isOutdated;
      const res = await apiRequest(`/planner/items/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: nextStatus,
          isOutdated: nextOutdated,
        }),
      });
      if (onItemUpdated) onItemUpdated(res.item || res);
    } catch (err) {
      alert(err.message || "Failed to flag needs update");
    } finally {
      setUpdatingId(null);
    }
  };

  // CSV Export logic
  const handleExportCSV = () => {
    if (!items || items.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "Title",
      "Keyword",
      "Type",
      "Planned Date",
      "Status",
      "Priority",
      "Assigned To",
      "Target URL",
      "Needs Update",
      "Notes",
    ];

    const rows = items.map((i) => [
      `"${(i.title || "").replace(/"/g, '""')}"`,
      `"${(i.keyword || "").replace(/"/g, '""')}"`,
      i.type || "",
      i.plannedDate ? new Date(i.plannedDate).toISOString().split("T")[0] : "",
      i.status || "",
      i.priority || "",
      `"${(i.assignedTo?.name || "").replace(/"/g, '""')}"`,
      `"${(i.targetUrl || "").replace(/"/g, '""')}"`,
      i.isOutdated ? "Yes" : "No",
      `"${(i.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `content-planner-tracker-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isSuperAdmin = currentUserRole === "super_admin";

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search title, keyword, or notes..."
              value={filters.search || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, search: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <select
              value={filters.status || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, status: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="">All Statuses</option>
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={filters.type || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, type: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Blog">Blog</option>
              <option value="News">News</option>
              <option value="SEO Fix">SEO Fix</option>
              <option value="Keyword Research">Keyword Research</option>
              <option value="Social">Social</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={filters.assignedTo || ""}
              onChange={(e) =>
                onFilterChange({ ...filters, assignedTo: e.target.value })
              }
              className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="">All Assignees</option>
              {teamUsers.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.name || u.username}
                </option>
              ))}
            </select>

            {/* Outdated Only Toggle */}
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  isOutdated: filters.isOutdated ? "" : "true",
                })
              }
              className={`rounded-xl px-3 py-2 text-xs font-medium border transition ${
                filters.isOutdated
                  ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300"
                  : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              ❌ Needs Update Only
            </button>

            {/* Export to CSV */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Title & Target</th>
                <th className="px-4 py-3.5">Keyword</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Planned Date</th>
                <th className="px-4 py-3.5">Assigned To</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-center">% Done</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading planner items...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No content items match the selected filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isDone = ["Done", "Published", "Indexed"].includes(
                    item.status
                  );
                  const isPublishedNotIndexed = item.status === "Published";
                  const percent = isDone ? 100 : item.status === "In Progress" ? 50 : 0;

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* Title & Target */}
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <PriorityBadge priority={item.priority} />
                          <span className="font-semibold line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                        {item.targetUrl && (
                          <a
                            href={item.targetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#155761] dark:text-[#f7c56d] hover:underline mt-0.5"
                          >
                            <ExternalLink size={10} /> {item.targetUrl}
                          </a>
                        )}
                      </td>

                      {/* Keyword */}
                      <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-300">
                        {item.keyword || "—"}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <TypeBadge type={item.type} />
                      </td>

                      {/* Planned Date */}
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {item.plannedDate
                          ? new Date(item.plannedDate).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short", year: "numeric" }
                            )
                          : "—"}
                      </td>

                      {/* Assigned To */}
                      <td className="px-4 py-3">
                        {item.assignedTo ? (
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-[#155761] text-[#f7c56d] text-[10px] font-bold flex items-center justify-center">
                              {item.assignedTo.name
                                ? item.assignedTo.name[0].toUpperCase()
                                : "U"}
                            </div>
                            <span className="text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
                              {item.assignedTo.name || item.assignedTo.username}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>

                      {/* Status + Badges */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          <StatusBadge status={item.status} size="sm" />
                          {isPublishedNotIndexed && (
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                              ✍️ Needs GSC Check
                            </span>
                          )}
                          {item.isOutdated && (
                            <span className="text-[10px] text-rose-600 font-bold">
                              ❌ Outdated (&gt;90d)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* % Done Progress Bar */}
                      <td className="px-4 py-3 text-center">
                        <div className="w-16 mx-auto">
                          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                            {percent}%
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                percent === 100
                                  ? "bg-emerald-500"
                                  : percent === 50
                                  ? "bg-amber-500"
                                  : "bg-slate-400"
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Inline Status Dropdown */}
                          <div className="relative">
                            <select
                              disabled={updatingId === item._id}
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(item._id, e.target.value)
                              }
                              className="appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 pr-5 text-[11px] font-medium text-slate-700 dark:text-slate-200 focus:outline-none"
                            >
                              {STATUS_LIST.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                            <ChevronDown
                              size={10}
                              className="pointer-events-none absolute right-1.5 top-2 text-slate-400"
                            />
                          </div>

                          {/* Flag Outdated */}
                          <button
                            type="button"
                            onClick={() => handleToggleNeedsUpdate(item)}
                            title={
                              item.isOutdated
                                ? "Clear outdated flag"
                                : "Mark as Needs Update"
                            }
                            className={`rounded-lg p-1.5 border transition ${
                              item.isOutdated
                                ? "bg-rose-100 text-rose-700 border-rose-300"
                                : "text-slate-400 border-slate-200 hover:text-rose-600 hover:border-rose-200"
                            }`}
                          >
                            <AlertTriangle size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => onEditClick(item)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-[#123f46] hover:bg-slate-100 transition"
                            title="Edit item"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete (Super Admin only) */}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => onDeleteClick(item._id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete item"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
