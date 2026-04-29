## MODIFIED Requirements

### Requirement: Header component
The Header component SHALL render a sticky navigation bar with logo, nav links, external GitHub link, and a responsive hamburger menu. The logo SHALL be a styled `<div>` or `<span>` (NOT `<h1>`). The Header SHALL use Astro's `client:load` directive for client-side interactivity (hamburger menu toggle).

#### Scenario: Header renders with no H1
- **WHEN** any page is loaded
- **THEN** the Header logo "echowaves" is rendered as a non-heading element and the hamburger menu is interactive

### Requirement: Hero section
The Hero section SHALL display the nerdy tagline, the upside-down text brand element, CTA buttons, and updated stats. Stats SHALL reflect current data: 103+ stars, 43 repos, 1,500+ weekly downloads.

#### Scenario: Hero displays updated stats
- **WHEN** the home page is loaded
- **THEN** the hero stats show "103+" for GitHub stars

#### Scenario: Upside-down tagline
- **WHEN** the home page hero is rendered
- **THEN** the upside-down tagline is visible as a brand element

### Requirement: Blog section content
The Blog section SHALL feature 7 articles: 6 from 2025-2026 and 1 pinned classic ("Minimalistic architecture for Minimalistic product", Feb 2019). The post count stat SHALL read "31". Years active SHALL read "7+".

#### Scenario: Featured articles are current
- **WHEN** the blog section is rendered
- **THEN** the featured articles include "The Token Tax", "Velocity is a Vanity Metric", "From Vibe Coding to SDD", "The End of Vibe Coding", "Make Coding Fun Again", "Before vs. After: AI Vibe-Coded Mobile App", and pinned "Minimalistic architecture for Minimalistic product"

#### Scenario: Blog stats are current
- **WHEN** the blog section is rendered
- **THEN** the stats show 31 posts published, 19 comments, and 7+ years active

### Requirement: Projects section data
The Projects section SHALL display current GitHub star and fork counts matching live data.

#### Scenario: WiSaw stars are current
- **WHEN** the projects section is rendered
- **THEN** WiSaw shows 38 stars and 6 forks

### Requirement: Packages section data
The Packages section SHALL display current star counts: expo-cached-image at 103, expo-storage at 15, expo-masonry-layout at 1.

#### Scenario: expo-cached-image stars
- **WHEN** the packages section is rendered
- **THEN** expo-cached-image shows 103 stars
