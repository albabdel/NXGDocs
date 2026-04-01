import React from 'react';
import Content from '@theme-original/Navbar/Content';
import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton, ProfileDropdown } from '@site/src/components/Auth';
import '@site/src/css/components/navbar-auth.css';

/**
 * Navbar Content wrapper with authentication UI.
 * Shows login button when not authenticated, profile dropdown when authenticated.
 */
export default function ContentWrapper(props) {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <>
      <Content {...props} />
      
      {/* Authentication section in navbar */}
      <div className="navbar-auth">
        {isLoading ? (
          /* Loading state while checking auth */
          <div className="navbar-auth-loading">
            <div className="navbar-auth-loading-spinner" />
          </div>
        ) : isAuthenticated ? (
          /* Authenticated - show profile dropdown */
          <ProfileDropdown />
        ) : (
          /* Not authenticated - show login button */
          <LoginButton variant="navbar" size="sm" />
        )}
      </div>
    </>
  );
}
