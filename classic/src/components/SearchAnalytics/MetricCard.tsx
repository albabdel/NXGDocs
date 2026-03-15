import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import styles from './MetricCard.module.css';

export interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  format?: 'number' | 'percent' | 'duration';
}

function formatValue(value: number, format: MetricCardProps['format']): string {
  if (format === 'percent') {
    return `${value.toFixed(1)}%`;
  }
  if (format === 'duration') {
    if (value < 1000) return `${value}ms`;
    if (value < 60000) return `${(value / 1000).toFixed(1)}s`;
    return `${(value / 60000).toFixed(1)}m`;
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

export default function MetricCard({ title, value, change, icon, format = 'number' }: MetricCardProps): JSX.Element {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  const trendClass = isPositive ? styles.positive : isNegative ? styles.negative : styles.neutral;
  const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

  return (
    <div className={styles.card}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.value}>{formatValue(value, format)}</span>
        {change !== undefined && (
          <div className={`${styles.trend} ${trendClass}`}>
            <TrendIcon size={14} />
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
