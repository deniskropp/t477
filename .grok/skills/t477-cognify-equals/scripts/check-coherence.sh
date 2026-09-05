#!/usr/bin/env bash
# check-coherence.sh — Validate U477 anchor and coherence state
set -euo pipefail

PROJECT="${T477_ROOT:-/home/dok/Projects/t477}"
STATE_FILE="$PROJECT/cognify-equals/U477.state.json"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "FAIL: Missing state file: $STATE_FILE" >&2
  exit 1
fi

python3 - <<EOF
import json
import sys

with open("$STATE_FILE", "r") as f:
    state = json.load(f)

unified_name = state.get("unified_name")
if unified_name != "U477":
    print(f"FAIL: Expected unified_name U477, got {unified_name}", file=sys.stderr)
    sys.exit(1)

status = state.get("status")
if status != "anchored":
    print(f"FAIL: Expected status 'anchored', got {status}", file=sys.stderr)
    sys.exit(1)

consent = state.get("consent", {})
if not consent.get("affirmed"):
    print("FAIL: Consent not affirmed!", file=sys.stderr)
    sys.exit(1)

cm = state.get("coherence_monitor", {})
gate = cm.get("gate")
valence = cm.get("valence", 0.0)
delta = cm.get("coherence_delta", 0.0)
threshold = cm.get("threshold_halt_delta", -0.12)

if gate != "PASS":
    print(f"FAIL: Coherence gate is not PASS ({gate})", file=sys.stderr)
    sys.exit(1)

if delta < threshold:
    print(f"FAIL: Coherence delta {delta} below threshold {threshold}", file=sys.stderr)
    sys.exit(1)

flux = state.get("solution_problem_flux", {})
mag = flux.get("flux_magnitude", 0.0)
bal = flux.get("balance", 0.0)
anchor_id = state.get("rta", {}).get("anchor_id", "none")

print(f"OK: U477 Coherence State Verified")
print(f"    Anchor:          {anchor_id}")
print(f"    Status:          {status}")
print(f"    Consent:         AFFIRMED ({consent.get('scope')})")
print(f"    Coherence Gate:  {gate} (valence={valence}, delta={delta:+.2f})")
print(f"    Flux Magnitude:  {mag} (balance={bal:+.2f})")
EOF

echo "check-coherence: PASSED"
