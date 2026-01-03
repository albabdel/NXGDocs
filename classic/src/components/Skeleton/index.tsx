import React from 'react';
import styles from './styles.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '4px',
  className = '' 
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius,
      }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton width={48} height={48} borderRadius="12px" className={styles.skeletonIcon} />
      <Skeleton height={24} className={styles.skeletonTitle} />
      <Skeleton height={16} className={styles.skeletonText} />
      <Skeleton width="60%" height={16} className={styles.skeletonText} />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className={styles.skeletonTextContainer}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '80%' : '100%'}
          className={styles.skeletonLine}
        />
      ))}
    </div>
  );
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className={styles.skeletonList}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={styles.skeletonListItem}>
          <Skeleton width={40} height={40} borderRadius="8px" />
          <div className={styles.skeletonListItemContent}>
            <Skeleton height={18} width="70%" />
            <Skeleton height={14} width="50%" className={styles.skeletonListItemSubtext} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonEditor() {
  return (
    <div className={styles.skeletonEditor}>
      <Skeleton height={48} className={styles.skeletonEditorHeader} />
      <div className={styles.skeletonEditorContent}>
        <SkeletonText lines={5} />
        <Skeleton height={200} className={styles.skeletonEditorArea} />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}

