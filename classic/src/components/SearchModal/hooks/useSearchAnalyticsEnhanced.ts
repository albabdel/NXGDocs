import { useState, useEffect, useMemo, useCallback } from 'react';

export interface SearchAnalyticsEntry {
  query: string;
  timestamp: number;
  resultCount: number;
  clickedResults?: string[];
  avgTimeToClick?: number;
}

export interface StoredAnalytics {
  queries: SearchAnalyticsEntry[];
  totalClicks: number;
  lastUpdated: number;
}

export interface QueryStats {
  query: string;
  searches: number;
  zeroResults: number;
  ctr: number;
  avgPosition: number;
}

export interface ZeroResultQuery {
  query: string;
  occurrences: number;
  lastSeen: number;
}

export interface DailyStats {
  date: string;
  searches: number;
  uniqueQueries: number;
  zeroResults: number;
  clicks: number;
}

export interface AnalyticsSummary {
  totalSearches: number;
  uniqueQueries: number;
  zeroResultRate: number;
  avgCtr: number;
  searchesChange: number;
  uniqueQueriesChange: number;
  zeroResultRateChange: number;
  avgCtrChange: number;
}

const STORAGE_KEY = 'nxgen-search-analytics-enhanced';
const MAX_QUERIES = 500;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getStoredAnalytics(): StoredAnalytics {
  if (!isBrowser()) {
    return { queries: [], totalClicks: 0, lastUpdated: Date.now() };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore parse errors
  }
  return { queries: [], totalClicks: 0, lastUpdated: Date.now() };
}

function saveAnalytics(data: StoredAnalytics): void {
  if (!isBrowser()) return;
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

function getDateRange(days: number): { start: number; end: number } {
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  return { start, end };
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
}

function useSearchAnalyticsEnhanced() {
  const [dateRange, setDateRange] = useState<number>(7);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<StoredAnalytics>({ queries: [], totalClicks: 0, lastUpdated: Date.now() });

  useEffect(() => {
    if (isBrowser()) {
      setAnalytics(getStoredAnalytics());
      setIsLoading(false);
    }
  }, []);

  const filteredQueries = useMemo(() => {
    const { start, end } = getDateRange(dateRange);
    return analytics.queries.filter(q => q.timestamp >= start && q.timestamp <= end);
  }, [analytics.queries, dateRange]);

  const previousPeriodQueries = useMemo(() => {
    const { start: currentStart } = getDateRange(dateRange);
    const { start: prevStart, end: prevEnd } = getDateRange(dateRange);
    return analytics.queries.filter(q => q.timestamp >= prevStart && q.timestamp < currentStart);
  }, [analytics.queries, dateRange]);

  const dailyStats = useMemo((): DailyStats[] => {
    const stats = new Map<string, DailyStats>();
    
    filteredQueries.forEach(entry => {
      const date = new Date(entry.timestamp).toISOString().split('T')[0];
      const existing = stats.get(date) || { date, searches: 0, uniqueQueries: 0, zeroResults: 0, clicks: 0 };
      existing.searches++;
      if (entry.resultCount === 0) existing.zeroResults++;
      stats.set(date, existing);
    });

    stats.forEach((stat, date) => {
      const dayQueries = filteredQueries.filter(q => new Date(q.timestamp).toISOString().split('T')[0] === date);
      stat.uniqueQueries = new Set(dayQueries.map(q => q.query)).size;
    });

    return Array.from(stats.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredQueries]);

  const topQueries = useMemo((): QueryStats[] => {
    const queryMap = new Map<string, { count: number; zeroCount: number; clicks: number }>();
    
    filteredQueries.forEach(entry => {
      const existing = queryMap.get(entry.query) || { count: 0, zeroCount: 0, clicks: 0 };
      existing.count++;
      if (entry.resultCount === 0) existing.zeroCount++;
      if (entry.clickedResults && entry.clickedResults.length > 0) existing.clicks++;
      queryMap.set(entry.query, existing);
    });

    return Array.from(queryMap.entries())
      .map(([query, stats]) => ({
        query,
        searches: stats.count,
        zeroResults: stats.zeroCount,
        ctr: stats.count > 0 ? ((stats.count - stats.zeroCount) / stats.count) * 100 : 0,
        avgPosition: 0,
      }))
      .sort((a, b) => b.searches - a.searches)
      .slice(0, 20);
  }, [filteredQueries]);

  const zeroResultQueries = useMemo((): ZeroResultQuery[] => {
    const queryMap = new Map<string, { count: number; lastSeen: number }>();
    
    filteredQueries.filter(q => q.resultCount === 0).forEach(entry => {
      const existing = queryMap.get(entry.query);
      if (existing) {
        existing.count++;
        existing.lastSeen = Math.max(existing.lastSeen, entry.timestamp);
      } else {
        queryMap.set(entry.query, { count: 1, lastSeen: entry.timestamp });
      }
    });

    return Array.from(queryMap.entries())
      .map(([query, stats]) => ({
        query,
        occurrences: stats.count,
        lastSeen: stats.lastSeen,
      }))
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 20);
  }, [filteredQueries]);

  const summary = useMemo((): AnalyticsSummary => {
    const totalSearches = filteredQueries.length;
    const uniqueQueries = new Set(filteredQueries.map(q => q.query)).size;
    const zeroResults = filteredQueries.filter(q => q.resultCount === 0).length;
    const zeroResultRate = totalSearches > 0 ? (zeroResults / totalSearches) * 100 : 0;
    
    const prevTotalSearches = previousPeriodQueries.length;
    const prevUniqueQueries = new Set(previousPeriodQueries.map(q => q.query)).size;
    const prevZeroResults = previousPeriodQueries.filter(q => q.resultCount === 0).length;
    const prevZeroResultRate = prevTotalSearches > 0 ? (prevZeroResults / prevTotalSearches) * 100 : 0;

    const calculateChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    return {
      totalSearches,
      uniqueQueries,
      zeroResultRate,
      avgCtr: 100 - zeroResultRate,
      searchesChange: calculateChange(totalSearches, prevTotalSearches),
      uniqueQueriesChange: calculateChange(uniqueQueries, prevUniqueQueries),
      zeroResultRateChange: calculateChange(zeroResultRate, prevZeroResultRate),
      avgCtrChange: calculateChange(100 - zeroResultRate, 100 - prevZeroResultRate),
    };
  }, [filteredQueries, previousPeriodQueries]);

  const trackSearch = useCallback((query: string, resultCount: number, clickedResults?: string[], avgTimeToClick?: number): void => {
    if (!isBrowser() || !query.trim()) return;

    const data = getStoredAnalytics();
    const entry: SearchAnalyticsEntry = {
      query: query.trim().toLowerCase(),
      timestamp: Date.now(),
      resultCount,
      clickedResults,
      avgTimeToClick,
    };

    data.queries.push(entry);

    if (data.queries.length > MAX_QUERIES) {
      data.queries = data.queries.slice(-MAX_QUERIES);
    }

    saveAnalytics(data);
    setAnalytics({ ...data });
  }, []);

  const clearAnalytics = useCallback((): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setAnalytics({ queries: [], totalClicks: 0, lastUpdated: Date.now() });
    } catch {
      // ignore storage errors
    }
  }, []);

  return {
    summary,
    dailyStats,
    topQueries,
    zeroResultQueries,
    dateRange,
    setDateRange,
    isLoading,
    trackSearch,
    clearAnalytics,
    formatDuration,
  };
}

export default useSearchAnalyticsEnhanced;
