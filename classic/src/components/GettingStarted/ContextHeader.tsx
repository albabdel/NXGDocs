import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { getOnboardingPhases } from '../../data/onboardingPhases';
import { useProduct } from '@theme/Root';

export function ContextHeader(): React.JSX.Element {
    const { completedSteps } = useOnboarding();
    const { productName } = useProduct();
    const onboardingPhases = getOnboardingPhases(productName);

    const totalSteps = onboardingPhases.reduce((acc, phase) => {
        return acc + phase.steps.length;
    }, 0);

    const completedCount = completedSteps.length;
    const progressPercent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

    return (
        <div
            className="rounded-xl p-6 mb-8"
            style={{
                backgroundColor: 'var(--ifm-background-surface-color)',
                border: '1px solid var(--ifm-color-emphasis-200)',
            }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-lg font-bold m-0" style={{ color: 'var(--ifm-color-content)' }}>
                        Your Onboarding Progress
                    </h2>
                    <p className="text-sm m-0 mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                        {completedCount} of {totalSteps} steps completed
                    </p>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#E8B058' }}>
                    {progressPercent}%
                </div>
            </div>
            <div
                className="w-full rounded-full h-2"
                style={{ backgroundColor: 'var(--ifm-color-emphasis-200)' }}
            >
                <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                        width: `${progressPercent}%`,
                        backgroundColor: '#E8B058',
                    }}
                />
            </div>
        </div>
    );
}
