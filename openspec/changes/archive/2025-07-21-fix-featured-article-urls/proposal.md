## Why

5 of 7 Featured Article links in the Blog component point to broken dev.to URLs (HTTP 404). The slugs were fabricated during initial development rather than copied from the actual articles. Additionally, 3 article titles and most descriptions don't match the real published content. This damages credibility and sends visitors to dead pages.

## What Changes

- Fix 5 broken dev.to URLs in the `featuredPosts` array in `Blog.tsx` to point to the correct article slugs
- Correct 3 article titles that don't match the actual published articles
- Update descriptions to accurately reflect the real article content
- Verify remaining metadata (dates, tags, read times) against actual articles

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `data-and-content`: Featured article URLs, titles, and descriptions must match actual published dev.to articles

## Impact

- **Code**: `src/components/Blog.tsx` — the `featuredPosts` array (lines 15–88)
- **User-facing**: All Featured Article links will become functional; titles/descriptions will accurately represent the linked content
- **Dependencies**: None
- **Risk**: Minimal — data-only change in a single component with no logic changes
