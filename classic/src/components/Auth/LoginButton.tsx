import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Shield } from 'lucide-react';
import { clsx } from 'clsx';

interface LoginButtonProps {
  variant?: 'navbar' | 'hero';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Login button component that triggers Auth0 login flow.
 * Matches the gold/blue button styling used throughout the site.
 * 
 * IMPORTANT: Does NOT use prompt: 'login' to preserve SSO across NXGEN apps.
 */
export default function LoginButton({ 
  variant = 'navbar', 
  size = 'md',
  className 
}: LoginButtonProps) {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = async () => {
    // Store current path for redirect after login
    const currentPath = window.location.pathname + window.location.search;
    sessionStorage.setItem('auth0_redirect_path', currentPath);
    
    await loginWithRedirect({
      authorizationParams: {
        redirect_uri: typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : undefined,
        scope: 'openid profile email',
      },
    });
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5',
  };

  // Variant-specific styles
  const variantStyles = {
    navbar: {
      button: `
        inline-flex items-center justify-center font-semibold rounded-full
        transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
      `,
      background: 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
      color: '#000',
      boxShadow: '0 4px 12px rgba(232, 176, 88, 0.25)',
    },
    hero: {
      button: `
        inline-flex items-center justify-center font-bold rounded-xl
        transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
      `,
      background: 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
      color: '#000',
      boxShadow: '0 8px 24px rgba(232, 176, 88, 0.35)',
    },
  };

  const styles = variantStyles[variant];

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={clsx(styles.button, sizeClasses[size], className)}
      style={{
        background: styles.background,
        color: styles.color,
        boxShadow: styles.boxShadow,
        border: 'none',
        cursor: isLoading ? 'not-allowed' : 'pointer',
      }}
    >
      <Shield className="w-4 h-4" />
      <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
    </button>
  );
}
