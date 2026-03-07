# Phase 2: CMS Setup - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning
**Note:** User-delegated — all decisions made by Claude based on codebase analysis and requirements.

<domain>
## Phase Boundary

Stand up Sanity so it is ready for content entry. Deliverables: MCP server operational (Claude can manage schemas without manual dashboard work), Studio accessible at a public `*.sanity.studio` URL, and all four content-type schemas defined and validated. No content is migrated in this phase — that is Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Role-based content field
- Include a `targetAudience` string-array field on the `doc` schema (values: `all`, `admin`, `manager`, `operator`, `operator-minimal`, `internal`)
- Default value: `["all"]`
- Phase 3 (integration) decides how this field maps to the six `plugin-content-docs` route instances — the schema just captures the data
- `releaseNote`, `article`, and `reference` types do not need a `targetAudience` field (they are audience-agnostic)

### Portable Text richness
- **Standard inline marks:** bold, italic, underline, code, link
- **Block types:** paragraph, h2, h3, h4, blockquote, code block (with language selector)
- **Custom blocks:** admonition/callout (type: note | tip | warning | danger), image (with alt text and caption), table (markdown-style via plugin)
- **Deferred:** `<Tabs>`, `<Steps>`, `<CardGrid>` — these require MDX rendering infrastructure built in Phase 3; schemas will not include them in Phase 2

### Slug convention
- All four types have a `slug` field (Sanity built-in slug type, generated from `title`)
- Expected path prefixes (enforced by Phase 3 plugin, not by schema):
  - `doc` → `/docs/[category]/[slug]`
  - `releaseNote` → `/docs/release-notes/[slug]`
  - `article` → `/docs/articles/[slug]`
  - `reference` → `/docs/reference/[slug]`
- Slug field is editable (not locked) so editors can match existing URL paths during migration

### Dataset strategy
- Single `production` dataset only for Phase 2
- Keeps env var count minimal (`SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `SANITY_API_TOKEN`)
- A `staging` dataset is a v2 concern; not worth the complexity for an initial rollout

### Schema field set per content type
- **`doc`**: `title`, `slug`, `targetAudience` (array), `category` (string), `sidebarPosition` (number), `body` (Portable Text), `lastUpdated` (date)
- **`releaseNote`**: `title`, `slug`, `sprintId` (string, e.g. "2026-01-a"), `publishedAt` (date), `body` (Portable Text)
- **`article`**: `title`, `slug`, `tags` (array of strings), `publishedAt` (date), `body` (Portable Text)
- **`reference`**: `title`, `slug`, `body` (Portable Text)

### MCP server approach
- Use the official Sanity MCP server (`@sanity/mcp-server`) configured in Claude's MCP settings
- Claude creates and updates schemas programmatically via MCP — no manual Sanity dashboard schema editing
- Studio schema files (`schemaTypes/`) are committed to the repo alongside the Docusaurus code (monorepo approach)

### Claude's Discretion
- Exact Studio project name and dataset naming convention
- Whether schemas live in a `/studio` subdirectory or at repo root
- Sanity API version pin
- Which Sanity plan tier to use (free tier is sufficient for Phase 2)

</decisions>

<specifics>
## Specific Ideas

- STATE.md research flag: "Phase 2 requires experimentation on how Docusaurus `<Tabs>` and `<Steps>` map to Sanity Portable Text custom block types" — resolved by deferring Tabs/Steps to Phase 3; Phase 2 schemas only cover components with direct Portable Text equivalents
- STATE.md blocker: "Decision required before Phase 2 schema work — whether to keep, consolidate, or remove the six role-based plugin-content-docs instances" — resolved by adding `targetAudience` field to `doc` schema; routing decision deferred to Phase 3
- Existing frontmatter tags (`role:`, `category:`, `difficulty:`, `platform:`) map partially: `category` → `category` field; `role:` → `targetAudience`; `difficulty:` and `platform:` are not modelled in Phase 2 (add in v2 if editors need them)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing Sanity code — starting from zero
- `classic/docusaurus.config.ts`: 6 `@docusaurus/plugin-content-docs` instances define the role-based routing structure that `targetAudience` field mirrors

### Established Patterns
- MDX frontmatter pattern: `title`, `description`, `tags[]`, `sidebar_position`, `last_updated` — schema field names align with these where possible
- URL structure: main docs under `/docs/`, role-specific at `/internal`, `/role-admin`, `/manager`, `/operator`, `/operator-minimal` — slug prefix convention derived from this

### Integration Points
- Phase 3 (Content Integration) consumes schemas: GROQ queries will reference field names defined here — field names are a contract
- Cloudflare Pages env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` must be added as part of this phase

</code_context>

<deferred>
## Deferred Ideas

- `<Tabs>`, `<Steps>`, `<CardGrid>` as Portable Text custom block types — Phase 3 (needs MDX rendering layer first)
- `staging` dataset for pre-production content testing — v2
- `targetAudience` field on `releaseNote`/`article`/`reference` types — v2 if editors need it
- `difficulty` and `platform` metadata fields on `doc` — v2
- Cloudinary asset source plugin in Sanity Studio — explicitly listed as v2 in REQUIREMENTS.md (CMS-V2-01)
- Live preview in Studio — v2 (CMS-V2-02)

</deferred>

---

*Phase: 02-cms-setup*
*Context gathered: 2026-03-07 — user-delegated*
