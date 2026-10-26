/*
 * WCAG 2.1 relative luminance and contrast ratio, shared by `node scripts/contrast.mjs`
 * (the table DESIGN.md quotes) and scripts/verify-site.mjs (the guard). Written here once so
 * the number in the contract and the number that fails a build cannot differ.
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

/** A ratio rounded the way DESIGN.md writes it: two decimals, one decimal implied zero kept. */
export const ratio = (a, b) => Math.round(contrastRatio(a, b) * 100) / 100;
