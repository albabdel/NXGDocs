import React, { useState, useEffect } from 'react';
import { translations, type LocaleCode, getStoredLocale, setStoredLocale } from '@site/src/utils/translations';
import styles from './styles.module.css';

export default function LanguageSwitcher(): React.JSX.Element {
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>('en');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setCurrentLocale(getStoredLocale());
  }, []);

  const handleChange = (locale: LocaleCode) => {
    setStoredLocale(locale);
    setCurrentLocale(locale);
    window.location.reload();
  };

  return (
    <div 
      className={styles.switcher}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button className={styles.button} aria-label="Change language">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className={styles.current}>{translations[currentLocale].code.toUpperCase()}</span>
      </button>
      {showTooltip && (
        <div className={styles.dropdown}>
          {(Object.keys(translations) as LocaleCode[]).map((locale) => (
            <button
              key={locale}
              className={`${styles.option} ${locale === currentLocale ? styles.active : ''}`}
              onClick={() => handleChange(locale)}
            >
              {translations[locale].name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
