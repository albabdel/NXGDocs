---
phase: 01-cleanup
plan: 05
subsystem: infra
tags: [docusaurus, broken-links, link-checker, build-quality]

# Dependency graph
requires:
  - phase: 01-cleanup-01
    provides: Storyblok pages and components deleted (introduced some broken links)
  - phase: 01-cleanup-02
    provides: Orphaned components deleted (may have introduced broken links)
  - phase: 01-cleanup-03
    provides: CSS cleanup completed
  - phase: 01-cleanup-04
    provides: Cloudflare Pages function complete
provides:
  - "onBrokenLinks: 'throw' active in docusaurus.config.ts — build fails on any future broken link"
  - "docs/support/contact.md — stub support page (fixes 92 broken support-ticket links)"
  - "All internal links in docs/ and src/pages/ are valid"
affects: [all-phases, phase-02-cms, phase-03-integration]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Docusaurus onBrokenLinks: throw — any broken internal link now causes build failure"
    - "Broken links to non-existent sections redirect to nearest existing parent page"
    - "Support ticket links point to docs/support/contact.md stub until real support system exists"

key-files:
  created:
    - classic/docs/support/contact.md
  modified:
    - classic/docusaurus.config.ts
    - classic/docs-admin/index.md
    - classic/docs-manager/index.md
    - classic/docs-operator/index.md
    - classic/docs-operator-minimal/index.md
    - classic/docs/alarm-management/*.md (7 files)
    - classic/docs/devices/**/*.md (50+ files)
    - classic/docs/features/**/*.md (14 files)
    - classic/docs/getting-started/**/*.mdx (15 files)
    - classic/docs/installer-guide/*.md (9 files)
    - classic/docs/knowledge-base/*.md (7 files)
    - classic/docs/operator-guide/*.md (12 files)
    - classic/docs/platform-fundamentals/*.md (5 files)
    - classic/docs/reporting/*.md (5 files)
    - classic/docs/index.mdx
    - classic/src/data/onboardingPhases.ts
    - classic/src/pages/404.tsx
    - classic/src/pages/index.tsx
    - classic/src/pages/integration-hub.tsx
    - classic/src/pages/quick-start/*.tsx (3 files)
    - classic/src/pages/releases.tsx
    - classic/src/pages/roles/*.tsx (4 files)
    - classic/src/pages/towers.tsx

key-decisions:
  - "docs/support/contact.md created as target for all 92 broken support-ticket links — avoids mass link removal while providing a valid destination"
  - "Missing alarm-management subpages (alarm-filtering, alarm-queue, false-alarms, etc.) redirected to closest existing pages rather than creating empty stubs"
  - "Integration-hub device links with no corresponding docs redirected to /docs/devices/general/onboarding-overview (generic fallback)"
  - "Platform-fundamentals subdirectory links redirected to existing top-level platform-fundamentals pages"
  - "Role-based docs-admin/manager/operator/operator-minimal index.md files: removed broken relative quick-links (no sibling pages exist)"
  - "onBrokenAnchors kept at warn: broken anchors are page-internal navigation, not site-navigation failures; plan specifies warn"
  - "onBrokenMarkdownLinks kept at warn: external/generated markdown content may be fragile"

patterns-established:
  - "Build gate pattern: onBrokenLinks: throw catches all future internal link regressions at build time"
  - "Support stub pattern: docs/support/contact.md is the canonical landing for all support-related links until a real support system is built"

requirements-completed: [INTG-04]

# Metrics
duration: 29min
completed: 2026-03-06
---

# Phase 1 Plan 5: Broken Links Cleanup Summary

**Zero broken internal links with onBrokenLinks: 'throw' active — 92 support-ticket links, 22 device config links, 30+ missing subpage links, and 7 talos/platform-fundamentals path errors all fixed across 135 files**

## Performance

- **Duration:** 29 min
- **Started:** 2026-03-06T17:07:36Z
- **Completed:** 2026-03-06T17:36:00Z
- **Tasks:** 2
- **Files modified:** 135

## Accomplishments

- Surfaced all broken links by switching onBrokenLinks from 'ignore' to 'warn'
- Fixed every broken link across docs/, src/pages/, and role-based docs directories (135 files)
- Elevated onBrokenLinks to 'throw' — build now fails on any future broken internal link
- Created docs/support/contact.md stub as a valid destination for 92 broken support-ticket link references

## Task Commits

Each task was committed atomically:

1. **Task 1: Switch to 'warn' and surface all broken links** - `46ebd7b` (feat)
2. **Task 2: Elevate onBrokenLinks to 'throw' — final gate** - `a826f08` (feat)

## Files Created/Modified

- `classic/docusaurus.config.ts` - Changed onBrokenLinks: 'ignore' -> 'warn' -> 'throw'
- `classic/docs/support/contact.md` - New stub: target for all 92 broken support-ticket links
- `classic/docs-admin/index.md` - Removed relative broken quick-links (no sibling pages exist)
- `classic/docs-manager/index.md` - Same as above
- `classic/docs-operator/index.md` - Same as above
- `classic/docs-operator-minimal/index.md` - Same as above
- `classic/docs/alarm-management/*.md` (7 files) - Replaced 6 missing subpage targets with closest existing pages
- `classic/docs/devices/**/*.md` (50+ files) - Replaced troubleshooting-support links with /docs/support/contact
- `classic/docs/features/**/*.md` (14 files) - Same plus /docs/alarm-management/ trailing-slash fix
- `classic/docs/getting-started/**/*.mdx` (15 files) - Fixed talos/, platform-fundamentals/, admin-guide/ broken paths
- `classic/docs/index.mdx` - Fixed 11 broken device links
- `classic/src/data/onboardingPhases.ts` - Fixed what-is-nxgen-gcxone link (deleted page -> what-is-evalink-talos)
- `classic/src/pages/integration-hub.tsx` - Fixed 22 broken device configLinks
- `classic/src/pages/roles/*.tsx` (4 files) - Fixed docs/api/index, docs/getting-started, troubleshooting paths
- `classic/src/pages/quick-start/*.tsx` (3 files) - Fixed device links, docs/getting-started path, docs/devices trailing
- `classic/src/pages/towers.tsx` - Fixed towersDocLink to docs/devices/general/onboarding-overview
- `classic/src/pages/releases.tsx` - Fixed sprint-2025-12-a link to /releases
- `classic/src/pages/index.tsx` - Fixed knowledge-base-video-tutorials to knowledge-base/faq

## Decisions Made

- Created `docs/support/contact.md` as the canonical target for 92 broken support-ticket links — avoids mass link removal while providing a valid destination until a real support system is built
- Missing alarm-management subpages redirected to closest existing pages rather than creating empty stubs (alarm-filtering -> alarm-codes, false-alarms -> priority-whitelist-blacklist, etc.)
- Integration-hub device links with no docs redirected to `/docs/devices/general/onboarding-overview` as a generic fallback
- Role-based index.md files had all relative broken quick-links removed since no sibling pages exist in those directories
- `onBrokenAnchors` kept at `warn` per plan spec (anchors to be polished in Phase 5)
- `onBrokenMarkdownLinks` kept at `warn` per plan spec (external/generated markdown fragility)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Created docs/support/contact.md stub**
- **Found during:** Task 1 (surfacing broken links)
- **Issue:** 92 doc files linked to /docs/troubleshooting-support/how-to-submit-a-support-ticket which doesn't exist; removing all 92 links would degrade content quality
- **Fix:** Created a minimal stub page at docs/support/contact.md as the redirect target; updated all 92 references
- **Files modified:** classic/docs/support/contact.md (created), plus 92 doc files via global sed
- **Verification:** Build passes with zero broken-link warnings after fix
- **Committed in:** 46ebd7b (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical — stub page creation)
**Impact on plan:** The stub was necessary to avoid 92 content-quality regressions while still fixing the broken links. No scope creep.

## Issues Encountered

- Docusaurus `generated-index` category pages do not create a route at `/docs/[category-slug]` — the route is at `/docs/category/[slug]`. Multiple links pointing to `/docs/getting-started` (without a specific page) were broken for this reason. Fixed by redirecting them to `/docs/getting-started/first-time-login`.
- Role-based plugin directories (docs-admin, docs-manager, etc.) each had only an `index.md` file but their index.md files contained relative links to sibling pages that didn't exist. Fixed by removing the broken quick-links sections.

## Next Phase Readiness

- Build is clean with `onBrokenLinks: 'throw'` — any future broken internal link introduced during Phase 2 CMS work will be caught immediately
- Phase 1 is complete: all 5 content plans executed successfully
- Ready for `/gsd:verify-work` to sign off on Phase 1

---
*Phase: 01-cleanup*
*Completed: 2026-03-06*

## Self-Check: PASSED

- FOUND: classic/docusaurus.config.ts (contains `onBrokenLinks: 'throw'`)
- FOUND: classic/docs/support/contact.md (new stub page)
- FOUND: .planning/phases/01-cleanup/01-05-SUMMARY.md
- FOUND: commit 46ebd7b (Task 1: switch to warn + fix all broken links)
- FOUND: commit a826f08 (Task 2: elevate to throw)
