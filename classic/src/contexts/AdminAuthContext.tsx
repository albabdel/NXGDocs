import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  orgId: string;
  role: 'admin';
}

interface AdminAuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/admin-session', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('[AdminAuth] Session validation failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  const login = useCallback(() => {
    // Redirect to Zoho OAuth for admin authentication
    const ZOHO_CLIENT_ID = '1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN';
    const ZOHO_AUTH_URL = 'https://accounts.zoho.eu/oauth/v2/auth';
    const ADMIN_SCOPES = [
      'Desk.tickets.READ',
      'Desk.tickets.UPDATE',
      'Desk.tickets.CREATE',
      'Desk.contacts.READ',
      'Desk.agents.READ',
      'Desk.search.READ',
      'Desk.basic.READ',
      'aaaserver.profile.read',
    ].join(',');

    const redirectUri = `${window.location.origin}/admin-auth-callback`;
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: ZOHO_CLIENT_ID,
      scope: ADMIN_SCOPES,
      redirect_uri: redirectUri,
      access_type: 'offline',
      state: crypto.randomUUID(),
    });

    window.location.href = `${ZOHO_AUTH_URL}?${params}`;
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('/admin-logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('[AdminAuth] Logout failed:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    await validateSession();
  }, [validateSession]);

  const value: AdminAuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    refreshSession,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
