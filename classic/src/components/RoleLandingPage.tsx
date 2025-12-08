import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { ArrowRight, PlayCircle, HelpCircle, FileText, CheckCircle, Calendar, Sparkles } from 'lucide-react';
import Link from '@docusaurus/Link';

export interface RoleSection {
    title: string;
    description?: string;
    cards: {
        title: string;
        description: string;
        icon: React.ReactNode;
        link: string;
        badge?: string;
    }[];
}

export interface ArticleGroup {
    title: string;
    articles: {
        title: string;
        link: string;
    }[];
}

export interface RoleFeature {
    title: string;
    description: string;
    benefit: string;
    value: string;
    icon?: React.ReactNode;
}

export interface TimelineItem {
    title: string;
    description: string;
    date: string;
    status: 'released' | 'planned';
}

export interface SmartTool {
    title: string;
    description: string;
    metric: string;
    footer: string;
    link: string;
    visualType: 'radial' | 'bar' | 'activity' | 'grid';
    accentColor?: string; // Hex color for the chart/glow
}

export interface RoleLandingPageProps {
    title: string;
    description: string;
    sections: RoleSection[];
    videos?: {
        title: string;
        description: string;
        link: string;
    }[];
    articleGroups?: ArticleGroup[];
    features?: RoleFeature[];
    whatsNew?: TimelineItem[];
    roadmap?: TimelineItem[];
    smartTools?: SmartTool[];
}

// Visual Components for Smart Tools
function RadialVisual({ percent, color }: { percent: number; color: string }) {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full opacity-20 blur-xl" style={{ backgroundColor: color }} />
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="64"
                    cy="64"
                    r="40"
                    fill="transparent"
                    stroke="#334155" // Slate-700
                    strokeWidth="10"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="64"
                    cy="64"
                    r="40"
                    fill="transparent"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-2xl font-bold text-white">{percent}%</span>
            </div>
        </div>
    );
}

function BarVisual({ data, color }: { data: number[]; color: string }) {
    return (
        <div className="w-full h-32 flex items-end justify-center gap-3 px-4">
            {data.map((h, i) => (
                <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    className="w-4 rounded-t-md opacity-80"
                    style={{ backgroundColor: i === data.length - 1 ? color : '#334155' }}
                />
            ))}
        </div>
    );
}

function ActivityVisual({ color }: { color: string }) {
    return (
        <div className="w-full h-32 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
            <svg viewBox="0 0 100 40" className="w-full h-full p-4">
                <motion.path
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    d="M0 20 Q 10 20, 15 20 T 25 10 T 35 30 T 45 20 T 55 20 T 65 5 T 75 25 T 85 20 T 100 20"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Moving dot */}
                <motion.circle
                    r="2"
                    fill={color}
                    initial={{ offsetDistance: "0%" }}
                    animate={{ offsetDistance: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ offsetPath: "path('M0 20 Q 10 20, 15 20 T 25 10 T 35 30 T 45 20 T 55 20 T 65 5 T 75 25 T 85 20 T 100 20')" }}
                />
            </svg>
        </div>
    )
}

function GridVisual({ color }: { color: string }) {
    return (
        <div className="w-full h-32 grid grid-cols-2 gap-3 p-4">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-md bg-gray-800 flex items-center gap-2 px-3">
                    <div className={`w-2 h-2 rounded-full ${i === 2 ? 'animate-pulse' : ''}`} style={{ backgroundColor: i === 2 ? color : '#475569' }} />
                    <div className="h-2 w-12 bg-gray-700 rounded-full" />
                </div>
            ))}
        </div>
    )
}

// Breadcrumb Component
function CustomBreadcrumb({ title }: { title: string }) {
    return (
        <nav className="flex justify-center mb-8" aria-label="Breadcrumb">
            <div className="inline-flex items-center space-x-2 bg-gray-900/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700/50 shadow-lg">
                <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </Link>
                <span className="text-gray-600 dark:text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
                <Link to="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors no-underline">
                    Roles
                </Link>
                <span className="text-gray-600 dark:text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
                <span className="text-sm font-medium text-white bg-gray-700/50 px-2 py-0.5 rounded-md">
                    {title}
                </span>
            </div>
        </nav>
    );
}

export default function RoleLandingPage({
    title,
    description,
    sections,
    videos,
    articleGroups,
    features,
    whatsNew,
    roadmap,
    smartTools
}: RoleLandingPageProps): React.JSX.Element {
    return (
        <Layout title={title} description={description}>
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
                {/* Hero Section */}
                <section className="relative py-20 px-6 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CustomBreadcrumb title={title} />

                            <span className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 dark:bg-primary-900/30 dark:text-primary-300 rounded-full">
                                Role Guide
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mt-6 text-4xl md:text-5xl font-bold text-gray-900 dark:text-white"
                        >
                            {title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                        >
                            {description}
                        </motion.p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6">
                    {/* Content Sections (Configure, Build, etc) */}
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="mt-16"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{section.title}</h2>
                                {section.description && (
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">{section.description}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.cards.map((card, cardIndex) => (
                                    <FeatureCard
                                        key={card.title}
                                        title={card.title}
                                        description={card.description}
                                        icon={card.icon}
                                        link={card.link}
                                        badge={card.badge}
                                    />
                                ))}
                            </div>
                        </motion.section>
                    ))}

                    {/* Videos Section */}
                    {videos && videos.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="mt-20"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Video Tutorials</h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Get up to speed with visual guides</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {videos.map((video, index) => (
                                    <Link
                                        key={video.title}
                                        to={video.link}
                                        className="flex items-start p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-all hover:shadow-lg group no-underline"
                                    >
                                        <div className="w-12 h-12 flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex-shrink-0 mr-4">
                                            <PlayCircle className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                                {video.title}
                                            </h3>
                                            <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
                                                {video.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Quick Access Articles */}
                    {articleGroups && articleGroups.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-20"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Learn by Topic</h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Essential reading for your role</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {articleGroups.map((group) => (
                                    <div key={group.title} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary-500" />
                                            {group.title}
                                        </h3>
                                        <ul className="space-y-3">
                                            {group.articles.map((article) => (
                                                <li key={article.title}>
                                                    <Link to={article.link} className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 text-sm flex items-start gap-2 group-hover:underline">
                                                        <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 group-hover:bg-primary-500" />
                                                        {article.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Role Features & Benefits */}
                    {features && features.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-20 bg-gray-100 dark:bg-gray-800/50 rounded-3xl p-8 md:p-12"
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Use This workspace?</h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Key features designed for your success</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {features.map((feature) => (
                                    <div key={feature.title} className="flex gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg">
                                                {feature.icon || <CheckCircle className="w-6 h-6" />}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{feature.description}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                                                    <span className="font-semibold text-green-700 dark:text-green-300 block mb-1">Benefit</span>
                                                    <span className="text-green-800 dark:text-green-200">{feature.benefit}</span>
                                                </div>
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                    <span className="font-semibold text-blue-700 dark:text-blue-300 block mb-1">Business Value</span>
                                                    <span className="text-blue-800 dark:text-blue-200">{feature.value}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* Smart Tools Section (NEW) */}
                    {smartTools && smartTools.length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mt-20 py-16 px-4 bg-gray-900 rounded-3xl relative overflow-hidden"
                        >
                            {/* Background Elements */}
                            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-900/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-blue-900/20 to-transparent" />

                            <div className="relative z-10 text-center mb-16">
                                <h2 className="text-3xl font-bold text-white mb-4">Smart Tools for Smarter {title.replace('Workspace', 'Decisions')}</h2>
                                <p className="text-gray-400 max-w-2xl mx-auto">Automatically detect, classify, and mitigate risks with powerful AI-driven insights integrated into your workflow.</p>
                            </div>

                            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                                {smartTools.map((tool, idx) => (
                                    <Link key={tool.title} to={tool.link} className="no-underline group">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="h-full bg-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-6 hover:border-primary-500/50 transition-all hover:bg-gray-800 flex flex-col items-center text-center"
                                            style={{ borderColor: tool.accentColor ? `${tool.accentColor}40` : undefined }}
                                        >
                                            <div className="flex-1 w-full flex items-center justify-center mb-6 min-h-[140px]">
                                                {tool.visualType === 'radial' && <RadialVisual percent={parseInt(tool.metric)} color={tool.accentColor || '#3b82f6'} />}
                                                {tool.visualType === 'bar' && <BarVisual data={[40, 65, 30, 85, 55]} color={tool.accentColor || '#10b981'} />}
                                                {tool.visualType === 'activity' && <ActivityVisual color={tool.accentColor || '#f59e0b'} />}
                                                {tool.visualType === 'grid' && <GridVisual color={tool.accentColor || '#8b5cf6'} />}
                                            </div>

                                            <div className="w-full">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700/50 text-xs font-medium text-white mb-3">
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tool.accentColor || 'white' }} />
                                                    {tool.metric}
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">{tool.title}</h3>
                                                <p className="text-gray-400 text-sm">{tool.description}</p>
                                            </div>

                                            <div className="w-full mt-6 pt-4 border-t border-gray-700/50">
                                                <p className="text-xs text-gray-500 font-medium">{tool.footer}</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </motion.section>
                    )}

                    {/* What's New & Roadmap */}
                    {(whatsNew || roadmap) && (
                        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* What's New */}
                            {whatsNew && (
                                <motion.section
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-yellow-500" />
                                        What's New
                                    </h3>
                                    <div className="space-y-6 border-l-2 border-gray-200 dark:border-gray-700 ml-3 pl-6 relative">
                                        {whatsNew.map((item) => (
                                            <div key={item.title} className="relative">
                                                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-yellow-500 border-4 border-white dark:border-gray-900" />
                                                <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                    {item.date}
                                                </span>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}

                            {/* Roadmap */}
                            {roadmap && (
                                <motion.section
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-blue-500" />
                                        Coming Soon
                                    </h3>
                                    <div className="space-y-6 border-l-2 border-dashed border-gray-200 dark:border-gray-700 ml-3 pl-6 relative">
                                        {roadmap.map((item) => (
                                            <div key={item.title} className="relative">
                                                <span className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white dark:ring-gray-900 opacity-50" />
                                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full mb-2 inline-block">
                                                    {item.date}
                                                </span>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.section>
                            )}
                        </div>
                    )}

                    {/* Support CTA */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 md:p-12 text-center"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Do you have a question or need help?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                            Our support team is available to assist you with any questions or issues you may have.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                to="/docs/support/contact-support"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-colors no-underline"
                            >
                                <HelpCircle className="w-5 h-5" />
                                Contact Support
                            </Link>
                            <Link
                                to="/docs/knowledge-base"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors no-underline"
                            >
                                Knowledge Base
                            </Link>
                        </div>
                    </motion.section>
                </div>
            </main>
        </Layout>
    );
}
