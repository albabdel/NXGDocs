# PostHog Analytics Dashboards

## Overview

This document describes the PostHog analytics setup for the multi-product documentation platform. Each product (GCXONE, GC Surge) has its own dashboard with product-specific metrics.

## PostHog Project

- **Project ID:** 365239
- **Dashboard URL:** https://us.posthog.com/project/365239
- **Host:** https://us.i.posthog.com

## Event Structure

All events include the following properties:

| Property | Description | Example |
|----------|-------------|---------|
| `product` | Product identifier | `gcxone`, `gcsurge` |
| `$group_product` | PostHog group property | `gcxone` |

### Events Tracked

| Event | Properties | Triggered When |
|-------|------------|----------------|
| `doc_view` | `doc_id`, `doc_title`, `doc_path`, `category`, `product` | User views a documentation page |
| `search_query` | `query`, `result_count`, `search_mode`, `product` | User performs a search |
| `search_result_click` | `query`, `result_id`, `result_title`, `result_url`, `position`, `product` | User clicks a search result |
| `$pageview` | `product` | User views any page |

## Dashboard Setup

### 1. Create Per-Product Dashboard

For each product (GCXONE, GC Surge):

1. Go to **Dashboards** → **New dashboard**
2. Name: `{Product Name} Analytics` (e.g., "GCXONE Analytics")
3. Add the following insights:

### 2. Required Insights

#### Page Views Trend
- **Type:** Line chart
- **Event:** `$pageview`
- **Filter:** `product = {product_id}`
- **Aggregation:** Count per day
- **Time range:** Last 30 days

#### Top Viewed Documents
- **Type:** Table
- **Event:** `doc_view`
- **Filter:** `product = {product_id}`
- **Breakdown:** `doc_title`
- **Aggregation:** Count
- **Limit:** Top 20

#### Search Queries
- **Type:** Table
- **Event:** `search_query`
- **Filter:** `product = {product_id}`
- **Breakdown:** `query`
- **Aggregation:** Count
- **Limit:** Top 20

#### Zero-Result Searches
- **Type:** Table
- **Event:** `search_query`
- **Filter:** `product = {product_id}` AND `result_count = 0`
- **Breakdown:** `query`
- **Aggregation:** Count

#### Search Click-Through Rate
- **Type:** Funnel
- **Steps:**
  1. `search_query` (filter: `product = {product_id}`)
  2. `search_result_click` (filter: `product = {product_id}`)
- **Time range:** Last 7 days

#### Average Search Results
- **Type:** Number
- **Event:** `search_query`
- **Filter:** `product = {product_id}`
- **Aggregation:** Average of `result_count`

### 3. Create Product Group

In PostHog, create a Group type for products:

1. Go to **Settings** → **Groups**
2. Create group type: `product`
3. Group keys: `gcxone`, `gcsurge`

This enables group-level analytics and dashboards.

## Adding a New Product

To add analytics for a new product (fulfills MPROD-05):

### Step 1: Update Product Configuration

Edit `classic/src/utils/productConfig.ts`:

```typescript
export const PRODUCTS: Record<string, ProductConfig> = {
  gcxone: { /* existing */ },
  gcsurge: { /* existing */ },
  newproduct: {
    id: 'newproduct',
    name: 'New Product',
    groupKey: 'newproduct',
    tagline: 'New Product Documentation',
    domain: 'docs.newproduct.com',
  },
};
```

### Step 2: Set Environment Variable

For the new product's Cloudflare Pages project:

```
PRODUCT=newproduct
```

### Step 3: Create Dashboard in PostHog

1. Duplicate an existing product dashboard
2. Rename to "New Product Analytics"
3. Update all filters to `product = newproduct`
4. Save

**Time estimate:** 30 minutes - 1 hour (no code changes required)

## Metrics Glossary

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Daily Active Users | Unique users visiting docs per day | Count distinct `$device_id` |
| Page Views | Total page loads | Count `$pageview` events |
| Doc Views | Documentation page views | Count `doc_view` events |
| Search Volume | Number of searches performed | Count `search_query` events |
| Zero-Result Rate | Searches with no results | `search_query` where `result_count = 0` / total searches |
| Search CTR | Click-through from search results | `search_result_click` / `search_query` |
| Avg Search Position | Average position of clicked results | Mean of `position` in `search_result_click` |

## Troubleshooting

### Events not appearing

1. Check network tab for POST requests to `us.i.posthog.com`
2. Verify `POSTHOG_TOKEN` matches project token
3. Check browser console for PostHog errors

### Product property missing

1. Verify `PRODUCT` environment variable is set
2. Check `productConfig.ts` has the product registered
3. Verify `group()` call is executing (check useEffect in Root.tsx)

### Search events not tracked

1. Verify `useTrackSearch` is being called in SearchModal
2. Check search modal is loading properly
3. Verify PostHog provider is wrapping the app
