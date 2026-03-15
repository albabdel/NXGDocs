import { useCallback, useEffect, useRef, useMemo } from 'react';

export type SearchMode = 'keyword' | 'hybrid' | 'vector';

export interface SearchEvent {
  id: string;
  query: string;
  resultCount: number;
  searchMode: SearchMode;
  aiAnswerShown: boolean;
  aiAnswerClicked: boolean;
  timestamp: number;
  sessionId: string;
  userId: string;
}

export interface ClickEvent {
  id: string;
  searchEventId: string;
  resultId: string;
  resultTitle: string;
  resultUrl: string;
  position: number;
  timeToClickMs: number;
  timestamp: number;
  sessionId: string;
  userId: string;
}

export interface SearchStats {
  totalSearches: number;
  uniqueQueries: number;
  zeroResultQueries: number;
  avgResultsPerQuery: number;
  topQueries: Array<{ query: string; count: number }>;
  aiAnswerShownCount: number;
  aiAnswerClickedCount: number;
}

interface BatchedEvents {
  searches: SearchEvent[];
  clicks: ClickEvent[];
}

const STORAGE_KEY_SEARCH = 'nxgen-search-analytics-enhanced';
const STORAGE_KEY_CLICK = 'nxgen-click-analytics-enhanced';
const SESSION_ID_KEY = 'nxgen-session-id';
const USER_ID_KEY = 'nxgen-user-id';
const MAX_STORED_EVENTS = 500;
const BATCH_FLUSH_INTERVAL = 1000;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getSessionId(): string {
  if (!isBrowser()) return '';
  
  try {
    let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return '';
  }
}

function getUserId(): string {
  if (!isBrowser()) return '';
  
  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(USER_ID_KEY, userId);
    }
    return userId;
  } catch {
    return '';
  }
}

function getSupabaseConfig(): { url: string; key: string } | null {
  if (!isBrowser() || typeof import.meta === 'undefined') return null;
  
  try {
    const env = (import.meta as any).env;
    const url = env?.VITE_SUPABASE_URL;
    const key = env?.VITE_SUPABASE_ANON_KEY;
    
    if (url && key) {
      return { url, key };
    }
  } catch {
    // ignore
  }
  return null;
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function getStoredEvents<T>(key: string): T[] {
  if (!isBrowser()) return [];
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [];
}

function saveEvents<T>(key: string, events: T[]): void {
  if (!isBrowser()) return;
  
  try {
    const trimmed = events.slice(-MAX_STORED_EVENTS);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

async function flushToSupabase(
  config: { url: string; key: string },
  events: BatchedEvents
): Promise<boolean> {
  if (events.searches.length === 0 && events.clicks.length === 0) {
    return true;
  }
  
  try {
    const promises: Promise<Response>[] = [];
    
    if (events.searches.length > 0) {
      promises.push(
        fetch(`${config.url}/rest/v1/search_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(events.searches),
        })
      );
    }
    
    if (events.clicks.length > 0) {
      promises.push(
        fetch(`${config.url}/rest/v1/click_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(events.clicks),
        })
      );
    }
    
    const results = await Promise.all(promises);
    return results.every(r => r.ok);
  } catch {
    return false;
  }
}

export function useSearchAnalyticsEnhanced() {
  const batchRef = useRef<BatchedEvents>({ searches: [], clicks: [] });
  const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const searchTimestampRef = useRef<number>(0);
  const currentSearchIdRef = useRef<string>('');
  
  const supabaseConfig = useMemo(() => getSupabaseConfig(), []);
  const sessionId = useMemo(() => getSessionId(), []);
  const userId = useMemo(() => getUserId(), []);
  
  const flushBatch = useCallback(async () => {
    if (batchRef.current.searches.length === 0 && batchRef.current.clicks.length === 0) {
      return;
    }
    
    const eventsToSend = { ...batchRef.current };
    batchRef.current = { searches: [], clicks: [] };
    
    if (supabaseConfig) {
      const success = await flushToSupabase(supabaseConfig, eventsToSend);
      if (success) return;
    }
    
    const storedSearches = getStoredEvents<SearchEvent>(STORAGE_KEY_SEARCH);
    const storedClicks = getStoredEvents<ClickEvent>(STORAGE_KEY_CLICK);
    
    saveEvents(STORAGE_KEY_SEARCH, [...storedSearches, ...eventsToSend.searches]);
    saveEvents(STORAGE_KEY_CLICK, [...storedClicks, ...eventsToSend.clicks]);
  }, [supabaseConfig]);
  
  useEffect(() => {
    flushTimerRef.current = setInterval(flushBatch, BATCH_FLUSH_INTERVAL);
    
    return () => {
      if (flushTimerRef.current) {
        clearInterval(flushTimerRef.current);
      }
      flushBatch();
    };
  }, [flushBatch]);
  
  const trackSearch = useCallback((
    query: string,
    resultCount: number,
    searchMode: SearchMode = 'keyword',
    aiAnswerShown: boolean = false
  ): string => {
    if (!isBrowser() || !query.trim()) return '';
    
    const searchId = generateId();
    currentSearchIdRef.current = searchId;
    searchTimestampRef.current = Date.now();
    
    const event: SearchEvent = {
      id: searchId,
      query: query.trim().toLowerCase(),
      resultCount,
      searchMode,
      aiAnswerShown,
      aiAnswerClicked: false,
      timestamp: Date.now(),
      sessionId,
      userId,
    };
    
    batchRef.current.searches.push(event);
    
    return searchId;
  }, [sessionId, userId]);
  
  const trackClick = useCallback((
    searchEventId: string,
    resultId: string,
    resultTitle: string,
    resultUrl: string,
    position: number
  ): void => {
    if (!isBrowser() || !searchEventId) return;
    
    const timeToClickMs = searchTimestampRef.current > 0
      ? Date.now() - searchTimestampRef.current
      : 0;
    
    const event: ClickEvent = {
      id: generateId(),
      searchEventId,
      resultId,
      resultTitle,
      resultUrl,
      position,
      timeToClickMs,
      timestamp: Date.now(),
      sessionId,
      userId,
    };
    
    batchRef.current.clicks.push(event);
  }, [sessionId, userId]);
  
  const trackAIAnswer = useCallback((
    searchEventId: string,
    clicked: boolean = false
  ): void => {
    if (!isBrowser() || !searchEventId) return;
    
    const searchIndex = batchRef.current.searches.findIndex(
      s => s.id === searchEventId
    );
    
    if (searchIndex >= 0) {
      if (clicked) {
        batchRef.current.searches[searchIndex].aiAnswerClicked = true;
      }
      batchRef.current.searches[searchIndex].aiAnswerShown = true;
    } else {
      const storedSearches = getStoredEvents<SearchEvent>(STORAGE_KEY_SEARCH);
      const storedIndex = storedSearches.findIndex(s => s.id === searchEventId);
      
      if (storedIndex >= 0) {
        storedSearches[storedIndex].aiAnswerShown = true;
        if (clicked) {
          storedSearches[storedIndex].aiAnswerClicked = true;
        }
        saveEvents(STORAGE_KEY_SEARCH, storedSearches);
      }
    }
  }, []);
  
  const getTopQueries = useCallback((limit: number = 10): Array<{ query: string; count: number }> => {
    const searches = getStoredEvents<SearchEvent>(STORAGE_KEY_SEARCH);
    const queryCounts = new Map<string, number>();
    
    for (const event of searches) {
      queryCounts.set(event.query, (queryCounts.get(event.query) || 0) + 1);
    }
    
    return Array.from(queryCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, []);
  
  const getZeroResultQueries = useCallback((): string[] => {
    const searches = getStoredEvents<SearchEvent>(STORAGE_KEY_SEARCH);
    const zeroResultSet = new Set<string>();
    
    for (const event of searches) {
      if (event.resultCount === 0) {
        zeroResultSet.add(event.query);
      }
    }
    
    return Array.from(zeroResultSet);
  }, []);
  
  const getStats = useCallback((): SearchStats => {
    const searches = getStoredEvents<SearchEvent>(STORAGE_KEY_SEARCH);
    
    if (searches.length === 0) {
      return {
        totalSearches: 0,
        uniqueQueries: 0,
        zeroResultQueries: 0,
        avgResultsPerQuery: 0,
        topQueries: [],
        aiAnswerShownCount: 0,
        aiAnswerClickedCount: 0,
      };
    }
    
    const uniqueQueries = new Set(searches.map(s => s.query)).size;
    const zeroResultQueries = searches.filter(s => s.resultCount === 0).length;
    const totalResults = searches.reduce((sum, s) => sum + s.resultCount, 0);
    const aiAnswerShownCount = searches.filter(s => s.aiAnswerShown).length;
    const aiAnswerClickedCount = searches.filter(s => s.aiAnswerClicked).length;
    
    const queryCounts = new Map<string, number>();
    for (const event of searches) {
      queryCounts.set(event.query, (queryCounts.get(event.query) || 0) + 1);
    }
    
    const topQueries = Array.from(queryCounts.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalSearches: searches.length,
      uniqueQueries,
      zeroResultQueries,
      avgResultsPerQuery: totalResults / searches.length,
      topQueries,
      aiAnswerShownCount,
      aiAnswerClickedCount,
    };
  }, []);
  
  const getCurrentSearchId = useCallback((): string => {
    return currentSearchIdRef.current;
  }, []);
  
  return {
    trackSearch,
    trackClick,
    trackAIAnswer,
    getTopQueries,
    getZeroResultQueries,
    getStats,
    getCurrentSearchId,
    isSupabaseConfigured: Boolean(supabaseConfig),
    sessionId,
    userId,
  };
}

export default useSearchAnalyticsEnhanced;
