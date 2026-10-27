// Content and build-integrity checks for echowaves.com. Run with `npm run verify`.
//
// Zero dependencies: Node's built-in test-free assertions plus dynamic imports of
// the TypeScript modules through Node's type stripping (Node >= 23.6). Each check
// prints `PASS <label>` so a green run is readable evidence, and any failure exits
// non-zero with the offending file, string or claim id.
//
// The copy rules below are the site's own: figures need sources, vocabulary stays
// concrete, and no job titles or employment date ranges appear anywhere (Dmitry's
// rule for this site). Scanned: src/data, src/pages, src/components/site.

import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const COPY_DIRS = [
  path.join(SRC, 'data'),
  path.join(SRC, 'pages'),
  path.join(SRC, 'components', 'site'),
];
const COPY_EXTENSIONS = ['.ts', '.astro'];

const BANNED_COPY = [
  { pattern: /leverag/i, label: 'hype: "leverage"' },
  { pattern: /cutting[- ]edge/i, label: 'hype: "cutting-edge"' },
  { pattern: /revolutionar/i, label: 'hype: "revolutionary"' },
  { pattern: /seamless/i, label: 'hype: "seamless"' },
  { pattern: /state[- ]of[- ]the[- ]art/i, label: 'hype: "state of the art"' },
  { pattern: /world[- ]class/i, label: 'hype: "world-class"' },
  { pattern: /best[- ]in[- ]class/i, label: 'hype: "best in class"' },
  { pattern: /\bempower/i, label: 'hype: "empower"' },
  { pattern: /\bdelv/i, label: 'hype: "delve"' },
  { pattern: /thought lead/i, label: 'self-description: "thought leader"' },
  { pattern: /AI transformation/i, label: 'category label: "AI transformation"' },
  { pattern: /verification system/i, label: 'abstraction: "verification system"' },
  { pattern: /\bunverifiable\b/i, label: 'meta-commentary about this page' },
  { pattern: /\bdossier\b/i, label: 'meta-commentary about this page' },
];

// Regional indicators live inside U+1F000–U+1FAFF, so they are not listed twice.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]|\u{FE0F}/u;

const JOB_TITLES =
  /\b(?:chief technology officer|chief technical officer|cto|vp of engineering|vice president of engineering|director of engineering|head of engineering|engineering manager|staff engineer|principal engineer|distinguished engineer)\b/i;

const EMPLOYMENT_RANGE = /\b(?:19\d{2}|20\d{2})\s*[–—-]\s*(?:19\d{2}|20\d{2}|present)\b/;

const results = [];

/** Thrown by a check that has nothing to prove yet — reported as SKIP, not PASS. */
class Skip extends Error {}

const skip = (reason) => {
  throw new Skip(reason);
};

async function check(label, fn) {
  try {
    const note = await fn();
    results.push({ label, ok: true });
    console.log(note ? `PASS ${label} — ${note}` : `PASS ${label}`);
    return note;
  } catch (error) {
    if (error instanceof Skip) {
      results.push({ label, ok: true, skipped: true });
      console.log(`SKIP ${label} — ${error.message}`);
      return null;
    }
    results.push({ label, ok: false });
    console.error(`FAIL ${label}\n     ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

/** Every built page, so a check can speak about the site rather than one route. */
function builtPages() {
  const dist = path.join(ROOT, 'dist');
  if (!existsSync(dist)) {
    skip('no dist/ build yet — run `npm run build`');
  }
  const pages = walk(dist, ['.html']);
  // A dist/ from before the current copy proves nothing about it.
  const stale = pages.filter(
    (page) => statSync(page).mtimeMs < statSync(path.join(SRC, 'data', 'site.ts')).mtimeMs
  );
  if (stale.length > 0) {
    skip('rebuild — dist/ predates src/data/site.ts');
  }
  return pages;
}

/** One string holding the markup of the whole built site. */
function builtMarkup() {
  return builtPages().map((page) => readFileSync(page, 'utf8')).join('\n');
}

/** Width and height from a PNG's IHDR chunk, without pulling in an image library. */
function pngSize(file) {
  const bytes = readFileSync(file);
  if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
    throw new Error(`${path.relative(ROOT, file)} is not a PNG`);
  }
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function walk(dir, extensions = COPY_EXTENSIONS) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(abs, extensions));
    } else if (extensions.includes(path.extname(entry.name))) {
      out.push(abs);
    }
  }
  return out;
}

// A section that reads a field nobody filled in renders an empty element: markup
// that says nothing at the exact spot where copy was promised. This caught a real
// paragraph built from wording that had since been deleted from the data module, so
// optional copy slots stay out of the model instead of being rendered conditionally.
const BLOCK_ELEMENT = /<(p|li|dd|dt|h1|h2|h3|ul|ol|blockquote)((?:\s[^>]*)?)>([\s\S]{0,200}?)<\/\1>/g;

function findEmptyBlocks(html) {
  const empty = [];
  for (const match of html.matchAll(BLOCK_ELEMENT)) {
    if (match[3].trim() === '') empty.push(`${match[1]}${match[2] || ''}`.slice(0, 60));
  }
  return empty;
}

/** Human-visible strings only: literals in data modules, text nodes in components. */
function copyStrings(file) {
  const source = readFileSync(file, 'utf8');
  const ext = path.extname(file);
  if (ext === '.ts') {
    const found = [];
    const pattern = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      const value = match[1] ?? match[2] ?? match[3] ?? '';
      if (value.trim().length > 0) found.push(value);
    }
    return found;
  }

  // Astro: drop frontmatter and styles, then keep text between tags.
  const template = source.replace(/^---[\s\S]*?---/, '').replace(/<style>[\s\S]*?<\/style>/g, '');
  const texts = [];
  for (const match of template.matchAll(/>([^<>{}]+)</g)) {
    const value = match[1].trim();
    if (value.length > 0) texts.push(value);
  }
  return texts;
}

function findCopyViolations(strings) {
  const violations = [];
  for (const value of strings) {
    for (const rule of BANNED_COPY) {
      if (rule.pattern.test(value)) violations.push(`${rule.label}: ${value.slice(0, 80)}`);
    }
    if (EMOJI.test(value)) violations.push(`emoji in copy: ${value.slice(0, 40)}`);
    if (JOB_TITLES.test(value)) violations.push(`job title in copy: ${value.slice(0, 60)}`);
    if (EMPLOYMENT_RANGE.test(value)) {
      violations.push(`employment date range in copy: ${value.slice(0, 60)}`);
    }
  }
  return violations;
}

// ---------------------------------------------------------------------------

// Node strips the types (Node >= 23.6), so the checks read the same modules the
// site imports rather than a copy of their contents.
const site = await import(pathToFileURL(path.join(SRC, 'data', 'site.ts')).href);
const registry = await import(pathToFileURL(path.join(SRC, 'utils', 'registry.ts')).href);
const themeRegistry = await import(pathToFileURL(path.join(SRC, 'data', 'themes.ts')).href);
const contrast = await import(pathToFileURL(path.join(ROOT, 'scripts', 'lib', 'contrast.mjs')).href);

const {
  CONTRAST_ROLES,
  FAVICON_SIZES,
  MODES,
  MODE_LABELS,
  SET_DEFAULT_LABELS,
  STORAGE_KEY,
  TOKEN_NAMES,
  defaultTheme,
  faviconHref,
  isHex,
  paintedModeLabel,
  themeById,
  themes,
  themesInGroup,
  themesRegionCss,
} = themeRegistry;
const { ratio } = contrast;

/** Sentinels of the generated palette region in src/index.css. */
const THEMES_BEGIN = '/* themes:begin';
const THEMES_END = '/* themes:end */';

/** The runtime BaseLayout writes into every page, found by the storage key it carries. */
function themeScriptSource(html) {
  for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
    if (match[1].includes('storageKey')) return match[1];
  }
  throw new Error('no theme runtime in the built markup');
}

/** The palette table the shipped runtime carries: ids, groups, labels and tab colours. */
function themePayload(markup) {
  const script = themeScriptSource(markup);
  const payload = /var P = (\{.*\});/.exec(script);
  if (!payload) throw new Error('the theme runtime carries no palette payload');
  return payload[1];
}

/**
 * The stub DOM both theme harnesses run the shipped runtime against. Deliberately not a browser:
 * resolution is arithmetic over localStorage and matchMedia, and running the code that actually
 * ships — rather than a copy of its logic — is what makes the result worth anything. What it does
 * model are the three things `apply()` writes: `data-theme`, the two theme-color tags, and the
 * favicon links — including the two it must leave alone, because a template that rewrote
 * `/favicon.ico` or the apple-touch tile would be just as broken as one that missed them.
 *
 * Options: `store` (what localStorage returns), `scheme`, `elements` (the control's elements),
 * `noMatchMedia` (a browser without it), `legacyListener` (matchMedia with only addListener) and
 * `storageThrows` (private mode refusing a write). Those three are the runtime's guarded error
 * paths, none of which may take the page down.
 */
function themeDom(script, options = {}) {
  const { store = null, scheme = 'light', elements = null } = options;
  const painted = [];
  const stored = {
    value: store === null ? null : typeof store === 'string' ? store : JSON.stringify(store),
  };
  const media = { matches: scheme === 'light', change: [] };

  // A node that records the attributes the runtime sets and answers getAttribute the way the DOM
  // does: an attribute that is not there reads as null, not undefined.
  const node = (fields) => ({
    ...fields,
    setAttribute(name, value) {
      this[name] = value;
    },
    getAttribute(name) {
      return this[name] === undefined ? null : String(this[name]);
    },
  });

  const metas = [node({ media: null }), node({ media: '(prefers-color-scheme: light)' })];
  const links = [
    node({ rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' }),
    node({ rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' }),
    // `[rel~="icon"]` matches this one, so only its missing `sizes` keeps the .ico container alone.
    node({ rel: 'shortcut icon', href: '/favicon.ico' }),
    // One word, so `[rel~="icon"]` does not match it and its 180px tile survives untouched.
    node({ rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }),
  ];

  const document = {
    readyState: 'complete',
    getElementById: (id) => elements?.[id] ?? null,
    addEventListener: () => {},
    querySelectorAll: (selector) => {
      if (selector === 'meta[name="theme-color"]') return metas;
      // `~=` is a word match against the space-separated list, not a substring match.
      if (selector === 'link[rel~="icon"]') {
        return links.filter((link) => link.rel.split(/\s+/).includes('icon'));
      }
      return [];
    },
    documentElement: {
      setAttribute: (name, value) => {
        if (name === 'data-theme') painted.push(value);
      },
    },
  };

  const windowHandlers = {};
  const window = {
    addEventListener: (type, handler) => {
      (windowHandlers[type] ??= []).push(handler);
    },
  };
  if (!options.noMatchMedia) {
    window.matchMedia = () => {
      const query = {
        // A getter, so setScheme below reaches the object the runtime is already holding.
        get matches() {
          return media.matches;
        },
        addListener: (handler) => media.change.push(handler),
      };
      // Legacy mode withholds the modern API altogether: that is what an old Safari hands out, and
      // the runtime has to fall back rather than silently stop following the OS.
      if (!options.legacyListener) {
        query.addEventListener = (type, handler) => {
          if (type === 'change') media.change.push(handler);
        };
      }
      return query;
    };
  }

  const localStorage = {
    getItem: () => stored.value,
    setItem: (key, value) => {
      if (options.storageThrows) throw new Error('QuotaExceededError: storage is blocked');
      if (key === STORAGE_KEY) stored.value = value;
    },
  };

  new Function('document', 'window', 'localStorage', script)(document, window, localStorage);

  return {
    painted,
    media,
    stored,
    windowHandlers,
    // The hrefs the runtime owns, keyed by the size attribute it read them from.
    favicons: () =>
      Object.fromEntries(
        links
          .filter((link) => /^[0-9]+x[0-9]+$/.test(String(link.sizes)) && link.rel.split(/\s+/).includes('icon'))
          .map((link) => [link.sizes, link.href])
      ),
    // Everything outside the per-theme pair, still pointing where the head put it.
    untouched: () =>
      Object.fromEntries(
        links.filter((link) => !/^icon$/.test(link.rel)).map((link) => [link.rel, link.href])
      ),
    tabColours: () => metas.map((meta) => meta.content),
  };
}

/**
 * Runs the shipped runtime against a stub DOM for each stored state and reports what it paints:
 * the palette, both tab colours and every favicon href it wrote.
 */
function resolveThemes(script, states) {
  return states.map((state) => {
    const dom = themeDom(script, state);
    return {
      ...state,
      theme: dom.painted[dom.painted.length - 1],
      tabColours: dom.tabColours(),
      favicons: dom.favicons(),
      untouched: dom.untouched(),
    };
  });
}

/**
 * The same runtime, wired: the stub hands it the control's five elements and a matchMedia it can
 * talk to, so a change event can be fired, an OS flip simulated and another tab's write delivered
 * — no browser. Everything the control promises — repaint, apply a set-default pick, persist,
 * re-sync its dynamic labels, follow the scheme live, notice a sibling tab — is exercised here
 * against the code that ships.
 */
function operateControl(script, choice, options = {}) {
  const element = (extra = {}) => ({
    value: '',
    hidden: false,
    handlers: {},
    addEventListener(type, handler) {
      this.handlers[type] = (this.handlers[type] ?? []).concat(handler);
    },
    fire(type) {
      (this.handlers[type] ?? []).forEach((handler) => handler());
    },
    ...extra,
  });
  const elements = {
    'theme-mode': element(),
    // The set-default groups arrive disabled — the markup's honest no-script state — and the
    // runtime's wiring is what enables them.
    'theme-set-light': element({ disabled: true }),
    'theme-set-dark': element({ disabled: true }),
    // The two options whose labels sync() rewrites to name the palettes their modes paint.
    'theme-mode-light': element(),
    'theme-mode-dark': element(),
  };
  const dom = themeDom(script, { store: choice ?? null, scheme: 'light', elements, ...options });

  return {
    painted: dom.painted,
    elements,
    choice: () => JSON.parse(dom.stored.value ?? '{}'),
    favicons: dom.favicons,
    untouched: dom.untouched,
    tabColours: dom.tabColours,
    select: (id, value) => {
      elements[id].value = value;
      elements[id].fire('change');
    },
    // What the OS flipping from light to dark does to a page that is already open.
    setScheme: (scheme) => {
      dom.media.matches = scheme === 'light';
      dom.media.change.forEach((handler) => handler());
    },
    // What another tab saving the preference does to this one: the shared store already holds the
    // new value by the time the event arrives, which is the whole point. Another key must be
    // ignored, and ignoring it means not repainting either.
    otherTabWrites: (value, key = STORAGE_KEY) => {
      if (key === STORAGE_KEY) dom.stored.value = value;
      (dom.windowHandlers.storage ?? []).forEach((handler) => handler({ key, newValue: value }));
    },
  };
}

await check('every claim carries a source', () => {
  const missing = site.claims.filter((claim) => !claim.source || claim.source.trim().length === 0);
  assert.equal(
    missing.length,
    0,
    `claims without a source: ${missing.map((claim) => claim.id).join(', ')}`
  );
  return `${site.claims.length} claims`;
});

await check('a claim without a source is rejected', () => {
  const broken = { id: 'fixture', metric: '1×', label: 'fixture', detail: 'fixture', source: '  ' };
  assert.ok(
    !broken.source.trim(),
    'fixture unexpectedly carried a source; the schema check has gone vacuous'
  );
  const missing = [...site.claims, broken].filter((claim) => !claim.source?.trim());
  assert.deepEqual(missing.map((claim) => claim.id), ['fixture']);
  return 'schema rule exercised against a fixture';
});

await check('registry figures parsed when the registries answer', async () => {
  const canned = {
    'api.npmjs.org': { downloads: 907 },
    'releases/latest': { published_at: '2026-09-01T00:00:00.000Z' },
    'registry.npmjs.org': { 'dist-tags': { latest: '1.0.0' }, time: { '1.0.0': '2026-08-01' } },
  };
  const fetchImpl = async (url) => {
    const key = Object.keys(canned).find((candidate) => url.includes(candidate));
    const body = key === 'releases/latest' ? canned['releases/latest'] : canned[key] ?? null;
    return body
      ? { ok: true, status: 200, json: async () => body }
      : url.includes('api.github.com')
        ? { ok: true, status: 200, json: async () => ({ stargazers_count: 103 }) }
        : { ok: false, status: 404, json: async () => ({}) };
  };

  const snapshot = await registry.collectRegistryStats([site.packages[0]], {
    env: {},
    fetchImpl,
    now: () => new Date('2026-10-17T00:00:00Z'),
  });

  assert.equal(snapshot.offline, false);
  assert.equal(snapshot.hasFigures, true);
  const stats = registry.statsFor(snapshot, site.packages[0].name);
  assert.equal(stats.weeklyDownloads, 907);
  assert.equal(stats.stars, 103);
  assert.match(String(stats.lastRelease), /^2026-09-01/);
  return 'downloads, stars and release date read from a stubbed registry';
});

await check('an offline build degrades to no figures', async () => {
  const snapshot = await registry.collectRegistryStats(site.packages, {
    env: { ECHOWAVES_OFFLINE: '1' },
    now: () => new Date('2026-10-17T00:00:00Z'),
  });
  assert.equal(snapshot.offline, true);
  assert.equal(snapshot.hasFigures, false);
  for (const stats of snapshot.packages) {
    assert.equal(stats.weeklyDownloads, null, `${stats.name} leaked a figure into an offline build`);
    assert.equal(stats.stars, null);
    assert.equal(stats.lastRelease, null);
  }

  const failing = await registry.collectRegistryStats(site.packages, {
    env: {},
    fetchImpl: async () => {
      throw new Error('network down');
    },
  });
  assert.equal(failing.hasFigures, false, 'a failed fetch must not fabricate a figure');
  return `${snapshot.packages.length} packages, no figures invented`;
});

/**
 * Products must be installable or readable, never advertised: every link is a
 * real https URL (or an internal page), and anything claiming iOS has a store link.
 */
function validateProducts(list) {
  const STORE_HOSTS = ['apps.apple.com', 'play.google.com'];
  const problems = [];
  for (const product of list) {
    if (product.links.length === 0) problems.push(`${product.id}: no links at all`);
    for (const link of product.links) {
      if (link.href.startsWith('/')) continue;
      let url;
      try {
        url = new URL(link.href);
      } catch {
        problems.push(`${product.id}: "${link.href}" is not a URL`);
        continue;
      }
      if (url.protocol !== 'https:') problems.push(`${product.id}: ${link.href} is not https`);
    }
    const onStore = product.links.some((link) => STORE_HOSTS.some((host) => link.href.includes(host)));
    if (product.kind.includes('iOS') && !onStore) {
      problems.push(`${product.id}: listed as iOS with no app store link`);
    }
  }
  return problems;
}

await check('site copy is free of hype, emoji, titles and date ranges', () => {
  const files = COPY_DIRS.flatMap((dir) => walk(dir));
  const violations = files.flatMap((file) =>
    findCopyViolations(copyStrings(file)).map((violation) => `${path.relative(ROOT, file)}: ${violation}`)
  );
  assert.equal(violations.length, 0, `\n     ${violations.join('\n     ')}`);
  return `${files.length} files scanned`;
});

await check('banned copy is detected', () => {
  const fixtures = [
    'We leverage cutting-edge tooling',
    '🚀 High Performance',
    'VP of Engineering at a company',
    '2019 – present',
    'a designer of verification systems',
    'nothing here is unverifiable',
  ];
  const missed = fixtures.filter((fixture) => findCopyViolations([fixture]).length === 0);
  assert.deepEqual(missed, [], `these banned strings slipped through: ${missed.join(' | ')}`);
  return `${fixtures.length} fixture strings all rejected`;
});

/** A product naming a store must link to that store; guessing one is worse than none. */
function platformLinksToConfirm(list) {
  const stores = [
    [/\biOS\b/i, 'apps.apple.com', 'App Store'],
    [/android/i, 'play.google.com', 'Google Play'],
  ];
  const missing = [];
  for (const product of list) {
    for (const [pattern, host, label] of stores) {
      const claims = pattern.test(product.kind);
      const linked = product.links.some((link) => link.href.includes(host));
      if (claims && !linked) missing.push(`${product.id}: advertises ${label} with no ${label} link`);
    }
  }
  return missing;
}

await check('every product has a real install or source link', () => {
  const problems = validateProducts(site.products);
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${site.products.length} products`;
});

await check('a product advertised as iOS without a store link is rejected', () => {
  const broken = [
    { id: 'fixture', name: 'Fixture', kind: 'iOS', summary: 'x', detail: 'x', links: [{ label: 'GitHub', href: 'https://github.com/echowaves/x' }] },
  ];
  assert.ok(
    validateProducts(broken).some((problem) => problem.includes('no app store link')),
    'the iOS-without-a-store-link rule has gone vacuous'
  );
  return 'fixture product rejected';
});

await check('every link in the WiSaw story resolves', () => {
  const paragraphs = [
    ...site.wisawStory.originBody,
    ...site.wisawStory.phases.map((phase) => phase.body),
    ...site.wisawStory.bugBody,
    ...site.wisawStory.aiPoints.map((point) => point.body),
  ];
  const hrefs = paragraphs.flatMap((html) => [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]));
  const bad = hrefs.filter((href) => !href.startsWith('/') && !/^https:\/\/[^\s"']+$/.test(href));
  assert.deepEqual(bad, [], `unusable hrefs in the story: ${bad.join(', ')}`);
  assert.ok(hrefs.length >= 8, `the story should cite its sources; found ${hrefs.length} links`);
  return `${hrefs.length} links across ${paragraphs.length} passages`;
});

await check('prose agrees with the rebuild list it summarises', () => {
  // "rebuilt four times" is prose standing in for wisawStory.phases. When a
  // rebuild is added or dropped the sentence silently becomes false, so the
  // number written in words has to match the array length.
  const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const sources = ['src/data/site.ts', 'src/pages/builds/wisaw.astro'];
  const spoken = [];
  for (const rel of sources) {
    const text = readFileSync(path.join(ROOT, rel), 'utf8');
    for (const match of text.matchAll(/rebuilt (\w+) times?/gi)) {
      spoken.push({ rel, word: match[1], value: WORDS[match[1].toLowerCase()] });
    }
  }
  assert.ok(spoken.length > 0, 'expected the WiSaw story to say how many times it was rebuilt');
  const unparseable = spoken.filter((entry) => entry.value === undefined);
  assert.deepEqual(unparseable, [], `unrecognised number words: ${unparseable.map((e) => `${e.rel}: "${e.word}"`).join(', ')}`);
  const expected = site.wisawStory.phases.length;
  const wrong = spoken.filter((entry) => entry.value !== expected);
  assert.deepEqual(
    wrong,
    [],
    `the copy says ${wrong.map((e) => `"rebuilt ${e.word} times"`).join(', ')} but wisawStory.phases lists ${expected}`,
  );
  return `${spoken.length} mentions agree with ${expected} rebuilds`;
});

await check('/impact.json matches the content the site renders', () => {
  const payload = site.buildImpactPayload();
  assert.deepEqual(
    payload.claims.map((claim) => claim.metric),
    site.claims.map((claim) => claim.metric),
    'payload metrics drifted from the claims module'
  );
  assert.equal(payload.asOf, site.asOf);

  const html = builtMarkup();
  // Compared as the markup holds it: a figure like `<1%` is written `&lt;1%`.
  const inMarkup = (value) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const absent = site.claims.filter((claim) => !html.includes(inMarkup(claim.metric)));
  assert.equal(absent.length, 0, `rendered pages missing figures: ${absent.map((c) => c.id).join(', ')}`);
  return `${payload.claims.length} claims identical in payload and rendered pages`;
});

await check('every tab leads to a built page', () => {
  const built = new Set(
    builtPages().map((page) => {
      const rel = path.relative(path.join(ROOT, 'dist'), page);
      const dir = rel === 'index.html' ? '/' : `/${rel.replace(/\/?index\.html$/, '/')}`;
      return dir;
    })
  );
  const missing = site.nav.filter((item) => !built.has(item.href));
  assert.deepEqual(missing.map((item) => `${item.label} -> ${item.href}`), [], 'tabs with no page');
  // A tab that renders nothing but the chrome would be a dead end. Every built page
  // is a real document now, so one without a main is itself a finding, not an exemption:
  // headless stubs are exactly what used to slip past these checks unexamined.
  const thin = [];
  for (const page of builtPages()) {
    const body = readFileSync(page, 'utf8').match(/<main id="main">([\s\S]*?)<\/main>/);
    if (!body) {
      thin.push(`${path.relative(ROOT, page)} (no main element)`);
      continue;
    }
    const text = body[1].replace(/<[^>]*>/g, '').trim();
    if (text.length < 80) thin.push(path.relative(ROOT, page));
  }
  assert.deepEqual(thin, [], `routes that render almost no content: ${thin.join(', ')}`);
  return `${site.nav.length} tabs resolve to built pages with content`;
});

await check('a platform claim without its store link is detected', () => {
  const fixture = [
    { id: 'ok', kind: 'iOS · Android', links: [{ href: 'https://apps.apple.com/x' }, { href: 'https://play.google.com/y' }] },
    { id: 'gap', kind: 'iOS · Android', links: [{ href: 'https://apps.apple.com/x' }] },
  ];
  const found = platformLinksToConfirm(fixture);
  assert.deepEqual(found, ['gap: advertises Google Play with no Google Play link'], `fixture slipped through: ${found}`);
  return 'fixture missing-store-link rejected';
});

await check('every built page renders the window chrome exactly once', () => {
  const problems = [];
  for (const page of builtPages()) {
    const html = readFileSync(page, 'utf8');
    const counts = {
      window: (html.match(/class="window"/g) ?? []).length,
      main: (html.match(/<main[ >]/g) ?? []).length,
      header: (html.match(/aria-label="Primary"/g) ?? []).length,
      skip: (html.match(/class="skip-link"/g) ?? []).length,
    };
    for (const [part, count] of Object.entries(counts)) {
      if (count !== 1) problems.push(`${path.relative(ROOT, page)}: ${count} ${part}`);
    }
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return 'one window, one main, one tab strip per page';
});

await check('styles speak only in tokens', () => {
  // DESIGN.md: "Every token has one home: src/index.css. Nothing else defines a
  // value." The aliases that used to live beside the tokens (--bg-primary,
  // --accent-blue, --text-secondary) were how a component could quietly disagree
  // with the palette, so they are gone and this check keeps them gone.
  const cssPath = path.join(SRC, 'index.css');
  const tokens = readFileSync(cssPath, 'utf8');
  const rootStart = tokens.indexOf(':root {');
  const rootBlock = tokens.slice(rootStart, tokens.indexOf('\n}', rootStart));
  const defined = new Set([...rootBlock.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  assert.ok(defined.size >= 15, `the token block looks truncated: ${defined.size} definitions`);

  const undeclared = [];
  const literals = [];
  const styleSources = walk(SRC, ['.css', '.astro', '.tsx']);
  for (const file of styleSources) {
    if (file === cssPath) continue;
    const text = readFileSync(file, 'utf8');
    // Only declarations are scanned. An .astro head may legitimately name a colour
    // because a meta tag cannot read a variable.
    // The React islands carry no <style> block of their own; they style through the
    // .css files above, so scanning them whole catches an inline colour before it lands.
    const blocks =
      path.extname(file) !== '.astro'
        ? [{ where: file, body: text }]
        : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({
            where: `${file} <style>`,
            body: m[1],
          }));
    for (const block of blocks) {
      // A comment cannot style anything, so a hex written there is documentation.
      const body = block.body.replace(/\/\*[\s\S]*?\*\//g, '');
      for (const match of body.matchAll(/var\((--[a-z0-9-]+)/g)) {
        if (!defined.has(match[1])) {
          undeclared.push(`${path.relative(ROOT, block.where)}: var(${match[1]})`);
        }
      }
      for (const match of body.matchAll(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g)) {
        literals.push(`${path.relative(ROOT, block.where)}: ${match[0]}`);
      }
    }
  }
  assert.deepEqual(undeclared, [], `used but never defined in src/index.css:\n     ${undeclared.join('\n     ')}`);
  assert.deepEqual(literals, [], `colour written outside the token block:\n     ${literals.join('\n     ')}`);

  // The palette blocks live in this same file and declare no new names, so the set above is
  // still the whole vocabulary. Their contents are the next check's business.
  //
  // The values beside those names are this check's business, though: `:root` is hand-written, and
  // it is what a reader with no script and a dark scheme gets. Editing a hex in the registry and
  // forgetting this block would leave the no-script palette quietly disagreeing with every palette
  // block generated beside it, so compare them token by token instead of trusting the comment.
  const noScript = defaultTheme('dark');
  for (const token of TOKEN_NAMES) {
    assert.ok(defined.has(`--${token}`), `--${token} is in the registry but not in :root`);
    const declared = new RegExp(`--${token}:\\s*(#[0-9a-f]{6})\\s*;`).exec(rootBlock);
    assert.ok(declared, `:root does not declare --${token} as a #rrggbb value`);
    assert.equal(
      declared[1],
      noScript.tokens[token],
      `:root --${token} is ${declared[1]}, but the no-script palette (${noScript.id}) says ${noScript.tokens[token]} — update src/index.css from src/data/themes.ts`
    );
  }

  return `${defined.size} tokens declared; ${styleSources.length} style sources read only tokens`;
});

// ---------------------------------------------------------------------------
// Themes. src/data/themes.ts is the source of truth; these four checks are what stops the
// stylesheet, the head, the control and the icon set from drifting away from it.

await check('every palette in the registry ships its CSS block', () => {
  const css = readFileSync(path.join(SRC, 'index.css'), 'utf8');
  const start = css.indexOf(THEMES_BEGIN);
  const finish = css.indexOf(THEMES_END);
  assert.ok(start !== -1 && finish > start, 'index.css is missing the generated themes region');
  const region = css.slice(start, finish + THEMES_END.length);
  assert.equal(
    region,
    themesRegionCss(),
    'the themes region in src/index.css is stale — run `node scripts/make-themes.mjs`'
  );

  const problems = [];
  for (const theme of themes) {
    const block = new RegExp(`html\\[data-theme="${theme.id}"\\] \\{([\\s\\S]*?)\\n\\}`).exec(css);
    if (!block) {
      problems.push(`${theme.id}: no html[data-theme="${theme.id}"] block`);
      continue;
    }
    if (!block[1].includes(`color-scheme: ${theme.group};`)) {
      problems.push(`${theme.id}: color-scheme is not ${theme.group}`);
    }
    for (const token of TOKEN_NAMES) {
      const declared = new RegExp(`--${token}: (#[0-9a-f]{6});`).exec(block[1]);
      if (!declared) problems.push(`${theme.id}: --${token} missing`);
      else if (declared[1] !== theme.tokens[token]) {
        problems.push(`${theme.id}: --${token} is ${declared[1]}, registry says ${theme.tokens[token]}`);
      }
    }
  }

  // With no script there is no data-theme, so the light default has to arrive from the media
  // query; the dark default is what :root already declares.
  const light = defaultTheme('light');
  const fallback = new RegExp(
    `@media \\(prefers-color-scheme: light\\) \\{\\s*html:not\\(\\[data-theme\\]\\) \\{([\\s\\S]*?)\\n  \\}`
  ).exec(css);
  assert.ok(fallback, 'index.css has no prefers-color-scheme fallback for readers without scripts');
  for (const token of TOKEN_NAMES) {
    const declared = new RegExp(`--${token}: (#[0-9a-f]{6});`).exec(fallback[1]);
    if (!declared || declared[1] !== light.tokens[token]) {
      problems.push(`no-script fallback: --${token} is not ${light.id}'s value`);
    }
  }

  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${themes.length} palettes generated from src/data/themes.ts, plus the no-script default`;
});

await check('every palette declares the full token set and stays legible', () => {
  const ids = themes.map((theme) => theme.id);
  assert.equal(new Set(ids).size, ids.length, `duplicate theme ids: ${ids.join(', ')}`);
  for (const group of ['light', 'dark']) {
    const defaults = themesInGroup(group).filter((theme) => theme.isDefault);
    assert.equal(defaults.length, 1, `the ${group} group needs exactly one default, found ${defaults.length}`);
  }

  const problems = [];
  for (const theme of themes) {
    for (const token of TOKEN_NAMES) {
      const value = theme.tokens[token];
      if (!isHex(value)) problems.push(`${theme.id}: --${token} is "${value}", not #rrggbb`);
    }
    for (const role of CONTRAST_ROLES) {
      const measured = ratio(theme.tokens[role.token], theme.tokens[role.against]);
      // Every palette — this site's or a guest's — carries AA on the text roles: sub-AA text is
      // how Dracula shipped invisible body copy. A guest hex below 4.5 nudges in lightness, never
      // hue, and records the move in `source`. Rules are exempt unless the palette was tuned here,
      // because a light palette publishes pale rules on purpose and they carry no text.
      const required = role.token === 'border' && !theme.measured ? 0 : role.aa;
      if (measured < required) {
        problems.push(
          `${theme.id}: --${role.token} on --${role.against} is ${measured}:1, needs ${required}:1`
        );
      }
    }
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return 'every palette clears AA on every text role; pale guest rules are a palette being itself, not a failure';
});

await check('print and forced colours still outrank every palette', () => {
  const css = readFileSync(path.join(SRC, 'index.css'), 'utf8');
  const problems = [];
  for (const media of ['@media print', '@media (forced-colors: active)']) {
    const start = css.indexOf(media);
    assert.ok(start !== -1, `index.css has no ${media} block`);
    let depth = 0;
    let end = start;
    for (let i = css.indexOf('{', start); i < css.length; i += 1) {
      if (css[i] === '{') depth += 1;
      if (css[i] === '}') depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
    const block = css.slice(start, end);
    // A palette is html[data-theme="…"]: specificity (0,1,1). `:root` would lose to it, and the
    // media blocks must win whatever the reader picked.
    if (!block.includes(':root:root')) problems.push(`${media} no longer overrides a data-theme block`);
    if (/[^:]:(?!root)[a-z-]+ \{/.test(block)) problems.push(`${media} lost its :root override`);
    // Paper and forced-colours cannot inherit from a screen palette: every colour token has to
    // be redeclared or the theme bleeds through.
    for (const token of TOKEN_NAMES) {
      if (!block.includes(`--${token}:`)) problems.push(`${media} leaves --${token} to the active palette`);
    }
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return 'both media blocks out-rank a palette and redeclare all twelve colour tokens';
});

await check('the head paints the active palette', () => {
  // theme-color is the one place a colour has to stay a literal, so make sure it still matches
  // the ground of the palette a browser with scripts disabled gets — the dark default — and that
  // the runtime in the head knows every palette, including its tab colour.
  const payload = JSON.parse(themePayload(builtMarkup()));
  assert.deepEqual(
    payload.themes.map((theme) => theme.id).sort(),
    themes.map((theme) => theme.id).sort(),
    'the theme runtime does not know every palette in the registry'
  );
  for (const theme of themes) {
    const shipped = payload.themes.find((entry) => entry.id === theme.id);
    assert.equal(shipped.bg, theme.tokens.background, `${theme.id}: tab colour disagrees with --background`);
    // The dynamic option labels ("Light — Solarized Light") are rewritten from these labels, so
    // the runtime has to carry the registry's own words for each palette, not a second copy.
    assert.equal(shipped.label, theme.label, `${theme.id}: label disagrees with the registry`);
  }
  assert.deepEqual(payload.modeLabels, MODE_LABELS, 'the runtime carries mode labels the registry does not');
  // The runtime resolves any mode missing from this list to `system` — that is how a stored
  // `custom` migrates — so the payload's list has to be exactly the registry's.
  assert.deepEqual(payload.modes, MODES, 'the runtime resolves a different set of modes than the registry defines');
  assert.equal(payload.defaults.dark, defaultTheme('dark').id, 'wrong dark default');
  assert.equal(payload.defaults.light, defaultTheme('light').id, 'wrong light default');
  // The hrefs the runtime writes come from these templates, so they have to be the writer's own.
  for (const px of FAVICON_SIZES) {
    assert.equal(
      payload.faviconTemplates[String(px)],
      faviconHref('{id}', px),
      `the runtime's ${px}px favicon template is not the one npm run icons writes`
    );
  }

  const problems = [];
  for (const page of builtPages()) {
    const html = readFileSync(page, 'utf8');
    // Exactly the pair BaseLayout ships: an unqualified tag carrying the dark default's ground and
    // a `(prefers-color-scheme: light)` one carrying the light default's. That is what makes the
    // tab colour right for a reader with scripts off, where the media query picks the palette; the
    // runtime then overwrites both, so a third tag could only ever be stale.
    const meta = [...html.matchAll(/<meta name="theme-color"((?:[^>"]|"[^"]*")*)>/g)];
    if (meta.length !== 2) {
      problems.push(`${path.relative(ROOT, page)}: ${meta.length} theme-color tags, expected the scheme pair`);
    } else {
      const wanted = {
        '': defaultTheme('dark').tokens.background,
        '(prefers-color-scheme: light)': defaultTheme('light').tokens.background,
      };
      const seen = [];
      for (const [, attributes] of meta) {
        const media = /media="([^"]*)"/.exec(attributes)?.[1] ?? '';
        const content = /content="([^"]*)"/.exec(attributes)?.[1] ?? '';
        seen.push(media || '(none)');
        if (!(media in wanted)) problems.push(`${path.relative(ROOT, page)}: theme-color media="${media}" is not the pair`);
        else if (content !== wanted[media]) {
          problems.push(
            `${path.relative(ROOT, page)}: theme-color for ${media || 'no media'} is ${content}, not ${wanted[media]}`
          );
        }
      }
      if (new Set(seen).size !== seen.length) {
        problems.push(`${path.relative(ROOT, page)}: two theme-color tags share a media query (${seen.join(', ')})`);
      }
    }
    const scripts = html.match(/data-theme/g) ?? [];
    if (scripts.length === 0) problems.push(`${path.relative(ROOT, page)}: no theme runtime in the head`);
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${payload.themes.length} palettes wired into every page; tab colour starts at the two scheme grounds`;
});

await check('the theme control offers every palette and makes no claim without scripts', () => {
  const problems = [];
  for (const page of builtPages()) {
    const html = readFileSync(page, 'utf8');
    const where = path.relative(ROOT, page);
    // One dynamic select replaced the mode select and the two custom pins: one control, one
    // keyboard stop, and nothing left of the retired trio.
    const selects = [...html.matchAll(/<select\b/g)];
    if (selects.length !== 1) {
      problems.push(`${where}: ${selects.length} selects, expected the one theme control`);
    }
    for (const gone of ['theme-pair', 'theme-light', 'theme-dark']) {
      if (html.includes(`id="${gone}"`)) problems.push(`${where}: #${gone} survived the unified dropdown`);
    }
    // The four ids beyond the select itself that the runtime resolves by getElementById. Delete
    // one and no other check would notice: the groups stay dead, or the dynamic labels stop
    // following the pins — silent behaviour loss behind green markup.
    for (const id of ['theme-set-light', 'theme-set-dark', 'theme-mode-light', 'theme-mode-dark']) {
      if (!html.includes(`id="${id}"`)) problems.push(`${where}: no #${id} for the runtime to wire`);
    }
    if (!/<label[^>]*for="theme-mode"/.test(html)) problems.push(`${where}: #theme-mode has no label of its own`);
    const controls = [...html.matchAll(/<select[^>]*id="theme-mode"[^>]*>([\s\S]*?)<\/select>/g)];
    if (controls.length !== 1) {
      problems.push(`${where}: ${controls.length} theme controls`);
      continue;
    }
    const body = controls[0][1];
    for (const mode of MODES) {
      if (!body.includes(`value="${mode}"`)) problems.push(`${where}: no ${mode} option`);
    }
    // The handler resolves a value as a mode before it resolves one as a palette. That order is
    // only meaningful while the registry keeps them disjoint: a palette named `light` would make
    // its own id unreachable as a pick, and `system` unpinnable.
    for (const theme of themes) {
      if (MODES.includes(theme.id)) problems.push(`${where}: palette ${theme.id} collides with a mode value`);
    }
    // A retired value never comes back: `custom` left the model on 2026-10-27, and an option
    // carrying it would be resolved as garbage by today's runtime.
    if (/<option[^>]*value="custom"/.test(body)) problems.push(`${where}: a custom option survived the unified dropdown`);
    // Without scripts nothing overwrites the select, so the markup has to claim `system` — the
    // one choice that is true whatever the OS says. A default of "Light" would be a lie about a
    // palette the media query may not be painting at all.
    if (!/<option value="system"[^>]*selected/.test(body)) {
      problems.push(`${where}: the theme select does not offer system as its fallback`);
    }
    // The two dynamic labels state what their modes paint, and before anything is stored that
    // is each group's default — rendered through the registry's own helper, so markup, runtime
    // and this guard share one format.
    const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    for (const group of ['light', 'dark']) {
      const painted = paintedModeLabel(group, defaultTheme(group));
      if (!text.includes(painted)) problems.push(`${where}: the ${group} mode option does not read "${painted}"`);
    }
    // Both set-default sections are disabled in the markup: without a runtime those options are
    // dead, and a native select offering dead options is a trap. The runtime enables them when it
    // wires up, which is the only moment their claim becomes true.
    const groups = [...body.matchAll(/<optgroup\b([^>]*)>([\s\S]*?)<\/optgroup>/g)];
    if (groups.length !== 2) problems.push(`${where}: ${groups.length} set-default groups, expected two`);
    for (const [, attrs] of groups) {
      if (!/\bdisabled\b/.test(attrs)) problems.push(`${where}: a set-default group is enabled in the markup: <optgroup${attrs}>`);
    }
    // Each group holds exactly its own palettes, in registry order — a dark palette listed under
    // "Set light default" would offer a pick the runtime's pinned() has to refuse.
    for (const group of ['light', 'dark']) {
      const label = SET_DEFAULT_LABELS[group];
      const match = groups.find(([, attrs]) => attrs.includes(`label="${label}"`));
      if (!match) {
        problems.push(`${where}: no "${label}" group`);
        continue;
      }
      const listed = [...match[2].matchAll(/<option[^>]*value="([^"]+)"/g)].map((m) => m[1]);
      const wanted = themesInGroup(group).map((theme) => theme.id);
      if (listed.join(',') !== wanted.join(',')) {
        problems.push(`${where}: "${label}" lists ${listed.join(', ') || '(nobody)'}, expected ${wanted.join(', ')}`);
      }
    }
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `one select, ${MODES.length} modes and ${themes.length} palettes in two disabled set-default groups on every page`;
});

await check('the theme script resolves every stored preference', () => {
  // The runtime is the only script the site writes itself, so its decisions are worth exercising:
  // first visit, both schemes, a corrupt store, an unknown id and a legacy custom pair. Run
  // against stubs rather than a browser — this is resolution logic, not layout.
  const html = readFileSync(builtPages()[0], 'utf8');
  const script = themeScriptSource(html);
  const outcomes = resolveThemes(script, [
    { label: 'first visit, OS light', store: null, scheme: 'light' },
    { label: 'first visit, OS dark', store: null, scheme: 'dark' },
    { label: 'mode light', store: { mode: 'light' }, scheme: 'dark' },
    { label: 'mode dark', store: { mode: 'dark' }, scheme: 'light' },
    // The migration state: `custom` was retired on 2026-10-27, and a reader who left it stored
    // must see exactly what custom painted — the OS followed between those two pins.
    { label: 'legacy custom pair, OS light', store: { mode: 'custom', light: 'solarized-light', dark: 'dracula' }, scheme: 'light' },
    { label: 'legacy custom pair, OS dark', store: { mode: 'custom', light: 'solarized-light', dark: 'dracula' }, scheme: 'dark' },
    // Half a legacy store is still just an ordinary system state: missing pins default, and a
    // pin from the wrong group is refused exactly like an unknown id would be.
    { label: 'legacy custom without pins', store: { mode: 'custom' }, scheme: 'dark' },
    { label: 'legacy custom cross-group pin', store: { mode: 'custom', light: 'dracula' }, scheme: 'light' },
    { label: 'unknown id is ignored', store: { mode: 'system', light: 'not-a-theme', dark: 'nord' }, scheme: 'light' },
    { label: 'corrupt json falls back to system', store: '{{{', scheme: 'dark' },
    { label: 'garbage mode is ignored', store: { mode: 'hot-pink' }, scheme: 'light' },
    // One pair of palettes, shared by every mode: a stored light pin is what `system` paints when
    // the OS is in light scheme, exactly as it is what `light` paints whatever the OS says.
    { label: 'a stored pin survives a bad mode', store: { mode: 'hot-pink', light: 'one-light' }, scheme: 'light' },
    // The guarded error paths. A browser with no matchMedia cannot follow the OS, so it settles on
    // the dark default; an old one whose query object only answers to addListener still resolves.
    { label: 'no matchMedia at all', store: null, scheme: 'light', noMatchMedia: true },
    { label: 'legacy matchMedia', store: { mode: 'system' }, scheme: 'dark', legacyListener: true },
  ]);
  const expected = {
    'first visit, OS light': defaultTheme('light').id,
    'first visit, OS dark': defaultTheme('dark').id,
    'mode light': defaultTheme('light').id,
    'mode dark': defaultTheme('dark').id,
    'legacy custom pair, OS light': 'solarized-light',
    'legacy custom pair, OS dark': 'dracula',
    'legacy custom without pins': defaultTheme('dark').id,
    'legacy custom cross-group pin': defaultTheme('light').id,
    'unknown id is ignored': defaultTheme('light').id,
    'corrupt json falls back to system': defaultTheme('dark').id,
    'garbage mode is ignored': defaultTheme('light').id,
    'a stored pin survives a bad mode': 'one-light',
    'no matchMedia at all': defaultTheme('dark').id,
    'legacy matchMedia': defaultTheme('dark').id,
  };
  const problems = [];
  for (const outcome of outcomes) {
    const wanted = expected[outcome.label];
    const ground = themeById(wanted).tokens.background;
    if (outcome.theme !== wanted) {
      problems.push(`${outcome.label}: got ${outcome.theme}, expected ${wanted}`);
      continue;
    }
    // Both theme-color tags are repainted: the browser picks one by scheme, and after a deliberate
    // choice that choice outranks the scheme, so a stale second tag would paint the wrong tab.
    const stale = outcome.tabColours.filter((content) => content !== ground);
    if (stale.length > 0) {
      problems.push(`${outcome.label}: theme-color tags ${outcome.tabColours.join(', ')}, not ${ground} twice`);
    }
    // The favicon names are the ones `npm run icons` wrote, from the registry's own template. A
    // runtime that builds a prettier string than the writer does is a 404 nobody sees.
    for (const [sizes, href] of Object.entries(outcome.favicons)) {
      const wantedHref = faviconHref(wanted, Number(sizes.split('x')[0]));
      if (href !== wantedHref) problems.push(`${outcome.label}: the ${sizes} icon is ${href}, not ${wantedHref}`);
    }
    for (const [rel, href] of Object.entries(outcome.untouched)) {
      const keep = rel === 'shortcut icon' ? '/favicon.ico' : '/apple-touch-icon.png';
      if (href !== keep) problems.push(`${outcome.label}: ${rel} was rewritten to ${href}`);
    }
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${outcomes.length} stored states resolve to the right palette, tab colour and favicon pair`;
});

await check('the control repaints, persists and follows the OS live', () => {
  const script = themeScriptSource(readFileSync(builtPages()[0], 'utf8'));
  const light = defaultTheme('light').id;
  const dark = defaultTheme('dark').id;
  const page = operateControl(script); // starts in the light scheme with nothing stored

  const problems = [];
  const expect = (label, ok) => {
    if (!ok) problems.push(label);
  };
  const last = (target = page) => target.painted[target.painted.length - 1];
  const labelOf = (group, target = page) => target.elements[`theme-mode-${group}`].textContent;

  expect(`first paint is ${last()}, not the light default in the light scheme`, last() === light);
  expect('the select did not read system', page.elements['theme-mode'].value === 'system');
  // The groups ship disabled — the markup's honest no-script state — and wiring up is what earns
  // them a click. The dynamic labels start by naming each group's default palette.
  expect('the set-light group was not enabled by wiring', page.elements['theme-set-light'].disabled === false);
  expect('the set-dark group was not enabled by wiring', page.elements['theme-set-dark'].disabled === false);
  expect(`the light option reads "${labelOf('light')}"`, labelOf('light') === paintedModeLabel('light', defaultTheme('light')));

  // A pick from "set light default" applies immediately: the palette is pinned and stored, the
  // mode flips to its group so the choice visibly works, and the select re-displays the result.
  page.select('theme-mode', 'solarized-light');
  expect('the pick was not pinned as the light default', page.choice().light === 'solarized-light');
  expect(`the pick did not paint its palette (${last()})`, last() === 'solarized-light');
  expect(`the select still reads ${page.elements['theme-mode'].value}`, page.elements['theme-mode'].value === 'light');
  expect(`the light label reads "${labelOf('light')}"`, labelOf('light') === paintedModeLabel('light', themeById('solarized-light')));

  // Same from the dark group — and an explicit Dark paints its pin even while the OS says light.
  page.select('theme-mode', 'dracula');
  expect('the pick was not pinned as the dark default', page.choice().dark === 'dracula');
  expect(`the pick did not paint its palette (${last()})`, last() === 'dracula');
  expect(`the dark label reads "${labelOf('dark')}"`, labelOf('dark') === paintedModeLabel('dark', themeById('dracula')));
  expect('the mode was not persisted', page.choice().mode === 'dark');

  // System switches between the pinned pair — never the group defaults — as the OS flips. The
  // acceptance criterion, end to end, on an open page.
  page.select('theme-mode', 'system');
  expect(`system did not honour the light pin (${last()})`, last() === 'solarized-light');
  page.setScheme('dark');
  expect(`the dark scheme did not pick up the pinned Dracula (${last()})`, last() === 'dracula');
  page.setScheme('light');
  expect(`the light scheme did not come back to the pinned Solarized Light (${last()})`, last() === 'solarized-light');
  // End on dark so the head assertions below read Dracula's tab colour and favicons.
  page.setScheme('dark');

  // Every repaint above wrote the head, so this is where the runtime's own output is worth reading:
  // two tab colours carrying Dracula, and the two favicon links pointing at the files
  // `npm run icons` actually generated. A template that builds a tidier name than the writer does
  // asks the browser for a file nobody made, which no other check would notice.
  const ground = themeById('dracula').tokens.background;
  expect(`the tab colour pair reads ${page.tabColours().join(', ')}`, page.tabColours().every((c) => c === ground));
  const icons = page.favicons();
  for (const px of [16, 32]) {
    const sizes = `${px}x${px}`;
    const wanted = faviconHref('dracula', px);
    expect(`the ${sizes} link reads ${icons[sizes]}, not the ${wanted} npm run icons writes`, icons[sizes] === wanted);
  }
  for (const [rel, href] of Object.entries(page.untouched())) {
    const keep = rel === 'shortcut icon' ? '/favicon.ico' : '/apple-touch-icon.png';
    expect(`${rel} was rewritten to ${href}`, href === keep);
  }

  // Another tab saves a preference: this page re-reads the store and repaints, control included
  // — value and both dynamic labels, since the new store carries no pins and defaults them.
  page.otherTabWrites(JSON.stringify({ mode: 'light' }));
  expect(`another tab's choice did not repaint this page (${last()})`, last() === light);
  expect('the mode select did not follow the other tab', page.elements['theme-mode'].value === 'light');
  expect(`the light label did not re-sync ("${labelOf('light')}")`, labelOf('light') === paintedModeLabel('light', defaultTheme('light')));
  expect(`the dark label did not re-sync ("${labelOf('dark')}")`, labelOf('dark') === paintedModeLabel('dark', defaultTheme('dark')));

  // A write to somebody else's key is not our business, and must not repaint anything.
  const paints = page.painted.length;
  page.otherTabWrites('{}', 'some-other-key');
  expect('an unrelated storage event repainted the page', page.painted.length === paints);

  // Reload honours what was just written: same script, storage as the first page left it.
  const reopened = operateControl(script, page.choice());
  expect(`a stored light mode painted ${last(reopened)} in the light scheme`, last(reopened) === light);

  // A reader who left "custom" stored (retired 2026-10-27) sees exactly what custom painted —
  // the OS followed between those pins — and the first deliberate change rewrites the store with
  // a mode that still exists, pins kept.
  const migrated = operateControl(script, { mode: 'custom', light: 'solarized-light', dark: 'dracula' });
  expect(`legacy custom did not follow the light scheme to its pin (${last(migrated)})`, last(migrated) === 'solarized-light');
  // The dynamic labels name what System paints here: the stored pair, not the group defaults.
  expect(`the migrated light label reads "${labelOf('light', migrated)}"`,
    labelOf('light', migrated) === paintedModeLabel('light', themeById('solarized-light')));
  expect(`the migrated dark label reads "${labelOf('dark', migrated)}"`,
    labelOf('dark', migrated) === paintedModeLabel('dark', themeById('dracula')));
  migrated.setScheme('dark');
  expect(`legacy custom did not follow the OS to its dark pin (${last(migrated)})`, last(migrated) === 'dracula');
  migrated.setScheme('light');
  expect(`legacy custom did not follow the OS back to its light pin (${last(migrated)})`, last(migrated) === 'solarized-light');
  migrated.setScheme('dark');
  migrated.select('theme-mode', 'dark');
  const rewritten = migrated.choice();
  expect(`the store still says ${JSON.stringify(rewritten)}`, rewritten.mode === 'dark' && rewritten.light === 'solarized-light' && rewritten.dark === 'dracula');

  // Half a legacy store behaves like the whole thing: a missing pin falls back to its group's
  // default, and a pin stored under the wrong group is refused rather than painted cross-wise.
  const partial = operateControl(script, { mode: 'custom' });
  expect(`legacy custom with no pins did not paint the light default (${last(partial)})`, last(partial) === light);
  partial.setScheme('dark');
  expect(`legacy custom with no pins did not follow the OS to the dark default (${last(partial)})`, last(partial) === dark);

  const crossGroup = operateControl(script, { mode: 'custom', light: 'dracula' });
  expect(`a cross-group light pin was painted (${last(crossGroup)})`, last(crossGroup) === light);
  crossGroup.setScheme('dark');
  expect(`a cross-group pin leaked into the dark scheme (${last(crossGroup)})`, last(crossGroup) === dark);

  // Old Safari hands out a matchMedia with only addListener. Following the OS is then the whole
  // difference between a page that tracks the scheme and one that stopped caring.
  const legacy = operateControl(script, { mode: 'system' }, { legacyListener: true });
  expect(`legacy matchMedia painted ${last(legacy)}`, last(legacy) === light);
  legacy.setScheme('dark');
  expect('legacy matchMedia did not follow the OS', last(legacy) === dark);

  // Private mode refuses the write. The choice still applies to this page; only its memory fails.
  const blocked = operateControl(script, undefined, { storageThrows: true });
  blocked.select('theme-mode', 'dark');
  expect(`a store that throws stopped the repaint (${last(blocked)})`, last(blocked) === dark);
  expect('a blocked store was somehow written', Object.keys(blocked.choice()).length === 0);

  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${page.painted.length} repaints, apply-on-pick, label re-sync, a legacy custom migration, OS flips, another tab's write and two broken browsers, all from the shipped runtime`;
});

await check('type and rhythm come from the scale', () => {
  // The colour rule above stops a hex appearing twice; this one stops a size or a
  // padding appearing once too often. Six type steps and nine rhythm steps exist so
  // that "roughly 13px" cannot silently become an eighteenth font size again.
  const SPACE_DECL = /(?<![\w-])(padding|margin|gap|row-gap|column-gap)(?:-(?:top|right|bottom|left|block|inline)(?:-(?:start|end))?)?\s*:\s*([^;{}]+);/g;
  const FS_DECL = /(?<![\w-])font-size\s*:\s*([^;!{}]+);/g;
  const UNIT = /\b\d+(?:\.\d+)?(?:px|rem)\b/g;

  const offenders = [];
  for (const file of walk(SRC, ['.css', '.astro'])) {
    if (file === path.join(SRC, 'index.css')) continue; // the scale itself lives here
    const text = readFileSync(file, 'utf8');
    const bodies = path.extname(file) === '.css'
      ? [text]
      : [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
    for (const raw of bodies) {
      const body = raw.replace(/\/\*[\s\S]*?\*\//g, '');
      const matches = [
        ...[...body.matchAll(SPACE_DECL)].map((m) => ({ decl: m[0], value: m[2] })),
        ...[...body.matchAll(FS_DECL)].map((m) => ({ decl: m[0], value: m[1] })),
      ];
      for (const { decl, value } of matches) {
        const literal = value.match(UNIT);
        if (literal && literal.some((v) => v !== '0' && !/^0(?:px|rem)$/.test(v))) {
          offenders.push(`${path.relative(ROOT, file)}: ${decl.trim()}`);
        }
      }
    }
  }
  assert.deepEqual(offenders, [], `raw sizes outside the scale:\n     ${offenders.join('\n     ')}`);
  return 'every size and rhythm value in the theme resolves to a token';
});

await check('every page advertises the social card that exists', () => {
  // A shared link is the most-visited version of this site and the one nobody looks at.
  // The card is generated from the hero copy (`npm run og`), so this checks the wiring:
  // right file, right size, exactly one tag per page, and an alt that is not empty.
  const card = path.join(ROOT, 'public', 'og.png');
  assert.ok(existsSync(card), 'public/og.png is missing — run `npm run og`');
  const { width, height } = pngSize(card);
  assert.equal(`${width}x${height}`, '1200x630', 'Facebook and LinkedIn reserve the large card only at 1200x630');

  const problems = [];
  for (const page of builtPages()) {
    const where = path.relative(ROOT, page);
    const html = readFileSync(page, 'utf8');
    const images = [...html.matchAll(/property="og:image" content="([^"]*)"/g)].map((m) => m[1]);
    if (images.length !== 1) problems.push(`${where}: ${images.length} og:image tags`);
    for (const href of images) {
      const local = href.replace(/^https?:\/\/[^/]+/, '');
      if (!existsSync(path.join(ROOT, 'dist', local.replace(/^\//, '')))) {
        problems.push(`${where}: og:image points at ${href}, which is not in dist/`);
      }
    }
    const alt = /property="og:image:alt" content="([^"]*)"/.exec(html)?.[1] ?? '';
    if (alt.trim().length === 0) problems.push(`${where}: og:image:alt is empty — the card carries real text, so name it`);
    if (/property="og:image" content="[^"]*android-chrome/.test(html)) {
      problems.push(`${where}: og:image still points at an app icon`);
    }
  }
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${width}x${height} card, one tag and a described alt per page`;
});

await check('every icon belongs to this site', () => {
  // Create React App shipped its atom logo at every size and a manifest that still named
  // the site "Create React App Sample"; six of those files were linked or installed long
  // after React itself left. `npm run icons` regenerates the set from scripts/icon.svg,
  // so this checks the wiring: each icon a page links exists, each declared size is the
  // size it was rasterised at, and no scaffold asset rode into dist/.
  const problems = [];

  const manifestFile = path.join(ROOT, 'public', 'manifest.json');
  if (!existsSync(manifestFile)) skip('public/manifest.json is missing — run `npm run icons`');
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));

  for (const field of ['name', 'short_name']) {
    if (/react|sample/i.test(String(manifest[field] ?? ''))) {
      problems.push(`manifest.json ${field} still names a scaffold: ${manifest[field]}`);
    }
  }
  if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
    problems.push('manifest.json declares no icons');
  }

  const declared = new Set();
  for (const icon of manifest.icons ?? []) {
    const file = path.join(ROOT, 'public', icon.src.replace(/^\//, ''));
    declared.add(icon.src);
    if (!existsSync(file)) {
      problems.push(`manifest.json points at ${icon.src}, which is not in public/`);
      continue;
    }
    const { width, height } = pngSize(file);
    if (`${width}x${height}` !== icon.sizes) {
      problems.push(`${icon.src} is ${width}x${height}, manifest declares ${icon.sizes}`);
    }
  }

  for (const page of builtPages()) {
    const where = path.relative(ROOT, page);
    const html = readFileSync(page, 'utf8');
    for (const match of html.matchAll(/<link rel="[^"]*icon[^"]*"[^>]*href="([^"]*)"/g)) {
      const href = match[1];
      if (!existsSync(path.join(ROOT, 'dist', href.replace(/^\//, '')))) {
        problems.push(`${where}: links ${href}, which is not in dist/`);
      }
    }
  }

  // The theme runtime rewrites the favicon hrefs to one pair per palette and the title bar masks
  // /logo.png; nothing links either, so nothing else would notice they were never generated. These
  // names come from `faviconHref`, the same template the writer and the runtime read — if any of
  // the three drifts, either this check fails or the swap resolves to a file that is not there.
  const swapped = ['/logo.png'].concat(
    themes.flatMap((theme) => FAVICON_SIZES.map((px) => faviconHref(theme.id, px)))
  );
  for (const href of swapped) {
    if (!existsSync(path.join(ROOT, 'dist', href.replace(/^\//, '')))) {
      problems.push(`${href} is not in dist/ — run \`npm run icons\``);
    }
  }

  // A launcher installs one icon, so the manifest carries the default dark palette's ground.
  if (manifest.theme_color !== defaultTheme('dark').tokens.background) {
    problems.push(
      `manifest.json theme_color is ${manifest.theme_color}, not ${defaultTheme('dark').tokens.background}`
    );
  }

  const scaffold = walk(path.join(ROOT, 'dist'), ['.png', '.ico', '.svg', '.webp']).filter(
    (file) => /logo\d|android-chrome|safari-pinned-tab|\.webp$/i.test(path.basename(file))
  );
  for (const file of scaffold) problems.push(`${path.relative(ROOT, file)} is a scaffold asset`);

  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${manifest.icons.length} manifest icons, every linked icon present`;
});

await check('no page ships first-party JavaScript', () => {
  // The site's contract: everything is generated at build time and runs on the reader's
  // side only as HTML and CSS. React used to ride along here as a 191KB bundle that no
  // page referenced. The one exception is deliberate: Google Analytics (gtag.js) in
  // BaseLayout, confirmed by Dmitry on 2026-10-25 for aggregate page counts and
  // disclosed on /privacy. Everything else in this list stays forbidden.
  const dist = path.join(ROOT, 'dist');
  if (!existsSync(dist)) skip('no dist/ build yet — run `npm run build`');
  const assets = walk(dist, ['.js']);
  assert.deepEqual(assets.map((f) => path.relative(ROOT, f)), [], 'bundles shipped to the browser');

  const offenders = [];
  for (const page of builtPages()) {
    const html = readFileSync(page, 'utf8');
    let runtimes = 0;
    for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      const [, body] = match;
      // Astro strips attributes from an `is:inline` block, so the two scripts the site owns are
      // identified by what they do: the gtag bootstrap pushes to dataLayer, the theme runtime
      // carries the palette payload under a storage key. Neither is a bundle.
      const ok =
        match[0].includes('application/ld+json') ||
        match[0].includes('googletagmanager.com/gtag/js') ||
        /window\.dataLayer|function gtag\(\)/.test(body) ||
        body.includes('storageKey');
      if (body.includes('storageKey')) runtimes += 1;
      if (!ok) offenders.push(`${path.relative(ROOT, page)}: ${match[0].slice(0, 80)}`);
    }
    // One inline runtime per page: a second copy would resolve the preference twice.
    if (runtimes !== 1) offenders.push(`${path.relative(ROOT, page)}: ${runtimes} theme runtimes`);
  }
  assert.deepEqual(offenders, [], `unexpected scripts:\n     ${offenders.join('\n     ')}`);
  return 'no bundles in dist; JSON-LD, the analytics tag and one inline theme runtime per page';
});

await check('the copy model carries no commercial terms', () => {
  // Removed deliberately on 2026-10-25: the site demonstrates what I can do, so it says
  // nothing about pricing, capacity, availability, who to contact me about, or who I turn
  // away. A field named for any of those is a decision to revisit, not an omission to
  // repair — and an empty one of these is what shipped an empty <p> in the first place.
  const forbidden = /price|cost|rate|fee|capacity|availability|retainer|invoice|disqualifier/i;
  const slots = [];
  for (const [name, value] of Object.entries(site)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      slots.push(...Object.keys(value).filter((key) => forbidden.test(key)).map((key) => `${name}.${key}`));
    }
  }
  assert.deepEqual(slots, [], `commercial-terms fields present: ${slots.join(', ')}`);
  return 'no pricing, capacity or availability slot exists to leave empty';
});

await check('built pages render no empty text elements', () => {
  const pages = builtPages();
  const problems = pages.flatMap((page) =>
    findEmptyBlocks(readFileSync(page, 'utf8')).map(
      (element) => `${path.relative(ROOT, page)}: empty <${element.split(/[ ]/)[0]}>`
    )
  );
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${pages.length} built pages scanned`;
});

await check('an empty rendered element is detected', () => {
  const fixture = '<section><p class="availability"> </p><h2>Kept</h2><ul><li>a rule</li></ul></section>';
  const found = findEmptyBlocks(fixture);
  assert.deepEqual(found, ['p class="availability"'], `fixture slipped through: ${found.join(' | ')}`);
  return 'fixture empty paragraph rejected';
});

await check('print rules style only classes the site renders', () => {
  // A print stylesheet is small enough to be wrong quietly: a rule against a class
  // nothing renders costs nothing at build time and changes nothing on paper. The
  // rest of index.css is the only honest list of what exists to style.
  const cssPath = path.join(SRC, 'index.css');
  const css = readFileSync(cssPath, 'utf8');
  const start = css.indexOf('@media print {');
  assert.ok(start !== -1, 'index.css has no @media print block at all');
  let depth = 0;
  let end = start;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
  const block = css.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, '');
  // only the parts before each brace are selectors; a class name inside a
  // declaration value is a coincidence, not a rule
  const selectors = block.split('{').map((chunk) => chunk.slice(chunk.lastIndexOf('}') + 1));
  const classes = [...new Set(selectors.flatMap((sel) => sel.match(/\.[a-z][a-z0-9-]*/g) ?? []))];
  assert.ok(classes.length >= 5, `only ${classes.length} print selectors found; block looks mis-parsed`);
  const rendered = [
    css.slice(0, start),
    ...walk(SRC, ['.astro']).map((file) => readFileSync(file, 'utf8')),
  ].join('\n');
  const orphans = classes.filter((cls) => !rendered.includes(cls));
  assert.deepEqual(orphans, [], `print rules for classes nothing renders: ${orphans.join(', ')}`);
  return `${classes.length} print selectors, none orphaned`;
});

// ---------------------------------------------------------------------------

const pending = [
  ...site.claims.filter((claim) => claim.needsReview).map((claim) => `claim ${claim.id}`),
  ...site.notes.filter((note) => note.needsReview).map((note) => `note "${note.heading}"`),
  ...platformLinksToConfirm(site.products),
  // Utility-page copy carries the flag only while it is unsigned, so test for the
  // property rather than assuming it.
  ...('needsReview' in site.utilityPages.privacy
    ? ['page /privacy — the privacy statement is attributed to Dmitry personally']
    : []),
];

console.log('');
if (pending.length > 0) {
  console.log(`NEEDS SIGN-OFF (${pending.length}) — wording to confirm before launch:`);
  for (const item of pending) console.log(`  - ${item}`);
} else {
  console.log('SIGN-OFF: nothing pending — every claim, note and store link confirmed by Dmitry.');
}

const failed = results.filter((result) => !result.ok);
if (failed.length > 0) {
  console.error(`\nverify: ${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
const skipped = results.filter((result) => result.skipped);
if (skipped.length > 0) {
  console.log(
    `verify: ${results.length - skipped.length} of ${results.length} checks passed, ${skipped.length} skipped (build the site to run them).`
  );
} else {
  console.log(`verify: all ${results.length} checks passed.`);
}
