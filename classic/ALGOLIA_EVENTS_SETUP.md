# Algolia Events Collection Setup

This document explains how Algolia event collection has been enabled in the NXGEN documentation site.

## What's Enabled

✅ **Click Analytics**: Enabled via `clickAnalytics: true` in search parameters  
✅ **Search Insights**: Enabled via `insights: true` in Algolia config  
✅ **search-insights.js**: Installed and initialized  
✅ **Event Tracking Utilities**: Available in `src/utils/algoliaEvents.ts`

## How It Works

### Automatic Event Tracking

With `insights: true` enabled in `docusaurus.config.ts`, Docusaurus automatically tracks:
- Search queries
- Search result clicks (when using DocSearch)
- Basic user interactions

### Manual Event Tracking

For custom event tracking, use the utilities in `src/utils/algoliaEvents.ts`:

```typescript
import {
  trackSearchClick,
  trackClick,
  trackSearchConversion,
  trackConversion,
  trackView,
} from '@site/src/utils/algoliaEvents';
```

## Event Types

### 1. Click Events

**After Search:**
```typescript
trackSearchClick({
  index: 'Documentation site',
  queryID: 'query-id-from-search-response',
  objectID: 'document-object-id',
  position: 1, // Position in search results (1-indexed)
  eventName: 'Documentation Clicked',
});
```

**Without Search Context:**
```typescript
trackClick({
  index: 'Documentation site',
  objectID: 'document-object-id',
  eventName: 'Homepage Clicked',
});
```

### 2. Conversion Events

**After Search:**
```typescript
trackSearchConversion({
  index: 'Documentation site',
  queryID: 'query-id-from-search-response',
  objectID: 'document-object-id',
  eventName: 'Article Read',
});
```

**Without Search Context:**
```typescript
trackConversion({
  index: 'Documentation site',
  objectID: 'document-object-id',
  eventName: 'Article Bookmarked',
});
```

### 3. View Events

```typescript
trackView({
  index: 'Documentation site',
  objectID: 'document-object-id',
  eventName: 'Article Viewed',
});
```

## Tracking Query IDs Across Pages

To track conversions that happen on different pages than the search:

1. **Save queryID from search response:**
```typescript
// On search results page
const searchResponse = await performSearch('query');
const queryID = searchResponse.queryID;

// Store in sessionStorage or pass via URL
sessionStorage.setItem('lastSearchQueryID', queryID);
```

2. **Retrieve queryID on conversion page:**
```typescript
// On article/conversion page
const queryID = sessionStorage.getItem('lastSearchQueryID');

if (queryID) {
  trackSearchConversion({
    index: 'Documentation site',
    queryID: queryID,
    objectID: articleId,
    eventName: 'Article Read',
  });
}
```

## Personalization

### Setting Authenticated User Token

For signed-in users, set the authenticated user token:

```typescript
import { setAuthenticatedUserToken } from '@site/src/utils/algoliaEvents';

// After user signs in
setAuthenticatedUserToken('user-id-from-auth-system');
```

### Using User Token in Search Requests

When making custom search requests, include the user token:

```typescript
import { getEffectiveUserToken } from '@site/src/utils/algoliaEvents';

const userToken = getEffectiveUserToken();

// Include in search request
const response = await index.search('query', {
  clickAnalytics: true,
  userToken: userToken,
});
```

## Common Use Cases

### Track Article Read (Scroll to Bottom)

```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight - 100) {
      const queryID = sessionStorage.getItem('lastSearchQueryID');
      
      if (queryID) {
        trackSearchConversion({
          index: 'Documentation site',
          queryID: queryID,
          objectID: articleId,
          eventName: 'Article Read',
        });
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [articleId]);
```

### Track Bookmark/Share Actions

```typescript
const handleBookmark = () => {
  const queryID = sessionStorage.getItem('lastSearchQueryID');
  
  if (queryID) {
    trackSearchConversion({
      index: 'Documentation site',
      queryID: queryID,
      objectID: docId,
      eventName: 'Documentation Bookmarked',
    });
  } else {
    trackConversion({
      index: 'Documentation site',
      objectID: docId,
      eventName: 'Documentation Bookmarked',
    });
  }
};
```

## Configuration

The Algolia Insights client is initialized in `src/components/AlgoliaInsights.tsx` with:

- **App ID**: `V5T3AW2AU9`
- **API Key**: `faaa9ffb8640ba49520a0cf44dc9f7ef`
- **Cookie Tracking**: Enabled (with user consent)
- **Partial Initialization**: Enabled for better performance

## Benefits

Event collection enables:

- ✅ **Click-through rate (CTR) analytics** - See which results users click
- ✅ **Conversion tracking** - Measure valuable user actions
- ✅ **NeuralSearch** - Improve search relevance with ML
- ✅ **Dynamic Re-Ranking** - AI-powered result ordering
- ✅ **Query Categorization** - Understand search intent
- ✅ **Personalization** - Deliver personalized content
- ✅ **Recommend** - Show relevant recommendations

## Privacy & Consent

The implementation uses cookie-based tracking. Ensure you:
- Inform users about data collection
- Obtain consent where required (GDPR, CCPA, etc.)
- Provide opt-out mechanisms if needed

To disable cookie tracking, modify `src/components/AlgoliaInsights.tsx`:

```typescript
aa('init', {
  appId: 'V5T3AW2AU9',
  apiKey: 'faaa9ffb8640ba49520a0cf44dc9f7ef',
  useCookie: false, // Disable cookies
  partial: true,
});
```

## Testing

To verify events are being sent:

1. Open browser DevTools → Network tab
2. Filter by "insights.algolia.io"
3. Perform searches and clicks
4. Check for POST requests to insights API

## Resources

- [Algolia Search Insights Documentation](https://www.algolia.com/doc/guides/sending-events/what-is-insights/)
- [Event Types Reference](https://www.algolia.com/doc/guides/sending-events/concepts/event-types/)
- [Personalization Guide](https://www.algolia.com/doc/guides/personalization/what-is-personalization/)

