# Phase 3: Integration Pipeline - Context

**Gathered:** 2026-03-07
**Status:** Ready for planning
**Note:** User-delegated — defaults applied based on codebase analysis, requirements, and prior phase decisions.

<domain>
## Phase Boundary

Wire Sanity to the live Docusaurus site. Two deliverables: (1) a custom Docusaurus plugin that fetches content from Sanity at build time via GROQ and generates pages in `.sanity-cache/`, and (2) a Cloudflare Pages deploy hook that triggers a rebuild when an editor publishes in Sanity Studio. INTG-03 (feedback widget via ZeptoMail HTTP API) is already complete in `classic/functions/page-feedback.ts` — Phase 3 verifies it is correctly deployed.

Content migration (moving existing MDX into Sanity) is Phase 4, not Phase 3.

</domain>

<decisions>
## Implementation Decisions

### targetAudience → route mapping
- `targetAudience: ["all"]` → content goes to main `docs/` directory only (rendered at `/docs/...`)
- `targetAudience: ["admin"]` → content goes to `docs-admin/` only (rendered at `/role-admin/...`)
- `targetAudience: ["manager"]` → `docs-manager/` only (rendered at `/manager/...`)
- `targetAudience: ["operator"]` → `docs-operator/` only (rendered at `/operator/...`)
- `targetAudience: ["operator-minimal"]` → `docs-operator-minimal/` only (rendered at `/operator-minimal/...`)
- `targetAudience: ["internal"]` → `docs-internal/` only (rendered at `/internal/...`)
- Multi-value arrays (e.g., `["admin", "manager"]`) → content written to each applicable directory
- No duplication of content across the main `/docs/` route and role-specific routes — content lives in exactly the audience-appropriate location(s)

### MDX component scope (Phase 3 plugin)
- Phase 3 handles **standard Portable Text blocks only**: paragraphs, headings (h2–h4), lists, blockquote, code blocks (with language), inline marks (bold, italic, underline, code, link), images, tables, and callout/admonition blocks
- `<Tabs>`, `<Steps>`, `<CardGrid>` custom block rendering is **deferred to Phase 4**
- Phase 3 plugin does not need a Portable Text → JSX serializer for these components; they will be added during migration
- Callout/admonition blocks from Portable Text should map to Docusaurus `:::note`, `:::tip`, `:::warning`, `:::danger` syntax in the generated MDX

### Plugin output strategy
- Plugin writes generated MDX files to `.sanity-cache/` at build time — Docusaurus `plugin-content-docs` instances then read from those directories
- Cache directory is git-ignored (build artifact, not source)
- Generated files must preserve the `slug` field from Sanity as the file path to maintain URL continuity
- The plugin is a custom Docusaurus plugin (in `classic/plugins/`) following the existing `docusaurus-plugin-last-update` pattern

### Build resilience
- Hard-fail: if Sanity API is unreachable at build time, the build fails and Cloudflare Pages does not deploy
- Rationale: a partial deploy with missing pages is worse than no deploy; Sanity is cloud-hosted and outages are rare
- The plugin should log a clear error message identifying which GROQ query failed

### Deploy hook (INTG-02)
- Set up Cloudflare Pages deploy hook URL and register it as a Sanity webhook (via Sanity MCP or dashboard)
- Webhook triggers on document publish events for all four content types (doc, releaseNote, article, referencePage)
- No custom webhook server needed — Cloudflare Pages has native deploy hook URLs

### Feedback widget verification (INTG-03)
- `classic/functions/page-feedback.ts` is complete — no new code required
- Phase 3 task: confirm `ZEPTO_API_KEY` is set in Cloudflare Pages environment variables (production)
- Smoke-test the deployed function endpoint to verify it returns 200 and sends email
- Verify no legacy function files remain (Vercel `api/` or Netlify `netlify/functions/` formats) — STATE.md confirms these were deleted in Phase 1

### GROQ field contract
- All Phase 3 queries must use `_type == 'referencePage'` (not `reference`) — Sanity built-in type collision; confirmed in Phase 2
- Env vars available in Cloudflare Pages build: `SANITY_PROJECT_ID`, `SANITY_DATASET` (= `production`), `SANITY_API_TOKEN`

### Claude's Discretion
- Exact Sanity JS client version and import style (`@sanity/client` vs `next-sanity`)
- Whether the plugin uses a single GROQ query per content type or a combined query
- Exact `.sanity-cache/` subdirectory structure (e.g., `sanity-cache/docs/`, `sanity-cache/docs-admin/`)
- Error boundary: whether to catch per-document errors or fail the entire query on first error

</decisions>

<specifics>
## Specific Ideas

- Success criteria from roadmap: "Running `npm run build` locally fetches content from Sanity via GROQ and generates pages in `.sanity-cache/` — Sanity-sourced pages appear in the Docusaurus output alongside existing MDX pages"
- Success criteria: "Publishing a document in Sanity Studio triggers a Cloudflare Pages rebuild and the change appears on docs.nxgen.cloud within 5 minutes"
- The feedback widget success criterion says "no Vercel or Netlify function formats remain in the repo" — verified in STATE.md Phase 1 cleanup

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `classic/plugins/docusaurus-plugin-last-update/index.js`: Pattern for a custom Docusaurus plugin — Phase 3 plugin follows the same `module.exports = function(context, options) { return { name: '...', ... } }` structure
- `classic/functions/page-feedback.ts`: Complete Cloudflare Pages Function using fetch() to ZeptoMail — INTG-03 done
- `studio/schemaTypes/`: 4 content types defined — `doc`, `releaseNote`, `article`, `referencePage` (note: not `reference`)

### Established Patterns
- Docusaurus build script: `classic/scripts/build-with-memory.js` runs `docusaurus build` — plugin hooks run inside this
- 6 `plugin-content-docs` instances in `classic/docusaurus.config.ts` each read from separate directories (`docs/`, `docs-internal/`, `docs-admin/`, `docs-manager/`, `docs-operator/`, `docs-operator-minimal/`)
- Env vars: Cloudflare Pages exposes `SANITY_*` vars (unprefixed) at build time — confirmed in Phase 2 STATE.md note

### Integration Points
- New plugin registers in `classic/docusaurus.config.ts` plugins array
- Plugin generates files into `.sanity-cache/` subdirectories; `plugin-content-docs` `path` config points to those subdirectories
- Sanity webhook URL comes from Cloudflare Pages dashboard → Deploy hooks → copy URL → paste into Sanity webhook config

</code_context>

<deferred>
## Deferred Ideas

- `<Tabs>`, `<Steps>`, `<CardGrid>` Portable Text → MDX rendering — Phase 4 (migration phase needs these for rich content)
- Incremental builds (only re-fetch changed documents) — v2
- Sanity webhook HMAC signature verification — v2 (nice-to-have security, not needed for v1)

</deferred>

---

*Phase: 03-integration-pipeline*
*Context gathered: 2026-03-07 — defaults applied (user-delegated)*
