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

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/u;

const JOB_TITLES =
  /\b(chief technology officer|chief technical officer|cto|vp of engineering|vice president of engineering|director of engineering|head of engineering|engineering manager|staff engineer|principal engineer|distinguished engineer)\b/i;

const EMPLOYMENT_RANGE = /\b(?:19\d{2}|20\d{2})\s*[–—-]\s*(?:19\d{2}|20\d{2}|present)\b/;

const results = [];

async function check(label, fn) {
  try {
    const note = await fn();
    results.push({ label, ok: true });
    console.log(note ? `PASS ${label} — ${note}` : `PASS ${label}`);
    return note;
  } catch (error) {
    results.push({ label, ok: false });
    console.error(`FAIL ${label}\n     ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
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
// that says nothing at the exact spot where copy was promised. `engagementTerms`
// exists so the data module, not the component, decides when a line is absent.
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

await check('/impact.json matches the content the page renders', () => {
  const payload = site.buildImpactPayload();
  assert.deepEqual(
    payload.claims.map((claim) => claim.metric),
    site.claims.map((claim) => claim.metric),
    'payload metrics drifted from the claims module'
  );
  assert.equal(payload.asOf, site.asOf);

  const rendered = path.join(ROOT, 'dist', 'index.html');
  if (!existsSync(rendered)) {
    return `${payload.claims.length} claims (page parity skipped: no dist/ build yet)`;
  }
  // A dist/ from before the current copy proves nothing about it.
  if (statSync(rendered).mtimeMs < statSync(path.join(SRC, 'data', 'site.ts')).mtimeMs) {
    return `${payload.claims.length} claims (page parity skipped: rebuild — dist/ predates src/data/site.ts)`;
  }
  const html = readFileSync(rendered, 'utf8');
  // Compared as the markup holds it: a figure like `<1%` is written `&lt;1%`.
  const inMarkup = (value) =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const absent = site.claims.filter((claim) => !html.includes(inMarkup(claim.metric)));
  assert.equal(absent.length, 0, `rendered page missing figures: ${absent.map((c) => c.id).join(', ')}`);
  return `${payload.claims.length} claims identical in payload and rendered page`;
});

await check('terms lines render only when written', () => {
  assert.deepEqual(site.engagementTerms({}), []);
  assert.deepEqual(site.engagementTerms({ priceNote: ' ', capacity: '  ' }), []);
  assert.deepEqual(site.engagementTerms({ priceNote: 'Quote after the first call.', capacity: '' }), [
    'Quote after the first call.',
  ]);
  const written = site.engagementTerms({ priceNote: 'Fixed fee.', capacity: 'Two engagements at a time.' });
  assert.equal(written.length, 2, 'both lines should render when both are written');
  return 'empty and missing wording both render nothing';
});

await check('built pages render no empty text elements', () => {
  const built = path.join(ROOT, 'dist', 'index.html');
  if (!existsSync(built)) {
    return 'page scan skipped: no dist/ build yet — run `npm run build`';
  }
  if (statSync(built).mtimeMs < statSync(path.join(SRC, 'data', 'site.ts')).mtimeMs) {
    return 'page scan skipped: rebuild — dist/ predates src/data/site.ts';
  }
  const pages = walk(path.join(ROOT, 'dist'), ['.html']);
  const problems = pages.flatMap((page) =>
    findEmptyBlocks(readFileSync(page, 'utf8')).map(
      (element) => `${path.relative(ROOT, page)}: empty <${element.split(/[ ]/)[0]}>`
    )
  );
  assert.deepEqual(problems, [], `\n     ${problems.join('\n     ')}`);
  return `${pages.length} built pages scanned`;
});

await check('an empty rendered element is detected', () => {
  const fixture = '<section><p class="terms"> </p><h2>Kept</h2><ul><li>a rule</li></ul></section>';
  const found = findEmptyBlocks(fixture);
  assert.deepEqual(found, ['p class="terms"'], `fixture slipped through: ${found.join(' | ')}`);
  return 'fixture empty paragraph rejected';
});

// ---------------------------------------------------------------------------

const pending = [
  ...site.claims.filter((claim) => claim.needsReview).map((claim) => `claim ${claim.id}`),
  ...site.notes.filter((note) => note.needsReview).map((note) => `note "${note.heading}"`),
];

console.log('');
if (pending.length > 0) {
  console.log(`NEEDS SIGN-OFF (${pending.length}) — wording to confirm before launch:`);
  for (const item of pending) console.log(`  - ${item}`);
}

const failed = results.filter((result) => !result.ok);
if (failed.length > 0) {
  console.error(`\nverify: ${failed.length} of ${results.length} checks failed.`);
  process.exit(1);
}
console.log(`verify: all ${results.length} checks passed.`);
