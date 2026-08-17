import path from "node:path";
import { fileURLToPath } from "node:url";
import vercelHandler from "./api/index.js";

export default vercelHandler;

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));

if (isDirectExecution) {
  try {
    const { startLocalServer } = await import("./local.js");
    await startLocalServer();
  } catch (error) {
    console.error(`[MCP] Fatal startup error: ${error.message}`);
    process.exit(1);
  }
}
