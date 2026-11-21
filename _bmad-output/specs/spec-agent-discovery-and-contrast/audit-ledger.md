# Audit ledger

Each finding from the Nov 20 2026 PageSpeed/Lighthouse run (report `qwtcnh9s28`, mobile) with its status at repo HEAD and what closes it. Evidence for each was gathered on 2026-11-20.

| # | Audit text as reported | Severity | Status at HEAD | Closes via |
|---|---|---|---|---|
| 1 | "ARD manifest is invalid" — `Malformed JSON in manifest: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` | Error | **Built at HEAD, pending deploy.** `src/integrations/agent-discovery.ts` writes `dist/.well-known/ard.json` and `dist/.well-known/ai-catalog.json` (identical bytes, 21 entries) from `src/data/site.ts`, and every page links both. Live probes on 2026-11-20 still answer `200 text/html` for all three discovery paths — the soft 404 the audit parsed. | CAP-1, CAP-3, CAP-5; close needs a deploy (non-goal) |
| 2 | "llms.txt does not follow recommendations" — `File is missing a required H1 header` and `File does not appear to contain any links` | Error | **Built at HEAD, pending deploy.** `dist/llms.txt`: one H1, blockquote summary, 5 sections, 35 links, all resolving. The errors described the content Lighthouse wanted, not an existing bad file — there was no file. | CAP-2, CAP-3, CAP-5; close needs a deploy (non-goal) |
| 3 | "Background and foreground colors do not have a sufficient contrast ratio" on `<p class="man-body">`, `<li>`, `<ul class="man-body applies">` in the hero | Error | **Already met at HEAD.** `node scripts/contrast.mjs` measures copy-on-raised (the surface `.man-body` paints on) at 14.76:1 Phosphor, 13.55 GitHub Light, 10.75 Gruvbox Light, 9.71 Solarized Light, 9.43 One Light, 6.40 Nord, 9.68 Solarized Dark, 4.55 Dracula — all ≥ AA. | CAP-4 records the evidence; live closure needs a deploy (non-goal) |
| 4 | Agentic-browsing "Passed audits (2)" / "Not applicable (3)" | Info | Not reported in detail. Two discovery audits already pass; which three were judged not-applicable is unknown. | Open question in SPEC.md if more than the two errors matter |

## Supporting observations (not audit lines)

- **Corrected 2026-11-20: the audited deployment is not older than HEAD's CSS.** The report names `_astro/BaseLayout.ehcjp4p0.css`, and a build of HEAD emits that same content-hashed filename — same bytes, so finding 3 describes CSS that still ships. Deploying HEAD cannot be assumed to clear it; CAP-4 has to prove the ratios itself (it does: `scripts/contrast.mjs`, worst case Dracula copy-on-raised at 4.55:1).
- **Corrected 2026-11-20: "the site ships zero JavaScript" was never exactly true.** `npm run verify` proves no *first-party* bundle, but [BaseLayout.astro](../../../src/layouts/BaseLayout.astro) loads gtag.js plus an inline config block, an inline theme runtime and two JSON-LD blocks — that third-party tag is the report's "Reduce unused JavaScript, 76 KiB". The constraint that matters (no client-side manifest generator) is unaffected.
- The report's remaining performance lines — render-blocking `BaseLayout.css` (2.9 KiB, 150 ms), LCP element render delay 190 ms, no preconnect candidates, 2 long tasks — are real at HEAD and belong to no capability here. Deferred in `_bmad-output/implementation-artifacts/deferred-work.md`.
- The Best Practices block (CSP, HSTS, COOP, X-Frame-Options, Trusted Types) cannot be satisfied by static files; the spec's no-hosting-config constraint makes it out of scope by decision, and only the owner's deploy path can change it.
- `/.well-known/*` is unhandled, which is why the manifest probe returns HTML: whatever serves the site answers unknown paths with a page, not a 404 status with JSON.
- `/wisaw` is a 270-word stub of the 1,290-word `/builds/wisaw` and canonicalises away from itself — relevant to what discovery artifacts should list (CAP-3).

## Wrapper-only content

Dropped from the audit text: Lighthouse boilerplate links (developer.chrome.com navigation, site policies, social links), the "Learn how to provide sufficient color contrast" help link text, and the PageSpeed cookie notice. No load-bearing claim depended on them.
