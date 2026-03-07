---
phase: 02-cms-setup
plan: 02
subsystem: infra
tags: [sanity, sanity-studio, cms, schema, portable-text, typescript]

# Dependency graph
requires:
  - phase: 02-01
    provides: studio/ scaffold with empty schemaTypes/index.ts barrel and plugins registered
provides:
  - studio/schemaTypes/portableText.ts: shared bodyField Portable Text definition (block, code, callout, image, table members)
  - studio/schemaTypes/doc.ts: doc document type with 7 fields including targetAudience
  - studio/schemaTypes/releaseNote.ts: releaseNote document type with sprintId
  - studio/schemaTypes/article.ts: article document type with tags
  - studio/schemaTypes/reference.ts: referencePage document type (3 fields)
  - studio/schemaTypes/index.ts: barrel exporting all 4 types to sanity.config.ts
  - Sanity schema manifest deployed to project fjjuacab/production — MCP has full schema context
affects:
  - 02-03 (studio deployment — schema must be committed and clean)
  - 03 (integration pipeline — Phase 3 GROQ queries consume these exact field names)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Shared Portable Text definition via bodyField export — all document types import the same body field, no copy-paste drift
    - Callout blocks use plain text body (not nested Portable Text) to avoid Studio recursion issues
    - Code blocks via @sanity/code-input type: 'code', tables via @sanity/table type: 'table'
    - Inline field validation uses `import type {Rule} from 'sanity'` — correct type for Sanity v5

key-files:
  created:
    - studio/schemaTypes/portableText.ts
    - studio/schemaTypes/doc.ts
    - studio/schemaTypes/releaseNote.ts
    - studio/schemaTypes/article.ts
    - studio/schemaTypes/reference.ts
  modified:
    - studio/schemaTypes/index.ts

key-decisions:
  - "referencePage not reference: Sanity reserves 'reference' as a built-in type for cross-document references — document type renamed to 'referencePage'. Phase 3 GROQ must use _type == 'referencePage'"
  - "Callout body uses type: 'text' not nested array: nested Portable Text inside defineArrayMember causes Studio recursion issues; plain text is correct for admonition content"
  - "Rule type annotation: inline fields inside defineArrayMember objects use 'import type {Rule} from sanity' not hand-typed {required: () => unknown} — the latter causes TS2322 errors in strict mode"

patterns-established:
  - "Pattern: shared bodyField import — portableText.ts exports one bodyField used by all 4 document types; changes to body structure happen in one file"
  - "Pattern: plugin types in sanity.config.ts plugins[] array — code and table types are registered via plugins, not in schemaTypes array directly"

requirements-completed: [CMS-03]

# Metrics
duration: 42min
completed: 2026-03-07
---

# Phase 2 Plan 02: Schema Authoring Summary

**Four Sanity document types (doc, releaseNote, article, referencePage) with shared Portable Text body definition deployed to project fjjuacab/production**

## Performance

- **Duration:** 42 min
- **Started:** 2026-03-07T06:26:06Z
- **Completed:** 2026-03-07T07:08:00Z
- **Tasks:** 2
- **Files modified:** 6 (5 created + 1 updated)

## Accomplishments

- Created shared `portableText.ts` with `bodyField` supporting: standard blocks (h2/h3/h4/blockquote), code blocks with 10-language selector, callout objects (note/tip/warning/danger), images with required alt text, and tables
- Created all 4 document type schemas: `doc` (7 fields), `releaseNote` (5 fields), `article` (5 fields), `referencePage` (3 fields) — all importing the shared `bodyField`
- Updated `schemaTypes/index.ts` from empty stub to exporting all 4 types
- TypeScript compiles with zero errors in `schemaTypes/` (pre-existing node_modules type errors excluded as out-of-scope)
- Schema manifest deployed to Sanity project fjjuacab — MCP server at mcp.sanity.io now has full schema context for all 4 document types

## Task Commits

Each task was committed atomically:

1. **Task 1: Create shared Portable Text and all four document schemas** - `f278368` (feat)
2. **Task 1 deviation fix: rename reference to referencePage** - `90dfff8` (fix)

Task 2 (schema deploy) has no repo commit — deploys schema to Sanity cloud only.

## Files Created/Modified

- `studio/schemaTypes/portableText.ts` — Shared `bodyField`: block, code, callout, image, table array members
- `studio/schemaTypes/doc.ts` — Documentation Page: title, slug, targetAudience (6 options, default: ['all']), category, sidebarPosition, body, lastUpdated
- `studio/schemaTypes/releaseNote.ts` — Release Note: title, slug, sprintId, publishedAt, body
- `studio/schemaTypes/article.ts` — Article: title, slug, tags (string array), publishedAt, body
- `studio/schemaTypes/reference.ts` — Reference Page: title, slug, body (document type named `referencePage`)
- `studio/schemaTypes/index.ts` — Barrel: `[docType, releaseNoteType, articleType, referenceType]`

## Decisions Made

- **referencePage instead of reference:** Sanity's built-in schema has a reserved `reference` type (for cross-document references). Attempting to create a document type named `reference` causes a SchemaError during manifest extraction (`sanity schema deploy`). Renamed to `referencePage`. Phase 3 GROQ queries must use `_type == 'referencePage'` not `_type == 'reference'`.
- **Callout body as plain text:** Nesting `array` (Portable Text) inside a `defineArrayMember` object causes Studio rendering recursion. Using `type: 'text'` for callout content is the correct pattern.
- **Rule type for inline field validation:** The plan's inline validation type `(rule: { required: () => unknown }) => unknown` causes TS2322 in strict mode. Corrected to `import type {Rule} from 'sanity'` per Sanity v5 type system.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Renamed document type from 'reference' to 'referencePage'**
- **Found during:** Task 2 (schema deploy)
- **Issue:** `sanity schema deploy` fails with `SchemaError` — schema validation error message: "Invalid type name: 'reference' is a reserved name." The name conflicts with Sanity's built-in reference type.
- **Fix:** Updated `studio/schemaTypes/reference.ts` to use `name: 'referencePage'` instead of `name: 'reference'`. Added comment explaining the rename for future readers.
- **Files modified:** `studio/schemaTypes/reference.ts`
- **Verification:** `node validate-schema2.cjs` reports "Schema validation: OK"; `sanity schema deploy` exits 0 with "Deployed 1/1 schemas"
- **Committed in:** `90dfff8` (fix commit)

**2. [Rule 1 - Bug] Fixed validation type annotation in portableText.ts**
- **Found during:** Task 1 TypeScript check
- **Issue:** Inline field validation typed as `(rule: { required: () => unknown }) => unknown` causes TS2322 — return type `unknown` not assignable to `SchemaValidationValue`
- **Fix:** Changed to `import type {Rule} from 'sanity'` and used `(rule: Rule) => rule.required()` in all three inline validation callbacks
- **Files modified:** `studio/schemaTypes/portableText.ts`
- **Verification:** `npx tsc --noEmit` shows 0 errors in schemaTypes/
- **Committed in:** `f278368` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes necessary for correctness. The `reference` rename is a Phase 3 contract deviation — documented clearly so Phase 3 uses `referencePage` in GROQ queries. No scope creep.

## Issues Encountered

- **SchemaError message is opaque:** `sanity schema deploy` reports only `SchemaError: SchemaError` with no details about which type is invalid. Required running a custom Node.js validation script (`validate-schema2.cjs`) to surface the actual error: "Invalid type name: 'reference' is a reserved name." This is a known Sanity CLI UX limitation.
- **Node_modules TypeScript errors:** Pre-existing TS7016/TS2503 errors in `@types/mdx`, `sanity`, `styled-components` node_modules — all out-of-scope. schemaTypes/ files themselves compile with zero errors.

## Next Phase Readiness

- Schema committed and deployed — Plan 02-03 (studio deployment to nxgen-docs.sanity.studio) can proceed
- All 4 document types available in Sanity Studio for content entry
- Phase 3 field name contracts:
  - `doc`: title, slug, targetAudience, category, sidebarPosition, body, lastUpdated
  - `releaseNote`: title, slug, sprintId, publishedAt, body
  - `article`: title, slug, tags, publishedAt, body
  - `referencePage`: title, slug, body (NOTE: type is `referencePage`, not `reference`)

---
*Phase: 02-cms-setup*
*Completed: 2026-03-07*
