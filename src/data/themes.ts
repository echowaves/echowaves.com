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
 * Values are each palette's published hexes (see `source` on every theme). DESIGN.md records
 * the measured contrast table; the human ruling for this feature is that canonical hexes ship
 * as published, and only Phosphor — the site's own palette — is held to measured AA.
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
 * `npm run verify` holds a `measured` palette to these numbers; a palette shipping canonical
 * hexes is held to a legibility floor instead, because bending someone else's published palette to
 * 4.5:1 would stop it being that palette (the decision is recorded in this feature's spec).
 */
export const CONTRAST_ROLES: { token: TokenName; against: TokenName; label: string; aa: number }[] = [
  { token: 'text', against: 'background', label: 'headlines', aa: 4.5 },
  { token: 'text-dim', against: 'background', label: 'body copy', aa: 4.5 },
  { token: 'accent', against: 'background', label: 'prompt, links', aa: 4.5 },
  { token: 'emphasis', against: 'background', label: 'one emphasis', aa: 4.5 },
  { token: 'danger', against: 'background', label: 'refusal red', aa: 4.5 },
  { token: 'ink-on-accent', against: 'accent', label: 'ink on accent', aa: 4.5 },
  // A rule is a boundary, not text: 3:1. Light palettes publish pale rules on purpose, so this
  // one is only enforced where the palette was tuned for it.
  { token: 'border', against: 'background', label: 'rules, frame', aa: 3 },
];

/**
 * Below this a colour is not a style choice any more. Scoped to the text roles in
 * `CONTRAST_ROLES` — every palette clears it on all six, while rules deliberately sit below it:
 * a light palette publishes pale borders (1.45:1 to 1.69:1) and that is the palette, not a defect.
 */
export const LEGIBILITY_FLOOR = 2.5;

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
   * True for a palette this site tuned itself, false for one it inherited. A measured palette is
   * held to WCAG AA on every role in `CONTRAST_ROLES`; an inherited one ships its published hexes
   * and is held to the legibility floor, with anything below AA named in DESIGN.md's table.
   */
  measured?: boolean;
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
    label: 'Solarized Light',
    group: 'light',
    source:
      'Solarized (Ethan Schoonover) light scheme — grounds base3 (#fdf6e3) and base2 (#eee8d5), text base02/base01, rules base0/base1, plus the orange/blue/red accents. The yellow (#b58900) is the palette’s own emphasis hue but measures 2.98:1 on the light ground base3 (#fdf6e3), so the orange takes the role here; panel-raised is a 5% tint of base2 toward base02, because Solarized publishes two grounds per scheme',
    tokens: {
      background: '#fdf6e3',
      panel: '#eee8d5',
      'panel-raised': '#e2dfce',
      desk: '#93a1a1',
      border: '#839496',
      'decoration-green': '#93a1a1',
      text: '#073642',
      'text-dim': '#586e75',
      accent: '#268bd2',
      emphasis: '#cb4b16',
      danger: '#dc322f',
      'ink-on-accent': '#fdf6e3',
    },
  },
  {
    id: 'one-light',
    label: 'One Light',
    group: 'light',
    source:
      'Atom One Light (`@mono-*`, `@hue-*`, `@syntax-bg` from one-light-syntax); panel and panel-raised darken the published ground by 3% and 6% lightness, the same LESS operation the palette file uses for its gutter grey',
    tokens: {
      background: '#fafafa',
      panel: '#f2f2f2',
      'panel-raised': '#eaeaeb',
      desk: '#696c77',
      border: '#a0a1a7',
      'decoration-green': '#a0a1a7',
      text: '#383a42',
      'text-dim': '#696c77',
      accent: '#4078f2',
      emphasis: '#986801',
      danger: '#e45649',
      'ink-on-accent': '#ffffff',
    },
  },
  {
    id: 'gruvbox-light',
    label: 'Gruvbox Light',
    group: 'light',
    source: 'Gruvbox (Moria de Bar) light background ramp bg0…bg4, fg greys and the bright accents',
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
      emphasis: '#b57600',
      danger: '#9d0006',
      'ink-on-accent': '#fbf1c7',
    },
  },
  {
    id: 'dracula',
    label: 'Dracula',
    group: 'dark',
    source: 'Dracula spec palette (background, current line, comment, cyan, orange, red)',
    tokens: {
      background: '#282a36',
      panel: '#44475a',
      'panel-raised': '#6272a4',
      desk: '#21222c',
      border: '#6272a4',
      'decoration-green': '#6272a4',
      text: '#f8f8f2',
      'text-dim': '#6272a4',
      accent: '#8be9fd',
      emphasis: '#ffb86c',
      danger: '#ff5555',
      'ink-on-accent': '#282a36',
    },
  },
  {
    id: 'nord',
    label: 'Nord',
    group: 'dark',
    source: 'Nord polar north nord0…nord6, nord8, nord11 and nord13',
    tokens: {
      background: '#2e3440',
      panel: '#434c5e',
      'panel-raised': '#4c566a',
      desk: '#3b4252',
      border: '#4c566a',
      'decoration-green': '#4c566a',
      text: '#eceff4',
      'text-dim': '#d8dee9',
      accent: '#88c0d0',
      emphasis: '#ebcb8b',
      danger: '#bf616a',
      'ink-on-accent': '#2e3440',
    },
  },
  {
    id: 'solarized-dark',
    label: 'Solarized Dark',
    group: 'dark',
    source:
      'Solarized dark scheme — ground base03 (#002b36), panel base02, rules base01/base1, text base3/base1, plus the accents; panel-raised is an 8% tint of base02 toward base3, because Solarized publishes two grounds per scheme',
    tokens: {
      background: '#002b36',
      panel: '#073642',
      'panel-raised': '#1b454f',
      desk: '#073642',
      border: '#586e75',
      'decoration-green': '#586e75',
      text: '#fdf6e3',
      'text-dim': '#93a1a1',
      accent: '#2aa198',
      emphasis: '#b58900',
      danger: '#dc322f',
      'ink-on-accent': '#002b36',
    },
  },
];

/** The four-way preference, GitHub's model. */
export const MODES = ['light', 'dark', 'system', 'custom'] as const;
export type ThemeMode = (typeof MODES)[number];

export const MODE_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
  custom: 'Custom',
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

/** Payload for the pre-paint script: enough to resolve and paint, nothing more. */
export const themeScriptPayload = () => ({
  themes: themes.map((theme) => ({ id: theme.id, group: theme.group, bg: theme.tokens.background })),
  defaults: { light: defaultTheme('light').id, dark: defaultTheme('dark').id },
  modes: MODES as unknown as string[],
  storageKey: STORAGE_KEY,
  // Per size, the href with its id left blank — rendered by `faviconHref`, so the script paints
  // the writer's filenames and cannot invent a tidier one of its own.
  faviconTemplates: Object.fromEntries(
    FAVICON_SIZES.map((px) => [String(px), faviconHref('{id}', px)])
  ) as Record<string, string>,
});
