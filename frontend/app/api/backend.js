const RAW_BACKEND_URL =
  process.env.BACKEND_API_URL ||
  process.env.BACKEND_PROXY_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URI ||
  process.env.PUBLIC_BACKEND_URI ||
  process.env.EXT_PUBLIC_BACKEND_URI ||
  "https://api.kraviona.com/api";

const trimSlashes = (value) => value.replace(/\/+$/, "");

export const getBackendBaseUrl = () => {
  const baseUrl = trimSlashes(RAW_BACKEND_URL);

  if (baseUrl.endsWith("/api/v1")) return baseUrl;
  if (baseUrl.endsWith("/api")) return `${baseUrl}/v1`;
  return `${baseUrl}/api/v1`;
};

export const pickBackendError = (data, fallback) =>
  data?.message || data?.error || data?.errors?.[0] || fallback;
