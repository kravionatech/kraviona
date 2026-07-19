"use client";

import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import {
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

const ROLES = ["super_admin", "admin", "editor", "viewer", "user"];
const STATUS_OPTIONS = ["all", "active", "inactive"];

const EMPTY_USER = {
  name: "",
  email: "",
  username: "",
  phone: "",
  password: "",
  role: "viewer",
  avatar: "",
  isActive: true,
  isVerified: true,
  jobTitle: "",
  bio: "",
};

const ROLE_STYLES = {
  super_admin: "border-rose-200 bg-rose-50 text-rose-700",
  admin: "border-violet-200 bg-violet-50 text-violet-700",
  editor: "border-blue-200 bg-blue-50 text-blue-700",
  viewer: "border-slate-200 bg-slate-50 text-slate-700",
  user: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function initials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "US"
  );
}

function buildUserForm(user = {}) {
  return {
    name: user.name || "",
    email: user.email || "",
    username: user.username || "",
    phone: user.phone || "",
    password: "",
    role: user.role || "viewer",
    avatar: user.avatar || "",
    isActive: user.isActive ?? true,
    isVerified: user.isVerified ?? true,
    jobTitle: user.profile?.jobTitle || "",
    bio: user.profile?.bio || "",
  };
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

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
        ROLE_STYLES[role] || ROLE_STYLES.user
      }`}
    >
      {(role || "user").replace("_", " ")}
    </span>
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

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        checked
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-600"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          checked ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
      {label}
    </button>
  );
}

function UserModal({ form, isEditing, saving, onChange, onClose, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">
              Admin Access
            </p>
            <h2 className="text-lg font-bold text-slate-950">
              {isEditing ? "Edit user" : "Create user"}
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
                placeholder="Amar Kumar"
                required
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(event) => onChange("email", event.target.value)}
                placeholder="admin@example.com"
                required
              />
            </Field>
            <Field label="Username">
              <Input
                value={form.username}
                onChange={(event) => onChange("username", event.target.value)}
                placeholder="amar_admin"
                required
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(event) => onChange("phone", event.target.value)}
                placeholder="+91 9608553167"
                required
              />
            </Field>
            <Field label={isEditing ? "New password" : "Password"}>
              <Input
                type="password"
                value={form.password}
                onChange={(event) => onChange("password", event.target.value)}
                placeholder={isEditing ? "Leave blank to keep old" : "Admin@1234"}
                required={!isEditing}
              />
            </Field>
            <Field label="Role">
              <Select
                value={form.role}
                onChange={(event) => onChange("role", event.target.value)}
              >
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.replace("_", " ")}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Job title">
              <Input
                value={form.jobTitle}
                onChange={(event) => onChange("jobTitle", event.target.value)}
                placeholder="Content Manager"
              />
            </Field>
            <Field label="Avatar URL">
              <Input
                value={form.avatar}
                onChange={(event) => onChange("avatar", event.target.value)}
                placeholder="https://..."
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Bio">
                <Textarea
                  rows={3}
                  value={form.bio}
                  onChange={(event) => onChange("bio", event.target.value)}
                  placeholder="Short profile note"
                />
              </Field>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Toggle
              checked={form.isActive}
              onChange={(value) => onChange("isActive", value)}
              label="Active account"
            />
            <Toggle
              checked={form.isVerified}
              onChange={(value) => onChange("isVerified", value)}
              label="Verified"
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
              {isEditing ? "Save user" : "Create user"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0 });
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(EMPTY_USER);
  const [modalOpen, setModalOpen] = useState(false);

  const countMap = useMemo(
    () =>
      counts.reduce((acc, item) => {
        acc[item.label] = item.value;
        return acc;
      }, {}),
    [counts],
  );

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ limit: "80" });
      if (search.trim()) params.set("search", search.trim());
      if (role !== "all") params.set("role", role);
      if (status !== "all") params.set("status", status);

      const response = await apiRequest(`/users?${params.toString()}`);
      setUsers(Array.isArray(response.data) ? response.data : []);
      setCounts(Array.isArray(response.counts) ? response.counts : []);
      setPagination(response.pagination || { total: 0 });
    } catch (err) {
      setError(err.message || "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, [role, search, status]);

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 250);
    return () => clearTimeout(timeout);
  }, [fetchUsers]);

  const openCreate = () => {
    setEditingUser(null);
    setForm({ ...EMPTY_USER });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditingUser(user);
    setForm(buildUserForm(user));
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingUser(null);
    setForm({ ...EMPTY_USER });
    setModalOpen(false);
  };

  const changeForm = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submitUser = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name,
        email: form.email,
        username: form.username,
        phone: form.phone,
        role: form.role,
        avatar: form.avatar,
        isActive: form.isActive,
        isVerified: form.isVerified,
        profile: {
          jobTitle: form.jobTitle,
          bio: form.bio,
        },
      };

      if (form.password) payload.password = form.password;

      if (editingUser) {
        const response = await apiRequest(`/users/${editingUser._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setUsers((current) =>
          current.map((user) =>
            user._id === editingUser._id ? response.data || user : user,
          ),
        );
      } else {
        const response = await apiRequest("/users", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setUsers((current) => [response.data, ...current].filter(Boolean));
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    try {
      setError("");
      await apiRequest(`/users/${user._id}`, { method: "DELETE" });
      setUsers((current) => current.filter((item) => item._id !== user._id));
      fetchUsers();
    } catch (err) {
      setError(err.message || "Unable to delete user");
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
            <h1 className="text-2xl font-bold text-slate-950">Users & Admins</h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage admin panel users, roles, verification, and access status.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={fetchUsers}
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
              Add User
            </button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard label="Total" value={pagination.total || 0} icon={Users} />
          <StatCard
            label="Admins"
            value={(countMap.admin || 0) + (countMap.super_admin || 0)}
            icon={ShieldCheck}
            tone="text-violet-600"
          />
          <StatCard
            label="Editors"
            value={countMap.editor || 0}
            icon={Edit3}
            tone="text-blue-600"
          />
          <StatCard
            label="Viewers"
            value={countMap.viewer || 0}
            icon={UserCheck}
            tone="text-emerald-600"
          />
        </div>

        <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", ...ROLES].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold capitalize transition ${
                    role === item
                      ? "border-[#d26c51] bg-[#d26c51] text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                {STATUS_OPTIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <label className="relative block sm:w-80">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search users..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#d26c51] focus:bg-white"
                />
              </label>
            </div>
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
              Loading users...
            </div>
          ) : users.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
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
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#235056] text-sm font-bold text-white">
                            {initials(user.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-950">{user.name}</p>
                            <p className="truncate text-xs text-slate-500">
                              {user.email} | @{user.username}
                            </p>
                            {user.profile?.jobTitle ? (
                              <p className="mt-1 text-xs text-slate-400">
                                {user.profile.jobTitle}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5 text-xs font-semibold">
                          <span
                            className={
                              user.isActive ? "text-emerald-600" : "text-rose-600"
                            }
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                          <span
                            className={
                              user.isVerified ? "text-blue-600" : "text-amber-600"
                            }
                          >
                            {user.isVerified ? "Verified" : "Unverified"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                            aria-label="Edit user"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteUser(user)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                            aria-label="Delete user"
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
              No users found.
            </div>
          )}
        </div>

        {modalOpen && (
          <UserModal
            form={form}
            isEditing={Boolean(editingUser)}
            saving={saving}
            onChange={changeForm}
            onClose={closeModal}
            onSubmit={submitUser}
          />
        )}
      </div>
    </Frame>
  );
}
