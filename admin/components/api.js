const DEFAULT_API_BASE_URL = "http://localhost:5000/api/v1";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export function apiUrl(path = "") {
  const cleanPath = String(path).replace(/^\/+/, "");
  return `${API_BASE_URL}/${cleanPath}`;
}

export async function readJson(response) {
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

export async function apiRequest(path, options = {}) {
  const body = options.body;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers || {}),
  };

  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...options,
    headers,
  });
  const data = await readJson(response);

  if (!response.ok || data?.success === false) {
    throw new Error(
      data?.message || data?.error || `Request failed with ${response.status}`,
    );
  }

  return data;
}

export function formatDate(value, fallback = "-") {
  if (!value) return fallback;
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatCurrency(value, currency = "INR") {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(number);
}
