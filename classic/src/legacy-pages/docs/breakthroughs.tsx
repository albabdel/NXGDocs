import React, { useEffect, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Activity, TrendingUp, Shield, Clock, Eye, Users, Package, Layers, Home, ChevronRight } from 'lucide-react';
import LandingPageBackground from '../../components/LandingPageBackground';

function BreakthroughsContent(): JSX.Element {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const breakthroughs = [
        {
            id: 'bulkimport',
            title: 'BulkImport',
            tagline: 'Onboard 5× Faster',
            stat: '130+ Sites/Month',
            description: 'Deploy thousands of devices in minutes with automated onboarding',
            icon: <Package className="w-6 h-6" />,
            color: '#E8B058',
            category: 'Deployment'
        },
        {
            id: 'custom-view',
            title: 'Custom View',
            tagline: 'Real-Time Insights',
            stat: '40% Better Accuracy',
            description: 'Role-based dashboards that adapt to your workflow',
            icon: <Eye className="w-6 h-6" />,
            color: '#06B6D4',
            category: 'Operations'
        },
        {
            id: 'genie',
            title: 'Genie',
            tagline: 'AI Assistant',
            stat: '90% Failure Prevention',
            description: 'Predict, resolve, and guide with intelligent automation',
            icon: <Zap className="w-6 h-6" />,
            color: '#8B5CF6',
            category: 'Intelligence'
        },
        {
            id: 'healthcheck',
            title: 'HealthCheck',
            tagline: '12× Faster Diagnostics',
            stat: '100% Uptime',
            description: 'Automated device health monitoring and diagnostics',
            icon: <Activity className="w-6 h-6" />,
            color: '#10B981',
            category: 'Monitoring'
        },
        {
            id: 'marketplace',
            title: 'MarketPlace',
            tagline: 'Instant Activation',
            stat: '95% Faster Setup',
            description: 'Extend capabilities with integrated third-party services',
            icon: <Layers className="w-6 h-6" />,
            color: '#F59E0B',
            category: 'Integration'
        },
        {
            id: 'nova99x',
            title: 'NOVA99x',
            tagline: 'False Alarm Reduction',
            stat: 'Up to 99% Less Noise',
            description: 'AI-powered filtering that eliminates alert fatigue',
            icon: <Shield className="w-6 h-6" />,
            color: '#EF4444',
            category: 'Intelligence'
        },
        {
            id: 'pulse-view',
            title: 'Pulse View',
            tagline: 'Automated Timelapse',
            stat: '95% Faster Decisions',
            description: 'Generate forensic-quality videos in seconds',
            icon: <TrendingUp className="w-6 h-6" />,
            color: '#EC4899',
            category: 'Operations'
        },
        {
            id: 'time-sync',
            title: 'Time Sync',
            tagline: 'Perfect Synchronization',
            stat: '100% Accurate',
            description: 'Military-grade time sync across all devices',
            icon: <Clock className="w-6 h-6" />,
            color: '#14B8A6',
            category: 'Infrastructure'
        },
        {
            id: 'tower-guard',
            title: 'Tower Guard',
            tagline: '3× Faster Deployment',
            stat: 'Save 2 Days/Install',
            description: 'Rapid mobile tower deployment and management',
            icon: <Activity className="w-6 h-6" />,
            color: '#6366F1',
            category: 'Deployment'
        },
        {
            id: 'zen-mode',
            title: 'Zen Mode',
            tagline: 'Noise Reduction',
            stat: '10% Capacity Boost',
            description: 'Focus operators on what truly matters',
            icon: <Users className="w-6 h-6" />,
            color: '#A855F7',
            category: 'Operations'
        }
    ];

    const categories = [
        { name: 'Deployment', count: 2, icon: <Package className="w-5 h-5" /> },
        { name: 'Operations', count: 3, icon: <Users className="w-5 h-5" /> },
        { name: 'Intelligence', count: 2, icon: <Zap className="w-5 h-5" /> },
        { name: 'Monitoring', count: 1, icon: <Activity className="w-5 h-5" /> },
        { name: 'Integration', count: 1, icon: <Layers className="w-5 h-5" /> },
        { name: 'Infrastructure', count: 1, icon: <Clock className="w-5 h-5" /> }
    ];

    const stats = [
        { label: 'Core Services', value: '10', suffix: '' },
        { label: 'Efficiency Gain', value: '5', suffix: '×' },
        { label: 'Cost Reduction', value: '40', suffix: '%' },
        { label: 'Time Saved', value: '20', suffix: 'hrs/week' }
    ];

    return (
        <Layout
            title="Breakthroughs"
            description="Ten core services that define how the platform monitors, correlates, and responds at scale"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                {/* Breadcrumbs */}
                <div className="backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, var(--ifm-background-color) 0%, var(--ifm-background-color) 60%, transparent 100%)', borderBottom: '1px solid rgba(var(--ifm-color-emphasis-300-rgb, 200,200,200), 0.3)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <Link to="/docs" className="text-slate-400 hover:text-white transition-colors no-underline">
                                Docs
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Breakthroughs</span>
                        </nav>
                    </div>
                </div>

                {/* Hero Section - Redesigned */}
                <div className="relative overflow-hidden border-b" style={{
                    borderColor: 'var(--ifm-color-emphasis-200)',
                    background: `linear-gradient(180deg, ${isDark ? 'rgba(232, 176, 88, 0.03)' : 'rgba(232, 176, 88, 0.05)'} 0%, transparent 100%)`
                }}>
                    <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{
                                background: 'rgba(232, 176, 88, 0.08)',
                                border: '1px solid rgba(232, 176, 88, 0.15)'
                            }}>
                                <Zap className="w-4 h-4" style={{ color: '#E8B058' }} />
                                <span className="text-sm font-medium" style={{ color: '#E8B058' }}>10 Breakthrough Services</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ color: '#E8B058' }}>
                                Breakthroughs
                            </h1>

                            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{
                                color: 'var(--ifm-color-content)',
                                opacity: 0.9
                            }}>
                                Ten core services that define how the platform monitors, correlates, and responds at scale
                            </p>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.1 * index }}
                                        className="p-4 rounded-lg" style={{
                                            background: 'var(--ifm-background-surface-color)',
                                            border: '1px solid var(--ifm-color-emphasis-200)'
                                        }}
                                    >
                                        <div className="text-3xl font-bold mb-1" style={{ color: '#E8B058' }}>
                                            {stat.value}{stat.suffix}
                                        </div>
                                        <div className="text-sm opacity-70" style={{ color: 'var(--ifm-color-content)' }}>
                                            {stat.label}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Category Pills */}
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {categories.map((cat, index) => (
                                    <motion.div
                                        key={cat.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{
                                            background: 'rgba(232, 176, 88, 0.05)',
                                            border: '1px solid rgba(232, 176, 88, 0.1)',
                                            color: 'var(--ifm-color-content)'
                                        }}
                                    >
                                        {cat.icon}
                                        <span className="text-sm font-medium">{cat.name}</span>
                                        <span className="text-xs opacity-60">({cat.count})</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Breakthroughs Grid - Redesigned */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {breakthroughs.map((breakthrough, index) => (
                            <motion.div
                                key={breakthrough.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/docs/breakthroughs/${breakthrough.id}`}
                                    className="group block h-full no-underline"
                                >
                                    <div className="relative h-full p-6 rounded-xl border transition-all duration-200 hover:shadow-lg" style={{
                                        background: 'var(--ifm-background-surface-color)',
                                        borderColor: 'var(--ifm-color-emphasis-200)'
                                    }}>
                                        {/* Category Badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="text-xs px-2 py-1 rounded-full" style={{
                                                background: `${breakthrough.color}15`,
                                                color: breakthrough.color
                                            }}>
                                                {breakthrough.category}
                                            </span>
                                        </div>

                                        {/* Icon */}
                                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110" style={{
                                            background: `${breakthrough.color}20`,
                                            color: breakthrough.color
                                        }}>
                                            {breakthrough.icon}
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                            {breakthrough.title}
                                        </h3>

                                        {/* Tagline */}
                                        <p className="text-sm font-medium mb-3" style={{ color: breakthrough.color }}>
                                            {breakthrough.tagline}
                                        </p>

                                        {/* Stat */}
                                        <div className="text-2xl font-bold mb-3" style={{ color: breakthrough.color }}>
                                            {breakthrough.stat}
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm mb-4 opacity-80" style={{ color: 'var(--ifm-color-content)' }}>
                                            {breakthrough.description}
                                        </p>

                                        {/* Learn More */}
                                        <div className="flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all duration-200" style={{ color: breakthrough.color }}>
                                            <span>Learn more</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto px-6 pb-20"
                >
                    <div className="relative overflow-hidden rounded-2xl p-12 text-center" style={{
                        background: 'linear-gradient(135deg, rgba(232, 176, 88, 0.1) 0%, rgba(232, 176, 88, 0.05) 100%)',
                        border: '1px solid rgba(232, 176, 88, 0.15)'
                    }}>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                            Ready to Transform Your Operations?
                        </h2>
                        <p className="text-lg mb-8 opacity-80" style={{ color: 'var(--ifm-color-content)' }}>
                            These breakthroughs work together to create a security operations platform that's faster, smarter, and more scalable than anything else available.
                        </p>
                        <Link
                            to="/docs"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold no-underline transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            style={{
                                background: '#E8B058',
                                color: '#000'
                            }}
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </motion.div>

            </main>
        </Layout>
    );
}

export default function BreakthroughsLandingPage(): JSX.Element {
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => <BreakthroughsContent />}
        </BrowserOnly>
    );
}
