# Pages & Routing

## Route Definitions

Routes are defined in `src/App.tsx` using React Router DOM v7 `<BrowserRouter>`.

| Path       | Component  | Layout                         |
|------------|------------|--------------------------------|
| `/`        | `Home`     | Header → Hero → About → Projects → Packages → Blog → Footer |
| `/privacy` | `Privacy`  | Header → Privacy content → Footer |
| `/support` | `Support`  | Header → Support content → Footer |

## Page Components

All page components live in `src/pages/` and are re-exported via barrel file `src/pages/index.ts`.

### Home (`src/pages/Home.tsx`)
- Composes all main sections in order: Header, Hero, About, Projects, Packages, Blog, Footer
- No props, no state

### Privacy (`src/pages/Privacy.tsx`)
- Layout wrapper: Header + PrivacyComponent (from `src/components/Privacy.tsx`) + Footer
- No props, no state

### Support (`src/pages/Support.tsx`)
- Layout wrapper: Header + SupportComponent (from `src/components/Support.tsx`) + Footer
- No props, no state

## Navigation Patterns

### In-page Scrolling
- Home page sections have `id` attributes (`about`, `projects`, `packages`, `blog`)
- Nav links use `/#section` format (e.g., `/#about`)
- `ScrollToHash` component in `App.tsx` listens to `location.hash` changes and scrolls the target element into view with smooth behavior after a 100ms delay

### Cross-page Links
- Footer links to `/privacy` and `/support`
- Privacy and Support pages include Header with nav back to home sections
