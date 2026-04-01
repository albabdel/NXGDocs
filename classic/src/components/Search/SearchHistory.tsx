// classic/src/components/Search/SearchHistory.tsx
// Search history dropdown component
//
// Purpose:
//   - Show recent searches when search input is focused
//   - Click to repeat search
//   - Remove individual items (x icon)
//   - Clear all button
//   - Only shows when authenticated
//
// Usage:
//   <SearchHistory onSelectSearch={(query) => setSearchQuery(query)} />
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/hooks/useSearchHistory.ts

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Clock, Search, X, Trash2, ExternalLink, ArrowRight } from 'lucide-react';
import { useSearchHistory, formatTimeAgo } from '../../hooks/useSearchHistory';
import type { SearchHistoryItem } from '../../hooks/useSearchHistory';
import '../../css/components/search-history.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchHistoryProps {
  /** Callback when a search is selected */
  onSelectSearch: (query: string) => void;
  /** Whether the dropdown is visible */
  isVisible?: boolean;
  /** Maximum items to display */
  maxItems?: number;
  /** Show clear all button */
  showClearAll?: boolean;
  /** Optional className */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SearchHistory - Display recent search history
 *
 * Shows a dropdown with recent searches that can be clicked to repeat.
 * Includes functionality to remove individual items or clear all.
 *
 * @example
 * <SearchHistory
 *   onSelectSearch={(query) => setSearchQuery(query)}
 *   isVisible={isInputFocused}
 *   maxItems={10}
 * />
 */
export function SearchHistory({
  onSelectSearch,
  isVisible = true,
  maxItems = 10,
  showClearAll = true,
  className,
}: SearchHistoryProps): React.JSX.Element | null {
  const { isAuthenticated } = useAuth0();
  const { history, removeSearch, clearHistory, loading } = useSearchHistory();

  // Don't render if not authenticated or not visible
  if (!isAuthenticated || !isVisible) {
    return null;
  }

  // Get limited items
  const displayItems = history.slice(0, maxItems);

  // Handle item click
  const handleItemClick = (item: SearchHistoryItem) => {
    onSelectSearch(item.query);
  };

  // Handle remove item
  const handleRemove = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    removeSearch(query);
  };

  // Handle clear all
  const handleClearAll = () => {
    if (window.confirm('Clear all search history?')) {
      clearHistory();
    }
  };

  return (
    <div className={`search-history-dropdown ${className || ''}`}>
      {/* Header */}
      <div className="search-history-header">
        <div className="search-history-title">
          <Clock className="search-history-title-icon" />
          <span>Recent Searches</span>
        </div>
        {showClearAll && history.length > 0 && (
          <button
            className="search-history-clear-btn"
            onClick={handleClearAll}
            aria-label="Clear all search history"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="search-history-empty">
          <div className="search-history-empty-icon">
            <Clock className="w-full h-full" />
          </div>
          <p className="search-history-empty-text">Loading...</p>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="search-history-empty">
          <div className="search-history-empty-icon">
            <Search className="w-full h-full" />
          </div>
          <p className="search-history-empty-text">No recent searches</p>
        </div>
      ) : (
        <div className="search-history-list">
          {displayItems.map((item) => (
            <div
              key={item.query}
              className="search-history-item"
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item);
                }
              }}
            >
              <Search className="search-history-item-icon" />
              <div className="search-history-item-content">
                <div className="search-history-item-query">{item.query}</div>
                <div className="search-history-item-meta">
                  <span className="search-history-item-time">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(item.timestamp)}
                  </span>
                  {item.resultClicked && (
                    <span className="search-history-item-result">
                      <ExternalLink className="w-3 h-3" />
                      {item.resultTitle || 'Viewed result'}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="search-history-item-remove"
                onClick={(e) => handleRemove(e, item.query)}
                aria-label={`Remove "${item.query}" from history`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Widget Variant (for sidebar/profile)
// ---------------------------------------------------------------------------

export interface SearchHistoryWidgetProps {
  /** Maximum items to display */
  maxItems?: number;
  /** Show link to full history */
  showLink?: boolean;
}

/**
 * SearchHistoryWidget - Compact version for sidebar/profile
 */
export function SearchHistoryWidget({
  maxItems = 5,
  showLink = true,
}: SearchHistoryWidgetProps): React.JSX.Element | null {
  const { isAuthenticated } = useAuth0();
  const { history, loading } = useSearchHistory();

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const displayItems = history.slice(0, maxItems);

  return (
    <div className="search-history-widget">
      <div className="search-history-widget-header">
        <div className="search-history-widget-title">
          <Clock className="search-history-widget-title-icon" />
          <span>Recent Searches</span>
        </div>
        {showLink && (
          <a href="/profile/history?tab=searches" className="search-history-widget-link">
            View all
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>

      {loading ? null : displayItems.length === 0 ? (
        <div className="search-history-widget-empty">
          <div className="search-history-widget-empty-icon">
            <Search className="w-full h-full" />
          </div>
          <p className="search-history-widget-empty-text">No recent searches</p>
        </div>
      ) : (
        <div className="search-history-widget-list">
          {displayItems.map((item) => (
            <a
              key={item.query}
              href={`/?search=${encodeURIComponent(item.query)}`}
              className="search-history-widget-item"
            >
              <Search className="search-history-widget-item-icon" />
              <span className="search-history-widget-item-query">{item.query}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default SearchHistory;
