# Phase 3: Analytics Dashboard

**Project:** NXGEN Docs Search Enhancement  
**Phase:** 3 of 5  
**Duration:** 3-4 days  
**Status:** IN PROGRESS  
**Started:** March 15, 2026

---

## Objective

Build a comprehensive analytics dashboard for search insights, enabling data-driven decisions about content gaps, search effectiveness, and user behavior.

## Features Delivered

| Feature | Description | Effort | Status |
|---------|-------------|--------|--------|
| **Search Analytics Dashboard** | Visual metrics for search performance | 2-3 days | PENDING |
| **Zero Result Query Tracking** | Identify content gaps | 0.5 days | PENDING |
| **Top Queries Report** | Most searched terms | 0.5 days | PENDING |
| **Click-Through Rate Tracking** | Measure search effectiveness | 0.5 days | PENDING |
| **Search Mode Tracking** | Track AI vs keyword usage | 0.5 days | PENDING |

---

## Technical Architecture

### 3.1 Data Storage (Supabase)

Using Supabase for analytics storage with realtime capabilities:

```sql
-- Search events table
CREATE TABLE search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  result_count INTEGER NOT NULL DEFAULT 0,
  search_mode TEXT DEFAULT 'keyword',
  user_id TEXT,
  session_id TEXT,
  filters JSONB,
  referrer TEXT
);

-- Click events table  
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_event_id UUID REFERENCES search_events(id),
  result_id TEXT NOT NULL,
  result_title TEXT,
  result_url TEXT,
  position INTEGER,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  time_to_click_ms INTEGER
);
```

### 3.2 Enhanced Analytics Hook

```typescript
// src/hooks/useSearchAnalyticsEnhanced.ts
- trackSearch() - Record search event with mode
- trackClick() - Record click event with timing
- trackAIAnswer() - Track AI answer engagement
- getTopQueries() - Get most searched terms
- getZeroResults() - Get queries with no results
```

### 3.3 Dashboard Components

```typescript
// src/components/SearchAnalytics/
- SearchAnalyticsDashboard.tsx - Main dashboard
- MetricCard.tsx - KPI display cards
- TopQueriesTable.tsx - Most searched terms
- ZeroResultsTable.tsx - Content gaps
- SearchVolumeChart.tsx - Trend visualization
```

---

## Implementation Tasks

### Task 3.1: Supabase Setup (Day 1)

- [ ] Create Supabase project or use existing
- [ ] Run schema migrations
- [ ] Configure RLS policies
- [ ] Add environment variables

### Task 3.2: Enhanced Analytics Hook (Day 1-2)

- [ ] Create `useSearchAnalyticsEnhanced.ts`
- [ ] Implement trackSearch with mode tracking
- [ ] Implement trackClick with timing
- [ ] Implement trackAIAnswer for AI engagement
- [ ] Add session/user ID management

### Task 3.3: Dashboard Components (Day 2-3)

- [ ] Create `SearchAnalyticsDashboard.tsx`
- [ ] Create `MetricCard.tsx`
- [ ] Create `TopQueriesTable.tsx`
- [ ] Create `ZeroResultsTable.tsx`
- [ ] Create `SearchVolumeChart.tsx`

### Task 3.4: Admin Page (Day 3)

- [ ] Create admin route at `/admin/search-analytics`
- [ ] Add authentication check
- [ ] Integrate dashboard component

### Task 3.5: SearchModal Integration (Day 3-4)

- [ ] Update SearchModal to use enhanced analytics
- [ ] Track search mode (AI vs keyword)
- [ ] Track AI answer engagement
- [ ] Track click position

---

## Files to Create

```
classic/
├── src/
│   ├── hooks/
│   │   └── useSearchAnalyticsEnhanced.ts
│   ├── components/SearchAnalytics/
│   │   ├── SearchAnalyticsDashboard.tsx
│   │   ├── SearchAnalyticsDashboard.module.css
│   │   ├── MetricCard.tsx
│   │   ├── MetricCard.module.css
│   │   ├── TopQueriesTable.tsx
│   │   ├── ZeroResultsTable.tsx
│   │   └── index.ts
│   └── pages/
│       └── admin/
│           └── search-analytics.tsx
└── supabase/
    └── migrations/
        └── 001_search_analytics.sql
```

## Files to Modify

```
classic/
├── src/components/SearchModal/
│   └── SearchModal.tsx - Use enhanced analytics
├── docusaurus.config.ts - Add admin route
└── .env.local - Add Supabase credentials
```

---

## Environment Variables

```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

---

## Verification Criteria

- [ ] Search events are recorded in Supabase
- [ ] Click events are recorded with position
- [ ] Zero-result queries are tracked
- [ ] Dashboard shows real-time metrics
- [ ] Top queries are displayed
- [ ] AI vs keyword usage is tracked

---

## Dependencies

```bash
npm install @supabase/supabase-js recharts date-fns
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Supabase free tier limits | Monitor usage, set retention policy |
| Analytics data bloat | Add 30-day retention policy |
| Performance impact | Batch events, use background sync |
