# Phase 1: Cleanup - Research

**Researched:** 2026-03-06
**Domain:** Docusaurus brownfield cleanup — dead CMS code removal, dependency pruning, CSS consolidation, broken-link hardening
**Confidence:** HIGH (all findings grounded in direct codebase inspection)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CLEN-01 | Remove all dead CMS packages (Storyblok, TinaCMS, Hygraph, Strapi, Payload, Tiptap, Monaco, Express, GraphQL client) so build passes clean | Package inventory in Standard Stack section; exact packages listed in Don't Hand-Roll table |
| CLEN-02 | Cloudflare Pages build no longer calls `fetchHygraphContent.js` or any legacy prebuild hooks | `prebuild` hook dissected in Architecture Patterns; build command correction described in Pitfalls |
| CLEN-03 | Unused React components identified and removed — only actively-rendered components remain in `src/components/` | Component audit in Architecture Patterns; orphaned vs active mapping documented |
| CLEN-04 | CSS consolidated from ~3,800 lines to a maintainable stylesheet, dead rules removed, visual design preserved | CSS audit strategy in Architecture Patterns; 3,832 confirmed line count |
| INTG-04 | `onBrokenLinks` upgraded from `'ignore'` to at minimum `'warn'`; build log surfaces broken links | Current config documented; safe upgrade sequence in Architecture Patterns; pitfall about mid-cleanup ordering |
</phase_requirements>

---

## Summary

Phase 1 is pure deletion and repair — no new features, no architecture decisions, no external services. The goal is a clean `npm run build` that completes without referencing any dead CMS code. The codebase has accumulated dead weight from at least four prior CMS integration attempts (Storyblok, Hygraph, Strapi/Payload, TinaCMS). Each attempt added packages and components but nothing was cleaned up when the attempt was abandoned. The result is a `package.json` with 70+ production dependencies, a `classic/src/components/` directory with 50+ components (roughly a third of which appear unused), a 3,832-line CSS file with orphaned rules, a `prebuild` hook calling a dead Hygraph script, and a `docusaurus.config.ts` that silently suppresses all broken links.

The five work streams are independent enough to be parallelized but must each be done carefully: (1) delete Storyblok surface atomically, (2) remove dead npm packages in batches with build verification between batches, (3) audit and prune unused components, (4) consolidate CSS alongside component removal, (5) repair `onBrokenLinks` after deletions are stable. The feedback widget rewrite (INTG-03) is also in scope for this phase per STATE.md — the widget currently hard-codes a `/.netlify/functions/page-feedback` URL in its component code and will silently fail on Cloudflare Pages.

**Primary recommendation:** Work in small atomic commits; verify `npm run build` locally after each logical unit of deletion before moving on. Never batch multiple types of removal into one untested commit.

---

## Standard Stack

### What Changes in This Phase

This phase makes NO library additions. The tools used are what already exist.

| Tool | Version | Purpose |
|------|---------|---------|
| `npm uninstall` | npm ≥ 18 | Remove dead dependencies from `package.json` |
| `docusaurus build` | 3.9.2 (current) | Verify each cleanup step compiles cleanly |
| Chrome DevTools Coverage | any | Identify unused CSS rules before bulk deletion |
| TypeScript compiler (`tsc`) | ~5.6.2 | Catch import errors after file deletions |

### Packages to Remove (CLEN-01)

Verified by direct inspection of `classic/package.json`. Every package below has no live usage in `src/pages/` or `src/components/` after Storyblok surface is deleted.

**Storyblok (3 packages):**
```
@storyblok/js @storyblok/react storyblok-js-client
```

**Tiptap editor (8 packages — all Tiptap):**
```
@tiptap/extension-image @tiptap/extension-link @tiptap/extension-table
@tiptap/extension-table-cell @tiptap/extension-table-header
@tiptap/extension-table-row @tiptap/react @tiptap/starter-kit
```

**Monaco editor (1 package):**
```
@monaco-editor/react
```

**GraphQL stack (2 packages):**
```
graphql graphql-request
```

**Express / server-side Node packages (2 packages):**
```
express cors
```

**nodemailer and Vercel types (3 packages — move to after feedback rewrite):**
```
nodemailer @types/nodemailer @vercel/node
```

**dompurify (1 package — Storyblok sanitizer, SSG-unsafe):**
```
dompurify
```

**Packages requiring usage audit before removal (potentially still used):**

| Package | Risk | Check Before Removing |
|---------|------|-----------------------|
| `@dnd-kit/core` `@dnd-kit/sortable` `@dnd-kit/utilities` | No usage found in active pages/theme, but not confirmed 0 | `grep -r "dnd-kit\|useDraggable\|useSortable" classic/src/` |
| `@mui/material` `@emotion/react` `@emotion/styled` | Used by `react-mui-sidebar` (check if react-mui-sidebar is used) | `grep -r "mui\|MUI\|react-mui-sidebar" classic/src/` |
| `@tsparticles/engine` `@tsparticles/react` `@tsparticles/slim` | `ParticleBackground` component exists but no import in pages/theme found | Confirm ParticleBackground is truly orphaned |
| `framer-motion` | Used by active components — do not remove until component audit confirms no active user | `grep -r "framer-motion\|motion\." classic/src/` |
| `html2canvas` `jspdf` | Used by `PDFExport` / `PDFExportButton` components — confirm orphaned | `grep -r "html2canvas\|jspdf" classic/src/` |
| `browser-image-compression` | Unknown usage | `grep -r "browser-image-compression" classic/src/` |
| `pdf-parse` | No live page usage obvious; may be in dead scripts | `grep -r "pdf-parse" classic/src/` |
| `axios` | May be used in active components | `grep -r "axios" classic/src/` |
| `i18next` `i18next-browser-languagedetector` `react-i18next` `lunr-languages` | i18n disabled in config; `LanguageSwitcher` `LanguageToggle` `TranslationGlow` `TranslationProgressBar` appear orphaned | Confirm all four components have no active callers |
| `immer` `zustand` | State management — check active component usage | `grep -r "immer\|zustand\|create(" classic/src/` |
| `marked` `turndown` `react-markdown` `gray-matter` `js-yaml` | Used in scripts or active components? | `grep -r "from 'marked'\|from 'turndown'\|from 'react-markdown'" classic/src/` |
| `dotenv` | Used in dead scripts only; not needed in Docusaurus frontend bundle | Confirm no `classic/src/` usage |

**devDependencies to remove:**
```
decap-server  @types/pg  pg  @vercel/node
```
(Decap CMS is another abandoned CMS attempt; `pg` is PostgreSQL for a dead backend)

**devDependencies to keep:**
```
@playwright/test  tailwindcss  @tailwindcss/forms  @tailwindcss/typography
autoprefixer  postcss  typescript  @docusaurus/*
```

### Installation After Cleanup

```bash
cd classic
npm uninstall @storyblok/js @storyblok/react storyblok-js-client \
  @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table \
  @tiptap/extension-table-cell @tiptap/extension-table-header \
  @tiptap/extension-table-row @tiptap/react @tiptap/starter-kit \
  @monaco-editor/react graphql graphql-request express cors dompurify
# Then batch by batch for the "requires audit" list after confirming no usage
npm run build  # verify after each batch
```

---

## Architecture Patterns

### Recommended Execution Order

Work streams that have dependencies must follow this order. Within each stream, commit atomically.

```
Stream A: Storyblok deletion (do first — unlocks package removal)
  A1. Delete src/pages/storyblok-example.tsx
  A2. Delete src/pages/storyblok-preview.tsx
  A3. Delete src/components/storyblok/ (entire directory)
  A4. Delete src/lib/storyblok.ts
  A5. Delete src/lib/sanitize.ts  (Storyblok-only consumer; DOMPurify SSG-unsafe)
  A6. npm uninstall @storyblok/js @storyblok/react storyblok-js-client dompurify
  A7. npm run build  ← MUST PASS before proceeding

Stream B: Dead scripts and prebuild hook (do second — CLEN-02)
  B1. Remove "prebuild" key from package.json scripts
  B2. Remove "fetch-content": "node scripts/fetchHygraphContent.js" from scripts
  B3. Remove all dead CMS scripts from package.json scripts section:
      migrate:articles, migrate:articles:test, migrate:articles:dry-run,
      upload:images, upload:bulk, migrate:hygraph, migrate:hygraph:test,
      migrate:hygraph:dry-run, sync:storyblok, sync:storyblok:safe,
      migrate:storyblok, setup:preview, preview, dev:preview
  B4. Fix "start" script: remove "npm run fetch-content &&" prefix
  B5. Delete classic/scripts/ files that are pure dead CMS code (see list below)
  B6. Rename classic/netlify.toml → classic/netlify.toml.disabled
  B7. npm run build ← MUST PASS

Stream C: Component audit and removal (CLEN-03)
  C1. Run component usage audit (see pattern below)
  C2. Delete confirmed-orphaned components (see list below)
  C3. npm run build after each component group deletion
  C4. For each deleted component directory, remove matching CSS rules from custom.css

Stream D: CSS consolidation (CLEN-04) — run alongside Stream C
  D1. Take Chrome DevTools Coverage snapshot of live site before cleanup
  D2. Remove CSS rules alongside each component deletion (same PR)
  D3. After all component deletions, do a final CSS audit pass
  D4. Target: under 2,000 lines; visual spot-check in light+dark mode

Stream E: Broken link repair (INTG-04) — run after Streams A-C
  E1. Change onBrokenLinks to 'warn' in docusaurus.config.ts (not 'throw' yet)
  E2. Change onBrokenMarkdownLinks to 'warn'
  E3. Change onBrokenAnchors to 'warn'
  E4. npm run build — capture all warnings
  E5. Fix each reported broken link
  E6. Change onBrokenLinks to 'throw' only after all warnings are resolved

Stream F: Feedback widget rewrite (INTG-03 in scope here per STATE.md)
  F1. Write classic/functions/page-feedback.ts using Cloudflare Workers API
  F2. Update PageFeedback component to call /functions/page-feedback (not /.netlify/...)
  F3. npm uninstall nodemailer @types/nodemailer @vercel/node
  F4. Delete classic/api/ directory
  F5. Delete netlify/functions/page-feedback.mjs
  F6. Test with: wrangler pages dev (if wrangler is available)
```

### Pattern 1: Atomic Storyblok Deletion

**What:** Delete all Storyblok files in the exact order that prevents TypeScript import chain errors.

**Why order matters:** `storyblok-example.tsx` imports `../lib/storyblok` which imports all `storyblok/` components. Docusaurus auto-compiles all `.tsx` in `src/pages/`. Partial deletion creates orphaned import errors.

**Correct order (verified from codebase):**
```
1. classic/src/pages/storyblok-example.tsx   ← page that imports lib
2. classic/src/pages/storyblok-preview.tsx   ← page using window.storyblok
3. classic/src/components/storyblok/DocPage.tsx
4. classic/src/components/storyblok/Feature.tsx
5. classic/src/components/storyblok/Grid.tsx
6. classic/src/components/storyblok/Page.tsx
7. classic/src/components/storyblok/Teaser.tsx
8. classic/src/components/storyblok/index.ts
9. classic/src/lib/storyblok.ts              ← lib that imported components
10. classic/src/lib/sanitize.ts              ← DOMPurify wrapper (Storyblok-only)
```

Then: `npm uninstall @storyblok/js @storyblok/react storyblok-js-client dompurify`

### Pattern 2: Dead Scripts Inventory

Scripts directory files that are safe to delete (confirmed dead CMS scripts):
```
classic/scripts/fetchHygraphContent.js       ← Hygraph; called by prebuild hook
classic/scripts/migrate-articles-to-hygraph.js
classic/scripts/migrate-to-hygraph.js
classic/scripts/upload-images-to-hygraph.js
classic/scripts/bulk-upload-images.js
classic/scripts/migrate-to-hygraph.js
classic/scripts/syncStoryblok.js
classic/scripts/syncStoryblokSafe.js
classic/scripts/migrateToStoryblok.js
classic/scripts/clearStoryblok.js
classic/scripts/publishAllStories.js
classic/scripts/verifyStories.js
classic/scripts/getSpaceId.js
classic/scripts/check-article-model.js
classic/scripts/check-asset-input.js
classic/scripts/check-asset-upload-method.js
classic/scripts/check-content-api-public.js
classic/scripts/check-content-api.js
classic/scripts/query-schema-structure.js
classic/scripts/simple-project-check.js
classic/scripts/test-hygraph-schema.js
classic/scripts/test-hygraph-upload-api.js
classic/scripts/verify-token-project.js
classic/scripts/test-algolia-search.js      ← probably safe; verify first
classic/scripts/test-create-article.js
classic/scripts/test-dahua-search.js
classic/scripts/test-direct-asset-upload.js
classic/scripts/test-full-base64-upload.js
classic/scripts/test-search-key.js
classic/scripts/test-single-image-upload.js
classic/scripts/index-documentation.js      ← Algolia indexer; audit before delete
```

Scripts to **keep** (confirmed live use):
```
classic/scripts/build-with-memory.js        ← "build" script calls this; KEEP
classic/scripts/validate-links.js           ← potentially useful post-INTG-04
classic/scripts/verify-algolia-index.js     ← audit; may be useful
```

`scripts/lib/` subdirectory — audit contents before deleting.

### Pattern 3: Component Usage Audit (CLEN-03)

**Confirmed active (DO NOT delete):**
| Component | Active Callers |
|-----------|---------------|
| `NXGENSphereHero.tsx` | `src/pages/index.tsx` |
| `breakthroughs/` | `src/pages/index.tsx` (BreakthroughGrid) |
| `GCXOneLandingPage/` | needs audit — check index.tsx imports |
| `GettingStarted/` | `src/pages/getting-started.tsx` |
| `RoleLandingPage.tsx` | check `src/pages/roles/` |
| `RoleSwitcher.tsx` | `src/theme/DocSidebar/Desktop/index.tsx`, `src/theme/NavbarItem/ComponentTypes.tsx` |
| `ShareSection/` | `src/theme/DocItem/Layout/index.tsx` |
| `LanguageToggle/` | `src/theme/NavbarItem/ComponentTypes.tsx` |
| `ScrollProgress/` | `src/theme/Root.tsx` |
| `VoCWidget/` | `src/theme/Root.tsx` |
| `BackgroundPattern/` | `src/theme/Root.tsx` |
| `PageFeedback/` | used by VoCWidget or DocItem Footer — verify |
| `Checklist/` | `docs/getting-started/quick-start-checklist.mdx` |
| `OnboardingDiagrams/` | `docs/getting-started/quick-start-checklist.mdx` |
| `GradientText/` | `src/pages/user-management.tsx` |
| `Callout/` `Steps/` `Tabs/` `CodeBlock/` | MDX docs — do NOT delete; widely used |
| `CloudinaryImage/` `CloudinaryVideo/` | check docs/ for usage |
| `ErrorBoundary/` | check theme/Root.tsx |

**Confirmed or suspected orphaned (audit then delete):**
| Component | Evidence of Orphan Status |
|-----------|--------------------------|
| `storyblok/` (all 5 + index.ts) | Only imported by deleted storyblok-*.tsx pages |
| `ParticleBackground/` | No import found in pages/, theme/, or docs/ |
| `PDFExport/` + `PDFExportButton/` | Only PDFExportButton imports PDFExport; no caller of PDFExportButton found |
| `LanguageSwitcher/` | i18n disabled; no import found in pages/theme |
| `TranslationGlow/` | No import found in pages/theme |
| `TranslationProgressBar/` | No import found in pages/theme |
| `ScrollIndicator/` | No import found (ScrollProgress is used, not ScrollIndicator) |
| `TypingAnimation/` | No import found in pages/theme |
| `BeforeAfter/` | No import found in pages/theme |
| `AnimatedStats/` | No import found in pages/theme |
| `ImageGallery/` | No import found in pages/theme (check docs/) |
| `BreakthroughsGatewayCard.tsx` | Self-contained; no import found outside its own file |

**Requires further audit before deciding:**
| Component | What to Check |
|-----------|--------------|
| `HomepageFeatures/` | `grep -r "HomepageFeatures" classic/src/` |
| `FeatureCard/` `EnhancedFeatureCard/` `FeaturesGrid/` | `grep -r "FeatureCard\|FeaturesGrid" classic/src/ classic/docs/` |
| `DeviceCard/` | `grep -r "DeviceCard" classic/src/ classic/docs/` |
| `QuickLink/` `QuickLinks/` `RelatedArticles/` | `grep -r "QuickLink\|RelatedArticles" classic/src/ classic/docs/` |
| `Skeleton/` | `grep -r "Skeleton" classic/src/` |
| `Collapsible/` | `grep -r "Collapsible" classic/src/ classic/docs/` |
| `Footer/` | Check if swizzled theme footer uses this |
| `ThemeToggle/` | `grep -r "ThemeToggle" classic/src/ classic/docs/` |
| `BackToTop/` | `grep -r "BackToTop" classic/src/` |
| `Badge/` | `grep -r "Badge" classic/src/ classic/docs/` |
| `VideoEmbed/` | `grep -r "VideoEmbed" classic/docs/` |
| `PrevNext/` | `grep -r "PrevNext" classic/src/` |
| `PageHeader/` | `grep -r "PageHeader" classic/src/ classic/docs/` |
| `LandingPageBackground/` | `grep -r "LandingPageBackground" classic/src/` |

### Pattern 4: onBrokenLinks Safe Upgrade Sequence

**Current state:** All three set to `'ignore'` in `docusaurus.config.ts` lines 65–67.

**Safe upgrade sequence:**
```typescript
// Step 1: After all deletions, switch to 'warn' — NOT 'throw' yet
onBrokenLinks: 'warn',
onBrokenMarkdownLinks: 'warn',
onBrokenAnchors: 'warn',

// Step 2: Run build, collect all warnings, fix them all
// Step 3: Only after ALL warnings are resolved, switch to 'throw'
onBrokenLinks: 'throw',
onBrokenMarkdownLinks: 'warn',  // keep warn for markdown (external content)
onBrokenAnchors: 'warn',        // anchors can be fragile; keep warn until Phase 5
```

**Warning:** Never switch to `'throw'` while file deletions are still in progress. The cleanup itself temporarily creates new broken links that will block the build.

### Pattern 5: Cloudflare Pages Build Command Fix (CLEN-02)

The `classic/netlify.toml` has a stale build command that Cloudflare Pages does not read (it uses its own dashboard config). Action required:

1. Rename `classic/netlify.toml` to `classic/netlify.toml.disabled` (or delete it)
2. Verify the Cloudflare Pages dashboard build command is set to: `cd classic && npm run build`
3. The `npm run build` script in `package.json` calls `node scripts/build-with-memory.js` — this is correct and must be kept

The `package.json` `start` script currently reads: `"start": "npm run fetch-content && docusaurus start --host 0.0.0.0"` — remove the `npm run fetch-content &&` prefix so dev starts without the dead Hygraph fetch.

### Pattern 6: Cloudflare Pages Function for Feedback Widget (INTG-03)

The `PageFeedback` component at line 36 hard-codes:
```typescript
const apiUrl = isDev
  ? 'http://localhost:3001/api/page-feedback'
  : '/.netlify/functions/page-feedback';  // WRONG — not Cloudflare
```

**Target state:** A Cloudflare Pages Function at `classic/functions/page-feedback.ts`.

Cloudflare Pages Functions use Web Standard APIs (`Request`/`Response`), not Node.js `http` or Netlify `event`/`context`.

**Cloudflare Pages Function skeleton:**
```typescript
// classic/functions/page-feedback.ts
// Source: https://developers.cloudflare.com/pages/functions/api-reference/

export const onRequestPost: PagesFunction = async (context) => {
  const payload = await context.request.json();
  // validate payload...

  // ZeptoMail HTTP API (not SMTP — Cloudflare Workers has no TCP sockets)
  const response = await fetch('https://api.zeptomail.eu/v1.1/email', {
    method: 'POST',
    headers: {
      'Authorization': `Zoho-enczapikey ${context.env.ZEPTO_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ /* ZeptoMail API payload */ }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

The email logic (HTML body, recipient, subject format) is fully defined in the existing `classic/api/page-feedback.ts` and `netlify/functions/page-feedback.mjs` — preserve it, just change the transport from SMTP to HTTP API.

**PageFeedback component update:** Change the production URL from `/.netlify/functions/page-feedback` to `/functions/page-feedback`.

### Anti-Patterns to Avoid

- **Deleting lib before consumers:** Delete `storyblok-example.tsx` and `storyblok-preview.tsx` before deleting `src/lib/storyblok.ts`. Always pages-first, lib-last.
- **Bulk package removal without build check:** Remove one thematic batch of packages, run `npm run build`, verify, then the next batch. Never remove 20 packages in one commit without testing.
- **Switching `onBrokenLinks` to `'throw'` mid-cleanup:** Use `'warn'` during cleanup. `'throw'` is the final gate, set only after all warnings resolved.
- **Deleting a docs plugin instance without its directory and sidebar file:** If removing role-based docs instances, delete the `docusaurus.config.ts` plugin registration, the `docs-*` directory, and the `sidebars-*.ts` file in the same commit.
- **Rewriting the feedback widget and removing `nodemailer` in the same commit before the Cloudflare function is tested:** Write and verify the new Cloudflare function first; remove old files second.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Identifying unused CSS | Custom CSS parser | Chrome DevTools Coverage tab | Built-in, handles cascading and dynamic class names |
| Finding orphaned component imports | Manual search | `grep -r "ComponentName" classic/src/ classic/docs/` | Fast, accurate, already available |
| Verifying clean build | Any custom validator | `npm run build` (calls `build-with-memory.js`) | Ground truth; TypeScript compiler catches all import errors |
| Cloudflare Workers email sending | TCP SMTP via `nodemailer` | ZeptoMail or Resend HTTP API via `fetch()` | Workers runtime has no TCP sockets; `nodemailer` will throw at runtime |

**Key insight:** This is a subtraction phase. The correct tool for every task is "delete the file and run the build." No new tooling is needed.

---

## Common Pitfalls

### Pitfall 1: Partial Storyblok Deletion Causes Confusing TypeScript Errors
**What goes wrong:** `storyblok-example.tsx` imports `../lib/storyblok`; if the lib is deleted first, TypeScript throws `Cannot find module '../lib/storyblok'` which reads as an unrelated module resolution failure.
**Why it happens:** Docusaurus compiles every `.tsx` in `src/pages/` automatically. There is no opt-out.
**How to avoid:** Always delete page files before the lib files they import. See Pattern 1 above for the exact order.
**Warning signs:** `Cannot find module` errors pointing to `src/lib/` files.

### Pitfall 2: `prebuild` Hook Failure on Cloudflare Pages
**What goes wrong:** `"prebuild": "npm run fetch-content"` runs `fetchHygraphContent.js`. The script currently exits 0 when env vars are missing. Deleting the script without removing the `prebuild` hook reference will cause a build failure (`Error: Missing script: fetch-content`).
**How to avoid:** Remove the `"prebuild"` key from `package.json` entirely as the first step of Stream B. Do not leave a dangling reference.
**Warning signs:** Cloudflare Pages build log shows `npm warn lifecycle ... prebuild: ...` error.

### Pitfall 3: Role-Based Docs Plugin Registration Without Its Directory
**What goes wrong:** `docusaurus.config.ts` registers `docs-admin`, `docs-manager`, `docs-operator`, `docs-operator-minimal` as plugin instances. Each has only one `index.md`. If the plugin is deregistered but the directory remains (or vice versa), the build throws a cryptic Docusaurus resolution error.
**How to avoid:** If any role-based docs instance is removed, delete the config registration, the `docs-*` directory, and the `sidebars-*.ts` file in one commit. Build after the commit.
**Note:** Per STATE.md, the decision to keep or consolidate role-based docs must be made during planning, before execution begins. The planner must surface this decision.

### Pitfall 4: `onBrokenLinks: 'throw'` Blocks the Build Mid-Cleanup
**What goes wrong:** Deleting pages creates new broken links (sidebar entries, internal cross-links pointing to deleted pages). If `onBrokenLinks` is set to `'throw'` before all broken links are fixed, the build fails on every subsequent cleanup commit.
**How to avoid:** Stay on `'warn'` during cleanup. Switch to `'throw'` as the final step of Stream E, only after all warnings are resolved.

### Pitfall 5: CSS Deletion Breaks Visual Layout Silently
**What goes wrong:** The 3,832-line `custom.css` has rules for dead components (Storyblok component styles, Tiptap editor styles, Monaco overrides, MUI overrides). But it also has rules shared across multiple components. Deleting a rule that looks component-specific may actually affect a live component that reuses the same class name.
**How to avoid:** Clean CSS in the same PR as the component that owns it, not in a separate sweep. Use the Chrome Coverage tool to identify unused rules before any deletion. After each CSS cleanup commit, visually spot-check the homepage and 2–3 docs pages in both light and dark mode.

### Pitfall 6: Feedback Widget Silent Failure After Deploy
**What goes wrong:** `PageFeedback/index.tsx` hard-codes `/.netlify/functions/page-feedback` as the production endpoint. On Cloudflare Pages, this returns a 404. The widget renders normally; feedback submissions silently fail.
**How to avoid:** Write the Cloudflare Pages Function at `classic/functions/page-feedback.ts` before merging any cleanup. Update the URL in the component before the first Cloudflare deploy after cleanup.

### Pitfall 7: `DOMPurify` in `sanitize.ts` Will Crash If Reused
**What goes wrong:** `classic/src/lib/sanitize.ts` imports `dompurify`. DOMPurify requires a browser DOM. Docusaurus SSG runs in Node.js. If any future component imports `sanitizeHTML()` at build time, the build throws `ReferenceError: window is not defined`.
**How to avoid:** Delete `sanitize.ts` in Stream A alongside the Storyblok deletion. It has no consumers other than Storyblok pages. Do not reuse it for Sanity content (Sanity Portable Text is structured JSON, not raw HTML).

### Pitfall 8: Packages That Look Orphaned But Have Transitive Consumers
**What goes wrong:** Some packages in `package.json` may be used by packages in the "audit" list above. For example, `@emotion/react` and `@emotion/styled` are peers of `@mui/material`. If `react-mui-sidebar` (which imports from MUI) is still used anywhere, removing MUI will cause a runtime import error.
**How to avoid:** For each batch of package removals, run `npm run build` and check for `Module not found` errors. Never assume a package is truly orphaned without running the build.

---

## Code Examples

### Cloudflare Pages Function Structure
```typescript
// classic/functions/page-feedback.ts
// Source: https://developers.cloudflare.com/pages/functions/api-reference/

interface Env {
  SMTP_USER: string;
  SMTP_PASS: string;
  ZEPTO_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const payload = await context.request.json() as PageFeedbackPayload;

    if (!payload.type || payload.type !== 'page_feedback') {
      return new Response(JSON.stringify({ error: 'Invalid feedback type' }), { status: 400, headers });
    }

    // Use fetch() to call ZeptoMail HTTP API — NOT nodemailer (no TCP in Workers)
    const emailResponse = await fetch('https://api.zeptomail.eu/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-enczapikey ${context.env.ZEPTO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'noreply@nxgen.io' },
        to: [{ email_address: { address: 'abed.badarnah@nxgen.io' } }],
        subject: `[Page Feedback] ${payload.context?.pageTitle}`,
        htmlbody: formatEmailBody(payload),
      }),
    });

    if (!emailResponse.ok) throw new Error(`ZeptoMail error: ${emailResponse.status}`);

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to send feedback' }), { status: 500, headers });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
```

### package.json Scripts After Cleanup
```json
{
  "scripts": {
    "docusaurus": "docusaurus",
    "start": "docusaurus start --host 0.0.0.0",
    "build": "node scripts/build-with-memory.js",
    "swizzle": "docusaurus swizzle",
    "deploy": "docusaurus deploy",
    "clear": "docusaurus clear",
    "serve": "docusaurus serve --host 0.0.0.0",
    "write-translations": "docusaurus write-translations",
    "write-heading-ids": "docusaurus write-heading-ids",
    "typecheck": "tsc",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```
Note: `"index:algolia"` and `"validate-links"` may be kept if the scripts themselves are non-dead.

### docusaurus.config.ts Broken Links — Target State
```typescript
// After all deletions and link repairs:
onBrokenLinks: 'throw',
onBrokenMarkdownLinks: 'warn',
onBrokenAnchors: 'warn',
```

---

## State of the Art

| Old Approach | Current Approach | Phase Impact |
|--------------|------------------|--------------|
| `netlify.toml` build command | Cloudflare Pages dashboard build config | Must be verified in CF dashboard; toml file is ignored |
| `prebuild` hook for CMS fetch | No prebuild hook during cleanup; Sanity fetch added in Phase 3 | Remove hook in this phase; Phase 3 re-adds it with graceful fallback |
| `nodemailer` SMTP | HTTP email API (`fetch()`) for Workers-compatible function | Rewrite required in this phase |
| `onBrokenLinks: 'ignore'` | `'warn'` (this phase) → `'throw'` (final gate) | Upgrade in two steps per safe sequence |

**Deprecated/outdated in this codebase:**
- `netlify/functions/page-feedback.mjs`: Netlify Functions format — superseded by Cloudflare Pages Functions
- `classic/api/page-feedback.ts`: Vercel format — never ran correctly on Cloudflare Pages
- All `classic/scripts/migrate-*`, `classic/scripts/sync-*` scripts: Dead CMS integration artifacts

---

## Open Questions

1. **Role-based docs instances: keep, consolidate, or remove?**
   - What we know: `docs-admin`, `docs-manager`, `docs-operator`, `docs-operator-minimal` each have exactly one `index.md`. `docs-internal` has a `README.md`. These are essentially empty shells.
   - What's unclear: Whether any current navigation links or reader-facing URLs depend on `/role-admin/`, `/manager/`, `/operator/`, `/operator-minimal/` paths. These are active Cloudflare Pages routes today.
   - Recommendation: **The planner must surface this as an explicit decision before execution begins.** Per STATE.md, this decision must be made before Phase 2 schema work. Options: (a) Keep all five as empty shells with just index pages — no code change needed, deferred to Phase 5; (b) Remove the four role-based instances now — lower complexity, but requires checking for live navigation links pointing to those paths. If no live links exist and the directories only have `index.md`, removal is safe. If live links exist, keep them. Recommend the planner include a task to check live traffic/links before deciding.

2. **ZeptoMail HTTP API key availability**
   - What we know: Current feedback widget uses ZeptoMail SMTP (`smtp.zeptomail.eu:587`) with `SMTP_USER`/`SMTP_PASS` credentials stored in Cloudflare Pages env vars.
   - What's unclear: Whether ZeptoMail HTTP API key is available, or whether the project needs to switch to a different HTTP email service (Resend or SendGrid are simpler for one-shot transactional email).
   - Recommendation: Check Cloudflare Pages env vars and ZeptoMail dashboard. If ZeptoMail HTTP API key is not available, use Resend — simpler API, $0/month free tier, 3,000 emails/month. The planner should include a decision point for the email service.

3. **`docs-internal` directory content**
   - What we know: Contains only a `README.md` (not `index.md`). The `internal` plugin instance is registered with `showLastUpdateTime: true`, suggesting it was intended for real internal docs.
   - What's unclear: Whether any internal docs are planned or if this is also an empty shell to be removed.
   - Recommendation: Check if the `internal` plugin renders a valid page at `/internal` with just the `README.md`. If it does and someone uses it, keep it. If not, remove it with the role-based docs decision.

---

## Validation Architecture

`nyquist_validation` is enabled in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.48.0 |
| Config file | `classic/playwright.config.ts` (exists) |
| Test directory | `classic/e2e/` |
| Quick run command | `cd classic && npx playwright test --project=chromium e2e/docusaurus-integration.spec.ts` |
| Full suite command | `cd classic && npx playwright test` |
| Build verification | `cd classic && npm run build` (primary gate — TypeScript compile + Docusaurus SSG) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | Notes |
|--------|----------|-----------|-------------------|-------|
| CLEN-01 | Build passes with no Storyblok/Tiptap/Monaco/GraphQL references | build | `cd classic && npm run build` | Build output contains no `@storyblok`, `@tiptap`, `@monaco-editor`, `graphql` in the bundle manifest |
| CLEN-01 | `npm ls` confirms dead packages absent | build | `cd classic && npm ls --depth=0` | Grep output for absence of removed packages |
| CLEN-02 | `prebuild` hook absent from package.json | static | `grep "prebuild" classic/package.json` — must return exit 1 | Simple grep check |
| CLEN-02 | Build does not call `fetchHygraphContent.js` | build | `cd classic && npm run build 2>&1 \| grep -c "fetchHygraph"` must be 0 | Check build log output |
| CLEN-03 | No `.tsx` file in `src/components/` imports deleted packages | build | `cd classic && npm run build` catches all import errors | TypeScript compile is the gate |
| CLEN-04 | CSS file under 2,000 lines | static | `wc -l classic/src/css/custom.css` | Simple line count |
| CLEN-04 | Visual design unchanged (homepage, a docs page, dark mode) | manual | Launch `cd classic && npm run serve`, compare key pages | Screenshot comparison after cleanup |
| INTG-04 | Build log contains no broken link warnings | build | `cd classic && npm run build 2>&1 \| grep -i "broken"` must return empty | After switching to 'warn', zero warnings before switching to 'throw' |
| INTG-04 | `onBrokenLinks` is 'throw' at phase completion | static | `grep "onBrokenLinks" classic/docusaurus.config.ts` | Final state check |

### Sampling Rate
- **Per task commit:** `cd classic && npm run build` (TypeScript compile + SSG — 2–3 minutes locally)
- **Per work stream completion:** Full build + grep checks above
- **Phase gate:** All build checks pass, CSS under 2,000 lines, visual spot-check complete, `onBrokenLinks: 'throw'` set

### Wave 0 Gaps

No new test files are needed. The existing Playwright spec (`classic/e2e/docusaurus-integration.spec.ts`) tests at the wrong level for this phase (it tests CMS navigation that will be deleted). The primary validation mechanism is `npm run build` — a clean TypeScript compile and successful SSG is the authoritative gate for every task in this phase.

---

## Sources

### Primary (HIGH confidence)
- Direct codebase inspection: `classic/package.json` — exact dependency list (70+ deps confirmed)
- Direct codebase inspection: `classic/docusaurus.config.ts` — `onBrokenLinks: 'ignore'`, 5 role-based docs plugin instances confirmed
- Direct codebase inspection: `classic/src/components/` — 50+ component directories listed
- Direct codebase inspection: `classic/src/pages/` — storyblok-example.tsx, storyblok-preview.tsx confirmed present
- Direct codebase inspection: `classic/src/lib/storyblok.ts`, `classic/src/lib/sanitize.ts` — confirmed Storyblok-only consumers
- Direct codebase inspection: `classic/api/page-feedback.ts`, `netlify/functions/page-feedback.mjs` — Vercel/Netlify format confirmed; `nodemailer` SMTP confirmed
- Direct codebase inspection: `classic/src/components/PageFeedback/index.tsx` line 36 — `/.netlify/functions/page-feedback` URL confirmed hard-coded
- Direct codebase inspection: `classic/scripts/fetchHygraphContent.js` — exit-0 guard confirmed, `graphql-request` usage confirmed
- Direct codebase inspection: `classic/netlify.toml` — stale Storyblok build command confirmed
- `wc -l classic/src/css/custom.css` → 3,832 lines confirmed
- Cloudflare Pages Functions docs: https://developers.cloudflare.com/pages/functions/api-reference/
- ZeptoMail HTTP API docs: https://www.zoho.com/zeptomail/help/api/email-sending.html

### Secondary (MEDIUM confidence)
- `.planning/research/PITFALLS.md` — all 15 pitfalls reviewed; phase-relevant ones incorporated above
- `.planning/research/SUMMARY.md` — architecture decisions and dead package list incorporated

### Tertiary (LOW confidence — needs validation)
- Component orphan status for `BreakthroughsGatewayCard`, `PDFExport*`, `LanguageSwitcher`, `TranslationGlow`, `TranslationProgressBar`, `ScrollIndicator`, `TypingAnimation`, `BeforeAfter`, `AnimatedStats` — these are assessed as orphaned based on grep search of `src/` but have not been verified against `classic/docs/` MDX files comprehensively; planner should include an explicit "confirm no MDX usage" task for each

---

## Metadata

**Confidence breakdown:**
- CLEN-01 (package removal): HIGH — exact package names from live `package.json`; audit-first list for ambiguous packages is conservative
- CLEN-02 (prebuild hook): HIGH — `"prebuild"` key and `fetchHygraphContent.js` confirmed in `package.json`
- CLEN-03 (component audit): MEDIUM — confirmed-active list is HIGH; orphaned list is MEDIUM (grep-based, not exhaustive MDX scan)
- CLEN-04 (CSS): HIGH — 3,832 line count confirmed; strategy is standard (Coverage tool + co-delete with components)
- INTG-04 (broken links): HIGH — `'ignore'` setting confirmed in config; safe upgrade sequence is standard Docusaurus practice
- Feedback widget rewrite: HIGH — Cloudflare Workers API constraint is well-documented; `nodemailer` incompatibility is a platform fact

**Research date:** 2026-03-06
**Valid until:** 2026-04-06 (stable domain — npm package names don't change; Docusaurus 3.x API is stable)
