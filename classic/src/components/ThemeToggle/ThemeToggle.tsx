import React, { useState, useEffect, useCallback } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import styles from './ThemeToggle.module.css';

// Separate inner component that handles the actual toggle logic
function ThemeToggleInner(): JSX.Element {
  const [isDark, setIsDark] = useState(true);

  // Read theme from document
  const getCurrentTheme = useCallback(() => {
    const docTheme = document.documentElement.getAttribute('data-theme');
    return docTheme || 'dark';
  }, []);

  // Update state when theme changes
  useEffect(() => {
    const updateTheme = () => {
      setIsDark(getCurrentTheme() === 'dark');
    };
    
    updateTheme();

    // Watch for attribute changes on document element
    const observer = new MutationObserver(() => {
      updateTheme();
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    });

    return () => {
      observer.disconnect();
    };
  }, [getCurrentTheme]);

  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    
    // Set the theme attribute directly for immediate visual feedback
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-theme-choice', newTheme);
    
    // Persist to localStorage with the key Docusaurus uses
    const oldValue = localStorage.getItem('theme');
    localStorage.setItem('theme', newTheme);
    
    // Dispatch a StorageEvent to notify Docusaurus's ColorModeStorage listener
    // This is how Docusaurus syncs across tabs and re-reads the value
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'theme',
      oldValue: oldValue,
      newValue: newTheme,
      storageArea: localStorage,
    }));

    // Update state immediately for responsive UI
    setIsDark(!isDark);
  }, [isDark]);

  return (
    <button
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      type="button"
    >
      <div className={styles.iconContainer}>
        {/* Sun icon */}
        <svg
          className={`${styles.icon} ${styles.sunIcon} ${!isDark ? styles.active : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        
        {/* Moon icon */}
        <svg
          className={`${styles.icon} ${styles.moonIcon} ${isDark ? styles.active : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}

export default function ThemeToggle(): JSX.Element {
  return (
    <BrowserOnly fallback={<div className={styles.themeToggle} />}>
      {() => <ThemeToggleInner />}
    </BrowserOnly>
  );
}
