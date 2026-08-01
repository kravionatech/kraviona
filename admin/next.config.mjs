import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep production tracing scoped to this independently deployable admin app.
  outputFileTracingRoot: fileURLToPath(new URL("./", import.meta.url)),
};

export default nextConfig;
