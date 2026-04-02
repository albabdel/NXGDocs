import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { useOnboarding } from './OnboardingContext';
import { onboardingPhases } from '../../data/onboardingPhases';

export function NextRequiredAction(): React.JSX.Element {
    const { isStepComplete } = useOnboarding();
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return <></>;

    // Find the first incomplete step
    let nextStep: { title: string; link?: string } | null = null;

    for (const phase of onboardingPhases) {
        for (const step of phase.steps) {
            if (!isStepComplete(step.id)) {
                nextStep = {
                    title: step.title,
                    link: step.actionLink,
                };
                break;
            }
        }
        if (nextStep) break;
    }

    if (!nextStep) {
        return (
            <div
                className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
                style={{ backgroundColor: '#E8B058', color: '#000', maxWidth: '400px' }}
            >
                <span className="font-bold text-sm">All steps complete!</span>
                <button onClick={() => setDismissed(true)} className="ml-auto text-black opacity-70 hover:opacity-100" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    ✕
                </button>
            </div>
        );
    }

    return (
        <div
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-4"
            style={{
                backgroundColor: 'var(--ifm-background-surface-color)',
                border: '1px solid #E8B058',
                maxWidth: '480px',
                width: 'calc(100vw - 48px)',
            }}
        >
            <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#E8B058' }}>
                    Next Action
                </div>
                <div className="text-sm font-medium truncate" style={{ color: 'var(--ifm-color-content)' }}>
                    {nextStep.link ? (
                        <Link to={nextStep.link} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {nextStep.title}
                        </Link>
                    ) : nextStep.title}
                </div>
            </div>
            {nextStep.link && (
                <Link
                    to={nextStep.link}
                    className="flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium no-underline"
                    style={{ backgroundColor: '#E8B058', color: '#000' }}
                >
                    Start →
                </Link>
            )}
            <button
                onClick={() => setDismissed(true)}
                className="flex-shrink-0"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ifm-color-content-secondary)' }}
            >
                ✕
            </button>
        </div>
    );
}
