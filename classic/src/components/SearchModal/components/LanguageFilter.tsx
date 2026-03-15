import React from 'react';
import { Code2 } from 'lucide-react';
import styles from './LanguageFilter.module.css';

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'typescript', label: 'TypeScript', icon: '🔷' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'bash', label: 'Shell', icon: '💻' },
  { value: 'json', label: 'JSON', icon: '📄' },
  { value: 'yaml', label: 'YAML', icon: '⚙️' },
  { value: 'sql', label: 'SQL', icon: '🗃️' },
  { value: 'css', label: 'CSS', icon: '🎨' },
  { value: 'html', label: 'HTML', icon: '🌐' },
];

interface LanguageFilterProps {
  activeLanguage: string | null;
  counts: Record<string, number>;
  onChange: (language: string | null) => void;
}

export function LanguageFilter({ activeLanguage, counts, onChange }: LanguageFilterProps) {
  const totalCodeCount = Object.values(counts).reduce((sum, c) => sum + c, 0);

  if (totalCodeCount === 0) {
    return null;
  }

  return (
    <div className={styles.languageFilter} role="tablist" aria-label="Filter results by programming language">
      <button 
        type="button"
        role="tab"
        aria-selected={activeLanguage === null}
        className={`${styles.filterBtn} ${!activeLanguage ? styles.active : ''}`}
        onClick={() => onChange(null)}
        tabIndex={activeLanguage === null ? 0 : -1}
      >
        <Code2 size={14} />
        <span className={styles.label}>All Code</span>
        {totalCodeCount > 0 && <span className={styles.count}>{totalCodeCount}</span>}
      </button>
      
      {SUPPORTED_LANGUAGES.map(lang => {
        const count = counts[lang.value] || 0;
        if (count === 0) return null;
        
        const isActive = activeLanguage === lang.value;
        
        return (
          <button
            key={lang.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.filterBtn} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(lang.value)}
            tabIndex={isActive ? 0 : -1}
          >
            <span className={styles.icon}>{lang.icon}</span>
            <span className={styles.label}>{lang.label}</span>
            <span className={styles.count}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default LanguageFilter;
