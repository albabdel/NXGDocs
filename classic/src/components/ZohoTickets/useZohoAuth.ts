import { useState, useEffect, useCallback } from 'react';
import type { ZohoTokenData } from './types';

const CLIENT_ID = '1000.F5X0EPUNG5MJ7NGV5T4CSVO8AU1TZN';
const AUTH_URL = 'https://accounts.zoho.eu/oauth/v2/auth';
const SCOPES = [
  'Desk.tickets.READ',
  'Desk.tickets.UPDATE',
  'Desk.contacts.READ',
  'Desk.search.READ',
  'Desk.basic.READ',
  'aaaserver.profile.read',
].join(' ');
const STORAGE_KEY = 'zoho_agent_token';

function getRedirectUri(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/support`;
}

function buildAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: 'token',
    client_id: CLIENT_ID,
    redirect_uri: getRedirectUri(),
    scope: SCOPES,
    access_type: 'online',
  });
  return `${AUTH_URL}?${params}`;
}

function parseHashToken(): ZohoTokenData | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.substring(1);
  if (!hash || !hash.includes('access_token')) return null;
  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');
  if (!accessToken) return null;
  return {
    accessToken,
    expiry: Date.now() + parseInt(expiresIn ?? '3600') * 1000,
  };
}

function loadStoredToken(): ZohoTokenData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const data: ZohoTokenData = JSON.parse(stored);
    if (data.expiry < Date.now() + 60_000) {
      sessionStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function useZohoAuth() {
  const [token, setToken] = useState<ZohoTokenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hashToken = parseHashToken();
    if (hashToken) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(hashToken));
      setToken(hashToken);
      window.history.replaceState(null, '', window.location.pathname);
      setLoading(false);
      return;
    }
    const stored = loadStoredToken();
    setToken(stored);
    setLoading(false);
  }, []);

  const login = useCallback(() => {
    window.location.href = buildAuthUrl();
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  return {
    token: token?.accessToken ?? null,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };
}
