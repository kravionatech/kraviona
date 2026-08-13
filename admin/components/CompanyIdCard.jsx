"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Printer, ShieldAlert, ShieldCheck, X } from "lucide-react";
import QRCode from "qrcode";

const OFFICIAL_SITE = process.env.NEXT_PUBLIC_OFFICIAL_SITE_URL || "https://kraviona.com";

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "KR";
}

export default function CompanyIdCard({ open, onClose, user, teamMember = null }) {
  const [qrCode, setQrCode] = useState("");
  const account = teamMember?.userID || user || {};
  const member = teamMember || user?.teamMember || null;
  const verified = Boolean(account.isVerified);
  const active = account.isActive !== false && (member?.status || "active") === "active";
  const valid = Boolean(member && verified && active);
  const identity = member?.name || account.name || "Kraviona member";
  const role = account.role || "team member";
  const photo = member?.avatar || account.avatar;
  const employeeId = useMemo(() => `KRV-${String(member?._id || account?._id || "PENDING").slice(-6).toUpperCase()}`, [account?._id, member?._id]);

  useEffect(() => {
    if (!open) return;
    QRCode.toDataURL(OFFICIAL_SITE, { width: 176, margin: 1, color: { dark: "#0d4248", light: "#ffffff" } }).then(setQrCode).catch(() => setQrCode(""));
  }, [open]);

  if (!open) return null;

  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Kraviona company ID card">
    <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#d85e3d]">Kraviona Tech Solutions</p><h2 className="font-black text-[#123f46]">Printable Company ID</h2></div><div className="flex gap-2"><button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0f5960] px-3 text-xs font-bold text-white hover:bg-[#0a454b]"><Printer size={15}/> Print</button><button type="button" onClick={onClose} className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50" aria-label="Close ID card"><X size={17}/></button></div></div>
      <div className="bg-[#edf5f4] p-5 sm:p-7"><article id="kraviona-id-card-print" className="relative overflow-hidden rounded-[26px] bg-[#0d4248] p-5 text-white shadow-xl"><div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#f3bd67]/20 blur-2xl"/><div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-[#d85e3d] via-[#f3bd67] to-[#0f5960]"/><div className="relative"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-2"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/80 bg-gradient-to-br from-white via-[#f8fbfa] to-[#d8e8e6] p-1.5 shadow-lg shadow-black/20"><img src="/brand-logo.png" alt="Kraviona logo" className="h-full w-full object-contain"/></span><div><p className="text-sm font-black tracking-wide">KRAVIONA</p><p className="text-[10px] tracking-wide text-[#f7d994]">TECH SOLUTIONS · TEAM ID</p></div></div><span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wide ${valid ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100" : "border-amber-300/30 bg-amber-300/10 text-amber-100"}`}>{valid ? <CheckCircle2 size={11}/> : <ShieldAlert size={11}/>}{valid ? "Verified" : "Review needed"}</span></div>
        <div className="mt-6 flex items-center gap-4">{photo ? <img src={photo} alt={`${identity} avatar`} className="h-20 w-20 rounded-2xl border-2 border-[#f3bd67]/70 object-cover"/> : <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#f3bd67] text-xl font-black text-[#123f46]">{initials(identity)}</span>}<div className="min-w-0"><h3 className="truncate text-xl font-black">{identity}</h3><p className="mt-1 capitalize text-sm text-[#dcebea]">{member?.designation || account.profile?.jobTitle || role.replace("_", " ")}</p><p className="mt-2 text-[11px] font-bold tracking-[0.14em] text-[#f7d994]">{employeeId}</p></div></div>
        <div className="mt-6 grid grid-cols-[1fr_auto] gap-4 border-t border-white/15 pt-4"><div className="space-y-2 text-xs"><p><span className="text-[#a9c4c7]">Department:</span> <b>{member?.department || account.profile?.department || "Kraviona Team"}</b></p><p><span className="text-[#a9c4c7]">Account:</span> <b className={verified ? "text-emerald-200" : "text-amber-200"}>{verified ? "Verified" : "Unverified"}</b></p><p><span className="text-[#a9c4c7]">Team status:</span> <b className={member ? "text-emerald-200" : "text-amber-200"}>{member ? "Kraviona team member" : "Not linked to team"}</b></p><p><span className="text-[#a9c4c7]">Role:</span> <b className="capitalize">{role.replace("_", " ")}</b></p></div><div className="rounded-xl bg-white p-1.5"><img src={qrCode} alt="QR code to Kraviona official website" className="h-20 w-20"/></div></div><p className="mt-3 flex items-center gap-1 text-[10px] text-[#dcebea]"><ExternalLink size={11}/> Scan QR to visit Kraviona official website.</p></div></article>
        {!valid && <p className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs leading-5 text-amber-900"><ShieldAlert className="mt-0.5 shrink-0" size={15}/> A valid company ID requires an active, verified user account linked to an active Kraviona Team profile.</p>}
      </div></div>
  </div>;
}
