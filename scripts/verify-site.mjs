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
  // A tab that renders nothing but the chrome would be a dead end. Pages with no
  // main at all are redirects (see `redirects` in astro.config.mjs), not routes.
  const thin = [];
  for (const page of builtPages()) {
    const body = readFileSync(page, 'utf8').match(/<main id="main">([\s\S]*?)<\/main>/);
    if (!body) continue;
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
    if (!html.includes('<main id="main">')) continue; // redirects carry no document
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

  // The theme-color meta tag is the one literal that has to stay a literal, so at
  // least make sure it still paints the same colour as the window.
  const layout = readFileSync(path.join(SRC, 'layouts', 'BaseLayout.astro'), 'utf8');
  const themeColor = /name="theme-color" content="(#[0-9a-fA-F]{3,8})"/.exec(layout)?.[1];
  const background = /--background:\s*(#[0-9a-fA-F]{3,8})/.exec(tokens)?.[1];
  assert.equal(
    themeColor?.toLowerCase(),
    background?.toLowerCase(),
    'the theme-color meta tag disagrees with --background',
  );

  return `${defined.size} tokens declared; ${styleSources.length} style sources read only tokens`;
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
    // Astro's redirect stubs are plumbing, not destinations: they carry no chrome and no
    // metadata beyond the refresh, canonical and noindex. Same exemption the tab check uses.
    if (!html.includes('<main id="main"')) continue;
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
    if (!html.includes('<main id="main"')) continue; // redirect stubs carry no document
    for (const match of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
      const [, body] = match;
      const ok =
        match[0].includes('application/ld+json') ||
        match[0].includes('googletagmanager.com/gtag/js') ||
        // Astro strips attributes from an `is:inline` block, so the gtag bootstrap is
        // identified by what it does rather than by anything written on its tag.
        /window\.dataLayer|function gtag\(\)/.test(body);
      if (!ok) offenders.push(`${path.relative(ROOT, page)}: ${match[0].slice(0, 80)}`);
    }
  }
  assert.deepEqual(offenders, [], `unexpected scripts:\n     ${offenders.join('\n     ')}`);
  return 'no bundles in dist; only JSON-LD and the analytics tag';
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
