# Validation Report — echowaves.com

- **DESIGN.md:** `_bmad-output/echowaves-site/ux-site-redesign/DESIGN.md`
- **EXPERIENCE.md:** `_bmad-output/echowaves-site/ux-site-redesign/EXPERIENCE.md`
- **Run at:** 2026-10-17T05:45-04:00
- **Lenses:** rubric-walker, accessibility (computed contrast), ai-tells (hostile)

## Overall verdict

Contract-grade pair, near-ready. Extraction is mechanically clean — all 11 `sources` paths resolve, all 50 token references resolve, DESIGN.md follows canonical section order exactly, and every load-bearing decision carries real constraints rather than adjectives. Zero critical findings across all three lenses.

The two adversarial reviewers shift the picture in one direction: what separates this from a slop-proof contract is not more tokens but *commitment*. Three highs cluster on the same theme — the palette permits one failing text pair by silence (`dim` on `panel`, 4.34:1), the sheet composition is uniform enough that implementer defaults will reintroduce band-stacking, and the metric strip is a stat-pill silhouette until anchored to schematic rows. The mediums are closeable by editing the spines; two implementation-phase drifts (shipped Blog.tsx feed behavior, Primer `theme-color` meta) are recorded for hand-off.

## Category verdicts

- Flow coverage — **strong**
- Token completeness — **strong**
- Component coverage — **adequate**
- State coverage — **strong**
- Visual reference coverage — **adequate**
- Bloat & overspecification — **adequate**
- Inheritance discipline — **adequate**
- Shape fit — **strong**

## Findings by severity

### Critical (0)

None.

### High (3)

**[Accessibility]** — `dim` on `panel` = 4.34:1, permitted by silence (DESIGN.md § Colors)
Panel is exactly where metric-strip lives; "raise when needed" never names the failing pair. All other load-bearing pairs pass with headroom (computed table in review-accessibility.md).
Fix: hard rule — dim renders on canvas only — or bump dim to ≥ #75879F and recompute.

**[AI-tells]** — Uniform region composition (DESIGN.md § Layout & Spacing; EXPERIENCE.md § IA)
Every region gets identical gutter/gap/hairline. Real engineering sheets are asymmetric (corner title blocks, revision stamps, pinned field notes). Nothing mandates a layout break; implementer defaults will produce uniform stacked bands — the AI tell returns by silence.
Fix: mandate ≥2 deliberate layout breaks per sheet + one stamp/revision artifact; name them in DESIGN.md.

**[AI-tells]** — Metric strip = stat pills wearing a trench coat (direction-04 mock; DESIGN.md § Components)
Five evenly-spaced equal-weight cells with no anchor is the classic AI hero-stat row. Unit+timeframe binding is necessary but not sufficient.
Fix: strip becomes a legend pointing at schematic rows; forbid equal weight — one designated primary reading per view.

### Medium (11)

**[Rubric §1]** — Page metadata still sells the old identity (index.astro head; EXPERIENCE.md gap)
Shipped `<title>`/description are package-first; Person JSON-LD asserts `jobTitle: "CTO"`. No spine rule covers head metadata.
Fix: add a head-metadata rule; commit thesis-aligned title/description strings.

**[Rubric §3]** — `metric-strip` and `button-secondary` have no behavioral rows (EXPERIENCE.md)
Names appear zero times in EXPERIENCE.md; email's button treatment is genuinely undecided.
Fix: add named behavioral rows for both components.

**[Rubric §3]** — Navigation and footer are load-bearing but unspec'd (EXPERIENCE.md :43/:64/:112)
Spine depends on site-wide/footer nav three times; Accessibility Floor already legislates for sticky nav — a floor rule presuming an unmade decision.
Fix: spec the chrome: anchor set, sticky-vs-static, narrow-viewport disclosure, visual tokens.

**[Rubric §6]** — Resume facts stated twice inside one file (EXPERIENCE.md :32–36 vs :103)
Contract-critical claims duplicated; highest drift risk in a "measured" thesis.
Fix: keep the inventory in IA; make flow step 2 reference it.

**[Rubric §7]** — Inheritance set excludes site chrome; banned Primer hex survives in `theme-color` (BaseLayout.astro:33); shipped Blog.tsx contradicts feed rule (:24–39)
Header/Footer/Hero/BaseLayout not in sources → the forbidden #0d1117 can ship untouched; Blog.tsx refetches on mount and fabricates "0+" counts the spine forbids (implementation-phase fix).
Fix: add chrome files to sources or a "replace site chrome + head metadata" rule; log Blog.tsx drift for implementation.

**[Accessibility]** — `faint` (2.32:1) has no hard text floor (DESIGN.md § Colors)
Wording permits faint for "decorative labels" with no prohibition.
Fix: forbid faint for any text node; decoration uses hairline/grid tokens only.

**[Accessibility]** — No target-size minimum (EXPERIENCE.md § Accessibility Floor)
WCAG 2.2 AA includes Target Size (Minimum) 24×24 CSS px; "comfortable tap targets" isn't a floor.
Fix: explicit ≥24×24 CSS px for interactive targets; inline links exempt per SC 2.5.8.

**[Accessibility]** — Focus ring and links share cyan (DESIGN.md focus component)
Cyan outline encircling a cyan link can blend; offset mitigates but isn't load-bearing in writing.
Fix: require ≥3:1 ring against both background and any accent it may encircle.

**[AI-tells]** — Annotation layer is descopable (DESIGN.md § Components)
Without callouts, dark-slate + cyan = generic dev-portfolio default. The differentiator is also the expensive part.
Fix: "a region without annotations is a spec violation."

**[AI-tells]** — Terminal motif one wink deep; old easter egg unprotected (EXPERIENCE.md § IA)
`~/echowaves`, `npm install the-future`, `whoami` are prompt-expected props; the decodable upside-down line isn't carried forward.
Fix: require ≥1 decodable personal artifact per sheet; revive the upside-down line's spirit.

**[AI-tells]** — Voice rules negative only (EXPERIENCE.md § Voice and Tone)
A model can follow every "don't" and still write flat copy.
Fix: add 3–4 positive signature patterns (value · unit · context; one deadpan annotation note per region; we/they for team outcomes, I only where personally true).

*(11 mediums total across the three lenses — grouped counts: rubric 5, accessibility 3, ai-tells 3.)*

### Low (18)

Rubric: journey-per-region promise unmet (record narrowing); `dim` boundary pair unflagged; `colors.focus` duplicates cyan; naming asymmetry vs token join key; no body-level mock pointer; orphaned directions w/o rejection reasons; prose→tables for State/Component patterns; IA-as-claim-of-record unstated; naming drift; old JetBrains Mono stack not knowingly retired; status still in-progress. Accessibility: grid texture aria-hidden + print styles. AI-tells: no imperfection budget; thesis/CTA strings not committed literally.

## Reviewer files

- `review-rubric.md` (rubric walker, 8 categories)
- `review-accessibility.md` (computed contrast table + audit)
- `review-ai-tells.md` (hostile slop audit + 3 humanizing changes)
