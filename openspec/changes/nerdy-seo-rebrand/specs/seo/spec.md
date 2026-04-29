## ADDED Requirements

### Requirement: Per-page meta tags
Each route SHALL have a unique `<title>`, `<meta name="description">`, and canonical URL in its `<head>`.

#### Scenario: Home page meta tags
- **WHEN** a search engine crawls `/`
- **THEN** the page has title "Echowaves — Open-Source React Native & Expo Packages", a description mentioning expo-cached-image, expo-storage, and Dmitry Amelchenko, and canonical URL `https://echowaves.com/`

#### Scenario: Privacy page meta tags
- **WHEN** a search engine crawls `/privacy`
- **THEN** the page has title "Privacy Policy — Echowaves", a privacy-specific description, and canonical URL `https://echowaves.com/privacy`

#### Scenario: Support page meta tags
- **WHEN** a search engine crawls `/support`
- **THEN** the page has title "Support — Echowaves", a support-specific description, and canonical URL `https://echowaves.com/support`

### Requirement: Open Graph and Twitter Card tags per page
Each route SHALL have unique `og:title`, `og:description`, `og:url`, `og:image`, `twitter:title`, `twitter:description`, and `twitter:image` tags.

#### Scenario: Social share for home page
- **WHEN** the home page URL is shared on social media
- **THEN** the preview shows the Echowaves-specific title, description, and brand image

### Requirement: JSON-LD structured data
The site SHALL include JSON-LD `<script type="application/ld+json">` blocks in page heads.

#### Scenario: Organization schema on every page
- **WHEN** any page is crawled
- **THEN** the page contains a JSON-LD block with `@type: Organization`, name "Echowaves", URL, logo, and sameAs links to GitHub, LinkedIn, and Dev.to

#### Scenario: Person schema on home page
- **WHEN** the home page is crawled
- **THEN** the page contains a JSON-LD block with `@type: Person`, name "Dmitry Amelchenko", jobTitle "CTO", and associated Organization

#### Scenario: Software schema for packages
- **WHEN** the home page is crawled
- **THEN** the page contains JSON-LD blocks with `@type: SoftwareSourceCode` for expo-cached-image, expo-storage, and expo-masonry-layout with their respective repository URLs

### Requirement: Sitemap generation
The build process SHALL generate a `sitemap.xml` at the site root listing all pages.

#### Scenario: Sitemap includes all routes
- **WHEN** the site is built
- **THEN** `sitemap.xml` contains entries for `/`, `/privacy`, and `/support` with `https://echowaves.com` as the base URL

### Requirement: Single H1 per page
Each page SHALL have exactly one `<h1>` element.

#### Scenario: Home page H1
- **WHEN** the home page is rendered
- **THEN** there is exactly one `<h1>` (the hero title), and the header logo is NOT an `<h1>`

### Requirement: Keyword-targeted content
Page titles and descriptions SHALL include target keywords: "expo cached image", "react native image caching", "expo storage", "react native masonry layout", "open source expo packages".

#### Scenario: Search engine keyword matching
- **WHEN** a user searches for "expo cached image react native"
- **THEN** the home page meta description contains relevant keywords about expo-cached-image
