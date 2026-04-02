import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground/LandingPageBackground';
import { Card } from '../../components/ui';
import { UpdateCard } from '../../components/UpdateCard';
import {
    Bell,
    Package,
    Bug,
    Map,
    Megaphone,
    AlertCircle,
} from 'lucide-react';
import updatesData from '../../data/sanity-updates.generated.json';

type UpdateType = 'announcement' | 'release' | 'bugfix' | 'roadmap';
type BugfixStatus = 'investigating' | 'identified' | 'monitoring' | 'fixed';
type BugfixSeverity = 'low' | 'medium' | 'high' | 'critical';
type RoadmapStatus = 'planned' | 'in_progress' | 'completed' | 'on_hold';

interface ReleaseNoteSection {
    _key: string;
    title: string;
    items: string[];
}

interface Update {
    _id: string;
    _type: 'updateType';
    type: UpdateType;
    title: string;
    slug: {
        _type: 'slug';
        current: string;
    };
    excerpt?: string;
    publishedAt: string;
    content?: unknown[];
    releaseFields?: {
        version: string;
        releaseNotes?: ReleaseNoteSection[];
    };
    bugfixFields?: {
        status: BugfixStatus;
        severity?: BugfixSeverity;
        affectedAreas?: string[];
    };
    roadmapFields?: {
        roadmapStatus: RoadmapStatus;
        targetDate?: string;
        projectedRelease?: string;
    };
}

type UpdatesArray = Update[];

const tabConfig: Record<string, { label: string; icon: React.ReactNode; type: UpdateType | 'all' }> = {
    'All': { label: 'All', icon: <Bell className="w-4 h-4" />, type: 'all' },
    'Announcements': { label: 'Announcements', icon: <Megaphone className="w-4 h-4" />, type: 'announcement' },
    'Releases': { label: 'Releases', icon: <Package className="w-4 h-4" />, type: 'release' },
    'Bug Fixes': { label: 'Bug Fixes', icon: <Bug className="w-4 h-4" />, type: 'bugfix' },
    'Roadmap': { label: 'Roadmap', icon: <Map className="w-4 h-4" />, type: 'roadmap' },
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function UpdatesContent(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>('All');
    const updates = updatesData as UpdatesArray;

    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = {
            'All': updates.length,
            'Announcements': updates.filter(u => u.type === 'announcement').length,
            'Releases': updates.filter(u => u.type === 'release').length,
            'Bug Fixes': updates.filter(u => u.type === 'bugfix').length,
            'Roadmap': updates.filter(u => u.type === 'roadmap').length,
        };
        return counts;
    }, [updates]);

    const filteredUpdates = useMemo(() => {
        if (activeTab === 'All') return updates;
        const typeMap: Record<string, UpdateType> = {
            'Announcements': 'announcement',
            'Releases': 'release',
            'Bug Fixes': 'bugfix',
            'Roadmap': 'roadmap',
        };
        return updates.filter(update => update.type === typeMap[activeTab]);
    }, [activeTab, updates]);

    const lastUpdated = useMemo(() => {
        if (updates.length === 0) return null;
        const dates = updates
            .map(u => u.publishedAt)
            .filter(Boolean)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        return dates[0] || null;
    }, [updates]);

    return (
        <main className="min-h-screen">
            <PageHeader
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Updates' }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                        <Bell className="w-4 h-4 text-[#E8B058]" />
                        <span className="text-sm font-medium text-[#E8B058]">Platform Updates</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Updates Hub
                    </h1>
                    <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                        All platform updates in one place. Stay informed about new features, 
                        bug fixes, roadmap progress, and important announcements.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        {Object.entries(tabConfig).map(([tabKey, config]) => (
                            <button
                                key={tabKey}
                                onClick={() => setActiveTab(tabKey)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === tabKey
                                        ? 'bg-[#E8B058] text-black'
                                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {config.icon}
                                <span>{config.label}</span>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                    activeTab === tabKey
                                        ? 'bg-black/20 text-black'
                                        : 'bg-white/10 text-white/50'
                                }`}>
                                    {tabCounts[tabKey]}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="text-sm text-white/50">
                        Showing {filteredUpdates.length} update{filteredUpdates.length !== 1 ? 's' : ''}
                        {activeTab !== 'All' && ` in ${activeTab}`}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-6"
                >
                    {filteredUpdates.length > 0 ? (
                        filteredUpdates.map((update, index) => (
                            <UpdateCard key={update._id} update={update} index={index} />
                        ))
                    ) : (
                        <Card variant="default" padding="lg" className="text-center">
                            <AlertCircle className="w-12 h-12 text-white/30 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">
                                No updates in this category yet
                            </h3>
                            <p className="text-white/60 mb-4">
                                Check other tabs or check back later for new updates.
                            </p>
                            {activeTab !== 'All' && (
                                <button
                                    onClick={() => setActiveTab('All')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058] text-black rounded-lg text-sm font-medium hover:bg-[#D4A047] transition-colors"
                                >
                                    <Bell className="w-4 h-4" />
                                    View All Updates
                                </button>
                            )}
                        </Card>
                    )}
                </motion.div>

                {lastUpdated && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12 text-center text-sm text-white/40"
                    >
                        Last updated: {formatDate(lastUpdated)}
                    </motion.div>
                )}
            </div>
        </main>
    );
}

export default function UpdatesPage(): JSX.Element {
    return (
        <Layout
            title="Updates Hub"
            description="All platform updates in one place - announcements, releases, bug fixes, and roadmap progress"
        >
            <LandingPageBackground />
            <UpdatesContent />
        </Layout>
    );
}
