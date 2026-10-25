# echowaves.com

The personal site of Dmitry Amelchenko: agentic software engineering for engineering organizations — what changed in delivery, measured, and how it was made to stick. Open-source packages are listed as maintained code, not as the main subject.

Built with Astro (static output) plus one React island for the dev.to feed.

## Featured NPM Packages

### 🖼️ expo-cached-image
- **Version**: 54.0.7
- **Downloads**: 907/week
- **Stars**: 100
- Super fast cached image component for React Native applications powered by Expo
- [NPM](https://www.npmjs.com/package/expo-cached-image) | [GitHub](https://github.com/echowaves/expo-cached-image)

### 💾 expo-storage
- **Version**: 54.0.6
- **Downloads**: 599/week
- **Stars**: 14
- Simple way to store persistent data without size limitations of react-native async-storage
- [NPM](https://www.npmjs.com/package/expo-storage) | [GitHub](https://github.com/echowaves/expo-storage)

### 📐 expo-masonry-layout
- **Version**: 1.1.11
- **Downloads**: 8/week
- High-performance masonry layout component for React Native and Expo applications
- [NPM](https://www.npmjs.com/package/expo-masonry-layout) | [GitHub](https://github.com/echowaves/expo-masonry-layout)

## Key Projects

### WiSaw
A location-based photo sharing mobile app with anonymous posting features.
- **Stars**: 35 | **Forks**: 6
- [GitHub](https://github.com/echowaves/WiSaw)
- [iOS App](https://apps.apple.com/us/app/wisaw/id1299949122)
- [Android App](https://play.google.com/store/apps/details?id=com.echowaves.wisaw)

### echowaves.socialgroupchat
Social Group Chat platform built with Ruby on Rails
- **Stars**: 85 | **Forks**: 10
- [GitHub](https://github.com/echowaves/echowaves.socialgroupchat)

## Technologies Used

- Astro 7 (static output) with one React 19 island
- TypeScript
- Plain CSS with design tokens in `src/index.css`
- Responsive, single-column layout

## Content rules and verification

Two rules hold the site together: every figure names where it came from, and the vocabulary stays concrete (no hype words, no job titles, no employment date ranges — that is Dmitry's rule for this page).

- `src/data/site.ts` holds all copy and figures. Section components in `src/components/site/` render from it and carry no literal claims. Every claim has a non-empty `source`; wording still to be confirmed is flagged `needsReview`.
- `npm run verify` runs the checks in `scripts/verify-site.mjs`: claim sources, a fixture that must fail without one, registry parsing with a stubbed registry and with `ECHOWAVES_OFFLINE=1`, banned copy plus fixtures proving the ban works, and `/impact.json` parity with the built page. Each check prints `PASS <label>`; any failure exits non-zero, and pending `needsReview` items are listed.
- `npm run check` runs verification and then the build.
- `ECHOWAVES_OFFLINE=1 npm run build` succeeds without registry figures: the open source section says so instead of showing numbers.
- `/impact.json` serves the same content for machine readers, built from the module the page renders.

## Available Scripts

In the project directory, you can run:

| Command | What it does |
| --- | --- |
| `npm run dev` | Astro dev server at [http://localhost:4321](http://localhost:4321). |
| `npm run build` | Static build into `dist/`, including `/impact.json`. Fetches npm and GitHub figures at build time. |
| `npm run verify` | Content verification and edge-case matrix assertions. No dependencies, no test runner. |
| `npm run check` | `npm run verify` followed by `astro build`. |
| `npm run preview` | Serve the built site locally. |

Registry figures are fetched at build time (`src/utils/registry.ts`). Set `ECHOWAVES_OFFLINE=1` to skip the network and build without them.

## Dynamic Blog Feed

The Technical Blog section on the homepage pulls articles from the [dev.to API](https://forem.com/api-docs) for [dmitryame](https://dev.to/dmitryame):

- **At build time** (`src/pages/index.astro` + `src/utils/devto.ts`): the latest 7 articles (plus the pinned "classic" post) are fetched and pre-rendered into static HTML for SEO.
- **On page load** (`src/components/Blog.tsx`): the list silently refreshes against the API, so newly published articles appear without a redeploy. If the API is unreachable, the build-time snapshot stays.

To deploy the site (e.g. after publishing a new article, if you want it in the build-time snapshot):

```bash
npm run build
[deployment command removed]
[deployment command removed]
```

## Editing the site

Change copy and figures in `src/data/site.ts`, not in the components. Products (with their App Store and Play links) live in the `products` array there; the WiSaw architecture history rendered at `/wisaw` lives in `wisawStory` in the same module, and `src/pages/wisaw.astro` lays it out. Then run `npm run verify` — it rejects the vocabulary this page does not use, refuses a product that claims iOS without a store link, and tells you which claim lost its source. Layout lives in `src/index.css` (tokens, one column) and each section's own spacing in its `<style>` block.

- [Astro documentation](https://docs.astro.build/)
- [React documentation](https://react.dev/)

## Contact

- **Email**: dmitry@echowaves.com
- **Website**: [https://www.echowaves.com](https://www.echowaves.com)
- **GitHub**: [https://github.com/echowaves](https://github.com/echowaves)
- **LinkedIn**: [https://www.linkedin.com/in/dmitryame](https://www.linkedin.com/in/dmitryame)
- **Dev.to**: [https://dev.to/dmitryame](https://dev.to/dmitryame)

## License

This project is created to showcase Echowaves Corporation's work and contributions to the open-source community.

---

Built with Astro, React and TypeScript.
