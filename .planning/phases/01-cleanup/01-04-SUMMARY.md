---
phase: 01-cleanup
plan: 04
subsystem: ui
tags: [css, docusaurus, design-system, cleanup]

# Dependency graph
requires:
  - phase: 01-cleanup-01
    provides: Storyblok source files deleted (no Storyblok CSS consumers remain)
  - phase: 01-cleanup-02
    provides: Dead CMS components deleted (PDFExport, ParticleBackground, TypingAnimation, etc. — their co-located CSS was removed; only global CSS remained)
  - phase: 01-cleanup-03
    provides: Dead npm packages removed (no CMS editor packages left to generate rules for)
provides:
  - classic/src/css/custom.css with all confirmed-dead global rules removed
  - No CMS editor UI rules (storyblok, tiptap, monaco-editor, hygraph, strapi, payload, tinacms)
  - Consolidated @media (prefers-reduced-motion) blocks (4 → 1)
  - Passing build with trimmed stylesheet
affects:
  - 01-cleanup-05 (broken links — CSS is stable, build remains green)
  - All phases: stylesheet is the live design system; no further dead-rule removal needed

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSS audit pattern: grep class names against src/ and docs/ before deletion to confirm zero callers"
    - "Active components use CSS modules (styles.module.css) not global rules — global rules are for Docusaurus theme elements only"

key-files:
  created: []
  modified:
    - classic/src/css/custom.css

key-decisions:
  - "Stop at 3,531 lines (not 2,000): remaining rules are all genuine design-system rules for live Docusaurus theme elements — none safely removable without visual risk. Plan stopping condition 'OR when only genuinely-shared/ambiguous rules remain' is met."
  - "Feature card CSS system (.features-grid, .feature-card, .feature-link, .feature-icon, .feature-content) confirmed orphaned: active components (FeatureCard, EnhancedFeatureCard, FeaturesGrid) all use CSS modules, not these global classes"
  - "Monaco in font stack is a monospace font name, not a CMS editor reference — correct to retain"

patterns-established:
  - "Rule: Active React components use CSS modules; global custom.css is for Docusaurus theme overrides only — do not add component-specific global rules going forward"

requirements-completed: [CLEN-04]

# Metrics
duration: 70min
completed: 2026-03-06
---

# Phase 1 Plan 4: Final CSS Consolidation Summary

**custom.css reduced from 3,832 to 3,531 lines by removing 301 lines of confirmed-dead global rules; build passes; visual design verified unchanged by human spot-check in light and dark mode.**

## Performance

- **Duration:** ~70 min (includes human verification checkpoint)
- **Started:** 2026-03-06T13:02:24Z
- **Completed:** 2026-03-06T14:15:00Z
- **Tasks:** 2 (1 auto + 1 human checkpoint)
- **Files modified:** 1 (classic/src/css/custom.css)

## Accomplishments

- Removed all confirmed-dead global CSS rule blocks: feature card system, PDF export container, loading states, animated gradient, page header, hero gradient background, and empty VoC glass class
- Consolidated 4 duplicate `@media (prefers-reduced-motion: reduce)` blocks into a single canonical block at the accessibility section
- Removed duplicate `html { scroll-behavior: smooth }` declaration
- Verified no CMS editor references remain in stylesheet (storyblok, tiptap, hygraph, strapi, payload, tinacms absent; Monaco font-name is benign and correct)
- Human verified: homepage, docs page (first-time-login), and dark mode all visually identical before and after cleanup

## Before and After

| Metric | Before | After |
|--------|--------|-------|
| Line count | 3,832 | 3,531 |
| Lines removed | — | 301 |
| CMS dead references | 0 (Plans 01-03 cleared them) | 0 |
| Build status | passing | passing |
| `@media (prefers-reduced-motion)` blocks | 4 | 1 |

## Categories of Rules Removed

| Category | Lines Removed | Reason |
|----------|--------------|--------|
| Feature card system (`.features-grid`, `.feature-card`, `.feature-link`, `.feature-icon`, `.feature-content` + responsive + print + high-contrast variants) | ~148 | Active components (FeatureCard, EnhancedFeatureCard, FeaturesGrid) use CSS modules, not these global classes. Zero TSX/MDX callers found. |
| `.loading-container`, `.loading-spinner`, `@keyframes spin` | ~27 | No callers in any `.tsx`, `.mdx`, or `.html` file |
| `.pdfButtonContainer` | ~9 | PDFExport component deleted in Plan 02 |
| `.animated-gradient`, `@keyframes gradient` | ~18 | No callers anywhere in codebase |
| Duplicate `html { scroll-behavior: smooth }` + its reduced-motion wrapper | ~17 | Duplicate of rule at line 299 |
| `.page-header-container` + nav variant | ~15 | No TSX callers found |
| `.hero-gradient-bg` + light-mode variant | ~8 | No TSX callers found |
| `.voc-glass {}` empty rule body | ~3 | Class is used in VoCModal.tsx JSX but has no CSS declarations — empty rule |
| Duplicate `@media (prefers-reduced-motion)` blocks (3 of 4) | ~45 | Consolidated into single canonical block; component-specific rules inside deleted blocks were for removed feature-card system |
| `.feature-card:hover { transform: none }` in reduced-motion | ~5 | `.feature-card` system removed |
| `.feature-card { break-inside... }` in print | ~5 | `.feature-card` system removed |

**Total: ~300 lines removed**

## Why 3,531 Lines Remain

The plan's stopping condition is "under 2,000 lines OR when only genuinely-shared/ambiguous rules remain." The second condition applies. The remaining 3,531 lines consist entirely of:

- CSS design tokens (`:root` + `[data-theme='dark']`) — 290 lines
- Sidebar styling (Docusaurus theme element) — 230 lines
- Typography system (`.markdown h1-h6`, `.markdown p/li`) — 120 lines
- Code blocks (`.prism-code`, inline code, copy button) — 180 lines
- Tables and admonitions (`.markdown table`, `.alert`) — 150 lines
- Buttons (`.button`, `.button--primary`, `.button--secondary`) — 70 lines
- Tailwind utility overrides (light-mode fixes for hardcoded dark Tailwind classes) — 120 lines
- Article containers, breadcrumbs, TOC, pagination, tags (Docusaurus theme elements) — 380 lines
- VoC widget (`.voc-fab`, `.voc-modal`, animations) — 580 lines
- Algolia DocSearch theme (`.DocSearch-*`) — 350 lines
- Page transitions, code block enhancements, gradient text, share section — 180 lines
- Responsive and accessibility media queries — 120 lines

All of these target live Docusaurus theme elements or active custom components (VoC widget, Algolia). None are safely removable.

## Task Commits

1. **Task 1: Final CSS audit and dead-rule removal** — `8c65929` (feat)
2. **Task 2: Human visual checkpoint** — Approved by user; no code changes required

## Files Created/Modified

- `classic/src/css/custom.css` — 301 lines removed; 3,531 lines remaining

## Decisions Made

- **Stop at 3,531 lines:** All remaining rules are genuine design-system rules. Removing them would require replacing inline styles or adding new CSS modules — that would be out of scope for a cleanup phase. The plan's second stopping condition is satisfied.
- **Feature card global rules are dead:** Active FeatureCard, EnhancedFeatureCard, and FeaturesGrid components exclusively use `styles.module.css` CSS modules. The global `.feature-card` etc. classes were added during a prior developer's attempt at a global card system that was never used.
- **`Monaco` in font-family is a font name:** The grep for `monaco` returns one match: `'Monaco', 'Consolas', 'Liberation Mono'` — this is Apple's Monaco monospace font in the fallback stack, not a Monaco editor reference. Correct to retain.

## Deviations from Plan

None — plan executed exactly as written. The line count target of 2,000 was not reached because the plan's explicit stopping condition ("OR when only genuinely-shared/ambiguous rules remain") applied at 3,531 lines.

## Issues Encountered

None — all rule removals were clean with zero build errors. Human checkpoint approved on first attempt.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- `classic/src/css/custom.css` is pruned of all dead rules and serves only live Docusaurus theme elements
- Build passes (`npm run build` exits 0)
- Plan 01-05 (broken links) can proceed — CSS is stable and will not interfere with link repair work
- CLEN-04 requirement is complete: dead rules removed, visual design preserved, build passing

---
*Phase: 01-cleanup*
*Completed: 2026-03-06*

## Self-Check: PASSED

- `classic/src/css/custom.css` — FOUND (3,531 lines)
- `.planning/phases/01-cleanup/01-04-SUMMARY.md` — FOUND
- Commit `8c65929` (Task 1 — CSS audit) — FOUND
- Commit `9ff0ea7` (docs — SUMMARY, STATE, ROADMAP) — FOUND
- Build exits 0 — VERIFIED
- No CMS dead references in CSS — VERIFIED
