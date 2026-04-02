import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { usePostHog, EVENT_NAMES } from '../hooks/usePostHog';

interface User {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

interface PostHogUserContextType {
  user: User | null;
  identify: (user: User) => void;
  logout: () => void;
  updateProperties: (properties: Record<string, unknown>) => void;
  isAdmin: boolean;
}

const PostHogUserContext = createContext<PostHogUserContextType | null>(null);

export function PostHogUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { capture, setPersonProperties, identify: posthogIdentify, reset: posthogReset } = usePostHog();

  const identify = useCallback((userData: User) => {
    setUser(userData);
    posthogIdentify(userData.id, {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      ...userData,
    });
    capture(EVENT_NAMES.LOGIN, { role: userData.role });
  }, [capture, posthogIdentify]);

  const logout = useCallback(() => {
    if (user) {
      capture(EVENT_NAMES.LOGOUT, { role: user.role });
    }
    posthogReset();
    setUser(null);
  }, [user, capture, posthogReset]);

  const updateProperties = useCallback((properties: Record<string, unknown>) => {
    if (user) {
      setPersonProperties(properties);
    }
  }, [user, setPersonProperties]);

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <PostHogUserContext.Provider value={{ user, identify, logout, updateProperties, isAdmin }}>
      {children}
    </PostHogUserContext.Provider>
  );
}

export function usePostHogUser() {
  const context = useContext(PostHogUserContext);
  if (!context) {
    throw new Error('usePostHogUser must be used within a PostHogUserProvider');
  }
  return context;
}

export function withPostHogTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function TrackedComponent(props: P) {
    const { capture } = usePostHog();

    useEffect(() => {
      capture(`${componentName}_viewed`);
    }, [capture]);

    return <WrappedComponent {...props} />;
  };
}
