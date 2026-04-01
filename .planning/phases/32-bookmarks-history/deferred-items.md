# Deferred Items - Phase 32-02

## Pre-existing Build Issues (Out of Scope)

These issues existed before Phase 32-02 execution and are not caused by history tracking implementation:

### 1. Missing Components in updates.tsx
- **File:** `classic/src/pages/updates.tsx`
- **Missing imports:**
  - `../components/PageHeader`
  - `../components/LandingPageBackground/LandingPageBackground`
  - `../components/ui`
- **Status:** Pre-existing, requires separate fix

### 2. Auth Import Path Fix Applied
- **File:** `classic/src/theme/Navbar/Content/index.tsx`
- **Fixed:** Changed relative path `../../components/Auth` to alias `@site/src/components/Auth`
- **Status:** Fixed as blocking issue (Rule 3)

## Notes

The new history tracking files (`history.ts`, `useReadingHistory.ts`, `usePageTracking.ts`) are syntactically correct and follow existing patterns. Build verification blocked by pre-existing issues in unrelated files.
