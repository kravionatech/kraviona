"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, BellOff, Check, Loader2, X } from "lucide-react";

import { API_URL } from "@/utils/api";

const DISMISSED_KEY = "kraviona_blog_push_prompt_dismissed";
const REQUEST_TIMEOUT_MS = 8000;

const toApplicationServerKey = (base64) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const value = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(value);
  return Uint8Array.from([...raw].map((character) => character.charCodeAt(0)));
};

const applicationServerKeysMatch = (subscription, expectedKey) => {
  const currentKey = subscription?.options?.applicationServerKey;
  if (!currentKey) return true;

  const currentBytes = new Uint8Array(currentKey);
  return (
    currentBytes.length === expectedKey.length &&
    currentBytes.every((value, index) => value === expectedKey[index])
  );
};

const requestJson = async (url, options = {}) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    const result = await response.json().catch(() => ({}));
    return { response, result };
  } finally {
    window.clearTimeout(timeout);
  }
};

const saveSubscription = async (current) => {
  const { response, result } = await requestJson(
    `${API_URL}/push/blog/subscribe`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscription: current.toJSON(),
        language: navigator.language || "en-IN",
      }),
    },
  );

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || "Unable to enable blog alerts.");
  }
};

export default function BlogPushSubscribe() {
  const [supported, setSupported] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [publicKey, setPublicKey] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const getRegistration = useCallback(async () => {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    return navigator.serviceWorker.ready;
  }, []);

  useEffect(() => {
    const canUsePush =
      window.isSecureContext &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    if (!canUsePush) return undefined;

    let active = true;
    const initialize = async () => {
      try {
        // Do not ask for notification permission when the backend is not
        // configured. Production returns 503 here until VAPID keys exist.
        const { response, result } = await requestJson(
          `${API_URL}/push/blog/public-key`,
          { headers: { Accept: "application/json" } },
        );
        const nextPublicKey = result?.data?.publicKey;
        if (!response.ok || !nextPublicKey) return;

        const expectedKey = toApplicationServerKey(nextPublicKey);
        const registration = await getRegistration();
        let current = await registration.pushManager.getSubscription();

        // A subscription created with an old VAPID key can never receive a
        // push signed by the current private key. Remove it so the next user
        // action creates a healthy subscription.
        if (current && !applicationServerKeysMatch(current, expectedKey)) {
          const oldEndpoint = current.endpoint;
          await current.unsubscribe();
          current = null;
          void requestJson(`${API_URL}/push/blog/unsubscribe`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ endpoint: oldEndpoint }),
          }).catch(() => null);
        }

        if (!active) return;
        setPublicKey(nextPublicKey);
        setSubscription(current);
        setSupported(true);

        // Restore the backend record after a database restore or deployment
        // without forcing the visitor to opt in a second time.
        if (current) {
          void saveSubscription(current).catch(() => {
            if (active) {
              setStatus("Alerts are on in this browser, but sync is pending.");
            }
          });
        }
      } catch (error) {
        if (active && error?.name !== "AbortError") {
          setStatus("Notifications are temporarily unavailable.");
        }
      }
    };

    void initialize();

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

      if (!publicKey) throw new Error("Blog alerts are not configured.");

      const registration = await getRegistration();
      let current = await registration.pushManager.getSubscription();
      let createdHere = false;

      if (!current) {
        current = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toApplicationServerKey(publicKey),
        });
        createdHere = true;
      }

      try {
        await saveSubscription(current);
      } catch (error) {
        // Do not destroy a previously healthy browser subscription because of
        // a temporary API failure. Only roll back a subscription made now.
        if (createdHere) await current.unsubscribe().catch(() => null);
        throw error;
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

      await subscription.unsubscribe();
      setSubscription(null);
      setStatus("Blog alerts disabled.");

      // Local unsubscribe is authoritative for the visitor. Server cleanup is
      // best-effort; an unreachable stale endpoint is also removed on 404/410.
      void requestJson(`${API_URL}/push/blog/unsubscribe`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      }).catch(() => null);
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
