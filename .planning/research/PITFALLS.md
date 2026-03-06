# Domain Pitfalls

**Domain:** Docusaurus documentation site — brownfield cleanup + Sanity CMS integration on Cloudflare Pages
**Researched:** 2026-03-06
**Confidence:** HIGH (all pitfalls grounded in direct codebase evidence; confirmed against Docusaurus v3, Sanity v3, and Cloudflare Pages documentation)

---

## Critical Pitfalls

Mistakes that cause build failures, broken deployments, or require rewrites.

---

### Pitfall 1: The `prebuild` Hook Still Calls Dead CMS Code

**What goes wrong:** The current `package.json` has `"prebuild": "npm run fetch-content"` which executes `scripts/fetchHygraphContent.js`. On Cloudflare Pages the Hygraph env vars are absent, so the script exits early — but only because it contains a manual guard. Any cleanup that removes the guard (or replaces the script with a Sanity fetch that lacks a similar guard) will cause the build to fail if `SANITY_PROJECT_ID` is also absent from the Cloudflare Pages environment variables at time of first deploy.

**Why it happens:** The prebuild hook is a global side-effect that runs unconditionally before every `npm run build`. It was written for Hygraph, survived every CMS switch because it gracefully no-ops, and will be forgotten when adding the Sanity fetch equivalent.

**Consequences:** Cloudflare Pages build fails on the first push after Sanity integration begins because the old fetch-content script is gone but the new one has no graceful fallback, or the new script throws on missing env vars.

**Evidence in codebase:**
- `classic/package.json` line 22: `"prebuild": "npm run fetch-content"`
- `classic/scripts/fetchHygraphContent.js` lines 9-13: guard that exits 0 when env vars are missing
- `classic/netlify.toml` line 2: `command = "npm run sync:storyblok:safe && npm run build"` — a second stale build command referencing a completely different CMS sync script

**Prevention:**
- During cleanup phase, remove `"prebuild"` from `package.json` entirely until Sanity integration is ready
- The Sanity fetch script must wrap its entire body in a `try/catch` and exit with code 0 (not code 1) when `SANITY_PROJECT_ID` is missing, printing a clear warning
- After Sanity is wired in, change the build command in Cloudflare Pages dashboard to include the Sanity fetch explicitly: `node scripts/fetchSanityContent.js && docusaurus build`

**Detection:** Build fails with exit code 1 during the `npm run fetch-content` step in Cloudflare Pages build logs.

**Phase:** Cleanup phase — remove prebuild hook on day one of cleanup. Re-add only when Sanity script exists and is guarded.

---

### Pitfall 2: Removing a Storyblok Import Silently Breaks `src/lib/storyblok.ts` Consumers

**What goes wrong:** `classic/src/lib/storyblok.ts` is imported by `storyblok-example.tsx` and `storyblok-preview.tsx`. Both are routed pages (`/storyblok-example`, `/storyblok-preview`) that Docusaurus compiles to static HTML at build time. If the pages are deleted but the lib file is left, TypeScript still compiles cleanly — no error. If the lib file is deleted first but the pages remain, the build throws a TypeScript import error that looks like an unrelated module resolution failure.

**Why it happens:** Docusaurus compiles all `.tsx` files under `src/pages/` automatically. There is no opt-out. Partial deletion (lib without consumers, or consumers without lib) always leaves a broken state.

**Consequences:** Build error that is confusing because the error message points to a TypeScript import, not to "you have a Storyblok page that shouldn't exist." The non-technical user sees an intimidating wall of TypeScript errors.

**Evidence in codebase:**
- `classic/src/pages/storyblok-example.tsx` line 3: `import { getStory } from '../lib/storyblok';`
- `classic/src/pages/storyblok-preview.tsx` line 4: `import { useLocation } from '@docusaurus/router';` (uses Storyblok bridge via window.storyblok)
- `classic/src/lib/storyblok.ts` — full file imports `@storyblok/react`, `storyblok-js-client`, and all five component files under `src/components/storyblok/`

**Prevention:** Delete the entire Storyblok surface in one atomic operation, in this order:
1. `src/pages/storyblok-example.tsx`
2. `src/pages/storyblok-preview.tsx`
3. `src/components/storyblok/` (entire directory)
4. `src/lib/storyblok.ts`
5. Then remove `@storyblok/js`, `@storyblok/react`, `storyblok-js-client` from `package.json`

Run `npm run build` locally after each group to verify no compile errors before proceeding.

**Detection:** TypeScript error `Cannot find module '../lib/storyblok'` or `Module '@storyblok/react' not found` during build.

**Phase:** Cleanup phase — one of the first tasks, immediately after audit.

---

### Pitfall 3: Cloudflare Pages Build Timeout from Bloated `node_modules`

**What goes wrong:** Cloudflare Pages has a 20-minute build timeout. The current `package.json` has approximately 65+ production dependencies including heavyweight packages (`@mui/material`, `framer-motion`, `@tiptap/*` x7, `@tsparticles/*` x3, `pdf-parse`, `jspdf`, `html2canvas`, `@dnd-kit/*` x3, `graphql`, `graphql-request`, `express`, `nodemailer`). Many of these are dead weight from past CMS experiments. `npm install` of this dependency set alone can approach 3–5 minutes on a cold Cloudflare build. Combined with a 4GB memory-constrained `docusaurus build`, the entire pipeline frequently approaches or exceeds the limit.

**Why it happens:** Each failed CMS integration added packages but no one cleaned them up. The `build-with-memory.js` script already hard-codes `--max-old-space-size=4096` because the build was already OOM-crashing.

**Consequences:** Build times out. Cloudflare Pages shows a generic "Build failed" with no useful error. The non-technical user cannot diagnose it.

**Evidence in codebase:**
- `classic/package.json`: `@tiptap/react`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-table`, `@tiptap/extension-table-cell`, `@tiptap/extension-table-header`, `@tiptap/extension-table-row`, `@tiptap/starter-kit` — all Tiptap packages, no Tiptap usage found in `src/`
- `classic/package.json`: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` — drag-and-drop library with no current usage visible in active pages
- `classic/package.json`: `@mui/material`, `@emotion/react`, `@emotion/styled` — full MUI stack; single-page use cannot justify the bundle cost
- `classic/package.json`: `@tsparticles/engine`, `@tsparticles/react`, `@tsparticles/slim` — particle animations
- `classic/scripts/build-with-memory.js`: `--max-old-space-size=4096` indicates existing memory pressure

**Prevention:**
- Remove dead CMS packages in cleanup phase before any new packages are added
- After cleanup, benchmark build time locally and on Cloudflare Pages before proceeding to Sanity integration
- When adding Sanity, only add: `@sanity/client` and `next-sanity` (or `groq`) — do not add `sanity` (the Studio package) to this repo; Studio runs separately at `your-project.sanity.studio`
- Use `npm ls --depth=0` after cleanup to verify package count dropped significantly

**Detection:** Cloudflare Pages build log shows timeout after ~20 minutes, or the build log ends abruptly without a `Built in Xms` line from Docusaurus.

**Phase:** Cleanup phase — dependency audit and removal is the highest-ROI single action.

---

### Pitfall 4: `onBrokenLinks: 'ignore'` Hiding Real Breakage That Cleanup Will Expose

**What goes wrong:** The current config has `onBrokenLinks: 'ignore'`, `onBrokenMarkdownLinks: 'ignore'`, and `onBrokenAnchors: 'ignore'`. This was set to allow deployment despite known broken links. When cleanup removes pages (Storyblok pages, dead role docs), some of those removed pages are likely referenced by sidebar entries, MDX cross-links, or navigation items. Removing the dead pages without finding and fixing those references means links that were already broken become newly broken in a different way — and because the setting is `ignore`, the build still succeeds, so no one knows.

**Why it happens:** `ignore` is a one-way ratchet. Once set, nobody is motivated to audit. Each CMS experiment added more internal links that pointed to pages the previous CMS was supposed to serve, and those links were never cleaned up.

**Consequences:** Users click links to `/storyblok-example`, `/storyblok-preview`, or other deleted pages and get a blank 404 page. The Algolia crawler may also index broken anchor fragments, polluting search results.

**Evidence in codebase:**
- `classic/docusaurus.config.ts` lines 65–67: all three broken-link settings set to `'ignore'`
- `classic/src/pages/storyblok-example.tsx` and `storyblok-preview.tsx` are accessible live pages at known URLs — if any nav link points to them, deleting the files silently drops those links

**Prevention:**
- Before deleting any page, run `grep -r "storyblok-example\|storyblok-preview" classic/src classic/docs` to find all references
- After cleanup, temporarily change `onBrokenLinks` to `'warn'` (not `'throw'` yet — too aggressive) and run a local build to surface what's broken
- Fix all warnings before switching to `'throw'` permanently at end of cleanup phase
- Do NOT switch to `'throw'` mid-cleanup — the cleanup will temporarily introduce new broken links and the build needs to keep succeeding

**Detection:** Build log shows `[WARNING] Docs found broken links` or users report 404s after cleanup deploys.

**Phase:** Cleanup phase — audit references before deleting files; switch to `'throw'` at end of cleanup as a quality gate.

---

### Pitfall 5: Sanity Content Fetched at Build Time Has No Fallback When Sanity API is Unreachable

**What goes wrong:** The chosen architecture is "Docusaurus fetches from Sanity at build time, webhook triggers rebuild on publish." If the Sanity API is down, rate-limited, or the project ID is wrong when Cloudflare Pages builds, the fetch script fails and the build fails. This is a single point of failure with no fallback. The site goes undeployable until the API issue is resolved.

**Why it happens:** Build-time data fetching gives you a fast, cacheable static site — but it couples the deploy pipeline to the CMS availability. Every previous CMS integration in this project used the same pattern and fell apart at the data-fetching step.

**Consequences:** A content editor clicks "Publish" in Sanity Studio, Cloudflare Pages triggers a rebuild, the Sanity API returns a 503, the build fails, and the content never goes live. The non-technical user sees a failed build with no obvious cause.

**Prevention:**
- The Sanity fetch script must catch all errors and fall back to existing MDX files: if `SANITY_PROJECT_ID` is missing or the API call fails, log a warning and return empty data (let Docusaurus build from the existing MDX files in the repo)
- Add a `SANITY_FETCH_REQUIRED=false` environment variable — defaults to `false` so build succeeds without Sanity; set to `true` only once Sanity is fully confirmed working
- Use Sanity's CDN endpoint (`cdn.sanity.io`) rather than the primary API for reads; it has much higher availability
- In Sanity fetch script, set a timeout of 10 seconds per request to prevent the script from hanging indefinitely

**Detection:** Build log shows `fetch failed` or a timeout error in the Sanity fetch script output.

**Phase:** Sanity integration phase — write the fetch script with graceful degradation from day one.

---

### Pitfall 6: MDX-to-Sanity Migration Destroying Formatting That Doesn't Round-Trip

**What goes wrong:** The current content is MDX with custom Docusaurus components (`<Tabs>`, `<TabItem>`, `<Callout>`, `<Steps>`, `<CodeBlock>`, `<Admonition>`) embedded inline. Sanity's Portable Text format cannot natively represent these components. A naive migration that imports the MDX content into Sanity as a rich text body will silently drop all JSX component usages, leaving pages stripped of their tabs, callouts, and step-by-step formatting.

**Why it happens:** Portable Text is a JSON-based structured content format — it has nodes for paragraphs, headings, lists, links, and images, but not for arbitrary JSX. Custom components must be represented as custom Portable Text annotations or block types, which requires schema design upfront.

**Consequences:** After migration, a "Firewall Configuration" page that had a multi-tab interface with per-device instructions shows up as plain paragraphs with the tab labels missing. The content appears but is structurally wrong.

**Evidence in codebase:**
- `classic/docs/getting-started/` contains `.mdx` files (not `.md`) confirming JSX component usage
- `classic/src/components/` directory contains `Tabs/`, `Callout/`, `Steps/`, `CodeBlock/` components that MDX pages import
- The Hygraph migration script (`classic/scripts/fetchHygraphContent.js`) attempted a `richTextToMarkdown()` function — evidence that this round-trip problem was already encountered once before with Hygraph's rich text format

**Prevention:**
- Before migration, audit every MDX file for custom component usage: `grep -r "import\|<Tabs\|<Steps\|<Callout\|<Admonition" classic/docs/` to count occurrences
- Design Sanity schemas with explicit custom block types for each component type used in docs before migrating any content
- Consider a hybrid approach: keep MDX files for complex pages that use many custom components; use Sanity only for content-heavy pages (articles, release notes, device guides) that are mostly prose
- Never run bulk migration until the Sanity schema has been validated with 2–3 representative documents

**Detection:** After migration, render a migrated page and compare it to the original MDX page side-by-side. Missing tabs, steps, or callouts are immediately visible.

**Phase:** Sanity integration phase — schema design must precede any content migration.

---

### Pitfall 7: The Feedback Widget API Will Break When Moving from Netlify Functions to Cloudflare Pages

**What goes wrong:** The page feedback system has two separate implementations that are already platform-split: `classic/api/page-feedback.ts` (Vercel-style handler using `@vercel/node` types) and `netlify/functions/page-feedback.mjs` (Netlify Functions-style handler). The project is deploying to Cloudflare Pages, which uses Cloudflare Functions (Workers-based) with a completely different runtime API — no `VercelRequest`/`VercelResponse`, no Netlify `event`/`context` pattern, no Node.js `nodemailer` (Workers environment). If the feedback widget is not adapted to Cloudflare Functions, it silently stops working: the widget renders, the user submits feedback, the API call fails with a 404 or 500, and no feedback is received.

**Why it happens:** The project has already migrated hosting at least once (Vercel to Netlify judging by both API files existing), and the API function was partially migrated but the Cloudflare Pages adapter was never written.

**Consequences:** Feedback submissions fail silently. No data loss (no database), but the VoC (Voice of Customer) widget becomes decorative.

**Evidence in codebase:**
- `classic/api/page-feedback.ts` imports `@vercel/node` — this is a devDependency in `package.json`
- `netlify/functions/page-feedback.mjs` uses Netlify Functions API (`event.httpMethod`, `event.body`)
- Neither file uses Cloudflare Workers API (`Request`/`Response` web standard, `env` bindings)
- `classic/netlify.toml` exists, but no `wrangler.toml` or `functions/` directory under `classic/` for Cloudflare Pages

**Prevention:**
- During cleanup phase, decide on one feedback mechanism and write it as a Cloudflare Pages Function in `classic/functions/page-feedback.ts` using the Workers API
- Cloudflare Workers does not support `nodemailer` (no TCP sockets) — use `fetch()` to call a transactional email HTTP API (Resend, SendGrid, or ZeptoMail's HTTP API) instead
- Test the function locally using `wrangler pages dev` before deploying
- Remove `classic/api/` directory and `netlify/functions/` once the Cloudflare version is confirmed working

**Detection:** Submit a test feedback entry after deploy; check Cloudflare Pages Functions log for 404 or runtime errors.

**Phase:** Cleanup phase — adapt or replace the feedback function before it gets more buried.

---

## Moderate Pitfalls

### Pitfall 8: Algolia Re-Crawl Fails After Content Structure Changes

**What goes wrong:** Algolia DocSearch crawls the live site URL (`docs.nxgen.cloud`) on a schedule. If cleanup removes or restructures docs sections (e.g., removing the role-based doc instances at `/role-admin`, `/manager`, `/operator`, `/operator-minimal`) and those paths were previously indexed, old search results will point to pages that now 404. Algolia does not automatically remove stale records from past crawls — it only adds/updates on the next crawl.

**Why it happens:** DocSearch's crawler config is set on the Algolia side and the project has limited control over it without accessing the Algolia dashboard. The crawler config includes URL patterns — if pages are removed, those patterns still get crawled and the crawler may report errors rather than removing records.

**Consequences:** After cleanup, a user searching for "operator guide" sees results pointing to `/operator/index` which no longer exists.

**Prevention:**
- Before removing any routed docs instance (role-based docs), check if it has an active Algolia crawl pattern by examining the Algolia crawler config in the Algolia dashboard
- After any major structural change, manually trigger an Algolia re-crawl from the Algolia dashboard (not just wait for the scheduled crawl)
- When content moves from MDX files to Sanity, verify the final URLs are identical before triggering a re-crawl — if the URLs change, Algolia re-indexes from scratch and search has a gap period

**Detection:** After deploy, test 5–10 searches and click the results; any 404 from a search result indicates stale Algolia index.

**Phase:** Cleanup phase and Sanity integration phase — trigger a manual re-crawl at the end of each phase.

---

### Pitfall 9: Multiple `@docusaurus/plugin-content-docs` Instances Make Sidebar Management Brittle

**What goes wrong:** The `docusaurus.config.ts` registers six separate docs plugin instances (`docs`, `internal`, `admin`, `manager`, `operator`, `operator-minimal`), each with its own sidebar file. Each sidebar file must stay in sync with the actual directory structure under its `path`. If cleanup removes `docs-admin/` but leaves `sidebars-admin.ts` registered, the build throws `Cannot read properties of undefined` when Docusaurus tries to resolve the sidebar against the missing directory.

**Why it happens:** Role-based documentation instances were added as an experiment. Each required its own docs directory, sidebar config, and routing base path. The directories have almost no content (only `index.md` files in `docs-admin`, `docs-operator`, `docs-operator-minimal`), but the plugin registrations remain.

**Evidence in codebase:**
- `classic/docusaurus.config.ts` lines 122–195: five extra `@docusaurus/plugin-content-docs` instances
- `classic/docs-admin/index.md`: only file in the directory — confirms these are empty shells
- `classic/docs-operator/index.md`, `classic/docs-operator-minimal/index.md`: same

**Prevention:**
- Decide during planning whether role-based docs are kept or removed
- If removing: delete both the plugin registration from `docusaurus.config.ts` AND the corresponding `docs-*` directory AND the `sidebars-*.ts` file in one commit
- If keeping: ensure each docs directory has at least one non-index document, or Docusaurus will warn about empty sidebars

**Detection:** Build error `Error: Failed to load preset @docusaurus/preset-classic` or `Cannot read properties of undefined (reading 'type')` when a registered docs plugin path is missing or empty.

**Phase:** Cleanup phase — resolve role-based docs decision before any other cleanup.

---

### Pitfall 10: Sanity Schema Changes After Content Is Entered Are Destructive

**What goes wrong:** Sanity allows you to rename or remove schema fields without warning. If a field is renamed in the schema (e.g., `body` renamed to `content`) after editors have entered content, the old field's data is preserved in the document but becomes invisible in the Studio. The Docusaurus fetch query using GROQ still references the old field name and gets `null`, rendering pages blank. This is not reversible without a data migration script.

**Why it happens:** Sanity treats schema as a presentation layer — the underlying NDJSON documents are not transformed when the schema changes. The studio just stops showing the old field. The data is not deleted, but it becomes orphaned.

**Consequences:** After a schema rename during development, 50 articles that were written using the old field name have their body content return `null` from GROQ queries. The pages deploy as blank.

**Prevention:**
- Treat the initial Sanity schema as locked once content editors begin entering real content — design it carefully upfront using the MCP server before any content is entered
- When a schema change is required: (1) add the new field, (2) write a migration script using the Sanity CLI to copy old-field data to new-field data for all existing documents, (3) verify migration, (4) remove the old field
- During development (before any content is entered) schema changes are free — iterate as much as needed
- Use Sanity's `validation` rules to enforce required fields so content gaps are caught in Studio before publishing

**Phase:** Sanity integration phase — get schema right before content entry begins.

---

### Pitfall 11: Cloudflare Pages Ignores `netlify.toml` Silently

**What goes wrong:** The project has `classic/netlify.toml` which defines the build command as `npm run sync:storyblok:safe && npm run build`. Cloudflare Pages does not read `netlify.toml` — it uses its own build configuration set in the dashboard or `wrangler.toml`. If the Cloudflare Pages dashboard is configured to use the same build command as Netlify used, the `npm run sync:storyblok:safe` step will fail (the script doesn't exist in a clean state or requires a Storyblok token).

**Why it happens:** The project was previously deployed to Netlify and the build command was never updated in the Cloudflare Pages dashboard when the hosting was switched.

**Evidence in codebase:**
- `classic/netlify.toml` line 2: `command = "npm run sync:storyblok:safe && npm run build"` — references a Storyblok-specific script
- `classic/package.json` `scripts`: `"sync:storyblok:safe"` exists but calls `syncStoryblokSafe.js` which requires a Storyblok token

**Prevention:**
- Verify the build command set in the Cloudflare Pages dashboard — it should be `cd classic && npm run build` (or the equivalent simple build command)
- The `netlify.toml` file can remain in the repo for historical reference but should be renamed to `netlify.toml.disabled` or deleted during cleanup to avoid confusion
- Do not rely on any file-based build config for Cloudflare Pages — set the build command explicitly in the Cloudflare Pages dashboard

**Detection:** Cloudflare Pages build log shows `Error: Script not found: sync:storyblok:safe` or the Storyblok sync script runs and fails because `STORYBLOK_ACCESS_TOKEN` is not set in Cloudflare Pages environment.

**Phase:** Cleanup phase — fix build command in Cloudflare Pages dashboard on day one.

---

## Minor Pitfalls

### Pitfall 12: 3,832-Line CSS File Breaks When Dead Component Classes Are Deleted

**What goes wrong:** `classic/src/css/custom.css` has 3,832 lines. A significant portion defines styles for components that were added during the CMS experiments (Storyblok component styles, Tiptap editor styles, Monaco editor overrides, MUI component overrides). Deleting components without deleting their CSS rules leaves dead CSS — harmless but adds to bundle size. Deleting CSS rules without verifying they are not used by kept components will break visual layouts silently (no build error).

**Prevention:**
- Use a CSS coverage tool (Chrome DevTools Coverage tab) on the live site before cleanup to identify unused CSS rules
- When removing a component directory, search `custom.css` for CSS classes that include the component name before deleting
- Do not attempt to clean the full 3,832 lines in one pass — clean CSS in the same PR as the component that owns it

**Detection:** After cleanup deploy, visually audit key pages in both light and dark mode. Missing padding, borders, or colors indicate CSS rules were deleted that were still needed.

**Phase:** Cleanup phase — clean CSS alongside component removal, not separately.

---

### Pitfall 13: `DOMPurify` in `sanitize.ts` Crashes at Build Time (SSG Context)

**What goes wrong:** `classic/src/lib/sanitize.ts` imports `DOMPurify` from `dompurify`. `DOMPurify` requires a DOM environment. During Docusaurus SSG (server-side generation), components run in Node.js without a browser DOM. If any component that calls `sanitizeHTML()` or `sanitizeRichText()` is rendered during SSG, the build throws `ReferenceError: window is not defined`.

**Why it happens:** `sanitizeRichText` was written for Storyblok's rich text output — it was always called client-side in the Storyblok example page. If future Sanity content rendering adopts this function for sanitizing Portable Text HTML output, the build will crash because Sanity content is rendered during SSG.

**Prevention:**
- Do not use `sanitizeHTML()` on content fetched at build time — Sanity Portable Text is already structured JSON, not raw HTML, so sanitization is unnecessary
- If HTML sanitization is ever needed at build time, use `sanitize-html` (pure Node.js) instead of `dompurify` (DOM-dependent)
- The `sanitize.ts` file can be deleted entirely during cleanup once Storyblok code is gone; it has no other consumers

**Detection:** Build error `ReferenceError: window is not defined` pointing to a file that imports `dompurify`.

**Phase:** Cleanup phase — delete `sanitize.ts` when deleting Storyblok code.

---

### Pitfall 14: Sanity Webhook to Cloudflare Pages Requires a Deploy Hook URL, Not a Webhook Secret

**What goes wrong:** Teams configuring "Sanity publishes → Cloudflare Pages rebuilds" often set up a Sanity webhook with a secret header, expecting Cloudflare Pages to validate it. Cloudflare Pages does not have an incoming webhook endpoint with secret validation — it has a "Deploy Hook" which is a plain HTTPS URL that triggers a rebuild when POSTed to. The Sanity webhook must target this deploy hook URL directly. If the deploy hook URL is exposed (e.g., committed to the repo), anyone can trigger unlimited rebuilds, consuming the Cloudflare Pages free tier build minutes.

**Prevention:**
- Generate the Cloudflare Pages Deploy Hook URL from the Cloudflare Pages dashboard (Settings > Builds & Deployments > Deploy Hooks)
- Store the Deploy Hook URL as a Sanity webhook destination — set it only in the Sanity dashboard, never commit it to the repo
- Sanity webhooks support a filter so only published content events trigger the hook: use `_type == "article" && delta::changedAny(@)` to avoid unnecessary rebuilds from draft saves

**Detection:** Check Cloudflare Pages build history — if builds are triggering more than expected (e.g., on every Sanity save, not just on publishes), the webhook filter is wrong.

**Phase:** Sanity integration phase — configure webhook after Sanity project is created.

---

### Pitfall 15: `process.env.STORYBLOK_ACCESS_TOKEN` Reference in a Client-Side Page

**What goes wrong:** `classic/src/pages/storyblok-preview.tsx` line 45 reads `process.env.STORYBLOK_ACCESS_TOKEN` directly in client-side code. In Docusaurus, `process.env` variables are only inlined at build time for variables prefixed with `DOCUSAURUS_` (or configured explicitly). `STORYBLOK_ACCESS_TOKEN` is not prefixed, so this expression evaluates to `undefined` at runtime and the preview component shows an error state. This is a pre-existing bug, but it demonstrates a pattern that must not be repeated with Sanity — Sanity's API token must never be referenced in client-side component code.

**Prevention:**
- Sanity read operations from the frontend must use the public dataset token (not the editor token) when making client-side queries
- All build-time Sanity fetches use the token from a server-side script where `process.env` works correctly
- After Storyblok pages are deleted, this pattern is gone — do not re-introduce it

**Detection:** Browser console shows `SANITY_TOKEN is undefined` after deploy.

**Phase:** Sanity integration phase — review all env var references before deploying.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Remove `prebuild` hook | Build fails if Cloudflare Pages still runs `npm run fetch-content` | Remove the script reference immediately; update Cloudflare Pages build command in dashboard |
| Delete Storyblok pages | TypeScript import errors if lib file is deleted before consumers | Delete pages first, then lib, then components, then npm packages |
| Remove dead npm packages | `npm run build` fails if a non-obvious transitive dependency was depended on | Test build locally after each batch of package removals |
| Repair `onBrokenLinks` | Switching to `'throw'` mid-cleanup breaks the build on legitimate WIP | Stay on `'warn'` during cleanup; switch to `'throw'` only as a final cleanup gate |
| Remove role-based docs instances | Docusaurus throws if plugin instance is registered but directory is missing | Delete plugin registration and docs directory in the same commit |
| Adapt feedback widget for Cloudflare | `nodemailer` not available in Cloudflare Workers runtime | Rewrite using `fetch()` to an HTTP email API; test with `wrangler pages dev` |
| Design Sanity schema | Renaming fields after content entry destroys editor data visibility | Finalize schema before any content is entered; use MCP server for all schema operations |
| Migrate MDX to Sanity | Custom JSX components (`<Tabs>`, `<Callout>`) silently stripped | Audit component usage first; design Portable Text custom blocks for each |
| Switch Algolia index after URL changes | Old records point to deleted pages for days until next crawl | Manually trigger re-crawl in Algolia dashboard after each major structural deploy |
| First Cloudflare Pages deploy with Sanity | Fetch script crashes if `SANITY_PROJECT_ID` not yet set in CF env vars | Write fetch script with graceful fallback when env vars are missing |

---

## Sources

- Direct codebase analysis: `classic/package.json`, `classic/docusaurus.config.ts`, `classic/netlify.toml`, `classic/scripts/fetchHygraphContent.js`, `classic/scripts/build-with-memory.js`, `classic/src/lib/storyblok.ts`, `classic/src/lib/sanitize.ts`, `classic/src/pages/storyblok-example.tsx`, `classic/src/pages/storyblok-preview.tsx`, `classic/api/page-feedback.ts`, `netlify/functions/page-feedback.mjs`
- Docusaurus v3 documentation: SSG environment constraints, plugin-content-docs multi-instance behavior, broken link handling
- Sanity v3 documentation: Portable Text format, GROQ query language, schema migration patterns, webhook configuration
- Cloudflare Pages documentation: 20-minute build limit, Deploy Hooks (not incoming webhooks), Cloudflare Functions (Workers runtime — no Node.js APIs like TCP sockets or `nodemailer`)
- Confidence: HIGH for pitfalls 1–7 (all directly evidenced in codebase); HIGH for pitfalls 8–11 (well-documented platform behavior); MEDIUM for pitfalls 12–15 (platform behavior known, specific triggers inferred from code patterns)
