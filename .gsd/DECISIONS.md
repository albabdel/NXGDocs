# DECISIONS.md

## ADR-01: Programmatic Migration
**Date:** 2026-03-07
**Context:** Need to migrate ~177 MDX files to Sanity CMS.
**Decision:** We will create a Node.js migration script using `@sanity/client` and markdown-to-portable-text conversion logic rather than manually migrating files.
**Rationale:** Automation ensures accuracy and handles frontmatter extraction correctly for a large number of files.
