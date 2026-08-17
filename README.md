# Kraviona

Kraviona website, backend, admin dashboard, and a private Claude-compatible
super-admin MCP server.

See [mcp-server/README.md](mcp-server/README.md) to connect Claude and manage
content, CRM, messages, subscribers, media, users, and team workflows through
69 schema-generated MCP tools across 15 backend resources.

The root commands cover the local MCP workflow:

```bash
npm run mcp:install
npm run mcp:login
npm run mcp:check
npm run mcp:smoke
```

The project-scoped `.mcp.json` is ready for Claude Code. Restart Claude from
this project after login and approve the `kraviona-admin` server. Permanent
deletes are available only when `MCP_ALLOW_DELETES=true` is deliberately set;
each delete also requires the exact `PERMANENTLY_DELETE` confirmation.

The remote MCP endpoint deploys as a dedicated Vercel Node project from
`mcp-server`. Claude Chat connects to `/mcp` through OAuth 2.1 with dynamic
client registration and PKCE. See
[mcp-server/README.md](mcp-server/README.md#vercel--claude-chat-deployment) for
the exact project and environment configuration.
