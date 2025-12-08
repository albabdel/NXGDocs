import enTranslations from '../translations/en.json';
import deTranslations from '../translations/de.json';
import plTranslations from '../translations/pl.json';
import esTranslations from '../translations/es.json';

export const translations = {
  en: {
    code: 'en',
    name: 'English',
  },
  de: {
    code: 'de',
    name: 'Deutsch',
  },
  pl: {
    code: 'pl',
    name: 'Polski',
  },
  es: {
    code: 'es',
    name: 'Español',
  },
};

const translationData = {
  en: enTranslations,
  de: deTranslations,
  pl: plTranslations,
  es: esTranslations,
};

export type LocaleCode = keyof typeof translations;

export const LOCALE_STORAGE_KEY = 'gcxone-locale';

export function getStoredLocale(): LocaleCode {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem(LOCALE_STORAGE_KEY) as LocaleCode) || 'en';
}

export function setStoredLocale(locale: LocaleCode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function t(key: string, locale?: LocaleCode): string {
  const currentLocale = locale || getStoredLocale();
  return translationData[currentLocale]?.[key] || translationData.en[key] || key;
}
