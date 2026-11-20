---
title: 'Palette fidelity guard'
type: 'feature'
created: '2026-11-20'
status: 'done'
route: 'full'
baseline_commit: 'a9afbb8fff6590704c14aef090925a33cedc61cc'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Owner ruling of 2026-11-20 freezes the eight palettes as shipped — guest palettes are other people's published colour systems, and canonical fidelity outranks an external contrast score. Nothing enforces it: [deferred-work.md](../implementation-artifacts/deferred-work.md) already records that *"a future edit could repaint a guest palette wholesale in the name of AA and every check would pass"*. The existing gate measures only whether a ratio came out ≥4.5:1, never where a hex came from.

**Approach:** Pin every guest token's shipped hex as its baseline in the registry and make `npm run verify` fail when a token departs from it — unchanged unless declared, and hue-preserving lightness-only where a nudge is declared. Prose becomes a build failure.

## Boundaries & Constraints

**Always:**
- The guard lives in `scripts/verify-site.mjs` beside the existing contrast check, using the shared colour helpers in `scripts/lib/contrast.mjs` so the table printer and the guard cannot disagree.
- Every token of every guest palette declares a baseline — full coverage, 7 themes × 12 tokens, generated from what ships today rather than recalled from upstream docs (Dmitry's ruling: never invent colour values into the registry).
- A guest token with no declared nudge must ship exactly its baseline hex.
- A guest token with a declared nudge must preserve hue and saturation, moving only lightness — matching how all 13 shipped nudges were made.
- Tolerances come from measurement of the shipped nudges: hue delta ≤ 1.5°, saturation delta ≤ 5 HSL points (observed maxima: 1.0° and 0.4). Lightness is uncapped because the AA gate already bounds legibility.
- Lifting a pin is an owner act on data, not a hidden edit: `published` and the theme's `source` narration change together in one reviewed commit, and the procedure is written down in the registry's doc comment and DESIGN.md.

**Never:**
- Populate a baseline from memory of an upstream palette's published values. A baseline is either today's shipped hex or a value the repo already documents.
- Change any shipped palette hex to satisfy this guard or any audit. The guard reports; it does not authorise tuning (see the freeze in `_bmad-output/specs/spec-agent-discovery-and-contrast/SPEC.md`).
- Add a network call, dependency, or upstream palette fetch to resolve canonical values.
- Touch `src/index.css`'s generated region by hand, or regenerate anything — no hex changes means no `npm run themes`/`icons` churn.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Guest untouched | Shipped hex equals its pinned baseline | Check passes for that token | N/A |
| Declared nudge, hue kept | `#6272a4` → `#afb7d1` (Dracula body copy) with a `nudged` entry | Check passes; lightness moved 23.9 points, hue 0.4° | N/A |
| Wholesale repaint | Guest `text-dim` changed to a different-hue hex, no `nudged` entry | Check fails naming theme, token, baseline and shipped values | Assertion failure, non-zero exit |
| Off-hue nudge | `nudged` entry declared but the new hex shifts hue past tolerance | Check fails naming the hue or saturation delta | Assertion failure |
| Missing pin | Guest theme omits a `published` entry for any token | Check fails — coverage is complete or the guard is bypassable | Assertion failure |
| Site's own palette | Phosphor declares no pins (`measured: true`) | Skipped; it has no upstream to be faithful to | N/A |

</frozen-after-approval>

## Open Questions

None — both resolved by Dmitry on 2026-11-20 (see Review Triage Log): full baseline coverage for all seven guest palettes, and `scripts/contrast.mjs` extended to print published values alongside measured ratios.

## Code Map

- `src/data/themes.ts` — single source of truth for palettes: `TOKEN_NAMES`, `CONTRAST_ROLES` (text roles are the `aa: 4.5` entries; `border` is 3:1 and exempt), `Theme` interface with `measured` and `nudged`, then the eight theme objects. Add the baseline map here as a new optional field; keep it adjacent to `source`.
- `scripts/lib/contrast.mjs` — exports `luminance`, `contrastRatio`, `ratio` only. No HSL conversion exists anywhere in the repo; add hue/saturation conversion here so guard and printer share it.
- `scripts/verify-site.mjs` — `check(label, fn)` helper at line 60 accumulates a `problems[]` array then `assert.deepEqual(problems, [])`; theme checks begin near line 759; the existing contrast check ends with *"every palette clears AA on every text role"*. Add the new check after it, following that exact idiom.
- `scripts/contrast.mjs` — prints DESIGN.md's measured tables; `--last` branch (line ~20) prints per-token lines ending with the verdict, and the markdown branch prints `hex ratio` cells. Add the pinned baseline to both.
- `_bmad-output/echowaves-site/ux-site-redesign/DESIGN.md` — carries the palette policy prose; add the override procedure here so a human reader finds it without opening the registry. (This repo has no `agents.md`; the "by hand" prohibition in DESIGN.md is about the generated CSS region, not palette hexes.)
- Do not change: `src/index.css`, `scripts/make-themes.mjs`, favicons, or any shipped hex value in the registry.

## Tasks & Acceptance

**Execution:**
- [x] `scripts/lib/contrast.mjs` -- add HSL conversion helpers for hue/saturation comparison -- guard and printer must share one definition of colour maths.
- [x] `src/data/themes.ts` -- add a `published` pin map covering all 12 tokens of each guest theme (values copied from the shipped tokens, never recalled from upstream docs) and a doc comment stating what a pin is, that Phosphor is exempt because the site measured it, and the two-line override procedure -- makes provenance data, not folklore.
- [x] `scripts/verify-site.mjs` -- add the fidelity check after the AA contrast check using the `problems[]` idiom -- enforces the freeze at build time.
- [x] `scripts/contrast.mjs` -- print each theme's published baseline next to the measured ratios, and drop the "nudged to AA" hedging from palette names now that provenance is data -- DESIGN.md tables can quote where a colour came from.
- [x] `_bmad-output/echowaves-site/ux-site-redesign/DESIGN.md` -- state the freeze and the override procedure in the palette policy section -- a human deciding about colours must not have to read TypeScript to learn the rules.
- [x] `_bmad-output/implementation-artifacts/deferred-work.md` -- mark the hue-delta entry resolved by this spec -- keeps the ledger honest.

**Acceptance Criteria:**
- Given a green `npm run verify`, when one guest token's shipped hex is changed to a different-hue value, then verify fails naming theme, token, published and shipped values, and exits non-zero.
- Given the same change reverted, when `npm run verify` runs, then all checks pass unchanged — proving no shipped hex moved.
- Given a guest theme with a token missing from its pin map, when verify runs, then it fails naming the uncovered theme and token.
- Given Phosphor, when the guard runs, then it is skipped rather than failed.
- Given the printer run, when `node scripts/contrast.mjs` prints a guest palette, then each token shows its pinned baseline beside the measured ratio.

## Implementation Notes

- **Generate the 84 pin entries, don't type them.** A one-off script that imports `themes` and prints each guest theme's `published` block from its own `tokens` guarantees a zero-diff baseline. Transcribing 84 hexes by hand is how a guard gets born failing. Delete the script afterwards; the map stays explicit data so any future edit shows in a diff.
- **`nudged` already exists and stays prose.** Its entries are free text ('lightened 24% for AA on background'), not parseable hexes — do not extract values from it. The guard's rule: a token with a `nudged` entry must have shipped ≠ pinned, within hue/sat tolerances; a token without one must be byte-identical to its pin.
- **Reuse the existing failure idiom.** `verify-site.mjs` accumulates strings into `problems[]` and finishes with `assert.deepEqual(problems, [])`; every other check follows that shape. Emit strings like `dracula text-dim: shipped #afb7d1 departs from pinned baseline #6272a4 (hue Δ 0.4°, sat Δ 0.2)`.
- **HSL conversion needs a home in `scripts/lib/contrast.mjs`.** Nothing in the repo converts hex→HSL today. Handle achromatic colours (saturation 0, undefined hue) explicitly — GitHub Light and One Light are largely greys, and `NaN` hue comparisons will silently pass or fail depending on the operator used.
- **The pin map is data the guard reads, not a second source of truth for CSS.** Only `tokens` feeds generation; `published` exists solely to be compared against.

### Recorded during implementation (2026-11-20)

- **Rule extracted to `scripts/lib/palette-fidelity.mjs`** (not in the Code Map above). `verify-site.mjs` runs its checks at import time and exposes nothing, so an inline rule could only be proven by hand-editing a real palette — which is the edit this guard forbids. The lib exports `fidelityProblems(tokenNames, themes)` returning message strings; verify asserts the array is empty, exactly as it does for every other check.
- **A nudge must be judged before it is reported.** First cut failed any token whose shipped hex differed from its pin, so a legitimate lightness-only nudge could never pass — contradicting the frozen Boundaries. The gate is now: mismatch + no `nudged` on the theme → undeclared repaint; mismatch + `nudged` + not lightness-only → off-axis nudge; mismatch + `nudged` + lightness-only → allowed.
- **A test that depends on `mkdirSync`'s return value passes once.** `mkdirSync(p, {recursive:true})` returns `undefined` when `p` already exists, so the tamper check went green then red on the next run. Scratch path is now built from `os.tmpdir()` and removed in `finally`.
- **Two more checks than planned.** Fixture drift cases and a real-file tamper probe were added to make the frozen I/O matrix rows testable rather than asserted; a printer check keeps DESIGN.md's provenance claim honest. 34 checks pass, up from 30 at baseline.
- **Nudge permission is per token, not per palette.** Review found that keying the exemption off the palette-wide `nudged` flag left six of seven guest palettes free to move any token lightness-only — the exact drift class this guard exists to stop. Permission now comes from a new `nudgedTokens: TokenName[]` on the theme, empty for every shipped palette (the pins were taken from what shipped, so nothing sits off-pin). `nudged` keeps its old meaning: history that a palette was tuned for AA, which prints as provenance and authorises nothing.

## Spec Change Log

| Date | Section | Change | Why |
|---|---|---|---|
| 2026-11-20 | Boundaries, I/O Matrix, ACs, Code Map, Tasks | Baseline source changed from "upstream published hex" to "pinned shipped hex"; dropped the rule requiring every baseline to appear in `source` narration; added the owner override procedure and a DESIGN.md task | Dmitry chose `pin_today` + `published_field` after learning that only ~12 of 96 shipped hexes are documented anywhere in the repo, so an upstream-fidelity map would have to be invented from model memory. Renegotiated with the owner present, as frozen content requires. |
| 2026-11-20 | Open Questions, Tasks | Resolved both questions: full coverage for all 7 guest palettes; printer extended to show baselines | Dmitry's answers. |
| 2026-11-20 | Implementation Notes, Verification | After review: declared that a nudge is authorised **per token** (`nudgedTokens`), not by the palette-wide `nudged` flag; corrected the check count (34) and replaced the drift proof with the automated tamper probe | A high-severity review finding — six of seven guest palettes could move any token lightness-only undeclared — traced to this spec leaving "declared nudge" unspecified while its own Boundaries say "a guest token with no declared nudge". Handled in place rather than by revert-and-re-derive: the code already implements the corrected rule and every frozen row still passes, so re-derivation would have reproduced it. KEEP: the 84 today-pinned `published` entries; `scripts/lib/palette-fidelity.mjs` as the shared rule with tolerance constants beside their measured maxima; the fixture matrix plus both tamper probes; the printer's two-mode check; DESIGN.md's freeze and override prose. |

## Review Triage Log

Three review layers ran against the staged diff (blind hunter, edge-case hunter, verification gap; the last needed one retry after returning empty). Verdicts rendered from direct measurement of the shipped code, not reviewer severity. Fixed = patched in this build.

| Finding | Verdict | Evidence & disposition |
|---|---|---|
| Nudge permission is palette-wide (`nudged: true`), so any token in six of seven guest palettes could move lightness undeclared | **high** | Reproduced: a Dracula-shaped theme with `nudged: true` and `--desk` lightened returned no problems; verification gap measured 608 such repaints that also clear the AA gate. Fixed — permission is now per token (`nudgedTokens`), with fixtures for both regimes, a "palette-wide flag authorises nothing" case, and a lightness-only tamper probe. |
| `measured: true` is an unguarded escape from the whole guard | **medium** | No check tied the flag to this site's palette; relabelling Dracula would skip fidelity. Fixed — verify now requires exactly one measured palette and that it is Phosphor. |
| A malformed pin throws instead of reporting, hiding every other violation in the run | **medium** | `fidelityProblems` on a `#12345` pin threw `not a #rrggbb colour: #12345`, naming neither theme nor token. Fixed — both pins and tokens are format-checked and reported as named problems. |
| Markdown printer branch (the tables DESIGN.md quotes) was never exercised | **medium** | Neutralising `rows()`'s pin count and the cell suffix left all 34 checks green. Fixed — the printer check now spawns both modes and asserts Dracula's `pinned 12/12` row, the Provenance column header, and that Phosphor is not reported as pinned. |
| Saturation-delta branch had no test | **medium** | Only hue fixtures existed; `MAX_SAT_DELTA` was unenforced by any case. Fixed — fixture `#8be9fd → #8be0f4` (hue Δ0.9°, sat Δ−13.9) asserts the "past ±5" failure. |
| Ledger entry deleted rather than marked resolved, and it asked for upstream comparison this build does not do | **medium** | The hue-delta entry vanished with no trace of what closed it. Fixed — `deferred-work.md` gained a Resolved section naming the guard, the check, and the deliberate scope narrowing (pins are today's hexes, per owner ruling). |
| Pins freeze today's hexes, not upstream published values | **medium** | True by construction: 84/84 pins equal their shipped tokens. This is Dmitry's `pin_today` ruling — only ~12 of 96 shipped hexes are documented in-repo, so an upstream map would be invented. Kept as designed; the limitation is stated in the Boundaries ("never populate a pin from memory") and in the ledger. |
| Near-grey tokens can trip the hue gate on a legitimate lightness move | **medium** | Measured: `#839496 → #8d9d9e` Δ2.8°, `#656c76 → #71797f` Δ6.1°, both past 1.5°. Not patched — a low-chroma threshold would be an invented constant with no data behind it (shipped saturations run continuously from 0 to 17 without a natural gap). Documented in DESIGN.md: repin in the same commit rather than widen the tolerance. |
| Nothing runs `npm run verify` automatically | **medium** | `.github/` has no workflows, so "prose becomes a build failure" rests on local discipline. Pre-existing repo-wide condition, not caused by this change — deferred to `deferred-work.md`. |
| Tolerance provenance is unverifiable — no pre-nudge hex stored | **false** | Each nudged theme's `source` narrates its origin (Dracula: "from #6272a4 … lightened in lightness only"), and the shipped table records the result; the numbers are re-derivable from the registry. |
| Failure text says a nudge "may only lighten" while darkening is allowed; printer labels off-pin tokens "(lightness only)" without computing it; DESIGN.md conflated tolerances with measured maxima | **low** | All three strings were wrong or unearned. Fixed — messages now read "may only move lightness", the printer names the declared tokens instead of asserting how they moved, and DESIGN.md separates the 1.5°/±5 tolerances from the 1.0°/0.4 observed maxima. |
| Printer check hard-coded `12` and Dracula literals | **low** | Token count now comes from `TOKEN_NAMES.length`; the Dracula hexes stay as deliberate fixture anchors, since the check's job is to catch a real registry drifting. |
| `spawnSync` calls had no timeout | **low** | Both the tamper probe and the printer spawn now carry a 30s timeout and assert the child wasn't signalled, so a hung child fails loudly instead of wedging verify. |
| Spec contradicts itself: Verification expected "31 checks", Notes said 34; `contrast.mjs \| tail -4` cannot show an unchanged table | **low** | Both true of the document. Rejected as a code finding (the fix is a spec edit) — the Verification section below now states 34 and names commands that actually answer the question. |
| "Review Triage Log" was empty while cited twice | **low** | It was, until this table was written. |
| The staged diff file would not `git apply` (bare `new file` headers) | **false** | That is the throwaway review artifact in `$TMPDIR`, not repository content; nothing in the change depends on it applying. |
| No fixture repaints an undeclared token inside a nudged palette | **medium** | Folded into the per-token fix: `a palette-wide nudged flag authorises nothing on its own` plus the lightness-only tamper probe cover exactly that path. |

## Verification

**Commands:**
- `ASTRO_TELEMETRY_DISABLED=1 npm run check` -- expected: build clean, **34** checks pass (30 at baseline). Run twice: the tamper probe writes to `$TMPDIR` and must be green on repeat runs.
- `git --no-pager diff --numstat src/data/themes.ts` -- expected: `116  0` — additions only, so no shipped hex moved.
- `node scripts/contrast.mjs | grep -E "pinned|Provenance"` -- expected: every guest row reports `pinned 12/12`; Phosphor does not.
- Automated drift proof (no hand edits): the check *"a tampered guest palette is refused by the shipped rule"* repaints Dracula body copy in a scratch copy of the registry, off-hue and lightness-only, and asserts both attempts exit non-zero naming the token.
