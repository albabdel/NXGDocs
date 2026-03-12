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
    PlayCircle,
    ExternalLink,
    Layers
} from 'lucide-react';
import { sprint202601AMetadata, sprint202601AStats } from '../data/sprint-2026-01-a';

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


// Current sprint - dynamically calculated from sprint data
const currentSprint: Release = {
    id: sprint202601AMetadata.id,
    title: sprint202601AMetadata.title,
    date: sprint202601AMetadata.date,
    description: sprint202601AMetadata.description,
    status: 'current',
    incrementCount: sprint202601AStats.total,
    plannedIncrements: sprint202601AStats.total // Use total items as planned increments
};

// Completed releases with completion tracking
const completedReleases: Release[] = [
    {
        id: 'sprint-2025-12-b',
        title: 'Sprint 2025.12-B',
        date: 'December 15, 2025',
        description: 'This sprint delivers significant improvements across core operational workflows, with a strong focus on healthcheck capabilities, reporting enhancements, and camera control refinements. We\'ve enhanced the Map Module, expanded reporting automation, and improved the overall user experience through better UI design and performance optimizations.',
        status: 'released',
        incrementCount: 10,
        plannedIncrements: 10,
        completionPercentage: 100
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
                                        <div className="text-2xl font-bold text-white">109+</div>
                                        <div className="text-sm text-white/60">Backlog Items</div>
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

                        <Link
                            to={`/internal-releases/${currentSprint.id}`}
                            className="group block p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 no-underline"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors">
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
                                            <span>{sprint202601AStats.total} Items</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 mb-3 text-xs text-white/50">
                                        <span>{sprint202601AStats.stories} Stories</span>
                                        <span>•</span>
                                        <span>{sprint202601AStats.tasks} Tasks</span>
                                        <span>•</span>
                                        <span>{sprint202601AStats.bugs} Bugs</span>
                                    </div>
                                    
                                    <p className="text-white/70 mb-4">
                                        {currentSprint.description}
                                    </p>

                                    <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                                        <div 
                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                            style={{ width: `${(sprint202601AStats.byStatus.done / sprint202601AStats.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-white/50">
                                        <span>Progress</span>
                                        <span>{sprint202601AStats.byStatus.done} / {sprint202601AStats.total} Complete</span>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0">
                                    <div className="p-4 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                                        <PlayCircle className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        </Link>
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

                    {/* Product Roadmap */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Target className="w-8 h-8 text-purple-400" />
                                    <h2 className="text-3xl font-bold text-white">Product Roadmap</h2>
                                </div>
                                <Link
                                    to="/roadmap"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 rounded-lg transition-all no-underline group"
                                >
                                    <span>View Full Roadmap</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                            <p className="text-white/70">
                                Explore the complete product backlog and planned features organized by epic and priority
                            </p>
                        </div>

                        <Link
                            to="/roadmap"
                            className="block p-8 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group no-underline"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                                            <Target className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                                Product Backlog & Roadmap
                                            </h3>
                                            <p className="text-white/70">
                                                Comprehensive view of all planned features, enhancements, and backlog items organized by epic
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-white/60">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>109+ Backlog Items</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4" />
                                            <span>Organized by Epic</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="p-4 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                                        <ExternalLink className="w-8 h-8" />
                                    </div>
                                </div>
                            </div>
                        </Link>
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

