/*
 * Prints the measured contrast of every palette in the registry.
 *
 *   node scripts/contrast.mjs          # a markdown table per group, the shape DESIGN.md keeps
 *   node scripts/contrast.mjs --text    # one flat list, easiest to read in a terminal
 *
 * Ratios are WCAG 2.1 relative luminance from scripts/lib/contrast.mjs — the same maths
 * `npm run verify` enforces, so a number quoted in the contract is the number that fails a build.
 * Every palette must clear AA on the text roles; Phosphor — the one this site tuned — clears 3:1
 * on rules too, while guest palettes publish their own rule colours and are exempt there.
 */
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { ratio } from './lib/contrast.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { CONTRAST_ROLES, TOKEN_NAMES, themes, themesInGroup } = await import(
  pathToFileURL(path.join(ROOT, 'src', 'data', 'themes.ts')).href
);

const flat = process.argv.includes('--text');

/** The token each role is measured against, spelled the way a reader checks it by hand. */
const against = (theme, role) => theme.tokens[role.against];

const rows = (list) => {
  const lines = [];
  for (const theme of list) {
    const hexes = theme.measured
      ? 'measured here, AA incl. rules'
      : theme.nudged
        ? 'published, text roles nudged to AA'
        : 'canonical';
    lines.push(`| \`${theme.id}\` | ${theme.tokens.background} | ${hexes} | ${TOKEN_NAMES.length} |`);
  }
  return lines;
};

if (flat) {
  for (const theme of themes) {
    console.log(`\n${theme.id} — ${theme.label} (${theme.group})${theme.measured ? ', measured' : ''}`);
    for (const role of CONTRAST_ROLES) {
      const value = ratio(theme.tokens[role.token], against(theme, role));
      const exempt = role.token === 'border' && !theme.measured;
      const verdict = exempt ? 'published rule colour (exempt)' : value >= role.aa ? 'AA' : value >= 3 ? 'AA large/UI' : 'below AA';
      console.log(
        `  --${role.token.padEnd(15)} on ${String(against(theme, role)).padEnd(13)} ${theme.tokens[role.token]}  ${value.toFixed(2).padStart(6)}:1  ${verdict}`
      );
    }
    console.log(`  source: ${theme.source}`);
  }
} else {
  for (const group of ['light', 'dark']) {
    const list = themesInGroup(group);
    console.log(`\n### ${group[0].toUpperCase()}${group.slice(1)} palettes\n`);
    console.log('| Theme | Ground | Hexes | Tokens |');
    console.log('|---|---|---|---|');
    console.log(rows(list).join('\n'));
    console.log('');
    console.log(`| Theme | ${CONTRAST_ROLES.map((role) => role.label).join(' | ')} |`);
    console.log(`|---|${CONTRAST_ROLES.map(() => '---').join('|')}|`);
    for (const theme of list) {
      const cells = CONTRAST_ROLES.map((role) => {
        const value = ratio(theme.tokens[role.token], against(theme, role));
        return `\`${theme.tokens[role.token]}\` ${value.toFixed(2)}:1`;
      });
      console.log(`| ${theme.label} | ${cells.join(' | ')} |`);
    }
  }
  console.log(
    '\nEach role is measured on the surface its text renders on (`--background`, `--panel` or `--panel-raised`; ink-on-accent sits on `--accent`). AA is 4.5:1 for every text role in every palette; the 3:1 rule floor is enforced on palettes this site tuned — guest rules ship published and pale.'
  );
}
