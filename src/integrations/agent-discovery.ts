// Writes the agent-discovery artifacts at the end of every build: /llms.txt and the ARD
// catalog under both well-known names.
//
// A build hook rather than a `npm run` generator or a page route, for two reasons. The files
// are derived from src/data/site.ts, so generating them inside the build is what makes a stale
// artifact impossible — a generator someone forgets to re-run is exactly the drift CAP-3 of
// _bmad-output/specs/spec-agent-discovery-and-contrast exists to refuse. And `.well-known`
// cannot be a page route: Vite's route glob skips dot-prefixed directories, so a file there
// would never be emitted at all.
//
// Both names are written with identical content on purpose. Lighthouse's audit probes
// `/.well-known/ard.json`; the ARD v1.0 library names `/.well-known/ai-catalog.json`. Nothing
// says which one survives, and this site is deployed by hand, so betting on one costs a deploy
// to find out. Content-Type comes from whatever serves dist/ — the spec makes that type a
// SHOULD, and the audit parses the body, so JSON under any type still passes.

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { buildAiCatalog, buildLlmsTxt } from '../data/site.ts';

const WELL_KNOWN = ['ard.json', 'ai-catalog.json'];

export default function agentDiscovery(): AstroIntegration {
  return {
    name: 'agent-discovery',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const dist = fileURLToPath(dir);
        const catalog = `${JSON.stringify(buildAiCatalog(), null, 2)}\n`;

        writeFileSync(path.join(dist, 'llms.txt'), buildLlmsTxt(), 'utf8');
        for (const name of WELL_KNOWN) {
          const at = path.join(dist, '.well-known', name);
          mkdirSync(path.dirname(at), { recursive: true });
          writeFileSync(at, catalog, 'utf8');
        }
      },
    },
  };
}
