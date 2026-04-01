---
phase: 36-content-infrastructure
plan: 01
status: complete
completed_at: "2026-04-01T23:00:00Z"
requirements:
  - CONT-01
  - CONT-02
  - CONT-04
---

# Summary: Product Field for Sanity Schemas

## What Was Built

Reusable product field definition for Sanity schemas enabling multi-product content ownership. Every document now has a required product field with three options: GCXONE, GC Surge, or Shared.

## Files Created/Modified

| File | Change |
|------|--------|
| `studio/schemaTypes/fields/product.ts` | Created reusable product field definition |
| `studio/schemaTypes/doc.ts` | Added product field + updated preview |
| `studio/schemaTypes/release.ts` | Added product field + updated preview |
| `studio/schemaTypes/article.ts` | Added product field + updated preview |
| `studio/schemaTypes/roadmapItem.ts` | Added product field + updated preview |
| `studio/schemaTypes/landingPage.ts` | Added product field + updated preview |
| `studio/schemaTypes/sidebarConfig.ts` | Added product field to sidebarCategoryType + updated preview |
| `studio/schemaTypes/update.ts` | Added product field + updated preview |
| `studio/schemaTypes/deviceIntegration.ts` | Added product field + updated preview |
| `studio/scripts/migrate-product-field.ts` | Created migration script for backfill |

## Key Decisions

1. **Single reusable field**: Created `productField` in `fields/product.ts` for DRY principle
2. **Three product options**: gcxone, gcsurge, shared - shared content appears in all builds
3. **Default value**: gcxone - existing content defaults to GCXONE for backward compatibility
4. **Required field**: Validation enforces that all documents have a product assignment
5. **Preview integration**: Product badge shown in Studio document list views

## Verification

- [x] Product field definition exists with enum values
- [x] All 8 document schemas import and use productField
- [x] Preview configurations show product badge
- [x] Migration script created with dry-run mode

## Checkpoint: Human Verification Required

Before marking complete, verify:
1. Open Sanity Studio: `cd studio && npm run dev`
2. Create a new document of each type
3. Verify "Product" field appears with radio buttons: GCXONE, GC Surge, Shared
4. Verify default selection is GCXONE
5. Run migration script: `npx tsx studio/scripts/migrate-product-field.ts`
6. Verify output shows existing documents backfilled
7. Run migration again to verify 0 documents need migration

## Commit

`31d6a97` - feat(phase-36): add product field to all Sanity schemas
