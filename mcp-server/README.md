# Kraviona Admin MCP

Private MCP access to the complete Kraviona admin data plane. The server
uses the same Mongoose models as `backend`, so field names, enums, required
values, defaults, validation, and nested data shapes stay synchronized.

The old unauthenticated business MCP has been replaced. Local stdio access uses
a revocable admin session. Remote Claude connectors use per-admin OAuth tokens.

## Security model

- Local clients use stdio. Vercel exposes Streamable HTTP at `/mcp`.
- Claude Chat discovers OAuth 2.1 metadata, dynamically registers a public
  client, uses authorization-code PKCE, and rotates refresh tokens.
- OAuth login verifies the password against the backend `User` collection.
- Default allowed role: `super_admin` only.
- Local sessions and remote access/refresh tokens are random and stored only as
  SHA-256 hashes in MongoDB. Authorization codes and pending requests use TTL
  indexes and expire automatically.
- Account role/status is rechecked on every MCP tool call.
- Every create, update, delete, and lead activity is written to `ActivityLog`
  with the authenticated admin ID.
- Passwords, OTPs, reset tokens, lock data, and reaction IP hashes are never
  returned.
- The active admin cannot demote, deactivate, or delete itself.
- Published post slugs are immutable.
- Permanent deletion requires `MCP_ALLOW_DELETES=true` and the exact phrase
  `PERMANENTLY_DELETE`. Media is metadata/soft-delete only through MCP.

## Admin coverage

The resource catalog includes:

- users, login history, and audited admin activity;
- posts, categories, comments, and post reactions;
- leads and lead activities;
- contact messages and newsletter subscriptions;
- media metadata and team members;
- services and portfolio projects.

Each writable resource exposes create/update JSON Schema generated from its
actual backend Mongoose model. `describe_admin_resource` shows the exact schema,
server-managed fields, immutable fields, filters, and resource-specific notes.

## One-time setup

Install the existing dependencies (no new package is required):

```powershell
cd mcp-server
npm ci
```

Create a super-admin session. The password is masked and never written to disk:

```powershell
npm run login
```

Check the current identity:

```powershell
npm run whoami
```

Then restart Claude Code or reconnect the local MCP. Claude Chat uses the remote
Vercel connector flow below and does not use `.mcp.json`.

To revoke the local session:

```powershell
npm run logout
```

## Vercel + Claude Chat deployment

Create a separate Vercel project for MCP only:

- Root Directory: `mcp-server`
- Application Preset: `Node`
- Install Command: `npm install`
- Build Command: none
- Output Directory: none
- Enable `Include source files outside of the Root Directory`, because the MCP
  imports the backend Mongoose models from `../backend`.

`api/index.js` is the Vercel function and `vercel.json` maps the MCP, OAuth,
discovery, registration, token, and revocation endpoints to it. Set these
Production environment variables before deploying (a paste-ready local copy is
kept in the Git-ignored `.env.production`; `vercel.env.example` is safe to
commit):

```text
MONGO_URI=<same production MongoDB URI used by the backend>
DB_NAME=kraviona
MCP_TRANSPORT=streamable-http
MCP_ADMIN_ROLES=super_admin
MCP_READ_ONLY=false
MCP_ALLOW_DELETES=true
MCP_DB_TIMEOUT_MS=20000
MCP_OAUTH_REDIRECT_URIS=https://claude.ai/api/mcp/auth_callback
MCP_OAUTH_ACCESS_TOKEN_SECONDS=3600
MCP_OAUTH_REFRESH_TOKEN_DAYS=30
```

The first deployment can omit `MCP_PUBLIC_URL`; Vercel's production hostname
is detected automatically. After assigning a stable production or custom domain,
set `MCP_PUBLIC_URL=https://<your-domain>` and redeploy.

Do not set `PORT`, `MCP_ADMIN_PASSWORD`, `MCP_ADMIN_SESSION_TOKEN`, or
`MCP_API_KEY` for the Claude Chat OAuth deployment. After Vercel reports a
successful deployment, verify that `/` reports `oauth-2.1` and that
`/.well-known/oauth-protected-resource/mcp` returns JSON.

In Claude Chat, open `Customize > Connectors`, choose `Add custom connector`,
and enter:

```text
https://<stable-vercel-production-domain>/mcp
```

Do not enter a client ID or client secret. Claude dynamically registers and
opens the Kraviona consent page. Sign in with an active, verified
`super_admin`; Claude receives scoped tokens, never the password.

## Commands

```powershell
npm run login    # Verify super-admin credentials and create a session
npm run logout   # Revoke the session and remove the local token
npm run whoami   # Verify the current session and account
npm run check    # Validate tool uniqueness, schemas, resources, and guards
npm run tools    # Print the complete read/write/delete tool catalog
npm run smoke    # Live MCP protocol + authenticated database smoke test
npm start        # Start the stdio MCP server
```

## Safe operating modes

Default configuration permits audited creates and updates but blocks permanent
deletion. To temporarily make the entire server read-only, set:

```text
MCP_READ_ONLY=true
```

Only enable deletes for a deliberate maintenance session:

```text
MCP_ALLOW_DELETES=true
```

Disable it again and reconnect immediately afterward.

## Schema-first examples

- “Describe the post schema, then create this article as a draft.”
- “List new leads and add a call note to this lead.”
- “Show the admin dashboard and pending content.”
- “Update this service using only fields allowed by its backend schema.”
- “List recent MCP activity logs.”

For media, MCP manages existing file metadata. Uploading binary files continues
through the admin media uploader so Cloudinary transformation and cleanup remain
consistent with the backend.
