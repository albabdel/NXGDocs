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
    Sparkles,
    Map as MapIcon,
    Layers,
    Zap,
    CheckCircle2
} from 'lucide-react';
import releasesData from '../data/sanity-releases.generated.json';
import roadmapData from '../data/sanity-roadmap.generated.json';

// Type definitions matching the JSON structure from Phase 6
interface ReleaseItem {
    _key: string;
    title: string;
    description: string | null;
    changeType: 'feature' | 'fix' | 'improvement' | 'breaking' | 'security' | null;
    affectedAreas: string[];
    screenshotUrl: string | null;
    videoUrl: string | null;
    articleUrl: string | null;
}

interface Release {
    _id: string;
    displayTitle: string;
    items: ReleaseItem[];
    publishedAt: string;
    slug: {
        _type: 'slug';
        current: string;
    };
    sprintId?: string;
    summary?: string;
}

type ReleasesArray = Release[];

type RoadmapStatus = 'Planned' | 'In Progress' | 'Shipped';
type ChangeType = 'feature' | 'improvement' | 'fix' | 'breaking';

interface RoadmapItem {
    _id: string;
    title: string;
    status: RoadmapStatus;
    projectedRelease: string;
    changeType: ChangeType;
}

const roadmapStatusConfig: Record<RoadmapStatus, { icon: React.ReactNode; colorClass: string }> = {
    'Planned': { icon: <Layers className="w-4 h-4" />, colorClass: 'text-yellow-400' },
    'In Progress': { icon: <Zap className="w-4 h-4" />, colorClass: 'text-blue-400' },
    'Shipped': { icon: <CheckCircle2 className="w-4 h-4" />, colorClass: 'text-green-400' },
};

function getUpcomingRoadmapItems(limit: number = 4): RoadmapItem[] {
    const items = roadmapData as RoadmapItem[];
    return items
        .filter(item => item.status === 'Planned' || item.status === 'In Progress')
        .slice(0, limit);
}

// Change type badge configuration
const changeTypeConfig: Record<string, { label: string; bgClass: string; textClass: string }> = {
    feature: { label: 'Feature', bgClass: 'bg-green-500/20', textClass: 'text-green-400 border-green-500/30' },
    fix: { label: 'Fix', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400 border-blue-500/30' },
    improvement: { label: 'Improvement', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400 border-yellow-500/30' },
    breaking: { label: 'Breaking', bgClass: 'bg-red-500/20', textClass: 'text-red-400 border-red-500/30' },
    security: { label: 'Security', bgClass: 'bg-purple-500/20', textClass: 'text-purple-400 border-purple-500/30' },
};

// Format date for display
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Extract unique change types from release items with counts
function getChangeTypeSummary(items: ReleaseItem[]): Array<{ type: string; label: string; count: number; bgClass: string; textClass: string }> {
    const typeCounts = new Map<string, number>();
    
    items.forEach(item => {
        if (item.changeType) {
            typeCounts.set(item.changeType, (typeCounts.get(item.changeType) || 0) + 1);
        }
    });
    
    return Array.from(typeCounts.entries())
        .map(([type, count]) => ({
            type,
            label: changeTypeConfig[type]?.label || type,
            count,
            bgClass: changeTypeConfig[type]?.bgClass || 'bg-white/10',
            textClass: changeTypeConfig[type]?.textClass || 'text-white/70',
        }))
        .sort((a, b) => {
            const order = ['feature', 'improvement', 'fix', 'security', 'breaking'];
            return order.indexOf(a.type) - order.indexOf(b.type);
        });
}

export default function ReleasesPage() {
    const releases: ReleasesArray = releasesData;

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
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Stay up to date with the latest features, improvements, and enhancements to the platform.
                            We release updates twice monthly to continuously improve your experience.
                        </p>
                        <Link
                            to="/roadmap"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058]/10 border border-[#E8B058]/30 rounded-lg text-[#E8B058] font-medium hover:bg-[#E8B058]/20 transition-colors no-underline"
                        >
                            <MapIcon className="w-5 h-5" />
                            View Product Roadmap
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* Releases List */}
                    {releases.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-20"
                        >
                            <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-white mb-2">No releases yet</h2>
                            <p className="text-white/60">
                                Release notes will appear here once they're published.
                            </p>
                        </motion.div>
                    ) : (
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
                                {releases.map((release, idx) => {
                                    const changeTypes = getChangeTypeSummary(release.items);
                                    const isLatest = idx === 0;

                                    return (
                                        <motion.div
                                            key={release._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                                            viewport={{ once: true }}
                                        >
                                            <Link
                                                to={`/releases/${release.slug.current}`}
                                                className="block group p-8 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                            >
                                                <div className="flex items-start justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                            <h3 className="text-3xl font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                                {release.displayTitle}
                                                            </h3>
                                                            {isLatest && (
                                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-[#E8B058]/20 text-[#E8B058] border border-[#E8B058]/30">
                                                                    Latest
                                                                </span>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-4 mb-4 text-sm text-white/60 flex-wrap">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="w-4 h-4" />
                                                                <span>{formatDate(release.publishedAt)}</span>
                                                            </div>
                                                            {release.sprintId && (
                                                                <div className="flex items-center gap-2 text-white/40">
                                                                    <span>•</span>
                                                                    <span>{release.sprintId}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {release.summary && (
                                                            <p className="text-white/80 mb-6 text-lg leading-relaxed">
                                                                {release.summary}
                                                            </p>
                                                        )}

                                                        {/* Change Type Badges */}
                                                        {changeTypes.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-4">
                                                                {changeTypes.map(({ type, label, count, bgClass, textClass }) => (
                                                                    <span
                                                                        key={type}
                                                                        className={`px-3 py-1 text-xs font-medium rounded-full border ${bgClass} ${textClass}`}
                                                                    >
                                                                        {count} {count === 1 ? label : `${label}s`}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="inline-flex items-center gap-2 text-[#E8B058] text-sm font-medium group-hover:gap-3 transition-all">
                                                            <span>View Full Release Notes</span>
                                                            <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-shrink-0">
                                                        <div className="p-4 bg-[#E8B058]/10 rounded-lg text-[#E8B058] group-hover:bg-[#E8B058]/20 transition-colors">
                                                            <Package className="w-8 h-8" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.section>
                    )}

                    {/* What's Coming Next - Roadmap Preview */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">What's Coming Next</h2>
                            <p className="text-white/70">
                                Preview upcoming features on our roadmap
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getUpcomingRoadmapItems().map((item, idx) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${roadmapStatusConfig[item.status].colorClass}`}>
                                            {roadmapStatusConfig[item.status].icon}
                                            <span className="text-sm font-medium">{item.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-white/60">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{item.projectedRelease}</span>
                                        </div>
                                        <span className={`px-2 py-0.5 text-xs rounded-full border ${changeTypeConfig[item.changeType]?.bgClass || 'bg-white/10'} ${changeTypeConfig[item.changeType]?.textClass || 'text-white/70'}`}>
                                            {changeTypeConfig[item.changeType]?.label || item.changeType}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                to="/roadmap"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058]/10 border border-[#E8B058]/30 rounded-lg text-[#E8B058] font-medium hover:bg-[#E8B058]/20 transition-colors no-underline"
                            >
                                <MapIcon className="w-5 h-5" />
                                View Full Roadmap
                                <ArrowRight className="w-4 h-4" />
                            </Link>
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
                            <Package className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Release Schedule</h2>
                            <p className="text-white/70 mb-6 max-w-xl mx-auto">
                                We release platform updates twice per month, typically on the 1st and 15th of each month.
                                Each release includes new features, improvements, and bug fixes to enhance your experience.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
