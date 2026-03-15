# Phase 3 Research: Analytics Dashboard

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 3 - Analytics Dashboard  
**Date:** March 15, 2026

---

## 1. Supabase Integration Analysis

### 1.1 Current Stack

The project already uses Supabase for potential analytics (based on roadmap references). We'll leverage the existing infrastructure.

### 1.2 Database Schema Design

```sql
-- Search events: Core analytics table
CREATE TABLE search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,  -- lowercase, trimmed for aggregation
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  result_count INTEGER NOT NULL DEFAULT 0,
  search_mode TEXT DEFAULT 'keyword',  -- 'keyword', 'hybrid', 'vector'
  ai_answer_shown BOOLEAN DEFAULT FALSE,
  ai_answer_clicked BOOLEAN DEFAULT FALSE,
  user_id TEXT,
  session_id TEXT,
  filters JSONB DEFAULT '{}',
  referrer TEXT
);

-- Create index for fast aggregation
CREATE INDEX idx_search_events_timestamp ON search_events(timestamp DESC);
CREATE INDEX idx_search_events_normalized_query ON search_events(normalized_query);
CREATE INDEX idx_search_events_session_id ON search_events(session_id);

-- Click events: Track result engagement
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_event_id UUID REFERENCES search_events(id) ON DELETE CASCADE,
  result_id TEXT NOT NULL,
  result_title TEXT,
  result_url TEXT,
  position INTEGER NOT NULL,  -- 1-based position in results
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  time_to_click_ms INTEGER  -- Time from search to click
);

-- Create index for joins
CREATE INDEX idx_click_events_search_event_id ON click_events(search_event_id);
CREATE INDEX idx_click_events_timestamp ON click_events(timestamp DESC);

-- Materialized view for daily stats (refresh hourly)
CREATE MATERIALIZED VIEW daily_search_stats AS
SELECT 
  DATE(timestamp) as date,
  normalized_query as query,
  COUNT(*) as search_count,
  COUNT(DISTINCT session_id) as unique_sessions,
  AVG(result_count) as avg_result_count,
  COUNT(*) FILTER (WHERE result_count = 0) as zero_result_count,
  COUNT(*) FILTER (WHERE search_mode = 'hybrid') as hybrid_count,
  COUNT(*) FILTER (WHERE ai_answer_shown = TRUE) as ai_answer_count
FROM search_events
GROUP BY DATE(timestamp), normalized_query;

-- Create index on materialized view
CREATE INDEX idx_daily_search_stats_date ON daily_search_stats(date DESC);
```

### 1.3 Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE search_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous inserts" ON search_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous inserts" ON click_events
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read (for dashboard)
CREATE POLICY "Authenticated users can read" ON search_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can read" ON click_events
  FOR SELECT TO authenticated USING (true);
```

---

## 2. Analytics Hook Design

### 2.1 Session Management

```typescript
// Generate or retrieve session ID
function getSessionId(): string {
  const stored = sessionStorage.getItem('search_session_id');
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  sessionStorage.setItem('search_session_id', newId);
  return newId;
}

// Generate anonymous user ID (persisted)
function getUserId(): string {
  const stored = localStorage.getItem('search_user_id');
  if (stored) return stored;
  
  const newId = crypto.randomUUID();
  localStorage.setItem('search_user_id', newId);
  return newId;
}
```

### 2.2 Event Tracking API

```typescript
interface SearchEvent {
  query: string;
  resultCount: number;
  searchMode: 'keyword' | 'hybrid' | 'vector';
  aiAnswerShown: boolean;
  filters?: Record<string, string>;
}

interface ClickEvent {
  searchEventId: string;
  result: SearchResult;
  position: number;
  timeToClickMs: number;
}

// Batch events for performance
const eventQueue: Array<() => Promise<void>> = [];
let flushTimeout: NodeJS.Timeout | null = null;

function queueEvent(event: () => Promise<void>) {
  eventQueue.push(event);
  
  if (!flushTimeout) {
    flushTimeout = setTimeout(flushEvents, 1000);
  }
}

async function flushEvents() {
  const events = [...eventQueue];
  eventQueue.length = 0;
  flushTimeout = null;
  
  await Promise.all(events.map(e => e()));
}
```

### 2.3 Query Functions

```typescript
// Get top queries with aggregations
async function getTopQueries(days: number = 7): Promise<TopQuery[]> {
  const { data, error } = await supabase
    .from('daily_search_stats')
    .select('query, search_count, zero_result_count')
    .gte('date', new Date(Date.now() - days * 86400000).toISOString())
    .order('search_count', { ascending: false })
    .limit(20);
    
  // Aggregate by query
  return aggregateByQuery(data);
}

// Get zero result queries
async function getZeroResultQueries(days: number = 7): Promise<ZeroResultQuery[]> {
  const { data } = await supabase
    .from('search_events')
    .select('query, timestamp')
    .eq('result_count', 0)
    .gte('timestamp', new Date(Date.now() - days * 86400000).toISOString())
    .order('timestamp', { ascending: false })
    .limit(50);
    
  return data;
}

// Get click-through rate
async function getClickThroughRate(days: number = 7): Promise<number> {
  const { data: searches } = await supabase
    .from('search_events')
    .select('id')
    .gte('timestamp', new Date(Date.now() - days * 86400000).toISOString());
    
  const { data: clicks } = await supabase
    .from('click_events')
    .select('search_event_id')
    .in('search_event_id', searches.map(s => s.id));
    
  const uniqueClickedSearches = new Set(clicks.map(c => c.search_event_id));
  return uniqueClickedSearches.size / searches.length;
}
```

---

## 3. Dashboard UI Design

### 3.1 Metric Cards

Four key KPIs displayed prominently:

| Metric | Description | Calculation |
|--------|-------------|-------------|
| Total Searches | Search volume | COUNT(search_events) |
| Zero Result Rate | Content gaps | COUNT(result=0) / COUNT(*) |
| Click-Through Rate | Search effectiveness | Distinct clicks / Distinct searches |
| AI Search Usage | AI adoption | COUNT(mode='hybrid') / COUNT(*) |

### 3.2 Charts

Using Recharts for visualization:

```typescript
// Search volume over time (AreaChart)
<AreaChart data={searchVolumeData}>
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Area type="monotone" dataKey="count" stroke="#E8B058" fill="#E8B058" fillOpacity={0.3} />
</AreaChart>

// Search mode distribution (PieChart)
<PieChart>
  <Pie data={modeData} dataKey="count" nameKey="mode" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
    {modeData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>

// Average position clicked (BarChart)
<BarChart data={positionData}>
  <XAxis dataKey="position" />
  <YAxis />
  <Tooltip />
  <Bar dataKey="clicks" fill="#E8B058" />
</BarChart>
```

### 3.3 Tables

**Top Queries Table:**
- Query text
- Search count
- Zero result count
- Click-through rate
- Trend indicator (up/down)

**Zero Results Table:**
- Query text
- Occurrences
- Last seen
- Suggested action (create content)

---

## 4. Performance Considerations

### 4.1 Data Retention

```sql
-- Auto-delete old events (90-day retention)
CREATE OR REPLACE FUNCTION delete_old_events() RETURNS void AS $$
BEGIN
  DELETE FROM search_events WHERE timestamp < NOW() - INTERVAL '90 days';
  DELETE FROM click_events WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Schedule with pg_cron (if available)
SELECT cron.schedule('delete-old-events', '0 2 * * *', 'SELECT delete_old_events()');
```

### 4.2 Materialized View Refresh

```sql
-- Refresh hourly
SELECT cron.schedule('refresh-stats', '0 * * * *', 'REFRESH MATERIALIZED VIEW daily_search_stats');
```

### 4.3 Client-Side Optimization

```typescript
// Debounce tracking calls
const debouncedTrack = debounce(trackSearch, 500);

// Use requestIdleCallback for non-critical tracking
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => trackClick(event));
} else {
  setTimeout(() => trackClick(event), 100);
}
```

---

## 5. Privacy Considerations

### 5.1 Data Anonymization

- User IDs are random UUIDs (not PII)
- Session IDs are ephemeral (sessionStorage)
- Query text stored as-is (required for analysis)
- No IP addresses stored

### 5.2 GDPR Compliance

- Analytics can be disabled via cookie consent
- Clear data retention policy (90 days)
- User can request data deletion

---

## 6. Admin Authentication

### 6.1 Simple Auth Check

```typescript
// Check for admin access
const isAdmin = () => {
  const adminKey = localStorage.getItem('admin_key');
  return adminKey === import.meta.env.VITE_ADMIN_KEY;
};

// Protect admin routes
export function AdminRoute({ children }) {
  if (!isAdmin()) {
    return <Navigate to="/" />;
  }
  return children;
}
```

### 6.2 Alternative: Docusaurus Auth

If using Docusaurus authentication plugin:
- Integrate with existing auth
- Add role-based access for analytics

---

## 7. Testing Strategy

### 7.1 Unit Tests

```typescript
describe('useSearchAnalyticsEnhanced', () => {
  it('tracks search events with correct mode', async () => {
    const { trackSearch } = useSearchAnalyticsEnhanced();
    await trackSearch('test query', 10, 'hybrid');
    // Verify Supabase insert
  });
  
  it('batches events for performance', () => {
    // Multiple trackSearch calls
    // Verify single batch insert
  });
});
```

### 7.2 E2E Tests

```typescript
test('analytics dashboard shows data', async ({ page }) => {
  // Perform searches
  await page.goto('/');
  await page.keyboard.press('Control+K');
  await page.fill('input[type="search"]', 'authentication');
  await page.waitForSelector('.result');
  
  // Check dashboard
  await page.goto('/admin/search-analytics');
  await expect(page.locator('.metric-card')).toContainText('Total Searches');
});
```

---

## 8. Alternative: Local-First Analytics

If Supabase is not available, use local-first approach:

```typescript
// Store events in localStorage
const localEvents = JSON.parse(localStorage.getItem('search_events') || '[]');
localEvents.push(event);
localStorage.setItem('search_events', JSON.stringify(localEvents.slice(-1000)));

// Aggregate locally
function aggregateLocalEvents() {
  const events = JSON.parse(localStorage.getItem('search_events') || '[]');
  return {
    totalSearches: events.length,
    topQueries: getTopQueriesFromEvents(events),
    zeroResults: events.filter(e => e.resultCount === 0),
  };
}
```

This provides basic analytics without external dependencies.
