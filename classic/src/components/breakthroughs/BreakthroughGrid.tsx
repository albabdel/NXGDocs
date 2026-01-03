import React from 'react';
import BreakthroughCard, { BreakthroughCardProps } from './BreakthroughCard';
import styles from './BreakthroughGrid.module.css';

export interface BreakthroughGridProps {
  breakthroughs?: BreakthroughCardProps[];
  children?: React.ReactNode;
}

// Default breakthrough data
const defaultBreakthroughs: BreakthroughCardProps[] = [
];

export default function BreakthroughGrid({
  breakthroughs = defaultBreakthroughs,
  children
}: BreakthroughGridProps): JSX.Element {
  return (
    <div className={styles.breakthroughGrid}>
      {children || breakthroughs.map((breakthrough) => (
        <BreakthroughCard key={breakthrough.number} {...breakthrough} />
      ))}
    </div>
  );
}
