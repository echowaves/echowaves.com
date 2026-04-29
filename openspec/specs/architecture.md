# Architecture

## Overview

Echowaves.com is a single-page marketing/showcase website for Echowaves Corporation, built with React and TypeScript using Create React App.

## Tech Stack

- **Language:** TypeScript 4.9
- **Framework:** React 19
- **Routing:** React Router DOM 7 (BrowserRouter)
- **Build Tool:** Create React App (react-scripts 5)
- **Testing:** Jest + React Testing Library
- **Styling:** Component-scoped CSS files (no CSS-in-JS, no preprocessors)

## Project Structure

```
src/
├── index.tsx              # App entry point, renders <App />
├── App.tsx                # Router setup, defines routes
├── App.css                # Global styles (reset, utilities, responsive)
├── index.css              # Base reset layer
├── pages/                 # Page-level components (route targets)
│   ├── index.ts           # Barrel export
│   ├── Home.tsx           # Composes all home sections
│   ├── Privacy.tsx         # Header + Privacy content + Footer
│   └── Support.tsx         # Header + Support content + Footer
└── components/            # UI components (sections + content)
    ├── Header.tsx/.css     # Sticky nav bar
    ├── Hero.tsx/.css       # Landing hero section
    ├── About.tsx/.css      # Company mission & features
    ├── Projects.tsx/.css   # GitHub project cards
    ├── Packages.tsx/.css   # NPM package showcase
    ├── Blog.tsx/.css       # Blog post highlights
    ├── Footer.tsx/.css     # Site footer
    ├── Privacy.tsx/.css    # Privacy policy content
    └── Support.tsx/.css    # Support/FAQ content
```

## Routing

| Path       | Page Component | Description                    |
|------------|----------------|--------------------------------|
| `/`        | `Home`         | Main landing page (all sections) |
| `/privacy` | `Privacy`      | Privacy policy page            |
| `/support` | `Support`      | Support & FAQ page             |

## Navigation Model

- **Hash anchors** (`/#about`, `/#projects`, `/#packages`, `/#blog`) for in-page section scrolling on Home
- **`ScrollToHash` component** in `App.tsx` handles smooth scroll to hash targets after navigation
- **React Router `<Link>`** not used for anchors; standard `<a href="/#section">` pattern

## Build & Deploy

- `npm start` — development server
- `npm run build` — production build to `build/`
- `npm test` — run tests
- Output is a static site served from `build/`
