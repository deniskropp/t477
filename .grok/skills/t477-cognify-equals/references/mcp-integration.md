# MCP Patterns for t477 CognifyEquals (U477 Bridge)

## Discovery (Always First Step)

Discover available MCP tools prior to execution:

```bash
# In-agent tool search
search_tool(query="github", limit=10)
search_tool(query="drive", limit=5)

# Host discovery helper
~/.grok/skills/t477-cognify-equals/scripts/mcp-discover.sh github
```

## GitHub Integration

Repository target:
- `owner=deniskropp`
- `repo=t477`

### Operating Protocol:
1. **Consent Gate:** Request explicit user confirmation before committing remote branch changes, creating pull requests, or syncing states off-node.
2. **Secret Hygiene:** Never commit tokens, API keys, credentials, or private configuration files.
3. **Payload Inspection:** Validate state payloads against `cognify-equals/U477.state.json` schema before syncing.

Common tools:
- `github__get_me`
- `github__create_pull_request`
- `github__create_issue`
- `github__push_files`

## Binary and Payload Transport

To exchange artifacts without flooding agent context:
- Never dump large raw JSON or binary bodies into conversational context.
- Use base64 streaming pipes:
  ```bash
  b64=$(base64 -w0 cognify-equals/U477.state.json) && grok-mcp call upload_tool "{\"file_name\":\"U477.state.json\",\"contents\":\"$b64\"}"
  ```

## Flow Nexus Coordination

1. **Living Objective Tracking:** Integrate U477 anchor status with `living-objective-tas-flow` via MCP issue/PR notifications.
2. **Coherence Telemetry:** If remote monitoring is enabled, transmit only sanitized coherence delta metrics (`valence`, `coherence_delta`) under affirmed consent.
