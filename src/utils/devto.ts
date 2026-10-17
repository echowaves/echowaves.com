// dev.to API client — build-time only (AD-5).
// Returns a snapshot with honest metadata: no synthetic counts, no fabricated freshness.

const DEVTO_API = 'https://dev.to/api/articles';
const PINNED_ARTICLE_ID = 84334; // The 2019 "Classic" minimalist architecture post

export interface DevToArticle {
  id: number;
  title: string;
  description: string;
  published_at: string;
  readable_publish_date: string;
  reading_time_minutes: number;
  tag_list: string[];
  url: string;
  comments_count: number;
  positive_reactions_count: number;
  pinned?: boolean;
}

export interface DevToSnapshot {
  posts: DevToArticle[];
  /** Present only when the snapshot was actually produced by this build. */
  fetchedAt?: string;
}

/**
 * Fetch all articles for dmitryame from the dev.to API.
 * tag_list is normalized to a string array.
 */
export async function fetchAllArticles(): Promise<DevToArticle[]> {
  const url = `${DEVTO_API}?username=dmitryame&per_page=100`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`dev.to API returned ${response.status}`);
  }

  const raw = await response.json();
  return raw.map((a: any) => ({
    ...a,
    tag_list: Array.isArray(a.tag_list)
      ? a.tag_list
      : String(a.tag_list || '')
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean),
  }));
}

/**
 * Build-time snapshot: recent posts with the pinned post always included.
 * fetchedAt reflects the real build moment of a successful fetch — nothing more.
 */
export async function getBlogData(): Promise<DevToSnapshot> {
  const allArticles = await fetchAllArticles();

  const sorted = [...allArticles].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const latest = sorted.slice(0, 6);
  const pinned = sorted.find((a) => a.id === PINNED_ARTICLE_ID);

  const posts: DevToArticle[] = [...latest];
  if (pinned && !posts.find((p) => p.id === pinned.id)) {
    posts.push({ ...pinned, pinned: true });
  }

  return {
    posts,
    fetchedAt: new Date().toISOString(),
  };
}
