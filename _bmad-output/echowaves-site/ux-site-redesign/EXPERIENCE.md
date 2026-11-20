---
name: echowaves
description: Information architecture and behavior for a terminal-framed engineering portfolio — seven routes, one inline theme script and no bundle.
status: final
updated: 2026-10-26
---

# EXPERIENCE.md — echowaves.com

Peer contract to [DESIGN.md](./DESIGN.md), which owns visual identity and is referenced here by `{token}` path. These spines win over anything in `./.working/`; the rendered key screen is `./.working/terminal-homebrew-manpage.html`.

## Foundation

- **Form factor:** responsive web, single form factor. Desktop-first layout that survives 375px; no app, no native surface.
- **UI system:** none. Hand-rolled Astro components and CSS custom properties — the existing token block in `src/index.css` is what DESIGN.md replaces, value by value.
- **Rendering contract (binding):** static server-rendered output at build time. No JavaScript ships as a file; the only script anywhere in the build is one inline block in `<head>` that paints the reader's palette before first paint, plus the third-party gtag recorded in Accessibility Floor. Disclosures are native `<details>`. Everything a reader does — navigate, disclose, contact, focus, read — works with scripting disabled; with scripts off, only the theme choice is unavailable and the page renders its media-query default. Build-time fetches (npm registry, GitHub, iTunes) stay in the build.
- **Copy contract (binding):** every sentence and figure lives in `src/data/site.ts`; components hold no literals. `npm run verify` fails the build on an unsourced claim, banned vocabulary or a rendered empty element.

## Information Architecture

Seven routes, one per tab. Tabs are links, not panes — this is what makes navigation work with zero JavaScript and keeps every view deep-linkable.

| Tab | Route | Contents | Data source in `src/data/site.ts` |
|---|---|---|---|
| `work` | `/` | Man-page hero and what I do now | `hero`, `work`, `identity` |
| `results` | `/results` | The sourced figures, each with its source and review state; scale note | `claims`, `headlineClaims`, `scaleNote`, `asOf` |
| `method` | `/method` | The four steps, in order, with what each one refuses to be | `steps` |
| `builds` | `/builds` | Shipped products with real install links, then the npm packages | `products`, `openSource`, `packages` |
| `code` | `/code` | Maintenance evidence: stars, downloads, last release, figures omitted when the registry is unreachable | `packages`, `src/utils/registry.ts` |
| `writing` | `/writing` | dev.to feed, fetched at build and refreshed client-side | `src/components/Blog.tsx`, `src/utils/devto.ts` |
| `contact` | `/contact` | Email, GitHub, LinkedIn and Dev.to as a channel list — no commercial terms, no intake instructions | `identity` |

Nested: the WiSaw case study reads as a path inside the project — `/builds/wisaw` (title bar shows `~/echowaves/builds/wisaw`). Implemented, with the old published URL kept alive by `/wisaw`, which forwards to the story and carries the real title, description and social card. It was an Astro `redirects` entry until that proved to be a defect: the built stub is a headless meta-refresh document, so links shared in LinkedIn posts and app-store listings rendered as an empty page to every scraper. `/wisaw` is now a real page with `noindex` and a canonical pointing at `/builds/wisaw`, and is filtered out of the sitemap so the story is only indexed once.

Separate pages, footer-reachable only: `/support`, `/privacy`. Machine-readable mirror `/impact.json` stays as-is. The route table itself is `pages` in `site.ts` — one entry per tab carrying label, href, `<h1>`, lede and document title/description; `nav` is derived from it, so a tab and its page can never disagree. Utility-page copy lives in `utilityPages`.

Chrome ownership: `BaseLayout.astro` renders the skip link, window frame, tab strip and footer. Pages render content only. A built page that renders any of those twice fails `npm run verify` — support and privacy did exactly that before the layout took them over.

**Title bar:** always `dmitry@echowaves — ~/echowaves/<route>`. The path is the location indicator; there is no other breadcrumb. `[ASSUMPTION]` home shows the bare `~/echowaves`.

## Voice and Tone

Microcopy only — brand voice lives in DESIGN.md → Brand & Style.

- Terminal syntax carries meaning, so it is used sparingly and consistently: `$ command` for something the reader can do, `[1]`–`[4]` for ordered method, `- ` for refusal or omission.
- Tab labels lowercase, one word, no icons. Route paths lowercase.
- No emoji — including codepoints in U+2600–U+27BF that read as punctuation (the project's own copy scan bans that range).
- Nouns, numbers, mechanisms. Past tense for measurements, including the ones that went badly. No evaluative adjectives.
- Registry figures are labelled `verified at build` with a date; when a source is unreachable the figure is absent, and the absence is stated rather than filled.

## Component Patterns

Behavioral only; visual specs live in DESIGN.md → Components.

| Pattern | Behavior |
|---|---|
| Tab bar | `<nav aria-label="Primary">` of links; active route carries `aria-current="page"`. Keyboard: normal link traversal, no roving tabindex — these are links, not ARIA tabs, and must not claim the `tablist` role they don't implement. |
| Tab bar, narrow viewport | Wrapping strip (`flex-wrap: wrap`), never a disclosure menu and never a horizontal scroller: every route is visible at once, and a clipped tab offers no clue that more follow. The chrome simply grows a row taller; `--chrome-offset` keeps it from covering anchor targets. No JavaScript either way. |
| Page heading block | `PageHead.astro` renders the `<h1>` and lede inside `.page-head`, which shares `main > section`'s measure and inset so a page never opens with its title flush to the window while its body sits in the column. Copy comes from a `pages` entry, so no route composes its own heading text and only the home page's man-page block supplies its own `<h1>`. |
| Traffic lights | `aria-hidden="true"`, no href, no handler. Purely decorative. |
| Title bar mark | The only place the logo appears in the layout: `<a href="/" aria-label="Echowaves home">` around the mark itself, which is `aria-hidden` and carries no alt text — the link is named once by its own label, so a screen reader reads "Echowaves home" and nothing else. It reaches the same route as the first tab, adds no keyboard stop beyond itself, and disappears with the chrome in print. Since 2026-10-26 it is `/logo.png` used as a CSS `mask-image` painted with `{colors.accent}` rather than an `<img>`: one file, eight palettes, and the mark reads as chrome paint instead of brand colour fighting the theme. Swapping the raster for a mask is also why no per-theme logo assets ship while favicons do — a tab icon cannot be repainted by CSS. |
| Theme control | One native `<select>` in the title bar. Its selectable states are `system`, `light` and `dark`, each label naming the palette that mode paints ("Light — Solarized Light"), and two `<optgroup>` sections below them — "Set light default" and "Set dark default": picking a palette there makes it that group's default and switches to that group immediately, so the choice is visibly working. `system` means switching between the chosen pair as the OS scheme changes; what used to be a fourth mode, `custom`, is just `system` with non-default pins, so it is gone (a stored `custom` resolves as `system`). Screen-reader name comes from an `sr-only` label; keyboard operation and announcement are the widget's own, so there is no listbox to build and nothing to keep in sync with it. Changing anything repaints immediately and persists to `localStorage`; the choice survives reload, is read again before first paint on the next visit, and repaints any other tab of the site already open (same key, same resolution — nothing stale is left behind). No route reads it, no URL encodes it, and it holds no state of its own — the head runtime owns resolution (unknown palette id → that group's default; unknown or retired mode → `system`). With scripting off the select is present, inert, and reading `System` — the one claim true whatever the OS says, because the media query picks the palette — while both set-default groups stay `disabled` in the markup, so a dead option is never offered; the runtime enables them when it wires up. That is the accepted degradation rather than a break. |
| Man-page hero | Real headings: the page has exactly one `<h1>` (the Name block). "Description" is not a second document heading competing with section headings. `[NOTE FOR UX]` confirm the h1 wording survives when `hero.body` is rewritten to the team-first framing. |
| Metric cell | Renders `{}`-escaped values from the claims module; `<1%` ships as `&lt;1%`. A claim without a source never reaches the build. |
| Method steps | Ordered list semantics preserved (`<ol>`) even though markers render as `[n]`. |
| Channel list | Definition list: label in `{colors.textDim}`, value as a link with `rel="me noopener"`; one row per channel, bottom border as the separator. |
| Button / CTA | `<a>` elements only (mailto or route). No button-styled divs, no click handlers. |
| Registry figures | Built-time fetch with per-provider `try/catch`. Unreachable provider → figure slot omitted plus a standing note; the build never fails and never invents. |

## State Patterns

| State | Treatment |
|---|---|
| Hover | Label brightens `{colors.text-dim}` → `{colors.text}`; tab background unchanged; no motion. `[ASSUMPTION]` — DESIGN.md fixes the visual, this fixes that hover adds nothing semantic. |
| Focus | `:focus-visible` ring per DESIGN.md `{components.focus-ring}` on every link, including tabs and footer links. Never suppressed. |
| Current route | `aria-current="page"` plus the accent underline. State is never color alone. |
| Registry offline (`ECHOWAVES_OFFLINE=1` or fetch failure) | Figures omitted, "verified at build" note replaced by an explicit statement that figures are unavailable for this build; page still valid, build exits 0. |
| Wording pending sign-off (`needsReview: true`) | Not rendered as a distinct badge on the page. Listed by `npm run verify` for Dmitry; nothing ships flagged without his sign-off. |
| Optional copy slots | None exist. Pricing and availability were removed from the model rather than left blank, because an optional field invites an empty render — which is exactly how an empty `<p>` once shipped. `npm run verify` fails if a field named for money or capacity returns. |
| Blog fetch fails client-side | Feed shows the build-time snapshot; failure is silent to the reader and logged. `[ASSUMPTION]` — matches current behavior, not yet specified. |
| Reduced motion | Cursor blink and any sequential reveal run only under `prefers-reduced-motion: no-preference`. Default state is static. |
| Theme stored (`localStorage` key `echowaves.theme`) | Read before first paint, so the page never flashes a palette the reader did not choose; `system` re-resolves live when the OS scheme flips, honouring the stored pair rather than the group defaults. A corrupt object, an unknown or retired mode (a stored `custom` from before 2026-10-27 resolves as `system`, pins kept) or a retired palette id resolves silently — mode falls back to `system`, id to that group's default — because a broken preference is not a reason for a broken page. Where storage is unavailable (private mode, blocked), the choice applies for the visit and is simply not remembered; nothing throws. |
| Theme unset | No attribute on `<html>`, so no palette block matches: `@media (prefers-color-scheme)` picks the group default, which is also what a crawler, a screenshot service and a script-disabled reader get. First visit is therefore never a modal, a banner or a guess about intent. |
| Scripting disabled | The theme select renders reading `System`, its set-default groups stay disabled, and it does nothing. Navigation, disclosure, focus and selection behave exactly as they do with scripting on. Accepted degradation — the theme script is an enhancement, never a dependency. |

## Interaction Primitives

Link · native `<details>`/`<summary>` (mobile menu or long disclosures) · native `<select>` (theme only — never a custom dropdown) · `mailto:` with a pre-filled intake body · skip link · text selection (terminal-flavored copy reads as selectable; keep it selectable) · build-time data fetch. Nothing else. No carousels, no modals, no infinite scroll, no client routing, no view transitions.

## Accessibility Floor

- Contrast: every palette — Phosphor's or a guest's — clears AA on every text role, enforced by `npm run verify`; guests ship published hexes except where a text role failed, which is fixed hue-first (lightness moves, never the hue) and recorded in DESIGN.md → Colors → Themes. In Phosphor — the site's own palette and its default — `{colors.text-dim}`, `{colors.text}`, `{colors.accent}` and `{colors.danger}` clear AA for the sizes they are used at, and `{colors.border}` clears 3:1 as a boundary; guest rules stay published and pale on purpose. Ratios for every palette live in DESIGN.md → Colors → Themes.
- Forced-colours mode (`forced-colors: active`) hands every colour token to the system palette, because our greens on a white system canvas fall to 1.29:1. Verified by measurement, not by hope.
- Links are underlined by default; colour is never the only cue (WCAG 1.4.1). Tab state rides on `aria-current`, focus is a visible 2px ring.
- Exactly one `<h1>` per route; section labels are real headings in document order.
- Skip link as first focusable element, landing on the content container.
- A visually-hidden page description precedes the man-page hero so assistive tech never parses `NAME teams collaboration AI capacity DESCRIPTION` as prose.
- Full keyboard reachability of all seven routes and both footer utility pages; no keyboard trap, no custom key handling.
- Any motion honors `prefers-reduced-motion`; blinking cursor is opt-in to motion, not the default (WCAG 2.2.2).
- Reflow: content readable at 375px with no horizontal scrolling anywhere, the tab strip included — it wraps instead; measure capped at `{spacing.reading-column}`.
- Superseded 2026-10-26: ~~dark-only palette~~. Four light and four dark palettes ship, chosen by the reader in the title bar or by the OS scheme, and the trade-off this bullet recorded is gone — the brand palette stayed green-on-black and simply stopped being the only option. Seven of those palettes are other people's published colour systems, and the first release let them carry sub-AA text in the name of fidelity — which shipped invisible Dracula body copy and was reversed the same day: text roles now clear AA everywhere, hue preserved (see DESIGN.md → Colors → Themes). Readers who need a specific combination can also take it from Phosphor's AA guarantee or from their browser; the site no longer claims to have settled the question for everyone.
- The theme control is a native `<select>`: one tab stop, arrows and typing work, screen readers announce value and change without ARIA of our own. Its labels are visually hidden rather than absent, and it never opens a custom overlay.

**Client JavaScript:** nothing ships as a file. Two scripts are permitted, and `npm run verify` fails on a third: one inline block in `<head>` that resolves the palette before first paint (see Theme control above — it is the only first-party script the site owns, it loads nothing, and the page still works without it), and Google Analytics (gtag.js) in `BaseLayout.astro`, disclosed on `/privacy`. **Decided 2026-10-25: gtag stays.** Aggregate page counts are worth one unauditable script to Dmitry, who also approved the /privacy disclosure of it. The exceptions are therefore recorded rather than tolerated: `npm run verify` permits gtag, JSON-LD and exactly one inline theme runtime, and fails on anything else.

## Key Flows

`[KEPT AS DRAFTED — Dmitry's decision, 2026-10-25]` These three flows are drafted from the sources' stated audience (engineering leaders evaluating the work; recruiters and peers), not from observed sessions. A worksheet was produced asking for the real sessions beat by beat (`narration-worksheet.md`); the answer was to keep them as they stand. Read them as hypotheses about readers, which is what they are — every beat below is inference, and nobody should quote one as evidence that the site works.

1. **Priya, VP Engineering, 25 minutes between meetings.** Lands on `/` from a LinkedIn link → reads the Name block and stops at "installs a delivery system a team can run without the author" → scans three figures → clicks `results` to check whether the numbers are hers to trust → **climax: each figure names its source, and every one of them has been confirmed by hand rather than smoothed over** → back to `/contact` for the address, and writes about a specific figure she wants argued with.
2. **Ravi, recruiter, 90 seconds.** Lands on `/` → Name block plus one line about teams and AI capacity → clicks `builds` to confirm he actually ships → **climax: products with live store links, not screenshots** → copies the email from `/contact`.
3. **Dmitry, six months from now.** Opens the deployed site and asks whether anything on it is unverifiable → runs `npm run verify` locally → **climax: the build fails if a figure lost its source**, so the claim stays true by machinery.

## Inspiration & Anti-patterns

Reference in session: `.working/direction-01-shell.html` (the original shell direction, now superseded but still the best statement of register) and `.working/headlines-and-palettes.html` (palette comparison). Rejected outright: gradients, glassmorphism, glow, four-across feature cards, star-count hero stats, brochure testimonials, tasteful symmetry with no opinion.

"Opacity about cost" was on this list from the first brainstorm and was **overridden on 2026-10-25**: neither price nor availability appears anywhere on the site, stated vaguely or otherwise. Commercial terms are settled in conversation, so the page carries no slot for them at all — which also means there is nothing to leave blank. The anti-pattern still stands against hedging language ("competitive rates", "flexible engagement"); the answer to those is a page with none.

## Responsive & Platform

- One breakpoint, at 768px: above it the window floats with frame and shadow; below it the window is edge-to-edge (no side borders, no radius) and section padding drops. The old 640/720 drift and the `<details>` menu are gone — the tab strip has one narrow-viewport behavior, defined once in `SiteHeader.astro`.
- At 375px: title bar keeps the path (CSS ellipsis, never removed), the tab strip wraps to a second row, metric cells wrap while keeping their left rule, and measure stays capped at `{spacing.reading-column}`.
- Terminal metaphor degrades honestly on touch: no hover-dependent affordances; tabs carry `min-height: 44px` so they meet the touch floor as built rather than in principle.
- Print: shipped. Tokens are restated in points and the palette collapses to black on white; window chrome, tab strip, path and footer links are dropped, external links print their destination, and rows keep together. Verified statically (a guard rejects print rules for classes nothing renders) — no visual pass yet, since the sandbox cannot run Chrome: Dmitry's own Cmd-P is the check.

## Open items

Blocking launch, and only Dmitry can clear them:

1. ~~Six sign-offs outstanding~~ — closed 2026-10-25: Dmitry confirmed all five delivery figures, the "One thing I got wrong" episode, the 285-test count and version 7.x in one sitting, so `needsReview` is empty and `npm run verify` prints `SIGN-OFF: nothing pending`. The flag stays in the model: a new claim ships only once he has cleared it.
2. ~~Engagement terms~~ — closed 2026-10-25: no price line and no availability line, both fields deleted from the model rather than left blank. `npm run verify` fails if a field named for money or capacity comes back. On the same date the rest of the section went too — Delivery Baseline, disqualifiers and the intake mailto — because the site is a demonstration of capability, not a statement of terms.
3. ~~Two products advertise Android with no Google Play link~~ — closed 2026-10-25: both Play URLs supplied by Dmitry and verified live; `npm run verify` keeps the rule (a platform claim without its store link fails, with a fixture proving the check bites).
4. ~~Prose figures outside the claims ledger~~ — closed 2026-10-25: "285 tests" and "version 7.x" confirmed by Dmitry against the suite and the store listing; "seven-day experiment" was already sourced to the 2018 LinkedIn post. "Nine years later" turned out to be **wrong** — the rebuild list starts in 2018 and the site's own `asOf` is 2026-10-17 — so the year count is gone rather than corrected, and the sentence now carries only what holds: seven-day start, four rebuilds, still shipping. `npm run verify` refuses copy whose "rebuilt N times" disagrees with the rebuild list.
5. **Key flows above are drafted, not narrated.** Correct them with real sessions and I will rewrite the climax beats to match.
6. ~~`og:image` is still the app icon~~ — closed 2026-10-25: `npm run og` renders a 1200x630 window card from the hero copy (`scripts/make-og.mjs`, reviewed as `scripts/og-card.svg`), and `npm run verify` refuses a page whose card is missing, mis-sized, undescribed or still an app icon.
7. ~~`/writing` ships React~~ — closed 2026-10-25: `/writing`, `/support` and `/privacy` are Astro components rendered entirely at build time, `@astrojs/react` with `react` and `react-dom` is out of `package.json`, and `dist/` now contains **zero JavaScript files** (it shipped a 191KB React bundle nothing referenced). `npm run verify` → *no page ships first-party JavaScript* fails on any `<script>` that is not JSON-LD or the analytics bootstrap, so this cannot creep back. The blog list is a build-time snapshot and says so on the page; the old island re-fetched dev.to on every mount purely to keep counts current, which is what a deploy is for. Two things went with it: the hardcoded "Topics Covered" grid (invented copy — the real tags are on each article) and the `/support` boilerplate's response-time promise and consulting offer.
8. **No type or spacing scale exists to tokenise.** The theme uses 18 distinct `font-size` declarations and 24 rhythm values; the legacy islands use 17 more in a different vocabulary (`0.9rem`, `1.05rem`, `1.15rem` alongside `0.9375rem`). DESIGN.md names four type roles and never gives them numbers, so "rename pending" was never actionable. Choosing a scale is a design decision; once it exists the substitution is mechanical and *styles speak only in tokens* can enforce it the same way it enforces colour.

Resolved during implementation, recorded so they are not re-litigated:

- ~~`hero.body` in the old "I solve hard problems" framing~~ — replaced by the man-page NAME/DESCRIPTION block and `availability`.
- ~~Six new route files and the `/wisaw` migration~~ — built, with a redirect from the published URL.
- ~~Verify checks that reported PASS while skipping~~ — staleness now reports SKIP, and the count is called out in the summary line.
- ~~`.astro/*.json` tracked but ignored~~ — untracked; generated files no longer dirty the tree.
- ~~Mobile tab treatment~~ — wrapping strip, decided against a scroll strip on 2026-10-25 (see Component Patterns).
- Forced-colours support added after the accessibility lens found the 1.29:1 failure.

Print shipped 2026-10-25 (see Design Tokens and Responsive Behavior); needs one human Cmd-P to confirm pagination. Still deferred, not rejected: a light scheme if evidence appears that readers need it; outbound-link checking in CI (LinkedIn answers unauthenticated fetches with 404s, so this needs a browser session rather than a build step).
