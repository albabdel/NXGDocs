import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground/LandingPageBackground';
import {
    Calendar,
    Package,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    Zap,
    Video,
    Camera,
    Users,
    Settings,
    Shield,
    Bell
} from 'lucide-react';

// Feature highlight structure
type FeatureHighlight = {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: React.ReactNode;
};

// Customer-facing feature highlights for Sprint 2025.12-B
const features: FeatureHighlight[] = [
    {
        id: 'feat-001',
        title: 'Enhanced Alarm Processing',
        description: 'Experience faster alarm response times with our optimized processing engine. Improved queue management ensures critical alarms are handled with priority, reducing response delays.',
        category: 'Core Features',
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: 'feat-002',
        title: 'Improved Video Playback',
        description: 'Enjoy smoother video playback with enhanced buffering and improved seek functionality. Navigate through footage with frame-by-frame precision and better timeline controls.',
        category: 'Video Features',
        icon: <Video className="w-6 h-6" />
    },
    {
        id: 'feat-003',
        title: 'Advanced Hikvision Integration',
        description: 'New advanced integration support for Hikvision devices with enhanced PTZ control, improved event subscription, and higher quality video streaming.',
        category: 'Device Integration',
        icon: <Camera className="w-6 h-6" />
    },
    {
        id: 'feat-004',
        title: 'Enhanced User Management',
        description: 'Improved user management interface with streamlined role assignment, better permission management, and comprehensive audit logging for security compliance.',
        category: 'User Management',
        icon: <Users className="w-6 h-6" />
    },
    {
        id: 'feat-005',
        title: 'Real-time Dashboard Updates',
        description: 'Get instant updates on your dashboard with new WebSocket connections. Live status indicators and automatic refresh keep you informed of system health in real-time.',
        category: 'Dashboard',
        icon: <Settings className="w-6 h-6" />
    },
    {
        id: 'feat-006',
        title: 'Enhanced Security',
        description: 'Improved authentication mechanisms, better session management, and API rate limiting help protect your system. New support for multi-factor authentication adds an extra layer of security.',
        category: 'Security',
        icon: <Shield className="w-6 h-6" />
    },
    {
        id: 'feat-007',
        title: 'Performance Improvements',
        description: 'Experience faster page loads and improved system responsiveness. Optimized database queries and improved caching strategies result in up to 40% faster page load times.',
        category: 'Performance',
        icon: <Zap className="w-6 h-6" />
    },
    {
        id: 'feat-008',
        title: 'Mobile Tower Configuration',
        description: 'Redesigned mobile tower configuration interface with improved validation, better error handling, and a more intuitive user experience for easier setup and management.',
        category: 'Towers',
        icon: <Bell className="w-6 h-6" />
    }
];

// Group features by category
const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
        acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
}, {} as Record<string, FeatureHighlight[]>);

export default function Sprint202512BReleasePage() {
    return (
        <Layout
            title="Sprint 2025.12-B Release Notes"
            description="Latest features and improvements in Sprint 2025.12-B"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Releases', href: '/releases' },
                        { label: 'Sprint 2025.12-B' }
                    ]}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Link
                            to="/releases"
                            className="inline-flex items-center gap-2 text-white/70 hover:text-[#E8B058] transition-colors no-underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Releases</span>
                        </Link>
                    </motion.div>

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Latest Release</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Sprint 2025.12-B
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/70 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>December 15, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>Released</span>
                            </div>
                        </div>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            This release brings significant improvements to alarm processing, video playback, 
                            device integrations, and overall system performance. We've focused on enhancing 
                            user experience and system reliability.
                        </p>
                    </motion.div>

                    {/* Features by Category */}
                    {Object.entries(groupedFeatures).map(([category, categoryFeatures], categoryIdx) => (
                        <motion.section
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: categoryIdx * 0.1 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">{category}</h2>
                                <p className="text-white/60">
                                    {categoryFeatures.length} {categoryFeatures.length === 1 ? 'feature' : 'features'}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {categoryFeatures.map((feature, idx) => (
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] flex-shrink-0">
                                                {feature.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-3">
                                                    {feature.title}
                                                </h3>
                                                <p className="text-white/70 leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    ))}

                    {/* Summary Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-16 p-8 bg-gradient-to-br from-[#202020] to-[#1a1a1a] rounded-xl border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">Release Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">{features.length}</div>
                                <div className="text-white/70">New Features</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">
                                    {Object.keys(groupedFeatures).length}
                                </div>
                                <div className="text-white/70">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">40%</div>
                                <div className="text-white/70">Faster Load Times</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}

