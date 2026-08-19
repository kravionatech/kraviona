"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Edit3,
  ExternalLink,
  Loader2,
  MapPin,
  Plus,
  RefreshCw,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import Frame from "@/components/Frame/Frame";
import Pagination from "@/components/Pagination";
import { ContentLoader, EmptyState } from "@/components/AsyncState";
import { apiRequest, formatDate } from "@/components/api";

const STATUSES = ["draft", "published", "paused", "closed", "archived"];
const EMPLOYMENT_TYPES = [
  "full-time",
  "part-time",
  "contract",
  "internship",
  "temporary",
  "freelance",
];
const WORKPLACE_TYPES = ["on-site", "hybrid", "remote"];
const EXPERIENCE_LEVELS = [
  "entry",
  "junior",
  "mid",
  "senior",
  "lead",
  "executive",
];

const freshCareer = () => ({
  jobTitle: "",
  slug: "",
  summary: "",
  content: "",
  department: "Engineering",
  employmentType: "full-time",
  workplaceType: "on-site",
  location: { country: "India", state: "", city: "", address: "", postalCode: "" },
  experience: { minimumYears: 0, maximumYears: "", level: "mid" },
  compensation: {
    minimum: "",
    maximum: "",
    currency: "INR",
    period: "year",
    isDisclosed: false,
    notes: "",
  },
  responsibilities: "",
  requirements: "",
  preferredQualifications: "",
  skills: "",
  benefits: "",
  openings: 1,
  application: { email: "", url: "", deadline: "", instructions: "" },
  status: "draft",
  isFeatured: false,
  sortOrder: 0,
  seo: { metaTitle: "", metaDescription: "", keywords: "", canonicalUrl: "", noIndex: false },
});

const joinLines = (value) => (Array.isArray(value) ? value.join("\n") : "");
const splitLines = (value) =>
  [...new Set(String(value || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean))];
const dateInput = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

function prepareCareer(career) {
  const base = freshCareer();
  if (!career) return base;
  return {
    ...base,
    ...career,
    location: { ...base.location, ...(career.location || {}) },
    experience: { ...base.experience, ...(career.experience || {}) },
    compensation: { ...base.compensation, ...(career.compensation || {}) },
    application: {
      ...base.application,
      ...(career.application || {}),
      deadline: dateInput(career.application?.deadline),
    },
    seo: { ...base.seo, ...(career.seo || {}), keywords: (career.seo?.keywords || []).join(", ") },
    responsibilities: joinLines(career.responsibilities),
    requirements: joinLines(career.requirements),
    preferredQualifications: joinLines(career.preferredQualifications),
    skills: joinLines(career.skills),
    benefits: joinLines(career.benefits),
  };
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/10";

function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
        {label}
        {hint ? <span className="normal-case font-medium tracking-normal text-slate-400">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

const Input = (props) => <input {...props} className={inputClass} />;
const Select = (props) => <select {...props} className={inputClass} />;
const Textarea = (props) => (
  <textarea {...props} className={`${inputClass} resize-y`} />
);

const TABS = [
  ["basics", "Job basics"],
  ["description", "Description"],
  ["offer", "Location & offer"],
  ["application", "Application & SEO"],
];

function CareerForm({ career, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => prepareCareer(career));
  const [tab, setTab] = useState("basics");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setNested = (group, key, value) =>
    setForm((current) => ({
      ...current,
      [group]: { ...current[group], [key]: value },
    }));

  const submit = (event) => {
    event.preventDefault();
    onSave({
      ...form,
      responsibilities: splitLines(form.responsibilities),
      requirements: splitLines(form.requirements),
      preferredQualifications: splitLines(form.preferredQualifications),
      skills: splitLines(form.skills),
      benefits: splitLines(form.benefits),
      openings: Number(form.openings),
      sortOrder: Number(form.sortOrder),
      experience: {
        ...form.experience,
        minimumYears: Number(form.experience.minimumYears || 0),
        maximumYears:
          form.experience.maximumYears === ""
            ? null
            : Number(form.experience.maximumYears),
      },
      compensation: {
        ...form.compensation,
        minimum: form.compensation.minimum === "" ? null : Number(form.compensation.minimum),
        maximum: form.compensation.maximum === "" ? null : Number(form.compensation.maximum),
      },
      seo: { ...form.seo, keywords: splitLines(form.seo.keywords) },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/55 p-2 sm:p-4">
      <form onSubmit={submit} className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d26c51]">Recruitment CMS</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">
              {career?._id ? `Edit ${career.jobTitle}` : "Create career opening"}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close career form" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
            <X />
          </button>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          {TABS.map(([value, label]) => (
            <button key={value} type="button" onClick={() => setTab(value)} className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-bold ${tab === value ? "bg-[#0f5960] text-white" : "bg-white text-slate-600 hover:bg-[#e7f1f0]"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {tab === "basics" ? (
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Job title"><Input value={form.jobTitle} onChange={(event) => set("jobTitle", event.target.value)} required minLength={3} maxLength={120} /></Field>
              <Field label="URL slug" hint="Generated when empty"><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} placeholder="senior-mern-developer" /></Field>
              <Field label="Department"><Input value={form.department} onChange={(event) => set("department", event.target.value)} required /></Field>
              <Field label="Open positions"><Input type="number" min="1" value={form.openings} onChange={(event) => set("openings", event.target.value)} required /></Field>
              <Field label="Employment type"><Select value={form.employmentType} onChange={(event) => set("employmentType", event.target.value)}>{EMPLOYMENT_TYPES.map((value) => <option key={value}>{value}</option>)}</Select></Field>
              <Field label="Workplace type"><Select value={form.workplaceType} onChange={(event) => set("workplaceType", event.target.value)}>{WORKPLACE_TYPES.map((value) => <option key={value}>{value}</option>)}</Select></Field>
              <Field label="Status"><Select value={form.status} onChange={(event) => set("status", event.target.value)}>{STATUSES.map((value) => <option key={value}>{value}</option>)}</Select></Field>
              <Field label="Display order"><Input type="number" min="0" value={form.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} /></Field>
              <Field label="Short summary" hint={`${form.summary.length}/500`} className="md:col-span-2"><Textarea rows={4} value={form.summary} onChange={(event) => set("summary", event.target.value)} minLength={20} maxLength={500} required /></Field>
              <label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900"><input type="checkbox" checked={form.isFeatured} onChange={(event) => set("isFeatured", event.target.checked)} /> <Star size={16} /> Feature this opening</label>
            </div>
          ) : null}

          {tab === "description" ? (
            <div className="space-y-5">
              <Field label="Full job description" hint={`${form.content.length}/50000`}><Textarea rows={10} value={form.content} onChange={(event) => set("content", event.target.value)} minLength={100} required placeholder="Describe the role, team, impact, and day-to-day work." /></Field>
              <div className="grid gap-5 md:grid-cols-2">
                {[
                  ["responsibilities", "Responsibilities"],
                  ["requirements", "Required qualifications"],
                  ["preferredQualifications", "Preferred qualifications"],
                  ["skills", "Skills"],
                  ["benefits", "Benefits"],
                ].map(([key, label]) => <Field key={key} label={label} hint="One item per line" className={key === "benefits" ? "md:col-span-2" : ""}><Textarea rows={6} value={form[key]} onChange={(event) => set(key, event.target.value)} /></Field>)}
              </div>
            </div>
          ) : null}

          {tab === "offer" ? (
            <div className="space-y-7">
              <section><h3 className="mb-4 font-black text-slate-900">Location</h3><div className="grid gap-5 md:grid-cols-2">{[
                ["country", "Country"], ["state", "State"], ["city", "City"], ["postalCode", "Postal code"], ["address", "Office address"],
              ].map(([key, label]) => <Field key={key} label={label} className={key === "address" ? "md:col-span-2" : ""}><Input value={form.location[key]} onChange={(event) => setNested("location", key, event.target.value)} /></Field>)}</div></section>
              <section className="border-t border-slate-200 pt-6"><h3 className="mb-4 font-black text-slate-900">Experience</h3><div className="grid gap-5 md:grid-cols-3"><Field label="Level"><Select value={form.experience.level} onChange={(event) => setNested("experience", "level", event.target.value)}>{EXPERIENCE_LEVELS.map((value) => <option key={value}>{value}</option>)}</Select></Field><Field label="Minimum years"><Input type="number" min="0" max="50" value={form.experience.minimumYears} onChange={(event) => setNested("experience", "minimumYears", event.target.value)} /></Field><Field label="Maximum years"><Input type="number" min="0" max="50" value={form.experience.maximumYears} onChange={(event) => setNested("experience", "maximumYears", event.target.value)} /></Field></div></section>
              <section className="border-t border-slate-200 pt-6"><h3 className="mb-4 font-black text-slate-900">Compensation</h3><div className="grid gap-5 md:grid-cols-3"><Field label="Minimum"><Input type="number" min="0" value={form.compensation.minimum} onChange={(event) => setNested("compensation", "minimum", event.target.value)} /></Field><Field label="Maximum"><Input type="number" min="0" value={form.compensation.maximum} onChange={(event) => setNested("compensation", "maximum", event.target.value)} /></Field><Field label="Currency"><Input maxLength={3} value={form.compensation.currency} onChange={(event) => setNested("compensation", "currency", event.target.value.toUpperCase())} /></Field><Field label="Pay period"><Select value={form.compensation.period} onChange={(event) => setNested("compensation", "period", event.target.value)}>{["hour", "day", "month", "year", "project"].map((value) => <option key={value}>{value}</option>)}</Select></Field><Field label="Notes" className="md:col-span-2"><Input value={form.compensation.notes} onChange={(event) => setNested("compensation", "notes", event.target.value)} /></Field><label className="md:col-span-3 flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.compensation.isDisclosed} onChange={(event) => setNested("compensation", "isDisclosed", event.target.checked)} /> Show compensation publicly</label></div></section>
            </div>
          ) : null}

          {tab === "application" ? (
            <div className="space-y-7">
              <section><h3 className="mb-4 font-black text-slate-900">Application destination</h3><div className="grid gap-5 md:grid-cols-2"><Field label="Application email"><Input type="email" value={form.application.email} onChange={(event) => setNested("application", "email", event.target.value)} placeholder="careers@kraviona.com" /></Field><Field label="External application URL"><Input type="url" value={form.application.url} onChange={(event) => setNested("application", "url", event.target.value)} /></Field><Field label="Deadline"><Input type="date" value={form.application.deadline} onChange={(event) => setNested("application", "deadline", event.target.value)} /></Field><Field label="Instructions" className="md:col-span-2"><Textarea rows={5} value={form.application.instructions} onChange={(event) => setNested("application", "instructions", event.target.value)} /></Field></div><p className="mt-3 text-xs text-slate-500">Published openings require an application email or URL.</p></section>
              <section className="border-t border-slate-200 pt-6"><h3 className="mb-4 font-black text-slate-900">Search metadata</h3><div className="grid gap-5 md:grid-cols-2"><Field label="Meta title"><Input maxLength={70} value={form.seo.metaTitle} onChange={(event) => setNested("seo", "metaTitle", event.target.value)} /></Field><Field label="Canonical URL"><Input type="url" value={form.seo.canonicalUrl} onChange={(event) => setNested("seo", "canonicalUrl", event.target.value)} /></Field><Field label="Meta description" className="md:col-span-2"><Textarea rows={4} maxLength={170} value={form.seo.metaDescription} onChange={(event) => setNested("seo", "metaDescription", event.target.value)} /></Field><Field label="Keywords" hint="Comma separated" className="md:col-span-2"><Input value={form.seo.keywords} onChange={(event) => setNested("seo", "keywords", event.target.value)} /></Field><label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900"><input type="checkbox" checked={form.seo.noIndex} onChange={(event) => setNested("seo", "noIndex", event.target.checked)} /> Prevent search engine indexing</label></div></section>
            </div>
          ) : null}
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:px-6">
          <p className="text-xs text-slate-500">Publishing makes this opening visible at kraviona.com/careers.</p>
          <div className="flex gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save opening</button></div>
        </footer>
      </form>
    </div>
  );
}

export default function CareersAdminPage() {
  const [careers, setCareers] = useState([]);
  const [counts, setCounts] = useState({});
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (status !== "all") params.set("status", status);
      if (search.trim()) params.set("search", search.trim());
      const result = await apiRequest(`/admin/careers?${params}`);
      setCareers(result.data || []);
      setCounts(result.counts || {});
      setPagination(result.pagination || { page, limit: 20, total: 0, totalPages: 0 });
    } catch (requestError) {
      setError(requestError.message || "Unable to load career openings");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeout = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [load, search]);

  const stats = useMemo(() => ({
    total: Object.values(counts).reduce((sum, value) => sum + Number(value || 0), 0),
    live: counts.published || 0,
    drafts: counts.draft || 0,
    closed: (counts.closed || 0) + (counts.archived || 0),
  }), [counts]);

  const save = async (data) => {
    if (data.status === "published" && !data.application.email && !data.application.url) {
      await Swal.fire({ icon: "warning", title: "Application destination required", text: "Add an application email or URL before publishing." });
      return;
    }
    try {
      setSaving(true);
      const isUpdate = Boolean(editing?._id);
      await apiRequest(isUpdate ? `/admin/careers/${editing._id}` : "/admin/careers", {
        method: isUpdate ? "PATCH" : "POST",
        body: JSON.stringify(data),
      });
      setEditing(null);
      await load();
      await Swal.fire({ icon: "success", title: "Career opening saved", timer: 1700, showConfirmButton: false });
    } catch (requestError) {
      await Swal.fire({ icon: "error", title: "Career not saved", text: requestError.message || "Unable to save career opening" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (career) => {
    const confirmation = await Swal.fire({ icon: "warning", title: "Archive career opening?", text: `${career.jobTitle} will be removed from the public website.`, showCancelButton: true, confirmButtonText: "Archive", confirmButtonColor: "#dc2626" });
    if (!confirmation.isConfirmed) return;
    try {
      await apiRequest(`/admin/careers/${career._id}`, { method: "DELETE" });
      await load();
      await Swal.fire({ icon: "success", title: "Career archived", timer: 1500, showConfirmButton: false });
    } catch (requestError) {
      await Swal.fire({ icon: "error", title: "Archive failed", text: requestError.message || "Unable to archive career" });
    }
  };

  return (
    <Frame>
      <main className="min-h-full bg-[#edf5f4] p-5 sm:p-6 lg:p-8">
        <section className="mb-6 rounded-2xl bg-gradient-to-r from-[#0b363d] to-[#0f5960] p-6 text-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#f7d994]">Recruitment workspace</p><h1 className="mt-1 text-3xl font-black">Career Openings</h1><p className="mt-2 text-sm text-[#dcebea]">Create, publish, pause and archive jobs shown on the public careers page.</p></div><div className="flex gap-2"><button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold"><RefreshCw size={16} /> Refresh</button><button type="button" onClick={() => setEditing(freshCareer())} className="inline-flex items-center gap-2 rounded-xl bg-[#f7c56d] px-4 py-3 text-sm font-black text-[#123f46]"><Plus size={16} /> Add opening</button></div></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Total", stats.total], ["Published", stats.live], ["Drafts", stats.drafts], ["Closed", stats.closed]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.07] p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[#a9cfcc]">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}</div>
        </section>

        {error ? <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p> : null}
        <section className="overflow-hidden rounded-2xl border border-[#0f5960]/20 bg-white shadow-sm">
          <div className="flex flex-wrap gap-3 border-b border-slate-200 p-4"><label className="relative min-w-64 flex-1"><Search size={16} className="absolute left-3 top-3 text-slate-400" /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search title, department or skill" className={`${inputClass} pl-9`} /></label><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className={`${inputClass} w-auto min-w-44`}><option value="all">All statuses</option>{STATUSES.map((value) => <option key={value}>{value}</option>)}</select></div>
          {loading ? <ContentLoader label="Loading career openings…" /> : careers.length ? <><div className="overflow-x-auto"><table className="min-w-full"><thead className="bg-[#e7f1f0] text-left text-xs font-black uppercase tracking-wide text-[#0a454b]"><tr><th className="p-4">Opening</th><th className="p-4">Work setup</th><th className="p-4">Status</th><th className="p-4">Deadline</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{careers.map((career) => <tr key={career._id} className="border-t border-slate-200 hover:bg-[#f8fbfa]"><td className="p-4"><div className="flex items-start gap-3"><span className="rounded-xl bg-[#e7f1f0] p-2 text-[#0f5960]"><BriefcaseBusiness size={18} /></span><div><p className="font-bold text-slate-900">{career.jobTitle}</p><p className="mt-1 text-xs text-slate-500">{career.department} · {career.openings} opening{career.openings === 1 ? "" : "s"}</p>{career.isFeatured ? <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700"><Star size={10} /> Featured</span> : null}</div></div></td><td className="p-4"><p className="text-sm font-semibold text-slate-700">{career.employmentType}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} /> {career.workplaceType} · {career.location?.city || career.location?.country}</p></td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${career.status === "published" ? "bg-emerald-50 text-emerald-700" : career.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{career.status}</span></td><td className="p-4 text-sm text-slate-600">{formatDate(career.application?.deadline, "No deadline")}</td><td className="p-4"><div className="flex justify-end gap-2">{career.status === "published" ? <a href={`${process.env.NEXT_PUBLIC_WEBSITE_URL || "https://kraviona.com"}/careers/${career.slug}`} target="_blank" rel="noreferrer" aria-label="Open public career" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><ExternalLink size={16} /></a> : null}<button type="button" onClick={() => setEditing(career)} aria-label="Edit career" className="rounded-lg border border-slate-200 p-2 text-[#0f5960] hover:bg-[#e7f1f0]"><Edit3 size={16} /></button><button type="button" onClick={() => remove(career)} aria-label="Archive career" className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div><Pagination {...pagination} itemLabel="career openings" onPageChange={setPage} /></> : <EmptyState title="No career openings found" message="Create the first opening or change the current filters." />}
        </section>
        {editing ? <CareerForm key={editing._id || "new"} career={editing} saving={saving} onClose={() => setEditing(null)} onSave={save} /> : null}
      </main>
    </Frame>
  );
}
