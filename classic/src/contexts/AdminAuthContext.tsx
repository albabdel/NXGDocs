import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const TOKEN_STORAGE_KEY = 'zoho_agent_token';

interface StoredToken {
  accessToken: string;
  expiry: number;
  mode: 'agent';
}

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
  logout: () => void;
  refreshSession: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

function loadStoredToken(): StoredToken | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    const data: StoredToken = JSON.parse(stored);
    if (data.expiry < Date.now() + 60_000) {
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function buildZohoAgentUrl(): string {
  const ZOHO_CLIENT_ID = '1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN';
  const ZOHO_AUTH_URL = 'https://accounts.zoho.eu/oauth/v2/auth';
  const AGENT_SCOPES = [
    'Desk.tickets.READ',
    'Desk.tickets.UPDATE',
    'Desk.tickets.CREATE',
    'Desk.contacts.READ',
    'Desk.agents.READ',
    'Desk.search.READ',
    'Desk.basic.READ',
    'aaaserver.profile.read',
  ].join(',');
  const redirectUri = `${window.location.origin}/support`;
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: ZOHO_CLIENT_ID,
    redirect_uri: redirectUri,
    scope: AGENT_SCOPES,
    access_type: 'online',
  });
  return `${ZOHO_AUTH_URL}?${params}`;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateSession = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = loadStoredToken();
      if (!storedToken) {
        console.log('[AdminAuth] No stored token found');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('[AdminAuth] Validating token...');

      const response = await fetch('/zoho-proxy/accounts/oauth/v2/userinfo', {
        headers: { Authorization: `Zoho-oauthtoken ${storedToken.accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('[AdminAuth] User info fetched:', data.Email || data.email);
        setUser({
          id: data.User_ID || data.sub || '',
          email: data.Email || data.email || '',
          name: data.Display_Name || data.name || data.Email || '',
          orgId: data.Zoho_ID || data.org_id || '',
          role: 'admin',
        });
      } else if (response.status === 401) {
        console.log('[AdminAuth] Token invalid (401), clearing');
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
      } else {
        console.log('[AdminAuth] Userinfo error:', response.status);
        setUser({
          id: '',
          email: '',
          name: 'Admin User',
          orgId: '',
          role: 'admin',
        });
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
    localStorage.setItem('zoho_pending_mode', 'agent');
    localStorage.setItem('zoho_admin_redirect', '/admin');
    window.location.href = buildZohoAgentUrl();
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem('zoho_pending_mode');
    localStorage.removeItem('zoho_admin_redirect');
    setUser(null);
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
