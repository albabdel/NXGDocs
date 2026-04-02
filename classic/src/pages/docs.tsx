import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import LandingPageBackground from '../components/LandingPageBackground/LandingPageBackground';
import { useProduct } from '@theme/Root';
import {
    Search,
    BookOpen,
    FileText,
    Layers,
    Cpu,
    Radio,
    Bell,
    Users,
    Settings,
    BarChart3,
    HelpCircle,
    Rocket,
    Shield,
    Wrench,
    Activity,
    ArrowRight,
    ArrowUpRight,
    Clock,
    Sparkles,
    Home,
    Zap,
    ChevronRight,
    ExternalLink,
    Video,
    FileCode,
    Database,
    Server,
    Compass,
} from 'lucide-react';
import landingPagesData from '../data/sanity-landing-pages.generated.json';
import releasesData from '../data/sanity-releases.generated.json';

type LandingPage = {
    title: string;
    slug: { current: string };
    description?: string;
    status: string;
    lastUpdated?: string;
    hero?: {
        badge?: { icon?: string; text?: string };
        headline: string;
        subheadline?: string;
    };
};

type Release = {
    _id: string;
    displayTitle: string;
    sprintId?: string;
    slug: { current: string };
    publishedAt: string;
    summary?: string;
    items: Array<{ _key: string; title: string }>;
};

const iconMap: Record<string, React.ReactNode> = {
    'Rocket': <Rocket className="w-5 h-5" />,
    'Plug': <Cpu className="w-5 h-5" />,
    'RadioTower': <Radio className="w-5 h-5" />,
    'BellRing': <Bell className="w-5 h-5" />,
    'Cpu': <Cpu className="w-5 h-5" />,
    'Shield': <Shield className="w-5 h-5" />,
    'Users': <Users className="w-5 h-5" />,
    'Settings': <Settings className="w-5 h-5" />,
    'BarChart3': <BarChart3 className="w-5 h-5" />,
    'HelpCircle': <HelpCircle className="w-5 h-5" />,
    'Activity': <Activity className="w-5 h-5" />,
    'Wrench': <Wrench className="w-5 h-5" />,
    'BookOpen': <BookOpen className="w-5 h-5" />,
    'FileText': <FileText className="w-5 h-5" />,
    'Layers': <Layers className="w-5 h-5" />,
    'Video': <Video className="w-5 h-5" />,
    'FileCode': <FileCode className="w-5 h-5" />,
    'Database': <Database className="w-5 h-5" />,
    'Server': <Server className="w-5 h-5" />,
    'Compass': <Compass className="w-5 h-5" />,
};

const docsCategories = [
    {
        id: 'getting-started',
        label: 'Getting Started',
        description: 'First steps to set up and configure the platform',
        icon: <Rocket className="w-5 h-5" />,
        href: '/docs/getting-started/what-is-gcxone',
        color: '#3B82F6',
        count: 6,
    },
    {
        id: 'platform-fundamentals',
        label: 'Platform Fundamentals',
        description: 'Core architecture and workflows',
        icon: <Layers className="w-5 h-5" />,
        href: '/docs/platform-fundamentals/cloud-architecture',
        color: '#8B5CF6',
        count: 13,
    },
    {
        id: 'devices',
        label: 'Devices',
        description: 'Integration guides for all supported devices',
        icon: <Cpu className="w-5 h-5" />,
        href: '/docs/devices/add-a-device-to-gcxone',
        color: '#10B981',
        count: 18,
    },
    {
        id: 'features',
        label: 'Features',
        description: 'AI, monitoring, video, and operational modes',
        icon: <Zap className="w-5 h-5" />,
        href: '/docs/features/ai-automation/overview',
        color: '#F59E0B',
        count: 16,
    },
    {
        id: 'installer-guide',
        label: 'Installer Guide',
        description: 'Installation and network configuration',
        icon: <Wrench className="w-5 h-5" />,
        href: '/docs/installer-guide/installation-overview',
        color: '#06B6D4',
        count: 12,
    },
    {
        id: 'operator-guide',
        label: 'Operator Guide',
        description: 'Alarm handling and daily operations',
        icon: <Activity className="w-5 h-5" />,
        href: '/docs/operator-guide/handling-alarms',
        color: '#EC4899',
        count: 4,
    },
    {
        id: 'alarm-management',
        label: 'Alarm Management',
        description: 'Configure and manage alerts',
        icon: <Bell className="w-5 h-5" />,
        href: '/docs/alarm-management/redundant-alarms',
        color: '#EF4444',
        count: 3,
    },
    {
        id: 'reporting',
        label: 'Reporting',
        description: 'Generate and schedule reports',
        icon: <BarChart3 className="w-5 h-5" />,
        href: '/docs/reporting/reporting-overview',
        color: '#84CC16',
        count: 5,
    },
    {
        id: 'api-reference',
        label: 'API Reference',
        description: 'REST, GraphQL, SDKs, and webhooks',
        icon: <FileCode className="w-5 h-5" />,
        href: '/docs/api-overview',
        color: '#F97316',
        count: 5,
    },
    {
        id: 'knowledge-base',
        label: 'Knowledge Base',
        description: 'FAQ, glossary, and troubleshooting',
        icon: <HelpCircle className="w-5 h-5" />,
        href: '/docs/knowledge-base/faq',
        color: '#14B8A6',
        count: 10,
    },
];

const quickLinks = [
    {
        title: 'Platform Overview',
        description: 'Overview and capabilities',
        icon: <BookOpen className="w-4 h-4" />,
        href: '/docs/getting-started/what-is-gcxone',
    },
    {
        title: 'Quick Start Checklist',
        description: 'Get up and running fast',
        icon: <Rocket className="w-4 h-4" />,
        href: '/docs/getting-started/quick-start-checklist',
    },
    {
        title: 'Add a Device',
        description: 'Connect your first device',
        icon: <Cpu className="w-4 h-4" />,
        href: '/docs/devices/add-a-device-to-gcxone',
    },
    {
        title: 'API Overview',
        description: 'Integration documentation',
        icon: <FileCode className="w-4 h-4" />,
        href: '/docs/api-overview',
    },
];

const resourceLinks = [
    {
        title: 'Release Notes',
        description: 'Latest updates and features',
        icon: <Sparkles className="w-5 h-5" />,
        href: '/releases',
        color: '#E8B058',
    },
    {
        title: 'Video Tutorials',
        description: 'Watch and learn',
        icon: <Video className="w-5 h-5" />,
        href: '/video-tutorials',
        color: '#EF4444',
    },
    {
        title: 'Product Roadmap',
        description: 'What\'s coming next',
        icon: <Compass className="w-5 h-5" />,
        href: '/roadmap',
        color: '#8B5CF6',
    },
    {
        title: 'Contact Support',
        description: 'Get help from our team',
        icon: <HelpCircle className="w-5 h-5" />,
        href: '/docs/support/contact',
        color: '#3B82F6',
    },
];

function getIconForLandingPage(iconName?: string): React.ReactNode {
    if (!iconName) return <FileText className="w-5 h-5" />;
    return iconMap[iconName] || <FileText className="w-5 h-5" />;
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function isNewDoc(dateString?: string): boolean {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
}

function useIsDark() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

export default function DocsIndex(): React.JSX.Element {
    const isDark = useIsDark();
    const { productName } = useProduct();

    const publishedLandingPages = (landingPagesData as LandingPage[]).filter(
        (page) => page.status === 'published'
    );

    const recentReleases = (releasesData as Release[]).slice(0, 3);

    const handleSearchOpen = () => {
        const event = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            ctrlKey: true,
            bubbles: true,
            cancelable: true,
        });
        document.dispatchEvent(event);
    };

    const totalDocs = docsCategories.reduce((acc, cat) => acc + cat.count, 0);

    return (
        <Layout
            title="Documentation"
            description={`Comprehensive ${productName} documentation - guides, API references, and best practices`}
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Documentation' },
                    ]}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
                            background: isDark ? 'rgba(232, 176, 88, 0.1)' : 'rgba(232, 176, 88, 0.08)',
                            border: `1px solid ${isDark ? 'rgba(232, 176, 88, 0.2)' : 'rgba(232, 176, 88, 0.15)'}`,
                        }}>
                            <BookOpen className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Documentation</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                            {productName} Documentation
                        </h1>
                        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Everything you need to configure, operate, and integrate with {productName}
                        </p>

                        {/* Search Bar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="max-w-2xl mx-auto mb-8"
                        >
                            <button
                                onClick={handleSearchOpen}
                                className="w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left"
                                style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.7)',
                                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(232, 176, 88, 0.15)',
                                    boxShadow: isDark ? 'inset 0 1px 0 rgba(232,176,88,0.08)' : 'inset 0 1px 0 rgba(232,176,88,0.1), 0 2px 8px rgba(0,0,0,0.04)',
                                }}
                            >
                                <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--ifm-color-primary)' }} />
                                <span style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Search documentation...
                                </span>
                                <div className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-md" style={{
                                    background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                                    color: 'var(--ifm-color-content-secondary)',
                                }}>
                                    <span>Ctrl</span>
                                    <span>K</span>
                                </div>
                            </button>
                        </motion.div>

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-6 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                <span>{totalDocs}+ articles</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                <span>{docsCategories.length} categories</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>Updated weekly</span>
                            </div>
                        </div>

                        {/* Quick Access to Home */}
                        <div className="mt-8">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold no-underline"
                                style={{
                                    background: 'linear-gradient(135deg, #E8B058 0%, #D4A047 100%)',
                                    color: '#000',
                                    boxShadow: '0 4px 14px rgba(232, 176, 88, 0.4)',
                                }}
                            >
                                <Home className="w-5 h-5" />
                                <span>Return to Home</span>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#E8B058]">Popular</span>
                                <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--ifm-color-content)' }}>
                                    Quick Links
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                            {quickLinks.map((link, idx) => (
                                <motion.div
                                    key={link.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={link.href}
                                        className="flex items-center gap-3 p-4 rounded-xl border no-underline group transition-all duration-200"
                                        style={{
                                            background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.65)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 176, 88, 0.12)',
                                        }}
                                    >
                                        <div className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0" style={{
                                            background: 'rgba(232, 176, 88, 0.1)',
                                            color: 'var(--ifm-color-primary)',
                                        }}>
                                            {link.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                                                {link.title}
                                            </h4>
                                            <p className="text-xs truncate" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                {link.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" style={{ color: 'var(--ifm-color-primary)' }} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Categories Grid */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#E8B058]">Browse</span>
                                <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--ifm-color-content)' }}>
                                    Documentation Categories
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {docsCategories.map((category, idx) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={category.href}
                                        className="block p-5 rounded-xl border no-underline group transition-all duration-200 h-full"
                                        style={{
                                            background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.65)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 176, 88, 0.12)',
                                        }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{
                                                background: `${category.color}15`,
                                                color: category.color,
                                            }}>
                                                {category.icon}
                                            </div>
                                            <span className="text-xs font-mono px-2 py-0.5 rounded-md" style={{
                                                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                                                color: 'var(--ifm-color-content-secondary)',
                                            }}>
                                                {category.count}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-sm mb-1 group-hover:text-[#E8B058] transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                            {category.label}
                                        </h3>
                                        <p className="text-xs leading-relaxed" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                            {category.description}
                                        </p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Landing Pages Grid */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#E8B058]">Featured</span>
                                <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--ifm-color-content)' }}>
                                    Platform Guides
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {publishedLandingPages.map((page, idx) => (
                                <motion.div
                                    key={page.slug.current}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={`/${page.slug.current}`}
                                        className="block p-5 rounded-xl border no-underline group transition-all duration-200 h-full relative overflow-hidden"
                                        style={{
                                            background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.65)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 176, 88, 0.12)',
                                        }}
                                    >
                                        {isNewDoc(page.lastUpdated) && (
                                            <div className="absolute top-3 right-3">
                                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                    New
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{
                                                background: 'rgba(232, 176, 88, 0.1)',
                                                color: 'var(--ifm-color-primary)',
                                            }}>
                                                {page.hero?.badge?.icon ? getIconForLandingPage(page.hero.badge.icon) : <FileText className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm group-hover:text-[#E8B058] transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                                    {page.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                            {page.hero?.subheadline || page.description}
                                        </p>
                                        {page.lastUpdated && (
                                            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.7 }}>
                                                <Clock className="w-3 h-3" />
                                                <span>Updated {formatDate(page.lastUpdated)}</span>
                                            </div>
                                        )}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Resources Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="flex items-end justify-between mb-6">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#E8B058]">Explore</span>
                                <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--ifm-color-content)' }}>
                                    Resources
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {resourceLinks.map((resource, idx) => (
                                <motion.div
                                    key={resource.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={resource.href}
                                        className="flex items-center gap-4 p-5 rounded-xl border no-underline group transition-all duration-200"
                                        style={{
                                            background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.65)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 176, 88, 0.12)',
                                        }}
                                    >
                                        <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0" style={{
                                            background: `${resource.color}15`,
                                            color: resource.color,
                                        }}>
                                            {resource.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm group-hover:text-[#E8B058] transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                                {resource.title}
                                            </h4>
                                            <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                {resource.description}
                                            </p>
                                        </div>
                                        <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ color: 'var(--ifm-color-primary)' }} />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Recent Releases */}
                    {recentReleases.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#E8B058]">Updates</span>
                                    <h2 className="text-xl font-bold mt-1" style={{ color: 'var(--ifm-color-content)' }}>
                                        Recent Releases
                                    </h2>
                                </div>
                                <Link
                                    to="/releases"
                                    className="flex items-center gap-1.5 text-sm font-medium text-[#E8B058] hover:text-[#D4A047] transition-colors no-underline group"
                                >
                                    View all releases
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {recentReleases.map((release, idx) => (
                                    <motion.div
                                        key={release._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        viewport={{ once: true }}
                                    >
                                        <Link
                                            to={`/releases/${release.slug.current}`}
                                            className="block p-5 rounded-xl border no-underline group transition-all duration-200 relative overflow-hidden"
                                            style={{
                                                background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.65)',
                                                borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 176, 88, 0.12)',
                                            }}
                                        >
                                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                                                background: 'linear-gradient(90deg, #E8B058 0%, #C89446 40%, transparent 100%)',
                                            }} />
                                            {idx === 0 && (
                                                <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E8B058]/10 text-[#E8B058] border border-[#E8B058]/20">
                                                    Latest
                                                </span>
                                            )}
                                            <h4 className="font-semibold text-sm mb-2 group-hover:text-[#E8B058] transition-colors pr-16" style={{ color: 'var(--ifm-color-content)' }}>
                                                {release.displayTitle}
                                            </h4>
                                            <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                {release.summary || `${release.items.length} updates in this release`}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.7 }}>
                                                <Clock className="w-3 h-3" />
                                                <span>{formatDate(release.publishedAt)}</span>
                                                {release.sprintId && (
                                                    <>
                                                        <ChevronRight className="w-3 h-3" />
                                                        <span>{release.sprintId}</span>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* CTA Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative overflow-hidden rounded-2xl border p-8" style={{
                            background: isDark ? 'rgba(255, 255, 255, 0.025)' : 'rgba(255, 255, 255, 0.65)',
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(232, 176, 88, 0.12)',
                        }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/5 via-transparent to-[#E8B058]/5 pointer-events-none" />
                            <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{
                                background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
                            }} />
                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="text-center md:text-left">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                        Can't find what you're looking for?
                                    </h2>
                                    <p className="text-sm md:text-base" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Contact our support team or browse the knowledge base
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link
                                        to="/docs/support/contact"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-lg transition-all duration-200 no-underline"
                                    >
                                        Contact Support
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        to="/docs/knowledge-base/faq"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium border transition-colors no-underline"
                                        style={{
                                            background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
                                            borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(232, 176, 88, 0.2)',
                                            color: 'var(--ifm-color-content)',
                                        }}
                                    >
                                        Knowledge Base
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.section>
                </div>

            </main>
        </Layout>
    );
}
