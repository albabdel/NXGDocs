import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function FloatingDarkModeToggle(): React.JSX.Element {
  const [colorMode, setColorModeState] = useState<'light' | 'dark'>('light');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Get the current color mode from document or localStorage
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      || localStorage.getItem('theme') === 'dark';
    setColorModeState(isDark ? 'dark' : 'light');
  }, []);

  const toggleColorMode = () => {
    const newMode = colorMode === 'dark' ? 'light' : 'dark';
    setColorModeState(newMode);
    document.documentElement.setAttribute('data-theme', newMode);
    localStorage.setItem('theme', newMode);
    // Dispatch event for other components to listen to
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: newMode } }));
  };

  if (!isClient) {
    return null;
  }

  const isDark = colorMode === 'dark';

  return (
    <button
      className={styles.floatingToggle}
      onClick={toggleColorMode}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className={styles.toggleTrack}>
        <div className={`${styles.toggleThumb} ${isDark ? styles.toggleThumbDark : ''}`}>
          {isDark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13ZM12.14,19.73A8.14,8.14,0,0,1,6.34,5.23v.26A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M12,4c0.55,0,1-0.45,1-1V2c0-0.55-0.45-1-1-1 s-1,0.45-1,1v1C11,3.55,11.45,4,12,4z M12,22c-0.55,0-1-0.45-1-1v-1c0-0.55,0.45-1,1-1 s1,0.45,1,1v1C13,21.55,12.55,22,12,22z M4.22,5.64c0.39,0.39,1.03,0.39,1.41,0L6.7,4.57c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0L4.22,4.22C3.83,4.61,3.83,5.25,4.22,5.64z M17.3,19.43c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L17.3,19.43z M4,12 c0-0.55-0.45-1-1-1H2c-0.55,0-1,0.45-1,1s0.45,1,1,1h1C3.55,13,4,12.55,4,12z M22,11h-1c-0.55,0-1,0.45-1,1 s0.45,1,1,1h1c0.55,0,1-0.45,1-1S22.55,11,22,11z M6.7,19.43l-1.06,1.06c-0.39,0.39-1.03,0.39-1.41,0 c-0.39-0.39-0.39-1.03,0-1.41l1.06-1.06c0.39-0.39,1.03-0.39,1.41,0C7.09,18.39,7.09,19.04,6.7,19.43z M19.78,5.64 c0.39-0.39,0.39-1.03,0-1.41l-1.06-1.06c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 C18.75,6.03,19.39,6.03,19.78,5.64z" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
