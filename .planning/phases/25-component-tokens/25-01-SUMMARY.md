---
phase: 25-component-tokens
plan: 01
subsystem: design-system
tags: [css, tokens, theming, components, feature-card, docs-index]

# Dependency graph
requires:
  - phase: 24-css-architecture
    provides: CSS @layer architecture and tokens.css foundation
provides:
  - Glassmorphism CSS tokens for both light and dark themes
  - Theme-agnostic FeatureCard component using CSS classes
  - Theme-agnostic DocsIndex components using CSS classes
affects: [26-variant-system, 27-ui-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CSS tokens for theme-dependent values
    - CSS classes over inline style branches
    - Theme-agnostic component design

key-files:
  created: []
  modified:
    - classic/src/css/tokens.css
    - classic/src/css/components/cards.css
    - classic/src/components/FeatureCard/index.tsx
    - classic/src/components/DocsIndex/DocsHero.tsx
    - classic/src/components/DocsIndex/CategoriesGrid.tsx
    - classic/src/components/DocsIndex/QuickLinksSection.tsx
    - classic/src/components/DocsIndex/ResourcesSection.tsx
    - classic/src/components/DocsIndex/LandingPagesSection.tsx
    - classic/src/components/DocsIndex/ReturnHomeBanner.tsx

key-decisions:
  - "Use CSS tokens instead of JavaScript colorMode branching for styling"
  - "Keep useColorMode only where needed for non-styling purposes (canvas animation)"
  - "Add glassmorphism tokens for glass surfaces in both light and dark themes"

patterns-established:
  - "Pattern 1: CSS tokens in tokens.css for theme-dependent values"
  - "Pattern 2: CSS classes with [data-theme='dark'] selectors for automatic theme switching"
  - "Pattern 3: Remove useColorMode when only used for styling"

requirements-completed: [TOKN-01, TOKN-02, TOKN-03]

# Metrics
duration: 6min
completed: 2026-04-01
---

# Phase 25 Plan 01: Component Tokens Migration Summary

**Glassmorphism CSS tokens and theme-agnostic components replacing inline style branches**

## Performance

- **Duration:** 6 min
- **Started:** 2026-04-01T02:34:09Z
- **Completed:** 2026-04-01T02:40:49Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments

- Added glassmorphism CSS tokens for glass surfaces (glass-bg, glass-border, glass-shadow, icon-bg)
- Migrated FeatureCard from inline style branches to CSS classes using tokens
- Migrated all DocsIndex components (DocsHero, CategoriesGrid, QuickLinksSection, ResourcesSection, LandingPagesSection, ReturnHomeBanner) to CSS tokens
- Removed useColorMode hook usage from 6 components (kept only for canvas animation in DocsHero)

## Task Commits

Each task was committed atomically:

1. **task 1: Add glassmorphism tokens to tokens.css** - `abfae50` (feat)
2. **task 2: Migrate FeatureCard to use CSS tokens** - `1a3a8bf` (feat)
3. **task 3: Migrate DocsIndex components to use CSS tokens** - `1986645` (feat)

**Plan metadata:** (final commit pending)

## Files Created/Modified

- `classic/src/css/tokens.css` - Added glass-bg, glass-border, glass-shadow-inset, glass-shadow-hover, icon-bg, icon-bg-hover tokens for both themes
- `classic/src/css/components/cards.css` - Added .feature-card-glass, .docs-hero, .docs-index-card, .quick-link-card, .return-home-banner, .section-badge, .icon-container, .status-badge-*, .text-muted-*, .text-gold-link, .kbd-shortcut classes
- `classic/src/components/FeatureCard/index.tsx` - Removed useColorMode, replaced inline styles with CSS class
- `classic/src/components/DocsIndex/DocsHero.tsx` - Migrated inline styles to CSS, kept useColorMode for canvas animation only
- `classic/src/components/DocsIndex/CategoriesGrid.tsx` - Removed useColorMode, replaced inline styles with CSS classes
- `classic/src/components/DocsIndex/QuickLinksSection.tsx` - Removed useColorMode, replaced inline styles with CSS classes
- `classic/src/components/DocsIndex/ResourcesSection.tsx` - Removed useColorMode, replaced inline styles with CSS classes
- `classic/src/components/DocsIndex/LandingPagesSection.tsx` - Removed useColorMode, replaced inline styles with CSS classes
- `classic/src/components/DocsIndex/ReturnHomeBanner.tsx` - Removed useColorMode, replaced inline styles with CSS classes

## Decisions Made

- **CSS tokens over JS branching**: Use CSS custom properties with [data-theme='dark'] selectors instead of JavaScript colorMode conditionals for styling
- **Keep useColorMode only for non-styling**: DocsHero retains useColorMode because canvas particle animation needs theme awareness for color/opacity values
- **Glassmorphism tokens**: Created dedicated tokens for glass surfaces to maintain consistency across components

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components migrated successfully, build passes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- CSS tokens foundation complete for glassmorphism surfaces
- FeatureCard and DocsIndex components now theme-agnostic
- Ready for Phase 25 Plan 02 (remaining component migrations) or Phase 26 (variant system)

---
*Phase: 25-component-tokens*
*Completed: 2026-04-01*
