---
phase: 05-polish
plan: 05
subsystem: ui
tags: [react, tailwind, hero, light-mode, opacity, docusaurus]

requires:
  - phase: 05-polish
    provides: "Plan 05-03 identified the hero light mode washed-out background as a confirmed visual gap"
provides:
  - "NXGENSphereHero.tsx background opacity raised from 0.15 to 0.40 in light mode"
  - "White gradient overlay reduced from from-white/40...to-white/60 to from-white/10...to-white/25"
  - "Dark mode behavior byte-for-byte identical"
affects: [05-polish/05-06]

tech-stack:
  added: []
  patterns:
    - "isDark ternary pattern used to gate light/dark mode values in inline styles"
    - "Tailwind arbitrary fraction values (e.g., from-white/10) for overlay gradient opacity"

key-files:
  created: []
  modified:
    - classic/src/components/NXGENSphereHero.tsx

key-decisions:
  - "Background image opacity set to 0.40 in light mode (raised from 0.15) — threshold above which Background.jpg is visually meaningful on warm cream base"
  - "White overlay reduced from from-white/40...to-white/60 to from-white/10...to-white/25 — gradient no longer dominates top of hero"
  - "Pre-existing TypeScript error (TS2688 react-dom type definition) confirmed pre-existing and out of scope"

patterns-established: []

requirements-completed: [PLSH-02]

duration: 5min
completed: 2026-03-07
---

# Phase 05 Plan 05: Hero Light Mode Opacity Fix Summary

**Hero background.jpg opacity raised from 15% to 40% in light mode, and white gradient overlay reduced from 40/60% to 10/25% — eliminating the washed-out appearance without touching dark mode**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-07T22:15:39Z
- **Completed:** 2026-03-07T22:20:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Background image (Background.jpg) now renders at 40% opacity in light mode, up from 15% — visually meaningful on the warm cream base
- White gradient overlay reduced from `from-white/40 via-transparent to-white/60` to `from-white/10 via-transparent to-white/25` — overlay no longer dominates the hero banner
- Dark mode unchanged: opacity 0.8, `bg-black/40 backdrop-blur-sm` overlay are byte-for-byte identical
- PLSH-02 hero visual criterion addressed: background visible at threshold required by VERIFICATION.md

## Task Commits

1. **Task 1: Increase hero background opacity and reduce white overlay in light mode** - `c2810c9` (fix)

**Plan metadata:** (created with this summary)

## Files Created/Modified

- `classic/src/components/NXGENSphereHero.tsx` - Two-line fix: background opacity 0.15->0.40, overlay gradient from-white/40->from-white/10 and to-white/60->to-white/25

## Decisions Made

- Background opacity 0.40 was specified in plan as the minimum threshold for "reasonable opacity" per VERIFICATION.md
- White overlay reduction chosen to preserve text readability without wash-out effect
- Gold headline (`#996B1F`) and particle system colors were already correct — no changes needed to those elements

## Deviations from Plan

None - plan executed exactly as written. Two targeted changes made, no other elements modified.

## Issues Encountered

- The plan's verification script checks `': 0.15'` for "old opacity gone" — this returned a false negative because `staggerChildren: 0.15` in the animation config also contains `0.15`. Confirmed via direct grep that the specific `isDark ? 0.8 : 0.15` pattern is fully removed. The actual changes are correct.
- Pre-existing TypeScript error TS2688 (react-dom type definition) confirmed by stash-test — exists before this plan's changes, out of scope.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Hero light mode fix complete; visual verification deferred to Plan 05-06 human checkpoint
- Plan 05-06 (light mode contrast sweep for #E8B058 gold) is the final gap-closure plan before Phase 5 sign-off

---
*Phase: 05-polish*
*Completed: 2026-03-07*
