/*
 * Generates the social card at public/og.png (1200×630) from the same copy the site
 * renders, so a shared link can never disagree with the page it points at.
 *
 *   node scripts/make-og.mjs        # writes scripts/og-card.svg and public/og.png
 *
 * The SVG is committed next to this script: it is the reviewable source, and the PNG is a
 * rasterisation of it. Social platforms will not read an SVG for og:image, so the PNG ships.
 * Rasterising needs librsvg (`brew install librsvg`).
 *
 * Geometry is arithmetic, not layout: the card is monospace, so a column count fixes both
 * wrapping and horizontal position. `ADVANCE` below was measured from this renderer
 * (rsvg-convert + Menlo) rather than trusted from the font's metrics table — see run(),
 * which refuses to emit a card whose text would cross the window border.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hero, nav, shellPrompt } from '../src/data/site.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The bare host, as it appears in the canonical URL of every page. */
const DOMAIN = 'echowaves.com';

/* Palette — the same measured values as src/index.css. See DESIGN.md before changing one. */
const C = {
  background: '#060606',
  panel: '#0d0d0d',
  border: '#2b7a3a',
  text: '#8dfa9c',
  textDim: '#3fa852',
  accent: '#33d24b',
  emphasis: '#febc2e',
  danger: '#ff5f57',
};

const WIDTH = 1200;
const HEIGHT = 630;
const WINDOW = { x: 56, w: 1088, radius: 14 };
const TITLEBAR_H = 56;
const TABBAR_H = 60;
const PAD = 44;

/**
 * Glyph advance for the font this script rasterises with, in em. Measured by rendering 10
 * and 20 characters at 100px and dividing the difference: Menlo reports 0.602, and an em
 * dash adds about 0.06 on top of that.
 */
const ADVANCE = 0.602;
const WIDE = { '\u2014': 0.062 };

const FONT = "'Menlo','SF Mono',ui-monospace,monospace";
const RIGHT_EDGE = WINDOW.x + WINDOW.w - PAD;

const textWidth = (text, size) => {
  let em = 0;
  for (const ch of text) em += 1 + (WIDE[ch] ?? 0);
  return em * size * ADVANCE;
};

const esc = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Places one run of text, refusing to let it cross the window's inner border. */
function run(x, y, size, text, fill, { bold = false, spacing = 0 } = {}) {
  const width = textWidth(text, size) + spacing * text.length;
  if (x + width > RIGHT_EDGE) {
    throw new Error(
      `"${text}" at ${size}px would end at x=${Math.round(x + width)}, past ${RIGHT_EDGE}. ` +
        'Shorten the copy or lower the size rather than let a shared card clip.'
    );
  }
  const attrs =
    `x="${x.toFixed(1)}" y="${y}" font-size="${size}" fill="${fill}"` +
    `${bold ? ' font-weight="bold"' : ''}${spacing ? ` letter-spacing="${spacing}"` : ''}`;
  return { svg: `<text ${attrs}>${esc(text)}</text>`, width };
}

/** Greedy wrap on whole words into lines at most `columns` characters wide. */
function wrap(text, columns) {
  const lines = [];
  let current = '';
  for (const word of text.split(/\s+/)) {
    if (!current.length) current = word;
    else if (current.length + 1 + word.length <= columns) current += ` ${word}`;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current.length) lines.push(current);
  return lines;
}

/* --- content, measured before anything is drawn ----------------------------------- */

const HEADLINE_SIZE = 26;
const BODY_SIZE = 25;
const LABEL_SIZE = 19;
const DOMAIN_SIZE = 24;
const LINE_GAP = 40;

const left = WINDOW.x + PAD;
const columns = Math.floor((WINDOW.w - PAD * 2) / (BODY_SIZE * ADVANCE));
const descriptionLines = wrap(hero.description, columns);

const chromeTop = 62;
const bodyTop = chromeTop + TITLEBAR_H + TABBAR_H;
const windowHeight = TITLEBAR_H + TABBAR_H + 84 + 56 + descriptionLines.length * LINE_GAP + 130;
const windowY = Math.round((HEIGHT - windowHeight) / 2);

const parts = [];

/* --- chrome ----------------------------------------------------------------------- */

parts.push(
  `<rect x="${WINDOW.x}" y="${windowY}" width="${WINDOW.w}" height="${windowHeight}" rx="${WINDOW.radius}" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>`
);

[C.danger, C.emphasis, C.accent].forEach((fill, i) => {
  parts.push(
    `<circle cx="${WINDOW.x + 34 + i * 26}" cy="${windowY + TITLEBAR_H / 2}" r="8" fill="${fill}"/>`
  );
});

let cursor = WINDOW.x + 34 + 2 * 26 + 30;
for (const [text, fill] of [
  [shellPrompt, C.accent],
  [' \u2014 ', C.border],
  ['~/echowaves', C.textDim],
]) {
  const placed = run(cursor, windowY + TITLEBAR_H / 2 + 7, 21, text, fill);
  parts.push(placed.svg);
  cursor += placed.width;
}

parts.push(
  `<line x1="${WINDOW.x}" y1="${windowY + TITLEBAR_H}" x2="${WINDOW.x + WINDOW.w}" y2="${windowY + TITLEBAR_H}" stroke="${C.border}" stroke-width="2"/>`
);

let tabX = WINDOW.x + 20;
nav.forEach((item, index) => {
  const active = index === 0;
  const size = 21;
  const width = textWidth(item.label, size) + 34;
  if (active) {
    parts.push(
      `<rect x="${tabX.toFixed(1)}" y="${windowY + TITLEBAR_H}" width="${width.toFixed(1)}" height="${TABBAR_H}" fill="${C.background}"/>`
    );
  }
  parts.push(
    run(tabX + 17, windowY + TITLEBAR_H + TABBAR_H / 2 + 7, size, item.label, active ? C.text : C.textDim).svg
  );
  if (active) {
    parts.push(
      `<rect x="${tabX.toFixed(1)}" y="${windowY + TITLEBAR_H + TABBAR_H - 3}" width="${width.toFixed(1)}" height="3" fill="${C.accent}"/>`
    );
  }
  tabX += width + 2;
});

parts.push(
  `<line x1="${WINDOW.x}" y1="${windowY + TITLEBAR_H + TABBAR_H}" x2="${WINDOW.x + WINDOW.w}" y2="${windowY + TITLEBAR_H + TABBAR_H}" stroke="${C.border}" stroke-width="2"/>`
);

/* --- body ------------------------------------------------------------------------ */

let baseline = bodyTop + 62;

// The same four spans as the site's <h1>: command, synopsis, dash, summary.
cursor = left;
for (const [text, fill, bold] of [
  [hero.name, C.accent, true],
  [hero.synopsis, C.textDim, false],
  [' \u2014 ', C.textDim, false],
]) {
  const placed = run(cursor, baseline, HEADLINE_SIZE, text, fill, { bold });
  parts.push(placed.svg);
  cursor += placed.width;
}
parts.push(run(cursor, baseline, HEADLINE_SIZE, hero.headline, C.text, { bold: true }).svg);

// Section labels are accent with wide tracking on the site; the card uses the same ratio.
baseline += 62;
parts.push(run(left, baseline, LABEL_SIZE, hero.sections.description, C.accent, { spacing: 2.4 }).svg);

baseline += 46;
for (const text of descriptionLines) {
  parts.push(run(left, baseline, BODY_SIZE, text, C.text).svg);
  baseline += LINE_GAP;
}

parts.push(run(left, baseline + 34, DOMAIN_SIZE, DOMAIN, C.accent).svg);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${C.background}"/>
  <g font-family="${FONT}">
    ${parts.join('\n    ')}
  </g>
</svg>
`;

writeFileSync(path.join(ROOT, 'scripts', 'og-card.svg'), svg);
execFileSync('rsvg-convert', [
  '-w',
  String(WIDTH),
  '-h',
  String(HEIGHT),
  path.join(ROOT, 'scripts', 'og-card.svg'),
  '-o',
  path.join(ROOT, 'public', 'og.png'),
]);

console.log(
  `wrote scripts/og-card.svg and public/og.png (window ${WINDOW.w}×${windowHeight} at y=${windowY}, ` +
    `${columns} columns, ${descriptionLines.length} body lines)`
);
