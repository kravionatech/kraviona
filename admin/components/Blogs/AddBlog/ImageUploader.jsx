"use client";

import { useCallback, useRef, useState } from "react";
import { AlertCircle, FolderOpen, Loader2, RotateCcw, UploadCloud, X } from "lucide-react";
import { apiUrl } from "@/components/api";
import MediaPicker from "@/components/MediaPage/MediaPicker";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ value = "", onChange, imageLabel = "Image" }) {
  const inputRef = useRef(null);
  const lastFileRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const uploadFile = useCallback((file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Image must be 10MB or smaller.");
      return;
    }

    lastFileRef.current = file;
    setError("");
    setProgress(0);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", apiUrl("/media/upload"));
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      setUploading(false);
      try {
        const response = JSON.parse(xhr.responseText || "{}");
        const imageUrl = response?.data?.[0]?.fileUrl;
        if (xhr.status >= 200 && xhr.status < 300 && imageUrl) {
          onChange(imageUrl);
          setProgress(100);
          return;
        }
        setError(response?.message || "Image upload failed. Please try again.");
      } catch {
        setError("Image upload failed. Please try again.");
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      setError("Network error while uploading the image.");
    };
    xhr.send(formData);
  }, [onChange]);

  const chooseFile = (files) => uploadFile(files?.[0]);

  if (value) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
        <img src={value} alt={`${imageLabel} preview`} className="aspect-video w-full object-cover" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-2 rounded-full bg-red-600 p-1.5 text-white shadow-sm transition hover:bg-red-700"
          aria-label={`Remove ${imageLabel.toLowerCase()}`}
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => event.key === "Enter" && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          chooseFile(event.dataTransfer.files);
        }}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50 ${
          dragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            chooseFile(event.target.files);
            event.target.value = "";
          }}
        />
        {uploading ? <Loader2 className="mx-auto animate-spin text-blue-600" size={28} /> : <UploadCloud className="mx-auto text-blue-600" size={28} />}
        <p className="mt-3 text-sm font-medium text-gray-800">Drop {imageLabel.toLowerCase()} here or click to upload</p>
        <p className="mt-1 text-xs text-gray-500">JPG, PNG, or WebP · maximum 5MB</p>
      </div>

      <button type="button" onClick={() => setPickerOpen(true)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-[#2a4a52] hover:text-[#2a4a52]">
        <FolderOpen size={16} /> Choose from media library
      </button>

      {uploading && (
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <span className="flex items-center gap-2"><AlertCircle size={16} />{error}</span>
          {lastFileRef.current && (
            <button type="button" onClick={() => uploadFile(lastFileRef.current)} className="inline-flex items-center gap-1 font-medium hover:text-red-900">
              <RotateCcw size={14} /> Retry
            </button>
          )}
        </div>
      )}
      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={`Choose ${imageLabel.toLowerCase()}`}
        onSelect={(media) => onChange(media.fileUrl)}
      />
    </div>
  );
}
