import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import {
    Cpu,
    Network,
    Shield,
    Cloud,
    Server,
    Database,
    Zap,
    Activity,
    Globe,
    Radio,
    Home,
    ChevronRight
} from 'lucide-react';

export default function PlatformOverview() {
    return (
        <Layout
            title="Platform Overview"
            description="Core concepts, architecture, and CMS integration ecosystems"
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
                            <span className="text-[#E8B058] font-medium">Platform Overview</span>
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
                            <Cpu className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Platform Overview</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Understanding GCXONE Architecture
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            Explore the foundation of NXGEN GCXONE, from microservices architecture to CMS integrations
                        </p>
                    </motion.div>

                    {/* Architecture Diagram Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">System Architecture</h2>
                                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                    GCXONE is built on a modern microservices architecture, providing scalability, reliability, and flexibility for enterprise security operations.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { icon: <Network className="w-5 h-5" />, title: 'Microservices Design', desc: 'Modular, independently deployable services' },
                                        { icon: <Cloud className="w-5 h-5" />, title: 'Cloud-Native', desc: 'Built for AWS with Kubernetes orchestration' },
                                        { icon: <Shield className="w-5 h-5" />, title: 'Enterprise Security', desc: 'End-to-end encryption and RBAC' }
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
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                                <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <img
                                        src="/brain/0f57876f-36e6-4c47-95c4-bb9af8002cf5/platform_architecture_1764966415283.png"
                                        alt="Platform Architecture Diagram"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Core Concepts Cards */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Core Concepts</h2>
                            <p className="text-white/70 text-lg max-w-2xl mx-auto">
                                Essential building blocks of the GCXONE platform
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Cpu className="w-8 h-8" />,
                                    title: 'Central Management Hub',
                                    desc: 'Unified control center for all security operations',
                                    link: '/docs/platform-fundamentals/what-is-gcxone-GCXONE'
                                },
                                {
                                    icon: <Network className="w-8 h-8" />,
                                    title: 'Proxy Architecture',
                                    desc: 'Switchboard connectivity model for devices',
                                    link: '/docs/platform-fundamentals/proxy-architecture'
                                },
                                {
                                    icon: <Database className="w-8 h-8" />,
                                    title: 'Multi-Tenant System',
                                    desc: 'Secure isolation for customers and sites',
                                    link: '/docs/platform-fundamentals/multi-tenant-architecture'
                                },
                                {
                                    icon: <Zap className="w-8 h-8" />,
                                    title: 'Talos Integration',
                                    desc: 'Native alarm monitoring platform',
                                    link: '/docs/platform-fundamentals/what-is-evalink-talos'
                                },
                                {
                                    icon: <Radio className="w-8 h-8" />,
                                    title: 'Third-Party CMS',
                                    desc: 'Connect to Lisa, Amwin via Bridge',
                                    link: '/docs/integrations/GCXONE-bridge-overview'
                                },
                                {
                                    icon: <Cloud className="w-8 h-8" />,
                                    title: 'Cloud Infrastructure',
                                    desc: 'AWS-powered, Kubernetes-managed',
                                    link: '/docs/installer-guide/cloud-infrastructure'
                                }
                            ].map((card, idx) => (
                                <motion.div
                                    key={card.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={card.link}
                                        className="group block h-full p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4 group-hover:bg-[#E8B058]/20 transition-colors">
                                            {card.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                                            {card.title}
                                        </h3>
                                        <p className="text-sm text-white/70 leading-relaxed">
                                            {card.desc}
                                        </p>
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
                        <div className="inline-flex gap-4">
                            <Link
                                to="/quick-start/guide"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                            >
                                Next: Quick Start Guide
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
