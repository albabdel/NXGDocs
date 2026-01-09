import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from '@docusaurus/Link';
import PageHeader from '../../components/PageHeader';
import LandingPageBackground from '../../components/LandingPageBackground/LandingPageBackground';
import { CloudinaryVideo } from '../../components/CloudinaryVideo';
import {
    Calendar,
    Package,
    ArrowLeft,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    FileText,
    Database,
    Zap,
    Radio,
    Activity,
    Tag,
    User,
    Bug,
    ListTodo,
    BookOpen,
    TrendingUp,
    Filter,
    X,
    AlertCircle
} from 'lucide-react';
import { sprint202601AItems, sprint202601AStats, sprint202601AMetadata, SprintItem } from '../../data/sprint-2026-01-a';

// Group items by epic
const groupedByEpic = sprint202601AItems.reduce((acc, item) => {
    if (!acc[item.epic]) {
        acc[item.epic] = [];
    }
    acc[item.epic].push(item);
    return acc;
}, {} as Record<string, SprintItem[]>);

// Get epic icon
const getEpicIcon = (epic: string) => {
    if (epic.includes('DC09') || epic.includes('CMS')) return <Database className="w-5 h-5" />;
    if (epic.includes('Genesis')) return <Zap className="w-5 h-5" />;
    if (epic.includes('Tower')) return <Radio className="w-5 h-5" />;
    if (epic.includes('Healthcheck')) return <Activity className="w-5 h-5" />;
    if (epic.includes('Documentation')) return <FileText className="w-5 h-5" />;
    if (epic.includes('User Management')) return <User className="w-5 h-5" />;
    if (epic.includes('Autostream')) return <Radio className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
};

// Get item type icon
const getItemTypeIcon = (type: string) => {
    switch (type) {
        case 'Story':
            return <BookOpen className="w-4 h-4" />;
        case 'Task':
            return <ListTodo className="w-4 h-4" />;
        case 'Bug':
            return <Bug className="w-4 h-4" />;
        default:
            return <FileText className="w-4 h-4" />;
    }
};

// Get status color
const getStatusColor = (status: string) => {
    switch (status) {
        case 'Done':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'In Progress':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'To do':
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

// Expandable Item Component
const ExpandableItem: React.FC<{ item: SprintItem; index: number }> = ({ item, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-[#1a1a1a] rounded-lg border border-white/10 hover:border-white/20 transition-all overflow-hidden"
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                        {isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-white/60" />
                        ) : (
                            <ChevronRight className="w-5 h-5 text-white/60" />
                        )}
                    </div>
                    
                    <div className="flex-shrink-0 text-xs font-mono text-white/50">
                        {item.id}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`p-1.5 rounded ${getStatusColor(item.status)}`}>
                            {getItemTypeIcon(item.type)}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate mb-1">{item.title}</h4>
                        {item.tags.filter(tag => tag !== 'Add Tag').length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                {item.tags.filter(tag => tag !== 'Add Tag').slice(0, 3).map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/5 text-white/60 rounded text-xs border border-white/10 hover:border-[#E8B058]/30 hover:text-[#E8B058]/80 transition-colors"
                                    >
                                        <Tag className="w-2.5 h-2.5" />
                                        {tag}
                                    </span>
                                ))}
                                {item.tags.filter(tag => tag !== 'Add Tag').length > 3 && (
                                    <span className="text-xs text-white/40">
                                        +{item.tags.filter(tag => tag !== 'Add Tag').length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(item.status)}`}>
                            {item.status}
                        </span>
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
                        className="overflow-hidden border-t border-white/10"
                    >
                        <div className="p-4 bg-[#151515] space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-xs text-white/50 mb-2">Type</div>
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded ${getStatusColor(item.status)}`}>
                                            {getItemTypeIcon(item.type)}
                                        </div>
                                        <span className="text-white">{item.type}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="text-xs text-white/50 mb-2">Status</div>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(item.status)} inline-block`}>
                                        {item.status}
                                    </span>
                                </div>
                                
                                {item.assignees.length > 0 && (
                                    <div>
                                        <div className="text-xs text-white/50 mb-2">Assignees</div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item.assignees.map((assignee, idx) => (
                                                <div
                                                    key={idx}
                                                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-medium border border-blue-500/30"
                                                >
                                                    {assignee}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {item.tags.length > 0 && (
                                    <div>
                                        <div className="text-xs text-white/50 mb-2">Tags</div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {item.tags.filter(tag => tag !== 'Add Tag').map((tag, idx) => {
                                                // Color code tags based on type
                                                let tagClass = 'bg-white/5 text-white/70 border-white/10';
                                                if (tag.includes('core-migration') || tag.includes('migration')) {
                                                    tagClass = 'bg-purple-500/20 text-purple-400 border-purple-500/30';
                                                } else if (tag.includes('Marketplace') || tag.includes('CMS')) {
                                                    tagClass = 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                                                } else if (tag.includes('healthcheck') || tag.includes('secontec')) {
                                                    tagClass = 'bg-green-500/20 text-green-400 border-green-500/30';
                                                } else if (tag.includes('SC') || tag.includes('SK')) {
                                                    tagClass = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                                                } else if (tag.includes('Documentation')) {
                                                    tagClass = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
                                                } else if (tag.includes('Configuration')) {
                                                    tagClass = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                                                }
                                                
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs border hover:scale-105 transition-transform ${tagClass}`}
                                                    >
                                                        <Tag className="w-3 h-3" />
                                                        {tag}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {item.description && (
                                <div>
                                    <div className="text-xs text-white/50 mb-2">Description</div>
                                    <p className="text-white/80 text-sm">{item.description}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function Sprint202601APage() {
    const [expandedEpics, setExpandedEpics] = useState<Set<string>>(new Set(Object.keys(groupedByEpic)));
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [filterTag, setFilterTag] = useState<string>('all');
    
    // Get all unique tags
    const allTags = Array.from(new Set(sprint202601AItems.flatMap(item => item.tags.filter(tag => tag !== 'Add Tag')))).sort();

    const toggleEpic = (epic: string) => {
        const newExpanded = new Set(expandedEpics);
        if (newExpanded.has(epic)) {
            newExpanded.delete(epic);
        } else {
            newExpanded.add(epic);
        }
        setExpandedEpics(newExpanded);
    };

    const filteredItems = sprint202601AItems.filter(item => {
        const statusMatch = filterStatus === 'all' || item.status === filterStatus;
        const typeMatch = filterType === 'all' || item.type === filterType;
        const tagMatch = filterTag === 'all' || item.tags.includes(filterTag);
        return statusMatch && typeMatch && tagMatch;
    });

    const filteredGroupedByEpic = Object.entries(groupedByEpic).reduce((acc, [epic, items]) => {
        const filtered = items.filter(item => {
            const statusMatch = filterStatus === 'all' || item.status === filterStatus;
            const typeMatch = filterType === 'all' || item.type === filterType;
            const tagMatch = filterTag === 'all' || item.tags.includes(filterTag);
            return statusMatch && typeMatch && tagMatch;
        });
        if (filtered.length > 0) {
            acc[epic] = filtered;
        }
        return acc;
    }, {} as Record<string, SprintItem[]>);

    return (
        <Layout
            title="Sprint 2026.01-A - Internal Releases"
            description="Detailed release notes for Sprint 2026.01-A"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <PageHeader 
                    breadcrumbs={[
                        { label: 'Home', href: '/' },
                        { label: 'Internal Releases', href: '/internal-releases' },
                        { label: 'Sprint 2026.01-A' }
                    ]}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <Link
                            to="/internal-releases"
                            className="inline-flex items-center gap-2 text-white/70 hover:text-[#E8B058] transition-colors no-underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Releases</span>
                        </Link>
                    </motion.div>

                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Package className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Sprint Release</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            {sprint202601AMetadata.title}
                        </h1>
                        
                        <div className="flex items-center gap-6 text-white/70 mb-6 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{sprint202601AMetadata.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span>{sprint202601AStats.total} Items</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                <span>{sprint202601AStats.stories} Stories</span>
                            </div>
                            {sprint202601AStats.bugs > 0 && (
                                <div className="flex items-center gap-2">
                                    <Bug className="w-5 h-5" />
                                    <span>{sprint202601AStats.bugs} Bugs</span>
                                </div>
                            )}
                        </div>
                        
                        <p className="text-xl text-white/90 max-w-4xl leading-relaxed">
                            {sprint202601AMetadata.description}
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                    >
                        <div className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/30">
                            <div className="text-3xl font-bold text-white mb-2">{sprint202601AStats.total}</div>
                            <div className="text-sm text-white/60">Total Items</div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/30">
                            <div className="text-3xl font-bold text-white mb-2">{sprint202601AStats.byStatus.done}</div>
                            <div className="text-sm text-white/60">Completed</div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl border border-yellow-500/30">
                            <div className="text-3xl font-bold text-white mb-2">{sprint202601AStats.byStatus.inProgress}</div>
                            <div className="text-sm text-white/60">In Progress</div>
                        </div>
                        <div className="p-6 bg-gradient-to-br from-gray-500/10 to-gray-600/5 rounded-xl border border-gray-500/30">
                            <div className="text-3xl font-bold text-white mb-2">{sprint202601AStats.byStatus.todo}</div>
                            <div className="text-sm text-white/60">To Do</div>
                        </div>
                    </motion.div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8 p-4 bg-[#202020] rounded-xl border border-white/10"
                    >
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-white/60" />
                                <span className="text-sm text-white/60">Filters:</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60">Status:</span>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="all">All Status</option>
                                    <option value="To do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60">Type:</span>
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="all">All Types</option>
                                    <option value="Story">Stories</option>
                                    <option value="Task">Tasks</option>
                                    <option value="Bug">Bugs</option>
                                </select>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/60">Tag:</span>
                                <select
                                    value={filterTag}
                                    onChange={(e) => setFilterTag(e.target.value)}
                                    className="px-3 py-1.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#E8B058]/50"
                                >
                                    <option value="all">All Tags</option>
                                    {allTags.map((tag) => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {(filterStatus !== 'all' || filterType !== 'all' || filterTag !== 'all') && (
                                <button
                                    onClick={() => {
                                        setFilterStatus('all');
                                        setFilterType('all');
                                        setFilterTag('all');
                                    }}
                                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </motion.div>

                    {/* Items by Epic */}
                    {Object.entries(filteredGroupedByEpic).map(([epic, items], epicIdx) => {
                        const isExpanded = expandedEpics.has(epic);
                        const epicStats = {
                            total: items.length,
                            stories: items.filter(i => i.type === 'Story').length,
                            tasks: items.filter(i => i.type === 'Task').length,
                            bugs: items.filter(i => i.type === 'Bug').length,
                            done: items.filter(i => i.status === 'Done').length,
                            inProgress: items.filter(i => i.status === 'In Progress').length,
                            todo: items.filter(i => i.status === 'To do').length
                        };

                        return (
                            <motion.section
                                key={epic}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: epicIdx * 0.1 }}
                                viewport={{ once: true }}
                                className="mb-8"
                            >
                                <div className="bg-[#202020] rounded-xl border border-white/10 overflow-hidden">
                                    {/* Epic Header */}
                                    <button
                                        onClick={() => toggleEpic(epic)}
                                        className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                {getEpicIcon(epic)}
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-white mb-2">{epic}</h2>
                                                <div className="flex items-center gap-4 text-sm text-white/60 flex-wrap">
                                                    <span>{epicStats.total} Items</span>
                                                    {epicStats.stories > 0 && <span>{epicStats.stories} Stories</span>}
                                                    {epicStats.tasks > 0 && <span>{epicStats.tasks} Tasks</span>}
                                                    {epicStats.bugs > 0 && <span>{epicStats.bugs} Bugs</span>}
                                                    <span className="text-green-400">{epicStats.done} Done</span>
                                                    <span className="text-blue-400">{epicStats.inProgress} In Progress</span>
                                                    <span className="text-gray-400">{epicStats.todo} To Do</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {isExpanded ? (
                                                <ChevronDown className="w-6 h-6 text-white/60" />
                                            ) : (
                                                <ChevronRight className="w-6 h-6 text-white/60" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Epic Items */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden border-t border-white/10"
                                            >
                                                <div className="p-6 space-y-3">
                                                    {items.map((item, itemIdx) => (
                                                        <ExpandableItem key={item.id} item={item} index={itemIdx} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.section>
                        );
                    })}

                    {/* Progress Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="mt-12 p-8 bg-gradient-to-br from-[#202020] to-[#1a1a1a] rounded-xl border border-white/10"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingUp className="w-6 h-6 text-[#E8B058]" />
                            <h2 className="text-2xl font-bold text-white">Sprint Progress</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-white/70">Overall Completion</span>
                                    <span className="text-sm font-medium text-white">
                                        {Math.round((sprint202601AStats.byStatus.done / sprint202601AStats.total) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/10 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all"
                                        style={{ width: `${(sprint202601AStats.byStatus.done / sprint202601AStats.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-lg font-bold text-white mb-1">{sprint202601AStats.byStatus.done}</div>
                                    <div className="text-sm text-white/60">Completed</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-lg font-bold text-white mb-1">{sprint202601AStats.byStatus.inProgress}</div>
                                    <div className="text-sm text-white/60">In Progress</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-lg">
                                    <div className="text-lg font-bold text-white mb-1">{sprint202601AStats.byStatus.todo}</div>
                                    <div className="text-sm text-white/60">To Do</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
