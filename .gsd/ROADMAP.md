# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0 (Content Migration)

## Must-Haves (from SPEC)
- [ ] Migrate all (~177) MDX/MD files from `classic/docs/` to appropriate Sanity types
- [ ] Reconfigure Docusaurus routing so Sanity content serves at `/docs/...`
- [ ] Zero new 404s on the live environment

## Phases

### Phase 1: Migration Scripting & Testing
**Status**: ⬜ Not Started
**Objective**: Build and test a Node.js script to parse MDX files from `classic/docs/`, convert markdown to Sanity Portable Text (or handle uploading), and push to Sanity CMS. Extract frontmatter appropriately.

### Phase 2: Content Migration execution
**Status**: ⬜ Not Started
**Objective**: Run the tested script to mass-migrate all `doc`, `releaseNote`, `article`, and `referencePage` entries. Verify document creation in Sanity logs and API. Delete migrated MDX files.

### Phase 3: Route Reconfiguration
**Status**: ⬜ Not Started
**Objective**: Update `docusaurus.config.ts` to switch the `/docs` routing entirely to the Sanity cache directories, remove old static plugin entries if necessary.

### Phase 4: Final Verification & Cleanup
**Status**: ⬜ Not Started
**Objective**: Build the site locally, verify all URLs resolve without 404s manually and/or systematically, push the changes to trigger the CF Pages build, and ensure the live site works intact.
