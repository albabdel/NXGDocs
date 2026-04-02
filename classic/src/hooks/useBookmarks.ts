// classic/src/hooks/useBookmarks.ts
// User bookmarks state management hook
//
// Purpose:
//   - Manage user bookmarks state
//   - Provide bookmark toggle functionality
//   - Optimistic updates for immediate UI feedback
//   - Auto-load bookmarks on mount
//
// Usage:
//   const { bookmarks, isBookmarked, toggleBookmark, loading } = useBookmarks();
//
// Reference:
//   - classic/src/hooks/useAuthSession.ts
//   - classic/src/services/bookmarks.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthSession } from './useAuthSession';
import { useSupabase } from '../lib/supabase';
import {
  Bookmark,
  BookmarkInput,
  getBookmarks as fetchBookmarks,
  toggleBookmark as toggleBookmarkService,
  removeBookmark as removeBookmarkService,
} from '../services/bookmarks';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  loading: boolean;
  error: Error | null;
  isBookmarked: (slug: string) => boolean;
  toggleBookmark: (item: BookmarkInput) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for managing user bookmarks.
 * Auto-loads bookmarks on mount and provides toggle functionality.
 * 
 * Uses useAuthSession to get user ID, then bookmarks service for operations.
 */
export function useBookmarks(): UseBookmarksReturn {
  const { getAccessTokenSilently } = useAuth0();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthSession();
  const supabase = useSupabase(getAccessTokenSilently);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create a map for quick lookup
  const bookmarkMap = new Map<string, Bookmark>();
  bookmarks.forEach((b) => bookmarkMap.set(b.item_slug, b));

  // Fetch bookmarks
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchBookmarks(supabase, user.userId);
      setBookmarks(data);
    } catch (err) {
      console.error('[useBookmarks] Error fetching bookmarks:', err);
      setError(err instanceof Error ? err : new Error('Failed to load bookmarks'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId, supabase]);

  // Fetch on mount and when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  // Check if a slug is bookmarked (local check for performance)
  const isBookmarked = useCallback(
    (slug: string): boolean => {
      return bookmarkMap.has(slug);
    },
    [bookmarkMap]
  );

  // Toggle bookmark
  const toggleBookmark = useCallback(
    async (item: BookmarkInput) => {
      if (!user?.userId) return;

      setError(null);

      try {
        const result = await toggleBookmarkService(supabase, user.userId, item);

        if (result.added && result.bookmark) {
          // Add to local state
          setBookmarks((prev) => [result.bookmark!, ...prev]);
        } else {
          // Remove from local state
          setBookmarks((prev) => prev.filter((b) => b.item_slug !== item.item_slug));
        }
      } catch (err) {
        console.error('[useBookmarks] Error toggling bookmark:', err);
        setError(err instanceof Error ? err : new Error('Failed to toggle bookmark'));
        throw err;
      }
    },
    [supabase, user?.userId]
  );

  // Remove bookmark by ID
  const removeBookmark = useCallback(
    async (id: string) => {
      if (!user?.userId) return;

      const bookmark = bookmarks.find((b) => b.id === id);
      if (!bookmark) return;

      // Optimistic remove
      setBookmarks((prev) => prev.filter((b) => b.id !== id));

      try {
        await removeBookmarkService(supabase, user.userId, id);
      } catch (err) {
        // Revert on error
        setBookmarks((prev) => [...prev, bookmark].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
        console.error('[useBookmarks] Error removing bookmark:', err);
        setError(err instanceof Error ? err : new Error('Failed to remove bookmark'));
        throw err;
      }
    },
    [bookmarks, supabase, user?.userId]
  );

  // Refetch bookmarks from server
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    bookmarks,
    loading: authLoading || loading,
    error,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useBookmarks;
