---
phase: 37-multi-build-pipeline
plan: 01
subsystem: infra
tags: [docusaurus, build, multi-product, parallel, pipeline]

# Dependency graph
requires:
  - phase: 36-content-infrastructure
    provides: Product field on Sanity documents, GROQ product filtering
provides:
  - Multi-build orchestrator script for parallel product builds
  - npm scripts for multi-build and single product builds
  - Build isolation with separate output directories per product
affects:
  - phase-38 (Product Configuration & Branding)
  - phase-39 (Cloudflare Multi-Project Deployment)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Environment-driven product context (PRODUCT env var)
    - Parallel builds with Promise.all
    - Build isolation via --out-dir flag
    - require cache clearing between builds

key-files:
  created:
    - classic/scripts/build-multi-product.js
  modified:
    - package.json
    - classic/package.json

key-decisions:
  - "Parallel builds enabled by default for 2 products (Promise.all)"
  - "require cache cleared between builds to ensure fresh PRODUCT env var"
  - "Sequential mode available via --sequential flag for debugging"

patterns-established:
  - "Pattern: PRODUCT env var set before requiring fetch-sanity-content.js"
  - "Pattern: delete require.cache for fresh module loads between builds"
  - "Pattern: --out-dir build/${product} for isolated output directories"

requirements-completed: [MPROD-04]

# Metrics
duration: 12min
completed: 2026-04-01
---

# Phase 37: Multi-Build Pipeline Summary

**Multi-build orchestrator script that runs parallel Docusaurus builds for each product with isolated output directories and product-scoped content via PRODUCT env var.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-04-01T19:00:00Z
- **Completed:** 2026-04-01T19:12:00Z
- **Tasks:** 3 (2 auto + 1 checkpoint)
- **Files modified:** 3

## Accomplishments
- Created `build-multi-product.js` orchestrator with parallel build support
- Implemented PRODUCT env var handling with require cache clearing
- Added npm scripts for multi-build, sequential, and single product builds
- Verified build isolation with separate output directories per product

## task Commits

Each task was committed atomically:

1. **task 1: Create multi-build orchestrator script** - `21d34ab` (feat)
2. **task 2: Add npm scripts for multi-build** - `21d34ab` (feat - combined commit)
3. **task 3: Verify build isolation** - Checkpoint approved by user

## Files Created/Modified
- `classic/scripts/build-multi-product.js` - Multi-build orchestrator with parallel/sequential modes
- `package.json` - Added build:multi, build:multi:sequential, build:gcxone, build:gcsurge scripts
- `classic/package.json` - Added corresponding npm scripts for multi-build pipeline

## Decisions Made
- Parallel builds enabled by default (Promise.all) for efficiency with 2 products
- require cache cleared between builds to ensure fetch-sanity-content.js reads fresh PRODUCT env var
- Sequential mode (--sequential flag) available for debugging build issues
- Combined tasks 1 and 2 into single commit (npm scripts depend on script)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - all verification checks passed on first attempt.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Multi-build pipeline ready for Phase 38 (Product Configuration & Branding)
- Phase 38 can now build each product separately to test product-specific theming
- Phase 39 (Cloudflare Multi-Project Deployment) can use npm scripts for deployment

---
*Phase: 37-multi-build-pipeline*
*Completed: 2026-04-01*
