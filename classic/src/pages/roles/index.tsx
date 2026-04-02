import React from 'react';
import Layout from '@theme/Layout';
import { Settings, Eye, Wrench, BarChart3 } from 'lucide-react';
import FeatureCard from '../../components/FeatureCard';
import styles from '../index.module.css';

const roleCards = [
    {
        title: 'Admin',
        description: 'Configure users, devices, and system settings.',
        link: '/roles/admin',
        icon: <Settings className="w-6 h-6" />,
    },
    {
        title: 'Operator',
        description: 'Monitor events and respond to alarms.',
        link: '/roles/operator',
        icon: <Eye className="w-6 h-6" />,
    },
    {
        title: 'Installer',
        description: 'Set up and maintain devices.',
        link: '/roles/installer',
        icon: <Wrench className="w-6 h-6" />,
    },
    {
        title: 'Manager',
        description: 'Review reports and analytics.',
        link: '/roles/manager',
        icon: <BarChart3 className="w-6 h-6" />,
    },
];

export default function RolesIndex(): React.JSX.Element {
    return (
        <Layout
            title="Choose Your Role"
            description="Get started with role-specific guides"
        >
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <section className="pt-20 pb-12 text-center">
                        <span className={styles.sectionBadge}>Get Started</span>
                        <h1
                            className="text-4xl md:text-5xl font-bold mt-4 mb-4"
                            style={{ color: '#E8B058' }}
                        >
                            Choose Your Role
                        </h1>
                        <p
                            className="text-lg max-w-2xl mx-auto"
                            style={{ color: 'var(--ifm-color-content-secondary)' }}
                        >
                            Get started with role-specific guides
                        </p>
                    </section>

                    <section className="mt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {roleCards.map((item) => (
                                <FeatureCard
                                    key={item.title}
                                    title={item.title}
                                    description={item.description}
                                    icon={item.icon}
                                    link={item.link}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </Layout>
    );
}
