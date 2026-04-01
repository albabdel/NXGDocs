// classic/src/services/history.ts
// Reading history service
//
// Purpose:
//   - Provide API for reading history CRUD operations
//   - Track user's visited pages and progress
//   - Integrate with Supabase client for data persistence
//
// Usage:
//   const { getAccessTokenSilently } = useAuth0();
//   const supabase = createSupabaseClient(() => getAccessTokenSilently());
//   
//   // Get recent history
//   const history = await getHistory(supabase, 10);
//   
//   // Record a page visit
//   await recordVisit(supabase, { slug, title, url, type: 'document' });
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/lib/supabase.ts

import { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type HistoryItemType = 'document' | 'page' | 'video';

export interface HistoryItem {
  id: string;
  user_id: string;
  item_type: HistoryItemType;
  item_slug: string;
  item_title: string;
  item_url: string;
  progress_percent: number;
  time_spent_seconds: number;
  last_accessed_at: string;
  completed_at: string | null;
}

export interface HistoryInput {
  item_type: HistoryItemType;
  item_slug: string;
  item_title: string;
  item_url: string;
  progress_percent?: number;
  time_spent_seconds?: number;
}

export interface UpdateProgressInput {
  progress_percent: number;
  time_spent_seconds: number;
}

// ---------------------------------------------------------------------------
// History Operations
// ---------------------------------------------------------------------------

/**
 * Get the current user's reading history.
 * Ordered by last_accessed_at descending.
 */
export async function getHistory(
  supabase: SupabaseClient,
  limit?: number,
): Promise<HistoryItem[]> {
  let query = supabase
    .from('user_history')
    .select('*')
    .order('last_accessed_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[history] Error fetching history:', error);
    throw error;
  }

  return (data as HistoryItem[]) || [];
}

/**
 * Get recent incomplete items for "Continue Reading" widget.
 * Returns items where progress < 100, ordered by last_accessed_at.
 */
export async function getRecentIncomplete(
  supabase: SupabaseClient,
  limit?: number,
): Promise<HistoryItem[]> {
  let query = supabase
    .from('user_history')
    .select('*')
    .lt('progress_percent', 100)
    .order('last_accessed_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[history] Error fetching incomplete items:', error);
    throw error;
  }

  return (data as HistoryItem[]) || [];
}

/**
 * Get a specific history item by slug.
 */
export async function getHistoryItem(
  supabase: SupabaseClient,
  slug: string,
): Promise<HistoryItem | null> {
  const { data, error } = await supabase
    .from('user_history')
    .select('*')
    .eq('item_slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[history] Error fetching history item:', error);
    throw error;
  }

  return data as HistoryItem | null;
}

/**
 * Record a page visit (insert or update).
 * Uses upsert to handle the unique constraint on (user_id, item_slug).
 */
export async function recordVisit(
  supabase: SupabaseClient,
  input: HistoryInput,
): Promise<HistoryItem> {
  const { data, error } = await supabase
    .from('user_history')
    .upsert(
      {
        item_type: input.item_type,
        item_slug: input.item_slug,
        item_title: input.item_title,
        item_url: input.item_url,
        progress_percent: input.progress_percent ?? 0,
        time_spent_seconds: input.time_spent_seconds ?? 0,
        last_accessed_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,item_slug',
      }
    )
    .select()
    .single();

  if (error) {
    console.error('[history] Error recording visit:', error);
    throw error;
  }

  return data as HistoryItem;
}

/**
 * Update progress for a specific item.
 * Used for scroll tracking and time tracking.
 */
export async function updateProgress(
  supabase: SupabaseClient,
  slug: string,
  progress: number,
  timeSpent: number,
): Promise<void> {
  // Build update object
  const updateData: Record<string, unknown> = {
    progress_percent: Math.min(100, Math.max(0, progress)),
    time_spent_seconds: timeSpent,
    last_accessed_at: new Date().toISOString(),
  };

  // Mark as completed if progress is 100%
  if (progress >= 100) {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('user_history')
    .update(updateData)
    .eq('item_slug', slug);

  if (error) {
    console.error('[history] Error updating progress:', error);
    throw error;
  }
}

/**
 * Delete a specific history item.
 */
export async function deleteHistoryItem(
  supabase: SupabaseClient,
  slug: string,
): Promise<void> {
  const { error } = await supabase
    .from('user_history')
    .delete()
    .eq('item_slug', slug);

  if (error) {
    console.error('[history] Error deleting history item:', error);
    throw error;
  }
}

/**
 * Clear all history for the current user.
 */
export async function clearHistory(
  supabase: SupabaseClient,
): Promise<void> {
  const { error } = await supabase
    .from('user_history')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (error) {
    console.error('[history] Error clearing history:', error);
    throw error;
  }
}

/**
 * Get history statistics for the current user.
 */
export async function getHistoryStats(
  supabase: SupabaseClient,
): Promise<{
  totalItems: number;
  completedItems: number;
  totalTimeSeconds: number;
  itemsByType: Record<HistoryItemType, number>;
}> {
  const { data, error } = await supabase
    .from('user_history')
    .select('item_type, progress_percent, time_spent_seconds');

  if (error) {
    console.error('[history] Error fetching history stats:', error);
    throw error;
  }

  const items = data as Pick<HistoryItem, 'item_type' | 'progress_percent' | 'time_spent_seconds'>[];

  const stats = {
    totalItems: items.length,
    completedItems: items.filter((i) => i.progress_percent >= 100).length,
    totalTimeSeconds: items.reduce((sum, i) => sum + (i.time_spent_seconds || 0), 0),
    itemsByType: {
      document: 0,
      page: 0,
      video: 0,
    } as Record<HistoryItemType, number>,
  };

  for (const item of items) {
    stats.itemsByType[item.item_type] = (stats.itemsByType[item.item_type] || 0) + 1;
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default {
  getHistory,
  getRecentIncomplete,
  getHistoryItem,
  recordVisit,
  updateProgress,
  deleteHistoryItem,
  clearHistory,
  getHistoryStats,
};
