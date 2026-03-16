import React, { useState } from 'react';
import { Headphones, LogIn, Shield, Briefcase, User, AlertCircle } from 'lucide-react';
import type { LoginMode } from './types';

interface Props {
  onLogin: (mode: LoginMode) => void;
  isDark: boolean;
  loginError?: string | null;
}

export default function LoginScreen({ onLogin, isDark, loginError }: Props) {
  const [mode, setMode] = useState<LoginMode>('agent');

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const isCustomer = mode === 'customer';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div
        className="relative w-full max-w-md rounded-2xl p-8 text-center"
        style={{ background: cardBg, border: `1px solid ${borderColor}` }}
      >
        {/* Gold top stripe */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
          }}
        />

        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(232,176,88,0.12)', border: '1px solid rgba(232,176,88,0.25)' }}
        >
          <Headphones className="w-8 h-8" style={{ color: '#E8B058' }} />
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Support Portal
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Sign in to access support tickets.
        </p>

        {/* Mode selector */}
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          <button
            onClick={() => setMode('agent')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: !isCustomer ? 'rgba(232,176,88,0.15)' : 'transparent',
              color: !isCustomer ? '#E8B058' : 'var(--ifm-color-content-secondary)',
              border: !isCustomer ? '1px solid rgba(232,176,88,0.3)' : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            <Briefcase className="w-4 h-4" />
            NXGEN Staff
          </button>
          <button
            onClick={() => setMode('customer')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
            style={{
              background: isCustomer ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: isCustomer ? '#3b82f6' : 'var(--ifm-color-content-secondary)',
              border: isCustomer ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            <User className="w-4 h-4" />
            Customer
          </button>
        </div>

        {/* Mode description */}
        <p className="text-xs mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          {isCustomer
            ? "View your company's support tickets — sign in with your Zoho portal account."
            : 'Access all tickets — for NXGEN support staff only.'}
        </p>

        {/* Error */}
        {loginError && (
          <div
            className="flex items-start gap-2 rounded-xl p-3 mb-4 text-left"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
            <p className="text-xs" style={{ color: '#ef4444' }}>{loginError}</p>
          </div>
        )}

        {/* Sign in button */}
        <button
          onClick={() => onLogin(mode)}
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: isCustomer
              ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
              : 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
            color: isCustomer ? '#fff' : '#000',
            boxShadow: isCustomer
              ? '0 4px 20px rgba(59,130,246,0.3)'
              : '0 4px 20px rgba(232,176,88,0.3)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <LogIn className="w-5 h-5" />
          {isCustomer ? 'Sign in with Zoho Portal' : 'Sign in as Staff'}
        </button>

        <div
          className="flex items-center gap-2 justify-center mt-6 text-xs"
          style={{ color: 'var(--ifm-color-content-secondary)' }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: '#E8B058' }} />
          <span>Secured via Zoho OAuth 2.0</span>
        </div>
      </div>
    </div>
  );
}
