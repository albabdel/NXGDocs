import React, { useState, useEffect } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './BackgroundPattern.module.css';

function BackgroundPatternInner(): JSX.Element | null {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    setPathname(window.location.pathname);
    const handleNavigation = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handleNavigation);
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== pathname) setPathname(window.location.pathname);
    });
    observer.observe(document, { subtree: true, childList: true });
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      observer.disconnect();
    };
  }, [pathname]);

  if (pathname === '/' || pathname === '') return null;

  return (
    <div className={styles.container}>
      <div className={styles.baseBackground} />
      <svg className={styles.pattern} viewBox="0 0 100 100" preserveAspectRatio="xMaxYMin slice" xmlns="http://www.w3.org/2000/svg">
        <g className={styles.circles}>
          {[8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 130, 140, 150, 160, 170].map(r => (
            <circle key={r} cx="100" cy="0" r={r} fill="none" stroke="currentColor" strokeWidth="0.08" />
          ))}
        </g>
      </svg>
      <div className={styles.particles}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className={styles.particle} style={{ left: `${10 + (i * 3) % 80}%`, top: `${5 + (i * 7) % 90}%`, animationDelay: `${(i * 0.3) % 5}s`, opacity: 0.2 + (i % 3) * 0.15 }} />
        ))}
      </div>
      <div className={styles.vignette} />
    </div>
  );
}

const BackgroundPattern: React.FC = () => (
  <BrowserOnly fallback={null}>{() => <BackgroundPatternInner />}</BrowserOnly>
);

export default BackgroundPattern;
