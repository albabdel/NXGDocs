# Feature Landscape

**Domain:** Documentation platform with headless CMS (Docusaurus + Sanity)
**Researched:** 2026-03-06
**Confidence:** HIGH (based on direct inspection of the codebase, project context, and domain knowledge of Sanity Studio and Docusaurus capabilities as of August 2025)

---

## Context

This is a brownfield project. The reader-facing Docusaurus site already exists at docs.nxgen.cloud. The gap being closed is the **editor workflow**: content today is edited as MDX files in VS Code and committed to git — too technical for the intended editors. Sanity CMS is being added as the content backend so non-technical editors can write and publish through a web UI.

**Content types in scope:**
- Product documentation (how-to guides, feature explanations)
- Release notes / sprint updates
- Long-form articles
- Reference pages (specs, tables, device integration guides)

**What already works (do not break):**
- Algolia DocSearch — full-text search across all docs
- Cloudinary — image hosting
- Role-based doc instances (admin, manager, operator views)
- Collapsible sidebar, breadcrumbs, dark mode, Mermaid diagrams

---

## Table Stakes — Content Editor

Features that, if missing, make the editor workflow painful enough that editors fall back to bothering a developer.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Rich text editor (WYSIWYG or structured) | Non-technical editors cannot write Markdown or MDX | Low | Sanity Portable Text editor is built-in — no extra setup |
| Image upload from editor UI | Editors need to insert screenshots, diagrams without leaving Studio | Low | Sanity handles uploads natively; images route to Cloudinary via asset source plugin |
| Document save drafts | Editors must be able to save work in progress without publishing | Low | Sanity drafts are first-class — every document has a published/draft state |
| One-click publish | "Write, click publish" is the stated core value of this project | Low | Sanity publish button is built-in; triggers webhook to Cloudflare Pages |
| Unpublish / revert to draft | Editors need to pull content offline (incorrect release notes, outdated guides) | Low | Sanity supports unpublish natively |
| Content organized by type | Editors must find "Release Notes" vs "How-To Articles" vs "Device Guides" without guessing | Low | Controlled by Sanity schema structure and Studio desk configuration |
| Required field validation | Prevent publishing docs without a title, slug, or category | Low | Sanity schema validation rules; inline error display |
| Slug auto-generation from title | Editors should not type URL slugs manually | Low | Sanity has a `SlugInput` with auto-generate from title |
| Preview before publish | Editors must see how content looks on the live site before publishing | Medium | Requires a Docusaurus preview route + Sanity preview secret; non-trivial but well-documented pattern |
| Clear content type distinction | "Device Guide" vs "Feature Article" vs "Release Note" must be obviously different to select | Low | Solved by Sanity Studio desk panel layout — configure document type labels clearly |
| Last-published timestamp visible | Editors need to know when content was last touched | Low | Sanity document metadata includes `_updatedAt`; surface in Studio list view |

---

## Table Stakes — Content Reader

Features that, if missing, readers leave or file support tickets instead of self-serving.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Full-text search | Readers come with a keyword, not a URL | Already done | Algolia DocSearch is configured and working — must survive migration |
| Stable URLs | Linked docs break the trust of users who bookmark or share | Low | Slugs must map 1:1 with existing `/docs/...` URL structure — critical during migration |
| Clear section navigation (sidebar) | 100+ articles across 15+ sections require scannable hierarchy | Already done | Docusaurus sidebar is working; Sanity must feed correct category/position data |
| Breadcrumbs | Reader must know where they are in the hierarchy | Already done | Enabled in docusaurus.config.ts |
| Dark/light mode | Readers in operations centers use dark mode; others prefer light | Already done | Configured — do not break |
| Mobile-readable layout | Many readers access docs from phones or tablets in the field | Already done | Docusaurus responsive by default |
| Code block syntax highlighting | Device integration guides include config snippets | Already done | Prism configured with bash, JSON, TypeScript |
| Working images | Screenshots and diagrams are load-bearing in how-to content | Medium | Must establish convention: images stored in Cloudinary, URLs embedded in Portable Text |
| Page last updated timestamp | Readers need to know if they are reading current information | Low | Was disabled in Docusaurus config; should be re-enabled, driven from Sanity `_updatedAt` |
| Next / Previous doc navigation | Linear reading through a guide section is common for setup tasks | Already done | Docusaurus default |

---

## Table Stakes — Publish Workflow

Features in the pipeline between Sanity and Cloudflare Pages. If these break, publish = silent failure.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Webhook from Sanity to Cloudflare Pages on publish | The core automation: publish in Studio → site rebuilds | Medium | Sanity supports GROQ-powered webhooks; Cloudflare Pages has a deploy hook URL; wire these together |
| Build fetches content from Sanity API | Docusaurus must read from Sanity at build time, not from MDX files | Medium | Requires a `docusaurus.config.ts` plugin or script that calls `@sanity/client` before build |
| Sanity API token stored as Cloudflare env var | Credentials must not be in the repo | Low | Standard secret management; document clearly |
| Build failure does not take site offline | If Sanity fetch fails, the previous build should serve | Low | Cloudflare Pages atomic deploys handle this by default |
| Content visible within ~5 minutes of publish | Acceptable lag for a docs site | Medium | Cloudflare Pages build times are typically 2-4 minutes; acceptable without extra optimization |

---

## Differentiators

Features that give NXGEN docs a competitive advantage compared to a basic docs site. Not expected, but valuable for the audience (security platform operators, installers, admins).

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Role-based content views | Admins see admin docs, operators see operator docs — no irrelevant noise | Medium | Site already has role-based instances (admin, manager, operator, operator-minimal routes); Sanity schema should include a `targetAudience` field to drive this |
| Content freshness date on every article | Security platform docs go stale fast; showing "Updated Jan 2026" builds trust | Low | Pull `_updatedAt` from Sanity; render in doc footer |
| Mermaid diagram support | Architecture and workflow diagrams explain complex concepts better than text | Already done | `@docusaurus/theme-mermaid` is installed; Sanity Portable Text can store diagram code in a code block type |
| Structured release notes with version tags | Sprint-based release notes are a key content type; versioned navigation makes them scannable | Medium | Sanity schema: `releaseNote` type with `version`, `sprintId`, `releaseDate` fields; Docusaurus sidebar auto-groups by sprint |
| Device integration guide template | 30+ device guides follow the same pattern (overview, config, troubleshooting); a consistent schema enforces quality | Low | Implement as a dedicated `deviceGuide` Sanity schema with required sections |
| Feedback widget on docs pages | "Was this page helpful?" captures signal without email | Medium | Currently referenced in FEEDBACK_WIDGET_PRD.md; connects to Netlify/Cloudflare function already present |
| Inline callout/warning blocks | Docs for security platforms need visible warnings (e.g., "Do not enable before whitelisting ports") | Low | Sanity Portable Text annotation for `callout` block type (info, warning, danger); rendered as Docusaurus admonitions |
| Linked cross-references between docs | Device guide links to relevant troubleshooting; release note links to the feature doc | Medium | Sanity reference fields; rendered as links at build time; prevents link rot |

---

## Anti-Features

Things to deliberately NOT build for this project. These would consume time, add complexity, and distract from the core value.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| In-browser Markdown/MDX editor | Non-technical editors cannot use it — defeats the entire purpose of adding a CMS | Use Sanity Portable Text (structured rich text) exclusively |
| Real-time collaborative editing | Explicitly out of scope per PROJECT.md; small team, solo editing pattern | Single-editor-at-a-time; Sanity shows "someone else is editing" warnings natively |
| Custom Sanity Studio UI plugins | Building custom React plugins for Studio is high complexity with low payoff for this team size | Use Sanity's built-in Studio components; only configure, never build custom inputs |
| Version control / content history UI for editors | Git history serves this need for developers; Sanity has revision history built-in | Rely on Sanity's native revision history — do not build a custom UI |
| Multi-language / i18n content editing | Explicitly out of scope per PROJECT.md | English-only; `i18n` disabled in Docusaurus config |
| Content scheduling (publish at a specific time) | Adds workflow complexity without clear value for this team | Publish immediately or save draft; scheduled publishing is out of scope |
| Reader accounts / gated content | No authentication requirement mentioned; docs are public | Keep docs fully public |
| Full CMS platform (user management, editorial workflow, approval chains) | This is a one-person or small team operation | Simple: write draft → publish → rebuild. No review chains |
| Inline editing on the live site | TinaCMS was already tried and removed; adds complexity, creates security surface | Edit in Sanity Studio only |
| Search within Sanity Studio | Algolia already handles reader search; Studio has built-in document search | Do not duplicate search infrastructure |
| PDF export of docs | High complexity, low value; readers can print from browser | Out of scope |

---

## Feature Dependencies

```
Sanity API credentials (env vars)
  → Build-time content fetch
    → All content types visible in Docusaurus
      → Algolia re-index (triggered after each build)
        → Reader search works

Sanity webhook configured
  → Cloudflare Pages deploy hook
    → Automatic rebuild on publish
      → 5-minute publish-to-live pipeline

Sanity slug field (auto-generated)
  → Must match existing URL structure (/docs/getting-started/..., /docs/devices/...)
    → Stable reader URLs
      → No broken links / 404s

Sanity `targetAudience` field
  → Docusaurus role-based doc instance routing
    → Role-specific sidebar content

Portable Text `callout` block type
  → Docusaurus admonition rendering
    → Inline warning/info blocks for readers

Sanity `releaseNote` schema (version + sprintId + releaseDate)
  → Docusaurus sidebar grouping by sprint
    → Structured release notes section for readers
```

---

## MVP Recommendation

The minimum feature set that delivers on the stated core value ("non-technical editor opens Studio, writes, clicks publish, site rebuilds"):

**Prioritize (MVP):**
1. Sanity schemas for all four content types (product doc, release note, long-form article, reference page)
2. Sanity publish webhook wired to Cloudflare Pages deploy hook
3. Build-time content fetch replacing MDX-from-git for CMS-managed content
4. Slug validation matching existing URL structure (zero 404s)
5. Required field validation in Studio (title, slug, content, category)
6. Image upload in Studio routing to Cloudinary

**Defer (post-MVP):**
- Live preview before publish (useful but not blocking for launch)
- Role-based `targetAudience` field on documents (existing role routing continues to work from file-based content during transition)
- Feedback widget (already partially implemented; wire up separately)
- Structured release note schema with version tagging (can start as a generic document type)
- Content freshness date rendering (data is available from Sanity `_updatedAt`; rendering is a single component change)

---

## Sources

- Direct inspection: `.planning/PROJECT.md` — project requirements and constraints
- Direct inspection: `classic/docusaurus.config.ts` — existing site configuration (Algolia, role instances, Mermaid, sidebar behavior)
- Direct inspection: `classic/package.json` — installed dependencies (confirmed: Docusaurus 3.9.2, Algolia, Cloudinary, Framer Motion, MUI, dead CMS packages)
- Direct inspection: `classic/docs/` directory structure — 100+ articles across 15+ sections
- Direct inspection: `all-articles/` — content type patterns (device guides, feature docs, troubleshooting)
- Domain knowledge: Sanity Studio capabilities (Portable Text, webhook system, draft/publish flow, slug input, asset sources) — HIGH confidence based on Sanity documentation as of August 2025
- Domain knowledge: Docusaurus 3.x features (preset-classic, sidebar config, breadcrumbs, Mermaid, Algolia integration) — HIGH confidence, version confirmed in package.json
- Domain knowledge: Cloudflare Pages deploy hooks (webhook URL triggers rebuild) — HIGH confidence, standard platform feature
