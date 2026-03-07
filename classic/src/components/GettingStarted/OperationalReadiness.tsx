import React from 'react';
import { useOnboarding } from './OnboardingContext';
import { systemHealthChecklist } from '../../data/onboardingPhases';
import { SystemHealthStatus } from '../../types/onboarding';

const statusColors: Record<SystemHealthStatus, string> = {
    [SystemHealthStatus.OK]: '#34d399',
    [SystemHealthStatus.WARNING]: '#fbbf24',
    [SystemHealthStatus.BLOCKED]: '#f87171',
};

const statusLabels: Record<SystemHealthStatus, string> = {
    [SystemHealthStatus.OK]: 'OK',
    [SystemHealthStatus.WARNING]: 'Warning',
    [SystemHealthStatus.BLOCKED]: 'Blocked',
};

export function OperationalReadiness(): React.JSX.Element {
    const { completedSteps } = useOnboarding();

    return (
        <div
            className="rounded-xl p-5 mt-6"
            style={{
                backgroundColor: 'var(--ifm-background-surface-color)',
                border: '1px solid var(--ifm-color-emphasis-200)',
            }}
        >
            <h3 className="text-base font-bold mb-4 m-0" style={{ color: 'var(--ifm-color-content)' }}>
                System Readiness
            </h3>
            <div className="space-y-3">
                {systemHealthChecklist.map((item) => {
                    const isLinkedComplete = item.linkedStepId
                        ? completedSteps.includes(item.linkedStepId)
                        : false;
                    const displayStatus = isLinkedComplete
                        ? SystemHealthStatus.OK
                        : item.status;

                    return (
                        <div
                            key={item.id}
                            className="flex items-center justify-between py-2 border-b"
                            style={{ borderColor: 'var(--ifm-color-emphasis-100)' }}
                        >
                            <div>
                                <div className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                                    {item.name}
                                </div>
                                <div className="text-xs" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    {item.lastChecked ?? 'Not checked'}
                                </div>
                            </div>
                            <span
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{
                                    backgroundColor: `${statusColors[displayStatus]}20`,
                                    color: statusColors[displayStatus],
                                }}
                            >
                                {statusLabels[displayStatus]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
