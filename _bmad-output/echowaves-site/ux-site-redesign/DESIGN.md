---
name: echowaves
description: A macOS Terminal window in green phosphor — an engineer's record, not a brochure.
status: final
updated: 2026-10-26
# The tokens below are Phosphor, the site's own palette and its dark default. Since 2026-10-26 it
# is one of eight palettes; the others ship their published hexes — nudged in lightness wherever
# a text role failed AA — and replace these values at runtime under `html[data-theme="…"]`,
# keeping every name. See Colors → Themes for the registry, the control and the measured contrast
# table. The CSS variables keep these names in every palette.
colors:
  background: '#060606'
  panel: '#0d0d0d'
  panel-raised: '#101010'
  border: '#2b7a3a'
  text: '#8dfa9c'
  text-dim: '#3fa852'
  decoration-green: '#2b7a3a'
  accent: '#33d24b'
  emphasis: '#febc2e'
  danger: '#ff5f57'
  ink-on-accent: '#04120a'
typography:
  name-block:
    fontFamily: "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
    fontSize: '20px'
    fontWeight: 400
    lineHeight: '1.4'
  section-label:
    fontFamily: "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
    fontSize: '13px'
    fontWeight: 400
    letterSpacing: '1.6px'
    lineHeight: '1.6'
  figure:
    fontFamily: "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
    fontSize: '23px'
    fontWeight: 600
    lineHeight: '1.3'
  body:
    fontFamily: "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
    fontSize: '15px'
    fontWeight: 400
    lineHeight: '1.65'
  micro:
    fontFamily: "'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
    fontSize: '12px'
    fontWeight: 400
    lineHeight: '1.5'
rounded:
  sm: '6px'
  md: '12px'
  full: '9999px'
spacing:
  '1': '4px'
  '2': '8px'
  '3': '12px'
  '4': '16px'
  '5': '24px'
  '6': '30px'
  '7': '46px'
  reading-column: '74ch'
components:
  window-frame:
    borderRadius: '{rounded.md}'
    borderColor: '{colors.border}'
    background: '{colors.background}'
  tab-active:
    color: '{colors.text}'
    background: '{colors.background}'
    borderBottom: '2px solid {colors.accent}'
  tab-idle:
    color: '{colors.text-dim}'
    borderBottom: '2px solid transparent'
  button-primary:
    color: '{colors.text}'
    borderColor: '{colors.accent}'
    padding: '9px 16px'
  metric-cell:
    borderLeft: '2px solid {colors.border}'
    figureColor: '{colors.text}'
    labelColor: '{colors.text-dim}'
  focus-ring:
    outline: '2px solid {colors.accent}'
    outlineOffset: '2px'
---

# DESIGN.md — echowaves.com

These two spines are the contract. They win over anything in `./.working/` on conflict; the mockups are evidence of how these decisions looked while they were being made, not a second source of truth.

## Brand & Style

The site is one macOS Terminal window, docked on a neutral grey desk. It is the operator's machine, not a brochure: the reader looks over Dmitry's shoulder at a session that happens to describe him. Register is precise and slightly geeky, earned by authenticity — real prompt syntax, real figures with named sources, no decoration that does not mean something.

The metaphor carries three things and only three: the window chrome (identity), the tab bar (navigation) and the `man` page (the hero). Below the first screen it recedes and gets out of the way of reading.

Terminal motif as credibility device, never costume — a locked rule from the first session, still binding.

## Colors

Green phosphor on near-black, tuned for contrast rather than authenticity. Every value below was measured against `{colors.background}`; where a canonical palette value failed WCAG, the measurement won. That precedence — measured contrast beats canonical hex — is itself a design rule. The table is Phosphor, the site's own palette and its dark default; Themes (below) records the other seven, where the same precedence leaves exactly one exemption: published rule colours.

| Token | Hex | Ratio | Role | Not used for |
|---|---|---|---|---|
| `{colors.background}` | `#060606` | — | Window ground, page | Text |
| `{colors.panel}` | `#0d0d0d` | — | Title bar, tab strip, footer | Small body text |
| `{colors.panel-raised}` | `#101010` | — | Raised rows, insets | — |
| `{colors.border}` | `#2b7a3a` | 3.81:1 | Rules, window frame, cell separators | **Never text** — fails AA as a text color |
| `{colors.text}` | `#8dfa9c` | 15.71:1 | Headlines, figures, commands | Body copy (too bright at length) |
| `{colors.text-dim}` | `#3fa852` | 6.69:1 | Body copy, labels, footer | Active states |
| `{colors.decoration-green}` | `#2b7a3a` | 3.81:1 | Gutter marks, disabled, decorative glyphs | Text, focus indicators |
| `{colors.accent}` | `#33d24b` | 10.09:1 | Prompt, active tab underline, focus ring | Long paragraphs |
| `{colors.emphasis}` | `#febc2e` | 12.01:1 | Exactly one emphasis per screen | Decoration |
| `{colors.danger}` | `#ff5f57` | 6.78:1 | Traffic-light red, verify failures | Body copy |
| `{colors.ink-on-accent}` | `#04120a` | — | Text sitting on an `{colors.accent}` fill (skip link) | Anything on the dark ground |
| `{colors.desk}` | `#1c1c1e` | — | The grey the window sits on, outside the frame | Anything inside the window |

Two corrections against the palette as first drafted, both from measurement: body-copy green moved `#2b7a3a → {colors.text-dim}` because 3.81:1 fails AA for text, and the border moved `#1f5c29 → {colors.border}` because 2.53:1 fails the 3:1 floor for meaningful boundaries. The color that failed as text is legal as a border, so it was demoted rather than deleted.

### Themes

Superseded 2026-10-26: ~~"Dark only. No light scheme and no in-page toggle this release."~~ The
palette layer became a registry, the reader got a choice, and Phosphor became one palette among
eight rather than the only one that exists. Everything above this heading describes Phosphor, which
is still the site's own palette, its dark default, and the identity the window was drawn for.

**Two groups, eight palettes.** Light: GitHub Light (default), Solarized Light, One Light, Gruvbox
Light. Dark: Phosphor (default), Dracula, Nord, Solarized Dark. Every palette declares the same
twelve colour tokens; a palette that declares fewer does not ship, and `npm run verify` refuses the
build. The registry — `src/data/themes.ts` — is the single source of truth for the stylesheet, the
head, the control and the favicons: `npm run themes` writes the CSS blocks from it and
a check fails if the generated region in `src/index.css` has drifted from it.

**One control, three modes.** Superseded 2026-10-27: ~~"a native select with GitHub's model:
`light`, `dark`, `system`, `custom`."~~ The title bar now carries one native select whose
selectable states are `light`, `dark` and `system`, each mode naming the palette it paints
("Light — Solarized Light"), plus two `<optgroup>` sections that set those defaults: picking a
palette there pins it as its group's default and switches to that group immediately, so the choice
visibly works. `system` means switching between the chosen pair as the OS scheme changes; what
used to be `custom` is just `system` with non-default pins, so the mode is gone — a stored
`custom` resolves as `system` with its pins, and the next save rewrites the mode. One pair of
choices is shared by every mode, persisted as a single object in `localStorage`, and an unknown id
or mode resolves to the group default and to `system` rather than throwing — tampered storage
degrades, it does not break.

**No flash, no bundle.** One inline script in `<head>` runs before first paint: it paints
`<html data-theme="…">`, repaints both `theme-color` tags and the favicon pair (the filenames come
from the registry's one template, so the head cannot ask for an icon nobody generated), follows scheme
changes live, re-reads the store when another tab writes it, and wires the control. With scripts
disabled there is no attribute to match, so each scheme falls back to its group's default through
`@media (prefers-color-scheme: light)` — which is also why the head carries a `theme-color` pair, one
per scheme: with no script to repaint it, the browser has to pick the tab colour by media query too.
Nothing ships as a JS file: the site still has no bundle, and the check that used to forbid
first-party scripts now allows exactly this one inline runtime and fails on a second.

**The tab follows the page.** `color-scheme` is declared per palette, so form controls and
scrollbars belong to the theme; `theme-color` and the two PNG favicons are repainted by the same
code (the mark in that palette's accent on that palette's ground); the nav mark is the logo used as a
CSS mask and painted with `{colors.accent}`, so it follows the palette without shipping eight copies.
The manifest and the apple-touch tile keep Phosphor's ground — a launcher installs one icon, before
any theme has been chosen.

**Contrast policy.** The precedence in this section holds for every palette, inherited ones
included: measurement beats intent. A guest palette stays itself at its published hexes — until a
text role falls below 4.5:1 **on the surface that text renders on** — body copy is measured on
the ground, tab labels and footer meta on the panel chrome, hero chips on the raised surface —
when the hue is kept and only lightness moves, the minimum that clears AA; each move is recorded
on the registry entry beside the published value it grew out of. (The first theming release
shipped Dracula's comment grey as body copy at 3.03:1, which read as invisible text.) Phosphor is
bound to AA on every role including the 3:1 floor for rules; guests publish their own rule
colours — a pale border is a light palette being itself — so rules are held to 3:1 in Phosphor
only. `npm run verify` fails the build on any text role below AA on any surface in any palette.

Every role is measured on the surface its text renders on. Regenerate with `node scripts/contrast.mjs`;
the numbers are the ones `npm run verify` enforces, from `scripts/lib/contrast.mjs`.

### Light palettes

| Theme | Ground | Hexes | Tokens |
|---|---|---|---|
| `github-light` | #ffffff | canonical | 12 |
| `solarized-light` | #fdf6e3 | published, text roles nudged to AA | 12 |
| `one-light` | #fafafa | published, text roles nudged to AA | 12 |
| `gruvbox-light` | #fbf1c7 | published, text roles nudged to AA | 12 |

| Theme | headlines | body copy | prompt, links | one emphasis | refusal red | ink on accent | tabs & meta on panel | links on panel | copy on raised | rules, frame |
|---|---|---|---|---|---|---|---|---|---|---|
| GitHub Light | `#1f2328` 15.80:1 | `#656d76` 5.25:1 | `#0969da` 5.19:1 | `#9a6700` 4.87:1 | `#cf222e` 5.36:1 | `#ffffff` 5.19:1 | `#656d76` 4.93:1 | `#0969da` 4.88:1 | `#1f2328` 13.55:1 | `#d0d7de` 1.45:1 |
| Solarized Light | `#073642` 12.05:1 | `#566b72` 5.20:1 | `#1e6ca3` 5.22:1 | `#c24815` 4.60:1 | `#d72724` 4.63:1 | `#fdf6e3` 5.22:1 | `#566b72` 4.58:1 | `#1e6ca3` 4.60:1 | `#073642` 9.71:1 | `#839496` 2.93:1 |
| One Light | `#383a42` 10.86:1 | `#696c77` 5.01:1 | `#2363f0` 4.89:1 | `#986801` 4.66:1 | `#d72f20` 4.66:1 | `#ffffff` 5.10:1 | `#696c77` 4.68:1 | `#2363f0` 4.56:1 | `#383a42` 9.43:1 | `#a0a1a7` 2.47:1 |
| Gruvbox Light | `#282828` 12.99:1 | `#504945` 7.78:1 | `#076678` 5.82:1 | `#966200` 4.58:1 | `#9d0006` 7.60:1 | `#fbf1c7` 5.82:1 | `#504945` 7.02:1 | `#076678` 5.25:1 | `#282828` 10.75:1 | `#d5c4a1` 1.51:1 |

### Dark palettes

| Theme | Ground | Hexes | Tokens |
|---|---|---|---|
| `phosphor` | #060606 | measured here, AA incl. rules | 12 |
| `dracula` | #282a36 | published, text roles nudged to AA | 12 |
| `nord` | #2e3440 | published, text roles nudged to AA | 12 |
| `solarized-dark` | #002b36 | published, text roles nudged to AA | 12 |

| Theme | headlines | body copy | prompt, links | one emphasis | refusal red | ink on accent | tabs & meta on panel | links on panel | copy on raised | rules, frame |
|---|---|---|---|---|---|---|---|---|---|---|
| Phosphor | `#8dfa9c` 15.71:1 | `#3fa852` 6.69:1 | `#33d24b` 10.09:1 | `#febc2e` 12.01:1 | `#ff5f57` 6.78:1 | `#04120a` 9.54:1 | `#3fa852` 6.42:1 | `#33d24b` 9.68:1 | `#8dfa9c` 14.76:1 | `#2b7a3a` 3.81:1 |
| Dracula | `#f8f8f2` 13.36:1 | `#afb7d1` 7.13:1 | `#8be9fd` 10.29:1 | `#ffb86c` 8.36:1 | `#ff5555` 4.53:1 | `#282a36` 10.29:1 | `#afb7d1` 4.58:1 | `#8be9fd` 6.61:1 | `#f8f8f2` 4.55:1 | `#6272a4` 3.03:1 |
| Nord | `#eceff4` 10.84:1 | `#d8dee9` 9.25:1 | `#91c5d3` 6.62:1 | `#ebcb8b` 8.00:1 | `#d08b91` 4.63:1 | `#2e3440` 6.62:1 | `#d8dee9` 6.39:1 | `#91c5d3` 4.57:1 | `#eceff4` 6.40:1 | `#4c566a` 1.69:1 |
| Solarized Dark | `#fdf6e3` 13.92:1 | `#93a1a1` 5.61:1 | `#2caaa0` 5.26:1 | `#b58900` 4.68:1 | `#e56663` 4.58:1 | `#002b36` 5.26:1 | `#93a1a1` 4.86:1 | `#2caaa0` 4.56:1 | `#fdf6e3` 9.68:1 | `#586e75` 2.79:1 |

Each role is measured on the surface its text renders on (`--background`, `--panel` or `--panel-raised`; ink-on-accent sits on `--accent`). AA is 4.5:1 for every text role in every palette; the 3:1 rule floor is enforced on palettes this site tuned — guest rules ship published and pale.

Thirteen tokens moved to clear AA on 2026-10-26, all of them in the guest palettes and each one a
lightness-only shift that keeps hue and saturation: Dracula's body copy (the published comment
grey measured 3.03:1 and read as invisible text) and its raised surface; Solarized Light's body
copy, blue, orange and red; One Light's blue and red; Gruvbox Light's orange; Nord's frost blue
and red; Solarized Dark's cyan and red. The two sub-AA ink-on-accent roles healed with their
accents — the ink is each palette's own ground. The moves are recorded on each registry entry
beside the published value they grew out of, and the nudged palettes carry a `nudged` flag so the
generated tables say so. Rules are the one exemption left — a light palette publishes pale rules
on purpose, so the 3:1 boundary floor is enforced on Phosphor only.

Two deliberate departures from "published hexes" predate that ruling and survive it, both recorded
on the registry entry rather than hidden in a stylesheet: Solarized Light's one-emphasis role takes
the palette's orange (darkened to `#c24815`, 4.6:1) instead of its yellow (`#b58900`, 2.98:1),
because Solarized's yellow is invisible on Solarized's paper and an unreadable emphasis serves
nobody; and three surface values are derived, not
published — Solarized ships two grounds per scheme, so each `panel-raised` is a 5%/8% tint toward the
neighbouring base, and One Light publishes one ground, so its panel steps darken it by 3% and 6%
lightness using the same LESS operation the palette file uses for its gutter grey.

Forced-colours and print are unchanged by theming, and had to be defended to stay that way: a palette
is keyed on `html[data-theme="…"]`, which outranks a bare `:root`, so both media blocks now match
`:root:root` and redeclare all twelve tokens. Same declarations, same behaviour as the single-palette
file they grew out of — whichever palette is active simply cannot reach paper or a system canvas.

Forced-colours mode is the exception that proves the rule: when the OS takes the canvas away (`@media (forced-colors: active)`), every token hands colouring back to the system — `Canvas`, `CanvasText`, `LinkText` — and the window shadow goes with it. Measured against a white system canvas, `{colors.text}` is 1.29:1 and `{colors.accent}` 2.01:1, so keeping the phosphor there would not be a style choice but an unreadable page. Structure survives; colour does not travel.

Print follows the same rule as forced colours: the tokens are redefined inside `@media print`, never overridden rule by rule. Colour collapses to black on white: `{colors.background}`, `{colors.panel}`, `{colors.panel-raised}` and `{colors.desk}` all become paper, `{colors.text}` and `{colors.accent}` become black (`{colors.text-dim}` and `{colors.border}` become greys that still separate without colour), because a green prompt marker is decoration a printer cannot render. The type scale is restated in points — 8/9/10/12/13/15pt for fine→heading, 20pt display — because a pixel means nothing to a printer and `@page { margin: 16mm }` sets the measure. The window frame, tab strip, path, skip link and footer links are removed; external links print their destination after the label (`mailto:` excluded, since on this site the address is always the visible text); headings avoid a break immediately after them and list rows, clauses, metrics and the man-page body avoid breaking inside. A guard fails the build if any print rule names a class nothing renders — a print stylesheet is small enough to be wrong quietly.

## Typography

Monospace everywhere, including body copy. This is the loudest typographic decision in the system and the one that makes the terminal claim honest; it also means measure matters more than size.

- Stack: `'SF Mono', 'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace`. No webfonts — no network dependency, and the fallback chain is legible on every OS.
- `{typography.name-block}` is the `man` page Name/Description block. Deliberately *not* huge: its size comes from position and color, not scale.
- `{typography.section-label}` is uppercase, tracked 1.6px, in `{colors.accent}` — it reads as a man-page section header, which is what it is.
- `{typography.figure}` carries every metric; the only place weight 600 appears at size.
- `{typography.body}` at `{spacing.reading-column}` measure. Monospace above ~80ch stops being readable; 74ch is a ceiling, not a suggestion.
- No italics (monospace italics render poorly and read as emphasis where none is meant). Underline means link and nothing else.

## Layout & Spacing

One column inside one window, max content width 1040px, padded `{spacing.6}`.

- Vertical rhythm: sections separated by `{spacing.7}`; within a section `{spacing.3}`–`{spacing.5}`.
- Metric rows are flex cells with a left rule at `{colors.border}` — never cards, never shadows.
- The window is the only container. No nested boxes except terminal-inset blocks (the `man` page body), which use `{colors.panel-raised}` and no radius.
- One breakpoint at 768px is live in `src/index.css`: above it the window floats on the desk with its frame and shadow, below it the window goes edge-to-edge (no side borders, no radius) and vertical padding drops from `{spacing.7}` to `{spacing.6}`. The 375 / 768 / 1280 targets in the project spec are met by fluid sizing rather than three separate layouts; the earlier 640/720 drift is closed.

### Token → CSS variable

Every token has one home: `src/index.css`. Nothing else defines a value.

| Token | CSS variable | State |
|---|---|---|
| `{colors.background}` … `{colors.ink-on-accent}` | `--background` … `--ink-on-accent` | live, same names |
| `{typography.*}` | `--text-fine` 12 · `--text-meta` 13 · `--text-body` 15 · `--text-lede` 17 · `--text-title` 20 · `--text-heading` 24 · `--text-figure` 24 · `--text-display` clamp(1.875rem,6vw,2.5rem) | **live since 2026-10-25.** Six sizes replaced eighteen declarations; every substitution moved ≤2px. `{typography.section-label}` is `--text-meta`, `{typography.name-block}` is `--text-title`, `{typography.figure}` is `--text-figure` (same size as the heading by intent, different role), `{typography.body}` is `--text-body` |
| `{rounded.md}` / `{rounded.sm}` | `--radius-window` / `--radius-control` | live (radii stay literal px: two values, no scale implied) |
| `{rounded.full}` | inlined on the traffic-light dots only | single use, no token needed |
| `{spacing.reading-column}` | `--reading-column` | live |
| `{spacing.1}`–`{spacing.9}` | `--space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-7` 32 · `-8` 48 · `-9` 64 | **live since 2026-10-25.** Nine steps on a 4px grid, chosen over the twelve-step option that would have renamed every value without choosing anything; six declarations moved more than 2px to land on it (hero and inset padding 56→48, 40→32; footer gap 28→24). The scale was extended from seven steps to nine because the measurements needed nine |
| `{colors.desk}` | `--desk` | live since 2026-10-25; the value was already on `body`, it simply had no name |
| ~~legacy `--bg-primary`, `--text-secondary`, …~~ | — | **removed 2026-10-25**: all 108 call sites rewritten to token names, and `npm run verify` → *styles speak only in tokens* now fails on an alias, a colour literal outside `src/index.css`, an undeclared `var()`, or a `theme-color` meta that disagrees with `{colors.background}` |

The legacy aliases existed so the palette could flip in one commit. They are gone: eleven names
(`--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--border-color`, `--text-primary`,
`--text-secondary`, `--accent-blue`, `--accent-green`, `--accent-red`, `--accent-purple`,
`--accent-hover`) described the old blue-and-grey theme in token clothing, and a component could
still reach for one and quietly leave the palette. The built stylesheet now declares twelve colours,
every one of them in `:root`.

Two checks keep the scales honest. *styles speak only in tokens* rejects a colour literal or an
undeclared `var()` outside `src/index.css`. *type and rhythm come from the scale* rejects any raw
`px`/`rem` in a `padding`, `margin`, `gap` or `font-size` declaration, so "roughly 13px" cannot
become an eighteenth font size again. Neither check carries an exemption: the three React islands
whose pre-terminal stylesheets used to be excepted were ported to Astro on 2026-10-25, and every
stylesheet in the repository is held to both rules.

## Elevation & Depth

One shadow in the whole system: the window's drop shadow on the grey desk (`0 28px 70px rgba(0,0,0,.6)`). Everything inside the window is flat; depth comes from tonal steps only — `{colors.background}` → `{colors.panel}` → `{colors.panel-raised}` — never blur, gradients or glow. A phosphor screen has no elevation, and glow is precisely the tell this site exists to avoid.

## Shapes

`{rounded.md}` on the window frame — a macOS window is rounded, and that is the metaphor's silhouette. `{rounded.sm}` for chips and small controls. `{rounded.full}` reserved for the three traffic-light dots, which are decoration, `aria-hidden`, never clickable. Interior blocks stay square-cornered: terminal content has no radius.

## Components

**Window frame.** 1px `{colors.border}`, `{colors.background}` fill, `{rounded.md}`. Title bar, tab strip, content, footer — in that order. Traffic lights sit left, then the site mark (see Component Patterns), then the path `dmitry@echowaves — ~/echowaves` in `{colors.text-dim}` with the host segment in `{colors.accent}`; the theme control hangs off the right end of the same row and keeps its own width while the path gives up its.

**Tab bar.** Primary navigation: one tab per route, lowercase labels. Idle `{components.tab-idle}`, active `{components.tab-active}` with `aria-current="page"`. Hover lifts label color to `{colors.text}` only — no underline animation, no background shift on the active tab. Visual state is never the only signal; `aria-current` carries it for assistive tech. Seven tabs do not fit 375px, so the strip wraps onto further rows instead of scrolling or collapsing into a menu: every route stays visible at once, tabs keep a 44px minimum height, and `--chrome-offset` (title bar plus one row on the wide window, two once wrapped) keeps the sticky chrome from covering what an anchor jump scrolls to. A scroll strip was tried first and rejected — a clipped tab gave no sign that more tabs existed.

**Button.** Outline-only: 1px `{colors.accent}`, label `{colors.text}`, padding from `{components.button-primary}`. One primary button per screen section. No fills — except the skip link, which inverts deliberately so it reads as a browser affordance rather than design.

**Metric cell.** Figure in `{typography.figure}` / `{colors.text}`, label beneath in `{components.metric-cell.labelColor}`, left rule 2px `{colors.border}`. Figures render from `src/data/site.ts`; no literals in components, enforced by `npm run verify`.

**Method steps.** Numbered `[1]`–`[4]` in `{colors.accent}`, title inline `{colors.text}`, body `{colors.text-dim}`. Bracket-numbering rather than `<ol>` bullets: reads as a man-page section.

**Refusal markers.** The disqualifier list was removed on 2026-10-25 (the site demonstrates capability and says nothing about who Dmitry turns away). `{colors.danger}` stays live as the traffic-light red in the window chrome; if a refusal marker returns, its glyph is ASCII `- `, because U+2717 falls inside the project's own emoji range (U+2600–U+27BF) and would fail the copy scan.

**Social card.** The one piece of the identity that leaves the browser: 1200x630 PNG at `/og.png`, the window frame (title bar, traffic lights, tab strip with `work` active) around the `<h1>` name block and the DESCRIPTION body. Text is `{colors.text}`, command `{colors.accent}`, synopsis and dash `{colors.text-dim}`, label `{colors.accent}` tracked like `.section-label`. No new colours, no imagery, no shadow beyond the frame's own border. It is generated by `npm run og` from `hero` in `src/data/site.ts` — never hand-edited — so a shared link cannot quote copy the page has stopped saying; the reviewable source is `scripts/og-card.svg`, and `npm run verify` fails if any built page points at a card that does not exist, is not 1200x630, has empty `og:image:alt`, or still uses an app icon.

**Site mark.** The company mark: a spiral of segmented arcs around a stem, brand teal `#03C39A` on transparent. Its one source is `scripts/echowaves-logo.jpeg`, and it is the only colour on the site outside the token palette — the mark is the company, not UI paint. Theming (2026-10-26) did not change that; it separated the two renderings instead. The authored file stays brand teal and is never recoloured per surface. Where the mark is used *as* interface paint it is treated as a shape with no colour of its own: the title bar draws it as a CSS `mask-image` over `{colors.accent}`, so it follows whichever palette is active and the site ships one logo rather than eight. `npm run icons` cuts the white away (colour-keying also clears the gaps between the arcs, then erodes the alpha by a pixel so JPEG ringing cannot leave a pale halo on a dark background), trims it, and rasterises everything from it: a transparent PNG favicon for every palette at 16 and 32 — the mark in that palette's accent, flattened onto that palette's ground, so a tab shows the theme it is actually rendering and the runtime only swaps two `href`s — `logo.png` for the title bar mask, manifest icons at 192 and 512, a 16/32/48 `favicon.ico`, plus `apple-touch-icon.png` and a maskable icon on `{colors.background}`, because iOS fills transparency with black and a launcher masks the canvas into a circle. The mark keeps a 9% margin at every raster so no arc touches an edge. It appears in exactly one place in the layout — the title bar, after the traffic lights and before the path, linking to `/` with its own accessible name while the image alt stays empty — and nowhere else: the tab strip already names the routes, so a second copy would be decoration. The Create React App atom that shipped at every icon size, and the manifest naming the site "Create React App Sample", are gone; `npm run verify` fails if a page links an icon that is not in `dist/`, if a declared size does not match the raster, or if any scaffold asset returns.

**Theme control.** One native `<select>` in the title bar, painted from tokens like any other control (`{colors.text-dim}` on transparent, 1px `{colors.border}`, `{colors.text}` and `{colors.accent}` on hover) and deliberately no taller — the title bar is chrome, and a taller control would push `--chrome-offset` past what it reserves. It carries a "Theme" label that is `sr-only`, since the row has no room for a caption. Its selectable states are `system`, `light` and `dark`; the light and dark options name the palette each paints ("Light — Solarized Light"), rewritten by the runtime whenever the pins move, so the displayed value always states what the page is painting. Below them two `<optgroup>` sections — "Set light default", "Set dark default" — list every palette; they ship `disabled` in the markup (without a runtime their options would be dead) and the runtime enables them when it wires up. Like everything else in the title bar it is `.chrome`, so it disappears in print — a printer cannot render a palette choice. Native widgets are the decision, not an oversight: keyboard operation, announcement and OS-consistent openers come free, and the arrow is the widget's own rather than a drawn fake. Idle `{colors.text-dim}`, hover lifts label to `{colors.text}` and border to `{colors.accent}` — the same two-step the tab bar uses, so nothing in the chrome behaves differently from anything else in it. The control ships no script and owns no state; the head runtime reads its id, persists the choice, repaints, and re-syncs the select's value and dynamic labels — including when another tab writes the same key, which repaints this page rather than leaving it disagreeing with the next one. With scripts disabled the select is inert by design rather than broken: it reads `System`, because that is the only claim true whatever the operating system says, and the set-default groups stay disabled — the page still renders a theme, and never claims a palette it is not painting.

**Focus ring.** `{components.focus-ring}` on every interactive element, `:focus-visible` only. Never removed, never dimmed for aesthetics.

## Do's and Don'ts

- **Do** route every figure through the claims module with its source; an untraceable figure does not ship.
- **Do** measure contrast before shipping a color change. Measurement outranks intent everywhere, including in inherited palettes: guests ship published hexes until a text role fails AA, and then the hue holds while lightness moves the minimum to clear it — recorded on the registry entry, never buried in a stylesheet. An invisible palette is not a palette worth shipping.
- **Do** add a palette to the registry, never to the stylesheet. Twelve tokens per palette, one source of truth; `npm run verify` fails on drift between them.
- **Don't** restate a palette's hexes in prose or in a component. Cite the token, and if a number is needed, print it — `node scripts/contrast.mjs` emits Colors → Themes' tables straight from the registry.
- **Do** keep `{colors.emphasis}` to one use per screen. Amber means "this one".
- **Don't** use gradients, glassmorphism, glow, text shadows or animated backgrounds.
- **Don't** use emoji — including symbols in U+2600–U+27BF that look like punctuation.
- **Don't** build four-across feature cards, star-count hero stats or testimonial blocks.
- **Don't** use `{colors.border}` or `{colors.decoration-green}` for text.
- **Don't** make the traffic lights interactive. They are paint.
- **Don't** keep authored colours under forced-colours mode; hand them to the system.
- **Don't** write evaluative adjectives into copy — nouns, numbers, mechanisms. "High-performing" was rejected on exactly this rule.
- **Don't** let the metaphor eat the reading: below the first screen the chrome stays fixed and content behaves like a document.
