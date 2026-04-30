## Context

The Echowaves showcase site is currently a Create React App SPA deployed as static files to S3+CloudFront. All content is hardcoded in React components. The site serves as a personal brand hub for Dmitry Amelchenko / Echowaves, showcasing open-source Expo/React Native packages, GitHub projects, and dev.to blog articles.

Current pain points: corporate-generic look that doesn't match the playful-nerdy voice on dev.to, stale hardcoded data, and zero SEO beyond basic OG tags on the single `index.html`.

## Goals / Non-Goals

**Goals:**
- Migrate to Astro SSG with static multi-page output (each route = own HTML with unique `<head>`)
- Dark, developer-oriented visual theme with terminal/monospace accents
- Per-page SEO: unique titles, descriptions, OG tags, JSON-LD structured data
- Auto-generated sitemap.xml
- Refresh all content to current data (blog posts through 2026, updated star counts)
- Reuse existing React components with minimal modification
- Keep S3+CloudFront static hosting — no server runtime

**Non-Goals:**
- No SSR / server-side rendering — purely static build
- No CMS integration — content stays in source code
- No dynamic data fetching at runtime (GitHub API, npm API) — hardcoded values updated manually
- No blog post full-text hosting — articles live on dev.to, site links to them
- No i18n / multi-language support
- No authentication or user accounts

## Decisions

### D1: Astro over Vite-only or Next.js

**Decision:** Use Astro in SSG mode.

**Alternatives considered:**
- *Vite + vite-ssg*: Smaller migration but still ships full React runtime, no built-in sitemap, manual per-page head management. Plugin ecosystem less mature.
- *Next.js static export*: Heavier framework, ships React runtime to client, overkill for a content site with near-zero interactivity.

**Rationale:** Astro renders React components at build time with zero JS by default. Only the Header hamburger menu needs client-side hydration (`client:load`). Built-in sitemap integration. Aligns with the "minimalist architecture" brand. Output is plain HTML/CSS — same deployment target.

### D2: Keep React components, wrap in .astro pages

**Decision:** Existing `.tsx` components remain as-is (with CSS updates). New `.astro` files in `src/pages/` and `src/layouts/` handle routing, layout composition, and `<head>` management.

**Rationale:** Minimizes rewrite scope. Astro's `@astrojs/react` integration renders React components at build time. Only interactive components need `client:` directives.

### D3: File-based routing replaces React Router

**Decision:** Remove `react-router-dom`. Astro's file-based routing in `src/pages/` handles routes:
- `src/pages/index.astro` → `/`
- `src/pages/privacy.astro` → `/privacy`
- `src/pages/support.astro` → `/support`

**Rationale:** Astro generates a separate HTML file per page. No client-side router needed. Hash-anchor scrolling for sections on the home page works natively.

### D4: Dark theme color palette

**Decision:** Dark background (`#0d1117` — GitHub dark), with accent colors:
- Primary accent: `#58a6ff` (bright blue, links/CTAs)
- Secondary accent: `#8b949e` (muted gray, secondary text)
- Code/terminal accent: `#39d353` (green, terminal-inspired highlights)
- Card backgrounds: `#161b22` (slightly lighter dark)
- Border/dividers: `#30363d`
- Text: `#e6edf3` (light gray on dark)

**Rationale:** GitHub dark mode palette is familiar to the developer audience. High contrast. Professional but nerdy. The green accent adds a terminal/hacker feel without going full retro.

### D5: Typography — monospace accents

**Decision:** Keep system font stack for body text. Add monospace font (`'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace`) for:
- Taglines and hero text
- Package names and install commands
- Stats/numbers
- Section headers (optional)

**Rationale:** Monospace signals "developer tool" instantly. JetBrains Mono is widely available and has ligatures. System fallback chain ensures it works everywhere.

### D6: JSON-LD structured data strategy

**Decision:** Add JSON-LD scripts to page `<head>` via Astro layouts:
- **Every page:** `Organization` schema for Echowaves
- **Home page:** `Person` schema for Dmitry, `WebSite` schema with search
- **Packages section:** `SoftwareSourceCode` for each npm package
- **Projects section:** `SoftwareSourceCode` for WiSaw

**Rationale:** JSON-LD is Google's preferred structured data format. Organization + Person establishes entity recognition. SoftwareSourceCode helps packages appear in developer search results.

### D7: Header H1 hierarchy fix

**Decision:** Header logo becomes a styled `<div>` or `<span>` (not `<h1>`). Each page gets exactly one `<h1>`:
- Home: Hero title
- Privacy: "Privacy Policy"
- Support: "Support"

**Rationale:** Multiple H1s confuse search engines about page topic. The logo is navigation, not a heading.

### D8: Blog content as featured cards linking to dev.to

**Decision:** Blog section features 7 posts (6 recent 2025-2026 + 1 pinned classic) as cards linking to dev.to. No full-text cross-posting. Use `rel="noopener noreferrer"` on outbound links.

**Rationale:** dev.to already has excellent SEO for the articles. Cross-posting creates duplicate content concerns. The site's job is to be the hub that links out.

### D9: Build output directory

**Decision:** Astro outputs to `dist/` (its default). Update any deployment scripts/CDK that reference `build/`.

**Rationale:** Astro convention. The old `build/` directory can be gitignored.

## Risks / Trade-offs

- **[Migration scope]** Astro migration touches every file, though most component logic stays unchanged. → Mitigation: Migrate incrementally — get Astro scaffolding working first, then port components one at a time.
- **[Learning curve]** `.astro` file syntax is new. → Mitigation: `.astro` files are essentially HTML with imports; simple for this use case. Only ~5 `.astro` files needed (3 pages + 1-2 layouts).
- **[Stale data remains manual]** Stats will drift again over time. → Mitigation: Accepted trade-off. Could add shields.io badges for auto-updating npm/GitHub stats in a future change.
- **[Dark theme accessibility]** Dark themes can have contrast issues. → Mitigation: Use WCAG AA-compliant color pairs. Test with axe or lighthouse.
- **[Build output path change]** `build/` → `dist/` may break deployment pipeline. → Mitigation: Check WiSaw.cdk or any deploy scripts and update the path.
