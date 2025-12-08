import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { useLanguage } from '@site/src/contexts/LanguageContext';

interface Language {
  code: string;
  name: string;
  shortCode: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', shortCode: 'EN' },
  { code: 'de', name: 'Deutsch', shortCode: 'DE' },
  { code: 'pl', name: 'Polski', shortCode: 'PL' },
  { code: 'es', name: 'Español', shortCode: 'ES' },
];

const KEYBOARD_SHORTCUTS: Record<string, string> = {
  '1': 'en',
  '2': 'de',
  '3': 'pl',
  '4': 'es',
};

export default function FloatingLanguageToggle(): React.JSX.Element {
  const { currentLanguage: currentLangCode, switchLanguage, isTranslating } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLangCode) || LANGUAGES[0];

  // Handle keyboard shortcuts and close on escape
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt+1/2/3/4 for language selection
      if (e.altKey && KEYBOARD_SHORTCUTS[e.key]) {
        e.preventDefault();
        const targetLanguage = KEYBOARD_SHORTCUTS[e.key];
        switchLanguage(targetLanguage);
      }
      // Escape to close dropdown
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentLangCode, isOpen, switchLanguage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageSwitch = async (targetLanguage: string) => {
    if (targetLanguage === currentLangCode) {
      setIsOpen(false);
      return;
    }

    await switchLanguage(targetLanguage);
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.floatingToggle} ${isTranslating ? styles.switching : ''}`}
      onMouseEnter={() => !isTranslating && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {showTooltip && (
        <div className={styles.tooltip}>
          <span>
            {currentLanguage.name}
            <br />
            <small>Alt+1/2/3/4 to switch</small>
          </span>
        </div>
      )}

      <button
        className={styles.toggleButton}
        onClick={() => !isTranslating && setIsOpen(!isOpen)}
        aria-label={`Change language. Currently ${currentLanguage.name}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isTranslating}
      >
        <svg
          className={`${styles.languageIcon} ${isOpen ? styles.iconOpen : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className={styles.currentLang}>{currentLanguage.shortCode}</span>
        {isTranslating && (
          <div className={styles.loadingSpinner}>
            <svg
              className={styles.spinning}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
        )}
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="menu">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              className={`${styles.dropdownItem} ${
                lang.code === currentLangCode ? styles.active : ''
              }`}
              onClick={() => handleLanguageSwitch(lang.code)}
              role="menuitem"
              aria-label={`Switch to ${lang.name}`}
              title={`Alt+${Object.entries(KEYBOARD_SHORTCUTS).find(([_, code]) => code === lang.code)?.[0]}`}
            >
              <span className={styles.langCode}>{lang.shortCode}</span>
              <span className={styles.langName}>{lang.name}</span>
              {lang.code === currentLangCode && (
                <svg
                  className={styles.checkmark}
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
