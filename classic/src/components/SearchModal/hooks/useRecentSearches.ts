import { useState, useCallback, useEffect, useRef } from 'react';

const STORAGE_KEY = 'nxgen-recent-searches';
const MAX_ITEMS = 8;

export interface UseRecentSearchesReturn {
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  removeRecentSearch: (query: string) => void;
}

function loadFromStorage(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

export default function useRecentSearches(): UseRecentSearchesReturn {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const lastAddedRef = useRef<string | null>(null);

  useEffect(() => {
    setRecentSearches(loadFromStorage());
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    if (lastAddedRef.current === trimmed) return;
    lastAddedRef.current = trimmed;

    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, MAX_ITEMS);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    saveToStorage([]);
    lastAddedRef.current = null;
  }, []);

  const removeRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== trimmed);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  return {
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    removeRecentSearch,
  };
}
