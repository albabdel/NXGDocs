import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useParams } from '@docusaurus/router';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import LandingPageBackground from '../components/LandingPageBackground/LandingPageBackground';
import { Card } from '../components/ui';
import {
    Package,
    Bug,
    Map,
    Megaphone,
    CheckCircle2,
    Clock,
    Zap,
    ArrowLeft,
    Calendar,
    Layers,
    Pause,
    AlertTriangle,
    ChevronRight,
    CheckCircle,
    Wrench,
    Sparkles,
} from 'lucide-react';
import updatesData from '../../data/sanity-updates.generated.json';

// Type definitions matching the JSON structure
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

// Format date for display
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Configuration maps
const bugfixStatusConfig: Record<BugfixStatus, { label: string; colorClass: string }> = {
    investigating: { label: 'Investigating', colorClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    identified: { label: 'Identified', colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    monitoring: { label: 'Monitoring', colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    fixed: { label: 'Fixed', colorClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

const bugfixSeverityConfig: Record<BugfixSeverity, { label: string; colorClass: string }> = {
    low: { label: 'Low', colorClass: 'text-green-400' },
    medium: { label: 'Medium', colorClass: 'text-yellow-400' },
    high: { label: 'High', colorClass: 'text-orange-400' },
    critical: { label: 'Critical', colorClass: 'text-red-400' },
};

const roadmapStatusConfig: Record<RoadmapStatus, { label: string; icon: React.ReactNode; colorClass: string }> = {
    planned: { label: 'Planned', icon: <Layers className="w-4 h-4" />, colorClass: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
    in_progress: { label: 'In Progress', icon: <Zap className="w-4 h-4" />, colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    completed: { label: 'Completed', icon: <CheckCircle2 className="w-4 h-4" />, colorClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
    on_hold: { label: 'On Hold', icon: <Pause className="w-4 h-4" />, colorClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

// Section icon map
const sectionIconMap: Record<string, React.ReactNode> = {
    'new features': <Sparkles className="w-5 h-5 text-green-400" />,
    'new feature': <Sparkles className="w-5 h-5 text-green-400" />,
    'improvements': <ChevronRight className="w-5 h-5 text-cyan-400" />,
    'improvement': <ChevronRight className="w-5 h-5 text-cyan-400" />,
    'bug fixes': <Wrench className="w-5 h-5 text-blue-400" />,
    'fixes': <Wrench className="w-5 h-5 text-blue-400" />,
    'fix': <Wrench className="w-5 h-5 text-blue-400" />,
    'security': <AlertTriangle className="w-5 h-5 text-purple-400" />,
};

// Release Detail Layout
function ReleaseDetail({ update }: { update: Update }) {
    const version = update.releaseFields?.version || '';
    const releaseNotes = update.releaseFields?.releaseNotes || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Hero */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 mb-6">
                    <div className="px-4 py-2 bg-[#E8B058] text-black rounded-lg font-bold text-2xl">
                        v{version}
                    </div>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                        Released
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {update.title}
                </h1>

                <div className="flex items-center justify-center gap-2 text-white/50">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(update.publishedAt)}</span>
                </div>
            </div>

            {/* Excerpt */}
            {update.excerpt && (
                <Card variant="default" padding="lg" className="mb-8">
                    <p className="text-lg text-white/80 leading-relaxed">
                        {update.excerpt}
                    </p>
                </Card>
            )}

            {/* Release Notes Sections */}
            {releaseNotes.length > 0 && (
                <div className="space-y-8">
                    {releaseNotes.map((section) => {
                        const sectionTitle = section.title.toLowerCase();
                        const icon = sectionIconMap[sectionTitle] || <ChevronRight className="w-5 h-5 text-white/50" />;

                        return (
                            <Card key={section._key} variant="default" padding="none">
                                <div className="p-6 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        {icon}
                                        <h2 className="text-xl font-semibold text-white">
                                            {section.title}
                                        </h2>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/50">
                                            {section.items.length}
                                        </span>
                                    </div>
                                </div>
                                <ul className="p-6 space-y-3">
                                    {section.items.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <span className="text-white/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}

// Bugfix Detail Layout - Minimal, NOT blog-style
function BugfixDetail({ update }: { update: Update }) {
    const status = update.bugfixFields?.status || 'investigating';
    const severity = update.bugfixFields?.severity;
    const affectedAreas = update.bugfixFields?.affectedAreas || [];
    const statusConfig = bugfixStatusConfig[status];
    const severityConfig = severity ? bugfixSeverityConfig[severity] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
        >
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                <Bug className="w-8 h-8 text-orange-400 flex-shrink-0" />
                <div className="flex-1">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        {update.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusConfig.colorClass}`}>
                            {statusConfig.label}
                        </span>
                        {severityConfig && (
                            <span className={`text-sm font-medium ${severityConfig.colorClass}`}>
                                Severity: {severityConfig.label}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Meta Info */}
            <Card variant="default" padding="md" className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(update.publishedAt)}</span>
                    </div>
                    {affectedAreas.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {affectedAreas.map((area, idx) => (
                                <span key={idx} className="px-2 py-0.5 text-xs rounded bg-white/10 text-white/70">
                                    {area}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            {/* Excerpt */}
            {update.excerpt && (
                <Card variant="default" padding="lg">
                    <p className="text-white/80 leading-relaxed">
                        {update.excerpt}
                    </p>
                </Card>
            )}
        </motion.div>
    );
}

// Roadmap Detail Layout
function RoadmapDetail({ update }: { update: Update }) {
    const roadmapStatus = update.roadmapFields?.roadmapStatus || 'planned';
    const targetDate = update.roadmapFields?.targetDate;
    const projectedRelease = update.roadmapFields?.projectedRelease;
    const statusConfig = roadmapStatusConfig[roadmapStatus];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header with Status */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-3">
                        {update.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-white/50">
                        {targetDate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Target: {formatDate(targetDate)}</span>
                            </div>
                        )}
                        {projectedRelease && (
                            <span className="text-white/60">{projectedRelease}</span>
                        )}
                    </div>
                </div>
                <span className={`px-4 py-2 text-sm font-medium rounded-full border flex items-center gap-2 ${statusConfig.colorClass}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                </span>
            </div>

            {/* Progress Indicator */}
            <Card variant="default" padding="lg" className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {(['planned', 'in_progress', 'completed'] as RoadmapStatus[]).map((step, idx) => {
                        const stepConfig = roadmapStatusConfig[step];
                        const isActive = roadmapStatus === step;
                        const isPast = ['planned', 'in_progress', 'completed'].indexOf(roadmapStatus) > idx;

                        return (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        isActive || isPast ? 'bg-[#E8B058] text-black' : 'bg-white/10 text-white/50'
                                    }`}>
                                        {stepConfig.icon}
                                    </div>
                                    <span className={`text-xs ${isActive ? 'text-[#E8B058]' : 'text-white/50'}`}>
                                        {stepConfig.label}
                                    </span>
                                </div>
                                {idx < 2 && (
                                    <div className={`flex-1 h-0.5 mx-2 ${
                                        isPast ? 'bg-[#E8B058]' : 'bg-white/10'
                                    }`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </Card>

            {/* Description */}
            {update.excerpt && (
                <Card variant="default" padding="lg">
                    <p className="text-lg text-white/80 leading-relaxed">
                        {update.excerpt}
                    </p>
                </Card>
            )}
        </motion.div>
    );
}

// Announcement Detail Layout - Blog-style
function AnnouncementDetail({ update }: { update: Update }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            {/* Hero */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Megaphone className="w-6 h-6 text-[#E8B058]" />
                    <span className="text-sm font-medium text-white/50 uppercase tracking-wide">
                        Announcement
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    {update.title}
                </h1>

                <div className="flex items-center justify-center gap-2 text-white/50">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(update.publishedAt)}</span>
                </div>
            </div>

            {/* Excerpt / Lead */}
            {update.excerpt && (
                <div className="mb-8">
                    <p className="text-xl text-white/80 leading-relaxed">
                        {update.excerpt}
                    </p>
                </div>
            )}

            {/* Content Body - placeholder for portable text rendering */}
            <Card variant="default" padding="lg" className="prose prose-invert max-w-none">
                <p className="text-white/70 leading-relaxed">
                    Full announcement content will be rendered here when portable text is implemented.
                </p>
            </Card>
        </motion.div>
    );
}

// 404 Not Found
function UpdateNotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center py-16"
        >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-white/30" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Update Not Found</h1>
            <p className="text-white/60 mb-8">
                The update you're looking for doesn't exist or has been removed.
            </p>
            <Link
                to="/updates"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] text-black rounded-lg font-medium hover:bg-[#D4A047] transition-colors no-underline"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Updates Hub
            </Link>
        </motion.div>
    );
}

// Main Detail Page Component
function UpdateDetailContent(): JSX.Element {
    const { slug } = useParams<{ slug: string }>();
    const updates = updatesData as UpdatesArray;
    
    // Find the update by slug
    const update = updates.find(u => u.slug?.current === slug);

    if (!update) {
        return <UpdateNotFound />;
    }

    // Render type-specific layout
    const renderDetail = () => {
        switch (update.type) {
            case 'release':
                return <ReleaseDetail update={update} />;
            case 'bugfix':
                return <BugfixDetail update={update} />;
            case 'roadmap':
                return <RoadmapDetail update={update} />;
            case 'announcement':
                return <AnnouncementDetail update={update} />;
            default:
                return <UpdateNotFound />;
        }
    };

    // Type-specific config
    const typeConfig: Record<UpdateType, { label: string; icon: React.ReactNode }> = {
        release: { label: 'Release', icon: <Package className="w-4 h-4" /> },
        bugfix: { label: 'Bug Fix', icon: <Bug className="w-4 h-4" /> },
        roadmap: { label: 'Roadmap', icon: <Map className="w-4 h-4" /> },
        announcement: { label: 'Announcement', icon: <Megaphone className="w-4 h-4" /> },
    };

    const config = typeConfig[update.type];

    return (
        <main className="min-h-screen">
            <PageHeader
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Updates', href: '/updates' },
                    { label: config.label }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Link */}
                <Link
                    to="/updates"
                    className="inline-flex items-center gap-2 text-white/50 hover:text-[#E8B058] transition-colors mb-8 no-underline"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Updates Hub</span>
                </Link>

                {renderDetail()}
            </div>
        </main>
    );
}

export default function UpdateDetailPage(): JSX.Element {
    return (
        <Layout title="Update Details" description="View update details">
            <LandingPageBackground />
            <UpdateDetailContent />
        </Layout>
    );
}
