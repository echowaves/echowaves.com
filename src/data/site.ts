// Single source of truth for the copy and figures rendered by the site.
// Section components contain no literals: they read from here.
//
// Rules enforced by scripts/verify-site.mjs, run by `npm run verify`:
//   - every claim carries a non-empty `source`
//   - no hype vocabulary, emoji, job titles or employment date ranges in copy
//   - anything still needing sign-off is flagged `needsReview` and printed by the script

export interface Link {
  label: string;
  href: string;
}

export interface Identity {
  name: string;
  wordmark: string;
  location: string;
  email: string;
  links: Link[];
}

export interface Claim {
  id: string;
  metric: string;
  label: string;
  detail: string;
  /** Where the figure comes from. Never empty; checked at build time. */
  source: string;
  /** Public wording still needs Dmitry's sign-off. Reported, never rendered. */
  needsReview?: boolean;
}

export interface Step {
  title: string;
  body: string;
}

export interface Package {
  name: string;
  npmPackage: string;
  repo: string;
  summary: string;
}

export const identity: Identity = {
  name: 'Dmitry Amelchenko',
  wordmark: '~/echowaves',
  location: 'Boston, Massachusetts',
  email: 'dmitry@echowaves.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/dmitryame' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dmitryame' },
    { label: 'Dev.to', href: 'https://dev.to/dmitryame' },
  ],
};

export const hero = {
  headline: 'I solve hard problems.',
  body: [
    'The ones where the code is the easy part: a release that takes three weeks, an AI pilot that never reaches production, engineers who route around every new gate.',
    'Twenty years of that — Fortune 100 insurance, HIPAA-regulated telehealth, enterprise SaaS, a consumer social platform built from a prototype. Since 2023 the hard problem has usually been the same one: turning agentic software engineering into something an organization can actually run.',
  ],
  prompt: '$ npm install the-future',
};

/** Three figures a skimmer should get in five seconds. */
export const headlineClaims = [
  'jd-power-mobile-satisfaction',
  'release-cycle-20-to-10',
  'enps-89',
] as const;

export const claims: Claim[] = [
  {
    id: 'jd-power-mobile-satisfaction',
    metric: '+47 pts',
    label: 'Mobile app satisfaction, year over year',
    detail:
      'The same program moved overall digital customer satisfaction up 27 points and lifted the firm to fourth in its industry. Login scored 32 points above the industry average after multi-factor authentication shipped.',
    source: 'J.D. Power report, publicly reported. Wording pending sign-off.',
    needsReview: true,
  },
  {
    id: 'release-cycle-20-to-10',
    metric: '20 → 10 days',
    label: 'Release cycle, halved',
    detail:
      'Cut in half while velocity doubled and the definition of done stayed exactly where it was.',
    source: 'My professional summary. Internal measurement.',
    needsReview: true,
  },
  {
    id: 'enps-89',
    metric: '89%',
    label: 'Employee Net Promoter Score',
    detail:
      'Across direct and extended reports, against a 2–25% industry band. This is the number that decides whether people adopt a new way of working or quietly avoid it.',
    source: 'My professional summary. Internal engagement survey.',
    needsReview: true,
  },
  {
    id: 'lead-time-90-percent',
    metric: '3 months → 2 weeks',
    label: 'Lead time for changes',
    detail:
      'A ninety percent reduction: quarterly releases became on-demand delivery through pipeline automation, trunk-based development and test automation.',
    source: 'My professional summary. Internal measurement.',
    needsReview: true,
  },
  {
    id: 'defect-rate-under-one-percent',
    metric: '<1%',
    label: 'Annual production defect rate',
    detail:
      'Held while cadence doubled. Speed bought by skipping checks is the most expensive speed there is.',
    source: 'My professional summary. Internal quality reporting.',
    needsReview: true,
  },
  {
    id: 'velocity-doubled',
    metric: '×2',
    label: 'Engineering velocity',
    detail: 'Through platform standardization, process and architecture — not headcount.',
    source: 'My professional summary. Internal measurement.',
    needsReview: true,
  },
];

export function claimById(id: string): Claim | undefined {
  return claims.find((claim) => claim.id === id);
}

/** Scope line under the results: size, not titles. */
export const scaleNote =
  'Delivered across organizations of 50+ engineers — platform, mobile, QA and DevOps, including distributed teams — inside regulated environments where the audit trail is not optional.';

export const work = {
  heading: 'What I do now',
  lead: 'Help engineering organizations get durable gains from agentic software engineering. Not a tool rollout and not a strategy deck: the part where humans change how they build.',
  points: [
    'Most teams bought agents and stayed where they were. Output went up; delivery did not, because nothing downstream was built to trust it.',
    'So the work is the unglamorous half: what a change has to pass before it ships, who owns that, how long trust takes, and what happens when the model changes again in six months.',
    'I do it inside environments where that matters — insurance, healthcare, anything with a regulator attached — because that is where the problem is hardest and the proof is real.',
  ],
};

export const steps: Step[] = [
  {
    title: 'Measure what you have',
    body: 'Cycle time, lead time, release cadence, defect rate, and how long a change waits before a human trusts it. Most organizations cannot answer these on demand, which is the first finding.',
  },
  {
    title: 'Build one thing that ships',
    body: 'A single gate in the path your teams already use, with agent output held to the same standard as human output. One, not nine — a gate nobody uses is a document.',
  },
  {
    title: 'Get it adopted',
    body: 'The engineering change is small; the organizational change is not. Teams adopt what they helped design and what does not punish them, so both of those are engineered on purpose.',
  },
  {
    title: 'Hand it over',
    body: 'Your engineers reproduce the measurement without me and the gate survives a release cycle. If it cannot, it was never yours.',
  },
];

export const notes = [
  {
    heading: 'The dip comes first',
    body: 'A new gate slows a team down before it makes them faster. Plan for it, name it in week one, and do not judge the change while you are inside it.',
  },
  {
    heading: 'The metric I refuse to optimize',
    body: 'Lines of code accepted per engineer. It rises fastest by making verification weaker, which is the thing I am hired to make stronger.',
  },
  {
    heading: 'One thing I got wrong',
    body: 'An early gate counted pull requests merged. Two quarters later we had more changes, each smaller and harder to review. The measurement did exactly what I asked and not what I wanted.',
    needsReview: true,
  },
];

export const engagement = {
  heading: 'Working together',
  name: 'Delivery Baseline',
  summary:
    'Six weeks. I measure how delivery actually works where you are, put one gate into the path your teams already ship through, and hand back a plan with owners and sequence.',
  disqualifiers: [
    'Do not hire me to validate a decision that has already been made.',
    'Do not hire me if the pilot gets to stay a pilot; good practice spreads or it is decoration.',
    'Do not hire me for a deck. The output is a running gate and a measurement.',
    'Do not hire me if nobody who owns the pipeline will be in the room.',
  ],
  cta: {
    label: 'Start a conversation',
    href:
      'mailto:dmitry@echowaves.com?subject=' +
      encodeURIComponent('Delivery Baseline') +
      '&body=' +
      encodeURIComponent(
        'Team size and what it builds:\nWhat agents are doing there today:\nCurrent release cadence and lead time:\nWhat you want to end up being able to prove:\n'
      ),
  },
};

// Figures themselves are fetched in src/utils/registry.ts, which also owns the
// notes shown beside them.
export const openSource = {
  heading: 'Open source',
  lead: 'Maintenance is the honest proof of engineering judgment: these ship, break, get issues filed against them, and still work in someone else\'s app.',
};

export const packages: Package[] = [
  {
    name: 'expo-cached-image',
    npmPackage: 'expo-cached-image',
    repo: 'expo-cached-image',
    summary: 'Cached image component for React Native, built on Expo.',
  },
  {
    name: 'expo-storage',
    npmPackage: 'expo-storage',
    repo: 'expo-storage',
    summary: 'Persistent storage without the size limits of async-storage.',
  },
  {
    name: 'expo-masonry-layout',
    npmPackage: 'expo-masonry-layout',
    repo: 'expo-masonry-layout',
    summary: 'Virtualized masonry layout for React Native and Expo.',
  },
];

export interface StoreLink {
  label: string;
  href: string;
}

export interface Product {
  id: string;
  name: string;
  /** Platforms, so a reader knows what they are installing. */
  kind: string;
  summary: string;
  detail: string;
  links: StoreLink[];
}

/** Things I built that still run, with the store links to install them. */
export const products: Product[] = [
  {
    id: 'wisaw',
    name: 'WiSaw — What I Saw Today',
    kind: 'iOS · Android · web',
    summary:
      'Open the app and you are already in. No sign-up, no profile, no followers: photos and short videos posted anonymously to whoever is nearby, moderated by whoever is nearby.',
    detail:
      'The product I keep coming back to, and the one that taught me the most about architecture. It began as a seven-day experiment; nine years later it has been rebuilt four times and is still shipping.',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/wisaw-what-i-saw-today/id1299949122' },
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.echowaves.wisaw' },
      { label: 'wisaw.com', href: 'https://www.wisaw.com' },
      { label: 'How it was built', href: '/wisaw' },
    ],
  },
  {
    id: 'chimingclock',
    name: 'chimingClock',
    kind: 'iOS · Android · tablet',
    summary:
      'A standing clock that shows the time and plays the Westminster chimes every quarter hour. One screen, no settings worth having, built to give an old tablet a second life.',
    detail:
      'About a hundred lines of my own code, and almost a week to get those hundred lines right. Simple is not easy: most of the work was deleting features.',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/chimingclock/id6446005837' },
      { label: 'Why another clock app', href: 'https://dev.to/dmitryame/turning-old-tablet-into-chiming-clock-or-why-do-we-need-more-clock-apps-4p08' },
      { label: 'GitHub', href: 'https://github.com/echowaves/chimingClock' },
    ],
  },
  {
    id: 'get2knowu',
    name: 'Get to Know You',
    kind: 'iOS · Android',
    summary:
      'One question at a time, for teams that ship together but have not yet talked to each other. Built on the observation that the cheapest team investment is knowing who is on the team.',
    detail:
      'The same minimalism as the clock: open it, answer, pass the phone around. Used in team meetings and offsites, which is where I tested it.',
    links: [
      { label: 'App Store', href: 'https://apps.apple.com/us/app/get-to-know-you/id6445826843' },
      { label: 'GitHub', href: 'https://github.com/echowaves/get2knowu' },
    ],
  },
  {
    id: 'succinctcoin',
    name: 'Succinct Coin → succinctcoin.ai',
    kind: 'Desktop app (Electron)',
    summary:
      'A deliberately small cryptocurrency: consensus and ledger in TypeScript, a desktop wallet and miner, mining by uptime instead of proof-of-work.',
    detail:
      'A Python prototype from 2020, rewritten as succinctcoin.ai: the core is deterministic by construction (chain time only, no wall clock or randomness in consensus), money is decimal at exactly two boundaries, and 285 tests run headless over an in-memory network. Written with agents against that suite rather than reviewed after the fact — which is the only way this stays honest at my scale.',
    links: [
      { label: 'succinctcoin.ai', href: 'https://github.com/echowaves/succinctcoin.ai' },
      { label: 'The prototype', href: 'https://github.com/echowaves/succinctcoin' },
    ],
  },
];

/** Phase of WiSaw architecture, in the order it happened. */
export interface WisawPhase {
  when: string;
  title: string;
  body: string;
}

export const wisawStory = {
  title: 'WiSaw: how a seven-day app was rebuilt four times',
  lede: 'WiSaw is the app I keep returning to, so it is the honest record of my architecture decisions. Each rewrite was forced by something real: traffic I could not afford to serve, a platform shift I did not want to fight, a crash that only happened on other people\'s phones.',
  originHeading: 'That is how it all began',
  originBody: [
    'Before WiSaw there was Echowaves, a minimalistic social sharing platform built on the theory that most of what makes social apps heavy is also what makes them miserable. In 2018 I stripped the idea down far enough to test whether it could survive without accounts at all. The first version took seven days: <a href="https://www.linkedin.com/pulse/minimalistic-social-app-few-days-dmitryame/">Minimalistic Social App in few days</a>.',
    'The rule that came out of it has not changed since: if a feature does not earn its complexity, the app does not get the feature. <a href="https://dev.to/dmitryame/minimalistic-architecture-for-minimalistic-product-ffd">Minimalistic architecture for Minimalistic product</a> is the longer argument.',
  ],
  phases: [
    {
      when: '2018',
      title: 'Seven days: two native apps and a REST API',
      body: 'iOS and Android native clients, a Koa 2 REST API on AWS Elastic Beanstalk with autoscaling, RDS PostgreSQL. Deliberately boring, deliberately small: one language across the stack (JavaScript), React where there was a browser, few enough moving parts that one person could hold all of it — which is the actual constraint of a side project.',
    },
    {
      when: '2019 → 2021',
      title: 'One client codebase, functions instead of servers',
      body: 'Two native codebases stopped paying rent: clients moved to a single React Native codebase and then to the Expo managed workflow. The Koa service moved to AWS Lambda, so an app that idles for weeks costs nothing. Class components and higher-order components became functional hooks, with performance work in every step. Writing the pieces I needed and giving them away came out of this era: <a href="https://www.npmjs.com/package/expo-cached-image">expo-cached-image</a>, <a href="https://www.npmjs.com/package/expo-storage">expo-storage</a>, <a href="https://www.npmjs.com/package/expo-masonry-layout">expo-masonry-layout</a>.',
    },
    {
      when: '2021 → 2023',
      title: 'REST to GraphQL, because the feed is a graph query',
      body: 'The product question was always "what is near me, right now" — which is a geo query with subscriptions, not a set of endpoints. Migrated to GraphQL with real-time subscriptions over WebSocket: AppSync, PostgreSQL for the geo data, Node handlers deployed as infrastructure code with AWS CDK in TypeScript instead of a console I would have to remember. Responsiveness improved immediately; anonymous posting got simpler because the client stopped guessing which endpoint to poll.',
    },
    {
      when: '2025 → now',
      title: 'Agentic rewrite: Expo Router, typed, and safe to touch',
      body: 'The current shape is Expo Router with file-based routes, Jotai for local state, Apollo cache for server state, TypeScript through the client. This is the first round of rewrites done with coding agents in the loop, which changed what "cheap" means: a whole navigation redesign that I would have quoted at weeks arrived as a sequence of reviewable commits. It also made verification the bottleneck — see below.',
    },
  ].map((phase): WisawPhase => phase),
  bugHeading: 'The bug that made me a better developer',
  bugBody: [
    'In 2021 my own iPhone started locking up while using my own app. Nothing in the crash reports, nothing in the logs; the screen went black, spun for half a minute, and dropped to the PIN screen. It never happened in development, only in production, and only after days of heavy use — so it looked like an Expo bug, or an iOS bug, or a me bug.',
    'It was all three interacting. My image cache stored full-size files on disk and I reused them for thumbnails, assuming that if the bytes were already local, rendering them was free. On iOS, decoding an image costs memory proportional to the file behind it, not to the size of the box on screen — so twenty-odd thumbnails in a scrolling feed could hold enough decoded bitmaps for the OS to kill the app silently for memory pressure. The cache accumulating on disk is what made it take days to appear.',
    'The fix was one line of discipline: if there is no real thumbnail, resize to the rendered dimensions before drawing. <a href="https://dev.to/dmitryame/a-bug-that-made-me-a-better-developer-4g3n">A bug that made me a better developer</a> has the full hunt, including what I got wrong for weeks and why production-only bugs deserve their own methodology.',
    'Two habits came out of it. First, the cache logic became <a href="https://www.npmjs.com/package/expo-cached-image">expo-cached-image</a>, so nobody else has to learn this the way I did. Second: a bug you cannot reproduce is an instrumentation problem, not a guessing problem — every "maybe it is X" step I took produced both a fix and a measurement.',
  ],
  aiHeading: 'Where AI changed the work',
  aiLede: 'Not as a demo: on the production app, on screens real users see, in the last two years of this project.',
  aiPoints: [
    {
      title: 'Touch and layout, which was never my strength',
      body: 'The interaction surface is what held WiSaw back longest: nav bars that never got out of the way, buttons in places a thumb cannot reach, a detail screen with more chrome than content. In 2025 I put an agent (Claude 4 in Copilot agent mode) on it one component at a time. Roughly three hours across two iterations produced 22 commits: nav bar that hides its labels on scroll, drawer navigation, card-based detail screens, tag labels, dark theme, footers rebuilt around the bottom of the screen, and haptic feedback it added on its own initiative. <a href="https://dev.to/dmitryame/vibe-coding-ux-improvements-for-mobile-app-before-and-after-side-by-side-comparison-h3j">Before vs. After: How AI vibe-coded a mobile app makeover</a> shows the screens; <a href="https://dev.to/dmitryame/design-smarter-testing-top-llms-for-mobile-interface-optimization-k89">Design Smarter</a> is the model bake-off that chose the model.',
    },
    {
      title: 'Features that were previously unaffordable',
      body: 'AI image recognition now describes every photo posted, and AI auto-grouping sorts photos into Waves. Both are the kind of feature a one-person product never gets, because the prototype is cheap and the maintenance is not. Agents closed most of that gap.',
    },
    {
      title: 'The part nobody puts in the demo',
      body: 'Speed stopped being the constraint, so verification became it. An agent will happily produce a change that renders correctly and breaks the memory discipline described above. Everything I now build around agents is aimed at that: gates that catch it, measurements that show whether they work, and handover so the team owns both. That is the work I describe under <a href="/#how">How I work</a>, and WiSaw is where I test it on myself first.',
    },
  ],
  installNote: 'WiSaw is free and has no accounts; version 7.x ships on iOS, Android and the web.',
};

export const nav = [
  { label: 'Results', href: '/#results' },
  { label: 'Products', href: '/#products' },
  { label: 'How I work', href: '/#how' },
  { label: 'Open source', href: '/#code' },
  { label: 'Writing', href: '/#blog' },
  { label: 'Contact', href: '/#contact' },
];


export const asOf = '2026-10-17';

/** Machine-readable read of the same content the page renders (GET /impact.json). */export function buildImpactPayload() {
  return {
    asOf,
    person: {
      name: identity.name,
      location: identity.location,
      email: identity.email,
      links: identity.links,
    },
    focus: work.lead,
    claims: claims.map((claim) => ({
      id: claim.id,
      metric: claim.metric,
      label: claim.label,
      detail: claim.detail,
      source: claim.source,
    })),
    howIWork: steps,
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      platforms: product.kind,
      summary: product.summary,
      links: product.links,
    })),
    openSource: packages.map((pkg) => ({
      name: pkg.name,
      npm: `https://www.npmjs.com/package/${pkg.npmPackage}`,
      repository: `https://github.com/echowaves/${pkg.repo}`,
    })),
  };
}

/**
 * schema.org MobileApplication entries for the products that are actually listed
 * in a store, so search engines see the same install links the page shows.
 */
export function buildAppsJsonLd() {
  return products.flatMap((product) => {
    const store = product.links.find((link) => link.href.startsWith('https://apps.apple.com/'));
    if (!store) return [];
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'MobileApplication',
        name: product.name,
        description: product.summary,
        url: store.href,
        downloadUrl: store.href,
        operatingSystem: 'iOS',
        author: { '@type': 'Person', name: identity.name },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
    ];
  });
}
