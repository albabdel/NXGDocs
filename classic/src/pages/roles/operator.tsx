import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground';
import {
    Bell, Video, Activity, ClipboardList, Search, Phone, MapPin, Clock, Eye,
    Shield, Target, Zap, CheckCircle, Users, Settings,
    Network, Camera, Smartphone, Download, FileText, Play, Headphones,
    AlertTriangle, TrendingUp, Globe, BarChart3, Calendar, Monitor
} from 'lucide-react';

export default function OperatorLandingPage() {
    return (
        <Layout
            title="Operator Workspace"
            description="Mission control center for real-time monitoring, alarm response, and security operations"
        >
            <LandingPageBackground />
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Learn by Role', href: '/#learn-by-role' },
                        { label: 'Operator' }
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
                            <Monitor className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Security Operator</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Operator Workspace
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Your mission control center for real-time monitoring, alarm response, and security operations. 
                            Advanced tools for rapid threat assessment and professional incident management.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { 
                                    title: 'Alarm Processing', 
                                    description: 'Handle and respond to security alarms',
                                    icon: <Bell className="w-6 h-6" />,
                                    link: '/docs/operator-guide/handling-alarms'
                                },
                                { 
                                    title: 'Live Video Monitoring', 
                                    description: 'Monitor real-time video feeds and PTZ control',
                                    icon: <Video className="w-6 h-6" />,
                                    link: '/docs/operator-guide/live-video'
                                },
                                { 
                                    title: 'Event Investigation', 
                                    description: 'Review historical events and video playback',
                                    icon: <Search className="w-6 h-6" />,
                                    link: '/docs/operator-guide/video-playback'
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

                    {/* Core Operations */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Core Operations</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Essential tools for daily monitoring, alarm processing, and incident response
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Alarm Processing',
                                    description: 'Handle incoming alarms with AI-verified video clips and context',
                                    icon: <Bell className="w-8 h-8" />,
                                    link: '/docs/operator-guide/handling-alarms',
                                    badge: 'Primary',
                                    color: '#EF4444'
                                },
                                {
                                    title: 'Live Video Monitoring',
                                    description: 'Real-time video feeds with PTZ control and digital zoom',
                                    icon: <Video className="w-8 h-8" />,
                                    link: '/docs/operator-guide/live-video',
                                    color: '#10B981'
                                },
                                {
                                    title: 'Event Investigation',
                                    description: 'Search historical events and review recorded footage',
                                    icon: <Search className="w-8 h-8" />,
                                    link: '/docs/operator-guide/video-playback',
                                    color: '#3B82F6'
                                },
                                {
                                    title: 'Response Procedures',
                                    description: 'Standard operating procedures for different alarm types',
                                    icon: <ClipboardList className="w-8 h-8" />,
                                    link: '/docs/operator-guide/response-procedures',
                                    color: '#8B5CF6'
                                },
                                {
                                    title: 'Communication Tools',
                                    description: 'Contact authorities, keyholders, and emergency services',
                                    icon: <Phone className="w-8 h-8" />,
                                    link: '/docs/operator-guide/communication-tools',
                                    color: '#F59E0B'
                                },
                                {
                                    title: 'Site Navigation',
                                    description: 'Interactive maps, floor plans, and location services',
                                    icon: <MapPin className="w-8 h-8" />,
                                    link: '/docs/operator-guide/site-navigation',
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
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
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

                    {/* Advanced Features */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Advanced Operator Tools</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Professional-grade features for experienced operators and complex scenarios
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'AI-Assisted Verification',
                                    description: 'Leverage artificial intelligence to quickly verify threats and reduce false alarms',
                                    features: ['Automated threat classification', 'Behavioral analysis', 'Object recognition', 'Smart filtering'],
                                    icon: <Eye className="w-8 h-8" />,
                                    link: '/docs/operator-guide/operator-dashboard'
                                },
                                {
                                    title: 'Multi-Site Operations',
                                    description: 'Manage multiple locations simultaneously with unified command and control',
                                    features: ['Centralized monitoring', 'Cross-site coordination', 'Resource allocation', 'Priority management'],
                                    icon: <Globe className="w-8 h-8" />,
                                    link: '/docs/operator-guide/multi-site-monitoring'
                                },
                                {
                                    title: 'Emergency Response',
                                    description: 'Specialized tools and procedures for critical incidents and emergency situations',
                                    features: ['Emergency protocols', 'Mass notification', 'Incident escalation', 'Crisis management'],
                                    icon: <AlertTriangle className="w-8 h-8" />,
                                    link: '/docs/operator-guide/emergency-procedures'
                                },
                                {
                                    title: 'Performance Analytics',
                                    description: 'Track your performance metrics and identify areas for improvement',
                                    features: ['Response time tracking', 'Accuracy metrics', 'Productivity analysis', 'Skill development'],
                                    icon: <BarChart3 className="w-8 h-8" />,
                                    link: '/docs/operator-guide/performance-metrics'
                                }
                            ].map((feature, idx) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={feature.link}
                                        className="group block h-full p-8 bg-gradient-to-br from-[#202020] to-[#1a1a1a] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-4 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                    {feature.title}
                                                </h3>
                                            </div>
                                        </div>
                                        <p className="text-white/70 mb-6">{feature.description}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {feature.features.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-white/60">
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

                    {/* Shift Management */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Shift Management</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Tools for managing your shift, handovers, and maintaining operational continuity
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: 'Shift Handover',
                                    description: 'Document and transfer critical information between shifts',
                                    icon: <Users className="w-6 h-6" />,
                                    link: '/docs/operator-guide/shift-handover',
                                    tasks: ['Incident summaries', 'Ongoing investigations', 'System status', 'Priority alerts']
                                },
                                {
                                    title: 'Incident Reporting',
                                    description: 'Create detailed reports for security incidents and responses',
                                    icon: <FileText className="w-6 h-6" />,
                                    link: '/docs/operator-guide/incident-reporting',
                                    tasks: ['Incident documentation', 'Evidence collection', 'Timeline creation', 'Report generation']
                                },
                                {
                                    title: 'System Monitoring',
                                    description: 'Monitor system health and device status across all sites',
                                    icon: <Activity className="w-6 h-6" />,
                                    link: '/docs/operator-guide/system-monitoring',
                                    tasks: ['Device health checks', 'Network status', 'Performance metrics', 'Alert management']
                                },
                                {
                                    title: 'Quality Assurance',
                                    description: 'Maintain high service standards and continuous improvement',
                                    icon: <Target className="w-6 h-6" />,
                                    link: '/docs/operator-guide/quality-assurance',
                                    tasks: ['Response quality', 'Customer feedback', 'Process improvement', 'Training needs']
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
                                        <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#E8B058] transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-white/70 mb-4">{item.description}</p>
                                        <div className="space-y-1">
                                            {item.tasks.map((task, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                                    {task}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Training & Resources */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Training & Resources</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Continuous learning resources to enhance your skills and stay current with best practices
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Video Training',
                                    description: 'Interactive video tutorials and scenario-based training',
                                    icon: <Play className="w-6 h-6" />,
                                    link: '/docs/operator-guide/training-guide',
                                    resources: ['Alarm handling basics', 'Advanced video tools', 'Emergency procedures', 'System navigation']
                                },
                                {
                                    title: 'Best Practices',
                                    description: 'Industry standards and proven operational methodologies',
                                    icon: <Shield className="w-6 h-6" />,
                                    link: '/docs/operator-guide/best-practices',
                                    resources: ['Response protocols', 'Communication standards', 'Quality guidelines', 'Safety procedures']
                                },
                                {
                                    title: 'Certification',
                                    description: 'Professional certification programs and skill assessments',
                                    icon: <CheckCircle className="w-6 h-6" />,
                                    link: '/docs/operator-guide/training-guide',
                                    resources: ['Skill assessments', 'Certification tracks', 'Continuing education', 'Performance reviews']
                                }
                            ].map((resource, idx) => (
                                <motion.div
                                    key={resource.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={resource.link}
                                        className="group block h-full p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {resource.icon}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                {resource.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-white/70 mb-4">{resource.description}</p>
                                        <div className="space-y-2">
                                            {resource.resources.map((item, i) => (
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
                            <Monitor className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Need Operational Support?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Get assistance with complex incidents, technical issues, or operational procedures
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/docs/troubleshooting-support/how-to-submit-a-support-ticket"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Headphones className="w-5 h-5" />
                                    24/7 Support
                                </Link>
                                <Link
                                    to="/docs/operator-guide/operator-dashboard"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    Operator Guide
                                </Link>
                                <Link
                                    to="/docs/operator-guide/training-guide"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all no-underline"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    Get Certified
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}