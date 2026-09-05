#!/usr/bin/env bash
# Validate t477-cognify-equals skill tree and project contracts.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL="$ROOT/SKILL.md"
PROJECT="${T477_ROOT:-/home/dok/Projects/t477}"
fail=0

die() { echo "FAIL: $*" >&2; fail=1; }
ok() { echo "OK: $*"; }

if [[ ! -f "$SKILL" ]]; then
  die "missing $SKILL"
else
  ok "SKILL.md exists"
fi

if [[ -f "$SKILL" ]]; then
  if ! head -n 1 "$SKILL" | grep -qx -- '---'; then
    die "SKILL.md must start with YAML frontmatter"
  fi
  if ! grep -qE '^name:[[:space:]]*t477-cognify-equals[[:space:]]*$' "$SKILL"; then
    die "frontmatter name must be t477-cognify-equals"
  fi
  if ! grep -qE '^description:' "$SKILL"; then
    die "frontmatter missing description"
  fi
  if grep -nE 'TODO|FIXME|\bTBD\b|\[insert' "$SKILL" >/dev/null; then
    die "SKILL.md still has unfinished markers"
    grep -nE 'TODO|FIXME|\bTBD\b|\[insert' "$SKILL" || true
  else
    ok "no unfinished markers in SKILL.md"
  fi
fi

for rel in \
  references/mcp-integration.md \
  references/bridge-spec.md \
  scripts/validate-skill.sh \
  scripts/mcp-discover.sh \
  scripts/check-coherence.sh
do
  if [[ -f "$ROOT/$rel" ]]; then
    ok "$rel"
  else
    die "missing $rel"
  fi
done

for rel in \
  README.md \
  AGENTS.md \
  cognify-equals/U477.state.json \
  cognify-equals/U477.flux.mmd \
  cognify-equals/U477.kicklang.md \
  cognify-equals/TAS-Block-0612-Cognify.json
do
  if [[ -f "$PROJECT/$rel" ]]; then
    ok "project $rel"
  else
    die "project missing $rel"
  fi
done

if [[ -x "$ROOT/scripts/check-coherence.sh" ]]; then
  if "$ROOT/scripts/check-coherence.sh" >/dev/null; then
    ok "check-coherence self-test"
  else
    die "check-coherence self-test failed"
  fi
else
  die "check-coherence.sh not executable"
fi

if [[ "$fail" -ne 0 ]]; then
  echo "validate-skill: FAILED"
  exit 1
fi
echo "validate-skill: PASSED"
