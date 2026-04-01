# Plan 40-01: Product Context Integration

## Summary

Installed PostHog JavaScript SDK and integrated product context into all analytics events. All events are now automatically tagged with the current product identifier via the `group()` call, enabling per-product analytics dashboards.

## What Was Built

### Files Created
- `classic/src/utils/productConfig.ts` — Product configuration registry with `PRODUCTS` object and `getProductConfig()` function

### Files Modified
- `classic/package.json` — Added `posthog-js@1.364.5` and `@posthog/react@1.8.3`
- `classic/src/theme/Root.tsx` — Added `PostHogProvider` with `AnalyticsWrapper` component that calls `posthog.group('product', ...)` on mount

## Key Implementation Details

1. **Product Configuration Registry**
   - `PRODUCTS` object defines all products (gcxone, gcsurge)
   - Each product has: `id`, `name`, `groupKey`, `tagline`, `domain`
   - `getProductConfig()` reads `PRODUCT` env variable and returns current config
   - Falls back to `gcxone` for backwards compatibility

2. **PostHog Integration**
   - `PostHogProvider` wraps app with token `phc_tkcgBrQb37g5F7aiSTcuKWoUaSitBNd6JdcULN6xqrwS`
   - Host: `https://us.i.posthog.com`
   - `AnalyticsWrapper` component calls `posthog.group('product', productConfig.groupKey, {...})` on mount
   - All subsequent events inherit the product group context

3. **Event Structure**
   - `$pageview` events include `product` property
   - All events include `$group_product` from group() call

## Verification

- [x] PostHog packages installed (npm ls confirmed)
- [x] productConfig.ts exports PRODUCTS and getProductConfig
- [x] Root.tsx contains posthog.group('product', ...) call
- [x] Build succeeds

## Requirements Satisfied

- ANLT-01: All PostHog events include product context property
- MPROD-05: New products can be added by extending PRODUCTS registry (no code changes needed)

## Commit

`a6f2adb` — feat(analytics): install PostHog SDK and add product context tracking
