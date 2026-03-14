import { useCallback, useMemo } from 'react';

interface SearchAnalyticsEntry {
  query: string;
  timestamp: number;
  resultCount: number;
}

interface StoredAnalytics {
  queries: SearchAnalyticsEntry[];
}

interface QueryCount {
  query: string;
  count: number;
}

const STORAGE_KEY = 'nxgen-search-analytics';
const MAX_QUERIES = 100;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getStoredAnalytics(): StoredAnalytics {
  if (!isBrowser()) {
    return { queries: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return { queries: [] };
}

function saveAnalytics(data: StoredAnalytics): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

function useSearchAnalytics() {
  const trackSearch = useCallback((query: string, resultCount: number): void => {
    if (!isBrowser() || !query.trim()) return;

    const analytics = getStoredAnalytics();
    const entry: SearchAnalyticsEntry = {
      query: query.trim().toLowerCase(),
      timestamp: Date.now(),
      resultCount,
    };

    analytics.queries.push(entry);

    if (analytics.queries.length > MAX_QUERIES) {
      analytics.queries = analytics.queries.slice(-MAX_QUERIES);
    }

    saveAnalytics(analytics);
  }, []);

  const getTopQueries = useCallback((limit: number = 10): QueryCount[] => {
    const analytics = getStoredAnalytics();
    const queryCounts = new Map<string, number>();

    for (const entry of analytics.queries) {
      queryCounts.set(entry.query, (queryCounts.get(entry.query) || 0) + 1);
    }

    return Array.from(queryCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, []);

  const getZeroResultQueries = useCallback((): string[] => {
    const analytics = getStoredAnalytics();
    const zeroResultSet = new Set<string>();

    for (const entry of analytics.queries) {
      if (entry.resultCount === 0) {
        zeroResultSet.add(entry.query);
      }
    }

    return Array.from(zeroResultSet);
  }, []);

  const clearAnalytics = useCallback((): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const insights = useMemo(() => ({
    totalQueries: getStoredAnalytics().queries.length,
    uniqueQueries: new Set(getStoredAnalytics().queries.map(e => e.query)).size,
    zeroResultCount: getStoredAnalytics().queries.filter(e => e.resultCount === 0).length,
  }), []);

  return {
    trackSearch,
    getTopQueries,
    getZeroResultQueries,
    clearAnalytics,
    insights,
  };
}

export default useSearchAnalytics;
