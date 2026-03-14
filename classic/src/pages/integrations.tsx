import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
    Home,
    ChevronRight,
    Search,
    X,
    Video,
    Radio,
    Cloud,
    Bell,
    Check,
    AlertTriangle,
    XCircle,
    Plug,
    ArrowUpRight,
    Server,
    Camera,
    Cpu,
    Router,
    Database,
    Eye,
    Box,
    HardDrive,
    FileText,
    Activity,
} from 'lucide-react';
import styles from './index.module.css';

type MonitorStats = {
    active: number;
    failed: number;
    warnings: number;
    info: number;
};

type Integration = {
    name: string;
    category: string;
    subcategory: string;
    icon: string;
    status: 'Connection failed' | 'Need setup' | 'Connected';
    assets: number;
    monitors: MonitorStats;
    description: string;
    features: string[];
    configLink: string | null;
};

type Category = 'Video' | 'IoT' | 'Cloud' | 'Notifications';

const categoryConfig: Record<Category, { icon: React.ReactNode; color: string; description: string }> = {
    'Video': { 
        icon: <Video className="w-5 h-5" />, 
        color: 'text-purple-400',
        description: 'Cameras, NVRs, VMS platforms'
    },
    'IoT': { 
        icon: <Radio className="w-5 h-5" />, 
        color: 'text-cyan-400',
        description: 'Sensors, routers, gateways'
    },
    'Cloud': { 
        icon: <Cloud className="w-5 h-5" />, 
        color: 'text-sky-400',
        description: 'Cloud providers and services'
    },
    'Notifications': { 
        icon: <Bell className="w-5 h-5" />, 
        color: 'text-amber-400',
        description: 'Alerting and messaging services'
    },
};

const integrations: Integration[] = [
    {
        name: 'Hikvision',
        category: 'Video',
        subcategory: 'NVR',
        icon: 'hikvision',
        status: 'Connected',
        assets: 47,
        monitors: { active: 89, failed: 0, warnings: 3, info: 2 },
        description: 'Video surveillance systems and NVRs',
        features: ['Cloud Mode', 'Local Mode', 'Health Monitoring', 'Timelapse'],
        configLink: '/docs/devices/hikvision',
    },
    {
        name: 'Dahua',
        category: 'Video',
        subcategory: 'NVR',
        icon: 'dahua',
        status: 'Connected',
        assets: 32,
        monitors: { active: 64, failed: 0, warnings: 1, info: 0 },
        description: 'IP cameras and recording systems',
        features: ['Cloud Mode', 'Local Mode', 'Health Monitoring'],
        configLink: '/docs/devices/dahua',
    },
    {
        name: 'Axis',
        category: 'Video',
        subcategory: 'IP Camera',
        icon: 'axis',
        status: 'Connected',
        assets: 28,
        monitors: { active: 56, failed: 0, warnings: 0, info: 0 },
        description: 'Network cameras and video solutions',
        features: ['ONVIF', 'Health Monitoring', 'Timelapse'],
        configLink: '/docs/devices/axis-ip-camera',
    },
    {
        name: 'Milestone',
        category: 'Video',
        subcategory: 'VMS',
        icon: 'milestone',
        status: 'Need setup',
        assets: 0,
        monitors: { active: 0, failed: 0, warnings: 0, info: 0 },
        description: 'Video management software platform',
        features: ['VMS Integration', 'Multi-site'],
        configLink: '/docs/devices/milestone-gcx-one',
    },
    {
        name: 'Ajax',
        category: 'IoT',
        subcategory: 'Alarm Panel',
        icon: 'ajax',
        status: 'Connected',
        assets: 15,
        monitors: { active: 30, failed: 0, warnings: 2, info: 1 },
        description: 'Wireless security systems',
        features: ['Alarm Events', 'Device Health', 'Battery Status'],
        configLink: '/docs/devices/ajax',
    },
    {
        name: 'Teltonika',
        category: 'IoT',
        subcategory: 'Router',
        icon: 'teltonika',
        status: 'Connected',
        assets: 8,
        monitors: { active: 16, failed: 0, warnings: 0, info: 0 },
        description: 'Industrial IoT routers and gateways',
        features: ['Connectivity', 'Signal Strength', 'Data Usage'],
        configLink: '/docs/devices/teltonika-iot',
    },
    {
        name: 'Victron',
        category: 'IoT',
        subcategory: 'Power',
        icon: 'victron',
        status: 'Need setup',
        assets: 0,
        monitors: { active: 0, failed: 0, warnings: 0, info: 0 },
        description: 'Power monitoring and management',
        features: ['Battery Monitoring', 'Solar Integration'],
        configLink: '/docs/devices/victron',
    },
    {
        name: 'Fly.io',
        category: 'Cloud',
        subcategory: 'Cloud Provider',
        icon: 'flyio',
        status: 'Connected',
        assets: 16,
        monitors: { active: 23, failed: 0, warnings: 5, info: 0 },
        description: 'Application hosting platform',
        features: ['Server Monitoring', 'Deployment Status'],
        configLink: null,
    },
    {
        name: 'Cloudflare',
        category: 'Cloud',
        subcategory: 'CDN',
        icon: 'cloudflare',
        status: 'Connected',
        assets: 12,
        monitors: { active: 8, failed: 0, warnings: 0, info: 0 },
        description: 'Web security and performance',
        features: ['DNS Monitoring', 'SSL Status'],
        configLink: null,
    },
    {
        name: 'Azure',
        category: 'Cloud',
        subcategory: 'Cloud Provider',
        icon: 'azure',
        status: 'Connected',
        assets: 6,
        monitors: { active: 5, failed: 0, warnings: 0, info: 0 },
        description: 'Microsoft cloud services',
        features: ['Resource Monitoring', 'AD Integration'],
        configLink: null,
    },
    {
        name: 'Vercel',
        category: 'Cloud',
        subcategory: 'Hosting',
        icon: 'vercel',
        status: 'Connected',
        assets: 24,
        monitors: { active: 11, failed: 0, warnings: 0, info: 0 },
        description: 'Frontend deployment platform',
        features: ['Deployment Status', 'Performance'],
        configLink: null,
    },
    {
        name: 'Supabase',
        category: 'Cloud',
        subcategory: 'Database',
        icon: 'supabase',
        status: 'Need setup',
        assets: 0,
        monitors: { active: 0, failed: 0, warnings: 0, info: 0 },
        description: 'Backend-as-a-Service platform',
        features: ['Database', 'Authentication', 'Storage'],
        configLink: null,
    },
    {
        name: 'Tailscale',
        category: 'Cloud',
        subcategory: 'VPN',
        icon: 'tailscale',
        status: 'Connected',
        assets: 12,
        monitors: { active: 4, failed: 0, warnings: 0, info: 0 },
        description: 'Secure mesh VPN network',
        features: ['Network Status', 'Peer Connectivity'],
        configLink: null,
    },
    {
        name: 'Doppler',
        category: 'Cloud',
        subcategory: 'Secrets',
        icon: 'doppler',
        status: 'Connection failed',
        assets: 12,
        monitors: { active: 24, failed: 4, warnings: 1, info: 1 },
        description: 'Secrets management platform',
        features: ['Secret Sync', 'Environment Config'],
        configLink: null,
    },
    {
        name: 'Slack',
        category: 'Notifications',
        subcategory: 'Messaging',
        icon: 'slack',
        status: 'Connected',
        assets: 5,
        monitors: { active: 10, failed: 0, warnings: 0, info: 0 },
        description: 'Team messaging and alerts',
        features: ['Alert Channels', 'Webhooks'],
        configLink: null,
    },
    {
        name: 'PagerDuty',
        category: 'Notifications',
        subcategory: 'Alerting',
        icon: 'pagerduty',
        status: 'Need setup',
        assets: 0,
        monitors: { active: 0, failed: 0, warnings: 0, info: 0 },
        description: 'Incident management platform',
        features: ['Escalation Policies', 'On-call Schedules'],
        configLink: null,
    },
    {
        name: 'Twilio',
        category: 'Notifications',
        subcategory: 'SMS',
        icon: 'twilio',
        status: 'Connected',
        assets: 3,
        monitors: { active: 6, failed: 0, warnings: 0, info: 0 },
        description: 'SMS and voice notifications',
        features: ['SMS Alerts', 'Voice Calls'],
        configLink: null,
    },
    {
        name: 'SendGrid',
        category: 'Notifications',
        subcategory: 'Email',
        icon: 'sendgrid',
        status: 'Connected',
        assets: 2,
        monitors: { active: 4, failed: 0, warnings: 0, info: 0 },
        description: 'Email delivery service',
        features: ['Email Alerts', 'Templates'],
        configLink: null,
    },
];

const statusConfig = {
    'Connected': { 
        icon: <Check className="w-3 h-3" />, 
        color: 'bg-green-500/10 text-green-400 border-green-500/20',
        label: 'Connected'
    },
    'Need setup': { 
        icon: <AlertTriangle className="w-3 h-3" />, 
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        label: 'Needs Setup'
    },
    'Connection failed': { 
        icon: <XCircle className="w-3 h-3" />, 
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
        label: 'Failed'
    },
};

export default function IntegrationsPage(): React.JSX.Element {
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'All' | Integration['status']>('All');
    const [isDark, setIsDark] = useState(true);

    React.useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    React.useEffect(() => {
        const hash = window.location.hash.slice(1).toLowerCase();
        const categoryMap: Record<string, Category> = {
            'video': 'Video',
            'iot': 'IoT',
            'cloud': 'Cloud',
            'notifications': 'Notifications'
        };
        if (hash && categoryMap[hash]) {
            setActiveCategory(categoryMap[hash]);
            const element = document.getElementById(hash);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }, []);

    const filteredIntegrations = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return integrations.filter(integration => {
            const matchesCategory = activeCategory === 'All' || integration.category === activeCategory;
            const matchesSearch = !query || 
                integration.name.toLowerCase().includes(query) ||
                integration.subcategory.toLowerCase().includes(query) ||
                integration.description.toLowerCase().includes(query);
            const matchesStatus = statusFilter === 'All' || integration.status === statusFilter;
            return matchesCategory && matchesSearch && matchesStatus;
        });
    }, [activeCategory, searchQuery, statusFilter]);

    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = { Video: 0, IoT: 0, Cloud: 0, Notifications: 0 };
        integrations.forEach(i => {
            stats[i.category] = (stats[i.category] || 0) + 1;
        });
        return stats;
    }, []);

    const statusStats = useMemo(() => {
        const stats = { connected: 0, needSetup: 0, failed: 0 };
        integrations.forEach(i => {
            if (i.status === 'Connected') stats.connected++;
            else if (i.status === 'Need setup') stats.needSetup++;
            else stats.failed++;
        });
        return stats;
    }, []);

    return (
        <Layout title="Integrations | GCXONE" description="Connect and manage integrations with GCXONE">
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link to="/" className="flex items-center gap-1 hover:text-[#E8B058] transition-colors no-underline">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <span style={{ color: 'var(--ifm-color-content)' }}>Integrations</span>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <section className="mb-12">
                        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(232,176,88,0.08) 0%, rgba(0,0,0,0.5) 50%, rgba(232,176,88,0.05) 100%)'
                                : 'linear-gradient(135deg, rgba(232,176,88,0.12) 0%, rgba(255,255,255,0.8) 50%, rgba(232,176,88,0.08) 100%)',
                            border: `1px solid ${isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)'}`,
                        }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                                background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
                            }} />
                            
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <span className={styles.sectionBadge}>Connections</span>
                                    <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                                        Integrations
                                    </h1>
                                    <p className="text-lg max-w-2xl" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Connect GCXONE with the tools and services you already use. Manage video systems, IoT devices, cloud services, and notification channels.
                                    </p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 lg:w-80">
                                    <div className="p-4 rounded-xl text-center" style={{
                                        background: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)',
                                        border: `1px solid ${isDark ? 'rgba(34,197,94,0.2)' : 'rgba(34,197,94,0.15)'}`,
                                    }}>
                                        <div className="text-2xl font-bold text-green-400">{statusStats.connected}</div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Connected</div>
                                    </div>
                                    <div className="p-4 rounded-xl text-center" style={{
                                        background: isDark ? 'rgba(245,158,11,0.1)' : 'rgba(245,158,11,0.08)',
                                        border: `1px solid ${isDark ? 'rgba(245,158,11,0.2)' : 'rgba(245,158,11,0.15)'}`,
                                    }}>
                                        <div className="text-2xl font-bold text-amber-400">{statusStats.needSetup}</div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Setup</div>
                                    </div>
                                    <div className="p-4 rounded-xl text-center" style={{
                                        background: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.08)',
                                        border: `1px solid ${isDark ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.15)'}`,
                                    }}>
                                        <div className="text-2xl font-bold text-red-400">{statusStats.failed}</div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>Failed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(categoryConfig).map(([category, config]) => {
                                const isActive = activeCategory === category;
                                const count = categoryStats[category] || 0;
                                return (
                                    <button
                                        key={category}
                                        id={category.toLowerCase()}
                                        onClick={() => setActiveCategory(isActive ? 'All' : category as Category)}
                                        className={`p-5 rounded-xl border text-left transition-all duration-200 ${isActive ? 'scale-[1.02]' : ''}`}
                                        style={{
                                            background: isActive 
                                                ? 'rgba(232, 176, 88, 0.1)' 
                                                : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                            borderColor: isActive ? '#E8B058' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                        }}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`} style={{
                                                background: 'rgba(232,176,88,0.1)',
                                            }}>
                                                {config.icon}
                                            </div>
                                            <span className="text-2xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>{count}</span>
                                        </div>
                                        <div className="font-medium text-sm" style={{ color: isActive ? '#E8B058' : 'var(--ifm-color-content)' }}>
                                            {category}
                                        </div>
                                        <div className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                            {config.description}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                                <input
                                    type="text"
                                    placeholder="Search integrations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-10 py-3 rounded-xl border focus:outline-none transition-colors"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.15)',
                                        color: 'var(--ifm-color-content)',
                                    }}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70"
                                        style={{ color: 'var(--ifm-color-content-secondary)' }}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                className="px-4 py-3 rounded-xl border focus:outline-none min-w-[160px]"
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.15)',
                                    color: 'var(--ifm-color-content)',
                                }}
                            >
                                <option value="All">All Status</option>
                                <option value="Connected">Connected</option>
                                <option value="Need setup">Needs Setup</option>
                                <option value="Connection failed">Failed</option>
                            </select>
                        </div>
                        <div className="mt-4 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Showing {filteredIntegrations.length} of {integrations.length} integrations
                        </div>
                    </section>

                    <section>
                        {filteredIntegrations.length === 0 ? (
                            <div className="text-center py-16 rounded-xl border" style={{
                                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                            }}>
                                <Search className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.3 }} />
                                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>No integrations found</h3>
                                <p className="mb-4" style={{ color: 'var(--ifm-color-content-secondary)' }}>Try adjusting your search or filters</p>
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); setStatusFilter('All'); }}
                                    className="px-4 py-2 rounded-lg bg-[#E8B058]/10 text-[#E8B058] border border-[#E8B058]/30 hover:bg-[#E8B058]/20 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredIntegrations.map((integration) => {
                                    const status = statusConfig[integration.status];
                                    return (
                                        <div
                                            key={integration.name}
                                            className="rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer group hover:scale-[1.02]"
                                            style={{
                                                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                            }}
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                                                background: integration.status === 'Connected' 
                                                    ? 'linear-gradient(90deg, #22c55e, transparent)' 
                                                    : integration.status === 'Connection failed'
                                                    ? 'linear-gradient(90deg, #ef4444, transparent)'
                                                    : 'linear-gradient(90deg, #E8B058, transparent)',
                                            }} />
                                            
                                            <div className="p-5">
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                                                        background: 'rgba(232,176,88,0.1)',
                                                    }}>
                                                        <span className="text-xl font-bold text-[#E8B058]">{integration.name[0]}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold group-hover:text-[#E8B058] transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                                            {integration.name}
                                                        </h3>
                                                        <p className="text-sm truncate" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                            {integration.subcategory}
                                                        </p>
                                                    </div>
                                                    <span className={`text-xs px-2 py-1 rounded flex items-center gap-1 border ${status.color}`}>
                                                        {status.icon}
                                                        {status.label}
                                                    </span>
                                                </div>

                                                <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                    {integration.description}
                                                </p>

                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {integration.features.slice(0, 3).map((feature, i) => (
                                                        <span 
                                                            key={i} 
                                                            className="text-xs px-2 py-0.5 rounded"
                                                            style={{
                                                                background: 'rgba(232,176,88,0.1)',
                                                                color: '#E8B058',
                                                            }}
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                    {integration.features.length > 3 && (
                                                        <span className="text-xs px-2 py-0.5 rounded" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                            +{integration.features.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(232,176,88,0.1)' }}>
                                                    <div className="flex gap-4 text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                        <span className="flex items-center gap-1">
                                                            <HardDrive className="w-3 h-3" />
                                                            {integration.assets} assets
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Activity className="w-3 h-3" />
                                                            {integration.monitors.active} monitors
                                                        </span>
                                                    </div>
                                                    {integration.configLink ? (
                                                        <Link
                                                            to={integration.configLink}
                                                            className="text-xs text-[#E8B058] hover:underline flex items-center gap-1 no-underline"
                                                        >
                                                            <FileText className="w-3 h-3" />
                                                            Docs
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs text-[#E8B058] group-hover:underline flex items-center gap-1">
                                                            Configure <ArrowUpRight className="w-3 h-3" />
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <div className="mt-16 p-8 rounded-2xl border text-center" style={{
                        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                    }}>
                        <Plug className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>Need a Custom Integration?</h2>
                        <p className="mb-6 max-w-lg mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Can't find what you're looking for? Contact our team to discuss custom integration options.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <Link
                                to="/docs/devices"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-colors no-underline"
                            >
                                <FileText className="w-5 h-5" />
                                Browse All Devices
                            </Link>
                            <Link
                                to="/docs/support/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border transition-colors no-underline"
                                style={{
                                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                    color: 'var(--ifm-color-content)',
                                }}
                            >
                                <Activity className="w-5 h-5" />
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
