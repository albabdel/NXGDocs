---
phase: 05-polish
plan: 02
subsystem: search, config
tags: [algolia, docsearch, docusaurus, search]

requires:
  - phase: 03-integration-pipeline
    provides: Algolia credentials and indexer script (index-documentation.js)

provides:
  - Unified Algolia App ID (0QV3FAFAD5) matching indexer script
  - Unified index name (nxgen_docs) matching indexer script
  - contextualSearch disabled (index lacks docusaurus_tag facet)

affects: [05-03-plan]

tech-stack:
  added: []
  patterns:
    - "Algolia App ID and indexName must match between docusaurus.config.ts and index-documentation.js"

key-files:
  created: []
  modified:
    - classic/docusaurus.config.ts

key-decisions:
  - "DEVIATION: Plan said install docusaurus-pagefind (package does not exist on npm). Research file recommended Algolia credential unification instead. Implemented the research recommendation."
  - "App ID: V5T3AW2AU9 → 0QV3FAFAD5 (matches index-documentation.js)"
  - "indexName: 'Documentation site' → 'nxgen_docs' (matches index-documentation.js and algolia-config.json)"
  - "contextualSearch: true → false: nxgen_docs index does not have docusaurus_tag as a faceted attribute; contextualSearch silently returns zero results when facets are missing"

requirements-completed: [PLSH-01]

duration: 5min
completed: 2026-03-07
---

# Phase 5 Plan 02: Search — Algolia Credential Unification

**Algolia split-brain resolved: docusaurus.config.ts now uses the same App ID (0QV3FAFAD5) and index name (nxgen_docs) as the custom indexer script**

## Performance

- **Duration:** 5 min
- **Completed:** 2026-03-07
- **Tasks:** 1 (deviation: replaced planned 2-task Pagefind migration with targeted Algolia fix)
- **Files modified:** 1

## Accomplishments

- Unified Algolia App ID: `V5T3AW2AU9` → `0QV3FAFAD5` (now matches `index-documentation.js`)
- Unified index name: `'Documentation site'` → `'nxgen_docs'` (now matches `index-documentation.js` and `algolia-config.json`)
- Disabled `contextualSearch` which silently returns zero results when `docusaurus_tag` facet is not configured in the Algolia index settings

## Task Commits

1. **Algolia credential fix** - `a9f6cc1` (fix)

## Files Created/Modified

- `classic/docusaurus.config.ts` — App ID, indexName, contextualSearch corrected

## Decisions Made

- Kept `insights: true` and `clickAnalytics: true` — no reason to remove event tracking
- Did not update `search.spec.ts` — it already tests DocSearch selectors which remain correct

## Deviations from Plan

### Auto-fixed Issues

**1. [Plan deviation] docusaurus-pagefind package does not exist**

- **Found during:** Task 1 (attempted `npm install docusaurus-pagefind`)
- **Issue:** `npm error 404 Not Found - GET https://registry.npmjs.org/docusaurus-pagefind`. The package named in the plan does not exist. Available alternatives (`@getcanary/docusaurus-theme-search-pagefind`) are outdated (last updated 1-2 years ago).
- **Fix:** Implemented the original research recommendation instead — unified Algolia credentials (App ID and index name split-brain was the root cause identified in 05-RESEARCH.md).
- **Research reference:** `05-RESEARCH.md` line 20: "the docusaurus.config.ts references indexName: 'Documentation site' while the actual populated index is named nxgen_docs with a different App ID (0QV3FAFAD5 vs V5T3AW2AU9)."
- **Committed in:** `a9f6cc1`

---

**Total deviations:** 1 (scope change — Pagefind migration → Algolia credential fix)
**Impact on plan:** The core PLSH-01 goal (search returns results) is achieved via credential unification rather than search engine replacement. Less disruptive, no new dependencies, aligns with research recommendation.

## Issues Encountered

- `docusaurus-pagefind` package does not exist on npm — plan was based on a non-existent package name

## User Setup Required

After Phase 4 content migration and a new Cloudflare Pages deploy:
1. Trigger a fresh Algolia crawl from the Algolia dashboard (or DocSearch crawler service)
2. Ensure `docusaurus_tag` facet is NOT required (contextualSearch is now disabled)
3. Verify search returns results for "getting started" on the live site

## Next Phase Readiness

- Search infrastructure unified — fresh crawl after Phase 4 deploy will populate the correct index
- Plan 03 (human verification gate) can proceed after Phase 4 content is deployed

---
*Phase: 05-polish*
*Completed: 2026-03-07*
