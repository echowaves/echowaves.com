## Why

The Privacy Policy and Support links in the footer do not navigate correctly - they stay on the home page instead of loading the respective pages. This is because the links use relative paths (`/privacy` and `/support`) instead of absolute paths that include `index.html`.

## What Changes

- Update Privacy Policy link in footer to use `/privacy/index.html` instead of `/privacy`
- Update Support link in footer to use `/support/index.html` instead of `/support`

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `components`: Footer component link behavior for static site routing

## Impact

- **Affected Files**: `src/components/Footer.tsx`
- **Lines Changed**: Line 39 (Support link), Line 66 (Privacy Policy link)
- **Breaking Changes**: None - this is a bug fix for existing functionality
