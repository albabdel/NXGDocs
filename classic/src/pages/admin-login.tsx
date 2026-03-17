import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { Loader, Shield, LogIn } from 'lucide-react';

function AdminLoginContent() {
  const { isAuthenticated, isLoading, login } = useAdminAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/admin';
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Verifying session...
        </p>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader className="w-6 h-6 animate-spin" style={{ color: '#E8B058' }} />
        <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Redirecting to admin dashboard...
        </p>
      </div>
    );
  }

  const cardBg = isDark
    ? 'linear-gradient(135deg, rgba(232,176,88,0.06) 0%, rgba(0,0,0,0.4) 100%)'
    : 'linear-gradient(135deg, rgba(232,176,88,0.1) 0%, rgba(255,255,255,0.9) 100%)';

  const borderColor = isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)';

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
          <Shield className="w-8 h-8" style={{ color: '#E8B058' }} />
        </div>

        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
          Admin Portal
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
          Sign in to access the NXGEN admin dashboard.
        </p>

        <button
          onClick={login}
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
          <span>Secured via Zoho OAuth 2.0</span>
        </div>
      </div>
    </div>
  );
}

function LoginLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }} />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Layout
      title="Admin Login | NXGEN"
      description="Sign in to access the NXGEN admin dashboard"
    >
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <BrowserOnly fallback={<LoginLoader />}>
            {() => <AdminLoginContent />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
