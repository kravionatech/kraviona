const RAW_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URI ||
  process.env.PUBLIC_BACKEND_URI ||
  process.env.BACKEND_PROXY_URL ||
  "https://api.kraviona.com/api";

const baseUrl = RAW_BASE_URL.replace(/\/+$/, "");

export const API_URL = baseUrl.endsWith("/api/v1")
  ? baseUrl
  : baseUrl.endsWith("/api")
    ? `${baseUrl}/v1`
    : `${baseUrl}/api/v1`;
