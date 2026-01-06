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
    Users,
    Map,
    Activity,
    BarChart3
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

// Sprint 2025.12-A increment data
const increments: Increment[] = [
    // Core Features - Salvo + Alarm control parity
    {
        id: 'inc-001',
        title: 'Salvo Operator Controls',
        description: 'Operators can isolate cameras, trigger IOs, control PTZ, and share events directly from Salvo.',
        category: 'Core Features',
        images: [
            '/img/sprint-2025-12-a/IO 1.png',
            '/img/sprint-2025-12-a/IO 2.png'
        ],
        videos: [
            '/videos/sprint-2025-12-a/Salvo%20Operator%20Controls.mp4',
            '/videos/sprint-2025-12-a/Salvo%20share.mp4'
        ],
        status: 'completed'
    },
    {
        id: 'inc-002',
        title: 'Salvo View Layout Improvements',
        description: 'Quad view customization and priority handling improve operational speed.',
        category: 'Core Features',
        images: [],
        videos: [
            '/videos/sprint-2025-12-a/Salvo%20view%20enhancements.mp4'
        ],
        status: 'completed'
    },
    // Video Features - Playback and Salvo view changes
    {
        id: 'inc-003',
        title: 'Salvo Video View Refactor',
        description: 'Improved layout and interaction model for video monitoring.',
        category: 'Video Features',
        images: [],
        videos: [
            '/videos/sprint-2025-12-a/2025-04-23%2009-24-05.mp4'
        ],
        status: 'completed'
    },
    {
        id: 'inc-004',
        title: 'Full Image Preview',
        description: 'Full-frame image display in preview for faster validation.',
        category: 'Video Features',
        images: [
            '/img/sprint-2025-12-a/Full Image Preview 1.png',
            '/img/sprint-2025-12-a/Full Image Preview 2.png'
        ],
        videos: [],
        status: 'completed'
    },
    // Map Module Improvements - Navigation and usability parity
    {
        id: 'inc-005',
        title: 'Map Navigation and Search',
        description: 'Breadcrumb search and surroundings view improve site navigation.',
        category: 'Map Module Improvements',
        images: [],
        videos: [
            '/videos/sprint-2025-12-a/Map%20Navigation%20and%20Search.mp4'
        ],
        status: 'completed'
    },
    {
        id: 'inc-006',
        title: 'Tower and Device Management',
        description: 'Enhanced tower visibility, sub-camera toggles, and inline editing.',
        category: 'Map Module Improvements',
        images: [
            '/img/sprint-2025-12-a/Screenshot 2026-01-05 233502.png'
        ],
        videos: [],
        status: 'completed'
    },
    // Healthcheck & Reporting - Dashboard, performance, reports
    {
        id: 'inc-007',
        title: 'Healthcheck Dashboard Improvements',
        description: 'UI refactor, performance improvements, and integration updates.',
        category: 'Healthcheck & Reporting',
        images: [
            '/img/sprint-2025-12-a/Screenshot 2026-01-05 231442.png',
            '/img/sprint-2025-12-a/Screenshot 2026-01-05 233356.png'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-008',
        title: 'Reporting Structure and Localization',
        description: 'Updated report structure with German language support.',
        category: 'Healthcheck & Reporting',
        images: [
            '/img/sprint-2025-12-a/Customer success report 1.png',
            '/img/sprint-2025-12-a/Customer success report 2.png',
            '/img/sprint-2025-12-a/Customer success report 3.png',
            '/img/sprint-2025-12-a/localization_DE 1.png',
            '/img/sprint-2025-12-a/localization_DE 2.png'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-009',
        title: 'Automated Reports',
        description: 'Reports can now be scheduled and sent automatically.',
        category: 'Healthcheck & Reporting',
        images: [],
        videos: [
            '/videos/sprint-2025-12-a/Automated%20Reports.mp4'
        ],
        status: 'completed'
    },
    // Security and Analysis - Nova99x
    {
        id: 'inc-010',
        title: 'Security Analysis Enhancements',
        description: 'Improved analysis accuracy using Nova99x.',
        category: 'Security and Analysis',
        images: [
            '/img/sprint-2025-12-a/Low light threshhold.png'
        ],
        videos: [],
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
            title="Sprint 2025.12-A - Internal Releases"
            description="Detailed release notes for Sprint 2025.12-A"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Internal Releases', href: '/internal-releases' },
                        { label: 'Sprint 2025.12-A' }
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
                            Sprint 2025.12-A
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/70 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>December 1, 2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>{increments.length} Features</span>
                            </div>
                        </div>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            This sprint focuses on stabilizing the Map Module, enhancing the Healthcheck Dashboard, 
                            and refining camera operation controls. The team is balancing backend refactoring with critical UI improvements.
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
                                    {categoryIncrements.length} {categoryIncrements.length === 1 ? 'feature' : 'features'}
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
                                                {increment.category === 'Map Module Improvements' && <Map className="w-6 h-6" />}
                                                {increment.category === 'Healthcheck & Reporting' && <Activity className="w-6 h-6" />}
                                                {increment.category === 'Security and Analysis' && <Shield className="w-6 h-6" />}
                                                {!['Core Features', 'Video Features', 'Map Module Improvements', 'Healthcheck & Reporting', 'Security and Analysis'].includes(increment.category) && <FileText className="w-6 h-6" />}
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
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">6</div>
                                <div className="text-white/70">Core Capability Updates</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">12+</div>
                                <div className="text-white/70">Usability and UI Improvements</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">5</div>
                                <div className="text-white/70">Reporting and Automation Updates</div>
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

