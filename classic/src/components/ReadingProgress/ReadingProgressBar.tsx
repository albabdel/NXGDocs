// classic/src/components/ReadingProgress/ReadingProgressBar.tsx
// Reading progress bar component
//
// Purpose:
//   - Thin progress bar at top of page
//   - Updates as user scrolls
//   - Shows percentage
//   - Persists progress to history
//
// Usage:
//   <ReadingProgressBar slug="/docs/getting-started" />
//
// Reference:
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md
//   - classic/src/hooks/useReadingHistory.ts

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BookOpen, TrendingUp } from 'lucide-react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { updateProgress } from '../../services/history';
import { useSupabase } from '../../lib/supabase';
import '../../css/components/reading-progress.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReadingProgressBarProps {
  /** Page slug for tracking */
  slug: string;
  /** Show percentage indicator */
  showIndicator?: boolean;
  /** Debounce time for progress updates (ms) */
  debounceMs?: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ReadingProgressBar - Shows scroll progress at top of page
 *
 * Displays a thin progress bar that fills as the user scrolls.
 * Also shows a floating percentage indicator.
 *
 * @example
 * <ReadingProgressBar slug="/docs/getting-started" showIndicator />
 */
export function ReadingProgressBar({
  slug,
  showIndicator = true,
  debounceMs = 500,
}: ReadingProgressBarProps): React.JSX.Element | null {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);
  const { history } = useReadingHistory();

  const [progress, setProgress] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const lastUpdateRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // Get initial progress from history
  useEffect(() => {
    if (!isAuthenticated || !history.length) return;

    const historyItem = history.find((item) => item.item_slug === slug);
    if (historyItem) {
      setProgress(historyItem.progress_percent || 0);
    }
  }, [isAuthenticated, history, slug]);

  // Calculate scroll progress
  const calculateProgress = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const totalScroll = documentHeight - windowHeight;

    if (totalScroll <= 0) return 100; // Page fits in viewport
    return Math.min(100, Math.round((scrollTop / totalScroll) * 100));
  }, []);

  // Update progress on scroll
  useEffect(() => {
    if (!isAuthenticated) return;

    let ticking = false;
    let debounceTimer: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const newProgress = calculateProgress();
          setProgress(newProgress);
          ticking = false;
        });
        ticking = true;
      }

      // Debounce progress save
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const now = Date.now();
        if (now - lastUpdateRef.current >= debounceMs) {
          lastUpdateRef.current = now;
          const currentTimeOnPage = Math.round((now - startTimeRef.current) / 1000);
          setTimeOnPage(currentTimeOnPage);

          // Save progress to Supabase (use current progress state)
          setProgress((currentProgress) => {
            updateProgress(supabase, slug, currentProgress, currentTimeOnPage).catch(
              (err) => console.error('[ReadingProgressBar] Error saving progress:', err)
            );
            return currentProgress;
          });
        }
      }, debounceMs);
    };

    // Also track time on page
    const timeInterval = setInterval(() => {
      setTimeOnPage(Math.round((Date.now() - startTimeRef.current) / 1000));
    }, 10000); // Update every 10 seconds

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(debounceTimer);
      clearInterval(timeInterval);
    };
  }, [isAuthenticated, supabase, slug, calculateProgress, debounceMs]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Progress bar */}
      <div className="reading-progress-bar">
        <div
          className="reading-progress-bar__fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage indicator */}
      {showIndicator && progress > 0 && (
        <div className="reading-progress-indicator">
          <div className="reading-progress-indicator__badge">
            <TrendingUp className="reading-progress-indicator__icon" />
            <span className="reading-progress-indicator__text">{progress}%</span>
          </div>
        </div>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Progress Ring Component (for stats display)
// ---------------------------------------------------------------------------

export interface ProgressRingProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
}

/**
 * ProgressRing - Circular progress indicator
 */
export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 3,
}: ProgressRingProps): React.JSX.Element {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="reading-progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="reading-progress-ring__bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <circle
          className="reading-progress-ring__fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <span className="reading-progress-ring__text">{Math.round(progress)}%</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default ReadingProgressBar;
