import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import { useColorMode } from '@docusaurus/theme-common';
import { motion } from 'framer-motion';
import {
    Rocket,
    LayoutDashboard,
    Server,
    Code2,
    Shield,
    Activity,
    Wrench,
    HelpCircle,
    PlayCircle,
    FileText,
    Search,
    BookOpen,
    ShieldCheck,
    Cpu,
    Camera,
    Wifi,
    Bell,
    ArrowRight,
    Zap,
    Plug,
    Users
} from 'lucide-react';
import { UniversalSearchModal } from '../components/UniversalSearch';
import FeatureCard from '../components/FeatureCard';
import QuickLink from '../components/QuickLink';
import Badge from '../components/Badge';
import ParticleBackground from '../components/ParticleBackground';
import TypingAnimation from '../components/TypingAnimation';
import FloatingDarkModeToggle from '../components/FloatingDarkModeToggle';
import NXGENSphereHero from '../components/NXGENSphereHero';

// Header Theme Toggle Component
function HeaderThemeToggle() {
    const { colorMode, setColorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const toggleColorMode = () => {
        setColorMode(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleColorMode}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="flex items-center justify-center p-2 rounded-lg border border-[#E8B058]/30 hover:border-[#E8B058]/60 hover:bg-[#E8B058]/10 transition-all"
        >
            <div className={`w-11 h-6 rounded-full relative transition-colors ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform flex items-center justify-center ${isDark ? 'translate-x-5 bg-[#E8B058]' : 'bg-white translate-x-0'}`}>
                    {isDark ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13ZM12.14,19.73A8.14,8.14,0,0,1,6.34,5.23v.26A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                            <path d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M12,4c0.55,0,1-0.45,1-1V2c0-0.55-0.45-1-1-1 s-1,0.45-1,1v1C11,3.55,11.45,4,12,4z M12,22c-0.55,0-1-0.45-1-1v-1c0-0.55,0.45-1,1-1 s1,0.45,1,1v1C13,21.55,12.55,22,12,22z M4.22,5.64c0.39,0.39,1.03,0.39,1.41,0L6.7,4.57c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0L4.22,4.22C3.83,4.61,3.83,5.25,4.22,5.64z M17.3,19.43c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L17.3,19.43z M4,12 c0-0.55-0.45-1-1-1H2c-0.55,0-1,0.45-1,1s0.45,1,1,1h1C3.55,13,4,12.55,4,12z M22,11h-1c-0.55,0-1,0.45-1,1 s0.45,1,1,1h1c0.55,0,1-0.45,1-1S22.55,11,22,11z M6.7,19.43l-1.06,1.06c-0.39,0.39-1.03,0.39-1.41,0 c-0.39-0.39-0.39-1.03,0-1.41l1.06-1.06c0.39-0.39,1.03-0.39,1.41,0C7.09,18.39,7.09,19.04,6.7,19.43z M19.78,5.64 c0.39-0.39,0.39-1.03,0-1.41l-1.06-1.06c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 C18.75,6.03,19.39,6.03,19.78,5.64z" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
}

// --- Components ---

function HeroSearch({ onOpen }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={onOpen}
            className="w-full max-w-2xl mx-auto cursor-pointer"
        >
            <div className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-xl">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400"
                    placeholder="Search documentation..."
                    readOnly
                />
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs text-gray-600 dark:text-gray-400">
                    <span>Ctrl</span>
                    <span>/</span>
                    <span>⌘</span>
                    <span>+</span>
                    <span>K</span>
                </div>
            </div>
        </motion.div>
    );
}

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
    {
        title: 'IP Cameras',
        description: 'HD surveillance cameras with alarm integration',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Camera className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Alarm Panels',
        description: 'Connect security panels to GCXONE',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'IoT Sensors',
        description: 'Temperature, motion, and environmental sensors',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Server className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
];

const featuredFeatures: Resource[] = [
    {
        title: 'Alarm Management',
        description: 'Real-time alarm processing and automation',
        link: '/docs/features-operations/dashboard-navigation-guide',
        icon: <Bell className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
        badge: 'Core',
    },
    {
        title: 'User Management',
        description: 'Role-based access control and permissions',
        link: '/docs/account-management/managing-users-and-roles',
        icon: <ShieldCheck className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Device Monitoring',
        description: 'Monitor device health and connectivity',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Cpu className="w-6 h-6 text-primary-600 dark:text-primary-400" />,
    },
];

const helpResources: Resource[] = [
    {
        title: 'Help Center',
        description: 'Submit tickets and find answers',
        link: '/docs/troubleshooting-support/how-to-submit-a-support-ticket',
        icon: <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Video Tutorials',
        description: 'How-to videos for all user levels',
        link: '/docs/platform-fundamentals/what-is-gcxone-GCXONE',
        icon: <PlayCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
    {
        title: 'Release Notes',
        description: 'Latest updates and releases',
        link: '/docs/platform-fundamentals/what-is-gcxone-GCXONE',
        icon: <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />,
    },
];

// --- Main Page ---

export default function Home(): React.JSX.Element {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            } else if (e.key === '/' && !isSearchOpen && document.activeElement?.tagName !== 'INPUT') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isSearchOpen]);

    return (
        <Layout
            title="Documentation"
            description="GCXONE Technical Documentation - Comprehensive guides for alarm management and IoT device integration">

            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>

                {/* Header with Breadcrumb and Theme Toggle */}
                <div className="relative z-50 flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: 'var(--ifm-background-color)', borderColor: 'var(--ifm-color-emphasis-200)' }}>
                    {/* Breadcrumb Trail */}
                    <motion.nav
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center gap-2 text-sm"
                    >
                        <Link to="/" className="hover:text-[#E8B058] transition-colors no-underline flex items-center gap-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Home
                        </Link>
                        <span style={{ color: 'var(--ifm-color-emphasis-500)' }}>›</span>
                        <span className="text-[#E8B058] font-semibold">GCXONE</span>
                    </motion.nav>

                    {/* Theme Toggle */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center"
                    >
                        <HeaderThemeToggle />
                    </motion.div>
                </div>


                {/* NXGEN Sphere Hero Section */}
                <NXGENSphereHero onOpenSearch={() => setIsSearchOpen(true)} />

                <div className="max-w-7xl mx-auto px-6 pb-20">

                    {/* Quick Start Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-[#E8B058]">Quick Start</h2>
                                <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Everything you need to get started</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {quickStartLinks.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                                >
                                    <QuickLink
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        href={item.link}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Role-Based Navigation */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Learn by Role</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Find documentation tailored to your user role</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {roleCards.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                                >
                                    <FeatureCard
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        link={item.link}
                                        badge={item.badge}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Popular Devices */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="mt-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Popular Devices</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Commonly integrated hardware devices</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {popularDevices.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                                >
                                    <FeatureCard
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        link={item.link}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Featured Features */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                        className="mt-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Platform Features</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Explore core capabilities of GCXONE</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredFeatures.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                                >
                                    <FeatureCard
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        link={item.link}
                                        badge={item.badge}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Help & Resources */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="mt-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>Need Help?</h2>
                            <p className="mt-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>Additional resources and support</p>
                        </div>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {helpResources.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: 1.3 + index * 0.1 }}
                                >
                                    <QuickLink
                                        title={item.title}
                                        description={item.description}
                                        icon={item.icon}
                                        href={item.link}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Support CTA - Redesigned */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mt-32 mb-16"
                    >
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
                                    to="/docs/getting-started"
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
                    </motion.div>
                </div>

                <UniversalSearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                />
            </main>
        </Layout>
    );
}
