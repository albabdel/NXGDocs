import React, { useState, useMemo, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { motion, AnimatePresence } from 'framer-motion';
import { useColorMode } from '@docusaurus/theme-common';
import PageHeader from '../components/PageHeader';
import LandingPageBackground from '../components/LandingPageBackground/LandingPageBackground';
import {
    Search,
    ChevronDown,
    ChevronUp,
    Calendar,
    TrendingUp,
    X,
    CheckCircle2,
    Clock,
    Zap,
    HelpCircle,
    ExternalLink,
    Layers,
    Lightbulb,
    Wrench,
    AlertTriangle,
    Monitor
} from 'lucide-react';
import roadmapData from '../data/sanity-roadmap.generated.json';

type RoadmapStatus = 'Planned' | 'In Progress' | 'Shipped';
type ChangeType = 'feature' | 'improvement' | 'fix' | 'breaking';

interface RoadmapItem {
    _id: string;
    _updatedAt: string;
    title: string;
    description?: string;
    status: RoadmapStatus;
    projectedRelease: string;
    businessValue?: string;
    changeType: ChangeType;
    uiChange: boolean;
    entitiesImpacted?: string[];
    releaseSlug?: string | null;
}

const getStatusConfig = (status: RoadmapStatus) => {
    switch (status) {
        case 'Shipped':
            return {
                icon: <CheckCircle2 className="w-4 h-4" />,
                label: 'Shipped',
                colorClass: 'bg-green-500/20 text-green-400 border-green-500/30',
            };
        case 'In Progress':
            return {
                icon: <Zap className="w-4 h-4" />,
                label: 'In Progress',
                colorClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            };
        case 'Planned':
            return {
                icon: <Layers className="w-4 h-4" />,
                label: 'Planned',
                colorClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            };
        default:
            return {
                icon: <Clock className="w-4 h-4" />,
                label: status,
                colorClass: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
            };
    }
};

const getChangeTypeConfig = (changeType: ChangeType) => {
    switch (changeType) {
        case 'feature':
            return {
                icon: <Lightbulb className="w-4 h-4" />,
                label: 'Feature',
                colorClass: 'bg-purple-500/20 text-purple-400',
            };
        case 'improvement':
            return {
                icon: <TrendingUp className="w-4 h-4" />,
                label: 'Improvement',
                colorClass: 'bg-cyan-500/20 text-cyan-400',
            };
        case 'fix':
            return {
                icon: <Wrench className="w-4 h-4" />,
                label: 'Fix',
                colorClass: 'bg-orange-500/20 text-orange-400',
            };
        case 'breaking':
            return {
                icon: <AlertTriangle className="w-4 h-4" />,
                label: 'Breaking Change',
                colorClass: 'bg-red-500/20 text-red-400',
            };
        default:
            return {
                icon: <Lightbulb className="w-4 h-4" />,
                label: changeType,
                colorClass: 'bg-gray-500/20 text-gray-400',
            };
    }
};

function useIsDark(): boolean {
    const [isDark, setIsDark] = useState(true);
    const { colorMode } = useColorMode();
    
    useEffect(() => {
        setIsDark(colorMode === 'dark');
    }, [colorMode]);
    
    return isDark;
}

const RoadmapItemCard: React.FC<{
    item: RoadmapItem;
    index: number;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ item, index, isExpanded, onToggle }) => {
    const statusConfig = getStatusConfig(item.status);
    const changeTypeConfig = getChangeTypeConfig(item.changeType);
    const isDark = useIsDark();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`rounded-lg border overflow-hidden hover:border-opacity-40 transition-all ${
                isDark
                    ? 'bg-[#202020] border-white/10 hover:border-[#E8B058]/30'
                    : 'bg-white border-gray-200 hover:border-[#E8B058]/50 shadow-sm'
            }`}
        >
            <button
                onClick={onToggle}
                className={`w-full p-6 text-left transition-colors ${
                    isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                }`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.title}
                            </h3>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full border flex items-center gap-1.5 ${statusConfig.colorClass}`}>
                                {statusConfig.icon}
                                {statusConfig.label}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <Calendar className={`w-4 h-4 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
                                <div>
                                    <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Projected Release</div>
                                    <div className={`text-sm ${isDark ? 'text-white/90' : 'text-gray-700'}`}>{item.projectedRelease}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {changeTypeConfig.icon}
                                <div>
                                    <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Change Type</div>
                                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${changeTypeConfig.colorClass}`}>
                                        {changeTypeConfig.label}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0 mt-2">
                        {isExpanded ? (
                            <ChevronUp className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
                        ) : (
                            <ChevronDown className={`w-5 h-5 ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
                        )}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`overflow-hidden ${isDark ? 'border-t border-white/10' : 'border-t border-gray-100'}`}
                    >
                        <div className={`p-6 space-y-6 ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                            {item.description && (
                                <div>
                                    <h4 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
                                        Description
                                    </h4>
                                    <p className={`leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                                        {item.description}
                                    </p>
                                </div>
                            )}

                            {item.businessValue && (
                                <div className={`p-4 rounded-lg border ${
                                    isDark
                                        ? 'bg-[#E8B058]/5 border-[#E8B058]/20'
                                        : 'bg-amber-50 border-[#E8B058]/30'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-[#E8B058]" />
                                        <h4 className="text-sm font-semibold text-[#E8B058]">Business Value</h4>
                                    </div>
                                    <p className={`leading-relaxed ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
                                        {item.businessValue}
                                    </p>
                                </div>
                            )}

                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-200'}`}>
                                <div className="flex items-center gap-3">
                                    <Monitor className={`w-4 h-4 ${item.uiChange ? 'text-[#E8B058]' : isDark ? 'text-white/30' : 'text-gray-300'}`} />
                                    <div>
                                        <div className={`text-xs ${isDark ? 'text-white/50' : 'text-gray-500'}`}>UI Change</div>
                                        <div className={`text-sm ${item.uiChange ? 'text-[#E8B058]' : isDark ? 'text-white/50' : 'text-gray-400'}`}>
                                            {item.uiChange ? 'Yes' : 'No'}
                                        </div>
                                    </div>
                                </div>

                                {item.entitiesImpacted && item.entitiesImpacted.length > 0 && (
                                    <div>
                                        <div className={`text-xs mb-2 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
                                            Entities Impacted
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {item.entitiesImpacted.map((entity, idx) => (
                                                <span
                                                    key={idx}
                                                    className={`px-2 py-1 text-xs rounded border ${
                                                        isDark
                                                            ? 'bg-white/5 text-white/70 border-white/10'
                                                            : 'bg-gray-100 text-gray-600 border-gray-200'
                                                    }`}
                                                >
                                                    {entity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {item.status === 'Shipped' && item.releaseSlug && (
                                <div className={`pt-4 ${isDark ? 'border-t border-white/10' : 'border-t border-gray-200'}`}>
                                    <Link
                                        to={`/releases/${item.releaseSlug}`}
                                        className="inline-flex items-center gap-2 text-sm text-[#E8B058] hover:text-[#D4A047] transition-colors font-medium no-underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Released in {item.releaseSlug.replace(/-/g, ' ').replace(/^sprint /i, 'Sprint ')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const formatLastUpdated = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

const getLatestUpdateDate = (items: RoadmapItem[]): string | null => {
    if (!items || items.length === 0) return null;
    
    const dates = items
        .map(item => item._updatedAt)
        .filter(Boolean)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    return dates[0] || null;
};

function RoadmapContent(): JSX.Element {
    const isDark = useIsDark();
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const statusOptions = ['All', 'Planned', 'In Progress', 'Shipped'];

    const filteredItems = useMemo(() => {
        return (roadmapData as RoadmapItem[]).filter(item => {
            const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
            const matchesSearch = searchQuery === '' ||
                item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            
            return matchesStatus && matchesSearch;
        });
    }, [searchQuery, statusFilter]);

    const stats = useMemo(() => {
        const data = roadmapData as RoadmapItem[];
        return {
            total: data.length,
            planned: data.filter(i => i.status === 'Planned').length,
            inProgress: data.filter(i => i.status === 'In Progress').length,
            shipped: data.filter(i => i.status === 'Shipped').length,
        };
    }, []);

    const lastUpdated = useMemo(() => {
        return getLatestUpdateDate(roadmapData as RoadmapItem[]);
    }, []);

    const handleToggle = (id: string) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const resetFilters = () => {
        setStatusFilter('All');
        setSearchQuery('');
    };

    const hasActiveFilters = statusFilter !== 'All' || searchQuery !== '';

    return (
        <main className="min-h-screen">
            <PageHeader
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Roadmap' }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className={`text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Product Roadmap
                    </h1>
                    <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                        Stay informed about our development priorities and upcoming features.
                        This roadmap reflects our current plans and is updated regularly.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#202020] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.total}</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Total Items</div>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#202020] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className="text-2xl font-bold mb-1 text-yellow-400">{stats.planned}</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Planned</div>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#202020] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className="text-2xl font-bold mb-1 text-blue-400">{stats.inProgress}</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>In Progress</div>
                    </div>
                    <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#202020] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <div className="text-2xl font-bold mb-1 text-green-400">{stats.shipped}</div>
                        <div className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Shipped</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-8 space-y-4"
                >
                    <div className="relative">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Search roadmap items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-12 pr-12 py-3 rounded-lg focus:outline-none focus:border-[#E8B058]/50 transition-colors ${
                                isDark
                                    ? 'bg-[#202020] border border-white/10 text-white placeholder-white/40'
                                    : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-400 shadow-sm'
                            }`}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {statusOptions.map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    statusFilter === status
                                        ? 'bg-[#E8B058] text-black'
                                        : isDark
                                            ? 'bg-[#202020] border border-white/10 text-white/70 hover:border-[#E8B058]/30 hover:text-white'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:border-[#E8B058]/50 hover:text-gray-900 shadow-sm'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <div className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                        Showing {filteredItems.length} of {(roadmapData as RoadmapItem[]).length} items
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-4"
                >
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <RoadmapItemCard
                                key={item._id}
                                item={item}
                                index={index}
                                isExpanded={expandedId === item._id}
                                onToggle={() => handleToggle(item._id)}
                            />
                        ))
                    ) : (
                        <div className={`text-center py-12 rounded-lg border ${isDark ? 'bg-[#202020] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <p className={`mb-4 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                                No roadmap items match your filters.
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058] text-black rounded-lg text-sm font-medium hover:bg-[#D4A047] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className={`mt-12 p-6 rounded-lg border ${isDark ? 'bg-[#202020] border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}
                >
                    <div className="flex items-start gap-3">
                        <HelpCircle className="w-5 h-5 text-[#E8B058] flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                About This Roadmap
                            </h3>
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                                This roadmap represents our current development plans and priorities. Release dates and features are subject to change based on customer feedback, technical considerations, and business priorities. We update this roadmap regularly to reflect our latest plans.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {lastUpdated && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`mt-8 text-center text-sm ${isDark ? 'text-white/40' : 'text-gray-400'}`}
                    >
                        Last updated: {formatLastUpdated(lastUpdated)}
                    </motion.div>
                )}
            </div>
        </main>
    );
}

export default function RoadmapPage(): JSX.Element {
    return (
        <Layout
            title="Product Roadmap"
            description="Product Roadmap - Preview of upcoming features and improvements"
        >
            <LandingPageBackground />
            <RoadmapContent />
        </Layout>
    );
}
