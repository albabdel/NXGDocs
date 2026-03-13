# ROADMAP.md

> **Current Phase**: UI Improvements Complete
> **Milestone**: v1.0 (Content Migration)
> **Updated**: 2026-03-13

## Must-Haves (from SPEC)
- [x] Migrate all (~177) MDX/MD files from `classic/docs/` to appropriate Sanity types
- [x] Reconfigure Docusaurus routing so Sanity content serves at `/docs/...`
- [x] Zero new 404s on the live environment

## Phases

### Phase 1: Migration Scripting & Testing
**Status**: ✅ Complete
**Objective**: Build and test a Node.js script to parse MDX files from `classic/docs/`, convert markdown to Sanity Portable Text (or handle uploading), and push to Sanity CMS. Extract frontmatter appropriately.

### Phase 2: Content Migration execution
**Status**: ✅ Complete
**Objective**: Run the tested script to mass-migrate all `doc`, `releaseNote`, `article`, and `referencePage` entries. Verify document creation in Sanity logs and API. Delete migrated MDX files.

### Phase 3: Route Reconfiguration
**Status**: ✅ Complete
**Objective**: Update `docusaurus.config.ts` to switch the `/docs` routing entirely to the Sanity cache directories, remove old static plugin entries if necessary.

### Phase 4: Final Verification & Cleanup
**Status**: ✅ Complete
**Objective**: Build the site locally, verify all URLs resolve without 404s manually and/or systematically, push the changes to trigger the CF Pages build, and ensure the live site works intact.

---

## Recent UI Improvements (2026-03-13)

### Roadmap Discoverability Enhancements

**Problem**: The `/roadmap` page was only accessible via direct URL, making it difficult for users to discover.

**Solution**: Added roadmap links and preview sections across the site:

#### Changes Made:

1. **Releases Page (`/releases`)** - `classic/src/pages/releases.tsx`
   - Added prominent "View Product Roadmap" button in hero section
   - Added "What's Coming Next" section with 4-card grid preview of upcoming roadmap items
   - Each card shows: title, status badge (Planned/In Progress with icons), projected release, change type
   - Added "View Full Roadmap" link at bottom of section

2. **Landing Page (`/`)** - `classic/src/pages/index.tsx`
   - Added "Coming Soon" subsection within the Releases section
   - Shows 3 upcoming roadmap items in a 3-column grid
   - Each item displays: status badge, projected release, title, description
   - Added "View Roadmap" link to the full roadmap page
   - Imported roadmap data from `sanity-roadmap.generated.json`

#### Technical Details:
- Used existing styling patterns (dark theme, gold accent colors)
- Added proper TypeScript types for RoadmapItem
- Implemented status badge configurations with appropriate colors
- Maintained consistency with existing framer-motion animations

#### Files Modified:
- `classic/src/pages/releases.tsx` - Added roadmap section and hero link
- `classic/src/pages/index.tsx` - Added roadmap preview subsection
