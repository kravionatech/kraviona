"use client";

import { useEffect, useState } from "react";
import Frame from "@/components/Frame/Frame";
import { apiRequest, formatDate } from "@/components/api";
import Swal from "sweetalert2";

export default function LoginHistoryPage() {
  const [history, setHistory] = useState([]); const [error, setError] = useState("");
  useEffect(() => { apiRequest("/login-history?limit=100").then((result) => setHistory(result.data || [])).catch((err) => { const message = err.message || "Unable to load login history"; setError(message); Swal.fire({ icon: "error", title: "History unavailable", text: message }); }); }, []);
  return <Frame><div className="min-h-full bg-[#f4f6f8] p-6 lg:p-8"><div className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-widest text-[#d26c51]">Security audit</p><h1 className="text-2xl font-bold">Login history</h1><p className="mt-1 text-sm text-slate-500">Super admins see all accounts; every other user sees only their own activity.</p></div>{error ? <p className="mt-5 rounded-lg bg-rose-50 p-3 text-rose-700">{error}</p> : <div className="mt-5 overflow-hidden rounded-xl border bg-white shadow-sm">{history.length ? <table className="min-w-full"><thead className="bg-slate-50 text-left text-xs uppercase text-slate-500"><tr><th className="p-4">Account</th><th className="p-4">Date</th><th className="p-4">IP address</th><th className="p-4">Method</th></tr></thead><tbody>{history.map((item) => <tr key={item._id} className="border-t"><td className="p-4"><div className="flex items-center gap-3">{item.user?.avatar && <img src={item.user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />}<span><b>{item.user?.name || "No data found."}</b><small className="block text-slate-500">{item.user?.email || ""}</small></span></div></td><td className="p-4 text-sm">{formatDate(item.createdAt)} {new Date(item.createdAt).toLocaleTimeString()}</td><td className="p-4 text-sm">{item.ipAddress || "No data found."}</td><td className="p-4 text-sm capitalize">{item.method}</td></tr>)}</tbody></table> : <p className="p-12 text-center text-sm text-slate-500">No data found.</p>}</div>}</div></Frame>;
}
