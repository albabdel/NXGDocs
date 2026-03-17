import React from 'react';
import { Redirect } from '@docusaurus/router';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/admin-login" />;
  }

  return <>{children}</>;
}
