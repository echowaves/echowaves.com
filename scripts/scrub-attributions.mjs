#!/usr/bin/env node
// One-off scrub of client-attributed employment detail from _bmad-output artifacts,
// so the folder can be versioned. Numbers stay (the site already publishes them
// unattributed); employer and awarding-body names go.
//
// The names themselves live OUTSIDE this repository, in a JSON rules file, because a
// tracked scrubber would re-publish exactly what it removes. `npm run verify` reads the
// same file so the names cannot creep back into a commit unnoticed.
//
//   node scripts/scrub-attributions.mjs [root] [rulesFile]
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = process.argv[2] ?? '_bmad-output';

/** Where the client names live. Kept outside the repository on purpose. */
export const RULES_FILE =
  process.argv[3] ??
  process.env.ECHOWAVES_SCRUB_RULES ??
  path.join(os.homedir(), '.echowaves-local-imports', 'scrub-rules.json');

/** Reads [{ pattern, flags, replacement }] in the order they must be applied. */
export function loadRules(file = RULES_FILE) {
  let raw;
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `no scrub rules file at ${file}\n` +
          '     it holds the client names and lives outside the repository; pass a path or set ECHOWAVES_SCRUB_RULES'
      );
    }
    throw error;
  }
  if (!Array.isArray(raw.rules) || raw.rules.length === 0) {
    throw new Error(`${file} must hold a non-empty "rules" array of { pattern, flags, replacement }`);
  }
  return raw.rules.map(({ pattern, flags = 'gi', replacement }) => ({
    re: new RegExp(pattern, flags),
    replacement,
  }));
}

/** Every text artifact the scrubber is allowed to touch. */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(md|html|txt|yaml|json)$/.test(entry)) out.push(p);
  }
  return out;
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (invokedDirectly) {
  const rules = loadRules();
  let files = 0;
  let hits = 0;
  for (const file of walk(ROOT)) {
    const before = readFileSync(file, 'utf8');
    let after = before;
    for (const { re, replacement } of rules) {
      const n = (after.match(re) || []).length;
      if (n) {
        hits += n;
        after = after.replace(re, replacement);
      }
    }
    if (after !== before) {
      writeFileSync(file, after);
      files++;
      console.log(`scrubbed ${file}`);
    }
  }
  console.log(`\n${files} files changed, ${hits} replacements`);
}
