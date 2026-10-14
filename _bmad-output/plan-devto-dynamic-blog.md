---
title: 'Dynamic dev.to blog feed'
type: 'feature'
ticket: ''
created: '2026-10-08'
status: 'built'
baseline_revision: 'aaf32f3f76815224a09a15355a4e8480746f1615'
route: 'oneshot'
route_source: 'auto'
risk: 'low'
review: 'quick'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The blog section hardcodes 7 articles and static stats ("31 posts / 19 comments / 7+ years"), so the site goes stale as soon as new articles are published to dev.to at dmitryame.

**Approach:** Fetch articles from the dev.to Articles API (`https://dev.to/api/articles?username=dmitryame&per_page=100`) both at build time (via `getServerSideProps`-equivalent Astro page props) and on component mount (client-side `client:load` refresh). Use the build-time snapshot for SEO/pre-rendered HTML; on first page visit, silently replace with the live list. Fall back to the built snapshot if the API is unreachable at runtime.

</frozen-after-approval>

## Code Map

- `src/components/Blog.tsx` -- existing hardcoded post list; will be rewritten to accept props and perform client-side refresh
- `src/pages/index.astro` -- includes Blog component; will pass build-time article data as props via `getStaticPaths`/`getServerSideProps` equivalent
- `src/utils/devto.ts` (new) -- API client: fetch user's articles, normalize response, compute stats (total posts, total comments, reaction count, years active)
- `src/components/Blog.css` -- minor tweak if needed for loading state / live indicator
- `README.md` -- document the build-time fetch and manual deploy process

## Implementation Notes

- dev.to API returns `reading_time_minutes` (not `reading_time`), `readable_publish_date` (e.g. "Oct 3"), `tag_list` (string), `tags` (string), `path` (e.g. `/dmitryame/...`)
- Article ID for the pinned "Classic" post: 84334 (slug: `minimalistic-architecture-for-minimalistic-product-ffd`)
- The pinned post stays in the top ~7 by recency anyway, so the pin logic can be: always include article ID 84334 in the top 7, regardless of date. The pinned "📌 CLASSIC" badge remains.
- If the API fails to load at build time (network, auth, rate limit), use a reasonable default: empty posts array with a clear "loading" state
- The blog stats ("31 posts") are hardcoded now; make them dynamic from the API response
- User has no auth token — use anonymous access only
- Deploy: build then push to S3 with the user's manual command; this feature does not require any infra changes

### Decisions made during implementation

- `tag_list` is actually a **string array** from the API (earlier probe misread the `tags` field). Interface typed `string[]`; `fetchAllArticles` normalizes to array anyway (handles both shapes).
- Build-time fetch runs via **top-level await in the `.astro` frontmatter** (Astro has no `getBuildProps`). Wrapped in try/catch so a network failure at build degrades to `blogData = null` → client-side load with skeleton.
- Client refresh runs **on every mount** (not only when build-time data is absent), per the user's "client-side refresh" choice. Build-time data renders instantly, refresh replaces it silently; on fetch failure the snapshot is kept (or empty-state if there was none).
- Blog stats block ("31 posts / 19 comments / 7+ years") removed with the hardcoded list — the "View All N Articles" button now shows the live total (41 currently) instead.
- Pinned post: latest 6 + pinned (ID 84334) appended with `pinned: true` → keeps the existing `📌 CLASSIC` badge via `.post-card.pinned::before`.
- CSS classes renamed from `blog-post-*` to `post-card*` + loading pulse keyframes + `.no-posts` empty state (kept existing card look).
- README: added "Dynamic Blog Feed" section documenting the two fetch phases and the S3/CloudFront deploy command.

### Surprises

- The working tree already contained unrelated uncommitted changes before this task (Astro 6→7 bump in package.json/lockfile, deletions of `openspec/`, `.agents/skills/caveman*`, `.github/prompts/`). Left untouched; commit covers only this feature's files.

## Plan Change Log

## Verification

- npm run build → successful build with build-time article data embedded
- npm run dev → local server shows live article list with fresh data from API
- API failure resilience → when the dev.to API returns 500 or is unreachable, the site falls back to the built snapshot or shows a loading state rather than crashing
- Pinned post → the 2019 "Minimalistic architecture" post (ID 84334) still appears at the bottom of the list with the "CLASSIC" pin badge