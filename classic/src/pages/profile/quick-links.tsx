// classic/src/pages/profile/quick-links.tsx
// Quick links management page
//
// Purpose:
//   - Full management interface for user's quick links
//   - Add, edit, remove, and reorder links
//   - Preview how links appear in sidebar
//
// Reference:
//   - classic/src/hooks/useQuickLinks.ts
//   - classic/src/components/Personalization/QuickLinks.tsx

import React, { useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProtectedRoute } from '../../components/Auth/UserProtectedRoute';
import { useQuickLinks } from '../../hooks/useQuickLinks';
import { AddQuickLinkModal } from '../../components/Personalization/AddQuickLinkModal';
import {
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit3,
  GripVertical,
  ExternalLink,
  FileText,
  ArrowLeft,
  Loader,
  AlertCircle,
} from 'lucide-react';
import '../../css/components/personalization.css';

// ---------------------------------------------------------------------------
// Quick Links Page Content
// ---------------------------------------------------------------------------

function QuickLinksPageContent() {
  const { user } = useAuth0();
  const { quickLinks, loading, error, removeLink, refetch } = useQuickLinks();
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<{ id: string; title: string; url: string } | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Handle remove link
  const handleRemove = async (id: string) => {
    if (!confirm('Are you sure you want to remove this quick link?')) {
      return;
    }
    setRemovingId(id);
    try {
      await removeLink(id);
    } finally {
      setRemovingId(null);
    }
  };

  // Handle edit link
  const handleEdit = (link: { id: string; title: string; url: string }) => {
    setEditingLink(link);
    setShowModal(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowModal(false);
    setEditingLink(null);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    setShowModal(false);
    setEditingLink(null);
    refetch();
  };

  // Determine if link is external
  const isExternal = (url: string): boolean => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container margin-vert--xl">
        <div className="quick-links-page-card" style={{ textAlign: 'center', padding: '2rem' }}>
          <AlertCircle className="w-8 h-8 mx-auto mb-4" style={{ color: '#ef4444' }} />
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>Error loading quick links. Please try again.</p>
          <button
            onClick={refetch}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              background: 'rgba(232, 176, 88, 0.1)',
              color: '#E8B058',
              border: '1px solid rgba(232, 176, 88, 0.3)',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container margin-vert--lg">
      {/* Back link */}
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-sm mb-6 no-underline"
        style={{ color: 'var(--ifm-color-content-secondary)' }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      {/* Page Header */}
      <div className="quick-links-page-header">
        <h1 className="quick-links-page-title">
          <LinkIcon className="w-6 h-6 inline mr-2" style={{ color: '#E8B058' }} />
          Quick Links
        </h1>
        <p className="quick-links-page-desc">
          Manage your personal shortcuts for quick access to frequently used pages.
          These links appear in your sidebar when logged in.
        </p>
      </div>

      {/* Links Card */}
      <div className="quick-links-page-card">
        {/* Header */}
        <div className="quick-links-page-list-header">
          <span className="quick-links-page-count">
            {quickLinks.length} of 10 links
          </span>
          <button
            className="quick-links-page-add-btn"
            onClick={() => setShowModal(true)}
            disabled={quickLinks.length >= 10}
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        {/* Links List */}
        {quickLinks.length === 0 ? (
          <div className="quick-links-page-empty">
            <LinkIcon className="quick-links-page-empty-icon" />
            <h3 className="quick-links-page-empty-title">No quick links yet</h3>
            <p className="quick-links-page-empty-text">
              Add your first quick link to get quick access to your favorite pages from the sidebar.
            </p>
            <button
              className="quick-links-page-add-btn"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Your First Link
            </button>
          </div>
        ) : (
          <div>
            {quickLinks.map((link, index) => (
              <div key={link.id} className="quick-links-page-item">
                {/* Drag handle (visual only for now) */}
                <div className="quick-links-page-item-drag">
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Icon */}
                <div className="quick-links-page-item-icon">
                  {isExternal(link.url) ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className="quick-links-page-item-content">
                  <div className="quick-links-page-item-title">{link.title}</div>
                  <div className="quick-links-page-item-url">{link.url}</div>
                </div>

                {/* Actions */}
                <div className="quick-links-page-item-actions">
                  <button
                    className="quick-links-page-item-btn"
                    onClick={() => handleEdit(link)}
                    title="Edit link"
                    aria-label="Edit link"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    className="quick-links-page-item-btn quick-links-page-item-btn--delete"
                    onClick={() => handleRemove(link.id)}
                    disabled={removingId === link.id}
                    title="Remove link"
                    aria-label="Remove link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Section */}
      {quickLinks.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3
            style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: 'var(--ifm-color-content)',
            }}
          >
            Preview (as shown in sidebar)
          </h3>
          <div style={{ maxWidth: '320px' }}>
            <div className="quick-links-sidebar">
              <div className="quick-links-header">
                <div className="quick-links-title">
                  <LinkIcon className="quick-links-title-icon" />
                  <span>Quick Links</span>
                </div>
              </div>
              <div className="quick-links-list">
                {quickLinks.slice(0, 5).map((link) => (
                  <div key={link.id} className="quick-link-item">
                    <div className="quick-link-item-icon">
                      {isExternal(link.url) ? (
                        <ExternalLink className="w-4 h-4" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                    </div>
                    <span className="quick-link-item-title">{link.title}</span>
                  </div>
                ))}
                {quickLinks.length > 5 && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--ifm-color-content-secondary)',
                      padding: '0.5rem 0.625rem',
                    }}
                  >
                    +{quickLinks.length - 5} more links
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <AddQuickLinkModal
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          editLink={editingLink || undefined}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Protected Page Wrapper
// ---------------------------------------------------------------------------

function QuickLinksPage() {
  return (
    <UserProtectedRoute>
      <QuickLinksPageContent />
    </UserProtectedRoute>
  );
}

// ---------------------------------------------------------------------------
// Export with BrowserOnly
// ---------------------------------------------------------------------------

export default function QuickLinksPageWrapper() {
  return (
    <Layout title="Quick Links | NxGen Docs">
      <BrowserOnly
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
          </div>
        }
      >
        {() => <QuickLinksPage />}
      </BrowserOnly>
    </Layout>
  );
}
