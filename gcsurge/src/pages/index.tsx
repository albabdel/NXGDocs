import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Mail, Server, DollarSign, Wifi, BookOpen, ArrowUpRight, Loader } from 'lucide-react';
import NXGENSphereHero from '../components/NXGENSphereHero';
import QuickLink from '../components/QuickLink';

// ── Quick access links ────────────────────────────────────────────────────────
const quickLinks = [
  {
    title: 'Device Integration Overview',
    description: 'Register GCXSurge devices and obtain API tokens, SMTP configs, or FTP credentials for event ingestion',
    href: '/docs/gc-surge-device-integration-with-nxgen-platform-api-email-and-ftp-methods',
    icon: <Wifi className="w-5 h-5" />,
  },
  {
    title: 'Event API Reference',
    description: 'Send events with images and clips via POST requests to the GCXSurge proxy endpoint',
    href: '/docs/gc-surge-api-integration-guide-for-sending-events-to-nxgen-platform',
    icon: <Server className="w-5 h-5" />,
  },
  {
    title: 'Pricing Model',
    description: 'Camera-based billing with volume discounts, 3,000 alarms per camera, and €0.03 overage rate',
    href: '/docs/gc-surge-pricing-model',
    icon: <DollarSign className="w-5 h-5" />,
  },
  {
    title: 'All Documentation',
    description: 'Browse SMTP, FTP, and API integration guides for all supported camera brands',
    href: '/docs',
    icon: <BookOpen className="w-5 h-5" />,
  },
];

// ── Integration feature cards ─────────────────────────────────────────────────
const integrations = [
  {
    label: 'SMTP Integration',
    description: 'Email alerts via ZeptoMail for Hikvision, Dahua, Axis, Vivotek, Hanwha, ADPRO, and HikProConnect',
    href: '/docs/hikvision-smtp',
    color: '#C89446',
    icon: <Mail className="w-6 h-6" />,
  },
  {
    label: 'FTP Integration',
    description: 'FTP snapshot uploads for Hikvision, Dahua, Axis, Vivotek, and Ganz AI cameras',
    href: '/docs/hikvision-ftp',
    color: '#B58237',
    icon: <Server className="w-6 h-6" />,
  },
  {
    label: 'REST API',
    description: 'POST events with images/clips as URLs or base64 to gcxsurgeproxy.nxgen.cloud',
    href: '/docs/gc-surge-api-integration-guide-for-sending-events-to-nxgen-platform',
    color: '#A37028',
    icon: <Wifi className="w-6 h-6" />,
  },
  {
    label: 'Pricing',
    description: '€2.50–€3.00 per camera, 3,000 alarms included, €0.03/alarm overage',
    href: '/docs/gc-surge-pricing-model',
    color: '#D4A574',
    icon: <DollarSign className="w-6 h-6" />,
  },
];

// ── Page content ─────────────────────────────────────────────────────────────

function HomePageContent(): React.JSX.Element {
  return (
    <Layout title="GC Surge Documentation" description="Complete documentation for NXGEN GC Surge — cloud surveillance platform with SMTP, FTP, and API integrations.">
      <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
        <NXGENSphereHero />

        <div className="max-w-6xl mx-auto px-6 pb-24">

          {/* ── Quick Access ─────────────────────────────────────────── */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
              style={{ background: 'linear-gradient(135deg, #C89446 0%, #B58237 100%)', color: '#fff', boxShadow: '0 4px 16px rgba(200,148,70,0.35)' }}
            >
              <ArrowUpRight className="w-4 h-4" />
              Browse Documentation
            </Link>
            <a
              href="https://nxgen.cloud/support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium no-underline border"
              style={{ borderColor: 'rgba(200,148,70,0.35)', color: 'var(--ifm-color-primary)', background: 'rgba(200,148,70,0.07)' }}
            >
              Get Support
            </a>
          </div>

          {/* ── Quick Links ──────────────────────────────────────────── */}
          <section className="mt-20">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--ifm-color-primary)' }}>Quick Start</h2>
              <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>Everything you need to get up and running with GC Surge</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickLinks.map(item => (
                <QuickLink key={item.title} title={item.title} description={item.description} icon={item.icon} href={item.href} />
              ))}
            </div>
          </section>

          {/* ── Integration Categories ───────────────────────────────── */}
          <section className="mt-24">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--ifm-color-content)' }}>Integration Types</h2>
              <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>Connect your cameras and systems to GC Surge</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {integrations.map(item => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="rounded-2xl border p-6 no-underline group transition-all duration-200 hover:-translate-y-1"
                  style={{ background: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-200)' }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `rgba(200,148,70,0.12)`, color: item.color }}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: 'var(--ifm-color-content)' }}>{item.label}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--ifm-color-content-secondary)' }}>{item.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* ── CTA ─────────────────────────────────────────────────── */}
          <div className="mt-24">
            <div
              className="relative overflow-hidden rounded-2xl border p-14 text-center"
              style={{ background: 'var(--ifm-background-surface-color)', borderColor: 'var(--ifm-color-emphasis-200)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#C89446]/5 via-transparent to-[#C89446]/5 pointer-events-none" />
              <div className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, #C89446 30%, #D4A574 50%, #C89446 70%, transparent 100%)' }} />
              <h2 className="text-2xl md:text-3xl font-bold mb-3 relative z-10" style={{ color: 'var(--ifm-color-content)' }}>Ready to integrate?</h2>
              <p className="text-base mb-8 relative z-10" style={{ color: 'var(--ifm-color-content-secondary)' }}>Browse all GC Surge documentation and start connecting your devices today.</p>
              <Link
                to="/docs"
                className="relative z-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold no-underline transition-all duration-200"
                style={{ background: '#C89446', color: '#fff', boxShadow: '0 4px 20px rgba(200,148,70,0.25)' }}
              >
                Open Documentation
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <BrowserOnly fallback={
      <Layout title="GC Surge Documentation" description="Documentation for NXGEN GC Surge">
        <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
          <Loader className="w-8 h-8 animate-spin" style={{ color: '#C89446' }} />
        </main>
      </Layout>
    }>
      {() => <HomePageContent />}
    </BrowserOnly>
  );
}
