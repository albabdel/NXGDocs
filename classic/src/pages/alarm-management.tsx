import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import {
    Bell,
    AlertTriangle,
    CheckCircle2,
    X,
    Search,
    Filter,
    Clock,
    Zap,
    Play,
    Pause,
    Settings,
    Users,
    TrendingUp,
    Shield,
    Activity,
    FileText,
    BarChart3,
    Route,
    Volume2,
    MessageSquare,
    ChevronRight,
    Home,
    Layers,
    Target,
    AlertCircle,
    CheckSquare,
    Timer,
    UserCheck,
    Workflow
} from 'lucide-react';

// Alarm Management Feature Data
type AlarmFeature = {
    title: string;
    description: string;
    category: string;
    link: string;
    icon: React.ReactNode;
    status?: 'core' | 'advanced' | 'automation';
};

const alarmFeatures: AlarmFeature[] = [
    // Core Alarm Processing
    {
        title: 'Alarm Reception & Parsing',
        description: 'Automated reception and intelligent parsing of alarm signals from multiple protocols including Contact ID, SIA, and proprietary formats with real-time decoding.',
        category: 'Core Processing',
        link: '/docs/alarm-management/alarm-codes',
        icon: <Bell className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Priority Classification',
        description: 'Automatic priority assignment based on alarm type, customer tier, location risk, and historical patterns to ensure critical alarms receive immediate attention.',
        category: 'Core Processing',
        link: '/docs/alarm-management/alarm-codes',
        icon: <Target className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Event Correlation',
        description: 'Intelligent correlation engine that links related alarms, identifies patterns, and groups events to reduce operator cognitive load and improve response efficiency.',
        category: 'Core Processing',
        link: '/docs/alarm-management/alarm-codes',
        icon: <Layers className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Alarm Filtering',
        description: 'Configurable filtering rules to suppress known non-critical events, maintenance alerts, and scheduled test signals during specific time windows.',
        category: 'Core Processing',
        link: '/docs/alarm-management/alarm-codes',
        icon: <Filter className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'False Alarm Reduction',
        description: 'Machine learning-powered false alarm detection that identifies and automatically resolves common false alarm scenarios before operator escalation.',
        category: 'Core Processing',
        link: '/docs/alarm-management/alarm-codes',
        icon: <AlertCircle className="w-6 h-6" />,
        status: 'advanced'
    },

    // Routing & Escalation
    {
        title: 'Intelligent Routing',
        description: 'Rule-based routing engine that directs alarms to appropriate operators based on skill sets, workload, geography, and customer assignments.',
        category: 'Routing & Escalation',
        link: '/docs/features/alarms-ai/workflows',
        icon: <Route className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Escalation Chains',
        description: 'Multi-tier escalation workflows with configurable time thresholds, automatic supervisor notification, and customer contact protocols.',
        category: 'Routing & Escalation',
        link: '/docs/operator-guide/escalation-procedures',
        icon: <TrendingUp className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Overflow Management',
        description: 'Automatic workload balancing and overflow routing during peak periods to maintain response time SLAs and prevent operator burnout.',
        category: 'Routing & Escalation',
        link: '/docs/alarm-management/event-overflow',
        icon: <Users className="w-6 h-6" />,
        status: 'advanced'
    },
    {
        title: 'Backup Routing',
        description: 'Redundant routing paths and failover mechanisms ensuring alarm delivery even during system outages or network disruptions.',
        category: 'Routing & Escalation',
        link: '/docs/alarm-management/redundant-alarms',
        icon: <Shield className="w-6 h-6" />,
        status: 'core'
    },

    // Notifications & Integration
    {
        title: 'Multi-Channel Notifications',
        description: 'Unified notification hub supporting email, SMS, voice calls, push notifications, and webhooks with delivery confirmation and retry logic.',
        category: 'Notifications & Integration',
        link: '/docs/features/notifications-alerts',
        icon: <MessageSquare className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'SMS/Email/Voice',
        description: 'Integrated communication channels with templated messages, text-to-speech for voice calls, and two-way response handling.',
        category: 'Notifications & Integration',
        link: '/docs/features/notifications-alerts',
        icon: <Volume2 className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Third-Party Integration',
        description: 'API integrations with PSIM platforms, CRM systems, access control, video management, and dispatch services for seamless workflow automation.',
        category: 'Notifications & Integration',
        link: '/docs/features/alarms-ai/dc09',
        icon: <Workflow className="w-6 h-6" />,
        status: 'advanced'
    },
    {
        title: 'Mobile Push',
        description: 'Real-time push notifications to mobile devices with actionable alerts, location awareness, and offline acknowledgment capabilities.',
        category: 'Notifications & Integration',
        link: '/docs/features/notifications-alerts',
        icon: <Zap className="w-6 h-6" />,
        status: 'core'
    },

    // Analytics & Reporting
    {
        title: 'Alarm Statistics',
        description: 'Comprehensive dashboards showing alarm volumes, types, response times, and resolution rates with drill-down capabilities.',
        category: 'Analytics & Reporting',
        link: '/docs/reporting/reporting-overview',
        icon: <BarChart3 className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Response Time Metrics',
        description: 'Detailed response time analytics from alarm receipt to resolution, identifying bottlenecks and improvement opportunities.',
        category: 'Analytics & Reporting',
        link: '/docs/reporting/reporting-overview',
        icon: <Timer className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Operator Performance',
        description: 'Individual and team performance metrics including handling time, accuracy, customer satisfaction, and skill assessments.',
        category: 'Analytics & Reporting',
        link: '/docs/features/operational-tools/analytics',
        icon: <UserCheck className="w-6 h-6" />,
        status: 'advanced'
    },
    {
        title: 'Trend Analysis',
        description: 'Historical trend analysis and predictive insights for alarm patterns, seasonal variations, and capacity planning.',
        category: 'Analytics & Reporting',
        link: '/docs/features/operational-tools/analytics',
        icon: <Activity className="w-6 h-6" />,
        status: 'advanced'
    },

    // Optimization & Training
    {
        title: 'Alarm Review Mode',
        description: 'Post-incident review tools for analyzing alarm handling decisions, identifying improvement areas, and updating best practices.',
        category: 'Optimization & Training',
        link: '/docs/operator-guide/training-guide',
        icon: <CheckSquare className="w-6 h-6" />,
        status: 'advanced'
    },
    {
        title: 'Training Simulator',
        description: 'Interactive training environment with simulated alarm scenarios for operator onboarding, skill development, and certification.',
        category: 'Optimization & Training',
        link: '/docs/operator-guide/training-guide',
        icon: <Play className="w-6 h-6" />,
        status: 'advanced'
    },
    {
        title: 'Best Practices',
        description: 'Built-in best practice guidelines, decision trees, and SOP documentation integrated directly into the alarm handling workflow.',
        category: 'Optimization & Training',
        link: '/docs/operator-guide/training-guide',
        icon: <FileText className="w-6 h-6" />,
        status: 'core'
    },

    // System Health & Performance
    {
        title: 'System Monitoring',
        description: 'Real-time monitoring of all system components, communication channels, and integration endpoints with alerting.',
        category: 'System Health & Performance',
        link: '/docs/features/system-health-monitoring',
        icon: <Activity className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Health Checks',
        description: 'Automated health check routines for receiver lines, database connections, and critical services with auto-recovery options.',
        category: 'System Health & Performance',
        link: '/docs/features/system-health-monitoring',
        icon: <CheckCircle2 className="w-6 h-6" />,
        status: 'core'
    },
    {
        title: 'Performance Metrics',
        description: 'System performance dashboards showing throughput, latency, queue depths, and resource utilization for capacity planning.',
        category: 'System Health & Performance',
        link: '/docs/features/operational-tools/analytics',
        icon: <BarChart3 className="w-6 h-6" />,
        status: 'advanced'
    }
];

// Category data
const categories = [
    { name: 'All Features', icon: <Bell className="w-5 h-5" />, count: alarmFeatures.length },
    { name: 'Core Processing', icon: <Zap className="w-5 h-5" />, count: alarmFeatures.filter(f => f.category === 'Core Processing').length },
    { name: 'Routing & Escalation', icon: <Route className="w-5 h-5" />, count: alarmFeatures.filter(f => f.category === 'Routing & Escalation').length },
    { name: 'Notifications & Integration', icon: <Volume2 className="w-5 h-5" />, count: alarmFeatures.filter(f => f.category === 'Notifications & Integration').length },
    { name: 'Analytics & Reporting', icon: <BarChart3 className="w-5 h-5" />, count: alarmFeatures.filter(f => f.category === 'Analytics & Reporting').length },
    { name: 'Optimization & Training', icon: <Shield className="w-5 h-5" />, count: alarmFeatures.filter(f => f.category === 'Optimization & Training').length },
    { name: 'System Health & Performance', icon: <Activity className="w-5 h-5" />, count: alarmFeatures.filter(f => f.category === 'System Health & Performance').length },
];

// Status badges
const statusColors = {
    core: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    automation: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
};

const statusLabels = {
    core: 'Core Feature',
    advanced: 'Advanced',
    automation: 'Automation',
};

export default function AlarmManagementHub() {
    const [selectedCategory, setSelectedCategory] = useState('All Features');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter features
    const filteredFeatures = useMemo(() => {
        return alarmFeatures.filter(feature => {
            const matchesCategory = selectedCategory === 'All Features' || feature.category === selectedCategory;
            const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feature.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <Layout
            title="Alarm Management"
            description="Real-time alarm processing, intelligent routing, and automated response workflows for comprehensive security monitoring"
        >
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b transition-colors duration-500" style={{
                backgroundColor: 'var(--ifm-background-color)',
                borderColor: 'var(--ifm-color-emphasis-200)'
            }}>
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, var(--ifm-color-emphasis-300) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link href="/" className="hover:text-[#E8B058] transition-colors flex items-center gap-1 no-underline" style={{ color: 'inherit' }}>
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#E8B058] font-medium">Alarm Management</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-2xl" style={{
                                backgroundColor: 'var(--ifm-color-emphasis-100)',
                                border: '1px solid var(--ifm-color-emphasis-200)'
                            }}>
                                <Bell className="w-16 h-16 text-[#E8B058]" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--ifm-color-content)' }}>
                            Alarm Management
                        </h1>
                        <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[#E8B058]">
                            Real-time alarm processing and automation
                        </p>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Intelligent alarm handling with priority-based routing, automated escalation, and comprehensive analytics for monitoring stations and security operations centers.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    {[
                        { icon: <Bell className="w-6 h-6" />, label: 'Total Features', value: alarmFeatures.length },
                        { icon: <Zap className="w-6 h-6" />, label: 'Core Features', value: alarmFeatures.filter(f => f.status === 'core').length },
                        { icon: <TrendingUp className="w-6 h-6" />, label: 'Advanced Features', value: alarmFeatures.filter(f => f.status === 'advanced').length },
                        { icon: <Workflow className="w-6 h-6" />, label: 'Automation Features', value: alarmFeatures.filter(f => f.status === 'automation').length },
                    ].map((stat, index) => (
                        <div key={index} className="rounded-xl shadow-lg p-6" style={{
                            backgroundColor: 'var(--ifm-background-surface-color)',
                            border: '1px solid var(--ifm-color-emphasis-200)'
                        }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg" style={{
                                    backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                    color: '#E8B058'
                                }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-3xl font-bold" style={{ color: 'var(--ifm-color-content)' }}>{stat.value}</div>
                                    <div className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>{stat.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-12"
                >
                    <div className="rounded-xl shadow-md p-6" style={{
                        backgroundColor: 'var(--ifm-background-surface-color)',
                        border: '1px solid var(--ifm-color-emphasis-200)'
                    }}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: 'var(--ifm-color-emphasis-600)' }} />
                                <input
                                    type="text"
                                    placeholder="Search alarm features..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg outline-none transition-all"
                                    style={{
                                        backgroundColor: 'var(--ifm-color-emphasis-100)',
                                        border: '1px solid var(--ifm-color-emphasis-200)',
                                        color: 'var(--ifm-color-content)'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#E8B058'}
                                    onBlur={(e) => e.target.style.borderColor = 'var(--ifm-color-emphasis-200)'}
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
                                        style={{ color: 'var(--ifm-color-emphasis-600)' }}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                <Filter className="w-4 h-4" />
                                <span>Showing {filteredFeatures.length} of {alarmFeatures.length} features</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category.name)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                                style={selectedCategory === category.name ? {
                                    backgroundColor: '#E8B058',
                                    color: '#000',
                                    boxShadow: '0 4px 6px rgba(232, 176, 88, 0.2)'
                                } : {
                                    backgroundColor: 'var(--ifm-background-surface-color)',
                                    color: 'var(--ifm-color-content)',
                                    border: '1px solid var(--ifm-color-emphasis-200)'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedCategory !== category.name) {
                                        e.currentTarget.style.borderColor = '#E8B058';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedCategory !== category.name) {
                                        e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                                    }
                                }}
                            >
                                {category.icon}
                                <span className="font-medium">{category.name}</span>
                                <span className="ml-1 px-2 py-0.5 rounded-full text-xs" style={selectedCategory === category.name ? {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    color: '#000'
                                } : {
                                    backgroundColor: 'var(--ifm-color-emphasis-200)',
                                    color: 'var(--ifm-color-content-secondary)'
                                }}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link
                                to={feature.link}
                                className="block h-full rounded-xl shadow-md hover:shadow-xl transition-all group no-underline"
                                style={{
                                    backgroundColor: 'var(--ifm-background-surface-color)',
                                    border: '1px solid var(--ifm-color-emphasis-200)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = '#E8B058';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--ifm-color-emphasis-200)';
                                }}
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-lg group-hover:scale-110 transition-transform" style={{
                                            backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                            color: '#E8B058'
                                        }}>
                                            {feature.icon}
                                        </div>
                                        {feature.status && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[feature.status]}`}>
                                                {statusLabels[feature.status]}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm mb-4 line-clamp-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center text-sm font-medium" style={{ color: '#E8B058' }}>
                                        Learn more
                                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredFeatures.length === 0 && (
                    <div className="text-center py-16">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--ifm-color-emphasis-400)' }} />
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                            No features found
                        </h3>
                        <p className="mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All Features');
                            }}
                            className="px-6 py-3 rounded-lg transition-colors font-medium"
                            style={{ backgroundColor: '#E8B058', color: '#000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#D4A04E'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E8B058'}
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

            </div>
        </Layout>
    );
}
