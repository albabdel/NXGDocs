import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function ScrollIndicator(): React.JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = scrollPx / winHeightPx;
      setScrollProgress(scrolled * 100);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div 
      className={styles.scrollIndicator}
      style={{ width: `${scrollProgress}%` }}
    />
  );
} 
