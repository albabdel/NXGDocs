import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import styles from './integrations.module.css';

type MonitorStats = {
  active: number;
  failed: number;
  warnings: number;
  info: number;
};

type Integration = {
  name: string;
  category: string;
  icon: string;
  status: 'Connection failed' | 'Need setup' | 'Connected';
  assets: number;
  monitors: MonitorStats;
};

type IntegrationGroups = {
  connectionFailed: Integration[];
  needsSetup: Integration[];
  connected: Integration[];
};

type NavItem = { label: string; href: string; active?: boolean };
type NavSection = { label: string; items: NavItem[] };

const sidebarSections: NavSection[] = [
  {
    label: 'Primary',
    items: [
      { label: 'Dashboard', href: '/' },
      { label: 'Documents', href: '/docs' },
      { label: 'Integrations', href: '/integrations', active: true },
    ],
  },
  {
    label: 'Platform',
    items: [
      { label: 'Platform overview', href: '/docs/01-platform-overview/01-introduction' },
      { label: 'Account management', href: '/docs/02-account-management/01-onboarding-checklist' },
      { label: 'Network readiness', href: '/docs/03-network-requirements/01-network-readiness' },
      { label: 'Device integration', href: '/docs/04-device-integration/01-standard-onboarding' },
      { label: 'Operational features', href: '/docs/05-operational-features/01-dashboard-navigation' },
      { label: 'Advanced configuration', href: '/docs/06-advanced-configuration/01-alarm-logic' },
      { label: 'Support & maintenance', href: '/docs/07-support-maintenance/01-reporting-issues' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { label: 'Getting Started', href: '/docs' },
      { label: 'Roles', href: '/docs/roles/admin' },
      { label: 'Features', href: '#' },
      { label: 'Devices', href: '/docs' },
      { label: 'API', href: '/docs/api/index' },
      { label: 'Release notes', href: '#' },
    ],
  },
];

const data: IntegrationGroups = {
  connectionFailed: [
    {
      name: 'Doppler',
      category: 'Secrets management',
      icon: 'doppler-icon.svg',
      status: 'Connection failed',
      assets: 12,
      monitors: { active: 24, failed: 4, warnings: 1, info: 1 },
    },
    {
      name: 'Mezmo',
      category: 'Cloud provider',
      icon: 'mezmo-icon.svg',
      status: 'Connection failed',
      assets: 23,
      monitors: { active: 16, failed: 2, warnings: 2, info: 1 },
    },
    {
      name: 'Github',
      category: 'Version control',
      icon: 'github-icon.svg',
      status: 'Connection failed',
      assets: 47,
      monitors: { active: 11, failed: 0, warnings: 0, info: 0 },
    },
  ],
  needsSetup: [
    {
      name: 'Supabase',
      category: 'Cloud provider',
      icon: 'supabase-icon.svg',
      status: 'Need setup',
      assets: 0,
      monitors: { active: 0, failed: 0, warnings: 0, info: 0 },
    },
    {
      name: 'JumpCloud',
      category: 'Mobile device management',
      icon: 'jumpcloud-icon.svg',
      status: 'Need setup',
      assets: 0,
      monitors: { active: 0, failed: 0, warnings: 0, info: 0 },
    },
  ],
  connected: [
    {
      name: 'Fly.io',
      category: 'Cloud provider',
      icon: 'flyio-icon.svg',
      status: 'Connected',
      assets: 16,
      monitors: { active: 23, failed: 0, warnings: 5, info: 0 },
    },
    {
      name: 'Cloudflare',
      category: 'Cloud provider',
      icon: 'cloudflare-icon.svg',
      status: 'Connected',
      assets: 12,
      monitors: { active: 8, failed: 0, warnings: 0, info: 0 },
    },
    {
      name: 'Azure',
      category: 'Cloud provider',
      icon: 'azure-icon.svg',
      status: 'Connected',
      assets: 6,
      monitors: { active: 5, failed: 0, warnings: 0, info: 0 },
    },
    {
      name: 'Vercel',
      category: 'Cloud provider',
      icon: 'vercel-icon.svg',
      status: 'Connected',
      assets: 24,
      monitors: { active: 11, failed: 0, warnings: 0, info: 0 },
    },
    {
      name: 'Tailscale',
      category: 'VPN',
      icon: 'tailscale-icon.svg',
      status: 'Connected',
      assets: 12,
      monitors: { active: 4, failed: 0, warnings: 0, info: 0 },
    },
  ],
};

const statusBadges = {
  'Connection failed': styles.statusError,
  'Need setup': styles.statusWarning,
  Connected: styles.statusSuccess,
};

const allIntegrations: Integration[] = [...data.connectionFailed, ...data.needsSetup, ...data.connected];

const statusGroups: { label: string; key: keyof IntegrationGroups; badge: keyof typeof statusBadges }[] = [
  { label: 'Connection failed', key: 'connectionFailed', badge: 'Connection failed' },
  { label: 'Needs setup', key: 'needsSetup', badge: 'Need setup' },
  { label: 'Connected', key: 'connected', badge: 'Connected' },
];

const categories = Array.from(new Set(allIntegrations.map((i) => i.category))).sort();

function StatusBadge({ status }: { status: Integration['status'] }) {
  return <span className={`${styles.statusBadge} ${statusBadges[status]}`}>{status}</span>;
}

function MonitorPill({ icon, value, tone }: { icon: string; value: number; tone: 'success' | 'error' | 'neutral' | 'warning' }) {
  return (
    <div className={styles.monitorPill} data-tone={tone}>
      <span className={styles.monitorIcon}>{icon}</span>
      <span className={styles.monitorValue}>{value}</span>
    </div>
  );
}

function IntegrationRow({ item }: { item: Integration }) {
  return (
    <div className={styles.row}>
      <div className={styles.integrationCell}>
        <div className={styles.iconBox} aria-hidden>
          <span className={styles.iconPlaceholder}>{item.name[0]}</span>
        </div>
        <div className={styles.integrationMeta}>
          <div className={styles.integrationName}>{item.name}</div>
          <div className={styles.integrationCategory}>{item.category}</div>
        </div>
      </div>
      <div className={styles.statusCell}>
        <StatusBadge status={item.status} />
      </div>
      <div className={styles.assetsCell}>{item.assets}</div>
      <div className={styles.monitorCell}>
        <MonitorPill icon="✓" value={item.monitors.active} tone="success" />
        <MonitorPill icon="✕" value={item.monitors.failed} tone="error" />
        <MonitorPill icon="!" value={item.monitors.warnings} tone="warning" />
        <MonitorPill icon="○" value={item.monitors.info} tone="neutral" />
      </div>
    </div>
  );
}

export default function IntegrationsPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'active' | 'directory'>('active');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filteredGroups = useMemo(() => {
    const matchText = search.trim().toLowerCase();
    const statusMatch = status.toLowerCase();
    const categoryMatch = category.toLowerCase();

    const filterFn = (item: Integration) => {
      const textOk =
        !matchText || item.name.toLowerCase().includes(matchText) || item.category.toLowerCase().includes(matchText);
      const catOk = category === 'All' || item.category.toLowerCase() === categoryMatch;
      const statusOk = status === 'All' || item.status.toLowerCase() === statusMatch;
      return textOk && catOk && statusOk;
    };

    return {
      connectionFailed: data.connectionFailed.filter(filterFn),
      needsSetup: data.needsSetup.filter(filterFn),
      connected: data.connected.filter(filterFn),
    };
  }, [search, category, status]);

  return (
    <Layout title="Integrations" description="Integrations dashboard">
      <div className={styles.pageShell}>
        <aside className={styles.sidebar} aria-label="App navigation">
          <div className={styles.sidebarHeader}>
            <button className={styles.brandButton} type="button">
              <span className={styles.brandMark}>GX</span>
              <span>GCXONE</span>
              <span className={styles.chevron}>▾</span>
            </button>
            <button className={styles.sidebarIconButton} type="button" aria-label="Toggle menu">
              ☰
            </button>
          </div>

          <div className={styles.sidebarSearch}>
            <span className={styles.searchGlyph} aria-hidden>
              🔍
            </span>
            <input placeholder="Search..." aria-label="Search" />
            <span className={styles.kbd}>⌘K</span>
          </div>

          <nav className={styles.nav}>
            {sidebarSections.map((section) => (
              <div key={section.label} className={styles.navSection}>
                <div className={styles.navSectionLabel}>{section.label}</div>
                <div className={styles.navLinks}>
                  {section.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`${styles.navLink} ${item.active ? styles.navLinkActive : ''}`}
                    >
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.userBadge}>AB</div>
            <div className={styles.userMeta}>
              <span className={styles.userName}>Abed</span>
              <span className={styles.userRole}>Account</span>
            </div>
            <button className={styles.sidebarIconButton} type="button" aria-label="Notifications">
              🔔
            </button>
          </div>
        </aside>

        <div className={styles.pageWrapper}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Integrations</h1>
              <p className={styles.subtitle}>Connect Oneleet with the tools you already use</p>
            </div>
            <button className={styles.addButton} type="button" aria-label="Add integration">
              + Add integration
            </button>
          </header>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'active' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Active integrations
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === 'directory' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('directory')}
            >
              Integration directory
            </button>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIcon} aria-hidden>
                🔍
              </span>
              <input
                type="text"
                placeholder="Search integrations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search integrations"
              />
            </div>
            <div className={styles.dropdown}>
              <label htmlFor="category">CATEGORY</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
              >
                <option value="All">All</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className={styles.dropdownIcon} aria-hidden>
                ▾
              </span>
            </div>
            <div className={styles.dropdown}>
              <label htmlFor="status">STATUS</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="All">All</option>
                <option value="Connection failed">Connection failed</option>
                <option value="Need setup">Need setup</option>
                <option value="Connected">Connected</option>
              </select>
              <span className={styles.dropdownIcon} aria-hidden>
                ▾
              </span>
            </div>
          </div>

          <div className={styles.table}>
            <div className={styles.headerRow}>
              <div>Integration</div>
              <div>Status</div>
              <div>Assets</div>
              <div>Monitor status</div>
            </div>

            {statusGroups.map(({ label, key, badge }) => {
              const items = filteredGroups[key];
              if (items.length === 0) return null;
              return (
                <section key={label} className={styles.groupSection} aria-label={`${label} integrations`}>
                  <div className={styles.groupHeader}>
                    <span className={`${styles.statusBadge} ${statusBadges[badge]}`}>{label}</span>
                    <span className={styles.groupCount}>{items.length}</span>
                  </div>
                  {items.map((item) => (
                    <IntegrationRow key={item.name} item={item} />
                  ))}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
