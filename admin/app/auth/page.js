"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { ArrowRight, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

async function readJson(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function persistAuthCookies(data) {
  // SameSite=Strict: cookie only sent on same-site requests (more secure).
  // Do NOT use encodeURIComponent – JWT values are already URL-safe Base64
  // and double-encoding corrupts the token when the server decodes it.
  const cookieOptions = "path=/; SameSite=Lax";

  document.cookie = `adminSession=1; ${cookieOptions}`;

  if (data?.accessToken) {
    document.cookie = `accessToken=${data.accessToken}; ${cookieOptions}`;
  }

  if (data?.refreshToken) {
    document.cookie = `refreshToken=${data.refreshToken}; ${cookieOptions}`;
  }
}

export default function AuthPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const baseurl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!identifier.trim() || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing details",
        text: "Please enter your email or username and password.",
      });
      return;
    }

    if (!baseurl) {
      Swal.fire({
        icon: "error",
        title: "Auth API not configured",
        text: "NEXT_PUBLIC_API_URL is missing.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${baseurl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(data.message || `Login failed with status: ${res.status}`);
      }

      persistAuthCookies(data);

      await Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: "Logged in successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      router.replace("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0a1018] p-4 font-sans sm:p-8">
      <div className="absolute left-[-12%] top-[-16%] h-[34rem] w-[34rem] rounded-full bg-[#49b9ad] opacity-15 blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#d26c51] opacity-15 blur-[150px]" />
      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#111b28]/85 shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden min-h-[620px] flex-col justify-between border-r border-white/[0.08] bg-gradient-to-br from-[#12353a] via-[#102a32] to-[#0d1520] p-10 lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f3c78e] to-[#d26c51] text-lg font-black text-[#0a1018]">K</span>
              <span className="text-sm font-black tracking-[0.22em] text-white">KRAVIONA</span>
            </div>
            <div className="mt-24 max-w-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#70d2c7]/25 bg-[#70d2c7]/10 px-3 py-1.5 text-xs font-semibold text-[#9ce5dc]"><ShieldCheck size={14} /> Secure workspace</span>
              <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white">Run your content and growth from one calm command center.</h1>
              <p className="mt-5 text-sm leading-6 text-slate-300">Review activity, publish content, respond to leads, and keep your team aligned without the clutter.</p>
            </div>
          </div>
          <p className="text-xs text-slate-400">Kraviona Admin · Protected access</p>
        </section>

        <section className="p-7 sm:p-10 lg:p-12">
          <div className="mb-9">
            <div className="flex items-center gap-3 lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#f3c78e] to-[#d26c51] text-base font-black text-[#0a1018]">K</span>
              <span className="text-sm font-black tracking-[0.18em] text-white">KRAVIONA</span>
            </div>
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#f0a46f] lg:mt-0">Admin portal</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-400">Sign in to continue to your workspace.</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Email / Username
              </label>
              <div className="relative"><UserRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input value={identifier} onChange={(event) => setIdentifier(event.target.value)} type="text" placeholder="name@company.com" name="identifier" autoComplete="username" className="w-full rounded-xl border border-white/10 bg-[#0d1520] py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#70d2c7]/70 focus:ring-4 focus:ring-[#49b9ad]/10" /></div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">
                Password
              </label>
              <div className="relative"><LockKeyhole size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" /><input type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="w-full rounded-xl border border-white/10 bg-[#0d1520] py-3 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#70d2c7]/70 focus:ring-4 focus:ring-[#49b9ad]/10" /></div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#49b9ad] p-3 text-sm font-black text-[#071216] shadow-lg shadow-[#49b9ad]/15 transition hover:bg-[#70d2c7] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : <>Sign in <ArrowRight size={17} /></>}
            </button>
          </form>
          <p className="mt-7 text-center text-xs text-slate-500">Authorized administrators only. Your session is protected.</p>
        </section>
      </div>
    </div>
  );
}
