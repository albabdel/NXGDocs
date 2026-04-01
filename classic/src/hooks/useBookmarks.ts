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
//   - classic/src/hooks/useUserProfile.ts (existing patterns)
//   - classic/src/services/bookmarks.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSupabase } from '../lib/supabase';
import {
  Bookmark,
  BookmarkInput,
  BookmarkItemType,
  getBookmarks as fetchBookmarks,
  addBookmark as addBookmarkService,
  removeBookmark as removeBookmarkService,
  removeBookmarkBySlug,
  getBookmarkBySlug,
  getBookmarkCount,
} from '../services/bookmarks';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  loading: boolean;
  error: Error | null;
  isBookmarked: (slug: string) => boolean;
  getBookmark: (slug: string) => Bookmark | undefined;
  toggleBookmark: (item: BookmarkInput) => Promise<void>;
  addBookmark: (item: BookmarkInput) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  removeBySlug: (slug: string) => Promise<void>;
  refetch: () => Promise<void>;
  count: number;
  getByType: (type: BookmarkItemType) => Bookmark[];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for managing user bookmarks.
 * Auto-loads bookmarks on mount and provides toggle functionality.
 */
export function useBookmarks(): UseBookmarksReturn {
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create a map for quick lookup
  const bookmarkMap = new Map<string, Bookmark>();
  bookmarks.forEach((b) => bookmarkMap.set(b.item_slug, b));

  // Fetch bookmarks
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchBookmarks(supabase);
      setBookmarks(data);
    } catch (err) {
      console.error('[useBookmarks] Error fetching bookmarks:', err);
      setError(err instanceof Error ? err : new Error('Failed to load bookmarks'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, supabase]);

  // Fetch on mount and when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  // Check if a slug is bookmarked
  const isBookmarked = useCallback(
    (slug: string): boolean => {
      return bookmarkMap.has(slug);
    },
    [bookmarkMap]
  );

  // Get bookmark by slug
  const getBookmark = useCallback(
    (slug: string): Bookmark | undefined => {
      return bookmarkMap.get(slug);
    },
    [bookmarkMap]
  );

  // Toggle bookmark with optimistic update
  const toggleBookmark = useCallback(
    async (item: BookmarkInput) => {
      const existing = bookmarkMap.get(item.item_slug);

      if (existing) {
        // Optimistic remove
        setBookmarks((prev) => prev.filter((b) => b.item_slug !== item.item_slug));

        try {
          await removeBookmarkService(supabase, existing.id);
        } catch (err) {
          // Revert on error
          setBookmarks((prev) => [...prev, existing].sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ));
          console.error('[useBookmarks] Error removing bookmark:', err);
          throw err;
        }
      } else {
        // Optimistic add
        const tempBookmark: Bookmark = {
          id: 'temp-' + Date.now(),
          user_id: '',
          item_type: item.item_type,
          item_slug: item.item_slug,
          item_title: item.item_title,
          item_url: item.item_url,
          metadata: item.metadata || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setBookmarks((prev) => [tempBookmark, ...prev]);

        try {
          const newBookmark = await addBookmarkService(supabase, item);
          // Replace temp bookmark with real one
          setBookmarks((prev) =>
            prev.map((b) => (b.id === tempBookmark.id ? newBookmark : b))
          );
        } catch (err) {
          // Revert on error
          setBookmarks((prev) => prev.filter((b) => b.id !== tempBookmark.id));
          console.error('[useBookmarks] Error adding bookmark:', err);
          throw err;
        }
      }
    },
    [bookmarkMap, supabase]
  );

  // Add bookmark
  const addBookmark = useCallback(
    async (item: BookmarkInput) => {
      // Check if already bookmarked
      if (bookmarkMap.has(item.item_slug)) {
        return;
      }

      // Optimistic add
      const tempBookmark: Bookmark = {
        id: 'temp-' + Date.now(),
        user_id: '',
        item_type: item.item_type,
        item_slug: item.item_slug,
        item_title: item.item_title,
        item_url: item.item_url,
        metadata: item.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setBookmarks((prev) => [tempBookmark, ...prev]);

      try {
        const newBookmark = await addBookmarkService(supabase, item);
        setBookmarks((prev) =>
          prev.map((b) => (b.id === tempBookmark.id ? newBookmark : b))
        );
      } catch (err) {
        setBookmarks((prev) => prev.filter((b) => b.id !== tempBookmark.id));
        console.error('[useBookmarks] Error adding bookmark:', err);
        throw err;
      }
    },
    [bookmarkMap, supabase]
  );

  // Remove bookmark by ID
  const removeBookmark = useCallback(
    async (id: string) => {
      const bookmark = bookmarks.find((b) => b.id === id);
      if (!bookmark) return;

      // Optimistic remove
      setBookmarks((prev) => prev.filter((b) => b.id !== id));

      try {
        await removeBookmarkService(supabase, id);
      } catch (err) {
        // Revert on error
        setBookmarks((prev) => [...prev, bookmark].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
        console.error('[useBookmarks] Error removing bookmark:', err);
        throw err;
      }
    },
    [bookmarks, supabase]
  );

  // Remove bookmark by slug
  const removeBySlug = useCallback(
    async (slug: string) => {
      const bookmark = bookmarkMap.get(slug);
      if (!bookmark) return;

      await removeBookmark(bookmark.id);
    },
    [bookmarkMap, removeBookmark]
  );

  // Refetch bookmarks
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Get count
  const count = bookmarks.length;

  // Get bookmarks by type
  const getByType = useCallback(
    (type: BookmarkItemType): Bookmark[] => {
      return bookmarks.filter((b) => b.item_type === type);
    },
    [bookmarks]
  );

  return {
    bookmarks,
    loading: authLoading || loading,
    error,
    isBookmarked,
    getBookmark,
    toggleBookmark,
    addBookmark,
    removeBookmark,
    removeBySlug,
    refetch,
    count,
    getByType,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useBookmarks;
