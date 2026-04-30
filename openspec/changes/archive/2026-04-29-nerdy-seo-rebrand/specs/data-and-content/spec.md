## MODIFIED Requirements

### Requirement: Blog posts data
The featured blog posts list SHALL contain the following 7 articles:

1. "The Token Tax: Why GenAI Billing Makes Minimalist Architecture Mandatory" — Apr 29, 2026, 3 min read, tags: [Architecture, AI, Software Engineering], link: `https://dev.to/dmitryame/the-token-tax-why-genai-billing-makes-minimalist-architecture-mandatory-4fl2`
2. "Velocity is a Vanity Metric: Why Agentic Coding is Actually About Quality" — Apr 23, 2026, 3 min read, tags: [AI, Architecture, Productivity], link: `https://dev.to/dmitryame/velocity-is-a-vanity-metric-why-agentic-coding-is-actually-about-quality-3cof`
3. "From Vibe Coding to SDD: Why the Future of Engineering is Architecture" — Mar 30, 2026, 3 min read, tags: [AI, Architecture, Vibe Coding], link: `https://dev.to/dmitryame/from-vibe-coding-to-sdd-why-the-future-of-engineering-is-architecture-2ae5`
4. "The End of Vibe Coding" — Mar 8, 2026, 3 min read, tags: [AI, Engineering, Testing], link: `https://dev.to/dmitryame/the-end-of-vibe-coding-2e78`
5. "Make Coding Fun Again" — Apr 26, 2025, 8 min read, tags: [GenAI, GitHub Copilot, JavaScript], link: `https://dev.to/dmitryame/make-coding-fun-again-1p2a`
6. "Before vs. After: How AI 'Vibe-Coded' a Mobile App Makeover That Defies Expectations!" — Jun 15, 2025, 4 min read, tags: [AI, React Native], link: `https://dev.to/dmitryame/vibe-coding-ux-improvements-for-mobile-app-before-and-after-side-by-side-comparison-h3j`
7. **PINNED**: "Minimalistic architecture for Minimalistic product" — Feb 20, 2019, 2 min read, tags: [Architecture, JavaScript, Node], link: `https://dev.to/dmitryame/minimalistic-architecture-for-minimalistic-product-ffd`

#### Scenario: Featured articles rendered
- **WHEN** the blog section is rendered
- **THEN** 7 blog post cards are displayed with the above data, with the pinned post visually distinguished

### Requirement: Blog stats
Blog stats SHALL read: 31 posts published, 19 comments written, 7+ years active.

#### Scenario: Stats accuracy
- **WHEN** the blog stats are rendered
- **THEN** the numbers shown are 31, 19, and 7+

### Requirement: Hero stats
Hero stats SHALL read: 103+ GitHub Stars, 43 Repositories, 1,500+ Weekly Downloads.

#### Scenario: Hero stats accuracy
- **WHEN** the hero section is rendered
- **THEN** the stat numbers are "103+", "43", and "1,500+"

### Requirement: Project star and fork counts
Projects SHALL display current counts: WiSaw (38 stars, 6 forks), expo-cached-image (103 stars, 21 forks), expo-storage (15 stars, 3 forks), expo-masonry-layout (1 star, 0 forks).

#### Scenario: WiSaw project data
- **WHEN** the WiSaw project card is rendered
- **THEN** it shows 38 stars and 6 forks

### Requirement: Package star counts
Package cards SHALL show: expo-cached-image (103 stars), expo-storage (15 stars), expo-masonry-layout (1 star).

#### Scenario: Package stats accuracy
- **WHEN** the expo-cached-image package card is rendered
- **THEN** it shows 103 stars

### Requirement: Blog link button text
The "View All" button SHALL read "View All 31 Articles on Dev.to".

#### Scenario: Button text
- **WHEN** the blog footer is rendered
- **THEN** the button text is "View All 31 Articles on Dev.to"
