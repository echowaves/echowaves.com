/*
 * Prints the measured contrast of every palette in the registry.
 *
 *   node scripts/contrast.mjs          # a markdown table per group, the shape DESIGN.md keeps
 *   node scripts/contrast.mjs --text    # one flat list, easiest to read in a terminal
 *
 * Ratios are WCAG 2.1 relative luminance from scripts/lib/contrast.mjs — the same maths
 * `npm run verify` enforces, so a number quoted in the contract is the number that fails a build.
 * A palette this site tuned (Phosphor) must clear AA on every role; a palette it inherited ships
 * its published hexes, and the row says so rather than hiding it.
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
    lines.push(
      `| \`${theme.id}\` | ${theme.tokens.background} | ${
        theme.measured ? 'measured, AA required' : 'canonical hexes'
      } | ${TOKEN_NAMES.length} |`
    );
  }
  return lines;
};

if (flat) {
  for (const theme of themes) {
    console.log(`\n${theme.id} — ${theme.label} (${theme.group})${theme.measured ? ', measured' : ''}`);
    for (const role of CONTRAST_ROLES) {
      const value = ratio(theme.tokens[role.token], against(theme, role));
      const verdict = value >= role.aa ? 'AA' : value >= 3 ? 'AA large/UI' : 'below AA';
      console.log(
        `  --${role.token.padEnd(15)} ${theme.tokens[role.token]} on ${against(theme, role)}  ${String(value).padStart(6)}:1  ${verdict}`
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
        return `\`${theme.tokens[role.token]}\` ${value}:1`;
      });
      console.log(`| ${theme.label} | ${cells.join(' | ')} |`);
    }
  }
  console.log(
    '\nRatios are against `--background`, except ink-on-accent, which sits on `--accent`. AA is 4.5:1 for text and 3:1 for a rule.'
  );
}
