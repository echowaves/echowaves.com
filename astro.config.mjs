import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://echowaves.com',
  output: 'static',
  // /wisaw used to be an Astro `redirects` entry, which produced a headless
  // meta-refresh stub: correct for browsers, invisible to every scraper, so links
  // shared years ago rendered without a title or social card. src/pages/wisaw.astro
  // is a real page that carries the metadata and still forwards. It stays out of the
  // sitemap because /builds/wisaw is the canonical URL for the same story.
  integrations: [sitemap({ filter: (page) => !page.endsWith('/wisaw/') })],
});
