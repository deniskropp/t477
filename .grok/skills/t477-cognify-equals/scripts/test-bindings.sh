#!/usr/bin/env bash
# test-bindings.sh — Validate Python and TypeScript host bindings for U477
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${T477_ROOT:-/home/dok/Projects/t477}"

echo "=== Testing Python Host Binding (u477_bridge.py) ==="
python3 "$PROJECT/u477_bridge.py" --test

echo
echo "=== Testing TypeScript Host Binding (u477Bridge.ts) ==="
(cd "$PROJECT" && tsc && node dist/u477Bridge.js)

echo
echo "test-bindings: ALL DUAL-SPACE BINDINGS PASSED"
