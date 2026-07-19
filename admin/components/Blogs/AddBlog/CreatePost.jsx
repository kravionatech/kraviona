"use client";
import React from "react";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import TextEditor from "./TextEditor"; // ← your Quill-based editor
import {
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Search,
  Image,
  Video,
  Settings,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Send,
  Globe,
  Link2,
  Tag,
  Hash,
  BarChart2,
  BookOpen,
  CalendarClock,
} from "lucide-react";

// ─── Utilities ────────────────────────────────────────────────────────────────
const slugify = (str) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const cx = (...classes) => classes.filter(Boolean).join(" ");

const toDateTimeLocalValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
};

// ─── Design tokens ────────────────────────────────────────────────────────────
// ink-900 #0F1117 | ink-600 #3D4152 | ink-400 #6B7080 | ink-200 #D1D5E0
// surf #F7F8FA | white #FFFFFF
// accent-blue #2563EB | accent-green #16A34A | accent-amber #D97706
// accent-red #DC2626

// ─── Primitive: Input ─────────────────────────────────────────────────────────
const Input = React.forwardRef(
  ({ className, error, prefix, suffix, ...props }, ref) => (
    <div className={cx("relative flex items-center", className)}>
      {prefix && (
        <span className="absolute left-3 text-xs text-gray-400 font-medium pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        ref={ref}
        {...props}
        className={cx(
          "w-full h-10 text-sm text-gray-900 bg-white border rounded-lg outline-none transition-all placeholder:text-gray-400",
          prefix ? "pl-[calc(0.75rem+var(--prefix-w,4.5rem))]" : "pl-3",
          suffix ? "pr-10" : "pr-3",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50",
        )}
      />
      {suffix && (
        <span className="absolute right-3 text-gray-400 pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  ),
);
Input.displayName = "Input";

const Textarea = ({ className, error, rows = 3, ...props }) => (
  <textarea
    rows={rows}
    {...props}
    className={cx(
      "w-full text-sm text-gray-900 bg-white border rounded-lg outline-none transition-all placeholder:text-gray-400 px-3 py-2.5 resize-y leading-relaxed",
      error
        ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50",
      className,
    )}
  />
);

// ─── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  label,
  required,
  hint,
  error,
  children,
  count,
  max,
  className,
}) => (
  <div className={cx("flex flex-col gap-1.5", className)}>
    {label && (
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {max != null && (
          <span
            className={cx(
              "text-xs tabular-nums",
              count > max * 0.9
                ? "text-amber-500 font-semibold"
                : "text-gray-400",
            )}
          >
            {count ?? 0}/{max}
          </span>
        )}
      </div>
    )}
    {children}
    {error ? (
      <p className="text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={11} /> {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-gray-400">{hint}</p>
    ) : null}
  </div>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange, label, description }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative mt-0.5 w-9 h-5 rounded-full transition-all duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
        checked ? "bg-blue-600" : "bg-gray-200",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
    {(label || description) && (
      <div>
        {label && (
          <p className="text-sm font-medium text-gray-700 leading-5">{label}</p>
        )}
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
    )}
  </label>
);

// ─── Dropdown ─────────────────────────────────────────────────────────────────
const Dropdown = ({
  value,
  options,
  onChange,
  placeholder = "Select…",
  error,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find(
    (o) => (typeof o === "object" ? o.value : o) === value,
  );
  const label = selected
    ? typeof selected === "object"
      ? selected.label
      : selected
    : null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cx(
          "w-full h-10 flex justify-between items-center px-3 text-sm rounded-lg border transition-all capitalize",
          error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white",
          open
            ? "border-blue-500 ring-2 ring-blue-50"
            : "hover:border-gray-300",
        )}
      >
        <span className={label ? "text-gray-900" : "text-gray-400"}>
          {label || placeholder}
        </span>
        {open ? (
          <ChevronUp size={15} className="text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="absolute top-full mt-1 left-0 w-full z-50 max-h-52 bg-white border border-gray-200 shadow-2xl rounded-xl overflow-y-auto">
          {options.map((opt, i) => {
            const val = typeof opt === "object" ? opt.value : opt;
            const lbl = typeof opt === "object" ? opt.label : opt;
            const active = value === val;
            return (
              <div
                key={i}
                onClick={() => {
                  onChange(val);
                  setOpen(false);
                }}
                className={cx(
                  "px-3 py-2.5 text-sm cursor-pointer capitalize transition-colors flex items-center justify-between",
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50",
                )}
              >
                {lbl}
                {active && <CheckCircle2 size={14} className="text-blue-600" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Tag Input ────────────────────────────────────────────────────────────────
const TagInput = ({
  tags,
  setTags,
  placeholder = "Type and press Enter",
  error,
}) => {
  const [input, setInput] = useState("");

  const add = (val) => {
    const clean = val.trim().toLowerCase().replace(/,/g, "");
    if (clean && !tags.includes(clean)) setTags([...tags, clean]);
    setInput("");
  };

  const remove = (i) => setTags(tags.filter((_, idx) => idx !== i));

  return (
    <div
      className={cx(
        "min-h-[42px] flex flex-wrap gap-1.5 items-center p-2 border rounded-lg bg-white cursor-text transition-all",
        error
          ? "border-red-400 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-100"
          : "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50",
      )}
      onClick={(e) => e.currentTarget.querySelector("input")?.focus()}
    >
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-200"
        >
          {tag}
          <button
            type="button"
            onClick={() => remove(i)}
            className="hover:text-blue-900 ml-0.5"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add(input);
          }
          if (e.key === "Backspace" && !input && tags.length)
            remove(tags.length - 1);
        }}
        onBlur={() => input.trim() && add(input)}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="outline-none bg-transparent text-sm text-gray-700 placeholder-gray-400 min-w-[120px] flex-1 py-0.5"
      />
    </div>
  );
};

// ─── Section Heading ──────────────────────────────────────────────────────────
const SectionHeading = ({ icon: Icon, children, description }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon size={15} className="text-blue-600" />}
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        {children}
      </h3>
    </div>
    {description && <p className="text-xs text-gray-400 pl-5">{description}</p>}
    <div className="h-px bg-gray-100 mt-3" />
  </div>
);

// ─── Char-bar ─────────────────────────────────────────────────────────────────
const CharBar = ({ value, min, ideal, max }) => {
  const len = value?.length ?? 0;
  const pct = Math.min((len / max) * 100, 100);
  const color =
    len < min
      ? "#D97706"
      : len <= ideal
        ? "#16A34A"
        : len <= max
          ? "#D97706"
          : "#DC2626";
  const label =
    len < min
      ? "Too short"
      : len <= ideal
        ? "Good"
        : len <= max
          ? "Getting long"
          : "Too long";
  return (
    <div className="space-y-1">
      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span style={{ color }}>{label}</span>
        <span className="text-gray-400 tabular-nums">
          {len}/{max}
        </span>
      </div>
    </div>
  );
};

// ─── SERP Preview ─────────────────────────────────────────────────────────────
const SerpPreview = ({ title, description, url }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
      SERP preview
    </p>
    <div className="flex items-center gap-2 mb-1">
      <div className="w-4 h-4 rounded-full bg-gray-200" />
      <p className="text-xs text-gray-500">
        {url || "https://yoursite.com/blog/your-slug"}
      </p>
    </div>
    <p className="text-base font-medium text-blue-700 leading-snug truncate">
      {title || "Your meta title will appear here"}
    </p>
    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
      {description ||
        "Your meta description will appear here. Make it compelling and around 150–160 characters."}
    </p>
  </div>
);

// ─── OG Preview ──────────────────────────────────────────────────────────────
const OgPreview = ({ title, description, image }) => (
  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider p-3 pb-2">
      OG card preview
    </p>
    {image ? (
      <img
        src={image}
        alt=""
        className="w-full h-32 object-cover"
        onError={(e) => (e.target.style.display = "none")}
      />
    ) : (
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
        <Image size={24} className="text-gray-400" />
      </div>
    )}
    <div className="p-3">
      <p className="text-xs text-gray-400 uppercase tracking-wide">
        yoursite.com
      </p>
      <p className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-1">
        {title || "OG Title"}
      </p>
      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
        {description || "OG Description"}
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: BLOG DETAILS
// ═══════════════════════════════════════════════════════════════════════════════
const BlogDetailsTab = ({ data, setData, errors }) => {
  const [categories, setCategories] = useState([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`)
      .then((r) => r.json())
      .then((j) => setCategories(j.data || []))
      .catch(() => {});
  }, []);

  const set = (key) => (val) => setData((p) => ({ ...p, [key]: val }));
  const setNested = (parent, key) => (val) =>
    setData((p) => ({ ...p, [parent]: { ...p[parent], [key]: val } }));

  const handleTitle = (val) => {
    setData((p) => ({ ...p, title: val, slug: slugify(val) }));
  };

  return (
    <div className="space-y-10">
      {/* ── Core ── */}
      <div>
        <SectionHeading
          icon={FileText}
          description="The essential fields that define your post"
        >
          Core content
        </SectionHeading>

        <div className="space-y-5">
          {/* Title */}
          <Field
            label="Title"
            required
            error={errors.title}
            count={data.title.length}
            max={200}
          >
            <Input
              value={data.title}
              onChange={(e) => handleTitle(e.target.value)}
              placeholder="Getting Started with Node.js and Express"
              error={errors.title}
              maxLength={200}
            />
          </Field>

          {/* Slug */}
          <Field
            label="Slug"
            required
            error={errors.slug}
            hint="Auto-generated from title — edit if needed"
          >
            <div
              className={cx(
                "flex h-10 border rounded-lg overflow-hidden transition-all",
                errors.slug
                  ? "border-red-400"
                  : "border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50",
              )}
            >
              <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-xs text-gray-400 font-medium whitespace-nowrap">
                /blog/
              </span>
              <input
                type="text"
                value={data.slug}
                onChange={(e) =>
                  set("slug")(
                    e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                  )
                }
                placeholder="your-post-slug"
                className="flex-1 px-3 text-sm text-gray-900 bg-white outline-none"
              />
            </div>
          </Field>

          {/* Excerpt */}
          <Field
            label="Excerpt"
            required
            error={errors.excerpt}
            count={data.excerpt.length}
            max={200}
          >
            <Textarea
              value={data.excerpt}
              onChange={(e) => set("excerpt")(e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="A concise, compelling summary shown in post listings and used as a fallback meta description."
              error={errors.excerpt}
            />
          </Field>

          {/* Quick Answer */}
          <Field
            label="Quick answer"
            hint="AEO — direct answer shown at the top of post (featured snippet bait)"
          >
            <Textarea
              value={data.quickAnswer}
              onChange={(e) => set("quickAnswer")(e.target.value)}
              rows={2}
              placeholder="In 1–2 sentences, directly answer the core question this post targets."
            />
          </Field>

          {/* Category + Topic Cluster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Category" required error={errors.category}>
              <Dropdown
                value={data.category}
                options={categories.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
                onChange={set("category")}
                placeholder="Select category"
                error={errors.category}
              />
            </Field>
            <Field
              label="Primary topic cluster"
              required
              error={errors.primaryTopicCluster}
              hint="e.g. nodejs-development"
            >
              <Input
                value={data.primaryTopicCluster}
                onChange={(e) => set("primaryTopicCluster")(e.target.value)}
                placeholder="nodejs-development"
                error={errors.primaryTopicCluster}
              />
            </Field>
          </div>

          {/* Supporting Topic Clusters */}
          <Field
            label="Supporting topic clusters"
            hint="Secondary topic clusters this post belongs to"
          >
            <TagInput
              tags={data.supportingTopicClusters}
              setTags={set("supportingTopicClusters")}
              placeholder="express, rest-api, backend…"
            />
          </Field>

          {/* Key Takeaways */}
          <Field
            label="Key takeaways"
            hint="Bullet-point highlights — shown at top of post"
          >
            <KeyTakeawayEditor
              items={data.keyTakeaways}
              setItems={set("keyTakeaways")}
            />
          </Field>
        </div>
      </div>

      {/* ── Content ── */}
      <div>
        <SectionHeading icon={BookOpen}>Post content</SectionHeading>
        {/*
          TextEditor applies `max-w-6xl mx-auto mt-10` on its root div.
          The wrapper below resets those so it sits flush inside the section.
        */}
        <div
          className={cx(
            "[&_.ql-container]:min-h-[420px] [&_.ql-editor]:min-h-[420px]",
            "[&>div]:mt-0 [&>div]:max-w-none [&>div]:mx-0",
            "border rounded-xl overflow-hidden",
            errors.content ? "border-red-400" : "border-gray-200",
          )}
        >
          <TextEditor content={data.content} setContent={set("content")} />
        </div>
        {errors.content && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle size={11} /> {errors.content}
          </p>
        )}
      </div>

      {/* ── Featured Image ── */}
      <div>
        <SectionHeading
          icon={Image}
          description="Appears in post headers, social shares, and listing cards"
        >
          Featured image <span className="text-red-500">*</span>
        </SectionHeading>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Field label="Image URL" required error={errors.featuredImageUrl}>
              <Input
                type="url"
                value={data.featuredImage.url}
                onChange={(e) => {
                  setImgError(false);
                  setNested("featuredImage", "url")(e.target.value);
                }}
                placeholder="https://cdn.example.com/image.webp"
                error={errors.featuredImageUrl}
              />
            </Field>
            <Field
              label="Alt text"
              hint="Defaults to first focus keyword if blank — affects SEO & accessibility"
            >
              <Input
                value={data.featuredImage.altText}
                onChange={(e) =>
                  setNested("featuredImage", "altText")(e.target.value)
                }
                placeholder="Descriptive alt text"
              />
            </Field>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Width (px)", "width", "1200"],
                ["Height (px)", "height", "630"],
                ["Size (bytes)", "sizeInBytes", "204800"],
              ].map(([lbl, key, ph]) => (
                <Field key={key} label={lbl}>
                  <Input
                    type="number"
                    value={data.featuredImage[key] || ""}
                    onChange={(e) =>
                      setNested(
                        "featuredImage",
                        key,
                      )(Number(e.target.value) || undefined)
                    }
                    placeholder={ph}
                  />
                </Field>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Preview
            </p>
            <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 overflow-hidden aspect-video flex items-center justify-center">
              {data.featuredImage.url && !imgError ? (
                <img
                  src={data.featuredImage.url}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="text-center space-y-1">
                  <Image size={24} className="text-gray-300 mx-auto" />
                  <p className="text-xs text-gray-400">No image</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Recommended 1200×630px
            </p>
          </div>
        </div>
      </div>

      {/* ── Video ── */}
      <div>
        <SectionHeading icon={Video}>Video (optional)</SectionHeading>
        <div className="mb-4">
          <Toggle
            checked={data.videoEmbedded.hasVideo}
            onChange={(v) =>
              setData((p) => ({
                ...p,
                videoEmbedded: { ...p.videoEmbedded, hasVideo: v },
              }))
            }
            label="This post has an embedded video"
            description="Enables VideoObject schema markup for better SERP visibility"
          />
        </div>
        {data.videoEmbedded.hasVideo && (
          <div className="pl-4 border-l-2 border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              [
                "Video embed URL",
                "videoUrl",
                "url",
                "https://youtube.com/embed/...",
              ],
              [
                "Thumbnail URL",
                "thumbnailUrl",
                "url",
                "https://img.youtube.com/vi/.../hqdefault.jpg",
              ],
              [
                "Video name",
                "name",
                "text",
                "Tutorial: Getting started with Node.js",
              ],
              ["Duration (ISO 8601)", "duration", "text", "PT5M30S"],
            ].map(([lbl, key, type, ph]) => (
              <Field
                key={key}
                label={lbl}
                hint={key === "duration" ? "PT5M30S = 5 min 30 sec" : undefined}
              >
                <Input
                  type={type}
                  value={data.videoEmbedded[key] || ""}
                  onChange={(e) =>
                    setData((p) => ({
                      ...p,
                      videoEmbedded: {
                        ...p.videoEmbedded,
                        [key]: e.target.value,
                      },
                    }))
                  }
                  placeholder={ph}
                />
              </Field>
            ))}
          </div>
        )}
      </div>

      {/* ── Sources & Statistics ── */}
      <div>
        <SectionHeading
          icon={BarChart2}
          description="E-E-A-T signals — adds credibility and schema support"
        >
          Sources & statistics
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ArrayEditor
            label="Sources"
            items={data.sources}
            setItems={set("sources")}
            fieldDefs={[
              {
                key: "name",
                placeholder: "MDN Web Docs",
                label: "Source name",
              },
              {
                key: "url",
                placeholder: "https://developer.mozilla.org",
                label: "URL",
                type: "url",
              },
              {
                key: "publishedDate",
                placeholder: "2024-01-15",
                label: "Published date",
              },
            ]}
          />
          <ArrayEditor
            label="Statistics"
            items={data.statistics}
            setItems={set("statistics")}
            fieldDefs={[
              {
                key: "stat",
                placeholder: "75% of companies use Node.js",
                label: "Statistic",
              },
              {
                key: "source",
                placeholder: "Stack Overflow Survey 2024",
                label: "Source",
              },
              { key: "year", placeholder: "2024", label: "Year" },
            ]}
          />
        </div>
      </div>

      {/* ── Settings ── */}
      <div>
        <SectionHeading icon={Settings}>Post settings</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Toggle
              checked={data.isCommentEnabled}
              onChange={set("isCommentEnabled")}
              label="Comments enabled"
              description="Allow readers to leave comments on this post"
            />
            <Toggle
              checked={data.isAccessibleForFree}
              onChange={set("isAccessibleForFree")}
              label="Accessible for free"
              description="Affects Article schema's isAccessibleForFree property"
            />
          </div>
          <div className="space-y-4">
            <Field label="Content source type">
              <div className="flex gap-2 flex-wrap">
                {["Human", "AI-Assisted", "AI-Generated"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set("contentSourceType")(type)}
                    className={cx(
                      "px-4 py-1.5 text-xs font-semibold rounded-full border transition-all",
                      data.contentSourceType === type
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Schema type">
              <Dropdown
                value={data.schemaType}
                options={[
                  { value: "Article", label: "Article" },
                  { value: "BlogPosting", label: "Blog Posting" },
                  { value: "NewsArticle", label: "News Article" },
                  { value: "HowTo", label: "How-To" },
                  { value: "FAQPage", label: "FAQ Page" },
                ]}
                onChange={set("schemaType")}
                placeholder="BlogPosting (default)"
              />
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Key Takeaways Editor ─────────────────────────────────────────────────────
const KeyTakeawayEditor = ({ items, setItems }) => {
  const add = () => setItems([...items, ""]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, val) =>
    setItems(items.map((item, idx) => (idx === i ? val : item)));

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <span className="text-xs font-bold text-blue-600 w-5 text-center flex-shrink-0">
            {i + 1}
          </span>
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={`Takeaway ${i + 1}`}
            className="flex-1"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors mt-1"
      >
        <Plus size={13} /> Add takeaway
      </button>
    </div>
  );
};

// ─── Generic Array Editor ─────────────────────────────────────────────────────
const ArrayEditor = ({ label, items, setItems, fieldDefs }) => {
  const add = () =>
    setItems([...items, Object.fromEntries(fieldDefs.map((f) => [f.key, ""]))]);
  const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
  const update = (i, key, val) =>
    setItems(
      items.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)),
    );

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {label}
      </p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-3 space-y-2 relative bg-gray-50"
          >
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-2.5 right-2.5 text-gray-300 hover:text-red-500 transition-colors"
            >
              <X size={13} />
            </button>
            {fieldDefs.map((f) => (
              <div key={f.key}>
                <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                <Input
                  type={f.type || "text"}
                  value={item[f.key] || ""}
                  onChange={(e) => update(i, f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="pr-6"
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Plus size={13} /> Add {label.toLowerCase().replace(/s$/, "")}
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TAB: SEO & META
// ═══════════════════════════════════════════════════════════════════════════════
const SeoTab = ({ data, setData, errors }) => {
  const set = (key) => (val) => setData((p) => ({ ...p, [key]: val }));

  const addFaq = () =>
    setData((p) => ({
      ...p,
      faqSchema: [...p.faqSchema, { question: "", answer: "" }],
    }));
  const removeFaq = (i) =>
    setData((p) => ({
      ...p,
      faqSchema: p.faqSchema.filter((_, idx) => idx !== i),
    }));
  const updateFaq = (i, field, val) =>
    setData((p) => ({
      ...p,
      faqSchema: p.faqSchema.map((f, idx) =>
        idx === i ? { ...f, [field]: val } : f,
      ),
    }));

  return (
    <div className="space-y-10">
      {/* ── SERP Preview ── */}
      <SerpPreview
        title={data.metaTitle || data.title}
        description={data.metaDescription || data.excerpt}
        url={data.canonicalUrl}
      />

      {/* ── Meta Tags ── */}
      <div>
        <SectionHeading
          icon={Search}
          description="Controls how this post appears in search engine results"
        >
          Meta tags
        </SectionHeading>
        <div className="space-y-5">
          <Field label="Meta title" required error={errors.metaTitle}>
            <Input
              value={data.metaTitle}
              onChange={(e) => set("metaTitle")(e.target.value)}
              placeholder={
                data.title || "Your SEO title — 50–60 characters ideal"
              }
              error={errors.metaTitle}
            />
            <CharBar value={data.metaTitle} min={30} ideal={60} max={100} />
          </Field>
          <Field
            label="Meta description"
            required
            error={errors.metaDescription}
          >
            <Textarea
              value={data.metaDescription}
              onChange={(e) => set("metaDescription")(e.target.value)}
              rows={3}
              placeholder={
                data.excerpt ||
                "Compelling description — 150–160 characters ideal"
              }
              error={errors.metaDescription}
            />
            <CharBar
              value={data.metaDescription}
              min={100}
              ideal={160}
              max={200}
            />
          </Field>
          <Field
            label="Canonical URL"
            required
            error={errors.canonicalUrl}
            hint="Set to the primary URL for this content to avoid duplicate content issues"
          >
            <Input
              type="url"
              value={data.canonicalUrl}
              onChange={(e) => set("canonicalUrl")(e.target.value)}
              placeholder="https://yoursite.com/blog/your-post-slug"
              error={errors.canonicalUrl}
              suffix={<Link2 size={14} />}
            />
          </Field>
          <div className="flex gap-8 pt-1">
            <Toggle
              checked={data.isNoIndex}
              onChange={set("isNoIndex")}
              label="noindex"
              description="Prevents this page from being indexed by search engines"
            />
            <Toggle
              checked={data.isNoFollow}
              onChange={set("isNoFollow")}
              label="nofollow"
              description="Prevents link equity passing through outbound links"
            />
          </div>
        </div>
      </div>

      {/* ── Keywords ── */}
      <div>
        <SectionHeading
          icon={Tag}
          description="Used for internal taxonomy and structured data — not the meta keywords tag"
        >
          Keywords
        </SectionHeading>
        <div className="space-y-4">
          <Field
            label="Keywords"
            required
            error={errors.keywords}
            hint="General topic keywords — press Enter or comma to add"
          >
            <TagInput
              tags={data.keywords}
              setTags={set("keywords")}
              placeholder="nodejs, express, rest api…"
              error={errors.keywords}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Focus keywords"
              required
              error={errors.focusKeywords}
              hint="Primary search terms you're targeting"
            >
              <TagInput
                tags={data.focusKeywords}
                setTags={set("focusKeywords")}
                placeholder="nodejs express tutorial…"
                error={errors.focusKeywords}
              />
            </Field>
            <Field
              label="Semantic / LSI keywords"
              required
              error={errors.semanticKeywords}
              hint="Contextually related terms that support the main topic"
            >
              <TagInput
                tags={data.semanticKeywords}
                setTags={set("semanticKeywords")}
                placeholder="server side javascript…"
                error={errors.semanticKeywords}
              />
            </Field>
          </div>
        </div>
      </div>

      {/* ── Alternate Languages ── */}
      <div>
        <SectionHeading
          icon={Globe}
          description="hreflang links for multilingual SEO"
        >
          Language & alternates
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Language">
            <Dropdown
              value={data.language}
              options={[
                { value: "en", label: "English" },
                { value: "hi", label: "Hindi" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
              ]}
              onChange={set("language")}
              placeholder="English (default)"
            />
          </Field>
        </div>
      </div>

      {/* ── Open Graph ── */}
      <div>
        <SectionHeading description="Controls the card shown when this URL is shared on Facebook, LinkedIn, WhatsApp">
          Open graph
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Field
              label="OG title"
              hint={`Falls back to: meta title → post title`}
            >
              <Input
                value={data.ogTitle}
                onChange={(e) => set("ogTitle")(e.target.value)}
                placeholder={data.metaTitle || data.title || "OG Title"}
              />
            </Field>
            <Field
              label="OG description"
              hint="Falls back to: meta description → excerpt"
            >
              <Textarea
                value={data.ogDescription}
                onChange={(e) => set("ogDescription")(e.target.value)}
                rows={3}
                placeholder={
                  data.metaDescription || data.excerpt || "OG Description"
                }
              />
            </Field>
            <Field label="OG image URL" hint="Falls back to featured image URL">
              <Input
                type="url"
                value={data.ogImage}
                onChange={(e) => set("ogImage")(e.target.value)}
                placeholder={
                  data.featuredImage?.url || "https://cdn.example.com/og.jpg"
                }
              />
            </Field>
          </div>
          <OgPreview
            title={data.ogTitle || data.metaTitle || data.title}
            description={
              data.ogDescription || data.metaDescription || data.excerpt
            }
            image={data.ogImage || data.featuredImage?.url}
          />
        </div>
      </div>

      {/* ── Twitter ── */}
      <div>
        <SectionHeading description="Controls the card shown when this URL is shared on X / Twitter">
          Twitter / X card
        </SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            label="Twitter title"
            hint="Falls back to OG title → meta title → post title"
          >
            <Input
              value={data.twitterTitle}
              onChange={(e) => set("twitterTitle")(e.target.value)}
              placeholder={
                data.ogTitle || data.metaTitle || data.title || "Twitter Title"
              }
            />
          </Field>
          <Field
            label="Twitter description"
            hint="Falls back to OG description → meta description → excerpt"
          >
            <Input
              value={data.twitterDescription}
              onChange={(e) => set("twitterDescription")(e.target.value)}
              placeholder={
                data.ogDescription ||
                data.metaDescription ||
                data.excerpt ||
                "Twitter Description"
              }
            />
          </Field>
          <Field label="Twitter card type">
            <Dropdown
              value={data.twitterCard}
              options={[
                { value: "summary", label: "Summary" },
                {
                  value: "summary_large_image",
                  label: "Summary — Large Image",
                },
                { value: "player", label: "Player (video)" },
              ]}
              onChange={set("twitterCard")}
              placeholder="summary_large_image (default)"
            />
          </Field>
        </div>
      </div>

      {/* ── FAQ Schema ── */}
      <div>
        <SectionHeading
          icon={HelpCircle}
          description="Adds FAQPage structured data — can appear as rich results in SERP"
        >
          FAQ schema
        </SectionHeading>
        <div className="space-y-3 mb-3">
          {data.faqSchema.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative"
            >
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <div className="space-y-3 pr-6">
                <Field label={`Question ${i + 1}`}>
                  <Input
                    value={faq.question}
                    onChange={(e) => updateFaq(i, "question", e.target.value)}
                    placeholder="What is Node.js used for?"
                  />
                </Field>
                <Field label="Answer">
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(i, "answer", e.target.value)}
                    rows={2}
                    placeholder="Node.js is a JavaScript runtime built on Chrome's V8 engine, used for building fast, scalable network applications."
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-100 transition-colors"
        >
          <Plus size={14} /> Add FAQ item
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE — matches controller payload exactly
// ═══════════════════════════════════════════════════════════════════════════════
const INITIAL = {
  // Core
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  quickAnswer: "",
  keyTakeaways: [],
  tableOfContents: [],
  primaryTopicCluster: "",
  supportingTopicClusters: [],
  category: "",
  // Featured image
  featuredImage: {
    url: "",
    altText: "",
    width: undefined,
    height: undefined,
    sizeInBytes: undefined,
  },
  // Video
  videoEmbedded: {
    hasVideo: false,
    videoUrl: "",
    thumbnailUrl: "",
    name: "",
    duration: "",
  },
  // Settings
  isCommentEnabled: true,
  isAccessibleForFree: true,
  contentSourceType: "Human",
  status: "draft",
  scheduledAt: "",
  schemaType: "BlogPosting",
  language: "en",
  alternateLanguageVersions: [],
  // SEO
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  isNoIndex: false,
  isNoFollow: false,
  keywords: [],
  focusKeywords: [],
  semanticKeywords: [],
  // Social
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterCard: "summary_large_image",
  // Schema
  faqSchema: [],
  structuredDataOverride: null,
  // E-E-A-T
  sources: [],
  statistics: [],
  // Internal
  relatedPosts: [],
  tags: [],
};

const getInitialData = () => ({
  ...INITIAL,
  keyTakeaways: [],
  tableOfContents: [],
  supportingTopicClusters: [],
  alternateLanguageVersions: [],
  keywords: [],
  focusKeywords: [],
  semanticKeywords: [],
  faqSchema: [],
  sources: [],
  statistics: [],
  relatedPosts: [],
  tags: [],
  featuredImage: { ...INITIAL.featuredImage },
  videoEmbedded: { ...INITIAL.videoEmbedded },
});

const normalizePostForForm = (post) => ({
  ...getInitialData(),
  title: post.title || "",
  slug: post.slug || "",
  content: post.content || "",
  excerpt: post.excerpt || "",
  quickAnswer: post.quickAnswer || "",
  keyTakeaways: Array.isArray(post.keyTakeaways) ? post.keyTakeaways : [],
  tableOfContents: Array.isArray(post.tableOfContents)
    ? post.tableOfContents
    : [],
  primaryTopicCluster: post.primaryTopicCluster || "",
  supportingTopicClusters: Array.isArray(post.supportingTopicClusters)
    ? post.supportingTopicClusters
    : [],
  category:
    typeof post.category === "string"
      ? post.category
      : post.category?.name || "",
  featuredImage: {
    ...INITIAL.featuredImage,
    ...(post.featuredImage || {}),
  },
  videoEmbedded: {
    ...INITIAL.videoEmbedded,
    ...(post.videoEmbedded || {}),
  },
  isCommentEnabled: post.isCommentEnabled ?? true,
  isAccessibleForFree: post.isAccessibleForFree ?? true,
  contentSourceType: post.contentSourceType || "Human",
  status: post.status || "draft",
  scheduledAt: toDateTimeLocalValue(post.scheduledAt),
  schemaType: post.schemaType || "BlogPosting",
  language: post.language || "en",
  alternateLanguageVersions: Array.isArray(post.alternateLanguageVersions)
    ? post.alternateLanguageVersions
    : [],
  metaTitle: post.metaTitle || "",
  metaDescription: post.metaDescription || "",
  canonicalUrl: post.canonicalUrl || "",
  isNoIndex: Boolean(post.isNoIndex),
  isNoFollow: Boolean(post.isNoFollow),
  keywords: Array.isArray(post.keywords) ? post.keywords : [],
  focusKeywords: Array.isArray(post.focusKeywords) ? post.focusKeywords : [],
  semanticKeywords: Array.isArray(post.semanticKeywords)
    ? post.semanticKeywords
    : [],
  ogTitle: post.ogTitle || "",
  ogDescription: post.ogDescription || "",
  ogImage: post.ogImage || "",
  twitterTitle: post.twitterTitle || "",
  twitterDescription: post.twitterDescription || "",
  twitterCard: post.twitterCard || "summary_large_image",
  faqSchema: Array.isArray(post.faqSchema) ? post.faqSchema : [],
  structuredDataOverride: post.structuredDataOverride ?? null,
  sources: Array.isArray(post.sources) ? post.sources : [],
  statistics: Array.isArray(post.statistics) ? post.statistics : [],
  relatedPosts: Array.isArray(post.relatedPosts) ? post.relatedPosts : [],
  tags: Array.isArray(post.tags) ? post.tags : [],
});

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const TABS = [
  {
    key: "post",
    label: "Blog details",
    icon: FileText,
    errorKeys: [
      "title",
      "slug",
      "excerpt",
      "category",
      "content",
      "featuredImageUrl",
      "primaryTopicCluster",
    ],
  },
  {
    key: "seo",
    label: "SEO & schema",
    icon: Search,
    errorKeys: [
      "metaTitle",
      "metaDescription",
      "canonicalUrl",
      "keywords",
      "focusKeywords",
      "semanticKeywords",
    ],
  },
];

const validate = (data, submitStatus = data.status) => {
  const e = {};
  if (!data.title.trim()) e.title = "Title is required";
  else if (data.title.trim().length < 10) e.title = "Minimum 10 characters";
  if (!data.slug.trim()) e.slug = "Slug is required";
  if (!data.excerpt.trim()) e.excerpt = "Excerpt is required";
  if (!data.category) e.category = "Category is required";
  if (!data.primaryTopicCluster.trim())
    e.primaryTopicCluster = "Primary topic cluster is required";
  if (
    !data.content ||
    data.content === "<p><br></p>" ||
    data.content.trim() === ""
  )
    e.content = "Content is required";
  if (!data.featuredImage.url.trim())
    e.featuredImageUrl = "Featured image URL is required";
  if (!data.metaTitle.trim()) e.metaTitle = "Meta title is required";
  if (!data.metaDescription.trim())
    e.metaDescription = "Meta description is required";
  if (!data.canonicalUrl.trim()) e.canonicalUrl = "Canonical URL is required";
  if (!data.keywords.length) e.keywords = "At least one keyword required";
  if (!data.focusKeywords.length)
    e.focusKeywords = "At least one focus keyword required";
  if (!data.semanticKeywords.length)
    e.semanticKeywords = "At least one semantic keyword required";
  if (submitStatus === "scheduled") {
    const scheduleDate = new Date(data.scheduledAt);

    if (!data.scheduledAt) {
      e.scheduledAt = "Schedule date and time is required";
    } else if (Number.isNaN(scheduleDate.getTime())) {
      e.scheduledAt = "Schedule date and time is invalid";
    } else if (scheduleDate <= new Date()) {
      e.scheduledAt = "Schedule date must be in the future";
    }
  }
  return e;
};

const buildPayload = (data, status) => ({
  title: data.title.trim(),
  slug: data.slug.trim(),
  content: data.content,
  excerpt: data.excerpt.trim(),
  quickAnswer: data.quickAnswer?.trim() || undefined,
  keyTakeaways: data.keyTakeaways.filter(Boolean),
  tableOfContents: data.tableOfContents,
  primaryTopicCluster: data.primaryTopicCluster.trim(),
  supportingTopicClusters: data.supportingTopicClusters,
  tags: data.tags,
  featuredImage: {
    url: data.featuredImage.url.trim(),
    altText: (data.featuredImage.altText || data.focusKeywords[0] || "").trim(),
    ...(data.featuredImage.width && { width: data.featuredImage.width }),
    ...(data.featuredImage.height && { height: data.featuredImage.height }),
    ...(data.featuredImage.sizeInBytes && {
      sizeInBytes: data.featuredImage.sizeInBytes,
    }),
  },
  videoEmbedded: data.videoEmbedded,
  metaTitle: data.metaTitle.trim(),
  metaDescription: data.metaDescription.trim(),
  keywords: data.keywords,
  focusKeywords: data.focusKeywords,
  semanticKeywords: data.semanticKeywords,
  canonicalUrl: data.canonicalUrl.trim(),
  isNoIndex: data.isNoIndex,
  isNoFollow: data.isNoFollow,
  schemaType: data.schemaType,
  structuredDataOverride: data.structuredDataOverride,
  language: data.language,
  alternateLanguageVersions: data.alternateLanguageVersions,
  ogTitle: (data.ogTitle || data.metaTitle || data.title).trim(),
  ogDescription: (
    data.ogDescription ||
    data.metaDescription ||
    data.excerpt
  ).trim(),
  ogImage: data.ogImage?.trim() || data.featuredImage?.url,
  twitterTitle: (data.twitterTitle || data.metaTitle || data.title).trim(),
  twitterDescription: (
    data.twitterDescription ||
    data.metaDescription ||
    data.excerpt
  ).trim(),
  twitterCard: data.twitterCard,
  faqSchema: data.faqSchema.filter((f) => f.question && f.answer),
  sources: data.sources.filter((s) => s.name),
  statistics: data.statistics.filter((s) => s.stat),
  relatedPosts: data.relatedPosts,
  isAccessibleForFree: data.isAccessibleForFree,
  status,
  ...(status === "scheduled" && {
    scheduledAt: new Date(data.scheduledAt).toISOString(),
  }),
  contentSourceType: data.contentSourceType,
  isCommentEnabled: data.isCommentEnabled,
  category: data.category,
});

export default function CreatePost({ mode = "create", postId }) {
  const router = useRouter();
  const isEdit = mode === "edit";
  const [activeTab, setActiveTab] = useState("post");
  const [data, setData] = useState(() => getInitialData());
  const [loadedData, setLoadedData] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [saved, setSaved] = useState(null); // "draft" | "published" | "scheduled" | null

  // Auto-save indicator (local state, not persisted)
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // "saving" | "saved" | ""

  useEffect(() => {
    if (!isEdit || !postId) return;

    let ignore = false;

    const fetchPost = async () => {
      setInitializing(true);
      setLoadError("");

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/private/post/${postId}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );
        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load post");
        }

        if (ignore) return;

        const nextData = normalizePostForForm(json.data || {});
        setData(nextData);
        setLoadedData(nextData);
      } catch (err) {
        if (!ignore) {
          setLoadError(err.message || "Failed to load post");
        }
      } finally {
        if (!ignore) setInitializing(false);
      }
    };

    fetchPost();

    return () => {
      ignore = true;
    };
  }, [isEdit, postId]);

  const handleSubmit = useCallback(
    async (submitStatus) => {
      const errs = validate(data, submitStatus);
      setErrors(errs);

      if (Object.keys(errs).length > 0) {
        const firstTabWithError = TABS.find((t) =>
          t.errorKeys.some((k) => errs[k]),
        );
        if (firstTabWithError) setActiveTab(firstTabWithError.key);
        return;
      }

      const payload = buildPayload(data, submitStatus);
      const endpoint = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/post/${postId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/create-post`;
      const method = isEdit ? "PATCH" : "POST";

      setLoading(true);
      setSaved(null);
      try {
        const res = await fetch(endpoint, {
          method,
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(
            json.message || `Failed to ${isEdit ? "update" : "create"} post`,
          );
        }
        const nextData =
          isEdit && json.data ? normalizePostForForm(json.data) : null;
        setSaved(submitStatus);
        if (isEdit && nextData) {
          setData(nextData);
          setLoadedData(nextData);
        } else {
          setData(getInitialData());
        }
        setErrors({});
        if (!isEdit) router.push("/blog");
      } catch (err) {
        alert(err.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [data, isEdit, postId, router],
  );

  const errorCountPerTab = TABS.map(
    ({ errorKeys }) => errorKeys.filter((k) => errors[k]).length,
  );

  const totalErrors = Object.keys(errors).length;
  const wordCount = data.content
    ? data.content
        .replace(/<[^>]+>/g, "")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const readingTime = Math.max(1, Math.round(wordCount / 200));
  const statusTone =
    data.status === "published"
      ? "text-green-600"
      : data.status === "scheduled"
        ? "text-blue-600"
        : "text-amber-600";
  const savedMessage =
    saved === "draft"
      ? "Draft saved"
      : saved === "scheduled"
        ? "Scheduled"
        : "Published!";

  if (initializing) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-500">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          Loading post...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <AlertCircle size={24} className="mx-auto text-red-500" />
          <h1 className="mt-3 text-lg font-bold text-gray-900">
            Could not load post
          </h1>
          <p className="mt-2 text-sm text-gray-500">{loadError}</p>
          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="mt-5 h-9 px-4 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText size={14} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">
                {data.title.trim() || (isEdit ? "Edit post" : "New post")}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {wordCount > 0 &&
                  `${wordCount} words · ~${readingTime} min read · `}
                <span
                  className={cx("font-semibold", statusTone)}
                >
                  {data.status}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {totalErrors > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-full px-2.5 py-1">
                <AlertCircle size={11} /> {totalErrors} error
                {totalErrors > 1 ? "s" : ""}
              </span>
            )}
            {saved && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">
                <CheckCircle2 size={11} /> {savedMessage}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              disabled={loading}
              className="h-8 px-4 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Save size={13} /> {isEdit ? "Update draft" : "Save draft"}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("scheduled")}
              disabled={loading}
              className="h-8 px-4 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <CalendarClock size={13} /> Schedule
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("published")}
              disabled={loading}
              className="h-8 px-4 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Send size={13} />
              )}
              {loading ? "Publishing..." : isEdit ? "Publish changes" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-end gap-1 border-b border-gray-200 mb-0">
          {TABS.map(({ key, label, icon: Icon }, idx) => {
            const errCount = errorCountPerTab[idx];
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cx(
                  "relative flex items-center gap-2 py-2.5 px-5 text-sm font-semibold rounded-t-xl transition-all duration-150 border border-b-0",
                  active
                    ? "bg-white text-blue-600 border-gray-200 shadow-sm -mb-px"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/60",
                )}
              >
                <Icon size={14} />
                {label}
                {errCount > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full">
                    {errCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div className="bg-white border border-gray-200 rounded-b-2xl rounded-tr-2xl shadow-sm p-6 md:p-8 min-h-[70vh]">
          {activeTab === "post" ? (
            <BlogDetailsTab data={data} setData={setData} errors={errors} />
          ) : (
            <SeoTab data={data} setData={setData} errors={errors} />
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </p>
              <div className="w-36">
                <Dropdown
                  value={data.status}
                  options={[
                    { value: "draft", label: "Draft" },
                    { value: "published", label: "Published" },
                    { value: "scheduled", label: "Scheduled" },
                    { value: "archived", label: "Archived" },
                  ]}
                  onChange={(val) => setData((p) => ({ ...p, status: val }))}
                />
              </div>
              {(data.status === "scheduled" || errors.scheduledAt) && (
                <div className="w-56">
                  <Input
                    type="datetime-local"
                    value={data.scheduledAt}
                    min={toDateTimeLocalValue(new Date())}
                    onChange={(e) =>
                      setData((p) => ({ ...p, scheduledAt: e.target.value }))
                    }
                    error={errors.scheduledAt}
                  />
                  {errors.scheduledAt && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.scheduledAt}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setData(isEdit && loadedData ? loadedData : getInitialData());
                  setErrors({});
                  setSaved(null);
                }}
                disabled={loading}
                className="h-9 px-4 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("draft")}
                disabled={loading}
                className="h-9 px-5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={14} /> {isEdit ? "Update draft" : "Save as draft"}
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("scheduled")}
                disabled={loading}
                className="h-9 px-5 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <CalendarClock size={14} /> Schedule post
              </button>
              <button
                type="button"
                onClick={() => handleSubmit("published")}
                disabled={loading}
                className="h-9 px-6 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Send size={14} /> {isEdit ? "Publish changes" : "Publish post"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
