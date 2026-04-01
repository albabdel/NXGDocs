// classic/src/components/Personalization/AddQuickLinkModal.tsx
// Modal for adding/editing quick links
//
// Purpose:
//   - Provide UI for adding new quick links
//   - Validate URL input (internal or external)
//   - Optional icon selection
//
// Usage:
//   <AddQuickLinkModal onClose={handleClose} onSuccess={handleSuccess} />
//
// Reference:
//   - classic/src/hooks/useQuickLinks.ts

import React, { useState } from 'react';
import { X, Link as LinkIcon, Check, AlertCircle } from 'lucide-react';
import { useQuickLinks } from '../../hooks/useQuickLinks';
import '../../css/components/personalization.css';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AddQuickLinkModalProps {
  /** Close modal callback */
  onClose: () => void;
  /** Success callback after link added */
  onSuccess: () => void;
  /** Existing link to edit (optional) */
  editLink?: {
    id: string;
    title: string;
    url: string;
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * AddQuickLinkModal - Modal for adding/editing quick links
 *
 * Provides a form for users to add new quick links.
 * Validates input and handles both internal and external URLs.
 *
 * @example
 * <AddQuickLinkModal onClose={() => setShowModal(false)} onSuccess={() => {}} />
 */
export function AddQuickLinkModal({
  onClose,
  onSuccess,
  editLink,
}: AddQuickLinkModalProps): React.JSX.Element {
  const { addLink, updateLink } = useQuickLinks();
  const [title, setTitle] = useState(editLink?.title || '');
  const [url, setUrl] = useState(editLink?.url || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate form
  const isValid = (): boolean => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!url.trim()) {
      setError('URL is required');
      return false;
    }
    // Basic URL validation
    if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
      return true;
    }
    setError('URL must start with / (internal) or http(s):// (external)');
    return false;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValid()) {
      return;
    }

    setSaving(true);
    try {
      if (editLink) {
        await updateLink(editLink.id, { title: title.trim(), url: url.trim() });
      } else {
        await addLink({ title: title.trim(), url: url.trim() });
      }
      onSuccess();
    } catch (err) {
      console.error('[AddQuickLinkModal] Error saving link:', err);
      setError('Failed to save link. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="quick-link-modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="quick-link-modal">
        {/* Header */}
        <div className="quick-link-modal-header">
          <h2 id="modal-title" className="quick-link-modal-title">
            {editLink ? 'Edit Quick Link' : 'Add Quick Link'}
          </h2>
          <button
            className="quick-link-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="quick-link-modal-body">
            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  color: '#ef4444',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Title Input */}
            <div className="quick-link-form-group">
              <label className="quick-link-form-label" htmlFor="link-title">
                Title
              </label>
              <input
                id="link-title"
                type="text"
                className="quick-link-form-input"
                placeholder="e.g., Alarm Management"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                maxLength={50}
              />
              <p className="quick-link-form-hint">
                A short name for this link (max 50 characters)
              </p>
            </div>

            {/* URL Input */}
            <div className="quick-link-form-group">
              <label className="quick-link-form-label" htmlFor="link-url">
                URL
              </label>
              <input
                id="link-url"
                type="text"
                className="quick-link-form-input"
                placeholder="/docs/alarm-management or https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                maxLength={500}
              />
              <p className="quick-link-form-hint">
                Internal paths start with / or external URLs with https://
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="quick-link-modal-footer">
            <button
              type="button"
              className="quick-link-modal-btn quick-link-modal-btn--secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="quick-link-modal-btn quick-link-modal-btn--primary"
              disabled={saving || !title.trim() || !url.trim()}
            >
              {saving ? (
                'Saving...'
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {editLink ? 'Save Changes' : 'Add Link'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Default Export
// ---------------------------------------------------------------------------

export default AddQuickLinkModal;
