import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import styles from './index.module.css';
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
    Cpu
} from 'lucide-react';
import { UniversalSearchModal } from '../components/UniversalSearch';

// --- Components ---

function UniversalSearch({ onOpen }) {
    return (
        <div className={styles.searchForm} onClick={onOpen}>
            <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} size={20} />
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search documentation..."
                    readOnly
                />
                <div
                    aria-label="Open search with Ctrl or Command and K"
                    style={{
                        color: 'var(--ifm-color-emphasis-500)',
                        fontSize: '0.8rem',
                        border: '1px solid var(--ifm-color-emphasis-300)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        display: 'flex',
                        gap: '0.25rem',
                    }}>
                    <span>Ctrl</span>
                    <span>/</span>
                    <span>⌘</span>
                    <span>+</span>
                    <span>K</span>
                </div>
            </div>
        </div>
    );
}

// --- Data ---

type Resource = {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
};

const coreResources: Resource[] = [
    {
        title: 'Get Started',
        description: 'A collection of tutorials to help you with your first steps in GCXONE.',
        link: '/docs/platform-fundamentals/what-is-gcxone-genesis',
        icon: <Rocket size={24} />,
    },
    {
        title: 'GCXONE Platform',
        description: 'The fully managed alarm management platform you can use to automate repetitive tasks.',
        link: '/docs/platform-fundamentals/what-is-gcxone-genesis',
        icon: <LayoutDashboard size={24} />,
    },
    {
        title: 'Devices',
        description: 'Reliable alarm transmission, remote access, and data interfaces to IoT devices.',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Server size={24} />,
    },
    {
        title: 'Placeholder 12',
        description: 'Step-by-step guides to integrate with the GCXONE API.',
        link: '/docs/internal/technical-architecture/microservices-proxy-architecture',
        icon: <Code2 size={24} />,
    }
];

const featuredResources: Resource[] = [
    {
        title: 'Platform Overview',
        description: 'Learn about the core concepts and architecture of the GCXONE platform.',
        link: '/docs/platform-fundamentals/what-is-gcxone-genesis',
        icon: <BookOpen size={24} />,
    },
    {
        title: 'Admin Guide',
        description: 'A comprehensive guide for administrators to manage and configure the platform.',
        link: '/docs/account-management/how-to-add-a-customer',
        icon: <ShieldCheck size={24} />,
    },
    {
        title: 'Device Integration',
        description: 'Find guides for integrating a wide variety of third-party devices.',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Cpu size={24} />,
    }
];

const roleResources: Resource[] = [
    {
        title: 'For Admin',
        description: 'Administrator configures GCXONE settings for all types of users and has full permissions.',
        link: '/docs/account-management/managing-users-and-roles',
        icon: <Shield size={24} />,
    },
    {
        title: 'For Operator',
        description: 'Operator processes alarms and has permissions to view most GCXONE objects.',
        link: '/docs/features-operations/dashboard-navigation-guide',
        icon: <Activity size={24} />,
    },
    {
        title: 'For Installer',
        description: 'Installer manages device provisioning, site setup, and diagnostics tools.',
        link: '/docs/device-integration/standard-device-onboarding-process',
        icon: <Wrench size={24} />,
    },
    {
        title: 'For Developer',
        description: 'Developer integrates third-party systems using the RESTful API.',
        link: '/docs/internal/technical-architecture/microservices-proxy-architecture',
        icon: <Code2 size={24} />,
    }
];

const learnMoreResources: Resource[] = [
    {
        title: 'Help Center',
        description: 'Submit tickets, and get answers to the most common questions.',
        link: '/docs/troubleshooting-support/how-to-submit-a-support-ticket',
        icon: <HelpCircle size={24} />,
    },
    {
        title: 'Tutorials',
        description: 'How-to videos for all levels of users.',
        link: '/docs/platform-fundamentals/what-is-gcxone-genesis',
        icon: <PlayCircle size={24} />,
    },
    {
        title: 'Release Notes',
        description: 'All things about alarm management updates and GCXONE releases.',
        link: '/docs/platform-fundamentals/what-is-gcxone-genesis',
        icon: <FileText size={24} />,
    }
];

// --- Main Page ---

function ResourceCard({ item }: { item: Resource }) {
    const href = useBaseUrl(item.link);
    return (
        <Link to={href} className={styles.card}>
            <div className={styles.cardIcon}>{item.icon}</div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
        </Link>
    );
}

export default function Home(): React.JSX.Element {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Mouse tracking for hover effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            document.querySelectorAll(`.${styles.card}`).forEach((card) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
                (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
            });
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

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
            description="GCXONE Technical Documentation">

            <main className={styles.main}>

                <div className={styles.container}>
                    {/* Hero Section */}
                    <section className={styles.hero}>
                        <h1 className={styles.heroTitle}>GCXONE Documentation</h1>
                        <p className={styles.heroSubtitle}>
                            An extensive database of instructions for working in the GCXONE ecosystem..
                        </p>
                        <UniversalSearch onOpen={() => setIsSearchOpen(true)} />
                    </section>

                    {/* Section 1: Core Resources */}
                    <section className={styles.section}>
                        <div className={styles.grid4}>
                            {coreResources.map((item) => (
                                <ResourceCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Section 1.5: Featured Topics */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Featured Topics</h2>
                        <p className={styles.sectionSubtitle}>Explore key areas of the GCXONE platform.</p>
                        <div className={styles.grid3}>
                            {featuredResources.map((item) => (
                                <ResourceCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Learn by Role */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Learn by role</h2>
                        <p className={styles.sectionSubtitle}>View GCXONE documentation for your user role.</p>
                        <div className={styles.grid4}>
                            {roleResources.map((item) => (
                                <ResourceCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Learn More */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Learn more</h2>
                        <p className={styles.sectionSubtitle}>Use our Help Center and browse our videos and articles.</p>
                        <div className={styles.grid3}>
                            {learnMoreResources.map((item) => (
                                <ResourceCard key={item.title} item={item} />
                            ))}
                        </div>
                    </section>

                </div>

                <UniversalSearchModal
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                />
            </main>
        </Layout>
    );
}
