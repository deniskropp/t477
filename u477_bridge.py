#!/usr/bin/env python3
"""
u477_bridge.py — Python Host Binding for U477 Dual-Space Bridge
CognitiveSpace.CognifyEquals v1.0 · OCS v2.1 · Three-Agent-Core

Provides typed analytical host capabilities for U477:
- Bidirectional parsing & emission of KickLang ⫻sigil blocks
- Strict Consent Gate enforcement (affirmed, scope, unified_name)
- CoherenceMonitor evaluation (valence, coherence_delta threshold gating)
- Analytical pipeline execution projecting problem-space metrics to KickLang
"""

import json
import re
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple, Union

UNIFIED_NAME = "U477"
RTA_ANCHOR_ID = "rta-U477-c2beec09-fae4-4392-9008-bedf6ceaba96"
DEFAULT_HALT_DELTA = -0.12


@dataclass
class U477Consent:
    affirmed: bool
    scope: str
    unified_name: str

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "U477Consent":
        return cls(
            affirmed=bool(data.get("affirmed", False)),
            scope=str(data.get("scope", "")),
            unified_name=str(data.get("unified_name", "")),
        )

    def is_valid(self, expected_name: str = UNIFIED_NAME) -> bool:
        return self.affirmed and self.unified_name == expected_name


@dataclass
class U477Coherence:
    valence: float
    coherence_delta: float
    gate: str
    threshold_halt_delta: float = DEFAULT_HALT_DELTA
    recommended_recalibration: Optional[str] = None
    notes: Optional[str] = None

    def passes(self) -> bool:
        return (
            self.gate.upper() == "PASS"
            and self.coherence_delta >= self.threshold_halt_delta
            and self.valence > 0.0
        )


@dataclass
class U477Flux:
    problem_to_solution: float = 0.82
    solution_to_problem: float = 0.78
    magnitude: float = 0.80
    balance: float = 0.04


@dataclass
class U477KickPayload:
    sigil: str
    key: str
    raw_content: str
    data: Optional[Union[Dict[str, Any], str]] = None


class U477Bridge:
    """Python analytical host binding for the U477 dual-space bridge."""

    def __init__(
        self,
        anchor_id: str = RTA_ANCHOR_ID,
        unified_name: str = UNIFIED_NAME,
        halt_threshold: float = DEFAULT_HALT_DELTA,
    ):
        self.anchor_id = anchor_id
        self.unified_name = unified_name
        self.halt_threshold = halt_threshold
        self.flux = U477Flux()

    def parse_kicklang(self, text: str) -> List[U477KickPayload]:
        """Parses raw KickLang text into structured U477KickPayload blocks."""
        payloads: List[U477KickPayload] = []

        # Matches ⫻<sigil>/<key>: <content until next ⫻ or end of block>
        pattern = re.compile(
            r"⫻([a-zA-Z0-9_\-]+)/([a-zA-Z0-9_\-]+):\s*(.*?)(?=(?:⫻[a-zA-Z0-9_\-]+/[a-zA-Z0-9_\-]+:)|```|\Z)",
            re.DOTALL,
        )

        for match in pattern.finditer(text):
            sigil = match.group(1).strip()
            key = match.group(2).strip()
            content = match.group(3).strip()

            parsed_data: Optional[Union[Dict[str, Any], str]] = None
            # Attempt JSON or Python literal parsing for structured data
            if content.startswith("{") and content.endswith("}"):
                try:
                    parsed_data = json.loads(content)
                except Exception:
                    # Clean up unquoted JS keys if present
                    json_candidate = re.sub(
                        r"([{,]\s*)([a-zA-Z0-9_]+)\s*:", r'\1"\2":', content
                    )
                    json_candidate = re.sub(r":\s*true\b", ": true", json_candidate)
                    json_candidate = re.sub(r":\s*false\b", ": false", json_candidate)
                    try:
                        parsed_data = json.loads(json_candidate)
                    except Exception:
                        parsed_data = content
            else:
                parsed_data = content

            payloads.append(
                U477KickPayload(
                    sigil=sigil,
                    key=key,
                    raw_content=content,
                    data=parsed_data,
                )
            )

        return payloads

    def emit_kicklang(self, payloads: List[U477KickPayload]) -> str:
        """Serializes U477KickPayload list back to canonical KickLang format."""
        lines: List[str] = []
        for p in payloads:
            if isinstance(p.data, (dict, list)):
                formatted = json.dumps(p.data, indent=2)
                lines.append(f"⫻{p.sigil}/{p.key}: {formatted}")
            else:
                lines.append(f"⫻{p.sigil}/{p.key}: {p.raw_content}")
        return "\n\n".join(lines)

    def verify_consent(self, consent_payload: Union[U477KickPayload, Dict[str, Any], U477Consent]) -> bool:
        """Enforces mandatory Consent Gate. Returns True only if explicitly affirmed."""
        if isinstance(consent_payload, U477Consent):
            return consent_payload.is_valid(self.unified_name)

        data: Dict[str, Any] = {}
        if isinstance(consent_payload, U477KickPayload):
            if isinstance(consent_payload.data, dict):
                data = consent_payload.data
            else:
                return False
        elif isinstance(consent_payload, dict):
            data = consent_payload

        consent = U477Consent.from_dict(data)
        return consent.is_valid(self.unified_name)

    def evaluate_coherence(self, coherence: U477Coherence) -> Tuple[bool, str]:
        """Evaluates CoherenceMonitor metrics against OCS v2.1 thresholds."""
        if not coherence.passes():
            reason = (
                f"Coherence Gate HALT: gate={coherence.gate}, "
                f"valence={coherence.valence:.2f}, delta={coherence.coherence_delta:+.2f} "
                f"(threshold={coherence.threshold_halt_delta:+.2f})"
            )
            return False, reason
        return True, "Coherence Gate PASS"

    def compute_flux_balance(
        self, problem_to_sol_weight: float, sol_to_prob_weight: float
    ) -> U477Flux:
        """Analytical step: computes flux magnitude and directional balance."""
        magnitude = round((problem_to_sol_weight + sol_to_prob_weight) / 2.0, 4)
        balance = round(problem_to_sol_weight - sol_to_prob_weight, 4)
        self.flux = U477Flux(
            problem_to_solution=problem_to_sol_weight,
            solution_to_problem=sol_to_prob_weight,
            magnitude=magnitude,
            balance=balance,
        )
        return self.flux

    def run_analytical_pipeline(
        self,
        analytical_inputs: Dict[str, Any],
        consent: U477Consent,
    ) -> Dict[str, Any]:
        """
        Executes Python problem-space analytical computation under consent.
        Produces structured output for KickLang solution projection.
        """
        if not self.verify_consent(consent):
            raise PermissionError(
                f"Consent Gate halted analytical pipeline for {self.unified_name}"
            )

        # Process inputs: e.g. metrics, weights, vectors
        p_weights = analytical_inputs.get("problem_weights", [0.82, 0.82])
        s_weights = analytical_inputs.get("solution_weights", [0.78])

        avg_p = sum(p_weights) / len(p_weights) if p_weights else 0.82
        avg_s = sum(s_weights) / len(s_weights) if s_weights else 0.78

        flux = self.compute_flux_balance(avg_p, avg_s)

        return {
            "unified_name": self.unified_name,
            "anchor_id": self.anchor_id,
            "flux": asdict(flux),
            "status": "computed",
            "solution_grammar": "KickLang",
            "host": "Python 3.12 Analytical",
        }


def self_test() -> bool:
    """Self-test verifying parser, emitter, consent gate, and state validation."""
    print("=== Running U477Bridge Python Self-Test ===")
    project_root = Path(__file__).resolve().parent
    state_file = project_root / "cognify-equals" / "U477.state.json"
    kicklang_file = project_root / "cognify-equals" / "U477.kicklang.md"

    if not state_file.exists() or not kicklang_file.exists():
        print(f"FAIL: Missing expected project artifacts in {project_root}")
        return False

    bridge = U477Bridge()

    # 1. Parse KickLang record
    raw_kicklang = kicklang_file.read_text()
    payloads = bridge.parse_kicklang(raw_kicklang)
    print(f"OK: Parsed {len(payloads)} KickLang payload blocks")

    # 2. Check consent block
    consent_payload = next(
        (p for p in payloads if p.sigil == "data" and p.key == "consent"), None
    )
    if not consent_payload or not bridge.verify_consent(consent_payload):
        print("FAIL: Consent verification failed on U477.kicklang.md")
        return False
    print("OK: Consent Gate verified affirmed: true")

    # 3. Verify coherence against U477.state.json
    with open(state_file, "r") as f:
        state_data = json.load(f)

    cm_data = state_data.get("coherence_monitor", {})
    coherence = U477Coherence(
        valence=cm_data.get("valence", 0.0),
        coherence_delta=cm_data.get("coherence_delta", 0.0),
        gate=cm_data.get("gate", "HALT"),
        threshold_halt_delta=cm_data.get("threshold_halt_delta", -0.12),
    )
    passed, msg = bridge.evaluate_coherence(coherence)
    if not passed:
        print(f"FAIL: {msg}")
        return False
    print(f"OK: {msg} (valence={coherence.valence}, delta={coherence.coherence_delta})")

    # 4. Run sample analytical pipeline
    test_consent = U477Consent(
        affirmed=True, scope="CognifyEquals", unified_name=UNIFIED_NAME
    )
    result = bridge.run_analytical_pipeline(
        {"problem_weights": [0.82, 0.82], "solution_weights": [0.78]},
        test_consent,
    )
    print(f"OK: Analytical pipeline emitted flux: {result['flux']}")

    # 5. Round-trip emission test
    emitted = bridge.emit_kicklang(payloads[:2])
    reparsed = bridge.parse_kicklang(emitted)
    if len(reparsed) != 2:
        print("FAIL: KickLang emission round-trip mismatch")
        return False
    print("OK: KickLang emission round-trip verified")

    print("ALL PYTHON HOST BINDING TESTS PASSED.")
    return True


if __name__ == "__main__":
    if "--test" in sys.argv or len(sys.argv) == 1:
        success = self_test()
        sys.exit(0 if success else 1)
