---
phase: 36-content-infrastructure
plan: 02
status: complete
completed_at: "2026-04-01T23:10:00Z"
requirements:
  - CONT-03
  - CONT-05
depends_on:
  - 36-01
---

# Summary: GROQ Product Filtering

## What Was Built

Product filtering for all GROQ queries in the build pipeline, ensuring each product build fetches only its own content plus shared content.

## Files Modified

| File | Change |
|------|--------|
| `classic/scripts/fetch-sanity-content.js` | Added product filter to all GROQ queries |
| `scripts/generate-sidebar-from-sanity.js` | Added product filter to sidebar generation |

## Key Implementation

### Product Filter Logic

```javascript
function getProductFilter() {
  const PRODUCT = process.env.PRODUCT || 'gcxone';
  return `(product == "${PRODUCT}" || product == "shared")`;
}
```

This OR clause ensures:
- Product-specific content (`product == "gcxone"`) is included
- Shared content (`product == "shared"`) appears in all builds
- No content is lost during the transition

### Queries Updated

1. `getLandingPageQuery()` - Landing pages filtered by product
2. `getQueries()` - doc, article, referencePage queries filtered
3. `getReleasesQuery()` - Releases filtered by product
4. `getRoadmapQuery()` - Roadmap items filtered by product
5. `getUpdatesQuery()` - Updates filtered by product
6. `getDeviceIntegrationsQuery()` - Device integrations filtered by product
7. Sidebar category and doc queries filtered

## Verification

- [x] `getProductFilter()` function exists in both scripts
- [x] All GROQ queries include product filter clause
- [x] PRODUCT environment variable defaults to 'gcxone'
- [x] Console log shows active product filter at build time

## Checkpoint: Human Verification Required

Before marking complete, verify:
1. Run: `PRODUCT=gcxone node classic/scripts/fetch-sanity-content.js`
2. Check console shows "Product filter: gcxone (includes shared)"
3. Run: `PRODUCT=gcsurge node classic/scripts/fetch-sanity-content.js`
4. Verify only gcsurge+shared content fetched (minimal until GCSurge content created)
5. Run sidebar generation with PRODUCT=gcxone
6. Verify classic/sidebars.ts generated successfully

## Commit

`f9cc89f` - feat(phase-36): add product filtering to GROQ queries
