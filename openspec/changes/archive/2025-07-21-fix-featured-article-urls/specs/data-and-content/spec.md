## MODIFIED Requirements

### Requirement: Featured article data accuracy
All featured article entries SHALL contain the correct dev.to URL, the exact published title, and a description that accurately summarizes the article content.

#### Scenario: Featured article URLs resolve
- **WHEN** a user clicks any featured article link
- **THEN** the browser SHALL navigate to a live dev.to article page (HTTP 200), not a 404 error

#### Scenario: Featured article titles match published content
- **WHEN** the featured articles section is rendered
- **THEN** each article title SHALL match the title displayed on the corresponding dev.to page

#### Scenario: Featured article descriptions are accurate
- **WHEN** the featured articles section is rendered
- **THEN** each article description SHALL be a faithful summary of the linked article's content

#### Scenario: Corrected article URL mapping
- **WHEN** the `featuredPosts` array is defined
- **THEN** the following URL corrections SHALL be applied:
  - "The Token Tax" → `https://dev.to/dmitryame/the-token-tax-why-genai-billing-makes-minimalist-architecture-mandatory-4fl2`
  - "Velocity is a Vanity Metric" → `https://dev.to/dmitryame/velocity-is-a-vanity-metric-why-agentic-coding-is-actually-about-quality-3cof`
  - "From Vibe Coding to SDD" → `https://dev.to/dmitryame/from-vibe-coding-to-sdd-why-the-future-of-engineering-is-architecture-2ae5`
  - "The End of Vibe Coding" → `https://dev.to/dmitryame/the-end-of-vibe-coding-2e78`
  - "Minimalistic architecture" → `https://dev.to/dmitryame/minimalistic-architecture-for-minimalistic-product-ffd`
