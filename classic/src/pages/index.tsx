import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useAuth0 } from '@auth0/auth0-react';
import {
    LayoutDashboard,
    Server,
    Shield,
    Activity,
    Wrench,
    HelpCircle,
    PlayCircle,
    Cpu,
    Wifi,
    Bell,
    Zap,
    Radio,
    ArrowUpRight,
    Loader,
    BookOpen,
    FileText,
    Network,
    Users,
    Settings,
    ChevronRight,
} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';
import QuickLink from '../components/QuickLink';
import NXGENSphereHero from '../components/NXGENSphereHero';
import { ContinueReading } from '../components/History/ContinueReading';
import { RoleBasedContent, RecommendedReading } from '../components/Personalization';
import { useUserProfile } from '../hooks/useUserProfile';
import { useProduct } from '@theme/Root';
import styles from './index.module.css';
import releasesData from '../data/sanity-releases.generated.json';
import newlyAddedData from '../data/sanity-newly-added.generated.json';
// --- Types ---

type NewlyAddedDoc = {
    _id: string;
    title: string;
    slug: string;
    categoryTitle: string | null;
    categorySlug: string | null;
    description: string | null;
    tags: string[];
    createdAt: string | null;
    lastUpdated: string | null;
};

type Release = {
    _id: string;
    displayTitle: string;
    sprintId?: string;
    slug: { current: string };
    publishedAt: string;
};

type Resource = {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    badge?: string;
};

// Get product name for dynamic descriptions
const getQuickStartLinks = (productName: string): Resource[] => [
    {
        title: 'Breakthroughs',
        description: `Ten core services that define how ${productName} works at scale`,
        link: '/docs/breakthroughs',
        icon: <Zap className="w-5 h-5" />,
    },
    {
        title: 'Platform Overview',
        description: 'Learn about core concepts and architecture',
        link: '/quick-start/platform-overview',
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        title: 'Quick Start Guide',
        description: 'Get up and running in 5 minutes',
        link: '/quick-start/guide',
        icon: <Zap className="w-5 h-5" />,
    },
    {
        title: 'Device Integration',
        description: 'Connect your first device',
        link: '/quick-start/device-integration',
        icon: <Wifi className="w-5 h-5" />,
    },
    {
        title: 'Towers',
        description: 'Add and configure mobile towers',
        link: '/towers',
        icon: <Radio className="w-5 h-5" />,
    },
    {
        title: 'Server Setup',
        description: `Configure and deploy your ${productName} server`,
        link: '/quick-start/platform-overview',
        icon: <Server className="w-5 h-5" />,
    },
];

const roleCards: Resource[] = [
    {
        title: 'Admin',
        description: 'Configure settings and manage users with full permissions',
        link: '/roles/admin',
        icon: <Shield className="w-6 h-6" />,
        badge: 'Full Access',
    },
    {
        title: 'Operator',
        description: 'Process alarms and monitor system activity',
        link: '/roles/operator',
        icon: <Activity className="w-6 h-6" />,
    },
    {
        title: 'Installer',
        description: 'Manage device provisioning and site setup',
        link: '/roles/installer',
        icon: <Wrench className="w-6 h-6" />,
    },
    {
        title: 'Manager',
        description: 'Oversee operations and view reports',
        link: '/roles/manager',
        icon: <LayoutDashboard className="w-6 h-6" />,
        badge: 'Overview',
    },
];

// --- Newly Added Component ---

function NewlyAddedSection({ docs }: { docs: NewlyAddedDoc[] }) {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
    };

    const formatDate = (iso: string | null) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <section className="mt-16">
            <div className="flex items-end justify-between mb-6">
                <div>
                    <span className={styles.sectionBadge}>New</span>
                    <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                        Newly Added
                    </h2>
                    <p className="mt-0.5 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        Latest articles added to the documentation
                    </p>
                </div>
                {/* Scroll controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                        style={{ background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', color: 'var(--ifm-color-content-secondary)', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,176,88,0.4)'; e.currentTarget.style.color = '#E8B058'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)'; e.currentTarget.style.color = 'var(--ifm-color-content-secondary)'; }}
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                        style={{ background: 'var(--ifm-background-surface-color)', border: '1px solid var(--ifm-color-emphasis-200)', color: 'var(--ifm-color-content-secondary)', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(232,176,88,0.4)'; e.currentTarget.style.color = '#E8B058'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)'; e.currentTarget.style.color = 'var(--ifm-color-content-secondary)'; }}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Scrollable track */}
            <div
                ref={scrollRef}
                style={{
                    display: 'flex',
                    gap: '12px',
                    overflowX: 'auto',
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingBottom: '4px',
                }}
            >
                {docs.map((doc) => (
                    <Link
                        key={doc._id}
                        to={`/docs/${doc.slug}`}
                        className="no-underline group flex-shrink-0"
                        style={{
                            width: '260px',
                            scrollSnapAlign: 'start',
                            display: 'flex',
                            flexDirection: 'column',
                            background: 'var(--ifm-background-surface-color)',
                            border: '1px solid var(--ifm-color-emphasis-200)',
                            borderRadius: '12px',
                            padding: '16px',
                            transition: 'border-color 0.15s ease, transform 0.15s ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(232,176,88,0.4)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        {/* Category + date row */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                            {doc.categoryTitle ? (
                                <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full truncate"
                                    style={{
                                        background: 'rgba(232,176,88,0.1)',
                                        color: '#E8B058',
                                        border: '1px solid rgba(232,176,88,0.2)',
                                        maxWidth: '140px',
                                    }}
                                >
                                    {doc.categoryTitle}
                                </span>
                            ) : (
                                <span
                                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: 'rgba(232,176,88,0.08)', color: '#E8B058', border: '1px solid rgba(232,176,88,0.15)' }}
                                >
                                    Doc
                                </span>
                            )}
                            {doc.createdAt && (
                                <span className="text-xs flex-shrink-0" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.6 }}>
                                    {formatDate(doc.createdAt)}
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h3
                            className="text-sm font-semibold leading-snug mb-2 group-hover:text-[#E8B058] transition-colors"
                            style={{ color: 'var(--ifm-color-content)', margin: 0 }}
                        >
                            {doc.title}
                        </h3>

                        {/* Description */}
                        {doc.description && (
                            <p
                                className="text-xs leading-relaxed flex-1"
                                style={{
                                    color: 'var(--ifm-color-content-secondary)',
                                    margin: '0 0 12px 0',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                } as React.CSSProperties}
                            >
                                {doc.description}
                            </p>
                        )}

                        {/* Footer */}
                        <div className="flex items-center gap-1 mt-auto pt-2" style={{ borderTop: '1px solid var(--ifm-color-emphasis-100)' }}>
                            <span className="text-xs font-medium" style={{ color: '#E8B058' }}>Read article</span>
                            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#E8B058' }} />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// --- Main Page Content ---

function HomePageContent(): React.JSX.Element {
    const { isAuthenticated, user } = useAuth0();
    const { profile } = useUserProfile();
    const { productName } = useProduct();
    
    // Get product-specific quick start links
    const quickStartLinks = getQuickStartLinks(productName);

    const handleSearchOpen = () => {
        const event = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    };

    // Get user's first name for welcome message
    const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
    const userRole = profile?.role || 'user';

    return (
        <Layout
            title="Documentation"
            description={`${productName} Technical Documentation - Comprehensive guides for alarm management and IoT device integration`}>

            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>

                {/* Hero */}
                <NXGENSphereHero onOpenSearch={handleSearchOpen} />

                <div className="max-w-7xl mx-auto px-6 pb-24">

                    {/* ── Welcome Back (for logged-in users) ───────────────── */}
                    {isAuthenticated && (
                        <div 
                            className="mt-8 mb-4 p-4 rounded-xl"
                            style={{
                                background: 'linear-gradient(135deg, rgba(232,176,88,0.08) 0%, rgba(232,176,88,0.02) 100%)',
                                border: '1px solid rgba(232,176,88,0.2)',
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'rgba(232,176,88,0.15)',
                                        border: '2px solid rgba(232,176,88,0.3)',
                                    }}
                                >
                                    <span className="text-lg font-bold" style={{ color: '#E8B058' }}>
                                        {firstName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                                        Welcome back, {firstName}
                                    </p>
                                    <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Your role: <span style={{ color: '#E8B058' }}>{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Continue Reading (for logged-in users) ───────────── */}
                    <ContinueReading maxItems={5} showWelcome={false} />

                    {/* ── Quick Navigation Bar ────────────────────────── */}
                    <nav className="mt-10" aria-label="Quick navigation">
                        {/* Primary CTA row */}
                        <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                            <Link
                                to="/docs"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
                                style={{
                                    background: 'linear-gradient(135deg, #E8B058 0%, #D4A047 100%)',
                                    color: '#000',
                                    boxShadow: '0 4px 16px rgba(232,176,88,0.35)',
                                }}
                            >
                                <BookOpen className="w-4 h-4" />
                                Browse All Docs
                            </Link>
                            <Link
                                to="/updates"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium no-underline border"
                                style={{
                                    borderColor: 'rgba(232,176,88,0.35)',
                                    color: '#E8B058',
                                    background: 'rgba(232,176,88,0.07)',
                                }}
                            >
                                Updates Hub
                            </Link>
                            <Link
                                to="/support"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium no-underline border"
                                style={{
                                    borderColor: 'rgba(232,176,88,0.35)',
                                    color: '#E8B058',
                                    background: 'rgba(232,176,88,0.07)',
                                }}
                            >
                                Support
                            </Link>
                        </div>
                        {/* Helper hint + popular topics */}
                        <div className="mt-3 flex flex-col items-center gap-2">
                            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs" style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.65 }}>
                                <span>
                                    <kbd style={{ padding: '1px 5px', borderRadius: 4, fontSize: '0.7rem', border: '1px solid rgba(232,176,88,0.3)', background: 'rgba(232,176,88,0.06)', color: '#E8B058' }}>Ctrl K</kbd>
                                    {' '}to search — try:
                                </span>
                                {['alarm zones', 'device setup', 'user roles', 'API integration', 'tower config'].map((term) => (
                                    <button
                                        key={term}
                                        style={{ color: '#E8B058', opacity: 0.8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit', padding: '0 2px', textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: '2px' }}
                                        onClick={() => {
                                            const event = new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', ctrlKey: true, bubbles: true, cancelable: true });
                                            document.dispatchEvent(event);
                                            setTimeout(() => {
                                                const input = document.querySelector('input[type="search"]') as HTMLInputElement;
                                                if (input) { input.value = term; input.dispatchEvent(new Event('input', { bubbles: true })); }
                                            }, 80);
                                        }}
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                            {/* Latest release strip */}
                            {(releasesData as Release[]).length > 0 && (() => {
                                const latest = (releasesData as Release[])[0];
                                return (
                                    <Link
                                        to={`/releases/${latest.slug.current}`}
                                        className="inline-flex items-center gap-2 no-underline group"
                                        style={{ color: 'var(--ifm-color-content-secondary)', opacity: 0.7, fontSize: '0.72rem' }}
                                    >
                                        <span
                                            className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                                            style={{ background: '#22c55e' }}
                                        />
                                        Latest release: <span style={{ color: '#E8B058' }} className="group-hover:underline">{latest.displayTitle}</span>
                                        {latest.sprintId && <span style={{ opacity: 0.55 }}>· {latest.sprintId}</span>}
                                        <span style={{ opacity: 0.45 }}>→</span>
                                    </Link>
                                );
                            })()}
                        </div>
                    </nav>

                    {/* ── Quick Start ─────────────────────────────────── */}
                    <section className="mt-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Start Here</span>
                                <h2 className="text-3xl font-bold text-[#E8B058] mt-2">Quick Start</h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Everything you need to get up and running
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {quickStartLinks.map((item, index) => (
                                <div key={item.title} className={styles.numberedLink}>
                                    <span className={styles.numberBadge}>
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <QuickLink
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        href={item.link}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Newly Added ─────────────────────────────────── */}
                    {(newlyAddedData as NewlyAddedDoc[]).length > 0 && (
                        <NewlyAddedSection docs={newlyAddedData as NewlyAddedDoc[]} />
                    )}

                    {/* ── Role-Based Recommendations ─────────────────────── */}
                    <RoleBasedContent allowedRoles={['operator']}>
                        <RecommendedReading role="operator" maxItems={4} />
                    </RoleBasedContent>
                    <RoleBasedContent allowedRoles={['manager']}>
                        <RecommendedReading role="manager" maxItems={4} />
                    </RoleBasedContent>
                    <RoleBasedContent allowedRoles={['engineer']}>
                        <RecommendedReading role="engineer" maxItems={4} />
                    </RoleBasedContent>
                    <RoleBasedContent allowedRoles={['admin']}>
                        <RecommendedReading role="admin" maxItems={4} />
                    </RoleBasedContent>

                    {/* ── Roles ───────────────────────────────────────── */}
                    <section className="mt-24">
                        <div className="text-center mb-10">
                            <span className={styles.sectionBadge}>Documentation</span>
                            <h2 className="text-3xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                Learn by Role
                            </h2>
                            <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                Find documentation tailored to your user role
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {roleCards.map((item) => (
                                <FeatureCard
                                    key={item.title}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    link={item.link}
                                    badge={item.badge}
                                />
                            ))}
                        </div>
                    </section>

                    {/* ── Browse Documentation ────────────────────────── */}
                    <section className="mt-24">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Documentation</span>
                                <h2 className="text-3xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Browse by Topic
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Jump directly to any documentation area
                                </p>
                            </div>
                            <Link
                                to="/docs"
                                className="inline-flex items-center gap-1.5 text-[#E8B058] hover:text-[#D4A047] transition-colors text-sm font-medium no-underline group"
                            >
                                All Docs
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {[
                                { title: 'Getting Started', description: 'Platform overview, quick start, and initial setup', link: '/docs/getting-started', icon: <Zap className="w-5 h-5" /> },
                                { title: 'Alarm Management', description: 'Alarm processing, routing, and automation rules', link: '/docs/alarm-management', icon: <Bell className="w-5 h-5" /> },
                                { title: 'Device Management', description: 'Connect, configure, and monitor IoT devices', link: '/docs/device-management', icon: <Cpu className="w-5 h-5" /> },
                                { title: 'User & Access Control', description: 'Roles, permissions, and user administration', link: '/docs/user-management', icon: <Users className="w-5 h-5" /> },
                                { title: 'Towers & Networks', description: 'Mobile tower setup and network configuration', link: '/docs/towers', icon: <Radio className="w-5 h-5" /> },
                                { title: 'System Configuration', description: 'Server settings, integrations, and system setup', link: '/docs/configuration', icon: <Settings className="w-5 h-5" /> },
                                { title: 'Integration Hub', description: 'Third-party integrations and API connections', link: '/integration-hub', icon: <Network className="w-5 h-5" /> },
                                { title: 'Reference', description: 'Technical specifications and API documentation', link: '/docs/reference', icon: <FileText className="w-5 h-5" /> },
                                { title: 'Knowledge Base', description: 'FAQs, troubleshooting guides, and how-tos', link: '/docs/knowledge-base', icon: <BookOpen className="w-5 h-5" /> },
                            ].map((item) => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="group flex items-center gap-4 p-4 rounded-xl no-underline transition-all duration-200"
                                    style={{
                                        background: 'var(--ifm-background-surface-color)',
                                        border: '1px solid var(--ifm-color-emphasis-200)',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(232,176,88,0.35)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)')}
                                >
                                    <div
                                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                        style={{ background: 'rgba(232,176,88,0.1)', color: '#E8B058' }}
                                    >
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                                                {item.title}
                                            </span>
                                            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0" style={{ color: '#E8B058' }} />
                                        </div>
                                        <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--ifm-color-content-secondary)', margin: 0 }}>
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ── Help & Resources ────────────────────────────── */}
                    <section className="mt-20">
                        <div className="text-center mb-8">
                            <span className={styles.sectionBadge}>Support</span>
                            <h2 className="text-3xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                Need Help?
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl mx-auto">
                            <QuickLink
                                title="Help Center"
                                description="Submit a ticket or find answers to common questions"
                                icon={<HelpCircle className="w-5 h-5" />}
                                href="/support"
                            />
                            <QuickLink
                                title="Video Tutorials"
                                description="Step-by-step how-to videos for all user levels"
                                icon={<PlayCircle className="w-5 h-5" />}
                                href="/docs/knowledge-base/faq"
                            />
                        </div>
                    </section>

                    {/* ── CTA ─────────────────────────────────────────── */}
                    <div className="mt-28 mb-8">
                        <div
                            className={`relative overflow-hidden rounded-2xl border p-14 ${styles.ctaCard}`}
                            style={{
                                background: 'var(--ifm-background-surface-color)',
                                borderColor: 'var(--ifm-color-emphasis-200)',
                            }}
                        >
                            {/* Gradient accent overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/6 via-transparent to-[#E8B058]/6 pointer-events-none" />
                            {/* Top shimmer border */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
                                }}
                            />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <h2
                                        className="text-2xl md:text-3xl font-bold mb-2"
                                        style={{ color: 'var(--ifm-color-content)' }}
                                    >
                                        Ready to get started?
                                    </h2>
                                    <p
                                        className="text-base md:text-lg"
                                        style={{ color: 'var(--ifm-color-content-secondary)' }}
                                    >
                                        Begin your journey with {productName} today
                                    </p>
                                </div>

                                <Link
                                    to="/docs"
                                    className="hero-btn-primary group inline-flex items-center gap-2 px-8 py-3.5 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all duration-200 hover:shadow-lg no-underline flex-shrink-0"
                                    style={{ boxShadow: '0 4px 20px rgba(232,176,88,0.25)' }}
                                >
                                    Start Learning
                                    <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </Layout>
    );
}

// --- Main Page Export with BrowserOnly ---

export default function Home(): React.JSX.Element {
    return (
        <BrowserOnly
            fallback={
                <Layout title="Documentation" description="Technical Documentation">
                    <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                        <Loader className="w-8 h-8 animate-spin" style={{ color: '#E8B058' }} />
                    </main>
                </Layout>
            }
        >
            {() => <HomePageContent />}
        </BrowserOnly>
    );
}
