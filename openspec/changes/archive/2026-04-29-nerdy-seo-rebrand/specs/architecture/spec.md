## MODIFIED Requirements

### Requirement: Tech Stack
- **Language:** TypeScript
- **Framework:** Astro 5 with `@astrojs/react` integration
- **Routing:** Astro file-based routing (no client-side router)
- **Build Tool:** Astro (Vite-based internally)
- **Styling:** Component-scoped CSS files (no CSS-in-JS, no preprocessors)
- **Integrations:** `@astrojs/sitemap` for sitemap generation

#### Scenario: Build produces static multi-page output
- **WHEN** `npm run build` is executed
- **THEN** the `dist/` directory contains separate HTML files for each route (`index.html`, `privacy/index.html`, `support/index.html`) and a `sitemap.xml`

### Requirement: Project Structure
The project SHALL follow this directory structure:
```
src/
├── layouts/
│   └── BaseLayout.astro    # Shared layout with <head>, header, footer
├── pages/
│   ├── index.astro         # Home page (/ route)
│   ├── privacy.astro       # Privacy page (/privacy route)
│   └── support.astro       # Support page (/support route)
└── components/             # React components (unchanged location)
    ├── Header.tsx/.css
    ├── Hero.tsx/.css
    ├── About.tsx/.css
    ├── Projects.tsx/.css
    ├── Packages.tsx/.css
    ├── Blog.tsx/.css
    ├── Footer.tsx/.css
    ├── Privacy.tsx/.css
    └── Support.tsx/.css
```

#### Scenario: Astro pages import React components
- **WHEN** `src/pages/index.astro` is rendered at build time
- **THEN** it imports and renders Hero, About, Projects, Packages, Blog as static HTML with zero client JS

### Requirement: Build and Deploy Commands
- `npm run dev` — Astro development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- Output is a static site served from `dist/`

#### Scenario: Build output directory
- **WHEN** `npm run build` completes
- **THEN** all static assets are in `dist/` (not `build/`)

## REMOVED Requirements

### Requirement: React Router DOM routing
**Reason**: Replaced by Astro file-based routing. Client-side routing is unnecessary for a static multi-page site.
**Migration**: Remove `react-router-dom` dependency. Remove `App.tsx` router setup. Remove `ScrollToHash` component. Hash scrolling handled natively by browser with `scroll-behavior: smooth`.

### Requirement: CRA entry point
**Reason**: Astro handles entry points via `src/pages/`. `index.tsx` and `App.tsx` are no longer needed.
**Migration**: Remove `src/index.tsx`, `src/App.tsx`, `src/App.css`. Configuration moves to `astro.config.mjs`.
