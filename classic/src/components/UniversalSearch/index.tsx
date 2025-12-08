import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from '@docusaurus/router';
import { Search, X, FileText, ArrowRight, Command, Clock, Book, Terminal, PenTool, HelpCircle, ChevronRight, Tag, TrendingUp } from 'lucide-react';
import { useUniversalSearch } from '../../hooks/useUniversalSearch';
import { ContentType, SearchRecord } from '../../utils/search-types';
import styles from './styles.module.css';

interface UniversalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SearchResultWithDescription = SearchRecord & { description?: string };

const RECENT_SEARCHES_KEY = 'nxgen-docs-recent-searches';
const MAX_RECENT = 5;

const FILTERS: { id: ContentType | 'ALL', label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'DOC', label: 'Docs' },
    { id: 'API', label: 'API' },
    { id: 'BLOG', label: 'Blog' },
    { id: 'GUIDE', label: 'Guides' },
];

export function UniversalSearchModal({ isOpen, onClose }: UniversalSearchModalProps) {
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<ContentType | 'ALL'>('ALL');
    const [results, setResults] = useState<SearchResultWithDescription[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState<SearchResultWithDescription[]>([]);
    const [showPopularTags, setShowPopularTags] = useState(true);
    const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([]);

    const inputRef = useRef<HTMLInputElement>(null);
    const history = useHistory();
    const { search, getPopularTags } = useUniversalSearch();

    // Load recent searches and popular tags
    useEffect(() => {
        try {
            const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (saved) {
                setRecentSearches(JSON.parse(saved));
            }
        } catch (e) {
            console.error('Failed to load recent searches', e);
        }

        // Load popular tags
        const tags = getPopularTags(15);
        setPopularTags(tags);
    }, [getPopularTags]);

    const saveRecentSearch = (record: SearchResultWithDescription) => {
        const newRecent = [record, ...recentSearches.filter(r => r.id !== record.id)].slice(0, MAX_RECENT);
        setRecentSearches(newRecent);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newRecent));
    };

    // Handle Open/Close
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setActiveFilter('ALL');
            setShowPopularTags(true);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Search Logic
    useEffect(() => {
        if (!query && activeFilter === 'ALL') {
            setResults(recentSearches);
            setShowPopularTags(true);
        } else {
            const filterArg = activeFilter === 'ALL' ? undefined : activeFilter;
            const res = search(query, filterArg);
            setResults(res as SearchResultWithDescription[]);
            setShowPopularTags(false);
        }
        setSelectedIndex(0);
    }, [query, activeFilter, recentSearches, search]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
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

    const handleSelect = (record: SearchResultWithDescription) => {
        saveRecentSearch(record);
        history.push(record.url);
        onClose();
    };

    const handleTagClick = (tag: string) => {
        setQuery(tag);
        setShowPopularTags(false);
        inputRef.current?.focus();
    };

    const getIconForType = (type: ContentType) => {
        switch (type) {
            case 'API': return <Terminal size={18} />;
            case 'BLOG': return <PenTool size={18} />;
            case 'GUIDE': return <HelpCircle size={18} />;
            default: return <FileText size={18} />;
        }
    };

    const sanitizeSnippet = (text?: string) => {
        if (!text) return '';
        const cleaned = text
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/`{3}[\s\S]*?`{3}/g, '')
            .replace(/`/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#+\s*/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
        const limit = 180;
        if (cleaned.length > limit) {
            return `${cleaned.slice(0, limit).trim()}...`;
        }
        return cleaned;
    };

    const highlightText = (text: string, searchQuery: string): string => {
        if (!searchQuery || !text) return text;
        
        // Escape special regex characters
        const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Split query into words for better matching
        const queryWords = escapedQuery.trim().split(/\s+/).filter(word => word.length > 0);
        
        if (queryWords.length === 0) return text;
        
        // Create regex pattern that matches any of the query words (case-insensitive)
        const pattern = new RegExp(`(${queryWords.join('|')})`, 'gi');
        
        // Replace matches with highlighted version
        return text.replace(pattern, '<mark>$1</mark>');
    };

    const renderHighlightedText = (text: string, searchQuery: string) => {
        const highlighted = highlightText(text, searchQuery);
        return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.searchHeader}>
                    <Search className={styles.searchIcon} size={22} />
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.searchInput}
                        placeholder="Search documentation..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <div className={styles.filterBar}>
                    {FILTERS.map(filter => (
                        <button
                            key={filter.id}
                            className={`${styles.filterChip} ${activeFilter === filter.id ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Popular Tags Section */}
                {showPopularTags && !query && popularTags.length > 0 && (
                    <div className={styles.tagsSection}>
                        <div className={styles.tagsSectionHeader}>
                            <TrendingUp size={16} />
                            <span>Popular Topics</span>
                        </div>
                        <div className={styles.popularTags}>
                            {popularTags.map(({ tag, count }) => (
                                <button
                                    key={tag}
                                    className={styles.popularTag}
                                    onClick={() => handleTagClick(tag)}
                                    title={`${count} articles`}
                                >
                                    <Tag size={12} />
                                    <span>{tag}</span>
                                    <span className={styles.tagCount}>{count}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className={`${styles.resultsContainer} global-search-results`}>
                    {results.length === 0 && query && (
                        <div className={styles.emptyState}>
                            <Search className={styles.emptyStateIcon} size={48} />
                            <p>No results found for "{query}"</p>
                            <p className={styles.emptyStateHint}>Try different keywords or check out popular topics above</p>
                        </div>
                    )}

                    {results.length === 0 && !query && recentSearches.length === 0 && (
                        <div className={styles.emptyState}>
                            <Command className={styles.emptyStateIcon} size={48} />
                            <p>Start typing to search...</p>
                            <p className={styles.emptyStateHint}>Or click on a popular topic above</p>
                        </div>
                    )}

                    {!query && !showPopularTags && results.length === 0 && (
                        <div className={styles.emptyState}>
                            <Clock className={styles.emptyStateIcon} size={48} />
                            <p>No recent searches</p>
                        </div>
                    )}

                    {results.map((result, index) => (
                        <div
                            key={result.id}
                            className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                            onClick={() => handleSelect(result)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className={styles.resultIcon}>
                                {!query && activeFilter === 'ALL' ? <Clock size={16} /> : getIconForType(result.type)}
                            </div>
                            <div className={styles.resultContent}>
                                <div className={styles.resultBreadcrumbs}>
                                    {result.hierarchy?.map((item, i) => (
                                        <React.Fragment key={i}>
                                            {i > 0 && <ChevronRight size={10} />}
                                            <span>
                                                {query ? renderHighlightedText(item, query) : item}
                                            </span>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className={styles.resultTitle}>
                                    {query ? renderHighlightedText(result.title, query) : result.title}
                                    {result.sectionTitle && result.sectionTitle !== 'Introduction' && (
                                        <span className={styles.sectionTitle}>
                                            {' · '}
                                            {query ? renderHighlightedText(result.sectionTitle, query) : result.sectionTitle}
                                        </span>
                                    )}
                                </div>
                                {(result.description || result.content) && (
                                    <div className={styles.resultSnippet}>
                                        {query 
                                            ? renderHighlightedText(
                                                result.description || sanitizeSnippet(result.content), 
                                                query
                                              )
                                            : (result.description || sanitizeSnippet(result.content))
                                        }
                                    </div>
                                )}
                                {result.tags && result.tags.length > 0 && (
                                    <div className={styles.resultTags}>
                                        {result.tags.slice(0, 4).map(tag => (
                                            <span key={tag} className={styles.tagBadge} onClick={(e) => {
                                                e.stopPropagation();
                                                handleTagClick(tag);
                                            }}>
                                                <Tag size={10} />
                                                {tag}
                                            </span>
                                        ))}
                                        {result.tags.length > 4 && (
                                            <span className={styles.tagMore}>+{result.tags.length - 4}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className={styles.enterHint}>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <span><kbd>Enter</kbd> to select</span>
                    <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                    <span><kbd>Esc</kbd> to close</span>
                    <span className={styles.resultCount}>{results.length} results</span>
                </div>
            </div>
        </div>
    );
}
