/*
 * Writes the palette blocks in src/index.css from the theme registry.
 *
 *   node scripts/make-themes.mjs     # rewrite the themes region in src/index.css
 *
 * The registry (src/data/themes.ts) is the source of truth for every consumer — stylesheet,
 * head, control, icons — and this is the one place a palette becomes CSS. The generated text
 * sits between the `themes:begin` / `themes:end` sentinels; `npm run verify` regenerates it in
 * memory and fails if the region no longer matches, so an edit to a hex without a re-run of
 * this script cannot reach a build.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { themesRegionCss } from '../src/data/themes.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CSS = path.join(ROOT, 'src', 'index.css');
const BEGIN = '/* themes:begin';
const END = '/* themes:end */';
/**
 * The region goes above the media blocks whose overrides must keep winning — above their
 * comments too, so a block is never separated from the prose that explains it.
 */
const ANCHOR = '/*\n * Forced-colors mode';

const region = themesRegionCss();
const css = readFileSync(CSS, 'utf8');
const start = css.indexOf(BEGIN);
const finish = css.indexOf(END);

let next;
if (start === -1 && finish === -1) {
  const anchor = css.indexOf(ANCHOR);
  if (anchor === -1) throw new Error(`index.css has no "${ANCHOR}" to insert the region above`);
  next = `${css.slice(0, anchor).replace(/\s+$/, '')}\n\n${region}\n\n${css.slice(anchor)}`;
} else {
  if (start === -1 || finish === -1 || finish < start) {
    throw new Error('the themes region in index.css is half-present — restore both sentinels');
  }
  next = `${css.slice(0, start)}${region}${css.slice(finish + END.length)}`;
}

if (next === css) {
  console.log('src/index.css already matches src/data/themes.ts — nothing written');
} else {
  writeFileSync(CSS, next);
  console.log('wrote the themes region in src/index.css from src/data/themes.ts');
}
