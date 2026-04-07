-- NXGen Docs Analytics Schema
-- Run this in Supabase SQL editor OR via the REST API

-- Track doc page views
CREATE TABLE IF NOT EXISTS doc_views (
  id          BIGSERIAL PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  slug        TEXT NOT NULL,
  product     TEXT NOT NULL DEFAULT 'gcxone',
  referrer    TEXT,
  user_agent  TEXT,
  country     TEXT,
  session_id  TEXT
);

CREATE INDEX IF NOT EXISTS doc_views_slug_idx     ON doc_views (slug);
CREATE INDEX IF NOT EXISTS doc_views_product_idx  ON doc_views (product);
CREATE INDEX IF NOT EXISTS doc_views_created_idx  ON doc_views (created_at DESC);

-- Track search queries
CREATE TABLE IF NOT EXISTS search_events (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  query         TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  product       TEXT NOT NULL DEFAULT 'gcxone',
  filters       JSONB,
  session_id    TEXT
);

CREATE INDEX IF NOT EXISTS search_events_query_idx   ON search_events (query);
CREATE INDEX IF NOT EXISTS search_events_created_idx ON search_events (created_at DESC);

-- Zero-result searches (content gap tracker)
CREATE TABLE IF NOT EXISTS zero_results (
  id         BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  query      TEXT NOT NULL,
  product    TEXT NOT NULL DEFAULT 'gcxone',
  count      INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS zero_results_query_product_idx ON zero_results (query, product);

-- Helper view: top pages last 30 days
CREATE OR REPLACE VIEW top_pages_30d AS
  SELECT slug, product, COUNT(*) AS views
  FROM doc_views
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY slug, product
  ORDER BY views DESC;

-- Helper view: top searches last 30 days
CREATE OR REPLACE VIEW top_searches_30d AS
  SELECT query, product, COUNT(*) AS count, AVG(results_count)::INT AS avg_results
  FROM search_events
  WHERE created_at > NOW() - INTERVAL '30 days'
  GROUP BY query, product
  ORDER BY count DESC;

-- Row-level security: allow inserts from anon (the tracking CF Function uses publishable key)
ALTER TABLE doc_views    ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE zero_results  ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'doc_views' AND policyname = 'allow insert doc_views') THEN
    CREATE POLICY "allow insert doc_views" ON doc_views FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'search_events' AND policyname = 'allow insert search_events') THEN
    CREATE POLICY "allow insert search_events" ON search_events FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'zero_results' AND policyname = 'allow all zero_results') THEN
    CREATE POLICY "allow all zero_results" ON zero_results FOR ALL WITH CHECK (true);
  END IF;
END $$;