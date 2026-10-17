---
name: Echowaves Blueprint
description: A measured engineering-executive portfolio expressed as a precise, human-scale engineering schematic.
status: final
updated: 2026-10-17
sources:
  - .memlog.md
  - mockups/direction-04-blueprint.html
  - imports/Engineering-Transformation Executive Summary.docx
colors:
  canvas: "#0F1620"
  canvas-deep: "#0A0F16"
  panel: "#121A25"
  ink: "#C9D6E8"
  muted: "#9AAAC0"
  dim: "#6E8098"
  faint: "#42536A"
  hairline: "#2A3A4E"
  grid-minor: "#172330"
  grid-major: "#1D2B3A"
  cyan: "#59D6E6"
  amber: "#F0B54A"
  green: "#63D6A0"
  focus: "#59D6E6"  # must move with colors.cyan — same value by contract, not coincidence
typography:
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.75rem)"
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: -0.035em
  heading:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: "clamp(1.35rem, 2.5vw, 2rem)"
    fontWeight: 620
    lineHeight: 1.2
  annotation:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: 0.875rem
    fontWeight: 450
    lineHeight: 1.55
  label:
    fontFamily: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: 0.75rem
    fontWeight: 550
    lineHeight: 1.45
    letterSpacing: 0.08em
rounded:
  DEFAULT: 4px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  page-gutter: "clamp(1rem, 5vw, 3.5rem)"
  section-gap: "clamp(3.5rem, 8vw, 7rem)"
  content-max: 1200px
components:
  page-grid:
    background: "{colors.canvas}"
    minor-line: "{colors.grid-minor}"
    major-line: "{colors.grid-major}"
    minor-cell: 24px
    major-cell: 120px
  title-block:
    background: "{colors.canvas}"
    text: "{colors.ink}"
    annotation: "{colors.cyan}"
    padding: "{spacing.6}"
  career-schematic:
    surface: "{colors.canvas}"
    line: "{colors.hairline}"
    node-marker: "{colors.cyan}"
    padding: "{spacing.6}"
  annotation-callout:
    text: "{colors.muted}"
    emphasis: "{colors.ink}"
    positive: "{colors.cyan}"
    secondary-accent: "{colors.amber}"
    padding-inline: "{spacing.4}"
  metric-strip:
    surface: "{colors.panel}"
    divider: "{colors.hairline}"
    label: "{colors.muted}"
    value: "{colors.ink}"
    highlight: "{colors.cyan}"
  button-primary:
    background: "{colors.cyan}"
    text: "{colors.canvas}"
    radius: "{rounded.sm}"
    padding-inline: "{spacing.5}"
    padding-block: "{spacing.3}"
  button-secondary:
    background: transparent
    text: "{colors.ink}"
    border: "{colors.hairline}"
    radius: "{rounded.sm}"
    padding-inline: "{spacing.5}"
    padding-block: "{spacing.3}"
  inline-link:
    text: "{colors.cyan}"
    underline: "{colors.cyan}"
  keyboard-focus:
    outline: "{colors.focus}"
    outline-width: 2px
    outline-offset: 3px
  sheet-chrome:
    background: "{colors.canvas-deep}"
    text: "{colors.muted}"
    active: "{colors.cyan}"
    border: "{colors.hairline}"
    radius: "0"
---

## Brand & Style

Echowaves is Dmitry Amelchenko's engineering-executive portfolio, not a generic software landing page. Its visual register is an engineering drawing: deliberate, measured, and personal. The page reads as one blueprint sheet, with a career schematic whose roles are nodes, connecting rules are wires, and outcomes are dimensioned annotations. The dark slate field `{colors.canvas}`, fine grid, and construction rules support that drawing language; they must never compete with its content. The terminal motif is a credible sign of a leader who still works from the shell—not terminal cosplay, fake command output, or a full-page terminal interface. The result should feel precise and human, with leadership first and open-source work as evidence.

Use locally available system sans for reading and display, and a system monospace stack for labels and annotations. Load no external fonts. Preserve generous reading space, a coherent drawing scale, and a restrained accent palette. Motion can reveal actual schematic rules and their callouts in sequence, but never carries information that is absent in the static page. On any conflict, these two contracts take precedence over the direction mock and imported material; the mock is a visual reference, not a source of factual claims.

## Colors

- **Blueprint field — `{colors.canvas}`:** the main reading surface and drawing sheet. `{colors.canvas-deep}` is reserved for the surrounding frame; `{colors.panel}` may distinguish a contained utility surface without creating card-grid styling.
- **Drawing ink — `{colors.ink}`:** primary copy, headings, role labels, and essential values. `{colors.muted}` is the accessible secondary text color for explanatory annotations (7.69:1 on `{colors.canvas}`, 7.40:1 on `{colors.panel}`). `{colors.dim}` renders as text only on `{colors.canvas}` — never on `{colors.panel}` or any darker surface, where it computes to 4.34:1 and fails AA. `{colors.faint}` is not a text color under any circumstance (2.32:1); construction metadata that cannot meet contrast becomes non-text decoration rendered with hairline/grid tokens only.
- **Construction — `{colors.hairline}`, `{colors.grid-minor}`, `{colors.grid-major}`:** thin rules and subtle grid lines. These are decorative separators, not the sole means of grouping or communicating relationships.
- **Drafting cyan — `{colors.cyan}`:** primary drawing accent, links, focus, and key measured values. It signals a relevant point, not a generic “success” badge.
- **Amber — `{colors.amber}`:** selective secondary emphasis or a distinct annotation; never an alarm or an ungrounded warning.
- **Green — `{colors.green}`:** a sparing, explicitly meaningful secondary accent only; it is not a blanket “good news” color.

Text and interactive states must meet WCAG 2.2 AA contrast at actual rendered sizes: at least 4.5:1 for ordinary text and 3:1 for large text and essential UI graphics. Verify foreground/background pairs rather than assuming that a palette token passes; the computed pair table lives in `review-accessibility.md`. Raise a text token to `{colors.ink}` or `{colors.muted}` when needed. The focus ring must hold at least 3:1 against both its background and any accent color it may encircle — ordinary links are also cyan, so `{components.keyboard-focus}` keeps its offset at all times. Never rely on color alone to distinguish chronology, outcomes, focus, or link state. The grid may be omitted entirely without removing information.

## Typography

- **Reading and body copy:** `{typography.body}` uses the system sans stack for comfortable long-form reading, explanatory notes, and accessible content.
- **Display and section titles:** `{typography.display}` and `{typography.heading}` stay in the same sans family. Use a confident hierarchy, not oversized decorative slogans.
- **Drawing labels and facts:** `{typography.annotation}` and `{typography.label}` use locally available monospace faces for dates, small schematics labels, technical terms, and restrained terminal-flavored microcopy. Avoid extended paragraphs in monospace.
- Keep line lengths readable, use tabular numerals for measured values, and preserve the literal units and symbols of source claims. Do not use ASCII art as a substitute for measured geometry or information structure.
- The shipped `--font-mono` stack (JetBrains Mono et al., `src/index.css`) is knowingly retired by this contract in favor of the `{typography.annotation}` system monospace stack; do not re-add webfont downloads to recover it.

## Layout & Spacing

Treat the index as a single, continuous blueprint sheet with clear regions in the agreed order. Keep content within `{spacing.content-max}` and use `{spacing.page-gutter}` for responsive outer padding; section rhythm comes from `{spacing.section-gap}` and the spacing scale. The fine grid is a quiet background texture, built from `{components.page-grid}`; keep it low contrast and hide or simplify it where it impairs reading, printing, or rendering performance. The texture is decorative: exclude it from the accessibility tree (`aria-hidden`, non-focusable) and from any essential contrast pairing, and provide print styles that preserve legibility of the sheet on paper — a drawing contract should survive being printed.

**Composition is deliberately asymmetric** (reference: [mockups/direction-04-blueprint.html](mockups/direction-04-blueprint.html)). Uniform stacked bands are an AI tell; real engineering sheets are not uniform. The sheet must contain at least two named layout breaks — for example: the career schematic runs full-bleed while surrounding regions sit inside `{spacing.content-max}`; the operator region renders as an inset field-note block offset from the grid rather than a centered column. Choose and mark them at implementation, but never ship zero. One region of the sheet (the title block is the natural host) carries a revision/stamp artifact — `rev. 2026-10` style, drawn with hairlines and `{typography.label}` — as the sheet's single sanctioned imperfection: slightly rotated or hand-placed is allowed there and only there.

The career schematic is the primary visual proof and must read chronologically without clipping or horizontal scrolling. At wide sizes, align role nodes, connecting rules, and outcome annotations as one drawing. At narrower widths, reflow each role and its facts into a legible stacked sequence; preserve the chronology and visual connection without shrinking text. The title block's annotations remain in normal reading order when they cannot fit in a corner. Keep ample separation between regions, never compressing text to imitate a dense technical drawing.

## Elevation & Depth

The blueprint is primarily a flat plane. Use tonal separation between `{colors.canvas}` and `{colors.panel}`, with `{colors.hairline}` for structure; avoid floating card stacks and ornamental shadows. Any shadow is reserved for a functional overlay only, remains subtle, and must not imply that a content region is a modal or separate product surface.

## Shapes

Prefer square or minimally rounded geometry for the sheet, schematic nodes, rules, and metric groupings. Use `{rounded.sm}` for compact controls and `{rounded.md}` only for small utility groupings; larger `{rounded.lg}` corners are exceptional. `{rounded.full}` is reserved for a necessary compact status marker, never for generic statistic pills. Construction lines are straight and fine; connect nodes with actual CSS/SVG drawing geometry, not text characters.

## Components

- **Title block:** a clear identity and thesis area with a small sheet-style annotation. Use `{components.title-block}`; keep all copy in document flow, with no essential text positioned only as decoration.
- **Sheet chrome (navigation + footer):** built from `{components.sheet-chrome}` — a flat band on `{colors.canvas-deep}` with a hairline rule, never a floating card. Desktop shows the region anchor set (`{colors.muted}`, active/hover `{colors.cyan}`); narrow viewports collapse to identity mark plus disclosure control. The footer repeats anchors and carries `/support`, `/privacy`, and contact destinations as quiet inline links. Sticky-or-static is open to implementation, but if sticky it must not obscure focus (see EXPERIENCE.md Accessibility Floor).
- **Career schematic:** primary visual component, built from `{components.career-schematic}`. Each role node carries its exact title, organization, and dates, with connected annotations for evidence. Give the relationships semantic and textual equivalents; the drawing is not the only representation.
- **Annotation callouts and measured values:** use `{components.annotation-callout}` and `{components.metric-strip}`. Keep metric labels beside values, include units and context, and distinguish team or business outcomes from personal actions in nearby explanatory copy. No unsupported estimates or decorative stat pills. **Annotations are load-bearing: a content region rendered without at least one annotation callout is a spec violation** — the callout layer is what separates this sheet from a generic dark-cyan developer portfolio and may not be descoped for convenience.
- **Metric strip:** a legend, not a stat row. Every value in `{components.metric-strip}` names the schematic row it measures (label carries the role/company) and links or points to it; the strip never presents unanchored numbers. One designated primary reading per view gets larger type and `{colors.cyan}` emphasis; remaining values are visually subordinate — equal-weight cells are prohibited, which is what separates a legend from stat pills.
- **Links and calls to action:** `{components.button-primary}` is reserved for the primary next step; `{components.button-secondary}` is a quieter secondary action. Use `{components.inline-link}` for ordinary navigation and citations. Do not turn every external destination into a button.
- **Focus:** all interactive controls use the visible `{components.keyboard-focus}` treatment, unobscured by the grid or surrounding decoration.

## Do's and Don'ts

**Do**
- Keep the selected Blueprint direction: dark slate, fine grid, hairline construction, measured career drawing, monospace annotations, and the restrained cyan/amber/green accents.
- Make every fact, relationship, and number understandable in ordinary reading order; decorative grid and motion are expendable.
- Give numeric proof its exact unit, timeframe, and attribution. Maintain comfortable text sizing and responsive line lengths.
- Use a restrained terminal reference as a credible tool cue, not as the entire identity.
- Break the grid's uniformity on purpose: at least two named layout breaks and one revision/stamp artifact per sheet (see Layout & Spacing). Exactly one sanctioned imperfection — hyper-clean uniformity is its own AI tell.
- Respect `prefers-reduced-motion`: disable line-drawing and sequenced callout reveals or show the complete static state immediately.

**Don't**
- Reintroduce the GitHub Primer palette or its familiar generic dark-product styling — including in head metadata: `<meta name="theme-color">` must carry `{colors.canvas}`, never the shipped `#0d1117`.
- Use a centered generic hero followed by boilerplate card grids, generic CTA/stat pills, gradients, or stock portraits.
- Build a fake terminal, use ASCII characters as measured drawing lines, or make animation necessary to understand content.
- Invent performance measures, present a team result as solely Dmitry's personal causal achievement, or use low-contrast decoration as text.
- Add visual treatments that contradict the chosen Blueprint direction or imply an unrecorded alternate visual identity.
