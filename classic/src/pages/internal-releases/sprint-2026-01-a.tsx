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
    BarChart3,
    Database,
    Radio
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

// Sprint 2026.01-A increment data
const increments: Increment[] = [
    // DC09 / CMS Support via Marketplace
    {
        id: 'inc-001',
        title: 'DC09 CMS Integration via Marketplace',
        description: 'Complete DC09 and CMS support through the Marketplace enabling amwin and LISA customers to onboard and route alarms correctly. Includes viewing CMS options, configuring Evalink Talos and DC09 CMS, assigning account IDs, enabling encryption, and viewing alarm logs.',
        category: 'DC09 / CMS Support',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-002',
        title: 'DC09 Configuration and Validation',
        description: 'Prevent invalid DC09 configurations and ensure proper setup validation for reliable alarm routing.',
        category: 'DC09 / CMS Support',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    // Feature Parity: Critical Genesis Gaps
    {
        id: 'inc-003',
        title: 'Analytics Marketplace Integration',
        description: 'Subscribe to and activate Analytics from the Marketplace, completing key Genesis parity functionality.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-004',
        title: 'Device Type Expansion',
        description: 'Add remaining device types to the Add Device Panel, expanding configuration options for customers.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-005',
        title: 'Talos Two-Way Sync',
        description: 'Implement Talos reverse sync functionality, enabling bidirectional data synchronization between systems.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-006',
        title: 'Reference Image Management',
        description: 'Reference image management workflow improvements for healthcheck operations.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-007',
        title: 'VAS Quad View Detection Fix',
        description: 'Fix detection display issues in VAS quad view to ensure proper visibility of detection data.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-008',
        title: 'Sensor Configuration UI',
        description: 'Improved Add/Edit Sensor UI layout for better configuration workflow.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-009',
        title: 'Genesis Audio Audit Tab Fix',
        description: 'Fix empty page issue in Configuration Genesis Audio audit tab.',
        category: 'Feature Parity: Genesis Gaps',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    // Enhanced Tower Management
    {
        id: 'inc-010',
        title: 'Move Tower Functionality',
        description: 'Enhanced tower management with move tower capabilities, improving operational flexibility.',
        category: 'Enhanced Tower Management',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-011',
        title: 'Tower Status Management',
        description: 'Improved tower status tracking and management for better operational visibility.',
        category: 'Enhanced Tower Management',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-012',
        title: 'Additional Properties Menu',
        description: 'Enhanced properties burger menu with additional options for tower management.',
        category: 'Enhanced Tower Management',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    // Healthcheck Dashboard & Reports
    {
        id: 'inc-013',
        title: 'Bulk Healthcheck Execution',
        description: 'Ability to bulk run healthcheck from the overview with filtering support, improving operational efficiency.',
        category: 'Healthcheck Dashboard & Reports',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-014',
        title: 'Customer Report Enhancements',
        description: 'Site Summary Table in Healthcheck Customer Report and improved report clarity with larger images and better layout.',
        category: 'Healthcheck Dashboard & Reports',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-015',
        title: 'Report Scheduler Improvements',
        description: 'Copy selected customers/sites and email templates from other schedulers, streamlining report configuration.',
        category: 'Healthcheck Dashboard & Reports',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-016',
        title: 'Healthcheck Image Handling',
        description: 'Improved image handling with larger display space and better visibility in reports.',
        category: 'Healthcheck Dashboard & Reports',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-017',
        title: 'Detection Visibility Improvements',
        description: 'Highlight detection functionality and split black screen into no license and no video categories for clearer reporting.',
        category: 'Healthcheck Dashboard & Reports',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    {
        id: 'inc-018',
        title: 'Healthcheck AI Performance',
        description: 'Improved healthcheck AI performance and response handling for lowlight issues with dual lens cameras (thermal + optical).',
        category: 'Healthcheck Dashboard & Reports',
        images: [],
        videos: [],
        status: 'in-progress'
    },
    // Documentation
    {
        id: 'inc-019',
        title: 'Documentation Updates',
        description: 'docs.nxgen.cloud documentation updates and fixes for issues identified during recent onboardings.',
        category: 'Documentation',
        images: [],
        videos: [],
        status: 'in-progress'
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

export default function Sprint202601APage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <Layout
            title="Sprint 2026.01-A - Internal Releases"
            description="Detailed release notes for Sprint 2026.01-A"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Internal Releases', href: '/internal-releases' },
                        { label: 'Sprint 2026.01-A' }
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
                            Sprint 2026.01-A
                        </h1>
                        <div className="flex items-center justify-center gap-6 text-white/70 mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>January 1, 2026</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>{increments.length} Features</span>
                            </div>
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-xl text-white/90 font-semibold mb-4 leading-relaxed">
                                Enable DC09 onboarding and close the last high impact Genesis gaps so customers can migrate, operate, and monitor without blockers.
                            </p>
                            <p className="text-lg text-white/70 leading-relaxed">
                                This sprint focuses on removing remaining blockers for customer migration and day to day operations. The priority is delivering DC09 and CMS support through the Marketplace so amwin and LISA customers can onboard and route alarms correctly. In parallel, we will complete key Genesis parity items, including remaining device types, permissions, analytics subscription and activation, and Talos two way sync.
                            </p>
                            <p className="text-lg text-white/70 mt-4 leading-relaxed">
                                We will continue strengthening core operational flows by improving tower management, tower statuses, moving towers, journey workflows, and autostreaming behavior. Healthcheck remains a major focus area, with work on bulk execution, reporting clarity, image handling, detection visibility, AI performance, and customer report improvements.
                            </p>
                            <p className="text-lg text-white/70 mt-4 leading-relaxed">
                                The sprint also includes documentation updates and fixes for issues identified during recent onboardings. The goal is to stabilize the platform, reduce manual workarounds, and ensure the product is ready for broader customer adoption and migration.
                            </p>
                        </div>
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
                                                {category === 'DC09 / CMS Support' && <Database className="w-6 h-6" />}
                                                {category === 'Feature Parity: Genesis Gaps' && <Zap className="w-6 h-6" />}
                                                {category === 'Enhanced Tower Management' && <Radio className="w-6 h-6" />}
                                                {category === 'Healthcheck Dashboard & Reports' && <Activity className="w-6 h-6" />}
                                                {category === 'Documentation' && <FileText className="w-6 h-6" />}
                                                {!['DC09 / CMS Support', 'Feature Parity: Genesis Gaps', 'Enhanced Tower Management', 'Healthcheck Dashboard & Reports', 'Documentation'].includes(category) && <FileText className="w-6 h-6" />}
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
                                                    {increment.status === 'in-progress' && (
                                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                            In Progress
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
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">8</div>
                                <div className="text-white/70">DC09 & Marketplace Features</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">7</div>
                                <div className="text-white/70">Genesis Parity Items</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-[#E8B058] mb-2">6</div>
                                <div className="text-white/70">Healthcheck Improvements</div>
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

