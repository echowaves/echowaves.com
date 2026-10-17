# AI-Tells Audit — echowaves.com spines

Hostile pass: assume the redesign still reads as AI-generated until the spec proves otherwise. Verdicts below are earned, not given.

## Overall verdict

The Blueprint direction is genuinely past the slop threshold in *structure* — a career schematic with dimensioned annotations is not something a prompt produces by default, and the Do's/Don'ts explicitly kill the worst tells (centered hero, stat pills, gradients, Primer palette). But three residual risks keep it from being unmistakably human: the sheet metaphor currently applies *uniformly* (real drawings have margins, stamps, revisions, imperfections — this one has none outside the title block), the metric strip is a stat-pill tell in thin disguise unless bound to roles, and the voice rules read like good taste rather than a personality. As specified: **will read as a very good template, not yet as Dmitry's hand.**

## Findings

- **HIGH — uniformity across regions (DESIGN.md § Layout & Spacing; EXPERIENCE.md § IA).** Every region gets the same gutter, the same section-gap, the same hairline separation. Real engineering sheets are *asymmetric*: title blocks in one corner, revision tables, zone markers, field notes pinned where they don't fit. The spec bans nothing here and prescribes nothing — implementer defaults will produce uniform card-strips, which is exactly the AI tell. *Fix:* mandate at least two deliberate layout breaks per sheet (e.g., a full-bleed schematic band vs. an inset "field note" for the operator region; a revision/stamp marker on one region only), and name them in DESIGN.md.
- **HIGH — metric strip = stat pills wearing a trench coat (direction-04 mock bottom strip; DESIGN.md § Components).** Five evenly-spaced cells, equal weight, no context = the classic AI hero-stat row. The rubric already requires unit+timeframe; that's necessary but not sufficient. *Fix:* require every metric to be anchored to its role node in the schematic (the strip is a legend that points at rows, not a standalone row of numbers), and forbid equal-weight presentation — one designated primary reading per view.
- **MEDIUM — "drafting cyan on dark slate" is adjacent to the dev-portfolio default.** The spec separates itself through grid texture, hairlines, and annotation callouts — real differentiators — but if an implementer drops the annotations (the expensive part), what remains is a generic dark-cyan developer site. *Fix:* make annotation callouts load-bearing in the contract: "a region without annotations is a spec violation," so the distinctive layer can't be descoped for convenience.
- **MEDIUM — terminal motif is one wink deep.** `~/echowaves`, `$ npm install the-future`, and a `whoami` pattern are the *expected* geek props; a model reaches these first. The memlog's upside-down easter egg (decodable, personal, weird) was the most human artifact on the current site and is currently unprotected. *Fix:* require at least one decodable personal artifact per sheet region at Finalize (easter eggs count only if they carry real information — a decoded message, a hidden changelog), inherited from the old site where it fits.
- **MEDIUM — voice rules are negative, not positive (EXPERIENCE.md § Voice and Tone).** "Don't use terminal jargon to obscure," "avoid false freshness" — correct, but absence-of-bad is not presence-of-voice. A model follows all of it and still writes flat copy. *Fix:* add 3–4 *positive* signature patterns with examples (e.g., every outcome stated as `value · unit · context` — already half-there; at least one dry deadpan note per region in the annotation voice, e.g. "measured, not vibed"; first person plural for team outcomes, first person singular only where Dmitry personally acted).
- **LOW — no imperfection budget.** Everything flat, square, aligned is its own kind of AI tell (hyper-clean minimalism). A single intentional rough edge — a rotated stamp, a hand-annotated correction line on one callout, a "rev. 2026-10" revision row — signals a human made choices. *Fix:* allow exactly one sanctioned imperfection per region in DESIGN.md Do's.
- **LOW — title-block copy is unnamed.** The thesis string ("AI-native engineering transformation, measured.") is good but nothing pins its exact wording; implementers/AIs will paraphrase it into mush. *Fix:* commit literal strings for the title block and contact CTA to the spines.

## What already earns a defense

- Career-as-schematic with role nodes + dimensioned measured outcomes: not a default AI structure — keep.
- Explicit bans (centered hero, stat pills, gradients, Primer hex, stock portraits, fake terminals): unusually strong for a spec; most "unique" briefs never write these down.
- Attribution discipline (team vs. personal causation; no invented AI ROI numbers): the resume-grounded voice is itself differentiating — generic AI portfolios inflate.
- Build-time-feed honesty ("refreshed with this build," as-of dates, no fake live freshness): a tell *against* slop.

## Three humanizing changes (priority order)

1. **Asymmetric sheet composition:** name two mandated layout breaks + one title-block-style stamp/revision artifact so the page stops reading as uniform stacked bands.
2. **Anchor every metric to its schematic row** and designate a single primary reading per view — kills the stat-pill silhouette entirely.
3. **Positive voice rules + literal strings:** signature microcopy patterns, committed exact wording for thesis/CTA, and one decodable personal artifact (revive the upside-down line's spirit somewhere on the sheet).
