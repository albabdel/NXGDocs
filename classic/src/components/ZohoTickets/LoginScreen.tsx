import React, { useState } from 'react';
import { Headphones, LogIn, Shield, Briefcase, User, AlertCircle, RefreshCw, Wifi, UserX, Lock, Clock, Server, Ticket, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import type { LoginMode, AuthError, AuthErrorType } from './types';

interface Props {
  onLogin: (mode: LoginMode) => void;
  isDark: boolean;
  loginError?: AuthError | null;
  retrying?: boolean;
  onClearError?: () => void;
}

export default function LoginScreen({ onLogin, isDark, loginError, retrying, onClearError }: Props) {
  const [mode, setMode] = useState<LoginMode>('agent');

  const getErrorMeta = (type: AuthErrorType): { icon: React.ReactNode; color: string } => {
    switch (type) {
      case 'network_error':
        return { icon: <Wifi className="w-4 h-4" />, color: '#f59e0b' };
      case 'contact_not_found':
        return { icon: <UserX className="w-4 h-4" />, color: '#ef4444' };
      case 'portal_access_denied':
        return { icon: <Lock className="w-4 h-4" />, color: '#ef4444' };
      case 'session_expired':
      case 'invalid_token':
        return { icon: <Clock className="w-4 h-4" />, color: '#f59e0b' };
      case 'server_error':
        return { icon: <Server className="w-4 h-4" />, color: '#f59e0b' };
      default:
        return { icon: <AlertCircle className="w-4 h-4" />, color: '#ef4444' };
    }
  };

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

  const isCustomer = mode === 'customer';

  const customerFeatures = [
    { icon: <Ticket className="w-4 h-4" />, text: 'View all your support tickets' },
    { icon: <MessageSquare className="w-4 h-4" />, text: 'Reply and add comments' },
    { icon: <CheckCircle className="w-4 h-4" />, text: 'Track ticket status in real-time' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div
        className="relative w-full max-w-md rounded-2xl p-8 text-center"
        style={{ background: cardBg, border: `1px solid ${borderColor}` }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
          }}
        />

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

        <p className="text-xs mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          {isCustomer
            ? "View your company's support tickets — sign in with your Zoho portal account."
            : 'Access all tickets — for NXGEN support staff only.'}
        </p>

        {isCustomer && (
          <div
            className="rounded-xl p-4 mb-6 text-left"
            style={{
              background: isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.05)',
              border: '1px solid rgba(59,130,246,0.15)',
            }}
          >
            <p className="text-xs font-medium mb-3" style={{ color: '#3b82f6' }}>
              After logging in, you can:
            </p>
            <ul className="space-y-2">
              {customerFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                  <span style={{ color: '#3b82f6' }}>{feature.icon}</span>
                  {feature.text}
                </li>
              ))}
            </ul>
          </div>
        )}

        {loginError && (
          <div
            className="flex items-start gap-3 rounded-xl p-4 mb-4 text-left"
            style={{
              background: loginError.retryable
                ? 'rgba(245,158,11,0.08)'
                : 'rgba(239,68,68,0.08)',
              border: loginError.retryable
                ? '1px solid rgba(245,158,11,0.25)'
                : '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <div className="flex-shrink-0 mt-0.5" style={{ color: getErrorMeta(loginError.type).color }}>
              {getErrorMeta(loginError.type).icon}
            </div>
            <div className="flex-1">
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: getErrorMeta(loginError.type).color }}
              >
                {loginError.type === 'network_error' && 'Connection Error'}
                {loginError.type === 'contact_not_found' && 'Account Not Found'}
                {loginError.type === 'portal_access_denied' && 'Access Denied'}
                {loginError.type === 'session_expired' && 'Session Expired'}
                {loginError.type === 'invalid_token' && 'Authentication Failed'}
                {loginError.type === 'nonce_mismatch' && 'Security Error'}
                {loginError.type === 'server_error' && 'Server Error'}
                {loginError.type === 'unknown' && 'Error'}
              </p>
              <p
                className="text-sm mb-2"
                style={{ color: 'var(--ifm-color-content)' }}
              >
                {loginError.message}
              </p>
              {loginError.action && (
                <p
                  className="text-xs"
                  style={{ color: 'var(--ifm-color-content-secondary)' }}
                >
                  {loginError.action}
                </p>
              )}
            </div>
            {onClearError && (
              <button
                onClick={onClearError}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ color: 'var(--ifm-color-content-secondary)' }}
                aria-label="Dismiss error"
              >
                ×
              </button>
            )}
          </div>
        )}

        {retrying && (
          <div
            className="flex items-center gap-2 rounded-xl p-3 mb-4"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <RefreshCw className="w-4 h-4 animate-spin" style={{ color: '#3b82f6' }} />
            <p className="text-xs font-medium" style={{ color: '#3b82f6' }}>Connecting to server...</p>
          </div>
        )}

        <button
          onClick={() => onLogin(mode)}
          disabled={retrying}
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 group"
          style={{
            background: isCustomer
              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              : 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
            color: isCustomer ? '#fff' : '#000',
            boxShadow: isCustomer
              ? '0 6px 24px rgba(59,130,246,0.4)'
              : '0 4px 20px rgba(232,176,88,0.3)',
            border: 'none',
            cursor: retrying ? 'not-allowed' : 'pointer',
          }}
        >
          {retrying ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              {isCustomer ? <Shield className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              <span className="text-base">{isCustomer ? 'Sign in with Auth0' : 'Sign in as Staff'}</span>
              <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>

        {isCustomer && (
          <p className="text-xs mt-4" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            Use your company email to access your support tickets
          </p>
        )}

        <div
          className="flex items-center gap-2 justify-center mt-6 text-xs"
          style={{ color: 'var(--ifm-color-content-secondary)' }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: '#E8B058' }} />
          <span>{isCustomer ? 'Secured via Auth0' : 'Secured via Zoho OAuth 2.0'}</span>
        </div>
      </div>
    </div>
  );
}
