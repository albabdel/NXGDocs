-- User bookmarks table
CREATE TABLE IF NOT EXISTS user_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('document', 'page', 'video', 'section')),
  item_slug TEXT NOT NULL,
  item_title TEXT NOT NULL,
  item_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, item_slug)
);

-- Indexes
CREATE INDEX idx_user_bookmarks_user_id ON user_bookmarks(user_id);
CREATE INDEX idx_user_bookmarks_created ON user_bookmarks(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE user_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (application-level filtering since we skipped Auth0 Actions)
-- We'll filter by user_id in queries instead of using auth.jwt()
