"use client";

/**
 * Three ready-to-use loaders, themed to match Kraviona Admin
 * (dark navy surface + orange accent ring).
 *
 *  <Spinner size="md" />                  → inline spinner, any size
 *  <ButtonSpinner />                      → tiny white spinner for buttons mid-submit
 *  <PageLoader message="Loading posts…" /> → full-screen branded loading state
 */

const SIZES = { sm: 18, md: 32, lg: 48, xl: 72 };

export function Spinner({ size = "md", className = "" }) {
  const px = SIZES[size] || size; // pass a number directly for custom sizes
  return (
    <svg
      className={`animate-spin ${className}`}
      width={px}
      height={px}
      viewBox="0 0 50 50"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      {/* faint track */}
      <circle cx="25" cy="25" r="20" stroke="#1f2c47" strokeWidth="5" />
      {/* glowing accent arc */}
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="url(#kraviona-spinner-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="85 150"
      />
      <defs>
        <linearGradient
          id="kraviona-spinner-grad"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#fb7a3c" />
          <stop offset="100%" stopColor="#fb7a3c" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ButtonSpinner({ className = "" }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PageLoader({
  section = "Blog Engine",
  title = "Blog Posts",
  message = "Fetching the latest data…",
}) {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 bg-surface/95 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <span className="absolute h-20 w-20 animate-ping rounded-full bg-accent/10" />
        <Spinner size="xl" />
      </div>
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-wide text-accent">
          {section}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-1.5 text-sm text-ink-faint">{message}</p>
      </div>
    </div>
  );
}

export default Spinner;
