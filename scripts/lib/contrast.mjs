/*
 * WCAG 2.1 relative luminance and contrast ratio, plus the HSL drift used by the palette
 * fidelity guard, shared by `node scripts/contrast.mjs` (the table DESIGN.md quotes) and
 * scripts/verify-site.mjs (the guard). Written here once so the number in the contract and the
 * number that fails a build cannot differ.
 */

const channel = (byte) => {
  const v = byte / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

/** Relative luminance of `#rrggbb`. */
export const luminance = (hex) => {
  const value = String(hex).replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(value)) throw new Error(`not a #rrggbb colour: ${hex}`);
  const rgb = [0, 2, 4].map((i) => channel(parseInt(value.slice(i, i + 2), 16)));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
};

/** Contrast ratio of two colours, 1…21, order-independent. */
export const contrastRatio = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (high + 0.05) / (low + 0.05);
};

/** A ratio rounded to two decimals — the guard's threshold. Writers of fixed tables format
 * further with `toFixed(2)` so an implied trailing zero survives on the page. */
export const ratio = (a, b) => Math.round(contrastRatio(a, b) * 100) / 100;

const rgbOf = (hex) => {
  const value = String(hex).replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(value)) throw new Error(`not a #rrggbb colour: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
};

/** Hue in degrees, saturation and lightness in percent. Achromatic colours report hue 0 —
 * they have no hue to compare, which is why drift() ignores hue once either side is grey. */
export const hsl = (hex) => {
  const [r, g, b] = rgbOf(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const span = max - min;
  const lightness = (max + min) / 2;
  if (span === 0) return { h: 0, s: 0, l: lightness * 100 };
  const saturation = span / (lightness > 0.5 ? 2 - max - min : max + min);
  const axis = max === r ? [0, (g - b) / span + (g < b ? 6 : 0)] : max === g ? [1, (b - r) / span + 2] : [2, (r - g) / span + 4];
  return { h: axis[1] * 60, s: saturation * 100, l: lightness * 100 };
};

/** How far one colour sits from another: `hue` is the unsigned shortest way round the wheel,
 * `sat` and `light` are signed. `light` is the only axis a nudge may move; `achromatic` marks
 * pairs where hue is meaningless, so a caller must not fail on `hue`. */
export const drift = (from, to) => {
  const a = hsl(from);
  const b = hsl(to);
  const raw = b.h - a.h;
  return {
    hue: Math.abs(((raw + 540) % 360) - 180),
    sat: b.s - a.s,
    light: b.l - a.l,
    achromatic: a.s === 0 || b.s === 0,
  };
};
