const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URI ||
  process.env.PUBLIC_BACKEND_URI ||
  process.env.BACKEND_PROXY_URL ||
  "https://api.kraviona.com/api/v1";

export const normalizeBackendBaseUrl = (value = RAW_BASE_URL) => {
  const baseUrl = String(value || "").replace(/\/+$/, "");

  if (baseUrl.endsWith("/api/v1")) return baseUrl;
  if (baseUrl.endsWith("/api")) return `${baseUrl}/v1`;
  return `${baseUrl}/api/v1`;
};

export const API_URL = normalizeBackendBaseUrl(RAW_BASE_URL);
