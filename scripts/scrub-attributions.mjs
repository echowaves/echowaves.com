#!/usr/bin/env node
// One-off scrub of client-attributed employment detail from _bmad-output artifacts,
// so the folder can be versioned. Numbers stay (the site already publishes them
// unattributed); employer and awarding-body names go.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.argv[2] ?? '_bmad-output';
const DASH = '[\\u2013\\u2014-]'; // en dash, em dash, hyphen

// Ordered: specific phrasings first, bare names last.
const RULES = [
  [new RegExp(`J\\.?D\\.? ?Power:? ?an employer`, 'gi'), 'the awarding body'],
  [/Does the J\.D\. Power attribution stay company-level \(already public reporting\)/gi, 'Does the awarding-body attribution stay company-level (already public reporting)'],
  [/externally published and curre/gi, 'published and curre'],
  [new RegExp(`J\\.?D\\.? ?Power`, 'gi'), 'the awarding body'],
  [new RegExp(`(2011${DASH}\\s?15)\\s*,?\\s*VP of SWE, an employer`, 'gi'), '$1 VP of SWE at an employer'],
  [new RegExp(`an employer VP of SWE (2011${DASH}2015)`, 'gi'), 'VP of SWE at an employer $1'],
  [/VP SWE, an employer/gi, 'VP SWE at an employer'],
  [/@ an employer \(VP SWE\)/gi, 'at an employer (VP SWE)'],
  [/\(an employer\)/gi, '(an employer)'],
  [/· an employer/gi, '· an employer'],
  [/an employer/gi, 'an employer'],
  [/an employer mobile/gi, 'enterprise mobile at an employer'],
  [/an employer \(Fortune 100\)/gi, 'a Fortune 100 employer'],
  [/an employer, Mobile/gi, 'an employer, Mobile'],
  [/an employer · Fortune 100/gi, 'a Fortune 100 employer'],
  [/an employer · People Leader, Mobile Engineering/gi, 'People Leader, Mobile Engineering at a Fortune 100 employer'],
  [/At an employer I cut/gi, 'At one employer I cut'],
  [/'an employer Mobile, /g, "'Enterprise Mobile at an Employer, "],
  [/an employer/gi, 'an employer'],
  [/an employer/g, 'an employer'],
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(md|html|txt|yaml|json)$/.test(e)) out.push(p);
  }
  return out;
}

let files = 0;
let hits = 0;
for (const file of walk(ROOT)) {
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const [re, to] of RULES) {
    const n = (after.match(re) || []).length;
    if (n) {
      hits += n;
      after = after.replace(re, to);
    }
  }
  if (after !== before) {
    writeFileSync(file, after);
    files++;
    console.log(`scrubbed ${file}`);
  }
}
console.log(`\n${files} files changed, ${hits} replacements`);
