import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Search, ArrowRight, Clock, TrendingUp } from 'lucide-react';
import styles from './Autocomplete.module.css';

interface AutocompleteProps {
  query: string;
  suggestions: string[];
  recentSearches: string[];
  topQueries: { query: string; count: number }[];
  onSelect: (suggestion: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isLoading: boolean;
  isOpen: boolean;
}

export function Autocomplete({
  query,
  suggestions,
  recentSearches,
  topQueries,
  onSelect,
  onFocus,
  onBlur,
  isLoading,
  isOpen,
}: AutocompleteProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const allSuggestions = useMemo(() => {
    const results: { text: string; type: 'suggestion' | 'recent' | 'popular'; icon: React.ReactNode }[] = [];

    if (query.trim()) {
      for (const suggestion of suggestions.slice(0, 5)) {
        results.push({
          text: suggestion,
          type: 'suggestion',
          icon: <Search size={14} />,
        });
      }
    }

    if (recentSearches.length > 0 && !query.trim()) {
      for (const recent of recentSearches.slice(0, 5)) {
        results.push({
          text: recent,
          type: 'recent',
          icon: <Clock size={14} />,
        });
      }
    }

    if (topQueries.length > 0 && !query.trim()) {
      for (const popular of topQueries.slice(0, 5)) {
        results.push({
          text: popular.query,
          type: 'popular',
          icon: <TrendingUp size={14} />,
        });
      }
    }

    return results;
  }, [query, suggestions, recentSearches, topQueries]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, allSuggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && allSuggestions[selectedIndex]) {
          onSelect(allSuggestions[selectedIndex].text);
        }
        break;
      case 'Escape':
        onBlur();
        break;
    }
  }, [isOpen, allSuggestions, selectedIndex, onSelect, onBlur]);

  const handleMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleClick = useCallback((suggestion: string) => {
    onSelect(suggestion);
  }, [onSelect]);

  if (!isOpen || allSuggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={listRef}
      className={styles.autocomplete}
      role="listbox"
      onMouseEnter={onFocus}
      onMouseLeave={onBlur}
    >
      {allSuggestions.map((item, index) => (
        <button
          key={`${item.type}-${item.text}`}
          className={`${styles.suggestion} ${index === selectedIndex ? styles.active : ''}`}
          onClick={() => handleClick(item.text)}
          onMouseEnter={() => handleMouseEnter(index)}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.text}>{highlightMatch(item.text, query)}</span>
          <span className={`${styles.badge} ${styles[item.type]}`}>
            {item.type === 'recent' && 'Recent'}
            {item.type === 'popular' && 'Popular'}
          </span>
          <ArrowRight size={12} className={styles.arrow} />
        </button>
      ))}
    </div>
  );
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark className={styles.highlight}>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default Autocomplete;
