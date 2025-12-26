import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {
    Zap,
    LogIn,
    Shield,
    Users,
    Building2,
    LayoutDashboard,
    Radio,
    Settings,
    Activity,
    Clock,
    Home,
    ChevronRight,
    CheckCircle,
    Code,
    Copy,
    Server,
    Key,
    AlertCircle,
    Database,
    GitBranch,
    Terminal,
    Video,
    BookOpen,
    Play,
    ArrowRight,
    Mail,
    Lock,
    QrCode,
    Smartphone,
    Globe,
    Network,
    Wifi,
    Monitor,
    FileText,
    Star,
    HelpCircle,
    Bell,
    BarChart3,
    Cpu,
    HardDrive
} from 'lucide-react';

// Code Block Component
const CodeBlock = ({ code, language = 'bash' }: { code: string; language?: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
            >
                {copied ? <CheckCircle className="w-4 h-4 text-[#E8B058]" /> : <Copy className="w-4 h-4 text-white/70" />}
            </button>
            <pre className="bg-[#202020] border border-white/10 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-white/70 font-mono">{code}</code>
            </pre>
        </div>
    );
};

// Step Card Component (reused from Towers page)
const StepCard = ({
    step,
    title,
    description,
    image,
    details
}: {
    step: number;
    title: string;
    description: string;
    image?: string;
    details?: React.ReactNode;
}) => {
    const imageUrl = image ? useBaseUrl(image) : null;
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-6 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-[#E8B058]/30 transition-all group"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-[#E8B058]">{step}</span>
                </div>
                <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                        {title}
                    </h4>
                    <p className="text-sm text-white/70 leading-relaxed mb-4">{description}</p>
                    {details && <div className="mt-4">{details}</div>}
                    {imageUrl && (
                        <div className="mt-4 rounded-lg overflow-hidden border border-white/10">
                            <img src={imageUrl} alt={title} className="w-full h-auto" />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// Feature Section Component (reused from Towers page)
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

// Video Component
const VideoPlayer = ({ title, description, videoSrc }: { title: string; description: string; videoSrc?: string }) => {
    const videoUrl = videoSrc ? useBaseUrl(videoSrc) : useBaseUrl('/videos/first-time-login-setup.mp4');
    
    return (
        <div className="relative group overflow-hidden rounded-xl bg-[#202020] border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300">
            <div className="aspect-video bg-[#1a1a1a] relative">
                <video
                    className="w-full h-full object-contain"
                    controls
                    preload="metadata"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-[#E8B058]/20 backdrop-blur-sm rounded-full border border-[#E8B058]/30 pointer-events-none">
                    <Video className="w-4 h-4 text-[#E8B058]" />
                    <span className="text-xs font-medium text-[#E8B058]">Video Tutorial</span>
                </div>
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">{title}</h4>
                <p className="text-sm text-white/70 leading-relaxed">{description}</p>
            </div>
        </div>
    );
};

export default function QuickStartGuide() {
    return (
        <Layout
            title="Quick Start Guide"
            description="Get up and running with GCXONE in 5-10 minutes - Complete step-by-step guide from first login to full monitoring capability"
        >
            <main className="min-h-screen bg-black">
                {/* Breadcrumbs */}
                <div className="bg-black border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <Link to="/#quick-start" className="text-slate-400 hover:text-white transition-colors no-underline">
                                Quick Start
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Quick Start Guide</span>
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
                            <Clock className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">5-10 Minute Setup</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Quick Start Guide
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Follow this comprehensive guide to configure your GCXONE platform from initial login to full monitoring capability. 
                            Get your security operations center up and running in minutes.
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
                            <div className="flex items-center gap-2 text-white/70">
                                <Clock className="w-4 h-4" />
                                <span>Time Required: 5-10 minutes</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Users className="w-4 h-4" />
                                <span>All Roles</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/70">
                                <Video className="w-4 h-4" />
                                <span>Video Tutorial Available</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Video Tutorial Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Watch & Learn</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Start with our comprehensive video guide covering the complete setup process
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto">
                            <VideoPlayer
                                title="First-Time Login & Setup - Complete Walkthrough"
                                description="Complete 4-minute walkthrough covering account registration, first login, security setup, and initial platform configuration."
                            />
                        </div>
                    </motion.section>

                    {/* Workflow Overview */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Onboarding Workflow</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Four simple steps to get your platform operational
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { icon: <LogIn className="w-6 h-6" />, title: '1. First Login', desc: 'Account setup & security' },
                                { icon: <Radio className="w-6 h-6" />, title: '2. CMS Connection', desc: 'Configure monitoring station' },
                                { icon: <Database className="w-6 h-6" />, title: '3. Build Database', desc: 'Create hierarchy & users' },
                                { icon: <LayoutDashboard className="w-6 h-6" />, title: '4. Dashboard', desc: 'Start monitoring' }
                            ].map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-6 bg-[#202020] border border-white/10 rounded-xl text-center hover:border-[#E8B058]/50 transition-all"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center text-[#E8B058]">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-white/70">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Workflow Diagram */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                            <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                <img
                                    src={useBaseUrl('/img/getting-started/quick-start/quick-start-1.png')}
                                    alt="Onboarding Workflow"
                                    className="w-full h-auto rounded-lg"
                                    onError={(e) => {
                                        // Fallback if image doesn't exist
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Prerequisites */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="p-8 bg-[#202020] border border-white/10 rounded-xl">
                            <div className="flex items-start gap-4">
                                <AlertCircle className="w-8 h-8 text-[#E8B058] flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-4">Before You Begin</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-[#E8B058] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-white mb-1">Access Credentials</h4>
                                                    <p className="text-sm text-white/70">Provided by your administrator or received via email</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-[#E8B058] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-white mb-1">Network Access</h4>
                                                    <p className="text-sm text-white/70">Access to <code className="px-2 py-1 bg-[#1a1a1a] rounded text-[#E8B058]">*.nxgen.cloud</code> domains</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-[#E8B058] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-white mb-1">MFA App</h4>
                                                    <p className="text-sm text-white/70">Multi-factor authentication app (Google Authenticator, Authy, etc.)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-[#E8B058] mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <h4 className="font-semibold text-white mb-1">Admin Privileges</h4>
                                                    <p className="text-sm text-white/70">Required if setting up CMS connections or user management</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Step 1: First Access & Login */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-[#E8B058]">1</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">First Access & Security Setup</h2>
                                    <p className="text-white/70 text-lg">Secure your account and configure workspace</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <StepCard
                                step={1}
                                title="Navigate to Login Portal"
                                description="Access the GCXONE platform at your organization's URL. If you don't have the URL, contact your administrator."
                                image="/img/getting-started/first-time-login/img_c7a1f8ab36.png"
                                details={
                                    <div className="mt-4">
                                        <CodeBlock code="https://yourcompany.gcxone.cloud" />
                                        <p className="text-xs text-white/60 mt-2">Replace 'yourcompany' with your organization's subdomain</p>
                                    </div>
                                }
                            />

                            <StepCard
                                step={2}
                                title="Account Registration"
                                description="If this is your first time, click Register to create a new account. You'll need to provide your email, name, and organization details."
                                image="/img/getting-started/first-time-login/img_358fe55e1f.png"
                                details={
                                    <div className="mt-4 space-y-2 text-sm text-white/70">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-[#E8B058]" />
                                            <span>Use a valid business email address</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-[#E8B058]" />
                                            <span>Enter your organization or company name</span>
                                        </div>
                                    </div>
                                }
                            />

                            <StepCard
                                step={3}
                                title="Enter Your Details"
                                description="Fill in all required information including personal details and organization information."
                                image="/img/getting-started/first-time-login/img_6f0dd9a688.png"
                            />

                            <StepCard
                                step={4}
                                title="Set Up Your Password"
                                description="After registration, you'll receive a password reset email. Click the link and create a strong password."
                                image="/img/getting-started/first-time-login/img_391533ac02.png"
                                details={
                                    <div className="mt-4 p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                                        <h5 className="font-semibold text-white mb-2 text-sm">Password Requirements:</h5>
                                        <ul className="space-y-1 text-xs text-white/70">
                                            <li>• Minimum 12 characters</li>
                                            <li>• Mix of uppercase, lowercase, numbers</li>
                                            <li>• At least one special character (!@#$%)</li>
                                            <li>• Not previously used</li>
                                        </ul>
                                    </div>
                                }
                            />

                            <StepCard
                                step={5}
                                title="Enable Multi-Factor Authentication (MFA)"
                                description="MFA adds an essential security layer protecting against unauthorized access. Highly recommended for all users."
                                details={
                                    <div className="mt-4 space-y-4">
                                        <div className="p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                                            <h5 className="font-semibold text-white mb-3 text-sm flex items-center gap-2">
                                                <Shield className="w-4 h-4 text-[#E8B058]" />
                                                Setup Steps:
                                            </h5>
                                            <ol className="space-y-2 text-sm text-white/70 ml-4">
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-[#E8B058]">1.</span>
                                                    <span>Navigate to Account Settings → Security</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-[#E8B058]">2.</span>
                                                    <span>Click "Enable Two-Factor Authentication"</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-[#E8B058]">3.</span>
                                                    <span>Scan QR code with authenticator app</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-[#E8B058]">4.</span>
                                                    <span>Enter 6-digit verification code</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="font-mono text-[#E8B058]">5.</span>
                                                    <span>Save backup codes in secure location</span>
                                                </li>
                                            </ol>
                                        </div>
                                        <div className="p-4 bg-[#1a1a1a] rounded-lg border border-white/10">
                                            <h5 className="font-semibold text-white mb-2 text-sm">Supported Apps:</h5>
                                            <div className="grid grid-cols-2 gap-2">
                                                {['Google Authenticator', 'Microsoft Authenticator', 'Authy', 'Duo Mobile'].map(app => (
                                                    <div key={app} className="p-2 bg-[#202020] rounded text-sm text-white/70 text-center border border-white/5">
                                                        {app}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                }
                            />
                        </div>

                        <div className="mt-8 p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-white mb-1">Need More Help?</h4>
                                    <p className="text-sm text-white/70">Detailed guide with screenshots and troubleshooting</p>
                                </div>
                                <Link
                                    to="/docs/getting-started/first-time-login"
                                    className="px-6 py-3 bg-[#E8B058]/20 hover:bg-[#E8B058]/30 border border-[#E8B058]/40 text-[#E8B058] font-medium rounded-lg transition-all no-underline flex items-center gap-2"
                                >
                                    View Full Guide
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </motion.section>

                    {/* Step 2: CMS Connection */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-[#E8B058]">2</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">CMS Connection Setup</h2>
                                    <p className="text-white/70 text-lg">Configure Central Monitoring Station for alarm routing</p>
                                </div>
                            </div>
                        </div>

                        {/* CMS Comparison */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold text-white mb-6">Choose Your Integration Method</h3>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-2xl" />
                                <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <img
                                        src={useBaseUrl('/img/getting-started/quick-start/quick-start-2.png')}
                                        alt="CMS Comparison Table"
                                        className="w-full h-auto rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Configuration Examples */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Talos Setup */}
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                        <Zap className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">Talos (Native)</h4>
                                        <span className="text-xs px-2 py-1 bg-[#E8B058]/20 border border-[#E8B058]/30 rounded text-[#E8B058]">
                                            Recommended
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Full native integration with automatic site sync and bidirectional communication. Best for new deployments.
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h5 className="text-sm font-semibold text-white mb-2">Configuration:</h5>
                                        <CodeBlock code={`# Navigate to Settings → Integrations
# Select "Talos CMS"
# Enter your credentials:

Server URL: https://talos.yourcompany.com
API Token: [Generate from Talos Admin]
Auto-sync Sites: Enabled`} />
                                    </div>
                                    <div className="p-3 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded">
                                        <p className="text-xs text-[#E8B058] flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Alarms route automatically after setup
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* External CMS Setup */}
                            <div className="p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                        <Radio className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white">External CMS (Bridge)</h4>
                                        <span className="text-xs px-2 py-1 bg-[#E8B058]/20 border border-[#E8B058]/30 rounded text-[#E8B058]">
                                            Lisa / Amwin
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Connect to third-party monitoring platforms via GCXONE Bridge using standard protocols (SIA DC-09, Contact ID).
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <h5 className="text-sm font-semibold text-white mb-2">Configuration:</h5>
                                        <CodeBlock code={`# Install GCXONE Bridge (STOS)
# Configure alarm receiver:

Protocol: SIA DC-09
IP Address: [Bridge Server IP]
Port: 5000
Encryption: AES-256 (optional)
Account Format: [Your Site ID Format]`} />
                                    </div>
                                    <Link
                                        to="/docs/integrations/GCXONE-bridge-overview"
                                        className="block p-3 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded hover:bg-[#E8B058]/20 transition-colors no-underline"
                                    >
                                        <p className="text-xs text-[#E8B058] flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            View Bridge Setup Guide →
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Testing Connection */}
                        <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-[#E8B058]" />
                                Testing Your Connection
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 text-sm text-white/70">
                                    <div className="flex items-start gap-2">
                                        <span className="text-[#E8B058] font-mono">1.</span>
                                        <span>Navigate to Settings → Integrations → Test Connection</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-[#E8B058] font-mono">2.</span>
                                        <span>Click "Send Test Alarm" to verify routing</span>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-white/70">
                                    <div className="flex items-start gap-2">
                                        <span className="text-[#E8B058] font-mono">3.</span>
                                        <span>Confirm alarm appears in your CMS within 2-5 seconds</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-[#E8B058] font-mono">4.</span>
                                        <span>Check GCXONE Event Log for transmission confirmation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Step 3: Database Setup */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-[#E8B058]">3</span>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Build Your Database</h2>
                                    <p className="text-white/70 text-lg">Create organizational hierarchy and user structure</p>
                                </div>
                            </div>
                        </div>

                        {/* Hierarchy Diagram */}
                        <div className="mb-12">
                            <h3 className="text-xl font-semibold text-white mb-6">Database Structure</h3>
                            <div className="p-8 bg-[#202020] rounded-xl border border-white/10">
                                <img
                                    src={useBaseUrl('/img/getting-started/quick-start/quick-start-3.png')}
                                    alt="Database Hierarchy"
                                    className="w-full h-auto rounded-lg mb-6"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                <div className="space-y-6">
                                    {/* Company Level */}
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                            <Building2 className="w-6 h-6 text-[#E8B058]" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-white mb-2">Company / Customer Groups</h4>
                                            <p className="text-sm text-white/70 mb-3">Top-level organizational entities representing your customers or business units</p>
                                            <CodeBlock code={`# Example Structure:
- Acme Security (Parent Company)
  └── Acme Retail Division
  └── Acme Industrial Division
  └── Acme Residential Division`} />
                                        </div>
                                    </div>

                                    <div className="border-l-2 border-white/10 ml-6 pl-6 space-y-6">
                                        {/* Site Level */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                                <Building2 className="w-6 h-6 text-[#E8B058]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-2">Sites / Locations</h4>
                                                <p className="text-sm text-white/70 mb-3">Physical locations within each customer where devices are deployed</p>
                                                <CodeBlock code={`# Example Sites:
- Store #101 - Downtown Branch
  Address: 123 Main St, City
  Devices: 12 cameras, 3 sensors
  GPS: 40.7128° N, 74.0060° W
  
- Warehouse A - North Campus
  Address: 456 Industrial Way
  Devices: 24 cameras, 8 sensors
  GPS: 40.7589° N, 73.9851° W`} />
                                            </div>
                                        </div>

                                        {/* User Level */}
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                                <Users className="w-6 h-6 text-[#E8B058]" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-2">Users & Permissions</h4>
                                                <p className="text-sm text-white/70 mb-3">Assign users with role-based access control (RBAC)</p>
                                                <div className="grid grid-cols-2 gap-3 mt-3">
                                                    {[
                                                        { role: 'Admin', access: 'Full system access', icon: <Settings className="w-4 h-4" /> },
                                                        { role: 'Operator', access: 'Alarm monitoring', icon: <Bell className="w-4 h-4" /> },
                                                        { role: 'Manager', access: 'Reports & analytics', icon: <BarChart3 className="w-4 h-4" /> },
                                                        { role: 'Installer', access: 'Device setup only', icon: <Cpu className="w-4 h-4" /> }
                                                    ].map(item => (
                                                        <div key={item.role} className="p-3 bg-[#1a1a1a] rounded border border-white/5 hover:border-[#E8B058]/30 transition-all">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className="text-[#E8B058]">{item.icon}</div>
                                                                <div className="font-semibold text-white text-sm">{item.role}</div>
                                                            </div>
                                                            <div className="text-xs text-white/70">{item.access}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { title: 'Create Customers', icon: <Building2 className="w-5 h-5" />, link: '/docs/admin-guide/creating-customers', desc: 'Set up customer accounts' },
                                { title: 'Add Sites', icon: <Database className="w-5 h-5" />, link: '/docs/admin-guide/creating-sites', desc: 'Configure locations' },
                                { title: 'Manage Users', icon: <Users className="w-5 h-5" />, link: '/docs/account-management/managing-users-and-roles', desc: 'User permissions' }
                            ].map(item => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="p-4 bg-[#202020] hover:bg-[#2a2a2a] rounded-lg border border-white/10 hover:border-[#E8B058]/50 transition-all flex items-center gap-3 no-underline group"
                                >
                                    <div className="p-2 bg-[#E8B058]/20 rounded text-[#E8B058] group-hover:bg-[#E8B058]/30">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white">{item.title}</div>
                                        <div className="text-xs text-white/60">{item.desc}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-white/40 ml-auto group-hover:text-[#E8B058]" />
                                </Link>
                            ))}
                        </div>
                    </motion.section>

                    {/* Step 4: Dashboard */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center">
                                    <CheckCircle className="w-8 h-8 text-[#E8B058]" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
                                    <p className="text-white/70 text-lg">Understand your monitoring interface</p>
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div className="mb-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-2xl" />
                                <div className="relative p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <img
                                        src={useBaseUrl('/img/getting-started/quick-start/quick-start-4.png')}
                                        alt="Dashboard Preview"
                                        className="w-full h-auto rounded-lg"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dashboard Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {[
                                {
                                    icon: <Activity className="w-6 h-6" />,
                                    title: 'Active Sites Widget',
                                    desc: 'Real-time count of connected and monitoring locations',
                                    features: ['Live connection status', 'Health indicators', 'Quick filters', 'Site grouping']
                                },
                                {
                                    icon: <BarChart3 className="w-6 h-6" />,
                                    title: 'Alarm Volume Chart',
                                    desc: 'Visual analytics of alarm trends over time',
                                    features: ['24-hour trends', 'Type breakdown', 'Comparative analysis', 'Export reports']
                                },
                                {
                                    icon: <Server className="w-6 h-6" />,
                                    title: 'Device Status',
                                    desc: 'Overview of all connected hardware',
                                    features: ['Online/offline counts', 'Lifecheck status', 'Quick diagnostics', 'Device health']
                                },
                                {
                                    icon: <LayoutDashboard className="w-6 h-6" />,
                                    title: 'Customizable Widgets',
                                    desc: 'Tailor dashboard to your role and needs',
                                    features: ['Drag & drop layout', 'Role-specific views', 'Save preferences', 'Multiple dashboards']
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="p-6 bg-[#202020] rounded-lg border border-white/10 hover:border-[#E8B058]/30 transition-all">
                                    <div className="flex items-start gap-4 mb-3">
                                        <div className="p-2 bg-[#E8B058]/20 rounded-lg text-[#E8B058]">
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-white mb-1">{feature.title}</h4>
                                            <p className="text-sm text-white/70">{feature.desc}</p>
                                        </div>
                                    </div>
                                    <ul className="space-y-1 ml-14">
                                        {feature.features.map((f, i) => (
                                            <li key={i} className="text-sm text-white/70 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#E8B058]/60" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Success Message */}
                        <div className="p-8 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 border border-[#E8B058]/20 rounded-xl">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-[#E8B058]/20 border-2 border-[#E8B058]/40 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-8 h-8 text-[#E8B058]" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-white mb-2">🎉 You're All Set!</h3>
                                    <p className="text-white/80 mb-3 text-lg">
                                        Your GCXONE platform is fully configured and ready for monitoring operations.
                                    </p>
                                    <p className="text-sm text-white/70">
                                        Next step: Connect your first device to start receiving and processing alarms. 
                                        Check out our device integration guides to get started.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Next Steps */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">What's Next?</h2>
                            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                Continue your journey with these recommended guides
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                to="/quick-start/device-integration"
                                className="p-6 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#E8B058]/50 rounded-xl transition-all no-underline group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#E8B058]/20 rounded-lg">
                                        <Cpu className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#E8B058] transition-colors">
                                        Device Integration
                                    </h3>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Learn how to connect your first IP camera, sensor, or other security device to GCXONE
                                </p>
                                <div className="flex items-center text-sm text-[#E8B058] font-medium">
                                    Get Started
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <Link
                                to="/quick-start/platform-overview"
                                className="p-6 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#E8B058]/50 rounded-xl transition-all no-underline group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#E8B058]/20 rounded-lg">
                                        <LayoutDashboard className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#E8B058] transition-colors">
                                        Platform Overview
                                    </h3>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Explore the full capabilities of GCXONE including features, integrations, and advanced configurations
                                </p>
                                <div className="flex items-center text-sm text-[#E8B058] font-medium">
                                    Explore Platform
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            <Link
                                to="/getting-started"
                                className="p-6 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 hover:border-[#E8B058]/50 rounded-xl transition-all no-underline group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#E8B058]/20 rounded-lg">
                                        <BookOpen className="w-6 h-6 text-[#E8B058]" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#E8B058] transition-colors">
                                        Getting Started Hub
                                    </h3>
                                </div>
                                <p className="text-sm text-white/70 mb-4">
                                    Access all getting started guides, tutorials, and role-based documentation
                                </p>
                                <div className="flex items-center text-sm text-[#E8B058] font-medium">
                                    View All Guides
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </motion.section>

                    {/* Help Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="p-8 bg-[#202020] border border-white/10 rounded-2xl">
                            <HelpCircle className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Need Additional Help?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Our support team is here to help. Check out our troubleshooting guides or contact support for assistance.
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/docs/troubleshooting"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058]/20 hover:bg-[#E8B058]/30 border border-[#E8B058]/40 text-[#E8B058] font-medium rounded-lg transition-all no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    Troubleshooting Guide
                                </Link>
                                <Link
                                    to="/docs/support"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-lg text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <HelpCircle className="w-5 h-5" />
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
