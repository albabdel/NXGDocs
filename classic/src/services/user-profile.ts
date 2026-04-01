// classic/src/services/user-profile.ts
// User profile and preferences service
//
// Purpose:
//   - Provide API for user profile CRUD operations
//   - Manage user preferences (theme, language, notifications)
//   - Integrate with Supabase client for data persistence
//
// Usage:
//   const { getAccessTokenSilently } = useAuth0();
//   const supabase = createSupabaseClient(() => getAccessTokenSilently());
//   
//   // Get profile
//   const profile = await getUserProfile(supabase);
//   
//   // Update preferences
//   await updateUserPreferences(supabase, { theme: 'dark' });
//
// Reference:
//   - .planning/research/auth0-upgrade-SUPABASE.md
//   - classic/src/lib/supabase.ts

import { SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  auth0_user_id: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin' | 'operator' | 'manager';
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  sidebar_collapsed: boolean;
  notification_settings: Record<string, boolean>;
  homepage_view: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserProfileInput {
  auth0_user_id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | 'operator' | 'manager';
}

export interface UpdateUserProfileInput {
  email?: string;
  display_name?: string;
  avatar_url?: string;
  role?: 'user' | 'admin' | 'operator' | 'manager';
}

export interface UpdateUserPreferencesInput {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  sidebar_collapsed?: boolean;
  notification_settings?: Record<string, boolean>;
  homepage_view?: string;
}

// ---------------------------------------------------------------------------
// Profile Operations
// ---------------------------------------------------------------------------

/**
 * Get the current user's profile.
 * Returns null if profile doesn't exist or user not authenticated.
 */
export async function getUserProfile(
  supabase: SupabaseClient,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[user-profile] Error fetching profile:', error);
    throw error;
  }

  return data as UserProfile | null;
}

/**
 * Create a new user profile.
 * The auth0_user_id must match the authenticated user's ID (from JWT sub claim).
 */
export async function createUserProfile(
  supabase: SupabaseClient,
  input: CreateUserProfileInput,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('[user-profile] Error creating profile:', error);
    throw error;
  }

  return data as UserProfile;
}

/**
 * Update the current user's profile.
 * Only updates provided fields.
 */
export async function updateUserProfile(
  supabase: SupabaseClient,
  input: UpdateUserProfileInput,
): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(input)
    .select()
    .single();

  if (error) {
    console.error('[user-profile] Error updating profile:', error);
    throw error;
  }

  return data as UserProfile;
}

/**
 * Get or create user profile.
 * Creates a new profile if one doesn't exist.
 * Useful for onboarding flow.
 */
export async function getOrCreateUserProfile(
  supabase: SupabaseClient,
  auth0UserId: string,
  defaults?: Partial<CreateUserProfileInput>,
): Promise<UserProfile> {
  // Try to get existing profile
  const existing = await getUserProfile(supabase);
  if (existing) {
    return existing;
  }

  // Create new profile
  return createUserProfile(supabase, {
    auth0_user_id: auth0UserId,
    ...defaults,
  });
}

// ---------------------------------------------------------------------------
// Preferences Operations
// ---------------------------------------------------------------------------

/**
 * Get the current user's preferences.
 * Returns null if preferences don't exist.
 */
export async function getUserPreferences(
  supabase: SupabaseClient,
): Promise<UserPreferences | null> {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[user-profile] Error fetching preferences:', error);
    throw error;
  }

  return data as UserPreferences | null;
}

/**
 * Create default preferences for a user.
 */
export async function createUserPreferences(
  supabase: SupabaseClient,
  userId: string,
  defaults?: Partial<UpdateUserPreferencesInput>,
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .insert({
      user_id: userId,
      ...defaults,
    })
    .select()
    .single();

  if (error) {
    console.error('[user-profile] Error creating preferences:', error);
    throw error;
  }

  return data as UserPreferences;
}

/**
 * Update the current user's preferences.
 * Only updates provided fields.
 */
export async function updateUserPreferences(
  supabase: SupabaseClient,
  input: UpdateUserPreferencesInput,
): Promise<UserPreferences> {
  const { data, error } = await supabase
    .from('user_preferences')
    .update(input)
    .select()
    .single();

  if (error) {
    console.error('[user-profile] Error updating preferences:', error);
    throw error;
  }

  return data as UserPreferences;
}

/**
 * Get or create user preferences.
 * Creates default preferences if they don't exist.
 */
export async function getOrCreateUserPreferences(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserPreferences> {
  // Try to get existing preferences
  const existing = await getUserPreferences(supabase);
  if (existing) {
    return existing;
  }

  // Create default preferences
  return createUserPreferences(supabase, userId);
}

// ---------------------------------------------------------------------------
// Convenience Functions
// ---------------------------------------------------------------------------

/**
 * Update user's theme preference.
 */
export async function setTheme(
  supabase: SupabaseClient,
  theme: 'light' | 'dark' | 'system',
): Promise<void> {
  await updateUserPreferences(supabase, { theme });
}

/**
 * Update user's language preference.
 */
export async function setLanguage(
  supabase: SupabaseClient,
  language: string,
): Promise<void> {
  await updateUserPreferences(supabase, { language });
}

/**
 * Toggle sidebar collapsed state.
 */
export async function toggleSidebar(
  supabase: SupabaseClient,
  collapsed: boolean,
): Promise<void> {
  await updateUserPreferences(supabase, { sidebar_collapsed: collapsed });
}

/**
 * Update notification settings.
 */
export async function setNotificationSettings(
  supabase: SupabaseClient,
  settings: Partial<Record<string, boolean>>,
): Promise<void> {
  // Get current settings and merge
  const current = await getUserPreferences(supabase);
  const defaults: Record<string, boolean> = { email: true, browser: true, updates: true };
  const existing: Record<string, boolean> = current?.notification_settings || defaults;
  
  // Filter out undefined values from settings
  const filteredSettings: Record<string, boolean> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) {
      filteredSettings[key] = value;
    }
  }
  
  const merged: Record<string, boolean> = {
    ...existing,
    ...filteredSettings,
  };
  await updateUserPreferences(supabase, { notification_settings: merged });
}
