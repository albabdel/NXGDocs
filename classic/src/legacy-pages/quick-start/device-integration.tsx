import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from '@docusaurus/Link';
import LandingPageBackground from '../../components/LandingPageBackground';
import { useProduct } from '@theme/Root';
import {
    Wifi, Video, Camera, Cpu, Radio, Speaker, AlertTriangle, Network, MonitorPlay, Router,
    Home, ChevronRight, Eye, Server, Database, Cloud, Smartphone, Settings, Zap, Activity,
    Shield, CheckCircle, Play, Pause, Bell, Clock, Target, HardDrive, Layers, Box,
    ArrowRight, Download, FileText, Users, MapPin, Building, Globe, BarChart3, TrendingUp,
    Plug, Search, Filter, X, Sparkles, Calendar, MessageSquare, Headphones
} from 'lucide-react';

export default function DeviceIntegration() {
    const { productName } = useProduct();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const integrationSteps = [
        {
            title: 'Device Discovery',
            desc: 'Automatic network scanning and device identification',
            icon: <Search className="w-6 h-6" />,
            color: '#10B981',
            details: 'The platform automatically discovers compatible devices on your network using UPnP, ONVIF, and manufacturer-specific protocols.'
        },
        {
            title: 'Protocol Translation',
            desc: 'Universal proxy layer converts device protocols',
            icon: <Network className="w-6 h-6" />,
            color: '#3B82F6',
            details: 'Our proxy architecture translates proprietary protocols into standardized streams for seamless cloud integration.'
        },
        {
            title: 'Cloud Registration',
            desc: 'Secure device enrollment and authentication',
            icon: <Shield className="w-6 h-6" />,
            color: '#8B5CF6',
            details: 'Devices are securely registered with encrypted communication channels and unique authentication tokens.'
        },
        {
            title: 'Live Monitoring',
            desc: 'Real-time streaming and AI analytics activation',
            icon: <Activity className="w-6 h-6" />,
            color: '#F59E0B',
            details: 'Once integrated, devices provide live streams with AI-powered analytics and 24/7 monitoring capabilities.'
        }
    ];

    const deviceCategories = [
        {
            id: 'nvr',
            name: 'Network Video Recorders',
            icon: <Server className="w-8 h-8" />,
            count: 15,
            description: 'Professional NVR systems with multi-channel recording',
            brands: ['Hikvision', 'Dahua', 'Uniview', 'ADPRO', 'Hanwha'],
            features: ['Multi-channel recording', 'Local storage', 'Remote access', 'PTZ control'],
            color: '#EF4444'
        },
        {
            id: 'vms',
            name: 'Video Management Systems',
            icon: <Database className="w-8 h-8" />,
            count: 12,
            description: 'Enterprise VMS platforms for large-scale deployments',
            brands: ['Milestone', 'Avigilon', 'NX Witness', 'Axis Camera Station'],
            features: ['Centralized management', 'Advanced analytics', 'Multi-site support', 'API integration'],
            color: '#10B981'
        },
        {
            id: 'cameras',
            name: 'IP Cameras',
            icon: <Camera className="w-8 h-8" />,
            count: 8,
            description: 'Direct IP camera integration with ONVIF support',
            brands: ['Axis', 'Hikvision', 'Mobotix', 'ONVIF Compatible'],
            features: ['Direct streaming', 'Motion detection', 'Audio support', 'PTZ capabilities'],
            color: '#3B82F6'
        },
        {
            id: 'ai',
            name: 'AI Analytics Boxes',
            icon: <Cpu className="w-8 h-8" />,
            count: 4,
            description: 'Edge AI devices for intelligent video analytics',
            brands: ['Camect', 'Ganz AI', 'Davantis'],
            features: ['Edge processing', 'Person detection', 'Vehicle recognition', 'Behavioral analysis'],
            color: '#8B5CF6'
        },
        {
            id: 'iot',
            name: 'IoT Sensors',
            icon: <Radio className="w-8 h-8" />,
            count: 11,
            description: 'Wireless sensors and environmental monitoring',
            brands: ['Ajax', 'Reconeyez', 'Teltonika', 'Essence'],
            features: ['Wireless connectivity', 'Battery powered', 'Environmental monitoring', 'Alarm integration'],
            color: '#F59E0B'
        },
        {
            id: 'cloud',
            name: 'Cloud Platforms',
            icon: <Cloud className="w-8 h-8" />,
            count: 6,
            description: 'Cloud-based video management and P2P systems',
            brands: ['Hikpro P2P', 'Dahua Dolynk', 'NXG Cloud'],
            features: ['P2P connectivity', 'Cloud storage', 'Remote access', 'Mobile apps'],
            color: '#06B6D4'
        }
    ];

    const quickStartGuides = [
        {
            title: 'Hikvision NVR Setup',
            description: 'Complete guide for Hikvision NVR integration',
            duration: '15 min',
            difficulty: 'Beginner',
            icon: <Server className="w-6 h-6" />,
            steps: ['Network configuration', 'Device discovery', 'Stream setup', 'Event configuration']
        },
        {
            title: 'Axis Camera Integration',
            description: 'Direct IP camera connection via ONVIF',
            duration: '10 min',
            difficulty: 'Beginner',
            link: '/docs/devices',
            icon: <Camera className="w-6 h-6" />,
            steps: ['ONVIF setup', 'Stream configuration', 'Motion detection', 'Audio setup']
        },
        {
            title: 'Camect AI Box',
            description: 'AI-powered edge analytics integration',
            duration: '20 min',
            difficulty: 'Intermediate',
            link: '/docs/devices',
            icon: <Cpu className="w-6 h-6" />,
            steps: ['API configuration', 'Event mapping', 'AI model setup', 'Alert routing']
        },
        {
            title: 'Ajax IoT Sensors',
            description: 'Wireless sensor network integration',
            duration: '25 min',
            difficulty: 'Advanced',
            link: '/docs/devices',
            icon: <Radio className="w-6 h-6" />,
            steps: ['Hub configuration', 'Device pairing', 'Zone mapping', 'Alarm integration']
        }
    ];

    const networkRequirements = [
        {
            title: 'Bandwidth Requirements',
            icon: <Wifi className="w-6 h-6" />,
            items: [
                '1080p Camera: 2-4 Mbps upload',
                '4K Camera: 8-12 Mbps upload',
                'NVR (8 channels): 16-32 Mbps upload',
                'Recommended: 50+ Mbps for multiple devices'
            ]
        },
        {
            title: 'Network Ports',
            icon: <Network className="w-6 h-6" />,
            items: [
                'RTSP: 554 (TCP)',
                'HTTP/HTTPS: 80/443 (TCP)',
                'ONVIF: 80, 8080 (TCP)',
                'Custom ports: Device specific'
            ]
        },
        {
            title: 'Security Requirements',
            icon: <Shield className="w-6 h-6" />,
            items: [
                'WPA2/WPA3 wireless encryption',
                'VLAN segmentation recommended',
                'Firewall rules for device access',
                'Regular firmware updates'
            ]
        }
    ];

    return (
        <Layout
            title="Device Integration Guide"
            description="Complete guide to connecting devices to the platform"
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
                            <Link to="/#quick-start" className="text-slate-400 hover:text-white transition-colors no-underline">
                                Quick Start
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Device Integration</span>
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
                            <Plug className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">50+ Supported Devices</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Device Integration Guide
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Connect cameras, NVRs, sensors, and IoT devices with our comprehensive integration guides. 
                            Universal compatibility through advanced proxy architecture.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {[
                                { label: 'Supported Devices', value: '50+', icon: <Plug className="w-5 h-5" /> },
                                { label: 'Manufacturers', value: '25+', icon: <Building className="w-5 h-5" /> },
                                { label: 'Integration Time', value: '<15min', icon: <Clock className="w-5 h-5" /> },
                                { label: 'Success Rate', value: '99.2%', icon: <CheckCircle className="w-5 h-5" /> }
                            ].map((stat, idx) => (
                                <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/10 text-center">
                                    <div className="flex justify-center mb-2 text-[#E8B058]">
                                        {stat.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-xs text-white/70">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Integration Process */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">4-Step Integration Process</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Our streamlined process gets your devices connected and monitored in minutes
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            {integrationSteps.map((step, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className={`relative p-6 rounded-xl border transition-all duration-300 ${
                                        activeStep === idx 
                                            ? 'bg-white/10 border-[#E8B058] shadow-lg shadow-[#E8B058]/20' 
                                            : 'bg-[#202020] border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div 
                                            className="p-2 rounded-lg"
                                            style={{ backgroundColor: `${step.color}20`, color: step.color }}
                                        >
                                            {step.icon}
                                        </div>
                                        <div className="text-2xl font-bold text-white">{idx + 1}</div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                                    <p className="text-sm text-white/70 mb-3">{step.desc}</p>
                                    <p className="text-xs text-white/60">{step.details}</p>
                                    {idx < 3 && (
                                        <ArrowRight className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-[#E8B058] hidden md:block" />
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        {/* Integration Flow Diagram */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                            <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                <svg viewBox="0 0 800 300" className="w-full h-auto">
                                    {/* Device Integration Flow Diagram */}
                                    <defs>
                                        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#E8B058" />
                                            <stop offset="100%" stopColor="#3B82F6" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* On-Premise Devices */}
                                    <rect x="50" y="50" width="120" height="200" rx="10" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                    <text x="110" y="35" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">On-Premise</text>
                                    
                                    <rect x="70" y="70" width="80" height="30" rx="4" fill="#EF4444" stroke="white" strokeWidth="1" />
                                    <text x="110" y="88" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">NVR Systems</text>
                                    
                                    <rect x="70" y="110" width="80" height="30" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                    <text x="110" y="128" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">IP Cameras</text>
                                    
                                    <rect x="70" y="150" width="80" height="30" rx="4" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                    <text x="110" y="168" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">IoT Sensors</text>
                                    
                                    <rect x="70" y="190" width="80" height="30" rx="4" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                    <text x="110" y="208" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AI Boxes</text>
                                    
                                    {/* Network Layer */}
                                    <rect x="220" y="100" width="100" height="100" rx="8" fill="#232F3E" stroke="#E8B058" strokeWidth="2" />
                                    <text x="270" y="85" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">Network Layer</text>
                                    
                                    <rect x="235" y="120" width="70" height="25" rx="3" fill="#3B82F6" stroke="white" strokeWidth="1" />
                                    <text x="270" y="135" textAnchor="middle" fill="white" fontSize="9">Discovery</text>
                                    
                                    <rect x="235" y="155" width="70" height="25" rx="3" fill="#06B6D4" stroke="white" strokeWidth="1" />
                                    <text x="270" y="170" textAnchor="middle" fill="white" fontSize="9">Protocol Bridge</text>
                                    
                                    {/* Platform Cloud */}
                                    <rect x="370" y="50" width="120" height="200" rx="10" fill="#1a1a1a" stroke="#E8B058" strokeWidth="2" />
                                    <text x="430" y="35" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">{productName} Cloud</text>
                                    
                                    <rect x="385" y="70" width="90" height="30" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                    <text x="430" y="88" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Stream Processing</text>
                                    
                                    <rect x="385" y="110" width="90" height="30" rx="4" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                    <text x="430" y="128" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AI Analytics</text>
                                    
                                    <rect x="385" y="150" width="90" height="30" rx="4" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                    <text x="430" y="168" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Event Processing</text>
                                    
                                    <rect x="385" y="190" width="90" height="30" rx="4" fill="#06B6D4" stroke="white" strokeWidth="1" />
                                    <text x="430" y="208" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Storage & API</text>
                                    
                                    {/* Client Applications */}
                                    <rect x="540" y="50" width="120" height="200" rx="10" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                    <text x="600" y="35" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">Client Access</text>
                                    
                                    <rect x="555" y="70" width="90" height="30" rx="4" fill="#3B82F6" stroke="white" strokeWidth="1" />
                                    <text x="600" y="88" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Web Dashboard</text>
                                    
                                    <rect x="555" y="110" width="90" height="30" rx="4" fill="#D946EF" stroke="white" strokeWidth="1" />
                                    <text x="600" y="128" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Mobile Apps</text>
                                    
                                    <rect x="555" y="150" width="90" height="30" rx="4" fill="#EF4444" stroke="white" strokeWidth="1" />
                                    <text x="600" y="168" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Talos CMS</text>
                                    
                                    <rect x="555" y="190" width="90" height="30" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                    <text x="600" y="208" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">API Access</text>
                                    
                                    {/* Connection Arrows */}
                                    <path d="M 170 150 L 200 150 L 220 150" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowFlow)" />
                                    <path d="M 320 150 L 350 150 L 370 150" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowFlow)" />
                                    <path d="M 490 150 L 520 150 L 540 150" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowFlow)" />
                                    
                                    {/* Arrow marker */}
                                    <defs>
                                        <marker id="arrowFlow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                            <polygon points="0 0, 8 3, 0 6" fill="#E8B058" />
                                        </marker>
                                    </defs>
                                    
                                    {/* Data Flow Labels */}
                                    <text x="400" y="280" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">Universal Device Integration Pipeline</text>
                                </svg>
                            </div>
                        </div>
                    </motion.section>

                    {/* Device Categories */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Supported Device Categories</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Browse by device type to find specific integration guides and compatibility information
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {deviceCategories.map((category, idx) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div 
                                            className="p-3 rounded-lg"
                                            style={{ backgroundColor: `${category.color}20`, color: category.color }}
                                        >
                                            {category.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                {category.name}
                                            </h3>
                                            <div className="text-sm text-white/70">{category.count} devices supported</div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-white/70 mb-4">{category.description}</p>
                                    
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-white/80 mb-2">Popular Brands:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {category.brands.slice(0, 3).map((brand, i) => (
                                                <span key={i} className="px-2 py-1 text-xs bg-white/10 rounded text-white/70">
                                                    {brand}
                                                </span>
                                            ))}
                                            {category.brands.length > 3 && (
                                                <span className="px-2 py-1 text-xs bg-white/10 rounded text-white/70">
                                                    +{category.brands.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-white/80 mb-2">Key Features:</div>
                                        <div className="space-y-1">
                                            {category.features.slice(0, 2).map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <Link
                                        to="/integration-hub"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-[#E8B058] hover:text-[#D4A047] transition-colors no-underline"
                                    >
                                        View All Devices
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Quick Start Guides */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Popular Integration Guides</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Step-by-step tutorials for the most commonly integrated devices
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {quickStartGuides.map((guide, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={guide.link}
                                        className="group block p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] group-hover:bg-[#E8B058]/20 transition-colors">
                                                {guide.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                                                    {guide.title}
                                                </h3>
                                                <p className="text-sm text-white/70 mb-3">{guide.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-white/60">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {guide.duration}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Target className="w-3 h-3" />
                                                        {guide.difficulty}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="text-xs font-medium text-white/80 mb-2">Integration Steps:</div>
                                            {guide.steps.map((step, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                                                    <div className="w-4 h-4 rounded-full bg-[#E8B058]/20 text-[#E8B058] flex items-center justify-center text-xs font-bold">
                                                        {i + 1}
                                                    </div>
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Network Requirements */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Network Requirements</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Ensure your network meets these requirements for optimal device integration
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {networkRequirements.map((req, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-[#202020] rounded-xl border border-white/10"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                            {req.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{req.title}</h3>
                                    </div>
                                    <div className="space-y-2">
                                        {req.items.map((item, i) => (
                                            <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                                                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
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
                            <Plug className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Ready to Connect Your Devices?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Browse our complete device catalog or start with our general onboarding guide
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/integration-hub"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Search className="w-5 h-5" />
                                    Browse All Devices
                                </Link>
                                <Link
                                    to="/docs/devices"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    General Setup Guide
                                </Link>
                                <Link
                                    to="/docs/support/contact"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all no-underline"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Get Support
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}