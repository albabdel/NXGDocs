// classic/src/components/ReadingProgress/ReadingStats.tsx
// Reading statistics display component
//
// Purpose:
//   - Shows reading statistics
//   - Total pages read
//   - Time spent reading
//   - Completion percentage
//   - Streak (consecutive days)
//
// Usage:
//   <ReadingStats showDetails />
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/hooks/useReadingHistory.ts

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  BookOpen,
  Clock,
  Flame,
  CheckCircle,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { getHistoryStats } from '../../services/history';
import { useSupabase } from '../../lib/supabase';
import { useEffect, useState, useCallback } from 'react';
import '../../css/components/reading-progress.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReadingStatsProps {
  /** Show detailed breakdown */
  showDetails?: boolean;
  /** Time period for stats */
  period?: 'week' | 'month' | 'all';
}

interface Stats {
  totalItems: number;
  completedItems: number;
  totalTimeSeconds: number;
  itemsByType: {
    document: number;
    page: number;
    video: number;
  };
}

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (mins > 0) return `${hours}h ${mins}m`;
  return `${hours}h`;
}

function calculateStreak(history: { last_accessed_at: string }[]): number {
  if (history.length === 0) return 0;

  // Get unique days accessed
  const days = new Set<string>();
  history.forEach((item) => {
    const date = new Date(item.last_accessed_at).toDateString();
    days.add(date);
  });

  // Count consecutive days from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let checkDate = new Date(today);

  while (days.has(checkDate.toDateString())) {
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ReadingStats - Display reading statistics
 *
 * Shows a card with reading statistics including pages read,
 * time spent, completion rate, and reading streak.
 *
 * @example
 * <ReadingStats showDetails period="month" />
 */
export function ReadingStats({
  showDetails = false,
  period = 'all',
}: ReadingStatsProps): React.JSX.Element | null {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);
  const { history, loading: historyLoading } = useReadingHistory();

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch stats from Supabase
  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const data = await getHistoryStats(supabase);
      setStats(data);
    } catch (err) {
      console.error('[ReadingStats] Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Loading state
  if (loading || historyLoading) {
    return (
      <div className="reading-stats-card">
        <div className="reading-stats-header">
          <div className="reading-stats-title">
            <BookOpen className="reading-stats-title-icon" />
            <span>Reading Stats</span>
          </div>
        </div>
        <div className="reading-stats-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="reading-stat" style={{ opacity: 0.5 }}>
              <div
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  borderRadius: '0.5rem',
                  background: 'var(--ifm-color-emphasis-200)',
                  marginBottom: '0.5rem',
                }}
              />
              <div
                style={{
                  height: '1.5rem',
                  width: '60%',
                  borderRadius: '0.25rem',
                  background: 'var(--ifm-color-emphasis-200)',
                }}
              />
              <div
                style={{
                  height: '0.75rem',
                  width: '80%',
                  marginTop: '0.25rem',
                  borderRadius: '0.25rem',
                  background: 'var(--ifm-color-emphasis-100)',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Calculate derived values
  const streak = calculateStreak(history);
  const completionPercent =
    stats && stats.totalItems > 0
      ? Math.round((stats.completedItems / stats.totalItems) * 100)
      : 0;

  // Period label
  const periodLabel =
    period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time';

  return (
    <div className="reading-stats-card">
      {/* Header */}
      <div className="reading-stats-header">
        <div className="reading-stats-title">
          <BookOpen className="reading-stats-title-icon" />
          <span>Reading Stats</span>
        </div>
        <span className="reading-stats-period">{periodLabel}</span>
      </div>

      {/* Stats Grid */}
      <div className="reading-stats-grid">
        <div className="reading-stat reading-stat--pages">
          <FileText className="reading-stat-icon" />
          <div className="reading-stat-value">
            {stats?.totalItems ?? 0}
          </div>
          <div className="reading-stat-label">Pages Viewed</div>
        </div>

        <div className="reading-stat reading-stat--time">
          <Clock className="reading-stat-icon" />
          <div className="reading-stat-value">
            {formatTime(stats?.totalTimeSeconds ?? 0)}
          </div>
          <div className="reading-stat-label">Time Reading</div>
        </div>

        <div className="reading-stat reading-stat--streak">
          <Flame className="reading-stat-icon" />
          <div className="reading-stat-value">{streak}</div>
          <div className="reading-stat-label">Day Streak</div>
        </div>

        <div className="reading-stat reading-stat--complete">
          <CheckCircle className="reading-stat-icon" />
          <div className="reading-stat-value">{completionPercent}%</div>
          <div className="reading-stat-label">Completed</div>
        </div>
      </div>

      {/* Detailed Stats */}
      {showDetails && stats && (
        <div className="reading-stats-details">
          <div className="reading-stats-details-title">Breakdown</div>

          <div className="reading-stats-detail-row">
            <span className="reading-stats-detail-label">Documents read</span>
            <span className="reading-stats-detail-value">
              {stats.itemsByType.document}
            </span>
          </div>

          <div className="reading-stats-detail-row">
            <span className="reading-stats-detail-label">Pages viewed</span>
            <span className="reading-stats-detail-value">
              {stats.itemsByType.page}
            </span>
          </div>

          <div className="reading-stats-detail-row">
            <span className="reading-stats-detail-label">Videos watched</span>
            <span className="reading-stats-detail-value">
              {stats.itemsByType.video}
            </span>
          </div>

          <div className="reading-stats-detail-row">
            <span className="reading-stats-detail-label">Marked as complete</span>
            <span className="reading-stats-detail-value">
              {stats.completedItems} of {stats.totalItems}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mini Stats (for sidebar/profile quick view)
// ---------------------------------------------------------------------------

export interface ReadingStatsMiniProps {
  /** Show streak */
  showStreak?: boolean;
}

/**
 * ReadingStatsMini - Compact stats for sidebar
 */
export function ReadingStatsMini({
  showStreak = true,
}: ReadingStatsMiniProps): React.JSX.Element | null {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);
  const { history } = useReadingHistory();

  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    getHistoryStats(supabase)
      .then(setStats)
      .catch((err) => console.error('[ReadingStatsMini] Error:', err));
  }, [isAuthenticated, supabase]);

  if (!isAuthenticated) {
    return null;
  }

  const streak = calculateStreak(history);

  return (
    <div className="reading-stats-mini">
      <div className="reading-stats-mini__stat">
        <span className="reading-stats-mini__value">
          {stats?.totalItems ?? 0}
        </span>
        <span className="reading-stats-mini__label">Pages</span>
      </div>

      <div className="reading-stats-mini__stat">
        <span className="reading-stats-mini__value">
          {formatTime(stats?.totalTimeSeconds ?? 0)}
        </span>
        <span className="reading-stats-mini__label">Time</span>
      </div>

      {showStreak && (
        <div className="reading-stats-mini__stat">
          <span className="reading-stats-mini__value">{streak}</span>
          <span className="reading-stats-mini__label">Streak</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default ReadingStats;
