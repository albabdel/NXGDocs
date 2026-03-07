import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import GradientText from '@site/src/components/GradientText';
import {
    Users,
    Shield,
    UserPlus,
    Settings,
    Search,
    Filter,
    X,
    ChevronRight,
    Home,
    UserCheck,
    UserCog,
    ShieldCheck,
    Building2,
    CheckCircle2,
    AlertTriangle,
    FileText,
    Activity,
    Crown,
    User,
    Briefcase,
    BookOpen,
    ArrowRight
} from 'lucide-react';

// User Management Feature Data
type UserFeature = {
    title: string;
    description: string;
    category: string;
    link: string;
    icon: React.ReactNode;
    level?: 'basic' | 'intermediate' | 'advanced';
};

const userFeatures: UserFeature[] = [
    // Role Management
    {
        title: 'Roles and Access Levels',
        description: 'Understanding default roles, permission scopes, and the three-tier access level hierarchy (Service Provider, Customer, Site).',
        category: 'Role Management',
        link: '/docs/getting-started/user-management/roles-and-access-levels',
        icon: <ShieldCheck className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Creating and Configuring Roles',
        description: 'Step-by-step guide to creating custom roles, configuring privileges, setting access levels, and managing session timeouts.',
        category: 'Role Management',
        link: '/docs/getting-started/user-management/creating-roles',
        icon: <Shield className="w-6 h-6" />,
        level: 'intermediate'
    },

    // User Administration
    {
        title: 'Inviting Users',
        description: 'Complete workflow for onboarding new team members, configuring account settings, and managing multi-organization access.',
        category: 'User Administration',
        link: '/docs/getting-started/user-management/inviting-users',
        icon: <UserPlus className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Managing Users',
        description: 'How to edit user roles, update Customer Groups, manage account status, and handle user lifecycle changes.',
        category: 'User Administration',
        link: '/docs/getting-started/user-management/managing-users',
        icon: <UserCog className="w-6 h-6" />,
        level: 'basic'
    },

    // Customer Groups
    {
        title: 'Customer Groups',
        description: 'Segregate client data, manage regional access, and separate production from test environments using Customer Groups.',
        category: 'Customer Groups',
        link: '/docs/getting-started/user-management/customer-groups',
        icon: <Building2 className="w-6 h-6" />,
        level: 'intermediate'
    },

    // Operator Management
    {
        title: 'Talos User Management',
        description: 'Configure operator behaviors, alarm groups, and workflow-specific roles in the Talos alarm processing interface.',
        category: 'Operator Management',
        link: '/docs/getting-started/user-management/talos-user-management',
        icon: <Activity className="w-6 h-6" />,
        level: 'intermediate'
    },
];

// Role presets for quick reference
const rolePresets = [
    {
        name: 'Company Admin',
        icon: <Crown className="w-8 h-8" />,
        description: 'Full access to all features and settings',
        color: 'from-purple-500 to-indigo-600',
        access: 'Service Provider Level',
        features: ['All Privileges', 'User Management', 'System Configuration', 'Billing Access']
    },
    {
        name: 'Manager',
        icon: <Briefcase className="w-8 h-8" />,
        description: 'Supervise operations with limited settings access',
        color: 'from-blue-500 to-cyan-600',
        access: 'Service Provider / Customer Level',
        features: ['View All Objects', 'Reports', 'User Supervision', 'Limited Settings']
    },
    {
        name: 'Operator',
        icon: <User className="w-8 h-8" />,
        description: 'Day-to-day alarm monitoring and processing',
        color: 'from-green-500 to-emerald-600',
        access: 'Customer / Site Level',
        features: ['Alarm Processing', 'Live View', 'Event History', 'Device Control']
    },
    {
        name: 'End User',
        icon: <UserCheck className="w-8 h-8" />,
        description: 'Limited access for customer self-service',
        color: 'from-orange-500 to-red-600',
        access: 'Customer / Site Level',
        features: ['Dashboard View', 'Site Control', 'Basic Reports', 'No Admin Access']
    },
];

// Category data
const categories = [
    { name: 'All Features', icon: <Users className="w-5 h-5" />, count: userFeatures.length },
    { name: 'Role Management', icon: <ShieldCheck className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'Role Management').length },
    { name: 'User Administration', icon: <UserPlus className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'User Administration').length },
    { name: 'Customer Groups', icon: <Building2 className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'Customer Groups').length },
    { name: 'Operator Management', icon: <UserCog className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'Operator Management').length },
];

// Level badges
const levelColors = {
    basic: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

const levelLabels = {
    basic: 'Basic',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
};

export default function UserManagementHub() {
    const [selectedCategory, setSelectedCategory] = useState('All Features');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter features
    const filteredFeatures = useMemo(() => {
        return userFeatures.filter(feature => {
            const matchesCategory = selectedCategory === 'All Features' || feature.category === selectedCategory;
            const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feature.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <Layout
            title="User Management"
            description="Role-based access control, user administration, and comprehensive security management for GCXONE platform"
        >
            {/* Hero Section */}
            <div className="relative overflow-hidden border-b transition-colors duration-500" style={{
                backgroundColor: 'var(--ifm-background-color)',
                borderColor: 'var(--ifm-color-emphasis-200)'
            }}>
                {/* Very subtle dot pattern - matching theme */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, var(--ifm-color-emphasis-300) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
                
                {/* Very subtle radial gradient overlay - matching theme */}
                <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{
                    background: 'radial-gradient(ellipse at top, rgba(200, 148, 70, 0.03) 0%, transparent 70%)'
                }} />
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link href="/" className="hover:text-[#E8B058] transition-colors flex items-center gap-1 no-underline" style={{ color: 'inherit' }}>
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#E8B058] font-medium">User Management</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--ifm-color-content)' }}>
                            User <GradientText>Management</GradientText>
                        </h1>
                        <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Complete guide to roles, permissions, access control, and user administration in GCXONE
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto shadow-lg">
                            <p className="text-base mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                                Learn how to configure role-based access control (RBAC), create custom roles, manage customer groups, and onboard team members with proper permissions.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Role-Based Access Control</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Customer Groups</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>User Administration</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Talos Integration</span>
                                </div>
                            </div>
                        </div>
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
                        { icon: <BookOpen className="w-6 h-6" />, label: 'Total Articles', value: userFeatures.length },
                        { icon: <ShieldCheck className="w-6 h-6" />, label: 'Role Management', value: userFeatures.filter(f => f.category === 'Role Management').length },
                        { icon: <UserPlus className="w-6 h-6" />, label: 'User Administration', value: userFeatures.filter(f => f.category === 'User Administration').length },
                        { icon: <Building2 className="w-6 h-6" />, label: 'Customer Groups', value: userFeatures.filter(f => f.category === 'Customer Groups').length },
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

            {/* Role Presets Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                        Predefined Role Templates
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                        Start with these battle-tested role configurations or customize them to match your organizational needs
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rolePresets.map((role, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all group"
                            >
                                <div className={`bg-gradient-to-br ${role.color} p-6 text-white`}>
                                    <div className="mb-4">{role.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{role.name}</h3>
                                    <p className="text-white/90 text-sm">{role.description}</p>
                                </div>
                                <div className="p-6">
                                    <div className="mb-4">
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                                            Access Level
                                        </div>
                                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                                            {role.access}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                            Key Features
                                        </div>
                                        <ul className="space-y-1">
                                            {role.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
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
                                    placeholder="Search user management features..."
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
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                <Filter className="w-4 h-4" />
                                <span>Showing {filteredFeatures.length} of {userFeatures.length} features</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
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
                    transition={{ duration: 0.5, delay: 0.7 }}
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
                                to={feature.link || '#'}
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
                                        {feature.level && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[feature.level]}`}>
                                                {levelLabels[feature.level]}
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
                                        Read article
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredFeatures.length === 0 && (
                    <div className="text-center py-16">
                        <AlertTriangle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
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

                {/* Quick Start Resources Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
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
                                title: 'User Management Overview',
                                description: 'Complete guide to user management, roles, permissions, and access control in GCXONE.',
                                link: '/docs/getting-started/user-management/overview',
                                icon: <BookOpen className="w-6 h-6" />
                            },
                            {
                                title: 'Creating Your First Role',
                                description: 'Step-by-step tutorial to create custom roles with specific permissions and access levels.',
                                link: '/docs/getting-started/user-management/creating-roles',
                                icon: <Shield className="w-6 h-6" />
                            },
                            {
                                title: 'Inviting Your First User',
                                description: 'Learn how to onboard new team members and configure their access permissions.',
                                link: '/docs/getting-started/user-management/inviting-users',
                                icon: <UserPlus className="w-6 h-6" />
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
                                <div className="flex-1">
                                    <h3 className="font-semibold mb-1 transition-colors group-hover:text-[#E8B058]" style={{ color: 'var(--ifm-color-content)' }}>
                                        {resource.title}
                                    </h3>
                                    <p className="text-sm mb-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {resource.description}
                                    </p>
                                    <div className="flex items-center text-sm font-medium" style={{ color: '#E8B058' }}>
                                        Read article
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* All Articles Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="mt-16"
                >
                    <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ifm-color-content)' }}>
                        All User Management Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            {
                                title: 'User Management Overview',
                                description: 'Complete guide to user management, roles, permissions, and access control in GCXONE and Talos.',
                                link: '/docs/getting-started/user-management/overview',
                                category: 'Getting Started'
                            },
                            {
                                title: 'Roles and Access Levels',
                                description: 'Detailed breakdown of default roles, permission scopes, and access levels in GCXONE.',
                                link: '/docs/getting-started/user-management/roles-and-access-levels',
                                category: 'Role Management'
                            },
                            {
                                title: 'Creating and Configuring Roles',
                                description: 'Complete guide to creating custom roles, configuring permissions, and managing roles in GCXONE.',
                                link: '/docs/getting-started/user-management/creating-roles',
                                category: 'Role Management'
                            },
                            {
                                title: 'Customer Groups',
                                description: 'How to use Customer Groups to segregate client data and manage regional access levels.',
                                link: '/docs/getting-started/user-management/customer-groups',
                                category: 'Customer Groups'
                            },
                            {
                                title: 'Inviting Users',
                                description: 'Step-by-step tutorial to onboarding new team members and managing multi-tenant access.',
                                link: '/docs/getting-started/user-management/inviting-users',
                                category: 'User Administration'
                            },
                            {
                                title: 'Managing Users',
                                description: 'How to edit user roles, update Customer Groups, and manage account status.',
                                link: '/docs/getting-started/user-management/managing-users',
                                category: 'User Administration'
                            },
                            {
                                title: 'Talos User Management',
                                description: 'How to configure operator behaviors, alarm groups, and workflow-specific roles in the Talos ecosystem.',
                                link: '/docs/getting-started/user-management/talos-user-management',
                                category: 'Operator Management'
                            },
                        ].map((article, index) => (
                            <Link
                                key={index}
                                to={article.link}
                                className="flex items-start gap-4 p-5 rounded-lg hover:shadow-md transition-all group no-underline"
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
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-semibold px-2 py-1 rounded" style={{
                                            backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                            color: '#E8B058'
                                        }}>
                                            {article.category}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold mb-2 transition-colors group-hover:text-[#E8B058]" style={{ color: 'var(--ifm-color-content)' }}>
                                        {article.title}
                                    </h3>
                                    <p className="text-sm mb-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {article.description}
                                    </p>
                                    <div className="flex items-center text-sm font-medium" style={{ color: '#E8B058' }}>
                                        Read article
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}
