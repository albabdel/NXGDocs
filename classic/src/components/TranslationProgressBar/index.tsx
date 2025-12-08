import React from 'react';
import { useLanguage } from '@site/src/contexts/LanguageContext';
import styles from './styles.module.css';

export default function TranslationProgressBar(): React.JSX.Element {
  const { isTranslating } = useLanguage();

  if (!isTranslating) {
    return <></>;
  }

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBar}></div>
      <div className={styles.translatingText}>Translating page...</div>
    </div>
  );
}
