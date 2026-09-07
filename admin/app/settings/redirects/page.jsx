"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  AlertCircle,
} from "lucide-react";
import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import { ContentLoader } from "@/components/AsyncState";

export default function RedirectsPage() {
  const [redirects, setRedirects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formSource, setFormSource] = useState("");
  const [formDestination, setFormDestination] = useState("");
  const [formType, setFormType] = useState("301");
  const [formActive, setFormActive] = useState(true);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  const fetchRedirects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await apiRequest(`/admin/redirects${query}`);
      setRedirects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to fetch redirects");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchRedirects();
  }, [fetchRedirects]);

  const openAddModal = () => {
    setEditingItem(null);
    setFormSource("");
    setFormDestination("");
    setFormType("301");
    setFormActive(true);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormSource(item.source || "");
    setFormDestination(item.destination || "");
    setFormType(item.type || "301");
    setFormActive(item.active ?? true);
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    const cleanSource = formSource.trim();
    const cleanDest = formDestination.trim();

    if (!cleanSource || !cleanDest) {
      setFormError("Both source and destination are required.");
      return;
    }

    if (!cleanSource.startsWith("/")) {
      setFormError("Source must start with '/' (e.g., /blog/old-slug).");
      return;
    }

    if (cleanSource === cleanDest) {
      setFormError("Source and destination cannot be identical (would cause an infinite loop).");
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        // Update
        await apiRequest(`/admin/redirects/${editingItem._id}`, {
          method: "PUT",
          body: JSON.stringify({
            source: cleanSource,
            destination: cleanDest,
            type: formType,
            active: formActive,
          }),
        });
        setSuccess("Redirect updated successfully.");
      } else {
        // Create
        await apiRequest("/admin/redirects", {
          method: "POST",
          body: JSON.stringify({
            source: cleanSource,
            destination: cleanDest,
            type: formType,
            active: formActive,
          }),
        });
        setSuccess("Redirect created successfully.");
      }

      closeModal();
      fetchRedirects();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setFormError(err.message || "Failed to save redirect.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this redirect?")) {
      return;
    }

    setDeletingId(id);
    try {
      await apiRequest(`/admin/redirects/${id}`, { method: "DELETE" });
      setSuccess("Redirect deleted successfully.");
      setRedirects((prev) => prev.filter((item) => item._id !== id));
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to delete redirect.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (item) => {
    try {
      const updatedStatus = !item.active;
      await apiRequest(`/admin/redirects/${item._id}`, {
        method: "PUT",
        body: JSON.stringify({ active: updatedStatus }),
      });
      setRedirects((prev) =>
        prev.map((r) => (r._id === item._id ? { ...r, active: updatedStatus } : r))
      );
    } catch (err) {
      setError(err.message || "Failed to toggle redirect status.");
    }
  };

  return (
    <Frame>
      <main className="min-h-full bg-[#edf5f4] px-4 py-6 sm:px-6 lg:px-9 lg:py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header Banner */}
          <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#0f5960]/20 bg-gradient-to-br from-[#123f46] via-[#0f5960] to-[#1b6870] p-6 text-white shadow-xl shadow-[#0f5960]/15 sm:p-8">
            <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full bg-[#f7c56d]/15 blur-3xl" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f7d994]">
                  SEO &amp; URL Rules
                </p>
                <h1 className="mt-2 flex items-center gap-2.5 text-3xl font-black">
                  <ArrowLeftRight size={28} /> Redirect Management
                </h1>
                <p className="mt-2 text-sm text-[#dcebea] max-w-2xl">
                  Manage 301 permanent and 302 temporary redirects stored in the database.
                  These rules are processed before page rendering by Next.js middleware.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#f7c56d] px-5 py-2.5 text-sm font-bold text-[#123f46] transition hover:bg-[#ffe09c] shadow"
                >
                  <Plus size={18} /> Add Redirect Rule
                </button>
                <button
                  type="button"
                  onClick={fetchRedirects}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20 disabled:opacity-60"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
              </div>
            </div>
          </section>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              <AlertCircle size={18} className="shrink-0 text-rose-600" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              <CheckCircle2 size={18} className="shrink-0 text-emerald-600" />
              {success}
            </div>
          )}

          {/* Search & Filter Bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5d7679]"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by source or destination URL..."
                className="w-full rounded-xl border border-[#0f5960]/15 bg-white py-2.5 pl-10 pr-4 text-sm text-[#123f46] shadow-sm outline-none transition focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/20"
              />
            </div>
            <div className="text-xs font-bold text-[#5d7679]">
              Total rules: <span className="text-[#123f46]">{redirects.length}</span>
            </div>
          </div>

          {/* Table / List */}
          <div className="overflow-hidden rounded-3xl border border-[#0f5960]/12 bg-white shadow-sm">
            {loading ? (
              <div className="p-12">
                <ContentLoader label="Loading redirects from database..." />
              </div>
            ) : redirects.length === 0 ? (
              <div className="p-12 text-center">
                <ArrowLeftRight size={36} className="mx-auto mb-3 text-slate-300" />
                <h3 className="text-base font-bold text-[#123f46]">No redirect rules found</h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  {search
                    ? "No redirect matches your search query."
                    : "Add your first redirect to forward old URLs to their canonical destinations."}
                </p>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0f5960] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#123f46]"
                >
                  <Plus size={15} /> Create Redirect
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#0f5960]/10 bg-[#f8fbfa] text-[11px] font-black uppercase tracking-wider text-[#5d7679]">
                    <tr>
                      <th className="px-6 py-4">Source (Old URL)</th>
                      <th className="px-6 py-4">Destination (New URL)</th>
                      <th className="px-4 py-4 text-center">Type</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0f5960]/08">
                    {redirects.map((item) => (
                      <tr key={item._id} className="transition hover:bg-[#edf5f4]/50">
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-semibold text-[#0f5960]">
                            {item.source}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-semibold text-slate-700">
                            {item.destination}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black tracking-wide ${
                              item.type === "301"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {item.type} {item.type === "301" ? "Permanent" : "Temporary"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(item)}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize transition ${
                              item.active
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.active ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            {item.active ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              title="Edit"
                              className="rounded-lg border border-[#0f5960]/15 bg-white p-2 text-[#0f5960] transition hover:bg-[#edf5f4]"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                              title="Delete"
                              className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#0f5960]/20 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-[#123f46]">
                {editingItem ? "Edit Redirect Rule" : "Create Redirect Rule"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5d7679] mb-1.5">
                  Source Path (From)
                </label>
                <input
                  type="text"
                  required
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  placeholder="/blog/old-article-slug"
                  className="w-full rounded-xl border border-[#0f5960]/20 px-3.5 py-2.5 font-mono text-sm text-[#123f46] outline-none transition focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/20"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Must start with &apos;/&apos;. Exact incoming URL path.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#5d7679] mb-1.5">
                  Destination URL (To)
                </label>
                <input
                  type="text"
                  required
                  value={formDestination}
                  onChange={(e) => setFormDestination(e.target.value)}
                  placeholder="/seo/old-article-slug"
                  className="w-full rounded-xl border border-[#0f5960]/20 px-3.5 py-2.5 font-mono text-sm text-[#123f46] outline-none transition focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/20"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Target path (e.g. &apos;/category/slug&apos;) or absolute URL (e.g. &apos;https://...&apos;).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5d7679] mb-1.5">
                    Redirect Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full rounded-xl border border-[#0f5960]/20 px-3 py-2 text-sm text-[#123f46] outline-none transition focus:border-[#0f5960]"
                  >
                    <option value="301">301 - Permanent</option>
                    <option value="302">302 - Temporary</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                      className="h-4 w-4 rounded text-[#0f5960] focus:ring-[#0f5960]"
                    />
                    <span className="text-xs font-bold text-[#123f46]">Active Status</span>
                  </label>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#123f46] disabled:opacity-60"
                >
                  {saving && <RefreshCw size={14} className="animate-spin" />}
                  {editingItem ? "Save Changes" : "Create Redirect"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Frame>
  );
}
