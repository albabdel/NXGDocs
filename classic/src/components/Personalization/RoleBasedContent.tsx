// classic/src/components/Personalization/RoleBasedContent.tsx
// Role-based content filtering component
//
// Purpose:
//   - Show content only to users with matching roles
//   - Provide fallback content for users without matching roles
//   - Enable role-based personalization across the site
//
// Usage:
//   <RoleBasedContent allowedRoles={['operator', 'manager']}>
//     <OperatorDashboard />
//   </RoleBasedContent>
//
// Reference:
//   - classic/src/hooks/useUserProfile.ts
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserProfile } from '../../hooks/useUserProfile';
import '../../css/components/personalization.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UserRole = 'user' | 'admin' | 'operator' | 'manager' | 'engineer';

export interface RoleBasedContentProps {
  /** Roles that can see this content */
  allowedRoles: UserRole[];
  /** Content to show if user has matching role */
  children: React.ReactNode;
  /** Optional fallback content for users without matching role */
  fallback?: React.ReactNode;
  /** Show content even when not authenticated (for public content) */
  showWhenUnauthenticated?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * RoleBasedContent - Filter content based on user role
 *
 * Shows children only if the user has one of the allowed roles.
 * Falls back to fallback prop or nothing if user doesn't have access.
 *
 * @example
 * // Show content only to operators
 * <RoleBasedContent allowedRoles={['operator']}>
 *   <OperatorGuides />
 * </RoleBasedContent>
 *
 * @example
 * // Show different content to different roles
 * <RoleBasedContent allowedRoles={['operator']} fallback={<DefaultContent />}>
 *   <OperatorDashboard />
 * </RoleBasedContent>
 */
export function RoleBasedContent({
  allowedRoles,
  children,
  fallback = null,
  showWhenUnauthenticated = false,
}: RoleBasedContentProps): React.JSX.Element | null {
  const { isAuthenticated } = useAuth0();
  const { profile, loading } = useUserProfile();

  // Show loading state
  if (loading) {
    return null;
  }

  // Handle unauthenticated users
  if (!isAuthenticated) {
    if (showWhenUnauthenticated) {
      return <>{children}</>;
    }
    return fallback ? <>{fallback}</> : null;
  }

  // Check if user has allowed role
  const userRole = profile?.role || 'user';
  const hasAccess = allowedRoles.includes(userRole as UserRole);

  if (hasAccess) {
    return <>{children}</>;
  }

  // User doesn't have access - show fallback or nothing
  return fallback ? <>{fallback}</> : null;
}

// ---------------------------------------------------------------------------
// Helper Components
// ---------------------------------------------------------------------------

/**
 * RoleBadge - Display a badge with the user's role
 */
export function RoleBadge({ role }: { role: UserRole }): React.JSX.Element {
  return (
    <span className={`role-badge role-badge--${role}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

/**
 * RoleBasedFallback - Default fallback message for restricted content
 */
export function RoleBasedFallback({
  allowedRoles,
}: {
  allowedRoles: UserRole[];
}): React.JSX.Element {
  const rolesText = allowedRoles
    .map((r) => r.charAt(0).toUpperCase() + r.slice(1))
    .join(', ');

  return (
    <div className="role-based-content__fallback">
      This content is available for: {rolesText}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default RoleBasedContent;
