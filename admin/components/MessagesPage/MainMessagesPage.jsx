"use client";

import { apiRequest, formatDate } from "@/components/api";
import {
  Archive,
  CheckCircle2,
  Eye,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Reply,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const STATUSES = ["unread", "read", "replied", "archived"];

const STATUS_STYLES = {
  unread: "border-orange-200 bg-orange-50 text-orange-700",
  read: "border-blue-200 bg-blue-50 text-blue-700",
  replied: "border-emerald-200 bg-emerald-50 text-emerald-700",
  archived: "border-slate-200 bg-slate-100 text-slate-600",
};

function fullName(message) {
  return [message.firstName, message.lastName].filter(Boolean).join(" ") || "-";
}

function getInitials(message) {
  return (
    [message.firstName, message.lastName]
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "MS"
  );
}

function StatusPill({ status }) {
  const key = status || "unread";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
        STATUS_STYLES[key] || STATUS_STYLES.unread
      }`}
    >
      {key}
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

function MessageDetailModal({ message, onClose, onStatusChange, savingStatus }) {
  const [status, setStatus] = useState(message.status || "unread");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">
              Message
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {message.subject || "Contact message"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {fullName(message)} · {formatDate(message.createdAt)}
            </p>
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

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email
              </p>
              <p className="mt-2 break-all text-sm font-medium text-slate-800">
                {message.email || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Phone
              </p>
              <p className="mt-2 text-sm font-medium text-slate-800">
                {message.phone || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Status
              </p>
              <div className="mt-2">
                <StatusPill status={message.status} />
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Message
            </p>
            <p className="mt-2 whitespace-pre-line rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
              {message.message || "-"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold capitalize text-slate-700 outline-none focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
          >
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              disabled={savingStatus}
              onClick={() => onStatusChange(message, status)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3d42] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingStatus ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              Save status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [savingStatusId, setSavingStatusId] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "All") params.set("status", statusFilter);

      const result = await apiRequest(`/messages?${params.toString()}`);
      setMessages(Array.isArray(result.data) ? result.data : []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err.message || "Could not load messages.");
      setMessages([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchMessages, search.trim() ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchMessages, search]);

  const stats = useMemo(() => {
    const counts = messages.reduce(
      (acc, message) => {
        const status = message.status || "unread";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { unread: 0, read: 0, replied: 0, archived: 0 },
    );

    return {
      total: pagination?.total ?? messages.length,
      unread: counts.unread,
      replied: counts.replied,
      archived: counts.archived,
    };
  }, [messages, pagination]);

  const updateStatus = async (message, nextStatus) => {
    setSavingStatusId(message._id);

    try {
      const result = await apiRequest(`/messages/${message._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      const updated = result.data || { ...message, status: nextStatus };
      setMessages((prev) =>
        prev.map((item) => (item._id === message._id ? updated : item)),
      );
      setSelectedMessage((prev) =>
        prev && prev._id === message._id ? updated : prev,
      );
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Status update failed",
        text: err.message || "Please try again.",
      });
    } finally {
      setSavingStatusId("");
    }
  };

  const handleDelete = async (message) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this message?",
      text: `${message.subject || "This message"} will be removed.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(message._id);
    try {
      await apiRequest(`/messages/${message._id}`, { method: "DELETE" });
      setMessages((prev) => prev.filter((item) => item._id !== message._id));
      if (selectedMessage?._id === message._id) setSelectedMessage(null);
      Swal.fire({
        icon: "success",
        title: "Message deleted",
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
          <h1 className="text-2xl font-bold text-slate-950">Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Triage website messages and keep reply status current.
          </p>
        </div>
        <button
          type="button"
          onClick={fetchMessages}
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={MessageSquare}
          label="Total messages"
          value={loading ? "-" : stats.total}
        />
        <StatCard
          icon={Mail}
          label="Unread"
          value={loading ? "-" : stats.unread}
        />
        <StatCard
          icon={Reply}
          label="Replied"
          value={loading ? "-" : stats.replied}
        />
        <StatCard
          icon={Archive}
          label="Archived"
          value={loading ? "-" : stats.archived}
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
              placeholder="Search sender, phone, subject..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/10"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {["All", ...STATUSES].map((status) => (
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
                {status}
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
                <th className="px-5 py-3">Sender</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Phone</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-sm">Loading messages...</span>
                    </div>
                  </td>
                </tr>
              ) : messages.length ? (
                messages.map((message) => (
                  <tr
                    key={message._id}
                    className="transition hover:bg-[#235056]/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#235056]/10 text-xs font-bold text-[#235056]">
                          {getInitials(message)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {fullName(message)}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {message.email || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="max-w-[260px] truncate text-sm font-medium text-slate-800">
                        {message.subject || "-"}
                      </p>
                      <p className="max-w-[260px] truncate text-xs text-slate-400">
                        {message.message || "-"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={message.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {message.phone || "-"}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedMessage(message)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          disabled={savingStatusId === message._id}
                          onClick={() => updateStatus(message, "replied")}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Mark replied"
                        >
                          {savingStatusId === message._id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Reply size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(message)}
                          disabled={deletingId === message._id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === message._id ? (
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
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                        <MessageSquare size={22} />
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        No messages match the current view.
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
            Showing {messages.length} of {pagination?.total ?? messages.length} messages
          </span>
        </div>
      </div>

      {selectedMessage && (
        <MessageDetailModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={updateStatus}
          savingStatus={savingStatusId === selectedMessage._id}
        />
      )}
    </div>
  );
}
