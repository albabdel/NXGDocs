---
phase: 03-integration-pipeline
plan: 01
subsystem: dependencies
tags: [sanity, npm, gitignore, playwright, e2e]
dependency_graph:
  requires: []
  provides:
    - "@sanity/client in classic/node_modules"
    - "@portabletext/markdown in classic/node_modules"
    - ".sanity-cache/ gitignore guards"
    - "classic/e2e/sanity-content.spec.ts Playwright scaffold"
  affects:
    - "classic/package.json (new dependencies)"
    - "classic/.gitignore (new exclusion)"
    - ".gitignore (new exclusion)"
    - "classic/e2e/sanity-content.spec.ts (new file)"
tech_stack:
  added:
    - "@sanity/client ^7.16.0"
    - "@portabletext/markdown ^1.1.4"
  patterns:
    - "Playwright filesystem test (non-browser) for build artifact verification"
    - "test.skip pattern to scaffold tests before implementation exists"
key_files:
  created:
    - classic/e2e/sanity-content.spec.ts
  modified:
    - classic/package.json
    - classic/package-lock.json
    - classic/.gitignore
    - .gitignore
decisions:
  - "Install dependencies into classic/ (not root or studio/) — the plugin runs inside the Docusaurus build process"
  - "Use test.skip(true, ...) for the page-presence test until Plan 02 plugin is built"
  - "Filesystem check test does not require a browser — Playwright supports non-browser assertions"
metrics:
  duration: "1 minute"
  completed: "2026-03-07"
  tasks_completed: 2
  files_modified: 5
---

# Phase 3 Plan 01: Plugin Dependencies and Test Scaffold Summary

Install @sanity/client and @portabletext/markdown in classic/, add .sanity-cache/ to both .gitignore files, and scaffold the INTG-01 Playwright spec with a live filesystem check and a skipped page-presence test.

## What Was Built

Plan 03-01 established the pre-conditions required by Plan 02 (the Sanity plugin itself):

1. **npm dependencies installed** — `@sanity/client ^7.16.0` and `@portabletext/markdown ^1.1.4` are now in `classic/package.json` dependencies and resolve from `classic/node_modules`. These are the two runtime packages the plugin will import.

2. **Build artifact guards** — `.sanity-cache/` appended to both `classic/.gitignore` and the root `.gitignore`. The plugin will write fetched Sanity content into this directory during `npm run build`. Without these guards, every build would pollute the git working tree.

3. **Playwright spec scaffold** — `classic/e2e/sanity-content.spec.ts` created with two tests:
   - `sanity-cache/docs directory exists after build` — live filesystem assertion verifying the plugin output directory exists post-build (no browser needed)
   - `Sanity-sourced page renders at /sanity-docs/{slug}` — skipped with `test.skip(true, 'Plugin not yet built ...')` until Plan 02 is complete and a test document exists in Studio

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Install plugin dependencies | 1296059 | classic/package.json, classic/package-lock.json |
| 2 | Guard .sanity-cache/ and create Playwright spec | f44e28d | classic/.gitignore, .gitignore, classic/e2e/sanity-content.spec.ts |

## Verification Results

All post-plan checks passed:

```
node -e "require('@sanity/client'); require('@portabletext/markdown'); console.log('ok')"
# → ok

grep -q ".sanity-cache" classic/.gitignore && echo "classic gitignore ok"
# → classic gitignore ok

grep -q ".sanity-cache" .gitignore && echo "root gitignore ok"
# → root gitignore ok

test -f classic/e2e/sanity-content.spec.ts && echo "spec exists"
# → spec exists
```

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

Files exist:
- classic/package.json — FOUND (contains @sanity/client and @portabletext/markdown)
- classic/.gitignore — FOUND (contains .sanity-cache)
- .gitignore — FOUND (contains .sanity-cache)
- classic/e2e/sanity-content.spec.ts — FOUND (36 lines, above 20-line minimum)

Commits:
- 1296059 — FOUND
- f44e28d — FOUND
