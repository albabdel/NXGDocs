# Algolia Credentials Verification

## Current Status

I found **two different sets of Algolia credentials** in your codebase. Please confirm which ones are correct:

### Set 1: Currently in `docusaurus.config.ts` (Active)
- **App ID**: `V5T3AW2AU9`
- **API Key**: `faaa9ffb8640ba49520a0cf44dc9f7ef`
- **Index Name**: `Documentation site`
- **Location**: `classic/docusaurus.config.ts` (line 204-205)

### Set 2: Found in test scripts
- **App ID**: `0QV3FAFAD5`
- **API Key**: `e152916a3f5684772ff4bc5ca42bde7e` (search-only key)
- **Index Name**: `nxgen_docs`
- **Location**: `classic/scripts/test-search-key.js`, `classic/test-algolia.html`

## What I've Done

✅ **Updated code to use environment variables** (with fallbacks to current values)
- `docusaurus.config.ts` now reads from `process.env.ALGOLIA_APP_ID` and `process.env.ALGOLIA_API_KEY`
- `AlgoliaInsights.tsx` reads from `window.ALGOLIA_APP_ID` and `window.ALGOLIA_API_KEY`
- `api-config.js` now sets these values on the window object

## What You Need to Do

### Option 1: If Set 1 is Correct (Current)
No action needed! The credentials are already in place.

### Option 2: If Set 2 is Correct (From Test Files)
Update these files with the correct credentials:

1. **`classic/docusaurus.config.ts`** (lines 204-206):
```typescript
algolia: {
  appId: process.env.ALGOLIA_APP_ID || '0QV3FAFAD5',
  apiKey: process.env.ALGOLIA_API_KEY || 'e152916a3f5684772ff4bc5ca42bde7e',
  indexName: process.env.ALGOLIA_INDEX_NAME || 'nxgen_docs',
  // ... rest of config
}
```

2. **`classic/static/api-config.js`**:
```javascript
window.ALGOLIA_APP_ID = '0QV3FAFAD5';
window.ALGOLIA_API_KEY = 'e152916a3f5684772ff4bc5ca42bde7e';
```

3. **`classic/src/components/AlgoliaInsights.tsx`** will automatically use the values from `api-config.js`

### Option 3: Use Environment Variables (Recommended)
Create or update `classic/.env`:
```bash
ALGOLIA_APP_ID=your_actual_app_id
ALGOLIA_API_KEY=your_actual_search_api_key
ALGOLIA_INDEX_NAME=your_actual_index_name
```

Then the code will automatically use these values!

## How to Verify

1. Check your Algolia Dashboard: https://www.algolia.com/apps/
2. Look at your Application ID (shown in the dashboard)
3. Check your API Keys section for the search-only API key
4. Verify your index name matches one of the indices in your dashboard

## Files That Need Credentials

- ✅ `classic/docusaurus.config.ts` - Uses `process.env` with fallback
- ✅ `classic/src/components/AlgoliaInsights.tsx` - Uses `window.ALGOLIA_*` with fallback
- ✅ `classic/static/api-config.js` - Sets `window.ALGOLIA_*` values

All files now support environment variables, so you can easily update credentials without changing code!

