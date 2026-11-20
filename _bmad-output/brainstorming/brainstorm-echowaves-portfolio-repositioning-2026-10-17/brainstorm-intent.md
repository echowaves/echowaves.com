# Intent — echowaves.com as a verifiable portfolio

Source: `./.memlog.md` (116 ideas, 8 lenses → 12 insights). Input for `bmad-product-brief` / `bmad-spec`.

## Problem

echowaves.com reads as AI-generated: gradient hero, `$ npm install the-future`, inverted-text gimmick, four emoji feature cards, GitHub star chips, "Built by Dmitry Amelchenko in Boston", sections named About/Projects/Packages. It sells Expo packages to nobody in particular and hides the only differentiated asset Dmitry has: he has twice moved a real organization from "we have AI tools" to "we build differently," inside regulated environments.

## Thesis (the strategy in one line)

AI-generated means averaged, and averages are unverifiable — so the answer is not better design, it is **radical verifiability**. Published design rule: *nothing on this page is unverifiable.*

## Positioning

- **Not** "AI transformation expert" (crowded, commoditized, invites hype-consultant reading).
- **Is**: the person who designs **verification systems that let an organization grant agents real autonomy without losing trust**. Autonomy is cheap; *verified* autonomy is the product.
- Lives in **the gap between pilot and production** — the last ten percent is organizational, not technical. That is where his evidence is unique (Fortune 100 insurance, HIPAA telehealth, 50+ engineer orgs, CTO zero-to-one).
- Constraint competence leads: he wins where audits, regulators and release gates make this hardest.
- Counter-intuitive hook for conservative buyers: **reversibility** — reversible interventions, documented touches, the ability to undo. Hype sells acceleration; regulated orgs buy undo.

## Audience and action

Primary reader: senior engineering leader (VP/Director/Head of Engineering) whose agentic pilots have stalled and who carries the career risk. Secondary: peer-level credibility and inbound writing/speaking. One CTA: **book a 45-minute delivery baseline readout** (or run the diagnostic first). No "contact us".

## Evidence hierarchy (lead with externally published proof)

1. the awarding body +27 pts digital satisfaction, +47 pts mobile app satisfaction, login 32 pts above industry average — third-party, already public, currently absent from the site.
2. 89% eNPS vs 2–25% industry band — reframed as the **agentic-adoption risk metric** (answers "will my engineers revolt?") and as underwriting for every speed claim.
3. Delivery physics: release cycle 20 → 10 days, velocity ×2, <1% annual production defect rate, lead time for changes 3 months → 2 weeks (quarterly → on-demand).
4. Regulated difficulty setting: HIPAA SDLC with security/compliance embedded without velocity loss; enterprise standards adopted across product orgs.
5. Open source and writing as *maintenance* proof — he ships and keeps working in public, for strangers. Packages are exhibits, not the subject.

Constraint (Dmitry's rule): **no job titles, no employment timeline.** Organize by mechanism and evidence, never chronology.

## Site architecture (portfolio → instrument)

| Section | Contents |
|---|---|
| Opening | One sentence + one number. No gradient, no emoji cards, the word "AI" banned from copy. |
| Mechanisms (5) | The moves he makes when an org asks for this — each with mechanism, dated evidence, and what it exposed. Replaces About. |
| Exhibits | Redacted real artifacts: a spec, an agent run log, a gate config, before/after delivery charts. Navigation is artifact-shaped (Baseline / Specs / Gates / Log / Impact). |
| Instruments | Baseline diagnostic (visitor enters cycle time, defect rate, cadence → which levers apply), Agentic Readiness Standard (~20 criteria, scored with evidence), impact ledger with stated methodology and ranges. |
| Candour | Above the wins: one named failure, the adoption J-curve dip, the metric he refuses to optimize and why, who he turns down, price/range for the first scoped step. |
| Terms | Coined vocabulary defined once: delivery physics, spec debt, verification tax, time-to-verified, agentic readiness. |
| Log | Dated, append-only public record — predictions and posts that can be checked later. Continuity is the proof. |
| Machine-readable | `/impact.json` + one-paragraph agent-legible summary (screening is already partly automated). |

## Voice rules

Nouns, numbers, mechanisms; no evaluative adjectives. Past tense for measurements, including what he got wrong. One blunt line per section. Keep slightly imperfect human rhythm — grammar-perfect, cadence-flattened prose is the AI tell. Every claim links to its artifact (exhibit A/B/C as navigation). Redaction visibly marked, which proves real material exists.

## Named engagement (the thing to sell)

**Delivery Baseline** — 6 weeks, scoped, priced: measure current delivery physics under agent adoption, install one verification gate, hand back a scored readiness map and a 90-day plan. States its own disqualifying conditions ("do not hire me if…") and what Dmitry holds himself accountable for. Capacity deliberately small; scarcity framed as craft.

## Deliberately rejected

Star-count flexing, four-adjective feature cards, "AI" in headlines, brochure testimonials, universal availability, opacity about cost, tasteful symmetry with no opinion.

## Open questions before build

1. Which artifacts can be cleared for public use (spec, gate config, charts) and at what redaction level?
2. What can be attributed publicly vs. stated as ranges with references on request?
3. Does the awarding-body attribution stay company-level (already public reporting) or need legal review?
4. Astro static build: keep single-page, or split sections into routes for `/impact.json`, `/standard`, `/diagnostic`?
