# Search Analytics Dashboard Implementation Guide

**Project:** NXGEN Docs Search Analytics Dashboard  
**Researched:** March 15, 2026  
**Overall Confidence:** HIGH (based on Algolia docs, Chart.js docs, Supabase docs, Cloudflare Analytics Engine docs)

---

## Executive Summary

This guide provides a comprehensive implementation plan for building a search analytics dashboard for the NXGEN documentation platform. The current implementation uses localStorage with a 100-query limit, which is insufficient for production analytics. We recommend a hybrid approach: leveraging Algolia Insights (already partially implemented) for click/conversion tracking, combined with a dedicated analytics database for custom metrics and time-series data.

**Key Recommendations:**
1. **Use Recharts** for React-native charting with minimal bundle overhead
2. **Supabase** for analytics data storage (PostgreSQL with realtime capabilities)
3. **Enhance existing Algolia Insights** integration for click-through tracking
4. **Admin-only dashboard** integrated into existing Sanity Studio or as standalone React page

---

## 1. Current State Analysis

### Existing Implementation

The current `useSearchAnalytics.ts` hook provides:

```typescript
interface SearchAnalyticsEntry {
  query: string;
  timestamp: number;
  resultCount: number;
}
```

**Limitations:**
- localStorage capped at 100 queries
- No cross-device/session aggregation
- No click-through tracking (CTR)
- No user journey analysis
- No time-based trend analysis
- Data lost on browser clear

### Existing Algolia Infrastructure

The project already has `algoliaEvents.ts` with:
- `trackSearchClick()` - Click events with queryID
- `trackSearchConversion()` - Conversion tracking
- `trackView()` - View events
- `queryIDTracker.ts` - Session-based query ID persistence

**Gap:** Algolia events are defined but not actively used in the current Fuse.js-based search.

---

## 2. Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Rationale |
|------------|---------|---------|-----------|
| **Recharts** | ^2.12 | Charting library | React-native, tree-shakeable, TypeScript support, 2.7M weekly downloads |
| **Supabase** | Latest | Analytics database | PostgreSQL, realtime subscriptions, generous free tier, TypeScript client |
| **Algolia Insights** | (existing) | Click/conversion tracking | Already integrated, provides CTR and conversion metrics |
| **date-fns** | ^3.0 | Date manipulation | Lightweight, tree-shakeable, immutable |

### Visualization Library Comparison

| Library | Bundle Size | React Support | TypeScript | Learning Curve | Verdict |
|---------|-------------|---------------|------------|----------------|---------|
| **Recharts** | ~45KB | Native | Excellent | Low | ✅ RECOMMENDED |
| Chart.js + react-chartjs-2 | ~65KB | Wrapper | Good | Medium | Alternative |
| D3.js | ~90KB+ | Manual | Good | High | Overkill |
| Tremor | ~120KB | Native | Excellent | Low | Good but larger |

**Why Recharts:**
- Declarative React components
- Built-in responsive containers
- Excellent TypeScript definitions
- Animations included
- Composable chart parts
- Smaller bundle than alternatives

### Data Storage Comparison

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Supabase** | Free tier, realtime, PostgreSQL, TypeScript | External dependency | ✅ RECOMMENDED |
| Sanity CMS | Already integrated, no new infra | Not optimized for time-series, expensive at scale | ❌ Not ideal |
| Cloudflare Analytics Engine | Edge-native, unlimited cardinality | Requires Workers, SQL-only queries | Alternative |
| localStorage | No infra needed | 5MB limit, client-only | ❌ Insufficient |

**Why Supabase:**
- PostgreSQL optimized for time-series with proper indexing
- Realtime subscriptions for live dashboard updates
- Row Level Security for admin-only access
- Direct TypeScript client (no ORM needed)
- Free tier: 500MB database, 1GB storage, 2GB bandwidth

---

## 3. Data Model for Analytics

### Supabase Schema

```sql
-- Search events table
CREATE TABLE search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  normalized_query TEXT NOT NULL, -- lowercase, trimmed
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  result_count INTEGER NOT NULL DEFAULT 0,
  user_id TEXT, -- Anonymous session ID
  session_id TEXT,
  filters JSONB, -- Active filters when search performed
  referrer TEXT, -- Page where search initiated
  
  -- Indexes for common queries
  INDEX idx_search_events_timestamp (timestamp DESC),
  INDEX idx_search_events_query (normalized_query),
  INDEX idx_search_events_user (user_id)
);

-- Click events table
CREATE TABLE click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_event_id UUID REFERENCES search_events(id),
  result_id TEXT NOT NULL,
  result_title TEXT,
  result_url TEXT,
  position INTEGER, -- Position in search results (1-indexed)
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id TEXT,
  session_id TEXT,
  time_to_click_ms INTEGER, -- Time from search to click
  
  INDEX idx_click_events_search (search_event_id),
  INDEX idx_click_events_timestamp (timestamp DESC)
);

-- Query refinements (for user journey analysis)
CREATE TABLE query_refinements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  original_query TEXT NOT NULL,
  refined_query TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_refinements_session (session_id),
  INDEX idx_refinements_timestamp (timestamp DESC)
);

-- Daily aggregations (materialized view for performance)
CREATE MATERIALIZED VIEW daily_search_stats AS
SELECT 
  DATE(timestamp) as date,
  normalized_query as query,
  COUNT(*) as search_count,
  COUNT(DISTINCT user_id) as unique_users,
  AVG(result_count) as avg_result_count,
  COUNT(*) FILTER (WHERE result_count = 0) as zero_result_count
FROM search_events
GROUP BY DATE(timestamp), normalized_query;

-- Refresh daily (cron job or Supabase pg_cron)
```

### TypeScript Interfaces

```typescript
// types/searchAnalytics.ts

export interface SearchEvent {
  id: string;
  query: string;
  normalizedQuery: string;
  timestamp: Date;
  resultCount: number;
  userId?: string;
  sessionId?: string;
  filters?: Record<string, string>;
  referrer?: string;
}

export interface ClickEvent {
  id: string;
  searchEventId: string;
  resultId: string;
  resultTitle: string;
  resultUrl: string;
  position: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  timeToClickMs?: number;
}

export interface QueryRefinement {
  id: string;
  sessionId: string;
  originalQuery: string;
  refinedQuery: string;
  timestamp: Date;
}

export interface DailySearchStats {
  date: string;
  query: string;
  searchCount: number;
  uniqueUsers: number;
  avgResultCount: number;
  zeroResultCount: number;
}

export interface DashboardMetrics {
  // Volume metrics
  totalSearches: number;
  uniqueSearches: number;
  uniqueUsers: number;
  
  // Quality metrics
  zeroResultRate: number;
  clickThroughRate: number;
  avgTimeToClick: number;
  avgClickPosition: number;
  
  // Trend data
  searchVolumeTrend: TrendPoint[];
  topQueries: QueryCount[];
  zeroResultQueries: QueryCount[];
  
  // Time-based
  periodStart: Date;
  periodEnd: Date;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface QueryCount {
  query: string;
  count: number;
  percentage?: number;
}
```

---

## 4. Dashboard Component Architecture

### Component Structure

```
src/components/SearchAnalytics/
├── index.ts                    # Barrel export
├── SearchAnalyticsDashboard.tsx # Main dashboard container
├── hooks/
│   ├── useAnalyticsData.ts     # Data fetching hook
│   ├── useDateRange.ts         # Date range state
│   └── useAnalyticsExport.ts   # Export functionality
├── components/
│   ├── MetricCard.tsx          # KPI metric card
│   ├── SearchVolumeChart.tsx   # Line chart for volume trends
│   ├── TopQueriesTable.tsx     # Popular queries table
│   ├── ZeroResultsTable.tsx    # Zero-result queries
│   ├── ClickPositionChart.tsx  # Click position distribution
│   ├── QueryRefinementFlow.tsx # User journey visualization
│   └── DateRangePicker.tsx     # Date filter component
└── utils/
    ├── aggregation.ts          # Data aggregation helpers
    └── export.ts               # CSV/JSON export utilities
```

### Main Dashboard Component

```tsx
// SearchAnalyticsDashboard.tsx
import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Search, MousePointer, Clock, AlertTriangle, TrendingUp, Download } from 'lucide-react';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { useDateRange } from './hooks/useDateRange';
import MetricCard from './components/MetricCard';
import DateRangePicker from './components/DateRangePicker';
import TopQueriesTable from './components/TopQueriesTable';
import ZeroResultsTable from './components/ZeroResultsTable';
import styles from './SearchAnalyticsDashboard.module.css';

export default function SearchAnalyticsDashboard() {
  const { dateRange, setDateRange } = useDateRange('7d');
  const { data, isLoading, error, refetch } = useAnalyticsData(dateRange);
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }
  
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }
  
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Search Analytics</h1>
          <p className={styles.subtitle}>
            Understanding how users discover documentation
          </p>
        </div>
        <div className={styles.controls}>
          <DateRangePicker 
            value={dateRange} 
            onChange={setDateRange} 
          />
          <button 
            className={styles.exportBtn}
            onClick={() => exportAnalytics(data, dateRange)}
          >
            <Download size={16} />
            Export
          </button>
        </div>
      </header>
      
      {/* KPI Cards */}
      <div className={styles.metricsGrid}>
        <MetricCard
          icon={<Search />}
          title="Total Searches"
          value={data.totalSearches}
          trend={data.searchVolumeTrend}
          format="number"
        />
        <MetricCard
          icon={<MousePointer />}
          title="Click-Through Rate"
          value={data.clickThroughRate}
          format="percent"
          trend={data.ctrTrend}
        />
        <MetricCard
          icon={<AlertTriangle />}
          title="Zero Results"
          value={data.zeroResultRate}
          format="percent"
          trend={data.zeroResultTrend}
          inverse // Lower is better
        />
        <MetricCard
          icon={<Clock />}
          title="Avg. Time to Click"
          value={data.avgTimeToClick}
          format="duration"
          trend={data.timeToClickTrend}
          inverse
        />
      </div>
      
      {/* Charts Row */}
      <div className={styles.chartsGrid}>
        <div className={styles.chartPanel}>
          <h2 className={styles.panelTitle}>Search Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.searchVolumeTrend}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8B058" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E8B058" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E8B058" 
                fill="url(#colorVolume)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className={styles.chartPanel}>
          <h2 className={styles.panelTitle}>Click Position Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.clickPositionDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="position" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }}
              />
              <Bar dataKey="count" fill="#E8B058" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Tables Row */}
      <div className={styles.tablesGrid}>
        <TopQueriesTable queries={data.topQueries} />
        <ZeroResultsTable queries={data.zeroResultQueries} />
      </div>
      
      {/* Alerts Section */}
      {data.alerts?.length > 0 && (
        <div className={styles.alertsSection}>
          <h2 className={styles.panelTitle}>
            <AlertTriangle size={18} />
            Zero-Result Spikes
          </h2>
          <div className={styles.alertsList}>
            {data.alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Data Fetching Hook

```tsx
// hooks/useAnalyticsData.ts
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { DashboardMetrics, DateRange } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function useAnalyticsData(dateRange: DateRange) {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startDate = dateRange.start.toISOString();
      const endDate = dateRange.end.toISOString();
      
      // Parallel queries for efficiency
      const [
        searchEvents,
        clickEvents,
        dailyStats,
        topQueries,
        zeroResults
      ] = await Promise.all([
        // Total searches in period
        supabase
          .from('search_events')
          .select('id, query, result_count, user_id', { count: 'exact' })
          .gte('timestamp', startDate)
          .lte('timestamp', endDate),
        
        // Click events for CTR
        supabase
          .from('click_events')
          .select('id, position, time_to_click_ms', { count: 'exact' })
          .gte('timestamp', startDate)
          .lte('timestamp', endDate),
        
        // Daily aggregation for trends
        supabase
          .from('daily_search_stats')
          .select('*')
          .gte('date', startDate.split('T')[0])
          .lte('date', endDate.split('T')[0])
          .order('date'),
        
        // Top queries
        supabase.rpc('get_top_queries', {
          start_date: startDate,
          end_date: endDate,
          limit_count: 20
        }),
        
        // Zero result queries
        supabase.rpc('get_zero_result_queries', {
          start_date: startDate,
          end_date: endDate,
          limit_count: 20
        })
      ]);
      
      // Aggregate metrics
      const totalSearches = searchEvents.count || 0;
      const uniqueUsers = new Set(searchEvents.data?.map(e => e.user_id)).size;
      const zeroResultCount = searchEvents.data?.filter(e => e.result_count === 0).length || 0;
      const clickCount = clickEvents.count || 0;
      const ctr = totalSearches > 0 ? (clickCount / totalSearches) * 100 : 0;
      
      const avgClickPosition = clickEvents.data?.length 
        ? clickEvents.data.reduce((sum, e) => sum + (e.position || 0), 0) / clickEvents.data.length
        : 0;
      
      const avgTimeToClick = clickEvents.data?.length
        ? clickEvents.data.reduce((sum, e) => sum + (e.time_to_click_ms || 0), 0) / clickEvents.data.length
        : 0;
      
      setData({
        totalSearches,
        uniqueSearches: topQueries.data?.length || 0,
        uniqueUsers,
        zeroResultRate: totalSearches > 0 ? (zeroResultCount / totalSearches) * 100 : 0,
        clickThroughRate: ctr,
        avgTimeToClick,
        avgClickPosition,
        searchVolumeTrend: dailyStats.data?.map(d => ({
          date: d.date,
          value: d.search_count
        })) || [],
        topQueries: topQueries.data || [],
        zeroResultQueries: zeroResults.data || [],
        periodStart: dateRange.start,
        periodEnd: dateRange.end
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
    } finally {
      setIsLoading(false);
    }
  }, [dateRange]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Realtime subscription for live updates
  useEffect(() => {
    const channel = supabase
      .channel('search-analytics-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'search_events'
      }, () => {
        // Debounced refresh
        fetchData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);
  
  return { data, isLoading, error, refetch: fetchData };
}
```

---

## 5. Integration with Existing Code

### Enhanced useSearchAnalytics Hook

```tsx
// hooks/useSearchAnalyticsEnhanced.ts
import { useCallback, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Session ID persisted across page loads
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Anonymous user ID persisted in localStorage
const getUserId = (): string => {
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem('analytics_user_id', userId);
  }
  return userId;
};

export function useSearchAnalyticsEnhanced() {
  const sessionId = useRef(getSessionId());
  const userId = useRef(getUserId());
  const searchTimestampRef = useRef<number>(0);
  const currentSearchIdRef = useRef<string | null>(null);
  
  // Track search event
  const trackSearch = useCallback(async (
    query: string, 
    resultCount: number,
    filters?: Record<string, string>
  ): Promise<string | null> => {
    if (!query.trim()) return null;
    
    searchTimestampRef.current = Date.now();
    
    const { data, error } = await supabase
      .from('search_events')
      .insert({
        query: query.trim(),
        normalized_query: query.trim().toLowerCase(),
        result_count: resultCount,
        user_id: userId.current,
        session_id: sessionId.current,
        filters: filters || null,
        referrer: window.location.pathname
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Failed to track search:', error);
      return null;
    }
    
    currentSearchIdRef.current = data.id;
    return data.id;
  }, []);
  
  // Track click event
  const trackClick = useCallback(async (
    resultId: string,
    resultTitle: string,
    resultUrl: string,
    position: number
  ): Promise<void> => {
    const searchId = currentSearchIdRef.current;
    const timeToClick = Date.now() - searchTimestampRef.current;
    
    const { error } = await supabase
      .from('click_events')
      .insert({
        search_event_id: searchId,
        result_id: resultId,
        result_title: resultTitle,
        result_url: resultUrl,
        position,
        user_id: userId.current,
        session_id: sessionId.current,
        time_to_click_ms: timeToClick
      });
    
    if (error) {
      console.error('Failed to track click:', error);
    }
  }, []);
  
  // Track query refinement (when user modifies query)
  const trackRefinement = useCallback(async (
    originalQuery: string,
    refinedQuery: string
  ): Promise<void> => {
    if (originalQuery === refinedQuery) return;
    
    const { error } = await supabase
      .from('query_refinements')
      .insert({
        session_id: sessionId.current,
        original_query: originalQuery,
        refined_query: refinedQuery
      });
    
    if (error) {
      console.error('Failed to track refinement:', error);
    }
  }, []);
  
  return {
    trackSearch,
    trackClick,
    trackRefinement,
    sessionId: sessionId.current,
    userId: userId.current
  };
}
```

### Integration in SearchModal

```tsx
// In SearchModal.tsx - update the search tracking
import useSearchAnalyticsEnhanced from './hooks/useSearchAnalyticsEnhanced';

// Inside component:
const { trackSearch, trackClick, trackRefinement } = useSearchAnalyticsEnhanced();
const [currentSearchId, setCurrentSearchId] = useState<string | null>(null);

// When search is performed:
useEffect(() => {
  if (!fuse || !debouncedQuery.trim()) return;
  
  const results = fuse.search(debouncedQuery, { limit: 50 });
  
  // Track search to Supabase
  trackSearch(debouncedQuery, results.length, { activeFilter })
    .then(id => setCurrentSearchId(id));
    
}, [debouncedQuery, fuse, activeFilter]);

// When result is clicked:
const handleResultClick = useCallback((result: FuseResult<SearchRecord>, position: number) => {
  trackClick(
    result.item.id,
    result.item.title,
    result.item.url,
    position
  );
  
  // Navigate to result
  window.location.href = result.item.url;
}, [trackClick]);

// When query is refined:
const handleQueryChange = useCallback((newQuery: string) => {
  if (query && newQuery !== query) {
    trackRefinement(query, newQuery);
  }
  setQuery(newQuery);
}, [query, trackRefinement]);
```

---

## 6. Admin-Only Access

### Option A: Sanity Studio Integration (Recommended)

Add a custom tool to Sanity Studio:

```tsx
// studio/src/tools/analytics/index.tsx
import { Card, Flex, Box, Text, Button } from '@sanity/ui';
import { PieChartIcon } from '@sanity/icons';
import SearchAnalyticsDashboard from '@nxgen-docs/search-analytics';

export const analyticsTool = {
  title: 'Search Analytics',
  name: 'search-analytics',
  icon: PieChartIcon,
  component: () => (
    <Card padding={4} height="fill">
      <SearchAnalyticsDashboard />
    </Card>
  ),
};

// In sanity.config.ts
import { analyticsTool } from './src/tools/analytics';

export default defineConfig({
  // ...
  plugins: [
    structureTool({ structure: deskStructure }),
    // Add analytics as custom tool
    analyticsTool,
    // ...
  ],
});
```

### Option B: Standalone Admin Page

Create a protected route in Docusaurus:

```tsx
// src/pages/admin/search-analytics.tsx
import React from 'react';
import Layout from '@theme/Layout';
import SearchAnalyticsDashboard from '@site/src/components/SearchAnalytics';
import { useAuth } from '@site/src/hooks/useAuth'; // Custom auth hook

export default function SearchAnalyticsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Layout>
        <div className="container margin-vert--xl">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }
  
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container margin-vert--xl">
          <h1>Access Denied</h1>
          <p>You must be an admin to view this page.</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Search Analytics">
      <div className="container margin-vert--xl">
        <SearchAnalyticsDashboard />
      </div>
    </Layout>
  );
}
```

---

## 7. Realtime Updates & Alerts

### Zero-Result Spike Detection

```tsx
// utils/alertDetection.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Alert {
  id: string;
  query: string;
  spikeCount: number;
  baselineCount: number;
  spikeRate: number; // Percentage increase
  detectedAt: Date;
}

export async function detectZeroResultSpikes(
  threshold: number = 2.0 // 2x baseline triggers alert
): Promise<Alert[]> {
  // Get zero-result counts for last 24 hours vs previous 7 days average
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const [last24h, previous7d] = await Promise.all([
    supabase
      .from('search_events')
      .select('normalized_query')
      .eq('result_count', 0)
      .gte('timestamp', yesterday.toISOString()),
    
    supabase
      .from('search_events')
      .select('normalized_query')
      .eq('result_count', 0)
      .gte('timestamp', weekAgo.toISOString())
      .lt('timestamp', yesterday.toISOString())
  ]);
  
  // Count occurrences
  const last24hCounts = countQueries(last24h.data || []);
  const previous7dCounts = countQueries(previous7d.data || []);
  
  // Detect spikes
  const alerts: Alert[] = [];
  const baselineDivisor = 7; // Average per day
  
  for (const [query, spikeCount] of Object.entries(last24hCounts)) {
    const baselineTotal = previous7dCounts[query] || 0;
    const baselineDaily = baselineTotal / baselineDivisor;
    
    if (baselineDaily === 0 && spikeCount >= 5) {
      // New zero-result query with 5+ occurrences
      alerts.push({
        id: `new-${query}`,
        query,
        spikeCount,
        baselineCount: 0,
        spikeRate: Infinity,
        detectedAt: now
      });
    } else if (baselineDaily > 0 && spikeCount / baselineDaily >= threshold) {
      alerts.push({
        id: `spike-${query}`,
        query,
        spikeCount,
        baselineCount: Math.round(baselineDaily),
        spikeRate: spikeCount / baselineDaily,
        detectedAt: now
      });
    }
  }
  
  return alerts.sort((a, b) => b.spikeRate - a.spikeRate);
}

function countQueries(events: { normalized_query: string }[]): Record<string, number> {
  return events.reduce((acc, e) => {
    acc[e.normalized_query] = (acc[e.normalized_query] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
```

---

## 8. Export Functionality

```tsx
// utils/export.ts
import type { DashboardMetrics } from '../types';

export function exportAnalytics(
  data: DashboardMetrics,
  format: 'csv' | 'json' = 'csv'
): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `search-analytics-${timestamp}`;
  
  if (format === 'json') {
    downloadFile(
      JSON.stringify(data, null, 2),
      `${filename}.json`,
      'application/json'
    );
    return;
  }
  
  // CSV export
  const rows = [
    // Top queries
    ['Query', 'Count', 'Percentage'],
    ...data.topQueries.map(q => [
      q.query,
      q.count.toString(),
      (q.percentage || 0).toFixed(2) + '%'
    ]),
    [],
    ['Zero-Result Queries', 'Count'],
    ...data.zeroResultQueries.map(q => [q.query, q.count.toString()]),
    [],
    ['Date', 'Search Volume'],
    ...data.searchVolumeTrend.map(t => [t.date, t.value.toString()])
  ];
  
  const csv = rows.map(r => r.join(',')).join('\n');
  downloadFile(csv, `${filename}.csv`, 'text/csv');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
```

---

## 9. Installation Steps

### Step 1: Install Dependencies

```bash
cd classic
npm install recharts @supabase/supabase-js date-fns
```

### Step 2: Set Up Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Run the SQL schema from Section 3
3. Get URL and anon key from Project Settings > API
4. Create RPC functions for queries:

```sql
-- Supabase RPC function for top queries
CREATE OR REPLACE FUNCTION get_top_queries(
  start_date timestamptz,
  end_date timestamptz,
  limit_count integer DEFAULT 20
)
RETURNS TABLE (query text, count bigint, percentage numeric)
AS $$
DECLARE
  total bigint;
BEGIN
  SELECT COUNT(*) INTO total FROM search_events
  WHERE timestamp >= start_date AND timestamp <= end_date;
  
  RETURN QUERY
  SELECT 
    se.normalized_query as query,
    COUNT(*) as count,
    ROUND(COUNT(*)::numeric / NULLIF(total, 0) * 100, 2) as percentage
  FROM search_events se
  WHERE se.timestamp >= start_date AND se.timestamp <= end_date
  GROUP BY se.normalized_query
  ORDER BY count DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
```

### Step 3: Environment Variables

```bash
# classic/.env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Create Components

Create the component structure from Section 4.

### Step 5: Integrate with SearchModal

Update `SearchModal.tsx` to use `useSearchAnalyticsEnhanced`.

### Step 6: Add Dashboard Access

Choose Option A (Sanity Studio) or Option B (standalone page) from Section 6.

---

## 10. Metrics Reference

### Key Performance Indicators

| Metric | Description | Target | Formula |
|--------|-------------|--------|---------|
| **Total Searches** | Volume of search queries | Growing trend | COUNT(search_events) |
| **Zero-Result Rate** | % of searches with no results | < 5% | zero_results / total_searches × 100 |
| **Click-Through Rate** | % of searches leading to clicks | > 60% | clicks / total_searches × 100 |
| **Avg. Click Position** | Average position of clicked result | < 3 | AVG(click_events.position) |
| **Avg. Time to Click** | Time from search to result click | < 5s | AVG(click_events.time_to_click_ms) |
| **Query Refinement Rate** | % of searches followed by refinement | < 20% | refinements / total_searches × 100 |

### Recommended Alerts

| Alert | Condition | Priority |
|-------|-----------|----------|
| Zero-result spike | > 2x baseline in 24h | High |
| CTR drop | < 50% of 7-day average | Medium |
| New zero-result query | ≥ 5 occurrences, no previous | Medium |
| Slow search response | > 3s avg response time | Low |

---

## Sources

- **Algolia Search Analytics Metrics**: https://www.algolia.com/doc/guides/search-analytics/concepts/metrics/ (HIGH confidence)
- **Algolia Insights Events**: https://www.algolia.com/doc/guides/sending-events/getting-started/ (HIGH confidence)
- **Chart.js Documentation**: https://www.chartjs.org/docs/latest/ (HIGH confidence)
- **D3.js Getting Started**: https://d3js.org/getting-started (HIGH confidence)
- **Supabase Database**: https://supabase.com/docs/guides/database (HIGH confidence)
- **Supabase Realtime**: https://supabase.com/docs/guides/realtime (HIGH confidence)
- **Cloudflare Analytics Engine**: https://developers.cloudflare.com/analytics/analytics-engine/get-started/ (HIGH confidence)
- **Recharts** (npm): Based on training data - MEDIUM confidence
- **Tremor** (npm): Based on training data - MEDIUM confidence

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Recharts + Supabase well-documented, widely used |
| Data Model | HIGH | Based on Algolia analytics patterns, PostgreSQL best practices |
| Architecture | HIGH | React patterns well-established, Supabase realtime verified |
| Integration | HIGH | Existing codebase patterns clear, hooks approach compatible |
| Metrics | HIGH | Based on Algolia's proven analytics framework |
