import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://echowaves.com',
  output: 'static',
  // The case study moved under /builds; the old URL is published and in the sitemap.
  redirects: {
    '/wisaw': '/builds/wisaw',
  },
  integrations: [sitemap()],
});
