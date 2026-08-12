"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, Search, UploadCloud, X } from "lucide-react";
import { apiRequest, apiUrl } from "@/components/api";

export default function MediaPicker({ open, onClose, onSelect, title = "Select image" }) {
  const inputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadMedia = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await apiRequest("/media/me?limit=48");
      setItems((response.data || []).filter((item) => item.mediaType === "image"));
    } catch (loadError) {
      setError(loadError.message || "Media library could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) loadMedia();
  }, [open, loadMedia]);

  const uploadLocalImage = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl("/media/upload"));
    xhr.withCredentials = true;
    xhr.onload = async () => {
      setUploading(false);
      try {
        const response = JSON.parse(xhr.responseText || "{}");
        const uploaded = response?.data?.[0];
        if (xhr.status >= 200 && xhr.status < 300 && uploaded?.fileUrl) {
          onSelect(uploaded);
          onClose();
          return;
        }
        setError(response?.message || "Image upload failed.");
      } catch {
        setError("Image upload failed.");
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setError("Network error while uploading the image.");
    };
    xhr.send(formData);
  }, [onClose, onSelect]);

  if (!open) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const visibleItems = items.filter((item) =>
    `${item.originalName} ${item.altText || ""}`.toLowerCase().includes(normalizedQuery),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[80dvh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 sm:px-6">
          <div><h2 className="font-bold text-slate-900">{title}</h2><p className="text-xs text-slate-500">Choose from the library or upload from your device.</p></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close media picker"><X size={18} /></button>
        </div>
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:px-6">
          <label className="relative flex-1"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search uploaded images" className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900" /></label>
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2a4a52] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3d6b77] disabled:opacity-60"><UploadCloud size={16} />{uploading ? "Uploading…" : "Upload image"}</button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { uploadLocalImage(event.target.files?.[0]); event.target.value = ""; }} />
        </div>
        <div className="min-h-48 overflow-y-auto p-4 sm:p-6">
          {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? <div className="flex h-48 items-center justify-center text-slate-500"><Loader2 className="mr-2 animate-spin" size={18} />Loading images…</div> : visibleItems.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{visibleItems.map((item) => <button type="button" key={item._id} onClick={() => { onSelect(item); onClose(); }} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 text-left hover:border-[#e8622a] focus:outline-none focus:ring-2 focus:ring-[#e8622a]"><img src={item.fileUrl} alt={item.altText || item.originalName} className="aspect-video w-full object-cover" /><span className="block truncate p-2 text-xs font-medium text-slate-700">{item.originalName}</span><span className="absolute right-2 top-2 rounded-full bg-white/90 p-1 text-[#2a4a52] opacity-0 shadow transition group-hover:opacity-100"><Check size={14} /></span></button>)}</div> : <div className="flex h-48 flex-col items-center justify-center text-center text-slate-500"><ImagePlus size={26} /><p className="mt-2 text-sm">No images found.</p><p className="text-xs">Upload an image from your device to use it here.</p></div>}
        </div>
      </div>
    </div>
  );
}
