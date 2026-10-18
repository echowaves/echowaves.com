// Machine-readable read of the same content the page renders: GET /impact.json
//
// Built from the module the sections render from, so a served figure and a
// rendered figure cannot drift apart. scripts/verify-site.mjs asserts that
// parity on every `npm run verify`.

import { buildImpactPayload } from '../data/site.ts';

export const prerender = true;

export function GET() {
  return new Response(JSON.stringify(buildImpactPayload(), null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
