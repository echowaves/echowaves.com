/*
 * The theme registry: every palette the site can render, in one place.
 *
 * This module is the single source of truth for four consumers:
 *   - src/index.css      — the generated palette blocks between the `themes:begin` /
 *                          `themes:end` sentinels (see scripts/make-themes.mjs);
 *   - BaseLayout.astro   — the pre-paint theme script's payload (ids, groups, tab colour);
 *   - ThemeControl.astro — the options in the titlebar control;
 *   - scripts/make-icons.mjs — the per-theme favicon variants.
 * `npm run verify` fails if the stylesheet region and this registry disagree, so a palette
 * added here cannot half-ship.
 *
 * Values start as each palette's published hexes (see `source` on every theme), and DESIGN.md
 * records the measured contrast table. Guest palettes keep published hexes except where a text
 * role falls below AA on a surface it renders on: then the hue is kept and only the lightness
 * moves the minimum to clear 4.5:1, and the move is recorded in `source` beside it (ruling of
 * 2026-10-26, superseding the first theming release's "published hexes as-is", which shipped
 * invisible Dracula body copy).
 */

export type ThemeGroup = 'light' | 'dark';

/** The colour tokens every palette must declare, in the order they are written out. */
export const TOKEN_NAMES = [
  'background',
  'panel',
  'panel-raised',
  'desk',
  'border',
  'decoration-green',
  'text',
  'text-dim',
  'accent',
  'emphasis',
  'danger',
  'ink-on-accent',
] as const;

export type TokenName = (typeof TOKEN_NAMES)[number];

/**
 * The tokens a reader has to be able to see, what each is measured against, and the WCAG target.
 * A role is listed once per surface its text actually renders on — body copy on `background`,
 * tab labels and footer meta on `panel` (the chrome paints panel), hero chips on `panel-raised`.
 * `npm run verify` holds every palette — this site's own or a guest's — to these numbers on text
 * roles. A guest hex below 4.5 nudges in lightness, never hue, until it clears; the only
 * exemption left is the rule token, where pale published borders are the palette being itself.
 */
export const CONTRAST_ROLES: { token: TokenName; against: TokenName; label: string; aa: number }[] = [
  { token: 'text', against: 'background', label: 'headlines', aa: 4.5 },
  { token: 'text-dim', against: 'background', label: 'body copy', aa: 4.5 },
  { token: 'accent', against: 'background', label: 'prompt, links', aa: 4.5 },
  { token: 'emphasis', against: 'background', label: 'one emphasis', aa: 4.5 },
  { token: 'danger', against: 'background', label: 'refusal red', aa: 4.5 },
  { token: 'ink-on-accent', against: 'accent', label: 'ink on accent', aa: 4.5 },
  // The same roles again on the surfaces the chrome paints: `.tab`, `.path` and footer meta are
  // text-dim on panel, `.host` and footer links are accent on panel, hero chips are body copy on
  // panel-raised. Measuring only against background is how Dracula's tab labels stayed at 2.97:1.
  { token: 'text-dim', against: 'panel', label: 'tabs & meta on panel', aa: 4.5 },
  { token: 'accent', against: 'panel', label: 'links on panel', aa: 4.5 },
  { token: 'text', against: 'panel-raised', label: 'copy on raised', aa: 4.5 },
  // A rule is a boundary, not text: 3:1. Light palettes publish pale rules on purpose, so this
  // one is only enforced where the palette was tuned for it.
  { token: 'border', against: 'background', label: 'rules, frame', aa: 3 },
];

export interface Theme {
  /** URL-safe id; becomes `html[data-theme="<id>"]` and the favicon file suffix. */
  id: string;
  /** What the control shows. */
  label: string;
  group: ThemeGroup;
  /** The palette this group falls back to when nothing is stored. Exactly one per group. */
  isDefault?: boolean;
  /** Where the hexes come from, so a reader can check them and DESIGN.md can cite them. */
  source: string;
  /**
   * True for a palette this site tuned itself, false for one it inherited. Every palette is held
   * to WCAG AA on the text roles in `CONTRAST_ROLES`; `measured` additionally binds its rule token
   * to 3:1, because an inherited palette's pale published rules are part of that palette.
   */
  measured?: boolean;
  /** True when a published hex moved to clear AA; each move is narrated in `source`. */
  nudged?: boolean;
  tokens: Record<TokenName, string>;
}

export const themes: Theme[] = [
  {
    id: 'phosphor',
    label: 'Phosphor',
    group: 'dark',
    isDefault: true,
    measured: true,
    source:
      'this site, measured against #060606 (DESIGN.md → Colors); the original dark-only palette',
    tokens: {
      background: '#060606',
      panel: '#0d0d0d',
      'panel-raised': '#101010',
      desk: '#1c1c1e',
      border: '#2b7a3a',
      'decoration-green': '#2b7a3a',
      text: '#8dfa9c',
      'text-dim': '#3fa852',
      accent: '#33d24b',
      emphasis: '#febc2e',
      danger: '#ff5f57',
      'ink-on-accent': '#04120a',
    },
  },
  {
    id: 'github-light',
    label: 'GitHub Light',
    group: 'light',
    isDefault: true,
    source: 'GitHub Primer light (`fgColor`/`bgColor` published values)',
    tokens: {
      background: '#ffffff',
      panel: '#f6f8fa',
      'panel-raised': '#eaeef2',
      desk: '#eff2f5',
      border: '#d0d7de',
      'decoration-green': '#d0d7de',
      text: '#1f2328',
      'text-dim': '#656d76',
      accent: '#0969da',
      emphasis: '#9a6700',
      danger: '#cf222e',
      'ink-on-accent': '#ffffff',
    },
  },
  {
    id: 'solarized-light',
    nudged: true,
    label: 'Solarized Light',
    group: 'light',
    source:
      'Solarized (Ethan Schoonover) light scheme — grounds base3 (#fdf6e3) and base2 (#eee8d5), text base02/base01, rules base0/base1, plus the orange/blue/red accents. The yellow (#b58900) is the palette’s own emphasis hue but measures 2.98:1 on the light ground base3 (#fdf6e3), so the orange takes the role here; panel-raised is a 5% tint of base2 toward base02, because Solarized publishes two grounds per scheme. Blue, orange and red are darkened in lightness only (from #268bd2, #cb4b16, #dc322f) so prompt, emphasis and refusal clear text AA on both grounds, and base01 body copy likewise (from #586e75), which fell below AA on the panel ground',
    tokens: {
      background: '#fdf6e3',
      panel: '#eee8d5',
      'panel-raised': '#e2dfce',
      desk: '#93a1a1',
      border: '#839496',
      'decoration-green': '#93a1a1',
      text: '#073642',
      'text-dim': '#566b72',
      accent: '#1e6ca3',
      emphasis: '#c24815',
      danger: '#d72724',
      'ink-on-accent': '#fdf6e3',
    },
  },
  {
    id: 'one-light',
    nudged: true,
    label: 'One Light',
    group: 'light',
    source:
      'Atom One Light (`@mono-*`, `@hue-*`, `@syntax-bg` from one-light-syntax); panel and panel-raised darken the published ground by 3% and 6% lightness, the same LESS operation the palette file uses for its gutter grey; blue and red are darkened in lightness only (from #4078f2, #e45649) to clear text AA on the ground and on the panel chrome',
    tokens: {
      background: '#fafafa',
      panel: '#f2f2f2',
      'panel-raised': '#eaeaeb',
      desk: '#696c77',
      border: '#a0a1a7',
      'decoration-green': '#a0a1a7',
      text: '#383a42',
      'text-dim': '#696c77',
      accent: '#2363f0',
      emphasis: '#986801',
      danger: '#d72f20',
      'ink-on-accent': '#ffffff',
    },
  },
  {
    id: 'gruvbox-light',
    nudged: true,
    label: 'Gruvbox Light',
    group: 'light',
    source: 'Gruvbox (Moria de Bar) light background ramp bg0…bg4, fg greys and the bright accents; the orange is darkened in lightness only (from #b57600) to clear text AA on the cream ground',
    tokens: {
      background: '#fbf1c7',
      panel: '#f2e5bc',
      'panel-raised': '#ebdbb2',
      desk: '#7c6f64',
      border: '#d5c4a1',
      'decoration-green': '#bdae93',
      text: '#282828',
      'text-dim': '#504945',
      accent: '#076678',
      emphasis: '#966200',
      danger: '#9d0006',
      'ink-on-accent': '#fbf1c7',
    },
  },
  {
    id: 'dracula',
    nudged: true,
    label: 'Dracula',
    group: 'dark',
    source: 'Dracula spec palette (background, current line, comment, cyan, orange, red); body copy is Comment lightened in lightness only (from #6272a4, which measured 3.03:1 on Background — the invisible-text complaint of 2026-10-26) until it clears AA on Background and on the panel chrome alike; panel-raised is the same Comment darkened to hold Foreground at AA in hero chips, while rules and decoration keep the published Comment',
    tokens: {
      background: '#282a36',
      panel: '#44475a',
      'panel-raised': '#5f70a3',
      desk: '#21222c',
      border: '#6272a4',
      'decoration-green': '#6272a4',
      text: '#f8f8f2',
      'text-dim': '#afb7d1',
      accent: '#8be9fd',
      emphasis: '#ffb86c',
      danger: '#ff5555',
      'ink-on-accent': '#282a36',
    },
  },
  {
    id: 'nord',
    nudged: true,
    label: 'Nord',
    group: 'dark',
    source: 'Nord polar north nord0…nord6, nord8, nord11 and nord13; the red is nord11 (#bf616a) and the frost blue nord8 (#88c0d0) each moved in lightness only to clear text AA on nord0 and on the panel chrome',
    tokens: {
      background: '#2e3440',
      panel: '#434c5e',
      'panel-raised': '#4c566a',
      desk: '#3b4252',
      border: '#4c566a',
      'decoration-green': '#4c566a',
      text: '#eceff4',
      'text-dim': '#d8dee9',
      accent: '#91c5d3',
      emphasis: '#ebcb8b',
      danger: '#d08b91',
      'ink-on-accent': '#2e3440',
    },
  },
  {
    id: 'solarized-dark',
    nudged: true,
    label: 'Solarized Dark',
    group: 'dark',
    source:
      'Solarized dark scheme — ground base03 (#002b36), panel base02, rules base01/base1, text base3/base1, plus the accents; panel-raised is an 8% tint of base02 toward base3, because Solarized publishes two grounds per scheme. Red and cyan are lightened in lightness only (from #dc322f, #2aa198) to clear text AA on base03 and on the panel chrome',
    tokens: {
      background: '#002b36',
      panel: '#073642',
      'panel-raised': '#1b454f',
      desk: '#073642',
      border: '#586e75',
      'decoration-green': '#586e75',
      text: '#fdf6e3',
      'text-dim': '#93a1a1',
      accent: '#2caaa0',
      emphasis: '#b58900',
      danger: '#e56663',
      'ink-on-accent': '#002b36',
    },
  },
];

/**
 * The three-way preference. `system` follows the OS between the stored pair, so a fourth "custom"
 * mode would only re-name System with non-default pins — dropped 2026-10-27; a stored `custom`
 * resolves as `system` (the runtime's mode list no longer contains it).
 */
export const MODES = ['light', 'dark', 'system'] as const;
export type ThemeMode = (typeof MODES)[number];

export const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

/** The label of a mode option: the mode plus the palette it paints ("Light — Solarized Light"). */
export const paintedModeLabel = (
  mode: Extract<ThemeMode, 'light' | 'dark'>,
  theme: { label: string }
): string => `${MODE_LABELS[mode]} — ${theme.label}`;

/** The two set-default section labels of the control, keyed by group. */
export const SET_DEFAULT_LABELS: Record<ThemeGroup, string> = {
  light: 'Set light default',
  dark: 'Set dark default',
};

/** Where the preference lives. Corrupt or unreadable data is ignored, never fatal. */
export const STORAGE_KEY = 'echowaves.theme';

export const themesInGroup = (group: ThemeGroup): Theme[] =>
  themes.filter((theme) => theme.group === group);

export const themeById = (id: string | undefined | null): Theme | undefined =>
  themes.find((theme) => theme.id === id);

/** The palette a group falls back to when nothing is stored or the stored id is unknown. */
export const defaultTheme = (group: ThemeGroup): Theme =>
  themesInGroup(group).find((theme) => theme.isDefault) ?? themesInGroup(group)[0];

/** `#rrggbb` only: contrast maths, the manifest and the favicon tint all read these. */
export const isHex = (value: string): boolean => /^#[0-9a-f]{6}$/.test(value);

/**
 * The one spelling of a favicon's filename. `npm run icons` writes these paths, the pre-paint
 * script rewrites `link[rel~="icon"]` to them, and `npm run verify` asserts against them — three
 * consumers, one template, because a head that swaps to `/favicon-16x16-dracul.png` fails silently.
 * The pattern travels to the runtime in the payload so the script cannot invent its own.
 */
const FAVICON_PATTERN = '/favicon-{px}x{px}-{id}.png';

/** The two sizes the head links and the runtime swaps. Anything else is a file nobody asked for. */
export const FAVICON_SIZES = [16, 32];

export const faviconHref = (id: string, px: number): string =>
  FAVICON_PATTERN.split('{px}').join(String(px)).split('{id}').join(id);

/**
 * The CSS one palette contributes: an attribute-keyed block on `<html>` carrying the group's
 * `color-scheme` and every colour token, in the order `TOKEN_NAMES` lists them. Written into
 * src/index.css by scripts/make-themes.mjs; `npm run verify` compares the region against this
 * function so the stylesheet cannot drift from the registry.
 */
export const themeBlockCss = (theme: Theme): string => {
  const declarations = TOKEN_NAMES.map((token) => `  --${token}: ${theme.tokens[token]};`).join('\n');
  return `html[data-theme="${theme.id}"] {\n  color-scheme: ${theme.group};\n${declarations}\n}`;
};

/**
 * The no-script fallback: with nothing stored there is no `data-theme`, so each scheme gets its
 * group's default palette from the media query alone. Same values as the two default blocks,
 * generated from the same registry.
 */
export const fallbackCss = (): string => {
  const light = defaultTheme('light');
  const block = lightBlockBody(light);
  return (
    '@media (prefers-color-scheme: light) {\n' +
    `  html:not([data-theme]) {\n    color-scheme: light;\n${block}\n  }\n}`
  );
};

const lightBlockBody = (theme: Theme): string =>
  TOKEN_NAMES.map((token) => `    --${token}: ${theme.tokens[token]};`).join('\n');

/** The whole generated region, sentinels included. */
export const themesRegionCss = (): string => {
  const blocks = themes.map(themeBlockCss).join('\n\n');
  return [
    '/* themes:begin — generated from src/data/themes.ts by `node scripts/make-themes.mjs`.',
    '   Do not hand-edit a palette: the registry is the source of truth, and `npm run verify`',
    '   fails when this region, src/data/themes.ts and the built head disagree. */',
    '',
    blocks,
    '',
    '/* Every palette above is attribute-keyed on <html>, which outranks the plain `:root` the',
    '   print and forced-colours blocks used to carry. Those two therefore match `:root:root`:',
    '   same declarations, same behaviour, specificity that still wins over a theme. */',
    '',
    fallbackCss(),
    '',
    '/* themes:end */',
  ].join('\n');
};

/** Payload for the pre-paint script: enough to resolve, paint and label, nothing more. */
export const themeScriptPayload = () => ({
  // `label` travels so the control's dynamic option labels ("Light — Solarized Light") can be
  // re-written by the runtime from the same registry the markup renders, not a second copy.
  themes: themes.map((theme) => ({
    id: theme.id,
    group: theme.group,
    label: theme.label,
    bg: theme.tokens.background,
  })),
  defaults: { light: defaultTheme('light').id, dark: defaultTheme('dark').id },
  modes: MODES as unknown as string[],
  modeLabels: MODE_LABELS as unknown as Record<string, string>,
  storageKey: STORAGE_KEY,
  // Per size, the href with its id left blank — rendered by `faviconHref`, so the script paints
  // the writer's filenames and cannot invent a tidier one of its own.
  faviconTemplates: Object.fromEntries(
    FAVICON_SIZES.map((px) => [String(px), faviconHref('{id}', px)])
  ) as Record<string, string>,
});
