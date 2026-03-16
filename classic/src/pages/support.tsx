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
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
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
