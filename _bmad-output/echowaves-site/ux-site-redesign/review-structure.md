# Structure lens — DESIGN.md + EXPERIENCE.md

Also run inline (same subagent failure as the accessibility lens). Checks were
mechanical: frontmatter parse, section order against both required shapes, token↔body
traceability, link resolution, and spine↔code agreement after implementation.

| # | Severity | Location | Finding | Fix |
|---|---|---|---|---|
| 1 | Major | Both spines vs `src/` | Spines described the pre-implementation state: `/wisaw` as an `[ASSUMPTION]` needing a redirect, tab overflow "undecided", breakpoint drift unresolved, `hero.body` still in old framing. A contract that lags the code stops being a contract. | Updated to implemented reality: `/builds/wisaw` with a 301-style redirect from `/wisaw`, horizontal-scroll tabs, single 768px breakpoint plus scroll strip, man-page hero shipped. |
| 2 | Major | DESIGN.md → frontmatter vs body | Tokens with no implementation target: `rounded.sm/md/full`, `spacing.1–7` had no stated CSS variable, so an implementer could not tell which token they were reading. | Added a token→CSS-variable table to DESIGN.md naming what is live (`--radius-window`, `--radius-control`, `--reading-column`) and what still resolves through legacy aliases. |
| 3 | Minor | EXPERIENCE.md → IA route table | Route table named `src/data/site.ts` exports that no longer match the code (`hero.body`; nav derived from a new `pages` route table). | Table now cites `pages`, `utilityPages`, `nav` (derived) and the moved case study. |
| 4 | Minor | DESIGN.md → Brand & Style frontmatter description | Used the word "dossier", which this project's own copy scan bans in shipped strings — a spine that violates the site's rules invites the implementation to drift. | Reworded. |
| 5 | Minor | EXPERIENCE.md → Component Patterns | Nothing stated who owns the window chrome, and `support`/`privacy` were rendering their own header, footer and skip link. Once BaseLayout owned the chrome this produced nested `<main>` elements and two tab strips until caught. | Chrome ownership is now explicit (BaseLayout), and `npm run verify` fails if any built page renders a window, main, tab strip or skip link other than exactly once. |
| 6 | OK | Links and section order | All relative links in both spines resolve on disk; DESIGN.md keeps the canonical section order; EXPERIENCE.md contains all required sections plus Responsive & Platform. | None. |
