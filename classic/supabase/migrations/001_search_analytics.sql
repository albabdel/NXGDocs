-- Migration: Search Analytics
-- Description: Creates tables and views for tracking search behavior and analytics
-- Version: 001

-- ============================================================================
-- SECTION 1: SEARCH EVENTS TABLE
-- Tracks each search request including query, results, and AI interactions
-- ============================================================================

CREATE TABLE IF NOT EXISTS search_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    normalized_query TEXT NOT NULL GENERATED ALWAYS AS (lower(trim(query))) STORED,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    result_count INTEGER NOT NULL DEFAULT 0,
    search_mode TEXT NOT NULL DEFAULT 'keyword',
    ai_answer_shown BOOLEAN NOT NULL DEFAULT FALSE,
    ai_answer_clicked BOOLEAN NOT NULL DEFAULT FALSE,
    user_id TEXT,
    session_id TEXT,
    filters JSONB NOT NULL DEFAULT '{}',
    referrer TEXT
);

COMMENT ON TABLE search_events IS 'Records each search request with query details, results, and AI interaction metrics';
COMMENT ON COLUMN search_events.normalized_query IS 'Lowercase trimmed version of query for aggregation purposes';
COMMENT ON COLUMN search_events.search_mode IS 'Search type: keyword, semantic, hybrid, etc.';
COMMENT ON COLUMN search_events.filters IS 'JSON object containing any applied filters (category, date range, etc.)';

-- ============================================================================
-- SECTION 2: CLICK EVENTS TABLE
-- Tracks when users click on search results
-- ============================================================================

CREATE TABLE IF NOT EXISTS click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_event_id UUID NOT NULL REFERENCES search_events(id) ON DELETE CASCADE,
    result_id TEXT NOT NULL,
    result_title TEXT,
    result_url TEXT,
    position INTEGER NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id TEXT,
    session_id TEXT,
    time_to_click_ms INTEGER
);

COMMENT ON TABLE click_events IS 'Records clicks on search results for tracking engagement and relevance';
COMMENT ON COLUMN click_events.position IS 'Zero-based position in search results (0 = first result)';
COMMENT ON COLUMN click_events.time_to_click_ms IS 'Milliseconds between search and click, measures engagement speed';

-- ============================================================================
-- SECTION 3: PERFORMANCE INDEXES
-- Optimizes common query patterns for analytics and lookups
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_search_events_timestamp ON search_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_search_events_normalized_query ON search_events(normalized_query);
CREATE INDEX IF NOT EXISTS idx_search_events_session_id ON search_events(session_id);
CREATE INDEX IF NOT EXISTS idx_search_events_user_id ON search_events(user_id);

CREATE INDEX IF NOT EXISTS idx_click_events_search_event_id ON click_events(search_event_id);
CREATE INDEX IF NOT EXISTS idx_click_events_timestamp ON click_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_click_events_session_id ON click_events(session_id);
CREATE INDEX IF NOT EXISTS idx_click_events_position ON click_events(position);

COMMENT ON INDEX idx_search_events_timestamp IS 'Optimizes time-based queries and dashboard views';
COMMENT ON INDEX idx_search_events_normalized_query IS 'Optimizes query aggregation and trending searches';
COMMENT ON INDEX idx_click_events_position IS 'Optimizes position-based analytics (CTR by rank)';

-- ============================================================================
-- SECTION 4: ROW LEVEL SECURITY (RLS) POLICIES
-- Allows anonymous inserts for tracking, authenticated reads for analytics
-- ============================================================================

ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on search_events"
    ON search_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read on search_events"
    ON search_events
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow anonymous insert on click_events"
    ON click_events
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated read on click_events"
    ON click_events
    FOR SELECT
    TO authenticated
    USING (true);

COMMENT ON POLICY "Allow anonymous insert on search_events" IS 'Enables client-side tracking without authentication';
COMMENT ON POLICY "Allow authenticated read on search_events" IS 'Restricts analytics access to authenticated users';

-- ============================================================================
-- SECTION 5: MATERIALIZED VIEW - DAILY SEARCH STATISTICS
-- Pre-aggregated stats for dashboard performance
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS daily_search_stats AS
SELECT
    DATE(timestamp) AS date,
    normalized_query,
    search_mode,
    COUNT(*) AS search_count,
    COUNT(DISTINCT session_id) AS unique_sessions,
    COUNT(DISTINCT user_id) AS unique_users,
    AVG(result_count)::INTEGER AS avg_result_count,
    SUM(CASE WHEN ai_answer_shown THEN 1 ELSE 0 END) AS ai_answers_shown,
    SUM(CASE WHEN ai_answer_clicked THEN 1 ELSE 0 END) AS ai_answers_clicked,
    ROUND(
        100.0 * SUM(CASE WHEN ai_answer_clicked THEN 1 ELSE 0 END) /
        NULLIF(SUM(CASE WHEN ai_answer_shown THEN 1 ELSE 0 END), 0),
        2
    ) AS ai_click_through_rate
FROM search_events
GROUP BY DATE(timestamp), normalized_query, search_mode;

CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_search_stats_date_query_mode
    ON daily_search_stats(date, normalized_query, search_mode);

COMMENT ON MATERIALIZED VIEW daily_search_stats IS 'Pre-aggregated daily statistics for dashboard queries';
COMMENT ON INDEX idx_daily_search_stats_date_query_mode IS 'Enables efficient refresh and lookups';

CREATE OR REPLACE FUNCTION refresh_daily_search_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_search_stats;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_daily_search_stats IS 'Call periodically (e.g., hourly) to update aggregated stats';

-- ============================================================================
-- SECTION 6: HELPER FUNCTIONS
-- Utility functions for common analytics queries
-- ============================================================================

CREATE OR REPLACE FUNCTION get_search_click_rate(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '7 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    normalized_query TEXT,
    total_searches BIGINT,
    total_clicks BIGINT,
    click_through_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        se.normalized_query,
        COUNT(DISTINCT se.id) AS total_searches,
        COUNT(DISTINCT ce.id) AS total_clicks,
        ROUND(
            100.0 * COUNT(DISTINCT ce.id) / NULLIF(COUNT(DISTINCT se.id), 0),
            2
        ) AS click_through_rate
    FROM search_events se
    LEFT JOIN click_events ce ON ce.search_event_id = se.id
    WHERE se.timestamp >= p_start_date
      AND se.timestamp <= p_end_date
    GROUP BY se.normalized_query
    ORDER BY total_searches DESC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_search_click_rate IS 'Calculates click-through rate per query for a date range';

CREATE OR REPLACE FUNCTION get_top_searches(
    p_limit INTEGER DEFAULT 10,
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '7 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    normalized_query TEXT,
    search_count BIGINT,
    unique_searchers BIGINT,
    avg_results NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        se.normalized_query,
        COUNT(*) AS search_count,
        COUNT(DISTINCT COALESCE(se.user_id, se.session_id)) AS unique_searchers,
        AVG(se.result_count) AS avg_results
    FROM search_events se
    WHERE se.timestamp >= p_start_date
      AND se.timestamp <= p_end_date
    GROUP BY se.normalized_query
    ORDER BY search_count DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_top_searches IS 'Returns most popular searches with searcher counts for a date range';
