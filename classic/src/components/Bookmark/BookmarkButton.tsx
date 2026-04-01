// classic/src/components/Bookmark/BookmarkButton.tsx
// Bookmark toggle button for documentation pages
//
// Purpose:
//   - Toggle bookmark state for current page
//   - Show filled star when bookmarked, outline when not
//   - Display tooltip with action description
//   - Handle loading and error states
//
// Usage:
//   <BookmarkButton
//     slug="/docs/getting-started"
//     title="Getting Started"
//     url="/docs/getting-started"
//     type="document"
//   />

import React, { useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Star, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useBookmarks } from '../../hooks/useBookmarks';
import { BookmarkItemType } from '../../services/bookmarks';
import '../../css/components/bookmark.css';

export interface BookmarkButtonProps {
  /** Unique slug for the page (usually the URL path) */
  slug: string;
  /** Display title for the bookmark */
  title: string;
  /** Full URL to the page */
  url: string;
  /** Type of content being bookmarked */
  type?: BookmarkItemType;
  /** Size variant */
  size?: 'default' | 'small';
  /** Show text label */
  showLabel?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Bookmark toggle button component.
 * Shows a star icon that fills when bookmarked.
 */
export function BookmarkButton({
  slug,
  title,
  url,
  type = 'document',
  size = 'default',
  showLabel = false,
  className,
}: BookmarkButtonProps): JSX.Element | null {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { isBookmarked, toggleBookmark, loading } = useBookmarks();
  const [isToggling, setIsToggling] = useState(false);

  const bookmarked = isBookmarked(slug);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Prompt login if not authenticated
      if (!isAuthenticated) {
        loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
        });
        return;
      }

      setIsToggling(true);
      try {
        await toggleBookmark({
          item_type: type,
          item_slug: slug,
          item_title: title,
          item_url: url,
        });
      } catch (error) {
        console.error('[BookmarkButton] Error toggling bookmark:', error);
      } finally {
        setIsToggling(false);
      }
    },
    [isAuthenticated, loginWithRedirect, toggleBookmark, type, slug, title, url]
  );

  const isLoading = loading || isToggling;

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={clsx(
        'bookmark-button',
        size === 'small' && 'bookmark-button--small',
        bookmarked && 'bookmark-button--bookmarked',
        isLoading && 'bookmark-button--loading',
        className
      )}
      title={bookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
      aria-label={bookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'}
      aria-pressed={bookmarked}
    >
      {isLoading ? (
        <Loader2 className="bookmark-icon animate-spin" />
      ) : (
        <Star
          className={clsx(
            'bookmark-icon',
            bookmarked ? 'bookmark-icon--filled' : 'bookmark-icon--outline'
          )}
          fill={bookmarked ? 'currentColor' : 'none'}
        />
      )}
      {showLabel && (
        <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      )}
    </button>
  );
}

export default BookmarkButton;
