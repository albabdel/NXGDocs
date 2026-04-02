import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from '@docusaurus/Link';
import { useProduct } from '@theme/Root';
import {
    Download,
    Search,
    Filter,
    X,
    ChevronRight,
    FileText,
    Home,
    Package,
    Server,
    Camera,
    Box,
    HardDrive,
    Cpu,
    Radio,
    Cloud,
    CheckCircle2,
    ExternalLink,
    FileDown,
    Info,
    AlertCircle,
    Zap,
    Shield,
    Database
} from 'lucide-react';

// Device SDK/Client data structure
type DeviceClient = {
    vendor: string;
    name: string;
    category: 'NVR' | 'VMS' | 'IP Camera' | 'Cloud VMS' | 'Router' | 'IOT' | 'AI Box' | 'Tools';
    logo?: string;
    clients: {
        name: string;
        version: string;
        type: 'SDK' | 'Test Client' | 'Configuration Tool' | 'Mobile App';
        platform: 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Web';
        size?: string;
        releaseDate?: string;
        downloadUrl: string;
        description?: string;
    }[];
    documentationLink?: string;
    supportedFeatures?: string[];
};

// Sample device client data
const deviceClients: DeviceClient[] = [
    {
        vendor: 'Hikvision',
        name: 'Hikvision Integration Tools',
        category: 'NVR',
        clients: [
            {
                name: 'Hikvision Test Client',
                version: '6.1.9.4',
                type: 'Test Client',
                platform: 'Windows',
                size: '45.2 MB',
                releaseDate: '2024-12-15',
                downloadUrl: '#',
                description: 'Test client for validating Hikvision NVR/camera integrations with the platform'
            },
            {
                name: 'Hikvision SDK',
                version: '6.1.9.4',
                type: 'SDK',
                platform: 'Windows',
                size: '128 MB',
                releaseDate: '2024-12-15',
                downloadUrl: '#',
                description: 'Full SDK for advanced integration development'
            }
        ],
        supportedFeatures: ['Live Streaming', 'Playback', 'Events', 'PTZ', 'Two-Way Audio']
    },
    {
        vendor: 'Dahua',
        name: 'Dahua Integration Tools',
        category: 'NVR',
        clients: [
            {
                name: 'Dahua Test Client',
                version: '5.2.1',
                type: 'Test Client',
                platform: 'Windows',
                size: '42.8 MB',
                releaseDate: '2024-11-20',
                downloadUrl: '#',
                description: 'Test client for Dahua device integration validation'
            }
        ],
        documentationLink: '/docs/devices'
    },
    {
        vendor: 'Axis',
        name: 'Axis Integration Tools',
        category: 'IP Camera',
        clients: [
            {
                name: 'Axis Camera Test Tool',
                version: '4.8.2',
                type: 'Test Client',
                platform: 'Windows',
                size: '38.5 MB',
                releaseDate: '2024-12-01',
                downloadUrl: '#',
                description: 'Test tool for Axis camera and device integration'
            }
        ],
        documentationLink: '/docs/devices/axis/configuration'
    },
    {
        vendor: 'Milestone',
        name: 'Milestone XProtect SDK',
        category: 'VMS',
        clients: [
            {
                name: 'Milestone Mobile Server SDK',
                version: '2024 R1',
                type: 'SDK',
                platform: 'Windows',
                size: '156 MB',
                releaseDate: '2024-10-15',
                downloadUrl: '#',
                description: 'SDK for integrating with Milestone XProtect VMS'
            }
        ],
    },
    {
        vendor: 'Avigilon',
        name: 'Avigilon ACC Tools',
        category: 'VMS',
        clients: [
            {
                name: 'Avigilon WebAPI Test Client',
                version: '7.16.0',
                type: 'Test Client',
                platform: 'Windows',
                size: '52.3 MB',
                releaseDate: '2024-11-28',
                downloadUrl: '#',
                description: 'Test client for Avigilon ACC WebAPI integration'
            }
        ],
        documentationLink: '/docs/devices'
    },
    {
        vendor: 'Adpro',
        name: 'Adpro FastTrace Tools',
        category: 'NVR',
        clients: [
            {
                name: 'Adpro Integration Client',
                version: '3.4.5',
                type: 'Test Client',
                platform: 'Windows',
                size: '34.7 MB',
                releaseDate: '2024-09-12',
                downloadUrl: '#',
                description: 'Integration test client for Adpro FastTrace NVR'
            }
        ]
    },
    {
        vendor: 'Camect',
        name: 'Camect AI Box SDK',
        category: 'AI Box',
        clients: [
            {
                name: 'Camect API Test Tool',
                version: '2.8.1',
                type: 'Test Client',
                platform: 'Web',
                size: 'N/A',
                releaseDate: '2024-12-10',
                downloadUrl: '#',
                description: 'Web-based API testing tool for Camect AI Box'
            }
        ],
        documentationLink: '/docs/devices'
    },
    {
        vendor: 'Hanwha',
        name: 'Hanwha Wisenet Tools',
        category: 'NVR',
        clients: [
            {
                name: 'Wisenet Test Client',
                version: '4.2.0',
                type: 'Test Client',
                platform: 'Windows',
                size: '41.2 MB',
                releaseDate: '2024-10-25',
                downloadUrl: '#',
                description: 'Test client for Hanwha Wisenet devices'
            }
        ],
        documentationLink: '/docs/devices'
    },
];

// Category icons
const categoryIcons = {
    'NVR': <HardDrive className="w-5 h-5" />,
    'VMS': <Server className="w-5 h-5" />,
    'IP Camera': <Camera className="w-5 h-5" />,
    'Cloud VMS': <Cloud className="w-5 h-5" />,
    'Router': <Radio className="w-5 h-5" />,
    'IOT': <Zap className="w-5 h-5" />,
    'AI Box': <Cpu className="w-5 h-5" />,
    'Tools': <Package className="w-5 h-5" />,
};

// Client type colors
const clientTypeColors = {
    'SDK': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'Test Client': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'Configuration Tool': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Mobile App': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

// Platform icons/labels
const platformLabels = {
    'Windows': 'Windows',
    'macOS': 'macOS',
    'Linux': 'Linux',
    'Android': 'Android',
    'iOS': 'iOS',
    'Web': 'Web',
};

export default function DownloadIntegrationHub() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All Vendors');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDevice, setSelectedDevice] = useState<DeviceClient | null>(null);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(deviceClients.map(d => d.category)));
        return ['All Vendors', ...cats];
    }, []);

    // Filter devices
    const filteredDevices = useMemo(() => {
        return deviceClients.filter(device => {
            const matchesCategory = selectedCategory === 'All Vendors' || device.category === selectedCategory;
            const matchesSearch =
                device.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                device.clients.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <Layout
            title="Download Integration Tools"
            description="Download SDK clients and test tools to validate your device integrations with GCXONE"
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
                        <span className="text-[#E8B058] font-medium">Download Integration Tools</span>
                    </nav>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-2xl" style={{ backgroundColor: "var(--ifm-color-emphasis-100)", border: "1px solid var(--ifm-color-emphasis-200)" }}>
                                <Download className="w-16 h-16 text-[#E8B058]" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6" style={{ color: "var(--ifm-color-content)" }}>
                            Download Integration Tools
                        </h1>
                        <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto text-[#E8B058]">
                            Test and validate your device integrations
                        </p>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--ifm-color-content-secondary)" }}>
                            Download SDK clients, test tools, and configuration utilities to connect your devices and validate GCXONE integration in your own environment.
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
                        { icon: <Package className="w-6 h-6" />, label: 'Device Vendors', value: deviceClients.length },
                        { icon: <Download className="w-6 h-6" />, label: 'Available Clients', value: deviceClients.reduce((acc, d) => acc + d.clients.length, 0) },
                        { icon: <Shield className="w-6 h-6" />, label: 'Categories', value: categories.length - 1 },
                        { icon: <CheckCircle2 className="w-6 h-6" />, label: 'Ready to Test', value: '100%' },
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
                {/* Info Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Info className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                How to Test Your Integration
                            </h3>
                            <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-decimal list-inside">
                                <li>Download the SDK client or test tool for your device vendor</li>
                                <li>Install and configure the client with your device credentials</li>
                                <li>Connect your device to the test client to validate connectivity</li>
                                <li>Test key features (live streaming, events, PTZ, etc.) before production deployment</li>
                                <li>Review our documentation for device-specific integration guides</li>
                            </ol>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Filter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-12"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by vendor, device, or client name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
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
                                <span>Showing {filteredDevices.length} vendors</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    selectedCategory === category
                                        ? 'bg-emerald-600 text-white shadow-md'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500'
                                }`}
                            >
                                {category !== 'All Vendors' && categoryIcons[category as keyof typeof categoryIcons]}
                                <span className="font-medium">{category}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Device Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredDevices.map((device, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div
                                onClick={() => setSelectedDevice(device)}
                                className="block h-full bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group cursor-pointer"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {categoryIcons[device.category]}
                                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                    {device.category}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                {device.vendor}
                                            </h3>
                                            <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                {device.name}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg group-hover:scale-110 transition-transform" style={{
                                            backgroundColor: 'rgba(232, 176, 88, 0.1)',
                                            color: '#E8B058'
                                        }}>
                                            <Download className="w-6 h-6" />
                                        </div>
                                    </div>

                                    {/* Available Clients */}
                                    <div className="space-y-2 mb-4">
                                        {device.clients.slice(0, 2).map((client, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {client.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        v{client.version} • {platformLabels[client.platform]}
                                                    </div>
                                                </div>
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${clientTypeColors[client.type]}`}>
                                                    {client.type}
                                                </span>
                                            </div>
                                        ))}
                                        {device.clients.length > 2 && (
                                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium text-center">
                                                +{device.clients.length - 2} more client{device.clients.length - 2 !== 1 ? 's' : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {device.clients.length} client{device.clients.length !== 1 ? 's' : ''} available
                                        </div>
                                        <div className="flex items-center text-sm font-medium" style={{ color: '#E8B058' }}>
                                            View Details
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {filteredDevices.length === 0 && (
                    <div className="text-center py-16">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--ifm-color-emphasis-400)' }} />
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                            No vendors found
                        </h3>
                        <p className="mb-6" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('All Vendors');
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

            {/* Device Detail Modal */}
            <AnimatePresence>
                {selectedDevice && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedDevice(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 p-6 rounded-t-2xl">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            {categoryIcons[selectedDevice.category]}
                                            <span className="text-sm font-medium text-white/80 uppercase">
                                                {selectedDevice.category}
                                            </span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {selectedDevice.vendor}
                                        </h2>
                                        <p className="text-white/90">
                                            {selectedDevice.name}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedDevice(null)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6">
                                {/* Available Clients */}
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        Available Clients & SDKs
                                    </h3>
                                    <div className="space-y-4">
                                        {selectedDevice.clients.map((client, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                            {client.name}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${clientTypeColors[client.type]}`}>
                                                                {client.type}
                                                            </span>
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                                {platformLabels[client.platform]}
                                                            </span>
                                                        </div>
                                                        {client.description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                                {client.description}
                                                            </p>
                                                        )}
                                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                            <span>Version: <strong className="text-gray-900 dark:text-white">{client.version}</strong></span>
                                                            {client.size && <span>Size: <strong className="text-gray-900 dark:text-white">{client.size}</strong></span>}
                                                            {client.releaseDate && <span>Released: <strong className="text-gray-900 dark:text-white">{client.releaseDate}</strong></span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => window.open(client.downloadUrl, '_blank')}
                                                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FileDown className="w-5 h-5" />
                                                    Download {client.type}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Documentation Link */}
                                {selectedDevice.documentationLink && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <Link
                                            to={selectedDevice.documentationLink}
                                            className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-lg transition-colors"
                                        >
                                            <FileText className="w-5 h-5" />
                                            View Integration Documentation
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
}
