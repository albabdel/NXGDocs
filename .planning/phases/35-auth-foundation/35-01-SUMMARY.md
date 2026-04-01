---
phase: 35-auth-foundation
plan: 01
subsystem: auth
tags: [session, product-access, multi-product, guard]
dependencies:
  requires: []
  provides: [productAccess-field, requireProductAccess-guard, product-config]
  affects: [zoho-session, admin-session, api-functions]
tech_stack:
  added: [TypeScript interfaces, guard pattern]
  patterns: [HMAC session, product entitlement validation]
key_files:
  created:
    - functions/lib/require-product-access.ts
    - classic/src/utils/product-config.ts
  modified:
    - functions/lib/zoho-session.ts
    - functions/lib/admin-session.ts
decisions:
  - Default productAccess to ['gcxone'] for backwards compatibility
  - Admins default to all products ['gcxone', 'gcsurge']
  - Product detection priority: header > URL > env > default
metrics:
  duration: 15m
  completed_date: 2026-04-01
  tasks_completed: 4
  files_modified: 4
---

# Phase 35 Plan 01: Session Product Access Summary

Extended session interfaces with `productAccess` array and created `requireProductAccess` guard utility. This establishes the foundation for multi-product content filtering and access control.

## One-liner

Session interfaces extended with productAccess array; requireProductAccess guard validates product membership before serving protected content.

## Completed Tasks

| task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Extend ZohoSession with productAccess array | a7babed | functions/lib/zoho-session.ts |
| 2 | Extend AdminSession with productAccess array | 8608c9d | functions/lib/admin-session.ts |
| 3 | Create requireProductAccess guard utility | a555bd9 | functions/lib/require-product-access.ts |
| 4 | Create product configuration module | 9eadd0e | classic/src/utils/product-config.ts |

## Key Changes

### 1. ZohoSession Extension

- Added `productAccess: string[]` field to `ZohoSession` interface
- Updated `createSessionCookie` to accept optional `productAccess` parameter
- Default value `['gcxone']` ensures backwards compatibility with existing sessions

### 2. AdminSession Extension

- Added `productAccess: string[]` field to `AdminSession` interface
- Added optional `productAccess` field to `AdminUser` interface
- Admins default to all products `['gcxone', 'gcsurge']` for full access

### 3. requireProductAccess Guard

- Created `functions/lib/require-product-access.ts`
- `getProductFromRequest()`: Extracts product from X-Product header, URL path, or env
- `requireProductAccess()`: Validates session has required product access
- Throws 401 for unauthenticated, 403 for no product access
- Helper functions: `hasProductAccess()`, `getUserProducts()`

### 4. Product Configuration

- Created `classic/src/utils/product-config.ts`
- `PRODUCT_CONFIGS` object with `gcxone` and `gcsurge` entries
- Each config: title, tagline, url, primaryColor
- `getProductConfig()` returns config for current `PRODUCT` env var

## Deviations from Plan

None - plan executed exactly as written.

## Key Decisions

1. **Default productAccess to ['gcxone']** - Ensures existing sessions work without modification
2. **Admins get all products by default** - Full platform access for admin users
3. **Product detection cascade** - X-Product header > URL path > PRODUCT env > 'gcxone' default

## Verification Results

| Check | Result |
| ----- | ------ |
| ZohoSession.productAccess: string[] | PASS |
| AdminSession.productAccess: string[] | PASS |
| requireProductAccess guard exists | PASS |
| productAccess.includes validation | PASS |
| Product config supports both products | PASS |
| getProductConfig export | PASS |

## Next Steps

This plan establishes the foundation. Subsequent plans will:
- Integrate requireProductAccess into API functions
- Add product field to Sanity schemas
- Implement GROQ product filtering
- Configure Auth0 Actions for product_access claim

---

*SUMMARY.md created: 2026-04-01*
