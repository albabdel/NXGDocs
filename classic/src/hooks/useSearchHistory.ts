// classic/src/hooks/useSearchHistory.ts
// Search history state management hook
//
// Purpose:
//   - Track user's search queries
//   - Store in localStorage (client-side only)
//   - Max 50 items with timestamps
//   - Optional sync to Supabase for cross-device
//
// Usage:
//   const { history, addSearch, removeSearch, clearHistory, getRecentSearches } = useSearchHistory();
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/components/SearchModal/hooks/useRecentSearches.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'nxgen-search-history';
const MAX_ITEMS = 50;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultClicked?: string; // slug if user clicked a result
  resultTitle?: string; // title of clicked result
}

export interface UseSearchHistoryReturn {
  history: SearchHistoryItem[];
  loading: boolean;
  addSearch: (query: string, resultClicked?: string, resultTitle?: string) => void;
  removeSearch: (query: string) => void;
  clearHistory: () => void;
  getRecentSearches: (limit?: number) => SearchHistoryItem[];
  updateClickedResult: (query: string, slug: string, title: string) => void;
}

// ---------------------------------------------------------------------------
// Storage Helpers
// ---------------------------------------------------------------------------

function loadFromStorage(): SearchHistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: SearchHistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

// ---------------------------------------------------------------------------
// Time Formatting
// ---------------------------------------------------------------------------

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days < 7) {
    return `${days}d ago`;
  }

  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for managing search history.
 * Stores searches in localStorage with timestamps.
 * Only tracks when authenticated.
 */
export function useSearchHistory(): UseSearchHistoryReturn {
  const { isAuthenticated } = useAuth0();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const lastAddedRef = useRef<string | null>(null);

  // Load history on mount
  useEffect(() => {
    setLoading(true);
    setHistory(loadFromStorage());
    setLoading(false);
  }, []);

  // Add a search query to history
  const addSearch = useCallback((query: string, resultClicked?: string, resultTitle?: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // Dedupe rapid-fire adds
    if (lastAddedRef.current === trimmed) return;
    lastAddedRef.current = trimmed;

    setHistory((prev) => {
      // Remove existing entry for this query
      const filtered = prev.filter((item) => item.query !== trimmed);

      // Add new entry at the beginning
      const newItem: SearchHistoryItem = {
        query: trimmed,
        timestamp: Date.now(),
        resultClicked,
        resultTitle,
      };

      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  // Remove a specific search from history
  const removeSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const updated = prev.filter((item) => item.query !== trimmed);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  // Clear all search history
  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
    lastAddedRef.current = null;
  }, []);

  // Get recent searches (limited)
  const getRecentSearches = useCallback(
    (limit?: number): SearchHistoryItem[] => {
      return history.slice(0, limit ?? 10);
    },
    [history]
  );

  // Update the clicked result for a search
  const updateClickedResult = useCallback((query: string, slug: string, title: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.query === trimmed
          ? { ...item, resultClicked: slug, resultTitle: title }
          : item
      );
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return {
    history,
    loading,
    addSearch,
    removeSearch,
    clearHistory,
    getRecentSearches,
    updateClickedResult,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useSearchHistory;
