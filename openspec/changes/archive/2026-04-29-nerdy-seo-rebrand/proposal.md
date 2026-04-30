## Why

The current site is a generic corporate-looking SPA that doesn't reflect Echowaves' actual identity: a playful, opinionated, technically-deep personal brand built by Dmitry Amelchenko. The site has major SEO gaps (SPA with no per-page meta, no structured data, no sitemap, duplicate H1s, stale content), and the hardcoded data is significantly out of date — blog shows 6 posts from 2021-2024 while 31 posts exist through 2026, star counts are stale, and the most interesting recent content (AI/agentic coding/vibe coding series) is missing entirely.

## What Changes

- **Migrate from Create React App to Astro (SSG)** — static multi-page output, per-page `<head>`, near-zero client JS, built-in sitemap. Same S3+CloudFront hosting, no infrastructure changes. Existing React components reused via Astro's React integration.
- **Dark nerdy theme** — Replace corporate purple gradient with dark developer-oriented aesthetic (dark backgrounds, monospace accents, terminal-inspired UI elements, code-block styling). Keep it playful — the upside-down tagline as brand signature.
- **Content refresh** — Swap featured blog articles to 2025-2026 pieces (Token Tax, Velocity is a Vanity Metric, From Vibe Coding to SDD, The End of Vibe Coding, Make Coding Fun Again, AI Vibe-Coded Mobile App) plus pinned classic "Minimalistic architecture for Minimalistic product." Update all stale stats (stars, forks, post count: 31 posts, 103 stars for expo-cached-image, 38 stars for WiSaw, etc.).
- **Blog-forward layout** — Elevate blog/articles as primary content rather than section #5. The thought leadership pieces are the most differentiated content.
- **SEO overhaul** — Per-page title/description/og tags, JSON-LD structured data (Organization, Person, SoftwareApplication), sitemap.xml, fix dual-H1 problem, keyword-rich meta descriptions targeting "expo cached image", "react native image caching", "expo storage".
- **Brand voice shift** — From generic corporate ("Building the Future of Mobile Development") to nerdy-personal ("Source of complex solutions to your simple problems" / the upside-down variant). Echowaves stays as the brand name.

## Capabilities

### New Capabilities
- `seo`: Per-page meta tags, JSON-LD structured data, sitemap.xml generation, keyword targeting
- `dark-theme`: Dark color scheme with terminal/developer aesthetic, monospace accents, nerdy brand elements

### Modified Capabilities
- `architecture`: Migrate from CRA to Astro SSG, Vite-based build, .astro page files wrapping React components
- `components`: Restyle all components for dark theme, update Header to use Astro island hydration, fix H1 hierarchy
- `pages-and-routing`: Astro file-based routing replaces React Router, per-page layouts with individual head tags
- `data-and-content`: Refresh all hardcoded data (blog posts, stats, star counts), add 2025-2026 articles, pin "Minimalistic architecture" classic
- `styling-and-design`: Dark color palette, terminal-inspired cards, monospace fonts, responsive dark theme

## Impact

- **Build system**: CRA → Astro (new `astro.config.mjs`, remove `react-scripts`)
- **Dependencies**: Remove `react-router-dom`, `react-scripts`. Add `astro`, `@astrojs/react`, `@astrojs/sitemap`.
- **File structure**: New `src/pages/*.astro` files, `src/layouts/*.astro`, existing `src/components/*.tsx` mostly preserved
- **CSS**: All component CSS files rewritten for dark theme
- **HTML**: `public/index.html` replaced by Astro layouts with per-page `<head>`
- **Hosting**: No change — still static files to S3+CloudFront. Build output moves from `build/` to `dist/`
