import React from 'react';
import { FileText, Code2, Image, Video, AlertTriangle } from 'lucide-react';
import type { ContentType } from '../types/EnhancedSearchRecord';
import styles from './TypeFilter.module.css';

const TYPE_CONFIG: Record<ContentType, { label: string; icon: React.ReactNode }> = {
  page: { label: 'Pages', icon: <FileText size={14} /> },
  code: { label: 'Code', icon: <Code2 size={14} /> },
  image: { label: 'Images', icon: <Image size={14} /> },
  video: { label: 'Videos', icon: <Video size={14} /> },
  error: { label: 'Errors', icon: <AlertTriangle size={14} /> },
};

interface TypeFilterProps {
  activeType: ContentType | null;
  counts: Record<ContentType, number>;
  onChange: (type: ContentType | null) => void;
}

export function TypeFilter({ activeType, counts, onChange }: TypeFilterProps) {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div className={styles.typeFilter} role="tablist" aria-label="Filter by content type">
      <button
        className={!activeType ? styles.active : ''}
        onClick={() => onChange(null)}
        role="tab"
        aria-selected={!activeType}
        type="button"
      >
        <span>All</span>
        <span className={styles.count}>{total}</span>
      </button>

      {(Object.entries(TYPE_CONFIG) as [ContentType, typeof TYPE_CONFIG[ContentType]][]).map(([type, config]) => {
        const count = counts[type] || 0;
        if (count === 0) return null;

        return (
          <button
            key={type}
            className={activeType === type ? styles.active : ''}
            onClick={() => onChange(type)}
            role="tab"
            aria-selected={activeType === type}
            type="button"
          >
            {config.icon}
            <span>{config.label}</span>
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default TypeFilter;
