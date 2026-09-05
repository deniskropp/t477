#!/usr/bin/env bash
# mcp-discover.sh — Flow Nexus helper for t477-cognify-equals
# Usage:
#   ./mcp-discover.sh                 # list all configured MCP tools
#   ./mcp-discover.sh github          # filter query
#   ./mcp-discover.sh --doctor        # run doctor check

set -euo pipefail

GROK_BIN="${GROK_BIN:-/home/dok/.grok/bin/grok}"

query="${1:-}"
if [[ "$query" == "--doctor" || "$query" == "doctor" ]]; then
  echo "=== grok mcp doctor ==="
  if [[ -x "$GROK_BIN" ]]; then
    "$GROK_BIN" mcp doctor 2>&1 || true
  else
    echo "grok binary not executable at $GROK_BIN"
  fi
  exit 0
fi

echo "=== grok mcp list ==="
if [[ -x "$GROK_BIN" ]]; then
  "$GROK_BIN" mcp list 2>&1 || true
else
  echo "grok binary not found at $GROK_BIN"
fi

if [[ -n "$query" ]]; then
  echo
  echo "=== Suggested search_tool query for active MCP tools ==="
  echo "search_tool(query=\"$query\", limit=15)"
fi

echo
echo "Reminder: In-agent discovery MUST use the search_tool tool first."
echo "Then call tools with full qualified tool_name and validated schema."
