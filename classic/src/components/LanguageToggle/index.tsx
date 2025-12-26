import React from 'react';
import { useState, useEffect } from 'react';

const translations = {
  en: {
    'What is GCXONE GCXONE?': 'What is GCXONE GCXONE?',
    'Benefits': 'Benefits',
    'Documentation': 'Documentation'
  },
  de: {
    'What is GCXONE GCXONE?': 'Was ist GCXONE GCXONE?',
    'Benefits': 'Vorteile',
    'Documentation': 'Dokumentation'
  }
};

export default function LanguageToggle(): JSX.Element {
  const [currentLang, setCurrentLang] = useState('en');
  
  useEffect(() => {
    const saved = localStorage.getItem('language') || 'en';
    setCurrentLang(saved);
    // Don't auto-translate on mount - only translate on explicit user action
  }, []);
  
  const translatePage = (lang) => {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(el => {
      const key = el.getAttribute('data-translate');
      if (translations[lang] && translations[lang][key]) {
        el.textContent = translations[lang][key];
      }
    });
    
    // Translate common elements
    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(el => {
      const text = el.textContent.trim();
      if (translations[lang] && translations[lang][text]) {
        el.textContent = translations[lang][text];
      }
    });
  };
  
  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'de' : 'en';
    setCurrentLang(newLang);
    localStorage.setItem('language', newLang);
    translatePage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      style={{
        background: 'var(--ifm-color-emphasis-200)',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: 'var(--ifm-color-content)',
        padding: '4px 8px',
      }}
    >
      {currentLang === 'en' ? 'DE' : 'EN'}
    </button>
  );
}