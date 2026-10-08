# Components

## Header

- **File:** `src/components/Header.tsx`
- **State:** `isMenuOpen` (boolean) — toggles mobile hamburger menu
- **Renders:** Sticky top nav bar with logo ("echowaves" as a styled `<div>` or `<span>`, NOT `<h1>`), navigation links (About, Projects, Packages, Blog as `#section` anchors), external GitHub link, hamburger menu toggle. Uses Astro `client:load` directive for client-side interactivity.
- **External links:** `https://github.com/echowaves`
- **Responsive:** Hamburger menu below 768px

## Hero

- **File:** `src/components/Hero.tsx`
- **State:** None (stateless)
- **Renders:** Nerdy tagline, upside-down text brand element ("Sonɹɔǝ oɟ ɔoɯdlǝx solnʇᴉous ʇo ʎonɹ sᴉɯdlǝ dɹoqlǝɯs˙"), two CTA buttons ("Explore Packages" → `#packages`, "View on GitHub" → external), stats grid (103+ stars, 43 repos, 1,500+ weekly downloads)
- **External links:** `https://github.com/echowaves`
- **Note:** Stats are hardcoded

## About

- **File:** `src/components/About.tsx`
- **State:** None
- **Renders:** Company description paragraphs, 4 feature cards (High Performance, Secure, Well Documented, Production Ready) with emoji icons, CTA links to LinkedIn and email
- **External links:** `https://www.linkedin.com/in/dmitryame`, `mailto:dmitry@echowaves.com`

## Projects

- **File:** `src/components/Projects.tsx`
- **Data model:**
  ```ts
  interface Project {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    link: string;
    tags: string[];
  }
  ```
- **Content:** 5 hardcoded projects (WiSaw 38 stars/6 forks, WiSaw.cdk, WiSaw.client, get2knowu, chimingClock)
- **Renders:** Grid of project cards with language badge, tags, star/fork counts, GitHub link. Footer CTA to "View All 43 Repositories"
- **External links:** Individual GitHub repo URLs, `https://github.com/orgs/echowaves/repositories`

## Packages

- **File:** `src/components/Packages.tsx`
- **Data model:**
  ```ts
  interface Package {
    name: string;
    version: string;
    description: string;
    downloads: string;
    stars: number;
    features: string[];
    npmLink: string;
    githubLink: string;
    icon: string;
  }
  ```
- **Content:** 3 NPM packages (expo-cached-image v54.0.7 / 103 stars, expo-storage v54.0.6 / 15 stars, expo-masonry-layout v1.1.11 / 1 star)
- **Renders:** Package cards (icon, version badge, description, download/star stats, feature list, NPM/GitHub links, install command), "Used in Production" section with WiSaw app store badges
- **External links:** NPM package pages, GitHub repos, `https://wisaw.com`, Apple App Store, Google Play Store, shields.io badge

## Blog

- **File:** `src/components/Blog.tsx`
- **Data models:**
  ```ts
  interface BlogPost {
    title: string;
    description: string;
    date: string;
    tags: string[];
    link: string;
    readTime: string;
  }
  // topicAreas: { icon: string; name: string; color: string }[]
  ```
- **Content:** 7 featured blog posts (Feb 2019 pinned + 2025–2026), 6 topic area cards, blog stats (31 posts, 19 comments, 7+ years), author bio with skills
- **Renders:** Blog post cards (clickable, link to dev.to, pinned post visually distinguished), topic area cards, stats section, blockquote, author bio
- **External links:** `dev.to/dmitryame/*` articles, `https://dev.to/dmitryame` profile

## Footer

- **File:** `src/components/Footer.tsx`
- **State:** `currentYear` computed from `new Date().getFullYear()`
- **Renders:** 4-column layout — Company info with social SVG icons (GitHub, LinkedIn, Dev.to), Quick Links (internal anchors + `/support`), NPM Packages (3 links), Contact (email + WiSaw link). Bottom bar with copyright and Privacy Policy link
- **Internal links:** `/privacy`, `/support`
- **External links:** GitHub, LinkedIn, Dev.to, NPM packages, `https://wisaw.com`, `mailto:dmitry@echowaves.com`

## Privacy (Content)

- **File:** `src/components/Privacy.tsx`
- **State:** None
- **Renders:** Full privacy policy with 12 sections (Introduction, Information We Collect, Use of Information, Google Analytics, Cookies, Data Security, Third-Party Services, Children's Privacy, Data Rights, Changes to Policy, Contact Us)
- **Note:** Last updated November 15, 2025
- **External links:** `https://policies.google.com/privacy`, `mailto:dmitry@echowaves.com`

## Support (Content)

- **File:** `src/components/Support.tsx`
- **State:** None
- **Renders:** 3 contact methods (Email, GitHub Issues, Twitter), 4 FAQ items, 4 resource cards (GitHub Repos, NPM Packages, Blog & Tutorials, Homepage)
- **External links:** `mailto:dmitry@echowaves.com`, `https://github.com/echowaves`, `https://twitter.com/echowaves`, `https://www.npmjs.com/~echowaves`, `https://dev.to/dmitryame`
