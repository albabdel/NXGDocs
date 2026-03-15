import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { ZeroResultQuery } from '../SearchModal/hooks/useSearchAnalyticsEnhanced';
import styles from './Tables.module.css';

interface ZeroResultsTableProps {
  queries: ZeroResultQuery[];
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function ZeroResultsTable({ queries }: ZeroResultsTableProps): JSX.Element {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <AlertCircle size={18} className={styles.headerIcon} />
        <span>Queries with No Results - Content Gaps</span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell}>Query</th>
            <th className={styles.headerCell}>Occurrences</th>
            <th className={styles.headerCell}>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {queries.length === 0 ? (
            <tr>
              <td colSpan={3} className={styles.emptyCell}>
                No zero-result queries found
              </td>
            </tr>
          ) : (
            queries.map((query, index) => (
              <tr key={`${query.query}-${index}`} className={styles.row}>
                <td className={styles.queryCell}>{query.query}</td>
                <td className={`${styles.numberCell} ${styles.highlightWarning}`}>
                  {query.occurrences}
                </td>
                <td className={styles.timeCell}>{formatTimeAgo(query.lastSeen)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
