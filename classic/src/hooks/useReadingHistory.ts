// classic/src/hooks/useReadingHistory.ts
// Reading history state management hook
//
// Purpose:
//   - Manage reading history state
//   - Load recent history for widgets
//   - Provide functions to clear and refresh history
//
// Usage:
//   const { history, loading, clearHistory, refetch } = useReadingHistory(10);
//
// Reference:
//   - classic/src/services/history.ts
//   - classic/src/lib/supabase.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthSession } from './useAuthSession';
import { useSupabase } from '../lib/supabase';
import {
  HistoryItem,
  getHistory,
  clearHistory as clearHistoryService,
} from '../services/history';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseReadingHistoryReturn {
  history: HistoryItem[];
  loading: boolean;
  error: Error | null;
  clearHistory: () => Promise<void>;
  refetch: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for managing reading history.
 * Loads history on mount when authenticated.
 */
export function useReadingHistory(limit?: number): UseReadingHistoryReturn {
  const { getAccessTokenSilently } = useAuth0();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthSession();
  const supabase = useSupabase(getAccessTokenSilently);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch history
  const fetchHistory = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getHistory(supabase, user.userId, limit);
      setHistory(data);
    } catch (err) {
      console.error('[useReadingHistory] Error fetching history:', err);
      setError(err instanceof Error ? err : new Error('Failed to load history'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId, supabase, limit]);

  // Fetch on mount and when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchHistory();
    }
  }, [authLoading, fetchHistory]);

  // Clear history
  const clearHistory = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) return;

    setLoading(true);
    try {
      await clearHistoryService(supabase, user.userId);
      setHistory([]);
    } catch (err) {
      console.error('[useReadingHistory] Error clearing history:', err);
      setError(err instanceof Error ? err : new Error('Failed to clear history'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId, supabase]);

  // Refetch history
  const refetch = useCallback(async () => {
    await fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading: authLoading || loading,
    error,
    clearHistory,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useReadingHistory;
