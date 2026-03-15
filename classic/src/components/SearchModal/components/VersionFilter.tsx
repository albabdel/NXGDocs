import React from 'react';
import { Tag } from 'lucide-react';
import styles from './VersionFilter.module.css';

interface VersionFilterProps {
  activeVersion: string | null;
  counts: Record<string, number>;
  onChange: (version: string | null) => void;
}

export function VersionFilter({ activeVersion, counts, onChange }: VersionFilterProps) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const versions = Object.keys(counts).sort((a, b) => {
    if (a === 'latest') return -1;
    if (b === 'latest') return 1;
    return b.localeCompare(a, undefined, { numeric: true });
  });

  return (
    <div className={styles.versionFilter} role="tablist" aria-label="Filter by version">
      <button
        className={!activeVersion ? styles.active : ''}
        onClick={() => onChange(null)}
        role="tab"
        aria-selected={!activeVersion}
        type="button"
      >
        <Tag size={14} />
        <span>All versions</span>
        <span className={styles.count}>{total}</span>
      </button>

      {versions.map((version) => {
        const count = counts[version] || 0;
        if (count === 0) return null;

        return (
          <button
            key={version}
            className={activeVersion === version ? styles.active : ''}
            onClick={() => onChange(version)}
            role="tab"
            aria-selected={activeVersion === version}
            type="button"
          >
            <span className={styles.versionBadge}>{version}</span>
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default VersionFilter;
