# Styling & Design

## Approach

- **Component-scoped CSS:** Each component has a co-located `.css` file (e.g., `Header.tsx` + `Header.css`)
- **No preprocessors:** Plain CSS only (no Sass, Less, or CSS Modules)
- **No CSS-in-JS:** No styled-components, emotion, etc.
- **Global styles:** `index.css` (base reset and global styles)

## Color Palette

| Usage               | Color                          |
|----------------------|-------------------------------|
| Background           | `#0d1117` (dark)              |
| Card/surface         | `#161b22`                     |
| Border/divider       | `#30363d`                     |
| Primary text         | `#e6edf3` (light)             |
| Secondary text       | `#8b949e`                     |
| Accent / links       | `#58a6ff` (blue)              |
| Terminal green       | `#39d353`                     |
| Error/alert          | `#f85149`                     |

## Typography

- **Font family:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`)
- **Code/monospace font:** `'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace` — used for package names, install commands, stat numbers, and the hero tagline

## Layout

- **Max width:** 1200px for content sections
- **Section padding:** Responsive padding
- **Responsive breakpoint:** 768px (single breakpoint for mobile/desktop)
- **Cards:** Dark backgrounds (`#161b22`) with `#30363d` borders

## Button Styles

- CTA buttons use the accent color (`#58a6ff`) with dark text or outline variant with accent border and accent text on hover

## Responsive Behavior

- Mobile-first design
- Header: Hamburger menu replaces nav links below 768px
- Grids collapse to single column on mobile
- Font sizes reduce on smaller screens
- Dark theme colors consistent across all breakpoints — no light-mode fallback

## Interactive Effects

- Button hover: Transform scale + box-shadow
- Smooth scroll behavior (`scroll-behavior: smooth` on `html`)
- CSS transitions on hover states

## Icons

- Emoji icons for feature cards and package icons
- Inline SVG for social media icons in Footer (GitHub, LinkedIn, Dev.to)
- No icon library dependency
