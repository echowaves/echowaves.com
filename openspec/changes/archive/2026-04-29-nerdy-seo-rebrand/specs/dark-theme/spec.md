## ADDED Requirements

### Requirement: Dark color scheme
The site SHALL use a dark background color scheme with light text across all pages and components.

#### Scenario: Base dark theme colors
- **WHEN** any page is loaded
- **THEN** the background is dark (`#0d1117`), text is light (`#e6edf3`), and cards use a slightly lighter dark (`#161b22`)

### Requirement: Monospace typography accents
The site SHALL use a monospace font stack (`JetBrains Mono`, `Fira Code`, `Cascadia Code`, monospace) for code-related UI elements: package names, install commands, stat numbers, and the hero tagline.

#### Scenario: Package install commands
- **WHEN** a package card is rendered
- **THEN** the install command text uses a monospace font with a terminal-style background

#### Scenario: Hero tagline typography
- **WHEN** the hero section is rendered
- **THEN** the tagline text uses monospace font

### Requirement: Terminal-inspired UI elements
Interactive and decorative elements SHALL evoke a developer terminal aesthetic: code-block styled cards, terminal-prompt prefixes, and a neon green accent color (`#39d353`) for highlights.

#### Scenario: Project cards terminal style
- **WHEN** project cards are rendered
- **THEN** cards have dark backgrounds with subtle borders (`#30363d`), and interactive elements use the blue accent (`#58a6ff`)

### Requirement: Nerdy brand elements
The site SHALL incorporate the upside-down tagline ("Sonɹɔǝ oɟ ɔoɯdlǝx solnʇᴉous ʇo ʎonɹ sᴉɯdlǝ dɹoqlǝɯs˙") as a visible brand signature element.

#### Scenario: Upside-down tagline visibility
- **WHEN** the home page is loaded
- **THEN** the upside-down tagline is visible as a brand element (in the hero section, footer, or as an easter egg)

### Requirement: Dark theme accessibility
All text-on-background color combinations SHALL meet WCAG 2.1 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text).

#### Scenario: Primary text contrast
- **WHEN** primary text (`#e6edf3`) is rendered on the dark background (`#0d1117`)
- **THEN** the contrast ratio meets WCAG AA (ratio >= 4.5:1)

#### Scenario: Link contrast
- **WHEN** link text (`#58a6ff`) is rendered on the dark background (`#0d1117`)
- **THEN** the contrast ratio meets WCAG AA for large text (ratio >= 3:1)
