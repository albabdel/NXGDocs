// classic/src/hooks/useThemeSync.ts
// Theme synchronization hook for Docusaurus
//
// Purpose:
//   - Sync Docusaurus theme with user preferences stored in Supabase
//   - Apply saved theme on login
//   - Save theme changes to preferences
//   - Handle 'system' mode correctly
//
// Usage:
//   const { theme, setTheme, synced } = useThemeSync();
//
// Reference:
//   - @docusaurus/theme-common useColorMode
//   - classic/src/services/user-profile.ts

import { useState, useEffect, useCallback } from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import { useAuth0 } from '@auth0/auth0-react';
import { useSupabase } from '../lib/supabase';
import { getUserPreferences, updateUserPreferences } from '../services/user-profile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UseThemeSyncReturn {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  synced: boolean;
  systemPreference: 'light' | 'dark';
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for syncing Docusaurus theme with user preferences.
 * Persists theme choice to Supabase for cross-device sync.
 */
export function useThemeSync(): UseThemeSyncReturn {
  const { colorMode, setColorMode } = useColorMode();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);

  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [synced, setSynced] = useState(false);
  const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('dark');

  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateSystemPreference = () => {
      setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    };

    updateSystemPreference();
    mediaQuery.addEventListener('change', updateSystemPreference);

    return () => {
      mediaQuery.removeEventListener('change', updateSystemPreference);
    };
  }, []);

  // Load saved theme from preferences on login
  useEffect(() => {
    const loadTheme = async () => {
      if (!isAuthenticated) {
        setSynced(false);
        return;
      }

      try {
        const preferences = await getUserPreferences(supabase);
        if (preferences?.theme) {
          const savedTheme = preferences.theme as ThemeMode;
          setThemeState(savedTheme);
          
          // Apply theme to Docusaurus
          if (savedTheme === 'system') {
            // Use system preference
            setColorMode(systemPreference);
          } else {
            setColorMode(savedTheme);
          }
          
          setSynced(true);
        }
      } catch (err) {
        console.error('[useThemeSync] Error loading theme:', err);
        setSynced(false);
      }
    };

    loadTheme();
  }, [isAuthenticated, supabase, setColorMode, systemPreference]);

  // Apply theme changes
  const applyTheme = useCallback(
    (newTheme: ThemeMode) => {
      if (newTheme === 'system') {
        setColorMode(systemPreference);
      } else {
        setColorMode(newTheme);
      }
    },
    [setColorMode, systemPreference]
  );

  // Set theme and persist to preferences
  const setTheme = useCallback(
    async (newTheme: ThemeMode) => {
      setThemeState(newTheme);
      applyTheme(newTheme);

      if (!isAuthenticated) {
        // Not authenticated, just apply locally
        return;
      }

      try {
        await updateUserPreferences(supabase, { theme: newTheme });
        setSynced(true);
      } catch (err) {
        console.error('[useThemeSync] Error saving theme:', err);
        setSynced(false);
      }
    },
    [isAuthenticated, supabase, applyTheme]
  );

  return {
    theme,
    setTheme,
    synced,
    systemPreference,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useThemeSync;
