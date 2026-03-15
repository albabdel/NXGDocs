import React from 'react';
import { Headphones, LogIn, Shield } from 'lucide-react';

interface Props {
  onLogin: () => void;
  isDark: boolean;
}

export default function LoginScreen({ onLogin, isDark }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
            : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)',
          border: `1px solid ${isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)'}`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
            position: 'absolute',
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
        <p className="text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Sign in with your Zoho account to access and manage support tickets.
        </p>

        <button
          onClick={onLogin}
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, #E8B058 0%, #C89446 100%)',
            color: '#000',
            boxShadow: '0 4px 20px rgba(232,176,88,0.3)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <LogIn className="w-5 h-5" />
          Sign in with Zoho
        </button>

        <div
          className="flex items-center gap-2 justify-center mt-6 text-xs"
          style={{ color: 'var(--ifm-color-content-secondary)' }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: '#E8B058' }} />
          <span>Authenticated via Zoho OAuth — NXGEN internal use</span>
        </div>
      </div>
    </div>
  );
}
