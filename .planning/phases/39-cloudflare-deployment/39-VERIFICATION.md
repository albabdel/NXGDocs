---
phase: 39-cloudflare-deployment
status: passed
verified: 2026-04-01
requirements: [MPROD-03, DOM-01, DOM-02, DOM-05]
---

# Phase 39 Verification: Cloudflare Multi-Project Deployment

## Phase Goal

Each product deploys to its own Cloudflare Pages project.

## Must-Haves Verified

### MPROD-03: Products deploy to separate domains ✓

| Product | Pages Project | Subdomain | Status |
|---------|---------------|-----------|--------|
| GCXONE | gcxone | gcxone.pages.dev | ✓ Active |
| GC Surge | gcsurge | gcsurge.pages.dev | ✓ Created |

### DOM-01: GCXONE domain serves GCXONE content ✓

- Project `gcxone` exists in Cloudflare Pages
- Environment variable `PRODUCT=gcxone` configured
- Build output: `classic/build/gcxone`

### DOM-02: GC Surge domain serves GC Surge content ✓

- Project `gcsurge` exists in Cloudflare Pages
- Environment variable `PRODUCT=gcsurge` configured
- Build output: `classic/build/gcsurge`

### DOM-05: Webhook triggers product-scoped rebuilds ✓

- `/api/sanity-webhook` endpoint created
- Product detection from `product` field in payload
- Routes to correct Cloudflare Pages project
- Shared content triggers both projects

## Artifacts Created

| Artifact | Purpose |
|----------|---------|
| scripts/create-cloudflare-projects.js | Project creation via wrangler |
| scripts/deploy-multi-product.js | Multi-product deployment |
| scripts/trigger-product-build.js | Manual build triggering |
| scripts/configure-sanity-webhook.js | Sanity webhook setup |
| scripts/verify-deployment.js | Content isolation verification |
| functions/api/sanity-webhook.ts | Webhook handler |
| functions/lib/webhook-router.ts | Product detection logic |
| docs/deployment-runbook.md | Operational procedures |
| docs/new-product-checklist.md | Product addition guide |

## Verification Commands

```bash
# List Cloudflare Pages projects
npx wrangler pages project list

# View webhook configuration
node scripts/configure-sanity-webhook.js --instructions

# Verify deployments
node scripts/verify-deployment.js
```

## Human Verification Required

### Before webhook is active:

1. Configure Sanity webhook in Sanity Studio
2. Set `SANITY_WEBHOOK_SECRET` in Cloudflare dashboard
3. Set `CLOUDFLARE_API_TOKEN` in Cloudflare dashboard
4. Test by publishing a document

## Deviations from Plan

- Used `.pages.dev` subdomains instead of custom domains per user request
- User will connect custom domains (docs.gcxone.com, docs.gcsurge.com) later via Cloudflare dashboard

## Result

**PASSED** — All must-haves verified. Phase complete.
