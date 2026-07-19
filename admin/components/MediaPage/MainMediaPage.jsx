"use client";

import { apiRequest } from "@/components/api";
import {
  UploadCloudIcon,
  VideoIcon,
  ImageIcon,
  FileTextIcon,
  FileType2Icon,
  Music2Icon,
  SearchIcon,
  FileIcon,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";

// mediaType ke hisaab se icon + color decide karta hai
const TYPE_META = {
  image: { icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-50", label: "Images" },
  video: { icon: VideoIcon, color: "text-orange-400", bg: "bg-orange-50", label: "Videos" },
  audio: { icon: Music2Icon, color: "text-violet-400", bg: "bg-violet-50", label: "Audio" },
  document: { icon: FileTextIcon, color: "text-rose-400", bg: "bg-rose-50", label: "Documents" },
};

function getTypeMeta(mediaType) {
  return TYPE_META[mediaType] || { icon: FileIcon, color: "text-slate-400", bg: "bg-slate-50", label: "Other" };
}

function formatBytes(bytes) {
  if (typeof bytes !== "number") return bytes || "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

const MainMediaPage = () => {
  const [mediasFile, setMediasFile] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchMedias = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest("/media/me");
      setMediasFile(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchMedias, 0);
    return () => clearTimeout(timeout);
  }, [fetchMedias]);

  // Dummy numbers ke bajaye actual data se stats nikalte hai
  const stats = useMemo(() => {
    const counts = { image: 0, video: 0, audio: 0, document: 0 };
    mediasFile.forEach((item) => {
      if (counts[item.mediaType] !== undefined) counts[item.mediaType] += 1;
    });
    return Object.entries(counts).map(([type, count]) => ({
      type,
      count,
      ...getTypeMeta(type),
    }));
  }, [mediasFile]);

  const filteredMedia = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mediasFile;
    return mediasFile.filter((item) => {
      const name = item.originalName || item.fileName || "";
      return name.toLowerCase().includes(q);
    });
  }, [mediasFile, search]);

  const handleCopy = async (url, id) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // clipboard permission na ho to silently ignore
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiRequest(`/media/${deleteTarget._id}`, { method: "DELETE" });
      setMediasFile((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="w-full p-4">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-1 w-5 rounded-full bg-orange-500" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Media File engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight text-slate-900">Media Data</h1>
        </div>

        <Link href="/media/new">
          <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3.5 py-2 text-sm font-bold text-white shadow-sm shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-md active:scale-[0.98]">
            <UploadCloudIcon className="h-4 w-4" strokeWidth={2.5} />
            Upload
          </button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.type}
              className="flex h-20 w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <Icon size={36} className={stat.color} strokeWidth={1.75} />
              <div className="flex flex-col">
                <span className="text-lg font-extrabold leading-tight text-slate-900">{stat.count}</span>
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search section */}
      <div className="mt-5">
        <div className="flex w-full max-w-xl items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-3 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-200">
          <SearchIcon size={16} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files by name..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
          />
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Media grid */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="h-28 w-full animate-pulse bg-slate-100" />
              <div className="space-y-1.5 p-2.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-slate-100" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}

        {!loading && filteredMedia.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-12 text-center">
            <ImageIcon size={28} className="text-slate-300" />
            <p className="mt-2 text-sm text-slate-500">No files found.</p>
          </div>
        )}
{!loading &&
  filteredMedia.map((item) => {
    const name = item.originalName || item.fileName || "Untitled file";
    const typeMeta = getTypeMeta(item.mediaType);
    const TypeIcon = typeMeta.icon; // yahan destructure kiya — ab JSX mein safe hai

    return (
      <div
        key={item._id}
        className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="relative h-28 w-full overflow-hidden bg-slate-50">
          {item.mediaType === "image" && item.fileUrl ? (
            <img
              src={item.fileUrl}
              alt={item.altText || name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className={`flex h-full w-full items-center justify-center ${typeMeta.bg}`}>
              <TypeIcon size={28} className={typeMeta.color} strokeWidth={1.75} />
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-white/90 p-1.5 text-slate-700 hover:bg-white"
              title="View"
            >
              <ExternalLink size={13} />
            </a>
            <button
              onClick={() => handleCopy(item.fileUrl, item._id)}
              className="rounded-md bg-white/90 p-1.5 text-slate-700 hover:bg-white"
              title="Copy link"
            >
              {copiedId === item._id ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            </button>
            <button
              onClick={() => setDeleteTarget(item)}
              className="rounded-md bg-white/90 p-1.5 text-red-500 hover:bg-white"
              title="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
        <div className="p-2.5">
          <p className="truncate text-xs font-semibold text-slate-800" title={name}>
            {name}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-400">{formatBytes(item.fileSize)}</p>
        </div>
      </div>
    );
  })}
      </div>

      {/* Delete confirm modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-900">Delete this file?</h3>
            <p className="mt-1.5 text-xs text-slate-500">
              <span className="font-medium text-slate-700">
                {deleteTarget.originalName || deleteTarget.fileName}
              </span>{" "}
              will be permanently removed.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60"
              >
                {deleting && <Loader2 size={12} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MainMediaPage;
