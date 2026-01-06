import React from 'react';
import styles from './BreakthroughHeader.module.css';
import { CloudinaryVideo } from '../CloudinaryVideo';

export interface BreakthroughHeaderProps {
  number: number;
  icon: string;
  title: string;
  tagline: string;
  video?: string;
  poster?: string;
  color?: string;
  /**
   * If true, treats video as a Cloudinary public ID instead of a URL
   */
  useCloudinary?: boolean;
}

export default function BreakthroughHeader({
  number,
  icon,
  title,
  tagline,
  video,
  poster,
  color = '#4F46E5',
  useCloudinary = false
}: BreakthroughHeaderProps): JSX.Element {
  // Check if video is a Cloudinary public ID (no http/https, no file extension, or explicitly set)
  const isCloudinaryVideo = useCloudinary || (video && !video.startsWith('http') && !video.includes('.'));

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
          {isCloudinaryVideo ? (
            <CloudinaryVideo
              publicId={video}
              poster={poster}
              controls
              preload="metadata"
              className={styles.video}
              format="auto"
              quality="auto"
            />
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}
