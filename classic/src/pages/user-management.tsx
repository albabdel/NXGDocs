import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import Link from '@docusaurus/Link';
import {
    Users,
    Shield,
    UserPlus,
    Key,
    Lock,
    Unlock,
    Settings,
    Search,
    Filter,
    X,
    ChevronRight,
    Home,
    UserCheck,
    UserCog,
    UsersIcon,
    ShieldCheck,
    ShieldAlert,
    Building2,
    MapPin,
    Layers,
    Eye,
    EyeOff,
    Clock,
    Mail,
    CheckCircle2,
    AlertTriangle,
    FileText,
    BarChart3,
    Activity,
    Zap,
    Target,
    Crown,
    User,
    Briefcase
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
        title: 'Role-Based Access Control (RBAC)',
        description: 'Comprehensive RBAC system with predefined and custom roles defining granular permissions for every feature and function across the platform.',
        category: 'Role Management',
        link: '/docs/admin-guide/rbac',
        icon: <ShieldCheck className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Creating Custom Roles',
        description: 'Build tailored roles with specific privilege combinations matching your organizational structure and security requirements.',
        category: 'Role Management',
        link: '/docs/admin-guide/creating-users',
        icon: <UserCog className="w-6 h-6" />,
        level: 'intermediate'
    },
    {
        title: 'Access Levels',
        description: 'Three-tier access hierarchy (Service Provider, Customer, Site) controlling scope of user visibility across the organizational structure.',
        category: 'Role Management',
        link: '/docs/admin-guide/rbac',
        icon: <Layers className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Privilege Configuration',
        description: 'Granular permission control across apps, categories, and actions (view, create, edit, delete) for precise access management.',
        category: 'Role Management',
        link: '/docs/admin-guide/rbac',
        icon: <Key className="w-6 h-6" />,
        level: 'intermediate'
    },
    {
        title: 'Session Timeout Management',
        description: 'Role-level session timeout configuration (30-1440 minutes) ensuring automatic logout for security compliance.',
        category: 'Role Management',
        link: '/docs/admin-guide/rbac',
        icon: <Clock className="w-6 h-6" />,
        level: 'basic'
    },

    // User Administration
    {
        title: 'User Invitation System',
        description: 'Email-based invitation workflow with role assignment, customer group selection, and multi-organization access configuration.',
        category: 'User Administration',
        link: '/docs/admin-guide/creating-users',
        icon: <UserPlus className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Multi-Organization Access',
        description: 'Enable single user accounts to access multiple tenants/organizations with distinct roles per organization for enterprise flexibility.',
        category: 'User Administration',
        link: '/docs/admin-guide/creating-users',
        icon: <Building2 className="w-6 h-6" />,
        level: 'advanced'
    },
    {
        title: 'User Status Management',
        description: 'Activate, deactivate, or suspend user accounts with immediate effect on login capabilities and existing sessions.',
        category: 'User Administration',
        link: '/docs/admin-guide/creating-users',
        icon: <UserCheck className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Bulk User Operations',
        description: 'Efficiently manage multiple users simultaneously with batch invite, role assignment, and access level updates.',
        category: 'User Administration',
        link: '/docs/admin-guide/creating-users',
        icon: <UsersIcon className="w-6 h-6" />,
        level: 'intermediate'
    },

    // Customer Groups
    {
        title: 'Customer Groups',
        description: 'Flexible customer segmentation restricting user access to specific customer subsets without creating separate roles for each.',
        category: 'Customer Groups',
        link: '/docs/admin-guide/creating-customers',
        icon: <Users className="w-6 h-6" />,
        level: 'intermediate'
    },
    {
        title: 'Customer Group Configuration',
        description: 'Create, edit, and manage customer groups with active/inactive status and flexible customer membership assignment.',
        category: 'Customer Groups',
        link: '/docs/admin-guide/creating-customers',
        icon: <Settings className="w-6 h-6" />,
        level: 'intermediate'
    },
    {
        title: 'Data Segregation',
        description: 'Enforce strict data isolation between customer groups preventing cross-customer visibility for multi-tenant security.',
        category: 'Customer Groups',
        link: '/docs/admin-guide/creating-customers',
        icon: <Shield className="w-6 h-6" />,
        level: 'advanced'
    },
    {
        title: 'Production/Test Environment Separation',
        description: 'Segregate production sites from test environments using customer groups to prevent operator confusion and test alarm interference.',
        category: 'Customer Groups',
        link: '/docs/admin-guide/creating-customers',
        icon: <Target className="w-6 h-6" />,
        level: 'intermediate'
    },

    // Permissions & Security
    {
        title: 'Permissions Matrix',
        description: 'Comprehensive permission mapping showing which roles have access to specific features, actions, and data scopes.',
        category: 'Permissions & Security',
        link: '/docs/admin-guide/permissions-matrix',
        icon: <FileText className="w-6 h-6" />,
        level: 'intermediate'
    },
    {
        title: 'Password Policies',
        description: 'Enforce strong password requirements including complexity rules, expiration policies, and password history tracking.',
        category: 'Permissions & Security',
        link: '/docs/getting-started/password-management',
        icon: <Lock className="w-6 h-6" />,
        level: 'basic'
    },
    {
        title: 'Two-Factor Authentication (2FA)',
        description: 'Optional 2FA enforcement for enhanced account security with support for authenticator apps and SMS verification.',
        category: 'Permissions & Security',
        link: '/docs/getting-started/password-management',
        icon: <ShieldAlert className="w-6 h-6" />,
        level: 'advanced'
    },
    {
        title: 'Single Sign-On (SSO)',
        description: 'Enterprise SSO integration with SAML 2.0 and OAuth 2.0 for seamless authentication across corporate identity providers.',
        category: 'Permissions & Security',
        link: '/docs/getting-started/first-time-login',
        icon: <Key className="w-6 h-6" />,
        level: 'advanced'
    },

    // Operator Management
    {
        title: 'Operator Privilege Adjustment',
        description: 'Fine-tune operator permissions for Talos alarm monitoring including alarm actions, site access, and administrative functions.',
        category: 'Operator Management',
        link: '/docs/admin-guide/adjust-user-operator-privileges',
        icon: <UserCog className="w-6 h-6" />,
        level: 'intermediate'
    },
    {
        title: 'Operator Groups & Alarm Routing',
        description: 'Organize operators into groups for targeted alarm routing, shift management, and workload distribution.',
        category: 'Operator Management',
        link: '/docs/admin-guide/adjust-user-operator-privileges',
        icon: <UsersIcon className="w-6 h-6" />,
        level: 'advanced'
    },

    // Monitoring & Audit
    {
        title: 'User Activity Logging',
        description: 'Complete audit trail of user actions including logins, configuration changes, alarm actions, and data access for compliance.',
        category: 'Monitoring & Audit',
        link: '/docs/reporting/user-activity',
        icon: <Activity className="w-6 h-6" />,
        level: 'advanced'
    },
    {
        title: 'User Analytics',
        description: 'Dashboard analytics showing user login patterns, feature usage, session duration, and role distribution metrics.',
        category: 'Monitoring & Audit',
        link: '/docs/reporting/user-activity',
        icon: <BarChart3 className="w-6 h-6" />,
        level: 'advanced'
    },
    {
        title: 'Access Reports',
        description: 'Generate detailed reports on user access patterns, permission changes, and role assignments for security audits.',
        category: 'Monitoring & Audit',
        link: '/docs/reporting/user-activity',
        icon: <FileText className="w-6 h-6" />,
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
    { name: 'Permissions & Security', icon: <Lock className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'Permissions & Security').length },
    { name: 'Operator Management', icon: <UserCog className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'Operator Management').length },
    { name: 'Monitoring & Audit', icon: <Activity className="w-5 h-5" />, count: userFeatures.filter(f => f.category === 'Monitoring & Audit').length },
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
                        <span className="text-[#E8B058] font-medium">User Management</span>
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
                                <Users className="w-16 h-16 text-[#E8B058]" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: 'var(--ifm-color-content)' }}>
                            User Management
                        </h1>
                        <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[#E8B058]">
                            Role-based access control and permissions
                        </p>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Comprehensive RBAC system with custom roles, granular permissions, customer groups, and multi-organization access for enterprise security.
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
                        { icon: <Users className="w-6 h-6" />, label: 'Total Features', value: userFeatures.length },
                        { icon: <ShieldCheck className="w-6 h-6" />, label: 'Role Features', value: userFeatures.filter(f => f.category === 'Role Management').length },
                        { icon: <UserPlus className="w-6 h-6" />, label: 'Admin Features', value: userFeatures.filter(f => f.category === 'User Administration').length },
                        { icon: <Lock className="w-6 h-6" />, label: 'Security Features', value: userFeatures.filter(f => f.category === 'Permissions & Security').length },
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
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${selectedCategory === category.name
                                        ? 'shadow-md' : ''}
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
                                style={{'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
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

                {/* Quick Links Section */}
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
                                title: 'Create Your First Role',
                                description: 'Step-by-step guide to building custom roles',
                                icon: <ShieldCheck className="w-6 h-6" />,
                                link: '/docs/admin-guide/rbac',
                            },
                            {
                                title: 'Invite New Users',
                                description: 'Add users and assign roles quickly',
                                icon: <UserPlus className="w-6 h-6" />,
                                link: '/docs/admin-guide/creating-users',
                            },
                            {
                                title: 'Setup Customer Groups',
                                description: 'Configure data segregation and access control',
                                icon: <Building2 className="w-6 h-6" />,
                                link: '/docs/admin-guide/creating-customers',
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
