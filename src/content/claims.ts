/**
 * Claims of record — the single owner of every committed string and figure on echowaves.com.
 *
 * UPSTREAM: _bmad-output/echowaves-site/ux-site-redesign/EXPERIENCE.md
 * (IA region 2 "claims of record" + committed literals). Editing a figure or committed
 * string here without editing the spine first violates AD-3.
 */

// ---------- Committed literal strings (EXPERIENCE.md, verbatim) ----------

export const thesis = 'AI-native engineering transformation, measured.';

export const pageTitle =
  'Dmitry Amelchenko — AI-native engineering transformation, measured';

export const pageDescription =
  'Engineering executive who modernized enterprise delivery at Fortune-100 scale and still ships production open-source. Release cycles 20→10 days, <1% annual defects, 89% team eNPS. GenAI, Copilot, and agentic workflows adopted in a regulated enterprise.';

export const ctaLinkedIn = 'Start a conversation on LinkedIn';

// ---------- Identity ----------

export const identity = {
  handle: '~/echowaves',
  name: 'Dmitry Amelchenko',
  role: 'Engineering Executive — AI-Native Transformation',
  tagline: '$ npm install the-future',
  location: 'Boston, Massachusetts',
  education: 'MS, Computer Science & Engineering',
  credential: 'Certified ScrumMaster (CSM)',
  publications: ['Rails Magazine', 'dev.to'],
} as const;

// ---------- Sheet revision stamp ----------

export const revision = {
  stamp: `rev. ${new Date().toISOString().slice(0, 7)}`,
  /** Decodable personal artifact: rot13 of the decoded line below. */
  encoded: 'zrnfherq, abg ivorq — q.n., 2011 gb cerfrag',
  decoded: 'measured, not vibed — d.a., 2011 to present',
} as const;

// ---------- Career schematic (claims of record) ----------

export interface Metric {
  value: string;
  unit: string;
  context: string;
}

export interface Role {
  id: string;
  org: string;
  title: string;
  dates: string;
  period: string;
  summary: string;
  metrics: Metric[];
  note?: string;
}

export const roles: Role[] = [
  {
    id: 'servicechannel',
    org: 'ServiceChannel',
    title: 'Vice President of Software Engineering',
    dates: '2011–2015',
    period: '4 years',
    summary:
      'Led a 50+ person engineering organization across backend, frontend, QA, and DevOps; modernized a monolith to microservices/API-first and migrated to AWS.',
    metrics: [
      {
        value: '90%',
        unit: 'lead-time reduction',
        context: 'change lead time · ServiceChannel · 3 months → 2 weeks',
      },
    ],
  },
  {
    id: 'sobergrid',
    org: 'Sober Grid',
    title: 'Chief Technology Officer & Consultant',
    dates: '2015–2018',
    period: '3 years',
    summary:
      'Built and scaled a social platform from prototype to production; led product, engineering, security, and analytics; strengthened identity and authentication.',
    metrics: [],
  },
  {
    id: 'americanwell',
    org: 'American Well',
    title: 'Senior Software Manager',
    dates: '2018–2019',
    period: '1 year',
    summary:
      'Managed secure telehealth platform development in a HIPAA-regulated environment; improved release speed and quality through CI/CD and quality gates.',
    metrics: [],
  },
  {
    id: 'libertymutual',
    org: 'Liberty Mutual',
    title: 'People Leader, Mobile Engineering',
    dates: '2019–present',
    period: 'enterprise mobile platforms · millions of customers',
    summary:
      'Lead modernization of enterprise mobile delivery in a regulated environment — the we behind the numbers below.',
    metrics: [
      {
        value: '20 → 10 days',
        unit: 'release cycle',
        context: 'Liberty Mutual mobile · 50% faster',
      },
      {
        value: '2×',
        unit: 'team velocity',
        context: 'Liberty Mutual mobile engineering',
      },
      {
        value: '<1%',
        unit: 'annual production defect rate',
        context: 'Liberty Mutual mobile · measured annually',
      },
      {
        value: '89%',
        unit: 'eNPS',
        context: 'direct and extended reports · industry range 2–25%',
      },
    ],
    note: 'JD Power: a 47-point mobile-app satisfaction surge followed our team’s modernization of the account overview interface — part of a 27-point year-over-year digital customer-satisfaction increase that moved Liberty Mutual to fourth in industry rankings. A team and business outcome, not a personal one. The MFA login experience measured 32 points above the industry average.',
  },
] as const;

// ---------- AI practice (practices, never invented outcomes) ----------

export const aiPractice = {
  heading: 'AI Practice',
  note: 'measured, not vibed — no quantified productivity gain is claimed here.',
  practices: [
    {
      name: 'GenAI adoption',
      detail:
        'Evaluated tools, ran hands-on pilots, and led team enablement for generative AI across engineering.',
    },
    {
      name: 'GitHub Copilot',
      detail:
        'Brought Copilot into daily practice in a regulated enterprise, including evaluation and cross-team rollout support.',
    },
    {
      name: 'Agentic workflows',
      detail:
        'Adopted agentic tooling for real engineering work, from prototyping to delivery pipelines.',
    },
    {
      name: 'Specification-driven development',
      detail:
        'Drive delivery from written specifications so humans and AI agents build against the same contract.',
    },
  ],
  adoptionScope:
    'Adoption activity spans QE, mobile, and Dev workflows — practices and enablement, reported separately from outcomes.',
} as const;

// ---------- Open source evidence ----------

export interface PackageLink {
  name: string;
  description: string;
  repo: string;
  npm: string;
}

export const packages: PackageLink[] = [
  {
    name: 'expo-cached-image',
    description: 'Fast cached image component for React Native / Expo.',
    repo: 'https://github.com/echowaves/expo-cached-image',
    npm: 'https://www.npmjs.com/package/expo-cached-image',
  },
  {
    name: 'expo-storage',
    description: 'Persistent storage without async-storage size limits.',
    repo: 'https://github.com/echowaves/expo-storage',
    npm: 'https://www.npmjs.com/package/expo-storage',
  },
  {
    name: 'expo-masonry-layout',
    description: 'Masonry layout component for Expo / React Native.',
    repo: 'https://github.com/echowaves/expo-masonry-layout',
    npm: 'https://www.npmjs.com/package/expo-masonry-layout',
  },
];

export const destinations = {
  githubProfile: 'https://github.com/dmitryame',
  githubOrg: 'https://github.com/echowaves',
  npm: 'https://www.npmjs.com/~echowaves',
  devto: 'https://dev.to/dmitryame',
  wisaw: 'https://wisaw.com',
  linkedin: 'https://www.linkedin.com/in/dmitryame',
  email: 'mailto:dmitry@echowaves.com',
} as const;

// ---------- Sheet chrome (nav anchors per architecture convention) ----------

export const navRegions = [
  { id: 'career-schematic', label: 'Career' },
  { id: 'ai-practice', label: 'AI Practice' },
  { id: 'operator', label: 'Operator' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
] as const;
