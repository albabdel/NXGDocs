import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Menu, User, LogOut, ChevronLeft, ChevronRight, Search, X, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { NotificationsDropdown } from './NotificationsDropdown';
import { SearchResultsDropdown } from './SearchResults';

interface ContentResult {
  id: string;
  title: string;
  type: string;
  status: string;
}

interface TicketResult {
  id: string;
  subject: string;
  status: string;
  ticketNumber: string;
}

interface UserResult {
  id: string;
  name: string;
  email: string;
}

interface SearchResults {
  content: ContentResult[];
  tickets: TicketResult[];
  users: UserResult[];
}

interface AdminHeaderProps {
  title?: string;
  onMenuClick?: () => void;
  onCollapseClick?: () => void;
  sidebarCollapsed?: boolean;
  onSearch?: (query: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function AdminHeader({
  title = 'Admin Dashboard',
  onMenuClick,
  onCollapseClick,
  sidebarCollapsed = false,
  onSearch,
}: AdminHeaderProps) {
  const { user, logout } = useAdminAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({ content: [], tickets: [], users: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults({ content: [], tickets: [], users: [] });
      setSearchDropdownOpen(false);
      return;
    }

    setSearchLoading(true);
    setSearchDropdownOpen(true);
    setSelectedIndex(-1);

    try {
      const response = await fetch(`/admin-search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json() as SearchResults;
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults({ content: [], tickets: [], users: [] });
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim()) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchQuery.trim());
      }, 300);
    } else {
      setSearchResults({ content: [], tickets: [], users: [] });
      setSearchDropdownOpen(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchExpanded]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = searchResults.content.length + searchResults.tickets.length + searchResults.users.length;

    if (e.key === 'Escape') {
      setSearchExpanded(false);
      setSearchQuery('');
      setSearchDropdownOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (totalItems > 0) {
        setSelectedIndex(prev => (prev + 1) % totalItems);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (totalItems > 0) {
        setSelectedIndex(prev => (prev - 1 + totalItems) % totalItems);
      }
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const allItems = [
        ...searchResults.content.map(item => ({ type: 'content', item })),
        ...searchResults.tickets.map(item => ({ type: 'ticket', item })),
        ...searchResults.users.map(item => ({ type: 'user', item })),
      ];
      if (allItems[selectedIndex]) {
        handleResultSelect(allItems[selectedIndex].type, allItems[selectedIndex].item);
      }
    }
  };

  const handleResultSelect = (type: string, item: ContentResult | TicketResult | UserResult) => {
    setSearchExpanded(false);
    setSearchQuery('');
    setSearchDropdownOpen(false);
    setSelectedIndex(-1);

    if (type === 'content') {
      const contentItem = item as ContentResult;
      window.location.href = `/admin/content/${contentItem.id}`;
    } else if (type === 'ticket') {
      const ticketItem = item as TicketResult;
      window.location.href = `/admin/tickets/${ticketItem.id}`;
    } else if (type === 'user') {
      const userItem = item as UserResult;
      window.location.href = `/admin/users/${userItem.id}`;
    }
  };

  const handleSeeAll = () => {
    if (searchQuery.trim()) {
      window.location.href = `/admin/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
    setSearchDropdownOpen(false);
  };

  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: '64px',
        background: isDark ? 'rgba(17, 17, 17, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            cursor: 'pointer',
          }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" style={{ color: 'var(--ifm-color-content)' }} />
        </button>

        <button
          onClick={onCollapseClick}
          className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            cursor: 'pointer',
          }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
          ) : (
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
          )}
        </button>

        <h1
          className="text-lg font-semibold hidden sm:block"
          style={{ color: 'var(--ifm-color-content)' }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div ref={searchRef} className="relative flex items-center">
          {searchExpanded ? (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center transition-all duration-200"
              style={{
                width: '280px',
              }}
            >
              <div
                className="flex items-center w-full rounded-xl overflow-hidden"
                style={{
                  background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                  border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                }}
              >
                {searchLoading ? (
                  <Loader2 className="w-4 h-4 ml-3 animate-spin" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                ) : (
                  <Search className="w-4 h-4 ml-3" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                )}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search content, tickets, users..."
                  className="flex-1 px-3 py-2 text-sm bg-transparent outline-none"
                  style={{ color: 'var(--ifm-color-content)' }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchExpanded(false);
                    setSearchQuery('');
                    setSearchDropdownOpen(false);
                  }}
                  className="p-2 hover:opacity-60"
                  style={{ cursor: 'pointer' }}
                >
                  <X className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                </button>
              </div>
              <SearchResultsDropdown
                results={searchResults}
                loading={searchLoading}
                query={searchQuery}
                isOpen={searchDropdownOpen}
                selectedIndex={selectedIndex}
                onSelect={handleResultSelect}
                onSeeAll={handleSeeAll}
                onClose={() => setSearchDropdownOpen(false)}
              />
            </form>
          ) : (
            <button
              onClick={() => setSearchExpanded(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                cursor: 'pointer',
              }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            </button>
          )}
        </div>

        <NotificationsDropdown />

        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:opacity-80"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              cursor: 'pointer',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold"
              style={{
                background: '#E8B058',
                color: '#1a1a1a',
              }}
            >
              {user?.name ? getInitials(user.name) : <User className="w-4 h-4" />}
            </div>
            <span
              className="hidden sm:block text-sm font-medium"
              style={{ color: 'var(--ifm-color-content)' }}
            >
              {user?.name || 'Admin'}
            </span>
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden shadow-lg"
              style={{
                background: isDark ? 'rgba(17, 17, 17, 0.98)' : 'rgba(255, 255, 255, 0.98)',
                border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                backdropFilter: 'blur(8px)',
                zIndex: 40,
              }}
            >
              <div className="px-4 py-3" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
                <p className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {user?.email || 'admin@nxgen.com'}
                </p>
                <div className="mt-2">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                    style={{
                      background: 'rgba(232, 176, 88, 0.15)',
                      color: '#E8B058',
                      border: '1px solid rgba(232, 176, 88, 0.3)',
                    }}
                  >
                    {user?.role?.toUpperCase() || 'ADMIN'}
                  </span>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                  style={{
                    color: '#ef4444',
                    background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                    cursor: 'pointer',
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
