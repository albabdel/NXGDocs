// classic/src/components/Personalization/index.ts
// Barrel export for Personalization components
//
// Purpose:
//   - Export all personalization components from a single entry point
//   - Simplify imports across the codebase
//
// Usage:
//   import { RoleBasedContent, RecommendedReading, QuickLinks } from '../components/Personalization';

export { RoleBasedContent, RoleBadge, RoleBasedFallback } from './RoleBasedContent';
export type { RoleBasedContentProps, UserRole } from './RoleBasedContent';

export { RecommendedReading } from './RecommendedReading';
export type { RecommendedReadingProps, RecommendedItem } from './RecommendedReading';

export { QuickLinks } from './QuickLinks';
export type { QuickLinksProps } from './QuickLinks';

export { AddQuickLinkModal } from './AddQuickLinkModal';
export type { AddQuickLinkModalProps } from './AddQuickLinkModal';
