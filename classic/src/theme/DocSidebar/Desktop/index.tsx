import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Props } from '@theme/DocSidebar/Desktop';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import RoleSwitcher from '../../../components/RoleSwitcher';
import styles from './styles.module.css';

interface SidebarItem {
  type: string;
  label?: string;
  href?: string;
  items?: SidebarItem[];
  collapsible?: boolean;
  collapsed?: boolean;
  className?: string;
  value?: string;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  href?: string;
  label?: string;
}

// Map role IDs to className values
const roleToClassName: Record<string, string[]> = {
  'admin': ['role-admin', 'role-manager', 'role-minimal'],
  'manager': ['role-manager', 'role-minimal'],
  'operator': ['role-minimal', 'role-manager'],
  'operator-minimal': ['role-minimal'],
};

function getCurrentRole(): string {
  if (typeof window === 'undefined') return 'admin';
  return localStorage.getItem('selectedRole') || 'admin';
}

function isItemVisibleForRole(item: SidebarItem, currentRole: string): boolean {
  if (!item.className) return true;
  const allowedClasses = roleToClassName[currentRole] || [];
  return allowedClasses.includes(item.className);
}

function filterSidebarByRole(items: SidebarItem[], currentRole: string): SidebarItem[] {
  return items
    .filter(item => isItemVisibleForRole(item, currentRole))
    .map(item => {
      if (item.items) {
        return {
          ...item,
          items: filterSidebarByRole(item.items, currentRole),
        };
      }
      return item;
    });
}

function isPathActive(itemHref: string | undefined, activePath: string): boolean {
  if (!itemHref) return false;
  return activePath === itemHref || activePath.startsWith(itemHref + '/');
}

function hasActiveChild(item: SidebarItem, activePath: string): boolean {
  if (item.href && isPathActive(item.href, activePath)) {
    return true;
  }
  if (item.items) {
    return item.items.some(child => hasActiveChild(child, activePath));
  }
  return false;
}

// Ripple effect component
function RippleEffect({ x, y }: { x: number; y: number }) {
  return (
    <span
      className={styles.ripple}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    />
  );
}

// Context Menu Component
function ContextMenu({ menu, onClose, onAction }: {
  menu: ContextMenuState;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!menu.visible || !menu.href) return null;

  const fullUrl = typeof window !== 'undefined' ? window.location.origin + menu.href : menu.href;

  return (
    <div
      ref={menuRef}
      className={styles.contextMenu}
      style={{ left: `${menu.x}px`, top: `${menu.y}px` }}
    >
      <button
        className={styles.contextMenuItem}
        onClick={() => {
          window.open(menu.href, '_blank');
          onAction('open');
          onClose();
        }}
      >
        <span>Open in new tab</span>
        <span className={styles.contextMenuShortcut}>⌘+Click</span>
      </button>
      <button
        className={styles.contextMenuItem}
        onClick={() => {
          navigator.clipboard.writeText(fullUrl);
          onAction('copy');
          onClose();
        }}
      >
        <span>Copy link</span>
        <span className={styles.contextMenuShortcut}>⌘+C</span>
      </button>
    </div>
  );
}

function SidebarMenuItem({ 
  item, 
  depth = 0,
  activePath,
  index = 0,
  onContextMenu: onContextMenuProp
}: { 
  item: SidebarItem; 
  depth?: number;
  activePath: string;
  index?: number;
  onContextMenu: (e: React.MouseEvent, href: string, label: string) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(item.collapsed ?? true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const isCategory = item.type === 'category' && item.items;
  const hasManuallyToggled = useRef(false);
  const previousActivePath = useRef(activePath);
  const itemRef = useRef<HTMLElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  const isActive = useMemo(() => {
    if (item.href) {
      return isPathActive(item.href, activePath);
    }
    return false;
  }, [item.href, activePath]);

  const hasActiveChildItem = useMemo(() => {
    if (isCategory && item.items) {
      return item.items.some(child => hasActiveChild(child, activePath));
    }
    return false;
  }, [isCategory, item.items, activePath]);

  // Scroll to active item
  useEffect(() => {
    if (isActive && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    }
  }, [isActive]);

  useEffect(() => {
    const pathChanged = previousActivePath.current !== activePath;
    previousActivePath.current = activePath;
    
    if (pathChanged) {
      hasManuallyToggled.current = false;
    }
    
    if (hasActiveChildItem && isCollapsed && !hasManuallyToggled.current) {
      setIsCollapsed(false);
    }
  }, [hasActiveChildItem, activePath]);

  const handleToggle = (e: React.MouseEvent) => {
    if (isCategory && item.collapsible !== false) {
      e.preventDefault();
      hasManuallyToggled.current = true;
      setIsAnimating(true);
      setIsCollapsed(!isCollapsed);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setRipple({ x, y });
      setTimeout(() => setRipple(null), 600);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (item.href) {
      e.preventDefault();
      onContextMenuProp(e, item.href, item.label || '');
    }
  };

  if (item.type === 'html') {
    return <div dangerouslySetInnerHTML={{ __html: item.value || '' }} />;
  }

  if (isCategory) {
    const shouldHighlight = hasActiveChildItem;
    
    return (
      <div 
        className={`${styles.menuCategory} ${isAnimating ? styles.animating : ''}`}
        data-depth={depth}
        data-index={index}
        style={{ '--stagger-delay': `${index * 50}ms` } as React.CSSProperties}
      >
        <button
          ref={itemRef as React.RefObject<HTMLButtonElement>}
          className={`${styles.menuCategoryButton} ${isCollapsed ? styles.collapsed : ''} ${shouldHighlight ? styles.hasActive : ''}`}
          onClick={(e) => {
            handleToggle(e);
            handleClick(e);
          }}
          aria-expanded={!isCollapsed}
        >
          {ripple && <RippleEffect x={ripple.x} y={ripple.y} />}
          <span className={styles.menuCategoryLabel}>{item.label}</span>
          <svg 
            className={styles.menuCategoryIcon}
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
            fill="none"
          >
            <path 
              d="M4.5 3L7.5 6L4.5 9" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div 
          className={`${styles.menuCategoryChildren} ${isCollapsed ? styles.collapsed : styles.expanded}`}
        >
          {item.items && item.items.map((child, idx) => (
            <SidebarMenuItem 
              key={idx} 
              item={child} 
              depth={depth + 1}
              activePath={activePath}
              index={idx}
              onContextMenu={onContextMenuProp}
            />
          ))}
        </div>
      </div>
    );
  }

  if (item.href) {
    return (
      <div
        ref={itemRef as React.RefObject<HTMLDivElement>}
        className={styles.menuLinkWrapper}
        data-index={index}
        style={{ '--stagger-delay': `${index * 30}ms` } as React.CSSProperties}
      >
        <Link
          ref={linkRef}
          to={item.href}
          className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''} ${depth > 0 ? styles.menuLinkNested : ''}`}
          data-depth={depth}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
        >
          {ripple && <RippleEffect x={ripple.x} y={ripple.y} />}
          {item.label}
        </Link>
      </div>
    );
  }

  return null;
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className={styles.skeletonItem}>
          <div className={styles.skeletonLine} style={{ width: `${60 + Math.random() * 30}%` }} />
        </div>
      ))}
    </div>
  );
}

function DocSidebarDesktop(props: Props) {
  const location = useLocation();
  const sidebar = props.sidebar || [];
  const [currentRole, setCurrentRole] = useState<string>(getCurrentRole());
  const [isFiltering, setIsFiltering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
  });
  const navRef = useRef<HTMLElement>(null);
  const previousRoleRef = useRef(currentRole);

  // Listen for role changes
  useEffect(() => {
    const handleRoleChange = () => {
      const newRole = getCurrentRole();
      if (newRole !== previousRoleRef.current) {
        setIsFiltering(true);
        previousRoleRef.current = newRole;
        
        setTimeout(() => {
          setCurrentRole(newRole);
          setIsFiltering(false);
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 2000);
        }, 300);
      } else {
        setCurrentRole(newRole);
      }
    };

    handleRoleChange();
    window.addEventListener('roleChanged', handleRoleChange as EventListener);

    return () => {
      window.removeEventListener('roleChanged', handleRoleChange as EventListener);
    };
  }, []);

  // Filter sidebar based on current role
  const filteredSidebar = useMemo(() => {
    return filterSidebarByRole(sidebar, currentRole);
  }, [sidebar, currentRole]);

  const handleContextMenu = useCallback((e: React.MouseEvent, href: string, label: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      href,
      label,
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);

  const handleContextAction = useCallback((action: string) => {
    if (action === 'copy') {
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    }
  }, []);

  // Close context menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };
    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('scroll', handleScroll);
      return () => nav.removeEventListener('scroll', handleScroll);
    }
  }, [contextMenu.visible, closeContextMenu]);

  return (
    <div className={`${styles.sidebarWrapper} ${isFiltering ? styles.filtering : ''} ${showSuccess ? styles.success : ''}`}>
      {/* Premium Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logoLink} aria-label="Home">
            <div className={styles.logoContainer}>
              <img
                src="/img/Xo.png"
                alt="XO Logo"
                className={styles.logo}
              />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>GCXONE</span>
            </div>
          </Link>
        </div>

        <div className={styles.roleSwitcherContainer}>
          <RoleSwitcher type="sidebar" />
        </div>

        {/* Loading Indicator */}
        {isFiltering && (
          <div className={styles.loadingIndicator}>
            <div className={styles.loadingSpinner}></div>
            <span>Filtering content...</span>
          </div>
        )}

        {/* Success Indicator */}
        {showSuccess && !isFiltering && (
          <div className={styles.successIndicator}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Done!</span>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <nav ref={navRef} className={styles.sidebarNav}>
        {isFiltering ? (
          <LoadingSkeleton />
        ) : (
          <div className={styles.menuList}>
            {filteredSidebar.map((item, idx) => (
              <SidebarMenuItem 
                key={idx} 
                item={item} 
                activePath={location.pathname}
                index={idx}
                onContextMenu={handleContextMenu}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Context Menu */}
      <ContextMenu
        menu={contextMenu}
        onClose={closeContextMenu}
        onAction={handleContextAction}
      />
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
