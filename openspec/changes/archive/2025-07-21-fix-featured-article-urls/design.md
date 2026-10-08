## Context

The Blog component (`src/components/Blog.tsx`) contains a hardcoded `featuredPosts` array with 7 articles. Five of the seven `link` values contain fabricated dev.to slugs that return HTTP 404. Three article titles and most descriptions also don't match the actual published content. This is a data correction — no architectural or logic changes are needed.

## Goals / Non-Goals

**Goals:**
- All 7 featured article links resolve to live dev.to pages (HTTP 200)
- Titles and descriptions accurately reflect the real published articles

**Non-Goals:**
- Changing the Blog component structure or styling
- Adding dynamic article fetching from dev.to API
- Updating the blog stats, topic areas, or any other Blog section
- Changing the set of featured articles (same 7 articles, correct data)

## Decisions

**Direct data replacement in source**: Update the hardcoded values in `Blog.tsx` rather than introducing a data file or API call. The site's architecture is intentionally static with hardcoded content. This is a bugfix, not a refactor.

**Verify all 7 articles, not just the broken 5**: Even the 2 working URLs should be double-checked for title/description accuracy to ensure consistency.

## Risks / Trade-offs

- **[Articles may be edited/renamed on dev.to in the future]** → Accepted. All content is hardcoded by design; future changes require manual updates regardless.
- **[Descriptions are manually summarized, not pulled from dev.to]** → Write concise summaries that faithfully represent each article's content without copying verbatim.
