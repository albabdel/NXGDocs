import React from 'react';
import Link from '@docusaurus/Link';
import { useOnboarding } from './OnboardingContext';
import { onboardingPhases } from '../../data/onboardingPhases';
import { StepType } from '../../types/onboarding';

export function PrimaryOnboardingPath(): React.JSX.Element {
    const { isStepComplete, toggleStepComplete, activePhaseId, setActivePhase } = useOnboarding();

    return (
        <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--ifm-color-content)' }}>
                Setup Path
            </h2>
            {onboardingPhases.map((phase, phaseIndex) => {
                const isExpanded = activePhaseId === phase.id;
                const phaseCompletedSteps = phase.steps.filter(s => isStepComplete(s.id)).length;
                const phaseTotal = phase.steps.length;
                const allComplete = phaseCompletedSteps === phaseTotal;

                return (
                    <div
                        key={phase.id}
                        className="rounded-xl border overflow-hidden"
                        style={{
                            borderColor: allComplete ? '#E8B058' : 'var(--ifm-color-emphasis-200)',
                            backgroundColor: 'var(--ifm-background-surface-color)',
                        }}
                    >
                        {/* Phase Header */}
                        <button
                            onClick={() => setActivePhase(isExpanded ? undefined : phase.id)}
                            className="w-full text-left p-4 flex items-center justify-between"
                            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{
                                        backgroundColor: allComplete ? '#E8B058' : 'rgba(232, 176, 88, 0.1)',
                                        color: allComplete ? '#000' : '#E8B058',
                                    }}
                                >
                                    {allComplete ? '✓' : phaseIndex + 1}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: 'var(--ifm-color-content)' }}>
                                        {phase.title}
                                    </div>
                                    <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {phaseCompletedSteps}/{phaseTotal} steps
                                    </div>
                                </div>
                            </div>
                            <span style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                {isExpanded ? '▲' : '▼'}
                            </span>
                        </button>

                        {/* Steps */}
                        {isExpanded && (
                            <div className="px-4 pb-4 space-y-2">
                                {phase.steps.map((step) => {
                                    const complete = isStepComplete(step.id);
                                    const title = step.title;

                                    return (
                                        <div
                                            key={step.id}
                                            className="flex items-start gap-3 p-3 rounded-lg"
                                            style={{
                                                backgroundColor: complete
                                                    ? 'rgba(232, 176, 88, 0.05)'
                                                    : 'var(--ifm-color-emphasis-100)',
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleStepComplete(step.id)}
                                                className="flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center mt-0.5"
                                                style={{
                                                    backgroundColor: complete ? '#E8B058' : 'transparent',
                                                    borderColor: complete ? '#E8B058' : 'var(--ifm-color-emphasis-400)',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {complete && (
                                                    <span className="text-black text-xs font-bold">✓</span>
                                                )}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-sm font-medium"
                                                    style={{
                                                        color: complete ? 'var(--ifm-color-content-secondary)' : 'var(--ifm-color-content)',
                                                        textDecoration: complete ? 'line-through' : 'none',
                                                    }}
                                                >
                                                    {step.actionLink ? (
                                                        <Link
                                                            to={step.actionLink}
                                                            style={{ color: 'inherit', textDecoration: 'inherit' }}
                                                        >
                                                            {title}
                                                        </Link>
                                                    ) : title}
                                                </div>
                                                <div className="text-xs mt-0.5" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                                    {step.description}
                                                </div>
                                                <div className="text-xs mt-1 capitalize" style={{ color: '#E8B058', opacity: 0.7 }}>
                                                    {step.type === StepType.CONFIRMATION ? 'Manual confirm' : step.type === StepType.VALIDATION ? 'Validate' : 'Action'}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
