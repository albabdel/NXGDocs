/**
 * Query ID Tracker
 * 
 * Utility for tracking Algolia query IDs across page navigation.
 * This allows linking conversion events to the original search query
 * even when the conversion happens on a different page.
 */

const QUERY_ID_STORAGE_KEY = 'algolia_last_query_id';
const QUERY_ID_TIMESTAMP_KEY = 'algolia_query_timestamp';
const QUERY_ID_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Save a query ID from a search response
 * Stores it in sessionStorage with a timestamp
 * 
 * @param queryID - The query ID from Algolia search response
 */
export function saveQueryID(queryID: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(QUERY_ID_STORAGE_KEY, queryID);
    sessionStorage.setItem(QUERY_ID_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Failed to save query ID:', error);
  }
}

/**
 * Get the last saved query ID if it's still valid
 * Query IDs expire after 30 minutes
 * 
 * @returns The query ID if valid, or null if expired/missing
 */
export function getQueryID(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const queryID = sessionStorage.getItem(QUERY_ID_STORAGE_KEY);
    const timestamp = sessionStorage.getItem(QUERY_ID_TIMESTAMP_KEY);

    if (!queryID || !timestamp) {
      return null;
    }

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > QUERY_ID_EXPIRY_MS) {
      // Query ID expired, clean up
      clearQueryID();
      return null;
    }

    return queryID;
  } catch (error) {
    console.warn('Failed to get query ID:', error);
    return null;
  }
}

/**
 * Clear the saved query ID
 */
export function clearQueryID(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(QUERY_ID_STORAGE_KEY);
    sessionStorage.removeItem(QUERY_ID_TIMESTAMP_KEY);
  } catch (error) {
    console.warn('Failed to clear query ID:', error);
  }
}

/**
 * Check if a valid query ID exists
 * 
 * @returns true if a valid query ID is stored
 */
export function hasQueryID(): boolean {
  return getQueryID() !== null;
}

/**
 * Save query ID from URL parameters
 * Useful when passing query ID via URL (e.g., ?queryID=xxx)
 * 
 * @param searchParams - URLSearchParams or query string
 */
export function saveQueryIDFromURL(searchParams: URLSearchParams | string): void {
  const params = typeof searchParams === 'string' 
    ? new URLSearchParams(searchParams)
    : searchParams;
  
  const queryID = params.get('queryID');
  if (queryID) {
    saveQueryID(queryID);
  }
}

