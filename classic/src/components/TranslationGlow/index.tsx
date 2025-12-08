import React from 'react';
import { useLanguage } from '@site/src/contexts/LanguageContext';
import styles from './styles.module.css';

export default function TranslationGlow(): React.JSX.Element {
  const { isTranslating } = useLanguage();

  if (!isTranslating) {
    return <></>;
  }

  return (
    <>
      {/* Top border */}
      <div className={styles.borderTop}></div>
      {/* Right border */}
      <div className={styles.borderRight}></div>
      {/* Bottom border */}
      <div className={styles.borderBottom}></div>
      {/* Left border */}
      <div className={styles.borderLeft}></div>
      {/* Glow effect */}
      <div className={styles.glowOverlay}></div>
    </>
  );
}
