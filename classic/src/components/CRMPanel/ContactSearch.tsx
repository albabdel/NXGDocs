import React, { useState } from 'react';
import { Search, Loader, User, Mail } from 'lucide-react';
import type { CRMContactSearchResult } from './types';

interface ContactSearchProps {
  token: string;
  onContactSelect: (contact: CRMContactSearchResult) => void;
  isDark: boolean;
  initialQuery?: string;
}

export default function ContactSearch({
  token,
  onContactSelect,
  isDark,
  initialQuery = '',
}: ContactSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<CRMContactSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Dynamic import to avoid circular dependencies
      const { searchContacts } = await import('./crmApi');
      const response = await searchContacts(token, query.trim());
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg transition-all"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <Search className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search by email or name..."
            className="flex-1 bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--ifm-color-content)' }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
          style={{
            background: '#E8B058',
            color: '#fff',
            border: 'none',
            cursor: isSearching || !query.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {isSearching ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <div className="space-y-2">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="w-5 h-5 animate-spin" style={{ color: '#E8B058' }} />
              <span
                className="ml-2 text-sm"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                Searching...
              </span>
            </div>
          ) : results.length > 0 ? (
            <>
              <p
                className="text-xs mb-2"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                Found {results.length} contact{results.length !== 1 ? 's' : ''}
              </p>
              {results.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => onContactSelect(contact)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left hover:opacity-80"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                    cursor: 'pointer',
                  }}
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(232,176,88,0.12)',
                      border: '1px solid rgba(232,176,88,0.2)',
                    }}
                  >
                    <User className="w-5 h-5" style={{ color: '#E8B058' }} />
                  </div>
                  
                  {/* Contact Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: 'var(--ifm-color-content)' }}
                    >
                      {contact.firstName} {contact.lastName}
                    </p>
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                      <p
                        className="text-xs truncate"
                        style={{ color: 'var(--ifm-color-content-secondary)' }}
                      >
                        {contact.email}
                      </p>
                    </div>
                    {contact.company && (
                      <p
                        className="text-xs mt-0.5 truncate"
                        style={{ color: '#E8B058' }}
                      >
                        {contact.company}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-8 text-center"
              style={{ color: 'var(--ifm-color-content-secondary)' }}
            >
              <User className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-sm">No contacts found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
