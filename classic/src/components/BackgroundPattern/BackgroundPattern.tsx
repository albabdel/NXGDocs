import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './BackgroundPattern.module.css';

function BackgroundPatternInner(): JSX.Element | null {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    // Get initial pathname
    setPathname(window.location.pathname);

    // Listen for navigation changes
    const handleNavigation = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener('popstate', handleNavigation);
    
    // Also observe URL changes via MutationObserver on document
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== pathname) {
        setPathname(window.location.pathname);
      }
    });
    observer.observe(document, { subtree: true, childList: true });

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      observer.disconnect();
    };
  }, [pathname]);

  // Exclude the landing page - it has its own design
  if (pathname === '/' || pathname === '') {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Base Background - adapts to theme via CSS variables */}
      <div className={styles.baseBackground} />

      {/* SVG Concentric Curves Pattern - emanating from top-right */}
      <svg
        className={styles.pattern}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMaxYMin slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric circles emanating from top-right */}
        <g className={styles.circles}>
          <circle cx="100" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="16" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="24" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="32" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="40" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="48" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="56" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="64" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="72" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="88" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="96" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="104" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="112" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="120" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="130" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="140" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="150" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="160" fill="none" stroke="currentColor" strokeWidth="0.08" />
          <circle cx="100" cy="0" r="170" fill="none" stroke="currentColor" strokeWidth="0.08" />
        </g>
      </svg>

      {/* Subtle star/dot particles scattered across */}
      <div className={styles.particles}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              left: `${10 + (i * 3) % 80}%`,
              top: `${5 + (i * 7) % 90}%`,
              animationDelay: `${(i * 0.3) % 5}s`,
              opacity: 0.2 + (i % 3) * 0.15,
            }}
          />
        ))}
      </div>

      {/* Vignette Overlay for Depth */}
      <div className={styles.vignette} />
    </div>
  );
}

const BackgroundPattern: React.FC = () => {
  return (
    <BrowserOnly fallback={null}>
      {() => <BackgroundPatternInner />}
    </BrowserOnly>
  );
};

export default BackgroundPattern;
