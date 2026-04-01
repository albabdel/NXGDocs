# Deferred Items - Phase 30-02

## Pre-existing Build Errors (Out of Scope)

These errors existed before Plan 30-02 execution and are not caused by current work.

### 1. Missing Components in updates/[slug].tsx

**File:** `classic/src/pages/updates/[slug].tsx`
**Error:** Module not found for:
- `../components/PageHeader`
- `../components/LandingPageBackground/LandingPageBackground`
- `../components/ui`

**Impact:** Frontend build fails with "Client bundle compiled with errors"

**Status:** Deferred - not related to auth session management

### 2. Navbar Content Auth Imports (Resolved?)

The navbar auth imports appear correct and files exist:
- `classic/src/components/Auth/` - exists
- `classic/src/css/components/navbar-auth.css` - exists

Build error may be cascading from other missing components.

---

**Note:** Backend functions (functions/) are separate from Docusaurus build and can be verified independently.
