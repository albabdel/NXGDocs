// classic/src/hooks/useUserProfile.ts
// User profile state management hook
//
// Purpose:
//   - Manage user profile and preferences state
//   - Auto-create profile on first login
//   - Provide functions to update profile and preferences
//
// Usage:
//   const { profile, preferences, loading, updateProfile, updatePreferences } = useUserProfile();
//
// Reference:
//   - classic/src/services/user-profile.ts
//   - classic/src/lib/supabase.ts

import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useSupabase } from '../lib/supabase';
import {
  UserProfile,
  UserPreferences,
  getUserProfile,
  getOrCreateUserProfile,
  updateUserProfile as updateProfileService,
  getUserPreferences,
  getOrCreateUserPreferences,
  updateUserPreferences as updatePreferencesService,
  UpdateUserProfileInput,
  UpdateUserPreferencesInput,
} from '../services/user-profile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UseUserProfileReturn {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: Error | null;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  refetch: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Hook for managing user profile and preferences.
 * Auto-creates profile and preferences on first login.
 */
export function useUserProfile(): UseUserProfileReturn {
  const { user, isAuthenticated, isLoading: authLoading, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch profile and preferences
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user?.userId) {
      setProfile(null);
      setPreferences(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get or create profile (auto-creation on first login)
      const userProfile = await getOrCreateUserProfile(supabase, user.userId, {
        email: user.email,
        display_name: user.name || user.email?.split('@')[0],
        avatar_url: user.picture,
        role: 'user',
      });
      setProfile(userProfile);

      // Get or create preferences
      const userPreferences = await getOrCreateUserPreferences(supabase, user.userId);
      setPreferences(userPreferences);
    } catch (err) {
      console.error('[useUserProfile] Error fetching data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load profile'));
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.userId, user?.email, user?.name, user?.picture, supabase]);

  // Fetch on mount and when auth state changes
  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  // Update profile
  const updateProfile = useCallback(
    async (data: Partial<UserProfile>) => {
      if (!profile || !user?.userId) return;

      setLoading(true);
      try {
        const updated = await updateProfileService(supabase, user.userId, data as UpdateUserProfileInput);
        setProfile(updated);
      } catch (err) {
        console.error('[useUserProfile] Error updating profile:', err);
        setError(err instanceof Error ? err : new Error('Failed to update profile'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [profile, user?.userId, supabase]
  );

  // Update preferences
  const updatePreferences = useCallback(
    async (prefs: Partial<UserPreferences>) => {
      if (!preferences || !user?.userId) return;

      setLoading(true);
      try {
        const updated = await updatePreferencesService(supabase, user.userId, prefs as UpdateUserPreferencesInput);
        setPreferences(updated);
      } catch (err) {
        console.error('[useUserProfile] Error updating preferences:', err);
        setError(err instanceof Error ? err : new Error('Failed to update preferences'));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [preferences, user?.userId, supabase]
  );

  // Refetch all data
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    profile,
    preferences,
    loading: authLoading || loading,
    error,
    updateProfile,
    updatePreferences,
    refetch,
  };
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default useUserProfile;
