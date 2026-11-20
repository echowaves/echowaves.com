---
title: 'One dynamic theme dropdown replaces the mode + custom pins'
type: 'feature'
created: '2026-10-27'
status: 'done'
route: 'dispatch'
baseline_commit: '6c0c34d89e3de9bf7814b4fcb9f39a19d90c21aa'
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The titlebar control shows up to three dropdowns — a mode select plus, in custom mode, two palette pins. Readers find it confusing: setting "my light theme" requires discovering that it lives behind choosing "Custom" first (reader report 2026-10-27).

**Approach:** One dynamic dropdown. Its selectable states are Light, Dark and System; System means "switch between my chosen light and dark palettes as the OS scheme changes". The same dropdown also carries a set-light-default and a set-dark-default section: choosing a palette there makes it that group's default (and shows it working). What used to be "Custom" is just System with non-default pins, so the mode disappears.

## Boundaries & Constraints

**Always:**
- One native `<select>` in the titlebar; keyboard operation, screen-reader announcement and OS theming stay free (the site's native-widget rule from spec-multiple-themes).
- Stored model stays `{ mode, light, dark }` under `echowaves.theme`; `mode ∈ {light, dark, system}`. Anything already stored — including `mode: 'custom'` with pins — must keep working: custom resolves exactly as system (it followed the OS with the pinned pair), pins preserved.
- With scripts off the control makes no false claim: System stays the selected option, and the palette-picking groups are disabled in markup (enabled by the runtime when it wires up).
- The runtime keeps its contract: pre-paint inline, no bundle, repaints data-theme + both theme-color metas + favicon links, follows OS live in system mode, reacts to cross-tab `storage` writes.

**Never:**
- No custom menu button re-implementing submenus/ARIA combobox patterns; no popover, no portal.
- No change to the palette registry values, contrast policy, favicons pipeline, or the no-script media-query fallback in index.css.
- Do not rename `STORAGE_KEY` or introduce a second storage key.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Pick a light palette from "set light default" | mode any | store.light = id; mode becomes light (choice visibly applies); select re-displays "Light — <label>" | unknown id → group default, same as today's `pinned()` |
| Pick System | any | mode=system; OS flip repaints between stored light/dark pins | — |
| Legacy store `{mode:'custom',light,dark}` | first load | resolves as system with those pins; next save rewrites mode as 'system' | corrupt json → {} → system + group defaults |
| Scripts off | any page | select shows System; set-default groups disabled (dead options impossible) | — |
| Another tab writes the store | storage event | this tab repaints and its select re-syncs value and dynamic labels | same guards as today |

</frozen-after-approval>

## Decisions

- Picking a palette from a "set default" section applies immediately: the pin is stored and the mode flips to that group so the change is visible (owner 2026-10-27).
- After such a pick the select re-displays the resulting mode ("Light — Solarized Light"); the displayed value always states what the page is painting (owner 2026-10-27).
- "Custom" is dropped entirely as a mode; System + pins covers every prior state and legacy stored `custom` resolves as system (owner 2026-10-27).

## Code Map

- `src/components/site/ThemeControl.astro` — the whole control markup + styles; replace mode select + hidden `#theme-pair` with one select: options `system|light|dark` (labels rendered from group defaults), then two `<optgroup label="Set light default"|"Set dark default" disabled>` listing palette ids. Keep `.control` styling and titlebar placement.
- `src/layouts/BaseLayout.astro` — the inline runtime (`themeScript`): resolve() maps legacy `custom`→system; control wiring replaces three change handlers with one: value ∈ modes → set mode; value ∈ palette ids → pin its group + set mode; sync() rewrites select.value and the two dynamic option labels ("Light — <label>"). Payload gains theme labels if absent.
- `src/data/themes.ts` — `MODES` loses `'custom'`; `MODE_LABELS` keeps light/dark/system; `themeScriptPayload()` must carry per-theme `{id, group, label, bg}` (verify cross-checks payload vs registry).
- `scripts/verify-site.mjs` — three checks rewrite: control markup guard (single select, all ids present, groups disabled in markup, system selected); `resolveThemes` states (custom pair → migration state); `operateControl` flows (pick-from-group applies and persists; label re-sync; OS flip honors pins). Stub-DOM harness (`themeDom`, ~line 234) already supports option values — extend minimally.
- `_bmad-output/echowaves-site/ux-site-redesign/EXPERIENCE.md` + `DESIGN.md` (Themes section) + `.memlog.md` — control description updates; grep for "Custom" mode wording.

## Tasks & Acceptance

**Execution:**
- [x] `src/data/themes.ts` -- drop custom mode, ensure payload carries labels -- registry stays single source of truth
- [x] `src/components/site/ThemeControl.astro` -- single dynamic select markup + disabled groups -- the UX change itself
- [x] `src/layouts/BaseLayout.astro` -- runtime resolution, migration, one-handler wiring, label sync -- behavior + back-compat
- [x] `scripts/verify-site.mjs` -- update three theme guards + harness states incl. legacy migration -- guards must fail on drift
- [x] docs (EXPERIENCE.md, DESIGN.md, memlog) -- record the new control model -- contract stays true

**Acceptance Criteria:**
- Given a fresh visit, when opening the dropdown, then exactly one select offers System/Light/Dark plus disabled set-default groups listing all eight palettes.
- Given stored `{mode:'custom',light:'solarized-light',dark:'dracula'}`, when the page loads with OS dark, then Dracula paints; after any deliberate change the store no longer says custom.
- Given mode system with pinned pair, when the OS scheme flips, then the pinned palettes swap (not group defaults).
- `ASTRO_TELEMETRY_DISABLED=1 npm run check` passes all checks.

## Implementation Notes

- Review round 1 (2026-10-27): handler hardened to modes-first with own-property lookup and group validation; `paintedModeLabel`/`SET_DEFAULT_LABELS` exported from the registry as the single label source; control check extended (four runtime ids per page, per-optgroup membership, retired `custom` option guard, theme-id/mode disjointness) and mutation-tested both ways; restore of the flip-back-to-light coverage plus partial/cross-group legacy states. All 30 checks pass. WebKit select-repaint question deferred (see deferred-work.md).

## Spec Change Log

## Review Triage Log

| # | Finding (layer) | Verdict | Evidence / disposition |
|---|-----------------|---------|------------------------|
| 1 | Four runtime-consumed ids (`theme-set-light/-dark`, `theme-mode-light/-dark`) unasserted in built markup (blind-hunter, verification-gap) | high — patch | Reviewer mutation-proved: all four deleted → 30 checks green. Fixed: per-page id assertions; re-mutation now FAILs the control check. |
| 2 | Optgroup membership unchecked per group (blind-hunter, verification-gap) | medium — patch | Whole-select membership let a dark palette sit in "Set light default". Fixed: exact `themesInGroup` membership per group; mutation (swap groups) now FAILs. |
| 3 | Handler resolved `byId[value]` before modes; prototype keys truthy; unvalidated `theme.group` (edge-case ×3, blind-hunter namespace finding) | medium — patch | One handler rework: modes checked first, own-property lookup, group validated against P.modes, else system. Registry invariant added: no theme id collides with a MODES value. |
| 4 | Label format + group labels hand-copied across three files (blind-hunter ×2) | medium — patch | `paintedModeLabel` and `SET_DEFAULT_LABELS` exported from the registry; markup imports them; runtime concatenation asserted to agree via the live flow. |
| 5 | `<option value="custom">` not retired-guarded in markup (blind-hunter) | low — patch | Added to the gone-list of the control check. |
| 6 | OS-flip-back-to-light coverage deleted; migration unlabelled; partial/cross-group legacy pins untested (blind-hunter ×2, edge-case deletion) | medium — patch | Restored `setScheme('light')` flips in main and migrated flows; migrated dynamic labels asserted; resolve states `{mode:'custom'}` and `{mode:'custom', light:'dracula'}` added (14 states now). |
| 7 | Two inverted failure messages; check named "without CSS" while asserting the no-script state (blind-hunter, verification-gap) | low — patch | Prose fixed; check renamed to "makes no claim without scripts". |
| 8 | Mode-flip-on-pick is a silent mode change / System-pair setup undiscoverable / no reset-to-default (blind-hunter ×2) | false | Frozen owner decisions 2026-10-27: apply-immediately and drop-custom were explicitly chosen over the alternatives; EXPERIENCE.md documents the model. |
| 9 | Stub `select.value` accepts any value unlike browsers (edge-case) | false | The stub's setter validates against option values (`optionValues.includes(v) ? v : ''`) before this finding; behavior already modeled. |
| 10 | Payload ships `modeLabels.system` no code reads (blind-hunter) | false | `sync()` reads `P.modeLabels.light/dark`; the map is carried whole from the registry — a filtered copy would be the second source of truth. |
| 11 | Safari may not repaint a closed select whose selected option's text changes; DOM stub cannot model (blind-hunter) | maybe-false (medium) → defer | Would settle: manual check on real Safari/WebKit that the closed control re-renders after `sync()` renames the displayed option. Deferred. |
| 12 | `.theme` container styles surplus for a single child (blind-hunter) | low — patch | Kept: `gap`/`align-items` are harmless and the wrapper still centers the control; removing is churn with no user-facing effect. |

## Verification

**Commands:**
- `node scripts/make-themes.mjs && git diff --stat src/index.css` -- expected: no registry-token churn (should be a no-op here)
- `ASTRO_TELEMETRY_DISABLED=1 npm run check` -- expected: all checks pass, including rewritten theme guards

**Manual checks:**
- Read the stub-DOM harness output lines for the new operateControl flows (apply-on-pick, migration, label sync).
