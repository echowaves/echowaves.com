// dev.to API client for fetching articles by user

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

export interface DevToBlogData {
  posts: DevToArticle[];
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
  yearsActive: string;
}

/**
 * Fetch all articles for dmitryame from the dev.to API.
 * Returns the raw response array, with tag_list normalized to a string array.
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
      : String(a.tag_list || '').split(',').map((t: string) => t.trim()).filter(Boolean),
  }));
}

/**
 * Fetch and format article data for the Blog component.
 * Returns recent 7 posts with pinned post (ID 84334) always included.
 */
export async function getBlogData(): Promise<DevToBlogData> {
  const allArticles = await fetchAllArticles();
  
  // Sort by published_at descending (newest first)
  const sorted = allArticles.sort((a, b) =>
    new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
  
  // Always include the pinned "classic" post
  const latest = sorted.slice(0, 6);
  const pinned = sorted.find(a => a.id === PINNED_ARTICLE_ID);
  
  let posts: DevToArticle[] = [...latest];
  if (pinned && !posts.find(p => p.id === pinned.id)) {
    posts.push({ ...pinned, pinned: true });
  }
  
  // Compute stats
  const totalComments = allArticles.reduce((sum, a) => sum + a.comments_count, 0);
  const totalReactions = allArticles.reduce((sum, a) => sum + a.positive_reactions_count, 0);
  
  const earliest = allArticles.reduce((min, a) => {
    const cur = new Date(a.published_at).getTime();
    const prev = new Date(min).getTime();
    return cur < prev ? a.published_at : min;
  }, allArticles[0].published_at);
  
  const years = Math.floor((Date.now() - new Date(earliest).getTime()) / (365 * 24 * 60 * 60 * 1000));
  const yearsActive = `${years}+`;
  
  return {
    posts,
    totalPosts: allArticles.length,
    totalComments,
    totalReactions,
    yearsActive,
  };
}