---
phase: 03-integration-pipeline
plan: 02
subsystem: sanity-plugin
tags: [sanity, docusaurus, plugin, portable-text, mdx, groq]
dependency_graph:
  requires:
    - "@sanity/client in classic/node_modules (from 03-01)"
    - "@portabletext/markdown in classic/node_modules (from 03-01)"
  provides:
    - "classic/plugins/docusaurus-plugin-sanity-content/index.js (Docusaurus CMS plugin)"
    - "classic/.sanity-cache/docs/ populated at build time with .mdx files"
    - "Docusaurus route /sanity-docs/... serving Sanity content"
  affects:
    - "classic/docusaurus.config.ts (plugin registration + sanity-docs content instance)"
    - "classic/package.json (added @sanity/image-url)"
tech_stack:
  added:
    - "@sanity/image-url (CDN URL builder for Sanity image assets)"
  patterns:
    - "CJS Docusaurus plugin (module.exports function pattern)"
    - "Portable Text serialization via portableTextToMarkdown with custom components"
    - "Build-time content fetch via GROQ + fs.writeFileSync to .sanity-cache/"
    - "Audience-based directory routing (6 audience values → 6 subdirectories)"
key_files:
  created:
    - classic/plugins/docusaurus-plugin-sanity-content/index.js
  modified:
    - classic/docusaurus.config.ts
    - classic/package.json
    - classic/package-lock.json
decisions:
  - "Use portableTextToMarkdown (not toMarkdown) — that is the actual export name from @portabletext/markdown v1"
  - "Install @sanity/image-url in classic/ for build-time Sanity CDN URL resolution"
  - "callout.body is plain string — do NOT pass through portableTextToMarkdown"
  - "Plugin registered first in docusaurus.config.ts plugins[] so .sanity-cache/ is populated before plugin-content-docs reads it"
  - "Single sanity-docs content instance at /sanity-docs/... for Phase 3 proof-of-concept; role-specific routes deferred to Phase 4"
metrics:
  duration: "4 minutes"
  completed: "2026-03-07"
  tasks_completed: 2
  files_modified: 4
---

# Phase 3 Plan 02: Sanity Content Plugin Summary

CJS Docusaurus plugin that fetches all four Sanity content types via GROQ at build time, serializes Portable Text to MDX using portableTextToMarkdown with custom block renderers, writes files to .sanity-cache/ subdirectories by audience, and is registered first in docusaurus.config.ts so that the new sanity-docs plugin-content-docs instance can serve the generated pages at /sanity-docs/...

## What Was Built

Plan 03-02 delivers the core INTG-01 artifact: a build-time Docusaurus plugin that bridges Sanity Studio content to Docusaurus pages without any manual file management.

### Task 1: docusaurus-plugin-sanity-content/index.js

`classic/plugins/docusaurus-plugin-sanity-content/index.js` is a CommonJS module (matching the existing `docusaurus-plugin-last-update` pattern) that:

1. **Validates env vars** — throws a clear, actionable error if `SANITY_PROJECT_ID` or `SANITY_API_TOKEN` are missing, naming the exact var and what to do.

2. **Pre-creates all 6 cache directories** — calls `fs.mkdirSync({ recursive: true })` for all six `.sanity-cache/` subdirectories before any network request, so even if Sanity returns zero documents the directories exist for plugin-content-docs.

3. **Runs four GROQ queries** — one per content type (`doc`, `releaseNote`, `article`, `referencePage`). Each fetch uses hard-coded `apiVersion: '2025-02-06'` and `useCdn: false`. An API error on any query throws immediately and fails the build cleanly.

4. **Serializes Portable Text** — uses `portableTextToMarkdown` with custom component handlers for:
   - `code` blocks (reads `value.code` and `value.language`, wraps in fenced code)
   - `callout` blocks (plain-string `value.body` rendered as Docusaurus `:::type\ncontent\n:::` admonitions)
   - `image` blocks (uses `@sanity/image-url` builder on `value.asset._ref` to produce CDN URLs)
   - `table` blocks (renders as pipe-table markdown)
   - `link` marks (produces `[text](href)` links)
   - `underline` marks (produces `<u>text</u>` HTML since markdown has no underline)

5. **Generates type-specific frontmatter** — each content type gets its own frontmatter shape:
   - `doc`: `title`, optional `sidebar_position`, `sidebar_label`, `last_update.date`
   - `releaseNote` and `article`: `title`, optional `date`, `custom_edit_url: null`
   - `referencePage`: `title` only

6. **Routes by audience** — `doc` type uses `targetAudience[]` to determine which cache subdirectory to write to. A doc with `targetAudience: ['admin', 'manager']` gets written to both `docs-admin/` and `docs-manager/`. Defaults to `docs/` when `targetAudience` is absent.

7. **Per-document error isolation** — a serialization error on one document logs a warning and continues; only Sanity API fetch failures throw.

### Task 2: docusaurus.config.ts changes

Two edits to `classic/docusaurus.config.ts`:

**Plugin order** — `docusaurus-plugin-sanity-content` is now the **first** entry in `plugins[]`, before `docusaurus-plugin-last-update` and before all `plugin-content-docs` instances. This ordering is required: Docusaurus runs `loadContent()` of plugins in registration order, so the Sanity plugin must write `.sanity-cache/` files before the content-docs plugin reads them.

**New content instance** — A new `plugin-content-docs` entry with `id: 'sanity-docs'` and `path: '.sanity-cache/docs'` serves the generated MDX at `/sanity-docs/...`. The sidebar is auto-generated (`sidebarPath: undefined`). This is a Phase 3 staging route — Phase 4 will migrate this to the canonical role-based routes.

### Deviation: @sanity/image-url installation

The plan noted to install `@sanity/image-url` if not present. It was not present in `classic/node_modules/@sanity/`, so it was installed via `npm install @sanity/image-url`. This is tracked as a planned deviation, not an error.

### Deviation: Export name discovery

The plan noted to verify the `@portabletext/markdown` export name. The actual export is `portableTextToMarkdown` (not `toMarkdown`). The plugin uses the correct name.

## Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create docusaurus-plugin-sanity-content/index.js | 236fecf | classic/plugins/docusaurus-plugin-sanity-content/index.js, classic/package.json, classic/package-lock.json |
| 2 | Register plugin in docusaurus.config.ts and add sanity-docs content instance | 54baa8e | classic/docusaurus.config.ts |

## Awaiting Checkpoint

Task 3 is a `checkpoint:human-verify` gate. The build-time test requires:
1. A published document in Sanity Studio (nxgen-docs.sanity.studio)
2. Running `npm run build` with `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` set
3. Verifying `.sanity-cache/docs/test-integration-doc.mdx` exists
4. Serving the built site and visiting `/sanity-docs/test-integration-doc`

## Verification Results

Pre-build automated checks:

```
test -f classic/plugins/docusaurus-plugin-sanity-content/index.js
# PASS: file exists

node -e "const p = require('./plugins/docusaurus-plugin-sanity-content/index.js'); const r = p({siteDir: '/tmp'}, {}); console.log(r.name)"
# → docusaurus-plugin-sanity-content

grep -c "docusaurus-plugin-sanity-content" classic/docusaurus.config.ts
# → 2 (plugin registration + comment)

grep -c "sanity-docs" classic/docusaurus.config.ts
# → 2 (id field + comment)
```

Build-time checks (require Sanity env vars + Studio publish): deferred to human-verify checkpoint.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Missing dependency] Installed @sanity/image-url**
- **Found during:** Task 1
- **Issue:** `@sanity/image-url` was listed as "install if not present" in the plan — it was not present in `classic/node_modules/@sanity/`
- **Fix:** Ran `npm install @sanity/image-url` in `classic/`
- **Files modified:** classic/package.json, classic/package-lock.json
- **Commit:** Included in 236fecf

**2. [Rule 1 - Discovery] Correct export name from @portabletext/markdown**
- **Found during:** Task 1 verification of exports
- **Issue:** Plan listed both `toMarkdown` and `portableTextToMarkdown` as candidates
- **Fix:** Verified actual exports — `portableTextToMarkdown` is correct; used that name
- **Files modified:** classic/plugins/docusaurus-plugin-sanity-content/index.js
- **Commit:** 236fecf

## Self-Check: PASSED

Files exist:
- classic/plugins/docusaurus-plugin-sanity-content/index.js — FOUND (261 lines, above 80-line minimum)
- classic/docusaurus.config.ts — FOUND (contains docusaurus-plugin-sanity-content as first plugin, contains sanity-docs instance)

Commits:
- 236fecf — FOUND
- 54baa8e — FOUND
