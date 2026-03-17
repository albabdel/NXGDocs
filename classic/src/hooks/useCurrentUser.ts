import { useAdminAuth } from '../contexts/AdminAuthContext';

export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin: isAuthenticated && user?.role === 'admin',
  };
}
