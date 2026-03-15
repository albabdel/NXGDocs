import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js';
import { Search, X, ArrowRight, Clock, Bookmark, BookmarkCheck, Keyboard, Trash2, Code, Image, Video, AlertTriangle, FileText, Sparkles, Zap } from 'lucide-react';
import styles from './SearchModal.module.css';

import useDebounce from './hooks/useDebounce';
import useRecentSearches from './hooks/useRecentSearches';
import useSavedSearches, { type SavedSearch } from './hooks/useSavedSearches';
import useSearchAnalyticsEnhanced from '../../hooks/useSearchAnalyticsEnhanced';
import { useHybridSearch, useSemanticSearchEnabled, getSearchModeInfo } from './hooks/useHybridSearch';
import { highlightMatches, type HighlightPart } from './utils/highlightMatches';
import { expandQuery } from './utils/synonymMap';
import { findSuggestions } from './utils/didYouMean';
import FacetedFilters from './components/FacetedFilters';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import TypeFilter from './components/TypeFilter';
import LanguageFilter from './components/LanguageFilter';
import VersionFilter from './components/VersionFilter';
import CodeResult from './components/CodeResult';
import ImageResult from './components/ImageResult';
import VideoResult from './components/VideoResult';
import ErrorResult from './components/ErrorResult';
import AIAnswerPanel from './components/AIAnswerPanel';
import type { EnhancedSearchRecord, ContentType } from './types/EnhancedSearchRecord';
import type { HybridSearchResult } from './hooks/useHybridSearch';

// Use EnhancedSearchRecord as the search record type
type SearchRecord = EnhancedSearchRecord;

const FUSE_OPTIONS: IFuseOptions<SearchRecord> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'content', weight: 0.3 },
    { name: 'category', weight: 0.1 },
    { name: 'tags', weight: 0.05 },
    { name: 'code', weight: 0.15 }, // Code-specific search
    { name: 'language', weight: 0.05 }, // Language search for code blocks
  ],
  threshold: 0.35,
  includeScore: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
};

// Content type icons and labels
const CONTENT_TYPE_CONFIG: Record<ContentType, { label: string; icon: typeof Code }> = {
  page: { label: 'Page', icon: Search },
  code: { label: 'Code', icon: Code },
  image: { label: 'Image', icon: Image },
  video: { label: 'Video', icon: Video },
  error: { label: 'Error', icon: AlertTriangle },
};

const SECTION_LABELS: Record<string, string> = {
  Documentation: 'Docs',
  Releases: 'Release',
  Roadmap: 'Roadmap',
  Internal: 'Internal',
};

const SECTION_ORDER = ['Documentation', 'Releases', 'Roadmap', 'Internal'];

function HighlightedText({ parts, className }: { parts: HighlightPart[]; className?: string }) {
  return (
    <span className={className}>
      {parts.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <mark key={i} className={styles.highlight}>{part.match}</mark>
        )
      )}
    </span>
  );
}

export default function SearchModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FuseResult<SearchRecord>[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fuse, setFuse] = useState<Fuse<SearchRecord> | null>(null);
  const [searchIndex, setSearchIndex] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ContentType | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [useHybridSearchMode, setUseHybridSearchMode] = useState(true);
  const [allTitles, setAllTitles] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  
  const isSemanticEnabled = useSemanticSearchEnabled();

  const debouncedQuery = useDebounce(query, 150);
  const { recentSearches, addRecentSearch, clearRecentSearches, removeRecentSearch } = useRecentSearches();
  const { savedSearches, saveSearch, removeSavedSearch, isSaved } = useSavedSearches();
  const { trackSearch, trackClick, trackAIAnswer, getCurrentSearchId } = useSearchAnalyticsEnhanced();
  
  const {
    results: hybridResults,
    isVectorLoading,
    isVectorAvailable,
    vectorError,
  } = useHybridSearch(debouncedQuery, results, searchIndex, {
    enabled: useHybridSearchMode && isSemanticEnabled,
    vectorWeight: 0.6,
    keywordWeight: 0.4,
  });
  
  const searchModeInfo = useMemo(() => getSearchModeInfo(isVectorAvailable), [isVectorAvailable]);

  useEffect(() => setMounted(true), []);

  const loadIndex = useCallback(async () => {
    if (fuse || loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/search-index.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SearchRecord[] = await res.json();
      setFuse(new Fuse(data, FUSE_OPTIONS));
      setSearchIndex(data);
      setAllTitles(data.map(d => d.title));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [fuse, loading]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        if (showShortcuts) {
          setShowShortcuts(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
      if (e.key === '?' && isOpen && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, showShortcuts]);

  useEffect(() => {
    if (isOpen) {
      loadIndex();
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
      setActiveFilter(null);
      setActiveType(null);
      setActiveLanguage(null);
      setActiveVersion(null);
      setShowShortcuts(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!fuse || !debouncedQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const expandedTerms = expandQuery(debouncedQuery);
    const searchPattern = expandedTerms.join(' ');
    const rawResults = fuse.search(searchPattern, { limit: 50 });
    
    setResults(rawResults);
    setSelectedIndex(0);

    trackSearch(debouncedQuery, rawResults.length, useHybridSearchMode ? 'hybrid' : 'keyword', showAIPanel && isSemanticEnabled && rawResults.length > 0);
    if (rawResults.length > 0) {
      addRecentSearch(debouncedQuery);
    }
  }, [debouncedQuery, fuse, trackSearch, addRecentSearch, useHybridSearchMode, showAIPanel]);

  useEffect(() => {
    const item = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const filteredResults = useMemo(() => {
    const extractVersion = (item: SearchRecord): string | null => {
      if (item.productVersion) return item.productVersion;
      const match = item.url.match(/\/(v\d+(?:\.\d+)*)\//);
      return match ? match[1] : null;
    };

    if (useHybridSearchMode && hybridResults.length > 0) {
      let filtered = hybridResults;
      
      if (activeFilter) {
        filtered = filtered.filter(r => r.record.section === activeFilter);
      }
      
      if (activeType) {
        filtered = filtered.filter(r => (r.record.type || 'page') === activeType);
      }
      
      if (activeLanguage) {
        filtered = filtered.filter(r => r.record.language === activeLanguage);
      }
      
      if (activeVersion) {
        filtered = filtered.filter(r => extractVersion(r.record) === activeVersion);
      }
      
      return filtered.map(r => ({
        item: r.record,
        score: 1 - r.combinedScore,
        refIndex: 0,
      })) as FuseResult<SearchRecord>[];
    }
    
    let filtered = results;
    
    if (activeFilter) {
      filtered = filtered.filter(r => r.item.section === activeFilter);
    }
    
    if (activeType) {
      filtered = filtered.filter(r => (r.item.type || 'page') === activeType);
    }
    
    if (activeLanguage) {
      filtered = filtered.filter(r => r.item.language === activeLanguage);
    }
    
    if (activeVersion) {
      filtered = filtered.filter(r => extractVersion(r.item) === activeVersion);
    }
    
    return filtered;
  }, [results, hybridResults, useHybridSearchMode, activeFilter, activeType, activeLanguage, activeVersion]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, FuseResult<SearchRecord>[]> = {};
    for (const r of filteredResults) {
      const section = r.item.section;
      if (!groups[section]) groups[section] = [];
      groups[section].push(r);
    }
    return SECTION_ORDER.filter(s => groups[s]).map(section => ({
      section,
      label: SECTION_LABELS[section] || section,
      items: groups[section],
    }));
  }, [filteredResults]);

  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of results) {
      counts[r.item.section] = (counts[r.item.section] || 0) + 1;
    }
    return counts;
  }, [results]);

  const typeCounts = useMemo(() => {
    const counts: Record<ContentType, number> = {
      page: 0,
      code: 0,
      image: 0,
      video: 0,
      error: 0,
    };
    for (const r of results) {
      const type = r.item.type || 'page';
      counts[type] = (counts[type] || 0) + 1;
    }
    return counts;
  }, [results]);

  const languageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of results) {
      if (r.item.type === 'code' && r.item.language) {
        counts[r.item.language] = (counts[r.item.language] || 0) + 1;
      }
    }
    return counts;
  }, [results]);

  const versionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const extractVersion = (item: SearchRecord): string | null => {
      if (item.productVersion) return item.productVersion;
      const match = item.url.match(/\/(v\d+(?:\.\d+)*)\//);
      return match ? match[1] : null;
    };
    for (const r of results) {
      const version = extractVersion(r.item);
      if (version) {
        counts[version] = (counts[version] || 0) + 1;
      }
    }
    return counts;
  }, [results]);

  const suggestions = useMemo(() => {
    if (!debouncedQuery.trim() || filteredResults.length > 0 || !allTitles.length) return [];
    return findSuggestions(debouncedQuery, allTitles, 2);
  }, [debouncedQuery, filteredResults.length, allTitles]);

  const flatFilteredItems = useMemo(() => 
    groupedResults.flatMap(g => g.items), [groupedResults]
  );

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) close();
  }, [close]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatFilteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        if (flatFilteredItems[selectedIndex]) {
          const selectedItem = flatFilteredItems[selectedIndex].item;
          const searchId = getCurrentSearchId();
          if (searchId) {
            trackClick(searchId, selectedItem.id, selectedItem.title, selectedItem.url, selectedIndex);
          }
          window.location.href = selectedItem.url;
        }
        break;
      case 'Tab':
        e.preventDefault();
        const filterKeys: (string | null)[] = [null, 'Documentation', 'Releases', 'Roadmap'];
        const currentIdx = filterKeys.indexOf(activeFilter);
        const nextIdx = e.shiftKey 
          ? (currentIdx - 1 + filterKeys.length) % filterKeys.length
          : (currentIdx + 1) % filterKeys.length;
        setActiveFilter(filterKeys[nextIdx]);
        break;
    }
  }, [flatFilteredItems, selectedIndex, activeFilter, getCurrentSearchId, trackClick]);

  const handleResultClick = useCallback((url: string, item?: SearchRecord, position?: number) => {
    if (debouncedQuery.trim()) {
      addRecentSearch(debouncedQuery);
    }
    const searchId = getCurrentSearchId();
    if (searchId && item && position !== undefined) {
      trackClick(searchId, item.id, item.title, url, position);
    }
    close();
  }, [debouncedQuery, addRecentSearch, close, getCurrentSearchId, trackClick]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    inputRef.current?.focus();
  }, []);

  const toggleSavedSearch = useCallback((q: string) => {
    if (isSaved(q)) {
      removeSavedSearch(q);
    } else {
      saveSearch(q);
    }
  }, [isSaved, removeSavedSearch, saveSearch]);

  const trigger = (
    <button className={styles.trigger} onClick={open} aria-label="Search documentation (Ctrl+K)">
      <Search size={15} strokeWidth={2.2} />
      <span className={styles.triggerText}>Search docs...</span>
      <span className={styles.triggerKbd}>
        <kbd>Ctrl</kbd><kbd>K</kbd>
      </span>
    </button>
  );

  const modal = mounted && isOpen ? createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label="Search">
      <div className={styles.modal}>
        <div className={styles.inputRow}>
          <Search size={18} strokeWidth={2} className={styles.searchIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="Search documentation, releases, roadmap..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button 
              className={styles.saveBtn} 
              onClick={() => toggleSavedSearch(query)}
              aria-label={isSaved(query) ? 'Unsave search' : 'Save search'}
              title={isSaved(query) ? 'Unsave search' : 'Save search'}
            >
              {isSaved(query) ? (
                <BookmarkCheck size={14} strokeWidth={2} />
              ) : (
                <Bookmark size={14} strokeWidth={2} />
              )}
            </button>
          )}
          <button className={styles.shortcutsBtn} onClick={() => setShowShortcuts(true)} aria-label="Keyboard shortcuts">
            <Keyboard size={14} strokeWidth={2} />
          </button>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {results.length > 0 && (
          <FacetedFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={sectionCounts}
          />
        )}

        {results.length > 0 && (
          <TypeFilter
            activeType={activeType}
            counts={typeCounts}
            onChange={setActiveType}
          />
        )}

        {typeCounts.code > 0 && (
          <LanguageFilter
            activeLanguage={activeLanguage}
            counts={languageCounts}
            onChange={setActiveLanguage}
          />
        )}

        {Object.keys(versionCounts).length > 1 && (
          <VersionFilter
            activeVersion={activeVersion}
            counts={versionCounts}
            onChange={setActiveVersion}
          />
        )}

        {isSemanticEnabled && debouncedQuery.trim() && (
          <div className={styles.aiSearchToggle}>
            <button
              className={`${styles.toggleBtn} ${useHybridSearchMode ? styles.toggleBtnActive : ''}`}
              onClick={() => setUseHybridSearchMode(!useHybridSearchMode)}
              title={useHybridSearchMode ? 'Semantic search enabled' : 'Enable semantic search'}
            >
              <Sparkles size={12} />
              <span>{searchModeInfo.label}</span>
              {isVectorLoading && <span className={styles.toggleLoading} />}
            </button>
            <button
              className={`${styles.toggleBtn} ${showAIPanel ? styles.toggleBtnActive : ''}`}
              onClick={() => setShowAIPanel(!showAIPanel)}
              title={showAIPanel ? 'Hide AI answer' : 'Show AI answer'}
            >
              <Zap size={12} />
              <span>AI Answer</span>
            </button>
          </div>
        )}

        <div className={styles.body}>
          {loading && (
            <div className={styles.status}>
              <span className={styles.spinner} />
              Loading search index…
            </div>
          )}

          {error && (
            <div className={styles.status}>
              Search unavailable — index not found. Run <code>npm run build</code> first.
            </div>
          )}

          {!loading && !error && query && showAIPanel && isSemanticEnabled && filteredResults.length > 0 && (
            <AIAnswerPanel
              query={debouncedQuery}
              results={filteredResults.map(r => r.item)}
              isVisible={showAIPanel}
            />
          )}

          {!loading && !error && !query && (
            <div className={styles.emptyState}>
              {recentSearches.length > 0 && (
                <div className={styles.recentSection}>
                  <div className={styles.sectionHeader}>
                    <Clock size={14} strokeWidth={2} />
                    <span>Recent Searches</span>
                    <button className={styles.clearBtn} onClick={clearRecentSearches} aria-label="Clear recent searches">
                      <Trash2 size={12} strokeWidth={2} />
                    </button>
                  </div>
                  <ul className={styles.recentList}>
                    {recentSearches.slice(0, 5).map(q => (
                      <li key={q}>
                        <button
                          className={styles.recentItem}
                          onClick={() => { setQuery(q); inputRef.current?.focus(); }}
                        >
                          <span className={styles.recentQuery}>{q}</span>
                          <button
                            className={styles.removeItem}
                            onClick={(e) => { e.stopPropagation(); removeRecentSearch(q); }}
                            aria-label={`Remove ${q}`}
                          >
                            <X size={12} strokeWidth={2} />
                          </button>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {savedSearches.length > 0 && (
                <div className={styles.savedSection}>
                  <div className={styles.sectionHeader}>
                    <Bookmark size={14} strokeWidth={2} />
                    <span>Saved Searches</span>
                  </div>
                  <ul className={styles.recentList}>
                    {savedSearches.slice(0, 5).map(s => (
                      <li key={s.query}>
                        <button
                          className={styles.recentItem}
                          onClick={() => { setQuery(s.query); inputRef.current?.focus(); }}
                        >
                          <span className={styles.recentQuery}>{s.label || s.query}</span>
                          <button
                            className={styles.removeItem}
                            onClick={(e) => { e.stopPropagation(); removeSavedSearch(s.query); }}
                            aria-label={`Remove saved search ${s.query}`}
                          >
                            <X size={12} strokeWidth={2} />
                          </button>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {recentSearches.length === 0 && savedSearches.length === 0 && (
                <>
                  <Search size={32} strokeWidth={1.5} className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>Search across all documentation</p>
                  <p className={styles.emptyHint}>Docs, releases, roadmap items</p>
                </>
              )}
            </div>
          )}

          {!loading && !error && query && filteredResults.length === 0 && (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>No results for <strong>"{query}"</strong></p>
              {suggestions.length > 0 && (
                <div className={styles.suggestions}>
                  <p className={styles.suggestionLabel}>Did you mean?</p>
                  <div className={styles.suggestionList}>
                    {suggestions.map(s => (
                      <button
                        key={s}
                        className={styles.suggestionBtn}
                        onClick={() => handleSuggestionClick(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className={styles.emptyHint}>Try different keywords or synonyms</p>
            </div>
          )}

          {groupedResults.length > 0 && (
            <ul className={styles.results} ref={listRef}>
              {groupedResults.map(group => (
                <React.Fragment key={group.section}>
                  <li className={styles.groupHeader} aria-hidden="true">
                    <span className={styles.groupLabel}>{group.label}</span>
                    <span className={styles.groupCount}>{group.items.length}</span>
                  </li>
                  {group.items.map((r, i) => {
                    const globalIndex = flatFilteredItems.indexOf(r);
                    const recordType = r.item.type || 'page';
                    
                    if (recordType === 'code') {
                      return (
                        <li key={r.item.id}>
                          <CodeResult
                            result={r.item}
                            query={query}
                            isHighlighted={globalIndex === selectedIndex}
                            onSelect={() => handleResultClick(r.item.url, r.item, globalIndex)}
                          />
                        </li>
                      );
                    }
                    
                    if (recordType === 'image') {
                      return (
                        <li key={r.item.id}>
                          <ImageResult
                            result={r.item}
                            query={query}
                            isHighlighted={globalIndex === selectedIndex}
                            onSelect={() => handleResultClick(r.item.url, r.item, globalIndex)}
                          />
                        </li>
                      );
                    }
                    
                    if (recordType === 'video') {
                      return (
                        <li key={r.item.id}>
                          <VideoResult
                            result={r.item}
                            query={query}
                            isHighlighted={globalIndex === selectedIndex}
                            onSelect={() => handleResultClick(r.item.url, r.item, globalIndex)}
                          />
                        </li>
                      );
                    }
                    
                    if (recordType === 'error') {
                      return (
                        <li key={r.item.id}>
                          <ErrorResult
                            result={r.item}
                            query={query}
                            isHighlighted={globalIndex === selectedIndex}
                            onSelect={() => handleResultClick(r.item.url, r.item, globalIndex)}
                          />
                        </li>
                      );
                    }
                    
                    const titleParts = highlightMatches(r.item.title, query);
                    const excerptParts = highlightMatches(r.item.excerpt, query);
                    
                    return (
                      <li key={r.item.id}>
                        <a
                          href={r.item.url}
                          className={`${styles.result} ${globalIndex === selectedIndex ? styles.resultActive : ''}`}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          onClick={() => handleResultClick(r.item.url, r.item, globalIndex)}
                          tabIndex={-1}
                        >
                          <div className={styles.resultLeft}>
                            <div className={styles.resultHeader}>
                              <span className={`${styles.badge} ${styles[`badge${r.item.section}`]}`}>
                                {SECTION_LABELS[r.item.section] ?? r.item.section}
                              </span>
                              {r.item.category && (
                                <span className={styles.category}>{r.item.category}</span>
                              )}
                              {recordType !== 'page' && (
                                <span className={`${styles.badge} ${styles.typeBadge}`}>
                                  {CONTENT_TYPE_CONFIG[recordType as ContentType]?.icon && React.createElement(CONTENT_TYPE_CONFIG[recordType as ContentType].icon, { size: 12 })}
                                  {CONTENT_TYPE_CONFIG[recordType as ContentType]?.label || recordType}
                                </span>
                              )}
                            </div>
                            <div className={styles.resultTitle}>
                              <HighlightedText parts={titleParts} />
                            </div>
                            {r.item.excerpt && (
                              <p className={styles.resultExcerpt}>
                                <HighlightedText parts={excerptParts} />
                              </p>
                            )}
                          </div>
                          <ArrowRight size={14} strokeWidth={2} className={styles.resultArrow} />
                        </a>
                      </li>
                    );
                  })}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerGroup}>
            <kbd>↑</kbd><kbd>↓</kbd> navigate
          </span>
          <span className={styles.footerGroup}>
            <kbd>Tab</kbd> filter
          </span>
          <span className={styles.footerGroup}>
            <kbd>Enter</kbd> open
          </span>
          <span className={styles.footerGroup}>
            <kbd>?</kbd> shortcuts
          </span>
          <span className={styles.footerRight}>
            {flatFilteredItems.length > 0 && `${flatFilteredItems.length} result${flatFilteredItems.length === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>

      <KeyboardShortcuts isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>,
    document.body
  ) : null;

  return (
    <>
      {trigger}
      {modal}
    </>
  );
}
