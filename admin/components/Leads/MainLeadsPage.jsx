"use client";

import { apiRequest, formatCurrency, formatDate } from "@/components/api";
import {
  Briefcase,
  CalendarDays,
  Download,
  Edit3,
  Eye,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"];
const SOURCES = [
  "Website",
  "LinkedIn",
  "Referral",
  "Cold Email",
  "Inbound",
  "Social Media",
  "Other",
];
const LEAD_TYPES = ["service-popup", "contact-form", "other"];

const STATUS_STYLES = {
  New: "border-blue-200 bg-blue-50 text-blue-700",
  Contacted: "border-amber-200 bg-amber-50 text-amber-700",
  Qualified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Proposal: "border-violet-200 bg-violet-50 text-violet-700",
  Won: "border-teal-200 bg-teal-50 text-teal-700",
  Lost: "border-red-200 bg-red-50 text-red-600",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
  leadType: "service-popup",
  page: "",
  service: "",
  budget: "",
  status: "New",
  source: "Website",
  score: 0,
  dealValue: 0,
  currency: "INR",
  expectedCloseDate: "",
  notes: "",
  lostReason: "",
};

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "LD"
  );
}

function toDateInput(value) {
  if (!value) return "";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

function fieldValue(value, fallback = "") {
  return value === undefined || value === null ? fallback : value;
}

function buildLeadForm(lead = {}) {
  return {
    name: fieldValue(lead.name),
    email: fieldValue(lead.email),
    phone: fieldValue(lead.phone),
    company: fieldValue(lead.company),
    subject: fieldValue(lead.subject),
    message: fieldValue(lead.message),
    leadType: fieldValue(lead.leadType, "service-popup"),
    page: fieldValue(lead.page),
    service: fieldValue(lead.service),
    budget: fieldValue(lead.budget),
    status: fieldValue(lead.status, "New"),
    source: fieldValue(lead.source, "Website"),
    score: fieldValue(lead.score, 0),
    dealValue: fieldValue(lead.dealValue, 0),
    currency: fieldValue(lead.currency, "INR"),
    expectedCloseDate: toDateInput(lead.expectedCloseDate),
    notes: fieldValue(lead.notes),
    lostReason: fieldValue(lead.lostReason),
  };
}

function scoreTone(score) {
  const value = Number(score || 0);
  if (value >= 75) return "bg-emerald-500";
  if (value >= 45) return "bg-amber-400";
  return "bg-red-400";
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[status] || STATUS_STYLES.New
      }`}
    >
      {status || "New"}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#235056]/10 text-[#235056]">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#235056] focus:ring-2 focus:ring-[#235056]/10"
    />
  );
}

function LeadFormModal({
  form,
  isEditing,
  onChange,
  onClose,
  onSubmit,
  saving,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">
              CRM
            </p>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? "Edit lead" : "Add lead"}
            </h2>
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

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <Input
                required
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Client name"
              />
            </Field>
            <Field label="Email">
              <Input
                required
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="name@company.com"
              />
            </Field>
            <Field label="Phone">
              <Input
                required
                value={form.phone}
                onChange={(event) => onChange("phone", event.target.value)}
                placeholder="+91 ..."
              />
            </Field>
            <Field label="Company">
              <Input
                value={form.company}
                onChange={(event) => onChange("company", event.target.value)}
                placeholder="Company name"
              />
            </Field>
            <Field label="Subject">
              <Input
                required
                value={form.subject}
                onChange={(event) => onChange("subject", event.target.value)}
                placeholder="Project inquiry"
              />
            </Field>
            <Field label="Service">
              <Input
                value={form.service}
                onChange={(event) => onChange("service", event.target.value)}
                placeholder="MERN stack development"
              />
            </Field>
            <Field label="Lead type">
              <Select
                value={form.leadType}
                onChange={(event) => onChange("leadType", event.target.value)}
              >
                {LEAD_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Source">
              <Select
                value={form.source}
                onChange={(event) => onChange("source", event.target.value)}
              >
                {SOURCES.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(event) => onChange("status", event.target.value)}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Budget">
              <Input
                value={form.budget}
                onChange={(event) => onChange("budget", event.target.value)}
                placeholder="₹50k - ₹1L"
              />
            </Field>
            <Field label="Score">
              <Input
                min="0"
                max="100"
                type="number"
                value={form.score}
                onChange={(event) => onChange("score", event.target.value)}
              />
            </Field>
            <Field label="Deal value">
              <Input
                min="0"
                type="number"
                value={form.dealValue}
                onChange={(event) => onChange("dealValue", event.target.value)}
              />
            </Field>
            <Field label="Expected close">
              <Input
                type="date"
                value={form.expectedCloseDate}
                onChange={(event) =>
                  onChange("expectedCloseDate", event.target.value)
                }
              />
            </Field>
            <Field label="Page">
              <Input
                value={form.page}
                onChange={(event) => onChange("page", event.target.value)}
                placeholder="/services"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Message">
                <Textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(event) => onChange("message", event.target.value)}
                  placeholder="Client message"
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Internal notes">
                <Textarea
                  rows={3}
                  value={form.notes}
                  onChange={(event) => onChange("notes", event.target.value)}
                  placeholder="Next step, call notes, proposal details..."
                />
              </Field>
            </div>
            {form.status === "Lost" && (
              <div className="md:col-span-2">
                <Field label="Lost reason">
                  <Input
                    value={form.lostReason}
                    onChange={(event) =>
                      onChange("lostReason", event.target.value)
                    }
                    placeholder="Budget, timeline, no response..."
                  />
                </Field>
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onSubmit}
            className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3d42] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save lead"}
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">
              Lead details
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">
              {lead.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusPill status={lead.status} />
              {lead.service && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {lead.service}
                </span>
              )}
            </div>
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

        <div className="grid gap-4 px-6 py-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Contact
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-slate-400" />
                {lead.email || "-"}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400" />
                {lead.phone || "-"}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase size={15} className="text-slate-400" />
                {lead.company || "-"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pipeline
            </p>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <p>Source: {lead.source || "-"}</p>
              <p>Budget: {lead.budget || "-"}</p>
              <p>Deal: {formatCurrency(lead.dealValue, lead.currency)}</p>
              <p>Close date: {formatDate(lead.expectedCloseDate)}</p>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-slate-900">
              {lead.subject || "Inquiry"}
            </p>
            <p className="mt-2 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
              {lead.message || "-"}
            </p>
          </div>

          {lead.notes && (
            <div className="md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Notes
              </p>
              <p className="mt-2 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                {lead.notes}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onEdit(lead)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1a3d42]"
          >
            <Edit3 size={15} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MainLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      if (statusFilter !== "All") params.set("status", statusFilter);

      const result = await apiRequest(`/leads?${params.toString()}`);
      setLeads(Array.isArray(result.data) ? result.data : []);
      setPagination(result.pagination || null);
    } catch (err) {
      setError(err.message || "Could not load leads.");
      setLeads([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const timeout = setTimeout(fetchLeads, search.trim() ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [fetchLeads, search]);

  const stats = useMemo(() => {
    const total = pagination?.total ?? leads.length;
    const qualified = leads.filter((lead) =>
      ["Qualified", "Proposal", "Won"].includes(lead.status),
    ).length;
    const openValue = leads.reduce(
      (sum, lead) =>
        ["New", "Contacted", "Qualified", "Proposal"].includes(lead.status)
          ? sum + Number(lead.dealValue || 0)
          : sum,
      0,
    );
    const won = leads.filter((lead) => lead.status === "Won").length;

    return { total, qualified, openValue, won };
  }, [leads, pagination]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreate = () => {
    setEditingLead(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (lead) => {
    setSelectedLead(null);
    setEditingLead(lead);
    setForm(buildLeadForm(lead));
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingLead(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    setSaving(true);

    try {
      const payload = {
        ...form,
        score: Number(form.score || 0),
        dealValue: Number(form.dealValue || 0),
        expectedCloseDate: form.expectedCloseDate || undefined,
      };

      const result = editingLead
        ? await apiRequest(`/leads/${editingLead._id}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          })
        : await apiRequest("/leads", {
            method: "POST",
            body: JSON.stringify(payload),
          });

      if (editingLead && result.data) {
        setLeads((prev) =>
          prev.map((lead) => (lead._id === result.data._id ? result.data : lead)),
        );
      } else {
        await fetchLeads();
      }

      closeForm();
      Swal.fire({
        icon: "success",
        title: editingLead ? "Lead updated" : "Lead created",
        timer: 1400,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Unable to save lead",
        text: err.message || "Please try again.",
        confirmButtonColor: "#235056",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lead) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete this lead?",
      text: `${lead.name || "This lead"} will be removed from the CRM.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    setDeletingId(lead._id);
    try {
      await apiRequest(`/leads/${lead._id}`, { method: "DELETE" });
      setLeads((prev) => prev.filter((item) => item._id !== lead._id));
      Swal.fire({
        icon: "success",
        title: "Lead deleted",
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
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Source",
      "Service",
      "Budget",
      "Deal Value",
      "Created",
    ];
    const rows = leads.map((lead) => [
      lead.name,
      lead.email,
      lead.phone,
      lead.company,
      lead.status,
      lead.source,
      lead.service,
      lead.budget,
      lead.dealValue,
      formatDate(lead.createdAt),
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
    link.download = "kraviona-leads.csv";
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
          <h1 className="text-2xl font-bold text-slate-950">Contact Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            Review inquiries, update pipeline status, and track deal value.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchLeads}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!leads.length}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} />
            Export
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a3d42]"
          >
            <Plus size={16} />
            Add lead
          </button>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total leads"
          value={loading ? "-" : stats.total}
          hint="From current API filter"
        />
        <StatCard
          icon={TrendingUp}
          label="Qualified pipeline"
          value={loading ? "-" : stats.qualified}
          hint="Qualified, proposal, won"
        />
        <StatCard
          icon={Briefcase}
          label="Open deal value"
          value={loading ? "-" : formatCurrency(stats.openValue)}
          hint="Active opportunities"
        />
        <StatCard
          icon={CalendarDays}
          label="Won"
          value={loading ? "-" : stats.won}
          hint="Closed successfully"
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
              placeholder="Search name, email, phone, service..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#235056] focus:bg-white focus:ring-2 focus:ring-[#235056]/10"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {["All", ...STATUSES].map((status) => (
              <button
                type="button"
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
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
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Source</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Deal</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 size={24} className="animate-spin" />
                      <span className="text-sm">Loading leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length ? (
                leads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="group transition hover:bg-[#235056]/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#235056]/10 text-xs font-bold text-[#235056]">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {lead.name || "Unnamed lead"}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {lead.email || lead.phone || "-"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill status={lead.status} />
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {lead.source || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                        {lead.service || lead.subject || "-"}
                      </p>
                      {lead.budget && (
                        <p className="text-xs text-slate-400">{lead.budget}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${scoreTone(lead.score)}`}
                            style={{ width: `${Number(lead.score || 0)}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-500">
                          {Number(lead.score || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {formatCurrency(lead.dealValue, lead.currency)}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-400">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedLead(lead)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(lead)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-emerald-50 hover:text-emerald-600"
                          title="Edit"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(lead)}
                          disabled={deletingId === lead._id}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Delete"
                        >
                          {deletingId === lead._id ? (
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
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-300">
                        <Users size={22} />
                      </div>
                      <p className="text-sm font-medium text-slate-500">
                        {search || statusFilter !== "All"
                          ? "No leads match the current filters."
                          : "No leads found yet."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
          <span className="text-xs text-slate-400">
            Showing {leads.length} of {pagination?.total ?? leads.length} leads
          </span>
        </div>
      </div>

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={openEdit}
        />
      )}

      {formOpen && (
        <LeadFormModal
          form={form}
          isEditing={Boolean(editingLead)}
          onChange={handleFormChange}
          onClose={closeForm}
          onSubmit={handleSubmit}
          saving={saving}
        />
      )}
    </div>
  );
}
