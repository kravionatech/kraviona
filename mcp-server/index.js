import path from "node:path";
import { fileURLToPath } from "node:url";
import vercelHandler from "./api/index.js";

export default vercelHandler;

const isVercel = Boolean(process.env.VERCEL);
const isDirectExecution =
  process.argv[1] &&
  (path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url)) ||
    process.argv[1].includes("pm2") ||
    process.argv[1].includes("index.js"));

if (!isVercel || isDirectExecution) {
  try {
    const { startLocalServer } = await import("./local.js");
    await startLocalServer();
  } catch (error) {
    console.error(`[MCP] Fatal startup error: ${error.message}`);
    process.exit(1);
  }
}
