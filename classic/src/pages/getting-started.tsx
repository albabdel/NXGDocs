import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import LandingPageBackground from '../components/LandingPageBackground';
import Link from '@docusaurus/Link';
import {
    Rocket,
    Play,
    BookOpen,
    Users,
    Shield,
    Zap,
    Settings,
    Activity,
    Home,
    ChevronRight,
    CheckCircle,
    Clock,
    Video,
    Monitor,
    Cpu,
    Building2,
    Radio,
    HelpCircle,
    FileText,
    Layers,
    Target,
    Star
} from 'lucide-react';

// Video Component (for actual videos)
const VideoCard = ({ title, duration, description, videoSrc, youtubeId }: { title: string; duration: string; description: string; videoSrc?: string; youtubeId?: string }) => {
    if (!videoSrc && !youtubeId) {
        // Fallback to placeholder if no video source
        return (
            <div className="relative group overflow-hidden rounded-xl bg-[#202020] border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300">
                <div className="aspect-video bg-[#1a1a1a] flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-[#E8B058]/20 backdrop-blur-sm border-2 border-[#E8B058]/50 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#E8B058]/30 transition-all duration-300">
                            <Play className="w-8 h-8 text-[#E8B058] ml-1" fill="currentColor" />
                        </div>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
                        {duration}
                    </div>
                    <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-[#E8B058]/20 backdrop-blur-sm rounded-full border border-[#E8B058]/30">
                        <Video className="w-4 h-4 text-[#E8B058]" />
                        <span className="text-xs font-medium text-[#E8B058]">Video</span>
                    </div>
                </div>
                <div className="p-4">
                    <h4 className="font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">{title}</h4>
                    <p className="text-sm text-white/70 leading-relaxed">{description}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative group overflow-hidden rounded-xl bg-[#202020] border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300">
            {/* Video Player */}
            <div className="aspect-video bg-[#1a1a1a] relative">
                {youtubeId ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <video
                        className="w-full h-full object-contain"
                        controls
                        preload="metadata"
                    >
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}

                {/* Duration Badge */}
                {!youtubeId && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium pointer-events-none">
                        {duration}
                    </div>
                )}
                {/* Video Icon Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-[#E8B058]/20 backdrop-blur-sm rounded-full border border-[#E8B058]/30 pointer-events-none">
                    <Video className="w-4 h-4 text-[#E8B058]" />
                    <span className="text-xs font-medium text-[#E8B058]">Video</span>
                </div>
            </div>
            {/* Video Info */}
            <div className="p-4">
                <h4 className="font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">{title}</h4>
                <p className="text-sm text-white/70 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

// Keep VideoPlaceholder for backward compatibility
const VideoPlaceholder = VideoCard;

// Phase Card Component
const PhaseCard = ({
    phase,
    title,
    description,
    topics,
    color
}: {
    phase: number;
    title: string;
    description: string;
    topics: { title: string; link: string }[];
    color: string;
}) => {
    const colorClasses = {
        green: 'bg-green-500/20 border-green-500/40 text-green-400',
        blue: 'bg-blue-500/20 border-blue-500/40 text-blue-400',
        purple: 'bg-purple-500/20 border-purple-500/40 text-purple-400',
        cyan: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400',
        amber: 'bg-amber-500/20 border-amber-500/40 text-amber-400',
    };

    const goldColorClasses = {
        green: 'bg-[#E8B058]/20 border-[#E8B058]/40 text-[#E8B058]',
        blue: 'bg-[#E8B058]/20 border-[#E8B058]/40 text-[#E8B058]',
        purple: 'bg-[#E8B058]/20 border-[#E8B058]/40 text-[#E8B058]',
        cyan: 'bg-[#E8B058]/20 border-[#E8B058]/40 text-[#E8B058]',
        amber: 'bg-[#E8B058]/20 border-[#E8B058]/40 text-[#E8B058]',
    };

    return (
        <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-white/20 transition-all">
            <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full ${goldColorClasses[color]} border-2 flex items-center justify-center`}>
                    <span className="text-xl font-bold">{phase}</span>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-white/70">{description}</p>
                </div>
            </div>
            <div className="space-y-2 mt-4">
                {topics.map((topic, idx) => (
                    <Link
                        key={idx}
                        to={topic.link}
                        className="flex items-center gap-2 p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors no-underline group border border-white/5"
                    >
                        <CheckCircle className="w-4 h-4 text-white/50 group-hover:text-[#E8B058] transition-colors" />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{topic.title}</span>
                        <ChevronRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-[#E8B058]" />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default function GettingStarted() {
    return (
        <Layout
            title="Getting Started"
            description="Complete onboarding guide for GCXONE - everything you need for your first week"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                {/* Breadcrumbs */}
                <div className="backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, var(--ifm-background-color) 0%, var(--ifm-background-color) 60%, transparent 100%)', borderBottom: '1px solid rgba(var(--ifm-color-emphasis-300-rgb, 200,200,200), 0.3)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Getting Started</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Rocket className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Your First Week with GCXONE</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--ifm-font-color-base)' }}>
                            Getting Started
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--ifm-font-color-secondary)' }}>
                            Your complete guide to mastering GCXONE. From initial login to full operational capability,
                            we'll walk you through everything step by step.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span>5 Phases to Productivity</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Video className="w-4 h-4" />
                                <span>Video Walkthroughs</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <BookOpen className="w-4 h-4" />
                                <span>Comprehensive Guides</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Video Introduction Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Watch & Learn</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Start with our video guides to get a visual understanding of GCXONE
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                <VideoPlaceholder
                                    title="GCXONE Product Overview"
                                    duration="5:30"
                                    description="Discover what GCXONE can do for your security operations and why leading companies trust our platform."
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                <VideoPlaceholder
                                    title="Platform Walkthrough"
                                    duration="8:45"
                                    description="A complete tour of the GCXONE interface, navigation, and key features you'll use daily."
                                    youtubeId="p--04PIIO-M"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <VideoPlaceholder
                                    title="Key Features & Value"
                                    duration="6:15"
                                    description="Learn how GCXONE's powerful features deliver real value and transform your monitoring operations."
                                    youtubeId="ER-tnAvGXow"
                                />
                            </motion.div>
                        </div>

                        {/* Additional Videos Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.4 }}
                                viewport={{ once: true }}
                            >
                                <VideoPlaceholder
                                    title="First-Time Login & Setup"
                                    duration="4:20"
                                    description="Step-by-step guide to your first login, password setup, and MFA configuration."
                                    youtubeId="I7dccOLTOsk"
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                                viewport={{ once: true }}
                            >
                                <VideoPlaceholder
                                    title="Dashboard Deep Dive"
                                    duration="7:00"
                                    description="Master the dashboard widgets, customization options, and real-time monitoring capabilities."
                                    youtubeId="AxHOF8cV88Q"
                                />
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* Phased Onboarding Roadmap */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Your Onboarding Roadmap</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Follow these phases to go from new user to GCXONE expert
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PhaseCard
                                phase={1}
                                title="Account & Security Setup"
                                description="Get started with your account"
                                color="green"
                                topics={[
                                    { title: 'First Time Login',  },
                                    { title: 'Password Management',  },
                                    { title: 'What is NXGEN GCXONE?', link: '/docs/getting-started/what-is-nxgen-GCXONE' },
                                ]}
                            />

                            <PhaseCard
                                phase={2}
                                title="Platform Orientation"
                                description="Learn the interface and navigation"
                                color="blue"
                                topics={[
                                    { title: 'Key Benefits',  },
                                    { title: 'Cloud Architecture',  },
                                    { title: 'GCXONE & Talos Interaction', link: '/docs/getting-started/GCXONE-talos-interaction' },
                                    { title: 'Quick Start Checklist',  },
                                ]}
                            />

                            <PhaseCard
                                phase={3}
                                title="Network Configuration"
                                description="Ensure proper connectivity"
                                color="purple"
                                topics={[
                                    { title: 'Required Ports',  },
                                    { title: 'Firewall Configuration',  },
                                    { title: 'IP Whitelisting',  },
                                    { title: 'Bandwidth Requirements', link: '/docs/getting-started/bandwidth-requirements' },
                                ]}
                            />

                            <PhaseCard
                                phase={4}
                                title="System Setup"
                                description="Configure NTP and architecture"
                                color="cyan"
                                topics={[
                                    { title: 'NTP Configuration',  },
                                ]}
                            />
                        </div>

                        {/* Phase 5 - Full Width */}
                        <div className="mt-6">
                            <PhaseCard
                                phase={5}
                                title="Operational Readiness"
                                description="Start monitoring and handling alarms"
                                color="amber"
                                topics={[
                                ]}
                            />
                        </div>
                    </motion.section>

                    {/* Role-Based Quick Links */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Learn by Role</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Find documentation tailored to your specific responsibilities
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <Shield className="w-8 h-8" />,
                                    title: 'Admin',
                                    desc: 'System configuration, user management, full access',
                                    link: '/roles/admin',
                                    color: 'from-red-500/20 to-orange-500/20 border-red-500/30'
                                },
                                {
                                    icon: <Activity className="w-8 h-8" />,
                                    title: 'Operator',
                                    desc: 'Alarm processing, monitoring, real-time response',
                                    link: '/roles/operator',
                                    color: 'from-green-500/20 to-emerald-500/20 border-green-500/30'
                                },
                                {
                                    icon: <Settings className="w-8 h-8" />,
                                    title: 'Installer',
                                    desc: 'Device provisioning, site setup, configuration',
                                    link: '/roles/installer',
                                    color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
                                },
                                {
                                    icon: <Layers className="w-8 h-8" />,
                                    title: 'Manager',
                                    desc: 'Reports, analytics, operational oversight',
                                    link: '/roles/manager',
                                    color: 'from-purple-500/20 to-pink-500/20 border-purple-500/30'
                                }
                            ].map((role, idx) => (
                                <motion.div
                                    key={role.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={role.link}
                                        className="block h-full p-6 bg-[#202020] border border-white/10 backdrop-blur-xl rounded-xl hover:scale-105 transition-all duration-300 no-underline group hover:border-[#E8B058]/50"
                                    >
                                        <div className="text-[#E8B058] mb-4 group-hover:scale-110 transition-transform">
                                            {role.icon}
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{role.title}</h3>
                                        <p className="text-sm text-white/70">{role.desc}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Feature Videos Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Feature Deep Dives</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Detailed video guides for specific GCXONE features
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <VideoPlaceholder
                                title="Alarm Management System"
                                duration="9:30"
                                description="Complete guide to receiving, processing, and handling alarms efficiently in GCXONE."
                            />
                            <VideoPlaceholder
                                title="Device Integration"
                                duration="11:20"
                                description="Learn how to connect cameras, sensors, and alarm panels to your GCXONE instance."
                            />
                            <VideoPlaceholder
                                title="User & Permission Management"
                                duration="6:45"
                                description="Set up user accounts, configure roles, and manage access permissions effectively."
                            />
                            <VideoPlaceholder
                                title="Reporting & Analytics"
                                duration="8:15"
                                description="Generate reports, analyze trends, and extract insights from your monitoring data."
                            />
                            <VideoPlaceholder
                                title="CMS Integration Setup"
                                duration="10:00"
                                description="Configure connections to Talos, external CMS platforms, and third-party systems."
                            />
                            <VideoPlaceholder
                                title="Troubleshooting Common Issues"
                                duration="7:30"
                                description="Quick solutions for the most common problems operators and admins encounter."
                            />
                        </div>
                    </motion.section>

                    {/* Resources Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Additional Resources</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Everything else you need to succeed with GCXONE
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                to="/docs/support"
                                className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group"
                            >
                                <HelpCircle className="w-10 h-10 text-[#E8B058] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-white mb-2">Help Center</h3>
                                <p className="text-sm text-white/70">Submit tickets, find answers, and get support from our team</p>
                            </Link>
                            <Link
                                to="/docs/release-notes"
                                className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group"
                            >
                                <FileText className="w-10 h-10 text-[#E8B058] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-white mb-2">Release Notes</h3>
                                <p className="text-sm text-white/70">Stay updated with the latest features and improvements</p>
                            </Link>
                            <Link
                                to="/docs/troubleshooting"
                                className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group"
                            >
                                <Target className="w-10 h-10 text-[#E8B058] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-white mb-2">Troubleshooting</h3>
                                <p className="text-sm text-white/70">Solutions for common issues and diagnostic guides</p>
                            </Link>
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="p-8 bg-[#202020] border border-white/10 rounded-2xl">
                            <Star className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Take the Quick Start Guide for a fast-track setup, or explore documentation by your role.
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/quick-start/guide"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Zap className="w-5 h-5" />
                                    Quick Start Guide
                                </Link>
                                <Link
                                    to="/quick-start/platform-overview"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <Cpu className="w-5 h-5" />
                                    Platform Overview
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
