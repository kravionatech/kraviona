"use client";

import { useEffect, useState } from "react";
import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import Swal from "sweetalert2";

export default function AccountPage() {
  const [user, setUser] = useState(null); const [error, setError] = useState("");
  useEffect(() => { apiRequest("/me").then((result) => setUser(result.data || null)).catch((err) => { const message = err.message || "Unable to load account details"; setError(message); Swal.fire({ icon: "error", title: "Profile unavailable", text: message }); }); }, []);
  return <Frame><div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8"><div className="mx-auto max-w-3xl rounded-xl border bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">Your profile</p><h1 className="mt-1 text-2xl font-bold">My account</h1>{error ? <p className="mt-6 text-rose-700">{error}</p> : !user ? <p className="mt-6 text-slate-500">No data found.</p> : <div className="mt-6 flex flex-col gap-6 sm:flex-row"><>{user.avatar ? <img src={user.avatar} alt={`${user.name} avatar`} className="h-24 w-24 rounded-full object-cover" /> : <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#235056] text-2xl font-bold text-white">{user.name?.slice(0, 2).toUpperCase()}</div>}</><dl className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">{[["Name", user.name], ["Email", user.email], ["Username", `@${user.username}`], ["Phone", user.phone], ["Role", user.role?.replace("_", " ")], ["Joined", formatDate(user.createdAt)], ["Last login", formatDate(user.lastLoginAt, "No data found.")], ["Job title", user.profile?.jobTitle || "No data found."]].map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase text-slate-400">{label}</dt><dd className="mt-1 font-medium text-slate-800">{value || "No data found."}</dd></div>)}</dl></div>}</div></div></Frame>;
}
