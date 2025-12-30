import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground';
import {
    BarChart, PieChart, TrendingUp, Users, FileCheck, Award, Calendar, Mail,
    Activity, Shield, Clock, Target, Zap, Eye, Globe,
    Building, UserCheck, CheckCircle, Database, Settings,
    Network, Cloud, Smartphone, Download, FileText, Play, Headphones, DollarSign
} from 'lucide-react';

export default function ManagerLandingPage() {
    return (
        <Layout
            title="Manager Overview"
            description="Strategic insights, performance analytics, and team management for GCXONE operations leaders"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Learn by Role', href: '/#learn-by-role' },
                        { label: 'Manager' }
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
                            <BarChart className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Operations Manager</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Manager Overview
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Strategic insights, performance analytics, and team management tools for GCXONE operations leaders. 
                            Drive efficiency, ensure compliance, and optimize your security operations.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { 
                                    title: 'Performance Analytics', 
                                    description: 'Monitor team and system performance metrics',
                                    icon: <BarChart className="w-6 h-6" />,
                                    link: '/docs/admin-guide/alarm-volume-analytics'
                                },
                                { 
                                    title: 'Dashboard Overview', 
                                    description: 'Access comprehensive operational dashboards',
                                    icon: <Activity className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview'
                                },
                                { 
                                    title: 'Reporting Tools', 
                                    description: 'Generate reports and track key metrics',
                                    icon: <FileText className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview'
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

                    {/* Performance Analytics */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Performance Analytics</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Real-time insights into team performance, system health, and operational efficiency
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Executive Dashboard',
                                    description: 'High-level KPIs and performance metrics for stakeholders',
                                    icon: <BarChart className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    badge: 'Overview',
                                    color: '#10B981'
                                },
                                {
                                    title: 'Team Performance',
                                    description: 'Individual and team productivity metrics and trends',
                                    icon: <Users className="w-8 h-8" />,
                                    link: '/docs/admin-guide/alarm-volume-analytics',
                                    color: '#3B82F6'
                                },
                                {
                                    title: 'Response Analytics',
                                    description: 'Alarm processing times, escalation rates, and efficiency',
                                    icon: <TrendingUp className="w-8 h-8" />,
                                    link: '/docs/admin-guide/alarm-volume-analytics',
                                    color: '#8B5CF6'
                                },
                                {
                                    title: 'Operational Metrics',
                                    description: 'System uptime, device health, and infrastructure status',
                                    icon: <Activity className="w-8 h-8" />,
                                    link: '/docs/admin-guide/device-health-status',
                                    color: '#F59E0B'
                                },
                                {
                                    title: 'Cost Analysis',
                                    description: 'ROI tracking, cost per incident, and budget optimization',
                                    icon: <DollarSign className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    badge: 'Business',
                                    color: '#EF4444'
                                },
                                {
                                    title: 'Custom Reports',
                                    description: 'Build tailored reports for specific business requirements',
                                    icon: <FileText className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview',
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
                                                    item.badge === 'Business' ? 'bg-red-500/20 text-red-400' :
                                                    item.badge === 'Overview' ? 'bg-green-500/20 text-green-400' :
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

                    {/* Team Management */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Team Management</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Tools for managing your security operations team and optimizing workforce efficiency
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'Workforce Analytics',
                                    description: 'Comprehensive insights into team performance, productivity, and workload distribution',
                                    features: ['Individual performance tracking', 'Shift efficiency analysis', 'Workload balancing', 'Skills assessment'],
                                    icon: <Users className="w-8 h-8" />,
                                    link: '/docs/admin-guide/alarm-volume-analytics'
                                },
                                {
                                    title: 'Schedule Management',
                                    description: 'Advanced scheduling tools for 24/7 operations with automated optimization',
                                    features: ['Shift planning', 'Coverage optimization', 'Time-off management', 'Emergency scheduling'],
                                    icon: <Calendar className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview'
                                },
                                {
                                    title: 'Training & Development',
                                    description: 'Track certifications, training progress, and skill development across your team',
                                    features: ['Certification tracking', 'Training schedules', 'Skill gap analysis', 'Performance coaching'],
                                    icon: <Award className="w-8 h-8" />,
                                    link: '/docs/getting-started'
                                },
                                {
                                    title: 'Quality Assurance',
                                    description: 'Monitor and improve service quality with comprehensive QA tools and metrics',
                                    features: ['Call monitoring', 'Response quality scoring', 'Customer feedback', 'Improvement plans'],
                                    icon: <CheckCircle className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview'
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
                                        <div className="grid grid-cols-2 gap-2">
                                            {category.features.map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-white/60">
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

                    {/* Compliance & SLA */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Compliance & SLA Management</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Ensure regulatory compliance and maintain service level agreements with comprehensive tracking
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: 'Audit Management',
                                    description: 'Complete audit trails and compliance documentation',
                                    icon: <FileCheck className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    metrics: ['100% audit trail coverage', 'Automated compliance reports', 'Real-time monitoring']
                                },
                                {
                                    title: 'SLA Tracking',
                                    description: 'Monitor and report on service level agreement adherence',
                                    icon: <Target className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    metrics: ['99.8% SLA compliance', 'Automated alerts', 'Performance dashboards']
                                },
                                {
                                    title: 'Risk Management',
                                    description: 'Identify and mitigate operational and compliance risks',
                                    icon: <Shield className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    metrics: ['Risk assessment tools', 'Mitigation tracking', 'Incident analysis']
                                },
                                {
                                    title: 'Reporting Suite',
                                    description: 'Automated compliance and performance reporting',
                                    icon: <Mail className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    metrics: ['Scheduled reports', 'Custom templates', 'Stakeholder distribution']
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
                                            {item.metrics.map((metric, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                                    {metric}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Business Intelligence */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Business Intelligence</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Advanced analytics and insights to drive strategic decision-making and operational optimization
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Predictive Analytics',
                                    description: 'Forecast trends and anticipate operational needs',
                                    icon: <TrendingUp className="w-6 h-6" />,
                                    link: '/docs/admin-guide/alarm-volume-analytics',
                                    capabilities: ['Alarm volume forecasting', 'Resource planning', 'Trend analysis', 'Capacity modeling']
                                },
                                {
                                    title: 'ROI Analysis',
                                    description: 'Measure return on investment and cost optimization opportunities',
                                    icon: <DollarSign className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    capabilities: ['Cost per incident', 'Efficiency gains', 'Technology ROI', 'Budget optimization']
                                },
                                {
                                    title: 'Benchmarking',
                                    description: 'Compare performance against industry standards and best practices',
                                    icon: <BarChart className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    capabilities: ['Industry comparisons', 'Performance baselines', 'Best practice identification', 'Improvement targets']
                                }
                            ].map((capability, idx) => (
                                <motion.div
                                    key={capability.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={capability.link}
                                        className="group block h-full p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {capability.icon}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-[#E8B058] transition-colors">
                                                {capability.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-white/70 mb-4">{capability.description}</p>
                                        <div className="space-y-2">
                                            {capability.capabilities.map((item, i) => (
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
                            <BarChart className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Need Management Insights?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Get expert guidance on optimizing your security operations and maximizing team performance
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/docs/troubleshooting-support/how-to-submit-a-support-ticket"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Consulting Services
                                </Link>
                                <Link
                                    to="/docs/admin-guide/dashboard-overview"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    Analytics Guide
                                </Link>
                                <Link
                                    to="/docs/admin-guide/dashboard-overview"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all no-underline"
                                >
                                    <Users className="w-5 h-5" />
                                    Team Management
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}