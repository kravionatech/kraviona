"use client";

import { FolderOpen } from "lucide-react";
import { Spinner } from "./Loadingspinner";

export function ContentLoader({ label = "Loading content…" }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 p-8 text-center" aria-live="polite" aria-busy="true">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f5960]/10 text-[#0f5960]"><Spinner size="lg" /></div>
      <div><p className="font-semibold text-slate-800">{label}</p><p className="mt-1 text-sm text-slate-500">Please wait while we load the latest data.</p></div>
    </div>
  );
}

export function EmptyState({ title = "No data found.", message = "Create your first item to get started." }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center p-8 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f5960]/10 text-[#0f5960]"><FolderOpen size={25} /></span>
      <h2 className="mt-4 text-base font-bold text-slate-800">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
