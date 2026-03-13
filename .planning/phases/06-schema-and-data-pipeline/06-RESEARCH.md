# Phase 6: Schema & Data Pipeline — Research

**Researched:** 2026-03-13
**Domain:** Sanity Studio schema authoring, GROQ query extension, build-time JSON pipeline
**Confidence:** HIGH (all findings grounded in direct inspection of live production files)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SCHEMA-01 | Editor can create a sprint release in Sanity Studio as one document with an array of items inside it | `release.ts` schema with `items[]` inline array; `defineArrayMember` pattern from `portableText-ultimate.ts` is directly reusable |
| SCHEMA-02 | Each release item has: title, body (rich text), change type tag, affected areas tags, optional screenshots, optional video embed URL, optional link to docs page | Item object type with `string`, `text`/`array`, `image`, `url` fields; `muxInput` already installed in Studio for video; `defineField` with `validation: rule => rule.required()` for required vs optional |
| SCHEMA-03 | Editor can create a roadmap item in Sanity Studio with: title, description, status (Planned / In Progress / Shipped), business value, change type, UI change flag, entities impacted, projected release date | `roadmapItem.ts` schema; status uses `options.list` radio; entities as `array` of `string`; uiChange as `boolean`; projectedRelease as `date` or `string` (decision required — see Open Questions) |
| SCHEMA-04 | A Shipped roadmap item can reference the specific sprint release it landed in | `releaseRef` field as `reference` to `release` type; GROQ `releaseRef->slug.current` projection resolves it to a string for frontend consumption |
| MOCK-01 | 2–3 sample sprint release documents with real-looking content (sprint title, date, 3–4 items each, screenshot placeholder, video embed) | Created manually in Sanity Studio after schemas go live; no code required |
| MOCK-02 | 5–8 sample roadmap items covering all three statuses, all fields populated, at least one Shipped item linked to a mock sprint release | Created manually in Sanity Studio; `releaseRef` on at least one Shipped item links to a MOCK-01 release document |
</phase_requirements>

---

## Summary

Phase 6 is entirely self-contained within `studio/` (schema files) and `classic/scripts/fetch-sanity-content.js` (data pipeline). It produces two new generated JSON files (`sanity-releases.generated.json` and `sanity-roadmap.generated.json`) that all downstream phases (7, 8) depend on. No frontend React pages are touched in this phase.

The highest-risk operation is the atomic schema migration from `releaseNote` to `release`. The current production codebase has `releaseNoteType` registered in **five separate locations**: `schemaTypes/index.ts`, `sanity.config.ts` (initial value templates at line 59, document actions at line 171, dashboard widget at lines 130 and 145), and `src/structure.ts` (sidebar entries at lines 230, 267–276, and the `documentTypeListItems` exclusion filter at line 329). All five must be updated in the same commit pass. The GROQ `releaseNote` query in `fetch-sanity-content.js` must also be removed (line 72). The current `sanity-release-notes.generated.json` is empty (`[]`) — there are no live release documents to migrate, which eliminates document-migration complexity.

The second deliverable is the fetch script extension: two new `fetch*` functions are added to `fetch-sanity-content.js`, writing two new JSON files. The script already has a proven pattern in `fetchLandingPages()` (lines 703–748) that the new functions model directly. The `|| true` flag on line 19 of `build.sh` (`npm run fetch-content || true`) silently swallows fetch failures — a strict-mode verification run (`SANITY_FETCH_STRICT=true`) is required before handing off to Phase 7.

**Primary recommendation:** Execute schema migration as one atomic commit (add new schemas + remove old + update all five registration sites + update fetch script); verify with `node classic/scripts/fetch-sanity-content.js` locally confirming non-zero document counts; then add mock data before marking Phase 6 complete.

---

## Standard Stack

### Core (all already installed — zero new dependencies)

| Library | Version (verified) | Purpose in Phase 6 | Source |
|---------|--------------------|---------------------|--------|
| `sanity` | ^5.13.0 | `defineType`, `defineField`, `defineArrayMember` for schema authoring | `studio/package.json` |
| `@sanity/client` | ^7.16.0 | GROQ fetch in `fetch-sanity-content.js`; `client.fetch()` | `classic/package.json` |
| `@sanity/image-url` | already in script | `createImageUrlBuilder` for resolving `screenshot.asset->url` in GROQ | `fetch-sanity-content.js` line 316 |
| `sanity-plugin-mux-input` | ^2.17.0 | Video embed field in release items; already wired in `sanity.config.ts` line 110 | `studio/package.json` |

### Explicitly Not Needed

- No new npm packages required for Phase 6
- `@portabletext/react` is NOT needed if release item `description` fields use plain text or the existing `serializeBody()` serializer; defer this decision to schema design (see Open Questions)
- `Fuse.js` — not needed; search is Phase 8

---

## Architecture Patterns

### Current State of Files (verified by direct inspection)

| File | Current State | Phase 6 Action |
|------|--------------|----------------|
| `studio/schemaTypes/releaseNote.ts` | EXISTS — `releaseNoteType` with flat `body` Portable Text, no `items[]` array | DELETE entirely |
| `studio/schemaTypes/index.ts` | Imports `releaseNoteType` at line 2; exports it at line 47 | Remove import + export; add `releaseType` + `roadmapItemType` |
| `studio/sanity.config.ts` | References `releaseNote` at lines 59, 130, 145, 171 (4 sites) | Update all 4 to `release`; add `roadmapItem` where appropriate |
| `studio/src/structure.ts` | References `releaseNote` at lines 230, 267–276, 329 (3 sites) | Replace all 3 with `release`; add `roadmapItem` sidebar entry |
| `classic/scripts/fetch-sanity-content.js` | Has `releaseNote` GROQ query at line 72; writes to `sanity-release-notes.generated.json`; `fetchLandingPages()` is the pattern to follow | Remove `releaseNote` query; add `fetchReleases()` + `fetchRoadmapItems()`; write two new JSON files |
| `classic/src/data/sanity-release-notes.generated.json` | EXISTS — currently `[]` (empty array) | Keep for now (do not delete in Phase 6; delete in Phase 9 cleanup) |
| `classic/src/data/sanity-releases.generated.json` | DOES NOT EXIST | Create; write by new `fetchReleases()` function |
| `classic/src/data/sanity-roadmap.generated.json` | DOES NOT EXIST | Create; write by new `fetchRoadmapItems()` function |
| `build.sh` line 19 | `npm run fetch-content || true` | Do NOT change in Phase 6; run with `SANITY_FETCH_STRICT=true` for local verification only |

### Five Registration Sites for `releaseNote` — Complete Inventory

From direct inspection:

**1. `studio/schemaTypes/index.ts`**
- Line 2: `import {releaseNoteType} from './releaseNote'`
- Line 47: `releaseNoteType,` in `schemaTypes` array

**2. `studio/sanity.config.ts`**
- Line 59: `initialValueTemplates` — `schemaType: 'releaseNote'`
- Line 130: `documentListWidget` `types` array — `'releaseNote'`
- Line 145: `documentListWidget` (Recently Published) `types` array — `'releaseNote'`
- Line 171: `document.actions` `typesWithCustomActions` array — `'releaseNote'`

**3. `studio/src/structure.ts`**
- Line 230: "Published" → "Release Notes" `S.documentList().schemaType('releaseNote').filter('...releaseNote...')`
- Lines 267–276: Standalone "Release Notes" sidebar item with `schemaType('releaseNote')` and filter
- Line 329: `documentTypeListItems()` exclusion filter array `'releaseNote'`

**All seven string references must be updated or removed in the migration commit.**

### Pattern 1: New `release` Schema with `items[]` Inline Array

**What:** One Sanity document per sprint; items are authored inline as a `defineArrayMember` object type. No separate cross-referenced document type.

**Why:** Editorial drag-and-drop reordering is native to Sanity's array UI. All items authored in a single document session. Mirrors how `portableText-ultimate.ts` uses `defineArrayMember` extensively (confirmed at lines 6, 127, 166, 216, 288 etc).

**Template (authoritative pattern from `releaseNote.ts` and `portableText-ultimate.ts`):**

```typescript
// studio/schemaTypes/release.ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const releaseType = defineType({
  name: 'release',
  title: 'Sprint Release',
  type: 'document',
  fields: [
    // Customer-facing display title (e.g. "December 2025 Release")
    defineField({
      name: 'displayTitle',
      title: 'Display Title',
      type: 'string',
      description: 'Customer-facing sprint name. E.g. "December 2025 Release B"',
      validation: (rule) => rule.required(),
    }),
    // Internal sprint ID for engineering reference (e.g. "Sprint 2025.12-B")
    defineField({
      name: 'sprintId',
      title: 'Sprint ID',
      type: 'string',
      description: 'Internal sprint identifier for reference. E.g. "Sprint 2025.12-B"',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'displayTitle'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      description: 'Short summary shown on the releases index card',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Release Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'releaseItem',
          fields: [
            defineField({name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()}),
            defineField({name: 'description', type: 'text', title: 'Description', rows: 4}),
            defineField({
              name: 'changeType',
              title: 'Change Type',
              type: 'string',
              options: {
                list: [
                  {title: 'New Feature', value: 'feature'},
                  {title: 'Bug Fix', value: 'fix'},
                  {title: 'Improvement', value: 'improvement'},
                  {title: 'Breaking Change', value: 'breaking'},
                  {title: 'Security', value: 'security'},
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'affectedAreas',
              title: 'Affected Areas',
              type: 'array',
              of: [{type: 'string'}],
              options: {
                list: [
                  {title: 'Alarm Management', value: 'alarm-management'},
                  {title: 'Devices', value: 'devices'},
                  {title: 'Features', value: 'features'},
                  {title: 'Operator Guide', value: 'operator-guide'},
                  {title: 'Installer Guide', value: 'installer-guide'},
                  {title: 'Platform Fundamentals', value: 'platform-fundamentals'},
                  {title: 'Reporting', value: 'reporting'},
                  {title: 'Knowledge Base', value: 'knowledge-base'},
                  {title: 'API / Integrations', value: 'api'},
                ],
                layout: 'tags',
              },
            }),
            defineField({
              name: 'screenshot',
              title: 'Screenshot',
              type: 'image',
              options: {hotspot: true},
            }),
            defineField({
              name: 'videoUrl',
              title: 'Video Embed URL',
              type: 'url',
              description: 'YouTube or Vimeo embed URL',
            }),
          ],
          preview: {
            select: {title: 'title', changeType: 'changeType'},
            prepare({title, changeType}) {
              return {title: title ?? 'Untitled item', subtitle: changeType ?? ''}
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'displayTitle', publishedAt: 'publishedAt'},
    prepare({title, publishedAt}) {
      return {title: title ?? 'Untitled', subtitle: publishedAt ?? ''}
    },
  },
})
```

### Pattern 2: `roadmapItem` Schema

```typescript
// studio/schemaTypes/roadmapItem.ts
import {defineType, defineField, defineArrayMember} from 'sanity'

export const roadmapItemType = defineType({
  name: 'roadmapItem',
  title: 'Roadmap Item',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: (r) => r.required()}),
    defineField({name: 'description', type: 'text', title: 'Description', rows: 3}),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Planned', value: 'Planned'},
          {title: 'In Progress', value: 'In Progress'},
          {title: 'Shipped', value: 'Shipped'},
        ],
        layout: 'radio',
      },
      initialValue: 'Planned',
      validation: (r) => r.required(),
    }),
    defineField({name: 'businessValue', type: 'text', title: 'Business Value', rows: 3}),
    defineField({
      name: 'changeType',
      title: 'Change Type',
      type: 'string',
      options: {
        list: [
          {title: 'New Feature', value: 'feature'},
          {title: 'Improvement', value: 'improvement'},
          {title: 'Bug Fix', value: 'fix'},
          {title: 'Breaking Change', value: 'breaking'},
        ],
        layout: 'radio',
      },
    }),
    defineField({name: 'uiChange', type: 'boolean', title: 'UI Change?', initialValue: false}),
    defineField({
      name: 'entitiesImpacted',
      title: 'Entities Impacted',
      type: 'array',
      of: [{type: 'string'}],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'projectedRelease',
      title: 'Projected Release',
      type: 'string',
      description: 'Human-readable e.g. "Q2 2026" or "Sprint 2026-06"',
    }),
    // Only populate when status == 'Shipped'
    defineField({
      name: 'releaseRef',
      title: 'Sprint Release',
      type: 'reference',
      to: [{type: 'release'}],
      description: 'Link to the sprint release this shipped in (Shipped items only)',
    }),
  ],
  preview: {
    select: {title: 'title', status: 'status'},
    prepare({title, status}) {
      const badge = status === 'Shipped' ? '✅' : status === 'In Progress' ? '🔄' : '📋'
      return {title: `${badge} ${title ?? 'Untitled'}`, subtitle: status ?? ''}
    },
  },
})
```

### Pattern 3: Fetch Script Extension

**What:** Two new functions added to `fetch-sanity-content.js`, modeled directly on `fetchLandingPages()` (lines 703–748).

**Key details verified from live script:**
- `writeTrackedFile()` (line 204) handles directory creation and integrity tracking — use it for new JSON files
- `statusFilterClause(includeDrafts)` (line 46) provides the correct published-only filter — reuse it
- `createBackupSnapshot()` (line 151) should include the new JSON files — update the `sources` array at line 153
- Stats object at line 261 needs new keys for `release` and `roadmapItem` document counts
- The `run()` function calls `fetchLandingPages()` at line 866 — add `fetchReleases()` and `fetchRoadmapItems()` calls immediately after

```javascript
// Addition to fetch-sanity-content.js

const RELEASES_GENERATED_FILE = path.join(
  SITE_DIR, 'src', 'data', 'sanity-releases.generated.json'
);
const ROADMAP_GENERATED_FILE = path.join(
  SITE_DIR, 'src', 'data', 'sanity-roadmap.generated.json'
);

function getReleasesQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return `*[_type == "release" && ${filter}] | order(publishedAt desc) {
    _id,
    displayTitle,
    sprintId,
    slug,
    publishedAt,
    summary,
    items[] {
      _key,
      title,
      description,
      changeType,
      affectedAreas,
      "screenshotUrl": screenshot.asset->url,
      videoUrl
    }
  }`;
}

function getRoadmapQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return `*[_type == "roadmapItem" && ${filter}] | order(_createdAt desc) {
    _id,
    title,
    description,
    status,
    businessValue,
    changeType,
    uiChange,
    entitiesImpacted,
    projectedRelease,
    "releaseSlug": releaseRef->slug.current
  }`;
}

async function fetchReleases() {
  console.log('[sanity-content] Fetching releases...');
  let releases;
  try {
    releases = await client.fetch(getReleasesQuery(includeDrafts));
  } catch (err) {
    stats.warnings += 1;
    console.warn(`[sanity-content] Warning: Failed to fetch releases: ${err.message}`);
    releases = [];
  }
  stats.fetched.release = releases.length;
  console.log(`[sanity-content] -> ${releases.length} release(s)`);

  writeTrackedFile(
    RELEASES_GENERATED_FILE,
    JSON.stringify(releases, null, 2),
    writtenFiles
  );
  stats.written.releaseJson = (stats.written.releaseJson || 0) + 1;
  console.log('[sanity-content] Wrote releases -> src/data/sanity-releases.generated.json');
}

async function fetchRoadmapItems() {
  console.log('[sanity-content] Fetching roadmap items...');
  let items;
  try {
    items = await client.fetch(getRoadmapQuery(includeDrafts));
  } catch (err) {
    stats.warnings += 1;
    console.warn(`[sanity-content] Warning: Failed to fetch roadmap items: ${err.message}`);
    items = [];
  }
  stats.fetched.roadmapItem = items.length;
  console.log(`[sanity-content] -> ${items.length} roadmap item(s)`);

  writeTrackedFile(
    ROADMAP_GENERATED_FILE,
    JSON.stringify(items, null, 2),
    writtenFiles
  );
  stats.written.roadmapJson = (stats.written.roadmapJson || 0) + 1;
  console.log('[sanity-content] Wrote roadmap items -> src/data/sanity-roadmap.generated.json');
}

// At end of run(), after fetchLandingPages():
await fetchReleases();
await fetchRoadmapItems();
```

### Pattern 4: Backup System Update

The `createBackupSnapshot()` `sources` array (line 152–157) must include the two new generated files. Without this, a failed migration could not be rolled back via the existing backup mechanism:

```javascript
// Update sources array in createBackupSnapshot():
{ source: RELEASES_GENERATED_FILE, name: 'sanity-releases.generated.json', kind: 'file' },
{ source: ROADMAP_GENERATED_FILE, name: 'sanity-roadmap.generated.json', kind: 'file' },
```

### Pattern 5: Fallback Empty JSON Files in Git

The `sanity-releases.generated.json` and `sanity-roadmap.generated.json` files must exist in the git repository as empty arrays (`[]`) before any CI build runs. Without them, the TypeScript compiler fails on the `import` statements in Phase 7/8 pages. The existing `sanity-release-notes.generated.json` is committed as `[]` — follow the same pattern.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Asset URL resolution | Custom URL constructor from `_ref` strings | `createImageUrlBuilder` (already in fetch script line 316) + `asset->url` in GROQ projection | Handles CDN edge cases, transformations, format variants |
| Status filtering in GROQ | Custom `status` field check per type | `statusFilterClause(includeDrafts)` (line 46) — already handles draft vs published consistently | Tested; handles the `(!defined(status) \|\| status == "published")` edge case for old docs |
| File writing with integrity | `fs.writeFileSync` directly | `writeTrackedFile()` (line 204) | Creates directories, records to version manifest, computes SHA256 |
| Reference resolution | Passing raw `{_ref: "..."}` objects to frontend | `->` dereference operator in GROQ projection | Sanity GROQ resolves references server-side; no frontend lookup needed |
| Items as separate documents | `releaseItem` document type with cross-references | Inline `defineArrayMember` object in `items[]` on `release` document | Drag-and-drop reordering is native; no multi-document authoring friction |

---

## Common Pitfalls

### Pitfall 1: Partial Schema Migration (Atomic Requirement)

**What goes wrong:** Developer adds `release.ts` schema but leaves `releaseNote.ts` in place and forgets to update one of the five registration sites. Studio throws TypeScript errors; existing `releaseNote` documents remain visible alongside empty `release` list.

**Why it happens:** The five registration sites span three files. It is easy to update `index.ts` and `structure.ts` but miss the three `sanity.config.ts` references (initial value template, two dashboard widget `types` arrays, and the document actions array).

**How to avoid:** Execute migration as a single commit. Use the complete seven-reference inventory above. After committing, open Sanity Studio and confirm: (a) "Release Notes" sidebar entry is gone, (b) "Sprint Releases" sidebar entry appears, (c) "Roadmap Items" sidebar entry appears, (d) old `releaseNote` template is gone from "+ New document" menu.

**Warning signs:** Studio TypeScript errors about unknown schema type `releaseNote`; dashboard widget showing zero documents for a type you know exists; "Release Notes" still appearing in sidebar after deploy.

### Pitfall 2: `build.sh || true` Hides Empty Fetch Results

**What goes wrong:** `npm run fetch-content || true` on line 19 of `build.sh` exits 0 even when the fetch script throws an error (network failure, missing env var, GROQ syntax error). The build continues with empty or missing JSON files. Cloudflare Pages shows a green build. Phase 7 starts with empty data.

**Why it happens:** The `|| true` guard was added to prevent total build failure when Sanity is temporarily unreachable. It is correct for production resilience but wrong during active migration work.

**How to avoid:** During Phase 6 local verification, run the fetch script directly with strict mode:
```bash
SANITY_FETCH_STRICT=true node classic/scripts/fetch-sanity-content.js
```
Strict mode (implemented at line 893 of the script) throws if any warnings were emitted. Confirm log output shows `-> 2 release(s)` (or whatever mock data count) and `-> 7 roadmap item(s)` before calling Phase 6 complete. Do NOT change `build.sh` itself.

**Warning signs:** Generated JSON files exist but contain `[]`; fetch script log shows `-> 0 release(s)` after you created mock data in Studio.

### Pitfall 3: Missing `->` Dereference in GROQ for `releaseRef`

**What goes wrong:** GROQ query returns `"releaseRef": {"_ref": "abc123...", "_type": "reference"}` instead of the slug string. The frontend receives an opaque reference object and cannot construct the deep-link URL.

**Why it happens:** Reference fields in Sanity return the raw reference object by default. The `->` operator triggers a join/dereference server-side.

**How to avoid:** Always use the projection pattern `"releaseSlug": releaseRef->slug.current` in the GROQ query. Guard the null case: if the referenced release is unpublished, GROQ returns `null` for the dereferenced field (not an error). The frontend must handle `null` gracefully.

**Verification:** After running the fetch script, inspect `sanity-roadmap.generated.json`. For a Shipped item with `releaseRef` set, the output must contain `"releaseSlug": "sprint-2025-12-b"` (a string), not a `_ref` object.

### Pitfall 4: `displayTitle` vs `sprintId` Confusion

**What goes wrong:** Editor enters "Sprint 2026.03-A" (internal engineering notation) in `displayTitle` because the field purpose is unclear. The hero banner and releases index show internal sprint IDs to customers who don't understand sprint numbering conventions.

**Why it happens:** The existing `releaseNote.ts` schema has only `title` and `sprintId` — no separate customer-facing field. Editors carry over the habit of using sprint IDs everywhere.

**How to avoid:** Add an explicit `description` to `displayTitle` field: `'Customer-facing sprint name. E.g. "December 2025 Release B" — not an internal sprint ID.'` Add a Studio `description` to `sprintId`: `'Internal sprint identifier for engineering reference only. Not shown to customers.'`

**Decision required (see Open Questions):** Whether `displayTitle` is required with validation or optional with `sprintId` as fallback.

### Pitfall 5: GROQ `screenshot.asset->url` vs `@sanity/image-url` Builder

**What goes wrong:** Developer uses `createImageUrlBuilder` (the `sanityImageUrl()` function in the fetch script) in the GROQ result mapping, expecting it to work on the nested `screenshot` field in `items[]`. But `sanityImageUrl()` only works on image objects returned by the GROQ query — it does not work inside array member projections.

**How to avoid:** Use inline GROQ dereference: `"screenshotUrl": screenshot.asset->url` inside the `items[]` projection. This resolves the CDN URL server-side. The result is a plain string in the JSON — no client-side URL construction needed. This is the same pattern the landing page enricher (`enrichLandingMedia()`) uses for `image` nodes.

### Pitfall 6: New JSON Files Not Committed as Empty Fallbacks

**What goes wrong:** `sanity-releases.generated.json` and `sanity-roadmap.generated.json` are in `.gitignore` or simply not committed. On a fresh Cloudflare Pages build, the fetch script runs and writes them — but if the fetch script fails (wrong env vars, Sanity down), the files don't exist when Docusaurus tries to compile Phase 7/8 pages, causing a TypeScript compilation error.

**How to avoid:** Commit both files as `[]` (empty JSON arrays) to the repository immediately after creating them locally. The existing `sanity-release-notes.generated.json` demonstrates this pattern — it is committed as `[]`.

### Pitfall 7: `releaseNote` References Surviving in `structure.ts` Exclusion Filter

**What goes wrong:** The `documentTypeListItems()` exclusion filter at line 329 of `structure.ts` explicitly excludes `'releaseNote'` to prevent it from appearing in the auto-generated "catch-all" sidebar section. If you rename `releaseNote` to `release` in the registration but forget to update this filter, `release` and `roadmapItem` documents will appear twice in the sidebar — once in their dedicated entries and once in the auto-generated fallback section.

**How to avoid:** Update line 329's exclusion array to replace `'releaseNote'` with `'release'` and add `'roadmapItem'` to the same exclusion list.

---

## Code Examples

### Verified GROQ Projection for Releases (Pattern from live script)

```javascript
// Source: classic/scripts/fetch-sanity-content.js lines 57-89 (existing query pattern)
// New query follows identical structure

function getReleasesQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);  // reuse existing function at line 46
  return `*[_type == "release" && ${filter}] | order(publishedAt desc) {
    _id,
    displayTitle,
    sprintId,
    slug,
    publishedAt,
    summary,
    items[] {
      _key,
      title,
      description,
      changeType,
      affectedAreas,
      "screenshotUrl": screenshot.asset->url,
      videoUrl
    }
  }`;
}
```

### Verified GROQ Projection for Roadmap with Reference Dereference

```javascript
// The -> operator resolves the reference server-side.
// If releaseRef is null (not set), "releaseSlug" is null in the result — handle in frontend.

function getRoadmapQuery(includeDrafts) {
  const filter = statusFilterClause(includeDrafts);
  return `*[_type == "roadmapItem" && ${filter}] | order(_createdAt desc) {
    _id,
    title,
    description,
    status,
    businessValue,
    changeType,
    uiChange,
    entitiesImpacted,
    projectedRelease,
    "releaseSlug": releaseRef->slug.current
  }`;
}
```

### Verification Command After Script Runs

```bash
# Run locally with strict mode to catch any warnings as errors
SANITY_FETCH_STRICT=true node classic/scripts/fetch-sanity-content.js

# After script completes, verify non-empty output:
# Linux/Mac:
node -e "const r=require('./classic/src/data/sanity-releases.generated.json'); console.log('Releases:', r.length)"
node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json'); console.log('Roadmap items:', r.length)"
```

### Expected `sanity-releases.generated.json` Shape

```json
[
  {
    "_id": "abc123",
    "displayTitle": "March 2026 Release A",
    "sprintId": "Sprint 2026.03-A",
    "slug": {"current": "sprint-2026-03-a"},
    "publishedAt": "2026-03-07",
    "summary": "This sprint delivers...",
    "items": [
      {
        "_key": "key1",
        "title": "New alarm grouping view",
        "description": "Operators can now group alarms by zone...",
        "changeType": "feature",
        "affectedAreas": ["alarm-management"],
        "screenshotUrl": "https://cdn.sanity.io/images/.../alarm-grouping.png",
        "videoUrl": null
      }
    ]
  }
]
```

### Expected `sanity-roadmap.generated.json` Shape

```json
[
  {
    "_id": "def456",
    "title": "Bulk device configuration",
    "description": "Allow operators to configure multiple devices simultaneously...",
    "status": "Shipped",
    "businessValue": "Reduces configuration time by 80% for large deployments",
    "changeType": "feature",
    "uiChange": true,
    "entitiesImpacted": ["Devices", "Admin"],
    "projectedRelease": "Q1 2026",
    "releaseSlug": "sprint-2026-03-a"
  },
  {
    "_id": "ghi789",
    "title": "Advanced reporting filters",
    "description": "Date range and custom field filters for reports",
    "status": "Planned",
    "businessValue": "Reduces manual data export by 60%",
    "changeType": "improvement",
    "uiChange": true,
    "entitiesImpacted": ["Reporting"],
    "projectedRelease": "Q2 2026",
    "releaseSlug": null
  }
]
```

---

## State of the Art

| Old Approach | Current Approach | Impact for Phase 6 |
|---|---|---|
| Flat `releaseNote` document (one body field per release) | `release` document with `items[]` inline array | Enables per-item media; simpler editor workflow; native drag-to-reorder |
| MDX files for release notes (via `.sanity-cache/docs/`) | Static JSON import in React page | No fragile Portable Text → MDX serialization for structured arrays |
| Hardcoded `recentReleases` array in `index.tsx` | `releasesData.slice(0, 2)` from generated JSON | Phase 8 concern — Phase 6 must produce the JSON correctly |
| `roadmap.ts` static TypeScript file with Zoho vocabulary | `sanity-roadmap.generated.json` with clean public vocabulary | Old status values (`Planning`, `Launched`, `In Development`) must NOT appear in new schema |

**Deprecated immediately by Phase 6:**
- `releaseNote` schema type: deleted, no documents to migrate (current JSON is `[]`)
- `sanity-release-notes.generated.json`: superseded; keep file in git for now; delete in Phase 9

---

## Open Questions

### 1. `displayTitle` Required or Optional?

**What we know:** The `release` schema needs a customer-facing name distinct from `sprintId`. Research summary and STATE.md both flag this as a decision needed before planning.

**What's unclear:** Should `displayTitle` have `validation: (rule) => rule.required()` or be optional with `sprintId` as the fallback for the hero banner text?

**Recommendation:** Make `displayTitle` required. Editors always know what to name a release. An empty hero banner is a worse failure mode than a Studio publish error. If optional, the hero banner component needs null-handling that will never be tested in practice.

### 2. `projectedRelease` Field Type: ISO Date vs Human String?

**What we know:** ARCHITECTURE.md flags that storing `"Q2 2026"` as a string prevents programmatic sorting and staleness detection. STATE.md lists this as a concern for Phase 6 planning.

**What's unclear:** Is programmatic date sorting a v1.1 requirement? The roadmap is rendered as a flat list filtered by status, not sorted by date.

**Recommendation:** Use `type: 'string'` for v1.1 with `description: 'e.g. "Q2 2026" or "Sprint 2026-06"'`. Sorting by projected date is a v1.2 enhancement (deferrable). A separate `lastReviewedAt` ISO date field would add planning value but is out of scope for Phase 6.

### 3. Release Item `description` Field Type: `text` or Portable Text?

**What we know:** ARCHITECTURE.md and SUMMARY.md both flag that using rich Portable Text blocks for item descriptions requires `@portabletext/react` in `classic/package.json` (not currently installed). Using `type: 'text'` (plain multi-line string) avoids the dependency.

**What's unclear:** Do editors actually need bold/lists/inline code in item descriptions? The mock data requirement (MOCK-01) does not specify rich formatting.

**Recommendation:** Use `type: 'text'` (plain text) for v1.1 items description. This eliminates the `@portabletext/react` dependency question entirely. If editors request rich formatting post-launch, add the dependency in v1.2. The tradeoff is zero editorial friction for a feature the requirements do not mandate.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — this is a content pipeline project; no Jest/Vitest/pytest config found |
| Config file | None |
| Quick run command | `node classic/scripts/fetch-sanity-content.js` (manual verification) |
| Full suite command | `SANITY_FETCH_STRICT=true node classic/scripts/fetch-sanity-content.js` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| SCHEMA-01 | `release` document type appears in Studio with `items[]` array | manual | Open Sanity Studio, click "+ New" | Studio TypeScript compile is the gate |
| SCHEMA-02 | Release item has all required fields including screenshot and video | manual | Create a release item in Studio with all fields | Visual inspection in Studio |
| SCHEMA-03 | `roadmapItem` document type appears with all fields | manual | Open Sanity Studio, create roadmap item | Visual inspection |
| SCHEMA-04 | Shipped roadmap item can reference a release document | manual | Set `releaseRef` in Studio; verify in Vision tab | GROQ Vision query: `*[_type == "roadmapItem" && defined(releaseRef)]{"releaseSlug": releaseRef->slug.current}` |
| SCHEMA-01 + pipeline | `sanity-releases.generated.json` exists and contains non-zero documents | smoke | `node -e "const r=require('./classic/src/data/sanity-releases.generated.json');process.exit(r.length>0?0:1)"` | Run after fetch script |
| SCHEMA-03 + pipeline | `sanity-roadmap.generated.json` exists and contains non-zero documents | smoke | `node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');process.exit(r.length>0?0:1)"` | Run after fetch script |
| SCHEMA-04 + pipeline | At least one roadmap item has a non-null `releaseSlug` | smoke | `node -e "const r=require('./classic/src/data/sanity-roadmap.generated.json');const s=r.find(i=>i.releaseSlug);process.exit(s?0:1)"` | After MOCK-02 data entered |
| MOCK-01 | 2–3 releases visible in Studio and in generated JSON | manual + smoke | Count check above | Content creation; no code |
| MOCK-02 | 5–8 roadmap items visible in Studio and in generated JSON | manual + smoke | Count check above | Content creation; no code |

### Sampling Rate

- **Per task commit:** `node classic/scripts/fetch-sanity-content.js` (verify non-empty output in console)
- **Per wave merge:** `SANITY_FETCH_STRICT=true node classic/scripts/fetch-sanity-content.js` + smoke count checks
- **Phase gate:** Both generated JSON files non-empty AND all five `releaseNote` references removed from Studio config + structure + index

### Wave 0 Gaps

None — there is no automated test framework to install. The test strategy for Phase 6 is manual Studio verification + fetch script smoke checks. The smoke commands above are Node one-liners runnable without any test framework.

---

## Sources

### Primary (HIGH confidence — direct codebase inspection)

- `studio/schemaTypes/releaseNote.ts` — complete field inventory of schema being deleted (verified line-by-line)
- `studio/schemaTypes/index.ts` — confirmed `releaseNoteType` import at line 2, export at line 47; full schema registry
- `studio/schemaTypes/portableText-ultimate.ts` — `defineArrayMember` usage pattern at lines 6, 127, 166, 216, 288+
- `studio/sanity.config.ts` — confirmed 4 `releaseNote` references at lines 59, 130, 145, 171
- `studio/src/structure.ts` — confirmed 3 `releaseNote` references at lines 230, 267–276, 329
- `classic/scripts/fetch-sanity-content.js` — full pipeline; `fetchLandingPages()` pattern at lines 703–748; `statusFilterClause()` at line 46; `writeTrackedFile()` at line 204; `|| true` not in script but confirmed in `build.sh`
- `build.sh` line 19 — `npm run fetch-content || true` confirmed
- `classic/src/data/sanity-release-notes.generated.json` — confirmed `[]` (no live documents to migrate)
- `classic/src/data/roadmap.ts` — confirmed legacy status vocabulary (`Planning`, `Launched`, `In Development`) incompatible with new schema values
- `classic/src/data/` directory listing — confirmed `sanity-releases.generated.json` and `sanity-roadmap.generated.json` do NOT yet exist
- `.planning/config.json` — `workflow.nyquist_validation: true` confirmed

### Secondary (MEDIUM confidence — project research files)

- `.planning/research/SUMMARY.md` — cross-references codebase findings; all claims independently verified above
- `.planning/research/ARCHITECTURE.md` — detailed component map verified against live files; GROQ query patterns confirmed
- `.planning/STATE.md` — decision log; open questions from Phase 6 concerns section confirmed as unresolved

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in `package.json` files; no new dependencies required
- Architecture patterns: HIGH — all patterns derived from live production code; `fetchLandingPages()` is the direct template
- Migration checklist: HIGH — all seven `releaseNote` reference sites inventoried from live files
- Pitfalls: HIGH — every pitfall traceable to a specific file and line number in the live codebase
- Open questions: MEDIUM — recommendations are reasoned but require planner/editor decision before implementation

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable platform; `sanity` major version change or Cloudflare Pages config change would invalidate)
