import React, { useRef, useEffect } from 'react';
import { FileText, Ticket, User, ArrowRight, Loader2 } from 'lucide-react';

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

interface SearchResultsDropdownProps {
  results: SearchResults;
  loading: boolean;
  query: string;
  isOpen: boolean;
  selectedIndex: number;
  onSelect: (type: string, item: ContentResult | TicketResult | UserResult) => void;
  onSeeAll: () => void;
  onClose: () => void;
}

function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'published' || s === 'approved' || s === 'closed') return '#22c55e';
  if (s === 'pending_review' || s === 'pending' || s === 'open') return '#f59e0b';
  if (s === 'rejected' || s === 'on-hold') return '#ef4444';
  return '#6b7280';
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    doc: 'Document',
    article: 'Article',
    release: 'Release',
    roadmapItem: 'Roadmap',
    landingPage: 'Landing Page',
  };
  return labels[type] || type;
}

export function SearchResultsDropdown({
  results,
  loading,
  query,
  isOpen,
  selectedIndex,
  onSelect,
  onSeeAll,
  onClose,
}: SearchResultsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const hasResults = results.content.length > 0 || results.tickets.length > 0 || results.users.length > 0;
  let flatItems: { type: string; item: ContentResult | TicketResult | UserResult }[] = [];
  
  results.content.forEach(item => flatItems.push({ type: 'content', item }));
  results.tickets.forEach(item => flatItems.push({ type: 'ticket', item }));
  results.users.forEach(item => flatItems.push({ type: 'user', item }));

  const totalItems = flatItems.length;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl shadow-lg"
      style={{
        background: isDark ? 'rgba(17, 17, 17, 0.98)' : 'rgba(255, 255, 255, 0.98)',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        backdropFilter: 'blur(8px)',
        zIndex: 50,
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin" style={{ color: 'var(--ifm-color-content-secondary)' }} />
          <span className="ml-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Searching...
          </span>
        </div>
      ) : !hasResults ? (
        <div className="px-4 py-6 text-center">
          <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            No results found for "{query}"
          </p>
        </div>
      ) : (
        <>
          {results.content.length > 0 && (
            <div style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }}>
                <FileText className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  Content ({results.content.length})
                </span>
              </div>
              {results.content.map((item, idx) => {
                const globalIdx = flatItems.findIndex(f => f.type === 'content' && f.item.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect('content', item)}
                    className="w-full px-3 py-2 text-left hover:opacity-80 transition-all"
                    style={{
                      background: selectedIndex === globalIdx ? (isDark ? 'rgba(232, 176, 88, 0.1)' : 'rgba(232, 176, 88, 0.05)') : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
                        {item.title}
                      </span>
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {getTypeLabel(item.type)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {results.tickets.length > 0 && (
            <div style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }}>
                <Ticket className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  Tickets ({results.tickets.length})
                </span>
              </div>
              {results.tickets.map((item) => {
                const globalIdx = flatItems.findIndex(f => f.type === 'ticket' && f.item.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect('ticket', item)}
                    className="w-full px-3 py-2 text-left hover:opacity-80 transition-all"
                    style={{
                      background: selectedIndex === globalIdx ? (isDark ? 'rgba(232, 176, 88, 0.1)' : 'rgba(232, 176, 88, 0.05)') : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
                        {item.subject}
                      </span>
                      <span
                        className="ml-2 px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      #{item.ticketNumber}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {results.users.length > 0 && (
            <div style={{ borderBottom: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}` }}>
              <div className="px-3 py-2 flex items-center gap-2" style={{ background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)' }}>
                <User className="w-4 h-4" style={{ color: '#E8B058' }} />
                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  Users ({results.users.length})
                </span>
              </div>
              {results.users.map((item) => {
                const globalIdx = flatItems.findIndex(f => f.type === 'user' && f.item.id === item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect('user', item)}
                    className="w-full px-3 py-2 text-left hover:opacity-80 transition-all"
                    style={{
                      background: selectedIndex === globalIdx ? (isDark ? 'rgba(232, 176, 88, 0.1)' : 'rgba(232, 176, 88, 0.05)') : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                      {item.name}
                    </span>
                    <span className="text-xs block" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                      {item.email}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {totalItems > 0 && (
            <button
              onClick={onSeeAll}
              className="w-full px-3 py-2 flex items-center justify-between hover:opacity-80 transition-all"
              style={{
                background: isDark ? 'rgba(232, 176, 88, 0.05)' : 'rgba(232, 176, 88, 0.02)',
                cursor: 'pointer',
              }}
            >
              <span className="text-sm font-medium" style={{ color: '#E8B058' }}>
                See all results
              </span>
              <ArrowRight className="w-4 h-4" style={{ color: '#E8B058' }} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
