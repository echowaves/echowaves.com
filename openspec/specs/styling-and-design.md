# Styling & Design

## Approach

- **Component-scoped CSS:** Each component has a co-located `.css` file (e.g., `Header.tsx` + `Header.css`)
- **No preprocessors:** Plain CSS only (no Sass, Less, or CSS Modules)
- **No CSS-in-JS:** No styled-components, emotion, etc.
- **Global styles:** `App.css` (utilities, reset, responsive base) and `index.css` (minimal base reset)

## Color Palette

| Usage               | Color                          |
|----------------------|-------------------------------|
| Header gradient      | `#667eea` → `#764ba2` (purple) |
| Accent / links       | `#3498db` (blue)              |
| Headings             | `#2c3e50` (dark blue-gray)    |
| Body text            | System default                |

## Typography

- **Font family:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`)
- **Code font:** Monospace system stack

## Layout

- **Max width:** 1200px for content sections
- **Section padding:** 80px vertical
- **Responsive breakpoint:** 768px (single breakpoint for mobile/desktop)

## Responsive Behavior

- Mobile-first design
- Header: Hamburger menu replaces nav links below 768px
- Grids collapse to single column on mobile
- Font sizes reduce on smaller screens

## Interactive Effects

- Button hover: Transform scale + box-shadow
- Smooth scroll behavior (`scroll-behavior: smooth` on `html`)
- CSS transitions on hover states
- `.btn` and `.btn-outline` utility classes for CTA buttons

## Icons

- Emoji icons for feature cards and package icons
- Inline SVG for social media icons in Footer (GitHub, LinkedIn, Dev.to)
- No icon library dependency
