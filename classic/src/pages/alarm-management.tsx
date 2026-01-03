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

    // Routing & Escalation

    // Notifications & Integration

    // Analytics & Reporting

    // Optimization & Training

    // System Health & Performance
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
