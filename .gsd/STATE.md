# STATE.md

# Current Project Memory
Project initialized for Phase 4: Content Migration.

# Blockers & Known Issues
- We need the `SANITY_API_TOKEN` to actually execute Phase 2 and push documents to Sanity. The script is working locally in dry-run mode.

# Decisions Made
- Wrote a migration script (`classic/scripts/migrate-to-sanity.js`) that uses `marked` and `@sanity/block-tools` to convert Markdown to Portable Text.

# Next Steps
- Execute `migrate-to-sanity.js` with `SANITY_API_TOKEN`.
- Once files are successfully in Sanity, delete the MDX files from `classic/docs/`.
- Update `docusaurus.config.ts` route logic (Phase 3).
