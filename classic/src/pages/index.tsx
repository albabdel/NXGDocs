import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {
    LayoutDashboard,
    Server,
    Shield,
    Activity,
    Wrench,
    HelpCircle,
    PlayCircle,
    FileText,
    ShieldCheck,
    Cpu,
    Camera,
    Wifi,
    Bell,
    Zap,
    Radio
} from 'lucide-react';
// Using Algolia DocSearch for search functionality
import FeatureCard from '../components/FeatureCard';
import QuickLink from '../components/QuickLink';
import { BreakthroughGrid } from '../components/breakthroughs';
import NXGENSphereHero from '../components/NXGENSphereHero';

// --- Data ---

type Resource = {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    badge?: string;
};

const quickStartLinks: Resource[] = [
    {
        title: 'Breakthroughs',
        description: 'Ten core services that define how GCXONE works at scale',
        link: '/docs/breakthroughs',
        icon: <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Platform Overview',
        description: 'Learn about core concepts and architecture',
        link: '/quick-start/platform-overview',
        icon: <LayoutDashboard className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Quick Start Guide',
        description: 'Get up and running in 5 minutes',
        link: '/quick-start/guide',
        icon: <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Device Integration',
        description: 'Connect your first device',
        link: '/quick-start/device-integration',
        icon: <Wifi className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Towers',
        description: 'Add and configure mobile towers',
        link: '/towers',
        icon: <Radio className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
];

const roleCards: Resource[] = [
    {
        title: 'Admin',
        description: 'Configure settings and manage users with full permissions',
        link: '/roles/admin',
        icon: <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
        badge: 'Full Access',
    },
    {
        title: 'Operator',
        description: 'Process alarms and monitor system activity',
        link: '/roles/operator',
        icon: <Activity className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Installer',
        description: 'Manage device provisioning and site setup',
        link: '/roles/installer',
        icon: <Wrench className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Manager',
        description: ' oversee operations and view reports',
        link: '/roles/manager',
        icon: <LayoutDashboard className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
        badge: 'Overview',
    },
];

const popularDevices: Resource[] = [
];

const recentReleases: Resource[] = [
    {
        title: 'Sprint 2025.12-B',
        description: 'Enhanced alarm processing, improved video playback, and new device integrations',
        link: '/releases',
        icon: <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
        badge: 'Latest',
    },
    {
        title: 'Sprint 2025.12-A',
        description: 'Initial release with core features and foundational improvements',
        link: '/releases',
        icon: <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
];

const featuredFeatures: Resource[] = [
    {
        title: 'Alarm Management',
        description: 'Real-time alarm processing and automation',
        link: '/alarm-management',
        icon: <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
        badge: 'Core',
    },
    {
        title: 'User Management',
        description: 'Role-based access control and permissions',
        link: '/user-management',
        icon: <ShieldCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Device Monitoring',
        description: 'Monitor device health and connectivity',
        link: '/device-monitoring',
        icon: <Cpu className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Towers',
        description: 'Manage and configure mobile towers',
        link: '/towers',
        icon: <Radio className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
];

const helpResources: Resource[] = [
    {
        title: 'Help Center',
        description: 'Submit tickets and find answers',
        link: '#',
        icon: <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Video Tutorials',
        description: 'How-to videos for all user levels',
        link: '/docs/knowledge-base/faq',
        icon: <PlayCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Release Notes',
        description: 'Latest updates and releases',
        link: '#',
        icon: <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Product Roadmap',
        description: 'Preview of upcoming features and improvements',
        link: '/roadmap',
        icon: <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
];

// --- Main Page ---

export default function Home(): React.JSX.Element {
    // Function to trigger Algolia DocSearch
    const handleSearchOpen = () => {
        // Trigger Algolia DocSearch by simulating Ctrl+K
        const event = new KeyboardEvent('keydown', {
            key: 'k',
            code: 'KeyK',
            ctrlKey: true,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    };

    return (
        <Layout
            title="Documentation"
            description="GCXONE Technical Documentation - Comprehensive guides for alarm management and IoT device integration">

            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>

                {/* NXGEN Sphere Hero Section */}
                <NXGENSphereHero onOpenSearch={handleSearchOpen} />

                <div className="max-w-7xl mx-auto px-6 pb-20">

                    {/* Quick Start Section */}
                    <section className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-[#E8B058]">Quick Start</h2>
                                <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Everything you need to get started</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {quickStartLinks.map((item) => (
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

                    {/* Role-Based Navigation */}
                    <section className="mt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Learn by Role</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Find documentation tailored to your user role</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                    {/* Releases */}
                    <section className="mt-20">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-[#E8B058]">Releases</h2>
                                <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Latest updates and new features</p>
                            </div>
                            <Link
                                to="/releases"
                                className="text-[#E8B058] hover:text-[#D4A047] transition-colors text-sm font-medium no-underline"
                            >
                                View All Releases →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recentReleases.map((item) => (
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

                    {/* Featured Features */}
                    <section className="mt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Platform Features</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Explore core capabilities of GCXONE</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                    {/* Help & Resources */}
                    <section className="mt-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Need Help?</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Additional resources and support</p>
                        </div>
                        <div className="space-y-4 max-w-3xl mx-auto">
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

                    {/* Support CTA - Redesigned */}
                    <div className="mt-32 mb-16">
                        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border p-12 shadow-2xl" style={{
                            background: 'var(--ifm-background-surface-color)',
                            borderColor: 'var(--ifm-color-emphasis-200)'
                        }}>
                            {/* Subtle accent gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/5 via-transparent to-[#E8B058]/5" />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                        Ready to get started?
                                    </h2>
                                    <p className="text-base md:text-lg" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Begin your journey with GCXONE today
                                    </p>
                                </div>

                                <Link
                                    to="/docs"
                                    className="group inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5 no-underline"
                                >
                                    Start Learning
                                    <svg
                                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Layout>
    );
}
