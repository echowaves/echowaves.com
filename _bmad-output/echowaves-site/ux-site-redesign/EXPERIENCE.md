---
name: Echowaves Experience
description: Information architecture and behavioral contract for Dmitry Amelchenko's responsive engineering-executive portfolio.
status: final
updated: 2026-10-17
sources:
  - .memlog.md
  - mockups/direction-04-blueprint.html
  - imports/Engineering-Transformation Executive Summary.docx
  - ../../../src/pages/index.astro
  - ../../../src/pages/support.astro
  - ../../../src/pages/privacy.astro
  - ../../../src/components/About.tsx
  - ../../../src/components/Packages.tsx
  - ../../../src/components/Projects.tsx
  - ../../../src/components/Blog.tsx
  - ../../../src/components/Header.tsx
  - ../../../src/components/Footer.tsx
  - ../../../src/components/Hero.tsx
  - ../../../src/layouts/BaseLayout.astro
  - ../../../_bmad-output/plan-devto-dynamic-blog.md
---

## Foundation

- **Product and form factor:** a single responsive web portfolio at `/`, expressed as one scrollable blueprint sheet. `/support` and `/privacy` remain separate existing routes. See [DESIGN.md](DESIGN.md) for visual identity, color contrast, typography, spacing, and component appearance; its blueprint field is `{colors.canvas}`, primary drafting accent is `{colors.cyan}`, body type is `{typography.body}`, and annotation type is `{typography.annotation}`.
- **UI system:** none is named or mandated. Do not imply inheritance from a particular component library or design system.
- **Purpose:** establish Dmitry Amelchenko as an engineering executive who modernizes enterprise delivery and leads AI adoption, with measured career outcomes and hands-on practice as evidence. Open-source packages support that story; they are not the hero.
- **Source and attribution rules:** use the imported executive summary and canonical decisions in `.memlog.md` for claims; this contract and [DESIGN.md](DESIGN.md) take precedence over the selected HTML mock where they conflict. Keep individual leadership/actions distinct from team, product, and business outcomes. No quantified AI productivity gain is supplied, so none may be added. The per-role fact inventory in Information Architecture region 2 is the **claims of record** for this site — the resume is its source, but a future edit updates the inventory here first, and every other mention (flows, annotations) references it rather than restating figures.
- **Join key:** `{components.*}` tokens from [DESIGN.md](DESIGN.md) are the cross-reference key between the two spines; behavioral rows below are named by token so coverage is greppable.
- **Site chrome and head metadata are in scope.** The shipped `<title>`/description, Person JSON-LD, and `<meta name="theme-color" content="#0d1117">` (`BaseLayout.astro:33`) still describe the old package-catalogue identity — `#0d1117` is the explicitly forbidden GitHub-Primer ground. The redesign replaces them: `theme-color` carries `{colors.canvas}`; the committed head strings are `<title>` = “Dmitry Amelchenko — AI-native engineering transformation, measured” and description = “Engineering executive who modernized enterprise delivery at Fortune-100 scale and still ships production open-source. Release cycles 20→10 days, <1% annual defects, 89% team eNPS. GenAI, Copilot, and agentic workflows adopted in a regulated enterprise.” JSON-LD must describe the executive-portfolio identity; package-catalogue framing is removed. Known implementation drift to fix during build (recorded here, not a spine defect): shipped `Blog.tsx` refetches articles on mount and fabricates placeholder counts, contradicting the build-time rule below.

## Information Architecture

The home page is one continuous sheet in this order; do not reorder the AI practice below the operator, packages, or writing.

→ Composition reference: [mockups/direction-04-blueprint.html](mockups/direction-04-blueprint.html) — the selected hero/sheet composition. Spines win on conflict.

1. **Title block** — `~/echowaves`, Dmitry's name/role, and the thesis, committed literally: **“AI-native engineering transformation, measured.”** Downstream copy reuses this string verbatim (it is also the `<title>` core); paraphrase drifts the positioning. Retain the npm-install-style tagline (`$ npm install the-future`) as a small, playful supporting cue, not the whole message. This region hosts the sheet's revision/stamp artifact and at least one **decodable personal artifact** — in the spirit of the current site's upside-down line: something only Dmitry would encode, carrying real information (a decoded message, a hidden changelog), not decoration.
2. **Measured career schematic** — the primary proof region. Present role nodes in chronological sequence, with dates, titles, organizations, context, and precise outcomes:
   - **ServiceChannel, 2011–2015 — Vice President of Software Engineering:** led a 50+ person engineering organization across backend, frontend, QA, and DevOps. Lead time for changes fell 90%, from 3 months to 2 weeks, enabling on-demand delivery; modernization included a monolith-to-microservices/API-first transition and AWS migration.
   - **Sober Grid, 2015–2018 — Chief Technology Officer & Consultant:** built and scaled a social platform from prototype to production; led product, engineering, security, and analytics; strengthened identity and authentication. No numerical outcome is stated in the resume.
   - **American Well, 2018–2019 — Senior Software Manager:** managed secure telehealth platform development in a HIPAA-regulated environment; improved release speed and quality through CI/CD and quality gates. No numerical outcome is stated in the resume.
   - **Liberty Mutual, 2019–present — People Leader, Mobile Engineering:** enterprise mobile platforms supporting millions of customers; release cycle reduced from 20 to 10 days (50%); team velocity doubled; annual production defect rate below 1%; 89% eNPS across direct and extended reports, compared with the resume's 2–25% industry range.
   - **JD Power outcome context:** the resume reports a 47-point mobile-app satisfaction surge after successful modernization of the account overview interface, within a 27-point year-over-year overall digital customer-satisfaction increase that moved Liberty Mutual to fourth in industry rankings. Present these as team/business outcomes following modernization, never as an outcome caused solely by Dmitry. The MFA login experience is reported as 32 points above the industry average; include only where its context remains clear.
3. **AI practice** — immediately after the schematic and visually prominent. Describe GenAI adoption, GitHub Copilot, agentic workflows, and specification-driven development; include tool evaluation, hands-on piloting, team enablement, and cross-team adoption across QE, mobile, and Dev workflows. The resume describes directional benefits to developer throughput, release quality, and engineering effort, but gives no quantified AI productivity uplift: do not add one or imply a measured magnitude.
4. **Operator profile** — a typographic/drawing-led profile, with no headshot. Include Boston, Massachusetts; MS in Computer Science & Engineering; Certified ScrumMaster (CSM); and published-author references to Rails Magazine and dev.to. Keep claims grounded in the resume.
5. **Open source / packages** — evidence of ongoing hands-on work. Preserve links to Dmitry's GitHub profile (`https://github.com/dmitryame`), the Echowaves GitHub organization, and the `expo-cached-image`, `expo-storage`, and `expo-masonry-layout` repositories and npm packages. Retain the existing WiSaw project links to `https://wisaw.com` and its GitHub repository. Do not revive unsupported package usage statistics from the direction mock.
6. **Writing** — retain the dev.to feed and link to `https://dev.to/dmitryame`. Article data is fetched at build time: content refreshes when the site is built, not continuously in a visitor's browser. Where snapshot metadata is available, show its actual build/as-of date; never imply real-time freshness.
7. **Contact / support** — make LinkedIn (`https://www.linkedin.com/in/dmitryame`) the primary contact action with the committed CTA string **“Start a conversation on LinkedIn”** (verbatim, styled `{components.button-primary}`); email (`mailto:dmitry@echowaves.com`) is secondary via `{components.button-secondary}`, and preserve the existing `/support` route for package help. Retain the GitHub, npm, and dev.to destinations where relevant as inline links. End the recruiter's primary journey on LinkedIn outreach.
8. **Separate privacy route** — preserve `/privacy` as a distinct route, reachable from site-wide/footer navigation; it is not a section inserted into the recruiter pitch.

## Voice and Tone

Lead with credible facts and clear executive language; use a light terminal wink only as a supporting accent. State the actor, context, metric, and timeframe together. Don't use terminal jargon to obscure a claim or imply that all outcomes were personally caused by one leader.

Positive signature patterns — presence of voice, not just absence of slop:

- **Measured-outcome cadence.** Every outcome reads `value · unit · context`: `20 → 10 days · release cycle · Liberty Mutual mobile`. Never a bare number, never an adjective where a measurement exists.
- **One deadpan note per region.** A single dry annotation in the drawing's margin voice (`measured, not vibed`; `numbers from the report, not the retro`). At most one — its rarity is the joke.
- **Pronoun discipline.** Team outcomes say *we* or name the org; *I* appears only where Dmitry personally acted, and the resume phrasing decides which is true.
- **Literal anchors.** The thesis string and the primary CTA are committed wording (see Information Architecture); reuse verbatim in metadata, og tags, and copy.

Suitable microcopy examples:

- `~/echowaves` — identity mark.
- `$ npm install the-future` — optional tagline, secondary to the thesis.
- `20 → 10 days · release cycle` — a measured outcome with unit and context.
- `Read the field notes on dev.to` — direct writing link.
- `Start a conversation on LinkedIn` — primary contact action.
- `Feed refreshed with this build` — use only when the snapshot was successfully produced; display the actual as-of date when one is available.

Avoid false freshness (`Live now`), unsupported AI ROI language, vague labels such as `10x`, and playful copy that trivializes regulated or enterprise work.

## Component Patterns

Behavior belongs here; appearance and token values belong in [DESIGN.md](DESIGN.md). Rows are keyed by the DESIGN.md `components:` token names (plus named regions without tokens, marked —).

| Component / region | Token | Behavior |
| --- | --- | --- |
| Sheet chrome (nav + footer) | `{components.sheet-chrome}` | Direct, understandable access to page regions and existing `/support` and `/privacy` routes; identity and thesis stay available before the evidence. Keyboard focus follows `{components.keyboard-focus}`. Footer carries legal/utility links only — never a competing contact CTA. |
| Title block | — | Hosts the committed thesis string, npm-style tagline (subordinate), revision/stamp artifact, and the decodable personal artifact (see IA region 1). The artifact is interactive enough to discover but never required for any task. |
| Career schematic | `{components.career-schematic}` | Preserves chronology and source wording; renders an equivalent semantic sequence/list so assistive technology and text selection never depend on drawing geometry. |
| Outcome annotation | `{components.annotation-callout}` | Each metric is paired with its label, unit, period, and relevant role/context. For JD Power, show that the 47-point increase followed account-overview modernization and is a team/business result. |
| Metric strip | `{components.metric-strip}` | Behaves as the schematic's legend: each figure links/scrolls to (and is announced with) its claim of record; never a standalone stat band. Equal-weight presentation is prohibited. |
| Primary button | `{components.button-primary}` | One per view; carries the committed CTA string “Start a conversation on LinkedIn” into LinkedIn outreach. Email is **not** demoted to bare text — it renders as secondary. |
| Secondary button | `{components.button-secondary}` | Email (`mailto:`) and equivalent real actions; visually subordinate but fully legible per DESIGN.md contrast rules — never faint, never decorative-only. |
| Inline link | `{components.inline-link}` | Ordinary destinations (GitHub, npm, dev.to, article links); not every link is a primary action. |
| AI-practice region | — | Directly after the schematic. Distinguishes practices and adoption activities from outcomes; states plainly that no quantified productivity gain is available. |
| Operator profile | — | Text and schematic details only; never substitute a stock, generated, or other portrait. |
| Open-source evidence | — | Separately identifiable repository and npm links for the three named packages; WiSaw's project/site and repository destinations stay discoverable without displacing the transformation narrative. |
| Writing feed | — | Build-generated dev.to snapshot. Articles render as present; an "as of" date appears only from actual build metadata. Retain a direct dev.to link in every state. Do not promise client-side live refresh or hide the link when the feed is empty. |

## State Patterns

| State | Surface | Behavior |
| --- | --- | --- |
| Default page | Whole sheet | All portfolio regions appear in the agreed order; no important fact depends on animation or an asynchronous service. |
| Feed available | Writing feed | Show the articles present in the built snapshot; an as-of date appears only from real build metadata. |
| Feed pending | Writing feed | If not yet resolved during rendering, expose a concise announced loading status — never an empty-looking gap. |
| Refresh failed, prior snapshot exists | Writing feed | Retain the snapshot, mark it as last available build data with its actual date when known, preserve the dev.to link. Never label it live. |
| No snapshot / empty / error | Writing feed | Concise, non-blocking unavailable message plus the dev.to link. Do not fabricate articles, counts, timestamps, or error details — and never render synthetic placeholders such as `0+`. |
| Reduced motion | Schematic + annotations | Complete schematic and annotations display immediately; no information or state transition is gated on animation. |
| Destination unavailable | External links | Links remain usable if a third-party destination is down; do not silently replace or disable the destination. |

## Interaction Primitives

- Use native links for routes and external destinations, with clear labels that identify the destination. Preserve the existing destinations: LinkedIn, `mailto:dmitry@echowaves.com`, GitHub (`https://github.com/dmitryame`, `https://github.com/echowaves`, and the relevant package/project repositories), npm (`https://www.npmjs.com/~echowaves` and package pages), dev.to, WiSaw (`https://wisaw.com`), `/support`, and `/privacy`.
- Keep the page readable and useful as a normal scroll. Schematic line-drawing and sequential callouts are progressive enhancement only. Under `prefers-reduced-motion`, remove those transitions and show the final state without delay; do not animate numeric values.
- Focus order follows the visual and document order. A keyboard user can reach every navigation item, package link, feed link, contact action, support link, and privacy link without a pointer.
- If an external link opens a new browsing context, identify that behavior accessibly and preserve safe `noopener` handling. Do not use icon-only links without accessible names.

## Accessibility Floor

- Use semantic page landmarks, one descriptive page-level heading, hierarchical section headings, and native link semantics. The reading order must match the IA order regardless of drawing layout.
- Ensure the career schematic has a textual/semantic equivalent with roles, dates, and measurements. A screen reader must encounter each metric with its label, unit, timeframe, and attribution; never communicate meaning through color, position, line style, or animation alone.
- All functionality is keyboard-operable, with a visible focus indicator and no keyboard trap. Focus is not obscured by sticky navigation or the grid treatment. Link purpose is understandable out of context where practical.
- Announce feed loading and error/unavailable changes using an appropriate status mechanism without repeatedly interrupting the user. An empty feed is distinct from loading and failure; the dev.to link remains available in all states.
- Meet WCAG 2.2 AA contrast in rendered states: 4.5:1 for ordinary text and 3:1 for large text and essential non-text controls/graphics. [DESIGN.md](DESIGN.md) defines the color tokens and contrast rule; subtle grid lines are decorative and do not count as controls.
- Interactive targets meet WCAG 2.2 Target Size (Minimum): at least 24×24 CSS px, except inline links within text runs (SC 2.5.8). Focus indicators satisfy 3:1 against both adjacent backgrounds, including `{colors.cyan}` where a ring encircles it.
- Respect reduced-motion preferences, preserve zoom/reflow at narrow widths, and do not depend on color perception, hover, or pointer precision.

## Key Flows

### Primary: Morgan, technical executive recruiter

Morgan is assessing whether Dmitry can lead AI transformation at enterprise scale. Morgan verifies measured outcomes, AI practice, and leadership record, then reaches out on LinkedIn. The evidence-backed LinkedIn message is the climax; no alternate conversion is substituted.

1. **Title block:** Morgan lands on `/`, understands the engineering-executive thesis, and sees that the page is a measured portfolio rather than a package catalog.
2. **Measured career schematic:** Morgan follows the role sequence and verifies the enterprise leadership record against the claims of record inventoried in Information Architecture region 2 — each figure shown with its label, unit, period, and context, never restated differently here. The +47-point JD Power mobile satisfaction outcome is clearly framed as a team/business result following modernization.
3. **AI practice — climax setup:** immediately after the schematic, Morgan verifies the actual practices—GenAI, Copilot, agentic workflows, specification-driven delivery, piloting, and team adoption—without being shown an invented productivity number.
4. **Operator profile:** Morgan confirms the executive's hands-on and professional context through the typographic profile, education, CSM credential, and publications, with no portrait required.
5. **Open source / packages:** Morgan can inspect the named packages, GitHub repositories, npm pages, and WiSaw evidence as corroboration of hands-on work.
6. **Writing:** Morgan can inspect the build-refreshed dev.to articles or follow the direct dev.to link when no usable snapshot is available.
7. **Contact / support:** after verifying outcomes, AI practice, and leadership, Morgan uses the prominent LinkedIn action to begin an evidence-backed conversation. **Climax and intended close: LinkedIn outreach.** Email remains available but does not compete with the primary action.

The recruiter path does not force a visit to utility routes. From site-wide/footer navigation, `/support` remains reachable for existing package-help content and `/privacy` remains a separate policy route; those routes must not interrupt or replace the primary journey.

## Responsive & Platform

This is a responsive web experience. Preserve the same content, claims, and region order across desktop, tablet, and mobile; change only how the drawing is arranged. Use `{spacing.page-gutter}` for responsive outer padding and retain the breathing room of `{spacing.section-gap}`. On wide screens, align role nodes, connector rules, and annotations as one schematic. On tablet and mobile, stack each role with its measurements in chronology, convert the connector to a simple vertical guide where useful, and keep text at a readable size. Move corner annotations into normal reading order when they cannot fit. Never require horizontal scrolling to read the schematic, clip a metric or link, or condense a number into an ASCII approximation. Maintain comfortable tap targets and spacing, visible focus, semantic order, and the loading/error/empty feed behavior on every viewport. Keep the background grid `{components.page-grid}` nonessential and simplify or remove it on small or constrained displays when needed for clarity.
