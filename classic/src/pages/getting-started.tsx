/**
 * Getting Started - Guided Onboarding Page
 * Transformed from documentation index to guided operational setup path
 */

import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import LandingPageBackground from '../components/LandingPageBackground';
import { Home, ChevronRight } from 'lucide-react';

// Import onboarding components
import { OnboardingProvider } from '../components/GettingStarted/OnboardingContext';
import { ContextHeader } from '../components/GettingStarted/ContextHeader';
import { RoleModeSelector } from '../components/GettingStarted/RoleModeSelector';
import { PrimaryOnboardingPath } from '../components/GettingStarted/PrimaryOnboardingPath';
import { SideLearningPanel } from '../components/GettingStarted/SideLearningPanel';
import { OperationalReadiness } from '../components/GettingStarted/OperationalReadiness';
import { NextRequiredAction } from '../components/GettingStarted/NextRequiredAction';

function GettingStartedContent() {
    return (
        <>
            {/* Breadcrumbs */}
            <div
                className="backdrop-blur-sm"
                style={{
                    background: 'linear-gradient(to bottom, var(--ifm-background-color) 0%, var(--ifm-background-color) 60%, transparent 100%)',
                    borderBottom: '1px solid rgba(var(--ifm-color-emphasis-300-rgb, 200,200,200), 0.3)'
                }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link
                            to="/"
                            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors no-underline"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                        <span className="text-[#E8B058] font-medium">Getting Started</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
                {/* Page Title */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--ifm-font-color-base)' }}>
                        Getting Started with GCXONE
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--ifm-font-color-secondary)' }}>
                        Your guided path to operational readiness
                    </p>
                </div>

                {/* 5.1 Context Header */}
                <ContextHeader />

                {/* 5.4 Role Mode Selector (Global Filter) */}
                <RoleModeSelector />

                {/* Two Column Layout:Left - Primary Path + Readiness | Right - Learning Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2">
                        {/* 5.2 Primary Onboarding Path */}
                        <div id="onboarding-path">
                            <PrimaryOnboardingPath />
                        </div>

                        {/* 5.5 Operational Readiness */}
                        <OperationalReadiness />
                    </div>

                    {/* Right Column - Side Learning Panel */}
                    <div className="lg:col-span-1">
                        {/* 5.3 Side Learning Panel */}
                        <SideLearningPanel />
                    </div>
                </div>
            </div>

            {/* 5.6 Next Required Action (Sticky) */}
            <NextRequiredAction />
        </>
    );
}

export default function GettingStarted() {
    return (
        <Layout
            title="Getting Started"
            description="Guided onboarding for GCXONE - complete setup path to operational readiness"
        >
            <LandingPageBackground />
            <main className="min-h-screen">
                <OnboardingProvider>
                    <GettingStartedContent />
                </OnboardingProvider>
            </main>
        </Layout>
    );
}
