"use client";

import { apiRequest, formatDate } from "@/components/api";
import {
  Check,
  Download,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const STATUS_STYLES = {
  subscriber: "border-emerald-200 bg-emerald-50 text-emerald-700",
  subscriber_blocked: "border-red-200 bg-red-50 text-red-600",
};

function StatusPill({ status }) {
  const key = status || "subscriber";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_STYLES[key] || STATUS_STYLES.subscriber
      }`}
    >
      {key.replace("_", " ")}
    </span>
  );
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#235056]/10 text-[#235056]">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function AddSubscriberModal({ email, onEmailChange, onClose, onSubmit, saving }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">
              Newsletter
            </p>
            <h2 className="text-lg font-bold text-slate-900">Add subscriber</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </span>
            <input
              autoFocus
              required
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="subscriber@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
            />
          </label>
        </form>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3d42] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainNewslettersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await apiRequest("/newslatter");
      const nextSubscribers = Array.isArray(result.data) ? result.data : [];
      setSubscribers(
        nextSubscribers.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        ),
      );
    } catch (err) {
      setError(err.message || "Could not load subscribers.");
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchSubscribers, 0);
    return () => clearTimeout(timeout);
  }, [fetchSubscribers]);

  const filteredSubscribers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return subscribers.filter((subscriber) => {
      const matchesStatus =
        statusFilter === "All" || subscriber.status === statusFilter;
      const matchesSearch =
        !q || (subscriber.email || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [subscribers, search, statusFilter]);

  const stats = useMemo(() => {
    const active = subscribers.filter(
      (subscriber) => subscriber.status !== "subscriber_blocked",
    ).length;
    const blocked = subscribers.filter(
      (subscriber) => subscriber.status === "subscriber_blocked",
    ).length;
    const latest = subscribers[0]?.createdAt ? formatDate(subscribers[0].createdAt) : "-";

    return { total: subscribers.length, active, blocked, latest };
  }, [subscribers]);

  const handleAdd = async (event) => {
    event?.preventDefault?.();

    if (!email.trim()) return;

    setSaving(true);
    try {
      const result = await apiRequest("/newslatter", {
        method: "POST",
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const created = result.data || {
        _id: `${email}-${Date.now()}`,
        email: email.trim().toLowerCase(),
        status: "subscriber",
        createdAt: new Date().toISOString(),
      };
      setSubscribers((prev) => [created, ...prev]);
      setEmail("");
      setAddOpen(false);
      Swal.fire({
        icon: "success",
        title: "Subscriber added",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Unable to add subscriber",
        text: err.message || "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (subscriber) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete subscriber?",
      text: subscriber.email,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(subscriber._id);
    try {
      await apiRequest(`/newslatter/${subscriber._id}`, { method: "DELETE" });
      setSubscribers((prev) =>
        prev.filter((item) => item._id !== subscriber._id),
      );
      Swal.fire({
        icon: "success",
        title: "Subscriber deleted",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text: err.message || "Please try again.",
      });
    } finally {
      setDeletingId("");
    }
  };

  const exportCsv = () => {
    const headers = ["Email", "Status", "Created"];
    const rows = filteredSubscribers.map((subscriber) => [
      subscriber.email,
      subscriber.status,
      formatDate(subscriber.createdAt),
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell || "").replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "kraviona-newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full w-full bg-[#F8F9FB] p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-[#d26c51]" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Sales & Audience
            </p>
          </div>
          <h1 className="text-2xl font-bold text-slate-950">
            Newsletter Subscribers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Keep the mailing list clean and ready for campaigns.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filteredSubscribers.length}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Export
          </button>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3d42]"
          >
            <Plus size={16} />
            Add subscriber
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Mail}
          label="Total subscribers"
          value={loading ? "-" : stats.total}
        />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={loading ? "-" : stats.active}
        />
        <StatCard
          icon={UserX}
          label="Blocked"
          value={loading ? "-" : stats.blocked}
        />
        <StatCard
          icon={Check}
          label="Latest signup"
          value={loading ? "-" : stats.latest}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-sm">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search email..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/10"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {["All", "subscriber", "subscriber_blocked"].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  statusFilter === status
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-sm">Loading subscribers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredSubscribers.length ? (
                filteredSubscribers.map((subscriber) => (
                  <tr
                    key={subscriber._id}
                    className="transition hover:bg-[#235056]/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#235056]/10 text-[#235056]">
                          <Mail size={16} />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {subscriber.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={subscriber.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {formatDate(subscriber.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleDelete(subscriber)}
                          disabled={deletingId === subscriber._id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === subscriber._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                        <Mail size={22} />
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        No subscribers match the current view.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-3">
          <span className="text-xs text-slate-400">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
          </span>
        </div>
      </div>

      {addOpen && (
        <AddSubscriberModal
          email={email}
          onEmailChange={setEmail}
          onClose={() => setAddOpen(false)}
          onSubmit={handleAdd}
          saving={saving}
        />
      )}
    </div>
  );
}
