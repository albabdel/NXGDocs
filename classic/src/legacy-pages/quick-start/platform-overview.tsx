import React, { useEffect, useState } from 'react';
import Layout from '@theme/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import Link from '@docusaurus/Link';
import LandingPageBackground from '../../components/LandingPageBackground';
import { useProduct } from '@theme/Root';
import {
    Cpu, Network, Shield, Cloud, Server, Database, Zap, Activity, Globe, Radio, Home, ChevronRight,
    Building, Users, MapPin, Camera, CheckCircle, ArrowRight, BarChart3, Lock, Layers, GitBranch,
    Play, Pause, Monitor, Smartphone, Tablet, Eye, AlertTriangle, TrendingUp, Clock, Target,
    Wifi, HardDrive, Gauge, Settings, Bell, Video, Headphones, MessageSquare, FileText, Download, Calendar
} from 'lucide-react';

declare global {
    interface Window {
        Chart: any;
    }
}

export default function PlatformOverview() {
    const { productName } = useProduct();
    const [activeTab, setActiveTab] = useState('live');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentMetric, setCurrentMetric] = useState(0);
    const [performanceData, setPerformanceData] = useState({
        falseAlarmReduction: 99.2,
        responseTime: 47,
        uptime: 99.9,
        processingSpeed: 2.3
    });

    useEffect(() => {
        const metricInterval = setInterval(() => {
            setCurrentMetric(prev => (prev + 1) % 4);
            setPerformanceData(prev => ({
                falseAlarmReduction: Math.max(98.5, Math.min(99.9, prev.falseAlarmReduction + (Math.random() - 0.5) * 0.1)),
                responseTime: Math.max(30, Math.min(60, prev.responseTime + (Math.random() - 0.5) * 2)),
                uptime: Math.max(99.5, Math.min(99.99, prev.uptime + (Math.random() - 0.5) * 0.01)),
                processingSpeed: Math.max(1.8, Math.min(3.2, prev.processingSpeed + (Math.random() - 0.5) * 0.1))
            }));
        }, 3000);

        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = initializeCharts;
        document.head.appendChild(script);

        return () => {
            clearInterval(metricInterval);
            document.head.removeChild(script);
        };
    }, []);

    const initializeCharts = () => {
        if (typeof window !== 'undefined' && window.Chart) {
            const ctx = document.getElementById('performanceChart');
            if (ctx) {
                new window.Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['True Alarms (1%)', 'False Alarms Filtered (99%)'],
                        datasets: [{
                            data: [1, 99],
                            backgroundColor: ['#EF4444', '#10B981'],
                            borderWidth: 3,
                            borderColor: '#000'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { position: 'bottom', labels: { color: 'white', padding: 20, font: { size: 14 } } }
                        },
                        cutout: '60%'
                    }
                });
            }

            const realtimeCtx = document.getElementById('realtimeChart');
            if (realtimeCtx) {
                const data = Array.from({length: 20}, (_, i) => Math.floor(Math.random() * 100));
                new window.Chart(realtimeCtx, {
                    type: 'line',
                    data: {
                        labels: Array.from({length: 20}, (_, i) => `${i}s`),
                        datasets: [{
                            label: 'System Load',
                            data: data,
                            borderColor: '#E8B058',
                            backgroundColor: 'rgba(232, 176, 88, 0.1)',
                            fill: true,
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { labels: { color: 'white' } } },
                        scales: {
                            y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                            x: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } }
                        },
                        animation: { duration: 1000 }
                    }
                });
            }
        }
    };

    const mockDevices = [
        { name: 'Corporate HQ - Main Building', status: 'online', cameras: 24, location: 'New York, NY', lastEvent: '2 min ago' },
        { name: 'Warehouse District Alpha', status: 'online', cameras: 16, location: 'Chicago, IL', lastEvent: '5 min ago' },
        { name: 'Retail Store Network Hub', status: 'warning', cameras: 32, location: 'Los Angeles, CA', lastEvent: '1 min ago' },
        { name: 'Manufacturing Plant East', status: 'online', cameras: 18, location: 'Atlanta, GA', lastEvent: '8 min ago' },
        { name: 'Distribution Center Beta', status: 'online', cameras: 28, location: 'Dallas, TX', lastEvent: '3 min ago' },
        { name: 'Office Complex Downtown', status: 'maintenance', cameras: 12, location: 'Seattle, WA', lastEvent: '15 min ago' }
    ];

    const liveFeatures = [
        { icon: <Eye className="w-5 h-5" />, title: 'Multi-Site Monitoring', desc: 'Centralized view of all locations' },
        { icon: <Bell className="w-5 h-5" />, title: 'Intelligent Alerts', desc: 'AI-verified threat notifications' },
        { icon: <Target className="w-5 h-5" />, title: 'Predictive Analytics', desc: 'Behavioral pattern recognition' },
        { icon: <Headphones className="w-5 h-5" />, title: 'Operator Dashboard', desc: 'Real-time monitoring interface' }
    ];

    const metrics = [
        { label: 'False Alarm Reduction', value: `${performanceData.falseAlarmReduction.toFixed(1)}%`, icon: <Shield className="w-6 h-6" />, color: '#10B981' },
        { label: 'Avg Response Time', value: `${performanceData.responseTime.toFixed(0)}s`, icon: <Clock className="w-6 h-6" />, color: '#3B82F6' },
        { label: 'System Uptime', value: `${performanceData.uptime.toFixed(2)}%`, icon: <Activity className="w-6 h-6" />, color: '#8B5CF6' },
        { label: 'Events/Second', value: `${performanceData.processingSpeed.toFixed(1)}M`, icon: <Zap className="w-6 h-6" />, color: '#F59E0B' }
    ];

    return (
        <Layout
            title="Platform Overview"
            description={`Complete guide to NXGEN ${productName} architecture, hierarchy model, and core capabilities`}
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                {/* Breadcrumbs */}
                <div className="backdrop-blur-sm" style={{ background: 'linear-gradient(to bottom, var(--ifm-background-color) 0%, var(--ifm-background-color) 60%, transparent 100%)', borderBottom: '1px solid rgba(var(--ifm-color-emphasis-300-rgb, 200,200,200), 0.3)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <nav className="flex items-center gap-2 text-sm">
                            <Link to="/" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline">
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <Link to="/#quick-start" className="text-slate-400 hover:text-white transition-colors no-underline">
                                Quick Start
                            </Link>
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                            <span className="text-[#E8B058] font-medium">Platform Overview</span>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E8B058]/10 border border-[#E8B058]/20 rounded-full mb-6">
                            <Cpu className="w-4 h-4 text-[#E8B058]" />
                            <span className="text-sm font-medium text-[#E8B058]">Platform Overview</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            NXGEN {productName} Platform
                        </h1>
                        <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-8">
                            The world's most advanced cloud-native Video Surveillance as a Service platform. 
                            Experience real-time AI analytics, 99% false alarm reduction, and seamless multi-manufacturer integration.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {metrics.map((metric, idx) => (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: currentMetric === idx ? 1.1 : 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-4 bg-white/5 rounded-xl border border-white/10 text-center"
                                    style={{ borderColor: currentMetric === idx ? metric.color : 'rgba(255,255,255,0.1)' }}
                                >
                                    <div className="flex justify-center mb-2" style={{ color: metric.color }}>
                                        {metric.icon}
                                    </div>
                                    <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                                    <div className="text-xs text-white/70">{metric.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Platform Capabilities */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Platform Capabilities</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Enterprise-grade security management with AI-powered analytics and global scale operations
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    icon: <Globe className="w-8 h-8" />,
                                    title: 'Global Scale',
                                    value: '50,000+',
                                    desc: 'Sites across Europe & worldwide',
                                    color: '#10B981'
                                },
                                {
                                    icon: <BarChart3 className="w-8 h-8" />,
                                    title: 'Daily Processing',
                                    value: '2.5M+',
                                    desc: 'Alarms processed daily',
                                    color: '#3B82F6'
                                },
                                {
                                    icon: <Shield className="w-8 h-8" />,
                                    title: 'AI Accuracy',
                                    value: '99.2%',
                                    desc: 'False alarm reduction rate',
                                    color: '#8B5CF6'
                                },
                                {
                                    icon: <Clock className="w-8 h-8" />,
                                    title: 'Response Time',
                                    value: '<60s',
                                    desc: 'Average threat verification',
                                    color: '#F59E0B'
                                }
                            ].map((capability, idx) => (
                                <motion.div
                                    key={capability.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-[#202020] rounded-xl border border-white/10 text-center"
                                >
                                    <div className="p-3 rounded-lg inline-block mb-4" style={{ backgroundColor: `${capability.color}20`, color: capability.color }}>
                                        {capability.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-2">{capability.value}</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{capability.title}</h3>
                                    <p className="text-sm text-white/70">{capability.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Live Platform Experience</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                See {productName} in action with real-time data, live device monitoring, and interactive analytics
                            </p>
                        </div>

                        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
                            <div className="flex border-b border-white/10">
                                {[
                                    { id: 'live', label: 'Live Dashboard', icon: <Monitor className="w-4 h-4" /> },
                                    { id: 'devices', label: 'Connected Devices', icon: <Camera className="w-4 h-4" /> },
                                    { id: 'analytics', label: 'AI Analytics', icon: <BarChart3 className="w-4 h-4" /> },
                                    { id: 'mobile', label: 'Mobile Access', icon: <Smartphone className="w-4 h-4" /> }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                                            activeTab === tab.id
                                                ? 'text-[#E8B058] border-b-2 border-[#E8B058] bg-[#E8B058]/5'
                                                : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'live' && (
                                        <motion.div
                                            key="live"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-6">Real-Time System Status</h3>
                                                <div className="space-y-4">
                                                    {liveFeatures.map((feature, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: -20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="flex items-center gap-4 p-4 bg-[#202020] rounded-lg border border-white/10"
                                                        >
                                                            <div className="p-2 bg-[#E8B058]/10 rounded-lg text-[#E8B058]">
                                                                {feature.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-white">{feature.title}</h4>
                                                                <p className="text-sm text-white/70">{feature.desc}</p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-[#202020] rounded-xl p-6">
                                                <h4 className="text-white font-semibold mb-4">System Performance (Live)</h4>
                                                <div style={{ height: '300px' }}>
                                                    <canvas id="realtimeChart"></canvas>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'devices' && (
                                        <motion.div
                                            key="devices"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <h3 className="text-xl font-bold text-white mb-6">Multi-Site Operations Center</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {mockDevices.map((site, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.1 }}
                                                        className="p-4 bg-[#202020] rounded-lg border border-white/10 hover:border-[#E8B058]/30 transition-all cursor-pointer"
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <h4 className="font-semibold text-white text-sm">{site.name}</h4>
                                                            <div className={`w-3 h-3 rounded-full ${
                                                                site.status === 'online' ? 'bg-green-400' : 
                                                                site.status === 'warning' ? 'bg-yellow-400' : 'bg-gray-400'
                                                            }`} />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between text-xs text-white/70">
                                                                <span>{site.cameras} cameras</span>
                                                                <span className="text-[#E8B058]">{site.lastEvent}</span>
                                                            </div>
                                                            <div className="text-xs text-white/60">{site.location}</div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'analytics' && (
                                        <motion.div
                                            key="analytics"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                                        >
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-6">AI-Powered False Alarm Reduction</h3>
                                                <div className="bg-[#202020] rounded-xl p-6">
                                                    <div style={{ height: '300px' }}>
                                                        <canvas id="performanceChart"></canvas>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white mb-6">Detection Capabilities</h3>
                                                <div className="space-y-4">
                                                    {[
                                                        { name: 'Person Detection', accuracy: '99.2%', color: '#10B981' },
                                                        { name: 'Vehicle Recognition', accuracy: '97.8%', color: '#3B82F6' },
                                                        { name: 'Line Crossing', accuracy: '98.5%', color: '#F59E0B' },
                                                        { name: 'Intrusion Detection', accuracy: '99.7%', color: '#EF4444' }
                                                    ].map((item, idx) => (
                                                        <div key={idx} className="p-4 bg-[#202020] rounded-lg">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-white font-medium">{item.name}</span>
                                                                <span className="text-white/70">{item.accuracy}</span>
                                                            </div>
                                                            <div className="w-full bg-white/10 rounded-full h-2">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: item.accuracy }}
                                                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                                                    className="h-2 rounded-full"
                                                                    style={{ backgroundColor: item.color }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {activeTab === 'mobile' && (
                                        <motion.div
                                            key="mobile"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="text-center"
                                        >
                                            <h3 className="text-xl font-bold text-white mb-6">Global Security Network</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                                <div className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                                                    <h4 className="text-white font-semibold mb-4">Network Coverage</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white/70">North America</span>
                                                            <span className="text-blue-400 font-semibold">342 sites</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white/70">Europe</span>
                                                            <span className="text-green-400 font-semibold">198 sites</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white/70">Asia Pacific</span>
                                                            <span className="text-purple-400 font-semibold">156 sites</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                                                    <h4 className="text-white font-semibold mb-4">Live Statistics</h4>
                                                    <div className="space-y-3">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white/70">Active Monitoring</span>
                                                            <span className="text-green-400 font-semibold">24/7/365</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white/70">Response Centers</span>
                                                            <span className="text-blue-400 font-semibold">12 global</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-white/70">Uptime SLA</span>
                                                            <span className="text-purple-400 font-semibold">99.9%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {[
                                                    { icon: <Monitor className="w-8 h-8" />, title: 'Command Center', desc: 'Multi-monitor operator workstations', users: '2,400+ operators' },
                                                    { icon: <Smartphone className="w-8 h-8" />, title: 'Mobile Response', desc: 'Field team coordination app', users: '850+ field agents' },
                                                    { icon: <Globe className="w-8 h-8" />, title: 'Customer Portal', desc: 'Self-service client dashboard', users: '15,000+ clients' }
                                                ].map((platform, idx) => (
                                                    <div key={idx} className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                                        <div className="text-[#E8B058] mb-4">{platform.icon}</div>
                                                        <h4 className="text-white font-semibold mb-2">{platform.title}</h4>
                                                        <p className="text-white/70 text-sm mb-3">{platform.desc}</p>
                                                        <div className="text-xs text-[#E8B058] font-medium">{platform.users}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.section>

                    {/* Hierarchy Model Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">5-Level Hierarchy Model</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                {productName} uses a structured 5-level hierarchy to organize security assets, 
                                manage access control, and ensure complete data isolation
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                                <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <svg viewBox="0 0 400 300" className="w-full h-auto">
                                        {/* Hierarchy Diagram */}
                                        <defs>
                                            <linearGradient id="hierarchyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#4F46E5" />
                                                <stop offset="100%" stopColor="#06B6D4" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Level 1 - Tenant */}
                                        <rect x="150" y="20" width="100" height="40" rx="8" fill="#4F46E5" stroke="#E8B058" strokeWidth="2" />
                                        <text x="200" y="35" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">TENANT</text>
                                        <text x="200" y="50" textAnchor="middle" fill="white" fontSize="10">Organization</text>
                                        
                                        {/* Level 2 - Customers */}
                                        <rect x="50" y="90" width="80" height="35" rx="6" fill="#06B6D4" stroke="#E8B058" strokeWidth="1" />
                                        <text x="90" y="105" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">CUSTOMER A</text>
                                        <text x="90" y="118" textAnchor="middle" fill="white" fontSize="9">Client Unit</text>
                                        
                                        <rect x="270" y="90" width="80" height="35" rx="6" fill="#06B6D4" stroke="#E8B058" strokeWidth="1" />
                                        <text x="310" y="105" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">CUSTOMER B</text>
                                        <text x="310" y="118" textAnchor="middle" fill="white" fontSize="9">Client Unit</text>
                                        
                                        {/* Level 3 - Sites */}
                                        <rect x="20" y="150" width="60" height="30" rx="4" fill="#10B981" stroke="#E8B058" strokeWidth="1" />
                                        <text x="50" y="162" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SITE 1</text>
                                        <text x="50" y="174" textAnchor="middle" fill="white" fontSize="8">Location</text>
                                        
                                        <rect x="100" y="150" width="60" height="30" rx="4" fill="#10B981" stroke="#E8B058" strokeWidth="1" />
                                        <text x="130" y="162" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SITE 2</text>
                                        <text x="130" y="174" textAnchor="middle" fill="white" fontSize="8">Location</text>
                                        
                                        <rect x="240" y="150" width="60" height="30" rx="4" fill="#10B981" stroke="#E8B058" strokeWidth="1" />
                                        <text x="270" y="162" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SITE 3</text>
                                        <text x="270" y="174" textAnchor="middle" fill="white" fontSize="8">Location</text>
                                        
                                        <rect x="320" y="150" width="60" height="30" rx="4" fill="#10B981" stroke="#E8B058" strokeWidth="1" />
                                        <text x="350" y="162" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SITE 4</text>
                                        <text x="350" y="174" textAnchor="middle" fill="white" fontSize="8">Location</text>
                                        
                                        {/* Level 4 - Devices */}
                                        <rect x="10" y="210" width="40" height="25" rx="3" fill="#D946EF" stroke="#E8B058" strokeWidth="1" />
                                        <text x="30" y="220" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">NVR</text>
                                        <text x="30" y="230" textAnchor="middle" fill="white" fontSize="7">Device</text>
                                        
                                        <rect x="60" y="210" width="40" height="25" rx="3" fill="#D946EF" stroke="#E8B058" strokeWidth="1" />
                                        <text x="80" y="220" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">DVR</text>
                                        <text x="80" y="230" textAnchor="middle" fill="white" fontSize="7">Device</text>
                                        
                                        <rect x="110" y="210" width="40" height="25" rx="3" fill="#D946EF" stroke="#E8B058" strokeWidth="1" />
                                        <text x="130" y="220" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">NVR</text>
                                        <text x="130" y="230" textAnchor="middle" fill="white" fontSize="7">Device</text>
                                        
                                        {/* Level 5 - Cameras */}
                                        <circle cx="20" cy="260" r="12" fill="#8B5CF6" stroke="#E8B058" strokeWidth="1" />
                                        <text x="20" y="264" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C1</text>
                                        
                                        <circle cx="45" cy="260" r="12" fill="#8B5CF6" stroke="#E8B058" strokeWidth="1" />
                                        <text x="45" y="264" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C2</text>
                                        
                                        <circle cx="70" cy="260" r="12" fill="#8B5CF6" stroke="#E8B058" strokeWidth="1" />
                                        <text x="70" y="264" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C3</text>
                                        
                                        <circle cx="120" cy="260" r="12" fill="#8B5CF6" stroke="#E8B058" strokeWidth="1" />
                                        <text x="120" y="264" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C4</text>
                                        
                                        <circle cx="140" cy="260" r="12" fill="#8B5CF6" stroke="#E8B058" strokeWidth="1" />
                                        <text x="140" y="264" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C5</text>
                                        
                                        {/* Connection Lines */}
                                        <line x1="200" y1="60" x2="90" y2="90" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="200" y1="60" x2="310" y2="90" stroke="#E8B058" strokeWidth="2" />
                                        
                                        <line x1="90" y1="125" x2="50" y2="150" stroke="#E8B058" strokeWidth="1.5" />
                                        <line x1="90" y1="125" x2="130" y2="150" stroke="#E8B058" strokeWidth="1.5" />
                                        <line x1="310" y1="125" x2="270" y2="150" stroke="#E8B058" strokeWidth="1.5" />
                                        <line x1="310" y1="125" x2="350" y2="150" stroke="#E8B058" strokeWidth="1.5" />
                                        
                                        <line x1="50" y1="180" x2="30" y2="210" stroke="#E8B058" strokeWidth="1" />
                                        <line x1="130" y1="180" x2="80" y2="210" stroke="#E8B058" strokeWidth="1" />
                                        <line x1="130" y1="180" x2="130" y2="210" stroke="#E8B058" strokeWidth="1" />
                                        
                                        <line x1="30" y1="235" x2="20" y2="248" stroke="#E8B058" strokeWidth="1" />
                                        <line x1="30" y1="235" x2="45" y2="248" stroke="#E8B058" strokeWidth="1" />
                                        <line x1="80" y1="235" x2="70" y2="248" stroke="#E8B058" strokeWidth="1" />
                                        <line x1="130" y1="235" x2="120" y2="248" stroke="#E8B058" strokeWidth="1" />
                                        <line x1="130" y1="235" x2="140" y2="248" stroke="#E8B058" strokeWidth="1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-6">
                                {[
                                    { icon: <Building className="w-6 h-6" />, level: '1', title: 'Tenant', desc: 'Top-level organization with complete data isolation', color: '#4F46E5' },
                                    { icon: <Users className="w-6 h-6" />, level: '2', title: 'Customer', desc: 'Individual clients or business units', color: '#06B6D4' },
                                    { icon: <MapPin className="w-6 h-6" />, level: '3', title: 'Site', desc: 'Physical locations (buildings, facilities)', color: '#10B981' },
                                    { icon: <Server className="w-6 h-6" />, level: '4', title: 'Device', desc: 'Security hardware (NVR, DVR, alarm panels)', color: '#D946EF' },
                                    { icon: <Camera className="w-6 h-6" />, level: '5', title: 'Camera/Sensor', desc: 'Individual cameras, sensors, or IoT devices', color: '#8B5CF6' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-[#202020] rounded-lg border border-white/10">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-lg text-white font-bold" style={{ backgroundColor: item.color }}>
                                            {item.level}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="text-[#E8B058]">{item.icon}</div>
                                                <h3 className="font-semibold text-white">{item.title}</h3>
                                            </div>
                                            <p className="text-sm text-white/70">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { icon: <Lock className="w-8 h-8" />, title: 'Data Isolation', desc: 'Complete separation between tenants and customers' },
                                { icon: <Shield className="w-8 h-8" />, title: 'Access Control', desc: 'Granular permission management at every level' },
                                { icon: <BarChart3 className="w-8 h-8" />, title: 'Scalability', desc: 'Easy organization for businesses of any size' }
                            ].map((benefit, idx) => (
                                <div key={idx} className="text-center p-6 bg-[#202020] rounded-xl border border-white/10">
                                    <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                                    <p className="text-sm text-white/70">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Cloud Architecture Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">Robust AWS Infrastructure</h2>
                                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                    Built on Amazon Web Services (AWS) with Kubernetes orchestration, 
                                    {productName} delivers enterprise-grade reliability and global reach.
                                </p>
                                <div className="space-y-4 mb-8">
                                    {[
                                        { title: 'Private EKS Clusters', desc: '75% of application logic runs on secure, private worker nodes' },
                                        { title: 'Auto-Scaling', desc: 'Node groups adjust resources in real-time based on system load' },
                                        { title: 'Amazon MQ', desc: 'Asynchronous messaging orchestration for platform-wide event sync' },
                                        { title: 'Geographic Redundancy', desc: 'Multiple data centers ensure high availability and disaster recovery' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <span className="font-semibold text-white">{item.title}:</span>
                                                <span className="text-white/70 ml-2">{item.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                                <div className="relative p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <h4 className="text-center text-white mb-4">AWS Infrastructure Architecture</h4>
                                    <svg viewBox="0 0 500 350" className="w-full h-auto">
                                        {/* AWS Infrastructure Diagram */}
                                        <defs>
                                            <linearGradient id="awsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#FF9900" />
                                                <stop offset="100%" stopColor="#232F3E" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* AWS Cloud Border */}
                                        <rect x="20" y="20" width="460" height="310" rx="15" fill="none" stroke="#FF9900" strokeWidth="3" strokeDasharray="10,5" />
                                        <text x="250" y="15" textAnchor="middle" fill="#FF9900" fontSize="14" fontWeight="bold">AWS Cloud Infrastructure</text>
                                        
                                        {/* EKS Cluster */}
                                        <rect x="50" y="50" width="180" height="120" rx="8" fill="#232F3E" stroke="#FF9900" strokeWidth="2" />
                                        <text x="140" y="70" textAnchor="middle" fill="#FF9900" fontSize="12" fontWeight="bold">Amazon EKS Cluster</text>
                                        
                                        {/* Worker Nodes */}
                                        <rect x="70" y="85" width="50" height="30" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
                                        <text x="95" y="98" textAnchor="middle" fill="white" fontSize="9">Node 1</text>
                                        <text x="95" y="108" textAnchor="middle" fill="white" fontSize="8">Private</text>
                                        
                                        <rect x="130" y="85" width="50" height="30" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
                                        <text x="155" y="98" textAnchor="middle" fill="white" fontSize="9">Node 2</text>
                                        <text x="155" y="108" textAnchor="middle" fill="white" fontSize="8">Private</text>
                                        
                                        <rect x="70" y="125" width="50" height="30" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
                                        <text x="95" y="138" textAnchor="middle" fill="white" fontSize="9">Node 3</text>
                                        <text x="95" y="148" textAnchor="middle" fill="white" fontSize="8">Auto-Scale</text>
                                        
                                        <rect x="130" y="125" width="50" height="30" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
                                        <text x="155" y="138" textAnchor="middle" fill="white" fontSize="9">Node 4</text>
                                        <text x="155" y="148" textAnchor="middle" fill="white" fontSize="8">Auto-Scale</text>
                                        
                                        {/* Amazon MQ */}
                                        <rect x="270" y="50" width="100" height="60" rx="8" fill="#10B981" stroke="#FF9900" strokeWidth="2" />
                                        <text x="320" y="70" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Amazon MQ</text>
                                        <text x="320" y="85" textAnchor="middle" fill="white" fontSize="10">Message Queue</text>
                                        <text x="320" y="98" textAnchor="middle" fill="white" fontSize="9">Event Sync</text>
                                        
                                        {/* RDS Database */}
                                        <rect x="270" y="130" width="100" height="60" rx="8" fill="#D946EF" stroke="#FF9900" strokeWidth="2" />
                                        <text x="320" y="150" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Amazon RDS</text>
                                        <text x="320" y="165" textAnchor="middle" fill="white" fontSize="10">PostgreSQL</text>
                                        <text x="320" y="178" textAnchor="middle" fill="white" fontSize="9">Multi-AZ</text>
                                        
                                        {/* S3 Storage */}
                                        <rect x="400" y="50" width="70" height="50" rx="6" fill="#06B6D4" stroke="#FF9900" strokeWidth="2" />
                                        <text x="435" y="70" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">S3</text>
                                        <text x="435" y="83" textAnchor="middle" fill="white" fontSize="9">Video</text>
                                        <text x="435" y="93" textAnchor="middle" fill="white" fontSize="9">Storage</text>
                                        
                                        {/* CloudFront */}
                                        <rect x="400" y="120" width="70" height="50" rx="6" fill="#F59E0B" stroke="#FF9900" strokeWidth="2" />
                                        <text x="435" y="140" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">CloudFront</text>
                                        <text x="435" y="153" textAnchor="middle" fill="white" fontSize="9">Global</text>
                                        <text x="435" y="163" textAnchor="middle" fill="white" fontSize="9">CDN</text>
                                        
                                        {/* Load Balancer */}
                                        <rect x="50" y="210" width="180" height="40" rx="6" fill="#8B5CF6" stroke="#FF9900" strokeWidth="2" />
                                        <text x="140" y="225" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Application Load Balancer</text>
                                        <text x="140" y="240" textAnchor="middle" fill="white" fontSize="10">Auto-scaling & Health Checks</text>
                                        
                                        {/* API Gateway */}
                                        <rect x="270" y="210" width="100" height="40" rx="6" fill="#EF4444" stroke="#FF9900" strokeWidth="2" />
                                        <text x="320" y="225" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">API Gateway</text>
                                        <text x="320" y="240" textAnchor="middle" fill="white" fontSize="10">REST & WebSocket</text>
                                        
                                        {/* External Connections */}
                                        <rect x="50" y="280" width="80" height="35" rx="6" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                        <text x="90" y="295" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">On-Premise</text>
                                        <text x="90" y="308" textAnchor="middle" fill="white" fontSize="9">Devices</text>
                                        
                                        <rect x="150" y="280" width="80" height="35" rx="6" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                        <text x="190" y="295" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Mobile Apps</text>
                                        <text x="190" y="308" textAnchor="middle" fill="white" fontSize="9">iOS/Android</text>
                                        
                                        <rect x="250" y="280" width="80" height="35" rx="6" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                        <text x="290" y="295" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Web Portal</text>
                                        <text x="290" y="308" textAnchor="middle" fill="white" fontSize="9">Dashboard</text>
                                        
                                        <rect x="350" y="280" width="80" height="35" rx="6" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                        <text x="390" y="295" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Talos CMS</text>
                                        <text x="390" y="308" textAnchor="middle" fill="white" fontSize="9">Integration</text>
                                        
                                        {/* Connection Lines */}
                                        <line x1="140" y1="170" x2="140" y2="210" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="230" y1="140" x2="270" y2="140" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="230" y1="100" x2="270" y2="80" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="370" y1="140" x2="400" y2="140" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="370" y1="80" x2="400" y2="80" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="140" y1="250" x2="140" y2="280" stroke="#E8B058" strokeWidth="2" />
                                        <line x1="320" y1="250" x2="320" y2="280" stroke="#E8B058" strokeWidth="2" />
                                        
                                        {/* Performance Indicators */}
                                        <circle cx="460" cy="30" r="8" fill="#10B981" />
                                        <text x="460" y="34" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">99.9%</text>
                                        <text x="460" y="50" textAnchor="middle" fill="#10B981" fontSize="8">Uptime</text>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Proxy Architecture Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Universal Translator (Proxy Architecture)</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                The core innovation that allows {productName} to communicate with diverse manufacturers 
                                by translating their specific protocols into standardized system commands
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                            {[
                                { icon: 'Video', title: 'Diverse Hardware', desc: 'SDK/HTTP Protocols', color: '#374151' },
                                { icon: 'Settings', title: 'Proxy Layer', desc: 'Protocol Translation', color: '#4F46E5' },
                                { icon: 'Integration', title: 'Unified Interface', desc: 'Standardized Stream', color: '#06B6D4' },
                                { icon: 'AI', title: `${productName} Core`, desc: 'SaaS & AI Engine', color: '#D946EF' }
                            ].map((step, idx) => (
                                <div key={idx} className="relative">
                                    <div className="text-center p-6 rounded-xl border border-white/10" style={{ backgroundColor: step.color }}>
                                        <div className="text-lg font-bold mb-3">{step.icon}</div>
                                        <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                                        <p className="text-sm text-white/80">{step.desc}</p>
                                    </div>
                                    {idx < 3 && (
                                        <ArrowRight className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 text-[#E8B058] hidden md:block" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                                <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <svg viewBox="0 0 600 400" className="w-full h-auto">
                                        {/* Proxy Architecture Diagram */}
                                        <defs>
                                            <linearGradient id="proxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#4F46E5" />
                                                <stop offset="100%" stopColor="#06B6D4" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Device Layer */}
                                        <rect x="20" y="50" width="120" height="300" rx="10" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                        <text x="80" y="35" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">Device Layer</text>
                                        
                                        {/* Different Manufacturer Devices */}
                                        <rect x="35" y="70" width="90" height="40" rx="5" fill="#EF4444" stroke="white" strokeWidth="1" />
                                        <text x="80" y="85" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Hikvision NVR</text>
                                        <text x="80" y="98" textAnchor="middle" fill="white" fontSize="9">SDK Protocol</text>
                                        
                                        <rect x="35" y="125" width="90" height="40" rx="5" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="80" y="140" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Axis Camera</text>
                                        <text x="80" y="153" textAnchor="middle" fill="white" fontSize="9">HTTP/ONVIF</text>
                                        
                                        <rect x="35" y="180" width="90" height="40" rx="5" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                        <text x="80" y="195" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Dahua DVR</text>
                                        <text x="80" y="208" textAnchor="middle" fill="white" fontSize="9">Proprietary API</text>
                                        
                                        <rect x="35" y="235" width="90" height="40" rx="5" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                        <text x="80" y="250" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Hanwha PTZ</text>
                                        <text x="80" y="263" textAnchor="middle" fill="white" fontSize="9">RTSP Stream</text>
                                        
                                        <rect x="35" y="290" width="90" height="40" rx="5" fill="#06B6D4" stroke="white" strokeWidth="1" />
                                        <text x="80" y="305" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Ajax Sensors</text>
                                        <text x="80" y="318" textAnchor="middle" fill="white" fontSize="9">WebSocket</text>
                                        
                                        {/* Proxy Layer */}
                                        <rect x="180" y="50" width="120" height="300" rx="10" fill="#4F46E5" stroke="#E8B058" strokeWidth="2" />
                                        <text x="240" y="35" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">Proxy Layer</text>
                                        
                                        {/* Protocol Translators */}
                                        <rect x="195" y="80" width="90" height="30" rx="4" fill="#232F3E" stroke="#E8B058" strokeWidth="1" />
                                        <text x="240" y="95" textAnchor="middle" fill="#E8B058" fontSize="10" fontWeight="bold">SDK Translator</text>
                                        <text x="240" y="105" textAnchor="middle" fill="white" fontSize="8">Binary → JSON</text>
                                        
                                        <rect x="195" y="125" width="90" height="30" rx="4" fill="#232F3E" stroke="#E8B058" strokeWidth="1" />
                                        <text x="240" y="140" textAnchor="middle" fill="#E8B058" fontSize="10" fontWeight="bold">HTTP Adapter</text>
                                        <text x="240" y="150" textAnchor="middle" fill="white" fontSize="8">REST → Stream</text>
                                        
                                        <rect x="195" y="170" width="90" height="30" rx="4" fill="#232F3E" stroke="#E8B058" strokeWidth="1" />
                                        <text x="240" y="185" textAnchor="middle" fill="#E8B058" fontSize="10" fontWeight="bold">API Gateway</text>
                                        <text x="240" y="195" textAnchor="middle" fill="white" fontSize="8">Custom → Standard</text>
                                        
                                        <rect x="195" y="215" width="90" height="30" rx="4" fill="#232F3E" stroke="#E8B058" strokeWidth="1" />
                                        <text x="240" y="230" textAnchor="middle" fill="#E8B058" fontSize="10" fontWeight="bold">RTSP Handler</text>
                                        <text x="240" y="240" textAnchor="middle" fill="white" fontSize="8">Stream → Cloud</text>
                                        
                                        <rect x="195" y="260" width="90" height="30" rx="4" fill="#232F3E" stroke="#E8B058" strokeWidth="1" />
                                        <text x="240" y="275" textAnchor="middle" fill="#E8B058" fontSize="10" fontWeight="bold">WS Processor</text>
                                        <text x="240" y="285" textAnchor="middle" fill="white" fontSize="8">Events → Queue</text>
                                        
                                        {/* Universal Interface */}
                                        <rect x="340" y="50" width="120" height="300" rx="10" fill="#06B6D4" stroke="#E8B058" strokeWidth="2" />
                                        <text x="400" y="35" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">Unified Interface</text>
                                        
                                        {/* Standardized Streams */}
                                        <rect x="355" y="80" width="90" height="50" rx="5" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="400" y="95" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Video Stream</text>
                                        <text x="400" y="108" textAnchor="middle" fill="white" fontSize="9">H.264/H.265</text>
                                        <text x="400" y="120" textAnchor="middle" fill="white" fontSize="9">WebRTC Ready</text>
                                        
                                        <rect x="355" y="145" width="90" height="50" rx="5" fill="#D946EF" stroke="white" strokeWidth="1" />
                                        <text x="400" y="160" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Event Data</text>
                                        <text x="400" y="173" textAnchor="middle" fill="white" fontSize="9">JSON Format</text>
                                        <text x="400" y="185" textAnchor="middle" fill="white" fontSize="9">Standardized</text>
                                        
                                        <rect x="355" y="210" width="90" height="50" rx="5" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                        <text x="400" y="225" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Device Status</text>
                                        <text x="400" y="238" textAnchor="middle" fill="white" fontSize="9">Health Metrics</text>
                                        <text x="400" y="250" textAnchor="middle" fill="white" fontSize="9">Real-time</text>
                                        
                                        <rect x="355" y="275" width="90" height="50" rx="5" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                        <text x="400" y="290" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Control API</text>
                                        <text x="400" y="303" textAnchor="middle" fill="white" fontSize="9">PTZ Commands</text>
                                        <text x="400" y="315" textAnchor="middle" fill="white" fontSize="9">Configuration</text>
                                        
                                        {/* Platform Core */}
                                        <rect x="500" y="50" width="80" height="300" rx="10" fill="#232F3E" stroke="#E8B058" strokeWidth="2" />
                                        <text x="540" y="35" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">{productName}</text>
                                        
                                        <rect x="510" y="80" width="60" height="40" rx="4" fill="#EF4444" stroke="white" strokeWidth="1" />
                                        <text x="540" y="95" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">AI Engine</text>
                                        <text x="540" y="108" textAnchor="middle" fill="white" fontSize="8">Analytics</text>
                                        
                                        <rect x="510" y="135" width="60" height="40" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="540" y="150" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Cloud SaaS</text>
                                        <text x="540" y="163" textAnchor="middle" fill="white" fontSize="8">Platform</text>
                                        
                                        <rect x="510" y="190" width="60" height="40" rx="4" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                        <text x="540" y="205" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Storage</text>
                                        <text x="540" y="218" textAnchor="middle" fill="white" fontSize="8">AWS S3</text>
                                        
                                        <rect x="510" y="245" width="60" height="40" rx="4" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                        <text x="540" y="260" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Dashboard</text>
                                        <text x="540" y="273" textAnchor="middle" fill="white" fontSize="8">Web UI</text>
                                        
                                        <rect x="510" y="300" width="60" height="30" rx="4" fill="#06B6D4" stroke="white" strokeWidth="1" />
                                        <text x="540" y="315" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">API</text>
                                        <text x="540" y="325" textAnchor="middle" fill="white" fontSize="8">REST</text>
                                        
                                        {/* Connection Arrows */}
                                        <path d="M 140 95 L 170 95 L 180 95" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        <path d="M 140 145 L 170 140 L 180 140" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        <path d="M 140 200 L 170 185 L 180 185" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        <path d="M 140 255 L 170 230 L 180 230" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        <path d="M 140 310 L 170 275 L 180 275" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        
                                        <path d="M 300 105 L 330 105 L 340 105" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        <path d="M 300 170 L 330 170 L 340 170" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        <path d="M 300 235 L 330 235 L 340 235" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowhead)" />
                                        
                                        <path d="M 460 200 L 480 200 L 500 200" stroke="#E8B058" strokeWidth="4" fill="none" markerEnd="url(#arrowhead)" />
                                        
                                        {/* Arrow marker definition */}
                                        <defs>
                                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                <polygon points="0 0, 10 3.5, 0 7" fill="#E8B058" />
                                            </marker>
                                        </defs>
                                        
                                        {/* Data Flow Labels */}
                                        <text x="300" y="380" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">Universal Translation Layer</text>
                                        <text x="300" y="395" textAnchor="middle" fill="white" fontSize="10">Any Protocol → Standardized Stream → Cloud Processing</text>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-6">Supported Manufacturers</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        'Hikvision', 'Dahua', 'Axis', 'Hanwha',
                                        'Avigilon', 'Milestone', 'Ganz', 'Uniview',
                                        'ADPRO', 'Ajax', 'Camect', 'EagleEye'
                                    ].map((brand, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 bg-[#202020] rounded-lg border border-white/10">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            <span className="text-white text-sm">{brand}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-white/70 text-sm mt-4">
                                    And hundreds more through universal protocol support
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Performance Metrics Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">AI-Powered Performance</h2>
                                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                                    Revolutionary AI algorithms analyze video streams in real-time, learning from millions of security events 
                                    to deliver unprecedented accuracy in threat detection and false alarm elimination.
                                </p>
                                <div className="space-y-6">
                                    <div className="p-6 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-green-500/20 rounded-lg">
                                                <Shield className="w-5 h-5 text-green-400" />
                                            </div>
                                            <h3 className="font-semibold text-white">Up to 99% False Alarm Reduction</h3>
                                        </div>
                                        <p className="text-white/70 text-sm">Advanced computer vision distinguishes between genuine security threats and environmental factors like weather, animals, or shadows</p>
                                    </div>
                                    <div className="p-6 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-500/20 rounded-lg">
                                                <Zap className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h3 className="font-semibold text-white">Sub-60 Second Response</h3>
                                        </div>
                                        <p className="text-white/70 text-sm">Machine learning prioritizes critical alerts and delivers verified threat notifications in under 60 seconds</p>
                                    </div>
                                    <div className="p-6 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <Eye className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <h3 className="font-semibold text-white">24/7 Intelligent Monitoring</h3>
                                        </div>
                                        <p className="text-white/70 text-sm">Continuous AI surveillance never sleeps, providing round-the-clock protection with human-level accuracy</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                                <div className="relative p-6 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <h4 className="text-center text-white mb-4">Real-World Performance Data</h4>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-4 bg-white/5 rounded-lg">
                                            <div className="text-3xl font-bold text-green-400">99%</div>
                                            <div className="text-sm text-white/70">Accuracy Rate</div>
                                        </div>
                                        <div className="text-center p-4 bg-white/5 rounded-lg">
                                            <div className="text-3xl font-bold text-blue-400">47s</div>
                                            <div className="text-sm text-white/70">Avg Response</div>
                                        </div>
                                    </div>
                                    <div style={{ height: '200px' }}>
                                        <canvas id="performanceChart"></canvas>
                                    </div>
                                    <p className="text-center text-white/70 text-sm mt-4">
                                        Based on analysis of 2.3M+ security events across 1,200+ installations
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Talos Integration Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">{productName} & Talos Integration</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Seamless integration between {productName} video analytics and Evalink Talos alarm management platform
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#E8B058]/10 to-[#E8B058]/5 rounded-2xl blur-3xl" />
                                <div className="relative p-8 bg-[#202020] backdrop-blur-xl border border-white/10 rounded-2xl">
                                    <svg viewBox="0 0 600 400" className="w-full h-auto">
                                        {/* Talos Integration Diagram */}
                                        <defs>
                                            <linearGradient id="talosGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#E8B058" />
                                                <stop offset="100%" stopColor="#3B82F6" />
                                            </linearGradient>
                                        </defs>
                                        
                                        {/* Site Devices */}
                                        <rect x="20" y="50" width="120" height="120" rx="8" fill="#374151" stroke="#E8B058" strokeWidth="2" />
                                        <text x="80" y="35" textAnchor="middle" fill="#E8B058" fontSize="12" fontWeight="bold">Customer Site</text>
                                        
                                        <rect x="35" y="70" width="40" height="25" rx="3" fill="#EF4444" stroke="white" strokeWidth="1" />
                                        <text x="55" y="82" textAnchor="middle" fill="white" fontSize="9">Camera 1</text>
                                        
                                        <rect x="85" y="70" width="40" height="25" rx="3" fill="#EF4444" stroke="white" strokeWidth="1" />
                                        <text x="105" y="82" textAnchor="middle" fill="white" fontSize="9">Camera 2</text>
                                        
                                        <rect x="35" y="105" width="40" height="25" rx="3" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="55" y="117" textAnchor="middle" fill="white" fontSize="9">PIR Sensor</text>
                                        
                                        <rect x="85" y="105" width="40" height="25" rx="3" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                        <text x="105" y="117" textAnchor="middle" fill="white" fontSize="9">Door Alarm</text>
                                        
                                        <rect x="60" y="140" width="40" height="25" rx="3" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                        <text x="80" y="152" textAnchor="middle" fill="white" fontSize="9">NVR</text>
                                        
                                        {/* Platform Processing */}
                                        <rect x="180" y="30" width="140" height="160" rx="10" fill="#232F3E" stroke="#E8B058" strokeWidth="2" />
                                        <text x="250" y="20" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">{productName} Platform</text>
                                        
                                        {/* Raw Alarms Input */}
                                        <rect x="195" y="50" width="110" height="30" rx="4" fill="#EF4444" stroke="white" strokeWidth="1" />
                                        <text x="250" y="62" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Raw Alarm Ingestion</text>
                                        <text x="250" y="74" textAnchor="middle" fill="white" fontSize="8">Motion, Door, PIR Events</text>
                                        
                                        {/* AI Processing */}
                                        <rect x="195" y="90" width="110" height="40" rx="4" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                        <text x="250" y="105" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">AI Video Analytics</text>
                                        <text x="250" y="117" textAnchor="middle" fill="white" fontSize="9">• Person Detection</text>
                                        <text x="250" y="127" textAnchor="middle" fill="white" fontSize="9">• False Alarm Filter</text>
                                        
                                        {/* Verification */}
                                        <rect x="195" y="140" width="110" height="40" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="250" y="155" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Threat Verification</text>
                                        <text x="250" y="167" textAnchor="middle" fill="white" fontSize="9">• 99% Accuracy Rate</text>
                                        <text x="250" y="177" textAnchor="middle" fill="white" fontSize="9">• {'<60s'} Processing</text>
                                        
                                        {/* Data Flow Arrow */}
                                        <path d="M 140 120 L 160 120 L 180 65" stroke="#E8B058" strokeWidth="3" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        {/* Talos Integration */}
                                        <rect x="360" y="30" width="140" height="160" rx="10" fill="#3B82F6" stroke="#E8B058" strokeWidth="2" />
                                        <text x="430" y="20" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">Talos CMS Platform</text>
                                        
                                        {/* Verified Events */}
                                        <rect x="375" y="50" width="110" height="30" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="430" y="62" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">Verified Events Only</text>
                                        <text x="430" y="74" textAnchor="middle" fill="white" fontSize="8">True Threats + Video Clip</text>
                                        
                                        {/* Operator Dashboard */}
                                        <rect x="375" y="90" width="110" height="40" rx="4" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                        <text x="430" y="105" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Operator Dashboard</text>
                                        <text x="430" y="117" textAnchor="middle" fill="white" fontSize="9">• Priority Queue</text>
                                        <text x="430" y="127" textAnchor="middle" fill="white" fontSize="9">• Response Tools</text>
                                        
                                        {/* Response Actions */}
                                        <rect x="375" y="140" width="110" height="40" rx="4" fill="#D946EF" stroke="white" strokeWidth="1" />
                                        <text x="430" y="155" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Response Dispatch</text>
                                        <text x="430" y="167" textAnchor="middle" fill="white" fontSize="9">• Customer Contact</text>
                                        <text x="430" y="177" textAnchor="middle" fill="white" fontSize="9">• Emergency Services</text>
                                        
                                        {/* Integration Arrow */}
                                        <path d="M 320 120 L 340 120 L 360 120" stroke="#E8B058" strokeWidth="4" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        {/* Statistics */}
                                        <rect x="20" y="220" width="560" height="80" rx="8" fill="#1a1a1a" stroke="#E8B058" strokeWidth="1" />
                                        <text x="300" y="240" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">Integration Benefits</text>
                                        
                                        <rect x="40" y="250" width="120" height="40" rx="4" fill="#10B981" stroke="white" strokeWidth="1" />
                                        <text x="100" y="265" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">99% False Alarm</text>
                                        <text x="100" y="277" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Reduction</text>
                                        <text x="100" y="287" textAnchor="middle" fill="white" fontSize="8">AI Pre-filtering</text>
                                        
                                        <rect x="180" y="250" width="120" height="40" rx="4" fill="#3B82F6" stroke="white" strokeWidth="1" />
                                        <text x="240" y="265" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">70% Operator</text>
                                        <text x="240" y="277" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Efficiency Gain</text>
                                        <text x="240" y="287" textAnchor="middle" fill="white" fontSize="8">Verified Events Only</text>
                                        
                                        <rect x="320" y="250" width="120" height="40" rx="4" fill="#F59E0B" stroke="white" strokeWidth="1" />
                                        <text x="380" y="265" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Sub-60 Second</text>
                                        <text x="380" y="277" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Response Time</text>
                                        <text x="380" y="287" textAnchor="middle" fill="white" fontSize="8">Automated Processing</text>
                                        
                                        <rect x="460" y="250" width="120" height="40" rx="4" fill="#8B5CF6" stroke="white" strokeWidth="1" />
                                        <text x="520" y="265" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">24/7 Monitoring</text>
                                        <text x="520" y="277" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Coverage</text>
                                        <text x="520" y="287" textAnchor="middle" fill="white" fontSize="8">Never Sleeps</text>
                                        
                                        {/* Data Flow Process */}
                                        <rect x="20" y="320" width="560" height="60" rx="8" fill="#202020" stroke="#E8B058" strokeWidth="1" />
                                        <text x="300" y="340" textAnchor="middle" fill="#E8B058" fontSize="14" fontWeight="bold">Data Flow Process</text>
                                        
                                        {/* Process Steps */}
                                        <circle cx="80" cy="360" r="15" fill="#EF4444" stroke="white" strokeWidth="2" />
                                        <text x="80" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
                                        <text x="80" y="375" textAnchor="middle" fill="white" fontSize="8">Raw Alarm</text>
                                        
                                        <path d="M 95 360 L 115 360" stroke="#E8B058" strokeWidth="2" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        <circle cx="140" cy="360" r="15" fill="#8B5CF6" stroke="white" strokeWidth="2" />
                                        <text x="140" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                                        <text x="140" y="375" textAnchor="middle" fill="white" fontSize="8">AI Analysis</text>
                                        
                                        <path d="M 155 360 L 175 360" stroke="#E8B058" strokeWidth="2" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        <circle cx="200" cy="360" r="15" fill="#10B981" stroke="white" strokeWidth="2" />
                                        <text x="200" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
                                        <text x="200" y="375" textAnchor="middle" fill="white" fontSize="8">Verification</text>
                                        
                                        <path d="M 215 360 L 235 360" stroke="#E8B058" strokeWidth="2" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        <circle cx="260" cy="360" r="15" fill="#3B82F6" stroke="white" strokeWidth="2" />
                                        <text x="260" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">4</text>
                                        <text x="260" y="375" textAnchor="middle" fill="white" fontSize="8">Talos Queue</text>
                                        
                                        <path d="M 275 360 L 295 360" stroke="#E8B058" strokeWidth="2" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        <circle cx="320" cy="360" r="15" fill="#F59E0B" stroke="white" strokeWidth="2" />
                                        <text x="320" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">5</text>
                                        <text x="320" y="375" textAnchor="middle" fill="white" fontSize="8">Operator</text>
                                        
                                        <path d="M 335 360 L 355 360" stroke="#E8B058" strokeWidth="2" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        <circle cx="380" cy="360" r="15" fill="#D946EF" stroke="white" strokeWidth="2" />
                                        <text x="380" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">6</text>
                                        <text x="380" y="375" textAnchor="middle" fill="white" fontSize="8">Response</text>
                                        
                                        <path d="M 395 360 L 415 360" stroke="#E8B058" strokeWidth="2" fill="none" markerEnd="url(#arrowTalos)" />
                                        
                                        <circle cx="440" cy="360" r="15" fill="#06B6D4" stroke="white" strokeWidth="2" />
                                        <text x="440" y="365" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">7</text>
                                        <text x="440" y="375" textAnchor="middle" fill="white" fontSize="8">Resolution</text>
                                        
                                        {/* Arrow marker definition */}
                                        <defs>
                                            <marker id="arrowTalos" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                                                <polygon points="0 0, 8 3, 0 6" fill="#E8B058" />
                                            </marker>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-[#E8B058]/10 rounded-lg">
                                                <Cpu className="w-5 h-5 text-[#E8B058]" />
                                            </div>
                                            <h3 className="font-semibold text-white">{productName} Role</h3>
                                        </div>
                                        <ul className="text-white/70 text-sm space-y-1">
                                            <li>• Advanced video analytics and AI processing</li>
                                            <li>• Multi-manufacturer device integration</li>
                                            <li>• Real-time false alarm filtering (99% accuracy)</li>
                                            <li>• Cloud-based storage and streaming</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-[#202020] rounded-xl border border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <GitBranch className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <h3 className="font-semibold text-white">Talos Role</h3>
                                        </div>
                                        <ul className="text-white/70 text-sm space-y-1">
                                            <li>• Central monitoring station operations</li>
                                            <li>• Alarm workflow management and dispatch</li>
                                            <li>• Operator interface and response tools</li>
                                            <li>• Customer reporting and communication</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 bg-gradient-to-r from-[#E8B058]/10 to-blue-500/10 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-green-500/10 rounded-lg">
                                                <Network className="w-5 h-5 text-green-400" />
                                            </div>
                                            <h3 className="font-semibold text-white">Data Flow</h3>
                                        </div>
                                        <p className="text-white/70 text-sm">
                                            Raw alarms → {productName} AI analysis → Verified events → Talos operator dashboard. 
                                            This intelligent pipeline ensures operators only see genuine security threats.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Key Benefits Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Key Benefits & Value Propositions</h2>
                            <p className="text-white/70 text-lg max-w-3xl mx-auto">
                                Transform your security operations with comprehensive, cloud-native capabilities
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Shield className="w-8 h-8" />,
                                    title: 'Comprehensive Threat Detection',
                                    desc: 'AI-powered behavioral analysis and machine learning-driven threat protection',
                                    color: '#EF4444'
                                },
                                {
                                    icon: <Activity className="w-8 h-8" />,
                                    title: 'Enhanced Operational Efficiency',
                                    desc: 'Unified platform reduces manual workload by up to 70% through automation',
                                    color: '#10B981'
                                },
                                {
                                    icon: <Layers className="w-8 h-8" />,
                                    title: 'Scalability & Flexibility',
                                    desc: 'Cloud-native architecture scales instantly without hardware limitations',
                                    color: '#3B82F6'
                                },
                                {
                                    icon: <CheckCircle className="w-8 h-8" />,
                                    title: 'Robust Compliance',
                                    desc: 'Built-in RBAC and audit trails for GDPR, SOC 2, and ISO 27001 readiness',
                                    color: '#8B5CF6'
                                },
                                {
                                    icon: <BarChart3 className="w-8 h-8" />,
                                    title: 'Advanced Data Integration',
                                    desc: 'Centralized data platform with AI-driven insights and custom reporting',
                                    color: '#F59E0B'
                                },
                                {
                                    icon: <Cloud className="w-8 h-8" />,
                                    title: 'Cost-Effective Infrastructure',
                                    desc: 'Eliminates hardware costs, reduces TCO by 60%, predictable subscription pricing',
                                    color: '#06B6D4'
                                }
                            ].map((benefit, idx) => (
                                <motion.div
                                    key={benefit.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                                >
                                    <div className="p-3 rounded-lg inline-block mb-4" style={{ backgroundColor: `${benefit.color}20`, color: benefit.color }}>
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                                    <p className="text-sm text-white/70 leading-relaxed">{benefit.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Interactive Demo Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-32"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Experience {productName} Live</h2>
                            <p className="text-white/70 text-lg max-w-2xl mx-auto">
                                Interactive demonstrations of key platform capabilities
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                {
                                    title: 'Live Video Demo',
                                    desc: 'Watch real-time video streams with AI analytics overlay',
                                    icon: <Play className="w-8 h-8" />,
                                    action: 'Watch Demo',
                                    color: '#EF4444'
                                },
                                {
                                    title: 'AI Detection Test',
                                    desc: 'See how AI distinguishes between real threats and false alarms',
                                    icon: <Eye className="w-8 h-8" />,
                                    action: 'Try AI Demo',
                                    color: '#10B981'
                                },
                                {
                                    title: 'Mobile Experience',
                                    desc: 'Test the mobile app interface and remote monitoring',
                                    icon: <Smartphone className="w-8 h-8" />,
                                    action: 'View Mobile',
                                    color: '#3B82F6'
                                },
                                {
                                    title: 'Device Integration',
                                    desc: 'Explore how different manufacturers connect seamlessly',
                                    icon: <Network className="w-8 h-8" />,
                                    action: 'See Integration',
                                    color: '#F59E0B'
                                },
                                {
                                    title: 'Analytics Dashboard',
                                    desc: 'Interactive charts and real-time system metrics',
                                    icon: <BarChart3 className="w-8 h-8" />,
                                    action: 'Open Dashboard',
                                    color: '#8B5CF6'
                                },
                                {
                                    title: 'Download Resources',
                                    desc: 'Get technical specifications, case studies, and guides',
                                    icon: <Download className="w-8 h-8" />,
                                    action: 'Download Pack',
                                    color: '#06B6D4'
                                }
                            ].map((demo, idx) => (
                                <motion.div
                                    key={demo.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="p-3 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform" 
                                         style={{ backgroundColor: `${demo.color}20`, color: demo.color }}>
                                        {demo.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#E8B058] transition-colors">
                                        {demo.title}
                                    </h3>
                                    <p className="text-sm text-white/70 leading-relaxed mb-4">{demo.desc}</p>
                                    <button className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all">
                                        {demo.action}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Next Steps Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mb-16"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                            <p className="text-white/70 text-lg max-w-2xl mx-auto">
                                Explore the platform capabilities and begin your {productName} journey
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                {
                                    title: 'Quick Start Guide',
                                    desc: 'Step-by-step setup instructions',
                                    icon: <Zap className="w-6 h-6" />
                                },
                                {
                                    title: 'Cloud Architecture',
                                    desc: 'Deep dive into technical details',
                                    icon: <Cloud className="w-6 h-6" />
                                },
                                {
                                    title: 'Device Integration',
                                    desc: 'Connect your security devices',
                                    link: '/docs/devices',
                                    icon: <Camera className="w-6 h-6" />
                                },
                                {
                                    title: 'Key Benefits',
                                    desc: 'Explore platform advantages',
                                    icon: <CheckCircle className="w-6 h-6" />
                                }
                            ].map((item, idx) => (
                                <Link
                                    key={item.title}
                                    to={item.link}
                                    className="group block p-6 bg-[#202020] rounded-xl border border-white/10 hover:border-[#E8B058]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[#E8B058]/10 no-underline"
                                >
                                    <div className="p-3 bg-[#E8B058]/10 rounded-lg text-[#E8B058] inline-block mb-4 group-hover:bg-[#E8B058]/20 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-[#E8B058] transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </motion.section>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="inline-flex gap-4">
                            <Link
                                to="/docs"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-[#E8B058]/25 no-underline"
                            >
                                Start Free Trial
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="#"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 rounded-xl text-white hover:text-[#E8B058] transition-all no-underline"
                            >
                                Technical Deep Dive
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                to="#"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all no-underline"
                            >
                                Schedule Demo
                                <Calendar className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </main>
        </Layout>
    );
}
