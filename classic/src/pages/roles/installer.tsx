import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground';
import {
    Wifi, Server, CheckCircle, Smartphone, Radio, Download, Cpu, Wrench, ClipboardList,
    Network, Camera, Settings, Zap, Activity, Shield, Eye,
    MapPin, Clock, Target, HardDrive, Layers, Box, FileText,
    AlertTriangle, TrendingUp, Globe, BarChart3, Users, Calendar, Headphones
} from 'lucide-react';

export default function InstallerLandingPage() {
    return (
        <Layout
            title="Installer Toolkit"
            description="Technical resources and field tools for GCXONE site commissioning and device integration"
        >
            <LandingPageBackground />
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Learn by Role', href: '/#learn-by-role' },
                        { label: 'Installer' }
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
                            <Wrench className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Field Technician</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Installer Toolkit
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Complete technical resources for GCXONE site commissioning, device integration, 
                            and field troubleshooting. Get sites online fast with professional-grade tools.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { 
                                    title: 'Site Commissioning', 
                                    description: 'Step-by-step installation procedures',
                                    icon: <ClipboardList className="w-6 h-6" />,
                                    link: '/docs/installer-guide/installation-overview'
                                },
                                { 
                                    title: 'Device Integration', 
                                    description: 'Connect cameras and security devices',
                                    icon: <Camera className="w-6 h-6" />,
                                    link: '/docs/devices/general/onboarding-overview'
                                },
                                { 
                                    title: 'Network Setup', 
                                    description: 'Configure network and connectivity',
                                    icon: <Network className="w-6 h-6" />,
                                    link: '/docs/installer-guide/network-setup'
                                }
                            ].map((feature, idx) => (
                                <Link
                                    key={idx}
                                    to={feature.link}
                                    className="group p-6 bg-white/5 rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all text-center no-underline"
                                >
                                    <div className="flex justify-center mb-3 text-[#E8B058]">
                                        {feature.icon}
                                    </div>
                                    <div className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">{feature.title}</div>
                                    <div className="text-xs text-white/70">{feature.description}</div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>

                    {/* Site Commissioning */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Site Commissioning</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Step-by-step guides for preparing and configuring new GCXONE installations
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Pre-Installation Survey',
                                    description: 'Site assessment checklist and bandwidth calculations',
                                    icon: <ClipboardList className="w-8 h-8" />,
                                    link: '/docs/installer-guide/site-survey',
                                    badge: 'Start Here',
                                    color: '#10B981'
                                },
                                {
                                    title: 'Network Configuration',
                                    description: 'Port forwarding, firewall rules, and VLAN setup',
                                    icon: <Network className="w-8 h-8" />,
                                    link: '/docs/installer-guide/network-setup',
                                    badge: 'Critical',
                                    color: '#EF4444'
                                },
                                {
                                    title: 'Hardware Requirements',
                                    description: 'Server specs, appliance setup, and storage planning',
                                    icon: <Server className="w-8 h-8" />,
                                    link: '/docs/installer-guide/storage-requirements',
                                    color: '#3B82F6'
                                },
                                {
                                    title: 'Device Discovery',
                                    description: 'Automatic network scanning and device identification',
                                    icon: <Eye className="w-8 h-8" />,
                                    link: '/docs/devices/general/discovery-methods',
                                    color: '#8B5CF6'
                                },
                                {
                                    title: 'System Testing',
                                    description: 'Connectivity verification and alarm transmission tests',
                                    icon: <CheckCircle className="w-8 h-8" />,
                                    link: '/docs/installer-guide/installation-overview',
                                    color: '#F59E0B'
                                },
                                {
                                    title: 'Go-Live Checklist',
                                    description: 'Final validation and handover procedures',
                                    icon: <Target className="w-8 h-8" />,
                                    link: '/docs/installer-guide/installation-overview',
                                    badge: 'Final Step',
                                    color: '#06B6D4'
                                }
                            ].map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={item.link}
                                        className="group block h-full p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div 
                                                className="p-3 rounded-lg"
                                                style={{ backgroundColor: `${item.color}20`, color: item.color }}
                                            >
                                                {item.icon}
                                            </div>
                                            {item.badge && (
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    item.badge === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                                    item.badge === 'Start Here' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                                }`}>
                                                    {item.badge}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#E8B058] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Device Integration */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Device Integration</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Connect cameras, sensors, and security devices to the GCXONE platform
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'Camera Integration',
                                    description: 'Connect IP cameras from all major manufacturers with automatic configuration',
                                    features: ['Auto-discovery via ONVIF', 'Stream optimization', 'Motion detection setup', 'PTZ calibration'],
                                    icon: <Camera className="w-8 h-8" />,
                                    link: '/docs/devices/general/onboarding-overview',
                                    brands: ['Hikvision', 'Axis', 'Dahua', 'Hanwha']
                                },
                                {
                                    title: 'NVR & VMS Systems',
                                    description: 'Integrate existing recording systems and video management platforms',
                                    features: ['SDK integration', 'Playback configuration', 'Event synchronization', 'Storage mapping'],
                                    icon: <Server className="w-8 h-8" />,
                                    link: '/docs/devices/general/onboarding-overview',
                                    brands: ['Milestone', 'Avigilon', 'NX Witness', 'Genetec']
                                },
                                {
                                    title: 'IoT Sensors',
                                    description: 'Connect wireless sensors and environmental monitoring devices',
                                    features: ['Wireless pairing', 'Battery monitoring', 'Zone configuration', 'Alarm mapping'],
                                    icon: <Radio className="w-8 h-8" />,
                                    link: '/docs/devices/general/onboarding-overview',
                                    brands: ['Ajax', 'Teltonika', 'Reconeyez', 'Essence']
                                },
                                {
                                    title: 'AI Analytics Boxes',
                                    description: 'Integrate edge AI devices for advanced video analytics',
                                    features: ['API configuration', 'Model deployment', 'Event processing', 'Performance tuning'],
                                    icon: <Cpu className="w-8 h-8" />,
                                    link: '/docs/devices/general/onboarding-overview',
                                    brands: ['Camect', 'Ganz AI', 'Davantis', 'Custom']
                                }
                            ].map((category, idx) => (
                                <motion.div
                                    key={category.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={category.link}
                                        className="group block h-full p-8 bg-gradient-to-br from-[#202020] to-[#1a1a1a] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {category.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                    {category.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-white/70 mb-6">{category.description}</p>
                                        
                                        <div className="mb-6">
                                            <div className="text-sm font-medium text-white/80 mb-3">Key Features:</div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {category.features.map((feature, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                                                        <CheckCircle className="w-3 h-3 text-green-400" />
                                                        {feature}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-sm font-medium text-white/80 mb-2">Supported Brands:</div>
                                            <div className="flex flex-wrap gap-2">
                                                {category.brands.map((brand, i) => (
                                                    <span key={i} className="px-2 py-1 text-xs bg-white/10 rounded text-white/70">
                                                        {brand}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Field Tools */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Field Tools & Apps</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Mobile apps and diagnostic tools for on-site commissioning and troubleshooting
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: 'Mobile Commissioning',
                                    description: 'Commission sites directly from your smartphone',
                                    icon: <Smartphone className="w-6 h-6" />,
                                    link: '/docs/installer-guide/installation-overview',
                                    features: ['QR code scanning', 'Device pairing', 'Network testing', 'Site validation']
                                },
                                {
                                    title: 'Network Diagnostics',
                                    description: 'Test connectivity and bandwidth requirements',
                                    icon: <Wifi className="w-6 h-6" />,
                                    link: '/docs/installer-guide/network-setup',
                                    features: ['Speed testing', 'Latency checks', 'Port scanning', 'Firewall validation']
                                },
                                {
                                    title: 'Camera Calibration',
                                    description: 'Optimize camera settings and analytics zones',
                                    icon: <Settings className="w-6 h-6" />,
                                    link: '/docs/installer-guide/device-installation',
                                    features: ['Auto-focus', 'Exposure tuning', 'Zone setup', 'Analytics testing']
                                },
                                {
                                    title: 'Firmware Manager',
                                    description: 'Download and deploy latest device firmware',
                                    icon: <Download className="w-6 h-6" />,
                                    link: '/docs/installer-guide/device-installation',
                                    features: ['Version checking', 'Bulk updates', 'Rollback support', 'Compatibility matrix']
                                }
                            ].map((tool, idx) => (
                                <motion.div
                                    key={tool.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={tool.link}
                                        className="group block h-full p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4">
                                            {tool.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#E8B058] transition-colors">
                                            {tool.title}
                                        </h3>
                                        <p className="text-sm text-white/70 mb-4">{tool.description}</p>
                                        <div className="space-y-1">
                                            {tool.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Troubleshooting */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Troubleshooting & Support</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Common issues, diagnostic procedures, and escalation paths for field problems
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Common Issues',
                                    description: 'Quick fixes for frequently encountered problems',
                                    icon: <AlertTriangle className="w-6 h-6" />,
                                    link: '/docs/troubleshooting-support/common-issues',
                                    items: ['Device offline', 'Stream quality issues', 'Network connectivity', 'Authentication failures']
                                },
                                {
                                    title: 'Diagnostic Procedures',
                                    description: 'Step-by-step troubleshooting workflows',
                                    icon: <ClipboardList className="w-6 h-6" />,
                                    link: '/docs/troubleshooting-support/common-issues',
                                    items: ['Network testing', 'Device health checks', 'Log analysis', 'Performance monitoring']
                                },
                                {
                                    title: 'Support Escalation',
                                    description: 'When and how to escalate complex issues',
                                    icon: <Headphones className="w-6 h-6" />,
                                    link: '/docs/troubleshooting-support/how-to-submit-a-support-ticket',
                                    items: ['Remote assistance', 'Technical escalation', 'Emergency support', 'RMA procedures']
                                }
                            ].map((section, idx) => (
                                <motion.div
                                    key={section.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={section.link}
                                        className="group block h-full p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {section.icon}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                {section.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-white/70 mb-4">{section.description}</p>
                                        <div className="space-y-2">
                                            {section.items.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
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
                            <Wrench className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Need Installation Support?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Get expert assistance with complex installations and technical challenges
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/docs/troubleshooting-support/how-to-submit-a-support-ticket"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Field Support
                                </Link>
                                <Link
                                    to="/docs/installer-guide/installation-overview"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    Installation Guide
                                </Link>
                                <Link
                                    to="/docs/installer-guide/installation-overview"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all no-underline"
                                >
                                    <Smartphone className="w-5 h-5" />
                                    Mobile App
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}