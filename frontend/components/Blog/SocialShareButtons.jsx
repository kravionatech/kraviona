"use client";

import React, { useState } from "react";
import { Share2, Link as LinkIcon, Check } from "lucide-react";

export default function SocialShareButtons({ url, title, dark = false }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url || (typeof window !== "undefined" ? window.location.href : "https://kraviona.com"));
  const encodedTitle = encodeURIComponent(title || "Check out this article on Kraviona");

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-[#25D366]/20 hover:text-[#25D366] hover:border-[#25D366]/40",
      label: "Share on WhatsApp",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.476-.15-.677.15-.2.3-.777.978-.952 1.178-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.786-1.68-2.086-.176-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.234-.244-.588-.493-.509-.677-.518-.175-.009-.376-.009-.577-.009s-.527.075-.802.376c-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.229 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.378.197 1.897.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.98.58 3.82 1.58 5.37L2 22l4.78-1.54c1.5 1 3.28 1.58 5.26 1.58 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0077B5]/20 hover:text-[#0077B5] hover:border-[#0077B5]/40",
      label: "Share on LinkedIn",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0-.01-3.18 1.59 1.59 0 0 0 .01 3.18m1.4 9.74v-8.37H5.06v8.37h2.8z"/>
        </svg>
      ),
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-white/20 hover:text-white hover:border-white/40",
      label: "Share on X",
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ];

  const baseBtn = dark
    ? "border-white/10 bg-white/5 text-white/70"
    : "border-gray-200 bg-white text-gray-600 shadow-sm";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${dark ? "text-white/40" : "text-gray-400"}`}>
        <Share2 size={13} />
        Share:
      </span>

      {shareLinks.map((item) => (
        <a
          key={item.name}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={`inline-flex items-center justify-center h-8 w-8 rounded-full border transition-all duration-200 ${baseBtn} ${item.color}`}
        >
          {item.icon}
        </a>
      ))}

      <button
        onClick={handleCopy}
        aria-label="Copy link to clipboard"
        className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full border text-xs font-semibold transition-all duration-200 ${baseBtn} hover:border-[#E8622A]/50 hover:text-[#E8622A]`}
      >
        {copied ? (
          <>
            <Check size={13} className="text-emerald-500" />
            <span className="text-emerald-500 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon size={13} />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
