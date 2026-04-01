import React, { useEffect, useState } from 'react';
import { LogOut, Headphones, Loader, Plus, Briefcase, User, ArrowLeft } from 'lucide-react';
import { useZohoAuth } from './useZohoAuth';
import LoginScreen from './LoginScreen';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import CreateTicketModal from './CreateTicketModal';
import CustomerSidebar from './CustomerSidebar';
import type { ZohoTicket } from './types';
import { listTickets } from './zohoApi';

export default function TicketPortal() {
  const { token, session, isAuthenticated, loading, loginError, retrying, login, logout, mode, displayName, clearError } = useZohoAuth();
  const [selectedTicket, setSelectedTicket] = useState<ZohoTicket | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [listKey, setListKey] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [allTickets, setAllTickets] = useState<ZohoTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const isCustomer = mode === 'customer';

  // Load all tickets for customer profile stats
  useEffect(() => {
    if (!isCustomer || !isAuthenticated) return;
    setTicketsLoading(true);
    listTickets({ limit: 100, isCustomer: true })
      .then(res => setAllTickets(res.data ?? []))
      .catch(() => setAllTickets([]))
      .finally(() => setTicketsLoading(false));
  }, [isCustomer, isAuthenticated]);

  // Refresh tickets after creating a new one
  const handleTicketCreated = () => {
    setShowCreate(false);
    setListKey(k => k + 1);
    // Reload all tickets for sidebar stats
    if (isCustomer) {
      listTickets({ limit: 100, isCustomer: true })
        .then(res => setAllTickets(res.data ?? []))
        .catch(() => {});
    }
  };

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



  // Customer view with sidebar layout
  if (isCustomer && session) {
    return (
      <div>
        {/* Portal header */}
        <div className="relative overflow-hidden rounded-2xl p-5 mb-6 portal-header-customer border">
          <div
            className="absolute top-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, #3b82f6 25%, #2563eb 50%, #3b82f6 75%, transparent 100%)',
            }}
          />
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              {selectedTicket && (
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 rounded-lg transition-all hover:opacity-80 ticket-button"
                >
                  <ArrowLeft className="w-4 h-4" style={{ color: 'var(--ifm-color-content)' }} />
                </button>
              )}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.2)',
                }}
              >
                <Headphones className="w-5 h-5" style={{ color: '#3b82f6' }} />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                  {selectedTicket ? `Ticket #${selectedTicket.ticketNumber}` : 'Support Portal'}
                </h1>
                <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  {selectedTicket
                    ? selectedTicket.subject.slice(0, 50) + (selectedTicket.subject.length > 50 ? '…' : '')
                    : (session.account || 'Customer Portal')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Sub-nav */}
              <nav className="hidden sm:flex items-center gap-1 rounded-xl p-1 portal-nav border">
                {[
                  { label: 'My Tickets', active: true, onClick: () => setSelectedTicket(null) },
                  { label: 'New Ticket', active: false, onClick: () => setShowCreate(true) },
                ].map(tab => (
                  <button
                    key={tab.label}
                    onClick={tab.onClick}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all portal-tab ${tab.active ? 'active' : ''}`}
                  >
                    {tab.label}
                  </button>
                ))}
                <a
                  href="/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all no-underline portal-tab"
                >
                  Help Center
                </a>
              </nav>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 ticket-button"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Main content with sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - hidden on mobile when viewing ticket detail */}
          <div className={`w-full lg:w-56 flex-shrink-0 ${selectedTicket ? 'hidden lg:block' : ''}`}>
            <CustomerSidebar
              session={session}
              isDark={isDark}
              tickets={allTickets}
              onNewTicket={() => setShowCreate(true)}
            />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="rounded-xl border p-6 portal-content">
              {selectedTicket ? (
                <TicketDetail
                  ticketId={selectedTicket.id}
                  isDark={isDark}
                  isCustomer={isCustomer}
                  onBack={() => setSelectedTicket(null)}
                  token={token ?? undefined}
                  contactId={session?.contactId}
                />
              ) : (
                <TicketList
                  key={listKey}
                  isDark={isDark}
                  isCustomer={isCustomer}
                  onSelect={setSelectedTicket}
                  token={token ?? undefined}
                />
              )}
            </div>
          </div>
        </div>

        {/* Create ticket modal */}
        {showCreate && (
          <CreateTicketModal
            isDark={isDark}
            isCustomer={isCustomer}
            onClose={() => setShowCreate(false)}
            onCreated={handleTicketCreated}
          />
        )}
      </div>
    );
  }

  // Agent view - original layout
  return (
    <div>
      {/* Portal header */}
      <div className="relative overflow-hidden rounded-2xl p-6 mb-8 portal-header-agent border">
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
          }}
        />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(232,176,88,0.12)',
                border: '1px solid rgba(232,176,88,0.2)',
              }}
            >
              <Headphones className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Support Tickets
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                NXGEN Technology AG · Internal Agent View
                {' · '}
                <span className="inline-flex items-center gap-1" style={{ color: '#E8B058' }}>
                  <Briefcase className="w-3 h-3" />
                  Agent
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
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80 ticket-button"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border p-6 portal-content">
        {selectedTicket ? (
          <TicketDetail
            ticketId={selectedTicket.id}
            isDark={isDark}
            isCustomer={isCustomer}
            onBack={() => setSelectedTicket(null)}
            token={token ?? undefined}
            contactId={session?.contactId}
          />
        ) : (
          <TicketList
            key={listKey}
            isDark={isDark}
            isCustomer={isCustomer}
            onSelect={setSelectedTicket}
            token={token ?? undefined}
          />
        )}
      </div>

      {/* Create ticket modal */}
      {showCreate && (
        <CreateTicketModal
          isDark={isDark}
          isCustomer={isCustomer}
          onClose={() => setShowCreate(false)}
          onCreated={handleTicketCreated}
        />
      )}
    </div>
  );
}
