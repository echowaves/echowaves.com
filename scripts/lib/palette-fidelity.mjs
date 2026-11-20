/*
 * The palette fidelity rule, shared by scripts/verify-site.mjs (which fails the build on any
 * returned string) and scripts/contrast.mjs (which prints the pins). Lives apart from both so the
 * matrix of cases can be tested directly — verify-site.mjs runs its checks at import time, so an
 * inline rule could only ever be proven by hand-editing a palette.
 *
 * A guest palette is somebody else's published colour system. Owner ruling of 2026-11-20 freezes
 * each one as shipped: canonical fidelity outranks an external contrast score, so no future edit
 * may repaint a guest palette while chasing an audit number. The AA check measures what a ratio
 * came out to; this measures where a hex came from.
 */

import { drift } from './contrast.mjs';

/** Tolerances for a declared nudge, set above the maxima measured across the thirteen shipped
 * nudges (hue 1.0°, saturation 0.4) so the moves already in the registry stay legal. Lightness is
 * deliberately uncapped: legibility is bounded by the AA gate, not here. */
export const MAX_HUE_DELTA = 1.5;
export const MAX_SAT_DELTA = 5;

const HEX = /^#[0-9a-f]{6}$/i;

/** A declared nudge keeps the colour's identity and moves only its lightness — how all 13 shipped
 * nudges were made. `achromatic` covers the greys most light palettes are built from, where hue is
 * numerically meaningless; near-greys just above that line can still swing a few degrees, which is
 * why DESIGN.md tells an owner to repin rather than fight the number. */
const isLightnessOnly = (moved) =>
  (moved.achromatic || moved.hue <= MAX_HUE_DELTA) && Math.abs(moved.sat) <= MAX_SAT_DELTA;

/**
 * Returns one human-readable string per violation — empty means the palettes are faithful.
 * `themes` is the registry shape: `{ id, measured, nudgedTokens, published, tokens }`.
 */
export const fidelityProblems = (tokenNames, themes) => {
  const problems = [];
  for (const theme of themes) {
    if (theme.measured) continue; // this site's own palette has no upstream to be faithful to
    const published = theme.published ?? {};
    const missing = tokenNames.filter((token) => !published[token]);
    if (missing.length) {
      problems.push(
        `${theme.id}: published baseline missing for ${missing.join(', ')} — an unpinned token is a bypassable guard`
      );
    }
    // Nudges are declared per token, never palette-wide: `nudged: true` records that a palette was
    // tuned for AA historically, which must not become a licence to retune any token in it later.
    const declared = new Set(theme.nudgedTokens ?? []);
    for (const token of tokenNames) {
      const baseline = published[token];
      if (!baseline) continue;
      const shipped = theme.tokens[token];
      if (typeof shipped !== 'string' || !HEX.test(shipped)) {
        problems.push(`${theme.id}: --${token} is "${shipped}", not a #rrggbb colour`);
        continue;
      }
      if (!HEX.test(baseline)) {
        problems.push(`${theme.id}: published baseline for --${token} is "${baseline}", not a #rrggbb colour`);
        continue;
      }
      if (shipped.toLowerCase() === baseline.toLowerCase()) continue;
      const moved = drift(baseline, shipped);
      const delta = `(hue Δ${moved.hue.toFixed(1)}°, sat Δ${moved.sat.toFixed(1)}, lightness Δ${moved.light.toFixed(1)})`;
      if (!declared.has(token)) {
        problems.push(
          `${theme.id}: --${token} ships ${shipped}, pinned at ${baseline} ${delta}` +
            ` — undeclared change: list the token in nudgedTokens and record the move in source, or restore the pin`
        );
        continue;
      }
      if (isLightnessOnly(moved)) continue;
      const why =
        !moved.achromatic && moved.hue > MAX_HUE_DELTA
          ? `a declared nudge may only move lightness — hue moved ${moved.hue.toFixed(1)}° past ${MAX_HUE_DELTA}°`
          : `a declared nudge may only move lightness — saturation moved ${moved.sat.toFixed(1)} past ±${MAX_SAT_DELTA}`;
      problems.push(
        `${theme.id}: --${token} ships ${shipped}, pinned at ${baseline} ${delta} — ${why}.` +
          ` Repinning is the owner's call: change published and source together, in one commit`
      );
    }
  }
  return problems;
};
