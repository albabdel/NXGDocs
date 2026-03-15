import React, { useEffect, useState } from 'react';
import { LogOut, Headphones, Loader } from 'lucide-react';
import { useZohoAuth } from './useZohoAuth';
import LoginScreen from './LoginScreen';
import TicketList from './TicketList';
import TicketDetail from './TicketDetail';
import type { ZohoTicket } from './types';

export default function TicketPortal() {
  const { token, isAuthenticated, loading, login, logout } = useZohoAuth();
  const [selectedTicket, setSelectedTicket] = useState<ZohoTicket | null>(null);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <LoginScreen onLogin={login} isDark={isDark} />;
  }

  const cardBorder = {
    borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
  };

  return (
    <div>
      {/* Portal header */}
      <div
        className="relative overflow-hidden rounded-2xl p-6 mb-8"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)',
          border: `1px solid ${isDark ? 'rgba(232,176,88,0.18)' : 'rgba(232,176,88,0.25)'}`,
        }}
      >
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
              style={{ background: 'rgba(232,176,88,0.12)', border: '1px solid rgba(232,176,88,0.2)' }}
            >
              <Headphones className="w-5 h-5" style={{ color: '#E8B058' }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>
                Support Tickets
              </h1>
              <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                NXGEN Technology AG · Internal Agent View
              </p>
            </div>
          </div>
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
            token={token}
            ticketId={selectedTicket.id}
            isDark={isDark}
            onBack={() => setSelectedTicket(null)}
          />
        ) : (
          <TicketList
            token={token}
            isDark={isDark}
            onSelect={setSelectedTicket}
          />
        )}
      </div>
    </div>
  );
}
