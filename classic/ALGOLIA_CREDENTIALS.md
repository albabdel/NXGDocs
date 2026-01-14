# Algolia Credentials

**⚠️ SECURITY NOTE**: This file contains sensitive credentials. Do not commit to public repositories.

## Active Credentials

### Application ID
```
V5T3AW2AU9
```

### API Keys

#### Search API Key (Primary - Used for Search & Insights)
```
faaa9ffb8640ba49520a0cf44dc9f7ef
```
**Usage**: 
- Docusaurus DocSearch configuration
- Search-insights.js initialization
- Event tracking (clicks, conversions, views)

#### Analytics API Key
```
8c4deae169e3f2f586b94c4216cb0b00
```
**Usage**: Advanced analytics features (if needed in future)

#### Usage API Key
```
0e9d6af632c28f4b8c4870da26fd5d0e
```
**Usage**: Usage statistics and monitoring (if needed in future)

#### Monitoring API Key
```
4a5e520c6121b48dbd54ea28c52ac72b
```
**Usage**: System monitoring and health checks (if needed in future)

## Where Credentials Are Used

### 1. `docusaurus.config.ts`
- **Application ID**: `V5T3AW2AU9`
- **Search API Key**: `faaa9ffb8640ba49520a0cf44dc9f7ef`
- **Index Name**: `Documentation site`

### 2. `static/api-config.js`
- Sets `window.ALGOLIA_APP_ID` and `window.ALGOLIA_API_KEY`
- Used by client-side components

### 3. `src/components/AlgoliaInsights.tsx`
- Reads from `window.ALGOLIA_APP_ID` and `window.ALGOLIA_API_KEY`
- Initializes search-insights library

## Environment Variables (Optional)

You can override these values by creating `classic/.env`:

```bash
ALGOLIA_APP_ID=V5T3AW2AU9
ALGOLIA_API_KEY=faaa9ffb8640ba49520a0cf44dc9f7ef
ALGOLIA_INDEX_NAME=Documentation site
```

## Security Best Practices

1. ✅ **Search API Key** is safe to use in client-side code (it's search-only)
2. ⚠️ **Analytics/Usage/Monitoring keys** should NOT be exposed in client-side code
3. 🔒 Keep this file in `.gitignore` if committing to a repository
4. 🔄 Rotate keys periodically for security

## Verification

To verify credentials are working:
1. Check browser console for `[API Config]` messages
2. Test search functionality (Cmd/Ctrl + K)
3. Check Network tab for successful Algolia API calls
4. Verify events are being sent to `insights.algolia.io`

