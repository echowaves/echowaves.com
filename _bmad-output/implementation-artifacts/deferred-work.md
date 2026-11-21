# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-verifiable-portfolio.md`
  summary: Interactive baseline diagnostic calculator (visitor enters cycle time, defect rate, release cadence and sees which levers apply).
  evidence: Independently shippable interactive tool with its own logic and data; the repositioned home page can ship and link to it later.

- source_spec: `_bmad-output/implementation-artifacts/spec-verifiable-portfolio.md`
  summary: Agentic Readiness Standard page (~20 scored criteria with evidence requirements) as a public standard.
  evidence: Separate publishable artifact with its own content lifecycle; needs human-authored criteria text, not derivable from the resume.

- source_spec: `_bmad-output/implementation-artifacts/spec-verifiable-portfolio.md`
  summary: Dated public log/archive of posts and predictions ("on the record" continuity proof).
  evidence: Content-archive deliverable independent of the home page rewrite; depends on publishing cadence decisions.
- source_spec: `_bmad-output/implementation-artifacts/spec-multiple-themes.md`
  summary: Print stylesheet keeps phosphor-green text tokens on white paper (1.29:1), a pre-existing condition deliberately preserved by the theming change.
  evidence: The green-on-white print values existed before theming (inherited from :root); the new block spells them out unchanged with a comment deferring the fix to a separate DESIGN.md print ruling. Settling means deciding that ruling and printing a page.
- source_spec: `_bmad-output/implementation-artifacts/spec-multiple-themes.md`
  summary: The nav logo is now a CSS mask painted with --accent; under forced-colors mode its background may be forced to Canvas or dropped, unlike the old <img>.
  evidence: Plausible per spec (forced-colors forces background-color), but unverifiable in this sandbox — no browser. One check in Windows High Contrast (or Safari forced-colors emulation) settles whether a `forced-colors: active` rule for `.mark-glyph` is needed.

- source_spec: `_bmad-output/implementation-artifacts/spec-aa-text-contrast.md`
  summary: Per-theme favicons are declared registry-derived ("accent on ground") but verify only checks their hrefs exist; editing an accent without rerunning `npm run icons` ships stale tabs silently.
  evidence: This very change had to hand-regenerate the four nudged palettes' PNGs; a pixel-sample check (decode each favicon, compare corner/centre colours against tokens.background/tokens.accent) would have caught any forgotten run. Needs a dependency-free PNG decode in verify-site.mjs.
- source_spec: `_bmad-output/implementation-artifacts/spec-aa-text-contrast.md`
  summary: `.btn-outline` identifies itself solely via `border-color: var(--border)`; guest borders run 1.45–2.93:1, below WCAG 1.4.11's 3:1 for perceiving a control boundary.
  evidence: Pre-existing design, not caused by the AA change — the contrast ruling deliberately exempts published rules. Settling it means a DESIGN.md decision on whether outline controls need their own boundary token distinct from palette rules (GitHub Light ships 1.45:1 there today).
- source_spec: `_bmad-output/implementation-artifacts/spec-unified-theme-dropdown.md`
  summary: Safari may not repaint a closed <select> whose selected <option>'s textContent was rewritten by sync().
  evidence: Blind-hunter finding 2026-10-27; the stub DOM cannot model WebKit's select rendering. Settles with one manual check on real Safari/WebKit: pick a set-default palette and confirm the closed control re-renders to "Light — <palette>" without focus change.
- source_spec: `_bmad-output/implementation-artifacts/spec-palette-fidelity-guard.md`
  summary: Nothing runs `npm run verify` automatically — `.github/` has no workflows, so every guard in this repo, including the new palette freeze, fires only when someone runs the command locally.
  evidence: Pre-existing repo-wide condition (the site is deployed manually by its owner, by ruling), but the fidelity guard's claim that "prose becomes a build failure" rests on it. Settles with one CI job running `npm run check` on push, or the owner's explicit decision that local discipline is enough for a manually deployed site.

- source_spec: `_bmad-output/specs/spec-agent-discovery-and-contrast`
  summary: The critical path pays for a separate stylesheet — PageSpeed reports `_astro/BaseLayout.ehcjp4p0.css` as render-blocking (2.9 KiB, 160 ms) with LCP element render delay 190 ms and no preconnect candidates.
  evidence: Real at HEAD, not deployment lag: the audited file's content hash matches what `npm run build` emits today. Nothing in the agent-discovery spec covers it — that spec's capabilities are discovery files and gates. Inlining the stylesheet or splitting a critical block is a rendering decision that touches every palette's paint order, so it belongs with DESIGN.md's owner rather than smuggled in beside a JSON artifact.

- source_spec: `_bmad-output/specs/spec-agent-discovery-and-contrast`
  summary: gtag.js is the site's only remaining third-party script and shows up as "Reduce unused JavaScript, 76 KiB" plus two long tasks.
  evidence: [BaseLayout.astro](../../src/layouts/BaseLayout.astro) loads `googletagmanager.com/gtag/js` with an inline config block; verify proves no first-party bundle, so this is the whole JS story. Removing or deferring it is a privacy and analytics decision the site already documents on `/privacy`, not a performance one — settling means deciding whether aggregate page counts are worth 76 KiB of third-party code.

- source_spec: `_bmad-output/specs/spec-agent-discovery-and-contrast`
  summary: The Best Practices block asks for CSP, HSTS, COOP, X-Frame-Options and Trusted Types; none is reachable from this repository.
  evidence: Every one is a response header, and the spec's constraint forbids hosting or server configuration changes because echowaves.com is deployed by hand. Recorded so the score is understood as owner-only work rather than an open engineering gap.

## Resolved

- source_spec: `_bmad-output/implementation-artifacts/spec-aa-text-contrast.md`
  status: resolved 2026-11-20 by `_bmad-output/implementation-artifacts/spec-palette-fidelity-guard.md`
  summary: The guest-fidelity half of the contrast policy now has machine enforcement — `scripts/lib/palette-fidelity.mjs`, run by the verify check "guest palettes stay faithful to their pinned baselines", refuses any guest token that departs from its pin without a per-token declaration.
  evidence: Scope settled narrower than this entry first asked. It demanded comparison against each upstream palette's published hex; only ~12 of 96 shipped hexes are documented anywhere in the repo, so the guard pins what shipped on 2026-11-20 instead (owner ruling: never invent colour values into the registry). What it now refuses is any undeclared repaint, declared moves beyond lightness, and unpinned tokens; a future edit that repaints a guest palette wholesale in the name of AA fails `npm run verify` and names the token.
