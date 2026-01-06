import React from 'react';
import styles from './BreakthroughHeader.module.css';

export interface BreakthroughHeaderProps {
  number: number;
  icon: string;
  title: string;
  tagline: string;
  video?: string;
  poster?: string;
  color?: string;
}

export default function BreakthroughHeader({
  number,
  icon,
  title,
  tagline,
  video,
  poster,
  color = '#4F46E5'
}: BreakthroughHeaderProps): JSX.Element {
  return (
    <div className={styles.breakthroughHeader}>
      <div className={styles.headerContent}>
        <div className={styles.badge}>
          <span className={styles.icon} role="img" aria-label={title}>
            {icon}
          </span>
          <span className={styles.number} style={{ backgroundColor: color }}>
            Breakthrough #{number}
          </span>
        </div>

        <h1 className={styles.title} style={{ color }}>
          {title}
        </h1>

        <p className={styles.tagline}>
          {tagline}
        </p>
      </div>

      {video && (
        <div className={styles.videoContainer}>
          <video
            className={styles.video}
            controls
            poster={poster}
            preload="metadata"
            crossOrigin="anonymous"
          >
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
