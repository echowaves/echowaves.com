# Accessibility lens — DESIGN.md + EXPERIENCE.md

Run inline by the facilitator: three dispatched subagent lenses returned empty in this
sandbox (17 min, no file), so the checks were done here instead of charged to again.
Ratios recomputed from the hex values with the WCAG relative-luminance formula.

| # | Severity | Location | Finding | Fix |
|---|---|---|---|---|
| 1 | Blocker | DESIGN.md → Colors; EXPERIENCE.md → Accessibility Floor | Neither spine said anything about `forced-colors` mode. Windows High Contrast replaces the authored canvas with a system one and keeps our text colours: `#8dfa9c` on white is **1.29:1**, `--accent` 2.01:1, `--text-dim` 3.03:1. The site becomes unreadable, not just unpretty. | Added a `forced-colors: active` block to `src/index.css` handing colouring back to the system (`Canvas`, `CanvasText`, `LinkText`) and dropping the window shadow; rule now stated in both spines. |
| 2 | Major | DESIGN.md → Components (tab bar) | A horizontally scrollable tab strip must keep the focused tab visible (WCAG 2.4.11). The spine said "scrolled into view by the browser" without noting that a sticky header can cover it. | Implemented: `scroll-padding-block-start` on `html`, and `.tab` min-height 44px for touch targets. Stated in EXPERIENCE.md → Accessibility Floor. |
| 3 | Major | DESIGN.md → Colors / Typography | Links were specified by colour only ("green means link"). Green-on-green gives no reliable non-colour cue (WCAG 1.4.1). | Underline is now the default for every link (`text-decoration-thickness` 1px, 2px on hover); DESIGN.md states underline means link and nothing else. |
| 4 | Minor | EXPERIENCE.md → Accessibility Floor | Hex values were restated in the experience spine, which can drift from DESIGN.md's token block. | Floor now references `{colors.*}` tokens and cites ratios only as evidence. |
| 5 | Minor | DESIGN.md → Components (man page) | The `<h1>` renders `dmitry@echowaves (1) — teams · collaboration · AI capacity`; assistive tech also reads the manual-section marker "(1)". | Accepted: it is the man-page convention and the summary that follows is the meaningful part. Recorded rather than silently ignored. |
| 6 | OK | DESIGN.md → Colors | Contrast table verified correct as written: text 15.71, text-dim 6.69, accent 10.09, emphasis 12.01, danger 6.78, border 3.81 (boundaries only). No token is used for a role it cannot serve. | None. |
| 7 | OK | Blinking caret | Motion is gated behind `prefers-reduced-motion: no-preference`, so the default render is static; acceptable under WCAG 2.2.2 for a decorative caret of this size. | None. |

Accepted trade-off, unchanged: dark-only palette. Forced-colours support (finding 1) is
the mitigation offered instead of a light theme.

**Superseded 2026-10-26.** Four light palettes now ship and the reader picks in the title bar, so
forced colours is no longer the substitute for a light scheme — it is just forced colours. The
trade-off moved rather than vanished: seven of the eight palettes are other people's published colour
systems held to a 2.5:1 legibility floor instead of AA, and every sub-AA ratio they carry (eleven in
all, worst 3.03:1 for Dracula body copy) is named in DESIGN.md → Colors → Themes rather than bent to
compliance. Phosphor — the palette this lens measured — remains bound to AA on every role, so nothing
in the table above changed.
