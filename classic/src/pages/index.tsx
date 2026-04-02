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
    ShieldCheck,
    Cpu,
    Wifi,
    Bell,
    Zap,
    Radio,
    ArrowUpRight,
    Circle,
    Loader,
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
import roadmapData from '../data/sanity-roadmap.generated.json';

// --- Data ---

type Resource = {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    badge?: string;
};

// Type for release data from Sanity
type Release = {
    _id: string;
    displayTitle: string;
    sprintId?: string;
    slug: { current: string };
    publishedAt: string;
    summary?: string;
    items: Array<{ _key: string; title: string }>;
};

type RoadmapItem = {
    _id: string;
    title: string;
    status: 'Planned' | 'In Progress' | 'Shipped';
    projectedRelease: string;
    description: string;
    changeType: string;
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

const getUpcomingRoadmapItems = (): RoadmapItem[] => {
    const items = roadmapData as RoadmapItem[];
    return items.filter(item => item.status !== 'Shipped').slice(0, 3);
};

const upcomingRoadmapItems = getUpcomingRoadmapItems();

const featuredFeatures: Resource[] = [
    {
        title: 'Alarm Management',
        description: 'Real-time alarm processing and automation',
        link: '/alarm-management',
        icon: <Bell className="w-6 h-6" />,
        badge: 'Core',
    },
    {
        title: 'User Management',
        description: 'Role-based access control and permissions',
        link: '/user-management',
        icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
        title: 'Device Monitoring',
        description: 'Monitor device health and connectivity',
        link: '/device-monitoring',
        icon: <Cpu className="w-6 h-6" />,
    },
    {
        title: 'Towers',
        description: 'Manage and configure mobile towers',
        link: '/towers',
        icon: <Radio className="w-6 h-6" />,
    },
];

const helpResources: Resource[] = [
    {
        title: 'Help Center',
        description: 'Submit tickets and find answers',
        link: '#',
        icon: <HelpCircle className="w-5 h-5" />,
    },
    {
        title: 'Video Tutorials',
        description: 'How-to videos for all user levels',
        link: '/docs/knowledge-base/faq',
        icon: <PlayCircle className="w-5 h-5" />,
    },
    {
        title: 'Release Notes',
        description: 'Latest updates and releases',
        link: '#',
        icon: <PlayCircle className="w-5 h-5" />,
    },
    {
        title: 'Product Roadmap',
        description: 'Preview of upcoming features and improvements',
        link: '/roadmap',
        icon: <Zap className="w-5 h-5" />,
    },
];

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

                    {/* ── Quick Access Bar ────────────────────────────── */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold no-underline"
                            style={{
                                background: 'linear-gradient(135deg, #E8B058 0%, #D4A047 100%)',
                                color: '#000',
                                boxShadow: '0 4px 16px rgba(232,176,88,0.35)',
                            }}
                        >
                            <ArrowUpRight className="w-4 h-4" />
                            Documentation Index
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
                            to="/releases"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium no-underline border"
                            style={{
                                borderColor: 'rgba(232,176,88,0.35)',
                                color: '#E8B058',
                                background: 'rgba(232,176,88,0.07)',
                            }}
                        >
                            Release Notes
                        </Link>
                        <Link
                            to="/roadmap"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-medium no-underline border"
                            style={{
                                borderColor: 'rgba(232,176,88,0.35)',
                                color: '#E8B058',
                                background: 'rgba(232,176,88,0.07)',
                            }}
                        >
                            Roadmap
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

                    {/* ── Quick Start ─────────────────────────────────── */}
                    <section className="mt-20">
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

                    {/* ── Releases ────────────────────────────────────── */}
                    <section className="mt-24">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Changelog</span>
                                <h2 className="text-3xl font-bold text-[#E8B058] mt-2">Releases</h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Latest updates and new features
                                </p>
                            </div>
                            <Link
                                to="/releases"
                                className="inline-flex items-center gap-1.5 text-[#E8B058] hover:text-[#D4A047] transition-colors text-sm font-medium no-underline group"
                            >
                                View All
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {(releasesData as Release[]).slice(0, 2).map((release, index) => (
                                <Link
                                    key={release._id}
                                    to={`/releases/${release.slug.current}`}
                                    className={`${styles.releaseCardNew} no-underline group`}
                                >
                                    <div className={styles.releaseCardTopBar} />
                                    <div className={styles.releaseCardBody}>
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <span className={styles.releaseMetaDate}>
                                                {new Date(release.publishedAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                                {release.sprintId && (
                                                    <span className={styles.sprintId}> · {release.sprintId}</span>
                                                )}
                                            </span>
                                            {index === 0 && (
                                                <span className={styles.latestBadge}>Latest</span>
                                            )}
                                        </div>
                                        <h4 className={`${styles.releaseTitleNew} group-hover:text-[#E8B058] transition-colors`}>
                                            {release.displayTitle}
                                        </h4>
                                        <p className={styles.releaseDescNew}>
                                            {release.summary || `${release.items.length} updates in this release`}
                                        </p>
                                        <span className={styles.releaseReadMore}>
                                            Read release notes
                                            <ArrowUpRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Coming Soon / Roadmap preview */}
                        <div className="mt-12">
                            <div className="flex items-end justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1" style={{ color: 'var(--ifm-color-content)' }}>
                                        Coming Soon
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Preview of upcoming features and improvements
                                    </p>
                                </div>
                                <Link
                                    to="/roadmap"
                                    className="inline-flex items-center gap-1.5 text-[#E8B058] hover:text-[#D4A047] transition-colors text-sm font-medium no-underline group"
                                >
                                    View Roadmap
                                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {upcomingRoadmapItems.map((item) => (
                                    <div key={item._id} className={styles.roadmapCardNew}>
                                        <div className={`${styles.roadmapCardStripe} ${item.status === 'In Progress' ? styles.roadmapStripeActive : ''}`} />
                                        <div className={styles.roadmapCardContent}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`${styles.roadmapStatusBadge} ${item.status === 'In Progress' ? styles.roadmapStatusActive : ''}`}>
                                                    <Circle className="w-1.5 h-1.5 fill-current" />
                                                    {item.status}
                                                </span>
                                                <span className={styles.roadmapQuarterLabel}>{item.projectedRelease}</span>
                                            </div>
                                            <h4 className={styles.roadmapItemTitleNew}>{item.title}</h4>
                                            <p className={styles.roadmapItemDescNew}>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── Platform Features ───────────────────────────── */}
                    <section className="mt-24">
                        <div className="text-center mb-10">
                            <span className={styles.sectionBadge}>Capabilities</span>
                            <h2 className="text-3xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                Platform Features
                            </h2>
                            <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                Explore core capabilities of GCXONE
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {featuredFeatures.map((item) => (
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

                    {/* ── Help & Resources ────────────────────────────── */}
                    <section className="mt-24">
                        <div className="text-center mb-10">
                            <span className={styles.sectionBadge}>Support</span>
                            <h2 className="text-3xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                Need Help?
                            </h2>
                            <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                Additional resources and support channels
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                            {helpResources.map((item) => (
                                <QuickLink
                                    key={item.title}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    href={item.link}
                                />
                            ))}
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
                                        Begin your journey with GCXONE today
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
                <Layout title="Documentation" description="GCXONE Technical Documentation">
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
