# Kraviona Business MCP

A private local MCP server that lets Claude manage Kraviona through the same
MongoDB models used by the backend.

## What Claude can do

- Manage posts, categories, comments, reactions, media, and team members.
- Manage leads, lead status, lead timelines, contact messages, and newsletter
  subscriptions.
- Manage users while hashing passwords and never returning passwords, reset
  tokens, OTPs, IP hashes, or user-agent fingerprints.
- Search across business data and return concise paginated results.
- Show a business overview and a single pending-work queue.
- Publish and unpublish content.
- Permanently delete records only when both server policy and a per-call
  confirmation allow it.

The server exposes 62 tools over local stdio. It does not expose a shell,
arbitrary MongoDB queries, or credentials.

## Install and verify

Requirements: Node.js 20.19 or newer and access to the Kraviona MongoDB
database.

```bash
cd /home/amar/Desktop/kraviona/mcp-server
npm install
npm run check
npm run smoke
```

`npm run smoke` launches the server through a real MCP client, discovers the
tools, checks the database, reads the dashboard, and verifies safety guards. It
does not write data.

## Connect Claude Code

The repository already contains a project-scoped [`.mcp.json`](../.mcp.json).
Start Claude Code from the repository root:

```bash
cd /home/amar/Desktop/kraviona
claude
```

Accept the project MCP server when Claude asks, then run `/mcp` inside Claude
Code. The `kraviona` server should show as connected with 62 tools.

To add it manually instead:

```bash
claude mcp add --transport stdio --scope project \
  --env MCP_ALLOW_DELETES=false \
  kraviona -- node /home/amar/Desktop/kraviona/mcp-server/index.js
```

Verify a manual installation with:

```bash
claude mcp get kraviona
claude mcp list
```

## Connect Claude Desktop

Use an absolute path in Claude Desktop's MCP configuration:

```json
{
  "mcpServers": {
    "kraviona": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/kraviona/mcp-server/index.js"],
      "env": {
        "MCP_READ_ONLY": "false",
        "MCP_ALLOW_DELETES": "false"
      }
    }
  }
}
```

Save the configuration and fully restart Claude Desktop. The machine running
Claude Desktop must also have Node.js, this repository, and database network
access.

## Database configuration

Configuration is loaded in this order:

1. Environment variables supplied by Claude or the operating system.
2. `mcp-server/.env`.
3. `backend/.env` for values still missing.

Supported database variables are `MONGO_URI`, `DATABASE_URL`, or
`MONGODB_URI`, plus the optional `DB_NAME`.

Copy `.env.example` to `.env` only when the shared `backend/.env` is not
appropriate:

```bash
cp .env.example .env
```

Never commit `.env` or database credentials.

## Safety modes

| Setting | Default | Effect |
| --- | --- | --- |
| `MCP_READ_ONLY` | `false` | Set to `true` to block every create, update, publish, status, and delete operation. |
| `MCP_ALLOW_DELETES` | `false` | Set to `true` to permit permanent deletes. Each delete still requires `confirm=true`. |
| `MCP_DB_TIMEOUT_MS` | `10000` | Database selection timeout, constrained to 1–60 seconds. |

Recommended: leave deletion disabled and let Claude archive or change statuses.
Enable it only for a deliberate deletion session:

```json
"env": {
  "MCP_READ_ONLY": "false",
  "MCP_ALLOW_DELETES": "true"
}
```

## Useful requests for Claude

- “Show my Kraviona business overview.”
- “What work needs attention today?”
- “Find every lead and message mentioning mobile app development.”
- “List new leads, then mark this lead as Contacted and add a call note.”
- “Show draft posts and publish the one with slug `example-post`.”
- “Run this session in read-only mode” (set `MCP_READ_ONLY=true` in config and
  restart the MCP connection).

## Development commands

```bash
npm start       # stdio server; logs go only to stderr
npm run dev     # restart on source changes
npm run check   # validate unique schemas, annotations, and delete guards
npm run tools   # list all tools and read/write/delete classification
npm run smoke   # end-to-end MCP and database test
```

For stdio MCP servers, never write logs to stdout because stdout carries the
JSON-RPC protocol. This implementation logs only to stderr.
