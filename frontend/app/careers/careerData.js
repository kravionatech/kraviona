import { API_URL } from "@/utils/api";

export async function getCareers(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, String(value));
  }

  try {
    const response = await fetch(
      `${API_URL}/careers${params.size ? `?${params.toString()}` : ""}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) return { data: [], pagination: {} };
    const payload = await response.json();
    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      pagination: payload?.pagination || {},
    };
  } catch {
    return { data: [], pagination: {} };
  }
}

export async function getCareer(slug) {
  if (!slug) return null;
  try {
    const response = await fetch(
      `${API_URL}/careers/${encodeURIComponent(slug)}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 60 },
      },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
}

export function formatCareerLocation(career) {
  if (career?.workplaceType === "remote") return "Remote";
  return [career?.location?.city, career?.location?.state, career?.location?.country]
    .filter(Boolean)
    .join(", ") || "India";
}

export function formatCompensation(compensation) {
  if (!compensation?.isDisclosed) return "Competitive compensation";
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: compensation.currency || "INR",
    maximumFractionDigits: 0,
  });
  const minimum =
    compensation.minimum === null || compensation.minimum === undefined
      ? Number.NaN
      : Number(compensation.minimum);
  const maximum =
    compensation.maximum === null || compensation.maximum === undefined
      ? Number.NaN
      : Number(compensation.maximum);
  if (Number.isFinite(minimum) && Number.isFinite(maximum)) {
    return `${formatter.format(minimum)} – ${formatter.format(maximum)} / ${compensation.period || "year"}`;
  }
  if (Number.isFinite(minimum)) {
    return `From ${formatter.format(minimum)} / ${compensation.period || "year"}`;
  }
  if (Number.isFinite(maximum)) {
    return `Up to ${formatter.format(maximum)} / ${compensation.period || "year"}`;
  }
  return compensation.notes || "Competitive compensation";
}

export function formatDeadline(value) {
  if (!value) return "Open until filled";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Open until filled";
  return `Apply by ${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
}
