// classic/src/contexts/ProductAccessContext.tsx
// React context for product access entitlements
//
// Purpose: Provide product access information to components
// - Fetches session data from /customer-session or /admin-session
// - Exposes productAccess array and hasAccess() helper
// - Enables content filtering based on user's product entitlements

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface ProductAccess {
  productAccess: string[];
  hasAccess: (product: string) => boolean;
  isLoading: boolean;
  error: string | null;
}

interface AdminSessionResponse {
  user: {
    id: string;
    email: string;
    name: string;
    orgId: string;
    role: string;
    productAccess: string[];
  } | null;
}

interface CustomerSessionResponse {
  user: {
    contactId: string;
    accountId: string | null;
    displayName: string;
    productAccess: string[];
  } | null;
}

const ProductAccessContext = createContext<ProductAccess | undefined>(undefined);

/**
 * Detect if current path indicates admin area
 */
function isAdminPath(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname.startsWith('/admin');
}

/**
 * Fetch admin session data
 */
async function fetchAdminSession(): Promise<string[]> {
  const response = await fetch('/admin-session');
  if (!response.ok) {
    if (response.status === 401) {
      return []; // Not authenticated
    }
    throw new Error(`Failed to fetch admin session: ${response.status}`);
  }
  const data: AdminSessionResponse = await response.json();
  return data.user?.productAccess ?? [];
}

/**
 * Fetch customer session data
 */
async function fetchCustomerSession(): Promise<string[]> {
  const response = await fetch('/customer-session');
  if (!response.ok) {
    if (response.status === 401) {
      return []; // Not authenticated
    }
    throw new Error(`Failed to fetch customer session: ${response.status}`);
  }
  const data: CustomerSessionResponse = await response.json();
  return data.user?.productAccess ?? [];
}

export function ProductAccessProvider({ children }: { children: React.ReactNode }) {
  const [productAccess, setProductAccess] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProductAccess = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if we're in admin area or customer area
      const isAdmin = isAdminPath();
      
      if (isAdmin) {
        const access = await fetchAdminSession();
        setProductAccess(access);
      } else {
        const access = await fetchCustomerSession();
        setProductAccess(access);
      }
    } catch (err) {
      console.error('[ProductAccess] Failed to load:', err);
      setError(err instanceof Error ? err.message : 'Failed to load product access');
      setProductAccess([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProductAccess();
  }, [loadProductAccess]);

  /**
   * Check if user has access to a specific product
   */
  const hasAccess = useCallback((product: string): boolean => {
    return productAccess.includes(product);
  }, [productAccess]);

  const value: ProductAccess = {
    productAccess,
    hasAccess,
    isLoading,
    error,
  };

  return (
    <ProductAccessContext.Provider value={value}>
      {children}
    </ProductAccessContext.Provider>
  );
}

/**
 * Hook to access product entitlements
 * Returns productAccess array, hasAccess function, and loading state
 */
export function useProductAccess(): ProductAccess {
  const context = useContext(ProductAccessContext);
  if (!context) {
    throw new Error('useProductAccess must be used within ProductAccessProvider');
  }
  return context;
}
