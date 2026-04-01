// classic/src/components/Bookmark/BookmarksList.tsx
// Bookmarks sidebar list component
//
// Purpose:
//   - Show recent bookmarks in sidebar
//   - Quick navigation to bookmarked pages
//   - Remove bookmarks directly from list
//   - Link to full bookmarks page
//
// Usage:
//   <BookmarksList maxItems={10} />

import React, { useState } from 'react';
import { Bookmark, X, FileText, File, Video, BookOpen, Loader2 } from 'lucide-react';
import Link from '@docusaurus/Link';
import { clsx } from 'clsx';
import { useBookmarks } from '../../hooks/useBookmarks';
import { Bookmark as BookmarkType, BookmarkItemType } from '../../services/bookmarks';
import '../../css/components/bookmark.css';

export interface BookmarksListProps {
  /** Maximum number of bookmarks to show */
  maxItems?: number;
  /** Show "View all" link */
  showViewAll?: boolean;
  /** Additional CSS class */
  className?: string;
}

// Type icons
const typeIcons: Record<BookmarkItemType, typeof FileText> = {
  document: FileText,
  page: File,
  video: Video,
  section: BookOpen,
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

// Loading skeleton
function BookmarkSkeleton() {
  return (
    <div className="bookmark-skeleton">
      <div className="bookmark-skeleton-avatar" />
      <div className="bookmark-skeleton-content">
        <div className="bookmark-skeleton-title" />
        <div className="bookmark-skeleton-meta" />
      </div>
    </div>
  );
}

// Empty state
function EmptyState() {
  return (
    <div className="bookmarks-empty">
      <Bookmark className="bookmarks-empty-icon" />
      <p className="bookmarks-empty-text">No bookmarks yet</p>
    </div>
  );
}

// Bookmark list item
function BookmarkListItem({
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
    <li className="bookmark-list-item">
      <Link to={bookmark.item_url} className="bookmark-list-item-link">
        <span className="bookmark-list-item-title">{bookmark.item_title}</span>
        <span className="bookmark-list-item-meta">
          <TypeIcon className="w-3 h-3" />
          {formatRelativeTime(bookmark.created_at)}
        </span>
      </Link>
      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="bookmark-list-item-remove"
        title="Remove bookmark"
        aria-label="Remove bookmark"
      >
        {isRemoving ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <X className="w-3.5 h-3.5" />
        )}
      </button>
    </li>
  );
}

/**
 * Bookmarks list component for sidebar.
 * Shows recent bookmarks with quick navigation and removal.
 */
export function BookmarksList({
  maxItems = 10,
  showViewAll = true,
  className,
}: BookmarksListProps): JSX.Element {
  const { bookmarks, loading, removeBookmark, count } = useBookmarks();

  // Limit displayed bookmarks
  const displayedBookmarks = bookmarks.slice(0, maxItems);

  const handleRemove = async (id: string) => {
    try {
      await removeBookmark(id);
    } catch (error) {
      console.error('[BookmarksList] Error removing bookmark:', error);
    }
  };

  return (
    <div className={clsx('bookmarks-sidebar', className)}>
      {/* Header */}
      <div className="bookmarks-sidebar-header">
        <div className="bookmarks-sidebar-title">
          <Bookmark className="bookmarks-sidebar-title-icon" />
          <span>Bookmarks</span>
          {count > 0 && (
            <span className="text-xs opacity-60">({count})</span>
          )}
        </div>
        {showViewAll && count > maxItems && (
          <Link to="/profile/bookmarks" className="bookmarks-sidebar-link">
            View all
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        // Loading skeletons
        <div>
          {Array.from({ length: 3 }).map((_, i) => (
            <BookmarkSkeleton key={i} />
          ))}
        </div>
      ) : displayedBookmarks.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="bookmark-list">
          {displayedBookmarks.map((bookmark) => (
            <BookmarkListItem
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={handleRemove}
            />
          ))}
        </ul>
      )}

      {/* View all link for empty state */}
      {showViewAll && !loading && count === 0 && (
        <Link
          to="/docs/getting-started"
          className="bookmarks-sidebar-link"
          style={{ display: 'block', textAlign: 'center', marginTop: '0.5rem' }}
        >
          Start exploring
        </Link>
      )}
    </div>
  );
}

export default BookmarksList;
