import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

export default function FloatingSearch(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();

  // Enable keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Perform search using the local search plugin
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Access the search index from the local search plugin
      if (ExecutionEnvironment.canUseDOM && (window as any).__DOCUSAURUS_SEARCH_INDEX__) {
        const searchIndex = (window as any).__DOCUSAURUS_SEARCH_INDEX__;
        const results: SearchResult[] = [];
        
        // Simple search implementation
        for (const doc of searchIndex) {
          const titleMatch = doc.title?.toLowerCase().includes(query.toLowerCase());
          const contentMatch = doc.content?.toLowerCase().includes(query.toLowerCase());
          
          if (titleMatch || contentMatch) {
            results.push({
              title: doc.title || 'Untitled',
              url: doc.url || '#',
              content: doc.content ? doc.content.substring(0, 150) + '...' : 'No content available'
            });
          }
          
          if (results.length >= 8) break; // Limit results
        }
        
        setSearchResults(results);
      } else {
        // Fallback: Simple content search if search index isn't available
        const mockResults: SearchResult[] = [];
        
        if (query.toLowerCase().includes('nova')) {
          mockResults.push({
            title: 'Nova99x',
            url: '/features/nova99x',
            content: 'Silence the Noise. Focus on What\'s Real. Advanced AI-powered threat detection...'
          });
        }
        
        if (query.toLowerCase().includes('bulk')) {
          mockResults.push({
            title: 'Bulk Import',
            url: '/features/bulkimport',
            content: 'Thousands of Sites. Imported in Minutes. Streamline your site onboarding...'
          });
        }
        
        if (query.toLowerCase().includes('zen')) {
          mockResults.push({
            title: 'Zen Mode',
            url: '/features/zenmode',
            content: 'Less Distraction. More Action. A focused, distraction-free interface...'
          });
        }
        
        if (query.toLowerCase().includes('health')) {
          mockResults.push({
            title: 'HealthCheck',
            url: '/features/healthcheck',
            content: 'Catch Failures Before They Cost You. Proactive system monitoring...'
          });
        }
        
        if (query.toLowerCase().includes('custom')) {
          mockResults.push({
            title: 'CustomView',
            url: '/features/customview',
            content: 'See What Matters. Filter Out What Doesn\'t. Personalized interface...'
          });
        }
        
        if (query.toLowerCase().includes('pulse')) {
          mockResults.push({
            title: 'PulseView',
            url: '/features/pulseview',
            content: 'Turn Any Camera Into a Time Machine. Advanced video analytics...'
          });
        }
        
        if (query.toLowerCase().includes('time')) {
          mockResults.push({
            title: 'TimeSync',
            url: '/features/timesync',
            content: 'Every Camera. Perfectly Aligned. Precision time synchronization...'
          });
        }
        
        if (query.toLowerCase().includes('market')) {
          mockResults.push({
            title: 'Marketplace',
            url: '/features/marketplace',
            content: 'Launch New Client Services Instantly. Expand Revenue. Zero Hassle...'
          });
        }
        
        if (query.toLowerCase().includes('tower')) {
          mockResults.push({
            title: 'TowerGuard',
            url: '/features/towerguard',
            content: 'Deploy Towers 3x Faster. With Zero Site Downtime...'
          });
        }
        
        if (query.toLowerCase().includes('device') || query.toLowerCase().includes('adpro')) {
          mockResults.push({
            title: 'ADPRO Device Configuration',
            url: '/devices/ADPRO',
            content: 'Complete guide for ADPRO device setup and configuration...'
          });
        }
        
        setSearchResults(mockResults);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      performSearch(searchValue);
    }
  };

  const handleResultClick = (url: string) => {
    history.push(url);
    setIsOpen(false);
    setSearchValue('');
    setSearchResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchValue('');
      setSearchResults([]);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && selectedIndex < searchResults.length) {
      e.preventDefault();
      handleResultClick(searchResults[selectedIndex].url);
    }
  };

  return (
    <>
      {/* Floating Search Button */}
      <button
        className={styles.floatingSearchButton}
        onClick={() => setIsOpen(true)}
        data-tooltip="Search (Ctrl+K)"
        aria-label="Open search"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>

      {/* Search Overlay */}
      {isOpen && (
        <div className={styles.searchOverlay} onClick={() => setIsOpen(false)}>
          <div className={styles.searchModal} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search documentation..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={styles.searchInput}
                />
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={styles.closeButton}
                  aria-label="Close search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </form>
            
            <div className={styles.searchResults}>
              <div className={styles.searchHint}>
                <kbd>↑</kbd><kbd>↓</kbd> to navigate • <kbd>↵</kbd> to select • <kbd>esc</kbd> to close
              </div>
              
              {isLoading && (
                <div className={styles.loadingState}>
                  <div className={styles.spinner}></div>
                  <span>Searching...</span>
                </div>
              )}
              
              {!isLoading && searchValue && searchResults.length === 0 && (
                <div className={styles.noResults}>
                  No results found for "{searchValue}"
                </div>
              )}
              
              {!isLoading && searchResults.length > 0 && (
                <div className={styles.resultsList}>
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                      onClick={() => handleResultClick(result.url)}
                    >
                      <div className={styles.resultTitle}>{result.title}</div>
                      <div className={styles.resultContent}>{result.content}</div>
                      <div className={styles.resultUrl}>{result.url}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {!searchValue && (
                <div className={styles.searchTips}>
                  <div className={styles.tipsTitle}>Search Tips:</div>
                  <ul>
                    <li>Try "nova" for AI threat detection</li>
                    <li>Try "health" for system monitoring</li>
                    <li>Try "pulse" for video analytics</li>
                    <li>Try "device" for configuration guides</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 