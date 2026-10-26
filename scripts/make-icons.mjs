/*
 * Regenerates every icon and the nav logo from one drawing: scripts/echowaves-logo.jpeg.
 *
 *   npm run icons        # writes public/logo.png, public/favicon.*, public/apple-touch-icon.png,
 *                        # public/icon-*.png and public/manifest.json
 *
 * The artwork is a JPEG on white, so most of this script is turning that into clean
 * transparency: colour-key the white (which also clears the gaps between the arcs, not just
 * the outer field), then tighten the alpha by one pixel and darken its edge, because JPEG
 * ringing around a thin arc otherwise leaves a pale halo on any background. `npm run verify`
 * fails if a page links an icon that was not generated or if a declared size is wrong.
 *
 * The files this replaced were Create React App leftovers — the atom logo at six sizes and
 * a manifest that still named the site "Create React App Sample".
 *
 * Needs ImageMagick (`brew install imagemagick`).
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { identity, pages } from '../src/data/site.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'scripts', 'echowaves-logo.jpeg');
const PUBLIC = path.join(ROOT, 'public');

/** The near-black of the window: the plate under any icon a launcher may tint or mask. */
const BACKGROUND = '#060606';

/**
 * White becomes transparency — including the gaps between the arcs, not just the outer
 * field — then the alpha is eroded one pixel and its edge darkened, because JPEG ringing
 * around a thin arc otherwise leaves a pale halo on any background it is placed on.
 */
const MARK = ['-fuzz', '35%', '-transparent', 'white',
  '-channel', 'A', '-morphology', 'Erode', 'Diamond', '+channel',
  '-channel', 'A', '-blur', '0x0.5', '-level', '20%,100%', '+channel',
  '-trim', '+repage'];

/** The mark on a square canvas: padding is what keeps a favicon's strokes off the edge. */
const PLATE = [
  ...MARK, '-bordercolor', 'none', '-border', '9%', '-background', 'none', '-gravity', 'center',
  // `-extent square` is a newer spelling; the fx form works on either ImageMagick.
  '-extent', '%[fx:max(w,h)]x%[fx:max(w,h)]',
];

/** Every raster the head or the manifest asks for, at the size it is asked for. */
const RASTERS = [
  { px: 16, file: 'favicon-16x16.png', plate: true },
  { px: 32, file: 'favicon-32x32.png', plate: true },
  { px: 192, file: 'icon-192.png', plate: true },
  { px: 512, file: 'icon-512.png', plate: true },
  // A launcher masks an icon into a circle, so this one carries its own background.
  { px: 512, file: 'icon-maskable-512.png', plate: true, opaque: true },
  // iOS ignores transparency here and fills it with black; the window colour is kinder.
  { px: 180, file: 'apple-touch-icon.png', plate: true, opaque: true },
];

/** The logo in the tab bar is shown about 20px tall, so 3x that is plenty of headroom. */
const LOGO_HEIGHT = 64;

/** Sizes inside the legacy .ico container. Windows and old Safari still read it. */
const ICO_SIZES = [16, 32, 48];

function magick(args) {
  try {
    // ImageMagick 7 spells the binary `magick`, ImageMagick 6 `convert`.
    return execFileSync('magick', args);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return execFileSync('convert', args);
  }
}

function raster(px, file, { plate = true, opaque = false } = {}) {
  const geometry = plate ? String(px) : `x${px}`;
  magick([SOURCE, ...(plate ? PLATE : MARK), '-resize', geometry,
    ...(opaque ? ['-background', BACKGROUND, '-flatten'] : []),
    '-define', 'png:compression-level=9', file]);
}

const scratch = mkdtempSync(path.join(tmpdir(), 'echowaves-icons-'));
try {
  for (const { px, file, plate, opaque } of RASTERS) {
    raster(px, path.join(PUBLIC, file), { plate, opaque });
  }

  magick([SOURCE, ...MARK, '-resize', `x${LOGO_HEIGHT}`, '-define', 'png:compression-level=9',
    path.join(PUBLIC, 'logo.png')]);

  const icoInputs = ICO_SIZES.map((px) => {
    const file = path.join(scratch, `${px}.png`);
    raster(px, file);
    return file;
  });
  magick([...icoInputs, path.join(PUBLIC, 'favicon.ico')]);
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

const home = pages.find((page) => page.href === '/');

const manifest = {
  name: `${identity.name} — Echowaves`,
  short_name: 'Echowaves',
  description: home.description,
  id: '/',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: BACKGROUND,
  theme_color: BACKGROUND,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};

writeFileSync(path.join(PUBLIC, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `wrote logo.png (h=${LOGO_HEIGHT}), ${RASTERS.map((r) => r.file).join(', ')}, ` +
    `favicon.ico (${ICO_SIZES.join('/')}px) and manifest.json from scripts/echowaves-logo.jpeg`
);
