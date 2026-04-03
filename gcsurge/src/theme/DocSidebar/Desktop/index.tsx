import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Props } from '@theme/DocSidebar/Desktop';
import { useLocation } from '@docusaurus/router';
import Link from '@docusaurus/Link';
import { useProduct } from '@theme/Root';
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

function SidebarMenuItem({ 
  item, 
  depth = 0,
  activePath,
  index = 0,
}: { 
  item: SidebarItem; 
  depth?: number;
  activePath: string;
  index?: number;
}) {
  const [isCollapsed, setIsCollapsed] = useState(item.collapsed ?? true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  const isCategory = item.type === 'category' && item.items;
  const hasManuallyToggled = useRef(false);
  const previousActivePath = useRef(activePath);
  const itemRef = useRef<HTMLElement>(null);
  
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
          to={item.href}
          className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''} ${depth > 0 ? styles.menuLinkNested : ''}`}
          data-depth={depth}
          onClick={handleClick}
        >
          {ripple && <RippleEffect x={ripple.x} y={ripple.y} />}
          {item.label}
        </Link>
      </div>
    );
  }

  return null;
}

function DocSidebarDesktop(props: Props) {
  const location = useLocation();
  const { productName } = useProduct();
  const sidebarLogoSrc = '/img/gcsurge-logo.png';
  const sidebar = props.sidebar || [];

  return (
    <div className={styles.sidebarWrapper}>
      {/* Header */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logoSection}>
          <Link to="/" className={styles.logoLink} aria-label="Home">
            <img
              src={sidebarLogoSrc}
              alt={productName}
              className={styles.logo}
            />
          </Link>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.sidebarNav}>
        <div className={styles.menuList}>
          {sidebar.map((item, idx) => (
            <SidebarMenuItem 
              key={idx} 
              item={item} 
              activePath={location.pathname}
              index={idx}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

export default React.memo(DocSidebarDesktop);
