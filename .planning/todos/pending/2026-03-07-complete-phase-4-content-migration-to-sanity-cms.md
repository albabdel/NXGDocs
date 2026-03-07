---
created: 2026-03-07T13:36:57.686Z
title: Complete Phase 4 content migration to Sanity CMS
area: planning
files:
  - PHASE4_HANDOVER.md
  - classic/docs/ (177 MDX files)
  - classic/scripts/fetch-sanity-content.js
  - classic/docusaurus.config.ts
  - classic/plugins/docusaurus-plugin-sanity-content/index.js
  - classic/scripts/build-with-memory.js
---

## Problem

Phase 4 (Content Migration) of the NXGEN GCXONE Documentation Platform needs to be taken over and completed. There are 177 MDX/MD files in `classic/docs/` that must be migrated into Sanity CMS as structured documents (`doc`, `releaseNote`, `article`, `referencePage` types). After migration, routing must be reconfigured so Sanity-fetched content serves at `/docs/...` instead of the current static MDX — with zero new 404s.

Key challenges:
- Slug mapping must exactly match existing URL paths (case-sensitive on Cloudflare Pages)
- `gcxone.mdx` contains JSX with lucide-react icons that can't be represented in Portable Text
- Images need to be uploaded to Sanity's media library
- Frontmatter must be stripped (fetch script generates its own)
- `onBrokenLinks` is set to `'warn'` due to placeholder links — don't change to `'throw'` until resolved
- Release notes in `classic/src/pages/releases/` need migration to `releaseNote` type
- Internal content needs `targetAudience: ['internal']`

## Solution

Follow the section-by-section migration approach documented in PHASE4_HANDOVER.md:

1. Run `/gsd:plan-phase 4` to generate detailed execution plans
2. Start with `getting-started/` top-level files (~10 files) as proof of concept
3. Create `doc` documents in Sanity with slugs matching existing URL paths
4. Verify each section: trigger build, check URLs resolve correctly
5. Migrate subdirectories progressively: `getting-started/devices/`, `features/`, `devices/`, `knowledge-base/`
6. Migrate release notes to `releaseNote` type, articles to `article` type
7. Reconfigure `docusaurus.config.ts` routing: change `sanity-docs` plugin to `routeBasePath: 'docs'`
8. Delete original MDX files after verified migration
9. Full URL sweep to confirm zero new 404s
