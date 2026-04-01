import React from 'react';
import Link from '@docusaurus/Link';
import { FileText, Video, File, ExternalLink, Trash2, Clock, Timer } from 'lucide-react';
import { HistoryItem, HistoryItemType, deleteHistoryItem } from '../../services/history';
import { useSupabase } from '../../lib/supabase';
import { useAuth0 } from '@auth0/auth0-react';
import '../../css/components/history.css';

interface HistoryListProps {
  /** History items to display */
  items: HistoryItem[];
  /** Called when an item is deleted */
  onItemDeleted?: () => void;
  /** Search filter text */
  searchFilter?: string;
}

interface HistoryGroup {
  label: string;
  items: HistoryItem[];
}

/**
 * History list component with date grouping.
 * Used on the full history page.
 */
export function HistoryList({ 
  items, 
  onItemDeleted,
  searchFilter = ''
}: HistoryListProps): React.JSX.Element {
  const { getAccessTokenSilently } = useAuth0();
  const supabase = useSupabase(getAccessTokenSilently);

  // Filter items by search
  const filteredItems = searchFilter
    ? items.filter(
        (item) =>
          item.item_title.toLowerCase().includes(searchFilter.toLowerCase()) ||
          item.item_url.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : items;

  // Group items by date
  const groupItems = (): HistoryGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const thisWeek = new Date(today.getTime() - 7 * 86400000);

    const groups: Map<string, HistoryItem[]> = new Map();
    groups.set('Today', []);
    groups.set('Yesterday', []);
    groups.set('This Week', []);
    groups.set('Older', []);

    for (const item of filteredItems) {
      const itemDate = new Date(item.last_accessed_at);
      let groupKey: string;

      if (itemDate >= today) {
        groupKey = 'Today';
      } else if (itemDate >= yesterday) {
        groupKey = 'Yesterday';
      } else if (itemDate >= thisWeek) {
        groupKey = 'This Week';
      } else {
        groupKey = 'Older';
      }

      groups.get(groupKey)?.push(item);
    }

    // Filter out empty groups and return
    return Array.from(groups.entries())
      .filter(([, groupItems]) => groupItems.length > 0)
      .map(([label, groupItems]) => ({ label, items: groupItems }));
  };

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

  // Format time spent
  const formatTimeSpent = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Handle delete
  const handleDelete = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm('Remove this item from your history?')) {
      try {
        await deleteHistoryItem(supabase, slug);
        onItemDeleted?.();
      } catch (err) {
        console.error('Failed to delete history item:', err);
      }
    }
  };

  const groups = groupItems();

  if (groups.length === 0) {
    return (
      <div className="history-empty">
        <Clock className="history-empty-icon" />
        <h3 className="history-empty-title">No reading history</h3>
        <p className="history-empty-text">
          {searchFilter
            ? 'No items match your search.'
            : 'Start exploring the documentation to build your reading history.'}
        </p>
      </div>
    );
  }

  return (
    <div className="history-list">
      {groups.map((group) => (
        <div key={group.label} className="history-group">
          <h3 className="history-group-title">{group.label}</h3>
          {group.items.map((item) => (
            <div key={item.id} className="history-item">
              <div className={`history-item-icon ${item.item_type}`}>
                {getItemIcon(item.item_type)}
              </div>
              <div className="history-item-content">
                <Link to={item.item_url} className="history-item-title">
                  {item.item_title}
                </Link>
                <div className="history-item-url">{item.item_url}</div>
                <div className="history-item-meta">
                  {item.progress_percent > 0 && (
                    <div className="history-item-progress">
                      <div className="history-item-progress-bar">
                        <div
                          className="history-item-progress-fill"
                          style={{ width: `${Math.min(100, item.progress_percent)}%` }}
                        />
                      </div>
                      <span className="history-item-progress-text">
                        {item.progress_percent}%
                      </span>
                    </div>
                  )}
                  {item.time_spent_seconds > 0 && (
                    <div className="history-item-time">
                      <Timer className="w-3.5 h-3.5" />
                      <span>{formatTimeSpent(item.time_spent_seconds)}</span>
                    </div>
                  )}
                  <span>{formatDate(item.last_accessed_at)}</span>
                </div>
              </div>
              <div className="history-item-actions">
                <Link
                  to={item.item_url}
                  className="history-item-action"
                  title="Open"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  className="history-item-action delete"
                  title="Remove from history"
                  onClick={(e) => handleDelete(e, item.item_slug)}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default HistoryList;
