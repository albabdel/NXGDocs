import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translatePageContent, clearTranslationCache } from '../utils/pageTranslator';

interface LanguageContextType {
  currentLanguage: string;
  sourceLanguage: string;
  isTranslating: boolean;
  switchLanguage: (language: string) => Promise<void>;
  clearCache: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'gcxone-current-language';

/**
 * Language Provider - Manages global language state and translation
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState(DEFAULT_LANGUAGE);
  const [sourceLanguage] = useState(DEFAULT_LANGUAGE);
  const [isTranslating, setIsTranslating] = useState(false);

  // Load saved language preference on mount (but don't auto-translate)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved !== DEFAULT_LANGUAGE) {
        // Restore saved language preference without automatic translation
        // User must explicitly request translation via the language toggle
        setCurrentLanguage(saved);
      }
    }
  }, []);

  const switchLanguage = useCallback(
    async (targetLanguage: string) => {
      // Don't translate if already in that language
      if (targetLanguage === currentLanguage) {
        return;
      }

      setIsTranslating(true);
      try {
        // Translate page content in place
        await translatePageContent(targetLanguage, sourceLanguage);

        // Update state
        setCurrentLanguage(targetLanguage);

        // Save preference
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, targetLanguage);
        }
      } catch (error) {
        console.error('[LanguageProvider] Error switching language:', error);
        // Language stays as-is on error
      } finally {
        setIsTranslating(false);
      }
    },
    [currentLanguage, sourceLanguage]
  );

  const clearCache = useCallback(() => {
    clearTranslationCache();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    setCurrentLanguage(DEFAULT_LANGUAGE);
  }, []);

  const value: LanguageContextType = {
    currentLanguage,
    sourceLanguage,
    isTranslating,
    switchLanguage,
    clearCache,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Hook to use language context
 */
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
