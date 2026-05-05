## ADDED Requirements

### Requirement: Footer links use explicit file paths for static site navigation
The footer component SHALL use explicit file paths including `index.html` for all internal page links to ensure correct navigation on static site deployment.

#### Scenario: Privacy Policy link navigation
- **WHEN** user clicks the Privacy Policy link in the footer
- **THEN** browser navigates to `/privacy/index.html` and displays the privacy policy page

#### Scenario: Support link navigation
- **WHEN** user clicks the Support link in the footer
- **THEN** browser navigates to `/support/index.html` and displays the support page
