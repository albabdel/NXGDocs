import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserRole, OnboardingState } from '../../types/onboarding';

interface OnboardingContextValue extends OnboardingState {
    setSelectedRole: (role: UserRole) => void;
    toggleStepComplete: (stepId: string) => void;
    setActivePhase: (phaseId: string | undefined) => void;
    setActiveStep: (stepId: string | undefined) => void;
    isStepComplete: (stepId: string) => boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [state, setState] = useState<OnboardingState>({
        selectedRole: UserRole.ADMIN,
        completedSteps: [],
        activePhaseId: undefined,
        activeStepId: undefined,
    });

    const setSelectedRole = useCallback((role: UserRole) => {
        setState(prev => ({ ...prev, selectedRole: role }));
    }, []);

    const toggleStepComplete = useCallback((stepId: string) => {
        setState(prev => {
            const isComplete = prev.completedSteps.includes(stepId);
            return {
                ...prev,
                completedSteps: isComplete
                    ? prev.completedSteps.filter(id => id !== stepId)
                    : [...prev.completedSteps, stepId],
            };
        });
    }, []);

    const setActivePhase = useCallback((phaseId: string | undefined) => {
        setState(prev => ({ ...prev, activePhaseId: phaseId }));
    }, []);

    const setActiveStep = useCallback((stepId: string | undefined) => {
        setState(prev => ({ ...prev, activeStepId: stepId }));
    }, []);

    const isStepComplete = useCallback((stepId: string) => {
        return state.completedSteps.includes(stepId);
    }, [state.completedSteps]);

    return (
        <OnboardingContext.Provider value={{
            ...state,
            setSelectedRole,
            toggleStepComplete,
            setActivePhase,
            setActiveStep,
            isStepComplete,
        }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding(): OnboardingContextValue {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
