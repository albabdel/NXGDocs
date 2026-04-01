// classic/src/components/Personalization/QuickLinks.tsx
// Quick links sidebar component
//
// Purpose:
//   - Display user's custom quick links in sidebar
//   - Allow adding/removing links
//   - Navigate to quick links management page
//
// Usage:
//   <QuickLinks />
//
// Reference:
//   - classic/src/hooks/useQuickLinks.ts
//   - .planning/research/auth0-upgrade-UX-PATTERNS.md

import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Link as LinkIcon,
  Plus,
  X,
  ExternalLink,
  Settings,
  FileText,
} from 'lucide-react';
import { useQuickLinks } from '../../hooks/useQuickLinks';
import type { QuickLink } from '../../hooks/useQuickLinks';
import { AddQuickLinkModal } from './AddQuickLinkModal';
import '../../css/components/personalization.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QuickLinksProps {
  /** Maximum number of links to display */
  maxDisplay?: number;
  /** Show add button */
  showAddButton?: boolean;
  /** Show manage link */
  showManageLink?: boolean;
  /** Compact mode for sidebar */
  compact?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * QuickLinks - Display user's custom quick links
 *
 * Shows a list of quick links that the user has added.
 * Includes functionality to add, remove, and manage links.
 *
 * @example
 * <QuickLinks maxDisplay={5} showAddButton showManageLink />
 */
export function QuickLinks({
  maxDisplay = 10,
  showAddButton = true,
  showManageLink = true,
  compact = false,
}: QuickLinksProps): React.JSX.Element | null {
  const { isAuthenticated } = useAuth0();
  const { quickLinks, loading, removeLink } = useQuickLinks();
  const [showModal, setShowModal] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Handle remove link
  const handleRemove = async (id: string) => {
    setRemovingId(id);
    try {
      await removeLink(id);
    } finally {
      setRemovingId(null);
    }
  };

  // Determine if link is external
  const isExternal = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Display limited links
  const displayLinks = quickLinks.slice(0, maxDisplay);

  return (
    <>
      <div className="quick-links-sidebar">
        {/* Header */}
        <div className="quick-links-header">
          <div className="quick-links-title">
            <LinkIcon className="quick-links-title-icon" />
            <span>Quick Links</span>
          </div>
          {showAddButton && (
            <button
              className="quick-links-add-btn"
              onClick={() => setShowModal(true)}
              title="Add quick link"
              aria-label="Add quick link"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          // Loading state
          <div className="quick-links-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="quick-link-item" style={{ opacity: 0.5 }}>
                <div className="quick-link-item-icon">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <div
                  className="quick-link-item-title"
                  style={{ background: 'rgba(255,255,255,0.1)', height: '0.75rem', width: '60%' }}
                />
              </div>
            ))}
          </div>
        ) : displayLinks.length === 0 ? (
          // Empty state
          <div className="quick-links-empty">
            <LinkIcon className="quick-links-empty-icon" />
            <p className="quick-links-empty-text">No quick links yet</p>
            <button
              className="quick-links-empty-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-3 h-3" />
              Add your first link
            </button>
          </div>
        ) : (
          // Links list
          <div className="quick-links-list">
            {displayLinks.map((link) => (
              <div key={link.id} className="quick-link-item-wrapper">
                {isExternal(link.url) ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quick-link-item"
                  >
                    <div className="quick-link-item-icon">
                      <ExternalLink className="w-4 h-4" />
                    </div>
                    <span className="quick-link-item-title">{link.title}</span>
                    <button
                      className="quick-link-item-remove"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(link.id);
                      }}
                      disabled={removingId === link.id}
                      title="Remove link"
                      aria-label="Remove link"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </a>
                ) : (
                  <Link to={link.url} className="quick-link-item">
                    <div className="quick-link-item-icon">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="quick-link-item-title">{link.title}</span>
                    <button
                      className="quick-link-item-remove"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(link.id);
                      }}
                      disabled={removingId === link.id}
                      title="Remove link"
                      aria-label="Remove link"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Manage Link */}
        {showManageLink && quickLinks.length > 0 && (
          <Link
            to="/profile/quick-links"
            className="quick-link-item"
            style={{ marginTop: '0.5rem', borderTop: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <div className="quick-link-item-icon">
              <Settings className="w-4 h-4" />
            </div>
            <span className="quick-link-item-title">Manage links</span>
          </Link>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <AddQuickLinkModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default QuickLinks;
