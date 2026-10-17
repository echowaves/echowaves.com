# Accessibility Review — echowaves.com spines

Reviewer note: adversarial WCAG 2.2 AA audit of DESIGN.md + EXPERIENCE.md as contracts. Contrast ratios computed programmatically from token hex values.

## Overall verdict

The behavioral accessibility floor is strong — semantic schematic equivalent, feed-state announcements, reduced-motion completeness, and color-alone prohibition are all committed in writing. Two real gaps: the palette permits one failing text pair by silence (`dim` on `panel` = 4.34:1) and does not hard-forbid `faint` for any text; and nothing in either spine sets a minimum target size. None of these are critical — the contract forbids misuse in spirit — but an implementer could follow the letters and still ship a fail.

## Contrast table (computed, sRGB relative luminance)

| Foreground | Background | Ratio | AA normal (4.5:1) | AA large/UI (3:1) |
|---|---|---|---|---|
| `{colors.ink}` #C9D6E8 | `{colors.canvas}` #0F1620 | 12.34:1 | PASS | PASS |
| `{colors.ink}` | `{colors.panel}` #121A25 | 11.89:1 | PASS | PASS |
| `{colors.muted}` #9AAAC0 | canvas | 7.69:1 | PASS | PASS |
| `{colors.muted}` | panel | 7.40:1 | PASS | PASS |
| `{colors.dim}` #6E8098 | canvas | 4.50:1 | PASS (borderline) | PASS |
| `{colors.dim}` | **panel** | **4.34:1** | **FAIL** | PASS |
| `{colors.faint}` #42536A | canvas | 2.32:1 | FAIL | FAIL |
| `{colors.cyan}` #59D6E6 | canvas | 10.54:1 | PASS | PASS |
| `{colors.cyan}` | panel | 10.15:1 | PASS | PASS |
| `{colors.amber}` #F0B54A | canvas | 9.87:1 | PASS | PASS |
| `{colors.green}` #63D6A0 | canvas | 10.08:1 | PASS | PASS |
| `{colors.canvas}` text on `{colors.cyan}` fill (primary button) | — | 10.54:1 | PASS | PASS |
| `{colors.hairline}` | canvas | 1.57:1 | FAIL | FAIL — decorative only; acceptable if never used for essential UI graphics |

## Findings

- **HIGH** — `dim` on `panel` is a contrast fail by silence (DESIGN.md § Colors). The spine says "raise a text token when needed" but never states which pairs fail. A panel surface with dim annotation text passes review and fails users. *Fix:* state the computed rule — `{colors.dim}` may render only on `{colors.canvas}`, never on `{colors.panel}`; or bump `dim` to ≥ #75879F (recompute).
- **MEDIUM** — `{colors.faint}` (2.32:1) is permitted by current wording for "decorative labels" with no hard floor. *Fix:* forbid faint for any text node, decorative or not; decoration uses `hairline`/grid tokens only.
- **MEDIUM** — No minimum target size anywhere in either spine ("comfortable tap targets" is the only mention). WCAG 2.2 AA includes Target Size (Minimum) 24×24 CSS px. *Fix:* add explicit floor to EXPERIENCE.md § Accessibility Floor: interactive targets ≥ 24×24 CSS px, inline text links exempt per SC 2.5.8.
- **MEDIUM** — Focus indicator is a cyan outline; primary links and node markers are also cyan. On a cyan link the ring can blend (same-hue adjacency). Offset 3px mitigates but is not stated as load-bearing. *Fix:* state that focus outline must maintain ≥3:1 against both its adjacent background and any accent color it may encircle; keep `{spacing}`-level offset, never remove when encircling cyan.
- **LOW** — Grid texture (`{components.page-grid}`) should be explicitly `aria-hidden`/non-focusable and excluded from any essential contrast pairing; print styles (sheet aesthetic invites printing) unspecified. *Fix:* one line each.

## Verified strong (no findings)

Semantic schematic equivalent with label+unit+timeframe per metric; feed loading/error/empty/stale states with status announcements and no false freshness; reduced-motion shows final state immediately with counters banned; reading order = IA order; keyboard reachability of every destination; external-link safety; contrast for all primary text, accent text, and the primary button pair.
