# Multi-Product Deployment Runbook

This runbook documents the multi-product deployment architecture and operational procedures.

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│    Sanity CMS   │────▶│  Cloudflare      │────▶│ Pages Project   │
│  (content)      │     │  Webhook Handler │     │ (gcxone/gcsurge)│
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                        ┌───────┴───────┐
                        ▼               ▼
                ┌─────────────┐ ┌─────────────┐
                │  gcxone     │ │  gcsurge    │
                │ .pages.dev  │ │ .pages.dev  │
                └─────────────┘ └─────────────┘
```

**Key Components:**
- **Cloudflare Pages Projects:** `gcxone`, `gcsurge`
- **Subdomains:** `gcxone.pages.dev`, `gcsurge.pages.dev`
- **Webhook Endpoint:** `/api/sanity-webhook`
- **Build Pipeline:** `npm run build:multi`

## Deployment Flow

```
Sanity publish → Webhook → Product detection → Trigger Cloudflare build
```

1. Editor publishes document in Sanity Studio
2. Sanity sends webhook to `/api/sanity-webhook`
3. Function detects `product` field from payload
4. Triggers build for affected project(s):
   - `product: 'gcxone'` → gcxone.pages.dev
   - `product: 'gcsurge'` → gcsurge.pages.dev
   - `product: 'shared'` → both projects

## Manual Deployment Procedures

### Deploy Single Product

```bash
# Build specific product
npm run build:gcxone
# or
npm run build:gcsurge

# Deploy to Cloudflare
npx wrangler pages deploy classic/build/gcxone --project-name=gcxone
npx wrangler pages deploy classic/build/gcsurge --project-name=gcsurge
```

### Deploy All Products

```bash
# Build all products
npm run build:multi

# Deploy all using script
node scripts/deploy-multi-product.js
```

### Trigger Build via API

```bash
# Set API token
$env:CLOUDFLARE_API_TOKEN='cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039'

# Trigger single product
node scripts/trigger-product-build.js --product gcxone

# Trigger all products
node scripts/trigger-product-build.js --all
```

## Adding a New Product

### Step 1: Sanity Configuration

Add product to enum in schemas:

```typescript
// studio/schemaTypes/*.ts
options: {
  list: [
    { title: 'GCXONE', value: 'gcxone' },
    { title: 'GC Surge', value: 'gcsurge' },
    { title: 'New Product', value: 'newproduct' }, // Add here
  ]
}
```

Deploy Sanity Studio:
```bash
cd studio && npm run deploy
```

### Step 2: Product Configuration

Add to `classic/product.config.ts`:

```typescript
newproduct: {
  id: 'newproduct',
  title: 'New Product Documentation',
  tagline: 'Documentation for New Product',
  url: 'https://newproduct.pages.dev', // Will be custom domain later
  theme: {
    primaryColor: '#hexcolor',
    primaryColorDark: '#hexcolor',
  },
  // ... other config
}
```

### Step 3: Cloudflare Setup

Create Pages project:
```bash
$env:CLOUDFLARE_API_TOKEN='your-token'
npx wrangler pages project create newproduct --production-branch main
```

Set environment variables in Cloudflare dashboard:
- `PRODUCT=newproduct`
- `SANITY_PROJECT_ID=fjjuacab`
- `SANITY_DATASET=production`
- `SANITY_API_TOKEN=<from secrets>`
- `SANITY_WEBHOOK_SECRET=<from Sanity webhook>`

### Step 4: Build Pipeline

Add to `classic/scripts/build-multi-product.js`:
```javascript
const PRODUCTS = ['gcxone', 'gcsurge', 'newproduct'];
```

Add to `functions/lib/webhook-router.ts`:
```typescript
const PRODUCT_PROJECT_MAP: Record<string, string> = {
  gcxone: 'gcxone',
  gcsurge: 'gcsurge',
  newproduct: 'newproduct',
};
```

### Step 5: Verify

```bash
node scripts/verify-deployment.js --product newproduct
```

## Troubleshooting

### Build Fails

**Symptoms:** Deployment fails in Cloudflare Pages

**Checks:**
1. Check Cloudflare Pages logs: Dashboard → project → Deployments
2. Verify `SANITY_API_TOKEN` is valid and has read permissions
3. Verify `PRODUCT` env var is set correctly
4. Check build output directory matches: `classic/build/{product}`

**Resolution:**
```bash
# Rebuild locally to see errors
PRODUCT=gcxone npm run build

# Check Sanity connectivity
node -e "console.log(process.env.SANITY_PROJECT_ID)"
```

### Wrong Content on Domain

**Symptoms:** GCXONE domain shows GC Surge content

**Checks:**
1. Verify `PRODUCT` env var in Cloudflare project settings
2. Check GROQ filter in `fetch-sanity-content.js`
3. Run verification script

**Resolution:**
```bash
# Check PRODUCT env var
npx wrangler pages project list

# Verify deployment
node scripts/verify-deployment.js
```

### Webhook Not Triggering

**Symptoms:** Publishing in Sanity doesn't trigger build

**Checks:**
1. Verify webhook exists in Sanity: https://www.sanity.io/manage/project/fjjuacab/api
2. Check `SANITY_WEBHOOK_SECRET` matches in both Sanity and Cloudflare
3. Verify webhook URL: `https://gcxone.pages.dev/api/sanity-webhook`
4. Check Cloudflare Function logs

**Test webhook locally:**
```bash
curl -X POST https://gcxone.pages.dev/api/sanity-webhook \
  -H "Content-Type: application/json" \
  -H "X-Sanity-Signature: test" \
  -d '{"_id":"test","_type":"doc","product":"gcxone"}'
```

### Environment Variables Reference

| Variable | gcxone | gcsurge |
|----------|--------|---------|
| PRODUCT | gcxone | gcsurge |
| SANITY_PROJECT_ID | fjjuacab | fjjuacab |
| SANITY_DATASET | production | production |
| SANITY_API_TOKEN | (secret) | (secret) |
| SANITY_WEBHOOK_SECRET | (shared) | (shared) |
| CLOUDFLARE_API_TOKEN | (for webhook) | (for webhook) |

## Rollback Procedure

```bash
# List recent deployments
npx wrangler pages deployment list --project-name=gcxone

# View deployment details
npx wrangler pages deployment view <deployment-id> --project-name=gcxone

# Rollback via dashboard:
# https://dash.cloudflare.com/{account}/pages/view/gcxone/deployments
# Click "..." on previous deployment → "Rollback to this deployment"
```

## Useful Commands

```bash
# List projects
npx wrangler pages project list

# View project info
npx wrangler pages project view gcxone

# Deploy manually
npx wrangler pages deploy classic/build/gcxone --project-name=gcxone

# Tail logs
npx wrangler pages deployment tail --project-name=gcxone

# Verify deployment
node scripts/verify-deployment.js
```

## Dashboard Links

- Cloudflare Pages: https://dash.cloudflare.com/ff9df0a2daf8c9eb1032f67dd551c784/pages
- Sanity Studio: https://www.sanity.io/manage/project/fjjuacab
- GitLab Repo: (configured in Cloudflare Pages)

---
*Last updated: 2026-04-01*
