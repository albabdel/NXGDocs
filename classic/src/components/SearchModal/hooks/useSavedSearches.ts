import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'nxgen-saved-searches';
const MAX_SAVED_SEARCHES = 20;

interface SavedSearch {
  query: string;
  createdAt: number;
  label?: string;
}

function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedSearches(JSON.parse(stored));
      }
    } catch {
      setSavedSearches([]);
    }
  }, []);

  const persist = useCallback((searches: SavedSearch[]) => {
    setSavedSearches(searches);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
      } catch {
        // Storage full or unavailable
      }
    }
  }, []);

  const saveSearch = useCallback(
    (query: string, label?: string) => {
      if (!query.trim()) return;

      setSavedSearches((prev) => {
        const filtered = prev.filter(
          (s) => s.query.toLowerCase() !== query.toLowerCase()
        );
        const newSearch: SavedSearch = {
          query: query.trim(),
          createdAt: Date.now(),
          ...(label && { label }),
        };
        const updated = [newSearch, ...filtered].slice(0, MAX_SAVED_SEARCHES);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const removeSavedSearch = useCallback(
    (query: string) => {
      setSavedSearches((prev) => {
        const updated = prev.filter(
          (s) => s.query.toLowerCase() !== query.toLowerCase()
        );
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const isSaved = useCallback(
    (query: string) => {
      return savedSearches.some(
        (s) => s.query.toLowerCase() === query.toLowerCase()
      );
    },
    [savedSearches]
  );

  return {
    savedSearches,
    saveSearch,
    removeSavedSearch,
    isSaved,
  };
}

export default useSavedSearches;
export type { SavedSearch };
