import { ALL_TOOLS } from "../server.js";

for (const tool of ALL_TOOLS) {
  const mode = tool.annotations?.readOnlyHint
    ? "read"
    : tool.annotations?.destructiveHint
      ? "delete"
      : "write";
  process.stdout.write(`[${mode}] ${tool.name} — ${tool.description}\n`);
}
