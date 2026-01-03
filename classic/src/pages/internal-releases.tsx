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
    Users,
    CheckCircle2,
    FileText,
    Map,
    Target,
    TrendingUp,
    AlertCircle,
    XCircle,
    PlayCircle
} from 'lucide-react';

// Release data structure
type Release = {
    id: string;
    title: string;
    date: string;
    description: string;
    status: 'released' | 'current' | 'upcoming';
    incrementCount: number;
    plannedIncrements?: number;
    completionPercentage?: number;
    incompleteItems?: {
        title: string;
        rootCause: string;
    }[];
};

// Future sprint data structure
type FutureSprint = {
    id: string;
    title: string;
    plannedDate: string;
    plannedIncrements: {
        title: string;
        category: string;
        description: string;
    }[];
};

// Current sprint
const currentSprint: Release = {
    id: 'sprint-2026-01-a',
    title: 'Sprint 2026.01-A',
    date: 'January 1, 2026',
    description: 'Current sprint in progress - focusing on API improvements and new integrations',
    status: 'current',
    incrementCount: 6,
    plannedIncrements: 10
};

// Completed releases with completion tracking
const completedReleases: Release[] = [
    {
        id: 'sprint-2025-12-b',
        title: 'Sprint 2025.12-B',
        date: 'December 15, 2025',
        description: 'Enhanced alarm processing, improved video playback, and new device integrations',
        status: 'released',
        incrementCount: 8,
        plannedIncrements: 10,
        completionPercentage: 80,
        incompleteItems: [
            {
                title: 'Advanced Analytics Dashboard',
                rootCause: 'Dependencies on external API delayed integration testing. Moved to next sprint.'
            },
            {
                title: 'Bulk Export Feature',
                rootCause: 'Scope expansion required additional design review. Rescheduled for Sprint 2026.01-B.'
            }
        ]
    },
    {
        id: 'sprint-2025-12-a',
        title: 'Sprint 2025.12-A',
        date: 'December 1, 2025',
        description: 'Initial release with core features and foundational improvements',
        status: 'released',
        incrementCount: 12,
        plannedIncrements: 12,
        completionPercentage: 100
    }
];

// Future sprints with planned increments
const futureSprints: FutureSprint[] = [
    {
        id: 'sprint-2026-01-b',
        title: 'Sprint 2026.01-B',
        plannedDate: 'January 15, 2026',
        plannedIncrements: [
            {
                title: 'Advanced Analytics Dashboard',
                category: 'Analytics',
                description: 'Complete the analytics dashboard with real-time metrics and custom reports'
            },
            {
                title: 'Bulk Export Feature',
                category: 'Data Management',
                description: 'Implement bulk export functionality for reports and data'
            },
            {
                title: 'Enhanced Mobile App',
                category: 'Mobile',
                description: 'Improve mobile app performance and add new notification features'
            },
            {
                title: 'API Rate Limiting',
                category: 'Infrastructure',
                description: 'Implement advanced rate limiting and throttling for API endpoints'
            },
            {
                title: 'Multi-language Support',
                category: 'Internationalization',
                description: 'Add support for additional languages in the user interface'
            }
        ]
    },
    {
        id: 'sprint-2026-02-a',
        title: 'Sprint 2026.02-A',
        plannedDate: 'February 1, 2026',
        plannedIncrements: [
            {
                title: 'AI-Powered Threat Detection',
                category: 'AI/ML',
                description: 'Implement machine learning models for advanced threat detection'
            },
            {
                title: 'Enhanced Reporting System',
                category: 'Reporting',
                description: 'Redesign reporting system with customizable templates'
            },
            {
                title: 'Advanced User Permissions',
                category: 'Security',
                description: 'Implement granular permission system with role-based access control'
            }
        ]
    }
];

export default function InternalReleasesPage() {
    return (
        <Layout
            title="Internal Releases"
            description="Internal release notes and sprint documentation"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Internal Releases' }
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
                            <Package className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Internal Documentation</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Release Notes
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            Comprehensive documentation of all releases, sprints, and increments. 
                            Track development progress and feature implementations.
                        </p>
                    </motion.div>

                    {/* Roadmap Overview */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Map className="w-8 h-8 text-[#E8B058]" />
                                <h2 className="text-3xl font-bold text-white">Roadmap</h2>
                            </div>
                            <p className="text-white/70">
                                Overview of current development status and planned releases
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                                        <PlayCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">1</div>
                                        <div className="text-sm text-white/60">Current Sprint</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                                        <CheckCircle2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{completedReleases.length}</div>
                                        <div className="text-sm text-white/60">Completed</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">{futureSprints.length}</div>
                                        <div className="text-sm text-white/60">Planned</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Current Sprint */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <PlayCircle className="w-8 h-8 text-blue-400" />
                                <h2 className="text-3xl font-bold text-white">Current Sprint</h2>
                            </div>
                            <p className="text-white/70">
                                Active sprint currently in development
                            </p>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/30">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-semibold text-white">
                                            {currentSprint.title}
                                        </h3>
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                            In Progress
                                        </span>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>{currentSprint.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>{currentSprint.incrementCount} / {currentSprint.plannedIncrements} Increments</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-white/70 mb-4">
                                        {currentSprint.description}
                                    </p>

                                    <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                            style={{ width: `${(currentSprint.incrementCount / (currentSprint.plannedIncrements || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0">
                                    <div className="p-4 bg-blue-500/20 rounded-lg text-blue-400">
                                        <PlayCircle className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Completed Releases */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                                <h2 className="text-3xl font-bold text-white">Completed Releases</h2>
                            </div>
                            <p className="text-white/70">
                                Past releases with completion metrics and analysis
                            </p>
                        </div>

                        <div className="space-y-4">
                            {completedReleases.map((release, idx) => (
                                <motion.div
                                    key={release.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={`/internal-releases/${release.id}`}
                                        className="group block p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-2xl font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                        {release.title}
                                                    </h3>
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                        Released
                                                    </span>
                                                </div>
                                                
                                                <div className="flex items-center gap-4 mb-3 text-sm text-white/60">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>{release.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        <span>{release.incrementCount} / {release.plannedIncrements} Increments</span>
                                                    </div>
                                                    {release.completionPercentage !== undefined && (
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp className="w-4 h-4" />
                                                            <span>{release.completionPercentage}% Complete</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <p className="text-white/70 mb-4">
                                                    {release.description}
                                                </p>

                                                {/* Completion Progress Bar */}
                                                {release.completionPercentage !== undefined && (
                                                    <div className="mb-4">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-sm text-white/70">Completion Rate</span>
                                                            <span className="text-sm font-medium text-white">{release.completionPercentage}%</span>
                                                        </div>
                                                        <div className="w-full bg-white/10 rounded-full h-2">
                                                            <div 
                                                                className={`h-2 rounded-full transition-all ${
                                                                    release.completionPercentage === 100 
                                                                        ? 'bg-green-500' 
                                                                        : release.completionPercentage >= 80 
                                                                        ? 'bg-yellow-500' 
                                                                        : 'bg-red-500'
                                                                }`}
                                                                style={{ width: `${release.completionPercentage}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Incomplete Items */}
                                                {release.incompleteItems && release.incompleteItems.length > 0 && (
                                                    <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <AlertCircle className="w-5 h-5 text-yellow-400" />
                                                            <h4 className="text-sm font-semibold text-yellow-400">
                                                                Incomplete Items ({release.incompleteItems.length})
                                                            </h4>
                                                        </div>
                                                        <div className="space-y-3">
                                                            {release.incompleteItems.map((item, i) => (
                                                                <div key={i} className="text-sm">
                                                                    <div className="flex items-start gap-2 mb-1">
                                                                        <XCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                                                        <span className="text-white/90 font-medium">{item.title}</span>
                                                                    </div>
                                                                    <div className="ml-6 text-white/70">
                                                                        <span className="text-xs text-white/60">Root Cause: </span>
                                                                        {item.rootCause}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-2 text-[#E8B058] text-sm font-medium group-hover:gap-3 transition-all">
                                                    <span>View Details</span>
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
                            ))}
                        </div>
                    </motion.section>

                    {/* Future Sprints */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <Target className="w-8 h-8 text-purple-400" />
                                <h2 className="text-3xl font-bold text-white">Future Sprints</h2>
                            </div>
                            <p className="text-white/70">
                                Planned sprints with scheduled increments and target dates
                            </p>
                        </div>

                        <div className="space-y-6">
                            {futureSprints.map((sprint, idx) => (
                                <motion.div
                                    key={sprint.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-[#202020] rounded-xl border border-white/10"
                                >
                                    <div className="flex items-start justify-between gap-4 mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-2xl font-semibold text-white">
                                                    {sprint.title}
                                                </h3>
                                                <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                    Planned
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-white/60">
                                                <Calendar className="w-4 h-4" />
                                                <span>Target Date: {sprint.plannedDate}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white">{sprint.plannedIncrements.length}</div>
                                            <div className="text-sm text-white/60">Planned Increments</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sprint.plannedIncrements.map((increment, i) => (
                                            <div
                                                key={i}
                                                className="p-4 bg-white/5 rounded-lg border border-white/5"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 flex-shrink-0">
                                                        <Target className="w-4 h-4" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs text-purple-400 mb-1">{increment.category}</div>
                                                        <h4 className="text-sm font-semibold text-white mb-1">{increment.title}</h4>
                                                        <p className="text-xs text-white/60">{increment.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                We release two sprints per month, typically on the 1st and 15th of each month.
                                Each release includes detailed documentation of all increments with screenshots and videos.
                            </p>
                            <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>Bi-weekly releases</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>Internal team access</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}

