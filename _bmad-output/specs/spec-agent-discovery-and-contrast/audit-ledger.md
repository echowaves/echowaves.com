# Audit ledger

Each finding from the Nov 20 2026 PageSpeed/Lighthouse run (report `qwtcnh9s28`, mobile) with its status at repo HEAD and what closes it. Evidence for each was gathered on 2026-11-20.

| # | Audit text as reported | Severity | Status at HEAD | Closes via |
|---|---|---|---|---|
| 1 | "ARD manifest is invalid" — `Malformed JSON in manifest: SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` | Error | **Open.** Nothing is served under `/.well-known/`; the site's HTML 404 page is what Lighthouse parsed. | CAP-1, CAP-3, CAP-5 — see `agent-discovery-formats.md` for the required shape |
| 2 | "llms.txt does not follow recommendations" — `File is missing a required H1 header` and `File does not appear to contain any links` | Error | **Open.** No `llms.txt` in `src/`, `public/`, or `dist/`. The errors describe the content Lighthouse wants, not an existing bad file. | CAP-2, CAP-3, CAP-5 — see `agent-discovery-formats.md` |
| 3 | "Background and foreground colors do not have a sufficient contrast ratio" on `<p class="man-body">`, `<li>`, `<ul class="man-body applies">` in the hero | Error | **Already met at HEAD.** `node scripts/contrast.mjs` measures copy-on-raised (the surface `.man-body` paints on) at 14.76:1 Phosphor, 13.55 GitHub Light, 10.75 Gruvbox Light, 9.71 Solarized Light, 9.43 One Light, 6.40 Nord, 9.68 Solarized Dark, 4.55 Dracula — all ≥ AA. | CAP-4 records the evidence; live closure needs a deploy (non-goal) |
| 4 | Agentic-browsing "Passed audits (2)" / "Not applicable (3)" | Info | Not reported in detail. Two discovery audits already pass; which three were judged not-applicable is unknown. | Open question in SPEC.md if more than the two errors matter |

## Supporting observations (not audit lines)

- Live `echowaves.com` serves 5 `<script>` tags on `/`; HEAD serves none. The deployment predates commit `8be4601` ("the site stops shipping JavaScript"), so finding 3 likely describes CSS that no longer exists at HEAD.
- `/.well-known/*` is unhandled, which is why the manifest probe returns HTML: whatever serves the site answers unknown paths with a page, not a 404 status with JSON.
- `/wisaw` is a 270-word stub of the 1,290-word `/builds/wisaw` and canonicalises away from itself — relevant to what discovery artifacts should list (CAP-3).

## Wrapper-only content

Dropped from the audit text: Lighthouse boilerplate links (developer.chrome.com navigation, site policies, social links), the "Learn how to provide sufficient color contrast" help link text, and the PageSpeed cookie notice. No load-bearing claim depended on them.
