# Architecture

## Overview

Echowaves.com is a static multi-page marketing/showcase website for Echowaves Corporation, built with Astro 5 and React components using TypeScript.

## Tech Stack

- **Language:** TypeScript
- **Framework:** Astro 5 with `@astrojs/react` integration
- **Routing:** Astro file-based routing (no client-side router)
- **Build Tool:** Astro (Vite-based internally)
- **Styling:** Component-scoped CSS files (no CSS-in-JS, no preprocessors)
- **Integrations:** `@astrojs/sitemap` for sitemap generation

## Project Structure

```
src/
├── layouts/
│   └── BaseLayout.astro    # Shared layout with <head>, header, footer
├── pages/
│   ├── index.astro         # Home page (/ route)
│   ├── privacy.astro       # Privacy page (/privacy route)
│   └── support.astro       # Support page (/support route)
└── components/             # React components
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

## Routing

| Path       | Page File          | Description                    |
|------------|-------------------|--------------------------------|
| `/`        | `index.astro`     | Main landing page (all sections) |
| `/privacy` | `privacy.astro`   | Privacy policy page            |
| `/support` | `support.astro`   | Support & FAQ page             |

## Navigation Model

- **Hash anchors** (`#about`, `#projects`, `#packages`, `#blog`) for in-page section scrolling on Home
- **Native CSS** `scroll-behavior: smooth` handles smooth scroll to hash targets
- **Standard `<a href="#section">` pattern** for anchors

## Build & Deploy

- `npm run dev` — Astro development server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build locally
- Output is a static site served from `dist/`
