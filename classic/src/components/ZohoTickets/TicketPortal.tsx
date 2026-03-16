import React, { useEffect, useState } from 'react';
import { LogOut, Headphones, Loader, Plus, Briefcase, User } from 'lucide-react';
import { useZohoAuth } from './useZohoAuth';
import LoginScreen from './LoginScreen';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import CreateTicketModal from './CreateTicketModal';
import type { ZohoTicket } from './types';

export default function TicketPortal() {
  const { token, session, isAuthenticated, loading, loginError, retrying, login, logout, mode, displayName, clearError } = useZohoAuth();
  const [selectedTicket, setSelectedTicket] = useState<ZohoTicket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [listKey, setListKey] = useState(0);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Verifying account…
        </p>
      </div>
    );
  }

  // Session-based auth for customers, token for agents (handled in hook)
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={login}
        isDark={isDark}
        loginError={loginError}
        retrying={retrying}
        onClearError={clearError}
      />
    );
  }

  const isCustomer = mode === 'customer';
  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
    <div>
      {/* Portal header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
        style={{
          background: isCustomer
            ? (isDark
                ? 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(0,0,0,0.4) 100%)'
                : 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(255,255,255,0.9) 100%)')
            : (isDark
                ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
                : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)'),
          border: `1px solid ${isCustomer
            ? (isDark ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.25)')
            : (isDark ? 'rgba(232,176,88,0.18)' : 'rgba(232,176,88,0.25)')}`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: isCustomer
              ? 'linear-gradient(90deg, transparent 0%, #3b82f6 25%, #2563eb 50%, #3b82f6 75%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: isCustomer ? 'rgba(59,130,246,0.12)' : 'rgba(232,176,88,0.12)',
                border: `1px solid ${isCustomer ? 'rgba(59,130,246,0.2)' : 'rgba(232,176,88,0.2)'}`,
              }}
            >
              {isCustomer
                ? <User className="w-5 h-5" style={{ color: '#3b82f6' }} />
                : <Headphones className="w-5 h-5" style={{ color: '#E8B058' }} />
              }
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Support Tickets
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                {isCustomer
                  ? (displayName ? `Signed in as ${displayName}` : 'Customer Portal')
                  : 'NXGEN Technology AG · Internal Agent View'}
                {' · '}
                <span
                  className="inline-flex items-center gap-1"
                  style={{ color: isCustomer ? '#3b82f6' : '#E8B058' }}
                >
                  {isCustomer ? <User className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                  {isCustomer ? 'Customer' : 'Agent'}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!selectedTicket && (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: isCustomer ? '#3b82f6' : '#E8B058',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Plus className="w-4 h-4" />
                New Ticket
              </button>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                color: 'var(--ifm-color-content-secondary)',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                cursor: 'pointer',
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-xl border p-6"
        style={{
          background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.6)',
          ...cardBorder,
        }}
      >
        {selectedTicket ? (
          <TicketDetail
            ticketId={selectedTicket.id}
            isDark={isDark}
            isCustomer={isCustomer}
            onBack={() => setSelectedTicket(null)}
            token={token ?? undefined}
          />
        ) : (
          <TicketList
            key={listKey}
            isDark={isDark}
            isCustomer={isCustomer}
            onSelect={setSelectedTicket}
          />
        )}
      </div>

      {/* Create ticket modal */}
      {showCreate && (
        <CreateTicketModal
          isDark={isDark}
          isCustomer={isCustomer}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            setListKey(k => k + 1);
          }}
        />
      )}
    </div>
  );
}
