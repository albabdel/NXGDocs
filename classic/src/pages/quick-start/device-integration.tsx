import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import {
    Wifi,
    Video,
    Camera,
    Cpu,
    Radio,
    Speaker,
    AlertTriangle,
    Network,
    MonitorPlay,
    Router,
    Home,
    ChevronRight,
    Eye
} from 'lucide-react';

export default function DeviceIntegration() {
    return (
        <Layout
            title="Device Integration"
            description="Connect your first device"
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
                            <Wifi className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Device Integration</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Connect Your Devices
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            Complete hardware integration guides for cameras, sensors, and monitoring systems
                        </p>
                    </motion.div>

                    {/* Network Topology Diagram */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-4">Device Connectivity Overview</h2>
                            <p className="text-slate-400 text-lg">
                                How devices connect to the GCXONE platform
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                            <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                <img
                                    src="/brain/0f57876f-36e6-4c47-95c4-bb9af8002cf5/device_topology_1764966454651.png"
                                    alt="Device Network Topology"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Prerequisites Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">Before You Connect</h2>
                                <p className="text-lg text-white/70 mb-6 leading-relaxed">
                                    Ensure your network is properly configured for device discovery and communication.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { icon: <Network className="w-5 h-5" />, title: 'Network Access', desc: 'Devices must be on the same network or accessible via port forwarding' },
                                        { icon: <Router className="w-5 h-5" />, title: 'Firewall Rules', desc: 'Configure required ports and whitelist GCXONE endpoints' },
                                        { icon: <Eye className="w-5 h-5" />, title: 'Device Discovery', desc: 'Enable UPnP or configure static IP addresses' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-[#202020] rounded-lg border border-white/10">
                                            <div className="p-2 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                                                <p className="text-sm text-white/70">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    to="/docs/installer-guide/network-configuration"
                                    className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#E8B058]/20 hover:bg-[#E8B058]/30 border border-[#E8B058]/40 text-[#E8B058] font-semibold rounded-lg transition-all no-underline"
                                >
                                    Network Configuration Guide
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="p-8 bg-[#202020] rounded-2xl border border-white/10">
                                <div className="aspect-square bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                                    <Network className="w-32 h-32 text-[#E8B058]/20" />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Device Categories */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Supported Device Categories</h2>
                            <p className="text-white/70 text-lg">
                                Select your device type to view integration guides
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    category: 'Video Management Systems',
                                    icon: <MonitorPlay className="w-8 h-8" />,
                                    devices: ['Hikvision', 'Dahua', 'Milestone', 'Hanwha'],
                                    color: 'blue',
                                    link: '/docs/devices/hikvision/overview'
                                },
                                {
                                    category: 'IP Cameras',
                                    icon: <Camera className="w-8 h-8" />,
                                    devices: ['Axis', 'ONVIF Compatible', 'RTSP Streams'],
                                    color: 'purple',
                                    link: '/docs/devices/axis/overview'
                                },
                                {
                                    category: 'AI & Analytics',
                                    icon: <Cpu className="w-8 h-8" />,
                                    devices: ['Camect', 'Reconeyez', 'Smart Detection'],
                                    color: 'cyan',
                                    link: '/docs/devices/camect/overview'
                                },
                                {
                                    category: 'IoT Sensors',
                                    icon: <Radio className="w-8 h-8" />,
                                    devices: ['Teltonika', 'Environmental', 'Motion'],
                                    color: 'green',
                                    link: '/docs/devices/teltonika/overview'
                                },
                                {
                                    category: 'Audio Devices',
                                    icon: <Speaker className="w-8 h-8" />,
                                    devices: ['SIP Speakers', 'Twilio Integration', 'Talk-Down'],
                                    color: 'orange',
                                    link: '/docs/devices/GCXONE-audio/overview'
                                },
                                {
                                    category: 'Alarm Panels',
                                    icon: <AlertTriangle className="w-8 h-8" />,
                                    devices: ['ADPRO', 'Intrusion Systems', 'Contact ID'],
                                    color: 'red',
                                    link: '/docs/devices/adpro/overview'
                                }
                            ].map((cat, idx) => (
                                <motion.div
                                    key={cat.category}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={cat.link}
                                        className="group block h-full p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4 group-hover:bg-[#E8B058]/20 transition-colors">
                                            {cat.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#E8B058] transition-colors">
                                            {cat.category}
                                        </h3>
                                        <div className="space-y-2">
                                            {cat.devices.map((device, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#E8B058]/40" />
                                                    {device}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Troubleshooting Callout */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <div className="p-8 bg-[#202020] border border-white/10 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-[#E8B058]/20 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-[#E8B058]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Having Connection Issues?</h3>
                                    <p className="text-white/70 mb-4">
                                        If your device isn't appearing or connecting, check our troubleshooting guides for common solutions.
                                    </p>
                                    <Link
                                        to="/docs/troubleshooting/device-discovery"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058]/20 hover:bg-[#E8B058]/30 border border-[#E8B058]/40 text-[#E8B058] font-semibold rounded-lg transition-all no-underline"
                                    >
                                        View Troubleshooting Guide
                                        <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="inline-flex gap-4">
                            <Link
                                to="/docs/device-integration/standard-device-onboarding-process"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                            >
                                Start Device Onboarding
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
