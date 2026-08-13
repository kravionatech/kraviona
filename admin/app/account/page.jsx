"use client";

import { useEffect, useState } from "react";
import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import Swal from "sweetalert2";
import { ContentLoader, EmptyState } from "@/components/AsyncState";

export default function AccountPage() {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  useEffect(() => { apiRequest("/me").then((result) => setUser(result.data || null)).catch((err) => { const message = err.message || "Unable to load account details"; setError(message); Swal.fire({ icon: "error", title: "Profile unavailable", text: message }); }).finally(() => setLoading(false)); }, []);
  return <Frame><div className="min-h-full bg-[#edf5f4] p-5 sm:p-6 lg:p-8"><div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-[#0f5960]/20 bg-white shadow-sm"><div className="border-b border-[#0f5960]/15 bg-[#e7f1f0] p-6"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d85e3d]">Your profile</p><h1 className="mt-1 text-2xl font-bold text-slate-900">My account</h1><p className="mt-1 text-sm text-slate-500">Your account and access details.</p></div>{loading ? <ContentLoader label="Loading your account…" /> : error ? <p className="m-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : !user ? <EmptyState message="Your account details are not available yet." /> : <div className="p-6"><div className="flex flex-col gap-6 sm:flex-row">{user.avatar ? <img src={user.avatar} alt={`${user.name} avatar`} className="h-24 w-24 rounded-2xl object-cover ring-4 ring-[#e7f1f0]" /> : <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#0f5960] text-2xl font-bold text-white">{user.name?.slice(0, 2).toUpperCase()}</div>}<dl className="grid flex-1 grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">{[["Name", user.name], ["Email", user.email], ["Username", `@${user.username}`], ["Phone", user.phone], ["Role", user.role?.replace("_", " ")], ["Joined", formatDate(user.createdAt)], ["Last login", formatDate(user.lastLoginAt, "No data found.")], ["Job title", user.profile?.jobTitle || "No data found."]].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</dt><dd className="mt-1 font-medium capitalize text-slate-800">{value || "No data found."}</dd></div>)}</dl></div></div>}</div></div></Frame>;
}
