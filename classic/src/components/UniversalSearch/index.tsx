import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from '@docusaurus/router';
import { Search, X, FileText, Hash, ArrowRight } from 'lucide-react';
import { useUniversalSearch } from '../../hooks/useUniversalSearch';
import styles from './styles.module.css';

export function UniversalSearchModal({ isOpen, onClose }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const history = useHistory();
    const { search } = useUniversalSearch();

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        const res = search(query);
        setResults(res);
        setSelectedIndex(0);
    }, [query]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (results[selectedIndex]) {
                    handleSelect(results[selectedIndex]);
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const handleSelect = (record) => {
        history.push(record.url);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.searchHeader}>
                    <Search className={styles.searchIcon} size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search documentation..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.resultsContainer}>
                    {results.length === 0 && query && (
                        <div className={styles.noResults}>No results found for "{query}"</div>
                    )}

                    {results.map((result, index) => (
                        <div
                            key={result.id}
                            className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                            onClick={() => handleSelect(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className={styles.resultIcon}>
                                {result.type === 'API_ENDPOINT' ? <Hash size={16} /> : <FileText size={16} />}
                            </div>
                            <div className={styles.resultContent}>
                                <div className={styles.resultTitle}>
                                    {result.title}
                                    {result.sectionTitle && result.sectionTitle !== 'Introduction' && (
                                        <span className={styles.sectionTitle}> › {result.sectionTitle}</span>
                                    )}
                                </div>
                                <div className={styles.resultSnippet}>{result.content}</div>
                            </div>
                            <div className={styles.enterHint}>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}

                    {results.length === 0 && !query && (
                        <div className={styles.emptyState}>
                            <p>Type to search documentation, API, and more...</p>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <span><kbd>↵</kbd> to select</span>
                    <span><kbd>↑↓</kbd> to navigate</span>
                    <span><kbd>esc</kbd> to close</span>
                </div>
            </div>
        </div>
    );
}
