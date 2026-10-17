# Spine Pair Review — echowaves.com

Reviewed: `DESIGN.md` (186 ln), `EXPERIENCE.md` (116 ln), `.memlog.md`, `.working/direction-04-blueprint.html`, calibrated against the four shipped example spines in `.agents/skills/bmad-ux/assets/`. Line citations are 1-based.

## Overall verdict

This is a **contract-grade pair, near-ready**: source extraction is clean (all 11 `sources` paths resolve, all 50 `{token}` references across both files resolve to defined tokens, zero unresolved), DESIGN.md follows the canonical section order exactly, and every load-bearing visual decision is committed with real constraints rather than adjectives. What blocks a confident hand-off to architecture/story-dev is three surfaces a consumer must guess at: **navigation/footer have no visual spec or token**, **`metric-strip` and `button-secondary` have no behavioral row in EXPERIENCE.md**, and the **dev.to build-time-vs-client-refresh contradiction plus uncommitted page metadata (`theme-color`, `<title>`, JSON-ld) still carry the old Primer/package-first identity**. Close the 5 Mediums, flip `status: in-progress` → final, and this pair is consumable as-is.

## 1. Flow coverage — strong

Named protagonist, motive, numbered steps, labelled climax, fallbacks present. Verified against the memlog's locked primary journey (`.memlog.md`, "Primary journey" decision) — the flow matches it beat for beat.

- **Protagonist:** Morgan, technical executive recruiter (`EXPERIENCE.md:100`), with the assessment question stated up front ("whether Dmitry can lead AI transformation at enterprise scale", `:102`) and the climax pre-declared in the header paragraph rather than discovered at the end.
- **Steps:** 7 numbered beats (`:104–110`), each landing on one IA region in the locked order — a clean 1:1 with `Information Architecture:31–43`, no region skipped, none invented.
- **Climax:** labelled twice and *behaviourally* specified, not just named — "The evidence-backed LinkedIn message is the climax; no alternate conversion is substituted" (`:102`) and "**Climax and intended close: LinkedIn outreach.** Email remains available but does not compete" (`:110`). Stronger than the examples, which mark climax but leave competition implicit.
- **Failure paths:** step 6 carries its own fallback inline ("or follow the direct dev.to link when no usable snapshot is available", `:109`); utility-route interference is closed at `:112`; third-party destination failure is a named state (`:80`). The examples use a per-flow `Failure:` line; this pair distributes the same information into State Patterns with the in-flow pointer retained — acceptable.

**Findings.**
- *(Medium)* **Page-level entry surfaces are outside the contract.** The recruiter's journey begins before `/` renders, and the shipped head still contradicts the thesis: `<title>`/description are package-first (`src/pages/index.astro:19–21`) and Person JSON-LD asserts `jobTitle: "CTO"` / `worksFor: Echowaves` (`:25–36`). Neither spine mentions title, description, og:, or structured data, so a story-dev has no rule to follow and will ship an executive portfolio whose metadata still advertises an Expo package catalogue.
- *(Low)* **Memlog promised surface closure the pair does not deliver.** `.memlog.md` IA decision: "every region above gets a named-protagonist journey landing on it." One journey exists. Regions 5–7 (packages, writing, contact) are covered by the recruiter path only; no OSS-adopter or peer path. Defensible for a single-audience portfolio, but it is an unmet recorded decision — either add the second journey or record the narrowing in the memlog.

## 2. Token completeness — strong

Mechanically extracted: DESIGN.md frontmatter defines **14 color / 5 typography roles / 6 rounded / 17 spacing keys / 9 component groups**. Every `{path.to.token}` reference in both files (38 distinct in DESIGN.md prose+frontmatter, 12 in EXPERIENCE.md) resolves; **0 unresolved**, verified by script.

- **No color token is missing a hex** — all 14 are `#RRGGBB` (`DESIGN.md:10–24`). No critical finding.
- **Contrast targets are stated numerically in both spines** (WCAG 2.2 AA, 4.5:1 ordinary / 3:1 large + essential UI, `DESIGN.md:137–141`, `EXPERIENCE.md:96`) *and* the risky tokens are explicitly fenced off ("never use them for required facts or small text unless the rendered contrast is verified to pass", `:135`).
- I computed the load-bearing pairs rather than trusting the prose: ink/canvas **12.34**, ink/panel 11.89, muted/canvas 7.69, cyan/canvas 10.54, amber/canvas 9.87, green/canvas 10.08, primary-button pair (canvas on `{colors.cyan}`) 10.54 — all pass AA with headroom. The palette is honestly specified.
- *(Low)* **One boundary the spine doesn't flag:** `{colors.dim}` measures **4.50:1 on `{colors.canvas}`** (exactly at threshold, no headroom) and **4.34:1 on `{colors.panel}`** — a fail for ordinary text. `{colors.panel}` is precisely where `metric-strip` puts its surface (`DESIGN.md:98–103`). The rule says raise to ink/muted "when needed" (`:137`) but never names this pair, so the one combination that can silently fail is left to be rediscovered at implementation.
- *(Low)* **`colors.focus` duplicates `{colors.cyan}` value** (`:24` vs `:23`) while `keyboard-focus.outline` correctly points at `{colors.focus}` (`:120–121`). Two names for one value with no stated relationship: if cyan is tuned and focus isn't, the focus ring drifts silently. Either alias it explicitly or note that they move together.
- Non-defect note: `rounded.DEFAULT`, `rounded.xl` and 7 spacing steps are defined but never referenced — scale headroom, correct for a token sheet.

## 3. Component coverage — adequate

All nine frontmatter components carry real visual specs (props + constraints, not one-word labels): eight in `## Components` (`DESIGN.md:164–170`), `page-grid` in `## Layout & Spacing` (`:152`). Behavioral rules in EXPERIENCE.md are substantive — semantic-equivalent rendering for the schematic (`:65`), per-metric label/unit/period/attribution pairing, "at most one primary action" discipline (`:70`).

**Findings.**
- *(Medium)* **Two of nine components have no behavioral row and their names appear zero times in EXPERIENCE.md** (grep count 0): `metric-strip` (`DESIGN.md:98–103`) and `button-secondary` (`:110–116`). Their behavior is only *inferable* from neighbouring bullets — metric rules hide inside "Career schematic and outcome annotations" (`:65`), secondary-action rules hide inside "Contact and utility destinations" (`:70`, "email remains an alternative"). Consequence: the token→behavior matrix a consumer builds by grepping tokens is incomplete, and **whether email is `button-secondary` or a plain inline link is genuinely undecided** — a visible, load-bearing choice.
- *(Medium)* **Navigation and footer are load-bearing but unspec'd.** EXPERIENCE.md depends on them three times ("direct, understandable access to the page regions", `:64`; "reachable from site-wide/footer navigation", `:43`, `:112`), and the shipped header is a stateful component with a hamburger toggle (`src/components/Header.tsx:19`). There is no `{components.*}` token, no bullet in DESIGN.md `## Components`, and no rule for sticky-vs-static, anchor set, or narrow-viewport disclosure — yet Accessibility Floor already legislates for it ("Focus is not obscured by **sticky navigation**", `:93`), i.e. a floor rule presumes an unmade decision.
- *(Low)* Naming asymmetry between the two sections means coverage can't be checked by eye: DESIGN.md bullets are component names, EXPERIENCE.md bullets are region names ("Career schematic and outcome annotations"). `{token}` references are the only reliable join key — worth stating once in Foundation so consumers use them as the key.

## 4. State coverage — strong

Walked all eight IA regions plus both utility routes. Six regions are build-static (title block, schematic, AI practice, operator, contact, `/support`, `/privacy`), so default-only treatment is correct; the single async surface gets full treatment.

- Covered: default (`:74`), **loading** ("Writing pending … announced loading status rather than an empty-looking gap", `:76`), **stale data** (retain snapshot, mark as last-available build data with actual date, never label live, `:77`), **empty/error** distinguished from each other and from loading (`:78`, restated at `:94`), **reduced motion** in both spines (`DESIGN.md:176`, `EXPERIENCE.md:79`, `:85`, `:116`), plus an above-parity **external destination unavailable** state (`:80`).
- The stale-data rule is the strongest item in the pair: it correctly encodes that "keep dynamic" means *build-time refresh*, and forbids fabricated freshness, counts, timestamps and error details (`:78`) — exactly the failure mode a build-time feed invites.

**Findings.**
- *(Medium)* **A contradiction decides whether the loading state can even occur.** `EXPERIENCE.md:41` states as fact that data is fetched at build time "not continuously in a visitor's browser", and `:69` forbids promising client-side refresh. The shipped component does the opposite: `<Blog client:load>` (`src/pages/index.astro:81`) refetches dev.to on every mount (`src/components/Blog.tsx:24–39`), which is the *only* thing that makes "Writing pending" reachable, and on failure it fabricates `yearsActive: '0+'` with zeroed totals (`:30–38`) — counts the spine forbids inventing. The spine never says keep-or-delete the client fetch, so story-dev can neither reproduce nor remove the loading state safely. One sentence ("remove the mount-time refetch; the snapshot is the only source") closes it.
- *(Low)* **Missing states:** navigation expanded/collapsed disclosure (a real control today), and any print treatment — DESIGN.md raises printing as a reason to simplify the grid (`:152`) but no spine commits what a printed sheet must retain.

## 5. Visual reference coverage — adequate

Inventory of every file in `.working/` and `imports/`, checked against both spines:

| File | Referenced? |
|---|---|
| `.working/direction-01-shell.html` | **orphan** |
| `.working/direction-02-dashboard.html` | **orphan** |
| `.working/direction-03-editorial.html` | **orphan** |
| `.working/direction-04-blueprint.html` (selected) | ✅ `DESIGN.md:8`, `EXPERIENCE.md:8` |
| `.working/direction-05-inverted.html` | **orphan** |
| `imports/Engineering-Transformation Executive Summary.docx` | ✅ both spines (`:9`) |

- **Spines-win-on-conflict is stated once per spine** — DESIGN.md `:130` ("these two contracts take precedence over the direction mock and imported material; the mock is a visual reference, not a source of factual claims") and EXPERIENCE.md `:25`. Requirement satisfied for the pair.
- **Mock divergences are adjudicated, not silently ignored** — the best discipline signal here. The mock's `1,500+/wk` download figure is explicitly barred ("Do not revive unsupported package usage statistics from the direction mock", `EXPERIENCE.md:39`); its absolutely-positioned corner title block is overridden by a reading-order rule (`DESIGN.md:154`); its `rgba(90,140,190,.07/.14)` grid is replaced by the `{colors.grid-minor}`/`{colors.grid-major}` tokens. A consumer cannot accidentally inherit a mock claim.
- *(Low)* **Orphans are 4 rejected directions with no recorded rejection reason.** `.memlog.md:26` names all five and the pick, but not why 01/02/03/05 lost. Acceptable for `.working/` scratch; one line per rejection would stop a future run re-litigating them.
- *(Low–Medium)* **No body-level pointer to the mock.** Both examples carry `→ Composition reference: … Spine wins on conflict` inside Information Architecture; here the mock appears only in frontmatter, so a consumer reading the bodies never learns a composition reference exists. One line under IA (`EXPERIENCE.md:29`) restores it.

## 6. Bloat & overspecification — adequate

Token discipline is good and pixel-spec bloat is essentially absent: no hex values in prose (all `{colors.*}`), no px restatement of token values, and the literal numbers that remain are ones no token covers and that are genuinely load-bearing — `outline-width: 2px` / `outline-offset: 3px` (`DESIGN.md:120–123`) and the 24/120px grid cells (`:80–81`). Decorative narrative is minimal; Brand & Style stays tied to recorded decisions ("not terminal cosplay", `:128`, tracks the memlog "credible, not costume" decision).

**Findings.**
- *(Medium)* **The resume facts are stated twice inside one file.** Full per-role figures at `EXPERIENCE.md:32–36` (ServiceChannel 50+/−90%/3 months→2 weeks; Liberty Mutual 20→10 days, doubled velocity, <1% defects, 89% eNPS; JD Power +47) then the same figures again in Key Flow step 2 (`:103`). Because these are contract-critical claims (the whole thesis is "measured" and most Don'ts protect attribution), two copies in one spine is the pair's highest drift risk — a future edit to one leaves an unreconciled contradiction inside a single document. Keep the inventory in IA; make step 2 reference it.
- *(Low)* **Prose where a table earns its keep.** `State Patterns` (`:72–80`) and `Component Patterns` (`:62–70`) are bullet lists; both example spines use `| Component | Use | Behavioral rules |` / `| State | Surface | Treatment |` tables, which make coverage holes visible at a glance — exactly the check this pair needs given the two missing rows in §3. Same nit for `Responsive & Platform` (`:114–116`), where the example uses a breakpoint table.
- *(Low)* IA region 2 doubles as the content inventory (nested per-role facts). Defensible — it is what makes fabrication detectable — but it means the spine, not the docx, becomes claim-of-record; say so explicitly in Foundation or trim to a pointer plus the four thesis-bearing metrics.

## 7. Inheritance discipline — adequate

- **All `sources` paths resolve from the run directory**, verified with existence checks including the five relative code paths: `.memlog.md`, `.working/direction-04-blueprint.html`, `imports/Engineering-Transformation Executive Summary.docx`, `../../../src/pages/{index,support,privacy}.astro`, `../../../src/components/{About,Packages,Projects,Blog}.tsx`, `../../../_bmad-output/plan-devto-dynamic-blog.md`. No broken inheritance.
- **Cross-file token inheritance is clean:** all 12 EXPERIENCE.md references exist in DESIGN.md by name; no invented tokens, no near-miss spellings.
- **IA ↔ memlog parity is exact**: seven regions plus separate `/privacy`, order preserved, AI practice promoted immediately after the schematic per the recorded user decision.

**Findings.**
- *(Medium)* **The inheritance set excludes the surfaces the IA depends on.** EXPERIENCE.md inherits About/Packages/Projects/Blog and the three pages, but not `src/components/Header.tsx`, `Footer.tsx`, `Hero.tsx`, or `src/layouts/BaseLayout.astro` — i.e. the files that own navigation, region anchors, `<title>`/og:/JSON-LD, and `<meta name="theme-color" content="#0d1117">` (`BaseLayout.astro:33`). That hex *is* the GitHub Primer dark ground DESIGN.md forbids reintroducing (`:182`), and nothing in either spine names it — so the forbidden palette most plausibly survives implementation through a token nobody was told to change. Add those four files to `sources` (or add an explicit "replace site chrome and head metadata" line) and this closes with §1's metadata finding.
- *(Low)* **Component naming drift across sections.** DESIGN.md says "Title block", EXPERIENCE.md says "Navigation and title block"; DESIGN.md `annotation-callout` becomes "outcome annotations" (`:65`). Harmless while tokens are the join key, but it is exactly how `metric-strip` and `button-secondary` disappeared from §3.
- *(Low)* DESIGN.md lists no code sources (fine for a brand layer) but also not `src/index.css`, whose `--font-mono: 'JetBrains Mono', …` (`:12`) is the value the new monospace stack replaces — worth one line so the old stack is knowingly retired, not merely unused.

## 8. Shape fit — strong

- **DESIGN.md body sections are in canonical order exactly:** Brand & Style `:126` → Colors `:132` → Typography `:143` → Layout & Spacing `:150` → Elevation & Depth `:156` → Shapes `:160` → Components `:164` → Do's and Don'ts `:172`. Nothing added, nothing reordered, no orphan section.
- **EXPERIENCE.md required defaults all present:** Foundation `:20`, Information Architecture `:27`, Voice and Tone `:45`, Component Patterns `:60`, State Patterns `:72`, Interaction Primitives `:82`, Accessibility Floor `:89`, Key Flows `:98`. **Responsive & Platform is correctly triggered** (responsive web, stated in Foundation) **and present** (`:114`), with the schematic-reflow rule a single-page drawing actually needs.
- **Inspiration & Anti-patterns absence is defensible — no orphaned load.** The anti-pattern burden is carried and specific: DESIGN.md Don'ts (`:180–186`) rejects the Primer palette, centered generic hero + boilerplate card grids + stat pills + gradients + stock portraits, fake terminals/ASCII drawing lines, invented measures and team-result misattribution, and unrecorded alternate identities — each traceable to a `.memlog.md` decision (AI-tell audit, "NOT protected: stat pills, Primer palette"). Behavioral anti-patterns live in Voice and Tone (`:49`: `Live now`, AI ROI, `10x`) and Interaction Primitives. There is **no reference-product load anywhere**: memlog shows five internally generated directions and no competitor analysis, so there is nothing "lifted from X" for a section to carry. If such an analysis is later run, that section should be added then.
- *(Low)* Both spines are `status: in-progress` with `.memlog.md` recording finalization as pending (named-protagonist journeys, validation/lens choice). Correctly honest during a review pass; must flip to final before architecture treats the pair as binding.

## Mechanical notes

**Broken cross-references:** none. 0 unresolved `{token}` references in either file; all `sources` paths resolve; `[DESIGN.md](DESIGN.md)` relative links correct.

**Frontmatter completeness:** both files carry `name`, `description`, `status`, `updated`, `sources` — more complete than the shipped examples (editorial example has no description/status; mobile examples have no description). No change needed beyond `status`.

**Name inconsistencies:**
- DESIGN.md "Title block" ↔ EXPERIENCE.md "Navigation and title block"; DESIGN.md "Career schematic" ↔ IA "Measured career schematic" ↔ memlog "The schematic"; DESIGN.md `annotation-callout` ↔ EXPERIENCE.md "outcome annotations".
- `metric-strip`, `button-secondary`: defined and visually specified, never named in EXPERIENCE.md.
- "Navigation" and "footer" used as components in prose with no token and no visual spec.

**Undecided-but-load-bearing items a consumer would otherwise guess:**
1. Is email `{components.button-secondary}` or an inline link? (§3)
2. Sticky nav? Which region anchors, and what are their ids — the shipped footer links `#about`/`#projects`/`#packages`/`#blog` (`Footer.tsx`) which no longer match the new region names. (§3, §7)
3. Does the existing **Projects** section survive as its own region or merge into region 5? IA lists eight regions and Projects is not one; only WiSaw's destinations are explicitly retained. Region renaming without an anchor rule breaks six in-page links. (mechanical)
4. Keep or delete the dev.to client-side refetch, and the fabricated `yearsActive: '0+'`/zero totals fallback? (§4)
5. `<title>`, description, og:image, Person JSON-LD (`jobTitle: CTO`), and `theme-color: #0d1117`. (§1, §7)
6. The upside-down hero line (`Hero.tsx:9`) — memlog calls it a real human wink but not protected; neither spine keeps or kills it.

**Severity tally:** Critical 0 · **Medium 5** (nav/footer spec gap; metric-strip + button-secondary behavioral rows; dev.to client-refresh contradiction and fabricated fallback counts; duplicated resume claims inside EXPERIENCE.md; sources set excluding site chrome/head metadata with the forbidden Primer `theme-color` surviving) · **Low 10**.

**Recommended close order:** items 2–3 of §3 and item 1 of §4 are one-paragraph edits that remove all three guess-surfaces; then de-duplicate claims (§6), extend `sources` + add a head-metadata rule (§7/§1), then flip `status: final`.
