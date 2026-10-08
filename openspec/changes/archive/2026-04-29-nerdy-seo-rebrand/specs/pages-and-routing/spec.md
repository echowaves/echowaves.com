## MODIFIED Requirements

### Requirement: Route Definitions
Routes SHALL be defined by `.astro` files in `src/pages/` using Astro file-based routing. Each route SHALL produce a separate HTML file with its own `<head>` containing unique title, meta description, OG tags, and JSON-LD.

#### Scenario: Home page route
- **WHEN** `src/pages/index.astro` is built
- **THEN** `dist/index.html` is generated with home-page-specific `<head>` tags and all section components rendered as static HTML

#### Scenario: Privacy page route
- **WHEN** `src/pages/privacy.astro` is built
- **THEN** `dist/privacy/index.html` is generated with privacy-specific `<head>` tags

#### Scenario: Support page route
- **WHEN** `src/pages/support.astro` is built
- **THEN** `dist/support/index.html` is generated with support-specific `<head>` tags

### Requirement: Layout composition
A shared `BaseLayout.astro` layout SHALL wrap all pages, providing common `<head>` elements (charset, viewport, favicon, global CSS, JSON-LD Organization schema) and accepting per-page props for title, description, and OG tags.

#### Scenario: BaseLayout provides common head
- **WHEN** any page is rendered through BaseLayout
- **THEN** the HTML includes charset, viewport, theme-color, favicon links, global CSS, and Organization JSON-LD

#### Scenario: BaseLayout accepts per-page props
- **WHEN** a page passes title="Privacy Policy — Echowaves" to BaseLayout
- **THEN** the rendered HTML has `<title>Privacy Policy — Echowaves</title>`

### Requirement: Navigation patterns
In-page scrolling on the home page SHALL use native anchor links (`#about`, `#projects`, etc.) with CSS `scroll-behavior: smooth`. No JavaScript-based scroll handling is required.

#### Scenario: Smooth scroll to section
- **WHEN** a user clicks "Packages" in the nav on the home page
- **THEN** the page smoothly scrolls to the `#packages` section using native CSS scroll behavior

## REMOVED Requirements

### Requirement: ScrollToHash component
**Reason**: Native CSS `scroll-behavior: smooth` handles anchor scrolling. No JavaScript needed.
**Migration**: Remove `ScrollToHash` from `App.tsx`. Add `scroll-behavior: smooth` to global CSS `html` selector (already present in `index.css`).

### Requirement: React page components
**Reason**: Replaced by `.astro` page files that directly compose React components.
**Migration**: Remove `src/pages/Home.tsx`, `src/pages/Privacy.tsx`, `src/pages/Support.tsx`, `src/pages/index.ts`. Replace with `src/pages/index.astro`, `src/pages/privacy.astro`, `src/pages/support.astro`.
