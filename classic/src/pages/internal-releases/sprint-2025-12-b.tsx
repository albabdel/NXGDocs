import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground/LandingPageBackground';
import {
    Calendar,
    Package,
    ArrowLeft,
    Clock,
    CheckCircle2,
    Image as ImageIcon,
    Video,
    FileText,
    Code,
    Settings,
    Zap,
    Shield,
    Camera,
    Bell,
    Users
} from 'lucide-react';

// Increment data structure
type Increment = {
    id: string;
    title: string;
    description: string;
    category: string;
    images?: string[];
    videos?: string[];
    status: 'completed' | 'in-progress';
};

// Mock increment data for Sprint 2025.12-B
const increments: Increment[] = [
    {
        id: 'inc-001',
        title: 'Enhanced Alarm Processing Engine',
        description: 'Improved alarm processing performance with optimized queue management and faster response times. Added support for batch processing and priority-based handling.',
        category: 'Core Features',
        images: [
            '/img/dashboard-talos-alarms.svg',
            '/img/feature-ai-analytics-config.svg'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-002',
        title: 'Video Playback Improvements',
        description: 'Enhanced video playback with better buffering, improved seek functionality, and support for multiple video formats. Added timeline scrubbing and frame-by-frame navigation.',
        category: 'Video Features',
        images: [
            '/img/feature-playback.svg',
            '/img/feature-live-view.svg'
        ],
        videos: [
            '/videos/platform-walkthrough.mp4'
        ],
        status: 'completed'
    },
    {
        id: 'inc-003',
        title: 'New Device Integration: Hikvision Advanced',
        description: 'Added advanced integration support for Hikvision devices with enhanced PTZ control, event subscription, and improved video streaming quality.',
        category: 'Device Integration',
        images: [
            '/img/device-hikvision-dashboard.svg'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-004',
        title: 'User Management Enhancements',
        description: 'Improved user management interface with better role assignment, permission management, and audit logging. Added bulk user operations and improved search functionality.',
        category: 'User Management',
        images: [
            '/img/dashboard-analytics.svg'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-005',
        title: 'Real-time Dashboard Updates',
        description: 'Implemented real-time dashboard updates using WebSocket connections. Added live status indicators and automatic refresh for device health monitoring.',
        category: 'Dashboard',
        images: [
            '/img/dashboard-gcxone-main.svg',
            '/img/dashboard-reports.svg'
        ],
        videos: [
            '/videos/dashboard-deep-dive.mp4'
        ],
        status: 'completed'
    },
    {
        id: 'inc-006',
        title: 'Security Improvements',
        description: 'Enhanced security with improved authentication mechanisms, session management, and API rate limiting. Added support for multi-factor authentication.',
        category: 'Security',
        images: [],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-007',
        title: 'Performance Optimization',
        description: 'Optimized database queries and improved caching strategies. Reduced page load times by 40% and improved overall system responsiveness.',
        category: 'Performance',
        images: [],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-008',
        title: 'Mobile Tower Configuration UI',
        description: 'Redesigned mobile tower configuration interface with improved validation, better error handling, and enhanced user experience.',
        category: 'Towers',
        images: [
            '/img/device-adpro-setup.svg'
        ],
        videos: [
            '/videos/add-and-configure-mobile-tower.mp4'
        ],
        status: 'completed'
    }
];

// Group increments by category
const groupedIncrements = increments.reduce((acc, increment) => {
    if (!acc[increment.category]) {
        acc[increment.category] = [];
    }
    acc[increment.category].push(increment);
    return acc;
}, {} as Record<string, Increment[]>);

export default function Sprint202512BPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <Layout
            title="Sprint 2025.12-B - Internal Releases"
            description="Detailed release notes for Sprint 2025.12-B"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Internal Releases', href: '/internal-releases' },
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
                            to="/internal-releases"
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
                            <Package className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Sprint Release</span>
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
                                <span>{increments.length} Increments</span>
                            </div>
                        </div>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            This release includes significant improvements to alarm processing, video playback, 
                            device integrations, and overall system performance.
                        </p>
                    </motion.div>

                    {/* Increments by Category */}
                    {Object.entries(groupedIncrements).map(([category, categoryIncrements], categoryIdx) => (
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
                                    {categoryIncrements.length} {categoryIncrements.length === 1 ? 'increment' : 'increments'}
                                </p>
                            </div>

                            <div className="space-y-8">
                                {categoryIncrements.map((increment, idx) => (
                                    <motion.div
                                        key={increment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-8 bg-[#202020] rounded-xl border border-white/10"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] flex-shrink-0">
                                                {increment.category === 'Core Features' && <Zap className="w-6 h-6" />}
                                                {increment.category === 'Video Features' && <Video className="w-6 h-6" />}
                                                {increment.category === 'Device Integration' && <Camera className="w-6 h-6" />}
                                                {increment.category === 'User Management' && <Users className="w-6 h-6" />}
                                                {increment.category === 'Dashboard' && <Settings className="w-6 h-6" />}
                                                {increment.category === 'Security' && <Shield className="w-6 h-6" />}
                                                {increment.category === 'Performance' && <Zap className="w-6 h-6" />}
                                                {increment.category === 'Towers' && <Bell className="w-6 h-6" />}
                                                {!['Core Features', 'Video Features', 'Device Integration', 'User Management', 'Dashboard', 'Security', 'Performance', 'Towers'].includes(increment.category) && <FileText className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-semibold text-white">
                                                        {increment.title}
                                                    </h3>
                                                    {increment.status === 'completed' && (
                                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                                                            Completed
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-white/70 leading-relaxed mb-6">
                                                    {increment.description}
                                                </p>

                                                {/* Images */}
                                                {increment.images && increment.images.length > 0 && (
                                                    <div className="mb-6">
                                                        <div className="flex items-center gap-2 mb-4 text-white/60">
                                                            <ImageIcon className="w-5 h-5" />
                                                            <span className="text-sm font-medium">Screenshots</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {increment.images.map((image, imgIdx) => (
                                                                <div
                                                                    key={imgIdx}
                                                                    className="relative group cursor-pointer"
                                                                    onClick={() => setSelectedImage(image)}
                                                                >
                                                                    <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-white/10 hover:border-[#E8B058]/50 transition-all">
                                                                        <img
                                                                            src={image}
                                                                            alt={`${increment.title} - Screenshot ${imgIdx + 1}`}
                                                                            className="w-full h-full object-contain"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                <ImageIcon className="w-8 h-8 text-white" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Videos */}
                                                {increment.videos && increment.videos.length > 0 && (
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-4 text-white/60">
                                                            <Video className="w-5 h-5" />
                                                            <span className="text-sm font-medium">Videos</span>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {increment.videos.map((video, vidIdx) => (
                                                                <div
                                                                    key={vidIdx}
                                                                    className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-white/10"
                                                                >
                                                                    <video
                                                                        controls
                                                                        className="w-full h-full object-contain"
                                                                        style={{
                                                                            maxWidth: '100%',
                                                                            borderRadius: '8px'
                                                                        }}
                                                                    >
                                                                        <source src={video} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
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
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">{increments.length}</div>
                                <div className="text-white/70">Total Increments</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">
                                    {increments.filter(i => i.status === 'completed').length}
                                </div>
                                <div className="text-white/70">Completed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">
                                    {Object.keys(groupedIncrements).length}
                                </div>
                                <div className="text-white/70">Categories</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Image Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-7xl max-h-full">
                            <img
                                src={selectedImage}
                                alt="Full size screenshot"
                                className="max-w-full max-h-[90vh] object-contain"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
}

