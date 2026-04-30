# Dark Theme

## Purpose

Defines the dark color scheme, monospace typography accents, terminal-inspired UI elements, nerdy brand elements, and accessibility requirements for the site's visual identity.

## Requirements

### Requirement: Dark color scheme
The site SHALL use a dark background color scheme with light text across all pages and components.

- Background: `#0d1117`
- Cards/surfaces: `#161b22`
- Primary text: `#e6edf3`

### Requirement: Monospace typography accents
The site SHALL use a monospace font stack (`JetBrains Mono`, `Fira Code`, `Cascadia Code`, monospace) for code-related UI elements: package names, install commands, stat numbers, and the hero tagline.

### Requirement: Terminal-inspired UI elements
Interactive and decorative elements SHALL evoke a developer terminal aesthetic: code-block styled cards, terminal-prompt prefixes, and a neon green accent color (`#39d353`) for highlights. Cards have dark backgrounds with subtle borders (`#30363d`), and interactive elements use the blue accent (`#58a6ff`).

### Requirement: Nerdy brand elements
The site SHALL incorporate the upside-down tagline ("Sonɹɔǝ oɟ ɔoɯdlǝx solnʇᴉous ʇo ʎonɹ sᴉɯdlǝ dɹoqlǝɯs˙") as a visible brand signature element in the hero section, footer, or as an easter egg.

### Requirement: Dark theme accessibility
All text-on-background color combinations SHALL meet WCAG 2.1 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text).

- Primary text (`#e6edf3`) on dark background (`#0d1117`) — must meet 4.5:1
- Link text (`#58a6ff`) on dark background (`#0d1117`) — must meet 3:1 for large text
