import React from 'react';
import Link from '@docusaurus/Link';
import { motion } from 'framer-motion';
import {
    Package,
    Bug,
    Map,
    Megaphone,
    CheckCircle2,
    Clock,
    Zap,
    AlertTriangle,
    Calendar,
    ArrowRight,
    Layers,
    Pause,
} from 'lucide-react';

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

interface UpdateCardProps {
    update: Update;
    index?: number;
    className?: string;
}

// Format date for display
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Bugfix status configuration
const bugfixStatusConfig: Record<BugfixStatus, { label: string; colorClass: string }> = {
    investigating: { label: 'Investigating', colorClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    identified: { label: 'Identified', colorClass: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    monitoring: { label: 'Monitoring', colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    fixed: { label: 'Fixed', colorClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
};

// Bugfix severity configuration
const bugfixSeverityConfig: Record<BugfixSeverity, { label: string; dotClass: string }> = {
    low: { label: 'Low', dotClass: 'bg-green-400' },
    medium: { label: 'Medium', dotClass: 'bg-yellow-400' },
    high: { label: 'High', dotClass: 'bg-orange-400' },
    critical: { label: 'Critical', dotClass: 'bg-red-500 animate-pulse' },
};

// Roadmap status configuration
const roadmapStatusConfig: Record<RoadmapStatus, { label: string; icon: React.ReactNode; colorClass: string }> = {
    planned: { label: 'Planned', icon: <Layers className="w-3 h-3" />, colorClass: 'bg-gray-500/20 text-gray-300 border-gray-500/30' },
    in_progress: { label: 'In Progress', icon: <Zap className="w-3 h-3" />, colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    completed: { label: 'Completed', icon: <CheckCircle2 className="w-3 h-3" />, colorClass: 'bg-green-500/20 text-green-400 border-green-500/30' },
    on_hold: { label: 'On Hold', icon: <Pause className="w-3 h-3" />, colorClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
};

// Release Card - Full card with version prominently displayed
function ReleaseCard({ update, index = 0 }: { update: Update; index?: number }) {
    const version = update.releaseFields?.version || '';
    const releaseNotes = update.releaseFields?.releaseNotes || [];
    
    // Count items in each section
    const sectionCounts = releaseNotes.reduce((acc, section) => {
        const title = (section.title || '').toLowerCase();
        if (title.includes('new') || title.includes('feature')) {
            acc.new = (acc.new || 0) + section.items.length;
        } else if (title.includes('improve') || title.includes('enhance')) {
            acc.improvements = (acc.improvements || 0) + section.items.length;
        } else if (title.includes('fix') || title.includes('bug')) {
            acc.fixes = (acc.fixes || 0) + section.items.length;
        } else {
            acc.other = (acc.other || 0) + section.items.length;
        }
        return acc;
    }, {} as Record<string, number>);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                to={`/updates/${update.slug.current}`}
                className="block group p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
            >
                <div className="flex items-start gap-4">
                    {/* Version Badge */}
                    <div className="flex-shrink-0">
                        <div className="px-4 py-2 bg-[#E8B058] text-black rounded-lg font-bold text-lg">
                            v{version}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-5 h-5 text-[#E8B058]" />
                            <span className="text-xs font-medium text-white/50 uppercase tracking-wide">
                                Release
                            </span>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-white group-hover:text-[#E8B058] transition-colors mb-2">
                            {update.title}
                        </h3>

                        {update.excerpt && (
                            <p className="text-white/60 text-sm mb-3 line-clamp-2">
                                {update.excerpt}
                            </p>
                        )}

                        {/* Section Counts */}
                        <div className="flex flex-wrap gap-3 mb-3">
                            {sectionCounts.new > 0 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                    {sectionCounts.new} new
                                </span>
                            )}
                            {sectionCounts.improvements > 0 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                    {sectionCounts.improvements} improvements
                                </span>
                            )}
                            {sectionCounts.fixes > 0 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                    {sectionCounts.fixes} fixes
                                </span>
                            )}
                            {sectionCounts.other > 0 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70 border border-white/10">
                                    +{sectionCounts.other} more
                                </span>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-white/40">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(update.publishedAt)}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 text-[#E8B058] text-sm font-medium group-hover:gap-2 transition-all">
                                View details
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Bugfix Card - Minimal, compact, NOT blog-style
function BugfixCard({ update, index = 0 }: { update: Update; index?: number }) {
    const status = update.bugfixFields?.status || 'investigating';
    const severity = update.bugfixFields?.severity;
    const statusConfig = bugfixStatusConfig[status];
    const severityConfig = severity ? bugfixSeverityConfig[severity] : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                to={`/updates/${update.slug.current}`}
                className="block group p-4 bg-[#202020] rounded-lg border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 no-underline"
            >
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Bug className="w-5 h-5 text-orange-400 flex-shrink-0" />
                        
                        <h3 className="text-base font-medium text-white group-hover:text-[#E8B058] transition-colors truncate">
                            {update.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Severity Dot */}
                        {severityConfig && (
                            <div className="flex items-center gap-1.5" title={`Severity: ${severityConfig.label}`}>
                                <div className={`w-2 h-2 rounded-full ${severityConfig.dotClass}`} />
                            </div>
                        )}

                        {/* Status Badge */}
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.colorClass}`}>
                            {statusConfig.label}
                        </span>

                        <span className="text-xs text-white/40">
                            {formatDate(update.publishedAt)}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Roadmap Card - Progress tracking feel
function RoadmapCard({ update, index = 0 }: { update: Update; index?: number }) {
    const roadmapStatus = update.roadmapFields?.roadmapStatus || 'planned';
    const targetDate = update.roadmapFields?.targetDate;
    const projectedRelease = update.roadmapFields?.projectedRelease;
    const statusConfig = roadmapStatusConfig[roadmapStatus];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                to={`/updates/${update.slug.current}`}
                className="block group p-5 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 no-underline"
            >
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-[#E8B058]" />
                        <span className="text-xs font-medium text-white/50 uppercase tracking-wide">
                            Roadmap
                        </span>
                    </div>
                    
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 ${statusConfig.colorClass}`}>
                        {statusConfig.icon}
                        {statusConfig.label}
                    </span>
                </div>

                <h3 className="text-lg font-semibold text-white group-hover:text-[#E8B058] transition-colors mb-2">
                    {update.title}
                </h3>

                {update.excerpt && (
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">
                        {update.excerpt}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-white/40">
                        {targetDate && (
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Target: {formatDate(targetDate)}</span>
                            </div>
                        )}
                        {projectedRelease && !targetDate && (
                            <span className="text-white/50">{projectedRelease}</span>
                        )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#E8B058] text-sm font-medium group-hover:gap-2 transition-all">
                        Learn more
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

// Announcement Card - Blog-style title + excerpt
function AnnouncementCard({ update, index = 0 }: { update: Update; index?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
        >
            <Link
                to={`/updates/${update.slug.current}`}
                className="block group p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
            >
                <div className="flex items-center gap-2 mb-3">
                    <Megaphone className="w-5 h-5 text-[#E8B058]" />
                    <span className="text-xs font-medium text-white/50 uppercase tracking-wide">
                        Announcement
                    </span>
                </div>

                <h3 className="text-2xl font-semibold text-white group-hover:text-[#E8B058] transition-colors mb-3">
                    {update.title}
                </h3>

                {update.excerpt && (
                    <p className="text-white/70 leading-relaxed mb-4">
                        {update.excerpt}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-white/40">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(update.publishedAt)}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[#E8B058] text-sm font-medium group-hover:gap-2 transition-all">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

// Main UpdateCard component - switches on update.type
export function UpdateCard({ update, index = 0, className = '' }: UpdateCardProps) {
    switch (update.type) {
        case 'release':
            return <ReleaseCard update={update} index={index} />;
        case 'bugfix':
            return <BugfixCard update={update} index={index} />;
        case 'roadmap':
            return <RoadmapCard update={update} index={index} />;
        case 'announcement':
            return <AnnouncementCard update={update} index={index} />;
        default:
            return (
                <div className={`p-4 bg-white/5 rounded-lg ${className}`}>
                    <p className="text-white/50">Unknown update type: {update.type}</p>
                </div>
            );
    }
}
