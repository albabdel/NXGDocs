import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import type { QueryStats } from '../SearchModal/hooks/useSearchAnalyticsEnhanced';
import styles from './Tables.module.css';

interface TopQueriesTableProps {
  queries: QueryStats[];
}

type SortKey = 'query' | 'searches' | 'zeroResults' | 'ctr';
type SortDirection = 'asc' | 'desc';

export default function TopQueriesTable({ queries }: TopQueriesTableProps): JSX.Element {
  const [sortKey, setSortKey] = useState<SortKey>('searches');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedQueries = [...queries].sort((a, b) => {
    let comparison = 0;
    switch (sortKey) {
      case 'query':
        comparison = a.query.localeCompare(b.query);
        break;
      case 'searches':
        comparison = a.searches - b.searches;
        break;
      case 'zeroResults':
        comparison = a.zeroResults - b.zeroResults;
        break;
      case 'ctr':
        comparison = a.ctr - b.ctr;
        break;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (key: SortKey): void => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortIcon = sortDirection === 'asc' ? ChevronUp : ChevronDown;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.headerCell} onClick={() => handleSort('query')}>
              <span>Query</span>
              {sortKey === 'query' && <SortIcon size={14} className={styles.sortIcon} />}
            </th>
            <th className={styles.headerCell} onClick={() => handleSort('searches')}>
              <span>Searches</span>
              {sortKey === 'searches' && <SortIcon size={14} className={styles.sortIcon} />}
            </th>
            <th className={styles.headerCell} onClick={() => handleSort('zeroResults')}>
              <span>Zero Results</span>
              {sortKey === 'zeroResults' && <SortIcon size={14} className={styles.sortIcon} />}
            </th>
            <th className={styles.headerCell} onClick={() => handleSort('ctr')}>
              <span>CTR</span>
              {sortKey === 'ctr' && <SortIcon size={14} className={styles.sortIcon} />}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedQueries.length === 0 ? (
            <tr>
              <td colSpan={4} className={styles.emptyCell}>
                No search queries recorded yet
              </td>
            </tr>
          ) : (
            sortedQueries.map((query, index) => (
              <tr key={`${query.query}-${index}`} className={styles.row}>
                <td className={styles.queryCell}>{query.query}</td>
                <td className={styles.numberCell}>{query.searches}</td>
                <td className={`${styles.numberCell} ${query.zeroResults > 0 ? styles.warning : ''}`}>
                  {query.zeroResults}
                </td>
                <td className={styles.numberCell}>
                  <span className={styles.ctrBadge} style={{ background: query.ctr > 80 ? 'rgba(34, 197, 94, 0.2)' : query.ctr > 50 ? 'rgba(234, 176, 88, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: query.ctr > 80 ? '#22c55e' : query.ctr > 50 ? '#E8B058' : '#ef4444' }}>
                    {query.ctr.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
