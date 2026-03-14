import React from 'react';
import styles from './FacetedFilters.module.css';

type FacetedFiltersProps = {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
  counts: Record<string, number>;
};

const FILTERS: { label: string; value: string | null }[] = [
  { label: 'All', value: null },
  { label: 'Documentation', value: 'Documentation' },
  { label: 'Releases', value: 'Releases' },
  { label: 'Roadmap', value: 'Roadmap' },
];

export default function FacetedFilters({
  activeFilter,
  onFilterChange,
  counts,
}: FacetedFiltersProps): JSX.Element {
  const getTotalCount = (): number => {
    return Object.values(counts).reduce((sum, n) => sum + n, 0);
  };

  const getCount = (filter: string | null): number => {
    if (filter === null) return getTotalCount();
    return counts[filter] ?? 0;
  };

  return (
    <div className={styles.container} role="tablist" aria-label="Filter results by section">
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.value;
        const count = getCount(f.value);
        return (
          <button
            key={f.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.filterBtn} ${isActive ? styles.active : ''}`}
            onClick={() => onFilterChange(f.value)}
            tabIndex={isActive ? 0 : -1}
          >
            <span className={styles.label}>{f.label}</span>
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
