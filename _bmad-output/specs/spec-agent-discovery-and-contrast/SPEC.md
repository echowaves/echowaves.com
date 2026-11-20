---
id: SPEC-agent-discovery-and-contrast
companions:
  - audit-ledger.md
  - agent-discovery-formats.md
  - ../../echowaves-site/ux-site-redesign/DESIGN.md
  - ../../echowaves-site/ux-site-redesign/EXPERIENCE.md
  - ../../implementation-artifacts/spec-aa-text-contrast.md
sources: []
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# Agent Discovery and Contrast on echowaves.com

## Why

A mandate to meet, with an opportunity attached. Google's Lighthouse added agentic-browsing audits, and the Nov 20 2026 PageSpeed run on echowaves.com reports two hard errors: no parsable Agentic Resource Discovery manifest, and an `llms.txt` that fails the format recommendations. AI agents sent to read or cite the site today find a 404 HTML page where JSON should be. The same run flags low-contrast text in the hero panel; that one is already satisfied at HEAD and needs evidence, not new colors. Affected: agents crawling or citing echowaves.com, and readers who need the palette to stay legible on every theme.

## Capabilities

- **CAP-1**
  - **intent:** An AI agent or registry can discover and verify the site's published resources through a machine-readable catalog that Lighthouse's ARD audit parses without error.
  - **success:** A Lighthouse run reports no "ARD manifest is invalid" error: the probed path returns JSON (not an HTML page), carrying the required spec fields, and the catalog validates against ARD spec v1.0.
- **CAP-2**
  - **intent:** An agent reading `llms.txt` gets a standards-shaped file — H1, summary, links to the site's real pages — so it can navigate the site without guessing.
  - **success:** A Lighthouse run reports no `llms.txt` error, and the served file parses with at least one H1 and at least one link in llms.txt.org section order.
- **CAP-3**
  - **intent:** Every resource named in `llms.txt` or the catalog is a resource the build actually produced, so no agent is sent to a path that does not exist.
  - **success:** A check resolves every URL and identifier in both discovery artifacts against the built output and the site's data modules, and fails on any entry whose target is absent or mistyped.
- **CAP-4**
  - **intent:** Readers get WCAG AA contrast for every text role on every surface in all eight palettes, including the hero panel the audit flagged.
  - **success:** The contrast gate reports ≥ 4.5:1 for each text role on its own rendering surface in all eight palettes, with the hero's copy-on-raised role measured explicitly rather than inferred from body copy.
- **CAP-5**
  - **intent:** The site's own verification gate refuses to pass a build whose discovery artifacts are missing, malformed, or stale, so CAP-1..CAP-3 stay true without manual diligence.
  - **success:** A green `npm run verify` includes checks that fail when a discovery artifact is deleted, made invalid JSON, left pointing at a removed page, or built from data newer than the artifact.

## Constraints

- **No build on this site may ever attempt to deploy it.** echowaves.com is always deployed manually by Dmitry: no deploy, publish, or go-live step belongs in any plan, script, or workflow produced from this spec.
- No hosting or server/header configuration changes either. Every artifact must be a static file the Astro build emits into `dist/`, which rules out CDN or nginx header rules as the mechanism.
- The site ships zero JavaScript and stays that way. Agent discovery is static files plus markup — never a client-side manifest generator.
- Catalog entries are valid against ARD spec v1.0: `specVersion` and `entries[]` required; each entry carries an `urn:air:{publisher}:{namespace}:{name}` identifier, a media `type`, and exactly one of `url` or `data`.
- `llms.txt` follows llms.txt.org section order (H1, blockquote summary, optional detail, `## File Structure`) and satisfies Lighthouse's two checks: at least one H1, at least one link.
- Catalog entries cite only resources whose URLs come from the `src/data` modules the verify gate already scans — no hand-typed URLs, matching the site rule that every claim carries a source.

## Non-goals

- Deploying the site in any form — the user deploys by hand, always — and therefore making the PageSpeed score change. HEAD-only work cannot move a score measured on an older deployment.
- Changing palette colors, adding palettes, or pursuing AAA. AA on text roles is the floor and it is already met at HEAD.
- Fixing contrast in the deployed CSS by any route other than shipping HEAD.
- Adding JavaScript, interactive widgets, or client-side rendering for agent convenience.
- Rewriting thin page copy (e.g. `/contact` at 96 visible words) as content work.
- Registering with an external ARD registry or serving signed trust manifests and attestations.

## Success signal

A fresh Lighthouse run on a site built from this HEAD reports zero errors under the agentic-browsing audits — `llms.txt` valid, ARD manifest valid JSON — and passes contrast, while `npm run verify` is green including checks that would fail if either discovery artifact went missing, malformed, or stale.

## Assumptions

- Both `/.well-known/ard.json` (what Lighthouse probes) and `/.well-known/ai-catalog.json` (the ARD v1.0 well-known path) are served with identical content, plus an HTML `<link>`, rather than betting on one name.
- The contrast failure belongs to the deployed CSS, not HEAD: all eight palettes measure ≥ 4.5:1 for every text role at HEAD, and the hero's copy-on-raised role is 4.55:1 at its worst (Dracula).
- The prior UX review's note about eleven sub-AA ratios in published palettes is superseded by commit `6c0c34d`, which nudged every palette's text roles to AA.

## Open Questions

- Can the manual deploy path set `Content-Type: application/ai-catalog+json` on the catalog files? If it cannot, valid JSON served under any type still passes Lighthouse, which parses the body — so this is a polish item, not a blocker.
- Should `/wisaw` (a 270-word stub canonicalising to `/builds/wisaw`) appear in `llms.txt` and the catalog, or be excluded as duplicate content?
- Which artifact types are in scope for catalog entries: links to real pages and package repositories only, or also generated Markdown renditions that would have to be published first?
- Are thin-page findings (e.g. `/contact` at 96 visible words) in scope here, or out as content work?
