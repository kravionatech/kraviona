"use client";

import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import {
  Briefcase,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Pagination from "@/components/Pagination";
import AvatarPicker from "@/components/AvatarPicker";
import DepartmentSelect from "@/components/DepartmentSelect";

const STATUS_OPTIONS = ["all", "active", "inactive"];

const EMPTY_MEMBER = {
  name: "",
  email: "",
  phone: "",
  designation: "",
  department: "General",
  bio: "",
  avatar: "",
  skills: "",
  order: 0,
  isFeatured: false,
  status: "active",
  socialLinks: "",
};

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "TM"
  );
}

function MemberAvatar({ member, size = "md" }) {
  const [failedSource, setFailedSource] = useState("");
  const source = member.avatar;
  const classes = size === "lg" ? "h-16 w-16" : "h-11 w-11";

  if (source && failedSource !== source) {
    return <img src={source} alt={`${member.name} profile`} onError={() => setFailedSource(source)} className={`${classes} shrink-0 rounded-full border-2 border-[#e7f1f0] object-cover`} />;
  }

  return <span className={`flex ${classes} shrink-0 items-center justify-center rounded-full bg-[#0f5960] text-sm font-bold text-white`}>{initials(member.name)}</span>;
}

function buildMemberForm(member = {}) {
  return {
    name: member.name || "",
    email: member.email || "",
    phone: member.phone || "",
    designation: member.designation || "",
    department: member.department || "General",
    bio: member.bio || "",
    avatar: member.avatar || "",
    skills: Array.isArray(member.skills) ? member.skills.join(", ") : "",
    order: member.order || 0,
    isFeatured: member.isFeatured || false,
    status: member.status || "active",
    socialLinks: Array.isArray(member.socialLinks)
      ? member.socialLinks.map((link) => `${link.name || "Social"} | ${link.url || ""}`).join("\n")
      : "",
  };
}

function parseSocialLinks(value = "") {
  return String(value)
    .split("\n")
    .map((line) => line.split("|").map((part) => part.trim()))
    .filter(([, url]) => Boolean(url))
    .map(([name, url]) => ({ name: name || "Social", url }));
}

function StatCard({ label, value, icon: Icon, tone = "text-[#235056]" }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <Icon className={tone} size={18} />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
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

function FeaturedToggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        checked
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
      aria-pressed={checked}
    >
      <Star size={15} />
      Featured
    </button>
  );
}

function TeamModal({ form, departments, isEditing, saving, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">
              Team Directory
            </p>
            <h2 className="text-lg font-bold text-slate-950">
              {isEditing ? "Edit team member" : "Add team member"}
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
                value={form.name}
                onChange={(event) => onChange("name", event.target.value)}
                placeholder="Team member name"
                required
              />
            </Field>
            <Field label="Designation">
              <Input
                value={form.designation}
                onChange={(event) => onChange("designation", event.target.value)}
                placeholder="MERN Stack Developer"
                required
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="member@example.com"
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(event) => onChange("phone", event.target.value)}
                placeholder="+91..."
              />
            </Field>
            <Field label="Department">
              <DepartmentSelect value={form.department} departments={departments} onChange={(value) => onChange("department", value)} required />
            </Field>
            {/* Team profiles are independent from user accounts. */}
            {/*
            <Field label="Linked user account">
              <Select value={form.userID} onChange={(event) => { const account = accounts.find((item) => item._id === event.target.value); onChange("userID", event.target.value); onChange("role", account?.role || ""); onChange("isVerified", account?.isVerified ?? false); if (account) onChange("department", account.profile?.department || account.teamMember?.department || form.department); }}>
                <option value="">No linked user account</option>
                {accounts.map((account) => <option key={account._id} value={account._id}>{account.name} · {account.email} ({account.role.replace("_", " ")})</option>)}
              </Select>
              <p className="mt-1.5 text-xs text-slate-500">Link a user to verify their Kraviona Team ID.</p>
            </Field>
            <Field label="Linked account role">
              <Select disabled={!form.userID} value={form.role} onChange={(event) => onChange("role", event.target.value)}>
                <option value="">Select role</option>
                {USER_ROLES.map((role) => <option key={role} value={role}>{role.replace("_", " ")}</option>)}
              </Select>
              <p className="mt-1.5 text-xs text-slate-500">Saving this form updates the linked account role.</p>
            </Field>
            <label className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm font-semibold ${form.userID ? "border-slate-200 bg-slate-50 text-slate-700" : "border-slate-100 bg-slate-50 text-slate-400"}`}>
              <input
                type="checkbox"
                checked={form.isVerified}
                disabled={!form.userID}
                onChange={(event) => onChange("isVerified", event.target.checked)}
                className="h-4 w-4 accent-[#0f5960]"
              />
              Verified linked account
            </label>
            */}
            <Field label="Display order">
              <Input
                type="number"
                value={form.order}
                onChange={(event) => onChange("order", event.target.value)}
                min="0"
              />
            </Field>
            <AvatarPicker label="Profile image" name={form.name} value={form.avatar} onChange={(value) => onChange("avatar", value)} />
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(event) => onChange("status", event.target.value)}
              >
                <option value="active">active</option>
                <option value="inactive">inactive</option>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Skills">
                <Input
                  value={form.skills}
                  onChange={(event) => onChange("skills", event.target.value)}
                  placeholder="React, Node.js, SEO"
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Bio">
                <Textarea
                  rows={4}
                  value={form.bio}
                  onChange={(event) => onChange("bio", event.target.value)}
                  placeholder="Short team profile"
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Social links">
                <Textarea
                  rows={3}
                  value={form.socialLinks}
                  onChange={(event) => onChange("socialLinks", event.target.value)}
                  placeholder={"LinkedIn | https://linkedin.com/in/name\nWebsite | https://example.com"}
                />
              </Field>
            </div>
          </div>

          <div className="mt-5">
            <FeaturedToggle
              checked={form.isFeatured}
              onChange={(value) => onChange("isFeatured", value)}
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d26c51] disabled:opacity-60"
            >
              {saving && <Loader2 className="animate-spin" size={16} />}
              {isEditing ? "Save member" : "Add member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [counts, setCounts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState(EMPTY_MEMBER);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const countMap = useMemo(
    () =>
      counts.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {}),
    [counts],
  );

  const featuredCount = useMemo(
    () => members.filter((member) => member.isFeatured).length,
    [members],
  );

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) params.set("search", search.trim());
      if (status !== "all") params.set("status", status);

      const response = await apiRequest(`/team?${params.toString()}`);
      setMembers(Array.isArray(response.data) ? response.data : []);
      setCounts(Array.isArray(response.counts) ? response.counts : []);
      setDepartments(Array.isArray(response.departments) ? response.departments : []);
      setPagination(response.pagination || { total: 0 });
    } catch (err) {
      setError(err.message || "Unable to load team members");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeout = setTimeout(fetchMembers, 250);
    return () => clearTimeout(timeout);
  }, [fetchMembers]);

  const openCreate = () => {
    setEditingMember(null);
    setForm({ ...EMPTY_MEMBER });
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm(buildMemberForm(member));
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingMember(null);
    setForm({ ...EMPTY_MEMBER });
    setModalOpen(false);
  };

  const changeForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const buildPayload = () => ({
    name: form.name,
    email: form.email,
    phone: form.phone,
    designation: form.designation,
    department: form.department,
    bio: form.bio,
    avatar: form.avatar,
    skills: form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),
    order: Number(form.order || 0),
    isFeatured: form.isFeatured,
    status: form.status,
    socialLinks: parseSocialLinks(form.socialLinks),
  });

  const submitMember = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      if (editingMember) {
        const response = await apiRequest(`/team/${editingMember._id}`, {
          method: "PATCH",
          body: JSON.stringify(buildPayload()),
        });
        setMembers((current) =>
          current.map((member) =>
            member._id === editingMember._id ? response.data || member : member,
          ),
        );
      } else {
        const response = await apiRequest("/team", {
          method: "POST",
          body: JSON.stringify(buildPayload()),
        });
        setMembers((current) => [response.data, ...current].filter(Boolean));
      }

      closeModal();
      fetchMembers();
    } catch (err) {
      setError(err.message || "Unable to save team member");
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (member) => {
    if (!window.confirm(`Delete ${member.name}?`)) return;

    try {
      setError("");
      await apiRequest(`/team/${member._id}`, { method: "DELETE" });
      setMembers((current) => current.filter((item) => item._id !== member._id));
      fetchMembers();
    } catch (err) {
      setError(err.message || "Unable to delete team member");
    }
  };

  return (
    <Frame>
      <div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#d26c51]">
              Company & Team
            </p>
            <h1 className="text-2xl font-bold text-slate-950">Team Members</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage public team profiles, departments, ordering, and featured members.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchMembers}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-[#235056] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d26c51]"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total" value={pagination.total || 0} icon={Users} />
          <StatCard
            label="Active"
            value={countMap.active || 0}
            icon={UserRound}
            tone="text-emerald-600"
          />
          <StatCard
            label="Featured"
            value={featuredCount}
            icon={Star}
            tone="text-amber-600"
          />
          <StatCard
            label="Inactive"
            value={countMap.inactive || 0}
            icon={Briefcase}
            tone="text-slate-600"
          />
        </div>

        <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setStatus(item);
                    setPage(1);
                  }}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
                    status === item
                      ? "border-[#d26c51] bg-[#d26c51] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <label className="relative block w-full lg:w-80">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search team..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#d26c51] focus:bg-white"
              />
            </label>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-[320px] items-center justify-center gap-3 text-sm font-semibold text-slate-500">
              <Loader2 className="animate-spin" size={18} />
              Loading team...
            </div>
          ) : members.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Member
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Skills
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Created
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((member) => (
                    <tr key={member._id} className="align-top">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <MemberAvatar member={member} />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-slate-950">
                                {member.name}
                              </p>
                              {member.isFeatured ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">
                                  <Star size={11} />
                                  Featured
                                </span>
                              ) : null}
                            </div>
                            <p className="text-xs text-slate-500">
                              {member.designation}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {member.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700">
                        {member.department || "General"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex max-w-xs flex-wrap gap-1.5">
                          {(member.skills || []).slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                          {!member.skills?.length ? (
                            <span className="text-xs text-slate-400">No skills</span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
                            member.status === "active"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-slate-50 text-slate-600"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(member.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(member)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                            aria-label="Edit team member"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMember(member)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                            aria-label="Delete team member"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center text-sm font-medium text-slate-500">
              No team members found.
            </div>
          )}
          <Pagination
            page={pagination.page || page}
            totalPages={pagination.totalPages || 1}
            total={pagination.total || 0}
            limit={pagination.limit || 20}
            itemLabel="team members"
            onPageChange={setPage}
          />
        </div>

        {modalOpen && (
          <TeamModal
            form={form}
            departments={departments}
            isEditing={Boolean(editingMember)}
            saving={saving}
            onChange={changeForm}
            onClose={closeModal}
            onSubmit={submitMember}
          />
        )}
      </div>
    </Frame>
  );
}
