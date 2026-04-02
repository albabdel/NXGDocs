import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../components/PageHeader';
import LandingPageBackground from '../components/LandingPageBackground/LandingPageBackground';
import {
    Calendar,
    Package,
    ArrowRight,
    Clock,
    CheckCircle2,
    FileText,
    Sparkles
} from 'lucide-react';

// Release data structure for customer-facing releases
type Release = {
    id: string;
    title: string;
    date: string;
    description: string;
    status: 'released' | 'upcoming';
    highlights: string[];
    link?: string;
};

// Customer-facing releases data
// Note: This is a legacy fallback page. The main releases page uses Sanity data.
// Sprint 2025.12-B is kept here for backward compatibility with the legacy route.
// Sprint 2025.12-A has been archived (no route exists for it).
const releases: Release[] = [
    {
        id: 'sprint-2025-12-b',
        title: 'Sprint 2025.12-B',
        date: 'December 15, 2025',
        description: 'Enhanced alarm processing, improved video playback, and new device integrations',
        status: 'released',
        highlights: [
            'Enhanced alarm processing engine with faster response times',
            'Improved video playback with better buffering and seek functionality',
            'New Hikvision device integration with advanced PTZ control',
            'Real-time dashboard updates with WebSocket connections',
            'Performance optimizations reducing page load times by 40%'
        ],
        link: '/releases/sprint-2025-12-b'
    }
];

export default function ReleasesPage() {
    return (
        <Layout
            title="Release Notes"
            description="Latest updates, new features, and improvements"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Releases' }
                    ]}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">What's New</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Release Notes
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            Stay up to date with the latest features, improvements, and enhancements to the platform.
                            We release updates twice monthly to continuously improve your experience.
                        </p>
                    </motion.div>

                    {/* Releases List */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Recent Releases</h2>
                            <p className="text-white/70">
                                Browse through our latest platform updates and improvements
                            </p>
                        </div>

                        <div className="space-y-6">
                            {releases.map((release, idx) => (
                                <motion.div
                                    key={release.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <div className="group p-8 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10">
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <h3 className="text-3xl font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                        {release.title}
                                                    </h3>
                                                    {release.status === 'released' && (
                                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                            Released
                                                        </span>
                                                    )}
                                                    {release.status === 'upcoming' && (
                                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                            Upcoming
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{release.date}</span>
                                                    </div>
                                                </div>
                                                
                                                <p className="text-white/80 mb-6 text-lg leading-relaxed">
                                                    {release.description}
                                                </p>

                                                {/* Highlights */}
                                                {release.highlights && release.highlights.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-sm font-semibold text-white/90 mb-3">Key Highlights:</h4>
                                                        <ul className="space-y-2">
                                                            {release.highlights.map((highlight, i) => (
                                                                <li key={i} className="flex items-start gap-3 text-white/70">
                                                                    <CheckCircle2 className="w-5 h-5 text-[#E8B058] flex-shrink-0 mt-0.5" />
                                                                    <span>{highlight}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {release.link && (
                                                    <Link
                                                        to={release.link}
                                                        className="inline-flex items-center gap-2 text-[#E8B058] text-sm font-medium hover:gap-3 transition-all no-underline"
                                                    >
                                                        <span>View Full Release Notes</span>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                )}
                                            </div>
                                            
                                            <div className="flex-shrink-0">
                                                <div className="p-4 bg-[#E8B058]/10 rounded-lg text-[#E8B058] group-hover:bg-[#E8B058]/20 transition-colors">
                                                    <Package className="w-8 h-8" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="p-8 bg-[#202020] border border-white/10 rounded-2xl">
                            <FileText className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Release Schedule</h2>
                            <p className="text-white/70 mb-6 max-w-xl mx-auto">
                                We release platform updates twice per month, typically on the 1st and 15th of each month.
                                Each release includes new features, improvements, and bug fixes to enhance your experience.
                            </p>
                            <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Bi-weekly releases</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Regular updates</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}

