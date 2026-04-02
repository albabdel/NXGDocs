import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import {
    Play,
    X,
    Check,
    ChevronDown,
    ChevronUp,
    Clock,
    Rocket,
    Activity,
    ArrowRight,
    Monitor,
    Wifi,
    Cpu,
    HardDrive,
    Globe,
    Lock,
    Users,
    HelpCircle,
    ArrowUpRight,
    Youtube,
} from 'lucide-react';
import styles from './index.module.css';
import landingPagesData from '../data/sanity-landing-pages.generated.json';
import { getOnboardingPhases } from '../data/onboardingPhases';
import { StepType } from '../types/onboarding';
import { useProduct } from '@theme/Root';

type LandingPage = {
    slug: { current: string };
    title: string;
    description: string;
    hero?: {
        headline: string;
        subheadline: string;
        badge?: { icon: string; text: string };
        ctaButtons?: Array<{ href: string; label: string; variant: string }>;
    };
};

type QuickStartStep = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    link: string;
    estimatedTime: string;
};

type VideoResource = {
    id: string;
    title: string;
    description: string;
    youtubeId: string;
    thumbnail: string;
    duration: string;
};

type FeaturedArticle = {
    title: string;
    description: string;
    link: string;
    icon: React.ReactNode;
    category: string;
};

type SystemRequirement = {
    name: string;
    minimum: string;
    recommended: string;
    icon: React.ReactNode;
};

const STORAGE_KEY = 'gcxone-getting-started-progress';

const quickStartSteps: QuickStartStep[] = [
    {
        id: 'first-login',
        title: 'First Time Login',
        description: 'Access your account and set up authentication',
        icon: <Lock className="w-5 h-5" />,
        link: '/docs/getting-started/first-time-login--access',
        estimatedTime: '5 min',
    },
    {
        id: 'platform-overview',
        title: 'Platform Overview',
        description: 'Learn about platform architecture and capabilities',
        icon: <Globe className="w-5 h-5" />,
        link: '/quick-start/platform-overview',
        estimatedTime: '10 min',
    },
    {
        id: 'network-setup',
        title: 'Network Configuration',
        description: 'Configure firewall and connectivity requirements',
        icon: <Wifi className="w-5 h-5" />,
        link: '/docs/getting-started/pre-deployment-requirements',
        estimatedTime: '15 min',
    },
    {
        id: 'device-integration',
        title: 'Connect Devices',
        description: 'Integrate cameras, panels, and sensors',
        icon: <Cpu className="w-5 h-5" />,
        link: '/quick-start/device-integration',
        estimatedTime: '20 min',
    },
    {
        id: 'user-management',
        title: 'User Setup',
        description: 'Create users and assign roles',
        icon: <Users className="w-5 h-5" />,
        link: '/docs/getting-started/user-management-setup',
        estimatedTime: '10 min',
    },
    {
        id: 'alarm-processing',
        title: 'Process Alarms',
        description: 'Learn alarm handling workflows',
        icon: <Activity className="w-5 h-5" />,
        link: '/docs/alarm-management',
        estimatedTime: '15 min',
    },
];

const videoResources: VideoResource[] = [
    {
        id: 'v1',
        title: 'Platform Overview',
        description: 'Complete introduction to the platform',
        youtubeId: 'ER-tnAvGXow',
        thumbnail: 'https://img.youtube.com/vi/ER-tnAvGXow/maxresdefault.jpg',
        duration: '12:30',
    },
    {
        id: 'v2',
        title: 'First-Time Login & Setup',
        description: 'Step-by-step authentication setup',
        youtubeId: 'I7dccOLTOsk',
        thumbnail: 'https://img.youtube.com/vi/I7dccOLTOsk/maxresdefault.jpg',
        duration: '8:45',
    },
    {
        id: 'v3',
        title: 'Dashboard Deep Dive',
        description: 'Master the monitoring dashboard',
        youtubeId: 'AxHOF8cV88Q',
        thumbnail: 'https://img.youtube.com/vi/AxHOF8cV88Q/maxresdefault.jpg',
        duration: '15:20',
    },
    {
        id: 'v4',
        title: 'Platform & Talos Integration',
        description: 'How the platform works with Talos devices',
        youtubeId: 'p--04PIIO-M',
        thumbnail: 'https://img.youtube.com/vi/p--04PIIO-M/maxresdefault.jpg',
        duration: '10:15',
    },
];

const featuredArticles: FeaturedArticle[] = [
    {
        title: 'Quick Start Guide',
        description: 'Get up and running in 5-10 minutes',
        link: '/quick-start/guide',
        icon: <Rocket className="w-5 h-5" />,
        category: 'Essential',
    },
    {
        title: 'Device Integration',
        description: 'Complete device onboarding reference',
        link: '/quick-start/device-integration',
        icon: <Cpu className="w-5 h-5" />,
        category: 'Technical',
    },
    {
        title: 'User Management',
        description: 'Configure users and permissions',
        link: '/docs/getting-started/user-management-setup',
        icon: <Users className="w-5 h-5" />,
        category: 'Admin',
    },
    {
        title: 'Quick Start Checklist',
        description: 'Complete setup checklist',
        link: '/docs/getting-started/quick-start-checklist',
        icon: <HelpCircle className="w-5 h-5" />,
        category: 'Support',
    },
];

const systemRequirements: SystemRequirement[] = [
    { name: 'Browser', minimum: 'Chrome 90+, Firefox 88+, Edge 90+', recommended: 'Chrome 120+ (latest)', icon: <Monitor className="w-5 h-5" /> },
    { name: 'Internet', minimum: '5 Mbps download', recommended: '25+ Mbps for HD video', icon: <Wifi className="w-5 h-5" /> },
    { name: 'Screen', minimum: '1366 x 768 resolution', recommended: '1920 x 1080 or higher', icon: <Monitor className="w-5 h-5" /> },
    { name: 'Memory', minimum: '4 GB RAM', recommended: '8+ GB RAM', icon: <HardDrive className="w-5 h-5" /> },
];



function getYouTubeThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function useProgress() {
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCompletedSteps(JSON.parse(stored));
            }
        } catch {
            setCompletedSteps([]);
        }
    }, []);

    const toggleStep = useCallback((stepId: string) => {
        setCompletedSteps(prev => {
            const updated = prev.includes(stepId)
                ? prev.filter(id => id !== stepId)
                : [...prev, stepId];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
        });
    }, []);

    const isComplete = useCallback((stepId: string) => completedSteps.includes(stepId), [completedSteps]);

    const resetProgress = useCallback(() => {
        setCompletedSteps([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {}
    }, []);

    return { completedSteps, toggleStep, isComplete, resetProgress };
}

export default function GettingStartedPage(): React.JSX.Element {
    const { productName } = useProduct();
    const [activePhaseId, setActivePhaseId] = useState<string | undefined>('account-access');
    const [videoModal, setVideoModal] = useState<VideoResource | null>(null);
    const [isDark, setIsDark] = useState(true);
    const { toggleStep, isComplete, completedSteps, resetProgress } = useProgress();

    useEffect(() => {
        const checkDark = () => {
            setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        return () => observer.disconnect();
    }, []);

    const sanityPage = useMemo(() => {
        const pages = landingPagesData as LandingPage[];
        return pages.find(p => p.slug.current === 'getting-started');
    }, []);

    // Get product-specific onboarding phases
    const onboardingPhases = useMemo(() => getOnboardingPhases(productName), [productName]);

    const totalSteps = useMemo(() => 
        onboardingPhases.reduce((acc, phase) => acc + phase.steps.length, 0) + quickStartSteps.length,
        [onboardingPhases]
    );

    const completedCount = useMemo(() => {
        let count = 0;
        quickStartSteps.forEach(step => {
            if (isComplete(step.id)) count++;
        });
        onboardingPhases.forEach(phase => {
            phase.steps.forEach(step => {
                if (isComplete(step.id)) count++;
            });
        });
        return count;
    }, [isComplete, onboardingPhases]);

    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setVideoModal(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <Layout title={`Getting Started | ${productName}`} description={`Guided onboarding for ${productName} - complete setup path to operational readiness`}>
            <main className="min-h-screen" style={{ backgroundColor: 'var(--ifm-background-color)' }}>
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        <Link to="/" className="flex items-center gap-1 hover:text-[#E8B058] transition-colors no-underline">
                            <span>Home</span>
                        </Link>
                        <ChevronDown className="w-4 h-4 -rotate-90 opacity-50" />
                        <span style={{ color: 'var(--ifm-color-content)' }}>Getting Started</span>
                    </nav>
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-24">
                    <section className="mb-16">
                        <div className="relative overflow-hidden rounded-2xl p-8 md:p-12" style={{
                            background: isDark
                                ? 'linear-gradient(135deg, rgba(232,176,88,0.08) 0%, rgba(0,0,0,0.5) 50%, rgba(232,176,88,0.05) 100%)'
                                : 'linear-gradient(135deg, rgba(232,176,88,0.12) 0%, rgba(255,255,255,0.8) 50%, rgba(232,176,88,0.08) 100%)',
                            border: `1px solid ${isDark ? 'rgba(232,176,88,0.2)' : 'rgba(232,176,88,0.3)'}`,
                        }}>
                            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                                background: 'linear-gradient(90deg, transparent 0%, #E8B058 25%, #C89446 50%, #E8B058 75%, transparent 100%)',
                            }} />
                            
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={styles.sectionBadge}>Onboarding</span>
                                        {progressPercent > 0 && (
                                            <span className="text-xs px-2 py-1 rounded-full font-medium" style={{
                                                background: 'rgba(34, 197, 94, 0.15)',
                                                color: '#22c55e',
                                                border: '1px solid rgba(34, 197, 94, 0.3)',
                                            }}>
                                                {progressPercent}% Complete
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                                        {sanityPage?.hero?.headline || 'Getting Started'}
                                    </h1>
                                    <p className="text-lg mb-6 max-w-2xl" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {sanityPage?.hero?.subheadline || sanityPage?.description || `Guided onboarding for ${productName} - complete setup path to operational readiness`}
                                    </p>

                                    <div className="flex flex-wrap gap-3">
                                        <Link
                                            to="/quick-start/guide"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all duration-200 no-underline"
                                            style={{ boxShadow: '0 4px 20px rgba(232,176,88,0.25)' }}
                                        >
                                            <Rocket className="w-5 h-5" />
                                            Start Tutorial
                                        </Link>
                                        <button
                                            onClick={() => videoResources[0] && setVideoModal(videoResources[0])}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border transition-all duration-200"
                                            style={{
                                                background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                                color: 'var(--ifm-color-content)',
                                            }}
                                        >
                                            <Play className="w-5 h-5" />
                                            Watch Demo
                                        </button>
                                    </div>
                                </div>

                                <div className="lg:w-80 w-full">
                                    <div className="p-4 rounded-xl" style={{
                                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.5)',
                                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)'}`,
                                    }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                                                Your Progress
                                            </span>
                                            <span className="text-xs" style={{ color: '#E8B058' }}>
                                                {completedCount}/{totalSteps} steps
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{
                                            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.15)',
                                        }}>
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${progressPercent}%`,
                                                    background: 'linear-gradient(90deg, #E8B058, #22c55e)',
                                                }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)' }}>
                                                <div className="font-medium" style={{ color: 'var(--ifm-color-content)' }}>{quickStartSteps.length}</div>
                                                <div style={{ color: 'var(--ifm-color-content-secondary)' }}>Quick Steps</div>
                                            </div>
                                            <div className="p-2 rounded-lg" style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.5)' }}>
                                                <div className="font-medium" style={{ color: 'var(--ifm-color-content)' }}>{onboardingPhases.length}</div>
                                                <div style={{ color: 'var(--ifm-color-content-secondary)' }}>Phases</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Quick Actions</span>
                                <h2 className="text-2xl font-bold text-[#E8B058] mt-2">Quick Start Steps</h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Essential tasks to get you started
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {quickStartSteps.map((step) => {
                                const complete = isComplete(step.id);
                                return (
                                    <div
                                        key={step.id}
                                        className={`relative rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer group ${complete ? 'opacity-75' : ''}`}
                                        style={{
                                            background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                            borderColor: complete ? 'rgba(34,197,94,0.3)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                        }}
                                        onClick={() => toggleStep(step.id)}
                                    >
                                        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
                                            background: complete ? '#22c55e' : 'linear-gradient(90deg, #E8B058, transparent)',
                                        }} />
                                        <div className="p-5">
                                            <div className="flex items-start gap-4">
                                                <button
                                                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-200 mt-0.5"
                                                    style={{
                                                        background: complete ? '#22c55e' : 'transparent',
                                                        borderColor: complete ? '#22c55e' : '#E8B058',
                                                    }}
                                                    onClick={(e) => { e.stopPropagation(); toggleStep(step.id); }}
                                                >
                                                    {complete && <Check className="w-4 h-4 text-white" />}
                                                </button>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                                                            background: 'rgba(232,176,88,0.1)',
                                                            color: '#E8B058',
                                                        }}>
                                                            {step.icon}
                                                        </div>
                                                        <span className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1" style={{
                                                            background: 'rgba(232,176,88,0.1)',
                                                            color: '#E8B058',
                                                        }}>
                                                            <Clock className="w-3 h-3" />
                                                            {step.estimatedTime}
                                                        </span>
                                                    </div>
                                                    <h3 className={`font-semibold text-sm mb-1 ${complete ? 'line-through' : ''}`} style={{ color: 'var(--ifm-color-content)' }}>
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                        {step.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                to={step.link}
                                                className="mt-4 flex items-center gap-1 text-xs font-medium text-[#E8B058] hover:underline no-underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                View Guide <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Onboarding Path</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Setup Phases
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Complete each phase to reach operational readiness
                                </p>
                            </div>
                            {completedCount > 0 && (
                                <button
                                    onClick={resetProgress}
                                    className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-[#E8B058]/10"
                                    style={{
                                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                        color: 'var(--ifm-color-content-secondary)',
                                    }}
                                >
                                    Reset Progress
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {onboardingPhases.map((phase, phaseIndex) => {
                                const isExpanded = activePhaseId === phase.id;
                                const phaseCompletedSteps = phase.steps.filter(s => isComplete(s.id)).length;
                                const phaseTotal = phase.steps.length;
                                const allComplete = phaseCompletedSteps === phaseTotal;

                                return (
                                    <div
                                        key={phase.id}
                                        className="rounded-xl border overflow-hidden transition-all duration-200"
                                        style={{
                                            borderColor: allComplete ? 'rgba(34,197,94,0.3)' : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                            backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)',
                                        }}
                                    >
                                        <button
                                            onClick={() => setActivePhaseId(isExpanded ? undefined : phase.id)}
                                            className="w-full text-left p-5 flex items-center justify-between"
                                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200"
                                                    style={{
                                                        background: allComplete ? '#22c55e' : 'rgba(232, 176, 88, 0.15)',
                                                        color: allComplete ? '#fff' : '#E8B058',
                                                    }}
                                                >
                                                    {allComplete ? <Check className="w-5 h-5" /> : phaseIndex + 1}
                                                </div>
                                                <div>
                                                    <div className="font-semibold" style={{ color: 'var(--ifm-color-content)' }}>
                                                        {phase.title}
                                                    </div>
                                                    <div className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                        {phase.description}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs px-2 py-1 rounded-full" style={{
                                                    background: allComplete ? 'rgba(34,197,94,0.15)' : 'rgba(232,176,88,0.1)',
                                                    color: allComplete ? '#22c55e' : '#E8B058',
                                                }}>
                                                    {phaseCompletedSteps}/{phaseTotal}
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5" style={{ color: 'var(--ifm-color-content-secondary)' }} />
                                                )}
                                            </div>
                                        </button>

                                        {isExpanded && (
                                            <div className="px-5 pb-5 space-y-2">
                                                {phase.steps.map((step) => {
                                                    const complete = isComplete(step.id);
                                                    const title = step.title;

                                                    return (
                                                        <div
                                                            key={step.id}
                                                            className="flex items-start gap-3 p-4 rounded-lg transition-all duration-200"
                                                            style={{
                                                                background: complete
                                                                    ? 'rgba(34, 197, 94, 0.05)'
                                                                    : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(232,176,88,0.05)',
                                                            }}
                                                        >
                                                            <button
                                                                onClick={() => toggleStep(step.id)}
                                                                className="w-5 h-5 rounded flex items-center justify-center mt-0.5 border transition-all duration-200 flex-shrink-0"
                                                                style={{
                                                                    background: complete ? '#22c55e' : 'transparent',
                                                                    borderColor: complete ? '#22c55e' : 'var(--ifm-color-emphasis-400)',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                {complete && <Check className="w-3 h-3 text-white" />}
                                                            </button>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span
                                                                        className={`text-sm font-medium ${complete ? 'line-through' : ''}`}
                                                                        style={{ color: complete ? 'var(--ifm-color-content-secondary)' : 'var(--ifm-color-content)' }}
                                                                    >
                                                                        {step.actionLink ? (
                                                                            <Link to={step.actionLink} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                                                                                {title}
                                                                            </Link>
                                                                        ) : title}
                                                                    </span>
                                                                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                                                                        background: step.type === StepType.VALIDATION ? 'rgba(59,130,246,0.1)' : step.type === StepType.CONFIRMATION ? 'rgba(168,85,247,0.1)' : 'rgba(232,176,88,0.1)',
                                                                        color: step.type === StepType.VALIDATION ? '#3b82f6' : step.type === StepType.CONFIRMATION ? '#a855f7' : '#E8B058',
                                                                    }}>
                                                                        {step.type}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                                    {step.description}
                                                                </div>
                                                            </div>
                                                            {step.learningContent?.videoId && (
                                                                <button
                                                                    onClick={() => setVideoModal({
                                                                        id: step.id,
                                                                        title: step.learningContent?.title || title,
                                                                        description: step.learningContent?.description || '',
                                                                        youtubeId: step.learningContent?.videoId || '',
                                                                        thumbnail: getYouTubeThumbnail(step.learningContent?.videoId || ''),
                                                                        duration: '',
                                                                    })}
                                                                    className="p-2 rounded-lg transition-colors hover:bg-[#E8B058]/20"
                                                                    style={{
                                                                        background: 'rgba(232,176,88,0.1)',
                                                                        color: '#E8B058',
                                                                    }}
                                                                >
                                                                    <Play className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Video Tutorials</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Video Resources
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Watch and learn with step-by-step video guides
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {videoResources.map((video) => (
                                <div
                                    key={video.id}
                                    className="rounded-xl border overflow-hidden cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                    }}
                                    onClick={() => setVideoModal(video)}
                                >
                                    <div className="relative aspect-video bg-black/20 overflow-hidden">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                                            }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-14 h-14 rounded-full bg-[#E8B058] flex items-center justify-center">
                                                <Play className="w-6 h-6 text-black ml-1" />
                                            </div>
                                        </div>
                                        <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-medium bg-black/70 text-white flex items-center gap-1">
                                            <Youtube className="w-3 h-3" />
                                            {video.duration}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--ifm-color-content)' }}>
                                            {video.title}
                                        </h3>
                                        <p className="text-xs line-clamp-2" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                            {video.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Documentation</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    Featured Articles
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Key documentation for your onboarding journey
                                </p>
                            </div>
                            <Link
                                to="/docs"
                                className="inline-flex items-center gap-1.5 text-[#E8B058] hover:text-[#D4A047] transition-colors text-sm font-medium no-underline group"
                            >
                                Browse All
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {featuredArticles.map((article) => (
                                <Link
                                    key={article.title}
                                    to={article.link}
                                    className="rounded-xl border p-5 transition-all duration-200 hover:scale-[1.02] no-underline group"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                                            background: 'rgba(232,176,88,0.1)',
                                            color: '#E8B058',
                                        }}>
                                            {article.icon}
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                            background: 'rgba(232,176,88,0.1)',
                                            color: '#E8B058',
                                        }}>
                                            {article.category}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-sm mb-1 group-hover:text-[#E8B058] transition-colors" style={{ color: 'var(--ifm-color-content)' }}>
                                        {article.title}
                                    </h3>
                                    <p className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {article.description}
                                    </p>
                                    <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#E8B058]">
                                        Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="mb-16">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <span className={styles.sectionBadge}>Requirements</span>
                                <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--ifm-color-content)' }}>
                                    System Requirements
                                </h2>
                                <p className="mt-1 text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Ensure your system meets these requirements for optimal experience
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {systemRequirements.map((req) => (
                                <div
                                    key={req.name}
                                    className="rounded-xl border p-5"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(232,176,88,0.15)',
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
                                            background: 'rgba(232,176,88,0.1)',
                                            color: '#E8B058',
                                        }}>
                                            {req.icon}
                                        </div>
                                        <h3 className="font-semibold text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                                            {req.name}
                                        </h3>
                                    </div>
                                    <div className="space-y-2 text-xs">
                                        <div>
                                            <span style={{ color: 'var(--ifm-color-content-secondary)' }}>Minimum: </span>
                                            <span style={{ color: 'var(--ifm-color-content)' }}>{req.minimum}</span>
                                        </div>
                                        <div>
                                            <span style={{ color: '#E8B058' }}>Recommended: </span>
                                            <span style={{ color: 'var(--ifm-color-content)' }}>{req.recommended}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="mb-8">
                        <div
                            className="relative overflow-hidden rounded-2xl border p-10"
                            style={{
                                background: 'var(--ifm-background-surface-color)',
                                borderColor: 'var(--ifm-color-emphasis-200)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E8B058]/6 via-transparent to-[#E8B058]/6 pointer-events-none" />
                            <div
                                className="absolute top-0 left-0 right-0 h-[1.5px] pointer-events-none"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, #E8B058 30%, #C89446 50%, #E8B058 70%, transparent 100%)',
                                }}
                            />

                            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--ifm-color-content)' }}>
                                        Ready to continue?
                                    </h2>
                                    <p className="text-base md:text-lg" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        Explore more resources or contact support for help
                                    </p>
                                </div>

                                <div className="flex gap-3 flex-wrap justify-center">
                                    <Link
                                        to="/docs"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#E8B058] hover:bg-[#D4A047] text-black font-semibold rounded-xl transition-all duration-200 no-underline"
                                        style={{ boxShadow: '0 4px 20px rgba(232,176,88,0.25)' }}
                                    >
                                        Browse Docs
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="/docs/support/contact"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border transition-all duration-200 no-underline"
                                        style={{
                                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
                                            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(232,176,88,0.2)',
                                            color: 'var(--ifm-color-content)',
                                        }}
                                    >
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {videoModal && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setVideoModal(null)}
                    >
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <div 
                            className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div>
                                    <h3 className="font-semibold text-white">{videoModal.title}</h3>
                                    <p className="text-xs text-white/60">{videoModal.description}</p>
                                </div>
                                <button
                                    onClick={() => setVideoModal(null)}
                                    className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="aspect-video">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoModal.youtubeId}?autoplay=1&rel=0`}
                                    title={videoModal.title}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    );
}
