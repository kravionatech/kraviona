"use client";
import { apiUrl } from "@/components/api";
import React, { useCallback, useRef, useState } from "react";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

/* ----------------------------------------------------------------------
 * KRAVIONA — Media · Upload
 * Matches the teal admin theme used across Categories / EditCategory
 * ------------------------------------------------------------------- */

const BRAND = "#284043";
const ACCENT = "#d26c51";

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function FileRow({ item, onRemove }) {
  const isImage = item.file.type.startsWith("image/");

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      {/* Thumb / Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
        {isImage && item.previewUrl ? (
          <img src={item.previewUrl} alt={item.file.name} className="h-full w-full object-cover" />
        ) : (
          <FileText className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {/* Name + meta */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-800">{item.file.name}</p>
          <span className="shrink-0 text-xs text-gray-400">{formatBytes(item.file.size)}</span>
        </div>

        {/* Progress / status */}
        <div className="mt-1.5 flex items-center gap-2">
          {item.status === "error" ? (
            <span className="flex items-center gap-1 text-xs font-medium text-red-500">
              <AlertCircle className="h-3.5 w-3.5" />
              {item.errorMessage || "Upload failed"}
            </span>
          ) : item.status === "done" ? (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Uploaded
            </span>
          ) : (
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${item.progress}%`, backgroundColor: BRAND }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const UploadFile = ({
  endpoint = apiUrl("/media/upload"),
  fieldName = "file",
  multiple = true,
  accept = "image/*,.pdf",
  onUploaded,
}) => {
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const uploadItem = useCallback((item) => {
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i)));

    const formData = new FormData();
    formData.append(fieldName, item.file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);
    xhr.withCredentials = true; // send auth cookie

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const progress = Math.round((e.loaded / e.total) * 100);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress } : i)));
    };

    xhr.onload = () => {
      let result = {};
      try {
        result = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response
      }

      if (xhr.status >= 200 && xhr.status < 300 && result.success !== false) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "done", progress: 100 } : i))
        );
        onUploaded?.(result.data || result);
      } else {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error", errorMessage: result.message || `Failed (${xhr.status})` }
              : i
          )
        );
      }
    };

    xhr.onerror = () => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: "error", errorMessage: "Network error" } : i
        )
      );
    };

    xhr.send(formData);
  }, [endpoint, fieldName, onUploaded]);

  const addFiles = useCallback((fileList) => {
    const incoming = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      progress: 0,
      status: "queued", // queued | uploading | done | error
      errorMessage: "",
    }));
    setItems((prev) => [...prev, ...incoming]);
    incoming.forEach(uploadItem);
  }, [uploadItem]);

  const handleRemove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const queuedCount = items.filter((i) => i.status === "uploading" || i.status === "queued").length;
  const doneCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="w-full h-full bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="group cursor-pointer rounded-2xl border-2 border-dashed bg-white px-8 py-12 text-center transition-all duration-200"
          style={{
            borderColor: isDragging ? BRAND : "#9ca3af",
            backgroundColor: isDragging ? `${BRAND}08` : "white",
            boxShadow: "0 0 10px #02020220",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />

          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: `${BRAND}12` }}
          >
            <UploadCloud className="h-6 w-6" style={{ color: BRAND }} />
          </div>

          <p className="text-sm font-semibold text-gray-800">
            <span style={{ color: BRAND }}>Click to upload</span> or drag and drop
          </p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG or PDF — up to 10MB each</p>

          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="h-0.5 w-3 rounded-full" style={{ backgroundColor: ACCENT }} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Media Library
            </span>
          </div>
        </div>

        {/* File list */}
        {items.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-xs font-semibold text-gray-500">
                {items.length} file{items.length > 1 ? "s" : ""}
              </p>
              <p className="flex items-center gap-1 text-xs text-gray-400">
                {queuedCount > 0 && (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {queuedCount} uploading
                  </span>
                )}
                {queuedCount > 0 && doneCount > 0 && <span>·</span>}
                {doneCount > 0 && <span>{doneCount} done</span>}
              </p>
            </div>

            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
              {items.map((item) => (
                <FileRow key={item.id} item={item} onRemove={handleRemove} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
