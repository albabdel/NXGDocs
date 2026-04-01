// classic/src/services/bookmarks.ts
// User bookmarks service
//
// Purpose:
//   - Provide API for user bookmarks CRUD operations
//   - Manage bookmarks linked to Auth0 user IDs
//   - Integrate with Supabase client for data persistence
//
// Usage:
//   const { getAccessTokenSilently } = useAuth0();
//   const supabase = createSupabaseClient(() => getAccessTokenSilently());
//   
//   // Get all bookmarks
//   const bookmarks = await getBookmarks(supabase);
//   
//   // Add bookmark
//   await addBookmark(supabase, { item_slug, item_title, item_url, item_type });
//
// Reference:
//   - classic/src/services/user-profile.ts (existing patterns)
//   - .supabase/schema/user-bookmarks.sql

import { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type BookmarkItemType = 'document' | 'page' | 'video' | 'section';

export interface Bookmark {
  id: string;
  user_id: string;
  item_type: BookmarkItemType;
  item_slug: string;
  item_title: string;
  item_url: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface BookmarkInput {
  item_type: BookmarkItemType;
  item_slug: string;
  item_title: string;
  item_url: string;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Bookmarks Operations
// ---------------------------------------------------------------------------

/**
 * Get all bookmarks for the current user.
 * Ordered by created_at descending (most recent first).
 */
export async function getBookmarks(
  supabase: SupabaseClient,
): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[bookmarks] Error fetching bookmarks:', error);
    throw error;
  }

  return (data as Bookmark[]) || [];
}

/**
 * Get bookmarks filtered by item type.
 */
export async function getBookmarksByType(
  supabase: SupabaseClient,
  itemType: BookmarkItemType,
): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .eq('item_type', itemType)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[bookmarks] Error fetching bookmarks by type:', error);
    throw error;
  }

  return (data as Bookmark[]) || [];
}

/**
 * Get a specific bookmark by slug.
 * Returns null if not found.
 */
export async function getBookmarkBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<Bookmark | null> {
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .eq('item_slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[bookmarks] Error fetching bookmark by slug:', error);
    throw error;
  }

  return data as Bookmark | null;
}

/**
 * Check if a page is bookmarked.
 */
export async function isBookmarked(
  supabase: SupabaseClient,
  slug: string,
): Promise<boolean> {
  const bookmark = await getBookmarkBySlug(supabase, slug);
  return bookmark !== null;
}

/**
 * Add a new bookmark.
 * Returns the created bookmark.
 */
export async function addBookmark(
  supabase: SupabaseClient,
  input: BookmarkInput,
): Promise<Bookmark> {
  // Get user ID from JWT (handled by RLS, but we need to pass it)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  // The user_id in JWT is the Auth0 sub claim
  // We need to use the auth.jwt() function in RLS
  // But for INSERT we need to pass the user_id from the JWT
  const userId = user.id;

  const { data, error } = await supabase
    .from('user_bookmarks')
    .insert({
      user_id: userId,
      ...input,
      metadata: input.metadata || {},
    })
    .select()
    .single();

  if (error) {
    // Handle duplicate bookmark error
    if (error.code === '23505') {
      throw new Error('This page is already bookmarked');
    }
    console.error('[bookmarks] Error adding bookmark:', error);
    throw error;
  }

  return data as Bookmark;
}

/**
 * Remove a bookmark by ID.
 */
export async function removeBookmark(
  supabase: SupabaseClient,
  id: string,
): Promise<void> {
  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[bookmarks] Error removing bookmark:', error);
    throw error;
  }
}

/**
 * Remove a bookmark by slug.
 * Convenience function for removing by page identifier.
 */
export async function removeBookmarkBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<void> {
  const { error } = await supabase
    .from('user_bookmarks')
    .delete()
    .eq('item_slug', slug);

  if (error) {
    console.error('[bookmarks] Error removing bookmark by slug:', error);
    throw error;
  }
}

/**
 * Toggle bookmark status for a page.
 * Returns true if bookmark was added, false if removed.
 */
export async function toggleBookmark(
  supabase: SupabaseClient,
  input: BookmarkInput,
): Promise<{ added: boolean; bookmark?: Bookmark }> {
  const existing = await getBookmarkBySlug(supabase, input.item_slug);

  if (existing) {
    await removeBookmark(supabase, existing.id);
    return { added: false };
  } else {
    const bookmark = await addBookmark(supabase, input);
    return { added: true, bookmark };
  }
}

/**
 * Search bookmarks by title.
 */
export async function searchBookmarks(
  supabase: SupabaseClient,
  query: string,
): Promise<Bookmark[]> {
  const { data, error } = await supabase
    .from('user_bookmarks')
    .select('*')
    .ilike('item_title', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[bookmarks] Error searching bookmarks:', error);
    throw error;
  }

  return (data as Bookmark[]) || [];
}

/**
 * Get bookmark count for the current user.
 */
export async function getBookmarkCount(
  supabase: SupabaseClient,
): Promise<number> {
  const { count, error } = await supabase
    .from('user_bookmarks')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('[bookmarks] Error getting bookmark count:', error);
    throw error;
  }

  return count || 0;
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default {
  getBookmarks,
  getBookmarksByType,
  getBookmarkBySlug,
  isBookmarked,
  addBookmark,
  removeBookmark,
  removeBookmarkBySlug,
  toggleBookmark,
  searchBookmarks,
  getBookmarkCount,
};
