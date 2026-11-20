---
title: 'Sprint change proposal — guest palette fidelity over audit contrast'
type: 'change-proposal'
created: '2026-11-20'
status: 'proposed'
trigger: 'Owner directive during PageSpeed agentic-browsing work'
affects:
  - _bmad-output/specs/spec-agent-discovery-and-contrast/SPEC.md
  - _bmad-output/echowaves-site/ux-site-redesign/EXPERIENCE.md
  - _bmad-output/implementation-artifacts/deferred-work.md
supersedes_nothing: true
---

# Sprint Change Proposal — Guest Palette Fidelity over Audit Contrast

## 1. Issue summary

**Trigger.** During the Nov 20 2026 PageSpeed remediation, the owner directed: *"do not modify the existing themes — they are standard even if they do not pass all the google checks."*

**Type.** New requirement from the stakeholder who owns the design rule, narrowing a decision previously recorded as frozen.

**Problem.** The site's contrast policy treats every palette's text roles as adjustable: [spec-aa-text-contrast.md](../implementation-artifacts/spec-aa-text-contrast.md), `status: done`, carries a `<frozen-after-approval>` ruling *"Fix scope: all palettes — enforce ≥4.5:1 on every text role"*. That ruling produced **13 hue-preserving nudges across six of the eight palettes** — `solarized-light`, `one-light`, `gruvbox-light`, `dracula`, `nord`, `solarized-dark` — each flagged `nudged: true` in [themes.ts](../../src/data/themes.ts). The owner now ranks canonical fidelity to other people's published colour systems above external contrast checks, which removes the authority for further nudging.

**Evidence gathered 2026-11-20.**

- `grep -c "nudged: true" src/data/themes.ts` → 6 palettes flagged; Dracula body copy still ships `#afb7d1`, not published Comment `#6272a4`.
- `node scripts/contrast.mjs` labels those six *"published, text roles nudged to AA"* and enforces ≥4.5:1 on every text role in all eight palettes.
- [EXPERIENCE.md](../echowaves-site/ux-site-redesign/EXPERIENCE.md) → Accessibility Floor states the AA-everywhere floor as binding, with guest rules the only stated exemption.
- [deferred-work.md](../implementation-artifacts/deferred-work.md) records that nothing enforces the fidelity half of the policy: *"A future edit could repaint a guest palette wholesale in the name of AA and every check would pass."*

**Clarification on state.** The owner's reading — that themes were already left alone — is correct for shipped code. The history scrub completed the same day removed 14 historical blobs only; `main` content is unchanged, so **no revert is required and none is proposed.** What the directive adds is a forward constraint: no palette may be tuned to satisfy an external check from now on.

## 2. Impact analysis

**Epic / ticket impact.** No epic or ticket structure exists for this project — the v6 `epics.md` is gone from history and no v7 ticket tree has been created, so nothing to resequence. Any future slicing of [spec-agent-discovery-and-contrast](../specs/spec-agent-discovery-and-contrast) must carry the freeze as a constraint rather than rediscover it.

**Artifact conflicts.**

| Artifact | Conflict | Needed |
|---|---|---|
| `spec-agent-discovery-and-contrast/SPEC.md` CAP-4 | Wording *"every text role … meets WCAG AA in all eight palettes"* reads as a standing licence to adjust any palette that fails. Today it passes, so no contradiction fires — but the next failing surface would justify a nudge under this capability's own success criterion. | Add Non-goal + constrain CAP-4 to measuring and guarding, never adjusting |
| `EXPERIENCE.md` → Accessibility Floor | States AA on every text role as binding without stating that palettes are frozen. | One sentence recording the freeze and its owner |
| `deferred-work.md` hue-delta guard | Was nice-to-have; it is now the only machine enforcement of the directive. | Promote from deferred to required |
| `spec-aa-text-contrast.md` | Frozen ruling stays historically accurate — those nudges happened and stay shipped. | No edit; add a note that the ruling closed further nudging |
| PRD, Architecture, Epics | Do not exist for this project. | N/A |

**Technical impact.** No code change is required by the directive itself. One verify-gate addition is recommended so the rule survives future agents (see proposal P4). The PageSpeed contrast finding remains closed-by-deploy and untouched by this change.

## 3. Recommended approach

**Path: Direct Adjustment (Option 1)** — amend existing specs; no rollback, no scope reduction.

- **Effort:** Low. Three document edits plus one optional gate.
- **Risk:** Low if the verify guard is added; otherwise Medium — the directive stays prose-only and a later agent optimising for a Lighthouse score could repaint a guest palette and pass every existing check.
- **Timeline:** No effect on the discovery work; it removes a possible future detour into palette tuning.

**Rejected alternatives.**

- *Rollback (Option 2):* reverting the 13 nudges would restore Dracula body copy to 3.03:1 — the invisible-text defect that spec exists to end. The owner confirmed no revert is wanted.
- *MVP review (Option 3):* nothing about the site's shipped scope is at stake; this is a design-authority rule, not a scope question.

## 4. Detailed change proposals

### P1 — `spec-agent-discovery-and-contrast/SPEC.md` · Non-goals

```
OLD (last bullet):
- Registering with an external ARD registry or serving signed trust manifests and attestations.

NEW:
- Registering with an external ARD registry or serving signed trust manifests and attestations.
- Tuning any palette's hexes to satisfy a contrast audit or an external score. The eight
  palettes are frozen as shipped: guest palettes are other people's published colour systems,
  and canonical fidelity outranks Google's checks by owner decision (2026-11-20).

RATIONALE: Records the directive where every downstream build reads it.
```

### P2 — `spec-agent-discovery-and-contrast/SPEC.md` · CAP-4 success

```
OLD:
  - **success:** The contrast gate reports ≥ 4.5:1 for each text role on its own rendering
    surface in all eight palettes, with the hero's copy-on-raised role measured explicitly
    rather than inferred from body copy.

NEW:
  - **success:** The contrast gate reports ≥ 4.5:1 for each text role on its own rendering
    surface in all eight palettes, with the hero's copy-on-raised role measured explicitly
    rather than inferred from body copy. The gate measures and refuses regressions; it never
    authorises changing a palette hex to reach the number — a failure is reported, not fixed
    by editing the palette.

RATIONALE: Keeps CAP-4 testable while removing its reading as a licence to adjust themes.
```

### P3 — `EXPERIENCE.md` · Accessibility Floor, contrast bullet

```
OLD (opening):
- Contrast: every palette — Phosphor's or a guest's — clears AA on every text role, enforced
  by `npm run verify`; guests ship published hexes except where a text role failed, which is
  fixed hue-first (lightness moves, never the hue) and recorded in DESIGN.md → Colors → Themes.

NEW (append to the bullet):
  … Palettes are frozen as of 2026-11-20: the nudges that shipped stay, no palette is adjusted
  further for an external contrast check, and a sub-AA ratio reported by a third-party audit is
  answered with evidence rather than a new hex.

RATIONALE: EXPERIENCE.md is the adopted companion downstream reads; the freeze must be visible
alongside the floor it qualifies. Owned by bmad-ux, so this is a proposed edit for that owner.
```

### P4 — `deferred-work.md` · promote the hue-delta guard

```
OLD: entry stays in deferred-work as an unenforced nicety.

NEW: mark required-by "palette freeze (2026-11-20)" and scope it: store each token's published
hex as `published` in themes.ts and have verify-site.mjs fail when a text-role hex differs from
`published` by more than the recorded nudge, so an AA-driven repaint cannot pass silently.

RATIONALE: Without a machine check the directive is prose. This is the item that makes
"do not modify the existing themes" enforceable.
```

### P5 — memlog entries in both specs

Append the directive to `.memlog.md` of `spec-agent-discovery-and-contrast` and of `ux-site-redesign`, then re-derive through `bmad-spec` — SPEC.md's single writer, so no hand-editing the contract.

## 5. Implementation handoff

**Scope: Minor.** Documents plus one optional gate.

| Recipient | Responsibility |
|---|---|
| `bmad-spec` | Append P1/P2 to the discovery spec's memlog and re-derive SPEC.md |
| `bmad-ux` owner (Sally) or Dmitry | Accept P3 into EXPERIENCE.md, which bmad-spec adopted but does not own |
| `bmad-build` | P4 only: `published` field in [themes.ts](../../src/data/themes.ts) plus the verify guard |

**Success criteria.** A fresh `bmad-spec` derivation of the discovery spec shows the freeze among Non-goals and CAP-4's amended success; `npm run verify` fails a deliberate test edit that repaints one guest palette hex; no shipped hex changes as a result of this proposal.

## 6. Checklist record

Section 1 trigger/context: Done · Section 2 epic impact: N/A (no ticket tree) · Section 3 artifact conflicts: Done · Section 4 path selection: Done, Option 1 · Section 5 proposal components: Done · Section 6 review: pending approval; 6.4 `sprint-status.yaml` N/A — the project uses no sprint status file.
