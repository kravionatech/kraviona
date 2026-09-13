"use client";

import React from "react";
import Link from "next/link";

const ComingSoon = ({
  pageName,
  description = "Our MERN stack experts are coding something special for you.",
  expectedDate,
}) => (
  // FIX: Compact size, perfectly centered, accounting for header height (pt-20)
  <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-hero-gradient overflow-hidden pt-20 pb-10">
    {/* Background Patterns */}
    <div
      className="absolute inset-0 z-0 opacity-5"
      style={{
        backgroundImage: "radial-gradient(#0f5960 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    ></div>

    {/* Decorative Glows */}
    <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-[80px]"></div>
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/8 rounded-full blur-[80px]"></div>

    <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl">
      {/* Animated Icon */}
      <div className="mb-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-brand-sm backdrop-blur-lg animate-[slow-bounce_4s_infinite_ease-in-out]">
          <svg
            className="w-8 h-8 text-[#E8622A]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
      </div>

      {/* Brand/Page Label */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-6 h-[2px] bg-[#E8622A]"></span>
        <h2 className="text-[#E8622A] font-bold tracking-[0.3em] uppercase text-[10px]">
          {pageName} Lab
        </h2>
        <span className="w-6 h-[2px] bg-[#E8622A]"></span>
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl md:text-5xl font-black text-dark mb-4 leading-tight tracking-tight">
        Launching <span className="text-[#E8622A]">Soon...</span>
      </h1>

      {/* Description */}
      <p className="text-base md:text-lg text-brand-muted mb-8 font-medium leading-relaxed max-w-xl">
        {description}
      </p>

      {/* Launch Date Indicator */}
      {expectedDate && (
        <div className="mb-8 py-2 px-6 bg-white border border-gray-200 rounded-full shadow-brand-sm">
          <p className="text-[#E8622A] text-xs font-bold tracking-wide">
            PROJECTED LAUNCH:{" "}
            <span className="text-dark ml-2 uppercase font-extrabold">{expectedDate}</span>
          </p>
        </div>
      )}

      {/* Lead Capture Form */}
      <div className="w-full max-w-md bg-white border border-gray-200 p-1.5 rounded-2xl flex flex-col sm:flex-row items-center gap-2 shadow-brand-sm mb-8">
        <input
          type="email"
          aria-label="Work email address"
          placeholder="Work email address"
          className="w-full sm:flex-1 bg-transparent border-none outline-none px-4 py-2 text-dark placeholder:text-gray-400 text-sm font-medium"
        />
        <button
          type="button"
          aria-label="Notify me when this page launches"
          className="w-full sm:w-auto bg-[#E8622A] hover:bg-[#B84A1A] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-brand-sm active:scale-95 uppercase tracking-wider"
        >
          Notify Me
        </button>
      </div>

      {/* Navigation Link (Compact) */}
      <Link
        href="/"
        className="group flex items-center gap-2 text-gray-500 hover:text-[#F28C5E] transition-all duration-300 font-bold uppercase text-[10px] tracking-widest"
      >
        <svg
          className="w-3.5 h-3.5 transform group-hover:-translate-x-1.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Command Center
      </Link>
    </div>

    {/* Internal Style for Keyframes */}
    <style jsx>{`
      @keyframes slow-bounce {
        0%,
        100% {
          transform: translateY(-10%);
        }
        50% {
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
);

export default ComingSoon;
