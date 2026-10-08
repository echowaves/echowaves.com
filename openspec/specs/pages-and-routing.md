# Pages & Routing

## Route Definitions

Routes are defined by `.astro` files in `src/pages/` using Astro file-based routing. Each route produces a separate HTML file with its own `<head>` containing unique title, meta description, OG tags, and JSON-LD.

| Path       | Page File          | Layout                         |
|------------|-------------------|--------------------------------|
| `/`        | `index.astro`     | BaseLayout → Hero → About → Projects → Packages → Blog |
| `/privacy` | `privacy.astro`   | BaseLayout → Privacy content   |
| `/support` | `support.astro`   | BaseLayout → Support content   |

## Layout Composition

A shared `BaseLayout.astro` layout wraps all pages, providing common `<head>` elements (charset, viewport, favicon, global CSS, JSON-LD Organization schema) and accepting per-page props for title, description, and OG tags. Header and Footer are rendered within the layout.

## Navigation Patterns

### In-page Scrolling
- Home page sections have `id` attributes (`about`, `projects`, `packages`, `blog`)
- Nav links use `#section` format (e.g., `#about`)
- Native CSS `scroll-behavior: smooth` handles anchor scrolling — no JavaScript-based scroll handling needed

### Cross-page Links
- Footer links to `/privacy` and `/support`
- Privacy and Support pages include Header with nav back to home sections
