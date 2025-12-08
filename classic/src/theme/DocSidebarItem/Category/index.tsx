import React, { useEffect } from 'react';
import DocSidebarItemCategory from '@theme-original/DocSidebarItem/Category';
import type {WrapperProps} from '@docusaurus/types';
import type {Props} from '@theme/DocSidebarItem/Category';
import { useLocation } from '@docusaurus/router';

type CategoryProps = WrapperProps<typeof DocSidebarItemCategory>;

const STORAGE_KEY = 'docusaurus.sidebar.collapsed';

function getStoredState(label: string): boolean | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[label];
    }
  } catch (e) {
    // Ignore
  }
  return null;
}

function setStoredState(label: string, collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed[label] = collapsed;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (e) {
    // Ignore
  }
}

export default function DocSidebarItemCategoryWrapper(props: CategoryProps): React.JSX.Element {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(() => {
    const stored = getStoredState(props.item.label);
    return stored !== null ? stored : props.item.collapsed ?? true;
  });

  // Auto-expand if current page is within this category
  useEffect(() => {
    const isActive = props.item.items?.some((item: any) => {
      if (item.href && location.pathname.startsWith(item.href)) return true;
      if (item.items) {
        return item.items.some((subItem: any) => 
          subItem.href && location.pathname.startsWith(subItem.href)
        );
      }
      return false;
    });
    
    if (isActive && collapsed) {
      setCollapsed(false);
      setStoredState(props.item.label, false);
    }
  }, [location.pathname, props.item]);

  const handleCollapse = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    setStoredState(props.item.label, newCollapsed);
  };

  return (
    <DocSidebarItemCategory 
      {...props} 
      item={{ ...props.item, collapsed }}
      onCollapse={handleCollapse}
    />
  );
}
