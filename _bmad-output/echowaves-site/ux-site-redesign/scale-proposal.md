# Type & rhythm scale — APPROVED and applied (2026-10-25)

Dmitry approved the six-size type scale as proposed and Option A for rhythm. Applied in the commit that follows this file: 148 declarations tokenised across 12 files, exactly the six >2px moves listed below and nothing else; `npm run verify` now enforces both scales (*type and rhythm come from the scale*), with the three React island stylesheets exempted until they are deleted.

---

# Type & rhythm scale — for your approval

Nothing here is invented: every proposed step is a value the site already uses, chosen because the measurements say the current values cluster around it. Colour tokenisation is done and enforced; this is the other half of "every token has one home".

Measured across the terminal theme only (`src/index.css`, `src/layouts`, `src/components/site`, `src/pages`) — 42 `font-size` declarations and 105 padding/margin/gap values. The legacy React islands are excluded: they will be deleted before their styles matter.

## Type · six sizes, currently eighteen

| Token | px | Role (DESIGN.md) | Absorbs today | Worst move |
|---|---|---|---|---|
| `--text-fine` | 12 | micro metadata: `.path`, `.stats dt`, `.kind`, `.fine` | 11, 12, 0.75rem | +1px on `.fine` |
| `--text-meta` | 13 | `{typography.section-label}`, tabs, notes, footer, skip link | 13, 0.8125rem, 0.85rem | −0.6px |
| `--text-body` | 15 | `{typography.body}` — the base | 15, 0.9375rem, 0.95rem (`.btn`, `.statement`) | −0.2px |
| `--text-lede` | 17 | intro paragraphs and `h3` subheads | 16, 1.0625rem(17), 1.125rem(18), 1.1875rem(19) | −2px on `.lead` |
| `--text-title` | 20 | `{typography.name-block}` — deliberately not huge | 20 | 0 |
| `--text-heading` | 24 | `h2` | 1.375rem(22), 1.5rem(24) | +2px on one `h2` |
| `--text-figure` | 24 | `{typography.figure}` — every metric, weight 600 | 23, 1.5rem | +1px on `.stats dd` |
| `--text-display` | `clamp(1.875rem, 6vw, 2.5rem)` | the single `h1` per page | unchanged | 0 |

`--text-figure` shares a size with `--text-heading` on purpose: DESIGN.md treats them as different roles (one is weight 600 and carries numbers), so they get different names even at the same px. Merging the names would make every metric silently follow any future heading change.

**The drift this closes:** `h2` currently renders at two sizes (24px in seven places, 22px in one); `h3` at two (17 and 16); `.lead` and `.lede` are the same concept spelled twice, one pixel apart; `--text-fine`'s 11px is smaller than anything else on the site and monospace at 11px is genuinely hard to read. **Every type value moves by at most 2px.** Nothing you'd notice side by side; everything stops drifting.

## Rhythm · a 4px grid, currently 24 values

The theme already runs on multiples of 4 for three quarters of its spacing. Two candidate scales:

| Option | Steps | Exact | ≤2px | >2px |
|---|---|---|---|---|
| **A — nine steps** (recommended) | `4 8 12 16 20 24 32 48 64` | 67 | 32 | **6** |
| B — twelve steps | `4 8 12 16 20 24 28 32 40 48 56 64` | 73 | 32 | 0 |

Option B is honest but weak: it renames what's there instead of choosing. The six values Option A moves are the whole decision:

| Current | → | Where | My read |
|---|---|---|---|
| 56px | 48 | hero band padding (×2) | tightens the top of the page by 8px; looks fine to me, needs your eye |
| 40px | 32 | inset block padding (×3) | 8px tighter inside terminal-inset blocks |
| 28px | 24 | one gap | invisible |

## What I'd do once you pick

1. Declare the tokens in `src/index.css` beside the colour tokens — the single home, same rule.
2. Substitute call site by call site, component by component, running `npm run check` after each so a regression names its file.
3. Extend *styles speak only in tokens* to reject a raw size or rhythm value in a declaration: an out-of-scale number then fails the build instead of quietly joining the set again.
4. Update DESIGN.md's Token → CSS variable table from "rename pending" to live, and record which option you chose so nobody re-derives it.

## Two things I will not do without you saying so

- **Move anything more than 2px in type.** If `.lead` at 17px looks thin next to the current 19px, say so and `--text-lede` becomes 19; the scale survives, the number is yours.
- **Ship a scale you haven't looked at.** Colour was mechanical — twelve values, zero visual change. This one changes density, and I cannot see the page: the sandbox can't bind a socket, so your browser is the only verification available. That's why this is a proposal and not a commit.
