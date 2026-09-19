// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Frame from "@/components/Frame/Frame";
import PlannerNav from "@/components/planner/PlannerNav";
import StatusBadge, { PriorityBadge } from "@/components/planner/StatusBadge";
import ContentPlanForm from "@/components/planner/ContentPlanForm";
import { apiRequest } from "@/components/api";
import {
  Wrench,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

const STATUS_LIST = [
  "Planned",
  "In Progress",
  "Done",
  "Published",
  "Indexed",
  "Needs Update",
];

export default function SeoQueuePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teamUsers, setTeamUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await apiRequest("/users");
      if (res?.data || res?.users) {
        setTeamUsers(res.data || res.users || []);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiRequest("/me");
      if (res?.user || res?.data) {
        setCurrentUser(res.user || res.data);
      }
    } catch (e) {
      // Fallback
    }
  }, []);

  const fetchSeoItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiRequest("/planner/items?type=SEO%20Fix&limit=200");
      if (res?.items) {
        setItems(res.items);
      }
    } catch (err) {
      console.error("Failed to fetch SEO queue:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchMe();
  }, [fetchUsers, fetchMe]);

  useEffect(() => {
    fetchSeoItems();
  }, [fetchSeoItems]);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      setUpdatingId(itemId);
      await apiRequest(`/planner/items/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      fetchSeoItems();
    } catch (err) {
      alert(err.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this SEO task?")) return;
    try {
      await apiRequest(`/planner/items/${id}`, { method: "DELETE" });
      fetchSeoItems();
    } catch (err) {
      alert(err.message || "Failed to delete SEO task");
    }
  };

  const handleAddNew = () => {
    setEditingItem({
      title: "",
      type: "SEO Fix",
      status: "Planned",
      priority: "High",
      plannedDate: new Date().toISOString().split("T")[0],
      notes: "e.g., Fix broken internal link, update canonical, add schema markup",
    });
    setFormOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const filteredItems = items.filter((i) => {
    const matchSearch =
      !search ||
      i.title?.toLowerCase().includes(search.toLowerCase()) ||
      i.notes?.toLowerCase().includes(search.toLowerCase()) ||
      i.targetUrl?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalFixed = items.filter((i) =>
    ["Done", "Indexed", "Published"].includes(i.status)
  ).length;

  const isSuperAdmin = currentUser?.role === "super_admin";

  return (
    <Frame>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header & Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Technical SEO Fix Queue
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Track and resolve technical issues: broken links, missing meta, canonical tags, and schema errors.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#123f46] hover:bg-[#155761] px-4 py-2 text-xs font-semibold text-white shadow-md transition self-start sm:self-auto"
            >
              <Plus size={16} /> Add SEO Fix
            </button>
          </div>

          <PlannerNav />
        </div>

        {/* SEO Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Total Fixes Queued
            </span>
            <div className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
              {items.length}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">All technical audits</p>
          </div>

          <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
              Resolved &amp; Verified
            </span>
            <div className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {totalFixed}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Marked Done or Indexed</p>
          </div>

          <div className="rounded-xl border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-slate-900 p-4 shadow-sm">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">
              Pending Resolution
            </span>
            <div className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
              {items.length - totalFixed}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Planned or In Progress</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search SEO task, URL, or notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* SEO Fixes Table */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Technical Issue / Task</th>
                  <th className="px-4 py-3.5">Affected URL</th>
                  <th className="px-4 py-3.5">Scheduled Date</th>
                  <th className="px-4 py-3.5">Assigned To</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      Loading SEO tasks...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No technical SEO tasks found in the queue.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* Title & Notes */}
                      <td className="px-4 py-3 max-w-sm">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <PriorityBadge priority={item.priority} />
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.title}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.notes}
                          </p>
                        )}
                      </td>

                      {/* Affected URL */}
                      <td className="px-4 py-3 max-w-xs truncate text-slate-500">
                        {item.targetUrl ? (
                          <a
                            href={item.targetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#155761] dark:text-[#f7c56d] hover:underline"
                          >
                            <ExternalLink size={10} /> {item.targetUrl}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Scheduled Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {item.plannedDate
                          ? new Date(item.plannedDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "—"}
                      </td>

                      {/* Assigned To */}
                      <td className="px-4 py-3">
                        {item.assignedTo ? (
                          <span className="text-slate-700 dark:text-slate-200 font-medium">
                            {item.assignedTo.name || item.assignedTo.username}
                          </span>
                        ) : (
                          <span className="text-slate-400">Unassigned</span>
                        )}
                      </td>

                      {/* Status + Dropdown */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={item.status} size="sm" />
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
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                            title="Edit task"
                          >
                            <Edit2 size={13} />
                          </button>
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              className="rounded p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete task"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form */}
        <ContentPlanForm
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          initialData={editingItem}
          onSaved={fetchSeoItems}
          teamUsers={teamUsers}
        />
      </div>
    </Frame>
  );
}
