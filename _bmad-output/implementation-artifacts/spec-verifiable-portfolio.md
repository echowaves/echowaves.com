---
title: 'Verifiable portfolio repositioning'
type: 'feature'
created: '2026-10-17'
status: 'in-progress'
route: 'dispatch'
baseline_commit: '4fb0a0cacc1555a6ed7112ffd7a7a1e26cf4bb55'
review_loop_iteration: 0
context:
  - '_bmad-output/brainstorming/brainstorm-echowaves-portfolio-repositioning-2026-10-17/brainstorm-intent.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** echowaves.com presents Dmitry Amelchenko as a generic open-source package vendor (gradient hero, emoji feature cards, GitHub star chips, company-voice "About Echowaves"), which reads as AI-generated and hides the differentiated asset: he has moved real engineering organizations from "we have AI tools" to "we build differently," inside regulated enterprises.

**Approach:** Rebuild the home page as a personal, mechanism-led dossier organized around radical verifiability — every number comes from one typed claims ledger carrying its own source and evidence class, and a `verify` script fails the build when a claim is unsupported or the copy slips into hype. Position: designer of verification systems that let an organization grant agents real autonomy without losing trust.

## Boundaries & Constraints

**Always:**
- One source of truth for every figure: `src/data/ledger.ts`. Components render from it; no literal numbers in section components.
- Every claim carries `source` and `evidence` (`third-party` | `internal`). Unconfirmed wording is flagged `needsReview` and reported by the verify script.
- Organize by mechanism, never chronology: **no job titles, no employment timeline** (Dmitry's rule). Institutions may be named only where the fact is already third-party public.
- Light "engineering dossier" theme driven only by the existing CSS custom properties in `src/index.css`: hairline rules, monospace for data, visible provenance, asymmetric rhythm.
- Static output: server-rendered Astro components, no client JS except the existing Blog refresh and native `<details>` disclosures.
- Responsive at 375 / 768 / 1280 px; semantic landmarks, one `h1`, skip link, visible focus.

**Never:**
- Invent metrics, dates, clients, testimonials, prices, guarantees, or source URLs. Facts come from the supplied resume summary only.
- Emoji in copy, gradients, glassmorphism, four-across feature cards, star-count hero stats, the phrase "AI transformation", or hype adjectives (leverage, revolutionary, cutting-edge, seamless).
- New npm dependencies; changes to `astro.config.mjs`, analytics, integrations, or the dev.to fetch contract in `src/utils/devto.ts`.
- Rewrite of `/support` and `/privacy` copy — they inherit the new tokens only.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Registry stats available | npm + GitHub reachable at build | Maintenance section shows live weekly downloads, stars, last release per package | N/A |
| Registry unreachable / offline build | fetch fails or `ECHOWAVES_OFFLINE=1` | Section renders with stat slots omitted and a "figures verified at build time" note; build still succeeds | Caught per-provider, logged as warning |
| Claim missing source | ledger entry has empty `source` | `npm run verify` exits non-zero naming the claim id | Verify script fails the build |
| Unsupported copy | banned word/emoji in any rendered string list | `npm run verify` exits non-zero with file and match | Verify script fails the build |
| Machine-readable read | `GET /impact.json` | JSON ledger: claims, mechanisms, terms, contact, `asOf` | N/A (static route) |

</frozen-after-approval>

## Code Map

- `src/pages/index.astro` — composition, build-time dev.to fetch, JSON-LD. Mounts Hero/About/Projects/Packages and a `Person` schema with `"jobTitle": "CTO"` (must go: no titles).
- `src/layouts/BaseLayout.astro` — head/meta/OG/analytics + `Organization` JSON-LD; props already sufficient, leave alone.
- `src/index.css` — sole definer of tokens (`--bg-primary`, `--text-primary`, `--accent-blue`, …) consumed by every component CSS, so the retheme happens here; also holds `.btn` and `section` rhythm.
- `src/components/{Hero,About,Projects,Packages,Header,Footer}.tsx` + matching `.css` — generic sections being replaced; deleted.
- `src/components/Blog.tsx` + `Blog.css` — dev.to feed (build data + client refresh). Keep, re-mounted under new nav. `src/utils/devto.ts` unchanged.
- `src/components/Support.tsx`, `Privacy.tsx` (+css) — `/support`, `/privacy`; token-driven, retokenize only (hardcoded `#79c0ff` hovers at `Support.css:108`, `Support.css:138`, `Privacy.css:80`).
- New: `src/data/ledger.ts`, `src/pages/impact.json.ts`, `scripts/verify-content.mjs`, `src/components/site/*.astro` (Masthead, SiteHeader, Mechanisms, Ledger, Candour, Terms, Maintenance, Engage, SiteFooter).

## Tasks & Acceptance

**Execution:** (revised after Dmitry's feedback on the first build — see Spec Change Log)
- [x] `src/data/site.ts` -- Typed content module holding every sentence and figure: identity, hero, six sourced claims, scope note, what-I-do-now, four-step method, three notes, engagement with disqualifiers, packages, nav. No coined vocabulary, no evidence-class theatre.
- [x] `src/components/site/{SiteHeader,Hero,Work,Results,HowIWork,OpenSource,Contact,SiteFooter}.astro` -- Eight plain sections replacing the nine dossier sections; one design rule: a reader can state what this site is about after ten seconds.
- [x] `src/pages/index.astro` -- Composes Hero → Work → Results → How I work → Open source → Blog → Contact; Person JSON-LD without `jobTitle`/`worksFor`; plain title and description.
- [x] `src/pages/impact.json.ts` -- Serves the same module the page renders, with `asOf`.
- [x] `src/index.css` -- Light palette, one 720px reading column, shared `.btn`; Support/Privacy/Blog inherit unchanged token names.
- [x] Old React sections (`Hero`, `About`, `Projects`, `Packages`, `Header`, `Footer` + CSS) removed; Support/Privacy use the new chrome.
- [x] `scripts/verify-site.mjs` -- Seven checks: claim sources, a fixture that must fail, registry parsing against a stubbed provider, offline build with no invented figures, banned-copy scan plus fixtures proving the ban works, `/impact.json` parity with the built page; lists `needsReview` wording.
- [x] `npm run verify && npm run build` -- 10 checks pass; static build produces `/`, `/wisaw`, `/support`, `/privacy`, `/impact.json`; `ECHOWAVES_OFFLINE=1 npm run build` verified to emit no figures.
- [x] Deleted the superseded first-pass modules: `src/data/ledger.ts` removed, `scripts/verify-content.mjs` replaced by `scripts/verify-site.mjs`, and `package.json` points `npm run verify` straight at it.

**Acceptance Criteria:**
- Given the built site, when `/impact.json` is requested, then it returns the ledger JSON and its figures equal the ones rendered on the page.
- Given a claim without a `source`, when `npm run verify` runs, then it exits non-zero and names that claim id.
- Given the home page, when inspected, then it contains no job titles, no employment date ranges, no emoji in copy, and exactly one `h1`.
- Given an offline build (`ECHOWAVES_OFFLINE=1`), when `npm run build` runs, then it succeeds and no stat is shown as a hard-coded number.
- Given `/support` and `/privacy`, when rendered, then they use the new chrome and theme with unchanged body copy.

## Implementation Notes

- Route narrowed from the brainstorm intent: interactive baseline diagnostic, Agentic Readiness Standard page, public dated log, and talks archive deferred to `_bmad-output/implementation-artifacts/deferred-work.md`.
- Claims come only from the user-supplied executive resume summary (`[executive summary import, kept outside the repository]`, read via `python3 -c` unzip of `word/document.xml`). Anything whose public wording needs sign-off is marked `needsReview` and listed by `npm run verify`.
- Matrix coverage: no test runner exists in this repo and none may be added, so each I/O row is covered by an assertion inside `scripts/verify-content.mjs` (run via `npm run verify`, zero dependencies): registry fallback exercised with `ECHOWAVES_OFFLINE=1`, claim-schema violations and banned-copy violations exercised against fixture strings, `/impact.json` shape compared against the rendered ledger. Each check prints `PASS <matrix row>` so the run output is the evidence.
- Live registry figures come from build-time fetch of the npm registry (`https://api.npmjs.org/downloads/point/last-week/<pkg>`) and GitHub API (`https://api.github.com/repos/echowaves/<repo>`), isolated in one helper with per-provider try/catch so an offline build degrades to no-figures rather than failure.

## Spec Change Log

- **Revision 2 (2026-10-17, after preview).** Dmitry rejected parts of the first build: "designer of verification systems" and "nothing on it is unverifiable" read as AI slop; the page was "overly complex — hard to understand what it's all about"; he wanted `~/echowaves` and `$ npm install the-future` back, his personal mission (solving hard problems) made evident, and the "Do not hire me if" block kept. Consequences: coined vocabulary, evidence-class labels, provenance UI and the nine-section dossier structure removed; eight plain sections in; headline is now "I solve hard problems."; the two rejected phrasings are banned in `scripts/verify-site.mjs` so they cannot come back. The frozen Intent block above keeps the original wording as history.
- **Revision 3 (2026-10-18, shipped products).** Dmitry asked for the things he has built to appear: WiSaw, chimingClock, Get to Know You, and Succinct Coin with succinctcoin.ai as its evolution — each with a description and real store install links — plus a proper architecture history for WiSaw including the role AI played in fixing the touch surface. Added `products` + `wisawStory` to `src/data/site.ts`, a Products section on the home page, and `/wisaw` as the case study. Facts came from primary sources only: the echowaves GitHub repos (WiSaw.serverless, WiSaw.cdk, succinctcoin.ai README), the iTunes Lookup API for store IDs/versions/ratings, and his own dev.to posts plus the LinkedIn pulse article for the seven-day MVP and the production crash. Two new checks guard it: a product claiming iOS without a store link fails, and every `href` in the story must resolve.

## Review Triage Log
