# Kraviona Admin MCP

Private, local MCP access to the complete Kraviona admin data plane. The server
uses the same Mongoose models as `backend`, so field names, enums, required
values, defaults, validation, and nested data shapes stay synchronized.

The old unauthenticated business MCP has been replaced. This server refuses to
start until a real, active, verified `super_admin` creates a revocable session.

## Security model

- Local stdio only; no public HTTP endpoint and no shared OAuth password.
- Login verifies the password against the backend `User` collection.
- Default allowed role: `super_admin` only.
- The session token is random, stored locally in ignored `.admin-session`, and
  stored only as a SHA-256 hash in MongoDB.
- Expiry defaults to 30 days and the account role/status is rechecked on every
  MCP tool call.
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

Then restart Codex/ChatGPT desktop or reconnect MCP. Project-scoped Codex
configuration is in `../.codex/config.toml`; Claude-compatible configuration is
in `../.mcp.json`.

To revoke the local session:

```powershell
npm run logout
```

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

```toml
MCP_READ_ONLY = "true"
```

Only enable deletes for a deliberate maintenance session:

```toml
MCP_ALLOW_DELETES = "true"
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
