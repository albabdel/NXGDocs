import React from 'react';
import { User, Mail, Phone, Building2, ExternalLink, Plus } from 'lucide-react';
import type { CRMContact } from './types';

interface ContactCardProps {
  contact: CRMContact;
  isDark: boolean;
  onCreateTicket?: (contact: CRMContact) => void;
  onViewAccount?: (accountId: string) => void;
}

export default function ContactCard({
  contact,
  isDark,
  onCreateTicket,
  onViewAccount,
}: ContactCardProps) {
  // Generate initials for avatar
  const initials = `${contact.firstName?.charAt(0) || ''}${contact.lastName?.charAt(0) || ''}`.toUpperCase();
  
  // Full name
  const fullName = `${contact.firstName || ''} ${contact.lastName || ''}`.trim();

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
        ...cardBorder,
      }}
    >
      {/* Header with photo/initials */}
      <div
        className="p-4 flex items-start gap-4"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {/* Avatar */}
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(232,176,88,0.15) 0%, rgba(232,176,88,0.08) 100%)',
            border: '1px solid rgba(232,176,88,0.2)',
          }}
        >
          {contact.photoUrl ? (
            <img
              src={contact.photoUrl}
              alt={fullName}
              className="w-14 h-14 rounded-lg object-cover"
            />
          ) : (
            <span
              className="text-xl font-bold"
              style={{ color: '#E8B058' }}
            >
              {initials || <User className="w-8 h-8" />}
            </span>
          )}
        </div>

        {/* Name and Title */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg font-semibold truncate"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            {fullName || 'Unknown Contact'}
          </h3>
          {contact.title && (
            <p
              className="text-sm truncate"
              style={{ color: 'var(--ifm-color-content-secondary)' }}
            >
              {contact.title}
            </p>
          )}
          {contact.department && (
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--ifm-color-content-secondary)' }}
            >
              {contact.department}
            </p>
          )}
        </div>
      </div>

      {/* Contact Details */}
      <div className="p-4 space-y-3">
        {/* Email */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(232,176,88,0.08)',
              border: '1px solid rgba(232,176,88,0.12)',
            }}
          >
            <Mail className="w-4 h-4" style={{ color: '#E8B058' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-xs"
              style={{ color: 'var(--ifm-color-content-secondary)' }}
            >
              Email
            </p>
            <a
              href={`mailto:${contact.email}`}
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--ifm-color-content)' }}
            >
              {contact.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        {(contact.phone || contact.mobile) && (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(232,176,88,0.08)',
                border: '1px solid rgba(232,176,88,0.12)',
              }}
            >
              <Phone className="w-4 h-4" style={{ color: '#E8B058' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                {contact.mobile ? 'Mobile' : 'Phone'}
              </p>
              <a
                href={`tel:${contact.phone || contact.mobile}`}
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--ifm-color-content)' }}
              >
                {contact.phone || contact.mobile}
              </a>
            </div>
          </div>
        )}

        {/* Company / Account */}
        {(contact.account?.accountName || contact.accountId) && (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(139,92,246,0.08)',
                border: '1px solid rgba(139,92,246,0.12)',
              }}
            >
              <Building2 className="w-4 h-4" style={{ color: '#8b5cf6' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-xs"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
              >
                Company
              </p>
              <button
                onClick={() => contact.accountId && onViewAccount?.(contact.accountId)}
                disabled={!contact.accountId || !onViewAccount}
                className="text-sm font-medium hover:underline disabled:no-underline disabled:cursor-default"
                style={{
                  color: contact.accountId && onViewAccount ? '#8b5cf6' : 'var(--ifm-color-content)',
                  cursor: contact.accountId && onViewAccount ? 'pointer' : 'default',
                }}
              >
                {contact.account?.accountName || 'View Account'}
              </button>
            </div>
            {contact.accountId && onViewAccount && (
              <ExternalLink className="w-4 h-4" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        className="p-4 flex gap-2"
        style={{
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        <a
          href={`mailto:${contact.email}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            color: 'var(--ifm-color-content)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
        {onCreateTicket && (
          <button
            onClick={() => onCreateTicket(contact)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: '#E8B058',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Plus className="w-4 h-4" />
            New Ticket
          </button>
        )}
      </div>
    </div>
  );
}
