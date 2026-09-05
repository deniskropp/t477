/**
 * u477Bridge.ts — TypeScript Host Binding for U477 Dual-Space Bridge
 * CognitiveSpace.CognifyEquals v1.0 · OCS v2.1 · Three-Agent-Core
 *
 * Provides typed delivery host capabilities for U477:
 * - Parsing & emission of KickLang ⫻sigil payloads into TypeScript types
 * - Consent Gate enforcement for delivery/client mutations
 * - CoherenceMonitor validation and telemetry badging
 * - Projection of analytical states into reactive UI / client delivery surfaces
 */

declare const require: {
  (moduleName: string): any;
  main: any;
};
declare const module: any;
declare const process: any;
declare const __dirname: string;

const fs = require('fs');
const path = require('path');

export const UNIFIED_NAME = 'U477';
export const RTA_ANCHOR_ID = 'rta-U477-c2beec09-fae4-4392-9008-bedf6ceaba96';
export const DEFAULT_HALT_DELTA = -0.12;

export interface U477Consent {
  affirmed: boolean;
  scope: string;
  unified_name: string;
}

export interface U477Coherence {
  valence: number;
  coherence_delta: number;
  gate: 'PASS' | 'HALT';
  threshold_halt_delta?: number;
  recommended_recalibration?: string | null;
  notes?: string | null;
}

export interface U477Flux {
  problem_to_solution: number;
  solution_to_problem: number;
  magnitude: number;
  balance: number;
}

export interface U477TASBlock {
  id: string;
  horizon: string;
  priority: string;
  next_action: boolean;
  description: string;
  dependencies?: string[];
  deployed?: boolean;
}

export interface U477KickPayload {
  sigil: string;
  key: string;
  rawContent: string;
  data?: any;
}

export interface U477State {
  primitive: string;
  version: string;
  ocs: string;
  timestamp: string;
  unified_name: string;
  consent: U477Consent;
  problem_space: string[];
  solution_space: string[];
  rta: {
    anchor_id: string;
    graph_position: {
      node: string;
      layer: string;
      edges: string[];
    };
  };
  solution_problem_flux: {
    direction: string;
    problem_to_solution: {
      vector: string[];
      weight: number;
      interpretation: string;
    };
    solution_to_problem: {
      vector: string[];
      weight: number;
      interpretation: string;
    };
    flux_magnitude: number;
    balance: number;
  };
  coherence_monitor: U477Coherence;
  tas_block: U477TASBlock;
  meta_dna_tags: string[];
  recommended_next_tas: string[];
  status: string;
}

export interface DeliveryCard {
  title: string;
  value: string;
  category: 'telemetry' | 'state' | 'governance';
}

export interface U477DeliverySurface {
  unifiedName: string;
  anchorId: string;
  statusBadge: string;
  coherenceBadge: string;
  cards: DeliveryCard[];
  renderedMarkdown: string;
}

export class U477TypeScriptBridge {
  readonly unifiedName: string;
  readonly anchorId: string;
  readonly haltThreshold: number;

  constructor(
    anchorId: string = RTA_ANCHOR_ID,
    unifiedName: string = UNIFIED_NAME,
    haltThreshold: number = DEFAULT_HALT_DELTA
  ) {
    this.anchorId = anchorId;
    this.unifiedName = unifiedName;
    this.haltThreshold = haltThreshold;
  }

  /**
   * Parses raw KickLang text into structured U477KickPayload objects.
   */
  parseKickLang(text: string): U477KickPayload[] {
    const payloads: U477KickPayload[] = [];
    const pattern = /⫻([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9_\-]+):\s*([\s\S]*?)(?=(?:⫻[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+:)|```|$)/g;

    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const sigil = match[1].trim();
      const key = match[2].trim();
      const content = match[3].trim();

      let data: any = content;
      if (content.startsWith('{') && content.endsWith('}')) {
        try {
          data = JSON.parse(content);
        } catch {
          try {
            const normalized = content
              .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
              .replace(/:\s*true\b/g, ': true')
              .replace(/:\s*false\b/g, ': false');
            data = JSON.parse(normalized);
          } catch {
            data = content;
          }
        }
      }

      payloads.push({
        sigil,
        key,
        rawContent: content,
        data,
      });
    }

    return payloads;
  }

  /**
   * Serializes structured payloads into KickLang block syntax.
   */
  emitKickLang(payloads: U477KickPayload[]): string {
    return payloads
      .map((p) => {
        const body =
          typeof p.data === 'object' && p.data !== null
            ? JSON.stringify(p.data, null, 2)
            : p.rawContent;
        return `⫻${p.sigil}/${p.key}: ${body}`;
      })
      .join('\n\n');
  }

  /**
   * Consent Gate: validates affirmed consent for this unified name.
   */
  verifyConsent(consent: U477Consent | U477KickPayload | any): boolean {
    if (!consent) return false;
    const target = consent.data ? consent.data : consent;
    return target.affirmed === true && target.unified_name === this.unifiedName;
  }

  /**
   * Coherence Gate: verifies valence, gate status, and delta threshold.
   */
  evaluateCoherence(coherence: U477Coherence): { passed: boolean; message: string } {
    const threshold = coherence.threshold_halt_delta ?? this.haltThreshold;
    if (coherence.gate !== 'PASS') {
      return {
        passed: false,
        message: `Coherence gate HALT: gate is ${coherence.gate}`,
      };
    }
    if (coherence.coherence_delta < threshold) {
      return {
        passed: false,
        message: `Coherence delta ${coherence.coherence_delta} below threshold ${threshold}`,
      };
    }
    if (coherence.valence <= 0.0) {
      return {
        passed: false,
        message: `Valence non-positive (${coherence.valence})`,
      };
    }
    return {
      passed: true,
      message: `Coherence PASS: valence=${coherence.valence.toFixed(2)}, delta=${coherence.coherence_delta > 0 ? '+' : ''}${coherence.coherence_delta.toFixed(2)}`,
    };
  }

  /**
   * Delivery Surface Projection: projects analytical state into typed UI cards.
   */
  projectDeliverySurface(state: U477State): U477DeliverySurface {
    const coherenceResult = this.evaluateCoherence(state.coherence_monitor);
    const statusBadge = `[STATUS: ${state.status.toUpperCase()}]`;
    const coherenceBadge = coherenceResult.passed
      ? `[COHERENCE: PASS (+${state.coherence_monitor.coherence_delta.toFixed(2)})]`
      : `[COHERENCE: HALT]`;

    const cards: DeliveryCard[] = [
      {
        title: 'Unified Name',
        value: state.unified_name,
        category: 'state',
      },
      {
        title: 'Anchor ID',
        value: state.rta.anchor_id,
        category: 'state',
      },
      {
        title: 'Problem Surface Flux (P→S)',
        value: `${state.solution_problem_flux.problem_to_solution.weight.toFixed(2)} (${state.problem_space.join(', ')})`,
        category: 'telemetry',
      },
      {
        title: 'Solution Grammar Flux (S→P)',
        value: `${state.solution_problem_flux.solution_to_problem.weight.toFixed(2)} (${state.solution_space.join(', ')})`,
        category: 'telemetry',
      },
      {
        title: 'Valence / Delta',
        value: `${state.coherence_monitor.valence.toFixed(2)} / +${state.coherence_monitor.coherence_delta.toFixed(2)}`,
        category: 'telemetry',
      },
      {
        title: 'Active TAS Block',
        value: `${state.tas_block.id} (${state.tas_block.horizon}, ${state.tas_block.priority})`,
        category: 'governance',
      },
    ];

    const renderedMarkdown = [
      `### U477 Delivery Surface — ${statusBadge} ${coherenceBadge}`,
      `**Anchor:** \`${state.rta.anchor_id}\``,
      '',
      '| Metric | Value | Category |',
      '|---|---|---|',
      ...cards.map((c) => `| ${c.title} | ${c.value} | ${c.category} |`),
    ].join('\n');

    return {
      unifiedName: state.unified_name,
      anchorId: state.rta.anchor_id,
      statusBadge,
      coherenceBadge,
      cards,
      renderedMarkdown,
    };
  }
}

/**
 * Self-test execution logic for TypeScript delivery host.
 */
export function selfTest(): boolean {
  console.log('=== Running U477TypeScriptBridge Self-Test ===');

  // Find project root either from dist/ or directly
  const projectRoot = fs.existsSync(path.join(__dirname, 'cognify-equals'))
    ? __dirname
    : path.resolve(__dirname, '..');

  const statePath = path.join(projectRoot, 'cognify-equals', 'U477.state.json');
  const kicklangPath = path.join(projectRoot, 'cognify-equals', 'U477.kicklang.md');

  if (!fs.existsSync(statePath) || !fs.existsSync(kicklangPath)) {
    console.error(`FAIL: Artifacts missing in ${projectRoot}`);
    return false;
  }

  const bridge = new U477TypeScriptBridge();

  // 1. Parse KickLang file
  const rawKickLang = fs.readFileSync(kicklangPath, 'utf8');
  const payloads = bridge.parseKickLang(rawKickLang);
  console.log(`OK: Parsed ${payloads.length} KickLang payload blocks in TypeScript`);

  // 2. Consent verification
  const consentPayload = payloads.find((p: U477KickPayload) => p.sigil === 'data' && p.key === 'consent');
  if (!consentPayload || !bridge.verifyConsent(consentPayload)) {
    console.error('FAIL: TypeScript consent verification failed');
    return false;
  }
  console.log('OK: Consent Gate verified affirmed: true');

  // 3. Project Delivery Surface from U477.state.json
  const rawState = fs.readFileSync(statePath, 'utf8');
  const state: U477State = JSON.parse(rawState);

  const surface = bridge.projectDeliverySurface(state);
  console.log(`OK: Projected delivery surface with ${surface.cards.length} cards`);
  console.log(`    Status Badge:    ${surface.statusBadge}`);
  console.log(`    Coherence Badge: ${surface.coherenceBadge}`);

  // 4. Emit and re-parse test
  const emitted = bridge.emitKickLang(payloads.slice(0, 2));
  const reparsed = bridge.parseKickLang(emitted);
  if (reparsed.length !== 2) {
    console.error('FAIL: TypeScript KickLang emission round-trip mismatch');
    return false;
  }
  console.log('OK: TypeScript KickLang emission round-trip verified');

  console.log('ALL TYPESCRIPT HOST BINDING TESTS PASSED.');
  return true;
}

// Direct CLI execution
if (typeof require !== 'undefined' && require.main === module) {
  const success = selfTest();
  process.exit(success ? 0 : 1);
}
