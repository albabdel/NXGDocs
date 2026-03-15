import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../components/PageHeader';
import LandingPageBackground from '../components/LandingPageBackground/LandingPageBackground';
import {
    Calendar,
    Package,
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Video,
    Camera,
    BookOpen
} from 'lucide-react';

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

// Change type badge configuration
const changeTypeConfig: Record<string, { label: string; bgClass: string; textClass: string; icon?: React.ReactNode }> = {
    feature: { label: 'New Feature', bgClass: 'bg-green-500/20', textClass: 'text-green-400 border-green-500/30', icon: <Sparkles className="w-5 h-5" /> },
    fix: { label: 'Bug Fix', bgClass: 'bg-blue-500/20', textClass: 'text-blue-400 border-blue-500/30' },
    improvement: { label: 'Improvement', bgClass: 'bg-yellow-500/20', textClass: 'text-yellow-400 border-yellow-500/30' },
    breaking: { label: 'Breaking Change', bgClass: 'bg-red-500/20', textClass: 'text-red-400 border-red-500/30' },
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

// Extract video embed URL from various formats
function getVideoEmbedUrl(url: string): string | null {
    if (!url) return null;
    
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    
    // If already an embed URL, return as-is
    if (url.includes('embed')) return url;
    
    return null;
}

interface Props {
    releaseData: Release;
}

export default function ReleaseDetailRenderer({ releaseData: release }: Props) {
    if (!release) {
        return (
            <Layout title="Release Not Found">
                <LandingPageBackground />
                <main className="min-h-screen">
                    <PageHeader 
                        breadcrumbs={[
                            { label: 'Home', href: '/' },
                            { label: 'Releases', href: '/releases' },
                            { label: 'Not Found' }
                        ]}
                    />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <Package className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-white mb-4">Release Not Found</h1>
                        <p className="text-white/60 mb-8">
                            The release you're looking for doesn't exist or has been removed.
                        </p>
                        <Link
                            to="/releases"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] text-black font-semibold rounded-lg hover:bg-[#E8B058]/90 transition-colors no-underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Releases
                        </Link>
                    </div>
                </main>
            </Layout>
        );
    }

    return (
        <Layout
            title={`${release.displayTitle} Release Notes`}
            description={release.summary || `Latest features and improvements in ${release.displayTitle}`}
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Releases', href: '/releases' },
                        { label: release.displayTitle }
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
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Release Notes</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            {release.displayTitle}
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/70 mb-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{formatDate(release.publishedAt)}</span>
                            </div>
                            {release.sprintId && (
                                <div className="flex items-center gap-2 text-white/40">
                                    <span>•</span>
                                    <span>{release.sprintId}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-400" />
                                <span>Released</span>
                            </div>
                        </div>
                        {release.summary && (
                            <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                                {release.summary}
                            </p>
                        )}
                    </motion.div>

                    {/* Items List */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-16"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">What's Changed</h2>
                            <p className="text-white/60">
                                {release.items.length} {release.items.length === 1 ? 'item' : 'items'} in this release
                            </p>
                        </div>

                        <div className="space-y-6">
                            {release.items.map((item, idx) => {
                                const typeConfig = item.changeType ? changeTypeConfig[item.changeType] : null;
                                const videoEmbedUrl = item.videoUrl ? getVideoEmbedUrl(item.videoUrl) : null;

                                return (
                                    <motion.div
                                        key={item._key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        className="p-6 bg-[#202020] rounded-xl border border-white/10"
                                    >
                                        {/* Item Header */}
                                        <div className="flex items-start gap-4 mb-4">
                                            {typeConfig && (
                                                <div className={`p-3 rounded-lg flex-shrink-0 ${typeConfig.bgClass}`}>
                                                    {typeConfig.icon || <CheckCircle2 className={`w-5 h-5 ${typeConfig.textClass.split(' ')[0]}`} />}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                    <h3 className="text-xl font-semibold text-white">
                                                        {item.title}
                                                    </h3>
                                                    {typeConfig && (
                                                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${typeConfig.bgClass} ${typeConfig.textClass}`}>
                                                            {typeConfig.label}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {item.description && (
                                            <p className="text-white/70 leading-relaxed mb-4 ml-14">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Screenshot */}
                                        {item.screenshotUrl && (
                                            <div className="mb-4 ml-14">
                                                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                                                    <Camera className="w-4 h-4" />
                                                    <span>Screenshot</span>
                                                </div>
                                                <img
                                                    src={item.screenshotUrl}
                                                    alt={item.title}
                                                    className="rounded-lg border border-white/10 max-w-full"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}

                                        {/* Video Embed */}
                                        {videoEmbedUrl && (
                                            <div className="mb-4 ml-14">
                                                <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
                                                    <Video className="w-4 h-4" />
                                                    <span>Video Demo</span>
                                                </div>
                                                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10">
                                                    <iframe
                                                        src={videoEmbedUrl}
                                                        className="absolute inset-0 w-full h-full"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Affected Areas Tags + Article Link */}
                                        <div className="flex items-center justify-between gap-4 ml-14 flex-wrap">
                                            {item.affectedAreas && item.affectedAreas.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.affectedAreas.map(area => (
                                                        <span
                                                            key={area}
                                                            className="px-2 py-1 text-xs rounded-full bg-white/10 text-white/70"
                                                        >
                                                            {area}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            {item.articleUrl && (
                                                <Link
                                                    to={item.articleUrl}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#E8B058]/10 border border-[#E8B058]/30 text-[#E8B058] hover:bg-[#E8B058]/20 transition-colors no-underline flex-shrink-0"
                                                >
                                                    <BookOpen className="w-3.5 h-3.5" />
                                                    <span>Full Article</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.section>

                    {/* Summary Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="p-8 bg-gradient-to-br from-[#202020] to-[#1a1a1a] rounded-xl border border-white/10"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Release Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">{release.items.length}</div>
                                <div className="text-white/70 text-sm">Total Items</div>
                            </div>
                            {Object.entries(
                                release.items.reduce((acc, item) => {
                                    if (item.changeType) {
                                        acc[item.changeType] = (acc[item.changeType] || 0) + 1;
                                    }
                                    return acc;
                                }, {} as Record<string, number>)
                            ).slice(0, 3).map(([type, count]) => {
                                const config = changeTypeConfig[type];
                                return (
                                    <div key={type} className="text-center">
                                        <div className="text-3xl font-bold text-[#E8B058] mb-2">{count}</div>
                                        <div className="text-white/70 text-sm">{config?.label || type}s</div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
