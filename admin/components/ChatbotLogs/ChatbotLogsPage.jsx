"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bot,
  User,
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  ShieldAlert,
  MessageSquare,
  Globe,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { apiRequest } from "@/components/api";
import Swal from "sweetalert2";

export default function ChatbotLogsPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalQueries: 0, todayQueries: 0, uniqueIps: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [expandedLogId, setExpandedLogId] = useState(null);

  const fetchLogs = useCallback(async (pageToLoad = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pageToLoad,
        limit: 15,
        search: search.trim(),
        responseType: selectedType,
      });

      const res = await apiRequest(`admin/chatbot/logs?${queryParams.toString()}`);
      if (res.success) {
        setLogs(res.data || []);
        setPagination(res.pagination || { page: 1, limit: 15, total: 0, totalPages: 1 });
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load chatbot logs:", err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedType]);

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const handleDeleteLog = async (id) => {
    const result = await Swal.fire({
      title: "Delete this chat log?",
      text: "This record will be permanently removed from database.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d85e3d",
      cancelButtonColor: "#5c7a82",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`admin/chatbot/logs/${id}`, { method: "DELETE" });
        setLogs((prev) => prev.filter((item) => item._id !== id));
        Swal.fire("Deleted!", "Log record removed.", "success");
      } catch (err) {
        Swal.fire("Error", err.message || "Failed to delete", "error");
      }
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case "greeting":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> Greeting
          </span>
        );
      case "restricted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
            <ShieldAlert className="w-3 h-3" /> Restricted
          </span>
        );
      case "unmatched":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            Unmatched
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-[#0f5960] border border-teal-200">
            <Bot className="w-3 h-3" /> Factual RAG
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bot className="w-7 h-7 text-[#0f5960]" />
            AI Chatbot Query Logs
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time records of visitor questions, client IP addresses, AI responses, and cited pages.
          </p>
        </div>

        <button
          onClick={() => fetchLogs(pagination.page)}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Queries</span>
            <span className="rounded-lg bg-teal-50 p-2 text-[#0f5960]">
              <MessageSquare className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{stats.totalQueries}</div>
          <p className="mt-1 text-xs text-slate-500">All queries recorded in database</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Queries Today</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Clock className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{stats.todayQueries}</div>
          <p className="mt-1 text-xs text-slate-500">Visitor queries since midnight</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unique IPs</span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Globe className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">{stats.uniqueIps}</div>
          <p className="mt-1 text-xs text-slate-500">Distinct visitor client IP addresses</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by query, reply, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f5960]/30 focus:border-[#0f5960] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0f5960]/30 focus:border-[#0f5960]"
          >
            <option value="all">All Response Types</option>
            <option value="local-rag">Factual RAG</option>
            <option value="greeting">Greetings</option>
            <option value="restricted">Restricted / Blocked</option>
            <option value="unmatched">Unmatched</option>
          </select>
        </div>
      </div>

      {/* Table & List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading && logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <RefreshCw className="mx-auto w-6 h-6 animate-spin text-[#0f5960]" />
            <p className="mt-2 text-sm font-medium">Loading chatbot interaction logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Bot className="mx-auto w-10 h-10 text-slate-300" />
            <p className="mt-2 text-base font-semibold text-slate-700">No Chatbot Logs Found</p>
            <p className="text-sm text-slate-400">When visitors use the chatbot on your site, logs will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => {
              const isExpanded = expandedLogId === log._id;
              const formattedTime = new Date(log.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <div key={log._id} className="p-5 hover:bg-slate-50/70 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        IP: {log.ip || "unknown"}
                      </span>
                      {getTypeBadge(log.responseType)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formattedTime}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteLog(log._id)}
                      title="Delete this record"
                      className="self-end sm:self-start p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Query & Reply content */}
                  <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* User Query */}
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                        <User className="w-3.5 h-3.5 text-[#0f5960]" />
                        User Query
                      </div>
                      <p className="text-sm font-medium text-slate-900 break-words">{log.query}</p>
                    </div>

                    {/* AI Response */}
                    <div className="rounded-xl bg-teal-50/40 p-3.5 border border-teal-900/10">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0f5960] uppercase tracking-wider mb-1.5">
                        <Bot className="w-3.5 h-3.5 text-[#0f5960]" />
                        AI Response
                      </div>
                      <p className={`text-sm text-slate-800 break-words whitespace-pre-line ${!isExpanded && "line-clamp-3"}`}>
                        {log.reply}
                      </p>
                      {log.reply && log.reply.length > 180 && (
                        <button
                          onClick={() => setExpandedLogId(isExpanded ? null : log._id)}
                          className="mt-1.5 text-xs font-semibold text-[#0f5960] hover:text-[#0a454b] underline"
                        >
                          {isExpanded ? "Show Less" : "Show Full Response"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Sources Cited */}
                  {log.sources && log.sources.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-slate-400 font-medium">Cited Pages:</span>
                      {log.sources.map((src, i) => (
                        <a
                          key={i}
                          href={`https://kraviona.com${src.url}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#0f5960] bg-white border border-teal-200 px-2 py-0.5 rounded hover:bg-teal-50 transition-colors"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 sm:px-6">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.page <= 1 || loading}
                onClick={() => fetchLogs(pagination.page - 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages || loading}
                onClick={() => fetchLogs(pagination.page + 1)}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
