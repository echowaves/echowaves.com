## MODIFIED Requirements

### Requirement: Color palette
The site SHALL use a dark color palette:
- Background: `#0d1117`
- Card/surface: `#161b22`
- Border/divider: `#30363d`
- Primary text: `#e6edf3`
- Secondary text: `#8b949e`
- Accent/links: `#58a6ff`
- Terminal green: `#39d353`
- Error/alert: `#f85149`

#### Scenario: Dark background applied
- **WHEN** any page is loaded
- **THEN** the body background is `#0d1117` and primary text is `#e6edf3`

### Requirement: Typography
The site SHALL use a system font stack for body text and a monospace font stack (`'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace`) for code elements, package names, install commands, stat numbers, and the hero tagline.

#### Scenario: Monospace on package names
- **WHEN** a package card is rendered
- **THEN** the package name uses the monospace font stack

### Requirement: Layout
Content sections SHALL use `max-width: 1200px` with responsive padding. Cards SHALL have dark backgrounds (`#161b22`) with `#30363d` borders.

#### Scenario: Card styling
- **WHEN** a project card is rendered
- **THEN** it has background `#161b22`, border color `#30363d`, and light text

### Requirement: Button styles
CTA buttons SHALL use the accent color (`#58a6ff`) with dark text or outline variant with accent border and accent text on hover.

#### Scenario: Primary button style
- **WHEN** a primary CTA button is rendered
- **THEN** it has background `#58a6ff` and contrasting text

### Requirement: Responsive behavior
The site SHALL be responsive with a primary breakpoint at 768px. Dark theme colors SHALL be consistent across all breakpoints — no light-mode fallback.

#### Scenario: Mobile dark theme
- **WHEN** the site is viewed on a 375px-wide screen
- **THEN** the dark background, card colors, and text colors are identical to desktop
