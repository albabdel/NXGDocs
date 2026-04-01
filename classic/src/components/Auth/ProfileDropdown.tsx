import React, { useState, useRef, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, Settings, LogOut, ChevronDown, Bookmark, Clock } from 'lucide-react';
import { clsx } from 'clsx';

interface ProfileDropdownProps {
  className?: string;
}

/**
 * User profile dropdown showing avatar and menu options.
 * Displays when user is authenticated.
 */
export default function ProfileDropdown({ className }: ProfileDropdownProps) {
  const { user, logout, isAuthenticated } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  // Get user initials for avatar fallback
  const getInitials = (name: string | undefined): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const initials = getInitials(user.name);
  const displayName = user.name || user.email?.split('@')[0] || 'User';

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex items-center gap-2 px-2 py-1.5 rounded-full',
          'transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'focus-visible:ring-[var(--ifm-color-primary)]'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        {user.picture ? (
          <img
            src={user.picture}
            alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(232, 176, 88, 0.2) 0%, rgba(200, 148, 70, 0.1) 100%)',
              border: '2px solid rgba(232, 176, 88, 0.25)',
              color: '#E8B058',
            }}
          >
            {initials}
          </div>
        )}
        <span
          className="hidden sm:block text-sm font-medium max-w-[120px] truncate"
          style={{ color: 'var(--ifm-color-content)' }}
        >
          {displayName}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          style={{ color: 'var(--ifm-color-content-secondary)' }}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={clsx(
            'absolute right-0 mt-2 w-56 rounded-xl py-1 z-50',
            'shadow-lg border'
          )}
          style={{
            backgroundColor: 'var(--ifm-background-color)',
            borderColor: 'var(--ifm-color-emphasis-200)',
          }}
          role="menu"
          aria-orientation="vertical"
        >
          {/* User info header */}
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: 'var(--ifm-color-emphasis-200)' }}
          >
            <p
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--ifm-color-content)' }}
            >
              {displayName}
            </p>
            {user.email && (
              <p
                className="text-xs truncate"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                {user.email}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="py-1">
            <a
              href="/profile"
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 text-sm',
                'transition-colors hover:bg-black/5 dark:hover:bg-white/5'
              )}
              style={{ color: 'var(--ifm-color-content)' }}
              role="menuitem"
            >
              <User className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <span>Profile</span>
            </a>
            <a
              href="/profile/settings"
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 text-sm',
                'transition-colors hover:bg-black/5 dark:hover:bg-white/5'
              )}
              style={{ color: 'var(--ifm-color-content)' }}
              role="menuitem"
            >
              <Settings className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <span>Settings</span>
            </a>
            <a
              href="/profile/bookmarks"
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 text-sm',
                'transition-colors hover:bg-black/5 dark:hover:bg-white/5'
              )}
              style={{ color: 'var(--ifm-color-content)' }}
              role="menuitem"
            >
              <Bookmark className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <span>Bookmarks</span>
            </a>
            <a
              href="/profile/history"
              onClick={() => setIsOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 text-sm',
                'transition-colors hover:bg-black/5 dark:hover:bg-white/5'
              )}
              style={{ color: 'var(--ifm-color-content)' }}
              role="menuitem"
            >
              <Clock className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
              <span>History</span>
            </a>
          </div>

          {/* Logout */}
          <div
            className="border-t pt-1 mt-1"
            style={{ borderColor: 'var(--ifm-color-emphasis-200)' }}
          >
            <button
              onClick={handleLogout}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left',
                'transition-colors hover:bg-red-500/5'
              )}
              style={{ color: '#ef4444' }}
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
