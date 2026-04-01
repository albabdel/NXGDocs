-- .supabase/schema/user-history.sql
-- Reading/watch history table with Row Level Security
--
-- Purpose:
--   - Track user's visited pages for "Continue Reading" feature
--   - Store progress and time spent on each page
--   - Enable Row Level Security for automatic user isolation
--
-- Usage:
--   Run this SQL in Supabase SQL Editor:
--   1. Open Supabase Dashboard
--   2. Navigate to SQL Editor
--   3. Paste and run this script
--
-- Reference:
--   - .planning/research/auth0-upgrade-UX-PATTERNS.md
--   - https://supabase.com/docs/guides/database/postgres/row-level-security

-- ============================================================================
-- Reading History Table
-- ============================================================================

-- Reading/watch history
-- Tracks user's progress through documentation pages
CREATE TABLE IF NOT EXISTS user_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- Auth0 'sub' claim
  item_type TEXT NOT NULL CHECK (item_type IN ('document', 'page', 'video')),
  item_slug TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_url TEXT NOT NULL,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  time_spent_seconds INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- One history entry per user per item
  UNIQUE (user_id, item_slug)
);

-- ============================================================================
-- Indexes
-- ============================================================================

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_history_user_id ON user_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_history_accessed ON user_history(user_id, last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_history_incomplete ON user_history(user_id, progress_percent) 
  WHERE progress_percent < 100;
CREATE INDEX IF NOT EXISTS idx_user_history_type ON user_history(user_id, item_type);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Enable RLS
ALTER TABLE user_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own history (matched by Auth0 sub claim)

CREATE POLICY "Users can view own history"
  ON user_history FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own history"
  ON user_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own history"
  ON user_history FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'))
  WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own history"
  ON user_history FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- ============================================================================
-- Triggers
-- ============================================================================

-- Updated_at trigger function (reuse from user-tables.sql if exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_history
DROP TRIGGER IF EXISTS update_user_history_accessed_at ON user_history;
CREATE TRIGGER update_user_history_accessed_at
  BEFORE UPDATE ON user_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Verification
-- ============================================================================

-- After running, verify with:
-- SELECT * FROM user_history LIMIT 1;
-- SELECT * FROM pg_policies WHERE tablename = 'user_history';
