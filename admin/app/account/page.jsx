"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Contact, Mail, Pencil, Save, ShieldCheck, UserRound, X } from "lucide-react";
import Swal from "sweetalert2";
import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import { ContentLoader, EmptyState } from "@/components/AsyncState";
import { ButtonSpinner } from "@/components/Loadingspinner";
import AvatarPicker from "@/components/AvatarPicker";
import CompanyIdCard from "@/components/CompanyIdCard";

const fieldClass = "mt-1.5 w-full rounded-xl border border-[#0f5960]/20 bg-[#f8fbfa] px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#0f5960] focus:bg-white focus:ring-4 focus:ring-[#0f5960]/10";

const formFromUser = (user) => ({
  name: user?.name || "", email: user?.email || "", username: user?.username || "", phone: user?.phone || "",
  avatar: user?.avatar || "", jobTitle: user?.profile?.jobTitle || "", bio: user?.profile?.bio || "", password: "",
});

function Detail({ label, value, className = "", valueClassName = "" }) {
  return <div className={`rounded-xl border border-[#0f5960]/10 bg-[#f8fbfa] px-4 py-3 ${className}`}><dt className="text-[10px] font-black uppercase tracking-[0.14em] text-[#5d7679]">{label}</dt><dd className={`mt-1 break-words text-sm font-semibold text-[#123f46] ${valueClassName}`}>{value || "No data found."}</dd></div>;
}

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(formFromUser(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [idCardOpen, setIdCardOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest("/me").then((result) => {
      setUser(result.data || null); setForm(formFromUser(result.data));
    }).catch((err) => setError(err.message || "Unable to load account details.")).finally(() => setLoading(false));
  }, []);

  const initials = useMemo(() => (user?.name || "Admin").slice(0, 2).toUpperCase(), [user?.name]);
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const cancelEditing = () => { setForm(formFromUser(user)); setEditing(false); };
  const save = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, username: form.username, phone: form.phone, avatar: form.avatar, profile: { jobTitle: form.jobTitle, bio: form.bio } };
      if (form.password) payload.password = form.password;
      const response = await apiRequest("/me", { method: "PATCH", body: JSON.stringify(payload) });
      setUser(response.data); setForm(formFromUser(response.data)); setEditing(false);
      Swal.fire({ icon: "success", title: "Account updated", text: response.message, timer: 1800, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Could not save changes", text: err.message || "Please try again." });
    } finally { setSaving(false); }
  };

  return <Frame><main className="min-h-full bg-[#edf5f4] px-4 py-6 sm:px-6 lg:px-9 lg:py-8"><div className="mx-auto max-w-5xl">
    <section className="relative mb-6 overflow-hidden rounded-3xl border border-[#0f5960]/20 bg-gradient-to-br from-[#123f46] via-[#0f5960] to-[#1b6870] p-6 text-white shadow-xl shadow-[#0f5960]/15 sm:p-8"><div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#f7c56d]/15 blur-3xl"/><div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#f7d994]">Your profile</p><h1 className="mt-2 text-3xl font-black">My account</h1><p className="mt-2 text-sm text-[#dcebea]">Manage your personal profile, sign-in details and account security.</p></div>{!loading && user && <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setIdCardOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/20"><Contact size={17}/> View ID card</button><button type="button" onClick={() => editing ? cancelEditing() : setEditing(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#f7c56d] px-4 py-2.5 text-sm font-bold text-[#123f46] transition hover:bg-[#ffe09c]">{editing ? <><X size={16}/> Cancel</> : <><Pencil size={16}/> Edit account</>}</button></div>}</div></section>
    {loading ? <div className="rounded-2xl border border-slate-200 bg-white"><ContentLoader label="Loading your account…" /></div> : error ? <div className="rounded-2xl border border-rose-200 bg-rose-50"><EmptyState title="Profile unavailable" message={error}/></div> : !user ? <div className="rounded-2xl bg-white"><EmptyState message="Your account details are not available yet." /></div> : editing ? <form onSubmit={save} className="rounded-3xl border border-[#0f5960]/15 bg-white p-5 shadow-sm sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="rounded-xl bg-[#e7f1f0] p-2.5 text-[#0f5960]"><Pencil size={19}/></span><div><h2 className="font-bold text-[#123f46]">Edit account details</h2><p className="text-xs text-slate-500">Your role and account access are protected and cannot be changed here.</p></div></div><div className="grid grid-cols-1 gap-5 md:grid-cols-2"><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679]">Full name<input required value={form.name} onChange={(e) => setValue("name", e.target.value)} className={fieldClass}/></label><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679]">Email<input required type="email" value={form.email} onChange={(e) => setValue("email", e.target.value)} className={fieldClass}/></label><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679]">Username<input required value={form.username} onChange={(e) => setValue("username", e.target.value)} className={fieldClass}/></label><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679]">Phone<input required value={form.phone} onChange={(e) => setValue("phone", e.target.value)} className={fieldClass}/></label><div className="md:col-span-2"><AvatarPicker label="Profile image" name={form.name} value={form.avatar} onChange={(value) => setValue("avatar", value)}/></div><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679]">Job title<input value={form.jobTitle} onChange={(e) => setValue("jobTitle", e.target.value)} placeholder="e.g. Content Editor" className={fieldClass}/></label><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679]">New password <span className="normal-case font-medium text-slate-400">(optional)</span><input type="password" value={form.password} onChange={(e) => setValue("password", e.target.value)} placeholder="Leave blank to keep current" className={fieldClass}/></label><label className="text-xs font-bold uppercase tracking-wide text-[#5d7679] md:col-span-2">Short bio<textarea value={form.bio} onChange={(e) => setValue("bio", e.target.value)} rows={3} placeholder="Tell your team about your role…" className={fieldClass}/></label></div><div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={cancelEditing} className="rounded-xl border border-[#0f5960]/20 px-4 py-2.5 text-sm font-bold text-[#0f5960] hover:bg-[#e7f1f0]">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0a454b] disabled:opacity-60">{saving ? <ButtonSpinner/> : <Save size={16}/>} Save changes</button></div></form> : <section className="overflow-hidden rounded-3xl border border-[#0f5960]/15 bg-white shadow-sm"><div className="flex flex-col gap-5 border-b border-[#0f5960]/10 bg-[#f8fbfa] p-5 sm:flex-row sm:items-center sm:p-7"><div className="relative shrink-0">{user.avatar ? <img src={user.avatar} alt={`${user.name} avatar`} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#e7f1f0]"/> : <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0f5960] text-2xl font-black text-white">{initials}</div>}<span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-[#f7c56d] p-1.5 text-[#123f46]"><Camera size={13}/></span></div><div className="min-w-0"><h2 className="truncate text-2xl font-black text-[#123f46]">{user.name}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-[#5d7679]"><Mail size={14}/>{user.email}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-[#0f5960]/10 px-2.5 py-1 text-xs font-bold capitalize text-[#0f5960]">{user.role?.replace("_", " ")}</span><span className="rounded-full bg-[#f7c56d]/25 px-2.5 py-1 text-xs font-bold text-[#76500b]">Active account</span></div></div></div><div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:p-7"><Detail label="Account ID" value={user._id || user.id} className="sm:col-span-2" valueClassName="font-mono text-xs"/><Detail label="Username" value={`@${user.username}`}/><Detail label="Phone" value={user.phone}/><Detail label="Job title" value={user.profile?.jobTitle}/><Detail label="Joined" value={formatDate(user.createdAt)}/><Detail label="Last login" value={formatDate(user.lastLoginAt, "No data found.")}/><Detail label="Security" value="Password protected"/></div>{user.profile?.bio && <div className="mx-5 mb-5 rounded-2xl border border-[#0f5960]/10 bg-[#e7f1f0]/60 p-4 sm:mx-7 sm:mb-7"><p className="mb-1 flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#0f5960]"><UserRound size={14}/> About</p><p className="text-sm leading-6 text-[#36595e]">{user.profile.bio}</p></div>}<div className="flex items-center gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-500 sm:px-7"><ShieldCheck size={16} className="text-[#0f5960]"/> Only your own profile details can be edited from this page.</div></section>}
    <CompanyIdCard open={idCardOpen} onClose={() => setIdCardOpen(false)} user={user}/>
  </div></main></Frame>;
}
