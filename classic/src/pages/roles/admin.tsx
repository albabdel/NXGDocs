import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground';
import {
    Users, Settings, Shield, Database, Activity, Globe, Lock, FileText, 
    BarChart3, CheckCircle, Clock, Target, Zap,
    Building, UserCheck, Key, AlertTriangle, TrendingUp, Eye, Cpu,
    Network, Cloud, Smartphone, Calendar, Download, Headphones
} from 'lucide-react';

export default function AdminLandingPage() {
    return (
        <Layout
            title="Admin Workspace"
            description="Complete administrative control center for GCXONE platform management"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Learn by Role', href: '/#learn-by-role' },
                        { label: 'Admin' }
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
                            <Shield className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">System Administrator</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Admin Workspace
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            Complete control center for managing your GCXONE organization, users, security policies, 
                            and system-wide configurations. Enterprise-grade administration tools at your fingertips.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { 
                                    title: 'User Management', 
                                    description: 'Create and manage users, roles, and permissions',
                                    icon: <Users className="w-6 h-6" />,
                                    link: '/docs/admin-guide/user-management'
                                },
                                { 
                                    title: 'System Configuration', 
                                    description: 'Configure system-wide settings and preferences',
                                    icon: <Settings className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview'
                                },
                                { 
                                    title: 'Security & Access', 
                                    description: 'Manage security policies and access controls',
                                    icon: <Shield className="w-6 h-6" />,
                                    link: '/docs/admin-guide/rbac'
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

                    {/* Core Administration */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Core Administration</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Essential tools for managing your GCXONE organization and security infrastructure
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'User Management',
                                    description: 'Create, manage, and assign roles to users across your organization',
                                    icon: <Users className="w-8 h-8" />,
                                    link: '/docs/admin-guide/user-management',
                                    badge: 'Essential',
                                    color: '#10B981'
                                },
                                {
                                    title: 'Security Policies',
                                    description: 'Configure 2FA, password requirements, and access controls',
                                    icon: <Shield className="w-8 h-8" />,
                                    link: '/docs/getting-started/user-management/roles-and-access-levels',
                                    badge: 'Critical',
                                    color: '#EF4444'
                                },
                                {
                                    title: 'System Configuration',
                                    description: 'Global settings, preferences, and platform-wide defaults',
                                    icon: <Settings className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    color: '#3B82F6'
                                },
                                {
                                    title: 'Site Management',
                                    description: 'Organize locations, hierarchies, and geographical structures',
                                    icon: <Globe className="w-8 h-8" />,
                                    link: '/docs/admin-guide/creating-sites',
                                    color: '#8B5CF6'
                                },
                                {
                                    title: 'Audit & Compliance',
                                    description: 'Access logs, user activity reports, and compliance tracking',
                                    icon: <FileText className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    color: '#F59E0B'
                                },
                                {
                                    title: 'API Management',
                                    description: 'Learn about API authentication, tokens, and integration access',
                                    icon: <Lock className="w-8 h-8" />,
                                    link: '/docs/api/index',
                                    badge: 'Developer',
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
                                                    item.badge === 'Essential' ? 'bg-green-500/20 text-green-400' :
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

                    {/* Advanced Features */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Advanced Administration</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Enterprise-grade tools for large-scale deployments and complex organizational structures
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: 'Customer & Site Management',
                                    description: 'Manage customers, sites, and organizational hierarchies',
                                    features: ['Creating customers', 'Site configuration', 'Site groups', 'Hierarchy management'],
                                    icon: <Database className="w-8 h-8" />,
                                    link: '/docs/admin-guide/creating-customers'
                                },
                                {
                                    title: 'Role-Based Access Control',
                                    description: 'Configure roles, permissions, and access levels for your organization',
                                    features: ['Role creation', 'Permission matrix', 'Access levels', 'User privileges'],
                                    icon: <Network className="w-8 h-8" />,
                                    link: '/docs/admin-guide/rbac'
                                },
                                {
                                    title: 'Analytics & Reporting',
                                    description: 'Monitor system performance, alarm volumes, and operational metrics',
                                    features: ['Dashboard overview', 'Alarm analytics', 'Device health', 'Performance metrics'],
                                    icon: <BarChart3 className="w-8 h-8" />,
                                    link: '/docs/admin-guide/dashboard-overview'
                                },
                                {
                                    title: 'System Configuration',
                                    description: 'Configure system-wide settings, timezones, and custom properties',
                                    features: ['Timezone management', 'Custom properties', 'Event clip configuration', 'System preferences'],
                                    icon: <CheckCircle className="w-8 h-8" />,
                                    link: '/docs/admin-guide/timezone-management'
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
                                        <div className="space-y-2">
                                            {feature.features.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Quick Actions */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Quick Actions</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Common administrative tasks and frequently accessed tools
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: 'Creating Users',
                                    description: 'Learn how to invite and configure new team members',
                                    icon: <UserCheck className="w-6 h-6" />,
                                    link: '/docs/admin-guide/creating-users'
                                },
                                {
                                    title: 'API Authentication',
                                    description: 'Understand API tokens and integration access',
                                    icon: <Key className="w-6 h-6" />,
                                    link: '/docs/api/index'
                                },
                                {
                                    title: 'System Monitoring',
                                    description: 'Monitor platform status and device health',
                                    icon: <Activity className="w-6 h-6" />,
                                    link: '/docs/admin-guide/device-health-status'
                                },
                                {
                                    title: 'Security Configuration',
                                    description: 'Configure security policies and access controls',
                                    icon: <AlertTriangle className="w-6 h-6" />,
                                    link: '/docs/admin-guide/rbac'
                                }
                            ].map((action, idx) => (
                                <motion.div
                                    key={action.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={action.link}
                                        className="group block p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                    >
                                        <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4">
                                            {action.icon}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-white/70">{action.description}</p>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Resources & Support */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Resources & Support</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Documentation, training materials, and support channels for administrators
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Admin Documentation',
                                    description: 'Comprehensive guides for all administrative functions',
                                    icon: <FileText className="w-6 h-6" />,
                                    link: '/docs/admin-guide/dashboard-overview',
                                    items: ['User management guides', 'Security configuration', 'System administration', 'Troubleshooting']
                                },
                                {
                                    title: 'Training Resources',
                                    description: 'Video tutorials and certification programs',
                                    icon: <Eye className="w-6 h-6" />,
                                    link: '/docs/getting-started',
                                    items: ['Video walkthroughs', 'Best practices', 'Certification courses', 'Webinar recordings']
                                },
                                {
                                    title: 'Support Channels',
                                    description: 'Get help when you need it most',
                                    icon: <Headphones className="w-6 h-6" />,
                                    link: '/docs/troubleshooting-support/how-to-submit-a-support-ticket',
                                    items: ['24/7 technical support', 'Priority admin queue', 'Implementation assistance', 'Emergency escalation']
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
                                            {resource.items.map((item, i) => (
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
                            <Shield className="w-12 h-12 text-[#E8B058] mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-4">Need Administrative Assistance?</h2>
                            <p className="text-white/70 mb-8 max-w-xl mx-auto">
                                Our expert support team is available to help with complex configurations and enterprise deployments
                            </p>
                            <div className="inline-flex gap-4 flex-wrap justify-center">
                                <Link
                                    to="/docs/troubleshooting-support/how-to-submit-a-support-ticket"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                                >
                                    <Headphones className="w-5 h-5" />
                                    Contact Support
                                </Link>
                                <Link
                                    to="/docs/admin-guide/dashboard-overview"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                                >
                                    <FileText className="w-5 h-5" />
                                    View Documentation
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}