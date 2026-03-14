import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import {
    Activity,
    Wifi,
    WifiOff,
    Server,
    Camera,
    AlertTriangle,
    CheckCircle2,
    X,
    Search,
    Filter,
    ChevronRight,
    Home,
    HardDrive,
    Cpu,
    Signal,
    Battery,
    Clock,
    TrendingUp,
    BarChart3,
    FileText,
    Settings,
    RefreshCw,
    AlertCircle,
    Shield,
    Zap,
    Eye,
    Radio,
    Network,
    Database,
    Power,
    Thermometer,
    Gauge,
    Bell,
    Target,
    MapPin,
    Layers,
    Cloud,
    Heart,
    Plug
} from 'lucide-react';

// Device Monitoring Feature Data
type MonitoringFeature = {
    title: string;
    description: string;
    category: string;
    link: string;
    icon: React.ReactNode;
    criticality?: 'critical' | 'important' | 'standard';
};

const monitoringFeatures: MonitoringFeature[] = [
    // Real-Time Health Monitoring
    {
        title: 'Device Health Status Dashboard',
        description: 'Unified dashboard displaying real-time health status of all connected devices with color-coded indicators (online, offline, warning).',
        category: 'Real-Time Health Monitoring',
        link: '/docs/devices/health-monitoring',
        icon: <Activity className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Connectivity Monitoring',
        description: 'Continuous monitoring of device network connectivity with instant alerts for connection loss, degraded performance, or intermittent issues.',
        category: 'Real-Time Health Monitoring',
        link: '/docs/devices/health-monitoring',
        icon: <Wifi className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Heartbeat Detection',
        description: 'Automated heartbeat monitoring detecting unresponsive devices and triggering notifications when devices fail to check in within expected intervals.',
        category: 'Real-Time Health Monitoring',
        link: '/docs/devices/health-monitoring',
        icon: <Heart className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Device Status Indicators',
        description: 'Visual status indicators showing online/offline state, communication quality, event reception rate, and last successful connection timestamp.',
        category: 'Real-Time Health Monitoring',
        link: '/docs/devices',
        icon: <Signal className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Multi-Site Health Overview',
        description: 'Aggregated health view across multiple sites showing site-level device status summaries and quick navigation to problem areas.',
        category: 'Real-Time Health Monitoring',
        link: '/docs/devices',
        icon: <Layers className="w-6 h-6" />,
        criticality: 'important'
    },

    // Device Diagnostics
    {
        title: 'System Diagnostics',
        description: 'Comprehensive diagnostic tools including ping tests, port checks, authentication validation, and configuration verification for troubleshooting.',
        category: 'Device Diagnostics',
        link: '/docs/devices',
        icon: <Settings className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Connection Quality Metrics',
        description: 'Detailed connection metrics tracking latency, packet loss, bandwidth utilization, and stream quality for each device.',
        category: 'Device Diagnostics',
        link: '/docs/devices',
        icon: <Gauge className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Event Reception Rate',
        description: 'Monitor event delivery rates detecting delays, dropped events, or communication bottlenecks between devices and the platform.',
        category: 'Device Diagnostics',
        link: '/docs/devices',
        icon: <TrendingUp className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Device Logs & History',
        description: 'Comprehensive device activity logs recording connections, disconnections, configuration changes, and communication errors for forensic analysis.',
        category: 'Device Diagnostics',
        link: '/docs/devices',
        icon: <FileText className="w-6 h-6" />,
        criticality: 'standard'
    },

    // Performance Monitoring
    {
        title: 'Video Stream Quality Monitoring',
        description: 'Real-time monitoring of video stream health including frame rate, bitrate, resolution, and codec performance for optimal viewing.',
        category: 'Performance Monitoring',
        link: '/docs/features/live-video',
        icon: <Camera className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Storage Capacity Monitoring',
        description: 'Track device storage utilization with alerts for low disk space, recording failures, or storage system errors preventing data loss.',
        category: 'Performance Monitoring',
        link: '/docs/devices',
        icon: <HardDrive className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'CPU & Memory Utilization',
        description: 'Monitor device resource consumption tracking CPU usage, memory load, and system performance to identify overloaded devices.',
        category: 'Performance Monitoring',
        link: '/docs/devices',
        icon: <Cpu className="w-6 h-6" />,
        criticality: 'standard'
    },
    {
        title: 'Temperature & Environmental Monitoring',
        description: 'Track device operating temperature and environmental conditions with alerts for overheating or conditions outside safe parameters.',
        category: 'Performance Monitoring',
        link: '/docs/devices',
        icon: <Thermometer className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Bandwidth Usage Tracking',
        description: 'Monitor network bandwidth consumption per device identifying bandwidth hogs and optimizing stream configurations for efficiency.',
        category: 'Performance Monitoring',
        link: '/docs/devices',
        icon: <Network className="w-6 h-6" />,
        criticality: 'standard'
    },

    // Alerts & Notifications
    {
        title: 'Device Offline Alerts',
        description: 'Instant notifications when devices go offline with configurable alert thresholds, escalation rules, and multi-channel delivery.',
        category: 'Alerts & Notifications',
        link: '/docs/alarm-management',
        icon: <WifiOff className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Health Alert Rules',
        description: 'Customizable alert rules based on device health metrics triggering notifications for storage, temperature, connectivity, or performance issues.',
        category: 'Alerts & Notifications',
        link: '/docs/alarm-management',
        icon: <Bell className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Proactive Maintenance Alerts',
        description: 'Predictive alerts for upcoming maintenance needs based on device age, usage patterns, and historical performance trends.',
        category: 'Alerts & Notifications',
        link: '/docs/alarm-management',
        icon: <Clock className="w-6 h-6" />,
        criticality: 'standard'
    },

    // Configuration & Management
    {
        title: 'Remote Device Configuration',
        description: 'Centralized configuration management for devices including firmware updates, parameter adjustments, and bulk configuration deployment.',
        category: 'Configuration & Management',
        link: '/docs/devices/configuration',
        icon: <Settings className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Firmware Version Management',
        description: 'Track firmware versions across devices with alerts for outdated firmware, security patches, and centralized update orchestration.',
        category: 'Configuration & Management',
        link: '/docs/devices/configuration',
        icon: <RefreshCw className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Device Registration & Onboarding',
        description: 'Streamlined device registration workflow with auto-discovery, manual registration, bulk onboarding, and verification procedures.',
        category: 'Configuration & Management',
        link: '/docs/devices',
        icon: <Plug className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Device Grouping & Organization',
        description: 'Organize devices into logical groups by type, location, function, or custom criteria for efficient monitoring and management.',
        category: 'Configuration & Management',
        link: '/docs/devices',
        icon: <Layers className="w-6 h-6" />,
        criticality: 'standard'
    },

    // Reporting & Analytics
    {
        title: 'Device Health Reports',
        description: 'Comprehensive reports on device uptime, connectivity statistics, performance trends, and health score history for SLA tracking.',
        category: 'Reporting & Analytics',
        link: '/docs/reporting',
        icon: <BarChart3 className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Uptime & Availability Metrics',
        description: 'Track device availability percentages, downtime duration, mean time between failures (MTBF), and service level compliance.',
        category: 'Reporting & Analytics',
        link: '/docs/reporting',
        icon: <TrendingUp className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Historical Performance Trends',
        description: 'Long-term performance analytics identifying degradation patterns, seasonal variations, and devices requiring attention.',
        category: 'Reporting & Analytics',
        link: '/docs/reporting',
        icon: <Activity className="w-6 h-6" />,
        criticality: 'standard'
    },
    {
        title: 'Device Activity Analytics',
        description: 'Detailed analytics on device usage including event volumes, stream consumption, alarm frequency, and operational patterns.',
        category: 'Reporting & Analytics',
        link: '/docs/reporting',
        icon: <Eye className="w-6 h-6" />,
        criticality: 'standard'
    },

    // Troubleshooting & Support
    {
        title: 'Automated Troubleshooting',
        description: 'Guided troubleshooting workflows with automated diagnostic checks, common issue resolution, and step-by-step remediation procedures.',
        category: 'Troubleshooting & Support',
        link: '/docs/devices',
        icon: <AlertCircle className="w-6 h-6" />,
        criticality: 'important'
    },
    {
        title: 'Connection Troubleshooting',
        description: 'Specialized tools for diagnosing network connectivity issues including firewall checks, port validation, and DNS resolution testing.',
        category: 'Troubleshooting & Support',
        link: '/docs/devices',
        icon: <Network className="w-6 h-6" />,
        criticality: 'critical'
    },
    {
        title: 'Device Reset & Recovery',
        description: 'Remote device reset capabilities, factory restore options, and recovery procedures for unresponsive or misconfigured devices.',
        category: 'Troubleshooting & Support',
        link: '/docs/devices',
        icon: <RefreshCw className="w-6 h-6" />,
        criticality: 'important'
    },
];

// Category data
const categories = [
    { name: 'All Features', icon: <Activity className="w-5 h-5" />, count: monitoringFeatures.length },
    { name: 'Real-Time Health Monitoring', icon: <Heart className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Real-Time Health Monitoring').length },
    { name: 'Device Diagnostics', icon: <Settings className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Device Diagnostics').length },
    { name: 'Performance Monitoring', icon: <Gauge className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Performance Monitoring').length },
    { name: 'Alerts & Notifications', icon: <Bell className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Alerts & Notifications').length },
    { name: 'Configuration & Management', icon: <Settings className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Configuration & Management').length },
    { name: 'Reporting & Analytics', icon: <BarChart3 className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Reporting & Analytics').length },
    { name: 'Troubleshooting & Support', icon: <AlertCircle className="w-5 h-5" />, count: monitoringFeatures.filter(f => f.category === 'Troubleshooting & Support').length },
];

// Criticality badges
const criticalityColors = {
    critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    important: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    standard: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
};

const criticalityLabels = {
    critical: 'Critical',
    important: 'Important',
    standard: 'Standard',
};

export default function DeviceMonitoringHub() {
    const [selectedCategory, setSelectedCategory] = useState('All Features');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter features
    const filteredFeatures = useMemo(() => {
        return monitoringFeatures.filter(feature => {
            const matchesCategory = selectedCategory === 'All Features' || feature.category === selectedCategory;
            const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feature.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <Layout
            title="Device Monitoring"
            description="Monitor device health and connectivity with real-time dashboards, diagnostics, and automated alerts"
        >
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b transition-colors duration-500" style={{ backgroundColor: "var(--ifm-background-color)", borderColor: "var(--ifm-color-emphasis-200)" }}>
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, var(--ifm-color-emphasis-300) 1px, transparent 0)", backgroundSize: "32px 32px" }} />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--ifm-color-content-secondary)" }}>
                        <Link href="/" className="hover:text-[#E8B058] transition-colors flex items-center gap-1 no-underline" style={{ color: "inherit" }}>
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#E8B058] font-medium">Device Monitoring</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ifm-color-emphasis-100)", border: "1px solid var(--ifm-color-emphasis-200)" }}>
                                <Activity className="w-16 h-16 text-[#E8B058]" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "var(--ifm-color-content)" }}>
                            Device Monitoring
                        </h1>
                        <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[#E8B058]">
                            Monitor device health and connectivity
                        </p>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--ifm-color-content-secondary)" }}>
                            Comprehensive device health monitoring with real-time status dashboards, automated diagnostics, performance analytics, and proactive maintenance alerts.
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
                        { icon: <Activity className="w-6 h-6" />, label: 'Total Features', value: monitoringFeatures.length },
                        { icon: <AlertTriangle className="w-6 h-6" />, label: 'Critical Features', value: monitoringFeatures.filter(f => f.criticality === 'critical').length },
                        { icon: <Heart className="w-6 h-6" />, label: 'Health Monitors', value: monitoringFeatures.filter(f => f.category === 'Real-Time Health Monitoring').length },
                        { icon: <Settings className="w-6 h-6" />, label: 'Diagnostic Tools', value: monitoringFeatures.filter(f => f.category === 'Device Diagnostics').length },
                    ].map((stat, index) => (
                        <div key={index} className="rounded-xl shadow-lg p-6" style={{ backgroundColor: "var(--ifm-background-surface-color)", border: "1px solid var(--ifm-color-emphasis-200)" }}>
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(232, 176, 88, 0.1)", color: "#E8B058" }}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-3xl font-bold" style={{ color: "var(--ifm-color-content)" }}>{stat.value}</div>
                                    <div className="text-sm" style={{ color: "var(--ifm-color-content-secondary)" }}>{stat.label}</div>
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
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search monitoring features..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <Filter className="w-4 h-4" />
                                <span>Showing {filteredFeatures.length} of {monitoringFeatures.length} features</span>
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
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${selectedCategory === category.name
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500'
                                    }`}
                            >
                                {category.icon}
                                <span className="font-medium">{category.name}</span>
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${selectedCategory === category.name
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                    }`}>
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
                                        {feature.criticality && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${criticalityColors[feature.criticality]}`}>
                                                {criticalityLabels[feature.criticality]}
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

                {/* Quick Links Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 rounded-2xl p-8"
                    style={{
                        backgroundColor: 'var(--ifm-color-emphasis-100)',
                        border: '1px solid var(--ifm-color-emphasis-200)'
                    }}
                >
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ifm-color-content)' }}>
                        Quick Start Resources
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Device Health Dashboard',
                                description: 'View real-time health status of all devices',
                                icon: <Activity className="w-6 h-6" />,
                                link: '/docs/devices/health-monitoring',
                            },
                            {
                                title: 'Connection Troubleshooting',
                                description: 'Diagnose and resolve connectivity issues',
                                icon: <Network className="w-6 h-6" />,
                                link: '/docs/devices',
                            },
                            {
                                title: 'Setup Health Alerts',
                                description: 'Configure proactive monitoring notifications',
                                icon: <Bell className="w-6 h-6" />,
                                link: '/docs/alarm-management',
                            },
                        ].map((resource, index) => (
                            <Link
                                key={index}
                                to={resource.link}
                                className="flex items-start gap-4 p-6 rounded-xl hover:shadow-lg transition-all group no-underline"
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
                                <div className="p-3 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0" style={{
                                    backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                    color: '#E8B058'
                                }}>
                                    {resource.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1 transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {resource.description}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
