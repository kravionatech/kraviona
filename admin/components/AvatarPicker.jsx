"use client";

import { useEffect, useState } from "react";
import { FolderOpen, ImagePlus, Link2, X } from "lucide-react";
import MediaPicker from "@/components/MediaPage/MediaPicker";

function fallbackInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "AV";
}

export default function AvatarPicker({ value = "", onChange, name = "", label = "Avatar" }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [value]);

  return <div>
    <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#5d7679]">{label}</p>
    <div className="rounded-2xl border border-[#0f5960]/15 bg-[#f8fbfa] p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative shrink-0 self-start">
          {value && !failed ? <img src={value} alt={`${name || "Profile"} preview`} onError={() => setFailed(true)} className="h-16 w-16 rounded-2xl border-2 border-white object-cover shadow-sm" /> : <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0f5960] text-sm font-black text-white">{fallbackInitials(name)}</span>}
          <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-[#f7c56d] p-1 text-[#123f46]"><ImagePlus size={12}/></span>
        </div>
        <div className="min-w-0 flex-1"><div className="relative"><Link2 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5d7679]" size={15}/><input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Paste image URL or choose a photo" className="w-full rounded-xl border border-[#0f5960]/20 bg-white py-2.5 pl-9 pr-3 text-sm text-[#123f46] outline-none transition placeholder:text-slate-400 focus:border-[#0f5960] focus:ring-4 focus:ring-[#0f5960]/10" /></div><p className="mt-1.5 text-xs text-slate-500">Use a direct URL, upload a new image, or select one from Media Library.</p></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setPickerOpen(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#0a454b]"><FolderOpen size={14}/> Choose image</button>{value && <button type="button" onClick={() => onChange("")} className="inline-flex items-center gap-2 rounded-xl border border-[#d85e3d]/25 bg-white px-3 py-2 text-xs font-bold text-[#b94b31] transition hover:bg-[#fff1ec]"><X size={14}/> Remove</button>}</div>
    </div>
    <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} title={`Choose ${label.toLowerCase()}`} onSelect={(media) => { onChange(media.fileUrl); setPickerOpen(false); }} />
  </div>;
}
