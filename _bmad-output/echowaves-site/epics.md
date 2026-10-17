---
status: final
stepsCompleted: [step-01, step-02, step-03, step-04]
inputDocuments:
  - _bmad-output/echowaves-site/ux-site-redesign/DESIGN.md
  - _bmad-output/echowaves-site/ux-site-redesign/EXPERIENCE.md
  - _bmad-output/echowaves-site/architecture-site-redesign/ARCHITECTURE-SPINE.md
  - _bmad-output/echowaves-site/ux-site-redesign/mockups/direction-04-blueprint.html
---

# echowaves.com Blueprint Redesign - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the echowaves.com Blueprint redesign, decomposing the requirements from the final UX spines (DESIGN.md + EXPERIENCE.md) and the architecture spine into implementable stories. There is no PRD: the UX spines are the requirement contract (their committed strings and claims-of-record are normative), and ARCHITECTURE-SPINE.md `AD-n` decisions are binding constraints.

## Requirements Inventory

### Functional Requirements

FR1: Render the home page as one continuous Blueprint sheet whose region order is fixed by EXPERIENCE.md IA: title block → measured career schematic → AI practice → operator profile → open source → writing → contact; the AI practice never sits below packages or writing.
FR2: Title block shows `~/echowaves`, name/role, the committed thesis string verbatim ("AI-native engineering transformation, measured."), the subordinate `$ npm install the-future` tagline, a revision/stamp artifact, and at least one decodable personal artifact carrying real information (upside-down-line spirit).
FR3: Career schematic presents role nodes in chronological order with dates, titles, organizations, context, and precise outcomes from the claims of record (ServiceChannel 50+ org, 90% lead-time 3mo→2wk; Sober Grid no numbers; American Well no numbers; Liberty Mutual 20→10 days, 2× velocity, <1% defects, 89% eNPS; JD Power +47 framed as team/business outcome after modernization), each figure with label, unit, period, context.
FR4: Schematic renders a semantic ordered-list equivalent so screen readers and text selection never depend on drawing geometry; the SVG/CSS drawing is decorative overlay (`aria-hidden`).
FR5: Metric strip behaves as the schematic's anchored legend: each figure links/scrolls to its claim of record; equal-weight stat-band presentation is prohibited.
FR6: AI practice region sits immediately after the schematic, visually prominent, distinguishing practices/adoption (GenAI, Copilot, agentic workflows, spec-driven delivery, piloting, team enablement across QE/mobile/Dev) from outcomes, and states that no quantified productivity gain is claimed.
FR7: Operator profile is typographic/drawing-led with no portrait: Boston MA, MS CS&E, CSM, Rails Magazine + dev.to author references — resume-grounded only.
FR8: Open source region links the three packages (`expo-cached-image`, `expo-storage`, `expo-masonry-layout`) to repo and npm individually, plus GitHub profile/org and WiSaw site + repo; no invented usage statistics.
FR9: Writing region renders a build-time dev.to snapshot with states: available (with as-of date only from real metadata), pending (announced loading status), stale snapshot (marked last-available with actual date), empty/error (concise message) — direct dev.to link retained in every state; no client refetch, no synthetic counts (`0+` prohibited).
FR10: Contact region offers the committed CTA string "Start a conversation on LinkedIn" as the single primary action to `https://www.linkedin.com/in/dmitryame`, email as `{components.button-secondary}` (never demoted to bare text), and `/support` + `/privacy` remain reachable without competing as contact CTAs.
FR11: Sheet chrome (nav + footer): nav links jump to the fixed region anchor ids; footer carries legal/utility links only; identity/thesis stay available before the evidence.
FR12: Head metadata uses the committed `<title>` and description strings from the claims module, `theme-color` = #0F1620, JSON-LD Person describes the executive-portfolio identity (sameAs GitHub/LinkedIn/dev.to), and SoftwareSourceCode entries for the three packages remain; package-catalogue framing is removed.
FR13: `/support` and `/privacy` stay separate static routes restyled in sheet chrome, reachable from footer on every page.

### NonFunctional Requirements

NFR1: WCAG 2.2 AA — computed contrast floors hold (ink/canvas ≥ 4.5:1; `dim` on canvas only, never on panel; `faint` never carries text), interactive targets ≥ 24×24 CSS px (inline links exempt), visible focus rings ≥ 3:1 against both adjacent backgrounds, keyboard-operable with no traps, focus not obscured by sticky chrome.
NFR2: Zero client runtime — every fact reachable without JavaScript; no React islands, no hydration payload on any page; static `dist/` output shape unchanged from today's deploy envelope.
NFR3: No external font requests — system sans + ui-monospace stacks only (JetBrains Mono stack retired).
NFR4: Truth discipline — no fabricated numbers, counts, freshness, or AI ROI claims; team vs personal attribution follows the resume; JD Power is never presented as sole personal causation.
NFR5: Responsive one-sheet experience across desktop/tablet/mobile: same content, claims, and region order; schematic stacks chronologically with vertical guide on small screens; no horizontal scrolling, clipped metrics, or ASCII-condensed numbers; grid simplifies/removes on constrained displays.
NFR6: Motion is progressive enhancement only — schematic reveal sequences respect `prefers-reduced-motion` with the complete static state as default; no numeric count-up animation.

### Additional Requirements

- Starter template: none — brownfield Astro 6.1.10 static site stays; node 24 toolchain.
- AD-1: remove `@astrojs/react`, `react`, `react-dom` from package.json at ship; delete old `src/components/*.tsx` + `.css` in the same change that lands replacements (no transitional coexistence).
- AD-2: `src/styles/tokens.css` transcribes every DESIGN.md frontmatter token 1:1 (`colors.cyan` → `--cyan`, `spacing.section-gap` → `--section-gap`, typography → `--type-*` longhands); hex literals and font stacks exist nowhere else.
- AD-3: `src/content/claims.ts` is the single owner of the claims-of-record inventory and committed literals (`thesis`, `pageTitle`, `pageDescription`, `ctaLinkedIn`); no copy literals inside components.
- AD-4: one `.astro` per IA region in `src/components/regions/` (TitleBlock, CareerSchematic, AiPractice, OperatorProfile, OpenSource, Writing, Contact) + SheetChrome; `index.astro` composes only.
- AD-5: dev.to fetch stays build-time server-side; `getBlogData()` returns `{ posts, fetchedAt? }`; feed failure warns and degrades to empty state without aborting the build.
- AD-6: BaseLayout.astro is sole `<head>` author fed from claims module.
- AD-7: accessibility mechanisms fixed per spine (semantic list schematic, aria-hidden grid, focus token, reduced-motion default-static, 24px targets).
- AD-8: zero webfonts.
- AD-9: static output, `site` URL, sitemap, gtag, route set unchanged; deploy pipeline verified before release (Deferred, release gate — not repo-owned).
- Convention: region anchor ids are kebab-case (`title-block`, `career-schematic`, `ai-practice`, `operator`, `open-source`, `writing`, `contact`); nav targets exactly these ids.

### UX Design Requirements

UX-DR1: Transcribe all DESIGN.md tokens to CSS custom properties — 14 colors (canvas, canvas-deep, panel, ink, muted, dim, faint, hairline, grid-minor, grid-major, cyan, amber, green, focus), 5 typography groups (body, display, heading, annotation, label), 6 rounded, 17 spacing, 10 component tokens (page-grid, sheet-chrome, career-schematic, annotation-callout, metric-strip, button-primary, button-secondary, inline-link, keyboard-focus, + as listed in DESIGN.md frontmatter).
UX-DR2: Blueprint background — fine grid (grid-minor/major hairlines) on canvas with drafting accents; grid is CSS-only, `aria-hidden`, and simplifies on small displays.
UX-DR3: Asymmetric composition mandate: at least two named layout breaks from uniform bands (e.g., full-bleed schematic vs inset field-note operator block) and exactly one revision/stamp artifact (hairline-drawn, `{typography.label}`, slightly rotated/hand-placed allowed only there).
UX-DR4: Every region carries its load-bearing annotation; at most one deadpan margin-voice note per region (`measured, not vibed` style); annotations are real content, not decoration.
UX-DR5: Career schematic visual language per `{components.career-schematic}` + `{components.annotation-callout}`: chronology with connector rules, callouts paired to metrics; JD Power callout states team/business framing.
UX-DR6: Metric strip renders as anchored legend (`{components.metric-strip}`) — small figures tethered to claims, never equal-weight pills.
UX-DR7: Buttons/links per tokens: one primary button per view carrying the committed CTA string; secondary button for email; inline links for ordinary destinations (GitHub, npm, dev.to).
UX-DR8: Contrast hard rules enforced in implementation: `dim` text on canvas only, never on panel; `faint` never renders text; focus ring uses `{components.keyboard-focus}` and reads 3:1 against adjacent backgrounds including cyan.
UX-DR9: Voice signatures applied to all copy: `value · unit · context` metric cadence; we/they pronoun discipline per resume; committed strings verbatim in metadata, og tags, and visible copy.
UX-DR10: Feed states designed (available/pending/stale/empty) with announced status changes; "Feed refreshed with this build" only when true, with real as-of date when available.
UX-DR11: Responsive schematic adaptation: wide = one aligned drawing with corner annotations; tablet/mobile = chronological stack with vertical guide, annotations moved into reading order.
UX-DR12: Key-screen composition follows mockups/direction-04-blueprint.html (spines win on conflict).

### FR Coverage Map

| Req | Epic | Notes |
| --- | --- | --- |
| FR1 | 2 | Region order fixed when sheet assembles in index.astro |
| FR2 | 2 | Title block + artifact |
| FR3, FR4, FR5 | 2 | Schematic + semantic list + legend |
| FR6 | 2 | AI practice prominence |
| FR7, FR8 | 3 | Operator, open source |
| FR9 | 3 | Feed states + devto refactor |
| FR10 | 3 | Contact / CTA climax |
| FR11, FR12 | 1 | Chrome + head metadata |
| FR13 | 3 | Utility routes |
| NFR1 | 1 (focus) + 3 (audit pass) | Floor set in tokens, verified at cutover |
| NFR2, NFR3 | 1 (fonts/head), 3 (react removal) | Zero runtime completes at cutover |
| NFR4 | all | Claims module enforces; AC-level checks per story |
| NFR5, NFR6 | 2 | Responsive/motion with the schematic |

## Epic List

**Epic 1: Blueprint Foundation — the sheet speaks the new identity.**
Tokens from DESIGN.md become CSS custom properties; claims.ts becomes the single copy owner; BaseLayout head carries the committed executive-portfolio metadata; SheetChrome nav/footer frame every page. After this epic, the shell (chrome + head + tokens) is fully Blueprint even before regions land. Delivers FR11–FR12; sets NFR1 focus and NFR3 foundations; implements AD-2, AD-3, AD-6.

**Epic 2: The Recruiter Sheet — proof-first single page.**
The home page assembles in fixed IA order with the title block (thesis, tagline, stamp, decodable artifact), the measured career schematic (semantic list + drawing, metric-strip legend, load-bearing annotations, JD Power framing), and the prominent AI practice. Asymmetry mandate, motion discipline, and responsive schematic adaptation land here — this is where "AI-generated looking" dies. Delivers FR1–FR6; NFR5, NFR6; AD-4, AD-7 mechanisms.

**Epic 3: Evidence, Contact and Cutover.**
Operator profile, open-source evidence, four-state build-time writing feed, and the LinkedIn climax with secondary email; /support and /privacy convert to Astro in sheet chrome; old React components and dependencies are deleted in the cutover change; contrast/keyboard audit verifies the floor against rendered output; deploy method verified before release. Delivers FR7–FR10, FR13; completes NFR2 (zero client runtime); AD-1, AD-5, AD-9.

Dependency flow: 1 → 2 → 3, each epic complete for its domain; no story depends on a future epic.

## Epic 1: Blueprint Foundation — the sheet speaks the new identity

**Epic goal:** The shell of the site — tokens, copy ownership, head metadata, chrome — fully expresses the Blueprint identity from DESIGN.md and EXPERIENCE.md while old sections still stand behind a `redesign` branch. After this epic, any page built on the shell is compliant by construction (AD-2, AD-3, AD-6).

**Covers:** FR11, FR12 · NFR1 (focus floor), NFR3 · UX-DR1, UX-DR8 (focus) · AD-2, AD-3, AD-6, AD-8

### Story 1.1: Design tokens become CSS custom properties

As a developer building any region of the sheet,
I want every DESIGN.md token available as an exactly-named CSS custom property,
So that palette, type, spacing, and component values can never diverge from the visual contract.

**Acceptance Criteria:**

**Given** DESIGN.md frontmatter tokens (14 colors, 5 typography groups, rounded, spacing, components)
**When** `src/styles/tokens.css` is generated by transcription
**Then** every token exists as `--<kebab-name>` (`colors.cyan` → `--cyan`, `spacing.section-gap` → `--section-gap`, typography groups → `--type-<group>-*` longhands) with identical values
**And** no hex literal or font stack exists anywhere in CSS outside `tokens.css` (grep-verifiable)
**And** the old `:root` variable block in `src/index.css` is replaced by an import of `tokens.css` while legacy components keep compiling
**And** zero webfont requests remain reachable from the token stacks (NFR3, AD-8).

### Story 1.2: Claims module owns every committed string

As a site owner updating a metric or headline,
I want one typed module as the single source of claims and committed copy,
So that `<head>`, og tags, and visible text can never paraphrase each other.

**Acceptance Criteria:**

**Given** EXPERIENCE.md IA region 2 (claims of record) and the committed literals (thesis, pageTitle, pageDescription, ctaLinkedIn)
**When** `src/content/claims.ts` is created
**Then** it exports a typed inventory (role, org, dates, figures with label/unit/period/context, attribution notes incl. JD Power team/business framing) covering all five roles
**And** it exports the four committed strings character-identical to EXPERIENCE.md
**And** TypeScript build passes and a documented comment names EXPERIENCE.md as upstream — editing here requires editing the spine first (AD-3).

### Story 1.3: Executive-portfolio head metadata

As an executive recruiter sharing echowaves.com,
I want link previews and search results that describe an engineering executive,
So that the first impression matches the sheet, not a package catalogue.

**Acceptance Criteria:**

**Given** BaseLayout.astro is the sole `<head>` author (AD-6) and claims.ts exists
**When** any page renders
**Then** `<title>` and description equal the committed strings from claims.ts, mirrored in og:/twitter: tags
**And** `theme-color` is `#0F1620` and `#0d1117` appears nowhere in the repo
**And** JSON-LD Person describes the executive-portfolio identity with sameAs GitHub/LinkedIn/dev.to; the three SoftwareSourceCode entries remain
**And** sitemap, canonical, gtag, and favicon handling are otherwise unchanged (AD-9).

### Story 1.4: Sheet chrome navigation and footer

As Morgan the recruiter,
I want a quiet drawing-style nav and utility footer on every page,
So that I can jump between regions and still find legal routes without competing CTAs.

**Acceptance Criteria:**

**Given** `{components.sheet-chrome}` tokens and the fixed region anchor ids convention
**When** `src/components/regions/SheetChrome.astro` renders header nav and footer
**Then** nav links target exactly `title-block`, `career-schematic`, `ai-practice`, `operator`, `open-source`, `writing`, `contact` (unreachable targets degrade to the page top until regions land)
**And** footer carries `/support` and `/privacy` plus legal/utility links only — no contact CTA
**And** keyboard focus uses `{components.keyboard-focus}` values, visible against both canvas and panel, and sticky chrome never obscures focused elements (NFR1)
**And** nav labels come from claims.ts.

## Epic 2: The Recruiter Sheet — proof-first single page

**Epic goal:** The home page is the Blueprint sheet in fixed IA order — title block, measured career schematic with legend, prominent AI practice — asymmetric where it counts, honest in every pixel, fully responsive and motion-disciplined. This epic is what "doesn't look AI-generated" means concretely.

**Covers:** FR1–FR6 · NFR4 (truth discipline), NFR5, NFR6 · UX-DR2–UX-DR6, UX-DR9, UX-DR11, UX-DR12 · AD-4, AD-7

### Story 2.1: Title block with thesis, stamp, and decodable artifact

As Morgan the recruiter,
I want to understand in five seconds who this page is for and what it proves,
So that I keep scrolling with a clear frame of reference.

**Acceptance Criteria:**

**Given** claims.ts and tokens are in place and mockups/direction-04-blueprint.html anchors composition
**When** `TitleBlock.astro` renders as the first region of `index.astro`
**Then** it shows `~/echowaves`, name/role, the thesis string verbatim at `{typography.display}`, and `$ npm install the-future` visibly subordinate
**And** a hairline revision/stamp artifact (rev. YYYY-MM, `{typography.label}`) carries the sheet's single sanctioned imperfection (slight rotation allowed only here)
**And** at least one decodable personal artifact carries real information when decoded (e.g., an upside-down or encoded line that resolves to a true statement), is `aria-hidden`-safe for decoration but its decoded content exists in accessible text, and is never required for any task
**And** the region renders `id="title-block"` inside `<main>` landmark structure with one page-level h1 (AD-4, AD-7).

### Story 2.2: Measured career schematic with load-bearing annotations

As Morgan the recruiter,
I want Dmitry's leadership record drawn as a measured chronology,
So that I can verify each outcome against its context instead of reading adjectives.

**Acceptance Criteria:**

**Given** claims.ts inventory renders via `{components.career-schematic}` + `{components.annotation-callout}`
**When** `CareerSchematic.astro` renders with `id="career-schematic"`
**Then** all five roles appear chronologically with dates, titles, orgs, and every figure shown as `value · unit · context` — no bare numbers anywhere on the page (UX-DR9)
**And** the JD Power callout states the +47 followed account-overview modernization as a team/business outcome; Sober Grid and American Well state no invented numbers (NFR4)
**And** the drawing (connector rules, nodes) is CSS/SVG overlay marked `aria-hidden` while an `<ol>` carries identical content — screen reader and text selection work with styles off
**And** each region carries exactly one deadpan margin note at most (`measured, not vibed` register), annotations load-bearing not filler (UX-DR4).

### Story 2.3: Metric strip as anchored legend

As Morgan the recruiter,
I want a quick index of the headline numbers tethered to their proof,
So that scanning never means losing context.

**Acceptance Criteria:**

**Given** `{components.metric-strip}` and existing schematic anchors
**When** the metric strip renders under/near the schematic title
**Then** each figure is an in-page link scrolling to its claim of record with matching anchor + focus handling
**And** presentation is clearly subordinate legend styling — figures differ in size/weight by importance; equal-weight pill rows are absent (FR5)
**And** strip content derives from claims.ts only.

### Story 2.4: AI practice region promoted after the schematic

As Morgan the recruiter assessing AI transformation leadership,
I want to see exactly which practices Dmitry runs and what adoption looks like,
So that I can separate real adoption from buzzwords.

**Acceptance Criteria:**

**Given** EXPERIENCE.md IA forbids demoting this region
**When** `AiPractice.astro` renders with `id="ai-practice"` immediately after the schematic in `index.astro`
**Then** GenAI adoption, GitHub Copilot, agentic workflows, and spec-driven development appear with tool evaluation, piloting, team enablement, cross-team adoption (QE/mobile/Dev) — practices phrased distinctly from outcomes
**And** an explicit note states no quantified productivity gain is claimed (NFR4)
**And** visual prominence meets the spine's "immediately after and prominent" rule — verified against direction-04 composition, not by taste.

### Story 2.5: Asymmetric composition, grid, motion, and responsive sheet

As Morgan on a phone two days later,
I want the same sheet, honestly adapted,
So that neither viewport nor animation ever hides a fact.

**Acceptance Criteria:**

**Given** regions from 2.1–2.4 assembled in fixed order (FR1)
**When** layout and motion polish lands
**Then** at least two named layout breaks from uniform bands exist (e.g., full-bleed schematic vs inset operator field-note slot prepared for Epic 3), marked in code comments naming the break (UX-DR3)
**And** the Blueprint grid background is CSS-only, `aria-hidden`, and simplifies/removes on constrained displays (AD-7, UX-DR2)
**And** any schematic reveal sequence runs behind `prefers-reduced-motion` with complete static content as default; no numeric count-ups (NFR6)
**And** at 375px width: chronological stack with vertical guide, annotations in reading order, no horizontal scroll, no clipped metric or link (NFR5).

## Epic 3: Evidence, Contact and Cutover

**Epic goal:** The lower sheet (operator, open source, writing, contact) lands, utility routes convert, the old React site is deleted with its dependencies, and a verification pass proves the accessibility floor, truth discipline, and zero-client-runtime before release.

**Covers:** FR7–FR10, FR13 · NFR1 (audit), NFR2, NFR4 · UX-DR7, UX-DR10 · AD-1, AD-5, AD-9

### Story 3.1: Operator profile and open-source evidence regions

As Morgan the recruiter,
I want corroboration that this executive still builds,
So that the leadership story has hands-on proof.

**Acceptance Criteria:**

**Given** claims.ts and tokens
**When** `OperatorProfile.astro` (`id="operator"`) and `OpenSource.astro` (`id="open-source"`) render
**Then** operator shows Boston MA, MS CS&E, CSM, Rails Magazine + dev.to references — text/drawing only, zero portraits or generated avatars (FR7)
**And** open source links each of the three packages to repo and npm separately, plus GitHub profile/org and WiSaw site+repo, with no usage statistics anywhere (FR8)
**And** the operator region occupies the inset field-note layout break named in 2.5.

### Story 3.2: Build-time writing feed with honest states

As a visitor,
I want dev.to writing that never lies about freshness,
So that what I read matches when it was written.

**Acceptance Criteria:**

**Given** `getBlogData()` refactored to return `{ posts, fetchedAt? }` with `fetchedAt` only from real API/build metadata (AD-5)
**When** `Writing.astro` (`id="writing"`) renders the snapshot
**Then** available state lists posts with real dates and shows an as-of date only when metadata exists; "Feed refreshed with this build" appears only when true
**And** stale-snapshot state marks last-available data with actual date; empty/error states show a concise message — dev.to link present in all four states (FR9)
**And** no client-side fetch code path exists and nothing resembling `0+` can render; build warns but does not abort on feed failure.

### Story 3.3: LinkedIn climax and utility route conversion

As Morgan ready to reach out,
I want one unmistakable way to start a conversation,
So that the journey ends where it was designed to end.

**Acceptance Criteria:**

**Given** `{components.button-primary}` / `{components.button-secondary}` tokens and committed CTA string
**When** `Contact.astro` (`id="contact"`) renders
**Then** exactly one primary action per view reads "Start a conversation on LinkedIn" linking to the profile URL, with email as secondary button (never bare text) and inline links for other destinations (FR10, UX-DR7)
**And** `/support` and `/privacy` are converted to `.astro` pages in sheet chrome with their existing content preserved and footer-reachable (FR13).

### Story 3.4: Zero-runtime cutover — delete the old site

As the maintainer,
I want one change that removes every React component and dependency,
So that exactly one rendering idiom remains and the bundle is HTML + CSS.

**Acceptance Criteria:**

**Given** all regions landed on the `redesign` branch
**When** cutover lands
**Then** `src/components/*.tsx` and their `.css` files are deleted; `@astrojs/react`, `react`, `react-dom` leave package.json; `astro build` succeeds without them (AD-1)
**And** built `dist/` HTML contains no script tags except gtag analytics, and its shape matches today's output envelope (AD-9, NFR2)
**And** `/`, `/support`, `/privacy` render fully with JavaScript disabled in a browser.

### Story 3.5: Accessibility, truth, and release verification pass

As the site owner before launch,
I want the contract verified against rendered reality,
So that the spine's floor is proven, not assumed.

**Acceptance Criteria:**

**Given** the cut-over build previewable locally
**When** the verification pass runs
**Then** computed contrast for every text pairing meets AA with `dim` never on panel and `faint` carrying no text; interactive targets ≥ 24×24 CSS px except inline links; full keyboard walk reaches every link with visible, unobscured focus (NFR1)
**And** every rendered number is diffed against claims.ts and the resume inventory — attribution wording for JD Power intact; zero invented figures (NFR4)
**And** `prefers-reduced-motion` and 375px/768px/1440px viewports re-checked on the final page
**And** the deploy method for echowaves.com is identified and recorded in the memlog as the release gate (AD-9 Deferred).
