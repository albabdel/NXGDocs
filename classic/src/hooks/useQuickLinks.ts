// classic/src/hooks/useQuickLinks.ts
// Quick links state management hook
//
// Purpose:
//   - Manage quick links state for the current user
//   - Provide CRUD operations for quick links
//   - Persist links to user_preferences.quick_links
//
// Usage:
//   const { quickLinks, loading, addLink, removeLink, reorderLinks } = useQuickLinks();
//
// Reference:
//   - classic/src/services/user-profile.ts
//   - classic/src/hooks/useUserProfile.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSupabase } from '../lib/supabase';
import {
  getUserPreferences,
  updateUserPreferences,
} from '../services/user-profile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuickLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  addedAt: string;
}

export interface UseQuickLinksReturn {
  quickLinks: QuickLink[];
  loading: boolean;
  error: Error | null;
  addLink: (link: Omit<QuickLink, 'id' | 'addedAt'>) => Promise<void>;
  updateLink: (id: string, updates: Partial<Omit<QuickLink, 'id' | 'addedAt'>>) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  reorderLinks: (links: QuickLink[]) => Promise<void>;
  refetch: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_QUICK_LINKS = 10;

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Generate a unique ID for a quick link
 */
function generateId(): string {
  return `ql_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse quick_links from preferences (handle different storage formats)
 */
function parseQuickLinks(raw: unknown): QuickLink[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw as QuickLink[];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useQuickLinks - Manage user's quick links
 *
 * Provides state management and CRUD operations for quick links.
 * Links are stored in user_preferences.quick_links in Supabase.
 *
 * @example
 * const { quickLinks, addLink, removeLink } = useQuickLinks();
 *
 * // Add a new link
 * await addLink({ title: 'Alarm Management', url: '/alarm-management' });
 *
 * // Remove a link
 * await removeLink('ql_123');
 */
export function useQuickLinks(): UseQuickLinksReturn {
  const { isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch quick links
  const fetchLinks = useCallback(async () => {
    if (!isAuthenticated) {
      setQuickLinks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const preferences = await getUserPreferences(supabase);
      const links = parseQuickLinks(preferences?.quick_links);
      setQuickLinks(links);
    } catch (err) {
      console.error('[useQuickLinks] Error fetching links:', err);
      setError(err instanceof Error ? err : new Error('Failed to load quick links'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, supabase]);

  // Fetch on mount and when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchLinks();
    }
  }, [authLoading, fetchLinks]);

  // Save links to preferences
  const saveLinks = useCallback(
    async (links: QuickLink[]): Promise<void> => {
      await updateUserPreferences(supabase, {
        quick_links: links,
      } as unknown as Record<string, unknown>);
    },
    [supabase]
  );

  // Add a new link
  const addLink = useCallback(
    async (link: Omit<QuickLink, 'id' | 'addedAt'>): Promise<void> => {
      if (quickLinks.length >= MAX_QUICK_LINKS) {
        throw new Error(`Maximum ${MAX_QUICK_LINKS} quick links allowed`);
      }

      const newLink: QuickLink = {
        ...link,
        id: generateId(),
        addedAt: new Date().toISOString(),
      };

      const updatedLinks = [...quickLinks, newLink];
      setQuickLinks(updatedLinks);
      await saveLinks(updatedLinks);
    },
    [quickLinks, saveLinks]
  );

  // Update an existing link
  const updateLink = useCallback(
    async (id: string, updates: Partial<Omit<QuickLink, 'id' | 'addedAt'>>): Promise<void> => {
      const updatedLinks = quickLinks.map((link) =>
        link.id === id ? { ...link, ...updates } : link
      );
      setQuickLinks(updatedLinks);
      await saveLinks(updatedLinks);
    },
    [quickLinks, saveLinks]
  );

  // Remove a link
  const removeLink = useCallback(
    async (id: string): Promise<void> => {
      const updatedLinks = quickLinks.filter((link) => link.id !== id);
      setQuickLinks(updatedLinks);
      await saveLinks(updatedLinks);
    },
    [quickLinks, saveLinks]
  );

  // Reorder links
  const reorderLinks = useCallback(
    async (links: QuickLink[]): Promise<void> => {
      setQuickLinks(links);
      await saveLinks(links);
    },
    [saveLinks]
  );

  // Refetch
  const refetch = useCallback(async () => {
    await fetchLinks();
  }, [fetchLinks]);

  return {
    quickLinks,
    loading: authLoading || loading,
    error,
    addLink,
    updateLink,
    removeLink,
    reorderLinks,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useQuickLinks;
