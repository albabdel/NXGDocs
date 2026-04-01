// classic/src/hooks/usePageTracking.ts
// Automatic page visit tracking hook
//
// Purpose:
//   - Automatically track current page visits
//   - Debounced updates (30 seconds) to avoid excessive writes
//   - Track time spent on page
//   - Optional scroll progress tracking
//   - Only tracks when authenticated
//
// Usage:
//   usePageTracking({
//     slug: 'quick-start-guide',
//     title: 'Quick Start Guide',
//     url: '/quick-start/guide',
//     type: 'document',
//     trackProgress: true,
//   });
//
// Reference:
//   - classic/src/services/history.ts
//   - classic/src/lib/supabase.ts

import { useEffect, useRef, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSupabase } from '../lib/supabase';
import {
  recordVisit,
  updateProgress,
  HistoryItemType,
} from '../services/history';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UsePageTrackingOptions {
  /** Page slug (unique identifier) */
  slug: string;
  /** Page title for display */
  title: string;
  /** Page URL */
  url: string;
  /** Type of content */
  type?: HistoryItemType;
  /** Track scroll progress (default: false) */
  trackProgress?: boolean;
  /** Debounce interval in ms (default: 30000 = 30 seconds) */
  debounceMs?: number;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for automatic page tracking.
 * Records visit on mount and updates progress periodically.
 */
export function usePageTracking(options: UsePageTrackingOptions): void {
  const {
    slug,
    title,
    url,
    type = 'document',
    trackProgress = false,
    debounceMs = 30000,
  } = options;

  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);

  // Track time spent
  const startTimeRef = useRef<number>(Date.now());
  const lastUpdateRef = useRef<number>(Date.now());
  const totalSpentRef = useRef<number>(0);

  // Track scroll progress
  const scrollProgressRef = useRef<number>(0);

  // Cleanup flag
  const isMountedRef = useRef<boolean>(true);

  // Record initial visit
  const recordInitialVisit = useCallback(async () => {
    if (!isAuthenticated || !slug || !title || !url) return;

    try {
      await recordVisit(supabase, {
        item_type: type,
        item_slug: slug,
        item_title: title,
        item_url: url,
        progress_percent: 0,
        time_spent_seconds: 0,
      });
      console.debug('[usePageTracking] Recorded initial visit:', slug);
    } catch (err) {
      console.error('[usePageTracking] Error recording visit:', err);
    }
  }, [isAuthenticated, supabase, slug, title, url, type]);

  // Update progress (debounced)
  const updateProgressDebounced = useCallback(async () => {
    if (!isAuthenticated || !slug) return;

    const now = Date.now();
    const elapsed = Math.floor((now - lastUpdateRef.current) / 1000);
    totalSpentRef.current += elapsed;
    lastUpdateRef.current = now;

    try {
      const progress = trackProgress ? scrollProgressRef.current : undefined;
      await updateProgress(supabase, slug, progress ?? 0, totalSpentRef.current);
      console.debug('[usePageTracking] Updated progress:', slug, progress, totalSpentRef.current);
    } catch (err) {
      console.error('[usePageTracking] Error updating progress:', err);
    }
  }, [isAuthenticated, supabase, slug, trackProgress]);

  // Track scroll progress
  useEffect(() => {
    if (!trackProgress) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      scrollProgressRef.current = Math.min(100, Math.max(0, progress));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackProgress]);

  // Record visit on mount
  useEffect(() => {
    if (!isAuthenticated) return;

    startTimeRef.current = Date.now();
    lastUpdateRef.current = Date.now();
    totalSpentRef.current = 0;
    isMountedRef.current = true;

    recordInitialVisit();
  }, [isAuthenticated, recordInitialVisit]);

  // Debounced progress updates
  useEffect(() => {
    if (!isAuthenticated) return;

    const intervalId = setInterval(() => {
      if (isMountedRef.current) {
        updateProgressDebounced();
      }
    }, debounceMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, debounceMs, updateProgressDebounced]);

  // Final update on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (isAuthenticated && slug) {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        
        // Send final update (fire and forget)
        updateProgress(supabase, slug, scrollProgressRef.current, elapsed).catch((err) => {
          console.error('[usePageTracking] Error on unmount:', err);
        });
      }
    };
  }, [isAuthenticated, supabase, slug]);

  // This hook doesn't return anything
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default usePageTracking;
