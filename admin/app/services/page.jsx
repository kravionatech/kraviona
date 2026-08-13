"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  FileText,
  Globe2,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  SearchCheck,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import Frame from "@/components/Frame/Frame";
import { apiRequest } from "@/components/api";
import Swal from "sweetalert2";
import { ContentLoader, EmptyState } from "@/components/AsyncState";

const CATEGORIES = [
  "Web Development",
  "Backend & Architecture",
  "Performance & AI",
  "Branding & Marketing",
  "Marketplace & Seller",
];

const freshService = () => ({
  title: "",
  slug: "",
  category: "Web Development",
  description: "",
  features: [],
  hero: { eyebrow: "Professional Service", title: "", highlight: "Services", description: "" },
  intro: "",
  outcomes: [{ title: "", description: "" }],
  trustPoints: [],
  deliverables: [],
  idealFor: [],
  successMetrics: [],
  process: [{ title: "Discovery & planning", description: "" }],
  techStack: [],
  faqs: [{ question: "", answer: "" }],
  cta: { title: "", description: "", label: "Discuss Your Project", href: "/contact" },
  seo: { metaTitle: "", metaDescription: "", keywords: [], ogImage: "/og-web-development.jpg", noIndex: false },
  expert: {
    name: "", jobTitle: "", bio: "", image: "", email: "", phone: "",
    whatsapp: "", linkedin: "", companyLinkedin: "", twitter: "", facebook: "", website: "", address: "", availability: "",
    consultation: "", responseTime: "", expertise: [], credentials: [],
  },
  order: 0,
  isFeatured: false,
  isActive: true,
});

const asArray = (value) => Array.isArray(value) ? value : [];
const prepareService = (service) => {
  const base = freshService();
  if (!service) return base;
  return {
    ...base,
    ...service,
    features: asArray(service.features),
    hero: { ...base.hero, ...(service.hero || {}) },
    outcomes: asArray(service.outcomes).length ? service.outcomes : base.outcomes,
    trustPoints: asArray(service.trustPoints),
    deliverables: asArray(service.deliverables),
    idealFor: asArray(service.idealFor),
    successMetrics: asArray(service.successMetrics),
    process: asArray(service.process).length ? service.process : base.process,
    techStack: asArray(service.techStack),
    faqs: asArray(service.faqs).length ? service.faqs : base.faqs,
    cta: { ...base.cta, ...(service.cta || {}) },
    seo: { ...base.seo, ...(service.seo || {}), keywords: asArray(service.seo?.keywords) },
    expert: {
      ...base.expert,
      ...(service.expert || {}),
      expertise: asArray(service.expert?.expertise),
      credentials: asArray(service.expert?.credentials),
    },
  };
};

function Field({ label, hint, children, className = "" }) {
  return <label className={`block ${className}`}><span className="mb-1.5 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.09em] text-slate-500"><span>{label}</span>{hint && <span className="normal-case font-medium tracking-normal text-slate-400">{hint}</span>}</span>{children}</label>;
}

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/10";
const Input = (props) => <input {...props} className={inputClass} />;
const Textarea = (props) => <textarea {...props} className={`${inputClass} resize-y`} />;

function LinesEditor({ label, value, onChange, placeholder, hint = "One item per line" }) {
  return <Field label={label} hint={hint}><Textarea rows={5} value={asArray(value).join("\n")} placeholder={placeholder} onChange={(event) => onChange(event.target.value.split("\n").map((item) => item.trim()).filter(Boolean))} /></Field>;
}

function ItemEditor({ label, items, onChange, titleLabel = "Title", descriptionLabel = "Description", addLabel = "Add item" }) {
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  const remove = (index) => onChange(items.filter((_, itemIndex) => itemIndex !== index));
  return <div><div className="mb-2 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.09em] text-slate-500">{label}</p><button type="button" onClick={() => onChange([...items, { title: "", description: "" }])} className="inline-flex items-center gap-1 rounded-lg border border-[#0f5960]/20 bg-[#e7f1f0] px-2.5 py-1.5 text-xs font-bold text-[#0f5960]"><Plus size={13} /> {addLabel}</button></div><div className="space-y-3">{items.map((item, index) => <div key={index} className="grid gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_1.6fr_auto]"><Input value={item.title || ""} placeholder={titleLabel} onChange={(event) => update(index, "title", event.target.value)} /><Textarea rows={2} value={item.description || ""} placeholder={descriptionLabel} onChange={(event) => update(index, "description", event.target.value)} /><button type="button" aria-label={`Remove ${label} item`} onClick={() => remove(index)} className="self-start rounded-lg p-2.5 text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button></div>)}</div></div>;
}

function FaqEditor({ items, onChange }) {
  const update = (index, key, value) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item));
  return <div><div className="mb-3 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-[0.09em] text-slate-500">Frequently asked questions</p><button type="button" onClick={() => onChange([...items, { question: "", answer: "" }])} className="inline-flex items-center gap-1 rounded-lg bg-[#e7f1f0] px-3 py-2 text-xs font-bold text-[#0f5960]"><Plus size={13} /> Add FAQ</button></div><div className="space-y-3">{items.map((faq, index) => <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4"><div className="mb-2 flex gap-2"><Input value={faq.question || ""} placeholder="Question" onChange={(event) => update(index, "question", event.target.value)} /><button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2.5 text-rose-500 hover:bg-rose-100"><Trash2 size={16} /></button></div><Textarea rows={3} value={faq.answer || ""} placeholder="Detailed answer" onChange={(event) => update(index, "answer", event.target.value)} /></div>)}</div></div>;
}

const TABS = [
  ["basics", Layers3, "Basics"],
  ["content", FileText, "Page content"],
  ["process", CheckCircle2, "Process & FAQs"],
  ["seo", SearchCheck, "SEO & CTA"],
  ["expert", UserRound, "Expert"],
];

function ServiceForm({ service, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => prepareService(service));
  const [tab, setTab] = useState("basics");
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setNested = (group, key, value) => setForm((current) => ({ ...current, [group]: { ...current[group], [key]: value } }));
  const submit = (event) => { event.preventDefault(); onSave(form); };

  return <div className="fixed inset-0 z-50 bg-slate-950/55 p-2 sm:p-4"><form onSubmit={submit} className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6"><div><p className="text-xs font-black uppercase tracking-[0.15em] text-[#d26c51]">Dynamic service builder</p><h2 className="mt-1 text-xl font-black text-slate-950">{service?._id ? `Edit ${service.title}` : "Create complete service page"}</h2></div><button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button></header><div className="flex shrink-0 gap-2 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">{TABS.map(([value, Icon, label]) => <button key={value} type="button" onClick={() => setTab(value)} className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition ${tab === value ? "bg-[#0f5960] text-white shadow-sm" : "bg-white text-slate-600 hover:bg-[#e7f1f0]"}`}><Icon size={15} /> {label}</button>)}</div><div className="flex-1 overflow-y-auto p-5 sm:p-6">
    {tab === "basics" && <div className="grid gap-5 md:grid-cols-2"><Field label="Service title"><Input value={form.title} onChange={(event) => set("title", event.target.value)} placeholder="MERN Stack Development" required /></Field><Field label="URL slug" hint="Auto-generated when empty"><Input value={form.slug} onChange={(event) => set("slug", event.target.value)} placeholder="mern-stack-development" /></Field><Field label="Category"><input list="service-categories" value={form.category} onChange={(event) => set("category", event.target.value)} className={inputClass} /><datalist id="service-categories">{CATEGORIES.map((category) => <option key={category} value={category} />)}</datalist></Field><Field label="Display order"><Input type="number" min="0" value={form.order} onChange={(event) => set("order", Number(event.target.value))} /></Field><Field label="Card description" className="md:col-span-2"><Textarea rows={4} value={form.description} onChange={(event) => set("description", event.target.value)} placeholder="Short description shown on service cards and used as a fallback." required /></Field><LinesEditor label="Card features" value={form.features} onChange={(value) => set("features", value)} placeholder={"React frontend\nNode.js API\nMongoDB database"} /><LinesEditor label="Technology stack" value={form.techStack} onChange={(value) => set("techStack", value)} placeholder={"React.js\nNext.js\nNode.js\nMongoDB"} /><div className="md:col-span-2 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"><label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.isActive} onChange={(event) => set("isActive", event.target.checked)} className="h-4 w-4 accent-[#0f5960]" /> Show on website</label><label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.isFeatured} onChange={(event) => set("isFeatured", event.target.checked)} className="h-4 w-4 accent-[#0f5960]" /> Feature on services grid</label></div></div>}
    {tab === "content" && <div className="space-y-6"><div className="grid gap-4 md:grid-cols-2"><Field label="Hero eyebrow"><Input value={form.hero.eyebrow} onChange={(event) => setNested("hero", "eyebrow", event.target.value)} /></Field><Field label="Hero highlighted text"><Input value={form.hero.highlight} onChange={(event) => setNested("hero", "highlight", event.target.value)} /></Field><Field label="Hero title" className="md:col-span-2"><Input value={form.hero.title} onChange={(event) => setNested("hero", "title", event.target.value)} placeholder={form.title || "Hero heading"} /></Field><Field label="Hero description" className="md:col-span-2"><Textarea rows={4} value={form.hero.description} onChange={(event) => setNested("hero", "description", event.target.value)} /></Field><Field label="Service introduction" className="md:col-span-2"><Textarea rows={5} value={form.intro} onChange={(event) => set("intro", event.target.value)} /></Field></div><ItemEditor label="Outcomes" items={form.outcomes} onChange={(value) => set("outcomes", value)} addLabel="Add outcome" /><ItemEditor label="Trust points" items={form.trustPoints} onChange={(value) => set("trustPoints", value)} addLabel="Add trust point" /><div className="grid gap-5 md:grid-cols-3"><LinesEditor label="Deliverables" value={form.deliverables} onChange={(value) => set("deliverables", value)} /><LinesEditor label="Best fit for" value={form.idealFor} onChange={(value) => set("idealFor", value)} /><LinesEditor label="Success metrics" value={form.successMetrics} onChange={(value) => set("successMetrics", value)} /></div></div>}
    {tab === "process" && <div className="space-y-8"><ItemEditor label="Work process" items={form.process} onChange={(value) => set("process", value)} addLabel="Add step" /><FaqEditor items={form.faqs} onChange={(value) => set("faqs", value)} /></div>}
    {tab === "seo" && <div className="space-y-7"><div className="grid gap-5 md:grid-cols-2"><Field label="Meta title"><Input value={form.seo.metaTitle} onChange={(event) => setNested("seo", "metaTitle", event.target.value)} /></Field><Field label="Open Graph image"><Input value={form.seo.ogImage} onChange={(event) => setNested("seo", "ogImage", event.target.value)} placeholder="/og-web-development.jpg" /></Field><Field label="Meta description" className="md:col-span-2"><Textarea rows={4} value={form.seo.metaDescription} onChange={(event) => setNested("seo", "metaDescription", event.target.value)} /></Field><div className="md:col-span-2"><LinesEditor label="SEO keywords" value={form.seo.keywords} onChange={(value) => setNested("seo", "keywords", value)} /></div><label className="md:col-span-2 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900"><input type="checkbox" checked={form.seo.noIndex} onChange={(event) => setNested("seo", "noIndex", event.target.checked)} /> Prevent search engines from indexing this service</label></div><div className="border-t border-slate-200 pt-6"><h3 className="mb-4 font-black text-slate-900">Bottom call to action</h3><div className="grid gap-4 md:grid-cols-2"><Field label="CTA title"><Input value={form.cta.title} onChange={(event) => setNested("cta", "title", event.target.value)} /></Field><Field label="Button label"><Input value={form.cta.label} onChange={(event) => setNested("cta", "label", event.target.value)} /></Field><Field label="CTA description" className="md:col-span-2"><Textarea rows={3} value={form.cta.description} onChange={(event) => setNested("cta", "description", event.target.value)} /></Field><Field label="Button link"><Input value={form.cta.href} onChange={(event) => setNested("cta", "href", event.target.value)} /></Field></div></div></div>}
    {tab === "expert" && <div className="grid gap-5 md:grid-cols-2"><Field label="Expert name"><Input value={form.expert.name} onChange={(event) => setNested("expert", "name", event.target.value)} placeholder="Leave blank to use company default" /></Field><Field label="Job title"><Input value={form.expert.jobTitle} onChange={(event) => setNested("expert", "jobTitle", event.target.value)} /></Field><Field label="Expert image"><Input value={form.expert.image} onChange={(event) => setNested("expert", "image", event.target.value)} /></Field><Field label="Email"><Input type="email" value={form.expert.email} onChange={(event) => setNested("expert", "email", event.target.value)} /></Field><Field label="Phone"><Input value={form.expert.phone} onChange={(event) => setNested("expert", "phone", event.target.value)} /></Field><Field label="WhatsApp link"><Input value={form.expert.whatsapp} onChange={(event) => setNested("expert", "whatsapp", event.target.value)} /></Field><Field label="Personal LinkedIn"><Input value={form.expert.linkedin} onChange={(event) => setNested("expert", "linkedin", event.target.value)} /></Field><Field label="Company LinkedIn"><Input value={form.expert.companyLinkedin} onChange={(event) => setNested("expert", "companyLinkedin", event.target.value)} /></Field><Field label="Twitter / X link"><Input value={form.expert.twitter} onChange={(event) => setNested("expert", "twitter", event.target.value)} /></Field><Field label="Facebook link"><Input value={form.expert.facebook} onChange={(event) => setNested("expert", "facebook", event.target.value)} /></Field><Field label="Website"><Input value={form.expert.website} onChange={(event) => setNested("expert", "website", event.target.value)} /></Field><Field label="Address"><Input value={form.expert.address} onChange={(event) => setNested("expert", "address", event.target.value)} /></Field><Field label="Availability"><Input value={form.expert.availability} onChange={(event) => setNested("expert", "availability", event.target.value)} /></Field><Field label="Consultation offer"><Input value={form.expert.consultation} onChange={(event) => setNested("expert", "consultation", event.target.value)} /></Field><Field label="Response time"><Input value={form.expert.responseTime} onChange={(event) => setNested("expert", "responseTime", event.target.value)} /></Field><Field label="Expert bio" className="md:col-span-2"><Textarea rows={5} value={form.expert.bio} onChange={(event) => setNested("expert", "bio", event.target.value)} /></Field><LinesEditor label="Expertise" value={form.expert.expertise} onChange={(value) => setNested("expert", "expertise", value)} /><LinesEditor label="Credentials / trust signals" value={form.expert.credentials} onChange={(value) => setNested("expert", "credentials", value)} /></div>}
  </div><footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6"><p className="text-xs text-slate-500">All tabs are stored together in MongoDB when you save.</p><div className="flex gap-3"><button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save complete service</button></div></footer></form></div>;
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [indexability, setIndexability] = useState("all");
  const [indexabilityCounts, setIndexabilityCounts] = useState({ noIndex: 0, indexed: 0 });

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (indexability !== "all") params.set("indexability", indexability);
      const result = await apiRequest(`/admin/services${params.size ? `?${params.toString()}` : ""}`);
      setServices(result.data || []);
      setIndexabilityCounts(result.indexabilityCounts || { noIndex: 0, indexed: 0 });
    } catch (err) {
      setError(err.message || "Unable to load services");
    } finally {
      setLoading(false);
    }
  }, [indexability]);

  useEffect(() => {
    const timeout = setTimeout(load, 0);
    return () => clearTimeout(timeout);
  }, [load]);

  const stats = useMemo(() => ({
    total: services.length,
    active: services.filter((item) => item.isActive).length,
    complete: services.filter((item) => item.outcomes?.length && item.process?.length && item.faqs?.length).length,
  }), [services]);

  const save = async (data) => {
    if (!data.title || !data.description) {
      await Swal.fire({ icon: "warning", title: "Missing details", text: "Enter a service title and card description before saving." });
      return;
    }
    try {
      setSaving(true);
      const endpoint = editing?._id ? `/admin/services/${editing._id}` : "/admin/services";
      await apiRequest(endpoint, { method: editing?._id ? "PATCH" : "POST", body: JSON.stringify(data) });
      const action = editing?._id ? "updated" : "created";
      setEditing(null);
      await load();
      await Swal.fire({ icon: "success", title: "Complete service saved", text: `The service page was ${action} and its full content is stored in the database.`, timer: 1900, showConfirmButton: false });
    } catch (err) {
      const message = err.message || "Unable to save service";
      setError(message);
      await Swal.fire({ icon: "error", title: "Service not saved", text: message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (service) => {
    const confirmation = await Swal.fire({ icon: "warning", title: "Delete service?", text: `${service.title} and all of its page content will be permanently removed.`, showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#dc2626" });
    if (!confirmation.isConfirmed) return;
    try {
      await apiRequest(`/admin/services/${service._id}`, { method: "DELETE" });
      await load();
      await Swal.fire({ icon: "success", title: "Service deleted", timer: 1500, showConfirmButton: false });
    } catch (err) {
      const message = err.message || "Unable to delete service";
      setError(message);
      await Swal.fire({ icon: "error", title: "Delete failed", text: message });
    }
  };

  return <Frame><main className="min-h-full bg-[#edf5f4] p-5 sm:p-6 lg:p-8"><section className="mb-6 overflow-hidden rounded-2xl border border-[#0f5960]/20 bg-gradient-to-r from-[#0b363d] to-[#0f5960] p-6 text-white shadow-lg"><div className="flex flex-wrap items-center justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#f7d994]">Full dynamic website content</p><h1 className="mt-1 text-3xl font-black">Service Page Builder</h1><p className="mt-2 max-w-2xl text-sm text-[#dcebea]">Create the card, complete detail page, process, FAQs, SEO, CTA and expert trust profile from one place.</p></div><div className="flex gap-2"><button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-bold"><RefreshCw size={16} /> Refresh</button><button type="button" onClick={() => setEditing(freshService())} className="inline-flex items-center gap-2 rounded-xl bg-[#f7c56d] px-4 py-3 text-sm font-black text-[#123f46]"><Plus size={16} /> Add complete service</button></div></div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">{[["Shown", stats.total], ["Visible", stats.active], ["Content ready", stats.complete], ["No index", indexabilityCounts.noIndex]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.07] p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[#a9cfcc]">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}</div></section>{error && <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</p>}<section className="overflow-hidden rounded-2xl border border-[#0f5960]/20 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4"><p className="text-sm font-bold text-slate-700">{indexabilityCounts.indexed} indexed · {indexabilityCounts.noIndex} no index</p><select aria-label="Filter services by search index status" value={indexability} onChange={(event) => setIndexability(event.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-[#0f5960]"><option value="all">All index statuses</option><option value="noindex">No index only</option><option value="indexed">Indexed only</option></select></div>{loading ? <ContentLoader label="Loading services…" /> : services.length ? <div className="overflow-x-auto"><table className="min-w-full"><thead className="bg-[#e7f1f0] text-left text-xs font-black uppercase tracking-wide text-[#0a454b]"><tr><th className="p-4">Service</th><th className="p-4">Page content</th><th className="p-4">Visibility</th><th className="p-4 text-right">Actions</th></tr></thead><tbody>{services.map((service) => { const ready = Boolean(service.outcomes?.length && service.process?.length && service.faqs?.length); return <tr key={service._id} className="border-t border-slate-200 hover:bg-[#f8fbfa]"><td className="p-4"><p className="font-bold text-slate-900">{service.title}</p><p className="mt-1 text-xs text-slate-500">/{service.slug} · {service.category || "General"}</p><span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${service.seo?.noIndex ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>{service.seo?.noIndex ? "No index" : "Indexed"}</span></td><td className="p-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{ready && <CheckCircle2 size={13} />}{ready ? "Full page ready" : "Needs page details"}</span><p className="mt-1.5 text-xs text-slate-400">{service.outcomes?.length || 0} outcomes · {service.faqs?.length || 0} FAQs</p></td><td className="p-4 text-sm font-bold"><span className={service.isActive ? "text-emerald-700" : "text-slate-500"}>{service.isActive ? "Visible" : "Hidden"}</span></td><td className="p-4"><div className="flex justify-end gap-2"><a href={`${process.env.NEXT_PUBLIC_WEBSITE_URL || "https://kraviona.com"}/services/${service.slug}`} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50" aria-label="Open public service"><Globe2 size={16} /></a><button type="button" onClick={() => setEditing(service)} className="rounded-lg border border-slate-200 p-2 text-[#0f5960] hover:bg-[#e7f1f0]" aria-label="Edit service"><Edit3 size={16} /></button><button type="button" onClick={() => remove(service)} className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100" aria-label="Delete service"><Trash2 size={16} /></button></div></td></tr>;})}</tbody></table></div> : <EmptyState title="No services found" message={indexability === "all" ? "Add your first complete service page." : "No service matches this index filter."} />}</section>{editing && <ServiceForm key={editing._id || "new"} service={editing} saving={saving} onClose={() => setEditing(null)} onSave={save} />}</main></Frame>;
}
