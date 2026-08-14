"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellOff, Check, Loader2, X } from "lucide-react";

import { API_URL } from "@/utils/api";

const DISMISSED_KEY = "kraviona_blog_push_prompt_dismissed";

const toApplicationServerKey = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const value = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(value);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
};

export default function BlogPushSubscribe() {
  const [supported, setSupported] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const getRegistration = useCallback(async () => {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    await navigator.serviceWorker.ready;
    return registration;
  }, []);

  useEffect(() => {
    const canUsePush =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(canUsePush);

    if (!canUsePush) return undefined;

    let active = true;
    getRegistration()
      .then((registration) => registration.pushManager.getSubscription())
      .then((current) => {
        if (active) setSubscription(current);
      })
      .catch(() => {
        if (active) setStatus("Notifications are unavailable in this browser.");
      });

    return () => {
      active = false;
    };
  }, [getRegistration]);

  useEffect(() => {
    if (
      !supported ||
      window.localStorage.getItem(DISMISSED_KEY) === "true"
    ) {
      return undefined;
    }

    const reveal = () => setExpanded(true);
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.7) reveal();
    };
    const timer = window.setTimeout(reveal, 8000);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supported]);

  const subscribe = async () => {
    try {
      setBusy(true);
      setStatus("");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(
          permission === "denied"
            ? "Notifications are blocked in browser settings."
            : "Permission was not granted.",
        );
        return;
      }

      const keyResponse = await fetch(`${API_URL}/push/blog/public-key`, {
        headers: { Accept: "application/json" },
      });
      const keyResult = await keyResponse.json();
      const publicKey = keyResult?.data?.publicKey;
      if (!keyResponse.ok || !publicKey) {
        throw new Error(keyResult?.message || "Blog alerts are not configured.");
      }

      const registration = await getRegistration();
      const current =
        (await registration.pushManager.getSubscription()) ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toApplicationServerKey(publicKey),
        }));

      const response = await fetch(`${API_URL}/push/blog/subscribe`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: current.toJSON(),
          language: navigator.language || "en-IN",
        }),
      });
      const result = await response.json();
      if (!response.ok || result?.success === false) {
        await current.unsubscribe();
        throw new Error(result?.message || "Unable to enable blog alerts.");
      }

      setSubscription(current);
      setStatus("Blog alerts enabled. You will only receive new article updates.");
    } catch (error) {
      setStatus(error.message || "Unable to enable blog alerts.");
    } finally {
      setBusy(false);
    }
  };

  const unsubscribe = async () => {
    if (!subscription) return;

    try {
      setBusy(true);
      setStatus("");
      const endpoint = subscription.endpoint;

      await fetch(`${API_URL}/push/blog/unsubscribe`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      });
      await subscription.unsubscribe();
      setSubscription(null);
      setStatus("Blog alerts disabled.");
    } catch (error) {
      setStatus(error.message || "Unable to disable blog alerts.");
    } finally {
      setBusy(false);
    }
  };

  const dismiss = () => {
    window.localStorage.setItem(DISMISSED_KEY, "true");
    setExpanded(false);
  };

  if (!supported) return null;

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="fixed bottom-5 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-[#0f5960]/15 bg-white px-4 py-3 text-xs font-black text-[#1A2E33] shadow-[0_14px_40px_rgba(26,46,51,0.16)] transition-transform hover:-translate-y-0.5 sm:left-6"
        aria-label="Open blog notification settings"
      >
        <Bell className="h-4 w-4 text-[#E8622A]" />
        Blog alerts
      </button>
    );
  }

  return (
    <aside className="fixed bottom-5 left-4 z-40 w-[min(370px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#0f5960]/15 bg-white shadow-[0_20px_60px_rgba(26,46,51,0.2)] sm:left-6">
      <div className="bg-gradient-to-br from-[#123f44] to-[#0f5960] p-5 text-white">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          aria-label="Close blog notification prompt"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3 pr-8">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#E8622A]">
            {subscription ? <Check className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F6A27D]">
              Kraviona Blog
            </p>
            <h2 className="mt-1 text-lg font-black">
              {subscription ? "Article alerts are on" : "Never miss a new article"}
            </h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/75">
          Browser notification sirf new Kraviona blog publish hone par milega.
          No promotional spam.
        </p>
      </div>

      <div className="p-4">
        {status && (
          <p className="mb-3 rounded-xl bg-[#F5F7F8] px-3 py-2.5 text-xs font-semibold leading-5 text-[#2A4A52]" role="status">
            {status}
          </p>
        )}
        <button
          type="button"
          onClick={subscription ? unsubscribe : subscribe}
          disabled={busy}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            subscription
              ? "bg-[#2A4A52] hover:bg-[#1A2E33]"
              : "bg-[#E8622A] hover:bg-[#B84A1A]"
          }`}
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : subscription ? (
            <BellOff className="h-4 w-4" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {busy
            ? "Please wait…"
            : subscription
              ? "Turn off blog alerts"
              : "Enable blog alerts"}
        </button>
      </div>
    </aside>
  );
}
