// NEW FILE - PLANNER FEATURE - DO NOT BREAK EXISTING CODE
"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, User, Tag, AlertCircle, Link as LinkIcon, Flag } from "lucide-react";
import { apiRequest } from "@/components/api";

const CONTENT_TYPES = [
  "Blog",
  "News",
  "SEO Fix",
  "Keyword Research",
  "Social",
  "Other",
];

const STATUS_OPTIONS = [
  "Planned",
  "In Progress",
  "Done",
  "Published",
  "Indexed",
  "Needs Update",
];

const PRIORITIES = ["High", "Medium", "Low"];

export default function ContentPlanForm({
  isOpen,
  onClose,
  initialData = null,
  onSaved,
  defaultDate = null,
  teamUsers = [],
}) {
  const [formData, setFormData] = useState({
    title: "",
    keyword: "",
    type: "Blog",
    status: "Planned",
    priority: "Medium",
    plannedDate: "",
    publishedDate: "",
    assignedTo: "",
    targetUrl: "",
    notes: "",
    linkedPostSlug: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        keyword: initialData.keyword || "",
        type: initialData.type || "Blog",
        status: initialData.status || "Planned",
        priority: initialData.priority || "Medium",
        plannedDate: initialData.plannedDate
          ? new Date(initialData.plannedDate).toISOString().split("T")[0]
          : "",
        publishedDate: initialData.publishedDate
          ? new Date(initialData.publishedDate).toISOString().split("T")[0]
          : "",
        assignedTo:
          initialData.assignedTo?._id || initialData.assignedTo || "",
        targetUrl: initialData.targetUrl || "",
        notes: initialData.notes || "",
        linkedPostSlug: initialData.linkedPostSlug || "",
      });
    } else {
      setFormData({
        title: "",
        keyword: "",
        type: "Blog",
        status: "Planned",
        priority: "Medium",
        plannedDate: defaultDate || new Date().toISOString().split("T")[0],
        publishedDate: "",
        assignedTo: "",
        targetUrl: "",
        notes: "",
        linkedPostSlug: "",
      });
    }
    setError("");
  }, [initialData, defaultDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!formData.plannedDate) {
      setError("Planned date is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...formData,
        assignedTo: formData.assignedTo || null,
        publishedDate: formData.publishedDate || null,
      };

      let result;
      if (initialData?._id) {
        result = await apiRequest(`/planner/items/${initialData._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
      } else {
        result = await apiRequest("/planner/items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (onSaved) onSaved(result?.item || result);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save content plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {initialData ? "Edit Content Plan" : "Create Content Plan Item"}
            </h3>
            <p className="text-xs text-slate-500">
              Schedule content or technical task on the editorial calendar.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Ultimate Guide to Headless Next.js CMS"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none focus:ring-2 focus:ring-[#2d6b73]/20"
            />
          </div>

          {/* Keyword & Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Keyword
              </label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) =>
                  setFormData({ ...formData, keyword: e.target.value })
                }
                placeholder="e.g., nextjs headless cms"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Content Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Planned Date & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Planned Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.plannedDate}
                onChange={(e) =>
                  setFormData({ ...formData, plannedDate: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status & Assigned To Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Assigned Team Member
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              >
                <option value="">Unassigned</option>
                {teamUsers.map((u) => (
                  <option key={u._id || u.id} value={u._id || u.id}>
                    {u.name || u.username} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target URL & Linked Post Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target URL
              </label>
              <input
                type="text"
                value={formData.targetUrl}
                onChange={(e) =>
                  setFormData({ ...formData, targetUrl: e.target.value })
                }
                placeholder="e.g., https://kraviona.com/blog/..."
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Linked Post Slug
              </label>
              <input
                type="text"
                value={formData.linkedPostSlug}
                onChange={(e) =>
                  setFormData({ ...formData, linkedPostSlug: e.target.value })
                }
                placeholder="e.g., nextjs-headless-cms"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Editorial Instructions
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Outline, internal links, technical SEO focus points..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-[#2d6b73] focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#123f46] hover:bg-[#155761] px-5 py-2 text-sm font-medium text-white shadow-md transition disabled:opacity-50"
            >
              {loading ? "Saving..." : initialData ? "Update Item" : "Create Plan Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
