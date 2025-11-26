import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
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
    Search
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
                <div style={{
                    color: 'var(--ifm-color-emphasis-500)',
                    fontSize: '0.8rem',
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    borderRadius: '4px',
                    padding: '2px 6px'
                }}>
                    ⌘K
                </div>
            </div>
        </div>
    );
}

// --- Data ---

const coreResources = [
    {
        title: 'Get Started',
        description: 'A collection of tutorials to help you with your first steps in GCXONE.',
        link: '/docs/getting-started',
        icon: <Rocket size={24} />,
    },
    {
        title: 'GCXONE Platform',
        description: 'The fully managed alarm management platform you can use to automate repetitive tasks.',
        link: '/docs/features',
        icon: <LayoutDashboard size={24} />,
    },
    {
        title: 'Devices',
        description: 'Reliable alarm transmission, remote access, and data interfaces to IoT devices.',
        link: '/docs/devices',
        icon: <Server size={24} />,
    },
    {
        title: 'API',
        description: 'Step-by-step guides to integrate with the GCXONE API.',
        link: '/docs/api',
        icon: <Code2 size={24} />,
    },
];

const roleResources = [
    {
        title: 'For Admin',
        description: 'Administrator configures GCXONE settings for all types of users and has full permissions.',
        link: '/docs/roles/admin',
        icon: <Shield size={24} />,
    },
    {
        title: 'For Operator',
        description: 'Operator processes alarms and has permissions to view most GCXONE objects.',
        link: '/docs/roles/operator',
        icon: <Activity size={24} />,
    },
    {
        title: 'For Installer',
        description: 'Installer manages device provisioning, site setup, and diagnostics tools.',
        link: '/docs/roles/installer',
        icon: <Wrench size={24} />,
    },
    {
        title: 'For Developer',
        description: 'Developer integrates third-party systems using the RESTful API.',
        link: '/docs/api',
        icon: <Code2 size={24} />,
    },
];

const learnMoreResources = [
    {
        title: 'Help Center',
        description: 'Submit tickets, and get answers to the most common questions.',
        link: '/docs/getting-started',
        icon: <HelpCircle size={24} />,
    },
    {
        title: 'Tutorials',
        description: 'How-to videos for all levels of users.',
        link: '/docs/getting-started',
        icon: <PlayCircle size={24} />,
    },
    {
        title: 'Release Notes',
        description: 'All things about alarm management updates and GCXONE releases.',
        link: '/docs/release-notes',
        icon: <FileText size={24} />,
    },
];

// --- Main Page ---

export default function Home(): JSX.Element {
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
            } else if (e.key === '/' && !isSearchOpen && document.activeElement.tagName !== 'INPUT') {
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
                            An extensive database of instructions for working in the GCXONE ecosystem.
                        </p>
                        <UniversalSearch onOpen={() => setIsSearchOpen(true)} />
                    </section>

                    {/* Section 1: Core Resources */}
                    <section className={styles.section}>
                        <div className={styles.grid4}>
                            {coreResources.map((item, idx) => (
                                <Link key={idx} to={item.link} className={styles.card}>
                                    <div className={styles.cardIcon}>{item.icon}</div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDesc}>{item.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: Learn by Role */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Learn by role</h2>
                        <p className={styles.sectionSubtitle}>View GCXONE documentation for your user role.</p>
                        <div className={styles.grid4}>
                            {roleResources.map((item, idx) => (
                                <Link key={idx} to={item.link} className={styles.card}>
                                    <div className={styles.cardIcon}>{item.icon}</div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDesc}>{item.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Learn More */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionHeading}>Learn more</h2>
                        <p className={styles.sectionSubtitle}>Use our Help Center and browse our videos and articles.</p>
                        <div className={styles.grid3}>
                            {learnMoreResources.map((item, idx) => (
                                <Link key={idx} to={item.link} className={styles.card}>
                                    <div className={styles.cardIcon}>{item.icon}</div>
                                    <h3 className={styles.cardTitle}>{item.title}</h3>
                                    <p className={styles.cardDesc}>{item.description}</p>
                                </Link>
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
