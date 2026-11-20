---
title: 'Multiple themes with light/dark/system/custom control'
type: 'feature'
created: '2026-10-25'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: 'cb75bb0d37a623262c1019da0d07e8644c8255ff'
context:
  - '_bmad-output/echowaves-site/ux-site-redesign/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The site is dark-only by contract (DESIGN.md: "Dark only. No light scheme and no in-page toggle this release"). Readers on light systems or in bright rooms get one palette with no say. There is no theme mechanism at all: `color-scheme: dark` and `theme-color #060606` are hardcoded, and the logo/favicon are single fixed assets.

**Approach:** Turn the existing token layer (`src/index.css` — every color already flows through CSS variables) into a theme registry. Ship a set of well-known palettes split into two groups, light and dark. A header control offers the standard four-way preference — light / dark / system / custom; light, dark and system resolve to user-chosen per-group defaults; custom lets the user pin explicit themes per group. The browser-tab chrome (theme-color meta, favicon) and the nav logo follow the active theme.

## Boundaries & Constraints

**Always:**
- One preference control with exactly four modes: `light`, `dark`, `system`, `custom` (GitHub's model). `system` follows `prefers-color-scheme`.
- Two user-selected defaults: default light theme and default dark theme, persisted in `localStorage`; custom mode pins an explicit theme per group.
- Every palette is a block of the same CSS variable names; the active palette is applied via an attribute on `<html>`, and `color-scheme` matches the active theme's group.
- The inline theme script runs before first paint (no flash) and degrades to system-default palettes with JS disabled.
- Favicon, `theme-color` meta, logo tint, and manifest colors track the active theme.
- Update DESIGN.md: the "Dark only" ruling is superseded; record the new theming contract.

## Decisions (answered 2026-10-25)

- **Roster: curated 8.** Light group: GitHub Light, Solarized Light, One Light, Gruvbox Light. Dark group: Phosphor (current palette — dark default), Dracula, Nord, Solarized Dark.
- **Contrast: canonical hexes as-is.** Each palette ships its published values; no AA-driven drift of theme hexes. (Human decision — supersedes "measured contrast beats canonical hex" for added palettes only; Phosphor keeps its measured values, print/forced-colors rules untouched.)
- **Custom mode: GitHub-style pair.** Custom pins one light theme and one dark theme; scheme resolution behaves like `system` with the pinned themes in place of the defaults.
- **Control: native selects in the titlebar.** One select for mode (light/dark/system/custom); in custom mode, two additional selects pin the light and dark themes. Native widgets, keyboard- and AT-accessible by default.

**Never:**
- No framework, no client-side router, no theme library — hand-rolled tokens + one small inline script. The site stays static with zero shipped JS bundles (the existing gtag inline script is the only precedent).
- Do not touch `@media print` or `@media forced-colors` behavior.
- Do not introduce per-component hardcoded colors; `npm run verify` ("styles speak only in tokens") must keep passing, updated for the new token blocks as needed.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| First visit | no stored preference | Palette follows OS scheme via its group default; control shows `system` | N/A |
| JS disabled | any OS scheme | Server-rendered media-query defaults pick each group's default theme; no control interaction, page readable | N/A |
| Stored corrupt/unknown theme id | localStorage tampered | Fall back to `system`; overwrite on next valid change | Silent fallback |
| OS flips scheme while in `system` | matchMedia change event | Palette swaps live without reload | N/A |
| Custom mode | user pins e.g. Solarized Light + Dracula | Light-scheme contexts resolve pinned light theme, dark-scheme contexts the pinned dark theme; `system`-like following stays intact | Invalid pin → group default |
| Print / forced colors | either media query active | Existing token redefinitions win exactly as today | N/A |

</frozen-after-approval>

## Code Map

- `src/index.css` -- the single token home: `:root` declares all color tokens (Phosphor values), `html { color-scheme: dark }`, print/forced-colors blocks redefine tokens. Theme palette blocks will follow this same pattern.
- `src/layouts/BaseLayout.astro` -- `<head>`: hardcoded `<meta name="theme-color" content="#060606">`, static favicon `<link>`s, manifest link. Add theme script + per-theme head wiring here.
- `src/components/site/SiteHeader.astro` -- titlebar with `<img src="/logo.png">` (transparent monochrome mark); control mounts here; logo becomes token-tinted.
- `src/data/site.ts` -- site data home (nav, hero). Theme registry (id, label, group, default) belongs beside it as a new module, e.g. `src/data/themes.ts`.
- `scripts/make-icons.mjs` -- regenerates all favicons + logo.png from `scripts/echowaves-logo.jpeg` with ImageMagick; currently one fixed artwork tint. Extend to emit per-theme favicon variants and manifest colors.
- `scripts/verify-site.mjs` -- build gate: "styles speak only in tokens" parses the `:root` block and fails literal colors elsewhere; another guard asserts theme-color meta equals `--background`. Both must be taught about multi-theme blocks. Runs via `npm run check`.
- `_bmad-output/echowaves-site/ux-site-redesign/DESIGN.md` -- binding design contract; "Dark only" paragraph (Colors section) is superseded by this feature.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/themes.ts` -- add theme registry: id, label, group (`light`/`dark`), palette token map, default flags -- single source of truth for CSS, head, control and icons.
- [x] `src/index.css` -- emit one token-override block per theme keyed on `html[data-theme="<id>"]`, media-query fallbacks for no-JS group defaults, per-group `color-scheme`; keep print/forced-colors blocks untouched.
- [x] `src/layouts/BaseLayout.astro` -- inline pre-paint theme script (resolve preference → set `data-theme`, swap favicon link + theme-color meta), replace hardcoded `color-scheme`/meta assumptions.
- [x] `src/components/site/ThemeControl.astro` (new) + `SiteHeader.astro` -- four-mode control with per-group default pickers in custom mode; persisted to localStorage; keyboard/AT accessible; logo tinted from tokens instead of fixed artwork color.
- [x] `scripts/make-icons.mjs` -- generate favicon/logo variants per theme (mark tinted to the palette's accent on its background) and correct manifest/theme colors.
- [x] `scripts/verify-site.mjs` -- extend token + theme-color guards to validate every theme block declares the full token set with AA contrast where policy requires.
- [x] `_bmad-output/echowaves-site/ux-site-redesign/DESIGN.md` -- replace "Dark only" ruling with the theming contract (groups, defaults, measured palette table per theme).

**Acceptance Criteria:**
- Given a first-time visitor, when OS reports light (dark), then the default light (dark) theme renders with no flash of the wrong palette.
- Given the control set to custom with pinned themes, when the OS flips scheme, then the pinned theme for that group applies live.
- Given any active theme, then favicon, theme-color meta and logo tint match that palette, and `npm run check` passes.
- Given JS disabled or print/forced-colors media, then behavior matches today's fallback rules (system default palette; existing print/contrast overrides).

## Implementation Notes

## Spec Change Log

_(empty — no loopback; review findings routed patch/defer only)_

## Review Triage Log

| # | Finding (layer) | Verdict | Evidence / disposition |
|---|---|---|---|
| 1 | Favicon href swap has zero test coverage; filename contract spelled three independent ways (blind, edge-c, verif-gap) | medium | Demonstrated: a broken runtime template passes all 30 checks. Patched: shared `faviconHref()` helper + stub link elements assert the swap. |
| 2 | Scripts-off light OS gets dark `theme-color` meta; guard forbids the fix (blind) | low | Real mismatch with spec's "meta tracks theme". Patched: media-query light meta + guard accepts the pair. |
| 3 | `:root` hand-duplicates Phosphor; no cross-check vs registry (blind) | medium | Region check compares only generated blocks; a registry hex edit would silently desync the no-script palette. Patched: guard asserts `:root` equals dark default's tokens. |
| 4 | Print keeps green text on white paper (blind) | low | Pre-existing before this change (old block inherited the same greens); comment explicitly preserves it. Deferred — separate DESIGN.md print ruling. |
| 5 | No README feature docs; `contrast.mjs` has no npm script (blind) | low | Rejected: command documented in index.css/DESIGN.md; intent did not ask for user docs; DESIGN.md/EXPERIENCE.md updated. |
| 6 | LEGIBILITY_FLOOR comment false for borders (blind) | low | Measured gruvbox border 1.51 < 2.5; verify exempts border. Patched: comment scoped to text roles. |
| 7 | AA_TEXT/AA_UI exported but unused; thresholds duplicated (blind) | low | grep: no importers. Patched: dead constants removed. |
| 8 | Three import styles for the registry; no engines field (blind) | false | Mixed static/dynamic .ts imports predate this change (verify-site.mjs already dynamic-imports site.ts); no defect at cited location. |
| 9 | Solarized Light source cites ratio "on base3" (blind) | low | Computed: 2.98 is vs shipped `#fdf6e3` = base2; number right, ground misnamed. Patched: wording. |
| 10 | `html { color-scheme: dark }` future drift unenforced (blind) | false | Speculative future-edit harm; no reachable bad state today. |
| 11 | Control height vs --chrome-offset unchecked (blind) | low | Not browser-measurable here; meta-size control inside existing row; negligible even if true — rejected. |
| 12 | Verify success strings hardcode "Phosphor"/"twelve" (blind) | low | Cosmetic output only — rejected. |
| 13 | Stub DOM duplicated, storage key literal, payload grep in verify (blind) | low | Drift fails loudly, not silently; dev-preference tidy-up — rejected. |
| 14 | Runtime error paths untested: no matchMedia / setItem throw / addListener (blind) | low | Patched: stub states added for the guarded branches. |
| 15 | Logo mask may vanish in forced-colors mode (edge-a) | maybe-false | Plausible (forced background-color → Canvas), needs one Windows-High-Contrast check to settle. Deferred. |
| 16 | Cross-tab preference divergence, no `storage` listener (edge-b) | low | Real; six-line fix. Patched: runtime re-reads and applies on storage events. |
| 17 | JS-off control shows "Light" while palette follows OS (edge-d) | low | No `selected` attr; first option wins. Patched: `system` rendered selected. |
| 18 | Spec task said per-theme logo rasters; impl uses CSS mask (edge-e, claim) | false | Acceptance criterion ("logo tint matches palette") met by the mask; fix would be editing this build's spec — rejected per rule. |

## Verification

**Commands:**
- `ASTRO_TELEMETRY_DISABLED=1 npm run check` -- expected: astro build clean, verify reports "all checks passed" including the theme guards.
- `node scripts/make-themes.mjs` -- expected: "already matches" (registry ↔ stylesheet in sync).
- `node scripts/contrast.mjs` -- expected: per-palette contrast table as recorded in DESIGN.md.
| 19 | `scripts/contrast.mjs` redefines `ratio` instead of importing it from lib (verif-gap, other) | low | Patched: import from `scripts/lib/contrast.mjs`. |
