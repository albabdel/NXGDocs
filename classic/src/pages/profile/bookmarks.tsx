// classic/src/pages/profile/bookmarks.tsx
// User bookmarks management page
//
// Purpose:
//   - Display all user bookmarks in a grid
//   - Provide search and filter functionality
//   - Allow bulk management of bookmarks
//   - Show empty state for new users

import React, { useState, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth0 } from '@auth0/auth0-react';
import Link from '@docusaurus/Link';
import {
  Bookmark,
  Trash2,
  Search,
  FileText,
  Video,
  File,
  BookOpen,
  AlertCircle,
  Loader2,
  ExternalLink,
  X,
} from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';
import { Bookmark as BookmarkType, BookmarkItemType } from '../../services/bookmarks';
import '../../css/components/bookmark.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterType = 'all' | BookmarkItemType;

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

// Type icons
const typeIcons: Record<BookmarkItemType, typeof FileText> = {
  document: FileText,
  page: File,
  video: Video,
  section: BookOpen,
};

// Type badge classes
const typeBadgeClasses: Record<BookmarkItemType, string> = {
  document: 'bookmark-type-badge--document',
  page: 'bookmark-type-badge--page',
  video: 'bookmark-type-badge--video',
  section: 'bookmark-type-badge--section',
};

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

// Loading skeleton
function BookmarkSkeleton() {
  return (
    <div className="bookmark-card">
      <div className="bookmark-card-header">
        <div className="bookmark-skeleton-avatar" />
        <div className="bookmark-skeleton-content">
          <div className="bookmark-skeleton-title" />
          <div className="bookmark-skeleton-meta" />
        </div>
      </div>
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="bookmarks-page-empty">
      <Bookmark className="bookmarks-page-empty-icon" />
      <h3 className="bookmarks-page-empty-title">No bookmarks yet</h3>
      <p className="bookmarks-page-empty-text">
        Start saving pages to quickly access them later. Click the star icon on any page to bookmark it.
      </p>
      <Link to="/docs/getting-started" className="bookmarks-page-empty-cta">
        <FileText className="w-4 h-4" />
        <span>Explore Documentation</span>
      </Link>
    </div>
  );
}

// Bookmark card
function BookmarkCard({
  bookmark,
  onRemove,
}: {
  bookmark: BookmarkType;
  onRemove: (id: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);
  const TypeIcon = typeIcons[bookmark.item_type] || FileText;

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    await onRemove(bookmark.id);
  };

  return (
    <div className="bookmark-card">
      <Link to={bookmark.item_url} className="bookmark-card-link">
        <div className="bookmark-card-header">
          <div className="bookmark-card-icon">
            <TypeIcon />
          </div>
          <div>
            <h4 className="bookmark-card-title">{bookmark.item_title}</h4>
            <span className={`bookmark-type-badge ${typeBadgeClasses[bookmark.item_type]}`}>
              {bookmark.item_type}
            </span>
          </div>
        </div>
        <p className="bookmark-card-url">{bookmark.item_url}</p>
        <div className="bookmark-card-footer">
          <span className="bookmark-card-date">
            Saved {formatRelativeTime(bookmark.created_at)}
          </span>
          <div className="bookmark-card-actions">
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="bookmark-card-action"
              title="Remove bookmark"
              aria-label="Remove bookmark"
            >
              {isRemoving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
            <span className="bookmark-card-action" title="Open page">
              <ExternalLink className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Auth required screen
function AuthRequired() {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="bookmarks-page-empty">
      <AlertCircle className="bookmarks-page-empty-icon" />
      <h3 className="bookmarks-page-empty-title">Sign in to view your bookmarks</h3>
      <p className="bookmarks-page-empty-text">
        Your bookmarks are private and only available when you're signed in.
      </p>
      <button
        className="bookmarks-page-empty-cta"
        onClick={() => loginWithRedirect()}
        style={{ border: 'none', cursor: 'pointer' }}
      >
        Sign In
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page Content
// ---------------------------------------------------------------------------

function BookmarksPageContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { bookmarks, loading, error, removeBookmark, count, getByType } = useBookmarks();

  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [clearing, setClearing] = useState(false);

  // Filter by type
  const filteredByType = useMemo(() => {
    if (filterType === 'all') return bookmarks;
    return getByType(filterType);
  }, [bookmarks, filterType, getByType]);

  // Filter by search
  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return filteredByType;
    const query = searchQuery.toLowerCase();
    return filteredByType.filter(
      (b) =>
        b.item_title.toLowerCase().includes(query) ||
        b.item_url.toLowerCase().includes(query)
    );
  }, [filteredByType, searchQuery]);

  // Count by type
  const typeCounts = useMemo(() => {
    return {
      all: count,
      document: getByType('document').length,
      page: getByType('page').length,
      video: getByType('video').length,
      section: getByType('section').length,
    };
  }, [count, getByType]);

  // Handle remove single bookmark
  const handleRemove = useCallback(
    async (id: string) => {
      try {
        await removeBookmark(id);
      } catch (err) {
        console.error('Failed to remove bookmark:', err);
      }
    },
    [removeBookmark]
  );

  // Handle clear all
  const handleClearAll = useCallback(async () => {
    if (!window.confirm('Are you sure you want to remove all bookmarks? This cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      for (const bookmark of bookmarks) {
        await removeBookmark(bookmark.id);
      }
    } catch (err) {
      console.error('Failed to clear bookmarks:', err);
    } finally {
      setClearing(false);
    }
  }, [bookmarks, removeBookmark]);

  // Filter tabs
  const filterTabs: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: <Bookmark className="w-4 h-4" /> },
    { key: 'document', label: 'Docs', icon: <FileText className="w-4 h-4" /> },
    { key: 'page', label: 'Pages', icon: <File className="w-4 h-4" /> },
    { key: 'video', label: 'Videos', icon: <Video className="w-4 h-4" /> },
    { key: 'section', label: 'Sections', icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="bookmarks-page">
        <div className="container margin-vert--xl">
          <AuthRequired />
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-page">
      <div className="container margin-vert--lg">
        {/* Header */}
        <div className="bookmarks-page-header">
          <h1 className="bookmarks-page-title">Bookmarks</h1>
          <p className="bookmarks-page-subtitle">
            {count > 0
              ? `${count} saved ${count === 1 ? 'page' : 'pages'}`
              : 'Save pages for quick access'}
          </p>
        </div>

        {error && (
          <div className="alert alert--danger margin-bottom--md">
            <p>Failed to load bookmarks: {error.message}</p>
          </div>
        )}

        {/* Toolbar */}
        {count > 0 && (
          <div className="bookmarks-toolbar">
            {/* Filter tabs */}
            <div className="bookmarks-filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`bookmarks-filter-tab ${filterType === tab.key ? 'bookmarks-filter-tab--active' : ''}`}
                  onClick={() => setFilterType(tab.key)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {typeCounts[tab.key] > 0 && (
                    <span className="text-xs opacity-60 ml-1">({typeCounts[tab.key]})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="bookmarks-search">
              <Search className="bookmarks-search-icon" />
              <input
                type="text"
                className="bookmarks-search-input"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4 opacity-50" />
                </button>
              )}
            </div>

            {/* Clear all button */}
            <button
              className="bookmark-button"
              onClick={handleClearAll}
              disabled={clearing || bookmarks.length === 0}
              style={{ color: '#ef4444' }}
            >
              {clearing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span>{clearing ? 'Clearing...' : 'Clear All'}</span>
            </button>
          </div>
        )}

        {/* Bookmarks grid */}
        {loading || authLoading ? (
          <div className="bookmarks-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <BookmarkSkeleton key={i} />
            ))}
          </div>
        ) : filteredBookmarks.length === 0 ? (
          searchQuery || filterType !== 'all' ? (
            <div className="bookmarks-page-empty" style={{ padding: '2rem' }}>
              <Search className="bookmarks-page-empty-icon" style={{ width: '2rem', height: '2rem' }} />
              <h3 className="bookmarks-page-empty-title">No results</h3>
              <p className="bookmarks-page-empty-text">
                No bookmarks match your search criteria.
              </p>
              <button
                className="bookmarks-page-empty-cta"
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('all');
                }}
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <EmptyState />
          )
        ) : (
          <div className="bookmarks-grid">
            {filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page Export
// ---------------------------------------------------------------------------

export default function BookmarksPage() {
  return (
    <Layout title="Bookmarks | NxGen Docs" description="Your saved pages">
      <BrowserOnly
        fallback={
          <div className="bookmarks-page">
            <div className="container margin-vert--xl">
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
              </div>
            </div>
          </div>
        }
      >
        {() => <BookmarksPageContent />}
      </BrowserOnly>
    </Layout>
  );
}
