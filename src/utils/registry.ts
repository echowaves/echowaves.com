// Build-time registry figures for the Open source section.
//
// Isolated on purpose: the rest of the site only sees a snapshot whose figures
// are either numbers or null. Every provider call is caught individually, so an
// offline build degrades to "no figures" instead of failing, and `ECHOWAVES_OFFLINE=1`
// skips the network entirely. The package list is passed in so this module has no
// runtime imports of its own and can be exercised directly by scripts/verify-site.mjs.

import type { Package } from '../data/site.ts';

export const NPM_DOWNLOADS_ENDPOINT = 'https://api.npmjs.org/downloads/point/last-week';
/** Full npm packument: used for the publish date when a repo has no GitHub Releases. */
export const NPM_PACKUMENT_ENDPOINT = 'https://registry.npmjs.org';
export const GITHUB_REPO_ENDPOINT = 'https://api.github.com/repos/echowaves';

const TIMEOUT_MS = 8000;

/** Rendered by the Open source section when a build produced no registry figures. */
export const OFFLINE_NOTE =
  'Figures verified at build time. The npm registry and GitHub API were not reachable for this build, so no figures are shown.';

/** Rendered beside figures so a live number says where it came from. */
export const FIGURES_NOTE =
  'Figures read from the npm registry and GitHub API at build time; they move without the page changing.';

export interface PackageStats {
  /** Package name from src/data/site.ts, used to match figures to markup. */
  name: string;
  npmPackage: string;
  repositoryUrl: string;
  npmUrl: string;
  weeklyDownloads: number | null;
  stars: number | null;
  /** ISO date of the latest published release, when the repository has one. */
  lastRelease: string | null;
}

export interface RegistrySnapshot {
  offline: boolean;
  collectedAt: string;
  packages: PackageStats[];
  /** True when at least one figure came back from a registry. */
  hasFigures: boolean;
}

type FetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<any>;
};

export type FetchLike = (
  input: string,
  init?: { signal?: AbortSignal; headers?: Record<string, string> }
) => Promise<FetchResponse>;

export interface CollectOptions {
  env?: Record<string, string | undefined>;
  fetchImpl?: FetchLike;
  now?: () => Date;
}

export function isOffline(env: Record<string, string | undefined> = {}): boolean {
  const flag = env.ECHOWAVES_OFFLINE;
  return flag === '1' || flag === 'true';
}

function emptyStats(pkg: Package): PackageStats {
  return {
    name: pkg.name,
    npmPackage: pkg.npmPackage,
    repositoryUrl: `https://github.com/echowaves/${pkg.repo}`,
    npmUrl: `https://www.npmjs.com/package/${pkg.npmPackage}`,
    weeklyDownloads: null,
    stars: null,
    lastRelease: null,
  };
}

async function getJson(fetchImpl: FetchLike, url: string, label: string): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const response = await fetchImpl(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'echowaves.com build' },
    });
    clearTimeout(timer);
    if (!response.ok) {
      console.warn(`[registry] ${label} returned ${response.status}; figure omitted for this build.`);
      return null;
    }
    return await response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[registry] ${label} unavailable (${message}); figure omitted for this build.`);
    return null;
  }
}

function toCount(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function toDate(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

async function collectOne(pkg: Package, fetchImpl: FetchLike): Promise<PackageStats> {
  const stats = emptyStats(pkg);

  const downloads = await getJson(
    fetchImpl,
    `${NPM_DOWNLOADS_ENDPOINT}/${pkg.npmPackage}`,
    `npm downloads for ${pkg.npmPackage}`
  );
  stats.weeklyDownloads = toCount(downloads?.downloads);

  const repo = await getJson(fetchImpl, `${GITHUB_REPO_ENDPOINT}/${pkg.repo}`, `GitHub repo ${pkg.repo}`);
  stats.stars = toCount(repo?.stargazers_count);

  const release = await getJson(
    fetchImpl,
    `${GITHUB_REPO_ENDPOINT}/${pkg.repo}/releases/latest`,
    `GitHub latest release for ${pkg.repo}`
  );
  // Only a real date is kept: a tag name would read as "last release v3.2.1".
  stats.lastRelease = toDate(release?.published_at) ?? toDate(release?.created_at);

  // Repositories that publish to npm without GitHub Releases still have a last
  // release; the packument carries the date of the version currently tagged latest.
  if (!stats.lastRelease) {
    const packument = await getJson(
      fetchImpl,
      `${NPM_PACKUMENT_ENDPOINT}/${pkg.npmPackage}`,
      `npm publish history for ${pkg.npmPackage}`
    );
    const latest = packument?.['dist-tags']?.latest;
    stats.lastRelease = toDate(latest ? packument?.time?.[latest] : null);
  }

  return stats;
}

export async function collectRegistryStats(
  packages: Package[],
  options: CollectOptions = {}
): Promise<RegistrySnapshot> {
  const env = options.env ?? (typeof process !== 'undefined' ? process.env : {});
  const now = options.now ?? (() => new Date());

  if (isOffline(env)) {
    return {
      offline: true,
      collectedAt: now().toISOString(),
      packages: packages.map((pkg) => emptyStats(pkg)),
      hasFigures: false,
    };
  }

  const fetchImpl: FetchLike = options.fetchImpl ?? (fetch as unknown as FetchLike);
  const collected: PackageStats[] = [];
  for (const pkg of packages) {
    collected.push(await collectOne(pkg, fetchImpl));
  }

  return {
    offline: false,
    collectedAt: now().toISOString(),
    packages: collected,
    hasFigures: collected.some(
      (p) => p.weeklyDownloads !== null || p.stars !== null || p.lastRelease !== null
    ),
  };
}

export function statsFor(snapshot: RegistrySnapshot | null, name: string): PackageStats | undefined {
  return snapshot?.packages.find((p) => p.name === name);
}

export function formatCount(value: number | null): string | null {
  if (value === null) return null;
  return value.toLocaleString('en-US');
}

/** Formats an ISO timestamp as YYYY-MM-DD; anything that is not a date shows no figure. */
export function formatReleaseDate(value: string | null): string | null {
  if (!value) return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
  return match ? match[1] : null;
}
