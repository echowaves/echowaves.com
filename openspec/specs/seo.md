# SEO

## Purpose

Defines search engine optimization requirements: per-page meta tags, Open Graph/Twitter Card tags, JSON-LD structured data, sitemap generation, heading hierarchy, and keyword targeting.

## Requirements

### Requirement: Per-page meta tags
Each route SHALL have a unique `<title>`, `<meta name="description">`, and canonical URL in its `<head>`.

- Home: "Echowaves — Open-Source React Native & Expo Packages", canonical `https://echowaves.com/`
- Privacy: "Privacy Policy — Echowaves", canonical `https://echowaves.com/privacy`
- Support: "Support — Echowaves", canonical `https://echowaves.com/support`

### Requirement: Open Graph and Twitter Card tags per page
Each route SHALL have unique `og:title`, `og:description`, `og:url`, `og:image`, `twitter:title`, `twitter:description`, and `twitter:image` tags.

### Requirement: JSON-LD structured data
The site SHALL include JSON-LD `<script type="application/ld+json">` blocks in page heads.

- **Organization** schema on every page: name "Echowaves", URL, logo, sameAs links to GitHub, LinkedIn, and Dev.to
- **Person** schema on home page: name "Dmitry Amelchenko", jobTitle "CTO", associated Organization
- **SoftwareSourceCode** schema on home page for expo-cached-image, expo-storage, and expo-masonry-layout

### Requirement: Sitemap generation
The build process SHALL generate a `sitemap.xml` at the site root listing all pages (`/`, `/privacy`, `/support`) with `https://echowaves.com` as the base URL.

### Requirement: Single H1 per page
Each page SHALL have exactly one `<h1>` element. The header logo SHALL NOT be an `<h1>`.

### Requirement: Keyword-targeted content
Page titles and descriptions SHALL include target keywords: "expo cached image", "react native image caching", "expo storage", "react native masonry layout", "open source expo packages".
