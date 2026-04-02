import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import LandingPageBackground from '../components/LandingPageBackground';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
    Radio,
    Settings,
    Wifi,
    MapPin,
    Shield,
    Activity,
    FileText,
    Video,
    CheckCircle,
    AlertCircle,
    Zap,
    Home,
    ChevronRight,
    Play,
    BookOpen,
    Clock,
    Monitor,
    Router,
    Radio as RadioIcon,
    Volume2,
    HardDrive,
    Layers,
    Target,
    Star,
    HelpCircle,
    ArrowRight,
    Building2,
    Server,
    Cpu,
    Network,
    Database
} from 'lucide-react';

// Video Component
const VideoPlayer = ({ title, description }: { title: string; description: string }) => {
    return (
        <div className="relative group overflow-hidden rounded-xl bg-[#202020] border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300">
            {/* Video Player */}
            <div className="aspect-video bg-[#1a1a1a] relative">
                <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/H2WhN1p3x9E"
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>

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

// Step Card Component with full content
const StepCard = ({
    step,
    title,
    description,
    phase
}: {
    step: number;
    title: string;
    description: string;
    phase: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-6 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-[#E8B058]/30 transition-all group"
        >
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-[#E8B058]">{step}</span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-[#E8B058]/10 text-[#E8B058] rounded-full font-medium">
                            {phase}
                        </span>
                    </div>
                    <h4 className="text-base font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                        {title}
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed">{description}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Feature Section Component
const FeatureSection = ({
    icon,
    title,
    description,
    items
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    items: string[];
}) => {
    return (
        <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#E8B058]/20 border border-[#E8B058]/30 flex items-center justify-center text-[#E8B058]">
                    {icon}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-sm text-white/70">{description}</p>
                </div>
            </div>
            <ul className="space-y-2 mt-4">
                {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-white/80">
                        <CheckCircle className="w-4 h-4 text-[#E8B058] mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default function TowersLandingPage() {
    const towersDocLink = '/docs/devices';

    // All 36 steps from Towers.md organized by phase
    const steps = [
        // Phase 1: Marketplace Setup (Steps 1-16)
        { step: 1, title: 'Go to MarketPlace', description: 'Start by going to the MarketPlace to edit or create a tower template', phase: 'Marketplace Setup' },
        { step: 2, title: 'Filter by Towers', description: 'Filter the marketplace to show tower-specific templates and configurations', phase: 'Marketplace Setup' },
        { step: 3, title: 'Edit Existing Tower', description: 'Edit an existing tower template for effortless updates and fine-tuning', phase: 'Marketplace Setup' },
        { step: 4, title: 'Create Custom Template', description: 'Create a custom tower template for flexible, scalable tower deployments', phase: 'Marketplace Setup' },
        { step: 5, title: 'Select Device Types', description: 'Select device types here to tailor your tower to fit any operational requirement', phase: 'Marketplace Setup' },
        { step: 6, title: 'Add Router', description: 'Add a router to your tower for essential connectivity and secure data transmission', phase: 'Marketplace Setup' },
        { step: 7, title: 'Router Configuration', description: 'Configure router settings and network parameters for your tower', phase: 'Marketplace Setup' },
        { step: 8, title: 'Include Audio Devices', description: 'Include audio devices to enable communication and alerts from your towers', phase: 'Marketplace Setup' },
        { step: 9, title: 'Choose NVR', description: 'Choose NVR to equip your tower with advanced video recording capabilities', phase: 'Marketplace Setup' },
        { step: 10, title: 'NVR Configuration', description: 'Configure NVR settings and storage options for video recording', phase: 'Marketplace Setup' },
        { step: 11, title: 'Device Selection', description: 'Complete device type selection and configuration', phase: 'Marketplace Setup' },
        { step: 12, title: 'Pick Template Types', description: 'Pick the types you want to include in the template', phase: 'Marketplace Setup' },
        { step: 13, title: 'Select Preferred Router', description: 'Select your preferred router to provide reliable network access for your tower devices', phase: 'Marketplace Setup' },
        { step: 14, title: 'Router Settings', description: 'Configure router network settings and security parameters', phase: 'Marketplace Setup' },
        { step: 15, title: 'Template Review', description: 'Review and verify all template configurations before saving', phase: 'Marketplace Setup' },
        { step: 16, title: 'Save Template', description: 'Save your tower template for future use and deployment', phase: 'Marketplace Setup' },

        // Phase 2: Tower Deployment (Steps 17-26)
        { step: 17, title: 'Navigate to Mobile Towers', description: 'Navigate to Mobile Towers section in the main menu', phase: 'Tower Deployment' },
        { step: 18, title: 'Start Adding Tower', description: 'Start adding a new mobile tower to your network', phase: 'Tower Deployment' },
        { step: 19, title: 'Select Template', description: 'Select the template we just made from the available templates list', phase: 'Tower Deployment' },
        { step: 20, title: 'Click Next', description: 'Click Next to proceed and personalize your tower details', phase: 'Tower Deployment' },
        { step: 21, title: 'Select Customer and Site', description: 'Select the customer and site where the tower components are added to', phase: 'Tower Deployment' },
        { step: 22, title: 'Select Devices', description: 'Select the devices from the drop down menu for your tower configuration', phase: 'Tower Deployment' },
        { step: 23, title: 'Device Assignment', description: 'Assign specific devices to your tower configuration', phase: 'Tower Deployment' },
        { step: 24, title: 'Network Configuration', description: 'Configure network settings for tower connectivity', phase: 'Tower Deployment' },
        { step: 25, title: 'IP Address Setup', description: 'Set up IP addresses and network parameters', phase: 'Tower Deployment' },
        { step: 26, title: 'Connectivity Test', description: 'Test connectivity and verify network settings', phase: 'Tower Deployment' },

        // Phase 3: Component Configuration (Steps 27-36)
        { step: 27, title: 'Navigate Components', description: 'Navigate through the components to configure each device', phase: 'Component Configuration' },
        { step: 28, title: 'Component Settings', description: 'Access and configure individual component settings', phase: 'Component Configuration' },
        { step: 29, title: 'Configure Metrics', description: 'You can configure these metrics to send alarms once they reach a certain threshold', phase: 'Component Configuration' },
        { step: 30, title: 'Alarm Thresholds', description: 'Set alarm thresholds and notification parameters', phase: 'Component Configuration' },
        { step: 31, title: 'Monitoring Setup', description: 'Configure monitoring and health check settings', phase: 'Component Configuration' },
        { step: 32, title: 'Video Configuration', description: 'Set up video recording and streaming parameters', phase: 'Component Configuration' },
        { step: 33, title: 'Audio Configuration', description: 'Configure audio device settings and communication options', phase: 'Component Configuration' },
        { step: 34, title: 'Network Security', description: 'Set up network security and access controls', phase: 'Component Configuration' },
        { step: 35, title: 'Final Review', description: 'Review all configurations before finalizing tower setup', phase: 'Component Configuration' },
        { step: 36, title: 'Deploy Tower', description: 'Complete deployment and activate your mobile tower', phase: 'Component Configuration' },
    ];

    return (
        <Layout
            title="Towers"
            description="Complete guide to managing and configuring mobile towers"
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
                            <Link to="/getting-started" className="text-slate-400 hover:text-white transition-colors no-underline">
                                Getting Started
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Towers</span>
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
                            <Radio className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Mobile Tower Management</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: 'var(--ifm-font-color-base)' }}>
                            Towers
                        </h1>
                        <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: 'var(--ifm-font-color-secondary)' }}>
                            Complete guide to adding, configuring, and managing mobile towers.
                            From marketplace template creation to final deployment, learn everything you need to deploy and maintain your tower infrastructure.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock className="w-4 h-4" />
                                <span>36 Step-by-Step Guide</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <Video className="w-4 h-4" />
                                <span>Video Tutorial</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                                <BookOpen className="w-4 h-4" />
                                <span>Complete Documentation</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Video Section */}
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
                                Start with our comprehensive video guide to see the complete process of adding and configuring a mobile tower
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <VideoPlayer
                                title="Add and Configure a New Mobile Tower"
                                description="Complete walkthrough of adding and configuring a new mobile tower, from marketplace template creation to final deployment and activation."
                            />
                        </div>
                    </motion.section>

                    {/* Overview Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Tower Configuration Overview</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Understanding the complete tower setup process
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FeatureSection
                                icon={<Settings className="w-6 h-6" />}
                                title="Marketplace Setup"
                                description="Create and configure tower templates in the Marketplace"
                                items={[
                                    'Create or edit tower templates',
                                    'Select device types and components',
                                    'Configure routers and network settings',
                                    'Set up audio devices and NVR systems',
                                    'Save templates for reuse'
                                ]}
                            />
                            <FeatureSection
                                icon={<RadioIcon className="w-6 h-6" />}
                                title="Tower Deployment"
                                description="Deploy towers using your configured templates"
                                items={[
                                    'Navigate to Mobile Towers section',
                                    'Select template for deployment',
                                    'Assign to customer and site',
                                    'Select and configure devices',
                                    'Set up network connectivity'
                                ]}
                            />
                            <FeatureSection
                                icon={<Activity className="w-6 h-6" />}
                                title="Component Configuration"
                                description="Configure all tower components and monitoring"
                                items={[
                                    'Navigate through components',
                                    'Configure alarm thresholds',
                                    'Set up monitoring metrics',
                                    'Configure video and audio',
                                    'Finalize and deploy'
                                ]}
                            />
                        </div>
                    </motion.section>

                    {/* Complete Step-by-Step Guide */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Complete Step-by-Step Guide</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Follow all 36 steps to successfully add and configure your mobile tower
                            </p>
                        </div>

                        {/* Phase 1: Marketplace Setup */}
                        <div className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#E8B058]">1</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Phase 1: Marketplace Setup</h3>
                                    <p className="text-white/70">Create and configure tower templates in the Marketplace (Steps 1-16)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {steps.filter(s => s.phase === 'Marketplace Setup').map((step) => (
                                    <StepCard key={step.step} {...step} />
                                ))}
                            </div>
                        </div>

                        {/* Phase 2: Tower Deployment */}
                        <div className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#E8B058]">2</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Phase 2: Tower Deployment</h3>
                                    <p className="text-white/70">Deploy towers using your configured templates (Steps 17-26)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {steps.filter(s => s.phase === 'Tower Deployment').map((step) => (
                                    <StepCard key={step.step} {...step} />
                                ))}
                            </div>
                        </div>

                        {/* Phase 3: Component Configuration */}
                        <div className="mb-16">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-[#E8B058]">3</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Phase 3: Component Configuration</h3>
                                    <p className="text-white/70">Configure all tower components and monitoring (Steps 27-36)</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {steps.filter(s => s.phase === 'Component Configuration').map((step) => (
                                    <StepCard key={step.step} {...step} />
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* Key Features */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Tower Management Features</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Everything you need to manage your mobile tower infrastructure
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all">
                                <div className="text-[#E8B058] mb-4">
                                    <Settings className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Template Management</h3>
                                <p className="text-sm text-white/70">Create, edit, and manage tower templates in the Marketplace for consistent deployments</p>
                            </div>
                            <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all">
                                <div className="text-[#E8B058] mb-4">
                                    <Router className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Network Configuration</h3>
                                <p className="text-sm text-white/70">Configure routers, IP addresses, and network connectivity for secure data transmission</p>
                            </div>
                            <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all">
                                <div className="text-[#E8B058] mb-4">
                                    <Volume2 className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Audio Integration</h3>
                                <p className="text-sm text-white/70">Enable communication and alerts from your towers with integrated audio devices</p>
                            </div>
                            <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all">
                                <div className="text-[#E8B058] mb-4">
                                    <HardDrive className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">NVR Integration</h3>
                                <p className="text-sm text-white/70">Equip your towers with advanced video recording capabilities using NVR systems</p>
                            </div>
                            <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all">
                                <div className="text-[#E8B058] mb-4">
                                    <Activity className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Monitoring & Alarms</h3>
                                <p className="text-sm text-white/70">Configure metrics and thresholds to send alarms when certain conditions are met</p>
                            </div>
                            <div className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all">
                                <div className="text-[#E8B058] mb-4">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Site Management</h3>
                                <p className="text-sm text-white/70">Assign towers to specific customers and sites for organized deployment</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Technical Specifications & Configuration Reference */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Technical Specifications & Configuration Reference</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Complete technical reference for tower configuration and deployment
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Network Configuration */}
                            <div className="p-8 bg-[#202020] border border-white/10 rounded-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <Network className="w-8 h-8 text-[#E8B058]" />
                                    <h3 className="text-2xl font-bold text-white">Network Configuration</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Router Requirements</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Support for static IP configuration</li>
                                            <li>• VPN capability for secure remote access</li>
                                            <li>• Firewall rules for device communication</li>
                                            <li>• Port forwarding for video streaming</li>
                                            <li>• Quality of Service (QoS) configuration</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">IP Addressing</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Static IP assignment recommended</li>
                                            <li>• Subnet configuration for device isolation</li>
                                            <li>• Gateway and DNS server configuration</li>
                                            <li>• DHCP reservation for consistent addressing</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Port Requirements</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• HTTP/HTTPS: 80, 443</li>
                                            <li>• RTSP: 554</li>
                                            <li>• ONVIF: 8080</li>
                                            <li>• NVR Communication: 8000-8010</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Device Configuration */}
                            <div className="p-8 bg-[#202020] border border-white/10 rounded-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <Cpu className="w-8 h-8 text-[#E8B058]" />
                                    <h3 className="text-2xl font-bold text-white">Device Configuration</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Supported Device Types</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• IP Cameras (ONVIF compatible)</li>
                                            <li>• Network Video Recorders (NVR)</li>
                                            <li>• Audio devices (speakers, microphones)</li>
                                            <li>• Network routers and switches</li>
                                            <li>• Environmental sensors</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Device Requirements</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Firmware version compatibility check</li>
                                            <li>• Network connectivity verification</li>
                                            <li>• Authentication credentials setup</li>
                                            <li>• Device-specific parameter configuration</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Video Configuration</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Resolution: 1080p, 4K supported</li>
                                            <li>• Frame rate: 15-30 fps</li>
                                            <li>• Codec: H.264, H.265</li>
                                            <li>• Bitrate: Configurable per device</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* NVR Configuration */}
                            <div className="p-8 bg-[#202020] border border-white/10 rounded-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <HardDrive className="w-8 h-8 text-[#E8B058]" />
                                    <h3 className="text-2xl font-bold text-white">NVR Configuration</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Storage Configuration</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Storage capacity planning</li>
                                            <li>• Recording schedule configuration</li>
                                            <li>• Retention policy settings</li>
                                            <li>• Storage location and path configuration</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Recording Settings</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Continuous recording</li>
                                            <li>• Motion-triggered recording</li>
                                            <li>• Alarm-triggered recording</li>
                                            <li>• Scheduled recording windows</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Playback Configuration</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Playback speed controls</li>
                                            <li>• Timeline navigation</li>
                                            <li>• Export and download options</li>
                                            <li>• Multi-camera synchronized playback</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Monitoring & Alarms */}
                            <div className="p-8 bg-[#202020] border border-white/10 rounded-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <Activity className="w-8 h-8 text-[#E8B058]" />
                                    <h3 className="text-2xl font-bold text-white">Monitoring & Alarms</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Health Monitoring</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Device connectivity status</li>
                                            <li>• Network latency monitoring</li>
                                            <li>• Storage capacity alerts</li>
                                            <li>• System resource utilization</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Alarm Thresholds</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• CPU usage threshold: 80%</li>
                                            <li>• Memory usage threshold: 85%</li>
                                            <li>• Disk space threshold: 90%</li>
                                            <li>• Network latency threshold: 100ms</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Notification Channels</h4>
                                        <ul className="space-y-2 text-sm text-white/80 ml-4">
                                            <li>• Email notifications</li>
                                            <li>• SMS alerts</li>
                                            <li>• In-app notifications</li>
                                            <li>• Webhook integrations</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Technical Details */}
                        <div className="mt-8 p-8 bg-[#202020] border border-white/10 rounded-xl">
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Database className="w-8 h-8 text-[#E8B058]" />
                                Additional Configuration Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Security Settings</h4>
                                    <ul className="space-y-2 text-sm text-white/80">
                                        <li>• Enable SSL/TLS encryption for all communications</li>
                                        <li>• Configure strong authentication credentials</li>
                                        <li>• Set up access control lists (ACLs)</li>
                                        <li>• Enable audit logging for security events</li>
                                        <li>• Configure firewall rules for device isolation</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Performance Optimization</h4>
                                    <ul className="space-y-2 text-sm text-white/80">
                                        <li>• Configure bandwidth limits per device</li>
                                        <li>• Optimize video encoding settings</li>
                                        <li>• Set up caching for frequently accessed data</li>
                                        <li>• Configure connection pooling</li>
                                        <li>• Enable compression for data transmission</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Backup & Recovery</h4>
                                    <ul className="space-y-2 text-sm text-white/80">
                                        <li>• Configure automated backup schedules</li>
                                        <li>• Set up redundant storage systems</li>
                                        <li>• Document recovery procedures</li>
                                        <li>• Test backup and restore processes</li>
                                        <li>• Maintain configuration backups</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Integration Settings</h4>
                                    <ul className="space-y-2 text-sm text-white/80">
                                        <li>• API endpoint configuration</li>
                                        <li>• Third-party system integrations</li>
                                        <li>• Webhook URL configuration</li>
                                        <li>• External database connections</li>
                                        <li>• Cloud service integrations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Best Practices */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Best Practices</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Tips and recommendations for successful tower deployment
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-[#202020] border border-white/10 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#E8B058]" />
                                    Template Creation
                                </h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Create reusable templates for common tower configurations</li>
                                    <li>• Test templates in a staging environment before production</li>
                                    <li>• Document template configurations for team reference</li>
                                    <li>• Use descriptive names for easy template identification</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-[#202020] border border-white/10 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#E8B058]" />
                                    Network Configuration
                                </h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Ensure proper IP addressing and subnet configuration</li>
                                    <li>• Configure firewall rules for tower connectivity</li>
                                    <li>• Test network connectivity before final deployment</li>
                                    <li>• Document network settings for troubleshooting</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-[#202020] border border-white/10 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#E8B058]" />
                                    Device Selection
                                </h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Select devices compatible with your tower requirements</li>
                                    <li>• Verify device firmware versions before deployment</li>
                                    <li>• Configure device-specific settings appropriately</li>
                                    <li>• Test device functionality after configuration</li>
                                </ul>
                            </div>
                            <div className="p-6 bg-[#202020] border border-white/10 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-[#E8B058]" />
                                    Monitoring Setup
                                </h3>
                                <ul className="space-y-2 text-sm text-white/80">
                                    <li>• Configure appropriate alarm thresholds for your use case</li>
                                    <li>• Set up monitoring metrics for tower health</li>
                                    <li>• Enable notifications for critical alarms</li>
                                    <li>• Regularly review and adjust threshold settings</li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    {/* Related Resources */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Related Resources</h2>
                            <p className="text-lg max-w-2xl mx-auto">
                                Additional documentation to help you with tower management
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                to="/getting-started"
                                className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group"
                            >
                                <BookOpen className="w-10 h-10 text-[#E8B058] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-white mb-2">Getting Started</h3>
                                <p className="text-sm text-white/70">Complete onboarding guide</p>
                            </Link>
                            <Link
                                to={towersDocLink}
                                className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group"
                            >
                                <FileText className="w-10 h-10 text-[#E8B058] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-white mb-2">Full Documentation</h3>
                                <p className="text-sm text-white/70">Complete Towers.md guide with all details and images</p>
                            </Link>
                            <Link
                                to="/docs"
                                className="p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all no-underline group"
                            >
                                <Wifi className="w-10 h-10 text-[#E8B058] mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold text-white mb-2">Network Configuration</h3>
                                <p className="text-sm text-white/70">Configure network settings and connectivity</p>
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
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to Configure Your Tower?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Follow our complete 36-step guide to add and configure your first mobile tower.
                                Watch the video tutorial and follow along with the detailed steps above.
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to={towersDocLink}
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Zap className="w-5 h-5" />
                                    View Full Documentation
                                </Link>
                                <Link
                                    to="/getting-started"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Getting Started Guide
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
