import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground/LandingPageBackground';
import { CloudinaryVideo } from '../../components/CloudinaryVideo';
import { CloudinaryImage } from '../../components/CloudinaryImage';
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
    BarChart3,
    X,
    Maximize2,
    Share2,
    Filter
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
            'IO_1_a1aguq',
            'IO_2_p83hxh'
        ],
        videos: [
            'Salvo_Operator_Controls_fifx9q',
            'Salvo_share_pianax'
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
            'Salvo_view_enhancements_anhoe6'
        ],
        status: 'completed'
    },
    // Video Features - Playback and Salvo view changes
    {
        id: 'inc-004',
        title: 'Full Image Preview',
        description: 'Full-frame image display in preview for faster validation.',
        category: 'Video Features',
        images: [
            'Full_Image_Preview_1_iwt5yo',
            'Full_Image_Preview_2_rm0mfb'
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
            'Map_Navigation_and_Search_cudtfn'
        ],
        status: 'completed'
    },
    {
        id: 'inc-006',
        title: 'Tower and Device Management',
        description: 'Enhanced tower visibility, sub-camera toggles, and inline editing.',
        category: 'Map Module Improvements',
        images: [
            'Screenshot_2026-01-05_233356_ncrnna',
            'Screenshot_2026-01-05_233502_ghibuc'
        ],
        videos: [],
        status: 'completed'
    },
    // Healthcheck & Reporting - Dashboard, performance, reports
    {
        id: 'inc-007',
        title: 'Healthcheck Dashboard Improvements',
        description: 'UI refactor, performance improvements, and integration updates. The dashboard now provides better visibility into healthcheck operations with improved filtering and status tracking.',
        category: 'Healthcheck & Reporting',
        images: [],
        videos: [
            'HealthCheck_Dashboard_t07ur9'
        ],
        status: 'completed'
    },
    {
        id: 'inc-008',
        title: 'New Report Structure',
        description: 'Updated report structure with improved layout, larger images, and better organization. Reports now provide clearer insights with enhanced visual presentation and data organization.',
        category: 'Healthcheck & Reporting',
        images: [
            'Customer_success_report_1_lcezop',
            'Customer_success_report_2_qbnwgk',
            'Customer_success_report_3_kbu68h'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-008b',
        title: 'Report Localization',
        description: 'Healthcheck reports now support localization. When users change the language in GCXONE, the healthcheck reports will automatically display in that language. Currently supports German (DE) with more languages coming soon.',
        category: 'Healthcheck & Reporting',
        images: [
            'localization_DE_1_jjkcuv',
            'localization_DE_2_d2homi'
        ],
        videos: [],
        status: 'completed'
    },
    {
        id: 'inc-009',
        title: 'Automated Reports',
        description: 'Reports can now be scheduled and sent automatically. Configure report schedules to automatically generate and deliver healthcheck reports to specified recipients.',
        category: 'Healthcheck & Reporting',
        images: [],
        videos: [
            'Automated_Reports_nctikh'
        ],
        status: 'completed'
    },
    {
        id: 'inc-010',
        title: 'Lowlight Threshold Configuration',
        description: 'Customers can now modify the lowlight threshold settings for healthcheck operations. This allows fine-tuning of detection sensitivity for low-light conditions, improving accuracy and reducing false positives.',
        category: 'Healthcheck & Reporting',
        images: [
            'Low_light_threshhold_wv5b5r'
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
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Get unique categories for filtering
    const categories = Array.from(new Set(increments.map(inc => inc.category)));

    // Filter increments by category
    const filteredIncrements = selectedCategory
        ? increments.filter(inc => inc.category === selectedCategory)
        : increments;

    const filteredGroupedIncrements = filteredIncrements.reduce((acc, increment) => {
        if (!acc[increment.category]) {
            acc[increment.category] = [];
        }
        acc[increment.category].push(increment);
        return acc;
    }, {} as Record<string, Increment[]>);

    // Handle keyboard navigation for image modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedImage) {
                setSelectedImage(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedImage]);

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
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-6">
                            This sprint delivers significant improvements across core operational workflows, with a strong focus on 
                            healthcheck capabilities, reporting enhancements, and camera control refinements. We've enhanced the 
                            Map Module, expanded reporting automation, and improved the overall user experience through better 
                            UI design and performance optimizations.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                            <span className="px-3 py-1 bg-white/5 rounded-full text-white/60">12 Features</span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-white/60">5 Categories</span>
                            <span className="px-3 py-1 bg-white/5 rounded-full text-white/60">100% Completed</span>
                        </div>
                    </motion.div>

                    {/* Category Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Filter className="w-5 h-5 text-white/60" />
                            <span className="text-sm font-medium text-white/60">Filter by category:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedCategory === null
                                        ? 'bg-[#E8B058] text-black'
                                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        selectedCategory === category
                                            ? 'bg-[#E8B058] text-black'
                                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Increments by Category */}
                    {Object.entries(filteredGroupedIncrements).map(([category, categoryIncrements], categoryIdx) => (
                        <motion.section
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: categoryIdx * 0.1 }}
                            viewport={{ once: true }}
                            className="mb-16"
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">{category}</h2>
                                    <p className="text-white/60">
                                        {categoryIncrements.length} {categoryIncrements.length === 1 ? 'feature' : 'features'}
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                                    {category === 'Core Features' && <Zap className="w-5 h-5 text-[#E8B058]" />}
                                    {category === 'Video Features' && <Video className="w-5 h-5 text-[#E8B058]" />}
                                    {category === 'Map Module Improvements' && <Map className="w-5 h-5 text-[#E8B058]" />}
                                    {category === 'Healthcheck & Reporting' && <Activity className="w-5 h-5 text-[#E8B058]" />}
                                    {category === 'Security and Analysis' && <Shield className="w-5 h-5 text-[#E8B058]" />}
                                </div>
                            </div>

                            <div className="space-y-8">
                                {categoryIncrements.map((increment, idx) => (
                                    <motion.div
                                        key={increment.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                                        viewport={{ once: true }}
                                        className="p-8 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/30 hover:shadow-lg hover:shadow-[#E8B058]/5 transition-all duration-300"
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
                                                <p className="text-white/70 leading-relaxed mb-6 text-base">
                                                    {increment.description}
                                                </p>
                                                
                                                {/* Feature tags */}
                                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                                    {increment.images && increment.images.length > 0 && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                            {increment.images.length} {increment.images.length === 1 ? 'Screenshot' : 'Screenshots'}
                                                        </span>
                                                    )}
                                                    {increment.videos && increment.videos.length > 0 && (
                                                        <span className="px-2 py-1 text-xs font-medium rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                                            {increment.videos.length} {increment.videos.length === 1 ? 'Video' : 'Videos'}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Images */}
                                                {increment.images && increment.images.length > 0 && (
                                                    <div className="mb-6">
                                                        <div className="flex items-center gap-2 mb-4 text-white/60">
                                                            <ImageIcon className="w-5 h-5" />
                                                            <span className="text-sm font-medium">Screenshots</span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {increment.images.map((image, imgIdx) => {
                                                                // Check if image is a Cloudinary public ID (no http/https, no file extension)
                                                                const isCloudinaryImage = image && !image.startsWith('http') && !image.includes('/') && !image.includes('.');
                                                                
                                                                return (
                                                                    <div
                                                                        key={imgIdx}
                                                                        className="relative group cursor-pointer"
                                                                        onClick={() => setSelectedImage(image)}
                                                                    >
                                                                        <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden border border-white/10 hover:border-[#E8B058]/50 transition-all group/image">
                                                                            {isCloudinaryImage ? (
                                                                                <CloudinaryImage
                                                                                    publicId={image}
                                                                                    alt={`${increment.title} - Screenshot ${imgIdx + 1}`}
                                                                                    className="w-full h-full object-contain"
                                                                                    format="auto"
                                                                                    quality="auto"
                                                                                />
                                                                            ) : (
                                                                                <img
                                                                                    src={image}
                                                                                    alt={`${increment.title} - Screenshot ${imgIdx + 1}`}
                                                                                    className="w-full h-full object-contain"
                                                                                />
                                                                            )}
                                                                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/30 transition-colors flex items-center justify-center">
                                                                                <div className="opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                                                                                    <Maximize2 className="w-5 h-5 text-white" />
                                                                                    <span className="text-sm text-white font-medium">Click to expand</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
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
                                                                    <CloudinaryVideo
                                                                        publicId={video}
                                                                        controls
                                                                        preload="metadata"
                                                                        className="w-full h-full object-contain"
                                                                        format="mp4"
                                                                        quality="auto"
                                                                    />
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
                        className="mt-16 p-8 bg-gradient-to-br from-[#202020] via-[#1a1a1a] to-[#202020] rounded-xl border border-white/10 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/5 via-transparent to-[#E8B058]/5"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Release Summary</h2>
                                <button
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: 'Sprint 2025.12-A Release Notes',
                                                text: 'Check out the latest features and improvements!',
                                                url: window.location.href
                                            }).catch(() => {});
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                        }
                                    }}
                                    className="p-2 text-white/70 hover:text-[#E8B058] transition-colors"
                                    aria-label="Share release"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#E8B058]/30 transition-all"
                                >
                                    <div className="text-4xl font-bold text-[#E8B058] mb-2">6</div>
                                    <div className="text-white/70 font-medium">Core Capability Updates</div>
                                    <div className="text-sm text-white/50 mt-2">Map, Video & Control Features</div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#E8B058]/30 transition-all"
                                >
                                    <div className="text-4xl font-bold text-[#E8B058] mb-2">7</div>
                                    <div className="text-white/70 font-medium">Healthcheck & Reporting</div>
                                    <div className="text-sm text-white/50 mt-2">Dashboard, Reports & Automation</div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="text-center p-6 bg-white/5 rounded-lg border border-white/10 hover:border-[#E8B058]/30 transition-all"
                                >
                                    <div className="text-4xl font-bold text-[#E8B058] mb-2">{increments.length}</div>
                                    <div className="text-white/70 font-medium">Total Features</div>
                                    <div className="text-sm text-white/50 mt-2">All Completed & Deployed</div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Image Modal */}
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-7xl max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedImage && !selectedImage.startsWith('http') && !selectedImage.includes('/') && !selectedImage.includes('.') ? (
                                <CloudinaryImage
                                    publicId={selectedImage}
                                    alt="Full size screenshot"
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                    format="auto"
                                    quality="auto"
                                />
                            ) : (
                                <img
                                    src={selectedImage}
                                    alt="Full size screenshot"
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                />
                            )}
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 p-3 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all backdrop-blur-sm group"
                                aria-label="Close image"
                            >
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/70 rounded-lg text-sm text-white/80 backdrop-blur-sm">
                                Press ESC to close
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </main>
        </Layout>
    );
}

