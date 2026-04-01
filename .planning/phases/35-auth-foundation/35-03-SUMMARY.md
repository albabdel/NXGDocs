---
phase: 35-auth-foundation
plan: 03
subsystem: auth
tags: [product-access, guard, visibility, content-filtering, multi-product]

# Dependency graph
requires:
  - phase: 35-01
    provides: requireProductAccess guard, productAccess field
provides:
  - Guarded feedback endpoints (page-feedback, voc-feedback)
  - Guarded article request endpoint
  - Session verification with productAccess
  - Content visibility utilities
affects: [content-components, sanity-schemas, groq-queries]

# Tech tracking
tech-stack:
  added: []
  patterns: [product guard pattern, visibility tier system]

key-files:
  created:
    - classic/src/utils/content-visibility.ts
  modified:
    - functions/page-feedback.ts
    - functions/voc-feedback.ts
    - functions/request-article.ts
    - functions/zoho-customer-verify.ts

key-decisions:
  - "Content visibility tiers: public, authenticated, restricted"
  - "Product guard enforced at function entry point"

patterns-established:
  - "requireProductAccess guard pattern: validate session + product access at function start"
  - "Visibility tier system: public (no auth), authenticated (any user), restricted (product-specific)"

requirements-completed: [AUTH-04, AUTH-05, MPROD-02]

# Metrics
duration: 12m
completed: 2026-04-01
tasks_completed: 5
files_modified: 5
---

# Phase 35 Plan 03: Product Access Guards Summary

**Product access guards added to all user-facing Cloudflare Functions, session endpoint returns productAccess, and visibility tier utilities created for frontend content filtering.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-01T17:43:54Z
- **Completed:** 2026-04-01T17:55:54Z
- **Tasks:** 5
- **Files modified:** 5

## Accomplishments
- All feedback submission endpoints now validate product access
- Article request endpoint protected with product guard
- Session verification endpoint returns productAccess for frontend use
- Content visibility utilities support tiered access control

## Task Commits

Each task was committed atomically:

1. **task 1: Add requireProductAccess guard to page-feedback** - `6ab34ab` (feat)
2. **task 2: Add requireProductAccess guard to voc-feedback** - `ec335a7` (feat)
3. **task 3: Add requireProductAccess guard to request-article** - `f0b1000` (feat)
4. **task 4: Update zoho-customer-verify to return productAccess** - `62632d1` (feat)
5. **task 5: Create content visibility utilities** - `91a3af6` (feat)

## Files Created/Modified
- `functions/page-feedback.ts` - Added requireProductAccess guard at entry point
- `functions/voc-feedback.ts` - Added requireProductAccess guard at entry point
- `functions/request-article.ts` - Replaced manual session check with guard, handles both session types
- `functions/zoho-customer-verify.ts` - Returns productAccess in GET verification response
- `classic/src/utils/content-visibility.ts` - VisibilityTier type and canViewContent utility (NEW)

## Decisions Made
1. **Visibility tiers defined as three levels** - public (no auth), authenticated (any logged-in user), restricted (product-specific access)
2. **Product guard pattern** - All guards placed at function entry point for consistent enforcement
3. **Session type handling** - request-article.ts uses type guard to handle both ZohoSession and AdminSession

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- TypeScript union type issue in request-article.ts where UserSession could be ZohoSession or AdminSession. Fixed by using `'contactId' in session` type guard to distinguish session types.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Product access guards now protect all user-submitted data endpoints
- Frontend can use content-visibility.ts for UI-level filtering
- Ready for Sanity schema updates with product field
- Ready for GROQ query product filtering implementation

---
*Phase: 35-auth-foundation*
*Completed: 2026-04-01*
