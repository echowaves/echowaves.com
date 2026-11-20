---
title: 'AA text contrast for every palette'
type: 'bugfix'
created: '2026-10-26'
status: 'done'
route: 'oneshot'
review_loop_iteration: 0
baseline_commit: '31855ef5a38b8a6afcfa7c89a51ad964262ab86a'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** With Dracula active the hero body copy is effectively invisible — `--text-dim` ships Dracula's published Comment color `#6272a4` on background `#282a36`, a 3.03:1 mud (reader report 2026-10-26). The "canonical hexes ship as published" ruling from spec-multiple-themes let nine text roles across five palettes below WCAG AA reach production; verify recorded them instead of failing.

**Approach:** Supersede that ruling for text roles: every palette's text-role tokens (headlines, body copy, prompt/links, emphasis, danger, ink-on-accent) must measure ≥ 4.5:1 against their ground. Adjust the offending hexes the minimum amount — same hue, nudged lightness — and record each adjustment in the registry's `source` note and DESIGN.md's table, exactly as Phosphor's measured palette already does. Border/rule tokens keep today's exemption (pale rules stay canonical).

## Decisions (answered 2026-10-26)

- Fix scope: all palettes — enforce ≥4.5:1 on every text role, adjusting the recorded sub-AA values (reader chose this over Dracula-only).

</frozen-after-approval>

## Implementation Notes

- Policy now: every text role must clear 4.5:1 in every palette **on the surface its text renders on** — roles against `background`, plus new roles `text-dim`/`accent` against `panel` (the chrome paints panel: tabs, footer meta, links) and `text` against `panel-raised` (hero chips). `border` is held to 3:1 only where `measured` (Phosphor). `LEGIBILITY_FLOOR` deleted from the registry and the verifier.
- Thirteen hue-preserving lightness nudges across six palettes (each narrated in its `source`, flagged `nudged: true` for the generated tables): dracula text-dim `#6272a4→#afb7d1`, panel-raised `#6272a4→#5f70a3`; solarized-light text-dim `#586e75→#566b72`, accent `#268bd2→#1e6ca3`, emphasis `#cb4b16→#c24815`, danger `#dc322f→#d72724`; one-light accent `#4078f2→#2363f0`, danger `#e45649→#d72f20`; gruvbox-light emphasis `#b57600→#966200`; nord accent `#88c0d0→#91c5d3`, danger `#bf616a→#d08b91`; solarized-dark accent `#2aa198→#2caaa0`, danger `#dc322f→#e56663`. The panel-surface pass was found in Blind Hunter review: measuring only against background left Dracula's tab labels at 2.97:1 — the same invisible-text class this spec exists to end.
- The two sub-AA ink-on-accent roles (Solarized Light, One Light) needed no token of their own — they ride on `accent`, so nudging the accent healed them too. Dracula keeps published Comment `#6272a4` for border/decoration (rules exempt); only body copy and the raised surface moved.
- Favicons regenerated for the four palettes whose accent moved (solarized-light, one-light, nord, solarized-dark); contrast tables in DESIGN.md regenerated via `node scripts/contrast.mjs`, which now labels nudged palettes honestly, exempts guest rules in `--text` verdicts, and formats ratios with `toFixed(2)`.

## Review Triage Log

Blind Hunter (oneshot layer; edge-case and verification-gap layers skipped per route). 10 findings.

- **high — patch**: AA was measured only against `--background`, but text renders on `--panel` (tabs, footer meta, links) and `--panel-raised` (hero chips): Dracula tab labels sat at 2.97:1 — the same invisible-text class this spec exists to end; Solarized Light dim/accent, One Light accent, Nord accent, Solarized Dark accent and Dracula text-on-raised also failed. Fixed by three new `CONTRAST_ROLES` entries (against panel ×2, panel-raised ×1) and a second pass of six nudges; verify now enforces every surface.
- **false — two nudges "max out saturation"**: recomputed HSL for all nine first-pass pairs; published vs nudged saturation differs by ≤0.4 points (rounding), hue by ≤1°. The claim's own suggested hexes were wrong, not the nudges.
- **low — patch**: generated tables and the script disagreed on Hexes-column labels ("canonical" vs blanket "guest palette…"), so regeneration would have rewritten the doc. Added `nudged` flag; script now emits exactly the doc's wording. Phosphor row relabelled "measured here, AA incl. rules"; `--text` verdicts mark exempt guest rules instead of crying "below AA".
- **low — patch**: ratio formatting dropped trailing zeros (`8:1` beside `5.25:1`) contradicting the lib's comment; writers now `toFixed(2)` and the docstring tells the truth.
- **low — patch**: stale "ship their published hexes" prose survived in DESIGN.md front matter, its Phosphor intro ("where that precedence stops applying"), and implied contrast policy; all three rewritten for the surface-aware AA rule.
- **medium — patch (spec hygiene)**: Implementation Notes counted nine nudges across five palettes mid-flight; corrected to thirteen across six once the surface pass landed. Frozen Intent's "nine text roles / five palettes" left untouched per freeze.
- **medium — defer**: hue-preservation itself is unenforced (see deferred-work.md).
- **medium — defer**: favicon pixels not checked against registry accents (see deferred-work.md).
- **defer**: `.btn-outline` boundary below 3:1 in guests — pre-existing, exempt-by-ruling palette rules; needs a DESIGN.md decision on control boundaries (deferred-work.md).
