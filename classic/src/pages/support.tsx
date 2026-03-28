import React from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Link from '@docusaurus/Link';
import { ChevronDown, Loader } from 'lucide-react';
import TicketPortal from '../components/ZohoTickets/TicketPortal';

function PortalLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#E8B058', borderTopColor: 'transparent' }} />
    </div>
  );
}

export default function SupportPage() {
  return (
    <Layout
      title="Support Portal | NXGEN"
      description="Manage your NXGEN support tickets"
    >
      <main className="min-h-screen relative overflow-hidden" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        {/* Decorative grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(232,176,88,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(232,176,88,0.022) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        />
        {/* Top-right gradient orb */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: 700,
            height: 700,
            background: 'radial-gradient(circle, rgba(232,176,88,0.05) 0%, transparent 65%)',
            transform: 'translate(25%, -25%)',
          }}
        />
        {/* Bottom-left gradient orb */}
        <div
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{
            width: 600,
            height: 600,
            background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)',
            transform: 'translate(-25%, 25%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-8 relative">
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
            <Link to="/" className="hover:text-[#E8B058] transition-colors no-underline">
              Home
            </Link>
            <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
            <span style={{ color: 'var(--ifm-color-content)' }}>Support Portal</span>
          </nav>

          <BrowserOnly fallback={<PortalLoader />}>
            {() => <TicketPortal />}
          </BrowserOnly>
        </div>
      </main>
    </Layout>
  );
}
