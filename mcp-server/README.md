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

It can also be deployed as a private stateless Streamable HTTP server on
Vercel. The remote endpoint requires a bearer token.

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

## Deploy to Vercel

The Vercel project must use the repository root, not `mcp-server`, because the
MCP tools reuse models from `backend`.

1. Open the Vercel project and go to **Settings > Build and Deployment**.
2. Set **Root Directory** to the repository root (leave it empty).
3. Set **Framework Preset** to `Other`.
4. Clear any custom **Build Command** and **Output Directory**.
5. Add these Production environment variables:

| Variable | Value |
| --- | --- |
| `MONGO_URI` | The production MongoDB connection string |
| `DB_NAME` | Database name, if it is not included in the URI |
| `MCP_API_KEY` | A new random secret of at least 32 bytes |
| `MCP_OAUTH_PASSWORD` | Password entered on the Claude authorization screen |
| `MCP_PUBLIC_URL` | Canonical origin, for example `https://mcpserver.kraviona.com` |
| `MCP_READ_ONLY` | `true` initially; change deliberately when writes are needed |
| `MCP_ALLOW_DELETES` | `false` |

Generate an API key locally:

```bash
openssl rand -hex 32
```

Deploy from the repository root:

```bash
cd /home/amar/Desktop/kraviona
npx vercel --prod
```

After deployment:

```text
https://YOUR-PROJECT.vercel.app/       health information
https://YOUR-PROJECT.vercel.app/mcp    protected MCP endpoint
```

Do not open `/mcp` as a normal webpage. MCP clients send authenticated `POST`
requests. A browser `GET` receives `405 Method Not Allowed` by design.

Test authentication without exposing the token in source control:

```bash
export MCP_API_KEY="the-same-value-configured-in-vercel"
curl -i https://YOUR-PROJECT.vercel.app/mcp \
  -X POST \
  -H "Authorization: Bearer $MCP_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  --data '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"curl-test","version":"1.0.0"}}}'
```

Example remote MCP client configuration:

```json
{
  "mcpServers": {
    "kraviona-remote": {
      "type": "http",
      "url": "https://YOUR-PROJECT.vercel.app/mcp",
      "headers": {
        "Authorization": "Bearer ${MCP_API_KEY}"
      }
    }
  }
}
```

Keep the existing project-level `.mcp.json` configuration when using the local
stdio server. Use the remote configuration only in a client that needs to
connect through Vercel.

### Connect Claude web

1. In Claude, open **Settings > Connectors**.
2. Remove the old Kraviona connector if it was added before OAuth was deployed.
3. Add a custom connector with
   `https://mcpserver.kraviona.com/mcp`.
4. Leave the OAuth Client ID and Client Secret fields empty. The server supports
   Dynamic Client Registration.
5. Click **Connect**, enter `MCP_OAUTH_PASSWORD` on the Kraviona authorization
   page, and approve access.

If Claude has cached a failed DCR registration, remove and recreate the
connector. As a fallback, set the advanced OAuth Client ID to `claude-web` and
leave Client Secret empty.

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
