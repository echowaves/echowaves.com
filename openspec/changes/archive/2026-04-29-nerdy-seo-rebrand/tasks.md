## 1. Astro Migration Setup

- [x] 1.1 Initialize Astro project: install `astro`, `@astrojs/react`, `@astrojs/sitemap` as dependencies. Remove `react-scripts`, `react-router-dom`. Update `package.json` scripts to use Astro (`dev`, `build`, `preview`).
- [x] 1.2 Create `astro.config.mjs` with React integration, sitemap integration (site: `https://echowaves.com`), and output `static`.
- [x] 1.3 Create `src/layouts/BaseLayout.astro` — shared layout with `<html>`, `<head>` (charset, viewport, favicon, global CSS, JSON-LD Organization schema), props for per-page title/description/OG tags, and `<slot />` for content.
- [x] 1.4 Create `src/pages/index.astro` — import and render Header (with `client:load`), Hero, About, Projects, Packages, Blog, Footer. Set home-page-specific meta tags.
- [x] 1.5 Create `src/pages/privacy.astro` — import Header (`client:load`), Privacy component, Footer. Set privacy-specific meta tags.
- [x] 1.6 Create `src/pages/support.astro` — import Header (`client:load`), Support component, Footer. Set support-specific meta tags.
- [x] 1.7 Remove CRA files: `src/index.tsx`, `src/App.tsx`, `src/App.css`, `src/pages/Home.tsx`, `src/pages/Privacy.tsx`, `src/pages/Support.tsx`, `src/pages/index.ts`, `src/reportWebVitals.ts`, `src/react-app-env.d.ts`, `src/setupTests.ts`. Move global CSS to layout imports.
- [x] 1.8 Update `tsconfig.json` for Astro compatibility. Remove CRA-specific config.
- [x] 1.9 Verify `npm run build` produces `dist/` with `index.html`, `privacy/index.html`, `support/index.html`, and `sitemap.xml`. Verify `npm run dev` serves the site correctly.

## 2. Dark Theme & Styling

- [x] 2.1 Create global CSS with dark color palette: background `#0d1117`, text `#e6edf3`, card surfaces `#161b22`, borders `#30363d`, accent `#58a6ff`, green `#39d353`. Add monospace font stack for code elements. Add `scroll-behavior: smooth` to `html`.
- [x] 2.2 Restyle `Header.css` — dark background, light text, accent-colored links, dark mobile menu. Change logo from `<h1>` to `<div>` in `Header.tsx`.
- [x] 2.3 Restyle `Hero.css` — dark gradient or solid dark background, monospace tagline, accent-colored CTA buttons. Update hero copy to nerdy voice.
- [x] 2.4 Restyle `About.css` — dark cards with border styling, terminal-inspired feature cards.
- [x] 2.5 Restyle `Projects.css` — dark card backgrounds, subtle borders, accent-colored links and language badges.
- [x] 2.6 Restyle `Packages.css` — dark cards, monospace package names and install commands, terminal-style code blocks.
- [x] 2.7 Restyle `Blog.css` — dark post cards, accent-colored tags, dark topic area cards.
- [x] 2.8 Restyle `Footer.css` — dark background, muted text, accent-colored links and social icons.
- [x] 2.9 Restyle `Privacy.css` and `Support.css` — dark backgrounds, light text, consistent with overall theme.
- [x] 2.10 Verify WCAG AA contrast ratios for all text/background combinations. Test with Lighthouse accessibility audit.

## 3. Content Refresh

- [x] 3.1 Update `Hero.tsx` — change tagline to nerdy voice, add upside-down text brand element, update stats to 103+ stars / 43 repos / 1,500+ downloads.
- [x] 3.2 Update `Blog.tsx` — replace 6 featured posts with 7 new posts (6 from 2025-2026 + pinned "Minimalistic architecture"). Update stats to 31 posts, 7+ years active. Update "View All" button text.
- [x] 3.3 Update `Projects.tsx` — update WiSaw to 38 stars/6 forks, update other project stats to match live data.
- [x] 3.4 Update `Packages.tsx` — update expo-cached-image to 103 stars, expo-storage to 15 stars, expo-masonry-layout to 1 star.
- [x] 3.5 Update `Header.tsx` — change logo `<h1>` to non-heading element.
- [x] 3.6 Update blog topic areas and author bio to reflect current focus (AI/agentic coding, vibe coding, architecture).

## 4. SEO Implementation

- [x] 4.1 Add per-page `<title>` and `<meta name="description">` in each `.astro` page file, targeting keywords (expo cached image, react native, expo storage, etc.).
- [x] 4.2 Add per-page OG tags (`og:title`, `og:description`, `og:url`, `og:image`) and Twitter Card tags to `BaseLayout.astro` via props.
- [x] 4.3 Add JSON-LD Organization schema to `BaseLayout.astro` (every page).
- [x] 4.4 Add JSON-LD Person schema (Dmitry Amelchenko) to home page.
- [x] 4.5 Add JSON-LD SoftwareSourceCode schemas for the 3 npm packages on home page.
- [x] 4.6 Add canonical URL tag per page (`<link rel="canonical">`).
- [x] 4.7 Verify sitemap.xml is generated correctly with all routes at `https://echowaves.com`.
- [x] 4.8 Move Google Analytics tag from `public/index.html` to `BaseLayout.astro` head.

## 5. Cleanup & Verification

- [x] 5.1 Remove old `build/` directory from `.gitignore` if present, add `dist/`. Remove leftover CRA files (`public/index.html` — content moved to BaseLayout).
- [x] 5.2 Run full build and verify all pages render correctly with dark theme.
- [x] 5.3 Run Lighthouse audit on each page — verify SEO score, accessibility score, and performance score.
- [x] 5.4 Verify all external links work (dev.to articles, GitHub repos, npm packages, app store links).
- [x] 5.5 Test responsive layout on mobile (375px) and tablet (768px) breakpoints.
