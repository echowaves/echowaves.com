## Context

The Echowaves website is a static site built with Astro. The footer component contains links to the Privacy Policy and Support pages. Currently, these links use relative paths (`/privacy` and `/support`) which do not navigate correctly on the deployed static site.

The issue occurs because Astro's static site generation with `output: 'static'` requires explicit file references for navigation to work properly. Without `index.html` in the URL, the browser treats these as directory paths without a clear file to load.

## Goals / Non-Goals

**Goals:**
- Fix Privacy Policy link to navigate to `/privacy/index.html`
- Fix Support link to navigate to `/support/index.html`
- Ensure links work correctly on static site deployment

**Non-Goals:**
- Not changing the URL structure or routing approach
- Not modifying the page files themselves (privacy.astro, support.astro)
- Not adding any new features or functionality

## Decisions

**Decision: Use explicit `index.html` in footer links**

*Why:* This is the most reliable approach for static site deployment. The links will work regardless of server configuration and explicitly tell the browser which file to load.

*Alternative considered:* Using trailing slash only (`/privacy/`) - this requires specific server configuration to serve `index.html` and is less portable.

**Decision: Minimal change approach**

*Why:* Only the footer component needs modification. No changes to page files, routing configuration, or other components are required.

*Alternative considered:* Implementing client-side routing with React Router - this would be overkill for a simple static site and adds unnecessary complexity.

## Risks / Trade-offs

- **Risk:** Links may appear more verbose with `index.html` suffix
  - **Mitigation:** This is a minor visual trade-off for reliable functionality. The links work correctly on all server configurations.
