# New Product Checklist

Step-by-step guide for adding a new product to the multi-product documentation system.

## Prerequisites

- [ ] Product name decided (lowercase, alphanumeric, no spaces)
- [ ] Subdomain available (`{product}.pages.dev`)
- [ ] Branding assets ready (logo, favicon, colors)
- [ ] Cloudflare API token with Pages permissions

**Estimated total time:** 2-4 hours

---

## Phase 1: Sanity Configuration (30 min)

### 1.1 Update Schema Product Enum

Add product to enum in all relevant schemas:

```typescript
// studio/schemaTypes/doc.ts
// studio/schemaTypes/article.ts
// studio/schemaTypes/release.ts
// etc.

defineField({
  name: 'product',
  type: 'string',
  options: {
    list: [
      { title: 'GCXONE', value: 'gcxone' },
      { title: 'GC Surge', value: 'gcsurge' },
      { title: 'New Product', value: 'newproduct' }, // Add this
    ],
  },
}),
```

- [ ] Updated product enum in all schema files
- [ ] Schema validation passes

### 1.2 Deploy Sanity Studio

```bash
cd studio
npm run deploy
```

- [ ] Studio deployed successfully
- [ ] New product option visible in Studio

### 1.3 Create Initial Content

- [ ] Create sidebar category for new product
- [ ] Create landing page document
- [ ] Create at least one test document

---

## Phase 2: Product Configuration (20 min)

### 2.1 Update product.config.ts

Add configuration in `classic/product.config.ts`:

```typescript
newproduct: {
  id: 'newproduct',
  title: 'New Product Documentation',
  tagline: 'Documentation for New Product',
  url: 'https://newproduct.pages.dev',
  baseUrl: '/',
  favicon: 'img/favicon-newproduct.png',
  logo: {
    src: 'img/newproduct-logo.png',
    alt: 'New Product Logo',
    href: '/',
  },
  theme: {
    primaryColor: '#YourColor',
    primaryColorDark: '#YourColorDark',
  },
  socialCard: 'img/newproduct-social-card.jpg',
  metadata: {
    keywords: ['New Product', 'keywords', 'here'],
    description: 'Documentation for New Product',
  },
},
```

- [ ] Added product configuration
- [ ] TypeScript compiles without errors

### 2.2 Add Branding Assets

- [ ] Logo added to `classic/static/img/newproduct-logo.png`
- [ ] Favicon added to `classic/static/img/favicon-newproduct.png`
- [ ] Social card added to `classic/static/img/newproduct-social-card.jpg`

### 2.3 Update Build Pipeline

Edit `classic/scripts/build-multi-product.js`:

```javascript
const PRODUCTS = ['gcxone', 'gcsurge', 'newproduct'];
```

- [ ] Products array updated

### 2.4 Update Webhook Router

Edit `functions/lib/webhook-router.ts`:

```typescript
const PRODUCT_PROJECT_MAP: Record<string, string> = {
  gcxone: 'gcxone',
  gcsurge: 'gcsurge',
  newproduct: 'newproduct',
};
```

- [ ] Product mapping updated

---

## Phase 3: Cloudflare Setup (30 min)

### 3.1 Create Pages Project

```bash
$env:CLOUDFLARE_API_TOKEN='cfat_3U8hBMWTxsZzs2JynzDAWgfNgx1Io9on5r78wlMv1e218039'
npx wrangler pages project create newproduct --production-branch main
```

- [ ] Project created: `newproduct`
- [ ] Subdomain available: `newproduct.pages.dev`

### 3.2 Set Environment Variables

In Cloudflare dashboard → Pages → newproduct → Settings → Environment variables:

**Production environment:**

| Variable | Value |
|----------|-------|
| PRODUCT | newproduct |
| SANITY_PROJECT_ID | fjjuacab |
| SANITY_DATASET | production |
| SANITY_API_TOKEN | (from secrets) |
| SANITY_WEBHOOK_SECRET | (from Sanity webhook) |
| CLOUDFLARE_API_TOKEN | (for webhook function) |

- [ ] All environment variables set

### 3.3 Connect Git Repository (Optional)

If using Git integration:

- [ ] Repository connected in Cloudflare dashboard
- [ ] Build command: `npm run build:newproduct`
- [ ] Build output: `classic/build/newproduct`
- [ ] Root directory: `/`

---

## Phase 4: Verification (20 min)

### 4.1 Build Test

```bash
# Build the new product
npm run build:newproduct

# Or build all
npm run build:multi
```

- [ ] Build completes without errors
- [ ] Output exists in `classic/build/newproduct/`

### 4.2 Deploy Test

```bash
npx wrangler pages deploy classic/build/newproduct --project-name=newproduct
```

- [ ] Deployment succeeds
- [ ] Site accessible at `newproduct.pages.dev`

### 4.3 Content Verification

```bash
node scripts/verify-deployment.js --product newproduct
```

- [ ] Verification passes
- [ ] Correct title shown
- [ ] No content leakage from other products

### 4.4 Webhook Test

1. Create test document in Sanity with `product: 'newproduct'`
2. Verify build triggers in Cloudflare dashboard

- [ ] Webhook triggers correct build
- [ ] New content appears after rebuild

---

## Phase 5: Documentation (15 min)

### 5.1 Update Runbook

- [ ] Add new product to `docs/deployment-runbook.md`
- [ ] Update environment variables table

### 5.2 Update Scripts

- [ ] Add to `scripts/verify-deployment.js` PRODUCTS object
- [ ] Add to `scripts/deploy-multi-product.js` if needed
- [ ] Add to `scripts/create-cloudflare-projects.js` PROJECTS array

### 5.3 Notify Team

- [ ] Announce new product documentation available
- [ ] Share URL: `https://newproduct.pages.dev`
- [ ] Provide editor access to Sanity Studio

---

## Post-Deployment

### Custom Domain (Later)

When ready to use custom domain:

1. Add domain in Cloudflare Pages → Custom domains
2. Configure DNS CNAME record
3. Wait for SSL certificate provisioning

- [ ] Custom domain configured (optional, later)

### Analytics Setup (Phase 40)

- [ ] PostHog project created for new product
- [ ] Analytics dashboard configured

---

## Quick Reference Commands

```bash
# Build
npm run build:newproduct

# Deploy
npx wrangler pages deploy classic/build/newproduct --project-name=newproduct

# Verify
node scripts/verify-deployment.js --product newproduct

# Trigger build
node scripts/trigger-product-build.js --product newproduct
```

---

*Template last updated: 2026-04-01*
