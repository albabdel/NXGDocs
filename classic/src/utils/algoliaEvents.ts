/**
 * Algolia Event Tracking Utilities
 * 
 * Helper functions for tracking user interactions with Algolia search results.
 * These events enable:
 * - Click-through rate (CTR) analytics
 * - Conversion tracking
 * - Personalization
 * - NeuralSearch improvements
 * - Dynamic Re-Ranking
 */

declare global {
  interface Window {
    aa?: (action: string, ...args: any[]) => void;
  }
}

/**
 * Track a click event when a user clicks on a search result
 * 
 * @param params - Click event parameters
 * @param params.index - The Algolia index name
 * @param params.queryID - The query ID from the search response (required for search-based clicks)
 * @param params.objectID - The object ID of the clicked item
 * @param params.position - The position of the item in search results (1-indexed)
 * @param params.eventName - Optional custom event name (default: "Item Clicked")
 */
export function trackSearchClick(params: {
  index: string;
  queryID: string;
  objectID: string;
  position: number;
  eventName?: string;
}) {
  if (typeof window === 'undefined' || !window.aa) {
    console.warn('Algolia Insights not initialized');
    return;
  }

  window.aa('clickedObjectIDsAfterSearch', {
    index: params.index,
    eventName: params.eventName || 'Item Clicked',
    queryID: params.queryID,
    objectIDs: [params.objectID],
    positions: [params.position],
  });
}

/**
 * Track a click event when a user clicks on an item without a search context
 * (e.g., from homepage, recommendations, or direct navigation)
 * 
 * @param params - Click event parameters
 * @param params.index - The Algolia index name
 * @param params.objectID - The object ID of the clicked item
 * @param params.eventName - Optional custom event name (default: "Item Clicked")
 */
export function trackClick(params: {
  index: string;
  objectID: string;
  eventName?: string;
}) {
  if (typeof window === 'undefined' || !window.aa) {
    console.warn('Algolia Insights not initialized');
    return;
  }

  window.aa('clickedObjectIDs', {
    index: params.index,
    eventName: params.eventName || 'Item Clicked',
    objectIDs: [params.objectID],
  });
}

/**
 * Track a conversion event when a user performs a valuable action
 * after viewing a search result
 * 
 * @param params - Conversion event parameters
 * @param params.index - The Algolia index name
 * @param params.queryID - The query ID from the original search (required for search-based conversions)
 * @param params.objectID - The object ID of the converted item
 * @param params.eventName - Custom event name describing the conversion (e.g., "Article Read", "Documentation Viewed")
 */
export function trackSearchConversion(params: {
  index: string;
  queryID: string;
  objectID: string;
  eventName: string;
}) {
  if (typeof window === 'undefined' || !window.aa) {
    console.warn('Algolia Insights not initialized');
    return;
  }

  window.aa('convertedObjectIDsAfterSearch', {
    index: params.index,
    eventName: params.eventName,
    queryID: params.queryID,
    objectIDs: [params.objectID],
  });
}

/**
 * Track a conversion event when a user performs a valuable action
 * without a search context
 * 
 * @param params - Conversion event parameters
 * @param params.index - The Algolia index name
 * @param params.objectID - The object ID of the converted item
 * @param params.eventName - Custom event name describing the conversion
 */
export function trackConversion(params: {
  index: string;
  objectID: string;
  eventName: string;
}) {
  if (typeof window === 'undefined' || !window.aa) {
    console.warn('Algolia Insights not initialized');
    return;
  }

  window.aa('convertedObjectIDs', {
    index: params.index,
    eventName: params.eventName,
    objectIDs: [params.objectID],
  });
}

/**
 * Track a view event when a user views an item
 * Useful for personalization and understanding user interests
 * 
 * @param params - View event parameters
 * @param params.index - The Algolia index name
 * @param params.objectID - The object ID of the viewed item
 * @param params.eventName - Optional custom event name (default: "Item Viewed")
 */
export function trackView(params: {
  index: string;
  objectID: string;
  eventName?: string;
}) {
  if (typeof window === 'undefined' || !window.aa) {
    console.warn('Algolia Insights not initialized');
    return;
  }

  window.aa('viewedObjectIDs', {
    index: params.index,
    eventName: params.eventName || 'Item Viewed',
    objectIDs: [params.objectID],
  });
}

/**
 * Set authenticated user token for personalization
 * Call this after a user signs in to link events across sessions
 * 
 * @param userToken - A unique, pseudonymous identifier from your authentication system
 */
export function setAuthenticatedUserToken(userToken: string) {
  if (typeof window === 'undefined' || !window.aa) {
    console.warn('Algolia Insights not initialized');
    return;
  }

  window.aa('setAuthenticatedUserToken', userToken);
}

/**
 * Get the current user token (anonymous or authenticated)
 * Use this when making search requests to link them with events
 * 
 * @returns The current user token, or null if not available
 */
export function getUserToken(): string | null {
  if (typeof window === 'undefined' || !window.aa) {
    return null;
  }

  try {
    return window.aa('getUserToken') as string | null;
  } catch {
    return null;
  }
}

/**
 * Get the authenticated user token if set
 * 
 * @returns The authenticated user token, or null if not set
 */
export function getAuthenticatedUserToken(): string | null {
  if (typeof window === 'undefined' || !window.aa) {
    return null;
  }

  try {
    return window.aa('getAuthenticatedUserToken') as string | null;
  } catch {
    return null;
  }
}

/**
 * Get the effective user token (authenticated if available, otherwise anonymous)
 * Use this when making search requests
 * 
 * @returns The effective user token, or null if not available
 */
export function getEffectiveUserToken(): string | null {
  const authenticated = getAuthenticatedUserToken();
  if (authenticated) {
    return authenticated;
  }
  return getUserToken();
}

