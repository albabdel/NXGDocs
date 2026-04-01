import React, { useState, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Clock,
  Trash2,
  Download,
  Search,
  FileText,
  Video,
  File,
  AlertCircle,
} from 'lucide-react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { HistoryList } from '../../components/History/HistoryList';
import { clearHistory, getHistoryStats, HistoryItemType } from '../../services/history';
import { useSupabase } from '../../lib/supabase';
import '../../css/components/history.css';

type FilterType = 'all' | HistoryItemType;

/**
 * Full reading history page.
 * Shows all visited pages with filtering, search, and management options.
 */
export default function HistoryPage(): React.JSX.Element {
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect } = useAuth0();
  const { getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);
  
  const { history, loading, error, clearHistory: clearAllHistory, refetch } = useReadingHistory();
  
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<{
    totalItems: number;
    completedItems: number;
    totalTimeSeconds: number;
    itemsByType: Record<HistoryItemType, number>;
  } | null>(null);
  const [clearing, setClearing] = useState(false);

  // Load stats on mount
  React.useEffect(() => {
    if (isAuthenticated) {
      getHistoryStats(supabase).then(setStats).catch(console.error);
    }
  }, [isAuthenticated, supabase, history]);

  // Filter by type
  const filteredHistory = useMemo(() => {
    if (filterType === 'all') return history;
    return history.filter((item) => item.item_type === filterType);
  }, [history, filterType]);

  // Handle clear all history
  const handleClearAll = useCallback(async () => {
    if (!window.confirm('Are you sure you want to clear all your reading history? This cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      await clearAllHistory();
      setStats(null);
    } catch (err) {
      console.error('Failed to clear history:', err);
    } finally {
      setClearing(false);
    }
  }, [clearAllHistory]);

  // Export history as JSON
  const handleExport = useCallback(() => {
    const data = JSON.stringify(history, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [history]);

  // Format total time
  const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <Layout title="Reading History" description="Your reading history">
        <div className="history-page">
          <div className="container margin-vert--xl">
            <div className="history-empty">
              <AlertCircle className="history-empty-icon" />
              <h3 className="history-empty-title">Sign in to view your history</h3>
              <p className="history-empty-text">
                Your reading history is private and only available when you're signed in.
              </p>
              <button
                className="button button--primary margin-top--md"
                onClick={() => loginWithRedirect()}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Count by type
  const typeCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: history.length,
      document: 0,
      page: 0,
      video: 0,
    };
    for (const item of history) {
      counts[item.item_type] = (counts[item.item_type] || 0) + 1;
    }
    return counts;
  }, [history]);

  const filterTabs: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Clock className="w-4 h-4" /> },
    { key: 'document', label: 'Docs', icon: <FileText className="w-4 h-4" /> },
    { key: 'page', label: 'Pages', icon: <File className="w-4 h-4" /> },
    { key: 'video', label: 'Videos', icon: <Video className="w-4 h-4" /> },
  ];

  return (
    <Layout title="Reading History" description="Your reading history">
      <div className="history-page">
        <div className="container">
          {/* Header */}
          <div className="history-page-header">
            <h1 className="history-page-title">Reading History</h1>
            <p className="history-page-subtitle">
              Track your progress through the documentation
            </p>
          </div>

          {error && (
            <div className="alert alert--danger margin-bottom--md">
              <p>Failed to load history: {error.message}</p>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="history-stats">
              <div className="history-stat">
                <div className="history-stat-value">{stats.totalItems}</div>
                <div className="history-stat-label">Pages Visited</div>
              </div>
              <div className="history-stat">
                <div className="history-stat-value">{stats.completedItems}</div>
                <div className="history-stat-label">Completed</div>
              </div>
              <div className="history-stat">
                <div className="history-stat-value">
                  {formatTotalTime(stats.totalTimeSeconds)}
                </div>
                <div className="history-stat-label">Time Spent</div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="history-page-controls">
            {/* Filter tabs */}
            <div className="history-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`history-filter-tab ${filterType === tab.key ? 'active' : ''}`}
                  onClick={() => setFilterType(tab.key)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className="history-filter-count">{typeCounts[tab.key]}</span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="history-search">
              <div className="history-search-wrapper">
                <Search className="history-search-icon w-4 h-4" />
                <input
                  type="text"
                  className="history-search-input"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="history-actions">
              <button
                className="history-action-btn"
                onClick={handleExport}
                disabled={history.length === 0}
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button
                className="history-action-btn danger"
                onClick={handleClearAll}
                disabled={clearing || history.length === 0}
              >
                <Trash2 className="w-4 h-4" />
                <span>{clearing ? 'Clearing...' : 'Clear All'}</span>
              </button>
            </div>
          </div>

          {/* History list */}
          {loading ? (
            <div className="history-empty">
              <div className="continue-reading-loading">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="continue-reading-skeleton">
                    <div className="skeleton-icon" />
                    <div className="skeleton-content">
                      <div className="skeleton-title" />
                      <div className="skeleton-meta" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <HistoryList
              items={filteredHistory}
              searchFilter={searchQuery}
              onItemDeleted={refetch}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
