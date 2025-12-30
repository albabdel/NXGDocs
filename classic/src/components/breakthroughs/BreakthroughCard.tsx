import React from 'react';
import Link from '@docusaurus/Link';
import styles from './BreakthroughCard.module.css';

export interface BreakthroughCardProps {
  number: number;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  link: string;
  color?: string;
}

export default function BreakthroughCard({
  number,
  icon,
  title,
  tagline,
  description,
  link,
  color = '#4F46E5'
}: BreakthroughCardProps): JSX.Element {
  return (
    <Link to={link} className={styles.breakthroughCard}>
      <div className={styles.cardHeader} style={{ borderLeftColor: color }}>
        <div className={styles.iconContainer}>
          <span className={styles.icon} role="img" aria-label={title}>
            {icon}
          </span>
          <span className={styles.number}>#{number}</span>
        </div>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.tagline}>{tagline}</p>
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.learnMore}>
          Learn more →
        </span>
      </div>
    </Link>
  );
}
