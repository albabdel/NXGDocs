import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import PageHeader from '../components/PageHeader';
import LandingPageBackground from '../components/LandingPageBackground/LandingPageBackground';
import {
    Search,
    ChevronDown,
    ChevronUp,
    Calendar,
    TrendingUp,
    Filter,
    X,
    CheckCircle2,
    Clock,
    Zap,
    HelpCircle,
    ExternalLink,
    Layers
} from 'lucide-react';
import { roadmapFeatures, roadmapStats, roadmapBacklog, roadmapBacklogStats, RoadmapFeature, RoadmapStatus, RoadmapEpic, RoadmapItem } from '../data/roadmap';

// Get status icon and color
const getStatusConfig = (status: RoadmapStatus) => {
    switch (status) {
        case 'Launched':
            return {
                icon: <CheckCircle2 className="w-4 h-4" />,
                color: 'bg-green-500/20 text-green-400 border-green-500/30',
                bgColor: 'bg-green-500/10'
            };
        case 'Beta':
            return {
                icon: <Zap className="w-4 h-4" />,
                color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                bgColor: 'bg-purple-500/10'
            };
        case 'In Development':
            return {
                icon: <Clock className="w-4 h-4" />,
                color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                bgColor: 'bg-blue-500/10'
            };
        case 'Planning':
            return {
                icon: <Layers className="w-4 h-4" />,
                color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
                bgColor: 'bg-yellow-500/10'
            };
        case 'Coming Soon':
            return {
                icon: <TrendingUp className="w-4 h-4" />,
                color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                bgColor: 'bg-gray-500/10'
            };
        default:
            return {
                icon: <Clock className="w-4 h-4" />,
                color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
                bgColor: 'bg-gray-500/10'
            };
    }
};

// Expandable Feature Card Component
const FeatureCard: React.FC<{ feature: RoadmapFeature; index: number; defaultExpanded?: boolean }> = ({ feature, index, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);
    const statusConfig = getStatusConfig(feature.status);
    
    // Sync with defaultExpanded prop changes
    React.useEffect(() => {
        setIsExpanded(defaultExpanded);
    }, [defaultExpanded]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-[#202020] rounded-lg border border-white/10 overflow-hidden hover:border-white/20 transition-all"
        >
            {/* Card Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 ${statusConfig.color}`}>
                                {statusConfig.icon}
                                {feature.status}
                            </span>
                        </div>
                        
                        {/* Overview Table - Always Visible */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {feature.applicableTo && (
                                <div>
                                    <div className="text-xs text-white/50 mb-1">Applicable To</div>
                                    <div className="text-sm text-white/90">{feature.applicableTo}</div>
                                </div>
                            )}
                            <div>
                                <div className="text-xs text-white/50 mb-1">Projected Release</div>
                                <div className="text-sm text-white/90">{feature.projectedRelease}</div>
                            </div>
                            {feature.generalAvailability && (
                                <div>
                                    <div className="text-xs text-white/50 mb-1">General Availability</div>
                                    <div className="text-sm text-white/90">{feature.generalAvailability}</div>
                                </div>
                            )}
                            {feature.category && (
                                <div>
                                    <div className="text-xs text-white/50 mb-1">Category</div>
                                    <div className="text-sm text-white/90">{feature.category}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-white/60" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-white/60" />
                        )}
                    </div>
                </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-white/10"
                    >
                        <div className="p-6 bg-[#1a1a1a] space-y-6">
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-semibold text-white/90 mb-2">Description</h4>
                                <p className="text-white/70 leading-relaxed">{feature.description}</p>
                            </div>

                            {/* Business Value Section */}
                            <div className={`p-4 rounded-lg border ${statusConfig.bgColor} border-white/10`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-[#E8B058]" />
                                    <h4 className="text-sm font-semibold text-[#E8B058]">Business Value</h4>
                                </div>
                                <p className="text-white/90 leading-relaxed">{feature.businessValue}</p>
                            </div>

                            {/* Additional Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                {feature.tags && feature.tags.length > 0 && (
                                    <div>
                                        <div className="text-xs text-white/50 mb-2">Tags</div>
                                        <div className="flex flex-wrap gap-2">
                                            {feature.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 text-xs bg-white/5 text-white/70 rounded border border-white/10"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {feature.helpLink && (
                                    <div>
                                        <div className="text-xs text-white/50 mb-2">Resources</div>
                                        <a
                                            href={feature.helpLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-sm text-[#E8B058] hover:text-[#D4A047] transition-colors"
                                        >
                                            Help Link
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function RoadmapPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<string>('All');
    const [selectedQuarter, setSelectedQuarter] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [expandedAll, setExpandedAll] = useState(false);

    // Get unique years, quarters, statuses, and categories
    const availableYears = useMemo(() => {
        const years = Array.from(new Set(roadmapFeatures.map(f => f.year))).sort((a, b) => b - a);
        return years.map(y => y.toString());
    }, []);

    const availableQuarters = useMemo(() => {
        const quarters = Array.from(new Set(roadmapFeatures.map(f => f.quarter).filter(Boolean))).sort();
        return quarters;
    }, []);

    const availableStatuses = useMemo(() => {
        return Array.from(new Set(roadmapFeatures.map(f => f.status))).sort();
    }, []);

    const availableCategories = useMemo(() => {
        const categories = Array.from(new Set(roadmapFeatures.map(f => f.category).filter(Boolean))).sort();
        return categories;
    }, []);

    // Filter features
    const filteredFeatures = useMemo(() => {
        return roadmapFeatures.filter(feature => {
            const matchesSearch = searchQuery === '' || 
                feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                feature.businessValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (feature.tags && feature.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

            const matchesYear = selectedYear === 'All' || feature.year.toString() === selectedYear;
            const matchesQuarter = selectedQuarter === 'All' || feature.quarter === selectedQuarter;
            const matchesStatus = selectedStatus === 'All' || feature.status === selectedStatus;
            const matchesCategory = selectedCategory === 'All' || feature.category === selectedCategory;

            return matchesSearch && matchesYear && matchesQuarter && matchesStatus && matchesCategory;
        });
    }, [searchQuery, selectedYear, selectedQuarter, selectedStatus, selectedCategory]);

    const hasActiveFilters = selectedYear !== 'All' || selectedQuarter !== 'All' || 
                            selectedStatus !== 'All' || selectedCategory !== 'All';

    const resetFilters = () => {
        setSelectedYear('All');
        setSelectedQuarter('All');
        setSelectedStatus('All');
        setSelectedCategory('All');
        setSearchQuery('');
    };

    return (
        <Layout
            title="Product Roadmap"
            description="Product Roadmap - Preview of upcoming features and improvements"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Roadmap' }
                    ]}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Product Roadmap
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                            We remain committed to empowering security operations with enterprise-grade capabilities. 
                            Our Product Roadmap page is here to give you a preview of what's in our pipeline.
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
                    >
                        <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-white mb-1">{roadmapStats.total}</div>
                            <div className="text-xs text-white/60">Total Features</div>
                        </div>
                        <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-green-400 mb-1">{roadmapStats.byStatus.Launched}</div>
                            <div className="text-xs text-white/60">Launched</div>
                        </div>
                        <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-blue-400 mb-1">{roadmapStats.byStatus['In Development']}</div>
                            <div className="text-xs text-white/60">In Development</div>
                        </div>
                        <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-yellow-400 mb-1">{roadmapStats.byStatus.Planning}</div>
                            <div className="text-xs text-white/60">Planning</div>
                        </div>
                        <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                            <div className="text-2xl font-bold text-purple-400 mb-1">{roadmapStats.byStatus.Beta}</div>
                            <div className="text-xs text-white/60">Beta</div>
                        </div>
                    </motion.div>

                    {/* Search and Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8 space-y-4"
                    >
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search for a specific feature"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#202020] border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#E8B058]/50 transition-colors"
                            />
                        </div>

                        {/* Filters and Expand All */}
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <Filter className="w-4 h-4 text-white/60" />
                                <span className="text-sm text-white/60">Filters:</span>
                                
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="All">Year: All</option>
                                    {availableYears.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedQuarter}
                                    onChange={(e) => setSelectedQuarter(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="All">Quarter: All</option>
                                    {availableQuarters.map(quarter => (
                                        <option key={quarter} value={quarter}>{quarter}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="All">Status: All</option>
                                    {availableStatuses.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="All">Category: All</option>
                                    {availableCategories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>

                                {hasActiveFilters && (
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        Reset
                                    </button>
                                )}
                            </div>

                            <div className="ml-auto">
                                <button
                                    onClick={() => setExpandedAll(!expandedAll)}
                                    className="px-4 py-1.5 bg-[#202020] border border-white/10 rounded-lg text-white text-sm hover:bg-white/5 transition-colors"
                                >
                                    {expandedAll ? 'Collapse All' : 'Expand All'}
                                </button>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="text-sm text-white/60">
                            Showing {filteredFeatures.length} of {roadmapFeatures.length} features
                        </div>
                    </motion.div>

                    {/* Features List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="space-y-4"
                    >
                        {filteredFeatures.length > 0 ? (
                            filteredFeatures.map((feature, index) => (
                                <FeatureCard
                                    key={feature.id}
                                    feature={feature}
                                    index={index}
                                    defaultExpanded={expandedAll}
                                />
                            ))
                        ) : (
                            <div className="text-center py-12 bg-[#202020] rounded-lg border border-white/10">
                                <p className="text-white/60">No features match your filters. Try adjusting your search or filters.</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Product Backlog Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-16"
                    >
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Product Backlog</h2>
                            <p className="text-white/70">
                                Detailed backlog items organized by epic ({roadmapBacklogStats.total} items across {roadmapBacklog.length} epics)
                            </p>
                        </div>

                        {/* Backlog Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{roadmapBacklogStats.total}</div>
                                <div className="text-sm text-white/60">Total Items</div>
                            </div>
                            <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{roadmapBacklogStats.byType.Story || 0}</div>
                                <div className="text-sm text-white/60">Stories</div>
                            </div>
                            <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{roadmapBacklogStats.byType.Task || 0}</div>
                                <div className="text-sm text-white/60">Tasks</div>
                            </div>
                            <div className="p-4 bg-[#202020] rounded-lg border border-white/10">
                                <div className="text-2xl font-bold text-white">{roadmapBacklogStats.byType.Bug || 0}</div>
                                <div className="text-sm text-white/60">Bugs</div>
                            </div>
                        </div>

                        {/* Epics */}
                        <div className="space-y-6">
                            {roadmapBacklog.map((epic, epicIdx) => (
                                <motion.div
                                    key={epic.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: epicIdx * 0.05 }}
                                    viewport={{ once: true }}
                                    className="bg-[#202020] rounded-xl border border-white/10 overflow-hidden"
                                >
                                    <div className="p-6 border-b border-white/10">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-1">{epic.name}</h3>
                                                <p className="text-sm text-white/60">{epic.items.length} items</p>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="text-white/60">
                                                    <span className="text-white font-medium">{epic.items.filter(i => i.status === 'Done').length}</span> Done
                                                </div>
                                                <div className="text-white/60">
                                                    <span className="text-white font-medium">{epic.items.filter(i => i.status === 'In Progress').length}</span> In Progress
                                                </div>
                                                <div className="text-white/60">
                                                    <span className="text-white font-medium">{epic.items.filter(i => i.status === 'To do').length}</span> To Do
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-3">
                                            {epic.items.map((item, itemIdx) => {
                                                const statusColors = {
                                                    'Done': 'bg-green-500/20 text-green-400 border-green-500/30',
                                                    'In Progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                                    'In Staging': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                                                    'To do': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                                };
                                                const typeColors = {
                                                    'Story': 'bg-blue-500/20 text-blue-400',
                                                    'Task': 'bg-yellow-500/20 text-yellow-400',
                                                    'Bug': 'bg-red-500/20 text-red-400'
                                                };
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="p-4 bg-[#1a1a1a] rounded-lg border border-white/5 hover:border-white/10 transition-colors"
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                    <span className="text-xs font-mono text-white/50">{item.id}</span>
                                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeColors[item.type] || 'bg-gray-500/20 text-gray-400'}`}>
                                                                        {item.type}
                                                                    </span>
                                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${statusColors[item.status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
                                                                        {item.status}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-white font-medium mb-2">{item.title}</h4>
                                                                {item.assignees && item.assignees.length > 0 && (
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <span className="text-xs text-white/50">Assignees:</span>
                                                                        {item.assignees.map((assignee, idx) => (
                                                                            <span key={idx} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/30">
                                                                                {assignee}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                {item.tags && item.tags.filter(tag => tag !== 'Add Tag').length > 0 && (
                                                                    <div className="flex items-center gap-2 flex-wrap mt-2">
                                                                        {item.tags.filter(tag => tag !== 'Add Tag').map((tag, idx) => (
                                                                            <span key={idx} className="px-2 py-0.5 bg-white/5 text-white/60 rounded text-xs border border-white/10">
                                                                                {tag}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Footer Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-12 p-6 bg-[#202020] rounded-lg border border-white/10"
                    >
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 text-[#E8B058] flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-white mb-2">About This Roadmap</h3>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    This roadmap represents our current development plans and priorities. Release dates and features are subject to change based on customer feedback, technical considerations, and business priorities. We update this roadmap regularly to reflect our latest plans.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}

