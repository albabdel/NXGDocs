---
phase: 39-cloudflare-deployment
plan: 02
subsystem: webhook
tags: [sanity, webhook, cloudflare, product-detection, build-trigger]
requires: [DOM-05]
provides: [product-scoped-rebuilds, sanity-webhook-handler]

key-files:
  created:
    - path: functions/lib/webhook-router.ts
      description: Product detection and build routing utilities
    - path: functions/api/sanity-webhook.ts
      description: Cloudflare Function for Sanity webhooks
    - path: scripts/trigger-product-build.js
      description: Manual build trigger script
    - path: scripts/configure-sanity-webhook.js
      description: Sanity webhook configuration helper

key-decisions:
  - decision: Webhook endpoint at /api/sanity-webhook
    rationale: Standard API path pattern
  - decision: Product detection from payload.product field
    rationale: Product field set in Sanity documents (Phase 36)
  - decision: Shared content triggers both products
    rationale: product='shared' means content applies to all products

exports:
  - detectProductFromPayload
  - routeToProduct
  - validateSanitySignature
  - createProductBuildTrigger

requirements-completed: [DOM-05]
duration: 15 min
completed: 2026-04-01
---

# Phase 39 Plan 02: Sanity Webhook Handler Summary

Cloudflare Function that receives Sanity webhooks and triggers product-scoped rebuilds.

## What Was Built

- **webhook-router.ts**: Product detection and build routing utilities
- **sanity-webhook.ts**: Cloudflare Pages Function at `/api/sanity-webhook`
- **trigger-product-build.js**: Manual build trigger via Cloudflare API
- **configure-sanity-webhook.js**: Sanity webhook configuration instructions

## How It Works

```
Sanity publish → Webhook → sanity-webhook.ts → detectProductFromPayload() → triggerBuild()
```

**Product Detection Logic:**
- `product: 'gcxone'` → rebuild gcxone only
- `product: 'gcsurge'` → rebuild gcsurge only
- `product: 'shared'` → rebuild both products
- missing/undefined → default to gcxone (backwards compatibility)

## Verification

```bash
# Test trigger script
node scripts/trigger-product-build.js --help

# View configuration instructions
node scripts/configure-sanity-webhook.js --instructions
```

## Environment Variables Required

Set in Cloudflare Pages dashboard (both projects):
- `SANITY_WEBHOOK_SECRET` - Secret from Sanity webhook config
- `CLOUDFLARE_API_TOKEN` - Token to trigger deployments

## Next Steps

1. Configure Sanity webhook in Sanity Studio
2. Set environment variables in Cloudflare dashboard
3. Test by publishing a document in Sanity

Ready for 39-03: Verification script and deployment runbook
