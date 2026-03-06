---
phase: 01-cleanup
plan: 02
subsystem: frontend
tags: [components, dead-code, css-modules, cleanup]

# Dependency graph
requires:
  - 01-01-SUMMARY.md (Storyblok and dead CMS scripts removed)
provides:
  - classic/src/components/ containing only actively-rendered components
  - 15 orphaned component directories deleted; ~1,961 lines of dead TypeScript/CSS removed
  - Build verified clean after all deletions
  - CSS custom.css unchanged (components used CSS modules, not global rules)
affects: [03-cleanup, 04-cleanup]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Deleted components used CSS modules (styles.module.css) - no global CSS cleanup needed"
    - "Grep-confirm-before-delete: run import grep on every ambiguous component before rm -rf"

key-files:
  created: []
  modified:
    - classic/src/css/custom.css (unchanged - 3,832 lines; no component-specific global rules found)
  deleted:
    - classic/src/components/LanguageSwitcher/index.tsx
    - classic/src/components/LanguageSwitcher/styles.module.css
    - classic/src/components/TranslationGlow/index.tsx
    - classic/src/components/TranslationGlow/styles.module.css
    - classic/src/components/TranslationProgressBar/index.tsx
    - classic/src/components/TranslationProgressBar/styles.module.css
    - classic/src/components/ParticleBackground/index.tsx
    - classic/src/components/ParticleBackground/styles.module.css
    - classic/src/components/ScrollIndicator/index.tsx
    - classic/src/components/ScrollIndicator/styles.module.css
    - classic/src/components/TypingAnimation/index.tsx
    - classic/src/components/AnimatedStats/index.tsx
    - classic/src/components/BeforeAfter/After.tsx
    - classic/src/components/BeforeAfter/Before.tsx
    - classic/src/components/BeforeAfter/index.tsx
    - classic/src/components/ImageGallery/index.tsx
    - classic/src/components/PDFExport/index.tsx
    - classic/src/components/PDFExport/styles.module.css
    - classic/src/components/PDFExportButton/index.tsx
    - classic/src/components/PDFExportButton/styles.module.css
    - classic/src/components/HomepageFeatures/index.tsx
    - classic/src/components/HomepageFeatures/styles.module.css
    - classic/src/components/RoleLandingPage.tsx
    - classic/src/components/BreakthroughsGatewayCard.tsx

key-decisions:
  - "All 15 components confirmed orphaned via grep before deletion - no active callers found in pages/, theme/, or docs/"
  - "CSS custom.css unchanged: all deleted components used scoped CSS modules (styles.module.css), not global rules - no global CSS dead code to remove"
  - "GCXOneLandingPage was untracked (never committed) - deleted silently without git tracking"
  - "CSS baseline for Plan 04: 3,832 lines (unchanged from pre-task baseline - no component-owned global rules existed)"

patterns-established:
  - "Components using CSS modules are self-contained: deleting the directory removes all associated styles automatically"
  - "Global custom.css should only contain design system tokens and layout rules, not component rules"

requirements-completed: [CLEN-03, CLEN-04]

# Metrics
duration: 8min
completed: 2026-03-06
---

# Phase 1 Plan 02: Orphaned Component Deletion Summary

**Grep-confirmed and deleted 15 orphaned component directories (1,961 lines of dead TypeScript/CSS); CSS custom.css required no changes because all deleted components used scoped CSS modules**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-06T12:24:43Z
- **Completed:** 2026-03-06T12:32:55Z
- **Tasks:** 2
- **Files deleted:** 24 component files across 15 directories/files

## Accomplishments

- Grep-confirmed zero callers for all 15 components listed as orphaned in plan context
- Deleted 4 groups of components (i18n, visual effects, PDF export, landing pages)
- Build passes clean (webpack compiled client + server successfully) after all deletions
- CSS baseline for Plan 04 confirmed at 3,832 lines (no global CSS needed removal)
- Component directory reduced from ~53 entries to 39 entries

## Remaining Active Components

After deletion, these components remain (all verified as having active callers):
`AlgoliaInsights.tsx`, `BackToTop`, `BackgroundPattern`, `Badge`, `Callout`, `Checklist`, `CloudinaryImage`, `CloudinaryVideo`, `CodeBlock`, `Collapsible`, `DeviceCard`, `EnhancedFeatureCard`, `ErrorBoundary`, `FeatureCard`, `FeaturesGrid`, `Footer`, `GettingStarted`, `GradientText`, `LandingPageBackground`, `LanguageToggle`, `NXGENSphereHero.tsx`, `OnboardingDiagrams`, `PageFeedback`, `PageHeader`, `PrevNext`, `QuickLink`, `QuickLinks`, `RelatedArticles`, `RoleSwitcher.tsx`, `ScrollProgress`, `ShareSection`, `Skeleton`, `Steps`, `Tabs`, `ThemeToggle`, `VideoEmbed`, `VoCWidget`, `breakthroughs`

## Task Commits

1. **Task 1: Grep-confirm and delete 15 orphaned component directories** - `c66a956` (chore)
2. **Task 2: CSS dead rule removal** - No commit required; all deleted components used CSS modules (no global rules in custom.css to remove)

## CSS Baseline Note for Plan 04

- **Pre-task baseline:** 3,832 lines
- **Post-task count:** 3,832 lines (unchanged)
- **Reason:** All 15 deleted components stored their styles in co-located `styles.module.css` files, not in the global `custom.css`. The global file has no selectors matching any deleted component name.
- **Plan 04 starting point:** 3,832 lines (same as pre-task)

## Decisions Made

- No callers found for any of the 15 components — all 15 deleted as confirmed orphans
- `GCXOneLandingPage/` was an untracked directory (existed on disk, never committed to git); deletion required no git staging
- CSS custom.css required no changes: confirmed via grep against 13 pattern groups (particle, LanguageSwitcher, TranslationGlow, TranslationProgressBar, PDFExport, ScrollIndicator, TypingAnimation, BeforeAfter, AnimatedStats, ImageGallery, HomepageFeatures, GCXOneLandingPage, RoleLandingPage, BreakthroughsGateway, storyblok, tiptap, monaco) — zero matches for component-specific selectors

## Deviations from Plan

None - plan executed exactly as written. The only notable finding is that custom.css had zero component-specific global rules, so Task 2 was a verification task with no file changes.

## Issues Encountered

None.

## User Setup Required

None.

## Next Phase Readiness

- Component directory is clean: only actively-rendered components remain
- CSS custom.css is ready for Plan 04's consolidation pass (starting baseline: 3,832 lines)
- Plan 03 (import/broken-link audit) can proceed knowing all orphaned component surface is gone
- No TypeScript module-not-found errors introduced by these deletions

## Self-Check: PASSED

- FOUND: classic/src/components/ has 39 entries (no orphaned dirs)
- FOUND: commit c66a956 (Task 1 - 15 orphaned component deletions)
- CONFIRMED: npm run build exits 0 after all deletions
- CONFIRMED: custom.css unchanged at 3,832 lines (correct baseline for Plan 04)

---
*Phase: 01-cleanup*
*Completed: 2026-03-06*
