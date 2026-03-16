import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Headphones,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Ticket,
} from 'lucide-react';
import ContactSearch from './ContactSearch';
import ContactCard from './ContactCard';
import AccountInfo from './AccountInfo';
import type {
  CRMContact,
  CRMContactSearchResult,
  CRMTicketSummary,
} from './types';
import { getContact, getContactTickets, getAccountOpenTicketsCount } from './crmApi';

interface CRMPanelProps {
  token: string;
  email?: string;
  isDark: boolean;
  accentColor?: string;
  onContactSelect?: (contact: CRMContact) => void;
  onCreateTicket?: (contact: CRMContact) => void;
}

export default function CRMPanel({
  token,
  email,
  isDark,
  accentColor = '#8b5cf6',
  onContactSelect,
  onCreateTicket,
}: CRMPanelProps) {
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [recentTickets, setRecentTickets] = useState<CRMTicketSummary[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [showAccount, setShowAccount] = useState(false);

  // Load contact by email if provided
  useEffect(() => {
    if (!email) return;

    let mounted = true;

    const loadContact = async () => {
      setContactLoading(true);
      setContactError(null);

      try {
        const { getContactByEmail } = await import('./crmApi');
        const contact = await getContactByEmail(token, email);

        if (!mounted) return;

        if (contact) {
          setSelectedContact(contact);
        } else {
          setContactError('Contact not found for this email');
        }
      } catch (err) {
        if (!mounted) return;
        setContactError(err instanceof Error ? err.message : 'Failed to load contact');
      } finally {
        if (mounted) {
          setContactLoading(false);
        }
      }
    };

    loadContact();

    return () => {
      mounted = false;
    };
  }, [token, email]);

  // Load recent tickets when contact is selected
  useEffect(() => {
    if (!selectedContact) {
      setRecentTickets([]);
      return;
    }

    let mounted = true;

    const loadTickets = async () => {
      setTicketsLoading(true);

      try {
        const response = await getContactTickets(
          token,
          selectedContact.id,
          selectedContact.accountId
        );

        if (!mounted) return;
        setRecentTickets(response.data);
      } catch (err) {
        console.warn('Failed to load tickets:', err);
        if (!mounted) return;
        setRecentTickets([]);
      } finally {
        if (mounted) {
          setTicketsLoading(false);
        }
      }
    };

    loadTickets();

    return () => {
      mounted = false;
    };
  }, [token, selectedContact]);

  const handleContactSelect = useCallback(async (searchResult: CRMContactSearchResult) => {
    setContactLoading(true);
    setContactError(null);

    try {
      const contact = await getContact(token, searchResult.id);
      if (contact) {
        setSelectedContact(contact);
        onContactSelect?.(contact);
      } else {
        setContactError('Could not load contact details');
      }
    } catch (err) {
      setContactError(err instanceof Error ? err.message : 'Failed to load contact');
    } finally {
      setContactLoading(false);
    }
  }, [token, onContactSelect]);

  const handleViewAccount = useCallback((accountId: string) => {
    setShowAccount(true);
  }, []);

  const handleFetchOpenTickets = useCallback(async (tok: string, accId: string): Promise<number> => {
    return getAccountOpenTicketsCount(tok, accId);
  }, []);

  const handleClearContact = useCallback(() => {
    setSelectedContact(null);
    setShowAccount(false);
    setRecentTickets([]);
    setContactError(null);
  }, []);

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType.toLowerCase()) {
      case 'open':
        return '#E8B058';
      case 'on hold':
      case 'pending':
        return '#3b82f6';
      case 'closed':
      case 'resolved':
        return '#22c55e';
      default:
        return 'var(--ifm-color-content-secondary)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#E8B058';
      case 'low':
        return '#22c55e';
      default:
        return 'var(--ifm-color-content-secondary)';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-xl border p-4"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(139,92,246,0.06) 0%, rgba(0,0,0,0.3) 100%)'
            : 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(255,255,255,0.8) 100%)',
          border: `1px solid ${isDark ? 'rgba(139,92,246,0.18)' : 'rgba(139,92,246,0.25)'}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'rgba(139,92,246,0.12)',
              border: '1px solid rgba(139,92,246,0.2)',
            }}
          >
            <Users className="w-5 h-5" style={{ color: '#8b5cf6' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--ifm-color-content)' }}>
              Customer Context
            </h2>
            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
              CRM contact and account information
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      {!selectedContact && !email && (
        <div
          className="rounded-xl border p-4"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            ...cardBorder,
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: 'var(--ifm-color-content)' }}
          >
            Find Contact
          </h3>
          <ContactSearch
            token={token}
            onContactSelect={handleContactSelect}
            isDark={isDark}
          />
        </div>
      )}

      {/* Loading state for email lookup */}
      {contactLoading && !selectedContact && (
        <div
          className="rounded-xl border p-6"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            ...cardBorder,
          }}
        >
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-5 h-5 animate-spin" style={{ color: '#8b5cf6' }} />
            <span
              className="ml-2 text-sm"
              style={{ color: 'var(--ifm-color-content-secondary)' }}
            >
              Loading contact information...
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {contactError && !selectedContact && (
        <div
          className="rounded-xl border p-6"
          style={{
            background: isDark ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.04)',
            border: `1px solid ${isDark ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.15)'}`,
          }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                Unable to load contact
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {contactError}
              </p>
              {email && (
                <button
                  onClick={handleClearContact}
                  className="mt-3 text-xs font-medium flex items-center gap-1"
                  style={{ color: '#8b5cf6' }}
                >
                  <ChevronRight className="w-3 h-3" />
                  Search for a different contact
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Card */}
      {selectedContact && (
        <ContactCard
          contact={selectedContact}
          isDark={isDark}
          onCreateTicket={onCreateTicket}
          onViewAccount={selectedContact.accountId ? handleViewAccount : undefined}
        />
      )}

      {/* Account Info (when showAccount is true) */}
      {selectedContact?.accountId && showAccount && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3
              className="text-sm font-semibold"
              style={{ color: 'var(--ifm-color-content)' }}
            >
              Account Details
            </h3>
            <button
              onClick={() => setShowAccount(false)}
              className="text-xs font-medium"
              style={{ color: 'var(--ifm-color-content-secondary)' }}
            >
              Hide
            </button>
          </div>
          <AccountInfo
            token={token}
            accountId={selectedContact.accountId}
            isDark={isDark}
            onFetchOpenTickets={handleFetchOpenTickets}
          />
        </div>
      )}

      {/* Recent Tickets */}
      {selectedContact && (
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
            ...cardBorder,
          }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4" style={{ color: '#E8B058' }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: 'var(--ifm-color-content)' }}
              >
                Recent Tickets
              </h3>
            </div>
            {ticketsLoading && (
              <RefreshCw className="w-4 h-4 animate-spin" style={{ color: 'var(--ifm-color-content-secondary)' }} />
            )}
          </div>

          <div className="p-4">
            {ticketsLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw className="w-4 h-4 animate-spin" style={{ color: '#E8B058' }} />
                <span
                  className="ml-2 text-sm"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  Loading tickets...
                </span>
              </div>
            ) : recentTickets.length > 0 ? (
              <div className="space-y-2">
                {recentTickets.slice(0, 5).map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-start gap-3 p-3 rounded-lg transition-all hover:opacity-80"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${getStatusColor(ticket.statusType)}15`,
                        border: `1px solid ${getStatusColor(ticket.statusType)}30`,
                      }}
                    >
                      <Ticket className="w-4 h-4" style={{ color: getStatusColor(ticket.statusType) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-mono"
                          style={{ color: 'var(--ifm-color-content-secondary)' }}
                        >
                          #{ticket.ticketNumber}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `${getStatusColor(ticket.statusType)}15`,
                            color: getStatusColor(ticket.statusType),
                          }}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded"
                          style={{
                            background: `${getPriorityColor(ticket.priority)}15`,
                            color: getPriorityColor(ticket.priority),
                          }}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <p
                        className="text-sm font-medium truncate mt-1"
                        style={{ color: 'var(--ifm-color-content)' }}
                      >
                        {ticket.subject}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: 'var(--ifm-color-content-secondary)' }}
                      >
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(ticket.createdTime).toLocaleDateString()}
                        {ticket.closedTime && (
                          <> - Closed {new Date(ticket.closedTime).toLocaleDateString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Ticket
                  className="w-8 h-8 mb-2"
                  style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.4 }}
                />
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  No tickets found for this contact
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Clear contact button */}
      {selectedContact && (
        <button
          onClick={handleClearContact}
          className="w-full py-2 text-sm font-medium rounded-lg transition-all hover:opacity-80"
          style={{
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            color: 'var(--ifm-color-content-secondary)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
          }}
        >
          Clear Contact
        </button>
      )}
    </div>
  );
}
