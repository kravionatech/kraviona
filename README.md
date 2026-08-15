# Kraviona

Kraviona website, backend, admin dashboard, and a private Claude-compatible
business MCP server.

See [mcp-server/README.md](mcp-server/README.md) to connect Claude and manage
content, CRM, messages, subscribers, media, users, and team workflows through
62 validated MCP tools.

The remote MCP endpoint can be deployed from `mcp-server` as a Render Web
Service. It is available at `/mcp` and requires the `MCP_API_KEY` bearer token.
See [mcp-server/README.md](mcp-server/README.md#render-deployment) for the build,
session, and environment configuration.
