-- .supabase/schema/user-bookmarks.sql
-- User bookmarks table with Row Level Security
--
-- Purpose:
--   - Store user bookmarks for documentation pages
--   - Enable Row Level Security for automatic user isolation
--   - Support multiple content types (documents, pages, videos, sections)
--
-- Usage:
--   Run this SQL in Supabase SQL Editor:
--   1. Open Supabase Dashboard
--   2. Navigate to SQL Editor
--   3. Paste and run this script
--
-- Reference:
--   - .supabase/schema/user-tables.sql (existing patterns)
--   - .planning/research/auth0-upgrade-SUPABASE.md

-- ============================================================================
-- User Bookmarks Table
-- ============================================================================

-- User bookmarks for saved documentation pages
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,  -- Auth0 'sub' claim
  item_type TEXT NOT NULL CHECK (item_type IN ('document', 'page', 'video', 'section')),
  item_slug TEXT NOT NULL,  -- Unique identifier for the item (URL path)
  item_title TEXT NOT NULL,  -- Display title
  item_url TEXT NOT NULL,  -- Full URL to the item
  metadata JSONB DEFAULT '{}',  -- Additional metadata (tags, description, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate bookmarks per user
  UNIQUE (user_id, item_slug)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_created ON user_bookmarks(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_type ON user_bookmarks(user_id, item_type);

-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Enable RLS on bookmarks table
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_bookmarks
-- Users can only access their own bookmarks (matched by Auth0 sub claim)

CREATE POLICY "Users can view own bookmarks"
  ON user_bookmarks FOR SELECT
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can insert own bookmarks"
  ON user_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can update own bookmarks"
  ON user_bookmarks FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'))
  WITH CHECK (user_id = (SELECT auth.jwt() ->> 'sub'));

CREATE POLICY "Users can delete own bookmarks"
  ON user_bookmarks FOR DELETE
  TO authenticated
  USING (user_id = (SELECT auth.jwt() ->> 'sub'));

-- ============================================================================
-- Triggers
-- ============================================================================

-- Updated_at trigger (uses existing function from user-tables.sql)
-- If function doesn't exist, create it:
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_bookmarks
DROP TRIGGER IF EXISTS update_user_bookmarks_updated_at ON user_bookmarks;
CREATE TRIGGER update_user_bookmarks_updated_at
  BEFORE UPDATE ON user_bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Verification
-- ============================================================================

-- After running, verify with:
-- SELECT * FROM user_bookmarks LIMIT 1;
-- SELECT * FROM pg_policies WHERE tablename = 'user_bookmarks';
-- SELECT indexname FROM pg_indexes WHERE tablename = 'user_bookmarks';
