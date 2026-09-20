import path from "node:path";
import { fileURLToPath } from "node:url";
import vercelHandler from "./api/index.js";

export default vercelHandler;

const isVercel = Boolean(process.env.VERCEL);
const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const thisFile = path.resolve(fileURLToPath(import.meta.url));
const isPm2 = Boolean(process.env.PM2_HOME || process.env.PM2_USAGE || process.env.pm_id !== undefined);
const isDirectExecution =
  isPm2 ||
  (Boolean(entryFile) &&
    (entryFile === thisFile ||
      entryFile.includes("pm2") ||
      path.basename(entryFile) === "index.js"));

if (!isVercel && isDirectExecution) {
  try {
    const { startLocalServer } = await import("./local.js");
    await startLocalServer();
  } catch (error) {
    console.error(`[MCP] Fatal startup error: ${error.message}`);
    process.exit(1);
  }
}
