# Agent discovery formats

The shapes CAP-1..CAP-3 must produce. Derived from ARD spec v1.0 (mirrored by the `ai-catalog` npm package's published types) and llms.txt.org; verified against the site's own data in `src/data/site.ts`.

## Discovery files to emit

| Path | Content type | Purpose |
|---|---|---|
| `/llms.txt` | `text/markdown` | LLM-facing index of the site. Fixes audit 2. |
| `/.well-known/ard.json` | `application/ai-catalog+json` | The path Lighthouse's ARD audit probes. Fixes audit 1. |
| `/.well-known/ai-catalog.json` | `application/ai-catalog+json` | ARD v1.0 `WELL_KNOWN_PATH`, identical content to `ard.json`. |
| HTML `<link rel="ard" href="/.well-known/ard.json">` | — | Advertises the manifest from markup, the spec's second discovery route. Also add `rel="ai-catalog"`. |

Serving both well-known names is deliberate: Lighthouse's audit text names `ard.json`, the spec library names `ai-catalog.json`, and nothing here says which Google will keep. The IANA type `application/ai-catalog+json` is a SHOULD, not a MUST — if the manual deploy path cannot set it, the files must still be valid JSON, since that is what the audit parses.

## ARD catalog shape (spec v1.0)

Required at the document root: `specVersion` (`"1.0"`) and `entries[]` (may be empty). Each entry requires `identifier` and `type`, plus exactly one of `url` or `data`. Federated identifiers use `urn:air:{publisher}:{namespace}:{name}`, where publisher is a domain — here `echowaves.com`.

Known media types worth using: `application/ai-catalog+json`, `application/agent-card+json`, `application/a2a-agent-card+json`, `application/mcp-server-card+json`, `application/agent-skills+json`, `application/agent-skills+md`. Optional entry fields: `displayName`, `description`, `tags[]`, `version`, `updatedAt`, `publisher{identifier,displayName}`, `metadata`. Optional catalog field: `host{displayName,identifier,documentationUrl,logoUrl}`.

Illustrative entries — every URL below must come from `src/data/site.ts` (`packages[].npmPackage`, `packages[].repo`), never be typed by hand (CAP-3):

```json
{
  "specVersion": "1.0",
  "host": {
    "displayName": "Echowaves",
    "identifier": "echowaves.com",
    "documentationUrl": "https://echowaves.com/method/"
  },
  "entries": [
    {
      "identifier": "urn:air:echowaves.com:npm:expo-cached-image",
      "type": "text/html",
      "url": "https://www.npmjs.com/package/expo-cached-image",
      "displayName": "expo-cached-image",
      "description": "Caching image component for React Native and Expo.",
      "tags": ["react-native", "expo"],
      "publisher": { "identifier": "echowaves.com", "displayName": "Echowaves" }
    },
    {
      "identifier": "urn:air:echowaves.com:site:index",
      "type": "text/html",
      "url": "https://echowaves.com/",
      "displayName": "Echowaves — teams, collaboration, AI capacity"
    }
  ]
}
```

Which types are actually in scope (page links and package repos only, versus generated Markdown renditions that would need publishing first) is an open question in SPEC.md. Do not invent a `data:` payload or a type the site cannot back with a real artifact.

## llms.txt shape

llms.txt.org order, and both Lighthouse checks satisfied — at least one H1, at least one link:

```markdown
# Echowaves

> One-line summary of what the site is for, drawn from the existing meta description.

Optional detail paragraph.

## Pages

- [Method](https://echowaves.com/method/): how the work actually goes
- [Results](https://echowaves.com/results/): sourced delivery figures
- [Code](https://echowaves.com/code/): open source packages and registry figures

## Packages

- [expo-cached-image](https://www.npmjs.com/package/expo-cached-image)
```

Rules: titles and descriptions come from the same page metadata the HTML `<title>`/description use, so the file cannot disagree with the pages it lists; every listed path must exist in `dist/`. Whether `/wisaw` is listed or excluded as duplicate content is an open question in SPEC.md.

## Verification hooks (CAP-5)

`scripts/verify-site.mjs` already refuses unsourced claims and unverified built pages. Add to that gate: both well-known files exist in `dist/`, parse as JSON, satisfy the required-field rules above; `llms.txt` has an H1 and at least one link; every URL in either artifact resolves to a built page or a data-module URL; and no artifact is older than the source data it was generated from.
