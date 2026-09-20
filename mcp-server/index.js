import path from "node:path";
import { fileURLToPath } from "node:url";
import vercelHandler from "./api/index.js";

export default vercelHandler;

const isVercel = Boolean(process.env.VERCEL);
const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
const thisFile = path.resolve(fileURLToPath(import.meta.url));
const isDirectExecution =
  Boolean(entryFile) &&
  (entryFile === thisFile ||
    entryFile.endsWith("pm2") ||
    path.basename(entryFile) === "index.js");

if (!isVercel && isDirectExecution) {
  try {
    const { startLocalServer } = await import("./local.js");
    await startLocalServer();
  } catch (error) {
    console.error(`[MCP] Fatal startup error: ${error.message}`);
    process.exit(1);
  }
}
