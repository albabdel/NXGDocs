# Phase 4 Handover — Content Migration

**Project:** NXGEN GCXONE Documentation Platform
**Repo:** https://gitlab.com/albabdel/NXG-Docs
**Live site:** https://gcxone.pages.dev
**Sanity Studio:** https://nxgen-gcxone.sanity.studio
**Last commit:** `2feaa66` — build now passes and deploys successfully

---

## What You're Taking Over

You are the agent responsible for **Phase 4: Content Migration**.

**Goal:** Move all MDX content from `classic/docs/` into Sanity CMS. After migration, every URL that worked before still works, and editors can manage all content from Sanity Studio — no code changes needed to update docs.

**This is not a redesign.** The Docusaurus frontend stays exactly as it is. You are only moving content into Sanity.

---

## GSD Workflow (if available)

This project uses the **GSD (Get Shit Done)** workflow. If your environment supports it, run:

```
/gsd:plan-phase 4
```

This will:
1. Research the migration approach automatically
2. Create detailed PLAN.md files in `.planning/phases/04-content-migration/`
3. You then run `/gsd:execute-phase 4` to execute them

If GSD is not available, follow the manual instructions below.

---

## Architecture You Need to Understand

### How Content Currently Works

There are **two content sources** running in parallel:

1. **Static MDX** — files in `classic/docs/` → served at `/docs/...` routes
2. **Sanity content** — fetched at build time via `classic/scripts/fetch-sanity-content.js` → written to `classic/.sanity-cache/docs/` → served at `/sanity-docs/...` routes (currently)

**Phase 4 goal:** Migrate MDX files from source 1 into Sanity (source 2), then reconfigure the routing so Sanity content serves at `/docs/...` (same URLs as before).

### Key Files

| File | Purpose |
|------|---------|
| `classic/scripts/fetch-sanity-content.js` | Pre-build script — fetches all Sanity content and writes MDX to `.sanity-cache/` |
| `classic/plugins/docusaurus-plugin-sanity-content/index.js` | Docusaurus plugin — creates cache dirs and placeholders so build never fails |
| `classic/scripts/build-with-memory.js` | Build entry point — runs fetch script then `npx docusaurus build` |
| `classic/docusaurus.config.ts` | Docusaurus config — plugin registration, content-docs instances |
| `wrangler.toml` | Cloudflare Pages config — build command, env vars |

### Sanity Environment

| Variable | Value / Location |
|----------|-----------------|
| `SANITY_PROJECT_ID` | `fjjuacab` (in `wrangler.toml [vars]`, safe to read) |
| `SANITY_DATASET` | `production` (in `wrangler.toml [vars]`) |
| `SANITY_API_TOKEN` | Set as `secret_text` in Cloudflare Pages dashboard. Ask the project owner for the value if you need to run locally. |

### Sanity Content Types (schemas already set up)

| Type | Fields | Maps to |
|------|--------|---------|
| `doc` | `title`, `slug`, `targetAudience`, `category`, `sidebarPosition`, `body`, `lastUpdated` | Documentation pages |
| `releaseNote` | `title`, `slug`, `sprintId`, `publishedAt`, `body` | Sprint/release notes |
| `article` | `title`, `slug`, `tags`, `publishedAt`, `body` | Long-form KB articles |
| `referencePage` | `title`, `slug`, `body` | Specs, tables, glossary |

`body` is **Portable Text** in all types. The fetch script already serializes it to MDX.

### Current Routing (before Phase 4 changes)

```
/docs/...          → classic/docs/ (static MDX files)
/sanity-docs/...   → classic/.sanity-cache/docs/ (Sanity-fetched content)
```

### Target Routing (after Phase 4)

```
/docs/...          → classic/.sanity-cache/docs/ (all Sanity content, same URLs)
```

This means in `docusaurus.config.ts`, the `sanity-docs` plugin instance needs `routeBasePath: 'docs'` and the original `docs` instance either removed or pointed at a different path.

---

## Content to Migrate

**177 MDX/MD files** in `classic/docs/`. Key sections:

```
classic/docs/
├── getting-started/          (main onboarding section — ~40 files)
│   ├── devices/              (per-device integration guides)
│   ├── features/             (feature guides)
│   ├── Talos/                (Talos-specific content)
│   └── troubleshooting/
├── features/                 (live-view, playback, ptz-control, video-streaming, local-mode)
├── devices/                  (reconeyez, teltonika, uniview, victron — with subdocs)
└── knowledge-base/
    └── glossary.md
```

Also in `classic/src/pages/`:
- `releases/sprint-2025-12-b.tsx` etc. → should become `releaseNote` documents
- `internal-releases/` → internal content (use `targetAudience: internal`)

---

## Migration Approach (Recommended)

### Section-by-section, verify after each

1. **Start small** — migrate `classic/docs/getting-started/*.mdx` (top-level only, ~10 files) first
2. Create each as a `doc` document in Sanity with the correct slug matching the existing URL
3. Test: trigger a build, verify the page loads at the same URL
4. Then migrate `getting-started/devices/` section, etc.
5. Once a file's content is in Sanity and verified, delete the MDX file from `classic/docs/`

### Slug mapping rule

The Sanity `slug.current` must match the URL path **without** the leading `/docs/`. Examples:

| File path | Sanity slug |
|-----------|-------------|
| `classic/docs/getting-started/first-time-login.mdx` | `getting-started/first-time-login` |
| `classic/docs/getting-started/devices/ajax/overview.mdx` | `getting-started/devices/ajax/overview` |
| `classic/docs/knowledge-base/glossary.md` | `knowledge-base/glossary` |

### sidebarPosition

Each `doc` document has a `sidebarPosition` field. Copy the value from the MDX frontmatter `sidebar_position` field. If no `sidebar_position` exists, it will fall to the end alphabetically.

### targetAudience

Most content → `['all']`. Internal pages → `['internal']`. The fetch script routes audience arrays to subdirectories automatically.

---

## How a Build Works

```
npm run build (root)
  └── cd classic && npm ci && npm run build
        └── node scripts/build-with-memory.js
              ├── fetch-sanity-content.js (if SANITY_PROJECT_ID + SANITY_API_TOKEN set)
              │     └── Fetches all Sanity docs → writes .sanity-cache/**/*.mdx
              └── npx docusaurus build
                    └── Reads classic/docs/ + classic/.sanity-cache/ → builds static site
```

Cloudflare Pages runs this automatically on every push to `main`.

### To trigger a manual rebuild without a code change

POST to the deploy hook (ask project owner for the URL, it's saved in `.planning/phases/03-integration-pipeline/03-03-SUMMARY.md`).

---

## Phase 4 Success Criteria

From the roadmap:

1. Every product documentation page previously at `/docs/...` still resolves correctly — **zero new 404s**
2. All release notes are in Sanity under the `releaseNote` type
3. All articles are in Sanity under the `article` type with `publishedAt` dates
4. All reference pages (glossary, specs) are in Sanity under `referencePage`
5. A full URL sweep of the live site finds zero new 404s introduced by migration

---

## Known Issues / Watch Out For

1. **Broken links** — `onBrokenLinks` is currently set to `'warn'` (not `'throw'`). This was done intentionally because many MDX files link to pages that don't exist yet (placeholder links from previous work). Don't change this to `'throw'` until all links are resolved.

2. **Case-sensitive paths** — Some device folders use `PascalCase` (e.g., `devices/Ajax/`, `devices/HikVision/`). The live URLs are case-sensitive on CF Pages. Keep slug casing consistent with existing URL patterns.

3. **The `gcxone.mdx` file** — `classic/docs/getting-started/gcxone.mdx` references lucide-react icons directly in JSX. When migrating this to Sanity, you'll lose the JSX — migrate it as pure Portable Text (no JSX components). The icons can be dropped or replaced with callouts.

4. **Images** — MDX files reference images in `classic/docs/getting-started/images/`. For Sanity migration, upload images to Sanity's media library and use Sanity image references in Portable Text. The fetch script already handles `image` blocks via `@sanity/image-url`.

5. **Frontmatter stripping** — When you create a Sanity document from an MDX file, copy the content of the file but **exclude** the YAML frontmatter block (`---` delimiters and everything between them). The fetch script generates its own frontmatter from Sanity fields.

6. **`.sanity-cache/` is gitignored** — Never commit files from `.sanity-cache/`. It's populated at build time. This is correct behavior.

---

## How to Run Locally

```bash
# From repo root:
cd classic
npm ci

# Set env vars (PowerShell):
$env:SANITY_PROJECT_ID = "fjjuacab"
$env:SANITY_DATASET = "production"
$env:SANITY_API_TOKEN = "your-token-here"

# Fetch Sanity content and build:
npm run build

# Or just fetch content without full build:
node scripts/fetch-sanity-content.js

# Dev server (uses existing .sanity-cache if present):
npm start
```

---

## Repo Structure Summary

```
nxgen-docs/
├── classic/                        ← Docusaurus site
│   ├── docs/                       ← Static MDX (to be migrated out)
│   ├── .sanity-cache/              ← Build-time generated (gitignored)
│   ├── plugins/
│   │   └── docusaurus-plugin-sanity-content/
│   │       └── index.js            ← Plugin that creates cache dirs
│   ├── scripts/
│   │   ├── fetch-sanity-content.js ← Pre-build Sanity fetcher
│   │   └── build-with-memory.js    ← Build entry point
│   ├── src/
│   │   ├── components/             ← React components (used in MDX via imports)
│   │   └── pages/                  ← Custom pages (landing, releases, etc.)
│   ├── docusaurus.config.ts        ← Main config
│   └── package.json
├── studio/                         ← Sanity Studio
├── .planning/                      ← GSD planning files
│   ├── ROADMAP.md
│   ├── PROJECT.md
│   └── phases/
│       ├── 01-cleanup/
│       ├── 02-cms-setup/
│       └── 03-integration-pipeline/
├── wrangler.toml                   ← CF Pages config
└── PHASE4_HANDOVER.md             ← This file
```

---

## Credentials and Access

The project owner has:
- GitLab access to push to `main`
- Cloudflare Pages dashboard for `gcxone` project
- Sanity project `fjjuacab` admin access
- `SANITY_API_TOKEN` (ask them — do not commit it)

---

## First Steps for the Incoming Agent

1. Clone the repo: `git clone https://gitlab.com/albabdel/NXG-Docs.git`
2. Read `.planning/ROADMAP.md` for full context
3. Run `/gsd:plan-phase 4` if GSD is available, otherwise:
   - Read all files in `classic/docs/getting-started/` to understand content structure
   - Plan which section to migrate first (recommend: top-level getting-started files)
   - Create Sanity documents for each, verify URL integrity, delete the MDX files
4. After each section: push to GitLab, wait for CF Pages build, do URL spot-check

---

*Generated 2026-03-07 — Phase 3 complete, build passing at commit `2feaa66`*
