# Phase 2: CMS Setup - Research

**Researched:** 2026-03-07
**Domain:** Sanity CMS v3 — MCP server, Studio project creation, schema authoring, hosted deployment
**Confidence:** HIGH (core stack); MEDIUM (Portable Text custom blocks); HIGH (MCP remote server)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Role-based content field**
- Include a `targetAudience` string-array field on the `doc` schema (values: `all`, `admin`, `manager`, `operator`, `operator-minimal`, `internal`)
- Default value: `["all"]`
- Phase 3 decides how this field maps to the six `plugin-content-docs` route instances — the schema just captures the data
- `releaseNote`, `article`, and `reference` types do not need a `targetAudience` field

**Portable Text richness**
- Standard inline marks: bold, italic, underline, code, link
- Block types: paragraph, h2, h3, h4, blockquote, code block (with language selector)
- Custom blocks: admonition/callout (type: note | tip | warning | danger), image (with alt text and caption), table (markdown-style via plugin)
- Deferred: `<Tabs>`, `<Steps>`, `<CardGrid>` — Phase 3 only

**Slug convention**
- All four types have a `slug` field (Sanity built-in slug type, generated from `title`)
- Path prefixes enforced by Phase 3 plugin, not by schema
- Slug field is editable so editors can match existing URL paths during migration

**Dataset strategy**
- Single `production` dataset only
- Env vars: `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `SANITY_API_TOKEN`
- `staging` dataset is a v2 concern

**Schema field set per content type**
- `doc`: `title`, `slug`, `targetAudience` (array), `category` (string), `sidebarPosition` (number), `body` (Portable Text), `lastUpdated` (date)
- `releaseNote`: `title`, `slug`, `sprintId` (string, e.g. "2026-01-a"), `publishedAt` (date), `body` (Portable Text)
- `article`: `title`, `slug`, `tags` (array of strings), `publishedAt` (date), `body` (Portable Text)
- `reference`: `title`, `slug`, `body` (Portable Text)

**MCP server approach**
- Use the official Sanity remote MCP server (`mcp.sanity.io`) configured in Claude's MCP settings
- Claude creates and updates schemas programmatically via MCP — no manual Sanity dashboard schema editing
- Studio schema files (`schemaTypes/`) are committed to the repo alongside the Docusaurus code (monorepo approach)

### Claude's Discretion
- Exact Studio project name and dataset naming convention
- Whether schemas live in a `/studio` subdirectory or at repo root
- Sanity API version pin
- Which Sanity plan tier to use (free tier is sufficient for Phase 2)

### Deferred Ideas (OUT OF SCOPE)
- `<Tabs>`, `<Steps>`, `<CardGrid>` as Portable Text custom block types — Phase 3
- `staging` dataset — v2
- `targetAudience` field on `releaseNote`/`article`/`reference` types — v2
- `difficulty` and `platform` metadata fields on `doc` — v2
- Cloudinary asset source plugin in Sanity Studio — v2 (CMS-V2-01)
- Live preview in Studio — v2 (CMS-V2-02)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CMS-01 | Sanity MCP server configured and operational so Claude can create/update schemas, query content, and manage the Sanity project without manual dashboard interaction | Remote MCP server at mcp.sanity.io; configured via `claude mcp add Sanity -t http https://mcp.sanity.io --scope user`; schema deployed with `sanity schema deploy` for context-aware operations |
| CMS-02 | Sanity project created with cloud-hosted Studio accessible at a public URL | `sanity init` with `--create-project` and `--output-path ./studio`; `sanity deploy` uploads to `<studioHost>.sanity.studio`; `studioHost` set in `sanity.cli.ts` |
| CMS-03 | Content schemas defined for all 4 content types with slug fields matching existing URL patterns | `defineType`/`defineField` for `doc`, `releaseNote`, `article`, `reference`; slug type with `source: 'title'`; Portable Text body field with custom blocks via `@sanity/code-input` and `@sanity/table` plugins |
</phase_requirements>

---

## Summary

Phase 2 establishes Sanity as the content backend: a new project is created via the Sanity CLI, the Studio is deployed to a public `*.sanity.studio` URL, four content-type schemas are committed to the repo and deployed, and the Sanity remote MCP server is wired into Claude Code so future schema work requires no manual dashboard interaction.

The Sanity ecosystem has had two significant changes relevant to this phase. First, the local `@sanity/mcp-server` npm package is **deprecated** — the replacement is the hosted remote MCP server at `mcp.sanity.io`, which uses OAuth and requires no API token management. Second, schema deployment (`sanity schema deploy`) is now a prerequisite for the MCP server to have full schema context; this command must be re-run after each schema change.

The Portable Text body field requires two first-party plugins: `@sanity/code-input` (code blocks with language selector) and `@sanity/table` (table type). The admonition/callout block is defined as an inline custom block type using the standard `defineArrayMember` pattern — no additional plugin needed. The table plugin's limitation (cells are plain strings, not Portable Text) is acceptable for Phase 2 since editors will primarily write reference-style tables.

**Primary recommendation:** Create the studio in a `studio/` subdirectory of the repo root, not inside `classic/`. This keeps Docusaurus and Sanity concerns separated while keeping everything in one git repository.

---

## Standard Stack

### Core

| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| `sanity` | `^3.x` (latest) | Studio runtime + schema SDK + CLI | Official Sanity v3 package; ships Studio, CLI, and all schema helpers |
| `@sanity/vision` | bundled with `sanity` | GROQ query explorer in Studio | First-party dev tool for testing GROQ |
| Remote MCP server | `mcp.sanity.io` | Claude Code integration | Official hosted server; OAuth-based; 40+ tools; replaces deprecated local package |

### Supporting Plugins (installed in `studio/`)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@sanity/code-input` | latest | Code block schema type with language selector | Required for the code block custom block in Portable Text body |
| `@sanity/table` | latest | Table schema type | Required for the table block in Portable Text body (cells are plain strings) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@sanity/table` (official) | `davydog187/sanity-portable-table` | Community plugin supports Portable Text in cells, but less maintained; official plugin is sufficient for Phase 2 reference tables |
| Remote MCP (`mcp.sanity.io`) | Local `@sanity/mcp-server` npm | Local is deprecated and archived; remote is the supported path |
| `/studio` subdirectory | Schema files at repo root | Root-level studio mixes Docusaurus and Sanity concerns; subdirectory is cleaner |

**Installation (run from repo root, not `classic/`):**
```bash
# Create the Sanity project and studio in /studio subdirectory
npx sanity@latest init \
  --create-project "NXGEN Docs" \
  --dataset production \
  --output-path ./studio \
  --template clean \
  -y

# Install Portable Text plugins from inside studio/
cd studio
npm install @sanity/code-input @sanity/table

# Add MCP to Claude Code (user scope — available across all projects)
claude mcp add Sanity -t http https://mcp.sanity.io --scope user
```

---

## Architecture Patterns

### Recommended Project Structure

```
nxgen-docs/                    # repo root
├── classic/                   # Docusaurus site (existing)
│   └── docusaurus.config.ts
├── studio/                    # Sanity Studio (new this phase)
│   ├── sanity.cli.ts          # CLI config: projectId, dataset, studioHost
│   ├── sanity.config.ts       # Studio config: plugins, schema registration
│   ├── package.json           # Studio-only dependencies
│   ├── tsconfig.json
│   └── schemaTypes/           # One file per document type
│       ├── index.ts           # Barrel: exports all types
│       ├── doc.ts             # doc document type
│       ├── releaseNote.ts     # releaseNote document type
│       ├── article.ts         # article document type
│       ├── reference.ts       # reference document type
│       └── portableText.ts    # Shared Portable Text block definition
└── .planning/
```

### Pattern 1: sanity.cli.ts (CLI + Deploy Config)

**What:** Configures the CLI's project context and the public Studio hostname.
**When to use:** Required — without `studioHost`, `sanity deploy` prompts interactively.

```typescript
// studio/sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
  studioHost: 'nxgen-docs',  // becomes nxgen-docs.sanity.studio
})
```

### Pattern 2: sanity.config.ts (Studio Runtime Config)

**What:** Wires together plugins and schema types for Studio rendering.
**When to use:** Required — every Studio must have this file.

```typescript
// studio/sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'nxgen-docs',
  title: 'NXGEN Docs',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool(),
    visionTool(),
    codeInput(),
    table(),
  ],
  schema: {
    types: schemaTypes,
  },
})
```

### Pattern 3: Shared Portable Text Block Definition

**What:** A reusable `body` array type imported by all four document schemas.
**When to use:** Use once, import in all four schema files to avoid drift.

```typescript
// studio/schemaTypes/portableText.ts
import {defineArrayMember, defineField} from 'sanity'

export const bodyField = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    // Standard paragraph/heading block
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Code', value: 'code'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {name: 'href', type: 'url', title: 'URL'},
              {name: 'blank', type: 'boolean', title: 'Open in new tab'},
            ],
          },
        ],
      },
    }),
    // Code block with language selector (via @sanity/code-input)
    defineArrayMember({
      type: 'code',
      options: {
        language: 'javascript',
        languageAlternatives: [
          {title: 'JavaScript', value: 'javascript'},
          {title: 'TypeScript', value: 'typescript'},
          {title: 'Bash', value: 'bash'},
          {title: 'JSON', value: 'json'},
          {title: 'YAML', value: 'yaml'},
          {title: 'Python', value: 'python'},
          {title: 'SQL', value: 'sql'},
          {title: 'HTML', value: 'html'},
          {title: 'CSS', value: 'css'},
          {title: 'Plaintext', value: 'text'},
        ],
      },
    }),
    // Admonition/Callout custom block
    defineArrayMember({
      type: 'object',
      name: 'callout',
      title: 'Callout',
      fields: [
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              {title: 'Note', value: 'note'},
              {title: 'Tip', value: 'tip'},
              {title: 'Warning', value: 'warning'},
              {title: 'Danger', value: 'danger'},
            ],
          },
          initialValue: 'note',
          validation: (rule) => rule.required(),
        },
        {
          name: 'body',
          type: 'text',
          title: 'Content',
          validation: (rule) => rule.required(),
        },
      ],
      preview: {
        select: {type: 'type', body: 'body'},
        prepare({type, body}) {
          return {title: `[${type?.toUpperCase()}] ${body?.slice(0, 60) ?? ''}`}
        },
      },
    }),
    // Image with alt text and caption
    defineArrayMember({
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (rule) => rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    }),
    // Table (via @sanity/table — cells are plain strings)
    defineArrayMember({type: 'table'}),
  ],
})
```

### Pattern 4: Document Schema Example (doc type)

```typescript
// studio/schemaTypes/doc.ts
import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const docType = defineType({
  name: 'doc',
  title: 'Documentation Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 200),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'All', value: 'all'},
          {title: 'Admin', value: 'admin'},
          {title: 'Manager', value: 'manager'},
          {title: 'Operator', value: 'operator'},
          {title: 'Operator (Minimal)', value: 'operator-minimal'},
          {title: 'Internal', value: 'internal'},
        ],
      },
      initialValue: ['all'],
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),
    defineField({
      name: 'sidebarPosition',
      title: 'Sidebar Position',
      type: 'number',
    }),
    bodyField,
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'date',
    }),
  ],
})
```

### Pattern 5: Schema Index Barrel

```typescript
// studio/schemaTypes/index.ts
import {docType} from './doc'
import {releaseNoteType} from './releaseNote'
import {articleType} from './article'
import {referenceType} from './reference'

export const schemaTypes = [docType, releaseNoteType, articleType, referenceType]
```

### Pattern 6: MCP Setup for Claude Code

**What:** Registers the remote Sanity MCP server with Claude Code at user scope.
**When to use:** Once per machine. OAuth prompt appears on first Claude Code launch after registration.

```bash
# Register MCP server (user scope — available in all projects on this machine)
claude mcp add Sanity -t http https://mcp.sanity.io --scope user

# OR: Use Sanity CLI auto-configure (detects Claude Code automatically)
cd studio && npx sanity@latest mcp configure

# After schemas are written, deploy schema manifest for MCP context
cd studio && npx sanity schema deploy
```

### Pattern 7: Studio Deployment

```bash
# Deploy Studio to *.sanity.studio
cd studio && npx sanity deploy
# Result: https://nxgen-docs.sanity.studio
```

### Anti-Patterns to Avoid

- **Using `@sanity/mcp-server` npm package:** Deprecated and archived. Use `mcp.sanity.io` remote server instead.
- **Not running `sanity schema deploy` after schema changes:** MCP context will be stale; Claude will query against old schema structure.
- **Hardcoding `projectId` as a string literal in `sanity.config.ts`:** Use `process.env.SANITY_STUDIO_PROJECT_ID` to keep the project ID out of source for cleaner env management across team members.
- **Putting the `studio/` directory inside `classic/`:** Mixes Docusaurus build tooling with Sanity; Docusaurus's `build-with-memory.js` script could inadvertently pick up Studio files.
- **Using `SANITY_PROJECT_ID` as the Studio env var name:** The Studio's bundler only exposes variables prefixed with `SANITY_STUDIO_` to browser code. Use `SANITY_STUDIO_PROJECT_ID` for Studio; the un-prefixed `SANITY_PROJECT_ID` is for the Docusaurus build-time plugin (Phase 3).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Code blocks in body | Custom `code` object type | `@sanity/code-input` | Handles language detection, syntax highlighting theme, line highlighting, and filename — 10+ edge cases |
| Table in body | Custom row/cell object array | `@sanity/table` | Maintained by Sanity; v3-compatible; handles row/column operations in Studio UI |
| Slug generation | Custom string field + manual slugify | Built-in `slug` type | Auto-generates from source field; uniqueness checking; `Generate` button in Studio UI |
| Studio hosting | Self-hosted SPA on Cloudflare Pages | `sanity deploy` to `*.sanity.studio` | Sanity-hosted Studio has auth, auto-updates, and CDN; self-hosting adds operational overhead |
| Schema management dashboard | Manual Sanity web UI edits | MCP server + committed schema files | MCP + git history is reproducible; dashboard edits are not version-controlled |

**Key insight:** Sanity's plugin ecosystem covers the "hard" editor UI problems (code input, tables, slug generation). Phase 2 should wire plugins together, not implement custom editor widgets.

---

## Common Pitfalls

### Pitfall 1: Free Plan Dataset Privacy

**What goes wrong:** Free plan datasets are **public by default** — any unauthenticated request can read all content.
**Why it happens:** Sanity's free tier does not support private datasets (private requires Growth plan or higher).
**How to avoid:** This is acceptable for Phase 2 documentation content (docs are public anyway). Do NOT store any secrets, API keys, or private user data in Sanity content fields. The `SANITY_API_TOKEN` grants write access and must never be committed.
**Warning signs:** Accidentally storing anything sensitive (email addresses, internal URLs, credentials) in document fields.

### Pitfall 2: Stale MCP Schema Context

**What goes wrong:** Claude makes schema-aware operations but references fields that don't exist or have wrong types, causing GROQ query failures or content creation errors.
**Why it happens:** The remote MCP server reads a deployed schema manifest, not the live `studio/schemaTypes/` files. If schemas change without re-deploying the manifest, the MCP's understanding is out of date.
**How to avoid:** Run `npx sanity schema deploy` from `studio/` after every schema change committed in this phase. Include this step in every schema-modifying plan.
**Warning signs:** MCP tool calls referencing field names that don't match the current `schemaTypes/` files.

### Pitfall 3: Wrong Environment Variable Names

**What goes wrong:** Studio fails to connect to the project after deployment; `projectId` is undefined.
**Why it happens:** Sanity Studio's bundler only exposes `SANITY_STUDIO_*` prefixed variables to browser-side code. Un-prefixed `SANITY_PROJECT_ID` works in Node.js (e.g., Phase 3 plugin) but not in the Studio bundle.
**How to avoid:** Use `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET` in `sanity.config.ts`/`sanity.cli.ts`. The Cloudflare Pages env vars required at Phase 2 completion are `SANITY_PROJECT_ID` (for the future Phase 3 plugin), `SANITY_DATASET`, and `SANITY_API_TOKEN` — these are **separate** from the Studio's own env vars.
**Warning signs:** Studio renders but shows "missing projectId" error in browser console after deployment.

### Pitfall 4: `studioHost` Not Set Before First Deploy

**What goes wrong:** `sanity deploy` prompts interactively for the hostname, blocking unattended CI or plan execution.
**Why it happens:** The CLI falls back to a terminal prompt if `studioHost` is not set in `sanity.cli.ts`.
**How to avoid:** Set `studioHost: 'nxgen-docs'` in `sanity.cli.ts` before running `sanity deploy` for the first time. The hostname must start with alpha characters (no numbers, no symbols).
**Warning signs:** `sanity deploy` hangs waiting for input.

### Pitfall 5: Portable Text Callout Body as `text` vs Nested Portable Text

**What goes wrong:** Editors want formatted text (bold, links) inside callout blocks, but the schema uses `type: 'text'` (plain string). Attempts to nest a full Portable Text array inside a Portable Text block cause recursion issues in Studio.
**Why it happens:** Nested Portable Text in block types is an advanced pattern with known Studio rendering caveats.
**How to avoid:** Keep callout `body` as `type: 'text'` (plain string) for Phase 2. Editors who need rich callouts can use a workaround (separate paragraph block before/after). Upgrading to nested Portable Text is a Phase 3+ concern when the rendering layer is in place.
**Warning signs:** Studio shows infinite re-render or unusual nesting warnings for callout blocks.

### Pitfall 6: OAuth Session Expiry on MCP

**What goes wrong:** MCP tools stop working after ~7 days because the OAuth session expires.
**Why it happens:** `mcp.sanity.io` OAuth sessions have a ~7-day lifetime.
**How to avoid:** When MCP tools fail with auth errors, re-authenticate: close and reopen Claude Code (it prompts for re-auth on next tool use) or run `claude mcp remove Sanity && claude mcp add Sanity -t http https://mcp.sanity.io --scope user` to reset.
**Warning signs:** MCP tool calls return 401/403 errors or "not authenticated" messages.

---

## Code Examples

Verified patterns from official sources and verified search results:

### Complete doc Schema

```typescript
// studio/schemaTypes/doc.ts
import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const docType = defineType({
  name: 'doc',
  title: 'Documentation Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: r => r.required()}),
    defineField({
      name: 'slug', type: 'slug', title: 'Slug',
      options: {source: 'title', slugify: i => i.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 200)},
      validation: r => r.required(),
    }),
    defineField({
      name: 'targetAudience', type: 'array', title: 'Target Audience',
      of: [{type: 'string'}],
      options: {list: ['all','admin','manager','operator','operator-minimal','internal'].map(v => ({title: v, value: v}))},
      initialValue: ['all'],
    }),
    defineField({name: 'category', type: 'string', title: 'Category'}),
    defineField({name: 'sidebarPosition', type: 'number', title: 'Sidebar Position'}),
    bodyField,
    defineField({name: 'lastUpdated', type: 'date', title: 'Last Updated'}),
  ],
})
```

### Complete releaseNote Schema

```typescript
// studio/schemaTypes/releaseNote.ts
import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const releaseNoteType = defineType({
  name: 'releaseNote',
  title: 'Release Note',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: r => r.required()}),
    defineField({
      name: 'slug', type: 'slug', title: 'Slug',
      options: {source: 'title'},
      validation: r => r.required(),
    }),
    defineField({name: 'sprintId', type: 'string', title: 'Sprint ID', description: 'e.g. 2026-01-a'}),
    defineField({name: 'publishedAt', type: 'date', title: 'Published At'}),
    bodyField,
  ],
})
```

### Complete article Schema

```typescript
// studio/schemaTypes/article.ts
import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: r => r.required()}),
    defineField({
      name: 'slug', type: 'slug', title: 'Slug',
      options: {source: 'title'},
      validation: r => r.required(),
    }),
    defineField({name: 'tags', type: 'array', title: 'Tags', of: [{type: 'string'}]}),
    defineField({name: 'publishedAt', type: 'date', title: 'Published At'}),
    bodyField,
  ],
})
```

### Complete reference Schema

```typescript
// studio/schemaTypes/reference.ts
import {defineType, defineField} from 'sanity'
import {bodyField} from './portableText'

export const referenceType = defineType({
  name: 'reference',
  title: 'Reference Page',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: r => r.required()}),
    defineField({
      name: 'slug', type: 'slug', title: 'Slug',
      options: {source: 'title'},
      validation: r => r.required(),
    }),
    bodyField,
  ],
})
```

### Cloudflare Pages Env Vars (to set in CF dashboard)

Three variables must be set under Settings > Environment Variables in the Cloudflare Pages project:

```
SANITY_PROJECT_ID=<project-id-from-sanity-dashboard>
SANITY_DATASET=production
SANITY_API_TOKEN=<editor-or-read-token>
```

Note: These are the **Phase 3 consumer** variables (used by the Docusaurus plugin). The Studio itself uses `SANITY_STUDIO_*` prefixed vars during `sanity deploy`, but those are not set in Cloudflare Pages — they are only needed locally or in a separate Studio CI.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@sanity/mcp-server` (npm, local) | Remote `mcp.sanity.io` server | Late 2025 | No API token needed; OAuth; 40+ tools; no local install |
| `sanity-codegen` for TypeScript types | `sanity typegen generate` (built-in CLI) | Sanity v3 (2022+) | Type generation is now a first-party CLI command |
| Manual schema edits in Sanity dashboard | Schema files in git + `sanity schema deploy` | v3 + MCP (2025) | Version-controlled schemas; MCP context from deployed manifest |
| `sanity init` creates files at current directory | `--output-path` flag places studio in subdirectory | CLI update (2025) | Enables clean monorepo setup without manual file moving |

**Deprecated/outdated:**
- `@sanity/mcp-server` npm package: archived, no longer maintained — replaced by `mcp.sanity.io`
- `sanity-codegen`: deprecated for Sanity v3 — use `npx sanity typegen generate` instead
- `SANITY_STUDIO_API_PROJECT_ID` (old v2 convention): current v3 convention uses `SANITY_STUDIO_PROJECT_ID`

---

## Open Questions

1. **studioHost name availability**
   - What we know: Studio hosts must start with alpha; the name `nxgen-docs` is the proposed hostname
   - What's unclear: Whether `nxgen-docs.sanity.studio` is already taken by a previous attempt
   - Recommendation: Verify during plan execution; if taken, use `nxgendocs` or `nxgen-gcxone`

2. **Sanity project ID already exists?**
   - What we know: Git history shows previous Storyblok/Hygraph/Strapi attempts but no Sanity references
   - What's unclear: Whether someone created a Sanity project previously under the same account
   - Recommendation: Run `sanity projects list` in plan execution to check before `--create-project`

3. **Callout body richness**
   - What we know: `type: 'text'` (plain string) is the Phase 2 decision for callout body
   - What's unclear: Editors may find plain-string callouts limiting during content migration (Phase 4)
   - Recommendation: Accept the constraint for Phase 2; revisit in Phase 3 when Portable Text rendering is wired

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright (already installed in `classic/`) for smoke tests; manual Studio verification |
| Config file | `classic/playwright.config.ts` (existing) |
| Quick run command | `cd classic && npx playwright test --grep "@cms"` |
| Full suite command | `cd classic && npx playwright test` |

> Note: Phase 2 success criteria are primarily manual/interactive: an editor must be able to log into Studio, create a document, fill all fields, and publish. Automated Playwright tests can smoke-test the Studio URL accessibility and Cloudflare Pages env var presence, but field validation is a manual verification step.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CMS-01 | MCP server responds to `get_initial_context` tool call | manual | (Claude invokes MCP tool in conversation) | N/A |
| CMS-01 | `sanity schema deploy` succeeds without errors | smoke | `cd studio && npx sanity schema deploy --dry-run` | Wave 0 gap |
| CMS-02 | `https://nxgen-docs.sanity.studio` returns HTTP 200 | smoke | `cd classic && npx playwright test --grep "@studio-url"` | Wave 0 gap |
| CMS-02 | All four document types visible in Studio sidebar | manual | (human logs in and verifies) | N/A |
| CMS-03 | Test doc document creates, saves draft, and publishes | manual | (human creates test content in Studio) | N/A |
| CMS-03 | Slug auto-generates from title with correct format | manual | (human verifies slug field in Studio) | N/A |
| CMS-03 | CF Pages env vars present: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN | smoke | (manual: check CF dashboard after phase) | N/A |

### Sampling Rate

- **Per task commit:** No automated tests (no code to test yet — schemas are Studio config, not app code)
- **Per wave merge:** Manual Studio smoke test: create one document of each type, verify all fields, publish
- **Phase gate:** All four success criteria verified manually before marking Phase 2 complete

### Wave 0 Gaps

- [ ] `studio/` directory — does not exist yet; created by `sanity init` in Wave 0
- [ ] `studio/schemaTypes/` — all schema files are Wave 0 deliverables
- [ ] Studio URL smoke test script — optional, low priority given manual nature of verification

*(If no automated test gaps surface, "None — Phase 2 is primarily infrastructure setup verified manually through Studio UI")*

---

## Sources

### Primary (HIGH confidence)

- [Sanity MCP server docs (sanity.io/docs/ai/mcp-server)](https://www.sanity.io/docs/ai/mcp-server) — MCP setup steps, `claude mcp add` command, OAuth authentication, 40+ tools list
- [Sanity MCP GA blog post](https://www.sanity.io/blog/sanity-remote-mcp-server-is-generally-available) — remote server announcement, `npx sanity@latest mcp configure`, OAuth vs token auth
- [Sanity Studio Configuration docs](https://www.sanity.io/docs/studio/configuration) — `defineConfig`, required fields (`projectId`, `dataset`), `structureTool()`, `visionTool()`
- [Sanity Studio Deployment docs](https://www.sanity.io/docs/studio/deployment) — `sanity deploy`, `studioHost` in `sanity.cli.ts`, `*.sanity.studio` URL
- [Sanity Schema Deployment docs](https://www.sanity.io/docs/apis-and-sdks/schema-deployment) — `sanity schema deploy`, MCP context requirement
- [Sanity `sanity init` CLI reference](https://www.sanity.io/docs/cli-reference/init) — `--output-path`, `--create-project`, `--dataset`, `--template`, `-y` flags (updated 2026-03-02)
- [Sanity slug type docs](https://www.sanity.io/docs/studio/slug-type) — `source`, `maxLength`, `slugify`, `isUnique` options
- [@sanity/code-input plugin page](https://www.sanity.io/plugins/code-input) — install, `languageAlternatives`, data structure
- [@sanity/table GitHub](https://github.com/sanity-io/table) — install, v3 compatibility, `type: 'table'` in schema, row/cell limitations

### Secondary (MEDIUM confidence)

- [Sanity Portable Text customizing block content](https://www.sanity.io/docs/studio/customizing-block-content) — decorator pattern (`value`, `component`, `icon`), styles pattern — verified against official docs URL
- [Sanity free plan limits (webstacks.com verified against sanity.io/pricing)](https://www.sanity.io/pricing) — 1 dataset, 10,000 documents, 200,000 API requests/month, public datasets only
- Community verified: `SANITY_STUDIO_` prefix required for browser-accessible env vars in Studio bundle

### Tertiary (LOW confidence)

- OAuth session expiry of ~7 days — mentioned in one community source; not confirmed in official docs
- `nxgen-docs` as studioHost availability — assumed; must be verified during plan execution

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all core libraries verified via official Sanity docs and npm pages
- MCP setup: HIGH — official docs page confirmed `claude mcp add Sanity -t http https://mcp.sanity.io --scope user` command
- Architecture (studio/ subdirectory): HIGH — `--output-path` flag confirmed in CLI reference (updated 2026-03-02)
- Schema patterns: HIGH — `defineType`/`defineField`/`defineArrayMember` confirmed from official schema and slug docs
- Portable Text custom blocks: MEDIUM — callout pattern derived from documented decorator/style pattern; no official callout example exists
- Pitfalls: MEDIUM/HIGH — free plan dataset privacy confirmed; env var prefix confirmed; OAuth expiry LOW (single source)

**Research date:** 2026-03-07
**Valid until:** 2026-04-07 (Sanity's MCP and CLI are actively developed; re-verify MCP tools list if > 30 days old)
