import React from 'react';
import styles from './styles.module.css';

export default function ParticleBackground() {
  return (
    <div className={styles.particleContainer}>
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${10 + Math.random() * 20}s`,
          }}
        />
      ))}
    </div>
  );
}
