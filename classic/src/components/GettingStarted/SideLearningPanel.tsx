import React from 'react';
import Link from '@docusaurus/Link';
import { useOnboarding } from './OnboardingContext';
import { onboardingPhases } from '../../data/onboardingPhases';

export function SideLearningPanel(): React.JSX.Element {
    const { selectedRole, activePhaseId } = useOnboarding();

    // Find the active phase
    const activePhase = onboardingPhases.find(p => p.id === activePhaseId);
    const stepsWithContent = (activePhase?.steps ?? onboardingPhases[0]?.steps ?? [])
        .filter(s => s.roles?.includes(selectedRole) && s.learningContent);

    const resources = stepsWithContent.slice(0, 3);

    return (
        <div
            className="rounded-xl p-5 sticky top-20"
            style={{
                backgroundColor: 'var(--ifm-background-surface-color)',
                border: '1px solid var(--ifm-color-emphasis-200)',
            }}
        >
            <h3 className="text-base font-bold mb-4 m-0" style={{ color: 'var(--ifm-color-content)' }}>
                Learning Resources
            </h3>

            {resources.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                    Select a phase to see related resources.
                </p>
            ) : (
                <div className="space-y-4">
                    {resources.map((step) => {
                        const content = step.learningContent!;
                        return (
                            <div key={step.id}>
                                {content.videoId && (
                                    <div className="rounded-lg overflow-hidden mb-2 aspect-video">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${content.videoId}`}
                                            title={content.title || step.title}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                )}
                                <div className="text-sm font-medium" style={{ color: 'var(--ifm-color-content)' }}>
                                    {content.title || step.title}
                                </div>
                                {content.description && (
                                    <div className="text-xs mt-1" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                        {content.description}
                                    </div>
                                )}
                                {content.tips && content.tips.length > 0 && (
                                    <ul className="text-xs mt-2 space-y-1 list-none p-0 m-0">
                                        {content.tips.map((tip, i) => (
                                            <li key={i} className="flex items-start gap-1">
                                                <span style={{ color: '#E8B058' }}>•</span>
                                                <span style={{ color: 'var(--ifm-color-content-secondary)' }}>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {step.actionLink && (
                                    <Link
                                        to={step.actionLink}
                                        className="inline-flex items-center gap-1 text-xs mt-2 font-medium no-underline"
                                        style={{ color: '#E8B058' }}
                                    >
                                        Read documentation →
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
