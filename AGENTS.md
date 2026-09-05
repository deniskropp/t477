# AGENTS — t477 CognifyEquals · U477 Dual-Space Bridge

This repo is the portfolio artifact for **Unified_Name_ `U477`**: a consented, coherence-gated unification of dual-language problem surfaces (**Python** and **TypeScript**) with **KickLang** as the orchestration solution grammar. Operate it through the `t477-cognify-equals` skill.

## Grounding

1. **Workspace:** `/home/dok/Projects/t477`.
2. **Skill:** `~/.grok/skills/t477-cognify-equals` (synced to `/home/workdir/.grok/skills/t477-cognify-equals`).
3. **Core Engine:** CognifyEquals v1.0 primitive running under OCS v2.1.
4. **Anchor:** `rta-U477-c2beec09-fae4-4392-9008-bedf6ceaba96`.
5. **Three-Agent-Core:**
   - **KickForge**: Grammar bindings, payload extraction (`⫻data/tas`, `⫻data/ptas`), dual-space decomposition.
   - **KickFlow**: Dual-space pipeline orchestration, visual artifacts (`U477.flux.mmd`), TAS block lifecycle (`TAS-Block-0612-Cognify`).
   - **KickGuard**: Consent gate validation, CoherenceMonitor checks (halt if `coherence_delta < -0.12` or valence negative), Meta-DNA integrity.
6. **Consent Gate:** Explicit affirmed consent payload is mandatory prior to any state mutation, git push, or MCP external sync:
   ```kicklang
   ⫻data/consent: { affirmed: true, scope: "CognifyEquals", unified_name: "U477" }
   ```

## Validation & Coherence

```bash
# Validate skill tree structure and repository contracts
~/.grok/skills/t477-cognify-equals/scripts/validate-skill.sh

# Check U477 anchor and coherence state
~/.grok/skills/t477-cognify-equals/scripts/check-coherence.sh
```
