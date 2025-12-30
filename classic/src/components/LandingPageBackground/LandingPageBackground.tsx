import React from 'react';
import styles from './LandingPageBackground.module.css';

/**
 * LandingPageBackground - A unique background pattern for landing pages
 * Features diagonal grid, wave patterns, and floating geometric shapes
 * Different from the global BackgroundPattern (concentric circles)
 */
const LandingPageBackground: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Base Background - adapts to theme via CSS variables */}
      <div className={styles.baseBackground} />

      {/* Diagonal Grid Pattern */}
      <div className={styles.gridPattern} />

      {/* SVG Wave Pattern - emanating from bottom-left */}
      <svg
        className={styles.wavePattern}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMinYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curved waves emanating from bottom-left */}
        <g className={styles.waves}>
          <path d="M0 100 Q 30 70, 60 80 T 120 60" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 90 Q 35 60, 70 70 T 130 50" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 80 Q 40 50, 80 60 T 140 40" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 70 Q 45 40, 90 50 T 150 30" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 60 Q 50 30, 100 40 T 160 20" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 50 Q 55 20, 110 30 T 170 10" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 40 Q 60 10, 120 20 T 180 0" fill="none" stroke="currentColor" strokeWidth="0.3" />
          <path d="M0 30 Q 65 0, 130 10 T 190 -10" fill="none" stroke="currentColor" strokeWidth="0.3" />
        </g>
      </svg>

      {/* Floating Geometric Shapes */}
      <div className={styles.shapes}>
        {/* Hexagons */}
        <svg className={styles.hexagon} style={{ top: '15%', left: '10%', width: '60px', height: '60px' }} viewBox="0 0 60 60">
          <path d="M30 5 L52 17.5 L52 42.5 L30 55 L8 42.5 L8 17.5 Z" />
        </svg>
        <svg className={styles.hexagon} style={{ top: '60%', right: '15%', width: '45px', height: '45px', animationDelay: '-4s' }} viewBox="0 0 60 60">
          <path d="M30 5 L52 17.5 L52 42.5 L30 55 L8 42.5 L8 17.5 Z" />
        </svg>
        <svg className={styles.hexagon} style={{ bottom: '25%', left: '25%', width: '35px', height: '35px', animationDelay: '-8s' }} viewBox="0 0 60 60">
          <path d="M30 5 L52 17.5 L52 42.5 L30 55 L8 42.5 L8 17.5 Z" />
        </svg>

        {/* Diamonds */}
        <div className={styles.diamond} style={{ top: '20%', right: '20%', animationDelay: '-2s' }} />
        <div className={styles.diamond} style={{ top: '45%', left: '15%', animationDelay: '-5s' }} />
        <div className={styles.diamond} style={{ bottom: '15%', right: '30%', animationDelay: '-7s' }} />

        {/* Circles */}
        <div className={styles.circle} style={{ width: '80px', height: '80px', top: '30%', right: '10%', animationDelay: '-3s' }} />
        <div className={styles.circle} style={{ width: '50px', height: '50px', bottom: '30%', left: '5%', animationDelay: '-6s' }} />
        <div className={styles.circle} style={{ width: '100px', height: '100px', top: '10%', left: '40%', animationDelay: '-1s' }} />
      </div>

      {/* Gradient Orbs */}
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />

      {/* Corner Accent */}
      <div className={styles.cornerAccent} />

      {/* Subtle Noise Texture */}
      <div className={styles.noise} />
    </div>
  );
};

export default LandingPageBackground;

