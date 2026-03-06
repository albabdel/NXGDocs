---
phase: 01-cleanup
plan: 03
subsystem: infra
tags: [npm, package-cleanup, dependencies, node_modules, docusaurus]

# Dependency graph
requires:
  - phase: 01-cleanup-01
    provides: Storyblok source files deleted (all @storyblok/* and sanitize.ts consumers removed)
  - phase: 01-cleanup-02
    provides: Dead CMS components deleted (tsparticles, tiptap, dnd-kit, i18n consumers all deleted)
provides:
  - classic/package.json with all dead CMS packages removed (31 deps remaining, down from 70+)
  - classic/package-lock.json regenerated with clean lockfile
  - Dead src/i18n/index.ts deleted (no consumers, references removed packages)
affects:
  - 01-cleanup-04 (CSS cleanup)
  - 01-cleanup-05 (broken links)
  - 01-cleanup-06 (nodemailer migration)
  - All phases: clean install from now on pulls only needed packages

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Audit-before-remove: grep for import/require before each uninstall to avoid breaking active code"
    - "Batch-and-verify: run npm run build after each package batch, never leave repo in broken state between removals"

key-files:
  created: []
  modified:
    - classic/package.json
    - classic/package-lock.json
  deleted:
    - classic/src/i18n/index.ts

key-decisions:
  - "Keep framer-motion: 25+ active import calls across pages/ and components/ - confirmed active library"
  - "Keep nodemailer + @types/nodemailer: reserved for Plan 01-06 (Cloudflare Pages Function)"
  - "Delete src/i18n/index.ts: orphaned module, no consumers found anywhere in src/, references now-removed packages"
  - "Remove react-mui-sidebar: grep confirmed no imports in src/ despite being in package.json"

patterns-established:
  - "Rule 2 - auto-remove orphaned module: src/i18n/index.ts had no callers - deleted alongside its package removals"

requirements-completed: [CLEN-01]

# Metrics
duration: 16min
completed: 2026-03-06
---

# Phase 1 Plan 3: Remove Dead npm Packages Summary

**Removed 39+ dead npm packages from classic/package.json via 4 confirmed batches + 7 audited groups, reducing dependency count from 70+ to 31 while maintaining passing builds throughout.**

## Performance

- **Duration:** 16 min
- **Started:** 2026-03-06T12:36:27Z
- **Completed:** 2026-03-06T12:52:20Z
- **Tasks:** 2
- **Files modified:** 3 (package.json, package-lock.json, deleted src/i18n/index.ts)

## Accomplishments

- Removed all 4 confirmed-dead batches: Storyblok (4 pkgs), Tiptap (8 pkgs), Monaco+GraphQL+Express (5 pkgs), devDeps (4 pkgs)
- Audited 7 package groups via grep; removed all confirmed-orphaned; left only framer-motion (25+ active callers)
- Every batch followed by passing `npm run build` — repository never left in broken state
- Deleted orphaned `src/i18n/index.ts` (no consumers, references removed packages)
- Final production dependency count: 24 (total including devDeps: 31), down from 70+ baseline

## Packages Removed

### Task 1 — Confirmed-Dead Batches (21 packages)

| Batch | Packages Removed |
|-------|-----------------|
| Batch 1 | `@storyblok/js`, `@storyblok/react`, `storyblok-js-client`, `dompurify` |
| Batch 2 | `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-table`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`, `@tiptap/extension-table-row`, `@tiptap/react`, `@tiptap/starter-kit` |
| Batch 3 | `@monaco-editor/react`, `graphql`, `graphql-request`, `express`, `cors` |
| Batch 4 (dev) | `decap-server`, `@types/pg`, `pg`, `@vercel/node` |

### Task 2 — Audit-First Removals (19 packages + 1 file)

| Group | Packages Removed | Grep Result |
|-------|-----------------|-------------|
| @dnd-kit | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` | No imports found |
| i18n | `i18next`, `i18next-browser-languagedetector`, `react-i18next`, `lunr-languages` | Only in orphaned `src/i18n/index.ts` |
| @tsparticles | `@tsparticles/engine`, `@tsparticles/react`, `@tsparticles/slim` | No imports found |
| PDF export | `html2canvas`, `jspdf` | No imports found |
| MUI | `@mui/material`, `@emotion/react`, `@emotion/styled` | No imports found |
| Single packages | `browser-image-compression`, `pdf-parse`, `axios`, `immer`, `zustand`, `marked`, `turndown`, `react-markdown`, `gray-matter`, `js-yaml`, `dotenv`, `react-mui-sidebar` | No imports found |

### Packages Retained (with reason)

| Package | Reason |
|---------|--------|
| `framer-motion` | 25+ active `import { motion }` in pages/ and components/ (FeatureCard, NXGENSphereHero, PageHeader, ScrollProgress, 404, and 20+ pages) |
| `nodemailer`, `@types/nodemailer` | Reserved — will be migrated to Cloudflare Pages Function in Plan 01-06 |

## Task Commits

1. **Task 1: Remove confirmed-dead packages in verified batches** — `7db13ea` (chore)
2. **Task 2: Audit and remove ambiguous packages** — `cb05ba4` (chore)

## Files Created/Modified

- `classic/package.json` — Dependencies object with all dead CMS packages removed (31 total remaining)
- `classic/package-lock.json` — Lockfile regenerated after all removals
- `classic/src/i18n/index.ts` — DELETED (orphaned module with no consumers, referenced removed packages)

## Decisions Made

- **Keep framer-motion:** grep found 25+ active `import { motion }` calls across pages/ and src/components/ — cannot remove without breaking the UI layer
- **Keep nodemailer + @types/nodemailer:** Plan 01-06 explicitly reserves these for the Cloudflare Pages Function rewrite
- **Delete src/i18n/index.ts:** The file itself only existed as a consumer of i18n packages; once packages were removed, the file had no callers and would cause TypeScript errors — deleted as part of the i18n cleanup (Rule 2 auto-fix)
- **Remove react-mui-sidebar:** Despite being a React component package, grep confirmed zero import statements in src/ — safe to remove

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Deleted orphaned src/i18n/index.ts alongside i18n package removal**
- **Found during:** Task 2 (i18n group audit)
- **Issue:** `src/i18n/index.ts` imports from the removed i18n packages but has zero consumers. Leaving it would cause TypeScript compile errors in future builds when someone runs `tsc`.
- **Fix:** Deleted `src/i18n/index.ts` and the now-empty `src/i18n/` directory.
- **Files modified:** `classic/src/i18n/index.ts` (deleted)
- **Verification:** `npm run build` passes; no `src/i18n` references anywhere in the project.
- **Committed in:** `cb05ba4` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 2 - missing critical)
**Impact on plan:** Auto-fix necessary to prevent future TypeScript errors. No scope creep.

## Issues Encountered

None — all four confirmed-dead batches and all audit-first groups resolved cleanly on first attempt. Build passed after every single batch.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `classic/package.json` is now a clean dependency manifest with 31 packages (24 prod + 7 dev)
- `npm run build` exits 0 cleanly
- Plan 01-04 (CSS cleanup) can proceed — no package dependencies affected
- Plan 01-06 (nodemailer migration) retains `nodemailer` and `@types/nodemailer` as planned

---
*Phase: 01-cleanup*
*Completed: 2026-03-06*

## Self-Check: PASSED

- `classic/package.json` — FOUND
- `classic/package-lock.json` — FOUND
- `classic/src/i18n/index.ts` — CONFIRMED DELETED
- `.planning/phases/01-cleanup/01-03-SUMMARY.md` — FOUND
- Commit `7db13ea` (Task 1) — FOUND
- Commit `cb05ba4` (Task 2) — FOUND
