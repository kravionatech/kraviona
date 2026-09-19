// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  CalendarPlus,
  Layers,
  Edit2,
  Trash2,
  ExternalLink,
  Tag,
  TrendingUp,
  FolderKanban,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import { apiRequest } from "@/components/api";

const INTENTS = [
  "Informational",
  "Commercial",
  "Transactional",
  "Navigational",
];

const KEYWORD_STATUSES = [
  "Researched",
  "Assigned",
  "In Content Plan",
  "Published",
  "Ranking",
];

export default function KeywordTable({
  keywords = [],
  clusters = [],
  loading = false,
  teamUsers = [],
  onRefresh,
  currentUserRole,
}) {
  const [search, setSearch] = useState("");
  const [selectedCluster, setSelectedCluster] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Add/Edit Keyword Modal State
  const [keywordModalOpen, setKeywordModalOpen] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [keywordForm, setKeywordForm] = useState({
    keyword: "",
    intent: "Informational",
    monthlyVolume: 0,
    difficulty: 0,
    cluster: "General",
    targetUrl: "",
    status: "Researched",
    notes: "",
  });

  // Create Plan from Keyword Modal State
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planningKeyword, setPlanningKeyword] = useState(null);
  const [planForm, setPlanForm] = useState({
    title: "",
    type: "Blog",
    plannedDate: new Date().toISOString().split("T")[0],
    assignedTo: "",
    priority: "Medium",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  // Filter keywords
  const filteredKeywords = keywords.filter((k) => {
    const matchSearch =
      !search ||
      k.keyword?.toLowerCase().includes(search.toLowerCase()) ||
      k.cluster?.toLowerCase().includes(search.toLowerCase()) ||
      k.notes?.toLowerCase().includes(search.toLowerCase());
    const matchCluster = !selectedCluster || k.cluster === selectedCluster;
    const matchStatus = !selectedStatus || k.status === selectedStatus;
    return matchSearch && matchCluster && matchStatus;
  });

  // Open add keyword modal
  const handleOpenAddKeyword = () => {
    setEditingKeyword(null);
    setKeywordForm({
      keyword: "",
      intent: "Informational",
      monthlyVolume: 0,
      difficulty: 0,
      cluster: "General",
      targetUrl: "",
      status: "Researched",
      notes: "",
    });
    setKeywordModalOpen(true);
  };

  // Open edit keyword modal
  const handleOpenEditKeyword = (kw) => {
    setEditingKeyword(kw);
    setKeywordForm({
      keyword: kw.keyword || "",
      intent: kw.intent || "Informational",
      monthlyVolume: kw.monthlyVolume || 0,
      difficulty: kw.difficulty || 0,
      cluster: kw.cluster || "General",
      targetUrl: kw.targetUrl || "",
      status: kw.status || "Researched",
      notes: kw.notes || "",
    });
    setKeywordModalOpen(true);
  };

  // Save keyword (create or edit)
  const handleSaveKeyword = async (e) => {
    e.preventDefault();
    if (!keywordForm.keyword.trim()) return;

    try {
      setSaving(true);
      if (editingKeyword?._id) {
        await apiRequest(`/planner/keywords/${editingKeyword._id}`, {
          method: "PATCH",
          body: JSON.stringify(keywordForm),
        });
      } else {
        await apiRequest("/planner/keywords", {
          method: "POST",
          body: JSON.stringify(keywordForm),
        });
      }
      setKeywordModalOpen(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to save keyword");
    } finally {
      setSaving(false);
    }
  };

  // Delete keyword
  const handleDeleteKeyword = async (id) => {
    if (!confirm("Are you sure you want to delete this keyword?")) return;
    try {
      await apiRequest(`/planner/keywords/${id}`, { method: "DELETE" });
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to delete keyword");
    }
  };

  // Open Create Plan modal from keyword
  const handleOpenPlanModal = (kw) => {
    setPlanningKeyword(kw);
    setPlanForm({
      title: `Complete Guide to ${kw.keyword.charAt(0).toUpperCase() + kw.keyword.slice(1)}`,
      type: "Blog",
      plannedDate: new Date().toISOString().split("T")[0],
      assignedTo: "",
      priority: "Medium",
      notes: kw.notes || "",
    });
    setPlanModalOpen(true);
  };

  // Submit Plan from Keyword
  const handleCreatePlanFromKeyword = async (e) => {
    e.preventDefault();
    if (!planningKeyword) return;

    try {
      setSaving(true);
      await apiRequest(`/planner/keywords/${planningKeyword._id}/plan`, {
        method: "POST",
        body: JSON.stringify(planForm),
      });
      setPlanModalOpen(false);
      alert("Task scheduled to Content Calendar successfully!");
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.message || "Failed to schedule plan from keyword");
    } finally {
      setSaving(false);
    }
  };

  const isSuperAdmin = currentUserRole === "super_admin";

  return (
    <div className="space-y-6">
      {/* Clusters Summary Cards */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-sm">
            <FolderKanban size={18} className="text-[#155761] dark:text-[#f7c56d]" />
            <span>Keyword Topic Clusters</span>
          </div>
          <span className="text-xs text-slate-500">
            {clusters.length} active topic groups
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCluster("")}
            className={`rounded-full px-3 py-1 text-xs font-semibold border transition ${
              !selectedCluster
                ? "bg-[#123f46] text-[#f7c56d] border-[#123f46]"
                : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 hover:bg-slate-100"
            }`}
          >
            All Clusters ({keywords.length})
          </button>
          {clusters.map((c) => {
            const count = keywords.filter((k) => k.cluster === c).length;
            const isSelected = selectedCluster === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCluster(isSelected ? "" : c)}
                className={`rounded-full px-3 py-1 text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#155761] text-white border-[#155761]"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>{c}</span>
                <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Add Keyword Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={15}
              className="absolute left-3.5 top-3 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search keyword or cluster..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
            />
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All Statuses</option>
            {KEYWORD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleOpenAddKeyword}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#123f46] hover:bg-[#155761] px-4 py-2 text-xs font-semibold text-white shadow-md transition"
        >
          <Plus size={15} /> Add Keyword
        </button>
      </div>

      {/* Keywords Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3.5">Keyword</th>
                <th className="px-4 py-3.5">Search Intent</th>
                <th className="px-4 py-3.5 text-center">Monthly Vol</th>
                <th className="px-4 py-3.5 text-center">Difficulty</th>
                <th className="px-4 py-3.5">Topic Cluster</th>
                <th className="px-4 py-3.5">Target URL</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Loading keywords...
                  </td>
                </tr>
              ) : filteredKeywords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No keywords found. Click &quot;Add Keyword&quot; to begin research.
                  </td>
                </tr>
              ) : (
                filteredKeywords.map((kw) => {
                  const difficultyColor =
                    kw.difficulty > 70
                      ? "text-rose-600 font-bold"
                      : kw.difficulty > 40
                      ? "text-amber-600 font-semibold"
                      : "text-emerald-600 font-semibold";

                  return (
                    <tr
                      key={kw._id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* Keyword */}
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white font-mono">
                        {kw.keyword}
                      </td>

                      {/* Intent */}
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                          {kw.intent}
                        </span>
                      </td>

                      {/* Volume */}
                      <td className="px-4 py-3 text-center font-mono text-slate-700 dark:text-slate-300">
                        {kw.monthlyVolume ? kw.monthlyVolume.toLocaleString() : "—"}
                      </td>

                      {/* Difficulty */}
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs ${difficultyColor}`}>
                          {kw.difficulty}/100
                        </span>
                      </td>

                      {/* Cluster */}
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#155761]/10 px-2 py-0.5 text-[11px] font-medium text-[#155761] dark:text-[#f7c56d]">
                          <Tag size={10} /> {kw.cluster || "General"}
                        </span>
                      </td>

                      {/* Target URL */}
                      <td className="px-4 py-3 max-w-xs truncate text-slate-500">
                        {kw.targetUrl ? (
                          <a
                            href={kw.targetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#155761] dark:text-[#f7c56d] hover:underline"
                          >
                            <ExternalLink size={10} /> {kw.targetUrl}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={kw.status} size="sm" />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {/* Create Plan Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenPlanModal(kw)}
                            title="Create Content Plan from Keyword"
                            className="inline-flex items-center gap-1 rounded-lg bg-[#123f46]/10 hover:bg-[#123f46] text-[#123f46] hover:text-white dark:bg-[#f7c56d]/10 dark:hover:bg-[#f7c56d] dark:text-[#f7c56d] dark:hover:text-slate-900 px-2.5 py-1 text-[11px] font-semibold transition"
                          >
                            <CalendarPlus size={13} />
                            <span>Plan Item</span>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditKeyword(kw)}
                            className="rounded p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                            title="Edit keyword"
                          >
                            <Edit2 size={13} />
                          </button>

                          {/* Delete */}
                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteKeyword(kw._id)}
                              className="rounded p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Delete keyword"
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

      {/* Add / Edit Keyword Modal */}
      {keywordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingKeyword ? "Edit Keyword" : "Add Target Keyword"}
            </h3>

            <form onSubmit={handleSaveKeyword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keyword <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={keywordForm.keyword}
                  onChange={(e) =>
                    setKeywordForm({ ...keywordForm, keyword: e.target.value })
                  }
                  placeholder="e.g., website development services"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Search Intent
                  </label>
                  <select
                    value={keywordForm.intent}
                    onChange={(e) =>
                      setKeywordForm({ ...keywordForm, intent: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    {INTENTS.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Topic Cluster
                  </label>
                  <input
                    type="text"
                    value={keywordForm.cluster}
                    onChange={(e) =>
                      setKeywordForm({ ...keywordForm, cluster: e.target.value })
                    }
                    placeholder="e.g., Web Design, SEO, AI"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Monthly Volume (Est.)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={keywordForm.monthlyVolume}
                    onChange={(e) =>
                      setKeywordForm({
                        ...keywordForm,
                        monthlyVolume: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty (0 - 100)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={keywordForm.difficulty}
                    onChange={(e) =>
                      setKeywordForm({
                        ...keywordForm,
                        difficulty: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Landing / Ranking URL
                </label>
                <input
                  type="text"
                  value={keywordForm.targetUrl}
                  onChange={(e) =>
                    setKeywordForm({ ...keywordForm, targetUrl: e.target.value })
                  }
                  placeholder="https://kraviona.com/..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={keywordForm.notes}
                  onChange={(e) =>
                    setKeywordForm({ ...keywordForm, notes: e.target.value })
                  }
                  placeholder="SERP competitors, secondary keywords..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setKeywordModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#123f46] hover:bg-[#155761] text-white px-4 py-2 text-xs font-semibold transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Keyword"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Content Plan from Keyword Modal */}
      {planModalOpen && planningKeyword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 space-y-4">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#155761] dark:text-[#f7c56d]">
                Calendar Integration
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Create Plan from &quot;{planningKeyword.keyword}&quot;
              </h3>
            </div>

            <form onSubmit={handleCreatePlanFromKeyword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article / Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={planForm.title}
                  onChange={(e) =>
                    setPlanForm({ ...planForm, title: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Planned Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={planForm.plannedDate}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, plannedDate: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={planForm.priority}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, priority: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Content Type
                  </label>
                  <select
                    value={planForm.type}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, type: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Blog">Blog</option>
                    <option value="News">News</option>
                    <option value="SEO Fix">SEO Fix</option>
                    <option value="Social">Social</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assignee
                  </label>
                  <select
                    value={planForm.assignedTo}
                    onChange={(e) =>
                      setPlanForm({ ...planForm, assignedTo: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {teamUsers.map((u) => (
                      <option key={u._id || u.id} value={u._id || u.id}>
                        {u.name || u.username}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#123f46] hover:bg-[#155761] text-white px-5 py-2 text-xs font-semibold shadow-md transition disabled:opacity-50"
                >
                  {saving ? "Scheduling..." : "Save to Calendar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
