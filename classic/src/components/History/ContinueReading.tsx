import React from 'react';
import Link from '@docusaurus/Link';
import { useAuth0 } from '@auth0/auth0-react';
import { Clock, FileText, Video, File, ArrowRight, BookOpen } from 'lucide-react';
import { useReadingHistory } from '../../hooks/useReadingHistory';
import { HistoryItemType } from '../../services/history';
import './history.css';

interface ContinueReadingProps {
  /** Maximum number of items to show */
  maxItems?: number;
  /** Show welcome message for returning users */
  showWelcome?: boolean;
}

/**
 * Continue Reading widget for the homepage.
 * Shows the user's last visited incomplete pages.
 * Only visible when authenticated.
 */
export function ContinueReading({ 
  maxItems = 5, 
  showWelcome = true 
}: ContinueReadingProps): React.JSX.Element | null {
  const { isAuthenticated, user } = useAuth0();
  const { history, loading } = useReadingHistory(maxItems);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Get user's first name for welcome message
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';

  // Get icon for item type
  const getItemIcon = (type: HistoryItemType) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'page':
        return <File className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string): string => {
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format time spent
  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  return (
    <section className="continue-reading-widget">
      {/* Header */}
      <div className="continue-reading-header">
        <div>
          {showWelcome && (
            <div className="continue-reading-subtitle">
              Welcome back, {firstName}
            </div>
          )}
          <div className="continue-reading-title">
            <Clock className="w-5 h-5" />
            <span>Continue Reading</span>
          </div>
        </div>
        {history.length > 0 && (
          <Link to="/profile/history" className="continue-reading-link">
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Content */}
      {loading ? (
        // Loading skeleton
        <div className="continue-reading-loading">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="continue-reading-skeleton">
              <div className="skeleton-icon" />
              <div className="skeleton-content">
                <div className="skeleton-title" />
                <div className="skeleton-meta" />
              </div>
            </div>
          ))}
        </div>
      ) : history.length === 0 ? (
        // Empty state
        <div className="continue-reading-empty">
          <BookOpen className="continue-reading-empty-icon" />
          <div className="continue-reading-empty-text">
            Start exploring the documentation to see your reading history here.
          </div>
        </div>
      ) : (
        // History list
        <div className="continue-reading-list">
          {history.map((item) => (
            <Link
              key={item.id}
              to={item.item_url}
              className="continue-reading-item"
            >
              <div className="continue-reading-item-icon">
                {getItemIcon(item.item_type)}
              </div>
              <div className="continue-reading-item-content">
                <div className="continue-reading-item-title">
                  {item.item_title}
                </div>
                <div className="continue-reading-item-meta">
                  {item.progress_percent > 0 && item.progress_percent < 100 && (
                    <div className="continue-reading-item-progress">
                      <div className="continue-reading-item-progress-bar">
                        <div
                          className="continue-reading-item-progress-bar"
                          style={{ width: `${item.progress_percent}%` }}
                        />
                      </div>
                      <span>{item.progress_percent}%</span>
                    </div>
                  )}
                  <span className="continue-reading-item-time">
                    {formatTimeAgo(item.last_accessed_at)}
                  </span>
                </div>
              </div>
              <ArrowRight className="continue-reading-item-arrow w-4 h-4" />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default ContinueReading;
