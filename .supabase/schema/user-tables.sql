-- .supabase/schema/user-tables.sql
-- User profile and preferences tables with Row Level Security
--
-- Purpose:
--   - Store user profile data linked to Auth0 user IDs
--   - Store user preferences (theme, language, notifications)
--   - Enable Row Level Security for automatic user isolation
--
-- Usage:
--   Run this SQL in Supabase SQL Editor:
--   1. Open Supabase Dashboard
--   2. Navigate to SQL Editor
--   3. Paste and run this script
--
-- Reference:
--   - .planning/research/auth0-upgrade-SUPABASE.md
--   - https://supabase.com/docs/guides/database/postgres/row-level-security

-- ============================================================================
-- User Profiles Table
-- ============================================================================

-- User profiles linked to Auth0 user ID (sub claim from JWT)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_user_id TEXT UNIQUE NOT NULL,  -- Auth0 'sub' claim
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'operator', 'manager')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for RLS lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth0_id ON user_profiles(auth0_user_id);

-- ============================================================================
-- User Preferences Table
-- ============================================================================

-- User preferences for UI customization
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE NOT NULL,  -- Auth0 'sub' claim
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en',
  sidebar_collapsed BOOLEAN DEFAULT FALSE,
  notification_settings JSONB DEFAULT '{"email": true, "browser": true, "updates": true}',
  homepage_view TEXT DEFAULT 'dashboard',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for RLS lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
-- Users can only access their own profile (matched by Auth0 sub claim)

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth0_user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth0_user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth0_user_id = (SELECT auth.jwt() ->> 'sub'))
  WITH CHECK (auth0_user_id = (SELECT auth.jwt() ->> 'sub'));

-- RLS Policies for user_preferences
-- Users can only access their own preferences

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'))
  WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

-- ============================================================================
-- Triggers
-- ============================================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Verification
-- ============================================================================

-- After running, verify with:
-- SELECT * FROM user_profiles LIMIT 1;
-- SELECT * FROM user_preferences LIMIT 1;
-- SELECT * FROM pg_policies WHERE tablename IN ('user_profiles', 'user_preferences');
