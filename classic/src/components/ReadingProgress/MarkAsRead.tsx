// classic/src/components/ReadingProgress/MarkAsRead.tsx
// Mark as read button component
//
// Purpose:
//   - Button to mark page as read
//   - Shows checkmark when marked
//   - Updates progress to 100%
//   - Triggers celebration animation (optional)
//
// Usage:
//   <MarkAsRead slug="/docs/getting-started" title="Getting Started" />
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/services/history.ts

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Check, BookCheck, PartyPopper, X } from 'lucide-react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { updateProgress, recordVisit } from '../../services/history';
import { useSupabase } from '../../lib/supabase';
import '../../css/components/reading-progress.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MarkAsReadProps {
  /** Page slug for tracking */
  slug: string;
  /** Page title */
  title: string;
  /** Page URL */
  url?: string;
  /** Show celebration animation */
  showCelebration?: boolean;
  /** Callback when marked as read */
  onMarked?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MarkAsRead - Button to mark page as read
 *
 * Shows a button that users can click to mark the current page as read.
 * Updates progress to 100% and shows a celebration animation.
 *
 * @example
 * <MarkAsRead
 *   slug="/docs/getting-started"
 *   title="Getting Started"
 *   showCelebration
 * />
 */
export function MarkAsRead({
  slug,
  title,
  url,
  showCelebration = true,
  onMarked,
}: MarkAsReadProps): React.JSX.Element | null {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);
  const { history, refetch } = useReadingHistory();

  const [isMarked, setIsMarked] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // Check if already marked
  useEffect(() => {
    if (!isAuthenticated || !history.length) return;

    const historyItem = history.find((item) => item.item_slug === slug);
    if (historyItem && historyItem.progress_percent >= 100) {
      setIsMarked(true);
    }
  }, [isAuthenticated, history, slug]);

  // Handle mark as read
  const handleMarkAsRead = useCallback(async () => {
    if (!isAuthenticated || isMarking) return;

    setIsMarking(true);

    try {
      // First ensure the item exists in history
      await recordVisit(supabase, {
        item_type: 'document',
        item_slug: slug,
        item_title: title,
        item_url: url || window.location.pathname,
        progress_percent: 100,
        time_spent_seconds: 0,
      });

      // Update progress to 100%
      await updateProgress(supabase, slug, 100, 0);

      setIsMarked(true);
      refetch();

      // Show celebration
      if (showCelebration) {
        setShowCelebrationModal(true);
        setTimeout(() => setShowCelebrationModal(false), 3000);
      }

      // Callback
      onMarked?.();
    } catch (err) {
      console.error('[MarkAsRead] Error marking as read:', err);
    } finally {
      setIsMarking(false);
    }
  }, [
    isAuthenticated,
    isMarking,
    supabase,
    slug,
    title,
    url,
    showCelebration,
    refetch,
    onMarked,
  ]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="mark-as-read-container">
        <button
          className={`mark-as-read-btn ${isMarked ? 'mark-as-read-btn--marked' : 'mark-as-read-btn--unmarked'}`}
          onClick={handleMarkAsRead}
          disabled={isMarking || isMarked}
          aria-label={isMarked ? 'Page marked as read' : 'Mark page as read'}
        >
          {isMarked ? (
            <>
              <BookCheck className="mark-as-read-btn__icon" />
              <span>Marked as Read</span>
            </>
          ) : (
            <>
              <Check className="mark-as-read-btn__icon" />
              <span>Mark as Read</span>
            </>
          )}
        </button>
      </div>

      {/* Celebration Modal */}
      {showCelebrationModal && (
        <div
          className="mark-as-read-celebration"
          role="dialog"
          aria-modal="true"
          aria-label="Page completed"
        >
          <PartyPopper className="mark-as-read-celebration__icon" />
          <h3 className="mark-as-read-celebration__title">Nice work!</h3>
          <p className="mark-as-read-celebration__text">
            You've marked this page as complete.
          </p>
          <button
            onClick={() => setShowCelebrationModal(false)}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--ifm-color-content-secondary)',
            }}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default MarkAsRead;
